const { C, T, R, L, G, Ic, tw, brl, pct } = require('../lib/core');
const K = require('../lib/comp');
const B = require('../lib/blocks');
const CH = require('../lib/charts');
const { logo, LOGOS } = require('../lib/logos');
const { mobileShell, desktopShell } = require('../lib/shell');
const D = require('../data');

const grupos = [
  { inst: 'itau', nome: 'Itaú', status: 'ok', sync: '05/10/2026 14:22', contas: D.contas.filter((c) => c.inst === 'itau') },
  { inst: 'nubank', nome: 'Nubank', status: 'ok', sync: '05/10/2026 14:22', contas: D.contas.filter((c) => c.inst === 'nubank') },
  { inst: 'inter', nome: 'Banco Inter', status: 'error', sync: '03/10/2026 09:41', contas: D.contas.filter((c) => c.inst === 'inter') },
  { inst: 'manual', nome: 'Contas manuais', status: 'manual', contas: D.contas.filter((c) => c.inst === 'manual') },
];

const histSerie = [
  { l: '07/07', v: 20184.3 },
  { l: '21/07', v: 21640.9 },
  { l: '04/08', v: 19875.45 },
  { l: '18/08', v: 22310.0 },
  { l: '01/09', v: 21092.6 },
  { l: '15/09', v: 22875.35 },
  { l: '05/10', v: D.saldoTotal },
];

function statusBadge(x, cy, st) {
  if (st === 'ok') return K.badge(x, cy, 'Atualizado há 12 min', 'ok', 'circleCheck');
  if (st === 'error') return K.badge(x, cy, 'Ação necessária', 'warning', 'triAlert');
  return K.badge(x, cy, 'Manual', 'info', 'penLine');
}

function accountRowMobile(x, y, w, c) {
  const h = 76;
  let s = T(x + 16, y + 24, c.nome, { size: 16, weight: 500, max: w - 32 - 130 });
  if (!c.manual && c.consolidado) s += T(x + 16, y + 48, c.tipo, { size: 14, fill: C.muted });
  s += K.money(x + w - 40, y + 24, c.saldo, { size: 16, weight: 600, anchor: 'end' });
  s += Ic('chevR', x + w - 24, y + h / 2, 20, C.muted, 2);
  let bx = x + 16;
  if (c.manual) {
    const b = K.badge(bx, y + 48, 'Manual', 'info', 'penLine', { chip: true });
    s += b.s;
    bx += b.w + 6;
  }
  if (!c.consolidado) s += K.badge(bx, y + 48, 'Fora do consolidado', 'neutral', undefined, { chip: true }).s;
  return { s, h };
}

function celular() {
  return mobileShell({
    title: 'Contas',
    active: 'contas',
    body: (x, y, w) => {
      const f = new K.Flow(x, y, w, 16);
      f.add((fx, fy, fw) => {
        const h = 124;
        let s = K.card(fx, fy, fw, h);
        s += T(fx + 16, fy + 24, 'Saldo consolidado', { size: 14, weight: 500, fill: C.muted });
        s += T(fx + 16, fy + 62, brl(D.saldoTotal), { size: 32, weight: 700, tnum: true, ls: -0.64 });
        s += T(fx + 16, fy + 96, '4 de 5 contas no consolidado', { size: 14, fill: C.muted });
        return { s, h };
      });
      f.add((fx, fy, fw) => K.btn(fx, fy, 'Sincronizar contas', { variant: 'secondary', w: fw, h: 44, icon: 'refresh' }));
      grupos.forEach((g) => {
        f.add((fx, fy, fw) => {
          let s = '';
          const warn = g.status === 'error';
          const gh = 48 + g.contas.length * 76 + (warn ? 32 : 0);
          s += logo(g.inst, fx, fy + 8, 28);
          s += T(fx + 38, fy + 22, g.nome, { size: 16, weight: 600 });
          if (g.status !== 'manual') {
            const b = statusBadge(0, 0, g.status);
            s += statusBadge(fx + fw - b.w, fy + 22, g.status).s;
          }
          const top = fy + 44;
          const bodyH = g.contas.length * 76 + (warn ? 32 : 0);
          s += K.card(fx, top, fw, bodyH);
          if (warn) {
            s += R(fx, top + 6, 3, bodyH - 12, { fill: C.warning, r: 1.5 });
          }
          let yy = top;
          g.contas.forEach((c, i) => {
            const r = accountRowMobile(fx, yy, fw, c);
            s += r.s;
            yy += r.h;
            if (i < g.contas.length - 1) s += L(fx + 16, yy + 0.5, fx + fw - 16, yy + 0.5, C.border);
          });
          if (warn) {
            s += Ic('clock', fx + 16 + 8, yy + 14, 16, C.warningText);
            s += T(fx + 16 + 24, yy + 14, 'Saldo pode estar desatualizado (há 2 dias)', { size: 13, fill: C.warningText });
          }
          return { s, h: 44 + bodyH };
        }, 12);
      });
      f.add((fx, fy, fw) => {
        let s = K.card(fx, fy, fw, 56);
        s += T(fx + 16, fy + 28, 'Mostrar contas ocultas', { size: 16 });
        s += K.switchC(fx + fw - 16 - 44, fy + 28, false);
        return { s, h: 56 };
      });
      return { s: f.s, h: f.h };
    },
  });
}

function desktop() {
  return desktopShell({
    title: 'Contas',
    active: 'contas',
    body: (x, y, w) => {
      const f = new K.Flow(x, y, w, 24);
      f.add((fx, fy, fw) => {
        const b = K.btn(0, 0, 'Sincronizar contas', { variant: 'secondary', h: 40, size: 15, icon: 'refresh' });
        return { s: K.btn(fx + fw - b.w, fy, 'Sincronizar contas', { variant: 'secondary', h: 40, size: 15, icon: 'refresh' }).s, h: 40 };
      }, 16);
      f.add((fx, fy, fw) => {
        const h = 240;
        let s = K.card(fx, fy, fw, h);
        s += T(fx + 24, fy + 34, 'Saldo consolidado', { size: 14, weight: 500, fill: C.muted });
        s += T(fx + 24, fy + 88, brl(D.saldoTotal), { size: 36, weight: 700, tnum: true, ls: -0.72 });
        s += T(fx + 24, fy + 124, '4 de 5 contas no consolidado', { size: 14, fill: C.muted });
        s += K.badge(fx + 24, fy + 156, 'Inter Conta Digital: desatualizada', 'warning', 'clock').s;
        s += T(fx + 24, fy + 200, 'Variação em 90 dias', { size: 13, fill: C.muted });
        const d = K.delta(fx + 24 + tw('Variação em 90 dias', 13) + 10, fy + 200, 'up', pct(((D.saldoTotal - histSerie[0].v) / histSerie[0].v) * 100, 1), true, { size: 13 });
        s += d.s;
        const cw = (fw - 48) * (5 / 12) + 40;
        const cx = fx + fw - 24 - cw;
        s += K.segmented(cx + cw - 300, fy + 16, 300, 32, ['30 dias', '90 dias', '1 ano', 'Tudo'], 1, { size: 13 }).s;
        s += CH.lineChart(cx, fy + 52, cw, 160, histSerie, { min: 15000, max: 25000, ticks: 2, left: 64, every: 2, endLabel: brl(D.saldoTotal) });
        s += T(cx, fy + 226, 'Eixo não começa em zero · Saldo das contas no consolidado', { size: 12, fill: C.muted });
        return { s, h };
      });
      grupos.forEach((g) => {
        f.add((fx, fy, fw) => {
          const rh = 68;
          const hh = 64;
          const h = hh + g.contas.length * rh + (g.status === 'error' ? 40 : 0);
          let s = K.card(fx, fy, fw, h);
          if (g.status === 'error') s += R(fx, fy + 8, 3, h - 16, { fill: C.warning, r: 1.5 });
          s += logo(g.inst, fx + 24, fy + 16, 32);
          s += T(fx + 68, fy + 24, g.nome, { size: 16, weight: 600 });
          const sub = g.sync ? `Última sincronização: ${g.sync}` : 'Cadastradas e atualizadas manualmente';
          s += T(fx + 68, fy + 46, sub, { size: 13, fill: C.muted, tnum: true });
          if (g.status !== 'manual') {
            const b = statusBadge(0, 0, g.status);
            s += statusBadge(fx + fw - 24 - b.w - 40, fy + 32, g.status).s;
          }
          s += Ic('dotsV', fx + fw - 24 - 10, fy + 32, 20, C.muted);
          s += L(fx, fy + hh - 0.5, fx + fw, fy + hh - 0.5, C.border);
          g.contas.forEach((c, i) => {
            const ry = fy + hh + i * rh;
            const cy = ry + rh / 2;
            s += T(fx + 24, cy - 10, c.nome, { size: 15, weight: 500 });
            s += T(fx + 24, cy + 12, c.tipo, { size: 13, fill: C.muted });
            let bx = fx + 24 + Math.max(tw(c.tipo, 13), 0) + 8;
            if (c.manual) {
              const b = K.badge(bx, cy + 12, 'Manual', 'info', 'penLine', { chip: true });
              s += b.s;
              bx += b.w + 6;
            }
            if (!c.consolidado) s += K.badge(bx, cy + 12, 'Fora do consolidado', 'neutral', undefined, { chip: true }).s;
            s += K.money(fx + fw - 24 - 48, cy, c.saldo, { size: 16, weight: 600, anchor: 'end' });
            s += Ic('chevR', fx + fw - 24 - 12, cy, 20, C.muted, 2);
            if (i < g.contas.length - 1) s += L(fx + 24, ry + rh - 0.5, fx + fw - 24, ry + rh - 0.5, C.border);
          });
          if (g.status === 'error') {
            const ey = fy + hh + g.contas.length * rh;
            s += L(fx + 24, ey + 0.5, fx + fw - 24, ey + 0.5, C.border);
            s += Ic('clock', fx + 24 + 8, ey + 20, 16, C.warningText);
            s += T(fx + 24 + 24, ey + 20, 'Saldo pode estar desatualizado. Reconecte a instituição para sincronizar.', { size: 13, fill: C.warningText });
            const rb = K.btn(0, 0, 'Reconectar', { variant: 'primary', h: 32, size: 14 });
            s += K.btn(fx + fw - 24 - rb.w, ey + 4, 'Reconectar', { variant: 'primary', h: 32, size: 14 }).s;
          }
          return { s, h };
        }, 16);
      });
      f.add((fx, fy, fw) => {
        let s = K.switchC(fx, fy + 12, false);
        s += T(fx + 56, fy + 12, 'Mostrar contas ocultas', { size: 14 });
        return { s, h: 24 };
      });
      return { s: f.s, h: f.h };
    },
  });
}

module.exports = { id: '04', slug: 'contas', nome: 'Contas', celular, desktop };
