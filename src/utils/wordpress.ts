/**
 * Minimal WordPress REST API client (Application Passwords).
 * Same approach as the landing page engine: the browser talks to the
 * WordPress site directly; credentials stay in this browser only.
 */

export interface WpCreds { url: string; user: string; pass: string }
export interface WpConn { base: string; auth: string; mode: 'pretty' | 'plain'; userName: string }

const LS_KEY = 'aura_wp_creds';

export const loadSavedCreds = (): WpCreds | null => {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || 'null'); } catch { return null; }
};
export const saveCreds = (c: WpCreds | null) => {
  try { if (c) localStorage.setItem(LS_KEY, JSON.stringify(c)); else localStorage.removeItem(LS_KEY); } catch { /* ignore */ }
};

const endpoint = (c: Pick<WpConn, 'base' | 'mode'>, path: string, query?: Record<string, string>) => {
  const q = query ? new URLSearchParams(query).toString() : '';
  return c.mode === 'pretty'
    ? `${c.base}/wp-json/${path}${q ? '?' + q : ''}`
    : `${c.base}/?rest_route=/${path}${q ? '&' + q : ''}`;
};

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

/**
 * Shared hosting often answers 502/503/504/429 ("PHP worker exited", "too many
 * requests") when several pages are published back to back. Those are
 * temporary, so wait and try again (up to 3 tries) instead of failing.
 */
async function call(c: Pick<WpConn, 'base' | 'mode' | 'auth'>, path: string, init: RequestInit = {}, query?: Record<string, string>) {
  let lastErr: unknown = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt) await sleep(3000 * attempt);
    try {
      const r = await fetch(endpoint(c, path, query), {
        ...init,
        headers: { Authorization: c.auth, 'Content-Type': 'application/json', ...(init.headers || {}) },
      });
      if ([429, 502, 503, 504].includes(r.status) && attempt < 2) continue;
      let body: any = null;
      try { body = await r.json(); } catch { /* not JSON */ }
      return { r, body };
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error('network error');
}

/** Pause between pages in bulk publishing so shared hosting isn't overwhelmed. */
export const PUBLISH_GAP_MS = 1500;
export const pause = sleep;

export function explainWpError(err: unknown, status?: number, body?: any): string {
  if (err) return "Couldn't reach the site. Check the URL (with https://), or a security plugin/host may be blocking the REST API.";
  if (status === 401 || status === 403) return `HTTP ${status}: wrong username or Application Password (the normal login password doesn't work here).`;
  if (status === 404) return 'HTTP 404: WordPress REST API not found at this URL.';
  if (status && [429, 502, 503, 504].includes(status)) return `HTTP ${status}: the WordPress server is busy or temporarily down (hosting limit). Wait a minute and publish again.`;
  return `HTTP ${status}: ${(body && body.message) || 'WordPress error'}`;
}

export async function connectWp(creds: WpCreds): Promise<{ ok: true; conn: WpConn } | { ok: false; error: string }> {
  const raw = creds.url.trim().replace(/\/+$/, '');
  const base = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  const auth = 'Basic ' + btoa(unescape(encodeURIComponent(`${creds.user.trim()}:${creds.pass.trim()}`)));
  let last: { err?: unknown; status?: number; body?: any } = {};
  for (const mode of ['pretty', 'plain'] as const) {
    try {
      const { r, body } = await call({ base, mode, auth }, 'wp/v2/users/me', {}, { context: 'edit' });
      if (r.ok) return { ok: true, conn: { base, auth, mode, userName: body?.name || creds.user } };
      last = { status: r.status, body };
      if (r.status === 401 || r.status === 403) break;
    } catch (e) {
      last = { err: e };
    }
  }
  return { ok: false, error: explainWpError(last.err, last.status, last.body) };
}

async function slugTaken(c: WpConn, slug: string): Promise<boolean> {
  try {
    const { r, body } = await call(c, 'wp/v2/pages', {}, { slug, status: 'publish,draft,pending,private,future', _fields: 'id' });
    return r.ok && Array.isArray(body) && body.length > 0;
  } catch { return false; }
}

/** Creates a new page; if the slug exists, a short suffix keeps every page unique. */
export async function publishPage(
  c: WpConn,
  page: { title: string; slug: string; content: string; excerpt?: string },
  status: 'publish' | 'draft' = 'publish'
): Promise<{ ok: true; link: string } | { ok: false; error: string }> {
  try {
    let slug = page.slug;
    if (await slugTaken(c, slug)) {
      for (let i = 0; i < 8; i++) {
        const cand = `${page.slug}-${Math.random().toString(16).slice(2, 6)}`;
        if (!(await slugTaken(c, cand))) { slug = cand; break; }
      }
    }
    const { r, body } = await call(c, 'wp/v2/pages', {
      method: 'POST',
      body: JSON.stringify({ title: page.title, slug, status, content: page.content, excerpt: page.excerpt || '' }),
    });
    if ((r.status === 200 || r.status === 201) && body) return { ok: true, link: body.link || '' };
    return { ok: false, error: explainWpError(null, r.status, body) };
  } catch (e) {
    return { ok: false, error: explainWpError(e) };
  }
}
