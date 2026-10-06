const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');

const CHROME = ['C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', 'D:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'].find((p) => fs.existsSync(p));
const ROOT = path.join(__dirname, '..').replace(/\\/g, '/');
const TMP = path.join(os.tmpdir(), 'mockverif');
const OUT = path.join(TMP, 'capturas');
fs.mkdirSync(OUT, { recursive: true });
const args = process.argv.slice(2);
const pages = (args[0] || '').split(',').filter(Boolean);
const widths = (args[1] || '390,1440').split(',').map(Number);
const temas = (args[2] || 'claro').split(',');
const estados = (args[3] || 'data').split(',');
const extra = args[4] || '';

const get = (url) => new Promise((res, rej) => http.get(url, (r) => { let d = ''; r.on('data', (c) => (d += c)); r.on('end', () => res(d)); }).on('error', rej));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const prof = path.join(TMP, 'prof');
  const ch = spawn(CHROME, ['--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars', '--allow-file-access-from-files', '--remote-debugging-port=9333', `--user-data-dir=${prof}`, 'about:blank'], { stdio: 'ignore' });
  let list;
  for (let i = 0; i < 40; i++) {
    try { list = JSON.parse(await get('http://127.0.0.1:9333/json')); break; } catch (e) { await sleep(250); }
  }
  const tgt = list.find((t) => t.type === 'page');
  const ws = new WebSocket(tgt.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  let id = 0;
  const pend = {};
  let logs = [];
  ws.onmessage = (m) => {
    const d = JSON.parse(m.data);
    if (d.id && pend[d.id]) { pend[d.id](d); delete pend[d.id]; }
    if (d.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(d.params.type)) logs.push(d.params.type + ': ' + d.params.args.map((a) => a.value || a.description).join(' '));
    if (d.method === 'Runtime.exceptionThrown') logs.push('exception: ' + JSON.stringify(d.params.exceptionDetails.exception && d.params.exceptionDetails.exception.description));
    if (d.method === 'Log.entryAdded' && ['error', 'warning'].includes(d.params.entry.level)) logs.push('log ' + d.params.entry.level + ': ' + d.params.entry.text + ' ' + (d.params.entry.url || ''));
  };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Log.enable');
  const measure = `(() => {
    const vw = document.documentElement.clientWidth;
    const bad = [];
    document.querySelectorAll('body *').forEach((e) => {
      const cs = getComputedStyle(e);
      if (cs.display === 'none' || cs.visibility === 'hidden' || cs.position === 'fixed') return;
      if (e.closest('dialog:not([open])')) return;
      const r = e.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      if (r.right > vw + 1 || r.left < -1) {
        if (e.closest('.c-tabs') || e.closest('.c-table-wrap') || e.closest('.vz-main')) return;
        bad.push(e.tagName + '.' + (typeof e.className === 'string' ? e.className : '') + ' r=' + Math.round(r.right) + ' l=' + Math.round(r.left));
      }
    });
    const clipped = [];
    document.querySelectorAll('button, a, .badge, .c-button, h1, h2, h3, .money').forEach((e) => {
      const cs = getComputedStyle(e);
      if (cs.display === 'none' || e.offsetParent === null) return;
      if (e.scrollWidth > e.clientWidth + 2 && cs.overflow !== 'visible' && cs.textOverflow !== 'ellipsis') clipped.push(e.tagName + '.' + e.className + ' "' + (e.textContent || '').trim().slice(0, 30) + '"');
    });
    return JSON.stringify({ sw: document.documentElement.scrollWidth, vw, sh: document.documentElement.scrollHeight, bad: bad.slice(0, 8), clipped: clipped.slice(0, 8) });
  })()`;
  for (const p of pages) for (const w of widths) for (const t of temas) for (const e of estados) {
    logs = [];
    const mobile = w < 768;
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: 900, deviceScaleFactor: mobile ? 2 : 1, mobile: false });
    const url = `file:///${ROOT}/${p}.html?tema=${t}&estado=${e}${extra}`;
    await send('Page.navigate', { url });
    await sleep(1200);
    if (args[5]) {
      const r = await send('Runtime.evaluate', { expression: args[5], returnByValue: true, awaitPromise: true });
      if (r.result && r.result.result && r.result.result.value !== undefined) console.log('  js:', JSON.stringify(r.result.result.value));
      await sleep(400);
    }
    const m = await send('Runtime.evaluate', { expression: measure, returnByValue: true });
    const info = JSON.parse(m.result.result.value);
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: Math.min(info.sh, 9000), deviceScaleFactor: mobile ? 2 : 1, mobile: false });
    await sleep(300);
    const s = await send('Page.captureScreenshot', { format: 'png' });
    const name = `${p}-${w}-${t}-${e}.png`;
    fs.writeFileSync(path.join(OUT, name), Buffer.from(s.result.data, 'base64'));
    console.log(name, 'sh=' + info.sh, info.sw > info.vw ? 'OVERFLOW sw=' + info.sw : 'ok', info.bad.length ? 'bad=' + JSON.stringify(info.bad) : '', info.clipped.length ? 'clip=' + JSON.stringify(info.clipped) : '', logs.length ? 'LOGS=' + JSON.stringify(logs) : '');
  }
  ws.close();
  ch.kill();
  process.exit(0);
})();
