const { C, T, R, L, G, Ic, tw, brl, wrap } = require('../lib/core');
const K = require('../lib/comp');
const B = require('../lib/blocks');
const { txTable } = require('../lib/tables');
const { mobileShell, desktopShell } = require('../lib/shell');
const D = require('../data');

function tag(x, cy, label) {
  const w = Math.ceil(12 + tw(label, 14) + 6 + 24 + 2);
  let s = R(x + 0.5, cy - 16 + 0.5, w - 1, 31, { fill: C.surface, stroke: C.borderStrong, r: 15.5 });
  s += T(x + 12, cy, label, { size: 14 });
  s += Ic('x', x + w - 6 - 12, cy, 14, C.muted, 2.2);
  return { s, w };
}

function totalsText(x, y, w) {
  let s = T(x, y + 10, '128 transações no filtro', { size: 14, weight: 600 });
  s += T(x, y + 32, 'Receitas', { size: 14, fill: C.muted });
  s += K.money(x + 66, y + 32, D.receitas, { size: 14, weight: 600, kind: 'income', sign: 'plus' });
  s += T(x + w / 2 + 10, y + 32, 'Despesas', { size: 14, fill: C.muted });
  s += K.money(x + w / 2 + 84, y + 32, -D.despesas, { size: 14, weight: 600, kind: 'expense' });
  return { s, h: 44 };
}

function pagMobile(x, y, w) {
  let s = '';
  s += R(x + 0.5, y + 0.5, 63, 43, { fill: C.surface, stroke: C.borderStrong, r: 8 });
  s += Ic('chevL', x + 32, y + 22, 20, C.disabledText, 2);
  s += T(x + w / 2, y + 22, 'Página 1 de 9', { size: 14, weight: 500, anchor: 'middle' });
  s += R(x + w - 64 + 0.5, y + 0.5, 63, 43, { fill: C.surface, stroke: C.borderStrong, r: 8 });
  s += Ic('chevR', x + w - 32, y + 22, 20, C.text, 2);
  return { s, h: 44 };
}

function celular() {
  return mobileShell({
    title: 'Transações',
    active: 'transacoes',
    fab: true,
    bottomPad: 88,
    body: (x, y, w) => {
      const f = new K.Flow(x, y, w, 12);
      f.add((fx, fy, fw) => {
        const bw = 118;
        let s = K.field(fx, fy, fw - bw - 8, null, '', { h: 44, icon: 'search', placeholder: 'Buscar descrição' }).s;
        s += K.btn(fx + fw - bw, fy, 'Filtros', { variant: 'secondary', w: bw, h: 44, icon: 'sliders' }).s;
        s += R(fx + fw - 28, fy - 6, 22, 22, { fill: C.primary, r: 11 });
        s += T(fx + fw - 17, fy + 5, '1', { size: 12, weight: 700, fill: '#FFFFFF', anchor: 'middle' });
        return { s, h: 44 };
      });
      f.add((fx, fy, fw) => K.segmented(fx, fy, fw, 44, ['Todas', 'Receitas', 'Despesas', 'Transf.'], 0, { size: 14 }));
      f.add((fx, fy, fw) => {
        const t = tag(fx, fy + 16, '05/09 a 04/10/2026');
        return { s: t.s, h: 32 };
      });
      f.add((fx, fy, fw) => B.txListMobile(fx, fy, fw, D.trx));
      f.add(totalsText, 12);
      f.add(pagMobile);
      return { s: f.s, h: f.h };
    },
  });
}

function select(x, y, w, label, value, h = 40) {
  let s = R(x + 0.5, y + 0.5, w - 1, h - 1, { fill: C.surface, stroke: C.borderStrong, r: 8 });
  s += T(x + 12, y + h / 2, label + ': ', { size: 14, fill: C.muted });
  s += T(x + 12 + tw(label + ': ', 14), y + h / 2, value, { size: 14, weight: 500 });
  s += Ic('chevD', x + w - 20, y + h / 2, 16, C.muted);
  return s;
}

function desktop() {
  return desktopShell({
    title: 'Transações',
    active: 'transacoes',
    body: (x, y, w) => {
      const f = new K.Flow(x, y, w, 16);
      f.add((fx, fy, fw) => {
        let s = K.segmented(fx, fy, 460, 40, ['Todas', 'Receitas', 'Despesas', 'Transferências'], 0, { size: 14 }).s;
        s += K.field(fx + 476, fy, 300, null, '', { h: 40, icon: 'search', placeholder: 'Buscar por descrição ou valor', size: 15 }).s;
        const b2 = K.btn(0, 0, 'Nova transação', { variant: 'primary', h: 40, size: 15, icon: 'plus' });
        const b1 = K.btn(0, 0, 'Exportar CSV', { variant: 'secondary', h: 40, size: 15, icon: 'download' });
        s += K.btn(fx + fw - b2.w, fy, 'Nova transação', { variant: 'primary', h: 40, size: 15, icon: 'plus' }).s;
        s += K.btn(fx + fw - b2.w - 12 - b1.w, fy, 'Exportar CSV', { variant: 'secondary', h: 40, size: 15, icon: 'download' }).s;
        return { s, h: 40 };
      });
      f.add((fx, fy, fw) => {
        let s = select(fx, fy, 200, 'Período', 'Out/2026');
        s += select(fx + 212, fy, 200, 'Conta', 'Todas');
        s += select(fx + 424, fy, 220, 'Categoria', 'Todas');
        s += K.btn(fx + 656, fy, 'Mais filtros', { variant: 'ghost', h: 40, size: 15, icon: 'sliders' }).s;
        s += T(fx + fw - 292, fy + 20, 'Densidade', { size: 14, fill: C.muted });
        s += K.segmented(fx + fw - 212, fy, 212, 40, ['Confortável', 'Compacta'].map((a) => a), 0, { size: 13 }).s;
        return { s, h: 40 };
      });
      f.add((fx, fy, fw) => {
        const t = tag(fx, fy + 16, '05/09 a 04/10/2026');
        let s = t.s;
        s += T(fx + t.w + 16, fy + 16, 'Filtros ativos: 1', { size: 14, fill: C.muted });
        return { s, h: 32 };
      }, 12);
      const rows = D.trx.map((t, i) => ({ ...t, sel: false, selected: false }));
      const tb = txTable(x, f.y, w, rows, { select: true, menu: true, rh: 52 });
      f.add({ s: tb.s, h: tb.h }, 0);
      f.space(16);
      f.add((fx, fy, fw) => {
        let s = T(fx, fy + 12, 'Mostrando 1–15 de 128', { size: 14, fill: C.muted });
        s += T(fx + 210, fy + 12, 'Receitas', { size: 14, fill: C.muted });
        s += K.money(fx + 276, fy + 12, D.receitas, { size: 14, weight: 600, kind: 'income', sign: 'plus' });
        s += T(fx + 400, fy + 12, 'Despesas', { size: 14, fill: C.muted });
        s += K.money(fx + 474, fy + 12, -D.despesas, { size: 14, weight: 600, kind: 'expense' });
        const pages = ['1', '2', '3', '…', '9'];
        let px = fx + fw - 40;
        s += R(px + 0.5, fy - 4 + 0.5, 39, 31, { fill: C.surface, stroke: C.borderStrong, r: 8 });
        s += Ic('chevR', px + 20, fy + 12, 16, C.text, 2);
        for (let i = pages.length - 1; i >= 0; i--) {
          px -= 40;
          const on = i === 0;
          s += R(px + 0.5, fy - 4 + 0.5, 35, 31, { fill: on ? C.primary : C.surface, stroke: on ? C.primary : C.border, r: 8 });
          s += T(px + 18, fy + 12, pages[i], { size: 14, weight: 600, fill: on ? '#FFFFFF' : C.text, anchor: 'middle' });
        }
        px -= 40;
        s += R(px + 0.5, fy - 4 + 0.5, 35, 31, { fill: C.surface, stroke: C.border, r: 8 });
        s += Ic('chevL', px + 18, fy + 12, 16, C.disabledText, 2);
        s += T(px - 150, fy + 12, 'Itens por página: 15', { size: 14, fill: C.muted });
        return { s, h: 24 };
      });
      return { s: f.s, h: f.h };
    },
  });
}

module.exports = { id: '03', slug: 'transacoes', nome: 'Transações', celular, desktop };
