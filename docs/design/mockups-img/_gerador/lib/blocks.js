const { C, T, R, L, Ci, G, I, Ic, tw, fit, wrap, brl, pct, nfNum } = require('./core');
const K = require('./comp');
const { logo } = require('./logos');
const CH = require('./charts');
const D = require('../data');

const catColor = (c) => C.cat[c.cor];

const DOW = { '04/10': 'Domingo', '03/10': 'Sábado', '02/10': 'Sexta-feira', '01/10': 'Quinta-feira', '30/09': 'Quarta-feira', '29/09': 'Terça-feira' };

function catBadge(x, cy, c, o = {}) {
  const size = 13;
  const w = Math.min(o.max || 200, Math.ceil(8 + 12 + 6 + tw(c.nome, size, 500) + 10));
  let s = R(x + 0.5, cy - 12 + 0.5, w - 1, 23, { fill: C.neutralBg, stroke: C.neutralBorder, r: 11.5 });
  s += K.swatch(x + 9, cy, C.cat[c.cor], 12);
  s += T(x + 9 + 12 + 6, cy, c.nome, { size, weight: 500, fill: C.neutralText, max: w - 36 });
  return { s, w };
}

function chipsFor(x, cy, chips = []) {
  let s = '';
  let cx = x;
  chips.forEach((ch) => {
    let b;
    if (ch === 'interna') b = K.badge(cx, cy, 'Interna', 'neutral', 'swap', { chip: true });
    else if (ch === 'pendente') b = K.badge(cx, cy, 'Pendente', 'warning', 'hourglass', { chip: true });
    else if (ch.startsWith('parcela:')) b = K.badge(cx, cy, 'Parcela ' + ch.split(':')[1], 'neutral', 'calendarClock', { chip: true });
    else if (ch === 'manual') b = K.badge(cx, cy, 'Manual', 'info', 'penLine', { chip: true });
    else if (ch === 'dividida') b = K.badge(cx, cy, 'Dividida', 'neutral', 'split', { chip: true });
    s += b.s;
    cx += b.w + 6;
  });
  return s;
}

function valueKind(t) {
  if (t.chips && t.chips.includes('interna')) return 'internal';
  return t.v > 0 ? 'income' : 'expense';
}

function txItemMobile(x, y, w, t, o = {}) {
  const h = t.chips && t.chips.length ? 92 : 68;
  let s = '';
  const kind = valueKind(t);
  s += T(x + 16, y + 22, t.desc, { size: 16, weight: 500, max: w - 32 - 118 });
  s += K.money(x + w - 16, y + 22, t.v, { size: 16, weight: 500, anchor: 'end', kind, sign: t.v > 0 ? 'plus' : 'auto' });
  s += K.swatch(x + 16, y + 46, catColor(t.cat), 12);
  s += T(x + 34, y + 46, t.cat.nome, { size: 14, fill: C.muted });
  const cw = tw(t.cat.nome, 14);
  s += T(x + 34 + cw + 6, y + 46, '·', { size: 14, fill: C.muted });
  s += T(x + 34 + cw + 18, y + 46, t.conta, { size: 14, fill: C.muted, max: w - 34 - cw - 18 - 16 });
  if (t.chips && t.chips.length) s += chipsFor(x + 16, y + 74, t.chips);
  return { s, h };
}

function groupHeaderMobile(x, y, w, d) {
  const key = d.slice(0, 5);
  const label = `${DOW[key] || ''} · ${d.length === 5 ? d + '/2026' : d}`;
  let s = R(x, y, w, 32, { fill: C.surfaceSunken });
  s += T(x + 16, y + 16, label, { size: 12, weight: 600, fill: C.muted, ls: 0.72, upper: true });
  return { s, h: 32 };
}

function txListMobile(x, y, w, list, o = {}) {
  let yy = y;
  let s = '';
  let last = null;
  const inner = [];
  list.forEach((t, i) => {
    if (t.d !== last) {
      const g = groupHeaderMobile(x, yy, w, t.d);
      inner.push(g.s);
      yy += g.h;
      last = t.d;
    } else {
      inner.push(L(x + 16, yy + 0.5, x + w - 16, yy + 0.5, C.border));
    }
    const it = txItemMobile(x, yy, w, t, o);
    inner.push(it.s);
    yy += it.h;
  });
  const h = yy - y;
  s += `<clipPath id="cl-${Math.round(y)}-${list.length}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12"/></clipPath>`;
  s += K.card(x, y, w, h, { r: 12 });
  s += `<g clip-path="url(#cl-${Math.round(y)}-${list.length})">${inner.join('')}</g>`;
  s += R(x + 0.5, y + 0.5, w - 1, h - 1, { stroke: C.border, r: 11.5 });
  return { s, h };
}

function kpiDesktop(x, y, w, h, o) {
  let s = K.card(x, y, w, h);
  s += Ic(o.icon, x + 24 + 10, y + 26, 20, o.iconColor || C.muted);
  s += T(x + 24 + 28, y + 26, o.label, { size: 14, weight: 500, fill: C.muted });
  const size = o.big ? 36 : 28;
  s += T(x + 24, y + 62, o.value, { size, weight: o.big ? 700 : 600, fill: o.valueColor || C.text, tnum: true, ls: -0.02 * size });
  if (o.delta) s += o.delta(x + 24, y + h - 26);
  if (o.sub) s += T(x + 24, y + h - 26, o.sub, { size: 14, fill: C.muted });
  return { s, h };
}

function deltaPct(x, cy, dir, v, ref, fav) {
  const d = K.delta(x, cy, dir, pct(Math.abs(v), 1), fav);
  return d.s + T(x + d.w + 6, cy, ref, { size: 14, fill: C.muted });
}

const topCats = () => {
  const sorted = [...D.gastosCat].sort((a, b) => b.v - a.v);
  const top = sorted.slice(0, 5);
  const rest = sorted.slice(5);
  const restV = rest.reduce((a, r) => a + r.v, 0);
  return { top, rest, restV, total: D.despesas };
};

function donutBlock(cx, cy, r, th) {
  const { top, restV } = topCats();
  const slices = top.map((t) => ({ v: t.v, color: catColor(t.c) })).concat([{ v: restV, color: C.cat[11] }]);
  return CH.donut(cx, cy, r, th, slices, { center: ['Despesas', brl(D.despesas, { dec: false })], centerSize: r > 100 ? 20 : 17 });
}

function catList(x, y, w, rowH, o = {}) {
  const { top, rest, restV, total } = topCats();
  let s = '';
  const rows = top.map((t) => ({ nome: t.c.nome, v: t.v, color: catColor(t.c) })).concat([{ nome: `Demais (${rest.length})`, v: restV, color: C.cat[11] }]);
  rows.forEach((r, i) => {
    const cy = y + i * rowH + rowH / 2;
    s += K.swatch(x, cy, r.color, 12);
    s += T(x + 22, cy, r.nome, { size: 14, weight: 500, max: w - 22 - 150 });
    s += T(x + w, cy, brl(r.v), { size: 14, weight: 600, anchor: 'end', tnum: true });
    s += T(x + w - 100, cy, pct((r.v / total) * 100, 1), { size: 13, fill: C.muted, anchor: 'end', tnum: true });
    if (i < rows.length - 1 && !o.noDividers) s += L(x, y + (i + 1) * rowH + 0.5, x + w, y + (i + 1) * rowH + 0.5, C.grid);
  });
  return { s, h: rows.length * rowH };
}

function cardHeader(x, y, w, title, o = {}) {
  let s = T(x, y + 14, title, { size: o.size || 18, weight: 600 });
  if (o.seg) {
    const sw = o.seg.w || 156;
    s += K.segmented(x + w - sw, y, sw, 32, o.seg.opts, o.seg.active, { size: 13 }).s;
  }
  return s;
}

function legendItem(x, cy, color, label, o = {}) {
  let s = K.swatch(x, cy, color, 12);
  s += T(x + 20, cy, label, { size: 14 });
  return { s, w: 20 + tw(label, 14) };
}

function gastosCard(x, y, w, o = {}) {
  const wide = o.wide;
  const pad = wide ? 24 : 16;
  const dr = wide ? 100 : 88;
  const th = wide ? 30 : 26;
  const catRow = wide ? 40 : 40;
  const listH = 6 * catRow;
  let inner = '';
  inner += cardHeader(x + pad, y + pad, w - pad * 2, 'Gastos por categoria', { seg: { opts: ['Gráfico', 'Tabela'], active: 0, w: wide ? 152 : 136 } });
  const t0 = topCats().top[0];
  const sl = wrap(`${t0.c.nome} lidera com ${brl(t0.v)} (${pct((t0.v / D.despesas) * 100, 0)} do total).`, w - pad * 2, 14);
  sl.forEach((ln, i) => { inner += T(x + pad, y + pad + 50 + i * 20, ln, { size: 14, fill: C.muted }); });
  const sumY = y + pad + 40 + (sl.length - 1) * 20;
  let h;
  if (wide) {
    const cy = sumY + 40 + dr;
    inner += donutBlock(x + pad + dr + 10, cy, dr, th);
    const lx = x + pad + dr * 2 + 56;
    inner += catList(lx, sumY + 36, w - pad - (lx - x), catRow).s;
    h = Math.max(cy + dr + 16 + 24 + 20 - y, sumY + 36 + listH + 52 - y);
    inner += T(x + pad, y + h - 22, 'Despesas de 05/09 a 04/10/2026 · Atualizado há 12 min', { size: 12, fill: C.muted });
    const vb = K.btn(0, 0, 'Ver todas', { variant: 'ghost', h: 32, size: 14, iconEnd: 'chevR' });
    inner += K.btn(x + w - pad - vb.w, y + h - 22 - 16, 'Ver todas', { variant: 'ghost', h: 32, size: 14, iconEnd: 'chevR' }).s;
  } else {
    const cy = sumY + 36 + dr;
    inner += donutBlock(x + w / 2, cy, dr, th);
    const ly = cy + dr + 20;
    inner += catList(x + pad, ly, w - pad * 2, catRow).s;
    inner += K.btn(x + pad, ly + listH + 8, 'Ver todas as categorias', { variant: 'secondary', w: w - pad * 2, h: 44 }).s;
    inner += T(x + pad, ly + listH + 8 + 44 + 18, 'Despesas de 05/09 a 04/10/2026 · Atualizado há 12 min', { size: 12, fill: C.muted });
    h = ly + listH + 8 + 44 + 18 + 16 - y;
  }
  h = Math.max(h, o.minH || 0);
  return { s: K.card(x, y, w, h) + inner, h };
}

function fluxoCard(x, y, w, o = {}) {
  const wide = o.wide;
  const pad = wide ? 24 : 16;
  const ch = o.chartH || (wide ? 264 : 220);
  let s = cardHeader(x + pad, y + pad, w - pad * 2, 'Fluxo de caixa', { seg: wide && w > 520 ? { opts: ['6 meses', '12 meses'], active: 0, w: 176 } : undefined });
  const r = D.fluxo[5];
  const fl = wrap(`Em out/2026 entraram ${brl(r.a)} e saíram ${brl(r.b)}: resultado de ${brl(r.a - r.b, { sign: 'always' })}.`, w - pad * 2, 14);
  fl.forEach((ln, i) => { s += T(x + pad, y + pad + 40 + i * 20, ln, { size: 14, fill: C.muted }); });
  const cy = y + pad + 40 + fl.length * 20 + 12;
  s += CH.flowChart(x + pad, cy, w - pad * 2, ch, D.fluxo.map((d, i) => ({ ...d, focus: i === 5 })), { left: wide ? 60 : 52, barW: wide ? 24 : 18 });
  const ly = cy + ch + 14;
  const l1 = legendItem(x + pad, ly, C.income, 'Receitas');
  const l2 = legendItem(x + pad + l1.w + 20, ly, C.expense, 'Despesas');
  s += l1.s + l2.s;
  const foot = ly + 22;
  s += T(x + pad, foot + 8, 'Últimos 6 meses · Atualizado há 12 min', { size: 12, fill: C.muted });
  const h = Math.max(foot + 8 + 8 + pad - y, o.minH || 0);
  return { s: K.card(x, y, w, h) + s, h };
}

function patrimonioCard(x, y, w, o = {}) {
  const wide = o.wide;
  const pad = wide ? 24 : 16;
  const ch = o.chartH || (wide ? 232 : 220);
  let s = cardHeader(x + pad, y + pad, w - pad * 2, 'Evolução do patrimônio', wide ? { seg: { opts: ['3M', '6M', '1A', 'Tudo'], active: 1, w: 200 } } : {});
  let off = 0;
  if (!wide) {
    s += K.segmented(x + pad, y + pad + 34, w - pad * 2, 40, ['3M', '6M', '1A', 'Tudo'], 1, { size: 14 }).s;
    off = 48;
  }
  const pl = wrap(`Patrimônio líquido de ${brl(D.patrimonio)} em out/2026, +${pct(((D.patrimonio - D.patrimonioSerie[0].v) / D.patrimonioSerie[0].v) * 100, 1)} em 6 meses.`, w - pad * 2, 14);
  pl.forEach((ln, i) => { s += T(x + pad, y + pad + 50 + off + i * 20, ln, { size: 14, fill: C.muted }); });
  const cy = y + pad + 40 + off + pl.length * 20 + 12;
  const min = 60000;
  const max = 90000;
  s += CH.lineChart(x + pad, cy, w - pad * 2, ch, D.patrimonioSerie, { min, max, ticks: 3, left: wide ? 64 : 56, endLabel: brl(D.patrimonio), color: C.chart[0] });
  const foot = cy + ch + 12;
  const fn = wrap('Eixo não começa em zero. Patrimônio = contas + investimentos - faturas.', w - pad * 2, 12);
  fn.forEach((ln, i) => { s += T(x + pad, foot + 8 + i * 16, ln, { size: 12, fill: C.muted }); });
  const h = Math.max(foot + 8 + (fn.length - 1) * 16 + 8 + pad - y, o.minH || 0);
  return { s: K.card(x, y, w, h) + s, h };
}

function faturaRows(x, y, w, o = {}) {
  const wide = o.wide;
  const rows = [
    { c: D.cartoes[0], v: D.cartoes[0].fechada.valor, venc: '08/10/2026', dias: 3, urg: true },
    { c: D.cartoes[1], v: D.cartoes[1].fechada.valor, venc: '10/10/2026', dias: 5, urg: false },
  ];
  const rh = wide ? 72 : 76;
  let s = '';
  rows.forEach((r, i) => {
    const ry = y + i * rh;
    s += logo(r.c.inst, x, ry + (rh - 36) / 2, 36);
    s += T(x + 48, ry + 22, `${r.c.curto} •${r.c.final}`, { size: 16, weight: 500 });
    s += K.money(x + w, ry + 22, r.v, { size: 16, weight: 600, anchor: 'end' });
    if (r.urg) {
      const b = K.badge(x + 48, ry + 50, `Vence em ${r.dias} dias`, 'warning', 'triAlert');
      s += b.s;
      s += T(x + 48 + b.w + 8, ry + 50, r.venc, { size: 13, fill: C.muted, tnum: true });
    } else {
      s += Ic('calendarClock', x + 48 + 8, ry + 50, 16, C.muted);
      s += T(x + 48 + 22, ry + 50, `Vence em ${r.dias} dias · ${r.venc}`, { size: 14, fill: C.muted, tnum: true });
    }
    if (i < rows.length - 1) s += L(x, ry + rh - 0.5, x + w, ry + rh - 0.5, C.border);
  });
  return { s, h: rows.length * rh };
}

function faturasCard(x, y, w, o = {}) {
  const pad = o.wide ? 24 : 16;
  let s = T(x + pad, y + pad + 14, 'Faturas a vencer', { size: 18, weight: 600 });
  s += T(x + w - pad, y + pad + 14, brl(D.cartoes[0].fechada.valor + D.cartoes[1].fechada.valor), { size: 14, weight: 600, anchor: 'end', tnum: true, fill: C.muted });
  const f = faturaRows(x + pad, y + pad + 40, w - pad * 2, o);
  s += f.s;
  const by = y + pad + 40 + f.h + 12;
  s += K.btn(x + pad, by, 'Ver cartões', { variant: 'secondary', w: w - pad * 2, h: o.wide ? 40 : 44, size: o.wide ? 15 : 16 }).s;
  let ey = by + (o.wide ? 40 : 44) + 20;
  s += L(x + pad, ey - 8 + 0.5, x + w - pad, ey - 8 + 0.5, C.border);
  s += T(x + pad, ey + 10, 'Faturas abertas (ainda não fecharam)', { size: 13, weight: 600, fill: C.muted });
  ey += 28;
  D.cartoes.forEach((c) => {
    s += T(x + pad, ey + 12, `${c.curto} •${c.final} · fecha ${c.aberta.fecha.slice(0, 5)}`, { size: 14 });
    s += K.money(x + w - pad, ey + 12, c.aberta.valor, { size: 14, weight: 500, anchor: 'end' });
    ey += 28;
  });
  const h = Math.max(ey + pad - 8 - y, o.minH || 0);
  return { s: K.card(x, y, w, h) + s, h };
}

module.exports = { catColor, catBadge, chipsFor, valueKind, txItemMobile, groupHeaderMobile, txListMobile, kpiDesktop, deltaPct, topCats, donutBlock, catList, cardHeader, legendItem, gastosCard, fluxoCard, patrimonioCard, faturasCard, faturaRows, DOW };
