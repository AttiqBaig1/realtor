import React, { useEffect, useMemo, useRef, useState } from 'react';
import './rd.css';
import { useRealEstate } from '../../context/RealEstateContext';
import { buildRealtorPage, RealtorPage, RealtorPageInput, resolveCity } from '../../utils/realtorPage';
import { connectWp, loadSavedCreds, publishPage, saveCreds, WpConn } from '../../utils/wordpress';
import { shortenWithTinyUrl } from '../../utils/urlShortener';
import { parseRealtorCsv } from '../../utils/csvHelper';

/**
 * Realtor Engine dashboard — same layout and flow as the Landing Page Engine:
 * 0 WordPress connection → 1 Generate (manual or CSV, optional one-click
 * publish) → 2 Preview & Download → 3 Publish ALL / per page → Live URLs.
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
  input: RealtorPageInput;
  page: RealtorPage;
  demoUrl: string;
  shortUrl?: string;
  wp: '' | 'busy' | 'live' | 'error';
  link?: string;
  error?: string;
}

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
  const { isAdminLoggedIn, loginAdmin, generateDynamicUrl } = useRealEstate();

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
  return <Dashboard generateDynamicUrl={generateDynamicUrl} />;
};

const Dashboard: React.FC<{ generateDynamicUrl: (p?: any) => string }> = ({ generateDynamicUrl }) => {
  // ---------------------------------------------------------------- WordPress
  const saved = loadSavedCreds();
  const [wpUrl, setWpUrl] = useState(saved?.url || '');
  const [wpUser, setWpUser] = useState(saved?.user || '');
  const [wpPass, setWpPass] = useState(saved?.pass || '');
  const [remember, setRemember] = useState(true);
  const [conn, setConn] = useState<WpConn | null>(null);
  const [wpBusy, setWpBusy] = useState(false);
  const [wpMsg, setWpMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [alsoPublish, setAlsoPublish] = useState(false);
  const [pubStatus, setPubStatus] = useState<'publish' | 'draft'>('publish');

  const connect = async (silent = false) => {
    if (!wpUrl || !wpUser || !wpPass) {
      if (!silent) setWpMsg({ ok: false, text: 'Teeno cheezein daalein: site URL, username aur Application Password.' });
      return;
    }
    setWpBusy(true);
    const res = await connectWp({ url: wpUrl, user: wpUser, pass: wpPass });
    setWpBusy(false);
    if (res.ok === true) {
      setConn(res.conn);
      saveCreds(remember ? { url: wpUrl, user: wpUser, pass: wpPass } : null);
      setWpMsg({ ok: true, text: `Connect ho gaya. Logged in as ${res.conn.userName}.` });
      setAlsoPublish(true);
    } else {
      setConn(null);
      setAlsoPublish(false);
      setWpMsg({ ok: false, text: (res as { error: string }).error });
    }
  };
  useEffect(() => { if (saved) connect(true); /* eslint-disable-next-line */ }, []);

  // ---------------------------------------------------------------- inputs
  const [method, setMethod] = useState<'manual' | 'csv'>('manual');
  const [entries, setEntries] = useState<Entry[]>([blank()]);
  const [csvRows, setCsvRows] = useState<RealtorPageInput[]>([]);
  const [csvErr, setCsvErr] = useState('');
  const [over, setOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const setCount = (n: number) => {
    const c = Math.max(1, Math.min(50, n || 1));
    setEntries(es => (c > es.length ? [...es, ...Array.from({ length: c - es.length }, blank)] : es.slice(0, c)));
  };
  const upd = (i: number, k: keyof Entry, v: any) => setEntries(es => es.map((e, j) => (j === i ? { ...e, [k]: v } : e)));

  const loadCsv = (text: string) => {
    setCsvErr('');
    try {
      const items = parseRealtorCsv(text, () => '');
      const rows = items.filter(b => b.name && b.phone).map(b => ({
        name: b.name, agentName: b.agentName, city: b.city, address: b.address, phone: b.phone,
        email: b.email, whatsapp: b.whatsapp, keyword: b.keyword, salesVolume: b.salesVolume,
      }));
      if (!rows.length) setCsvErr('CSV mein koi realtor nahi mila. Columns: Name, Agent Name, Address, City, Phone, Email, WhatsApp, SEO Keyword, Sales Volume');
      setCsvRows(rows);
    } catch (e: any) {
      setCsvErr('CSV parh nahi saka: ' + (e?.message || e));
      setCsvRows([]);
    }
  };

  const toBuild: RealtorPageInput[] = method === 'csv'
    ? csvRows
    : entries.filter(e => e.name.trim() && e.address.trim() && e.phone.trim()).map(e => ({
      name: e.name.trim(), address: e.address.trim(), city: resolveCity('', e.address) || e.address.trim(),
      phone: e.phone.trim(), keyword: e.keyword.trim() || KEYWORDS[0], agentName: e.agentName.trim() || undefined,
      email: e.email.trim() || undefined, whatsapp: e.whatsapp.trim() || undefined,
      salesVolume: e.salesVolume.trim() || undefined, experienceYears: e.experienceYears.trim() || undefined,
    }));

  // ---------------------------------------------------------------- generate
  const [sites, setSites] = useState<Site[]>([]);
  const [prog, setProg] = useState<{ frac: number; text: string } | null>(null);
  const [genMsg, setGenMsg] = useState<{ ok: boolean; html: string } | null>(null);
  const [running, setRunning] = useState(false);

  const publishOne = async (s: Site): Promise<Site> => {
    if (!conn) return s;
    const res = await publishPage(conn, { title: s.page.title, slug: s.page.slug, content: s.page.wpContent, excerpt: s.page.excerpt }, pubStatus);
    return res.ok === true ? { ...s, wp: 'live', link: res.link, error: undefined } : { ...s, wp: 'error', error: (res as { error: string }).error };
  };
  const patch = (key: string, p: Partial<Site>) => setSites(ss => ss.map(s => (s.key === key ? { ...s, ...p } : s)));

  const generate = async () => {
    const list = toBuild;
    if (!list.length) return;
    const pub = alsoPublish && !!conn;
    setRunning(true);
    setGenMsg(null);
    const out: Site[] = [];
    setSites([]);
    for (let i = 0; i < list.length; i++) {
      const input = list[i];
      setProg({ frac: i / list.length, text: `Building ${input.name}…` });
      await new Promise(r => setTimeout(r, 0));
      const page = buildRealtorPage(input);
      const demoUrl = generateDynamicUrl({
        name: input.name, agentName: input.agentName || input.name, city: page.city, address: input.address,
        phone: input.phone, email: input.email, whatsapp: input.whatsapp, primaryKeyword: input.keyword, salesVolume: input.salesVolume,
      });
      let site: Site = { key: `${Date.now()}-${i}`, input, page, demoUrl, wp: '' };
      if (pub) {
        setProg({ frac: i / list.length, text: `Publishing ${input.name}…` });
        site = { ...site, wp: 'busy' };
        out.push(site); setSites([...out]);
        site = await publishOne(site);
        out[out.length - 1] = site;
      } else {
        out.push(site);
      }
      setSites([...out]);
      // short demo link in the background
      shortenWithTinyUrl(demoUrl).then(short => { if (short && short !== demoUrl) patch(site.key, { shortUrl: short }); });
    }
    setProg({ frac: 1, text: 'Done' });
    const live = out.filter(s => s.wp === 'live').length;
    const failed = out.filter(s => s.wp === 'error').length;
    setGenMsg({
      ok: failed === 0,
      html: pub
        ? `Built ${out.length} pages — published ${live} of ${out.length} to WordPress.${failed ? `<br>⚠️ ${failed} publish nahi hue — WordPress column dekhein, ya step 3 se dobara try karein.` : ''}`
        : `Built ${out.length} pages.`,
    });
    setRunning(false);
  };

  const publishSite = async (key: string) => {
    const s = sites.find(x => x.key === key);
    if (!s || !conn) return;
    patch(key, { wp: 'busy', error: undefined });
    const done = await publishOne(s);
    patch(key, { wp: done.wp, link: done.link, error: done.error });
  };
  const [pubProg, setPubProg] = useState<{ frac: number; text: string } | null>(null);
  const publishAll = async () => {
    const todo = sites.filter(s => s.wp !== 'live');
    let ok = 0;
    for (let i = 0; i < todo.length; i++) {
      setPubProg({ frac: i / todo.length, text: `Published ${i}/${todo.length} — ${todo[i].input.name.slice(0, 32)}` });
      patch(todo[i].key, { wp: 'busy' });
      const done = await publishOne(todo[i]);
      if (done.wp === 'live') ok++;
      patch(todo[i].key, { wp: done.wp, link: done.link, error: done.error });
    }
    setPubProg({ frac: 1, text: `Done: ${ok}/${todo.length} published` });
  };

  const live = sites.filter(s => s.wp === 'live');
  const exportResults = () => {
    const head = 'Name,City,Phone,Page Title,Demo Link,Short Link,WordPress URL,Status';
    const body = sites.map(s => [s.input.name, s.page.city, s.input.phone, s.page.title, s.demoUrl, s.shortUrl || '', s.link || '',
      s.wp === 'live' ? 'Live' : s.error || 'Not published'].map(v => csvQ(String(v))).join(','));
    download('realtor-results.csv', [head, ...body].join('\n'), 'text/csv');
  };
  const [copied, setCopied] = useState(false);
  const copyLive = () => {
    navigator.clipboard.writeText(live.map(s => `${s.input.name} (${s.page.city}): ${s.link}`).join('\n'));
    setCopied(true); setTimeout(() => setCopied(false), 1600);
  };

  const wpStatus = (s: Site) =>
    s.wp === 'live' ? <a href={s.link} target="_blank" rel="noopener noreferrer">✅ {s.link}</a>
      : s.wp === 'busy' ? <span className="st y">Publishing…</span>
        : s.wp === 'error' ? <span className="st r" style={{ whiteSpace: 'normal' }}>❌ {s.error}</span>
          : <span style={{ color: 'var(--muted)' }}>—</span>;

  const host = conn ? conn.base.replace(/^https?:\/\//, '') : '';

  return (
    <div className="rd"><div className="shell">
      {/* ======================= RAIL ======================= */}
      <aside className="rail" aria-label="Steps">
        <div className="brand"><span className="logo">RE</span><div><b>Realtor<br />Engine</b><small>Realtor landing pages · US &amp; Canada</small></div></div>
        <nav className="steps">
          <a href="#rd-wp" className={conn ? 'done' : ''}><span className="n">0</span><span>WordPress<small>{conn ? host : 'Connect nahi hai'}</small></span></a>
          <a href="#rd-gen" className={sites.length ? 'done' : ''}><span className="n">1</span><span>Generate Pages<small>Manual ya CSV</small></span></a>
          <a href="#rd-prev" className={sites.length ? 'done' : ''}><span className="n">2</span><span>Preview &amp; Download<small>Har page dekhein</small></span></a>
          <a href="#rd-pub" className={live.length ? 'done' : ''}><span className="n">3</span><span>Publish<small>WordPress par live</small></span></a>
        </nav>
        <div className="meters">
          <div className="meter"><b>{sites.length}</b><span>Pages bane</span></div>
          <div className="meter"><b>{live.length}</b><span>Live hue</span></div>
          <div className="meter wide"><span className={`dot ${conn ? 'on' : ''}`} /><span>{conn ? `Connected · ${host}` : 'WordPress connect nahi'}</span></div>
        </div>
        <a className="rail-link" href={window.location.pathname}>← Demo website dekhein</a>
      </aside>

      {/* ======================= MAIN ======================= */}
      <main className="main">
        <header className="hero">
          <h1>Realtor ka naam, address, phone. <em>Poora landing page.</em></h1>
          <p>Har realtor ke liye SEO-ready page: "keyword in City" H1, services, property types, reviews, FAQ schema, call / WhatsApp / email buttons aur map — saath mein personalised demo link, aur ek click mein aapki WordPress site par live.</p>
        </header>

        {/* ---------- 0. WORDPRESS ---------- */}
        <section className="panel" id="rd-wp">
          <div className="ph"><span className="n">0</span><div><h2>🔌 WordPress connection</h2><p>WordPress REST API + Application Password. Ye details sirf aapke browser mein rehti hain.</p></div></div>
          <form style={{ display: 'grid', gap: 14 }} autoComplete="off" onSubmit={e => { e.preventDefault(); connect(); }}>
            <div className="f3">
              <label className="f" htmlFor="rd-url">WordPress site URL<input id="rd-url" value={wpUrl} onChange={e => setWpUrl(e.target.value)} placeholder="https://yourdomain.com" inputMode="url" /></label>
              <label className="f" htmlFor="rd-user">WordPress username<input id="rd-user" value={wpUser} onChange={e => setWpUser(e.target.value)} placeholder="admin" /></label>
              <label className="f" htmlFor="rd-pass">Application Password<input id="rd-pass" type="password" value={wpPass} onChange={e => setWpPass(e.target.value)} placeholder="xxxx xxxx xxxx xxxx xxxx xxxx" /></label>
            </div>
            <div className="bar">
              <button className="btn primary" type="submit" disabled={wpBusy}>{wpBusy ? 'Check ho raha hai…' : 'Connect & save'}</button>
              <label className="toggle" htmlFor="rd-rem"><input id="rd-rem" type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} /> Is browser mein yaad rakhein</label>
              <label className="f" style={{ display: 'flex', alignItems: 'center', gap: 8 }} htmlFor="rd-status">Publish as
                <select id="rd-status" value={pubStatus} onChange={e => setPubStatus(e.target.value as any)} style={{ width: 'auto' }}>
                  <option value="publish">Live</option><option value="draft">Draft</option>
                </select>
              </label>
              <span style={{ fontSize: 13, color: 'var(--muted)' }}>Password yahan se banta hai: WP Admin → Users → Profile → Application Passwords</span>
            </div>
          </form>
          {wpMsg && <div className={`alert ${wpMsg.ok ? 'ok' : 'bad'}`}>{wpMsg.ok ? '' : '❌ '}{wpMsg.text}</div>}
        </section>

        {/* ---------- 1. GENERATE ---------- */}
        <section className="panel" id="rd-gen">
          <div className="ph"><span className="n">1</span><div><h2>Generate Pages</h2><p>Realtors add karein, ek ek karke ya CSV se poori list.</p></div>
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
                  <input aria-label="How many realtors" type="number" min={1} max={50} value={entries.length} onChange={e => setCount(parseInt(e.target.value, 10))} />
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
                  <thead><tr><th>#</th><th>Name</th><th>City</th><th>Phone</th><th>Keyword</th></tr></thead>
                  <tbody>{csvRows.map((r, i) => (
                    <tr key={i}><td className="mono">{i + 1}</td><td><strong>{r.name}</strong>{r.agentName ? <><br /><span style={{ color: 'var(--muted)' }}>{r.agentName}</span></> : null}</td>
                      <td>{resolveCity(r.city, r.address)}</td><td className="mono">{r.phone}</td><td><span className="chip">{r.keyword || KEYWORDS[0]}</span></td></tr>
                  ))}</tbody>
                </table></div>
              )}
            </section>
          )}

          <div style={{ display: 'grid', gap: 14, paddingTop: 6, borderTop: '1px solid var(--line)' }}>
            <label className="toggle" htmlFor="rd-also"><input id="rd-also" type="checkbox" disabled={!conn} checked={alsoPublish && !!conn} onChange={e => setAlsoPublish(e.target.checked)} /> Also publish to WordPress right after generating</label>
            {!conn && <p style={{ margin: '-6px 0 0', color: 'var(--muted)', fontSize: 13 }}>One-click publishing ke liye upar WordPress connect karein.</p>}
            <button className="btn primary big" type="button" disabled={running || toBuild.length === 0} onClick={generate}>
              {alsoPublish && conn ? '🚀 Generate & Publish to WordPress' : '🚀 Generate Pages'}{toBuild.length > 1 ? ` (${toBuild.length})` : ''}
            </button>
            {prog && <div><div className="prog"><span style={{ width: `${prog.frac * 100}%` }} /></div><p className="ptext">{prog.text}</p></div>}
            {genMsg && <div className={`alert ${genMsg.ok ? 'ok' : 'bad'}`} dangerouslySetInnerHTML={{ __html: genMsg.html }} />}
          </div>

          {sites.length > 0 && (
            <section style={{ display: 'grid', gap: 12 }}>
              <h3>Results</h3>
              <div className="tbl"><table>
                <thead><tr><th>Realtor</th><th>Page H1</th><th>Demo link</th><th>WordPress</th></tr></thead>
                <tbody>{sites.map(s => (
                  <tr key={s.key}>
                    <td><strong>{s.input.name}</strong><br /><span className="mono" style={{ color: 'var(--muted)' }}>{s.input.phone}</span></td>
                    <td style={{ maxWidth: 260 }}>{s.page.title.split(' | ')[0]}<br /><span className="mono" style={{ color: 'var(--muted)' }}>/{s.page.slug}/</span></td>
                    <td style={{ maxWidth: 220 }}><a href={s.shortUrl || s.demoUrl} target="_blank" rel="noopener noreferrer">{s.shortUrl || 'Demo kholein ↗'}</a></td>
                    <td>{wpStatus(s)}</td>
                  </tr>
                ))}</tbody>
              </table></div>
              <div className="bar">
                <button className="btn" type="button" onClick={exportResults}>⬇️ results.csv</button>
              </div>
            </section>
          )}
        </section>

        {/* ---------- 2. PREVIEW ---------- */}
        <section className="panel" id="rd-prev">
          <div className="ph"><span className="n">2</span><div><h2>Preview &amp; Download</h2><p>Har bana hua page yahan khol kar dekhein aur <code>.html</code> download karein.</p></div></div>
          {sites.length === 0 ? <div className="empty">Pehle step 1 mein pages generate karein.</div> : (
            <div className="rows">{sites.map(s => (
              <details className="card" key={s.key}>
                <summary>📄 {s.input.name} <span className="chip">{s.page.city}</span></summary>
                <div className="card-body">
                  <div className="bar">
                    <button className="btn" type="button" onClick={() => download(`${s.page.slug}.html`, s.page.standaloneHtml)}>⬇️ Download .html</button>
                    <a className="btn ghost" href={s.demoUrl} target="_blank" rel="noopener noreferrer">Demo website ↗</a>
                    {s.wp === 'live' && <a className="btn ghost" href={s.link} target="_blank" rel="noopener noreferrer">WordPress page ↗</a>}
                  </div>
                  <div className="frame"><iframe title={`Preview of ${s.input.name}`} srcDoc={s.page.standaloneHtml} loading="lazy" /></div>
                </div>
              </details>
            ))}</div>
          )}
        </section>

        {/* ---------- 3. PUBLISH ---------- */}
        <section className="panel" id="rd-pub">
          <div className="ph"><span className="n">3</span><div><h2>Publish to WordPress</h2><p>Jo pages bina publish ke bane, ya dobara publish karne hon. Har page ko alag unique URL milta hai.</p></div></div>
          {sites.length === 0 ? <div className="empty">Pehle step 1 mein pages generate karein.</div> : (
            <section style={{ display: 'grid', gap: 14 }}>
              <div className="bar">
                <button className="btn primary" type="button" disabled={!conn || sites.every(s => s.wp === 'live')} onClick={publishAll}>🚀 Publish ALL</button>
                <strong>{sites.length} page(s) ready.</strong>
                <span style={{ color: 'var(--muted)', fontSize: 13 }}>{conn ? 'Har realtor ka alag page banta hai.' : 'Publish ke liye upar WordPress connect karein.'}</span>
              </div>
              {pubProg && <div><div className="prog"><span style={{ width: `${pubProg.frac * 100}%` }} /></div><p className="ptext">{pubProg.text}</p></div>}
              <div>{sites.map(s => (
                <div className="pub-row" key={s.key}>
                  <div><strong>{s.input.name}</strong><br /><span className="chip">{s.page.city}</span></div>
                  <div>{wpStatus(s)}</div>
                  <div><button className={`btn sm ${s.wp === 'live' ? '' : 'primary'}`} type="button" disabled={!conn || s.wp === 'busy'} onClick={() => publishSite(s.key)}>{s.wp === 'live' ? 'Re-publish' : 'Publish'}</button></div>
                </div>
              ))}</div>
            </section>
          )}
          {live.length > 0 && (
            <section style={{ display: 'grid', gap: 12 }}>
              <div className="bar" style={{ justifyContent: 'space-between' }}>
                <h3>Live URLs ({live.length})</h3>
                <div className="bar">
                  <button className="btn sm" type="button" onClick={copyLive}>{copied ? 'Copy ho gaya ✓' : 'Copy all'}</button>
                  <button className="btn sm" type="button" onClick={exportResults}>⬇️ CSV</button>
                </div>
              </div>
              <div className="tbl"><table>
                <thead><tr><th>Realtor</th><th>City</th><th>Live URL</th></tr></thead>
                <tbody>{live.map(s => (
                  <tr key={s.key}><td><strong>{s.input.name}</strong></td><td><span className="chip">{s.page.city}</span></td>
                    <td><a href={s.link} target="_blank" rel="noopener noreferrer">{s.link}</a></td></tr>
                ))}</tbody>
              </table></div>
            </section>
          )}
        </section>
      </main>
    </div></div>
  );
};

export default RealtorDashboard;
