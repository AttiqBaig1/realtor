/**
 * Clean demo links: realtordemos.online/<slug>
 *
 *   /realtor-fresno                 -> generic Fresno, CA demo
 *   /luxury-realtor-houston-tx      -> keyword "Luxury Realtor", Houston, TX
 *   /vance-realty-paso-robles-ca    -> name "Vance Realty", Paso Robles, CA
 *   /fresno-prime-realty-ca?p=5594382200
 *
 * Optional short query keys: p=phone, a=agent, e=email, k=keyword, n=name,
 * s=sales volume, x=experience, w=whatsapp.
 * GitHub Pages serves 404.html (a copy of index.html) for these paths, and the
 * app reads the path on start-up.
 */
import { CITY_DATA } from '../data/cityIndex';
import type { RealtorProfile } from '../types';

export const SITE_ORIGIN = 'https://realtordemos.online';

const STATES = new Set('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY DC AB BC MB NB NL NS NT NU ON PE QC SK YT'.toLowerCase().split(' '));

/** Words that describe the business type, not a business name. */
const GENERIC = new Set([
  'realtor', 'realtors', 'realty', 'real', 'estate', 'agent', 'agents', 'broker', 'brokers', 'brokerage',
  'homes', 'home', 'house', 'houses', 'property', 'properties', 'luxury', 'top', 'best', 'rated', 'star', '5',
  'five', 'professional', 'premier', 'local', 'buyers', 'buyer', 's', 'listing', 'seller', 'sellers', 'team',
  'expert', 'experts', 'specialist', 'in', 'near', 'me', 'the', 'and', 'for', 'demo', 'agency',
]);
const PLAIN_KEYWORDS = new Set(['realtor', 'realtors', 'realty', 'real estate', 'real estate agent', 'homes', 'demo', 'agent']);

// ------------------------------------------------------------- city index
type CityHit = { slug: string; st: string; name: string };
let _idx: Map<string, CityHit[]> | null = null;
const titleCase = (slug: string) => slug.split('-').filter(Boolean).map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
const index = () => {
  if (_idx) return _idx;
  _idx = new Map();
  for (const rec of CITY_DATA.split(';')) {
    const [slug, st, disp] = rec.split(':');
    const hit = { slug, st, name: disp || titleCase(slug) };
    if (slug.startsWith('saint-')) hit.name = hit.name.replace(/^Saint /, 'St. ');
    const list = _idx.get(slug);
    if (list) list.push(hit); else _idx.set(slug, [hit]);
    // "st-louis" should find "saint-louis"
    if (slug.startsWith('saint-')) {
      const alt = 'st-' + slug.slice(6);
      const l2 = _idx.get(alt);
      if (l2) l2.push(hit); else _idx.set(alt, [hit]);
    }
  }
  return _idx;
};
const ALIASES: Record<string, string> = { nyc: 'new-york', 'new-york-city': 'new-york', sf: 'san-francisco', philly: 'philadelphia', vegas: 'las-vegas', dc: 'washington' };
const findCity = (slug: string, st?: string): CityHit | null => {
  const list = index().get(ALIASES[slug] || slug);
  if (!list) return null;
  return st ? list.find(c => c.st.toLowerCase() === st) || null : list[0];
};

export const slugify = (s: string) =>
  s.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/&/g, ' and ').replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const prettyName = (tokens: string[]) =>
  tokens.map((w, i) => {
    if (w === 'and' && i > 0) return '&';
    if (w === 'co') return 'Co.';
    if (w === 'llc' || w === 'pllc') return w.toUpperCase();
    if (w === 'inc') return 'Inc.';
    if (w === 'exp') return 'eXp';
    if (w === 're' || w === 'remax') return w === 're' ? 'RE' : 'RE/MAX';
    if (/^\d/.test(w)) return w;
    return w[0].toUpperCase() + w.slice(1);
  }).join(' ');

// ------------------------------------------------------------- parse
export interface CleanLinkData {
  name?: string; city: string; keyword?: string; phone?: string; agentName?: string;
  email?: string; whatsapp?: string; salesVolume?: string; experienceYears?: string; generic: boolean;
}

/** Turns a path slug (+ optional query) into realtor data, or null for "/" and asset paths. */
export function parseCleanLink(pathname: string, search = ''): CleanLinkData | null {
  const seg = decodeURIComponent(pathname).split('/').filter(Boolean).pop() || '';
  if (!seg || /\.[a-z0-9]{2,5}$/i.test(seg)) return null;
  let tokens = slugify(seg).split('-').filter(Boolean);
  if (!tokens.length) return null;

  // trailing state / province code
  let st: string | undefined;
  if (tokens.length > 1 && STATES.has(tokens[tokens.length - 1])) st = tokens.pop();

  // longest city match at the end, then at the start
  let city: CityHit | null = null;
  let rest = tokens;
  let cityAtStart = false;
  for (let n = Math.min(4, tokens.length); n >= 1 && !city; n--) {
    const hit = findCity(tokens.slice(-n).join('-'), st);
    if (hit) { city = hit; rest = tokens.slice(0, -n); }
  }
  if (!city) {
    for (let n = Math.min(4, tokens.length); n >= 1 && !city; n--) {
      const hit = findCity(tokens.slice(0, n).join('-'), st);
      if (hit) { city = hit; rest = tokens.slice(n); cityAtStart = true; }
    }
  }
  // a lone generic word is never a city ("/realtor" alone)
  if (city && rest.length === 0 && GENERIC.has(tokens[0]) && tokens.length === 1) city = null;

  let cityName: string;
  if (city) {
    cityName = `${city.name}, ${city.st}`;
  } else {
    // unknown place: words after the generic ones are the place
    const firstPlace = tokens.findIndex(t => !GENERIC.has(t));
    if (firstPlace < 0) return null;
    rest = tokens.slice(0, firstPlace);
    cityName = titleCase(tokens.slice(firstPlace).join('-')) + (st ? `, ${st.toUpperCase()}` : '');
  }

  const generic = rest.every(t => GENERIC.has(t));
  const out: CleanLinkData = { city: cityName, generic };
  if (rest.length) {
    if (generic) {
      const kw = rest.join(' ');
      if (!PLAIN_KEYWORDS.has(kw)) out.keyword = titleCase(rest.join('-')).replace(/\bReal Estate\b/, 'Real Estate');
    } else {
      // the city is part of the business name when the slug starts with it
      out.name = prettyName(cityAtStart && city ? [...city.slug.split('-'), ...rest] : rest);
    }
  }

  const q = new URLSearchParams(search);
  const get = (k: string) => (q.get(k) || '').trim() || undefined;
  if (get('n')) out.name = get('n');
  if (get('k')) out.keyword = get('k');
  out.phone = get('p');
  out.agentName = get('a');
  out.email = get('e');
  out.whatsapp = get('w');
  out.salesVolume = get('s');
  out.experienceYears = get('x');
  return out;
}

const fmtPhone = (p: string) => {
  const d = p.replace(/\D/g, '');
  if (d.length === 10) return `+1 (${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  if (d.length === 11 && d[0] === '1') return `+1 (${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7)}`;
  return p;
};

/** Merges clean-link data into a full profile. */
export function profileFromCleanLink(d: CleanLinkData, base: RealtorProfile): RealtorProfile {
  const cityShort = d.city.split(',')[0].trim();
  const name = d.name || `${cityShort} Premier Realty`;
  const phone = d.phone ? fmtPhone(d.phone) : base.phone;
  return {
    ...base,
    name,
    agentName: d.agentName || name,
    city: d.city,
    address: `Prime Business District, ${d.city}`,
    phone,
    email: d.email || `info@${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
    whatsapp: (d.whatsapp || (d.phone ? phone : base.whatsapp)).replace(/[^0-9+]/g, ''),
    primaryKeyword: d.keyword || base.primaryKeyword,
    salesVolume: d.salesVolume || base.salesVolume,
    experienceYears: d.experienceYears || base.experienceYears,
    title: `${d.keyword || 'Real Estate Advisor'} · ${cityShort}`,
    bio: `${d.agentName || name} helps buyers and sellers across ${cityShort} with honest pricing advice, strong marketing and a smooth closing.`,
    isCustomDemo: true,
  };
}

// ------------------------------------------------------------- build
export interface CleanLinkInput {
  name?: string; city?: string; address?: string; phone?: string; keyword?: string;
  agentName?: string; email?: string; whatsapp?: string; salesVolume?: string; experienceYears?: string;
}

/** "Fresno, CA" from a city field or a full address (street ignored). */
export function cityFromText(city?: string, address?: string): { city: string; st?: string } {
  const parts = [city, address].filter(Boolean).join(', ').split(',').map(s => s.trim()).filter(Boolean);
  for (let i = parts.length - 1; i >= 0; i--) {
    const m = parts[i].match(/^([A-Za-z]{2})(\s+[A-Z0-9][A-Z0-9 -]{2,8})?$/);
    if (m && STATES.has(m[1].toLowerCase()) && i > 0) {
      const c = parts[i - 1].replace(/^\d+\s.*?\s(?=[A-Z][a-z]+$)/, '');
      if (!/\d/.test(c)) return { city: c, st: m[1].toUpperCase() };
    }
  }
  // "Fresno" or "Fresno CA" or "Paso Robles"
  const lone = (city || parts[parts.length - 1] || '').trim();
  const m2 = lone.match(/^(.*?)[\s,]+([A-Za-z]{2})$/);
  if (m2 && STATES.has(m2[2].toLowerCase())) return { city: m2[1], st: m2[2].toUpperCase() };
  const hit = findCity(slugify(lone));
  return hit ? { city: hit.name, st: hit.st } : { city: lone };
}

/** Builds the short path + query for a realtor. Keeps only what is needed. */
export function buildCleanLink(inp: CleanLinkInput, origin = SITE_ORIGIN): string {
  const { city, st } = cityFromText(inp.city, inp.address);
  const citySlug = slugify(city);
  const nameSlug = slugify(inp.name || '');
  let slug: string;
  if (!nameSlug) slug = `realtor-${citySlug}`;
  else if (nameSlug.startsWith(citySlug + '-')) slug = nameSlug;            // "Fresno Prime Realty"
  else slug = `${nameSlug}-${citySlug}`;
  // add the state only when the city is ambiguous or unknown
  if (st) {
    const first = findCity(citySlug);
    if (!first || first.st !== st) slug += `-${st.toLowerCase()}`;
  }

  const q = new URLSearchParams();
  // keep the exact name when the slug cannot reproduce it
  const parsed = parseCleanLink('/' + slug);
  if (inp.name && parsed && (parsed.name || '').toLowerCase() !== inp.name.trim().toLowerCase()) {
    const loose = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (loose(parsed.name || '') !== loose(inp.name)) q.set('n', inp.name.trim());
  }
  if (inp.phone) { const d = inp.phone.replace(/\D/g, ''); q.set('p', d.length === 11 && d[0] === '1' ? d.slice(1) : d); }
  if (inp.keyword && !/^top-rated 5-star professional realtor$/i.test(inp.keyword.trim())) q.set('k', inp.keyword.trim());
  if (inp.agentName && inp.agentName.trim() !== (inp.name || '').trim()) q.set('a', inp.agentName.trim());
  if (inp.email) q.set('e', inp.email.trim());
  if (inp.whatsapp && inp.whatsapp.replace(/\D/g, '') !== (inp.phone || '').replace(/\D/g, '')) q.set('w', inp.whatsapp.replace(/[^\d+]/g, ''));
  if (inp.salesVolume) q.set('s', inp.salesVolume.trim());
  if (inp.experienceYears) q.set('x', inp.experienceYears.trim());
  const qs = q.toString();
  return `${origin.replace(/\/$/, '')}/${slug}${qs ? '?' + qs : ''}`;
}

/** Turns free text like "realtor fresno" or "luxury realtor houston tx" into a link. */
export const quickLink = (text: string, origin = SITE_ORIGIN) => {
  const slug = slugify(text);
  return slug ? `${origin.replace(/\/$/, '')}/${slug}` : '';
};

/** Origin to put in generated links: the custom domain unless running locally. */
export const linkOrigin = () => {
  if (typeof window === 'undefined') return SITE_ORIGIN;
  const h = window.location.hostname;
  return h === 'localhost' || h === '127.0.0.1' ? window.location.origin : SITE_ORIGIN;
};
