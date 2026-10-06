const { C, T, R, L, G, Ic, tw, brl, pct } = require('../lib/core');
const K = require('../lib/comp');
const B = require('../lib/blocks');
const { txTable } = require('../lib/tables');
const { mobileShell, desktopShell } = require('../lib/shell');
const D = require('../data');

function periodBarMobile(W) {
  let s = R(0, 0, W, 52, { fill: C.surface });
  s += L(0, 51.5, W, 51.5, C.border);
  s += R(16.5, 8.5, 91, 35, { fill: C.surface, stroke: C.borderStrong, r: 8 });
  s += T(28, 26, 'Mensal', { size: 14, weight: 500 });
  s += Ic('chevD', 94, 26, 16, C.muted);
  s += Ic('chevL', 130, 26, 20, C.text, 2);
  s += T(158, 26, 'Out/2026', { size: 16, weight: 600, tnum: true });
  s += Ic('chevR', 258, 26, 20, C.text, 2);
  s += T(374, 26, '05/09 a 04/10', { size: 13, fill: C.muted, anchor: 'end', tnum: true });
  return { s, h: 52 };
}

function kpiMobileSaldo(x, y, w) {
  const h = 116;
  let s = K.card(x, y, w, h);
  s += Ic('landmark', x + 16 + 8, y + 24, 18, C.muted);
  s += T(x + 16 + 26, y + 24, 'Saldo total', { size: 14, weight: 500, fill: C.muted });
  s += T(x + 16, y + 62, brl(D.saldoTotal), { size: 32, weight: 700, tnum: true, ls: -0.64 });
  s += T(x + 16, y + 94, '4 contas · Totais consideram 4 de 5 contas', { size: 13, fill: C.muted });
  return { s, h };
}

function kpiMobileSmall(x, y, w, o) {
  const h = 108;
  let s = K.card(x, y, w, h);
  s += Ic(o.icon, x + 12 + 8, y + 22, 16, o.color, 2);
  s += T(x + 12 + 24, y + 22, o.label, { size: 14, weight: 500, fill: C.muted });
  s += T(x + 12, y + 56, o.value, { size: 18, weight: 600, tnum: true, fill: o.color, ls: -0.36 });
  const d = K.delta(x + 12, y + 82, o.dir, o.pct, o.fav, { size: 13 });
  s += d.s;
  s += T(x + 12 + d.w + 4, y + 82, 'vs. set.', { size: 13, fill: C.muted });
  return { s, h };
}

function kpiMobileResultado(x, y, w) {
  const h = 96;
  let s = K.card(x, y, w, h);
  s += Ic('trendUp', x + 16 + 8, y + 24, 18, C.muted);
  s += T(x + 16 + 26, y + 24, 'Resultado do mês', { size: 14, weight: 500, fill: C.muted });
  s += T(x + 16, y + 56, brl(D.resultado, { sign: 'always' }), { size: 24, weight: 600, tnum: true, fill: C.income, ls: -0.48 });
  const d = K.delta(x + 16, y + 80, 'up', 'R$ 612,00', true, { size: 13 });
  s += d.s;
  s += T(x + 16 + d.w + 4, y + 80, 'vs. set. (resultado de ' + brl(D.setembro.resultado) + ')', { size: 13, fill: C.muted });
  return { s, h };
}

function ultimasMobile(x, y, w) {
  const list = D.trx.slice(0, 5);
  let s = T(x, y + 14, 'Últimas transações', { size: 18, weight: 600 });
  const l = B.txListMobile(x, y + 36, w, list);
  s += l.s;
  const by = y + 36 + l.h + 12;
  s += K.btn(x, by, 'Ver todas as transações', { variant: 'secondary', w, h: 44 }).s;
  return { s, h: by + 44 - y };
}

function celular() {
  return mobileShell({
    title: 'Dashboard',
    active: 'dashboard',
    periodBar: periodBarMobile,
    body: (x, y, w) => {
      const f = new K.Flow(x, y, w, 16);
      f.add((fx, fy, fw) => K.banner(fx, fy, fw, 'warning', null, 'Dados do Banco Inter atualizados há 2 dias.', { action: 'Reconectar', dismiss: true }));
      f.add(kpiMobileSaldo);
      const half = (w - 16) / 2;
      const a = kpiMobileSmall(x, f.y, half, { icon: 'arrowDownL', color: C.income, label: 'Receitas', value: brl(D.receitas), dir: 'up', pct: '10,2%', fav: true });
      const b = kpiMobileSmall(x + half + 16, f.y, half, { icon: 'arrowUpR', color: C.expense, label: 'Despesas', value: brl(-D.despesas), dir: 'up', pct: '6,4%', fav: false });
      f.add({ s: a.s + b.s, h: a.h });
      f.add(kpiMobileResultado);
      f.add((fx, fy, fw) => B.gastosCard(fx, fy, fw, {}));
      f.add((fx, fy, fw) => B.fluxoCard(fx, fy, fw, {}));
      f.add((fx, fy, fw) => B.patrimonioCard(fx, fy, fw, {}));
      f.add((fx, fy, fw) => B.faturasCard(fx, fy, fw, {}));
      f.add(ultimasMobile);
      return { s: f.s, h: f.h };
    },
  });
}

function kpiD(x, y, w, h, o) {
  let s = K.card(x, y, w, h);
  s += Ic(o.icon, x + 24 + 10, y + 28, 20, o.iconColor || C.muted);
  s += T(x + 24 + 30, y + 28, o.label, { size: 14, weight: 500, fill: C.muted });
  let size = o.big ? 36 : 28;
  const weight = o.big ? 700 : 600;
  while (size > 24 && tw(o.value, size, weight, true, -0.02 * size) > w - 48) size -= 2;
  s += T(x + 24, y + 70, o.value, { size, weight, fill: o.valueColor || C.text, tnum: true, ls: -0.02 * size });
  if (o.dir) {
    const d = K.delta(x + 24, y + h - 26, o.dir, o.pct, o.fav, { size: 14 });
    s += d.s;
    s += T(x + 24 + d.w + 6, y + h - 26, o.ref || 'vs. setembro', { size: 14, fill: C.muted });
  }
  if (o.sub) s += T(x + 24, y + h - 26, o.sub, { size: 14, fill: C.muted });
  return s;
}

function desktop() {
  return desktopShell({
    title: 'Dashboard',
    active: 'dashboard',
    body: (x, y, w) => {
      const f = new K.Flow(x, y, w, 24);
      f.add((fx, fy, fw) => {
        let s = T(fx, fy + 12, 'Período: 05/09 a 04/10/2026', { size: 14, weight: 500, fill: C.muted, tnum: true });
        s += T(fx + fw, fy + 12, 'Comparando com: setembro de 2026', { size: 14, fill: C.muted, anchor: 'end' });
        return { s, h: 24 };
      }, 8);
      f.add((fx, fy, fw) => K.banner(fx, fy, fw, 'warning', null, 'Dados do Banco Inter atualizados há 2 dias. O saldo da conta Inter Conta Digital pode estar desatualizado.', { action: 'Reconectar', dismiss: true }));
      const c4 = K.cols(x, w, 24, [3, 3, 3, 3]);
      const kh = 136;
      let ks = kpiD(c4[0].x, f.y, c4[0].w, kh, { icon: 'landmark', label: 'Saldo total', value: brl(D.saldoTotal), big: true, sub: '4 de 5 contas no consolidado' });
      ks += kpiD(c4[1].x, f.y, c4[1].w, kh, { icon: 'arrowDownL', iconColor: C.income, label: 'Receitas', value: brl(D.receitas), valueColor: C.income, dir: 'up', pct: '10,2%', fav: true });
      ks += kpiD(c4[2].x, f.y, c4[2].w, kh, { icon: 'arrowUpR', iconColor: C.expense, label: 'Despesas', value: brl(-D.despesas), valueColor: C.expense, dir: 'up', pct: '6,4%', fav: false });
      ks += kpiD(c4[3].x, f.y, c4[3].w, kh, { icon: 'trendUp', label: 'Resultado do mês', value: brl(D.resultado, { sign: 'always' }), valueColor: C.income, dir: 'up', pct: 'R$ 612,00', fav: true });
      f.add({ s: ks, h: kh });
      const r2 = K.cols(x, w, 24, [7, 5]);
      const g = B.gastosCard(r2[0].x, f.y, r2[0].w, { wide: true });
      const fl = B.fluxoCard(r2[1].x, f.y, r2[1].w, { wide: true });
      const h2 = Math.max(g.h, fl.h);
      const g2 = B.gastosCard(r2[0].x, f.y, r2[0].w, { wide: true, minH: h2 });
      const fl2 = B.fluxoCard(r2[1].x, f.y, r2[1].w, { wide: true, minH: h2 });
      f.add({ s: g2.s + fl2.s, h: h2 });
      const p = B.patrimonioCard(r2[0].x, f.y, r2[0].w, { wide: true });
      const fa = B.faturasCard(r2[1].x, f.y, r2[1].w, { wide: true });
      const h3 = Math.max(p.h, fa.h);
      const p2 = B.patrimonioCard(r2[0].x, f.y, r2[0].w, { wide: true, minH: h3 });
      const fa2 = B.faturasCard(r2[1].x, f.y, r2[1].w, { wide: true, minH: h3 });
      f.add({ s: p2.s + fa2.s, h: h3 });
      f.add((fx, fy, fw) => {
        let s = T(fx, fy + 14, 'Últimas transações', { size: 20, weight: 600 });
        s += K.btn(fx + fw - 170, fy, 'Ver todas', { variant: 'ghost', h: 32, size: 14, iconEnd: 'chevR', w: 170 }).s.replace('', '');
        const t = txTable(fx, fy + 36, fw, D.trx.slice(0, 5));
        return { s: s + t.s, h: 36 + t.h };
      });
      return { s: f.s, h: f.h };
    },
  });
}

module.exports = { id: '02', slug: 'dashboard', nome: 'Dashboard', celular, desktop };
