const fs = require('fs');
const path = require('path');
const { C, T, R, L, Ci, G, I, Ic, tw, esc } = require('./core');
const { badge, iconBtn, avatar } = require('./comp');
const { logoMarca } = require('./logos');
const ctx = require('./ctx');

const FONT_B64 = fs.readFileSync(path.join(__dirname, '..', 'fonts', 'inter-latin-wght.woff2')).toString('base64');

const NAV = [
  { g: 'Visão geral', items: [['dashboard', 'Dashboard', 'chartCol']] },
  {
    g: 'Movimentação',
    items: [
      ['transacoes', 'Transações', 'swap'],
      ['contas', 'Contas', 'landmark'],
      ['cartoes', 'Cartões', 'card'],
      ['investimentos', 'Investimentos', 'trendUp'],
    ],
  },
  {
    g: 'Planejamento',
    items: [
      ['orcamento', 'Orçamento e metas', 'target'],
      ['recorrencias', 'Recorrências', 'repeat'],
    ],
  },
  {
    g: 'Organização',
    items: [
      ['categorias', 'Categorias e regras', 'tag'],
      ['importacao', 'Importação', 'upload'],
      ['relatorios', 'Relatórios', 'fileText'],
    ],
  },
  {
    g: 'Sistema',
    items: [
      ['conexoes', 'Conexões', 'link'],
      ['alertas', 'Alertas', 'bell', 3],
      ['configuracoes', 'Configurações', 'settings'],
    ],
  },
];

function baseDefs() {
  return `<filter id="sh" x="-3%" y="-3%" width="106%" height="112%"><feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="#17132B" flood-opacity="0.07"/></filter>
<filter id="sh-lg" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="#17132B" flood-opacity="0.16"/></filter>
<pattern id="st-w" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="1.5" height="6" fill="#FFFFFF" fill-opacity="0.45"/></pattern>
<pattern id="st-e" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="3" height="9" fill="#FFFFFF" fill-opacity="0.4"/></pattern>`;
}

function finalize(w, h, body, title) {
  const style = `@font-face{font-family:Inter;font-weight:100 900;font-style:normal;src:url(data:font/woff2;base64,${FONT_B64}) format("woff2")}text{font-family:Inter,system-ui,"Segoe UI",Arial,sans-serif;font-kerning:normal}.n{font-variant-numeric:tabular-nums lining-nums;font-feature-settings:"tnum" 1,"lnum" 1}`;
  const defs = baseDefs() + ctx.takeDefs();
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(title)}"><title>${esc(title)}</title><defs><style>${style}</style>${defs}</defs>${R(0, 0, w, h, { fill: C.bg })}${body}</svg>\n`;
}

function syncPill(x, cy, compact) {
  const label = compact ? '12 min' : 'Sincronizado há 12 min';
  const w = Math.ceil(10 + 16 + 6 + tw(label, 13, 600) + 12);
  let s = R(x + 0.5, cy - 16 + 0.5, w - 1, 31, { fill: C.successBg, stroke: C.successBorder, r: 15.5 });
  s += Ic('circleCheck', x + 10 + 8, cy, 16, C.success, 2);
  s += T(x + 10 + 16 + 6, cy, label, { size: 13, weight: 600, fill: C.successText });
  return { s, w };
}

function mobileShell(o) {
  const { title, active, body, periodBar, fab, bottomPad = 24, noNav, banner } = o;
  const W = 390;
  let y = 56;
  let s = '';
  let content = '';
  if (periodBar) {
    content += G(0, y, periodBar(W).s);
    y += 52;
  }
  const inner = body(16, y + 16, W - 32);
  content += inner.s;
  y = y + 16 + inner.h + bottomPad;
  const navH = 56;
  const H = Math.max(844, y + navH);
  s += content;
  s += R(0, 0, W, 56, { fill: C.surface });
  s += L(0, 55.5, W, 55.5, C.border);
  let rx = W - 8 - 44;
  s += iconBtn(rx, 6, 44, 'bell', { badge: 3 }).s;
  rx -= 44;
  s += iconBtn(rx, 6, 44, 'eye').s;
  const sp = syncPill(0, 0, true);
  rx -= sp.w + 4;
  s += G(rx, 28, sp.s);
  s += T(16, 28, title, { size: 18, weight: 600, ls: -0.2, max: rx - 16 - 8 });
  const ny = H - navH;
  s += R(0, ny, W, navH, { fill: C.surface });
  s += L(0, ny + 0.5, W, ny + 0.5, C.border);
  const items = [
    ['dashboard', 'Início', 'home'],
    ['transacoes', 'Transações', 'swap'],
    ['contas', 'Contas', 'landmark'],
    ['cartoes', 'Cartões', 'card'],
    ['mais', 'Mais', 'menu'],
  ];
  const cur = ['dashboard', 'transacoes', 'contas', 'cartoes'].includes(active) ? active : 'mais';
  items.forEach(([id, lab, ic], i) => {
    const cx = (W / 5) * i + W / 10;
    const on = id === cur;
    if (on) s += R(cx - 28, ny + 4, 56, 32, { fill: C.rowSelected, r: 16 });
    s += Ic(ic, cx, ny + 20, 24, on ? C.primary : C.muted, 1.75);
    s += T(cx, ny + 46, lab, { size: 12, weight: 600, fill: on ? C.text : C.muted, anchor: 'middle' });
    if (id === 'mais') {
      s += R(cx + 8, ny + 2, 16, 16, { fill: C.danger, r: 8 });
      s += T(cx + 16, ny + 10, '3', { size: 11, weight: 700, fill: '#FFFFFF', anchor: 'middle' });
    }
  });
  if (fab) {
    s += R(W - 16 - 56, ny - 16 - 56, 56, 56, { fill: C.primary, r: 16, filter: 'sh-lg' });
    s += Ic('plus', W - 16 - 28, ny - 16 - 28, 26, '#FFFFFF', 2);
  }
  return finalize(W, H, s, o.alt || `${title} (celular)`);
}

function sideNav(active, H) {
  const W = 256;
  let s = R(0, 0, W, H, { fill: C.surface });
  s += L(W - 0.5, 0, W - 0.5, H, C.border);
  s += logoMarca(20, 16, 32);
  s += T(60, 32, 'Painel Financeiro', { size: 18, weight: 600, ls: -0.2 });
  s += L(0, 63.5, W, 63.5, C.border);
  let y = 64;
  NAV.forEach((grp, gi) => {
    y += 16;
    s += T(16, y + 8, grp.g, { size: 12, weight: 600, fill: C.muted, ls: 0.72, upper: true });
    y += 24;
    grp.items.forEach(([id, lab, ic, bd]) => {
      const on = id === active;
      if (on) {
        s += R(12, y, W - 24, 40, { fill: C.rowSelected, r: 8 });
        s += R(0, y + 8, 3, 24, { fill: C.primary, r: 1.5 });
      }
      s += Ic(ic, 12 + 12 + 10, y + 20, 20, on ? C.primary : C.muted);
      s += T(12 + 12 + 20 + 12, y + 20, lab, { size: 14, weight: on ? 600 : 500, fill: on ? C.text : C.muted });
      if (bd) {
        const bw = 22;
        s += R(W - 12 - 12 - bw, y + 10, bw, 20, { fill: C.primary, r: 10 });
        s += T(W - 12 - 12 - bw / 2, y + 20, String(bd), { size: 12, weight: 700, fill: '#FFFFFF', anchor: 'middle' });
      }
      y += 44;
    });
  });
  const fy = 900 - 56;
  s += L(0, fy + 0.5, W, fy + 0.5, C.border);
  s += Ic('panelLeft', 12 + 12 + 10, fy + 28, 20, C.muted);
  s += T(12 + 12 + 20 + 12, fy + 28, 'Recolher menu', { size: 14, weight: 500, fill: C.muted });
  return s;
}

function periodPicker(x, cy, label = 'Out/2026') {
  const w = 172;
  let s = R(x + 0.5, cy - 20 + 0.5, w - 1, 39, { fill: C.surface, stroke: C.borderStrong, r: 8 });
  s += Ic('chevL', x + 20, cy, 18, C.text, 2);
  s += Ic('calendar', x + 50, cy, 16, C.muted);
  s += T(x + 66, cy, label, { size: 14, weight: 600, tnum: true });
  s += Ic('chevR', x + w - 20, cy, 18, C.text, 2);
  return { s, w };
}

function desktopShell(o) {
  const { title, active, body, hideHeaderPeriod, bottomPad = 32 } = o;
  const W = 1440;
  const NAVW = 256;
  const AW = W - NAVW;
  const inner = body(NAVW + 32, 64 + 32, AW - 64);
  const H = Math.max(900, 64 + 32 + inner.h + bottomPad);
  let s = '';
  s += inner.s;
  s += R(NAVW, 0, AW, 64, { fill: C.surface });
  s += L(NAVW, 63.5, W, 63.5, C.border);
  s += T(NAVW + 32, 32, title, { size: 28, weight: 600, ls: -0.56, max: 500 });
  let rx = W - 32;
  const ub = 56;
  rx -= ub;
  s += avatar(rx + 4, 32, 'RM', 32);
  s += Ic('chevD', rx + 44, 32, 16, C.muted);
  rx -= 8 + 40;
  s += iconBtn(rx, 12, 40, 'bell', { badge: 3, isz: 22 }).s;
  rx -= 8 + 40;
  s += iconBtn(rx, 12, 40, 'eye', { isz: 22 }).s;
  rx -= 8 + 40;
  s += iconBtn(rx, 12, 40, 'refresh', { variant: 'secondary', isz: 20 }).s;
  const sp = syncPill(0, 0, false);
  rx -= 8 + sp.w;
  s += G(rx, 32, sp.s);
  if (!hideHeaderPeriod) {
    const pp = periodPicker(0, 0);
    rx -= 16 + pp.w;
    s += G(rx, 32, pp.s);
  }
  s += sideNav(active, H);
  return finalize(W, H, s, o.alt || `${title} (desktop)`);
}

module.exports = { mobileShell, desktopShell, finalize, periodPicker, syncPill, baseDefs };
