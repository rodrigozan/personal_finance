const { C, STATUS, T, R, L, G, Ic, tw, brl, pct, wrap } = require('../lib/core');
const K = require('../lib/comp');
const { mobileShell, desktopShell } = require('../lib/shell');
const D = require('../data');

const alertas = [
  { st: 'warning', icon: 'calendarClock', t: 'Fatura do Nubank vence em 3 dias', d: 'R$ 2.310,00 · vence em 08/10/2026', h: '05/10/2026 08:00', a: 'Ver fatura', un: true },
  { st: 'error', icon: 'octAlert', t: 'Orçamento de Alimentação excedido', d: 'R$ 1.950,00 de R$ 1.800,00 (108%)', h: '04/10/2026 19:42', a: 'Ver orçamento', un: true },
  { st: 'error', icon: 'link', t: 'Banco Inter precisa ser reconectado', d: 'A autorização expirou; os dados estão desatualizados.', h: '03/10/2026 09:42', a: 'Reconectar', un: true },
  { st: 'warning', icon: 'clock', t: 'Consentimento da XP Investimentos expira em 14 dias', d: 'Renove até 19/10/2026 para continuar sincronizando.', h: '02/10/2026 10:15', a: 'Renovar', un: false },
  { st: 'info', icon: 'trendUp', t: 'Gasto atípico: Posto Shell BR-116', d: 'R$ 212,30, cerca de 2,5x a média de combustível.', h: '01/10/2026 17:20', a: 'Ver transação', un: false },
  { st: 'info', icon: 'sparkles', t: 'Nova assinatura detectada: Disney+', d: 'R$ 33,90 por mês, última cobrança em 28/09/2026.', h: '29/09/2026 08:05', a: 'Ver recorrência', un: false },
];

const prefs = [
  { l: 'Fatura a vencer', d: 'Avisar antes do vencimento', v: '3 dias antes', on: true },
  { l: 'Orçamento próximo do limite', d: 'Avisar ao atingir o percentual', v: '90%', on: true },
  { l: 'Orçamento excedido', d: 'Avisar quando passar de 100%', v: null, on: true },
  { l: 'Conexão com erro', d: 'Avisar quando uma instituição falhar', v: null, on: true },
  { l: 'Consentimento a expirar', d: 'Avisar antes de expirar', v: '15 dias antes', on: true },
  { l: 'Gasto atípico', d: 'Compra acima da média da categoria', v: '2,5x', on: true },
  { l: 'Nova assinatura detectada', d: 'Cobrança recorrente nova', v: null, on: false },
];

function iconCircle(x, cy, a, size = 40) {
  const st = STATUS[a.st];
  let s = `<circle cx="${x + size / 2}" cy="${cy}" r="${size / 2}" fill="${st.bg}" stroke="${st.bd}"/>`;
  s += Ic(a.icon, x + size / 2, cy, 20, st.ic);
  return s;
}

function alertaMobile(x, y, w, a) {
  const lines = wrap(a.t, w - 16 - 40 - 12 - 16 - 14, 15, a.un ? 600 : 500);
  const dl = wrap(a.d, w - 16 - 40 - 12 - 16, 13);
  const h = 16 + lines.length * 22 + dl.length * 18 + 22 + 8 + 44 + 16;
  let s = K.card(x, y, w, h);
  if (a.un) s += `<circle cx="${x + w - 16 - 4}" cy="${y + 28}" r="4" fill="${C.primary}"/>`;
  s += iconCircle(x + 16, y + 36, a);
  let yy = y + 26;
  lines.forEach((ln, i) => {
    s += T(x + 16 + 40 + 12, yy + i * 22, ln, { size: 15, weight: a.un ? 600 : 500, fill: a.un ? C.text : C.muted });
  });
  yy += lines.length * 22 + 2;
  dl.forEach((ln, i) => {
    s += T(x + 16 + 40 + 12, yy + i * 18, ln, { size: 13, fill: C.muted });
  });
  yy += dl.length * 18 + 6;
  s += T(x + 16 + 40 + 12, yy + 4, a.h, { size: 12, fill: C.muted, tnum: true });
  yy += 22;
  s += K.btn(x + 16 + 40 + 12, yy + 4, a.a, { variant: 'secondary', h: 44, size: 14 }).s;
  s += T(x + w - 16, yy + 26, a.un ? 'Marcar como lido' : 'Lido', { size: 13, weight: 500, fill: a.un ? C.link : C.muted, anchor: 'end' });
  return { s, h };
}

function prefMobile(x, y, w, p) {
  const h = p.v ? 100 : 64;
  let s = '';
  s += T(x + 16, y + 22, p.l, { size: 15, weight: 500, max: w - 16 - 60 - 16 });
  s += T(x + 16, y + 44, p.d, { size: 13, fill: C.muted, max: w - 100 });
  s += K.switchC(x + w - 16 - 44, y + 32, p.on);
  if (p.v) {
    s += R(x + 16.5, y + 58.5, 140, 35, { fill: p.on ? C.surface : C.disabledBg, stroke: C.borderStrong, r: 8 });
    s += T(x + 28, y + 76, p.v, { size: 14, fill: p.on ? C.text : C.disabledText });
    s += Ic('check', x + 16 + 140 + 16 + 6, y + 76, 14, C.success, 2.5);
    s += T(x + 16 + 140 + 28, y + 76, 'Salvo', { size: 12, fill: C.successText });
  }
  return { s, h };
}

function celular() {
  return mobileShell({
    title: 'Alertas',
    active: 'alertas',
    body: (x, y, w) => {
      const f = new K.Flow(x, y, w, 12);
      f.add((fx, fy, fw) => K.tabs(fx, fy, fw, ['Central (3)', 'Preferências'], 0, { equal: true }), 4);
      f.add((fx, fy, fw) => {
        let s = T(fx, fy + 22, '3 não lidos', { size: 14, weight: 600 });
        s += K.btn(fx + fw - 140, fy, 'Marcar lidos', { variant: 'ghost', w: 140, h: 44, size: 14, icon: 'check' }).s;
        return { s, h: 44 };
      }, 4);
      alertas.forEach((a) => f.add((fx, fy, fw) => alertaMobile(fx, fy, fw, a)));
      f.add((fx, fy, fw) => ({ s: T(fx, fy + 14, 'Preferências', { size: 18, weight: 600 }), h: 28 }), 8);
      f.add((fx, fy, fw) => {
        let yy = fy;
        let inner = '';
        prefs.forEach((p, i) => {
          const r = prefMobile(fx, yy, fw, p);
          inner += r.s;
          yy += r.h;
          if (i < prefs.length - 1) inner += L(fx + 16, yy + 0.5, fx + fw - 16, yy + 0.5, C.border);
        });
        return { s: K.card(fx, fy, fw, yy - fy) + inner, h: yy - fy };
      });
      f.add((fx, fy, fw) => {
        const h = 270;
        let s = K.card(fx, fy, fw, h);
        s += T(fx + 16, fy + 26, 'Notificações por e-mail', { size: 16, weight: 600 });
        s += K.switchC(fx + fw - 16 - 44, fy + 26, true);
        s += K.field(fx + 16, fy + 52, fw - 32, 'E-mail de destino', 'rafael.moreira@exemplo.com.br', { h: 44, icon: 'mail' }).s;
        const opts = [['Fatura a vencer', true], ['Conexão com erro', true], ['Consentimento a expirar', true], ['Orçamento excedido', false]];
        opts.forEach((o, i) => {
          s += K.checkbox(fx + 16, fy + 150 + i * 28, o[1]);
          s += T(fx + 16 + 30, fy + 150 + i * 28, o[0], { size: 14 });
        });
        return { s, h };
      });
      return { s: f.s, h: f.h };
    },
  });
}

function desktop() {
  return desktopShell({
    title: 'Alertas',
    active: 'alertas',
    body: (x, y, w) => {
      const f = new K.Flow(x, y, w, 24);
      f.add((fx, fy, fw) => {
        const c2 = K.cols(fx, fw, 24, [7, 5]);
        const a = c2[0];
        const rh = 92;
        const hA = 100 + alertas.length * rh + 12;
        const b = c2[1];
        const hB = 640;
        let s = K.card(a.x, fy, a.w, Math.max(hA, hB)) + K.card(b.x, fy, b.w, Math.max(hA, hB));
        s += T(a.x + 24, fy + 34, 'Central de alertas', { size: 20, weight: 600 });
        s += K.btn(a.x + a.w - 24 - 200, fy + 16, 'Marcar todos como lidos', { variant: 'ghost', h: 36, size: 14, w: 200, icon: 'check' }).s;
        s += R(a.x + 24.5, fy + 56 + 0.5, 219, 31, { fill: C.surface, stroke: C.borderStrong, r: 8 });
        s += T(a.x + 36, fy + 72, 'Todos os tipos', { size: 14 });
        s += Ic('chevD', a.x + 24 + 200, fy + 72, 16, C.muted);
        s += K.segmented(a.x + a.w - 24 - 190, fy + 56, 190, 32, ['Não lidos', 'Todos'], 1, { size: 13 }).s;
        alertas.forEach((al, i) => {
          const ry = fy + 100 + i * rh;
          const cy = ry + rh / 2;
          s += L(a.x, ry + 0.5, a.x + a.w, ry + 0.5, C.border);
          if (al.un) s += `<circle cx="${a.x + 14}" cy="${cy}" r="4" fill="${C.primary}"/>`;
          s += iconCircle(a.x + 28, cy, al, 40);
          s += T(a.x + 84, cy - 22, al.t, { size: 15, weight: al.un ? 600 : 500, fill: al.un ? C.text : C.muted, max: a.w - 84 - 150 });
          s += T(a.x + 84, cy + 2, al.d, { size: 13, fill: C.muted, max: a.w - 84 - 24 });
          s += K.btn(a.x + 84, cy + 14, al.a, { variant: 'secondary', h: 28, size: 13 }).s;
          s += T(a.x + a.w - 24, cy - 22, al.h, { size: 12, fill: C.muted, anchor: 'end', tnum: true });
          s += T(a.x + a.w - 24, cy + 28, al.un ? 'Marcar como lido' : 'Lido', { size: 12, weight: 500, fill: al.un ? C.link : C.muted, anchor: 'end' });
        });
        s += T(b.x + 24, fy + 34, 'Preferências', { size: 20, weight: 600 });
        prefs.forEach((p, i) => {
          const ry = fy + 56 + i * 56;
          const cy = ry + 28;
          s += L(b.x, ry + 0.5, b.x + b.w, ry + 0.5, C.border);
          s += T(b.x + 24, cy - 9, p.l, { size: 14, weight: 500 });
          s += T(b.x + 24, cy + 11, p.d, { size: 12, fill: C.muted, max: p.v ? 190 : 260 });
          if (p.v) {
            s += R(b.x + b.w - 24 - 44 - 12 - 96 + 0.5, cy - 16 + 0.5, 95, 31, { fill: p.on ? C.surface : C.disabledBg, stroke: C.borderStrong, r: 8 });
            s += T(b.x + b.w - 24 - 44 - 12 - 96 + 12, cy, p.v, { size: 13, fill: p.on ? C.text : C.disabledText });
          }
          s += K.switchC(b.x + b.w - 24 - 44, cy, p.on);
        });
        const ey = fy + 56 + prefs.length * 56 + 8;
        s += L(b.x, ey + 0.5, b.x + b.w, ey + 0.5, C.border);
        s += T(b.x + 24, ey + 30, 'Notificações por e-mail', { size: 14, weight: 600 });
        s += K.switchC(b.x + b.w - 24 - 44, ey + 30, true);
        s += K.field(b.x + 24, ey + 52, b.w - 48, null, 'rafael.moreira@exemplo.com.br', { h: 40, icon: 'mail', size: 14 }).s;
        s += T(b.x + 24, ey + 112, 'Receber por e-mail:', { size: 13, fill: C.muted });
        [['Fatura a vencer', true], ['Conexão com erro', true], ['Consentimento a expirar', true], ['Orçamento excedido', false]].forEach((o, i) => {
          const cx = b.x + 24 + (i % 2) * 190;
          const cy2 = ey + 136 + Math.floor(i / 2) * 28;
          s += K.checkbox(cx, cy2, o[1]);
          s += T(cx + 28, cy2, o[0], { size: 13 });
        });
        return { s, h: Math.max(hA, hB) };
      });
      return { s: f.s, h: f.h };
    },
  });
}

module.exports = { id: '12', slug: 'alertas', nome: 'Alertas', celular, desktop };
