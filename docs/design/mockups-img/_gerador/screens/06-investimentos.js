const { C, T, R, L, G, Ic, tw, brl, pct, wrap } = require('../lib/core');
const K = require('../lib/comp');
const B = require('../lib/blocks');
const CH = require('../lib/charts');
const { logo } = require('../lib/logos');
const { mobileShell, desktopShell } = require('../lib/shell');
const D = require('../data');

const clsIcon = { 'Renda fixa': 'landmark', 'Renda variável': 'trendUp', Previdência: 'shield', Outros: 'wallet' };
const clsColor = (i) => C.chart[i];
const evol = [
  { l: 'mai', v: 55820.4 },
  { l: 'jun', v: 57210.15 },
  { l: 'jul', v: 58632.8 },
  { l: 'ago', v: 60105.35 },
  { l: 'set', v: 62340.1 },
  { l: 'out', v: D.invAtual },
];

function rentCell(x, cy, it, o = {}) {
  const v = it.atual - it.aplicado;
  const p = (v / it.aplicado) * 100;
  const up = v >= 0;
  const col = up ? C.income : C.expense;
  let s = Ic(up ? 'arrowUp' : 'arrowDown', x + (o.anchor === 'end' ? -8 : 8), cy, 16, col, 2.2);
  const txt = `${brl(v, { sign: 'plus' })} (${pct(p, 1, true)})`;
  if (o.anchor === 'end') {
    s = T(x, cy, txt, { size: o.size || 14, weight: 500, fill: col, anchor: 'end', tnum: true });
    s += Ic(up ? 'arrowUp' : 'arrowDown', x - tw(txt, o.size || 14, 500, true) - 12, cy, 16, col, 2.2);
  } else {
    s += T(x + 20, cy, txt, { size: o.size || 14, weight: 500, fill: col, tnum: true });
  }
  return s;
}

function allocBar(x, y, w) {
  const parts = D.invClasses.map((c, i) => ({ v: c.atual, color: clsColor(i) }));
  return CH.stacked(x, y, w, 24, parts);
}

function itemMobile(x, y, w, it) {
  const h = 92;
  let s = '';
  s += T(x + 16, y + 22, it.nome, { size: 16, weight: 500, max: w - 32 - 120 });
  s += K.money(x + w - 16, y + 22, it.atual, { size: 16, weight: 600, anchor: 'end' });
  s += logo(it.inst, x + 16, y + 38, 20);
  s += T(x + 44, y + 48, it.instNome, { size: 14, fill: C.muted });
  if (it.manual) s += K.badge(x + 16 + tw(it.nome, 16, 500) + 8, y + 22, 'Manual', 'info', 'penLine', { chip: true }).s;
  s += rentCell(x + w - 16, y + 48, it, { anchor: 'end', size: 13 });
  s += T(x + 16, y + 76, `Aplicado ${brl(it.aplicado)}`, { size: 13, fill: C.muted, tnum: true });
  s += T(x + w - 16, y + 76, it.venc ? `Vence em ${it.venc}` : 'Vencimento: —', { size: 13, fill: C.muted, anchor: 'end', tnum: true });
  return { s, h };
}

function classSectionMobile(x, y, w, c, i) {
  let s = '';
  s += Ci2(x + 20, y + 20, clsColor(i), clsIcon[c.nome]);
  s += T(x + 48, y + 14, c.nome, { size: 16, weight: 600 });
  s += T(x + 48, y + 34, `${pct((c.atual / D.invAtual) * 100, 1)} da carteira`, { size: 13, fill: C.muted });
  s += K.money(x + w, y + 24, c.atual, { size: 16, weight: 600, anchor: 'end' });
  let yy = y + 48;
  const rows = [];
  c.itens.forEach((it) => {
    const r = itemMobile(x, yy, w, it);
    rows.push({ r, y: yy });
    yy += r.h;
  });
  const h = yy - (y + 48);
  s += K.card(x, y + 48, w, h);
  rows.forEach((o, i2) => {
    s += o.r.s;
    if (i2 < rows.length - 1) s += L(x + 16, o.y + o.r.h + 0.5, x + w - 16, o.y + o.r.h + 0.5, C.border);
  });
  return { s, h: 48 + h };
}

function Ci2(cx, cy, color, icon) {
  return `<circle cx="${cx}" cy="${cy}" r="18" fill="${C.surface}" stroke="${color}" stroke-width="2"/>` + Ic(icon, cx, cy, 18, color, 2);
}

function celular() {
  return mobileShell({
    title: 'Investimentos',
    active: 'investimentos',
    body: (x, y, w) => {
      const f = new K.Flow(x, y, w, 16);
      f.add((fx, fy, fw) => K.btn(fx, fy, 'Investimento manual', { variant: 'secondary', w: fw, h: 44, icon: 'plus' }));
      f.add((fx, fy, fw) => {
        const h = 304;
        let s = K.card(fx, fy, fw, h);
        s += T(fx + 16, fy + 24, 'Valor atual', { size: 14, weight: 500, fill: C.muted });
        s += T(fx + 16, fy + 62, brl(D.invAtual), { size: 32, weight: 700, tnum: true, ls: -0.64 });
        s += L(fx + 16, fy + 90.5, fx + fw - 16, fy + 90.5, C.border);
        s += T(fx + 16, fy + 112, 'Aplicado', { size: 13, fill: C.muted });
        s += K.money(fx + 16, fy + 134, D.invAplicado, { size: 16, weight: 600 });
        s += T(fx + fw / 2 + 4, fy + 112, 'Rentabilidade', { size: 13, fill: C.muted });
        const d = K.delta(fx + fw / 2 + 4, fy + 134, 'up', pct((D.invRent / D.invAplicado) * 100, 1), true, { size: 14 });
        s += d.s;
        s += K.money(fx + fw / 2 + 4, fy + 156, D.invRent, { size: 16, weight: 600, kind: 'income', sign: 'plus' });
        s += T(fx + 16, fy + 188, 'Alocação por classe', { size: 13, weight: 600, fill: C.muted });
        s += allocBar(fx + 16, fy + 200, fw - 32);
        D.invClasses.forEach((c, i) => {
          const lxx = fx + 16 + (i % 2) * ((fw - 32) / 2);
          const lyy = fy + 246 + Math.floor(i / 2) * 26;
          s += K.swatch(lxx, lyy, clsColor(i), 12);
          s += T(lxx + 20, lyy, `${c.nome} ${pct((c.atual / D.invAtual) * 100, 0)}`, { size: 13 });
        });
        return { s, h };
      });
      f.add((fx, fy, fw) => K.tabs(fx, fy, fw, ['Carteira', 'Alocação', 'Evolução', 'Movim.'], 0, { equal: true }), 8);
      D.invClasses.forEach((c, i) => f.add((fx, fy, fw) => classSectionMobile(fx, fy, fw, c, i), 20));
      f.add((fx, fy, fw) => {
        const h = 330;
        let s = K.card(fx, fy, fw, h);
        s += T(fx + 16, fy + 28, 'Evolução do valor atual', { size: 18, weight: 600 });
        s += K.segmented(fx + 16, fy + 48, fw - 32, 40, ['3M', '6M', '1A', 'Tudo'], 1, { size: 14 }).s;
        s += CH.lineChart(fx + 16, fy + 100, fw - 32, 190, evol, { min: 50000, max: 70000, ticks: 2, left: 56, endLabel: brl(D.invAtual) });
        s += T(fx + 16, fy + 308, 'Eixo não começa em zero · Valor atual da carteira', { size: 12, fill: C.muted });
        return { s, h };
      });
      return { s: f.s, h: f.h };
    },
  });
}

function classCardD(x, y, w, c, i) {
  const rh = 52;
  const hh = 64;
  const h = hh + 44 + c.itens.length * rh;
  let s = K.card(x, y, w, h);
  s += Ci2(x + 40, y + 32, clsColor(i), clsIcon[c.nome]);
  s += T(x + 70, y + 24, c.nome, { size: 16, weight: 600 });
  s += T(x + 70, y + 44, `${pct((c.atual / D.invAtual) * 100, 1)} da carteira · ${c.itens.length} ${c.itens.length === 1 ? 'investimento' : 'investimentos'}`, { size: 13, fill: C.muted });
  s += K.money(x + w - 24, y + 32, c.atual, { size: 20, weight: 600, anchor: 'end' });
  const defs = [
    { label: 'Nome', r: (it, cx, cy, cw) => {
      let o = T(cx, cy, it.nome, { size: 14, weight: 500, max: cw - (it.manual ? 80 : 0) });
      if (it.manual) o += K.badge(cx + tw(it.nome, 14, 500) + 8, cy, 'Manual', 'info', 'penLine', { chip: true }).s;
      return o;
    } },
    { label: 'Instituição', w: 190, r: (it, cx, cy, cw) => logo(it.inst, cx, cy - 10, 20) + T(cx + 28, cy, it.instNome, { size: 14, fill: C.muted, max: cw - 28 }) },
    { label: 'Aplicado', w: 120, align: 'right', r: (it, cx, cy, cw) => K.money(cx + cw, cy, it.aplicado, { size: 14, anchor: 'end' }) },
    { label: 'Atual', w: 120, align: 'right', r: (it, cx, cy, cw) => K.money(cx + cw, cy, it.atual, { size: 14, weight: 600, anchor: 'end' }) },
    { label: 'Rentabilidade', w: 210, align: 'right', r: (it, cx, cy, cw) => rentCell(cx + cw, cy, it, { anchor: 'end' }) },
    { label: 'Vencimento', w: 110, r: (it, cx, cy) => (it.venc ? T(cx, cy, it.venc, { size: 14, tnum: true }) : T(cx, cy, '—', { size: 14, fill: C.muted })) },
    { label: '', w: 24, r: (it, cx, cy) => (it.manual ? Ic('dotsV', cx + 12, cy, 20, C.muted) : '') },
  ];
  const cols = K.colsFit(w, defs, 16, 24);
  const head = K.tableHead(x, y + hh, w, cols, { h: 44, pad: 24, gap: 16 });
  const rows = K.tableRows(x, y + hh + 44, w, cols, c.itens, { rh, pad: 24, gap: 16 });
  const id = `ic-${i}`;
  s += `<clipPath id="${id}"><rect x="${x}" y="${y + hh}" width="${w}" height="${h - hh}" rx="0"/></clipPath>`;
  s += L(x, y + hh - 0.5, x + w, y + hh - 0.5, C.border);
  s += head.s + rows.s;
  return { s, h };
}

function desktop() {
  return desktopShell({
    title: 'Investimentos',
    active: 'investimentos',
    body: (x, y, w) => {
      const f = new K.Flow(x, y, w, 24);
      f.add((fx, fy, fw) => {
        const b = K.btn(0, 0, 'Investimento manual', { variant: 'secondary', h: 40, size: 15, icon: 'plus' });
        return { s: K.btn(fx + fw - b.w, fy, 'Investimento manual', { variant: 'secondary', h: 40, size: 15, icon: 'plus' }).s, h: 40 };
      }, 16);
      const c3 = K.cols(x, w, 24, [4, 4, 4]);
      const kh = 128;
      let ks = '';
      ks += K.card(c3[0].x, f.y, c3[0].w, kh) + T(c3[0].x + 24, f.y + 28, 'Valor atual', { size: 14, weight: 500, fill: C.muted }) + T(c3[0].x + 24, f.y + 70, brl(D.invAtual), { size: 32, weight: 700, tnum: true, ls: -0.64 }) + T(c3[0].x + 24, f.y + 104, '7 investimentos · 4 instituições e 1 manual', { size: 14, fill: C.muted });
      ks += K.card(c3[1].x, f.y, c3[1].w, kh) + T(c3[1].x + 24, f.y + 28, 'Valor aplicado', { size: 14, weight: 500, fill: C.muted }) + T(c3[1].x + 24, f.y + 70, brl(D.invAplicado), { size: 28, weight: 600, tnum: true, ls: -0.56 }) + T(c3[1].x + 24, f.y + 104, 'Soma dos aportes líquidos', { size: 14, fill: C.muted });
      const rc = c3[2];
      ks += K.card(rc.x, f.y, rc.w, kh) + T(rc.x + 24, f.y + 28, 'Rentabilidade', { size: 14, weight: 500, fill: C.muted }) + T(rc.x + 24, f.y + 70, brl(D.invRent, { sign: 'always' }), { size: 28, weight: 600, tnum: true, fill: C.income, ls: -0.56 });
      const dd = K.delta(rc.x + 24, f.y + 104, 'up', pct((D.invRent / D.invAplicado) * 100, 1), true, { size: 14 });
      ks += dd.s + T(rc.x + 24 + dd.w + 6, f.y + 104, 'desde o início', { size: 14, fill: C.muted });
      f.add({ s: ks, h: kh });
      const c2 = K.cols(x, w, 24, [5, 7]);
      f.add((fx, fy, fw) => {
        const h = 340;
        let s = K.card(c2[0].x, fy, c2[0].w, h) + K.card(c2[1].x, fy, c2[1].w, h);
        const a = c2[0];
        s += T(a.x + 24, fy + 36, 'Alocação por classe', { size: 20, weight: 600 });
        s += CH.donut(a.x + 24 + 90, fy + 170, 90, 28, D.invClasses.map((c, i) => ({ v: c.atual, color: clsColor(i) })), { center: ['Total', brl(D.invAtual, { dec: false })], centerSize: 15 });
        const lx = a.x + 24 + 200;
        D.invClasses.forEach((c, i) => {
          const cy = fy + 96 + i * 44;
          s += K.swatch(lx, cy, clsColor(i), 12);
          s += T(lx + 20, cy - 8, c.nome, { size: 14, weight: 500 });
          s += T(lx + 20, cy + 12, `${pct((c.atual / D.invAtual) * 100, 1)} · ${brl(c.atual)}`, { size: 13, fill: C.muted, tnum: true });
        });
        s += T(a.x + 24, fy + h - 20, 'Posição em 05/10/2026', { size: 12, fill: C.muted });
        const e = c2[1];
        s += T(e.x + 24, fy + 36, 'Evolução do valor atual', { size: 20, weight: 600 });
        s += K.segmented(e.x + e.w - 24 - 200, fy + 20, 200, 32, ['3M', '6M', '1A', 'Tudo'], 1, { size: 13 }).s;
        s += CH.lineChart(e.x + 24, fy + 64, e.w - 48, 240, evol, { min: 50000, max: 70000, ticks: 4, left: 64, endLabel: brl(D.invAtual) });
        s += T(e.x + 24, fy + h - 20, 'Eixo não começa em zero · Valor atual da carteira', { size: 12, fill: C.muted });
        return { s, h };
      });
      f.add((fx, fy, fw) => K.tabs(fx, fy, fw, ['Carteira', 'Alocação', 'Evolução', 'Movimentações'], 0), 8);
      D.invClasses.forEach((c, i) => f.add((fx, fy, fw) => classCardD(fx, fy, fw, c, i)));
      return { s: f.s, h: f.h };
    },
  });
}

module.exports = { id: '06', slug: 'investimentos', nome: 'Investimentos', celular, desktop };
