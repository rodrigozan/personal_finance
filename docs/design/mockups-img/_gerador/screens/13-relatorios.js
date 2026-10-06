const { C, T, R, L, G, Ic, tw, brl, pct, wrap } = require('../lib/core');
const K = require('../lib/comp');
const B = require('../lib/blocks');
const CH = require('../lib/charts');
const { logo } = require('../lib/logos');
const { mobileShell, desktopShell } = require('../lib/shell');
const D = require('../data');

const anterior = { moradia: 2800, alimentacao: 1790, transporte: 905.5, saude: 598.7, lazer: 612.3, educacao: 480, assinaturas: 298.4, compras: 520, outros: 372.5 };

const cats = [...D.gastosCat].sort((a, b) => b.v - a.v).map((g) => {
  const ant = anterior[g.c.id];
  return { ...g, ant, var: ((g.v - ant) / ant) * 100 };
});

function varCell(x, cy, v, o = {}) {
  if (Math.abs(v) < 0.05) return T(x, cy, 'Sem variação', { size: o.size || 13, fill: C.muted, anchor: o.anchor || 'start' });
  const up = v > 0;
  const fav = !up;
  const col = fav ? C.income : C.expense;
  const txt = pct(Math.abs(v), 1);
  if (o.anchor === 'end') {
    let s = T(x, cy, txt, { size: o.size || 13, weight: 600, fill: col, anchor: 'end', tnum: true });
    s += Ic(up ? 'arrowUp' : 'arrowDown', x - tw(txt, o.size || 13, 600, true) - 10, cy, 14, col, 2.4);
    return s;
  }
  return Ic(up ? 'arrowUp' : 'arrowDown', x + 7, cy, 14, col, 2.4) + T(x + 18, cy, txt, { size: o.size || 13, weight: 600, fill: col, tnum: true });
}

const cartoesRel = [
  { c: D.cartoes[0], gasto: 3652.3, fatura: 2310.0, venc: '08/10/2026' },
  { c: D.cartoes[1], gasto: 2192.52, fatura: 1874.52, venc: '10/10/2026' },
];

function exportCards(fx, fy, fw, mobile) {
  let s = '';
  const f = new K.Flow(fx, fy, fw, 24);
  const pad = mobile ? 16 : 24;
  f.add((x, y, w) => {
    let yy = y + pad;
    let inner = T(x + pad, yy + 12, 'Exportar transações filtradas (CSV)', { size: mobile ? 16 : 18, weight: 600 });
    yy += 40;
    const fields = [['Período', '05/09/2026 a 04/10/2026'], ['Conta ou cartão', 'Todos'], ['Categoria', 'Todas']];
    if (mobile) {
      fields.forEach((fd) => {
        const r = K.field(x + pad, yy, w - pad * 2, fd[0], fd[1], { h: 44, iconEnd: 'chevD' });
        inner += r.s;
        yy += r.h + 12;
      });
    } else {
      const cw = (w - pad * 2 - 32) / 3;
      fields.forEach((fd, i) => {
        inner += K.field(x + pad + i * (cw + 16), yy, cw, fd[0], fd[1], { h: 40, size: 14, iconEnd: 'chevD' }).s;
      });
      yy += 24 + 40 + 16;
    }
    inner += R(x + pad + 0.5, yy + 0.5, w - pad * 2 - 1, mobile ? 79 : 55, { fill: C.surfaceSunken, stroke: C.border, r: 8 });
    inner += T(x + pad + 14, yy + 20, '128 transações', { size: 14, weight: 600 });
    if (mobile) {
      inner += T(x + pad + 14, yy + 44, 'Receitas', { size: 13, fill: C.muted });
      inner += K.money(x + pad + 14 + tw('Receitas', 13) + 6, yy + 44, D.receitas, { size: 13, weight: 600, kind: 'income', sign: 'plus' });
      inner += T(x + pad + 14, yy + 64, 'Despesas', { size: 13, fill: C.muted });
      inner += K.money(x + pad + 14 + tw('Despesas', 13) + 6, yy + 64, -D.despesas, { size: 13, weight: 600, kind: 'expense' });
      yy += 79 + 16;
    } else {
      inner += T(x + pad + 150, yy + 20, 'Receitas', { size: 13, fill: C.muted });
      inner += K.money(x + pad + 150 + tw('Receitas', 13) + 6, yy + 20, D.receitas, { size: 13, weight: 600, kind: 'income', sign: 'plus' });
      inner += T(x + pad + 380, yy + 20, 'Despesas', { size: 13, fill: C.muted });
      inner += K.money(x + pad + 380 + tw('Despesas', 13) + 6, yy + 20, -D.despesas, { size: 13, weight: 600, kind: 'expense' });
      inner += T(x + pad + 14, yy + 40, 'Transferências internas e transações ignoradas ficam fora dos totais.', { size: 12, fill: C.muted });
      yy += 55 + 16;
    }
    const b = K.btn(x + pad, yy, 'Exportar CSV', { variant: 'primary', h: mobile ? 44 : 40, size: mobile ? 16 : 15, icon: 'download', w: mobile ? w - pad * 2 : undefined });
    inner += b.s;
    yy += b.h + pad;
    return { s: K.card(x, y, w, yy - y) + inner, h: yy - y };
  });
  f.add((x, y, w) => {
    let yy = y + pad;
    let inner = T(x + pad, yy + 12, 'Exportar todos os dados', { size: mobile ? 16 : 18, weight: 600 });
    yy += 44;
    inner += T(x + pad, yy + 8, 'Formato', { size: 14, weight: 500 });
    yy += 28;
    inner += radioRow(x + pad, yy, 'JSON (estruturado, recomendado)', true);
    inner += radioRow(x + pad, yy + 36, 'CSV (um arquivo por tabela, compactado)', false);
    yy += 36 * 2 + 12;
    const bn = K.banner(x + pad, yy, w - pad * 2, 'warning', null, 'O arquivo contém dados financeiros sensíveis. Guarde com cuidado.', {});
    inner += bn.s;
    yy += bn.h + 16;
    const b = K.btn(x + pad, yy, 'Exportar tudo', { variant: 'secondary', h: mobile ? 44 : 40, size: mobile ? 16 : 15, icon: 'download', w: mobile ? w - pad * 2 : undefined });
    inner += b.s;
    yy += b.h + pad;
    return { s: K.card(x, y, w, yy - y) + inner, h: yy - y };
  });
  return { s: f.s, h: f.h };
}

function radioRow(x, y, label, on) {
  return K.radio(x, y + 14, on) + T(x + 30, y + 14, label, { size: 14 });
}

function celular() {
  return mobileShell({
    title: 'Relatórios',
    active: 'relatorios',
    periodBar: (W) => {
      let s = R(0, 0, W, 52, { fill: C.surface });
      s += L(0, 51.5, W, 51.5, C.border);
      s += Ic('chevL', 36, 26, 22, C.text, 2);
      s += T(W / 2, 19, 'Out/2026', { size: 16, weight: 600, anchor: 'middle', tnum: true });
      s += Ic('chevR', W - 36, 26, 22, C.text, 2);
      s += T(W / 2, 37, '05/09 a 04/10', { size: 13, fill: C.muted, anchor: 'middle', tnum: true });
      return { s, h: 52 };
    },
    body: (x, y, w) => {
      const f = new K.Flow(x, y, w, 16);
      f.add((fx, fy, fw) => K.tabs(fx, fy, fw, ['Mensal', 'Exportações'], 0, { equal: true }), 8);
      f.add((fx, fy, fw) => {
        const b1 = K.btn(0, 0, 'Imprimir', { variant: 'secondary', w: (fw - 8) / 2, h: 44, icon: 'printer' });
        return { s: K.btn(fx, fy, 'Imprimir', { variant: 'secondary', w: (fw - 8) / 2, h: 44, icon: 'printer' }).s + K.btn(fx + (fw - 8) / 2 + 8, fy, 'Exportar PDF', { variant: 'secondary', w: (fw - 8) / 2, h: 44, icon: 'fileText' }).s, h: 44 };
      });
      f.add((fx, fy, fw) => {
        const h = 196;
        let s = K.card(fx, fy, fw, h);
        s += T(fx + 16, fy + 26, 'Relatório de outubro de 2026', { size: 16, weight: 600 });
        s += T(fx + 16, fy + 46, 'Gerado em 05/10/2026', { size: 13, fill: C.muted });
        const rows = [['Receitas', D.receitas, 'income', 'plus'], ['Despesas', -D.despesas, 'expense', 'auto'], ['Resultado', D.resultado, 'income', 'always']];
        rows.forEach((r, i) => {
          const cy = fy + 82 + i * 38;
          if (i) s += L(fx + 16, cy - 19 + 0.5, fx + fw - 16, cy - 19 + 0.5, C.border);
          s += T(fx + 16, cy, r[0], { size: 14, fill: C.muted });
          s += K.money(fx + fw - 16, cy, r[1], { size: 20, weight: 600, anchor: 'end', kind: r[2], sign: r[3] });
        });
        return { s, h };
      });
      f.add((fx, fy, fw) => {
        const h = 56;
        let s = K.card(fx, fy, fw, h);
        s += T(fx + 16, fy + 28, 'Categorias', { size: 16, weight: 600 });
        s += Ic('chevU', fx + fw - 16 - 10, fy + 28, 20, C.text, 2);
        const topH = 56;
        const dr = 80;
        const { top, restV } = B.topCats();
        const body = [];
        let yy = fy + 56;
        let s2 = '';
        const slices = cats.slice(0, 5).map((g) => ({ v: g.v, color: B.catColor(g.c) })).concat([{ v: cats.slice(5).reduce((a, g) => a + g.v, 0), color: C.cat[11] }]);
        s2 += CH.donut(fx + fw / 2, yy + dr + 8, dr, 24, slices, { center: ['Despesas', brl(D.despesas, { dec: false })], centerSize: 16 });
        yy += dr * 2 + 28;
        cats.forEach((g, i) => {
          const cy = yy + i * 56 + 16;
          s2 += K.swatch(fx + 16, cy, B.catColor(g.c), 12);
          s2 += T(fx + 36, cy, g.c.nome, { size: 14, weight: 500 });
          s2 += K.money(fx + fw - 16, cy, g.v, { size: 14, weight: 600, anchor: 'end' });
          s2 += T(fx + 36, cy + 22, pct((g.v / D.despesas) * 100, 1), { size: 12, fill: C.muted, tnum: true });
          s2 += varCell(fx + fw - 16, cy + 22, g.var, { anchor: 'end', size: 12 });
          s2 += T(fx + fw - 16 - 110, cy + 22, 'vs. set.', { size: 12, fill: C.muted, anchor: 'end' });
        });
        const hh = 56 + dr * 2 + 28 + cats.length * 56 + 8;
        return { s: K.card(fx, fy, fw, hh) + T(fx + 16, fy + 28, 'Categorias', { size: 16, weight: 600 }) + Ic('chevU', fx + fw - 16 - 10, fy + 28, 20, C.text, 2) + s2, h: hh };
      });
      f.add((fx, fy, fw) => {
        const hh = 56 + 2 * 124 + 20;
        let s = K.card(fx, fy, fw, hh);
        s += T(fx + 16, fy + 28, 'Cartões', { size: 16, weight: 600 });
        s += Ic('chevU', fx + fw - 16 - 10, fy + 28, 20, C.text, 2);
        cartoesRel.forEach((c, i) => {
          const yy = fy + 56 + i * 124;
          s += L(fx + 16, yy + 0.5, fx + fw - 16, yy + 0.5, C.border);
          s += logo(c.c.inst, fx + 16, yy + 14, 32);
          s += T(fx + 58, yy + 30, `${c.c.curto} •${c.c.final}`, { size: 15, weight: 600 });
          s += T(fx + 16, yy + 66, 'Gasto no período', { size: 13, fill: C.muted });
          s += K.money(fx + fw - 16, yy + 66, c.gasto, { size: 14, weight: 600, anchor: 'end' });
          s += T(fx + 16, yy + 90, `Fatura fechada (vence ${c.venc.slice(0, 5)})`, { size: 13, fill: C.muted });
          s += K.money(fx + fw - 16, yy + 90, c.fatura, { size: 14, weight: 600, anchor: 'end' });
        });
        s += T(fx + 16, fy + hh - 18, 'Parcelas comprometidas: R$ 2.700,00 (Nubank)', { size: 13, fill: C.muted });
        return { s, h: hh };
      });
      f.add((fx, fy, fw) => {
        const hh = 56 + 3 * 44 + 64;
        let s = K.card(fx, fy, fw, hh);
        s += T(fx + 16, fy + 28, 'Patrimônio', { size: 16, weight: 600 });
        s += Ic('chevU', fx + fw - 16 - 10, fy + 28, 20, C.text, 2);
        const rows = [['Contas (consolidado)', D.saldoTotal, ''], ['Investimentos', D.invAtual, '+'], ['Faturas a pagar', -D.faturasTotal, '−']];
        rows.forEach((r, i) => {
          const cy = fy + 76 + i * 44;
          s += T(fx + 16, cy, r[0], { size: 14, fill: C.muted });
          s += T(fx + fw - 16, cy, `${r[2] ? r[2] + ' ' : ''}${brl(Math.abs(r[1]))}`, { size: 15, weight: 600, anchor: 'end', tnum: true, fill: C.text });
        });
        const ty = fy + 76 + 3 * 44;
        s += L(fx + 16, ty - 22 + 0.5, fx + fw - 16, ty - 22 + 0.5, C.borderStrong, 1);
        s += T(fx + 16, ty + 4, 'Patrimônio líquido', { size: 14, weight: 700 });
        s += T(fx + fw - 16, ty + 4, brl(D.patrimonio), { size: 20, weight: 700, anchor: 'end', tnum: true, ls: -0.4 });
        return { s, h: hh };
      });
      f.add((fx, fy, fw) => ({ s: T(fx, fy + 14, 'Exportações', { size: 18, weight: 600 }), h: 28 }), 8);
      f.add((fx, fy, fw) => exportCards(fx, fy, fw, true));
      return { s: f.s, h: f.h };
    },
  });
}

function desktop() {
  return desktopShell({
    title: 'Relatórios',
    active: 'relatorios',
    body: (x, y, w) => {
      const cw = 960;
      const cx = x + (w - cw) / 2;
      const f = new K.Flow(cx, y, cw, 24);
      f.add((fx, fy, fw) => {
        const b2 = K.btn(0, 0, 'Exportar PDF', { variant: 'secondary', h: 40, size: 15, icon: 'fileText' });
        const b1 = K.btn(0, 0, 'Imprimir', { variant: 'secondary', h: 40, size: 15, icon: 'printer' });
        let s = K.btn(fx + fw - b2.w, fy, 'Exportar PDF', { variant: 'secondary', h: 40, size: 15, icon: 'fileText' }).s;
        s += K.btn(fx + fw - b2.w - 12 - b1.w, fy, 'Imprimir', { variant: 'secondary', h: 40, size: 15, icon: 'printer' }).s;
        s += K.tabs(fx, fy, 260, ['Mensal', 'Exportações'], 0, { h: 40 }).s;
        return { s, h: 40 };
      }, 16);
      f.add((fx, fy, fw) => {
        const pad = 32;
        const inner = new K.Flow(fx + pad, fy + pad, fw - pad * 2, 28);
        inner.add((x2, y2, w2) => {
          let s = T(x2, y2 + 16, 'Relatório de outubro de 2026', { size: 24, weight: 600, ls: -0.48 });
          s += T(x2, y2 + 44, 'Período 05/09/2026 a 04/10/2026 · Gerado em 05/10/2026', { size: 14, fill: C.muted, tnum: true });
          return { s, h: 56 };
        }, 20);
        inner.add((x2, y2, w2) => {
          const c3 = K.cols(x2, w2, 16, [4, 4, 4]);
          const mk = (c, label, v, kind, sign, icon) => {
            let s = R(c.x + 0.5, y2 + 0.5, c.w - 1, 95, { fill: C.surface, stroke: C.border, r: 12 });
            s += Ic(icon, c.x + 20 + 9, y2 + 26, 18, kind === 'plain' ? C.muted : kind === 'income' ? C.income : C.expense);
            s += T(c.x + 20 + 28, y2 + 26, label, { size: 14, weight: 500, fill: C.muted });
            s += K.money(c.x + 20, y2 + 64, v, { size: 24, weight: 600, kind, sign });
            return s;
          };
          const s = mk(c3[0], 'Receitas', D.receitas, 'income', 'plus', 'arrowDownL') + mk(c3[1], 'Despesas', -D.despesas, 'expense', 'auto', 'arrowUpR') + mk(c3[2], 'Resultado', D.resultado, 'income', 'always', 'trendUp');
          return { s, h: 96 };
        });
        inner.add((x2, y2, w2) => {
          let s = T(x2, y2 + 12, 'Categorias', { size: 20, weight: 600 });
          const slices = cats.slice(0, 5).map((g) => ({ v: g.v, color: B.catColor(g.c) })).concat([{ v: cats.slice(5).reduce((a, g) => a + g.v, 0), color: C.cat[11] }]);
          s += CH.donut(x2 + 90, y2 + 56 + 90, 90, 28, slices, { center: ['Despesas', brl(D.despesas, { dec: false })], centerSize: 15 });
          const tx = x2 + 220;
          const tw2 = w2 - 220;
          const defs = [
            { label: 'Categoria', r: (g, cx2, cy) => K.swatch(cx2, cy, B.catColor(g.c), 12) + T(cx2 + 20, cy, g.c.nome, { size: 14, weight: 500 }) },
            { label: 'Valor', w: 110, align: 'right', r: (g, cx2, cy, cw2) => K.money(cx2 + cw2, cy, g.v, { size: 14, weight: 600, anchor: 'end' }) },
            { label: '% do total', w: 80, align: 'right', r: (g, cx2, cy, cw2) => T(cx2 + cw2, cy, pct((g.v / D.despesas) * 100, 1), { size: 14, anchor: 'end', tnum: true, fill: C.muted }) },
            { label: 'Variação vs. set.', w: 130, align: 'right', r: (g, cx2, cy, cw2) => varCell(cx2 + cw2, cy, g.var, { anchor: 'end', size: 13 }) },
          ];
          const cols = K.colsFit(tw2, defs, 12, 0);
          const hd = K.tableHead(tx, y2 + 40, tw2, cols, { h: 36, pad: 0, gap: 12 });
          const rw = K.tableRows(tx, y2 + 40 + 36, tw2, cols, cats, { rh: 36, pad: 0, gap: 12 });
          s += hd.s + rw.s;
          return { s, h: 40 + 36 + cats.length * 36 + 8 };
        });
        inner.add((x2, y2, w2) => {
          let s = T(x2, y2 + 12, 'Cartões', { size: 20, weight: 600 });
          const defs = [
            { label: 'Cartão', r: (c, cx2, cy) => logo(c.c.inst, cx2, cy - 14, 28) + T(cx2 + 40, cy, `${c.c.nome} •${c.c.final}`, { size: 14, weight: 500 }) },
            { label: 'Gasto no período', w: 150, align: 'right', r: (c, cx2, cy, cw2) => K.money(cx2 + cw2, cy, c.gasto, { size: 14, weight: 600, anchor: 'end' }) },
            { label: 'Fatura fechada', w: 150, align: 'right', r: (c, cx2, cy, cw2) => K.money(cx2 + cw2, cy, c.fatura, { size: 14, weight: 600, anchor: 'end' }) },
            { label: 'Vencimento', w: 110, r: (c, cx2, cy) => T(cx2, cy, c.venc, { size: 14, tnum: true }) },
          ];
          const cols = K.colsFit(w2, defs, 16, 0);
          const hd = K.tableHead(x2, y2 + 32, w2, cols, { h: 36, pad: 0, gap: 16 });
          const rw = K.tableRows(x2, y2 + 32 + 36, w2, cols, cartoesRel, { rh: 52, pad: 0, gap: 16 });
          s += hd.s + rw.s;
          s += T(x2, y2 + 32 + 36 + 104 + 24, 'Parcelas comprometidas em faturas futuras: ', { size: 14, fill: C.muted });
          s += K.money(x2 + tw('Parcelas comprometidas em faturas futuras: ', 14) + 4, y2 + 32 + 36 + 104 + 24, 2700, { size: 14, weight: 600 });
          return { s, h: 32 + 36 + 104 + 44 };
        });
        inner.add((x2, y2, w2) => {
          let s = T(x2, y2 + 12, 'Patrimônio', { size: 20, weight: 600 });
          const parts = [
            ['Contas', D.saldoTotal, null],
            ['Investimentos', D.invAtual, '+'],
            ['Faturas a pagar', D.faturasTotal, '−'],
            ['Patrimônio líquido', D.patrimonio, '='],
          ];
          const pw = (w2 - 3 * 36) / 4;
          parts.forEach((p, i) => {
            const px = x2 + i * (pw + 36);
            const last = i === 3;
            s += R(px + 0.5, y2 + 40 + 0.5, pw - 1, 87, { fill: last ? C.rowSelected : C.surface, stroke: last ? C.primary : C.border, sw: last ? 2 : 1, r: 12 });
            s += T(px + 16, y2 + 40 + 26, p[0], { size: 13, fill: C.muted, weight: 500 });
            s += T(px + 16, y2 + 40 + 58, brl(p[1]), { size: last ? 20 : 18, weight: last ? 700 : 600, tnum: true, ls: -0.3 });
            if (p[2]) s += T(px - 18, y2 + 40 + 43, p[2], { size: 22, weight: 600, fill: C.muted, anchor: 'middle' });
          });
          return { s, h: 40 + 88 };
        });
        const h = inner.h + pad * 2;
        return { s: K.card(fx, fy, fw, h, { r: 16 }) + inner.s, h };
      });
      f.add((fx, fy, fw) => {
        let s = T(fx, fy + 14, 'Exportações', { size: 20, weight: 600 });
        const e = exportCards(fx, fy + 40, fw, false);
        return { s: s + e.s, h: 40 + e.h };
      });
      return { s: f.s, h: f.h };
    },
  });
}

module.exports = { id: '13', slug: 'relatorios', nome: 'Relatórios', celular, desktop };
