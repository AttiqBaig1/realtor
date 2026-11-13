import React, { useEffect, useMemo, useState } from 'react';
import { BatchRealtorItem, RealtorProfile } from '../../types';
import { buildRealtorPage, RealtorPageInput } from '../../utils/realtorPage';
import { connectWp, loadSavedCreds, publishPage, saveCreds, WpConn } from '../../utils/wordpress';
import { useRealEstate } from '../../context/RealEstateContext';
import {
  Globe, Plug, CheckCircle2, AlertTriangle, Eye, Download, Send, Copy, Check, X, Loader2, ExternalLink, Rocket, FileSpreadsheet,
} from 'lucide-react';

interface Row {
  key: string;
  source: 'single' | 'bulk';
  input: RealtorPageInput;
  status: 'idle' | 'publishing' | 'live' | 'error';
  link?: string;
  error?: string;
}

const fromProfile = (p: Partial<RealtorProfile>): RealtorPageInput => ({
  name: p.name || '',
  agentName: p.agentName,
  city: p.city,
  address: p.address,
  phone: p.phone || '',
  email: p.email,
  whatsapp: p.whatsapp,
  keyword: p.primaryKeyword,
  salesVolume: p.salesVolume,
  experienceYears: p.experienceYears,
});

const fromBatch = (b: BatchRealtorItem): RealtorPageInput => ({
  name: b.name,
  agentName: b.agentName,
  city: b.city,
  address: b.address,
  phone: b.phone,
  email: b.email,
  whatsapp: b.whatsapp,
  keyword: b.keyword,
  salesVolume: b.salesVolume,
});

export const WordPressPublisher: React.FC<{
  single: Partial<RealtorProfile>;
  batch: BatchRealtorItem[];
  goToBulk: () => void;
}> = ({ single, batch, goToBulk }) => {
  const { showToast } = useRealEstate();
  const saved = loadSavedCreds();
  const [url, setUrl] = useState(saved?.url || '');
  const [user, setUser] = useState(saved?.user || '');
  const [pass, setPass] = useState(saved?.pass || '');
  const [remember, setRemember] = useState(true);
  const [conn, setConn] = useState<WpConn | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [connError, setConnError] = useState('');
  const [status, setStatus] = useState<'publish' | 'draft'>('publish');
  const [preview, setPreview] = useState<RealtorPageInput | null>(null);
  const [copied, setCopied] = useState(false);
  const [bulkRunning, setBulkRunning] = useState(false);

  const [rows, setRows] = useState<Row[]>([]);
  useEffect(() => {
    // keep publish results when the list is rebuilt
    setRows(prev => {
      const old = new Map(prev.map(r => [r.key, r]));
      const next: Row[] = [];
      if (single.name && single.phone) {
        const k = `single:${single.name}|${single.city}|${single.phone}`;
        next.push(old.get(k) || { key: k, source: 'single', input: fromProfile(single), status: 'idle' });
      }
      batch.forEach(b => {
        const k = `bulk:${b.id}`;
        next.push(old.get(k) || { key: k, source: 'bulk', input: fromBatch(b), status: 'idle' });
      });
      return next;
    });
  }, [single, batch]);

  const pages = useMemo(() => new Map(rows.map(r => [r.key, buildRealtorPage(r.input)])), [rows]);

  const connect = async (silent = false) => {
    if (!url || !user || !pass) {
      if (!silent) setConnError('Fill in all three: site URL, username and Application Password.');
      return;
    }
    setConnecting(true);
    setConnError('');
    const res = await connectWp({ url, user, pass });
    setConnecting(false);
    if (res.ok) {
      setConn(res.conn);
      saveCreds(remember ? { url, user, pass } : null);
      if (!silent) showToast(`Connected to ${res.conn.base} as ${res.conn.userName}`);
    } else {
      setConn(null);
      setConnError((res as { error: string }).error);
    }
  };
  useEffect(() => { if (saved) connect(true); /* eslint-disable-next-line */ }, []);

  const publishRow = async (key: string) => {
    if (!conn) return;
    const row = rows.find(r => r.key === key);
    const page = pages.get(key);
    if (!row || !page) return;
    setRows(rs => rs.map(r => (r.key === key ? { ...r, status: 'publishing', error: undefined } : r)));
    const res = await publishPage(conn, { title: page.title, slug: page.slug, content: page.wpContent, excerpt: page.excerpt }, status);
    setRows(rs => rs.map(r => (r.key === key
      ? (res.ok ? { ...r, status: 'live' as const, link: (res as { link: string }).link } : { ...r, status: 'error' as const, error: (res as { error: string }).error })
      : r)));
    return res.ok;
  };

  const publishAll = async () => {
    setBulkRunning(true);
    let ok = 0;
    const todo = rows.filter(r => r.status !== 'live');
    for (const r of todo) {
      if (await publishRow(r.key)) ok++;
    }
    setBulkRunning(false);
    showToast(`Published ${ok} of ${todo.length} pages to WordPress.`, ok === todo.length ? 'success' : 'error');
  };

  const download = (key: string) => {
    const page = pages.get(key);
    if (!page) return;
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(new Blob([page.standaloneHtml], { type: 'text/html' })),
      download: `${page.slug}.html`,
    });
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  };

  const live = rows.filter(r => r.status === 'live' && r.link);
  const copyLive = () => {
    navigator.clipboard.writeText(live.map(r => `${r.input.name} (${pages.get(r.key)?.city}): ${r.link}`).join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  const exportLive = () => {
    const q = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
    const csv = ['Name,City,Phone,Page Title,Live URL,Status']
      .concat(rows.map(r => [r.input.name, pages.get(r.key)?.city || '', r.input.phone, pages.get(r.key)?.title || '', r.link || '', r.status === 'live' ? 'Live' : r.error || 'Not published'].map(v => q(String(v))).join(',')))
      .join('\n');
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })), download: 'wordpress-live-pages.csv' });
    document.body.appendChild(a); a.click(); a.remove();
  };

  const input = 'w-full px-3.5 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500';

  return (
    <div className="space-y-6">
      {/* ---------------- connection ---------------- */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><Plug className="w-5 h-5 text-amber-400" />WordPress connection</h2>
            <p className="text-xs text-slate-400 mt-1">WordPress Admin → Users → Profile → <b className="text-slate-200">Application Passwords</b>. Saved only in this browser.</p>
          </div>
          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${conn ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-300 border-amber-500/30'}`}>
            <span className={`w-2 h-2 rounded-full ${conn ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            {conn ? `Connected · ${conn.base.replace(/^https?:\/\//, '')}` : 'Not connected'}
          </span>
        </div>
        <form className="grid gap-3 md:grid-cols-[2fr_1fr_1.4fr_auto] items-end" onSubmit={e => { e.preventDefault(); connect(); }} autoComplete="off">
          <label className="text-xs font-semibold text-slate-300 space-y-1.5 block">WordPress site URL<input className={input} value={url} onChange={e => setUrl(e.target.value)} placeholder="https://yourdomain.com" /></label>
          <label className="text-xs font-semibold text-slate-300 space-y-1.5 block">Username<input className={input} value={user} onChange={e => setUser(e.target.value)} placeholder="admin" /></label>
          <label className="text-xs font-semibold text-slate-300 space-y-1.5 block">Application Password<input className={input} type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="xxxx xxxx xxxx xxxx" /></label>
          <button type="submit" disabled={connecting} className="h-[46px] px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60">
            {connecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plug className="w-4 h-4" />}{connecting ? 'Checking…' : 'Connect'}
          </button>
        </form>
        <div className="flex flex-wrap items-center gap-5 text-xs text-slate-300">
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="accent-amber-500" checked={remember} onChange={e => setRemember(e.target.checked)} />Remember on this browser</label>
          <label className="flex items-center gap-2">Publish as
            <select className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-white" value={status} onChange={e => setStatus(e.target.value as any)}>
              <option value="publish">Live (published)</option>
              <option value="draft">Draft (review first)</option>
            </select>
          </label>
        </div>
        {connError && <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex gap-2"><AlertTriangle className="w-4 h-4 shrink-0" />{connError}</div>}
      </div>

      {/* ---------------- pages ---------------- */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><Globe className="w-5 h-5 text-amber-400" />Realtor pages ({rows.length})</h2>
            <p className="text-xs text-slate-400 mt-1">Each realtor gets a full landing page: “keyword in City” H1, services, FAQ schema, call / WhatsApp / email buttons and a map.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={goToBulk} className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 hover:text-white text-xs font-bold flex items-center gap-2"><FileSpreadsheet className="w-4 h-4" />Add realtors (CSV)</button>
            <button onClick={publishAll} disabled={!conn || bulkRunning || rows.every(r => r.status === 'live')} className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 text-xs font-bold flex items-center gap-2 disabled:opacity-40">
              {bulkRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />}Publish all to WordPress
            </button>
          </div>
        </div>
        {!conn && rows.length > 0 && <p className="text-xs text-amber-300/90">Connect WordPress above to publish. You can preview and download pages without connecting.</p>}

        {rows.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-400 border border-dashed border-slate-800 rounded-2xl">
            Fill in the <b className="text-slate-200">Single Demo Generator</b> tab, or load realtors in the <b className="text-slate-200">Bulk CSV</b> tab — they appear here ready to publish.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-sm">
              <thead className="bg-slate-950/70 text-[11px] uppercase tracking-wider text-slate-400">
                <tr><th className="text-left p-3">Realtor</th><th className="text-left p-3">Page H1</th><th className="text-left p-3">Status</th><th className="p-3"></th></tr>
              </thead>
              <tbody>
                {rows.map(r => {
                  const pg = pages.get(r.key)!;
                  return (
                    <tr key={r.key} className="border-t border-slate-800 align-top">
                      <td className="p-3">
                        <div className="font-bold text-white">{r.input.name}</div>
                        <div className="text-xs text-slate-400">{pg.city} · {r.input.phone}</div>
                        <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">{r.source === 'single' ? 'Single' : 'CSV'}</span>
                      </td>
                      <td className="p-3 text-slate-300 text-xs max-w-xs">{pg.title.split(' | ')[0]}<div className="text-slate-500 mt-1">/{pg.slug}/</div></td>
                      <td className="p-3 text-xs">
                        {r.status === 'live' && r.link && <a href={r.link} target="_blank" rel="noopener noreferrer" className="text-emerald-400 font-semibold inline-flex items-center gap-1 break-all"><CheckCircle2 className="w-4 h-4 shrink-0" />{r.link}</a>}
                        {r.status === 'publishing' && <span className="text-amber-300 inline-flex items-center gap-1"><Loader2 className="w-4 h-4 animate-spin" />Publishing…</span>}
                        {r.status === 'error' && <span className="text-rose-300">{r.error}</span>}
                        {r.status === 'idle' && <span className="text-slate-500">Not published</span>}
                      </td>
                      <td className="p-3">
                        <div className="flex justify-end gap-1.5">
                          <button title="Preview" onClick={() => setPreview(r.input)} className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-amber-300"><Eye className="w-4 h-4" /></button>
                          <button title="Download .html" onClick={() => download(r.key)} className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-amber-300"><Download className="w-4 h-4" /></button>
                          <button title="Publish" disabled={!conn || r.status === 'publishing'} onClick={() => publishRow(r.key)} className="px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 disabled:opacity-40"><Send className="w-3.5 h-3.5" />{r.status === 'live' ? 'Again' : 'Publish'}</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ---------------- live urls ---------------- */}
      {live.length > 0 && (
        <div className="p-6 rounded-3xl bg-emerald-950/30 border border-emerald-500/30 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-400" />Live URLs ({live.length})</h2>
            <div className="flex gap-2">
              <button onClick={copyLive} className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-white flex items-center gap-2">{copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}{copied ? 'Copied' : 'Copy all'}</button>
              <button onClick={exportLive} className="px-3.5 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold flex items-center gap-2"><Download className="w-4 h-4" />Export CSV</button>
            </div>
          </div>
          <ul className="space-y-2">
            {live.map(r => (
              <li key={r.key} className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-sm">
                <span className="text-white font-semibold">{r.input.name} <span className="text-slate-400 font-normal">· {pages.get(r.key)?.city}</span></span>
                <a href={r.link} target="_blank" rel="noopener noreferrer" className="text-emerald-400 inline-flex items-center gap-1 break-all">{r.link}<ExternalLink className="w-3.5 h-3.5" /></a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ---------------- preview modal ---------------- */}
      {preview && (
        <div className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setPreview(null)}>
          <div className="w-full max-w-6xl h-[90vh] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
              <span className="text-sm font-bold text-white truncate">{buildRealtorPage(preview).title}</span>
              <button onClick={() => setPreview(null)} className="p-2 rounded-lg hover:bg-slate-800 text-slate-300"><X className="w-4 h-4" /></button>
            </div>
            <iframe title="Page preview" className="flex-1 w-full bg-white" srcDoc={buildRealtorPage(preview).standaloneHtml} />
          </div>
        </div>
      )}
    </div>
  );
};
