const { C, T, R, L, G, Ic, tw, brl, pct, wrap } = require('../lib/core');
const K = require('../lib/comp');
const B = require('../lib/blocks');
const CH = require('../lib/charts');
const { logo } = require('../lib/logos');
const { txTable } = require('../lib/tables');
const { mobileShell, desktopShell } = require('../lib/shell');
const D = require('../data');

const nu = D.cartoes[0];
const itc = D.cartoes[1];

const comprasTrx = nu.compras.map((c) => ({
  d: `${c.d}/2026`,
  desc: c.desc,
  cat: c.cat,
  conta: `${nu.curto} •${nu.final}`,
  v: -c.v,
  chips: c.parcela ? [`parcela:${c.parcela}`] : [],
}));

const meses = [
  { l: 'dez', v: 450 },
  { l: 'jan', v: 450 },
  { l: 'fev', v: 450 },
  { l: 'mar', v: 450 },
  { l: 'abr', v: 450 },
  { l: 'mai', v: 450 },
].map((m) => ({ ...m, proj: true }));

function limitBar(x, y, w, c, mobile) {
  const ratio = c.usado / c.limite;
  const st = ratio >= 0.8 ? 'warning' : 'primary';
  let s = K.progress(x, y, w, 12, ratio, st).s;
  s += T(x, y + 30, `${pct(ratio * 100, 0)} usado`, { size: 14, weight: 600 });
  s += T(x + w, y + 30, `Disponível ${brl(c.disponivel)} de ${brl(c.limite, { dec: false })}`, { size: 13, fill: C.muted, anchor: 'end', tnum: true });
  return s;
}

function chipCard(x, y, w, c, sel) {
  let s = R(x + 1, y + 1, w - 2, 54, { fill: sel ? C.rowSelected : C.surface, stroke: sel ? C.primary : C.border, sw: sel ? 2 : 1, r: 12 });
  s += logo(c.inst, x + 14, y + 14, 28);
  s += T(x + 54, y + 28, `${c.curto} •${c.final}`, { size: 15, weight: sel ? 600 : 500 });
  return s;
}

function celular() {
  return mobileShell({
    title: 'Cartões',
    active: 'cartoes',
    body: (x, y, w) => {
      const f = new K.Flow(x, y, w, 16);
      f.add((fx, fy, fw) => ({ s: chipCard(fx, fy, 196, nu, true) + chipCard(fx + 204, fy, 196, itc, false), h: 56 }));
      f.add((fx, fy, fw) => {
        const h = 400;
        let s = K.card(fx, fy, fw, h);
        s += logo(nu.inst, fx + 16, fy + 16, 32);
        s += T(fx + 58, fy + 24, nu.nome, { size: 16, weight: 600 });
        s += T(fx + 58, fy + 44, `Final ${nu.final}`, { size: 13, fill: C.muted });
        const b = K.badge(0, 0, 'Aberta', 'info', 'circleDot');
        s += K.badge(fx + fw - 16 - b.w, fy + 32, 'Aberta', 'info', 'circleDot').s;
        s += T(fx + 16, fy + 78, 'Fatura aberta', { size: 14, weight: 500, fill: C.muted });
        s += T(fx + 16, fy + 114, brl(nu.aberta.valor), { size: 32, weight: 700, tnum: true, ls: -0.64 });
        s += Ic('calendarClock', fx + 16 + 8, fy + 148, 16, C.muted);
        s += T(fx + 16 + 24, fy + 148, `Fecha ${nu.aberta.fecha} · Vence ${nu.aberta.venc}`, { size: 13, fill: C.muted, tnum: true });
        s += L(fx + 16, fy + 172.5, fx + fw - 16, fy + 172.5, C.border);
        s += T(fx + 16, fy + 198, 'Fatura fechada', { size: 14, weight: 500, fill: C.muted });
        s += K.money(fx + fw - 16, fy + 198, nu.fechada.valor, { size: 20, weight: 600, anchor: 'end' });
        const vb = K.badge(fx + 16, fy + 228, 'Vence em 3 dias', 'warning', 'triAlert');
        s += vb.s;
        s += T(fx + 16 + vb.w + 8, fy + 228, nu.fechada.venc, { size: 13, fill: C.muted, tnum: true });
        s += L(fx + 16, fy + 252.5, fx + fw - 16, fy + 252.5, C.border);
        s += T(fx + 16, fy + 278, 'Limite', { size: 14, weight: 500, fill: C.muted });
        s += limitBar(fx + 16, fy + 300, fw - 32, nu, true);
        s += T(fx + 16, fy + 366, 'Fecha dia 28 · Vence dia 8', { size: 13, fill: C.muted });
        return { s, h };
      });
      f.add((fx, fy, fw) => K.tabs(fx, fy, fw, ['Atual', 'Faturas', 'Parcelas', 'Consol.'], 0, { equal: true }), 12);
      f.add((fx, fy, fw) => K.banner(fx, fy, fw, 'info', null, 'Pagamento de fatura não é despesa.', { dismiss: true }), 12);
      f.add((fx, fy, fw) => {
        let s = T(fx, fy + 12, 'Compras da fatura aberta', { size: 16, weight: 600 });
        s += T(fx + fw, fy + 12, `${comprasTrx.length} lançamentos`, { size: 13, fill: C.muted, anchor: 'end' });
        const l = B.txListMobile(fx, fy + 32, fw, comprasTrx);
        return { s: s + l.s, h: 32 + l.h };
      });
      f.add((fx, fy, fw) => {
        const h = 318;
        let s = K.card(fx, fy, fw, h);
        s += T(fx + 16, fy + 28, 'Parcelas e projeção', { size: 18, weight: 600 });
        s += T(fx + 16, fy + 60, 'Total comprometido', { size: 14, fill: C.muted });
        s += T(fx + 16, fy + 92, brl(nu.futuras), { size: 24, weight: 600, tnum: true, ls: -0.48 });
        s += CH.barsSimple(fx + 16, fy + 114, fw - 32, 156, meses, { id: 'm', left: 56, barW: 24, ticks: 2, color: C.chart[0] });
        s += K.swatch(fx + 16, fy + 288, '#FFFFFF', 12).replace('fill="#FFFFFF"', 'fill="url(#hp-m)" stroke="' + C.chart[0] + '"');
        s += T(fx + 36, fy + 288, 'Projeção · Magazine Luiza 5/10 a 10/10', { size: 13, fill: C.muted });
        return { s, h };
      });
      return { s: f.s, h: f.h };
    },
  });
}

function cardD(x, y, w, h, c, sel) {
  let s = R(x + (sel ? 1 : 0.5), y + (sel ? 1 : 0.5), w - (sel ? 2 : 1), h - (sel ? 2 : 1), { fill: sel ? C.rowSelected : C.surface, stroke: sel ? C.primary : C.border, sw: sel ? 2 : 1, r: 12, filter: sel ? undefined : 'sh' });
  s += logo(c.inst, x + 20, y + 20, 40);
  s += T(x + 72, y + 32, c.nome, { size: 16, weight: 600, max: w - 72 - 20 });
  s += T(x + 72, y + 52, `Mastercard · final ${c.final}`.replace('Mastercard', c.id === 'nubank' ? 'Mastercard' : 'Mastercard'), { size: 13, fill: C.muted });
  const b = K.badge(0, 0, 'Aberta', 'info', 'circleDot');
  s += K.badge(x + w - 20 - b.w, y + 88, 'Aberta', 'info', 'circleDot').s;
  s += T(x + 20, y + 88, 'Fatura aberta', { size: 14, fill: C.muted });
  s += T(x + 20, y + 118, brl(c.aberta.valor), { size: 28, weight: 600, tnum: true, ls: -0.56 });
  s += T(x + 20, y + 146, `Fecha ${c.aberta.fecha.slice(0, 5)} · Vence ${c.aberta.venc.slice(0, 5)}`, { size: 13, fill: C.muted, tnum: true });
  const urgent = c.fechada.dias <= 3;
  if (urgent) {
    const ub = K.badge(x + 20, y + 174, 'Fechada vence em 3 dias', 'warning', 'triAlert');
    s += ub.s;
    s += T(x + 20 + ub.w + 8, y + 174, `${c.fechada.venc.slice(0, 5)} · ${brl(c.fechada.valor)}`, { size: 13, fill: C.muted, tnum: true });
  } else {
    s += Ic('calendarClock', x + 28, y + 174, 16, C.muted);
    s += T(x + 44, y + 174, `Fechada vence em ${c.fechada.dias} dias · ${c.fechada.venc.slice(0, 5)} · ${brl(c.fechada.valor)}`, { size: 13, fill: C.muted, tnum: true });
  }
  s += limitBar(x + 20, y + 204, w - 40, c, false);
  return s;
}

function desktop() {
  return desktopShell({
    title: 'Cartões',
    active: 'cartoes',
    body: (x, y, w) => {
      const f = new K.Flow(x, y, w, 24);
      const c3 = K.cols(x, w, 24, [4, 4, 4]);
      const chh = 262;
      let row = cardD(c3[0].x, f.y, c3[0].w, chh, nu, true) + cardD(c3[1].x, f.y, c3[1].w, chh, itc, false);
      const rx = c3[2].x;
      const ry = f.y;
      row += K.card(rx, ry, c3[2].w, chh);
      row += T(rx + 20, ry + 32, 'Todos os cartões', { size: 16, weight: 600 });
      row += T(rx + 20, ry + 66, 'Faturas a pagar', { size: 14, fill: C.muted });
      row += T(rx + 20, ry + 96, brl(D.faturasTotal), { size: 28, weight: 600, tnum: true, ls: -0.56 });
      row += T(rx + 20, ry + 126, 'Fechadas + abertas dos 2 cartões', { size: 13, fill: C.muted });
      const lim = D.cartoes.reduce((a, c) => a + c.limite, 0);
      const usado = D.cartoes.reduce((a, c) => a + c.usado, 0);
      row += K.progress(rx + 20, ry + 156, c3[2].w - 40, 12, usado / lim, 'primary').s;
      row += T(rx + 20, ry + 192, `${pct((usado / lim) * 100, 0)} do limite total`, { size: 14, weight: 600 });
      row += T(rx + c3[2].w - 20, ry + 192, `Disponível ${brl(lim - usado)}`, { size: 13, fill: C.muted, anchor: 'end', tnum: true });
      f.add({ s: row, h: chh });
      f.add((fx, fy, fw) => {
        let s = T(fx, fy + 14, 'Nubank Ultravioleta', { size: 20, weight: 600 });
        s += K.tabs(fx, fy + 36, fw, ['Fatura atual', 'Faturas', 'Parcelas e projeção', 'Consolidado'], 0).s;
        return { s, h: 80 };
      }, 16);
      f.add((fx, fy, fw) => {
        const h = 112;
        let s = K.card(fx, fy, fw, h);
        const items = [
          ['Período', '29/09 a 28/10/2026'],
          ['Fecha em', '28/10/2026'],
          ['Vence em', '08/11/2026'],
          ['Total da fatura', brl(nu.aberta.valor)],
          ['Pagamento mínimo', brl(nu.aberta.minimo)],
        ];
        const cw = (fw - 48) / items.length;
        items.forEach((it, i) => {
          const cx = fx + 24 + i * cw;
          s += T(cx, fy + 36, it[0], { size: 14, fill: C.muted });
          const big = i === 3;
          s += T(cx, fy + 72, it[1], { size: big ? 24 : 18, weight: big ? 700 : 600, tnum: true, ls: big ? -0.48 : 0 });
          if (i > 0) s += L(cx - 16, fy + 24, cx - 16, fy + h - 24, C.border);
        });
        return { s, h };
      });
      f.add((fx, fy, fw) => K.banner(fx, fy, fw, 'warning', null, 'A fatura fechada de R$ 2.310,00 vence em 08/10/2026 (em 3 dias).', { action: 'Ver fatura fechada', icon: 'triAlert' }), 16);
      f.add((fx, fy, fw) => K.banner(fx, fy, fw, 'info', null, 'Pagamento de fatura não é despesa e não entra nos gastos do período.', { dismiss: true }), 8);
      const t = txTable(x, f.y, w, comprasTrx.map((r) => ({ ...r })), { rh: 48 });
      f.add({ s: t.s, h: t.h });
      f.add((fx, fy, fw) => {
        const h = 330;
        const c2 = K.cols(fx, fw, 24, [7, 5]);
        let s = K.card(fx, fy, fw, h);
        s += T(fx + 24, fy + 34, 'Parcelas e projeção', { size: 20, weight: 600 });
        s += T(fx + 24, fy + 64, 'Total comprometido em parcelas futuras', { size: 14, fill: C.muted });
        s += T(fx + 24, fy + 98, brl(nu.futuras), { size: 24, weight: 600, tnum: true, ls: -0.48 });
        s += CH.barsSimple(fx + 24, fy + 120, c2[0].w - 24, 180, meses, { id: 'm', left: 60, barW: 32, ticks: 2, color: C.chart[0] });
        s += K.swatch(fx + 24, fy + h - 14, '#FFFFFF', 12).replace('fill="#FFFFFF"', 'fill="url(#hp-m)" stroke="' + C.chart[0] + '"');
        s += T(fx + 44, fy + h - 14, 'Projeção · parcelas 5/10 a 10/10', { size: 13, fill: C.muted });
        const tx = c2[1].x + 12;
        const tw2 = c2[1].w - 36;
        s += T(tx, fy + 40, 'Parcelas por compra', { size: 14, weight: 600, fill: C.muted });
        s += L(tx, fy + 62.5, tx + tw2, fy + 62.5, C.border);
        s += T(tx, fy + 88, 'Magazine Luiza *Notebook', { size: 14, weight: 500 });
        s += T(tx, fy + 108, 'Parcela 4/10 · 6 restantes', { size: 13, fill: C.muted });
        s += K.money(tx + tw2, fy + 88, 450, { size: 14, weight: 500, anchor: 'end' });
        s += T(tx + tw2, fy + 108, 'por mês', { size: 13, fill: C.muted, anchor: 'end' });
        s += L(tx, fy + 128.5, tx + tw2, fy + 128.5, C.border);
        s += T(tx, fy + 154, 'Total comprometido', { size: 14, weight: 600 });
        s += K.money(tx + tw2, fy + 154, nu.futuras, { size: 14, weight: 600, anchor: 'end' });
        s += T(tx, fy + 190, 'Última parcela em 08/05/2027.', { size: 13, fill: C.muted });
        return { s, h };
      });
      return { s: f.s, h: f.h };
    },
  });
}

module.exports = { id: '05', slug: 'cartoes', nome: 'Cartões', celular, desktop };
