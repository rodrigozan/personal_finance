const { C, T, R, L, G, Ic, tw, brl, pct, wrap } = require('../lib/core');
const K = require('../lib/comp');
const B = require('../lib/blocks');
const { mobileShell, desktopShell } = require('../lib/shell');
const D = require('../data');

const arvore = [
  { c: D.cat.moradia, tipo: 'Despesa', n: 48, open: true, subs: ['Aluguel', 'Condomínio', 'Energia elétrica', 'Internet'] },
  { c: D.cat.alimentacao, tipo: 'Despesa', n: 312, open: true, sel: true, subs: ['Supermercado', 'Restaurantes', 'Delivery', 'Padaria'] },
  { c: D.cat.transporte, tipo: 'Despesa', n: 187, subs: [] },
  { c: D.cat.saude, tipo: 'Despesa', n: 64, subs: [] },
  { c: D.cat.lazer, tipo: 'Despesa', n: 96, subs: [] },
  { c: D.cat.educacao, tipo: 'Despesa', n: 24, subs: [] },
  { c: D.cat.assinaturas, tipo: 'Despesa', n: 71, subs: [] },
  { c: D.cat.compras, tipo: 'Despesa', n: 58, subs: [] },
  { c: D.cat.outros, tipo: 'Despesa', n: 43, subs: [], padrao: true },
  { c: D.cat.salario, tipo: 'Receita', n: 12, subs: [] },
  { c: D.cat.freelance, tipo: 'Receita', n: 9, subs: [] },
  { c: { nome: 'Rendimentos', icon: 'trendUp', cor: 6 }, tipo: 'Receita', n: 18, subs: [], padrao: true },
];

const regras = [
  { cond: 'Descrição contém UBER *TRIP', cat: D.cat.transporte, sub: 'Aplicativos', n: 42, on: true },
  { cond: 'Descrição contém IFOOD', cat: D.cat.alimentacao, sub: 'Delivery', n: 31, on: true },
  { cond: 'Descrição começa com SMART FIT', cat: D.cat.saude, sub: 'Academia', n: 6, on: true },
  { cond: 'Descrição contém NETFLIX ou SPOTIFY', cat: D.cat.assinaturas, sub: null, n: 12, on: true },
  { cond: 'Valor entre R$ 2.000,00 e R$ 2.200,00 em Itaú Corrente', cat: D.cat.moradia, sub: 'Aluguel', n: 6, on: true },
  { cond: 'Descrição contém POSTO', cat: D.cat.transporte, sub: 'Combustível', n: 38, on: false },
];

function treeRowsMobile(x, y, w) {
  const rows = [];
  arvore.forEach((a) => {
    rows.push({ a, lvl: 0 });
    if (a.open) a.subs.forEach((sname) => rows.push({ a, lvl: 1, sname }));
  });
  const rh = 52;
  let s = '';
  rows.forEach((r, i) => {
    const ry = y + i * rh;
    const cy = ry + rh / 2;
    const ix = x + 8 + r.lvl * 28;
    if (r.lvl === 0) {
      s += Ic(r.a.subs.length ? (r.a.open ? 'chevD' : 'chevR') : 'chevR', ix + 14, cy, 20, r.a.subs.length ? C.text : C.border, 2);
      s += K.swatch(ix + 36, cy, B.catColor(r.a.c), 16);
      s += Ic(r.a.c.icon, ix + 70, cy, 18, C.muted);
      s += T(ix + 88, cy, r.a.c.nome, { size: 16, weight: 500 });
      let bx = ix + 88 + tw(r.a.c.nome, 16, 500) + 8;
      if (r.a.padrao) {
        const b = K.badge(bx, cy, 'Padrão', 'neutral', undefined, { chip: true });
        s += b.s;
      }
      if (!r.a.padrao) s += T(x + w - 52, cy, r.a.tipo, { size: 13, fill: C.muted, anchor: 'end' });
    } else {
      s += K.swatch(ix + 26, cy, B.catColor(r.a.c), 10);
      s += T(ix + 46, cy, r.sname, { size: 15 });
    }
    s += Ic('dotsV', x + w - 24, cy, 20, C.muted);
    if (i < rows.length - 1) s += L(x + 16, ry + rh - 0.5, x + w - 16, ry + rh - 0.5, C.border);
  });
  const h = rows.length * rh;
  return { s: K.card(x, y, w, h) + s, h };
}

function regraMobile(x, y, w, r) {
  const h = 150;
  const lines = wrap(r.cond, w - 32, 16, 500);
  let s = K.card(x, y, w, h + (lines.length - 1) * 22);
  lines.forEach((ln, i) => {
    s += T(x + 16, y + 26 + i * 22, ln, { size: 16, weight: 500, fill: r.on ? C.text : C.muted });
  });
  const off = (lines.length - 1) * 22;
  s += Ic('arrowRight', x + 16 + 8, y + 58 + off, 16, C.muted);
  s += K.swatch(x + 16 + 28, y + 58 + off, B.catColor(r.cat), 12);
  s += T(x + 16 + 46, y + 58 + off, r.sub ? `${r.cat.nome} › ${r.sub}` : r.cat.nome, { size: 14, weight: 500, fill: r.on ? C.text : C.muted });
  s += T(x + 16, y + 84 + off, `Aplicada a ${r.n} transações`, { size: 13, fill: C.muted });
  s += K.switchC(x + 16, y + 112 + off, r.on);
  s += T(x + 16 + 54, y + 112 + off, r.on ? 'Ativa' : 'Inativa', { size: 14, weight: 500, fill: r.on ? C.text : C.muted });
  s += T(x + w - 16 - 96 - 8, y + 90 + off + 22, 'Ordem', { size: 13, fill: C.muted, anchor: 'end' });
  s += K.iconBtn(x + w - 16 - 96, y + 90 + off, 44, 'chevU', { variant: 'secondary', isz: 20 }).s;
  s += K.iconBtn(x + w - 16 - 44, y + 90 + off, 44, 'chevD', { variant: 'secondary', isz: 20 }).s;
  return { s, h: h + off };
}

function celular() {
  return mobileShell({
    title: 'Categorias e regras',
    active: 'categorias',
    body: (x, y, w) => {
      const f = new K.Flow(x, y, w, 16);
      f.add((fx, fy, fw) => K.tabs(fx, fy, fw, ['Categorias', 'Regras'], 0, { equal: true }), 12);
      f.add((fx, fy, fw) => K.btn(fx, fy, 'Nova categoria', { variant: 'secondary', w: fw, h: 44, icon: 'plus' }));
      f.add((fx, fy, fw) => treeRowsMobile(fx, fy, fw));
      f.add((fx, fy, fw) => {
        let s = T(fx, fy + 12, 'Regras automáticas', { size: 18, weight: 600 });
        s += T(fx, fy + 36, 'Por prioridade: a primeira que combinar vence.', { size: 13, fill: C.muted, max: fw });
        return { s, h: 48 };
      }, 8);
      f.add((fx, fy, fw) => K.btn(fx, fy, 'Nova regra', { variant: 'secondary', w: fw, h: 44, icon: 'plus' }));
      regras.forEach((r) => f.add((fx, fy, fw) => regraMobile(fx, fy, fw, r), 12));
      return { s: f.s, h: f.h };
    },
  });
}

function treeD(x, y, w) {
  const rows = [];
  arvore.forEach((a) => {
    rows.push({ a, lvl: 0 });
    if (a.open) a.subs.forEach((sname) => rows.push({ a, lvl: 1, sname }));
  });
  const rh = 44;
  const head = 56;
  const h = head + rows.length * rh + 12;
  let s = K.card(x, y, w, h);
  s += T(x + 24, y + 28, 'Categorias', { size: 18, weight: 600 });
  s += K.checkbox(x + w - 24 - 170, y + 28, false);
  s += T(x + w - 24 - 170 + 28, y + 28, 'Mostrar arquivadas', { size: 14 });
  s += L(x, y + head - 0.5, x + w, y + head - 0.5, C.border);
  rows.forEach((r, i) => {
    const ry = y + head + i * rh;
    const cy = ry + rh / 2;
    const sel = r.lvl === 0 && r.a.sel;
    if (sel) {
      s += R(x + 8, ry + 2, w - 16, rh - 4, { fill: C.rowSelected, r: 8 });
      s += R(x + 8, ry + 8, 3, rh - 16, { fill: C.primary, r: 1.5 });
    }
    const ix = x + 24 + r.lvl * 32;
    if (r.lvl === 0) {
      s += Ic(r.a.subs.length ? (r.a.open ? 'chevD' : 'chevR') : 'chevR', ix + 10, cy, 18, r.a.subs.length ? C.text : C.border, 2);
      s += K.swatch(ix + 30, cy, B.catColor(r.a.c), 14);
      s += Ic(r.a.c.icon, ix + 60, cy, 18, C.muted);
      s += T(ix + 78, cy, r.a.c.nome, { size: 14, weight: sel ? 600 : 500 });
      if (r.a.padrao) s += K.badge(ix + 78 + tw(r.a.c.nome, 14, 500) + 8, cy, 'Padrão', 'neutral', undefined, { chip: true }).s;
      s += T(x + w - 270, cy, r.a.tipo, { size: 13, fill: C.muted });
      s += T(x + w - 80, cy, `${r.a.n} transações`, { size: 13, fill: C.muted, anchor: 'end' });
    } else {
      s += K.swatch(ix + 24, cy, B.catColor(r.a.c), 10);
      s += T(ix + 42, cy, r.sname, { size: 14 });
    }
    s += Ic('dotsV', x + w - 32, cy, 20, C.muted);
  });
  return { s, h };
}

function detailD(x, y, w, h) {
  let s = K.card(x, y, w, h);
  const a = arvore[1];
  s += T(x + 24, y + 30, 'Detalhe da categoria', { size: 18, weight: 600 });
  const px = x + 24;
  const pw = w - 48;
  let yy = y + 52;
  s += K.field(px, yy, pw, 'Nome', a.c.nome, { h: 40, size: 15 }).s;
  yy += 24 + 40 + 16;
  s += T(px, yy + 10, 'Tipo', { size: 14, weight: 500 });
  s += K.segmented(px, yy + 24, pw, 40, ['Despesa', 'Receita'], 0, { size: 14 }).s;
  yy += 24 + 40 + 20;
  s += T(px, yy + 10, 'Cor', { size: 14, weight: 500 });
  for (let i = 0; i < 12; i++) {
    const col = i % 6;
    const row = Math.floor(i / 6);
    const sx = px + col * 52;
    const sy = yy + 24 + row * 52;
    s += R(sx, sy, 44, 44, { fill: C.cat[i], r: 8 });
    if (i === 1) {
      s += R(sx - 2, sy - 2, 48, 48, { stroke: C.text, sw: 2, r: 10 });
      s += Ic('check', sx + 22, sy + 22, 22, '#FFFFFF', 3);
    }
  }
  yy += 24 + 52 + 44 + 20;
  s += T(px, yy + 10, 'Ícone', { size: 14, weight: 500 });
  const icons = ['utensils', 'cart', 'home', 'car', 'heart', 'grad', 'plane', 'receipt'];
  icons.forEach((ic, i) => {
    const sx = px + i * 48;
    const sel = i === 0;
    s += R(sx + 0.5, yy + 24 + 0.5, 39, 39, { fill: sel ? C.rowSelected : C.surface, stroke: sel ? C.primary : C.border, sw: sel ? 2 : 1, r: 8 });
    s += Ic(ic, sx + 20, yy + 24 + 20, 20, sel ? C.primary : C.muted);
  });
  yy += 24 + 40 + 20;
  s += K.field(px, yy, pw, 'Categoria pai', 'Nenhuma (categoria principal)', { h: 40, size: 15, iconEnd: 'chevD' }).s;
  yy += 24 + 40 + 16;
  s += Ic('info', px + 8, yy + 8, 16, C.muted);
  s += T(px + 24, yy + 8, 'Mapeia da Pluggy: Food and Drinks', { size: 13, fill: C.muted });
  s += T(px, yy + 34, 'Transações:', { size: 13, fill: C.muted });
  s += T(px + tw('Transações:', 13) + 6, yy + 34, '312 (ver transações)', { size: 13, weight: 600, fill: C.link });
  yy += 62;
  s += L(px, yy + 0.5, px + pw, yy + 0.5, C.border);
  yy += 20;
  [['Orçamento de out/2026', 'R$ 1.800,00'], ['Realizado no mês', 'R$ 1.950,00'], ['Subcategorias', '4'], ['Regras que apontam para ela', '1']].forEach((r, i) => {
    s += T(px, yy + 10 + i * 30, r[0], { size: 14, fill: C.muted });
    s += T(px + pw, yy + 10 + i * 30, r[1], { size: 14, weight: 600, anchor: 'end', tnum: true });
  });
  const ab = K.btn(0, 0, 'Arquivar', { variant: 'dangerOutline', h: 40, size: 15 });
  s += K.btn(px, y + h - 24 - 40, 'Arquivar', { variant: 'dangerOutline', h: 40, size: 15 }).s;
  const sv = K.btn(0, 0, 'Salvar', { variant: 'primary', h: 40, size: 15 });
  s += K.btn(x + w - 24 - sv.w, y + h - 24 - 40, 'Salvar', { variant: 'primary', h: 40, size: 15 }).s;
  return s;
}

function desktop() {
  return desktopShell({
    title: 'Categorias e regras',
    active: 'categorias',
    body: (x, y, w) => {
      const f = new K.Flow(x, y, w, 24);
      f.add((fx, fy, fw) => {
        const b = K.btn(0, 0, 'Nova categoria', { variant: 'primary', h: 40, size: 15, icon: 'plus' });
        return { s: K.btn(fx + fw - b.w, fy, 'Nova categoria', { variant: 'primary', h: 40, size: 15, icon: 'plus' }).s, h: 40 };
      }, 16);
      f.add((fx, fy, fw) => K.tabs(fx, fy, fw, ['Categorias', 'Regras'], 0), 8);
      f.add((fx, fy, fw) => {
        const c2 = K.cols(fx, fw, 24, [7, 5]);
        const t = treeD(c2[0].x, fy, c2[0].w);
        const h = Math.max(t.h, 700);
        const t2 = treeD(c2[0].x, fy, c2[0].w);
        return { s: t2.s + detailD(c2[1].x, fy, c2[1].w, Math.max(t2.h, 740)), h: Math.max(t2.h, 740) };
      });
      f.add((fx, fy, fw) => {
        let s = T(fx, fy + 14, 'Regras automáticas', { size: 20, weight: 600 });
        const b = K.btn(0, 0, 'Nova regra', { variant: 'primary', h: 40, size: 15, icon: 'plus' });
        s += K.btn(fx + fw - b.w, fy - 6, 'Nova regra', { variant: 'primary', h: 40, size: 15, icon: 'plus' }).s;
        return { s, h: 36 };
      }, 12);
      f.add((fx, fy, fw) => K.banner(fx, fy, fw, 'info', null, 'As regras são aplicadas por ordem de prioridade: a primeira que combinar define a categoria. Edições manuais nunca são sobrescritas.', { dismiss: true }), 16);
      f.add((fx, fy, fw) => {
        const rh = 60;
        const head = 44;
        const defs = [
          { label: 'Prioridade', w: 120, r: (r, cx, cy) => Ic('grip', cx + 8, cy, 20, C.muted) + T(cx + 26, cy, String(regras.indexOf(r) + 1), { size: 14, weight: 600, tnum: true }) + Ic('chevU', cx + 64, cy, 16, C.muted, 2) + Ic('chevD', cx + 92, cy, 16, C.muted, 2) },
          { label: 'Condição', r: (r, cx, cy, cw) => T(cx, cy, r.cond, { size: 14, weight: 500, max: cw, fill: r.on ? C.text : C.muted }) },
          { label: 'Categoria de destino', w: 200, r: (r, cx, cy, cw) => K.swatch(cx, cy, B.catColor(r.cat), 12) + T(cx + 20, cy, r.sub ? `${r.cat.nome} › ${r.sub}` : r.cat.nome, { size: 14, fill: r.on ? C.text : C.muted, max: cw - 20 }) },
          { label: 'Ativa', w: 100, r: (r, cx, cy) => K.switchC(cx, cy, r.on) + T(cx + 52, cy, r.on ? 'Ativa' : 'Inativa', { size: 13, fill: r.on ? C.text : C.muted }) },
          { label: 'Aplicada a', w: 100, align: 'right', r: (r, cx, cy, cw) => T(cx + cw, cy, `${r.n} transações`, { size: 13, anchor: 'end', fill: C.muted, tnum: true }) },
          { label: 'Ações', w: 170, r: (r, cx, cy) => K.btn(cx, cy - 16, 'Aplicar retroativamente', { variant: 'ghost', h: 32, size: 13 }).s },
          { label: '', w: 24, r: (r, cx, cy) => Ic('dotsV', cx + 12, cy, 20, C.muted) },
        ];
        const cols = K.colsFit(fw, defs, 16, 24);
        const h = head + regras.length * rh;
        let s = K.card(fx, fy, fw, h);
        const hd = K.tableHead(fx, fy, fw, cols, { h: head, pad: 24, gap: 16 });
        const rw = K.tableRows(fx, fy + head, fw, cols, regras, { rh, pad: 24, gap: 16 });
        s += `<clipPath id="rg"><rect x="${fx}" y="${fy}" width="${fw}" height="${h}" rx="12"/></clipPath><g clip-path="url(#rg)">${hd.s}${rw.s}</g>`;
        s += R(fx + 0.5, fy + 0.5, fw - 1, h - 1, { stroke: C.border, r: 11.5 });
        return { s, h };
      });
      return { s: f.s, h: f.h };
    },
  });
}

module.exports = { id: '09', slug: 'categorias', nome: 'Categorias e regras', celular, desktop };
