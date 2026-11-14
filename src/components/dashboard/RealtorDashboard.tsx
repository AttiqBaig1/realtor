import React, { useEffect, useMemo, useState } from 'react';
import './rd.css';
import { useRealEstate } from '../../context/RealEstateContext';
import { buildSimpleLink, cityLabel, H1_OPTIONS, linkOrigin } from '../../utils/cleanLink';
import { saveShort, shortSlugFor } from '../../utils/demoStore';

/**
 * Realtor demo dashboard — one simple form.
 * Name + Address + Phone (+ H1 style) -> a short link such as
 * realtordemos.online/tania-ariosa (details saved via utils/demoStore).
 * The H1 on the demo uses the city from the address.
 * Saved demos stay in this browser and can be edited or deleted.
 * Open with ?dashboard. Uses the admin password.
 */

interface Saved { id: string; name: string; address: string; phone: string; h1: string; link: string; slug?: string; at: number }
const STORE = 'rd_saved_demos';
const loadSaved = (): Saved[] => { try { return JSON.parse(localStorage.getItem(STORE) || '[]'); } catch { return []; } };
const storeSaved = (list: Saved[]) => { try { localStorage.setItem(STORE, JSON.stringify(list)); } catch { /* */ } };
const pretty = (url: string) => url.replace(/^https?:\/\//, '');

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
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [h1, setH1] = useState(H1_OPTIONS[0].label);
  const [editing, setEditing] = useState<string | null>(null);
  const [saved, setSaved] = useState<Saved[]>(loadSaved());
  const [copied, setCopied] = useState('');

  const ready = name.trim() !== '' && address.trim() !== '';
  const city = address.trim() ? cityLabel(address) : '';
  const longLink = useMemo(() => (ready ? buildSimpleLink({ name, address, phone, h1 }, origin) : ''), [name, address, phone, h1, ready, origin]);
  const [result, setResult] = useState<{ link: string; forLong: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const link = result && result.forLong === longLink ? result.link : '';

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(key); setTimeout(() => setCopied(k => (k === key ? '' : k)), 1600);
  };
  const reset = () => { setName(''); setAddress(''); setPhone(''); setH1(H1_OPTIONS[0].label); setEditing(null); setResult(null); setErr(''); };

  const generate = async () => {
    if (!ready || busy) return;
    setBusy(true); setErr('');
    const old = editing ? saved.find(x => x.id === editing) : undefined;
    const keep = old?.slug && shortSlugFor(name) === old.slug.replace(/-\d+$/, '') ? old.slug : undefined;
    const r = await saveShort(name, longLink, keep);
    setBusy(false);
    if (r.ok === false) { setErr(r.error); return; }
    const short = `${origin}/${r.slug}`;
    setResult({ link: short, forLong: longLink });
    const item: Saved = { id: editing || String(Date.now()), name: name.trim(), address: address.trim(), phone: phone.trim(), h1, link: short, slug: r.slug, at: Date.now() };
    const list = editing ? saved.map(x => (x.id === editing ? item : x)) : [item, ...saved.filter(x => x.link !== short)];
    setSaved(list); storeSaved(list);
    setEditing(item.id);
    copy(short, 'main');
  };
  const edit = (x: Saved) => {
    setName(x.name); setAddress(x.address); setPhone(x.phone); setH1(x.h1); setEditing(x.id); setErr('');
    setResult({ link: x.link, forLong: buildSimpleLink({ name: x.name, address: x.address, phone: x.phone, h1: x.h1 }, origin) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const remove = (id: string) => { const list = saved.filter(x => x.id !== id); setSaved(list); storeSaved(list); if (editing === id) reset(); };
  useEffect(() => { document.title = 'Realtor Demo Links'; }, []);

  return (
    <div className="rd"><div className="simple">
      <header className="simple-top">
        <div className="brand"><span className="logo">RE</span><div><b>Realtor Demos</b><small>{pretty(origin)}</small></div></div>
        <a className="rail-link" href="/">Demo website ↗</a>
      </header>

      <section className="panel">
        <h2 style={{ margin: 0 }}>{editing ? '✏️ Demo edit karein' : 'Naya demo link'}</h2>
        <div className="simple-form">
          <label className="f" htmlFor="sd-name">Name<input id="sd-name" value={name} onChange={e => setName(e.target.value)} placeholder="Central Valley Prime Realty" autoFocus /></label>
          <label className="f" htmlFor="sd-addr">Address<input id="sd-addr" value={address} onChange={e => setAddress(e.target.value)} placeholder="7110 N Fresno St, Fresno, CA 93720" /></label>
          <label className="f" htmlFor="sd-phone">Phone<input id="sd-phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(559) 438-2200" inputMode="tel" /></label>
        </div>

        <div>
          <div className="simple-label">H1 heading</div>
          <div className="h1-opts" role="radiogroup" aria-label="H1 heading">
            {H1_OPTIONS.map(o => (
              <button key={o.label} type="button" role="radio" aria-checked={h1 === o.label} className={`h1-opt ${h1 === o.label ? 'on' : ''}`} onClick={() => setH1(o.label)}>{o.label}</button>
            ))}
          </div>
          <div className="h1-preview">{h1} in <em>{city || 'City, ST'}</em></div>
        </div>

        <div className="linkbox">
          {link ? (
            <>
              <a className="the-link" href={link} target="_blank" rel="noopener noreferrer">{pretty(link)}</a>
              <div className="bar">
                <button className="btn primary" type="button" onClick={() => copy(link, 'main')}>{copied === 'main' ? 'Copy ho gaya ✓' : '📋 Copy link'}</button>
                <a className="btn ghost" href={link} target="_blank" rel="noopener noreferrer">Demo dekhein ↗</a>
                <button className="btn ghost" type="button" onClick={reset}>＋ Naya demo</button>
              </div>
            </>
          ) : (
            <div className="bar">
              <button className="btn primary big" type="button" disabled={!ready || busy} onClick={generate}>
                {busy ? 'Link ban raha hai…' : editing ? '💾 Update link' : '🔗 Link banao'}
              </button>
              {editing && <button className="btn ghost" type="button" onClick={reset}>Cancel</button>}
              {!ready && <span style={{ color: 'var(--muted)' }}>Name aur Address likhein.</span>}
            </div>
          )}
          {err && <div className="alert bad">{err}</div>}
        </div>
      </section>

      {saved.length > 0 && (
        <section className="panel">
          <h2 style={{ margin: 0 }}>Saved demos ({saved.length})</h2>
          <div className="tbl"><table>
            <tbody>{saved.map(x => (
              <tr key={x.id} className={editing === x.id ? 'editing' : ''}>
                <td><strong>{x.name}</strong><br /><span style={{ color: 'var(--muted)' }}>{cityLabel(x.address)}{x.phone ? ` · ${x.phone}` : ''}</span><br />
                  <a href={x.link} target="_blank" rel="noopener noreferrer" style={{ wordBreak: 'break-all' }}>{pretty(x.link)}</a></td>
                <td style={{ whiteSpace: 'nowrap', textAlign: 'right' }}>
                  <button className="btn sm primary" type="button" onClick={() => copy(x.link, x.id)}>{copied === x.id ? '✓' : 'Copy'}</button>{' '}
                  <button className="btn sm" type="button" onClick={() => edit(x)}>Edit</button>{' '}
                  <button className="btn sm ghost" type="button" onClick={() => remove(x.id)} aria-label={`Delete ${x.name}`}>✕</button>
                </td>
              </tr>
            ))}</tbody>
          </table></div>
        </section>
      )}
    </div></div>
  );
};

export default RealtorDashboard;
