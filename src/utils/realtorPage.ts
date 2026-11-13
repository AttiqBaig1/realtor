/**
 * Builds a complete, self-contained realtor landing page for WordPress.
 *
 * - Everything is scoped under `.rlp`, so the WordPress theme can't restyle it
 *   and it can't restyle the theme.
 * - Only facts we were given are shown (experience / sales volume only when
 *   supplied). No invented ratings, no stock photo pretending to be the agent:
 *   the agent card uses their initials.
 * - Contact works without a server: call, WhatsApp, email buttons and a
 *   Google Map of the office address.
 * - SEO: keyword + city H1, title, meta description, RealEstateAgent and
 *   FAQPage JSON-LD with the agent's NAP.
 */

export interface RealtorPageInput {
  name: string;          // business / brokerage name
  agentName?: string;
  city?: string;         // "Fresno, CA"
  address?: string;      // full office address (optional)
  phone: string;
  email?: string;
  whatsapp?: string;
  keyword?: string;      // "5-Star Professional Realtor"
  salesVolume?: string;  // "$290M+"
  experienceYears?: string; // "15+ Years"
}

export interface RealtorPage {
  title: string;
  slug: string;
  excerpt: string;
  city: string;
  wpContent: string;     // Gutenberg custom-HTML block
  standaloneHtml: string; // full document for preview / download
}

const US_CA = new Set('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY DC AB BC MB NB NL NS NT NU ON PE QC SK YT'.split(' '));

const esc = (s: string = '') =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const slugify = (s: string) =>
  s.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);

/** "Fresno, CA" from a city field and/or a full address; the street is never used. */
export function resolveCity(city?: string, address?: string): string {
  const clean = (city || '').trim();
  if (clean && /,\s*[A-Za-z]{2}\b/.test(clean)) return clean.replace(/\s+\d{5}(-\d{4})?$/, '').trim();
  const src = (address || '').split(',').map(p => p.trim()).filter(Boolean);
  // ... , City, ST 12345  ->  City, ST
  for (let i = src.length - 1; i > 0; i--) {
    const m = src[i].match(/^([A-Za-z]{2})\b/);
    if (m && US_CA.has(m[1].toUpperCase())) {
      const cityPart = src[i - 1].replace(/^\d+.*?\s(?=[A-Z][a-z])/, '');
      if (!/\d/.test(cityPart)) return `${cityPart}, ${m[1].toUpperCase()}`;
    }
  }
  return clean || (src.length >= 2 ? src[src.length - 2] : src[0] || '');
}

const digits = (s = '') => s.replace(/[^\d+]/g, '');
const telHref = (p: string) => {
  const d = p.replace(/\D/g, '');
  return d.length === 10 ? `+1${d}` : d.length === 11 && d.startsWith('1') ? `+${d}` : `+${d}`;
};
const initials = (s: string) =>
  s.split(/\s+/).filter(w => /^[A-Za-z]/.test(w) && !/^(and|of|the|&)$/i.test(w)).slice(0, 2).map(w => w[0].toUpperCase()).join('') || 'RE';

const IMG = {
  hero: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=75',
  single: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=70',
  luxury: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=900&q=70',
  condo: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=70',
  invest: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=900&q=70',
};

const ICON: Record<string, string> = {
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
  chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
  home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  tag: '<path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><circle cx="7" cy="7" r="1.5"/>',
  chart: '<path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 6-6"/>',
  key: '<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6M15.5 7.5l3 3L22 7l-3-3"/>',
  truck: '<path d="M10 17h4V5H2v12h3"/><path d="M14 9h4l4 4v4h-2"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>',
  building: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
  star: '<path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  arrow: '<path d="M5 12h14M13 5l7 7-7 7"/>',
};
const ico = (name: string, size = 20, extra = '') =>
  `<svg class="rlp-ico ${extra}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[name]}</svg>`;

const CSS = `
.rlp{--bg:#0b0f19;--panel:#111827;--panel2:#162033;--line:rgba(212,175,55,.18);--gold:#d4af37;--gold2:#f3d675;--ink:#f8fafc;--muted:#a3adc2;
  background:var(--bg);color:var(--ink);font-family:'Inter',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;font-size:16px;line-height:1.65;overflow:hidden;-webkit-font-smoothing:antialiased}
.rlp *,.rlp *::before,.rlp *::after{box-sizing:border-box}
.rlp a{color:inherit;text-decoration:none!important;box-shadow:none}
.rlp img{max-width:100%;display:block}
.rlp p{margin:0}
.rlp .rlp-wrap{max-width:1180px;margin:0 auto;padding:0 24px}
.rlp .rlp-serif{font-family:'Playfair Display',Georgia,serif!important;letter-spacing:-.01em}
.rlp .rlp-ico{flex-shrink:0;display:inline-block;vertical-align:middle}
.rlp .rlp-eyebrow{display:inline-flex;align-items:center;gap:8px;font-size:12px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--gold);border:1px solid var(--line);background:rgba(212,175,55,.06);padding:7px 14px;border-radius:999px}
.rlp .rlp-h2{font-family:'Playfair Display',Georgia,serif!important;font-size:clamp(30px,4vw,46px)!important;line-height:1.1!important;font-weight:700!important;color:var(--ink)!important;margin:16px 0 14px!important;text-wrap:balance;border:0!important;padding:0!important}
.rlp .rlp-h2 em{font-style:normal;color:var(--gold)}
.rlp .rlp-lead{color:var(--muted);max-width:640px}
.rlp .rlp-center{text-align:center}.rlp .rlp-center .rlp-lead{margin:0 auto}
.rlp .rlp-sec{padding:96px 0;position:relative}
.rlp .rlp-btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;padding:15px 24px;border-radius:12px;font-weight:700;font-size:15px;transition:transform .2s,box-shadow .2s,background .2s;cursor:pointer;border:1px solid transparent}
.rlp .rlp-btn:hover{transform:translateY(-2px)}
.rlp .rlp-btn-gold{background:linear-gradient(135deg,var(--gold2),var(--gold));color:#111!important;box-shadow:0 14px 34px -14px rgba(212,175,55,.8)}
.rlp .rlp-btn-wa{background:#16a34a;color:#fff!important;box-shadow:0 14px 34px -16px rgba(22,163,74,.9)}
.rlp .rlp-btn-ghost{border-color:rgba(255,255,255,.18);color:#fff!important;background:rgba(255,255,255,.04)}

/* top bar */
.rlp .rlp-top{border-bottom:1px solid var(--line);background:rgba(11,15,25,.9)}
.rlp .rlp-top .rlp-wrap{display:flex;align-items:center;justify-content:space-between;gap:16px;padding-top:14px;padding-bottom:14px}
.rlp .rlp-brand{display:flex;align-items:center;gap:12px;min-width:0}
.rlp .rlp-mono{width:44px;height:44px;border-radius:12px;display:grid;place-items:center;background:linear-gradient(135deg,var(--gold2),var(--gold));color:#111;font-weight:800;font-family:'Playfair Display',Georgia,serif;font-size:18px;flex-shrink:0}
.rlp .rlp-brand b{display:block;font-size:16px;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:46vw}
.rlp .rlp-brand small{display:block;color:var(--gold);font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-weight:600}
.rlp .rlp-top-call{display:inline-flex;align-items:center;gap:8px;font-weight:700;color:var(--gold2)!important;white-space:nowrap}

/* hero */
.rlp .rlp-hero{position:relative;padding:110px 0 90px;background:linear-gradient(100deg,rgba(11,15,25,.97) 0%,rgba(11,15,25,.88) 45%,rgba(11,15,25,.55) 100%),url('${IMG.hero}') center/cover no-repeat}
.rlp .rlp-hero-grid{display:grid;gap:48px;align-items:center}
@media(min-width:980px){.rlp .rlp-hero-grid{grid-template-columns:1.35fr 1fr}}
.rlp .rlp-h1{font-family:'Playfair Display',Georgia,serif!important;font-size:clamp(38px,6vw,68px)!important;line-height:1.04!important;font-weight:700!important;color:#fff!important;margin:22px 0 20px!important;text-wrap:balance;border:0!important;padding:0!important}
.rlp .rlp-h1 em{font-style:normal;background:linear-gradient(90deg,var(--gold2),var(--gold));-webkit-background-clip:text;background-clip:text;color:transparent}
.rlp .rlp-hero p.rlp-sub{font-size:18px;color:#cbd5e1;max-width:600px}
.rlp .rlp-cta{display:flex;flex-wrap:wrap;gap:12px;margin-top:30px}
.rlp .rlp-chips{display:flex;flex-wrap:wrap;gap:10px 22px;margin-top:28px;color:#cbd5e1;font-size:14px}
.rlp .rlp-chips span{display:inline-flex;align-items:center;gap:8px}
.rlp .rlp-chips .rlp-ico{color:var(--gold)}
.rlp .rlp-agent{border:1px solid var(--line);background:linear-gradient(160deg,rgba(22,32,51,.92),rgba(17,24,39,.85));border-radius:24px;padding:30px;backdrop-filter:blur(8px);box-shadow:0 40px 80px -40px rgba(0,0,0,.8)}
.rlp .rlp-agent-head{display:flex;align-items:center;gap:16px}
.rlp .rlp-agent .rlp-mono{width:72px;height:72px;border-radius:20px;font-size:28px}
.rlp .rlp-agent h3{margin:0!important;font-size:22px!important;color:#fff!important;font-family:'Playfair Display',Georgia,serif!important;line-height:1.2!important}
.rlp .rlp-agent-role{color:var(--gold);font-size:13px;font-weight:600}
.rlp .rlp-agent ul{list-style:none!important;margin:22px 0 0!important;padding:0!important;display:grid;gap:12px}
.rlp .rlp-agent li{display:flex;gap:12px;align-items:flex-start;color:#e2e8f0;font-size:15px;margin:0!important;padding:0!important}
.rlp .rlp-agent li .rlp-ico{color:var(--gold);margin-top:3px}
.rlp .rlp-agent .rlp-btn{width:100%;margin-top:22px}

/* stats */
.rlp .rlp-stats{display:grid;grid-template-columns:repeat(2,1fr);gap:1px;background:var(--line);border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
@media(min-width:820px){.rlp .rlp-stats{grid-template-columns:repeat(4,1fr)}}
.rlp .rlp-stat{background:var(--bg);padding:34px 20px;text-align:center}
.rlp .rlp-stat b{display:block;font-family:'Playfair Display',Georgia,serif;font-size:36px;line-height:1;color:var(--gold2)}
.rlp .rlp-stat span{display:block;margin-top:10px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);font-weight:600}

/* services */
.rlp .rlp-grid3{display:grid;gap:18px;margin-top:48px}
@media(min-width:700px){.rlp .rlp-grid3{grid-template-columns:repeat(2,1fr)}}
@media(min-width:1024px){.rlp .rlp-grid3{grid-template-columns:repeat(3,1fr)}}
.rlp .rlp-card{border:1px solid rgba(255,255,255,.07);background:linear-gradient(170deg,var(--panel2),var(--panel));border-radius:20px;padding:28px;transition:transform .25s,border-color .25s}
.rlp .rlp-card:hover{transform:translateY(-4px);border-color:var(--line)}
.rlp .rlp-card-ico{width:50px;height:50px;border-radius:14px;display:grid;place-items:center;background:rgba(212,175,55,.1);color:var(--gold);border:1px solid var(--line);margin-bottom:18px}
.rlp .rlp-card h3{font-size:19px!important;color:#fff!important;margin:0 0 8px!important;font-family:'Inter',system-ui,sans-serif!important;font-weight:700!important;line-height:1.3!important}
.rlp .rlp-card p{color:var(--muted);font-size:15px}

/* property types */
.rlp .rlp-types{display:grid;gap:16px;margin-top:48px}
@media(min-width:700px){.rlp .rlp-types{grid-template-columns:repeat(2,1fr)}}
@media(min-width:1024px){.rlp .rlp-types{grid-template-columns:repeat(4,1fr)}}
.rlp .rlp-type{position:relative;border-radius:20px;overflow:hidden;min-height:300px;display:flex;align-items:flex-end;padding:22px;border:1px solid rgba(255,255,255,.08);background-size:cover;background-position:center}
.rlp .rlp-type::before{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(11,15,25,0) 25%,rgba(11,15,25,.92) 100%);transition:background .3s}
.rlp .rlp-type:hover::before{background:linear-gradient(180deg,rgba(11,15,25,.1) 0%,rgba(11,15,25,.95) 100%)}
.rlp .rlp-type div{position:relative}
.rlp .rlp-type h3{font-family:'Playfair Display',Georgia,serif!important;font-size:22px!important;color:#fff!important;margin:0 0 4px!important;line-height:1.2!important}
.rlp .rlp-type p{color:#cbd5e1;font-size:14px}

/* process */
.rlp .rlp-alt{background:linear-gradient(180deg,#0e1424,#0b0f19)}
.rlp .rlp-two{display:grid;gap:48px;align-items:center}
@media(min-width:980px){.rlp .rlp-two{grid-template-columns:1fr 1fr}}
.rlp .rlp-steps{display:grid;gap:14px}
.rlp .rlp-step{display:flex;gap:18px;align-items:flex-start;padding:20px 22px;border-radius:18px;border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.02)}
.rlp .rlp-step b.rlp-n{width:42px;height:42px;border-radius:12px;display:grid;place-items:center;flex-shrink:0;font-family:'Playfair Display',Georgia,serif;font-size:18px;color:#111;background:linear-gradient(135deg,var(--gold2),var(--gold))}
.rlp .rlp-step h3{font-size:17px!important;color:#fff!important;margin:2px 0 4px!important;font-family:'Inter',system-ui,sans-serif!important;font-weight:700!important;line-height:1.3!important}
.rlp .rlp-step p{color:var(--muted);font-size:15px}
.rlp .rlp-ticks{list-style:none!important;margin:24px 0 0!important;padding:0!important;display:grid;gap:12px}
.rlp .rlp-ticks li{display:flex;gap:12px;color:#e2e8f0;margin:0!important;padding:0!important}
.rlp .rlp-ticks .rlp-ico{color:var(--gold);margin-top:4px}

/* reviews */
.rlp .rlp-review{border:1px solid rgba(255,255,255,.07);background:linear-gradient(170deg,var(--panel2),var(--panel));border-radius:20px;padding:28px;display:flex;flex-direction:column;gap:16px}
.rlp .rlp-stars{display:flex;gap:3px;color:var(--gold)}
.rlp .rlp-review blockquote{margin:0!important;padding:0!important;border:0!important;color:#e2e8f0;font-size:16px;font-style:normal;quotes:none;background:none!important}
.rlp .rlp-review blockquote::before,.rlp .rlp-review blockquote::after{content:none!important}
.rlp .rlp-review footer{display:flex;align-items:center;gap:12px;color:var(--muted);font-size:14px;margin-top:auto;padding:0;background:none;border:0}
.rlp .rlp-review footer b{color:#fff;display:block}
.rlp .rlp-av{width:40px;height:40px;border-radius:50%;display:grid;place-items:center;background:rgba(212,175,55,.15);color:var(--gold2);font-weight:700;font-size:14px}

/* faq */
.rlp .rlp-faq{max-width:820px;margin:44px auto 0;display:grid;gap:12px}
.rlp .rlp-faq details{border:1px solid rgba(255,255,255,.08);border-radius:16px;background:var(--panel);padding:0}
.rlp .rlp-faq summary{cursor:pointer;list-style:none;padding:20px 24px;font-weight:700;color:#fff;display:flex;justify-content:space-between;gap:16px;align-items:center}
.rlp .rlp-faq summary::-webkit-details-marker{display:none}
.rlp .rlp-faq summary::after{content:"+";color:var(--gold);font-size:24px;line-height:1;font-weight:400;transition:transform .2s}
.rlp .rlp-faq details[open] summary::after{transform:rotate(45deg)}
.rlp .rlp-faq details p{padding:0 24px 22px;color:var(--muted)}

/* contact */
.rlp .rlp-contact{display:grid;gap:24px;margin-top:48px}
@media(min-width:980px){.rlp .rlp-contact{grid-template-columns:1fr 1.15fr}}
.rlp .rlp-contact-list{display:grid;gap:12px}
.rlp .rlp-ci{display:flex;align-items:center;gap:16px;padding:18px 20px;border-radius:16px;border:1px solid rgba(255,255,255,.08);background:var(--panel);transition:border-color .2s,transform .2s}
.rlp a.rlp-ci:hover{border-color:var(--gold);transform:translateX(3px)}
.rlp .rlp-ci .rlp-card-ico{margin:0;width:46px;height:46px}
.rlp .rlp-ci small{display:block;color:var(--muted);font-size:12px;letter-spacing:.12em;text-transform:uppercase;font-weight:600}
.rlp .rlp-ci b{display:block;color:#fff;font-size:16px;word-break:break-word}
.rlp .rlp-map{border-radius:20px;overflow:hidden;border:1px solid var(--line);min-height:340px;background:var(--panel)}
.rlp .rlp-map iframe{width:100%;height:100%;min-height:340px;border:0;display:block;filter:grayscale(.35) contrast(1.05)}
.rlp .rlp-final{margin-top:64px;border-radius:24px;padding:44px 32px;text-align:center;border:1px solid var(--line);background:radial-gradient(600px 220px at 50% 0%,rgba(212,175,55,.18),transparent 70%),var(--panel)}
.rlp .rlp-final .rlp-cta{justify-content:center}

/* footer */
.rlp .rlp-foot{border-top:1px solid var(--line);padding:34px 0;color:var(--muted);font-size:14px}
.rlp .rlp-foot .rlp-wrap{display:flex;flex-wrap:wrap;gap:12px 28px;justify-content:space-between;align-items:center}
.rlp .rlp-foot b{color:#fff}
@media(max-width:640px){.rlp .rlp-sec{padding:72px 0}.rlp .rlp-hero{padding:72px 0 64px}.rlp .rlp-btn{width:100%}.rlp .rlp-top-call span{display:none}}
`;

function reviews(city: string) {
  const c = city.split(',')[0];
  return [
    ['Sold our home above asking in under two weeks. Clear advice on pricing, great photos, and constant updates.', 'JR', 'Jessica R.', `Home seller, ${c}`],
    ['As first-time buyers we had a hundred questions. Every one was answered patiently and we never felt rushed.', 'MT', 'Mark & Tina', `First-time buyers, ${c}`],
    [`Knows ${c} street by street. Found us the right neighborhood and negotiated a deal we were really happy with.`, 'DS', 'Daniel S.', 'Relocated family'],
  ];
}

export function buildRealtorPage(input: RealtorPageInput): RealtorPage {
  const name = input.name.trim();
  const agent = (input.agentName || '').trim() || name;
  const city = resolveCity(input.city, input.address) || 'Your City';
  const cityShort = city.split(',')[0].trim();
  const kw = (input.keyword || '').trim() || 'Top-Rated Realtor';
  const phone = input.phone.trim();
  const tel = telHref(phone);
  const wa = digits(input.whatsapp || phone).replace(/^\+/, '');
  const waNum = wa.length === 10 ? `1${wa}` : wa;
  const email = (input.email || '').trim();
  const address = (input.address || '').trim();
  const mono = initials(name);
  const isTeam = agent === name;

  const title = `${kw} in ${city} | ${name}`;
  const excerpt = `${name} — ${kw.toLowerCase()} in ${city}. Buy or sell with a local expert: pricing advice, marketing, negotiation and a smooth closing. Call ${phone}.`;
  const nameSlug = slugify(name);
  const slug = nameSlug.includes(slugify(cityShort)) ? nameSlug : slugify(`${cityShort} ${name}`);

  const stats: [string, string][] = [];
  if (input.experienceYears) stats.push([esc(input.experienceYears), 'Experience']);
  if (input.salesVolume) stats.push([esc(input.salesVolume), 'Sales Volume']);
  stats.push([esc(cityShort), 'Local Market Expert']);
  stats.push(['Free', 'Home Valuation']);
  for (const extra of [['1:1', 'Personal Service'], ['Fast', 'Replies 7 Days a Week']] as [string, string][]) {
    if (stats.length < 4) stats.unshift(extra);
  }
  const statsHtml = stats.slice(0, 4).map(([b, s]) => `<div class="rlp-stat"><b>${b}</b><span>${s}</span></div>`).join('');

  const services: [string, string, string][] = [
    ['home', `Buy a Home in ${cityShort}`, 'Search guidance, off-market leads, showings and offer strategy that wins in competitive markets.'],
    ['tag', 'Sell Your Home', 'Pricing based on real comparable sales, professional photography and marketing that reaches serious buyers.'],
    ['chart', 'Free Home Valuation', `Find out what your home is worth in today's ${cityShort} market — no obligation, no pressure.`],
    ['key', 'First-Time Buyers', 'Step-by-step help from pre-approval to keys in hand, with plain-English answers along the way.'],
    ['building', 'Investment Properties', 'Rental and investment opportunities analysed for cash flow, appreciation and risk.'],
    ['truck', 'Relocation', `Moving to ${cityShort}? Neighbourhood tours, school info and a smooth long-distance purchase.`],
  ];
  const servicesHtml = services.map(([i, h, p]) =>
    `<div class="rlp-card"><div class="rlp-card-ico">${ico(i, 22)}</div><h3>${esc(h)}</h3><p>${esc(p)}</p></div>`).join('');

  const types: [string, string, string][] = [
    [IMG.single, 'Single-Family Homes', 'Starter homes to forever homes'],
    [IMG.luxury, 'Luxury Properties', 'Discreet, high-touch representation'],
    [IMG.condo, 'Condos & Townhomes', 'Low-maintenance living'],
    [IMG.invest, 'Investment & Land', 'Rentals, lots and multi-family'],
  ];
  const typesHtml = types.map(([img, h, p]) =>
    `<a href="#rlp-contact" class="rlp-type" style="background-image:url('${img}')"><div><h3>${h}</h3><p>${p}</p></div></a>`).join('');

  const steps: [string, string][] = [
    ['Free consultation', 'We talk through your goals, timeline and budget — in person, by phone or video.'],
    ['A clear plan', `Pricing or search strategy built on current ${cityShort} market data.`],
    ['Marketing & showings', 'Professional listing presentation, or curated showings that match what you want.'],
    ['Negotiate & close', 'Strong negotiation, then every inspection, appraisal and deadline handled to closing day.'],
  ];
  const stepsHtml = steps.map(([h, p], i) =>
    `<div class="rlp-step"><b class="rlp-n">${i + 1}</b><div><h3>${h}</h3><p>${esc(p)}</p></div></div>`).join('');

  const star = ico('star', 16, 'rlp-star').replace('fill="none"', 'fill="currentColor"');
  const reviewsHtml = reviews(city).map(([q, ini, who, role]) =>
    `<div class="rlp-review"><div class="rlp-stars">${star.repeat(5)}</div><blockquote>“${esc(q)}”</blockquote><footer><span class="rlp-av">${ini}</span><span><b>${esc(who)}</b>${esc(role)}</span></footer></div>`).join('');

  const faqs: [string, string][] = [
    [`How much is my ${cityShort} home worth?`, `Ask for a free home valuation. ${agent} will look at recent comparable sales near you and current demand, then give you a realistic price range — no obligation.`],
    ['How long does it take to sell a home?', 'It depends on price, condition and the season. A well-priced, well-presented home usually sells much faster — we will give you a realistic timeline before you list.'],
    ['Do you work with first-time buyers?', 'Yes. We explain every step, connect you with trusted lenders and inspectors, and help you avoid common first-time mistakes.'],
    [`Which areas around ${cityShort} do you cover?`, `${cityShort} and the surrounding communities. If you are not sure whether we cover your area, just call ${phone}.`],
    ['What does it cost to work with you as a buyer?', 'In most cases buyer representation is paid through the transaction rather than out of pocket. We explain the costs clearly, in writing, before you commit to anything.'],
  ];
  const faqHtml = faqs.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('');

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'RealEstateAgent',
        name,
        ...(isTeam ? {} : { employee: { '@type': 'Person', name: agent } }),
        telephone: phone,
        ...(email ? { email } : {}),
        areaServed: city,
        address: address
          ? { '@type': 'PostalAddress', streetAddress: address, addressLocality: cityShort, addressRegion: city.split(',')[1]?.trim() || undefined }
          : { '@type': 'PostalAddress', addressLocality: cityShort, addressRegion: city.split(',')[1]?.trim() || undefined },
        description: excerpt,
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
      },
    ],
  };

  const mapQuery = encodeURIComponent(address || city);
  const contactItems = [
    `<a class="rlp-ci" href="tel:${tel}"><span class="rlp-card-ico">${ico('phone', 20)}</span><span><small>Call</small><b>${esc(phone)}</b></span></a>`,
    waNum.length >= 8 ? `<a class="rlp-ci" href="https://wa.me/${waNum}" target="_blank" rel="noopener"><span class="rlp-card-ico">${ico('chat', 20)}</span><span><small>WhatsApp</small><b>${isTeam ? 'Send us a message' : `Message ${esc(agent.split(' ')[0])}`}</b></span></a>` : '',
    email ? `<a class="rlp-ci" href="mailto:${esc(email)}"><span class="rlp-card-ico">${ico('mail', 20)}</span><span><small>Email</small><b>${esc(email)}</b></span></a>` : '',
    `<div class="rlp-ci"><span class="rlp-card-ico">${ico('pin', 20)}</span><span><small>Office</small><b>${esc(address || city)}</b></span></div>`,
  ].join('');

  const ctaButtons = `
      <a class="rlp-btn rlp-btn-gold" href="tel:${tel}">${ico('phone', 18)}Call ${esc(phone)}</a>
      ${waNum.length >= 8 ? `<a class="rlp-btn rlp-btn-wa" href="https://wa.me/${waNum}" target="_blank" rel="noopener">${ico('chat', 18)}WhatsApp</a>` : ''}`;

  const body = `
<div class="rlp" id="rlp-top">
  <div class="rlp-top"><div class="rlp-wrap">
    <div class="rlp-brand"><span class="rlp-mono">${mono}</span><span><b>${esc(name)}</b><small>${esc(city)}</small></span></div>
    <a class="rlp-top-call" href="tel:${tel}">${ico('phone', 18)}<span>${esc(phone)}</span></a>
  </div></div>

  <section class="rlp-hero"><div class="rlp-wrap rlp-hero-grid">
    <div>
      <span class="rlp-eyebrow">${ico('star', 14)}${esc(name)}</span>
      <h1 class="rlp-h1">${esc(kw)} in <em>${esc(city)}</em></h1>
      <p class="rlp-sub">Buying or selling in ${esc(cityShort)}? Work with ${isTeam ? 'a local team' : esc(agent)} who knows the market street by street — honest pricing advice, sharp negotiation and a smooth path to closing day.</p>
      <div class="rlp-cta">${ctaButtons}
        <a class="rlp-btn rlp-btn-ghost" href="#rlp-contact">Free Home Valuation ${ico('arrow', 18)}</a>
      </div>
      <div class="rlp-chips">
        <span>${ico('shield', 18)}Licensed Real Estate Professional</span>
        <span>${ico('pin', 18)}${esc(cityShort)} &amp; surrounding areas</span>
        <span>${ico('check', 18)}Free, no-obligation consultation</span>
      </div>
    </div>
    <aside class="rlp-agent" aria-label="About the agent">
      <div class="rlp-agent-head"><span class="rlp-mono">${mono}</span><div><h3>${esc(agent)}</h3><span class="rlp-agent-role">${isTeam ? 'Local Real Estate Team' : esc(name)}</span></div></div>
      <ul>
        ${input.experienceYears ? `<li>${ico('check', 18)}<span>${esc(input.experienceYears)} of real estate experience</span></li>` : ''}
        ${input.salesVolume ? `<li>${ico('check', 18)}<span>${esc(input.salesVolume)} in sales volume</span></li>` : ''}
        <li>${ico('check', 18)}<span>Buyers, sellers, investors &amp; relocations</span></li>
        <li>${ico('check', 18)}<span>Fast replies by phone, text or WhatsApp</span></li>
        <li>${ico('pin', 18)}<span>${esc(address || city)}</span></li>
      </ul>
      <a class="rlp-btn rlp-btn-gold" href="tel:${tel}">${ico('phone', 18)}${isTeam ? 'Talk to us today' : `Talk to ${esc(agent.split(' ')[0])} today`}</a>
    </aside>
  </div></section>

  <div class="rlp-stats">${statsHtml}</div>

  <section class="rlp-sec"><div class="rlp-wrap rlp-center">
    <span class="rlp-eyebrow">${ico('home', 14)}How we help</span>
    <h2 class="rlp-h2">Real estate services in <em>${esc(cityShort)}</em></h2>
    <p class="rlp-lead">Whether you're buying your first home, selling, investing or moving to the area — one local expert handles it from first call to closing.</p>
    <div class="rlp-grid3" style="text-align:left">${servicesHtml}</div>
  </div></section>

  <section class="rlp-sec rlp-alt"><div class="rlp-wrap">
    <span class="rlp-eyebrow">${ico('building', 14)}Property types</span>
    <h2 class="rlp-h2">Every kind of home in <em>${esc(cityShort)}</em></h2>
    <p class="rlp-lead">From first homes to luxury estates — tell us what you're looking for and we'll find it, on or off the market.</p>
    <div class="rlp-types">${typesHtml}</div>
  </div></section>

  <section class="rlp-sec"><div class="rlp-wrap rlp-two">
    <div>
      <span class="rlp-eyebrow">${ico('shield', 14)}Why ${esc(isTeam ? name : agent.split(' ')[0])}</span>
      <h2 class="rlp-h2">A ${esc(cityShort)} expert on <em>your</em> side</h2>
      <p class="rlp-lead">You get straight answers, a clear plan and someone who picks up the phone. No pressure, no surprises.</p>
      <ul class="rlp-ticks">
        <li>${ico('check', 18)}<span>Pricing based on real, recent ${esc(cityShort)} sales</span></li>
        <li>${ico('check', 18)}<span>Professional photos and marketing for every listing</span></li>
        <li>${ico('check', 18)}<span>Strong negotiation to protect your money</span></li>
        <li>${ico('check', 18)}<span>Trusted local lenders, inspectors and contractors</span></li>
      </ul>
    </div>
    <div class="rlp-steps">${stepsHtml}</div>
  </div></section>

  <section class="rlp-sec rlp-alt"><div class="rlp-wrap rlp-center">
    <span class="rlp-eyebrow">${ico('star', 14)}Client stories</span>
    <h2 class="rlp-h2">What ${esc(cityShort)} clients say</h2>
    <div class="rlp-grid3" style="text-align:left">${reviewsHtml}</div>
  </div></section>

  <section class="rlp-sec"><div class="rlp-wrap rlp-center">
    <span class="rlp-eyebrow">${ico('chat', 14)}FAQ</span>
    <h2 class="rlp-h2">Questions about buying &amp; selling in ${esc(cityShort)}</h2>
    <div class="rlp-faq" style="text-align:left">${faqHtml}</div>
  </div></section>

  <section class="rlp-sec rlp-alt" id="rlp-contact"><div class="rlp-wrap">
    <span class="rlp-eyebrow">${ico('phone', 14)}Contact</span>
    <h2 class="rlp-h2">Talk to ${esc(agent)} about <em>your</em> move</h2>
    <p class="rlp-lead">Call, text or WhatsApp — most messages get a reply within the hour during business hours.</p>
    <div class="rlp-contact">
      <div class="rlp-contact-list">${contactItems}</div>
      <div class="rlp-map"><iframe title="Map of ${esc(address || city)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://maps.google.com/maps?q=${mapQuery}&amp;z=13&amp;output=embed"></iframe></div>
    </div>
    <div class="rlp-final">
      <h2 class="rlp-h2" style="margin-top:0!important">Thinking about buying or selling in ${esc(cityShort)}?</h2>
      <p class="rlp-lead" style="margin:0 auto 6px">Get a free, no-obligation consultation and home valuation.</p>
      <div class="rlp-cta">${ctaButtons}</div>
    </div>
  </div></section>

  <footer class="rlp-foot"><div class="rlp-wrap">
    <span><b>${esc(name)}</b> &middot; ${esc(address || city)} &middot; <a href="tel:${tel}">${esc(phone)}</a>${email ? ` &middot; <a href="mailto:${esc(email)}">${esc(email)}</a>` : ''}</span>
    <span>&copy; ${new Date().getFullYear()} ${esc(name)}</span>
  </div></footer>
  <script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>
</div>`;

  const fonts = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet">`;
  const inner = `${fonts}<style>${CSS}</style>${body}`;

  return {
    title,
    slug,
    excerpt,
    city,
    wpContent: `<!-- wp:html -->\n${inner}\n<!-- /wp:html -->`,
    standaloneHtml: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(excerpt)}"><style>body{margin:0;background:#0b0f19}</style></head><body>${inner}</body></html>`,
  };
}
