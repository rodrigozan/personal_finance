const { C, T, R, L, G, Ic, tw, brl, pct, wrap } = require('../lib/core');
const K = require('../lib/comp');
const B = require('../lib/blocks');
const { mobileShell, desktopShell } = require('../lib/shell');
const D = require('../data');

const metas = [
  { nome: 'Reserva de emergência', atual: 18000, alvo: 30000, prazo: '31/12/2027', meses: 15 },
  { nome: 'Viagem a Lisboa', atual: 6200, alvo: 12000, prazo: '30/06/2027', meses: 9 },
  { nome: 'Entrada do apartamento', atual: 41000, alvo: 120000, prazo: '31/12/2030', meses: 51 },
];

const realizado = D.despesas;
const planejado = D.planejadoTotal;
const restante = planejado - realizado;

function situacao(g) {
  const r = g.v / g.plan;
  if (r > 1.0000001) return { st: 'error', txt: `Excedido em ${brl(g.v - g.plan)}`, icon: 'octAlert', col: C.dangerText, ic: C.danger, r };
  if (Math.abs(r - 1) < 1e-9) return { st: 'limite', txt: 'No limite', icon: 'circleCheck', col: C.warningText, ic: C.warning, r };
  if (r >= 0.9) return { st: 'warning', txt: 'Próximo do limite', icon: 'triAlert', col: C.warningText, ic: C.warning, r };
  return { st: 'ok', txt: 'Dentro do planejado', icon: 'circleCheck', col: C.successText, ic: C.success, r };
}

function barOf(x, y, w, g, h = 12) {
  const sit = situacao(g);
  return K.budgetBar(x, y, w, h, sit.r).s;
}

function periodBarMonthly(W) {
  let s = R(0, 0, W, 52, { fill: C.surface });
  s += L(0, 51.5, W, 51.5, C.border);
  s += Ic('chevL', 36, 26, 22, C.text, 2);
  s += T(W / 2, 19, 'Out/2026', { size: 16, weight: 600, anchor: 'middle', tnum: true });
  s += Ic('chevR', W - 36, 26, 22, C.text, 2);
  s += T(W / 2, 37, '05/09 a 04/10', { size: 13, fill: C.muted, anchor: 'middle', tnum: true });
  return { s, h: 52 };
}

function metaCardMobile(x, y, w, m) {
  const h = 196;
  const p = m.atual / m.alvo;
  let s = K.card(x, y, w, h);
  s += Ic('target', x + 16 + 10, y + 26, 20, C.primary);
  s += T(x + 16 + 30, y + 26, m.nome, { size: 16, weight: 600 });
  s += Ic('dotsV', x + w - 16 - 10, y + 26, 20, C.muted);
  s += T(x + 16, y + 62, `${brl(m.atual, { dec: false })} de ${brl(m.alvo, { dec: false })}`, { size: 14, weight: 500, tnum: true });
  s += T(x + w - 16, y + 62, pct(p * 100, 0), { size: 14, weight: 600, anchor: 'end', tnum: true });
  s += K.progress(x + 16, y + 78, w - 32, 12, p, 'primary').s;
  s += T(x + 16, y + 112, `Prazo ${m.prazo} · Faltam ${brl(m.alvo - m.atual, { dec: false })}`, { size: 13, fill: C.muted, tnum: true });
  s += T(x + 16, y + 134, `Sugestão: ${brl((m.alvo - m.atual) / m.meses)}/mês`, { size: 13, fill: C.muted, tnum: true });
  s += K.btn(x + 16, y + 148, 'Registrar aporte', { variant: 'secondary', w: w - 32, h: 36, size: 14 }).s;
  return { s, h };
}

function celular() {
  return mobileShell({
    title: 'Orçamento e metas',
    active: 'orcamento',
    periodBar: periodBarMonthly,
    body: (x, y, w) => {
      const f = new K.Flow(x, y, w, 12);
      f.add((fx, fy, fw) => K.tabs(fx, fy, fw, ['Orçamento', 'Metas'], 0, { equal: true }));
      f.add((fx, fy, fw) => {
        const h = 232;
        let s = K.card(fx, fy, fw, h);
        s += T(fx + 16, fy + 24, 'Planejado', { size: 13, fill: C.muted });
        s += K.money(fx + 16, fy + 50, planejado, { size: 20, weight: 600 });
        s += T(fx + fw / 2 + 4, fy + 24, `Realizado (${pct((realizado / planejado) * 100, 1)})`, { size: 13, fill: C.muted });
        s += K.money(fx + fw / 2 + 4, fy + 50, realizado, { size: 20, weight: 600 });
        s += K.progress(fx + 16, fy + 78, fw - 32, 12, realizado / planejado, 'warning').s;
        s += Ic('triAlert', fx + 16 + 8, fy + 114, 16, C.warning);
        s += T(fx + 16 + 24, fy + 114, 'Próximo do limite', { size: 14, weight: 500, fill: C.warningText });
        s += T(fx + fw - 16, fy + 114, `Restante ${brl(restante)}`, { size: 14, weight: 600, anchor: 'end', tnum: true });
        s += T(fx + 16, fy + 142, '3 de 9 categorias excedidas', { size: 13, fill: C.muted });
        s += K.btn(fx + 16, fy + 164, 'Copiar mês anterior', { variant: 'secondary', w: fw - 32, h: 44, icon: 'copy' }).s;
        return { s, h };
      });
      D.gastosCat.forEach((g) => {
        f.add((fx, fy, fw) => {
          const h = 128;
          const sit = situacao(g);
          let s = K.card(fx, fy, fw, h);
          s += K.swatch(fx + 16, fy + 26, B.catColor(g.c), 12);
          s += T(fx + 36, fy + 26, g.c.nome, { size: 16, weight: 600 });
          s += T(fx + fw - 16 - 44, fy + 26, pct(sit.r * 100, 0), { size: 14, weight: 600, anchor: 'end', tnum: true });
          s += Ic('pencil', fx + fw - 16 - 12, fy + 26, 18, C.muted);
          s += Ic(sit.icon, fx + 16 + 8, fy + 54, 16, sit.ic);
          s += T(fx + 16 + 24, fy + 54, sit.txt, { size: 14, weight: 500, fill: sit.col });
          s += barOf(fx + 16, fy + 72, fw - 32, g);
          s += T(fx + 16, fy + 106, `Realizado ${brl(g.v)} de ${brl(g.plan)}`, { size: 13, fill: C.muted, tnum: true, max: fw - 32 });
          return { s, h };
        });
      });
      f.add((fx, fy, fw) => {
        let s = T(fx, fy + 14, 'Metas de economia', { size: 18, weight: 600 });
        s += K.btn(fx + fw - 112, fy - 4, 'Nova meta', { variant: 'secondary', h: 36, size: 14, icon: 'plus', w: 112 }).s;
        return { s, h: 36 };
      }, 12);
      metas.forEach((m) => f.add((fx, fy, fw) => metaCardMobile(fx, fy, fw, m)));
      return { s: f.s, h: f.h };
    },
  });
}

function desktop() {
  return desktopShell({
    title: 'Orçamento e metas',
    active: 'orcamento',
    body: (x, y, w) => {
      const f = new K.Flow(x, y, w, 24);
      f.add((fx, fy, fw) => {
        const b = K.btn(0, 0, 'Copiar mês anterior', { variant: 'secondary', h: 40, size: 15, icon: 'copy' });
        let s = T(fx, fy + 20, 'Mês financeiro: 05/09 a 04/10/2026 (início no dia 5)', { size: 14, fill: C.muted, tnum: true });
        s += K.btn(fx + fw - b.w, fy, 'Copiar mês anterior', { variant: 'secondary', h: 40, size: 15, icon: 'copy' }).s;
        return { s, h: 40 };
      }, 16);
      f.add((fx, fy, fw) => K.tabs(fx, fy, fw, ['Orçamento', 'Metas'], 0), 8);
      f.add((fx, fy, fw) => {
        const h = 168;
        let s = K.card(fx, fy, fw, h);
        const items = [
          ['Planejado', brl(planejado), C.text],
          ['Realizado', brl(realizado), C.text],
          ['Restante', brl(restante), C.text],
          ['Percentual usado', pct((realizado / planejado) * 100, 1), C.warningText],
        ];
        const cw = (fw - 48) / 4;
        items.forEach((it, i) => {
          const cx = fx + 24 + i * cw;
          s += T(cx, fy + 34, it[0], { size: 14, fill: C.muted });
          s += T(cx, fy + 68, it[1], { size: 28, weight: 600, tnum: true, fill: it[2], ls: -0.56 });
          if (i > 0) s += L(cx - 16, fy + 22, cx - 16, fy + 82, C.border);
        });
        s += K.progress(fx + 24, fy + 106, fw - 48, 16, realizado / planejado, 'warning', { mark: 1 }).s;
        s += Ic('triAlert', fx + 24 + 8, fy + 144, 16, C.warning);
        s += T(fx + 24 + 24, fy + 144, 'Próximo do limite · 3 de 9 categorias excedidas', { size: 14, weight: 500, fill: C.warningText });
        return { s, h };
      });
      f.add((fx, fy, fw) => {
        const rh = 56;
        const head = 48;
        const defs = [
          { label: 'Categoria', r: (g, cx, cy, cw) => K.swatch(cx, cy, B.catColor(g.c), 12) + T(cx + 22, cy, g.c.nome, { size: 14, weight: 500 }) },
          { label: 'Planejado', w: 150, align: 'right', r: (g, cx, cy, cw) => R(cx + 0.5, cy - 18 + 0.5, cw - 1, 35, { fill: C.surface, stroke: C.borderStrong, r: 8 }) + K.money(cx + cw - 12, cy, g.plan, { size: 14, anchor: 'end' }) },
          { label: 'Realizado', w: 130, align: 'right', r: (g, cx, cy, cw) => K.money(cx + cw, cy, g.v, { size: 14, weight: 600, anchor: 'end', kind: g.v > g.plan ? 'expense' : 'plain', sign: 'none' }) },
          { label: '% usado', w: 80, align: 'right', r: (g, cx, cy, cw) => T(cx + cw, cy, pct((g.v / g.plan) * 100, 0), { size: 14, anchor: 'end', tnum: true }) },
          { label: 'Situação', w: 340, r: (g, cx, cy, cw) => {
            const sit = situacao(g);
            let s = barOf(cx, cy - 6, 130, g);
            s += Ic(sit.icon, cx + 130 + 16 + 8, cy, 16, sit.ic);
            s += T(cx + 130 + 16 + 28, cy, sit.txt, { size: 13, weight: 500, fill: sit.col, max: cw - 130 - 44 });
            return s;
          } },
        ];
        const cols = K.colsFit(fw, defs, 16, 24);
        const rows = D.gastosCat;
        const h = head + rows.length * rh + 56;
        let s = K.card(fx, fy, fw, h);
        const hd = K.tableHead(fx, fy, fw, cols, { h: head, pad: 24, gap: 16 });
        const rw = K.tableRows(fx, fy + head, fw, cols, rows, { rh, pad: 24, gap: 16, lastLine: true });
        s += `<clipPath id="oc"><rect x="${fx}" y="${fy}" width="${fw}" height="${h}" rx="12"/></clipPath><g clip-path="url(#oc)">${hd.s}${rw.s}</g>`;
        const ty = fy + head + rows.length * rh;
        s += R(fx + 1, ty, fw - 2, 55, { fill: C.surfaceSunken });
        s += T(fx + 24, ty + 28, 'Total', { size: 14, weight: 600 });
        let cx = fx + 24;
        cols.forEach((c, i) => {
          if (c.label === 'Planejado') s += K.money(cx + c.w - 12, ty + 28, planejado, { size: 14, weight: 600, anchor: 'end' });
          if (c.label === 'Realizado') s += K.money(cx + c.w, ty + 28, realizado, { size: 14, weight: 600, anchor: 'end' });
          if (c.label === '% usado') s += T(cx + c.w, ty + 28, pct((realizado / planejado) * 100, 1), { size: 14, weight: 600, anchor: 'end', tnum: true });
          cx += c.w + 16;
        });
        s += R(fx + 0.5, fy + 0.5, fw - 1, h - 1, { stroke: C.border, r: 11.5 });
        return { s, h };
      });
      f.add((fx, fy, fw) => {
        let s = T(fx, fy + 14, 'Metas de economia', { size: 20, weight: 600 });
        const b = K.btn(0, 0, 'Nova meta', { variant: 'primary', h: 40, size: 15, icon: 'plus' });
        s += K.btn(fx + fw - b.w, fy - 6, 'Nova meta', { variant: 'primary', h: 40, size: 15, icon: 'plus' }).s;
        return { s, h: 36 };
      }, 12);
      f.add((fx, fy, fw) => {
        const c3 = K.cols(fx, fw, 24, [4, 4, 4]);
        let s = '';
        const h = 216;
        metas.forEach((m, i) => {
          const c = c3[i];
          const p = m.atual / m.alvo;
          s += K.card(c.x, fy, c.w, h);
          s += Ic('target', c.x + 24 + 10, fy + 34, 20, C.primary);
          s += T(c.x + 24 + 30, fy + 34, m.nome, { size: 16, weight: 600, max: c.w - 120 });
          s += Ic('dotsV', c.x + c.w - 24 - 10, fy + 34, 20, C.muted);
          s += T(c.x + 24, fy + 74, brl(m.atual, { dec: false }), { size: 24, weight: 600, tnum: true, ls: -0.48 });
          s += T(c.x + 24 + tw(brl(m.atual, { dec: false }), 24, 600, true) + 8, fy + 76, `de ${brl(m.alvo, { dec: false })}`, { size: 14, fill: C.muted, tnum: true });
          s += T(c.x + c.w - 24, fy + 74, pct(p * 100, 0), { size: 16, weight: 600, anchor: 'end', tnum: true });
          s += K.progress(c.x + 24, fy + 96, c.w - 48, 12, p, 'primary').s;
          s += T(c.x + 24, fy + 130, `Prazo ${m.prazo} · Faltam ${brl(m.alvo - m.atual, { dec: false })}`, { size: 13, fill: C.muted, tnum: true });
          s += T(c.x + 24, fy + 152, `Sugestão: ${brl((m.alvo - m.atual) / m.meses)}/mês`, { size: 13, fill: C.muted, tnum: true });
          s += K.btn(c.x + 24, fy + 166, 'Registrar aporte', { variant: 'secondary', h: 32, size: 14 }).s;
        });
        return { s, h };
      });
      return { s: f.s, h: f.h };
    },
  });
}

module.exports = { id: '07', slug: 'orcamento', nome: 'Orçamento e metas', celular, desktop };
