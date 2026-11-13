/**
 * Short links for demo URLs.
 *
 * Order of attempts:
 *   1. TinyURL's public API (works only where the browser allows the request)
 *   2. is.gd via JSONP — loads as a <script>, so browser CORS rules don't block it
 *   3. otherwise the full demo link is returned unchanged
 *
 * A short link is only ever shown if a real shortening service created it.
 * (Older versions invented "tinyurl.com/realtor-xxxx" links when both services
 * failed; those never resolved, and any still in the cache are discarded.)
 */

const CACHE_KEY = 'aura_tinyurl_cache';
const FAKE_PREFIX = 'https://tinyurl.com/realtor-';

const getCache = (): Record<string, string> => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    const map: Record<string, string> = cached ? JSON.parse(cached) : {};
    let dirty = false;
    for (const k of Object.keys(map)) {
      if (!map[k] || map[k].startsWith(FAKE_PREFIX)) { delete map[k]; dirty = true; }
    }
    if (dirty) localStorage.setItem(CACHE_KEY, JSON.stringify(map));
    return map;
  } catch (e) {
    return {};
  }
};

const saveToCache = (longUrl: string, shortUrl: string) => {
  try {
    const cache = getCache();
    cache[longUrl] = shortUrl;
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    // storage full or unavailable — caching is only a convenience
  }
};

const isRealShort = (s: string | null | undefined): s is string =>
  !!s && /^https?:\/\/(tinyurl\.com|is\.gd)\/[A-Za-z0-9_-]+$/.test(s.trim()) && !s.startsWith(FAKE_PREFIX);

async function viaTinyUrl(longUrl: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!response.ok) return null;
    const text = (await response.text()).trim();
    return isRealShort(text) ? text : null;
  } catch {
    return null; // usually the browser blocking a cross-origin response
  }
}

let jsonpSeq = 0;
function viaIsGd(longUrl: string): Promise<string | null> {
  return new Promise(resolve => {
    const cb = `__isgd_cb_${Date.now()}_${jsonpSeq++}`;
    const script = document.createElement('script');
    const w = window as unknown as Record<string, unknown>;
    let done = false;
    const finish = (value: string | null) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      try { delete w[cb]; } catch { w[cb] = undefined; }
      script.remove();
      resolve(value);
    };
    const timer = setTimeout(() => finish(null), 6000);
    w[cb] = (data: { shorturl?: string; errorcode?: number }) => finish(isRealShort(data?.shorturl) ? data.shorturl! : null);
    script.onerror = () => finish(null);
    script.src = `https://is.gd/create.php?format=json&callback=${cb}&url=${encodeURIComponent(longUrl)}`;
    document.head.appendChild(script);
  });
}

/**
 * Returns a real short link, or the original URL if no service could make one.
 */
export const shortenWithTinyUrl = async (longUrl: string): Promise<string> => {
  if (!longUrl) return '';
  const cached = getCache()[longUrl];
  if (isRealShort(cached)) return cached;

  const short = (await viaTinyUrl(longUrl)) || (await viaIsGd(longUrl));
  if (short) {
    saveToCache(longUrl, short);
    return short;
  }
  return longUrl;
};

/** True when `value` is a short link (not the full demo URL). */
export const isShortened = (value: string | undefined, longUrl: string | undefined) =>
  !!value && value !== longUrl && isRealShort(value);

/**
 * Batch shorten URLs with progress tracking; is.gd allows a few hundred an
 * hour, so requests are spaced out a little.
 */
export const batchShortenUrls = async (
  urls: Array<{ id: string; url: string }>,
  onProgress?: (completed: number, total: number, currentItem?: { id: string; shortUrl: string }) => void
): Promise<Record<string, string>> => {
  const results: Record<string, string> = {};
  const total = urls.length;
  let completed = 0;

  for (const item of urls) {
    let short = item.url;
    try {
      short = await shortenWithTinyUrl(item.url);
    } catch {
      short = item.url;
    }
    results[item.id] = short;
    completed++;
    onProgress?.(completed, total, { id: item.id, shortUrl: short });
    await new Promise(res => setTimeout(res, 250));
  }

  return results;
};
