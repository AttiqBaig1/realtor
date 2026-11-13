import React, { useEffect, useMemo, useRef, useState } from 'react';
import './rd.css';
import { useRealEstate } from '../../context/RealEstateContext';
import { buildCleanLink, CleanLinkInput, cityFromText, linkOrigin, parseCleanLink, quickLink } from '../../utils/cleanLink';
import { parseRealtorCsv } from '../../utils/csvHelper';

/**
 * Realtor Engine dashboard — same layout as the Landing Page Engine, but with
 * no publishing step: every realtor gets a clean, short demo link on
 * realtordemos.online (e.g. /realtor-fresno or /central-valley-prime-realty-fresno)
 * and the site adjusts itself from the link.
 * 1 Quick link → 2 Realtors (manual or CSV) → 3 Links & Preview.
 * Open with ?dashboard on the site URL. Uses the admin password.
 */

const KEYWORDS = [
  'Top-Rated Realtor', '5-Star Professional Realtor', 'Luxury Real Estate Agent', 'Real Estate Agent',
  'Realtor', "Buyer's Agent", 'Listing Agent', 'Real Estate Broker', 'Top Real Estate Team',
];

const SAMPLE_CSV = `Name,Agent Name,Address,City,Phone,Email,WhatsApp,SEO Keyword,Sales Volume
Vance & Co. Luxury Real Estate,Marcus Vance,"1240 Spring Street, Paso Robles, CA 93446","Paso Robles, CA",+1 (805) 238-9900,marcus@vanceproperties.com,+18052389900,"5-Star Professional Realtor","$380M+"
Central Valley Prime Realty,David Sterling,"7110 N Fresno St, Fresno, CA 93720","Fresno, CA",+1 (559) 438-2200,david@fresnoprimerealty.com,+15594382200,"Premier Luxury Realtor","$420M+"
Grand River Heritage Realty,Emily Chen,"305 King St W, Kitchener, ON N2G 1B9","Kitchener, ON",+1 (519) 745-8000,emily@grandriverheritage.com,+15197458000,"Local Real Estate Consultant","$240M+"`;

interface Entry {
  name: string; address: string; phone: string; keyword: string;
  agentName: string; email: string; whatsapp: string; salesVolume: string; experienceYears: string;
  open: boolean;
}
const blank = (): Entry => ({ name: '', address: '', phone: '', keyword: KEYWORDS[0], agentName: '', email: '', whatsapp: '', salesVolume: '', experienceYears: '', open: false });

interface Site {
  key: string;
  input: CleanLinkInput & { name: string };
  city: string;
  link: string;
}

const pretty = (url: string) => url.replace(/^https?:\/\//, '');
const EXAMPLES = ['realtor fresno', 'realtor paso robles', 'realtor houston', 'luxury realtor miami', 'real estate agent toronto'];

const useFonts = () => {
  useEffect(() => {
    if (document.getElementById('rd-fonts')) return;
    const l = document.createElement('link');
    l.id = 'rd-fonts';
    l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Unbounded:wght@500;700&family=Figtree:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap';
    document.head.appendChild(l);
  }, []);
};

const download = (filename: string, data: string, type = 'text/html') => {
  const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([data], { type })), download: filename });
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
};

const csvQ = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);

export const RealtorDashboard: React.FC = () => {
  useFonts();
  const { isAdminLoggedIn, loginAdmin } = useRealEstate();

  // ---------------------------------------------------------------- gate
  const [pw, setPw] = useState('');
  const [pwErr, setPwErr] = useState('');
  if (!isAdminLoggedIn) {
    return (
      <div className="rd"><div className="gate">
        <form onSubmit={async e => { e.preventDefault(); setPwErr(''); if (!(await loginAdmin(pw, true))) { setPwErr('Password galat hai. Dobara try karein.'); setPw(''); } }}>
          <div className="brand"><span className="logo">RE</span><div><b>Realtor<br />Engine</b><small>Dashboard</small></div></div>
          <h1>Login</h1>
          <label className="f" htmlFor="rd-pw">Admin password<input id="rd-pw" type="password" autoFocus autoComplete="current-password" value={pw} onChange={e => setPw(e.target.value)} /></label>
          {pwErr && <div className="alert bad">{pwErr}</div>}
          <button className="btn primary big" type="submit" style={{ width: '100%' }}>Dashboard kholein</button>
          <a className="rail-link" href={window.location.pathname}>← Website par wapas</a>
        </form>
      </div></div>
    );
  }
  return <Dashboard />;
};

const Dashboard: React.FC = () => {
  const origin = linkOrigin();
  const host = pretty(origin);

  // ---------------------------------------------------------------- copy helper
  const [copiedKey, setCopiedKey] = useState('');
  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedKey(key); setTimeout(() => setCopiedKey(k => (k === key ? '' : k)), 1600);
  };

  // ---------------------------------------------------------------- 1. quick link
  const [qText, setQText] = useState('realtor fresno');
  const [qPhone, setQPhone] = useState('');
  const qLink = useMemo(() => {
    const base = quickLink(qText, origin);
    if (!base) return '';
    const d = qPhone.replace(/\D/g, '');
    return d ? `${base}?p=${d.length === 11 && d[0] === '1' ? d.slice(1) : d}` : base;
  }, [qText, qPhone, origin]);
  const qParsed = useMemo(() => {
    if (!qLink) return null;
    const u = new URL(qLink);
    return parseCleanLink(u.pathname, u.search);
  }, [qLink]);

  // ---------------------------------------------------------------- 2. inputs
  const [method, setMethod] = useState<'manual' | 'csv'>('manual');
  const [entries, setEntries] = useState<Entry[]>([blank()]);
  const [csvRows, setCsvRows] = useState<(CleanLinkInput & { name: string })[]>([]);
  const [csvErr, setCsvErr] = useState('');
  const [over, setOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [withPhone, setWithPhone] = useState(true);
  const [withExtras, setWithExtras] = useState(false);

  const setCount = (n: number) => {
    const c = Math.max(1, Math.min(100, n || 1));
    setEntries(es => (c > es.length ? [...es, ...Array.from({ length: c - es.length }, blank)] : es.slice(0, c)));
  };
  const upd = (i: number, k: keyof Entry, v: any) => setEntries(es => es.map((e, j) => (j === i ? { ...e, [k]: v } : e)));

  const loadCsv = (text: string) => {
    setCsvErr('');
    try {
      const items = parseRealtorCsv(text, () => '');
      const rows = items.filter(b => b.name && (b.city || b.address)).map(b => ({
        name: b.name, agentName: b.agentName, city: b.city, address: b.address, phone: b.phone,
        email: b.email, whatsapp: b.whatsapp, keyword: b.keyword, salesVolume: b.salesVolume,
      }));
      if (!rows.length) setCsvErr('CSV mein koi realtor nahi mila. Kam se kam Name aur City (ya Address) chahiye.');
      setCsvRows(rows);
    } catch (e: any) {
      setCsvErr('CSV parh nahi saka: ' + (e?.message || e));
      setCsvRows([]);
    }
  };

  const toBuild: (CleanLinkInput & { name: string })[] = method === 'csv'
    ? csvRows
    : entries.filter(e => e.name.trim() && e.address.trim()).map(e => ({
      name: e.name.trim(), address: e.address.trim(), phone: e.phone.trim() || undefined,
      keyword: e.keyword.trim() || undefined, agentName: e.agentName.trim() || undefined,
      email: e.email.trim() || undefined, whatsapp: e.whatsapp.trim() || undefined,
      salesVolume: e.salesVolume.trim() || undefined, experienceYears: e.experienceYears.trim() || undefined,
    }));

  // ---------------------------------------------------------------- generate
  const [sites, setSites] = useState<Site[]>([]);
  const [genMsg, setGenMsg] = useState('');

  const generate = () => {
    const out = toBuild.map((input, i) => {
      let inp: CleanLinkInput = withPhone ? input : { ...input, phone: undefined, whatsapp: undefined };
      if (!withExtras) inp = { name: inp.name, city: inp.city, address: inp.address, phone: inp.phone };
      const link = buildCleanLink(inp, origin);
      const c = cityFromText(input.city, input.address);
      return { key: `${Date.now()}-${i}`, input, city: c.st ? `${c.city}, ${c.st}` : c.city, link };
    });
    setSites(out);
    setGenMsg(`${out.length} clean link${out.length === 1 ? '' : 's'} ban gaye. Koi publish nahi — link kholte hi site us realtor ke hisaab se ban jati hai.`);
    setTimeout(() => document.getElementById('rd-links')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

  const exportResults = () => {
    const head = 'Name,City,Phone,Demo Link';
    const body = sites.map(s => [s.input.name, s.city, s.input.phone || '', s.link].map(v => csvQ(String(v))).join(','));
    download('realtor-demo-links.csv', '﻿' + [head, ...body].join('\n'), 'text/csv');
  };
  const allLinks = sites.map(s => `${s.input.name} (${s.city}): ${s.link}`).join('\n');

  return (
    <div className="rd"><div className="shell">
      {/* ======================= RAIL ======================= */}
      <aside className="rail" aria-label="Steps">
        <div className="brand"><span className="logo">RE</span><div><b>Realtor<br />Engine</b><small>Clean demo links · US &amp; Canada</small></div></div>
        <nav className="steps">
          <a href="#rd-quick" className={qLink ? 'done' : ''}><span className="n">1</span><span>Quick Link<small>"realtor fresno" likhein</small></span></a>
          <a href="#rd-gen" className={toBuild.length ? 'done' : ''}><span className="n">2</span><span>Realtors<small>Manual ya CSV</small></span></a>
          <a href="#rd-links" className={sites.length ? 'done' : ''}><span className="n">3</span><span>Links &amp; Preview<small>Copy karke bhejein</small></span></a>
        </nav>
        <div className="meters">
          <div className="meter"><b>{sites.length}</b><span>Links bane</span></div>
          <div className="meter"><b>0</b><span>Publish ki zaroorat</span></div>
          <div className="meter wide"><span className="dot on" /><span>{host}</span></div>
        </div>
        <a className="rail-link" href="/">← Demo website dekhein</a>
      </aside>

      {/* ======================= MAIN ======================= */}
      <main className="main">
        <header className="hero">
          <h1>Ek chhota sa link. <em>Poori website us realtor ki.</em></h1>
          <p>Har realtor ke liye saaf, chhota link — jaise <code>{host}/realtor-fresno</code> ya <code>{host}/central-valley-prime-realty-fresno</code>. Link kholte hi website ka naam, city, H1, phone aur WhatsApp us realtor ke hisaab se badal jate hain. WordPress, upload ya publish kuch nahi.</p>
        </header>

        {/* ---------- 1. QUICK LINK ---------- */}
        <section className="panel" id="rd-quick">
          <div className="ph"><span className="n">1</span><div><h2>⚡ Quick link</h2><p>Bas likhein "realtor" aur city — link foran tayyar. Naam bhi daal sakte hain: "vance realty paso robles".</p></div></div>
          <div className="f3">
            <label className="f" htmlFor="rd-q" style={{ gridColumn: 'span 2' }}>Kya likhna hai?<input id="rd-q" value={qText} onChange={e => setQText(e.target.value)} placeholder="realtor fresno" autoComplete="off" /></label>
            <label className="f" htmlFor="rd-qp">Phone <span className="hint">(optional)</span><input id="rd-qp" value={qPhone} onChange={e => setQPhone(e.target.value)} placeholder="(559) 438-2200" inputMode="tel" /></label>
          </div>
          <div className="bar">{EXAMPLES.map(x => <button key={x} type="button" className="btn ghost sm" onClick={() => setQText(x)}>{x}</button>)}</div>
          {qLink && (
            <div className="linkbox">
              <a className="the-link" href={qLink} target="_blank" rel="noopener noreferrer">{pretty(qLink)}</a>
              <div className="bar">
                <button className="btn primary" type="button" onClick={() => copy(qLink, 'q')}>{copiedKey === 'q' ? 'Copy ho gaya ✓' : '📋 Copy link'}</button>
                <a className="btn ghost" href={qLink} target="_blank" rel="noopener noreferrer">Kholein ↗</a>
              </div>
              {qParsed ? (
                <div className="bar" style={{ gap: 8 }}>
                  <span className="chip">📍 {qParsed.city}</span>
                  <span className="chip">🏢 {qParsed.name || `${qParsed.city.split(',')[0]} Premier Realty`}</span>
                  {qParsed.keyword && <span className="chip">🔑 {qParsed.keyword}</span>}
                  {qParsed.phone && <span className="chip">📞 {qParsed.phone}</span>}
                </div>
              ) : <div className="alert bad">City samajh nahi aayi. "realtor" ke saath city ka naam likhein, jaise "realtor fresno".</div>}
            </div>
          )}
        </section>

        {/* ---------- 2. REALTORS ---------- */}
        <section className="panel" id="rd-gen">
          <div className="ph"><span className="n">2</span><div><h2>Realtors ki list</h2><p>Naam, address (ya sirf city) aur phone — ek ek karke ya CSV se poori list.</p></div>
            <div className="right seg" role="group" aria-label="Input method">
              <button type="button" aria-pressed={method === 'manual'} onClick={() => setMethod('manual')}>✍️ Manual entry</button>
              <button type="button" aria-pressed={method === 'csv'} onClick={() => setMethod('csv')}>📄 Upload CSV</button>
            </div>
          </div>

          {method === 'manual' ? (
            <section style={{ display: 'grid', gap: 14 }}>
              <div className="count">
                <span style={{ fontWeight: 600, fontSize: 14 }}>How many realtors?</span>
                <span className="num">
                  <button type="button" aria-label="Fewer" onClick={() => setCount(entries.length - 1)}>−</button>
                  <input aria-label="How many realtors" type="number" min={1} max={100} value={entries.length} onChange={e => setCount(parseInt(e.target.value, 10))} />
                  <button type="button" aria-label="More" onClick={() => setCount(entries.length + 1)}>+</button>
                </span>
              </div>
              <datalist id="rd-kw">{KEYWORDS.map(k => <option key={k} value={k} />)}</datalist>
              <div className="rows">
                {entries.map((e, i) => (
                  <div className="biz" key={i}>
                    <div className="biz-main">
                      <span className="idx">#{i + 1}</span>
                      <label className="f" htmlFor={`rd-nm${i}`}>Business / realtor name<input id={`rd-nm${i}`} value={e.name} onChange={x => upd(i, 'name', x.target.value)} placeholder="Central Valley Prime Realty" /></label>
                      <label className="f" htmlFor={`rd-ad${i}`}><span>Address <span className="hint">(sirf city bhi chalegi)</span></span><input id={`rd-ad${i}`} value={e.address} onChange={x => upd(i, 'address', x.target.value)} placeholder="Fresno, CA ya 7110 N Fresno St, Fresno, CA" /></label>
                      <label className="f" htmlFor={`rd-ph${i}`}>Phone<input id={`rd-ph${i}`} value={e.phone} onChange={x => upd(i, 'phone', x.target.value)} placeholder="(559) 438-2200" /></label>
                    </div>
                    <button type="button" className="more-toggle" onClick={() => upd(i, 'open', !e.open)}>{e.open ? '− Kam details' : '+ Aur details (agent, email, WhatsApp, keyword, sales)'}</button>
                    {e.open && (
                      <div className="biz-more">
                        <label className="f" htmlFor={`rd-ag${i}`}>Agent name<input id={`rd-ag${i}`} value={e.agentName} onChange={x => upd(i, 'agentName', x.target.value)} placeholder="David Sterling" /></label>
                        <label className="f" htmlFor={`rd-em${i}`}>Email<input id={`rd-em${i}`} value={e.email} onChange={x => upd(i, 'email', x.target.value)} placeholder="david@realty.com" /></label>
                        <label className="f" htmlFor={`rd-wa${i}`}>WhatsApp <span className="hint">(khaali = phone)</span><input id={`rd-wa${i}`} value={e.whatsapp} onChange={x => upd(i, 'whatsapp', x.target.value)} placeholder="+15594382200" /></label>
                        <label className="f" htmlFor={`rd-kw${i}`}>H1 keyword<input id={`rd-kw${i}`} list="rd-kw" value={e.keyword} onChange={x => upd(i, 'keyword', x.target.value)} /></label>
                        <label className="f" htmlFor={`rd-sv${i}`}>Sales volume <span className="hint">(optional)</span><input id={`rd-sv${i}`} value={e.salesVolume} onChange={x => upd(i, 'salesVolume', x.target.value)} placeholder="$290M+" /></label>
                        <label className="f" htmlFor={`rd-ex${i}`}>Experience <span className="hint">(optional)</span><input id={`rd-ex${i}`} value={e.experienceYears} onChange={x => upd(i, 'experienceYears', x.target.value)} placeholder="15+ Years" /></label>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ) : (
            <section style={{ display: 'grid', gap: 12 }}>
              <label className={`drop ${over ? 'over' : ''}`} htmlFor="rd-csv"
                onDragOver={e => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)}
                onDrop={async e => { e.preventDefault(); setOver(false); const f = e.dataTransfer.files[0]; if (f) loadCsv(await f.text()); }}>
                <input id="rd-csv" ref={fileRef} type="file" accept=".csv,text/csv" style={{ display: 'none' }} onChange={async e => { const f = e.target.files?.[0]; if (f) loadCsv(await f.text()); }} />
                <span style={{ fontSize: 28 }} aria-hidden="true">📄</span>
                <b>CSV file yahan drop karein ya click karein</b>
                <span style={{ color: 'var(--muted)', fontWeight: 500 }}>Columns: <code>Name, Agent Name, Address, City, Phone, Email, WhatsApp, SEO Keyword, Sales Volume</code></span>
              </label>
              <div className="bar">
                <button className="btn ghost" type="button" onClick={() => loadCsv(SAMPLE_CSV)}>Sample list use karein</button>
                <button className="btn ghost" type="button" onClick={() => download('realtor-template.csv', '﻿' + SAMPLE_CSV, 'text/csv')}>CSV template download</button>
              </div>
              {csvErr && <div className="alert bad">{csvErr}</div>}
              {csvRows.length > 0 && (
                <div className="tbl"><table>
                  <thead><tr><th>#</th><th>Name</th><th>City</th><th>Phone</th></tr></thead>
                  <tbody>{csvRows.map((r, i) => {
                    const c = cityFromText(r.city, r.address);
                    return (
                      <tr key={i}><td className="mono">{i + 1}</td><td><strong>{r.name}</strong>{r.agentName ? <><br /><span style={{ color: 'var(--muted)' }}>{r.agentName}</span></> : null}</td>
                        <td>{c.st ? `${c.city}, ${c.st}` : c.city}</td><td className="mono">{r.phone}</td></tr>
                    );
                  })}</tbody>
                </table></div>
              )}
            </section>
          )}

          <div style={{ display: 'grid', gap: 14, paddingTop: 6, borderTop: '1px solid var(--line)' }}>
            <label className="toggle" htmlFor="rd-wp"><input id="rd-wp" type="checkbox" checked={withPhone} onChange={e => setWithPhone(e.target.checked)} /> Realtor ka phone link mein shamil karein <span style={{ color: 'var(--muted)' }}>(link ke aakhir mein <code>?p=…</code>)</span></label>
            <label className="toggle" htmlFor="rd-wx"><input id="rd-wx" type="checkbox" checked={withExtras} onChange={e => setWithExtras(e.target.checked)} /> Agent, email, keyword, sales bhi link mein daalein <span style={{ color: 'var(--muted)' }}>(link lamba ho jayega)</span></label>
            <button className="btn primary big" type="button" disabled={toBuild.length === 0} onClick={generate}>
              🔗 Generate clean links{toBuild.length > 1 ? ` (${toBuild.length})` : ''}
            </button>
            {genMsg && <div className="alert ok">{genMsg}</div>}
          </div>
        </section>

        {/* ---------- 3. LINKS & PREVIEW ---------- */}
        <section className="panel" id="rd-links">
          <div className="ph"><span className="n">3</span><div><h2>Links &amp; Preview</h2><p>Link copy karein aur client ko bhej dein. Neeche khol kar dekh bhi sakte hain ke unhe kya nazar aayega.</p></div></div>
          {sites.length === 0 ? <div className="empty">Pehle step 2 mein links generate karein.</div> : (
            <section style={{ display: 'grid', gap: 14 }}>
              <div className="bar" style={{ justifyContent: 'space-between' }}>
                <strong>{sites.length} link(s) tayyar</strong>
                <div className="bar">
                  <button className="btn sm primary" type="button" onClick={() => copy(allLinks, 'all')}>{copiedKey === 'all' ? 'Copy ho gaya ✓' : '📋 Copy all'}</button>
                  <button className="btn sm" type="button" onClick={exportResults}>⬇️ CSV</button>
                </div>
              </div>
              <div className="tbl"><table>
                <thead><tr><th>Realtor</th><th>City</th><th>Demo link</th><th></th></tr></thead>
                <tbody>{sites.map(s => (
                  <tr key={s.key}>
                    <td><strong>{s.input.name}</strong>{s.input.phone ? <><br /><span className="mono" style={{ color: 'var(--muted)' }}>{s.input.phone}</span></> : null}</td>
                    <td><span className="chip">{s.city}</span></td>
                    <td style={{ maxWidth: 360, wordBreak: 'break-all' }}><a href={s.link} target="_blank" rel="noopener noreferrer">{pretty(s.link)}</a></td>
                    <td><button className="btn sm" type="button" onClick={() => copy(s.link, s.key)}>{copiedKey === s.key ? '✓' : 'Copy'}</button></td>
                  </tr>
                ))}</tbody>
              </table></div>
              <div className="rows">{sites.map(s => (
                <details className="card" key={s.key}>
                  <summary>👁️ {s.input.name} <span className="chip">{s.city}</span></summary>
                  <div className="card-body">
                    <div className="bar">
                      <button className="btn" type="button" onClick={() => copy(s.link, 'p' + s.key)}>{copiedKey === 'p' + s.key ? 'Copy ho gaya ✓' : '📋 Copy link'}</button>
                      <a className="btn ghost" href={s.link} target="_blank" rel="noopener noreferrer">Naye tab mein kholein ↗</a>
                    </div>
                    <div className="frame"><iframe title={`Preview of ${s.input.name}`} src={s.link.replace(origin, '')} loading="lazy" /></div>
                  </div>
                </details>
              ))}</div>
            </section>
          )}
        </section>
      </main>
    </div></div>
  );
};

export default RealtorDashboard;
