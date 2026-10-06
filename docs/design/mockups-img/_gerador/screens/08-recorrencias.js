const { C, T, R, L, G, Ic, tw, brl, pct, wrap } = require('../lib/core');
const K = require('../lib/comp');
const B = require('../lib/blocks');
const CH = require('../lib/charts');
const { mobileShell, desktopShell } = require('../lib/shell');
const D = require('../data');

const detectadas = [
  { nome: 'Disney+', v: 33.9, per: 'Mensal', ult: '28/09/2026', conf: 'Alta', cat: D.cat.assinaturas },
  { nome: 'Associação AABB (mensalidade)', v: 128.0, per: 'Mensal', ult: '02/10/2026', conf: 'Média', cat: D.cat.lazer },
  { nome: 'Estacionamento Park Center', v: 250.0, per: 'Mensal', ult: '01/10/2026', conf: 'Baixa', cat: D.cat.transporte },
];

const pagar = [
  { d: '07/10', desc: 'Curso de inglês', v: -480.0 },
  { d: '08/10', desc: 'Fatura Nubank', v: -2310.0, fatura: true },
  { d: '10/10', desc: 'Aluguel · Imobiliária Central', v: -2100.0 },
  { d: '10/10', desc: 'Condomínio Edifício Aurora', v: -420.0 },
  { d: '10/10', desc: 'Fatura Itaú Mastercard', v: -1874.52, fatura: true },
  { d: '12/10', desc: 'Internet Vivo Fibra', v: -129.9 },
  { d: '18/10', desc: 'Energia elétrica (estimada)', v: -150.1 },
  { d: '20/10', desc: 'Plano de saúde Unimed', v: -455.6 },
  { d: '30/10', desc: 'Smart Fit Mensalidade', v: -119.9 },
];
const totalPagar = pagar.reduce((a, p) => a + p.v, 0);
const saldoFimOut = D.saldoTotal + totalPagar;
const liq = 9800 - D.recMensal - 450 - 3800;
const proj = [{ l: 'hoje', v: D.saldoTotal }, { l: 'out', v: saldoFimOut }];
let acc = saldoFimOut + 9800 - D.recMensal - (D.cartoes[0].aberta.valor + D.cartoes[1].aberta.valor) - 3800;
proj.push({ l: 'nov', v: acc });
['dez', 'jan', 'fev', 'mar', 'abr'].forEach((m) => {
  acc += liq;
  proj.push({ l: m, v: acc });
});

function confBadge(x, cy, c) {
  if (c === 'Alta') return K.badge(x, cy, 'Confiança alta', 'ok', 'circleCheck');
  if (c === 'Média') return K.badge(x, cy, 'Confiança média', 'warning', 'triAlert');
  return K.badge(x, cy, 'Confiança baixa', 'neutral', 'circle');
}

function origemChip(x, cy, o) {
  return o === 'Manual' ? K.badge(x, cy, 'Manual', 'info', 'penLine', { chip: true }) : K.badge(x, cy, 'Detectada', 'info', 'sparkles', { chip: true });
}

function detCardMobile(x, y, w, d) {
  const h = 168;
  let s = K.card(x, y, w, h);
  s += Ic('sparkles', x + 16 + 8, y + 26, 16, C.info);
  s += T(x + 16 + 24, y + 26, d.nome, { size: 16, weight: 600, max: w - 32 - 24 });
  s += T(x + 16, y + 54, `${brl(d.v)} · ${d.per}`, { size: 14, weight: 500, tnum: true });
  s += T(x + w - 16, y + 54, `Última ${d.ult.slice(0, 5)}`, { size: 13, fill: C.muted, anchor: 'end', tnum: true });
  s += B.catBadge(x + 16, y + 82, d.cat).s;
  const cb = confBadge(0, 0, d.conf);
  s += confBadge(x + w - 16 - cb.w, y + 82, d.conf).s;
  const bw = (w - 32 - 16) / 3;
  s += K.btn(x + 16, y + 112, 'Descartar', { variant: 'ghost', w: bw, h: 44, size: 14 }).s;
  s += K.btn(x + 16 + bw + 8, y + 112, 'Editar', { variant: 'secondary', w: bw, h: 44, size: 14 }).s;
  s += K.btn(x + 16 + (bw + 8) * 2, y + 112, 'Confirmar', { variant: 'primary', w: bw, h: 44, size: 14 }).s;
  return { s, h };
}

function ativaMobile(x, y, w, r) {
  const h = 80;
  let s = '';
  s += T(x + 16, y + 24, r.desc, { size: 16, weight: 500, max: w - 32 - 120 });
  s += K.money(x + w - 16, y + 24, r.v, { size: 16, weight: 500, anchor: 'end', kind: r.receita ? 'income' : 'expense', sign: r.receita ? 'plus' : 'auto' });
  s += T(x + 16, y + 50, `Próx. ${r.prox}`, { size: 13, fill: C.muted, tnum: true });
  const ob = origemChip(0, 0, r.origem);
  s += origemChip(x + w - 16 - ob.w, y + 50, r.origem).s;
  s += K.swatch(x + 16 + tw(`Próx. ${r.prox}`, 13, 400, true) + 12, y + 50, B.catColor(r.cat), 10);
  s += T(x + 16 + tw(`Próx. ${r.prox}`, 13, 400, true) + 28, y + 50, r.cat.nome, { size: 13, fill: C.muted });
  return { s, h };
}

function celular() {
  return mobileShell({
    title: 'Recorrências',
    active: 'recorrencias',
    body: (x, y, w) => {
      const f = new K.Flow(x, y, w, 16);
      f.add((fx, fy, fw) => K.btn(fx, fy, 'Nova recorrência', { variant: 'secondary', w: fw, h: 44, icon: 'plus' }));
      f.add((fx, fy, fw) => K.tabs(fx, fy, fw, ['Detectadas (3)', 'Ativas', 'Projeção'], 0, { equal: true }), 12);
      f.add((fx, fy, fw) => ({ s: T(fx, fy + 12, 'Detectadas a confirmar', { size: 18, weight: 600 }), h: 24 }), 12);
      detectadas.forEach((d) => f.add((fx, fy, fw) => detCardMobile(fx, fy, fw, d), 12));
      f.add((fx, fy, fw) => ({ s: T(fx, fy + 12, 'Ativas', { size: 18, weight: 600 }), h: 24 }), 12);
      f.add((fx, fy, fw) => {
        let yy = fy;
        let inner = '';
        D.recorrencias.forEach((r, i) => {
          const a = ativaMobile(fx, yy, fw, r);
          inner += a.s;
          yy += a.h;
          if (i < D.recorrencias.length - 1) inner += L(fx + 16, yy + 0.5, fx + fw - 16, yy + 0.5, C.border);
        });
        return { s: K.card(fx, fy, fw, yy - fy) + inner, h: yy - fy };
      });
      f.add((fx, fy, fw) => {
        const h = 132;
        let s = K.card(fx, fy, fw, h);
        s += T(fx + 16, fy + 26, 'Total mensal estimado', { size: 14, fill: C.muted });
        s += K.money(fx + fw - 16, fy + 26, -D.recMensal, { size: 20, weight: 600, anchor: 'end', kind: 'expense' });
        s += T(fx + 16, fy + 66, 'Total anual estimado', { size: 14, fill: C.muted });
        s += K.money(fx + fw - 16, fy + 66, -D.recAnual, { size: 20, weight: 600, anchor: 'end', kind: 'expense' });
        s += T(fx + 16, fy + 104, 'Só despesas (o salário não entra no total).', { size: 12, fill: C.muted, max: fw - 32 });
        return { s, h };
      });
      f.add((fx, fy, fw) => ({ s: T(fx, fy + 12, 'Projeção de saldo', { size: 18, weight: 600 }), h: 24 }), 12);
      f.add((fx, fy, fw) => {
        const h = 380;
        let s = K.card(fx, fy, fw, h);
        s += K.segmented(fx + 16, fy + 16, fw - 32, 40, ['3 meses', '6 meses', '12 meses'], 1, { size: 14 }).s;
        s += T(fx + 16, fy + 80, `Saldo previsto em out/2026: ${brl(saldoFimOut)}.`, { size: 14, fill: C.muted, max: fw - 32 });
        s += CH.lineChart(fx + 16, fy + 100, fw - 32, 230, proj, { min: 10000, max: 30000, ticks: 4, left: 56, dashFrom: 1, endLabel: undefined });
        s += T(fx + 16, fy + 348, 'Tracejado = projeção. Eixo não começa em zero.', { size: 12, fill: C.muted });
        s += T(fx + 16, fy + 366, 'Premissas: recorrências, parcelas, gasto variável médio.', { size: 12, fill: C.muted, max: fw - 32 });
        return { s, h };
      });
      f.add((fx, fy, fw) => {
        let s = T(fx, fy + 12, 'Contas a pagar em outubro', { size: 16, weight: 600 });
        let yy = fy + 32;
        let inner = '';
        pagar.forEach((p, i) => {
          inner += T(fx + 16, yy + 28, p.d, { size: 14, weight: 500, tnum: true, fill: C.muted });
          inner += T(fx + 68, yy + 28, p.desc, { size: 14, max: fw - 68 - 16 - 96 });
          inner += K.money(fx + fw - 16, yy + 28, p.v, { size: 14, weight: 500, anchor: 'end', kind: 'expense' });
          yy += 52;
          if (i < pagar.length - 1) inner += L(fx + 16, yy + 0.5, fx + fw - 16, yy + 0.5, C.border);
        });
        inner += L(fx, yy + 0.5, fx + fw, yy + 0.5, C.border);
        inner += T(fx + 16, yy + 26, 'Saldo previsto ao fim do mês', { size: 14, weight: 600 });
        inner += K.money(fx + fw - 16, yy + 26, saldoFimOut, { size: 14, weight: 600, anchor: 'end' });
        yy += 52;
        return { s: s + K.card(fx, fy + 32, fw, yy - fy - 32) + inner, h: yy - fy };
      });
      return { s: f.s, h: f.h };
    },
  });
}

function desktop() {
  return desktopShell({
    title: 'Recorrências',
    active: 'recorrencias',
    body: (x, y, w) => {
      const f = new K.Flow(x, y, w, 24);
      f.add((fx, fy, fw) => {
        const b = K.btn(0, 0, 'Nova recorrência', { variant: 'secondary', h: 40, size: 15, icon: 'plus' });
        return { s: K.btn(fx + fw - b.w, fy, 'Nova recorrência', { variant: 'secondary', h: 40, size: 15, icon: 'plus' }).s, h: 40 };
      }, 16);
      f.add((fx, fy, fw) => K.tabs(fx, fy, fw, ['Detectadas (3)', 'Ativas', 'Projeção'], 0), 8);
      f.add((fx, fy, fw) => {
        const rh = 76;
        const h = 60 + detectadas.length * rh;
        let s = K.card(fx, fy, fw, h);
        s += Ic('sparkles', fx + 24 + 10, fy + 30, 20, C.info);
        s += T(fx + 24 + 30, fy + 30, 'Detectadas a confirmar', { size: 18, weight: 600 });
        s += T(fx + fw - 24, fy + 30, 'Encontramos padrões no seu histórico. Confirme para incluí-las na projeção.', { size: 13, fill: C.muted, anchor: 'end' });
        detectadas.forEach((d, i) => {
          const ry = fy + 60 + i * rh;
          const cy = ry + rh / 2;
          s += L(fx, ry + 0.5, fx + fw, ry + 0.5, C.border);
          s += T(fx + 24, cy - 12, d.nome, { size: 16, weight: 600, max: 330 });
          s += T(fx + 24, cy + 12, `Última ocorrência: ${d.ult}`, { size: 13, fill: C.muted, tnum: true });
          s += K.money(fx + 430, cy - 12, -d.v, { size: 16, weight: 600, anchor: 'end', kind: 'expense' });
          s += T(fx + 430, cy + 12, d.per, { size: 13, fill: C.muted, anchor: 'end' });
          s += B.catBadge(fx + 470, cy, d.cat).s;
          s += confBadge(fx + 620, cy, d.conf).s;
          let bx = fx + fw - 24;
          const b3 = K.btn(0, 0, 'Confirmar', { variant: 'primary', h: 40, size: 15 });
          bx -= b3.w;
          s += K.btn(bx, cy - 20, 'Confirmar', { variant: 'primary', h: 40, size: 15 }).s;
          const b2 = K.btn(0, 0, 'Editar', { variant: 'secondary', h: 40, size: 15 });
          bx -= 8 + b2.w;
          s += K.btn(bx, cy - 20, 'Editar', { variant: 'secondary', h: 40, size: 15 }).s;
          const b1 = K.btn(0, 0, 'Descartar', { variant: 'ghost', h: 40, size: 15 });
          bx -= 8 + b1.w;
          s += K.btn(bx, cy - 20, 'Descartar', { variant: 'ghost', h: 40, size: 15 }).s;
        });
        return { s, h };
      });
      f.add((fx, fy, fw) => {
        const rh = 52;
        const head = 44;
        const defs = [
          { label: 'Descrição', r: (r, cx, cy, cw) => T(cx, cy, r.desc, { size: 14, weight: 500, max: cw }) },
          { label: 'Valor', w: 130, align: 'right', r: (r, cx, cy, cw) => K.money(cx + cw, cy, r.v, { size: 14, weight: 500, anchor: 'end', kind: r.receita ? 'income' : 'expense', sign: r.receita ? 'plus' : 'auto' }) },
          { label: 'Periodicidade', w: 110, r: (r, cx, cy) => T(cx, cy, r.per, { size: 14 }) },
          { label: 'Próxima data', w: 110, r: (r, cx, cy) => T(cx, cy, r.prox, { size: 14, tnum: true }) },
          { label: 'Categoria', w: 170, r: (r, cx, cy) => B.catBadge(cx, cy, r.cat).s },
          { label: 'Origem', w: 110, r: (r, cx, cy) => origemChip(cx, cy, r.origem).s },
          { label: '', w: 24, r: (r, cx, cy) => Ic('dotsV', cx + 12, cy, 20, C.muted) },
        ];
        const cols = K.colsFit(fw, defs, 16, 24);
        const rows = D.recorrencias;
        const h = 60 + head + rows.length * rh + 72;
        let s = K.card(fx, fy, fw, h);
        s += T(fx + 24, fy + 30, 'Recorrências ativas', { size: 18, weight: 600 });
        s += T(fx + fw - 24, fy + 30, `${rows.length} ativas`, { size: 13, fill: C.muted, anchor: 'end' });
        const hd = K.tableHead(fx, fy + 60, fw, cols, { h: head, pad: 24, gap: 16 });
        const rw = K.tableRows(fx, fy + 60 + head, fw, cols, rows, { rh, pad: 24, gap: 16, lastLine: true });
        s += hd.s + rw.s;
        const ty = fy + 60 + head + rows.length * rh;
        s += T(fx + 24, ty + 24, 'Total mensal estimado (despesas)', { size: 14, fill: C.muted });
        s += K.money(fx + 24, ty + 50, -D.recMensal, { size: 24, weight: 600, kind: 'expense' });
        s += T(fx + 400, ty + 24, 'Total anual estimado (despesas)', { size: 14, fill: C.muted });
        s += K.money(fx + 400, ty + 50, -D.recAnual, { size: 24, weight: 600, kind: 'expense' });
        s += T(fx + fw - 24, ty + 40, 'O salário recorrente não entra nos totais de despesa.', { size: 13, fill: C.muted, anchor: 'end' });
        return { s, h };
      });
      f.add((fx, fy, fw) => K.banner(fx, fy, fw, 'info', 'Premissas da projeção', 'Considera recorrências ativas, parcelas de cartão e gasto variável médio de R$ 3.800,00 por mês (últimos 3 meses). Em outubro, apenas os compromissos listados.', { }), 16);
      f.add((fx, fy, fw) => {
        const c2 = K.cols(fx, fw, 24, [7, 5]);
        const h = 456;
        let s = K.card(c2[0].x, fy, c2[0].w, h) + K.card(c2[1].x, fy, c2[1].w, h);
        const a = c2[0];
        s += T(a.x + 24, fy + 36, 'Saldo previsto', { size: 20, weight: 600 });
        s += K.segmented(a.x + a.w - 24 - 260, fy + 20, 260, 32, ['3 meses', '6 meses', '12 meses'], 1, { size: 13 }).s;
        s += T(a.x + 24, fy + 70, `Em 31/10/2026 o saldo previsto é ${brl(saldoFimOut)}, após as faturas e contas do mês.`, { size: 14, fill: C.muted, max: a.w - 48 });
        s += CH.lineChart(a.x + 24, fy + 92, a.w - 48, 280, proj, { min: 10000, max: 30000, ticks: 4, left: 64, dashFrom: 1 });
        s += T(a.x + 24, fy + h - 22, 'Tracejado = projeção · Eixo não começa em zero · Atualizado há 12 min', { size: 12, fill: C.muted });
        const b = c2[1];
        s += T(b.x + 24, fy + 36, 'Contas a pagar em outubro', { size: 20, weight: 600 });
        pagar.forEach((p, i) => {
          const cy = fy + 76 + i * 34;
          s += T(b.x + 24, cy, p.d, { size: 14, weight: 500, fill: C.muted, tnum: true });
          s += T(b.x + 70, cy, p.desc, { size: 14, max: b.w - 70 - 24 - 90 });
          s += K.money(b.x + b.w - 24, cy, p.v, { size: 14, weight: 500, anchor: 'end', kind: 'expense' });
        });
        const ly = fy + 76 + pagar.length * 34 + 6;
        s += L(b.x + 24, ly + 0.5, b.x + b.w - 24, ly + 0.5, C.border);
        s += T(b.x + 24, ly + 26, 'Saldo previsto ao fim do mês', { size: 14, weight: 600 });
        s += K.money(b.x + b.w - 24, ly + 26, saldoFimOut, { size: 14, weight: 600, anchor: 'end' });
        return { s, h };
      });
      return { s: f.s, h: f.h };
    },
  });
}

module.exports = { id: '08', slug: 'recorrencias', nome: 'Recorrências', celular, desktop };
