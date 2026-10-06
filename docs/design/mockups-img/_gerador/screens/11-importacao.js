const { C, T, R, L, G, Ic, tw, brl, pct, wrap } = require('../lib/core');
const K = require('../lib/comp');
const B = require('../lib/blocks');
const { logo } = require('../lib/logos');
const { mobileShell, desktopShell } = require('../lib/shell');
const D = require('../data');

const linhas = [
  { d: '31/08/2026', desc: 'PIX RECEB. LUCAS FERREIRA', v: 1200.0, cat: D.cat.freelance, sit: 'nova' },
  { d: '31/08/2026', desc: 'NETFLIX.COM', v: -55.9, cat: D.cat.assinaturas, sit: 'nova' },
  { d: '30/08/2026', desc: 'PADARIA ESTRELA DO SUL', v: -24.5, cat: D.cat.alimentacao, sit: 'nova' },
  { d: '29/08/2026', desc: 'UBER *TRIP', v: -18.4, cat: D.cat.transporte, sit: 'dup' },
  { d: '29/08/2026', desc: 'SUPERMERCADO ATACADÃO', v: -312.77, cat: D.cat.alimentacao, sit: 'nova' },
  { d: '28/08/2026', desc: 'FARMACIA PAGUE MENOS', v: -89.9, cat: D.cat.saude, sit: 'nova' },
  { d: '28/08/2026', desc: 'PIX ENVIADO MARIA SOUZA', v: -150.0, cat: null, sit: 'nova' },
  { d: '31/02/2026', desc: 'PAGTO BOLETO DIVERSOS', v: -240.0, cat: null, sit: 'erro', msg: 'Data inválida' },
  { d: '27/08/2026', desc: 'SPOTIFY', v: -21.9, cat: D.cat.assinaturas, sit: 'dup' },
  { d: '26/08/2026', desc: 'POSTO IPIRANGA', v: -180.0, cat: D.cat.transporte, sit: 'nova' },
];

const lotes = [
  { arq: 'extrato-inter-set-2026.ofx', data: '02/10/2026', dest: 'Inter Conta Digital', fmt: 'OFX', qtd: 112, st: 'ativo' },
  { arq: 'fatura-nubank-ago-2026.csv', data: '03/09/2026', dest: 'Nubank •4821', fmt: 'CSV', qtd: 64, st: 'ativo' },
  { arq: 'extrato-inter-jul-2026.csv', data: '05/08/2026', dest: 'Inter Conta Digital', fmt: 'CSV', qtd: 41, st: 'desfeito' },
];

function sitBadge(x, cy, s) {
  if (s === 'nova') return K.badge(x, cy, 'Nova', 'ok', 'circleCheck');
  if (s === 'dup') return K.badge(x, cy, 'Duplicada', 'neutral', 'copy');
  return K.badge(x, cy, 'Erro', 'error', 'octAlert');
}

function loteBadge(x, cy, s) {
  return s === 'ativo' ? K.badge(x, cy, 'Ativo', 'ok', 'circleCheck') : K.badge(x, cy, 'Desfeito', 'neutral', 'circleX');
}

function stepperD(x, y, w) {
  const steps = ['Arquivo', 'Mapeamento', 'Pré-visualização', 'Confirmação'];
  const sw = w / 4;
  let s = '';
  steps.forEach((lab, i) => {
    const cx = x + sw * i + sw / 2;
    const done = i < 2;
    const cur = i === 2;
    if (i < 3) s += L(cx + 22, y + 16, cx + sw - 22, y + 16, i < 2 ? C.primary : C.border, 2);
    s += `<circle cx="${cx}" cy="${y + 16}" r="16" fill="${done ? C.primary : cur ? C.surface : C.surface}" stroke="${done || cur ? C.primary : C.borderStrong}" stroke-width="${cur ? 2.5 : 1.5}"/>`;
    if (done) s += Ic('check', cx, y + 16, 16, '#FFFFFF', 3);
    else s += T(cx, y + 16, String(i + 1), { size: 14, weight: 600, fill: cur ? C.primary : C.muted, anchor: 'middle' });
    s += T(cx, y + 48, lab, { size: 14, weight: cur ? 600 : 500, fill: cur ? C.text : C.muted, anchor: 'middle' });
  });
  return { s, h: 62 };
}

function summaryD(x, y, w) {
  const items = [
    ['Lidos', '86', 'neutral', 'fileText'],
    ['Novas', '71', 'ok', 'circleCheck'],
    ['Duplicadas', '13', 'neutral', 'copy'],
    ['Com erro', '2', 'error', 'octAlert'],
  ];
  const cw = (w - 48) / 5;
  let s = '';
  items.forEach((it, i) => {
    const cx = x + i * cw;
    s += T(cx, y + 8, it[0], { size: 13, fill: C.muted });
    s += T(cx, y + 34, it[1], { size: 24, weight: 600, tnum: true, fill: it[2] === 'error' ? C.dangerText : it[2] === 'ok' ? C.successText : C.text });
  });
  s += T(x + 4 * cw, y + 8, 'A importar', { size: 13, fill: C.muted });
  s += K.money(x + 4 * cw, y + 34, 4120.0, { size: 15, weight: 600, kind: 'income', sign: 'plus' });
  s += K.money(x + 4 * cw + 110, y + 34, -2386.17, { size: 15, weight: 600, kind: 'expense' });
  return { s, h: 56 };
}

function tabelaD(x, y, w) {
  const rh = 48;
  const defs = [
    { label: '', w: 28, r: (r, cx, cy) => K.checkbox(cx + 2, cy, r.sit === 'nova') },
    { label: 'Data', w: 100, r: (r, cx, cy) => T(cx, cy, r.d, { size: 14, tnum: true, fill: r.sit === 'erro' ? C.dangerText : C.text }) },
    { label: 'Descrição', r: (r, cx, cy, cw) => T(cx, cy, r.desc, { size: 14, weight: 500, max: cw, fill: r.sit === 'dup' ? C.muted : C.text }) },
    { label: 'Valor', w: 120, align: 'right', r: (r, cx, cy, cw) => K.money(cx + cw, cy, r.v, { size: 14, weight: 500, anchor: 'end', kind: r.v > 0 ? 'income' : 'expense', sign: r.v > 0 ? 'plus' : 'auto' }) },
    { label: 'Categoria sugerida', w: 150, r: (r, cx, cy) => (r.cat ? B.catBadge(cx, cy, r.cat).s : T(cx, cy, 'Sem categoria', { size: 13, fill: C.muted })) },
    { label: 'Situação', w: 160, r: (r, cx, cy, cw) => {
      const b = sitBadge(cx, cy, r.sit);
      return r.msg ? b.s + T(cx + b.w + 8, cy, r.msg, { size: 12, fill: C.dangerText, max: cw - b.w - 8 }) : b.s;
    } },
  ];
  const cols = K.colsFit(w, defs, 16, 16);
  const head = K.tableHead(x, y, w, cols, { h: 44, pad: 16, gap: 16 });
  const rows = K.tableRows(x, y + 44, w, cols, linhas, { rh, pad: 16, gap: 16 });
  return { s: head.s + rows.s, h: 44 + linhas.length * rh };
}

function desktop() {
  return desktopShell({
    title: 'Importação',
    active: 'importacao',
    body: (x, y, w) => {
      const cw = 960;
      const cx = x + (w - cw) / 2;
      const f = new K.Flow(cx, y, cw, 24);
      f.add((fx, fy, fw) => K.tabs(fx, fy, fw, ['Nova importação', 'Lotes'], 0), 0);
      f.add((fx, fy, fw) => {
        const info = K.banner(fx + 24, fy + 24 + 62 + 24, fw - 48, 'info', null, 'Importação é um complemento. Prefira conectar a instituição para manter tudo sincronizado.', { icon: 'info' });
        const sm = summaryD(fx + 24, 0, fw - 48);
        const tb = tabelaD(0, 0, fw - 48);
        let yy = fy + 24;
        let s = '';
        const st = stepperD(fx + 24, yy, fw - 48);
        yy += st.h + 24;
        s += st.s;
        s += info.s;
        yy += info.h + 20;
        s += T(fx + 24, yy + 10, 'extrato-inter-ago-2026.csv', { size: 14, weight: 600, mono: false });
        s += T(fx + 24 + tw('extrato-inter-ago-2026.csv', 14, 600) + 12, yy + 10, '· destino: Inter Conta Digital · 86 linhas lidas', { size: 14, fill: C.muted });
        yy += 36;
        s += summaryD(fx + 24, yy, fw - 48).s;
        yy += 56 + 16;
        s += K.segmented(fx + 24, yy, 420, 40, ['Todas (86)', 'Novas (71)', 'Duplicadas (13)', 'Com erro (2)'], 0, { size: 13 }).s;
        s += K.checkbox(fx + fw - 24 - 170, yy + 20, false);
        s += T(fx + fw - 24 - 170 + 28, yy + 20, 'Incluir duplicadas', { size: 14 });
        yy += 40 + 12;
        const t = tabelaD(fx + 24, yy, fw - 48);
        const id = 'imp-t';
        s += `<clipPath id="${id}"><rect x="${fx + 24}" y="${yy}" width="${fw - 48}" height="${t.h}" rx="8"/></clipPath>` + R(fx + 24, yy, fw - 48, t.h, { fill: C.surface, r: 8 }) + `<g clip-path="url(#${id})">${t.s}</g>` + R(fx + 24.5, yy + 0.5, fw - 49, t.h - 1, { stroke: C.border, r: 7.5 });
        yy += t.h + 12;
        s += T(fx + 24, yy + 12, 'Mostrando 10 de 86 linhas', { size: 13, fill: C.muted });
        s += K.btn(fx + fw - 24 - 200, yy - 4, 'Exportar linhas com erro', { variant: 'secondary', h: 32, size: 13, w: 200, icon: 'download' }).s;
        yy += 36;
        s += L(fx, yy + 0.5, fx + fw, yy + 0.5, C.border);
        yy += 20;
        s += K.btn(fx + 24, yy, 'Cancelar', { variant: 'ghost', h: 40, size: 15 }).s;
        const bb = K.btn(0, 0, 'Voltar', { variant: 'secondary', h: 40, size: 15 });
        const bc = K.btn(0, 0, 'Continuar', { variant: 'primary', h: 40, size: 15, w: 130 });
        s += K.btn(fx + fw - 24 - 130, yy, 'Continuar', { variant: 'primary', h: 40, size: 15, w: 130 }).s;
        s += K.btn(fx + fw - 24 - 130 - 8 - bb.w, yy, 'Voltar', { variant: 'secondary', h: 40, size: 15 }).s;
        yy += 40 + 24;
        const h = yy - fy;
        return { s: K.card(fx, fy, fw, h) + s, h };
      });
      f.add((fx, fy, fw) => {
        const rh = 56;
        const head = 44;
        const defs = [
          { label: 'Arquivo', r: (r, cx2, cy, cw2) => Ic('fileText', cx2 + 10, cy, 18, C.muted) + T(cx2 + 28, cy, r.arq, { size: 14, weight: 500, max: cw2 - 28 }) },
          { label: 'Data', w: 100, r: (r, cx2, cy) => T(cx2, cy, r.data, { size: 14, tnum: true }) },
          { label: 'Destino', w: 150, r: (r, cx2, cy, cw2) => T(cx2, cy, r.dest, { size: 14, max: cw2 }) },
          { label: 'Formato', w: 60, r: (r, cx2, cy) => T(cx2, cy, r.fmt, { size: 14 }) },
          { label: 'Qtd.', w: 50, align: 'right', r: (r, cx2, cy, cw2) => T(cx2 + cw2, cy, String(r.qtd), { size: 14, anchor: 'end', tnum: true }) },
          { label: 'Status', w: 90, r: (r, cx2, cy) => loteBadge(cx2, cy, r.st).s },
          { label: 'Ação', w: 120, r: (r, cx2, cy) => (r.st === 'ativo' ? K.btn(cx2, cy - 16, 'Desfazer lote', { variant: 'dangerOutline', h: 32, size: 13 }).s : '') },
        ];
        const cols = K.colsFit(fw, defs, 16, 24);
        const h = 60 + head + lotes.length * rh;
        let s = K.card(fx, fy, fw, h);
        s += T(fx + 24, fy + 30, 'Lotes anteriores', { size: 18, weight: 600 });
        const hd = K.tableHead(fx, fy + 60, fw, cols, { h: head, pad: 24, gap: 16 });
        const rw = K.tableRows(fx, fy + 60 + head, fw, cols, lotes, { rh, pad: 24, gap: 16 });
        s += `<clipPath id="lt"><rect x="${fx}" y="${fy}" width="${fw}" height="${h}" rx="12"/></clipPath><g clip-path="url(#lt)">${hd.s}${rw.s}</g>`;
        s += R(fx + 0.5, fy + 0.5, fw - 1, h - 1, { stroke: C.border, r: 11.5 });
        return { s, h };
      });
      return { s: f.s, h: f.h };
    },
  });
}

function linhaMobile(x, y, w, r) {
  const h = r.msg ? 124 : 104;
  let s = '';
  s += K.checkbox(x + 16, y + 26, r.sit === 'nova');
  s += T(x + 48, y + 22, r.desc, { size: 15, weight: 500, max: w - 48 - 16 - 110, fill: r.sit === 'dup' ? C.muted : C.text });
  s += K.money(x + w - 16, y + 22, r.v, { size: 15, weight: 500, anchor: 'end', kind: r.v > 0 ? 'income' : 'expense', sign: r.v > 0 ? 'plus' : 'auto' });
  s += T(x + 48, y + 46, r.d, { size: 13, fill: r.sit === 'erro' ? C.dangerText : C.muted, tnum: true });
  if (r.cat) {
    s += B.catBadge(x + 48 + 84, y + 46, r.cat).s;
  } else {
    s += T(x + 48 + 84, y + 46, 'Sem categoria', { size: 13, fill: C.muted });
  }
  s += sitBadge(x + 48, y + 78, r.sit).s;
  if (r.msg) s += T(x + 48, y + 106, r.msg, { size: 13, weight: 500, fill: C.dangerText });
  return { s, h };
}

function celular() {
  return mobileShell({
    title: 'Importação',
    active: 'importacao',
    body: (x, y, w) => {
      const f = new K.Flow(x, y, w, 16);
      f.add((fx, fy, fw) => K.tabs(fx, fy, fw, ['Nova', 'Lotes'], 0, { equal: true }), 12);
      f.add((fx, fy, fw) => {
        let s = T(fx, fy + 10, 'Passo 3 de 4 · Pré-visualização', { size: 14, weight: 600 });
        for (let i = 0; i < 4; i++) s += R(fx + i * ((fw - 18) / 4 + 6), fy + 26, (fw - 18) / 4, 6, { fill: i < 3 ? C.primary : C.track, r: 3 });
        return { s, h: 40 };
      }, 12);
      f.add((fx, fy, fw) => {
        const h = 224;
        let s = K.card(fx, fy, fw, h);
        s += T(fx + 16, fy + 24, 'extrato-inter-ago-2026.csv', { size: 14, weight: 600 });
        s += T(fx + 16, fy + 46, 'Destino: Inter Conta Digital', { size: 13, fill: C.muted });
        const cells = [['86', 'lidos', 'neutral', 'fileText'], ['71', 'novas', 'ok', 'circleCheck'], ['13', 'duplicadas', 'neutral', 'copy'], ['2', 'com erro', 'error', 'octAlert']];
        cells.forEach((c, i) => {
          const cx = fx + 16 + (i % 2) * ((fw - 32) / 2);
          const cy = fy + 76 + Math.floor(i / 2) * 44;
          const st = { neutral: C.text, ok: C.successText, error: C.dangerText }[c[2]];
          s += Ic(c[3], cx + 10, cy, 18, c[2] === 'neutral' ? C.muted : c[2] === 'ok' ? C.success : C.danger);
          s += T(cx + 28, cy, c[0], { size: 20, weight: 600, fill: st, tnum: true });
          s += T(cx + 28 + tw(c[0], 20, 600, true) + 6, cy + 2, c[1], { size: 14, fill: C.muted });
        });
        s += L(fx + 16, fy + 150.5, fx + fw - 16, fy + 150.5, C.border);
        s += T(fx + 16, fy + 176, 'A importar', { size: 13, fill: C.muted });
        s += K.money(fx + 16, fy + 200, 4120.0, { size: 15, weight: 600, kind: 'income', sign: 'plus' });
        s += K.money(fx + fw - 16, fy + 200, -2386.17, { size: 15, weight: 600, anchor: 'end', kind: 'expense' });
        return { s, h };
      });
      f.add((fx, fy, fw) => K.segmented(fx, fy, fw, 44, ['Todas', 'Novas', 'Dupl.', 'Erro'], 0, { size: 14 }));
      f.add((fx, fy, fw) => {
        let yy = fy;
        let inner = '';
        linhas.slice(0, 6).forEach((r, i) => {
          const a = linhaMobile(fx, yy, fw, r);
          inner += a.s;
          yy += a.h;
          if (i < 5) inner += L(fx + 16, yy + 0.5, fx + fw - 16, yy + 0.5, C.border);
        });
        return { s: K.card(fx, fy, fw, yy - fy) + inner, h: yy - fy };
      });
      f.add((fx, fy, fw) => K.btn(fx, fy, 'Exportar linhas com erro', { variant: 'secondary', w: fw, h: 44, icon: 'download' }), 20);
      f.add((fx, fy, fw) => ({ s: T(fx, fy + 12, 'Lotes anteriores', { size: 18, weight: 600 }), h: 24 }), 12);
      lotes.forEach((l) => f.add((fx, fy, fw) => {
        const h = l.st === 'ativo' ? 160 : 108;
        let s = K.card(fx, fy, fw, h);
        s += Ic('fileText', fx + 16 + 10, fy + 26, 18, C.muted);
        s += T(fx + 16 + 28, fy + 26, l.arq, { size: 14, weight: 600, max: fw - 32 - 28 });
        s += T(fx + 16, fy + 54, `${l.data} · ${l.dest}`, { size: 13, fill: C.muted, tnum: true, max: fw - 32 });
        s += T(fx + 16, fy + 76, `${l.fmt} · ${l.qtd} lançamentos`, { size: 13, fill: C.muted });
        const lb = loteBadge(0, 0, l.st);
        s += loteBadge(fx + fw - 16 - lb.w, fy + 76, l.st).s;
        if (l.st === 'ativo') s += K.btn(fx + 16, fy + 96, 'Desfazer lote', { variant: 'dangerOutline', w: fw - 32, h: 44 }).s;
        return { s, h };
      }, 12));
      f.add((fx, fy, fw) => {
        let s = R(0, fy - 8, 390, 72, { fill: C.surface });
        s += L(0, fy - 8 + 0.5, 390, fy - 8 + 0.5, C.border);
        s += K.btn(fx, fy + 4, 'Continuar', { variant: 'primary', w: fw, h: 48, weight: 600 }).s;
        return { s, h: 60 };
      }, 0);
      return { s: f.s, h: f.h };
    },
    bottomPad: 0,
  });
}

module.exports = { id: '11', slug: 'importacao', nome: 'Importação', celular, desktop };
