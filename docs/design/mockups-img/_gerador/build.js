const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const SVG_DIR = path.join(ROOT, 'svg');
const PNG_DIR = path.join(ROOT, 'png');
const LOGO_DIR = path.join(ROOT, 'logos');

const CHROME = ['C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', 'D:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'].find((p) => fs.existsSync(p));

const args = process.argv.slice(2);
const noPng = args.includes('--no-png');
const filtros = args.filter((a) => !a.startsWith('--'));

fs.mkdirSync(SVG_DIR, { recursive: true });
fs.mkdirSync(PNG_DIR, { recursive: true });
fs.mkdirSync(LOGO_DIR, { recursive: true });

const files = fs
  .readdirSync(path.join(__dirname, 'screens'))
  .filter((f) => f.endsWith('.js'))
  .sort();

function png(svgPath, pngPath, w, h, scale) {
  const url = 'file:///' + svgPath.replace(/\\/g, '/');
  const r = spawnSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-sandbox', `--force-device-scale-factor=${scale}`, `--window-size=${w},${h}`, `--screenshot=${pngPath}`, url], { encoding: 'utf8' });
  if (r.status !== 0 && !fs.existsSync(pngPath)) console.error('falha png', pngPath, r.stderr);
}

function dims(svg) {
  const m = svg.match(/<svg[^>]*width="(\d+)" height="(\d+)"/);
  return [parseInt(m[1], 10), parseInt(m[2], 10)];
}

const { LOGOS, logoSvgArquivo, googleSvgArquivo } = require('./lib/logos');
Object.keys(LOGOS).forEach((id) => fs.writeFileSync(path.join(LOGO_DIR, `${id}.svg`), logoSvgArquivo(id)));
fs.writeFileSync(path.join(LOGO_DIR, 'google.svg'), googleSvgArquivo());

let count = 0;
for (const f of files) {
  const mod = require(path.join(__dirname, 'screens', f));
  if (filtros.length && !filtros.includes(mod.id)) continue;
  for (const vp of ['celular', 'desktop']) {
    const svg = mod[vp]();
    const name = `${mod.id}-${mod.slug}-${vp}`;
    const sp = path.join(SVG_DIR, `${name}.svg`);
    fs.writeFileSync(sp, svg);
    const [w, h] = dims(svg);
    if (!noPng) png(sp, path.join(PNG_DIR, `${name}.png`), w, h, vp === 'celular' ? 2 : 1);
    console.log(name, w, h);
    count++;
  }
  if (mod.extras) {
    for (const ex of mod.extras()) {
      const name = `${mod.id}-${mod.slug}-${ex.vp}-${ex.slug}`;
      const sp = path.join(SVG_DIR, `${name}.svg`);
      fs.writeFileSync(sp, ex.svg);
      const [w, h] = dims(ex.svg);
      if (!noPng) png(sp, path.join(PNG_DIR, `${name}.png`), w, h, ex.vp === 'celular' ? 2 : 1);
      console.log(name, w, h);
    }
  }
}
console.log('geradas', count);
