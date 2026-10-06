const { brl } = require('./h');

let cid = 0;

function axisFmt(v) {
  if (v === 0) return 'R$ 0';
  if (Math.abs(v) >= 1000000) return `R$ ${(v / 1000000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} mi`;
  if (Math.abs(v) >= 1000) return `R$ ${(v / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} mil`;
  return `R$ ${Math.round(v)}`;
}

function niceMax(v) {
  const steps = [1, 2, 2.5, 4, 5, 8, 10];
  const mag = Math.pow(10, Math.floor(Math.log10(v)));
  for (const s of steps) if (s * mag >= v) return s * mag;
  return 10 * mag;
}

const f1 = (n) => (+n).toFixed(1);

function tx(x, y, str, o = {}) {
  const a = `x="${f1(x)}" y="${f1(y)}"${o.anchor ? ` text-anchor="${o.anchor}"` : ''} dominant-baseline="central"`;
  const cls = o.cls || 'ax';
  if (o.val) return `<text class="${cls} svg-val" ${a}>${str}</text><text class="${cls} svg-mask" ${a}>••••</text>`;
  return `<text class="${cls}" ${a}>${str}</text>`;
}

function grid(px, y, pw, ph, min, max, ticks) {
  let s = '';
  for (let i = 0; i <= ticks; i++) {
    const v = min + ((max - min) * i) / ticks;
    const yy = y + ph - (ph * i) / ticks;
    s += `<line class="${i === 0 && min === 0 ? 'gz' : 'gl'}" x1="${f1(px)}" x2="${f1(px + pw)}" y1="${f1(yy)}" y2="${f1(yy)}"/>`;
    s += tx(px - 8, yy, axisFmt(v), { anchor: 'end', val: true });
  }
  return s;
}

function svgWrap(W, H, inner, label) {
  return `<svg class="chart-svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${label}">${inner}</svg>`;
}

function flow(W, H, data, o = {}) {
  const left = o.left || 52;
  const top = 8;
  const bottom = 28;
  const px = left;
  const pw = W - left - 4;
  const ph = H - top - bottom;
  const maxV = niceMax(Math.max(...data.flatMap((d) => [d.a, d.b])) * 1.05);
  let s = grid(px, top, pw, ph, 0, maxV, o.ticks || 4);
  const gw = pw / data.length;
  const bw = Math.min(o.barW || 22, gw * 0.34);
  data.forEach((d, i) => {
    const cx = px + gw * i + gw / 2;
    const ha = (d.a / maxV) * ph;
    const hb = (d.b / maxV) * ph;
    s += `<rect class="b-inc" x="${f1(cx - bw - 1.5)}" y="${f1(top + ph - ha)}" width="${f1(bw)}" height="${f1(ha)}" rx="3"/>`;
    s += `<rect class="b-exp" x="${f1(cx + 1.5)}" y="${f1(top + ph - hb)}" width="${f1(bw)}" height="${f1(hb)}" rx="3"/>`;
    s += tx(cx, H - 10, d.l, { anchor: 'middle' });
    if (d.focus) s += `<rect class="b-focus" x="${f1(px + gw * i + 2)}" y="${top - 2}" width="${f1(gw - 4)}" height="${ph + 4}" rx="6"/>`;
  });
  return svgWrap(W, H, s, o.label || 'Gráfico de barras de receitas e despesas por mês');
}

function line(W, H, pts, o = {}) {
  const left = o.left || 52;
  const top = 14;
  const bottom = 28;
  const px = left;
  const pw = W - left - 12;
  const ph = H - top - bottom;
  const vals = pts.map((p) => p.v);
  const min = o.min !== undefined ? o.min : 0;
  const max = o.max !== undefined ? o.max : niceMax(Math.max(...vals) * 1.05);
  let s = grid(px, top, pw, ph, min, max, o.ticks || 4);
  const X = (i) => px + 10 + ((pw - 20) * i) / (pts.length - 1);
  const Y = (v) => top + ph - ((v - min) / (max - min)) * ph;
  const dashFrom = o.dashFrom === undefined ? pts.length : o.dashFrom;
  const real = pts.slice(0, dashFrom);
  const col = o.color || 'var(--chart-1)';
  if (o.area !== false && real.length > 1) {
    const d = real.map((p, i) => `${i ? 'L' : 'M'}${f1(X(i))} ${f1(Y(p.v))}`).join('') + `L${f1(X(real.length - 1))} ${top + ph}L${f1(X(0))} ${top + ph}Z`;
    s += `<path d="${d}" style="fill:${col}" fill-opacity="0.10"/>`;
  }
  if (real.length > 1) s += `<path d="${real.map((p, i) => `${i ? 'L' : 'M'}${f1(X(i))} ${f1(Y(p.v))}`).join('')}" fill="none" style="stroke:${col}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`;
  if (dashFrom < pts.length) {
    const rest = pts.slice(dashFrom - 1);
    s += `<path d="${rest.map((p, i) => `${i ? 'L' : 'M'}${f1(X(dashFrom - 1 + i))} ${f1(Y(p.v))}`).join('')}" fill="none" style="stroke:${col}" stroke-width="2.5" stroke-dasharray="6 4" stroke-linecap="round"/>`;
  }
  const every = o.every || 1;
  pts.forEach((p, i) => {
    if (i % every === 0 || i === pts.length - 1) s += tx(X(i), H - 10, p.l, { anchor: 'middle' });
  });
  const last = real.length - 1;
  s += `<circle class="dot" cx="${f1(X(last))}" cy="${f1(Y(real[last].v))}" r="5" style="fill:${col}"/>`;
  if (o.endLabel) {
    const lx = X(last);
    s += tx(lx, Y(real[last].v) - 14, o.endLabel, { anchor: lx > px + pw - 60 ? 'end' : 'middle', val: true, cls: 'ax ax--b' });
  }
  return svgWrap(W, H, s, o.label || 'Gráfico de linha');
}

function arc(cx, cy, r1, r2, a0, a1) {
  const p = (r, a) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  const large = a1 - a0 > Math.PI ? 1 : 0;
  const [x0, y0] = p(r2, a0);
  const [x1, y1] = p(r2, a1);
  const [x2, y2] = p(r1, a1);
  const [x3, y3] = p(r1, a0);
  return `M${x0.toFixed(2)} ${y0.toFixed(2)}A${r2} ${r2} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}L${x2.toFixed(2)} ${y2.toFixed(2)}A${r1} ${r1} 0 ${large} 0 ${x3.toFixed(2)} ${y3.toFixed(2)}Z`;
}

function donut(size, th, slices, center, label) {
  const r = size / 2;
  const total = slices.reduce((a, s) => a + s.v, 0);
  let a = -Math.PI / 2;
  let s = '';
  slices.forEach((sl) => {
    const da = (sl.v / total) * Math.PI * 2;
    s += `<path d="${arc(r, r, r - th, r - 1, a, a + da)}" style="fill:${sl.color}" class="slice"/>`;
    a += da;
  });
  if (center) {
    s += tx(r, r - 11, center[0], { anchor: 'middle', cls: 'ax ax--c' });
    s += tx(r, r + 11, center[1], { anchor: 'middle', val: true, cls: 'ax ax--cv' });
  }
  return svgWrap(size, size, s, label || 'Gráfico de rosca');
}

function bars(W, H, data, o = {}) {
  const left = o.left || 52;
  const top = 8;
  const bottom = 28;
  const px = left;
  const pw = W - left - 4;
  const ph = H - top - bottom;
  const maxV = niceMax(Math.max(...data.map((d) => d.v)) * 1.05);
  const id = `hp${++cid}`;
  let s = `<defs><pattern id="${id}" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="8" height="8" style="fill:var(--color-surface)"/><rect width="3" height="8" style="fill:var(--chart-1)"/></pattern></defs>`;
  s += grid(px, top, pw, ph, 0, maxV, o.ticks || 4);
  const gw = pw / data.length;
  const bw = Math.min(o.barW || 28, gw * 0.6);
  data.forEach((d, i) => {
    const cx = px + gw * i + gw / 2;
    const bh = (d.v / maxV) * ph;
    s += `<rect x="${f1(cx - bw / 2)}" y="${f1(top + ph - bh)}" width="${f1(bw)}" height="${f1(bh)}" rx="3" fill="url(#${id})" style="stroke:var(--chart-1)" stroke-width="1"/>`;
    s += tx(cx, H - 10, d.l, { anchor: 'middle' });
  });
  return { svg: svgWrap(W, H, s, o.label || 'Gráfico de barras'), id };
}

function hatchSwatch(idSvg) {
  return `<span class="sw sw--hatch" aria-hidden="true"></span>`;
}

const catColors = ['var(--category-1)', 'var(--category-2)', 'var(--category-3)', 'var(--category-4)', 'var(--category-5)', 'var(--category-6)', 'var(--category-7)', 'var(--category-8)', 'var(--category-9)', 'var(--category-10)', 'var(--category-11)', 'var(--category-12)'];
const chartVar = (i) => `var(--chart-${i + 1})`;

module.exports = { axisFmt, niceMax, flow, line, donut, bars, hatchSwatch, catColors, chartVar, tx, brl };
