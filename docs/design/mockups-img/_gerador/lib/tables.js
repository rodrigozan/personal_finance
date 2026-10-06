const { C, T, R, L, Ic, tw, brl } = require('./core');
const K = require('./comp');
const B = require('./blocks');

function descCell(row, x, cy, w) {
  let chips = '';
  let cw = 0;
  (row.chips || []).forEach((ch) => {
    let b;
    if (ch === 'interna') b = K.badge(0, 0, 'Interna', 'neutral', 'swap', { chip: true });
    else if (ch === 'pendente') b = K.badge(0, 0, 'Pendente', 'warning', 'hourglass', { chip: true });
    else if (ch.startsWith('parcela:')) b = K.badge(0, 0, 'Parcela ' + ch.split(':')[1], 'neutral', 'calendarClock', { chip: true });
    cw += b.w + 6;
  });
  const maxT = w - cw;
  const txt = row.desc;
  const shown = require('./core').fit(txt, maxT, 14, 500);
  let s = T(x, cy, shown, { size: 14, weight: 500, fill: row.ignorada ? C.muted : C.text });
  let cx = x + tw(shown, 14, 500) + 8;
  (row.chips || []).forEach((ch) => {
    let b;
    if (ch === 'interna') b = K.badge(cx, cy, 'Interna', 'neutral', 'swap', { chip: true });
    else if (ch === 'pendente') b = K.badge(cx, cy, 'Pendente', 'warning', 'hourglass', { chip: true });
    else if (ch.startsWith('parcela:')) b = K.badge(cx, cy, 'Parcela ' + ch.split(':')[1], 'neutral', 'calendarClock', { chip: true });
    s += b.s;
    cx += b.w + 6;
  });
  return s;
}

function txTable(x, y, w, list, o = {}) {
  const { select, tags, menu, rh = 48, title, selectedIdx = [] } = o;
  const defs = [];
  if (select) defs.push({ k: 'sel', label: '', w: 28, r: (row, cx, cy) => K.checkbox(cx + 2, cy, row.sel) });
  defs.push({ k: 'd', label: 'Data', w: 96, r: (row, cx, cy) => T(cx, cy, row.d, { size: 14, tnum: true, fill: C.text }) });
  defs.push({ k: 'desc', label: 'Descrição', r: (row, cx, cy, cw) => descCell(row, cx, cy, cw) });
  defs.push({ k: 'cat', label: 'Categoria', w: 176, r: (row, cx, cy) => B.catBadge(cx, cy, row.cat).s });
  defs.push({ k: 'conta', label: 'Conta / Cartão', w: 176, r: (row, cx, cy, cw) => T(cx, cy, row.conta, { size: 14, fill: C.muted, max: cw }) });
  if (tags) defs.push({ k: 'tags', label: 'Tags', w: 120, r: (row, cx, cy) => (row.tag ? K.badge(cx, cy, row.tag, 'neutral', undefined, {}).s : '') });
  defs.push({
    k: 'v',
    label: 'Valor',
    w: 132,
    align: 'right',
    r: (row, cx, cy, cw) => K.money(cx + cw, cy, row.v, { size: 14, weight: 500, anchor: 'end', kind: B.valueKind(row), sign: row.v > 0 ? 'plus' : 'auto' }),
  });
  if (menu) defs.push({ k: 'm', label: '', w: 24, r: (row, cx, cy) => Ic('dotsV', cx + 12, cy, 20, C.muted) });
  const cols = K.colsFit(w, defs, 16, 16);
  let s = '';
  const head = K.tableHead(x, y, w, cols, { pad: 16, gap: 16 });
  const rows = K.tableRows(x, y + head.h, w, cols, list, { rh, pad: 16, gap: 16 });
  const h = head.h + rows.h;
  const id = `ct-${Math.round(x)}-${Math.round(y)}`;
  s += `<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12"/></clipPath>`;
  s += K.card(x, y, w, h);
  s += `<g clip-path="url(#${id})">${head.s}${rows.s}</g>`;
  s += R(x + 0.5, y + 0.5, w - 1, h - 1, { stroke: C.border, r: 11.5 });
  return { s, h };
}

module.exports = { txTable, descCell };
