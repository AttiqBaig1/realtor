import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { lookupShort, SHORT_MAX } from './utils/demoStore';

const root = createRoot(document.getElementById('root')!);
const render = () => root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Short demo link (realtordemos.online/tania-ariosa): find its full demo first.
const seg = decodeURIComponent(window.location.pathname).split('/').filter(Boolean).pop() || '';
const isShort = seg && seg.length <= SHORT_MAX && !/\.[a-z0-9]{2,5}$/i.test(seg) && !/-\d{10}$/.test(seg)
  && !new URLSearchParams(window.location.search).has('dashboard');

if (isShort) {
  document.getElementById('root')!.innerHTML =
    '<div style="min-height:100vh;display:grid;place-items:center;background:#020617;color:#94a3b8;font:14px system-ui">' +
    '<div style="text-align:center"><div style="width:34px;height:34px;margin:0 auto 12px;border:3px solid rgba(212,175,55,.25);border-top-color:#d4af37;border-radius:50%;animation:rdspin .8s linear infinite"></div>Loading…</div>' +
    '<style>@keyframes rdspin{to{transform:rotate(360deg)}}</style></div>';
  lookupShort(seg).then(longPath => {
    if (longPath) (window as any).__RD_PATH = longPath;
  }).finally(render);
} else {
  render();
}
