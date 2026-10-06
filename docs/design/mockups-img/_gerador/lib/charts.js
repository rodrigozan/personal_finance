const { C, T, R, L, Ci, G, tw, brl, nfNum } = require('./core');
const ctx = require('./ctx');

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

function grid(x, y, w, h, min, max, ticks, left) {
  let s = '';
  for (let i = 0; i <= ticks; i++) {
    const v = min + ((max - min) * i) / ticks;
    const yy = y + h - (h * i) / ticks;
    s += L(x, yy, x + w, yy, i === 0 && min === 0 ? C.borderStrong : C.grid);
    s += T(x - 8, yy, axisFmt(v), { size: 12, fill: C.axis, anchor: 'end', tnum: true });
  }
  return s;
}

function flowChart(x, y, w, h, data, o = {}) {
  const left = o.left || 52;
  const top = 8;
  const bottom = 28;
  const px = x + left;
  const pw = w - left - 4;
  const ph = h - top - bottom;
  const maxV = niceMax(Math.max(...data.flatMap((d) => [d.a, d.b])) * 1.05);
  const ticks = o.ticks || 4;
  let s = grid(px, y + top, pw, ph, 0, maxV, ticks, left);
  const gw = pw / data.length;
  const bw = Math.min(o.barW || 22, gw * 0.34);
  data.forEach((d, i) => {
    const cx = px + gw * i + gw / 2;
    const ha = (d.a / maxV) * ph;
    const hb = (d.b / maxV) * ph;
    s += R(cx - bw - 1.5, y + top + ph - ha, bw, ha, { fill: C.income, r: 3 });
    s += R(cx + 1.5, y + top + ph - hb, bw, hb, { fill: C.expense, r: 3 });
    s += T(cx, y + h - 10, d.l, { size: 12, fill: C.axis, anchor: 'middle' });
    if (d.focus) s += R(px + gw * i + 2, y + top - 2, gw - 4, ph + 4, { stroke: C.text, sw: 1.5, r: 6, dash: '3 3' });
  });
  return s;
}

function lineChart(x, y, w, h, pts, o = {}) {
  const left = o.left || 52;
  const top = 12;
  const bottom = 28;
  const px = x + left;
  const pw = w - left - 12;
  const ph = h - top - bottom;
  const vals = pts.map((p) => p.v);
  const min = o.min !== undefined ? o.min : 0;
  const max = o.max !== undefined ? o.max : niceMax(Math.max(...vals) * 1.05);
  const ticks = o.ticks || 4;
  const color = o.color || C.chart[0];
  let s = grid(px, y + top, pw, ph, min, max, ticks, left);
  const X = (i) => px + 10 + ((pw - 20) * i) / (pts.length - 1);
  const Y = (v) => y + top + ph - ((v - min) / (max - min)) * ph;
  const dashFrom = o.dashFrom === undefined ? pts.length : o.dashFrom;
  const real = pts.slice(0, dashFrom);
  if (o.area !== false && real.length > 1) {
    const d = real.map((p, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)} ${Y(p.v).toFixed(1)}`).join('') + `L${X(real.length - 1).toFixed(1)} ${y + top + ph}L${X(0).toFixed(1)} ${y + top + ph}Z`;
    s += `<path d="${d}" fill="${color}" fill-opacity="0.10"/>`;
  }
  if (real.length > 1) {
    const d = real.map((p, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)} ${Y(p.v).toFixed(1)}`).join('');
    s += `<path d="${d}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`;
  }
  if (dashFrom < pts.length) {
    const rest = pts.slice(dashFrom - 1);
    const d = rest.map((p, i) => `${i ? 'L' : 'M'}${X(dashFrom - 1 + i).toFixed(1)} ${Y(p.v).toFixed(1)}`).join('');
    s += `<path d="${d}" fill="none" stroke="${color}" stroke-width="2.5" stroke-dasharray="6 4" stroke-linecap="round"/>`;
  }
  const every = o.every || 1;
  pts.forEach((p, i) => {
    if (i % every === 0 || i === pts.length - 1) s += T(X(i), y + h - 10, p.l, { size: 12, fill: C.axis, anchor: 'middle' });
  });
  if (o.markers !== false) {
    const last = real.length - 1;
    s += Ci(X(last), Y(real[last].v), 5, { fill: color, stroke: C.surface, sw: 2 });
    if (o.endLabel) {
      const lx = X(last);
      s += T(lx, Y(real[last].v) - 14, o.endLabel, { size: 12, weight: 600, anchor: lx > px + pw - 60 ? 'end' : 'middle', tnum: true });
    }
  }
  return s;
}

function arcPath(cx, cy, r1, r2, a0, a1) {
  const p = (r, a) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  const large = a1 - a0 > Math.PI ? 1 : 0;
  const [x0, y0] = p(r2, a0);
  const [x1, y1] = p(r2, a1);
  const [x2, y2] = p(r1, a1);
  const [x3, y3] = p(r1, a0);
  return `M${x0.toFixed(2)} ${y0.toFixed(2)}A${r2} ${r2} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}L${x2.toFixed(2)} ${y2.toFixed(2)}A${r1} ${r1} 0 ${large} 0 ${x3.toFixed(2)} ${y3.toFixed(2)}Z`;
}

function donut(cx, cy, r, th, slices, o = {}) {
  const total = slices.reduce((a, s) => a + s.v, 0);
  let a = -Math.PI / 2;
  let s = '';
  slices.forEach((sl) => {
    const da = (sl.v / total) * Math.PI * 2;
    s += `<path d="${arcPath(cx, cy, r - th, r, a, a + da)}" fill="${sl.color}" stroke="${C.surface}" stroke-width="2" stroke-linejoin="round"/>`;
    a += da;
  });
  if (o.center) {
    s += T(cx, cy - 10, o.center[0], { size: 12, fill: C.muted, anchor: 'middle' });
    s += T(cx, cy + 10, o.center[1], { size: o.centerSize || 16, weight: 700, anchor: 'middle', tnum: true });
  }
  return s;
}

function stacked(x, y, w, h, parts, o = {}) {
  const total = parts.reduce((a, p) => a + p.v, 0);
  let cx = x;
  let s = '';
  parts.forEach((p, i) => {
    const pw = (p.v / total) * w;
    const draw = pw - (i < parts.length - 1 ? 2 : 0);
    s += R(cx, y, draw, h, { fill: p.color, r: 4 });
    cx += pw;
  });
  return s;
}

function sparkline(x, y, w, h, vals, color = C.chart[0]) {
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const X = (i) => x + (w * i) / (vals.length - 1);
  const Y = (v) => y + h - ((v - min) / (max - min || 1)) * h;
  const d = vals.map((v, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)} ${Y(v).toFixed(1)}`).join('');
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
}

function hatch(id, color) {
  ctx.addDef(id, `<pattern id="${id}" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="8" height="8" fill="#FFFFFF"/><rect width="3" height="8" fill="${color}"/></pattern>`);
  return `url(#${id})`;
}

function barsSimple(x, y, w, h, data, o = {}) {
  const left = o.left || 52;
  const top = 8;
  const bottom = 28;
  const px = x + left;
  const pw = w - left - 4;
  const ph = h - top - bottom;
  const maxV = niceMax(Math.max(...data.map((d) => d.v)) * 1.05);
  let s = grid(px, y + top, pw, ph, 0, maxV, o.ticks || 4, left);
  const gw = pw / data.length;
  const bw = Math.min(o.barW || 28, gw * 0.6);
  data.forEach((d, i) => {
    const cx = px + gw * i + gw / 2;
    const bh = (d.v / maxV) * ph;
    const fill = d.proj ? hatch('hp-' + (o.id || 'b'), o.color || C.chart[0]) : o.color || C.chart[0];
    s += R(cx - bw / 2, y + top + ph - bh, bw, bh, { fill, r: 3, stroke: d.proj ? o.color || C.chart[0] : undefined, sw: 1 });
    s += T(cx, y + h - 10, d.l, { size: 12, fill: C.axis, anchor: 'middle' });
  });
  return s;
}

module.exports = { axisFmt, niceMax, flowChart, lineChart, donut, stacked, sparkline, hatch, barsSimple, arcPath };
