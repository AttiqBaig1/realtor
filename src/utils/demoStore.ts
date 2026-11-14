/**
 * Short demo links: realtordemos.online/tania-ariosa
 *
 * The full demo is still described by a "long" clean path
 * (/5-star-realtor-tania-ariosa-lehigh-acres-7867865837). The short name points
 * to that long path through two free services that need no account:
 *   1. textdb.online  key  rd_<slug>  -> the long path (can be updated on Edit)
 *   2. v.gd           name r_<slug>   -> https://realtordemos.online<long path> (backup)
 * On start-up main.tsx asks textdb first, then v.gd, and the app reads the
 * long path as if it were in the address bar.
 */
import { slugify } from './cleanLink';

const KEY_MAX = 30;                  // v.gd custom name limit
export const SHORT_MAX = KEY_MAX - 2; // "r_" prefix
const tdbKey = (slug: string) => 'rd_' + slug.replace(/-/g, '_');
const vgdKey = (slug: string) => 'r_' + slug.replace(/-/g, '_');
const TDB_READ = 'https://textdb.online/';
const TDB_WRITE = 'https://api.textdb.online/update/';
const SITE = 'https://realtordemos.online';

const withTimeout = <T,>(p: Promise<T>, ms: number, fallback: T) =>
  Promise.race([p, new Promise<T>(r => setTimeout(() => r(fallback), ms))]);

const jsonp = (url: string, timeout = 6000): Promise<any> => new Promise(resolve => {
  const cb = 'rd' + Math.random().toString(36).slice(2);
  const s = document.createElement('script');
  let fin = false;
  const done = (v: any) => { if (fin) return; fin = true; try { delete (window as any)[cb]; } catch { /* */ } s.remove(); resolve(v); };
  (window as any)[cb] = done;
  s.src = `${url}&callback=${cb}`;
  s.onerror = () => done({ errorcode: -1 });
  document.head.appendChild(s);
  setTimeout(() => done({ errorcode: -2 }), timeout);
});

const GENERIC = new Set(['realtor', 'realtors', 'pa', 'llc', 'inc', 'the']);

/** "Tania Ariosa Realtor" -> "tania-ariosa" (max 28 chars, cut at a word). */
export function shortSlugFor(name: string): string {
  let t = slugify(name).split('-').filter(Boolean);
  const kept = t.filter(w => !GENERIC.has(w));
  if (kept.length) t = kept;
  let s = t.join('-') || 'realtor';
  const max = SHORT_MAX - 3; // room for "-2"
  if (s.length > max) { s = s.slice(0, max); if (s.includes('-')) s = s.slice(0, s.lastIndexOf('-')); }
  return s;
}

const normPath = (p: string) => '/' + p.replace(/^https?:\/\/[^/]+/i, '').replace(/^\/+/, '').split(/[?#]/)[0];

async function readTextDb(slug: string): Promise<string | null> {
  try {
    const r = await withTimeout(fetch(`${TDB_READ}${tdbKey(slug)}?t=${Date.now()}`, { cache: 'no-store' }), 3500, null as any);
    if (!r || !r.ok) return null;
    const t = (await r.text()).trim();
    return t.startsWith('/') ? normPath(t) : null;
  } catch { return null; }
}
async function readVgd(slug: string): Promise<string | null> {
  const r = await jsonp(`https://v.gd/forward.php?format=json&shorturl=${vgdKey(slug)}`, 4000);
  return r && typeof r.url === 'string' ? normPath(r.url.replace(/&amp;/g, '&')) : null;
}

/** Long path saved for a short name, or null. */
export async function lookupShort(slug: string): Promise<string | null> {
  const s = slugify(slug);
  if (!s || s.length > SHORT_MAX) return null;
  return (await readTextDb(s)) || (await readVgd(s));
}

async function writeTextDb(slug: string, longPath: string): Promise<boolean> {
  try {
    const r = await withTimeout(fetch(`${TDB_WRITE}?key=${tdbKey(slug)}&value=${encodeURIComponent(longPath)}`), 8000, null as any);
    if (!r || !r.ok) return false;
    const j = await r.json().catch(() => null);
    return !!(j && j.status === 1);
  } catch { return false; }
}
async function createVgd(slug: string, longPath: string): Promise<'ok' | 'taken' | 'down'> {
  const r = await jsonp(`https://v.gd/create.php?format=json&url=${encodeURIComponent(SITE + longPath)}&shorturl=${vgdKey(slug)}`, 8000);
  if (r && r.shorturl) return 'ok';
  if (r && r.errorcode === 2) return 'taken';
  return 'down';
}

export type ShortResult = { ok: true; slug: string } | { ok: false; error: string };

/**
 * Saves a demo under a short name.
 * - keepSlug: the short name this demo already has (Edit) -> updated in place.
 * - a name used by a different demo -> "-2", "-3" ...
 * - the same demo again -> same short name.
 */
export async function saveShort(name: string, longPathOrUrl: string, keepSlug?: string): Promise<ShortResult> {
  const longPath = normPath(longPathOrUrl);
  if (keepSlug) {
    const ok = await writeTextDb(keepSlug, longPath);
    if (ok) return { ok: true, slug: keepSlug };
  }
  const base = shortSlugFor(name);
  for (let i = 1; i <= 30; i++) {
    const slug = i === 1 ? base : `${base}-${i}`;
    const existing = await lookupShort(slug);
    if (existing) {
      if (existing === longPath) return { ok: true, slug };
      continue;
    }
    const [tdb, vgd] = await Promise.all([writeTextDb(slug, longPath), createVgd(slug, longPath)]);
    if (vgd === 'taken' && !tdb) continue;
    if (tdb || vgd === 'ok') return { ok: true, slug };
    return { ok: false, error: 'Internet ya save service se rabta nahi ho saka. Dobara try karein.' };
  }
  return { ok: false, error: 'Is naam ke bohat saare link pehle se hain.' };
}
