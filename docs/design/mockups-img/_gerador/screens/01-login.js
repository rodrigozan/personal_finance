const { C, T, R, L, Ic, tw, wrap } = require('../lib/core');
const K = require('../lib/comp');
const { logoMarca, googleG } = require('../lib/logos');
const { finalize } = require('../lib/shell');

function form(x, y, w, o = {}) {
  let yy = y;
  let s = '';
  const mobile = o.mobile;
  s += T(x + w / 2 - (tw('Painel Financeiro', 20, 600) + 52) / 2 + 52, yy + 20, 'Painel Financeiro', { size: 20, weight: 600, ls: -0.2 });
  s += logoMarca(x + w / 2 - (tw('Painel Financeiro', 20, 600) + 52) / 2, yy, 40);
  yy += 40 + 32;
  s += T(x, yy + 14, 'Entrar', { size: mobile ? 22 : 28, weight: 600, ls: -0.4 });
  yy += mobile ? 32 : 40;
  s += T(x, yy + 10, 'Acesso restrito ao titular.', { size: 14, fill: C.muted });
  yy += 20 + 20;
  const f1 = K.field(x, yy, w, 'E-mail', 'rafael.moreira@exemplo.com.br', { h: 44, icon: 'mail' });
  s += f1.s;
  yy += f1.h + 16;
  const f2 = K.field(x, yy, w, 'Senha', '••••••••••••••', { h: 44, icon: 'lock', iconEnd: 'eye' });
  s += f2.s;
  yy += f2.h + 4;
  const lk = 'Esqueci minha senha';
  s += T(x + w, yy + 22, lk, { size: 14, weight: 500, fill: C.link, anchor: 'end' });
  s += R(x + w - tw(lk, 14, 500), yy + 33, tw(lk, 14, 500), 1, { fill: C.link });
  yy += 44 + 12;
  s += K.btn(x, yy, 'Entrar', { variant: 'primary', w, h: 48, weight: 600 }).s;
  yy += 48 + 20;
  s += L(x, yy + 10, x + w / 2 - 20, yy + 10, C.border);
  s += L(x + w / 2 + 20, yy + 10, x + w, yy + 10, C.border);
  s += T(x + w / 2, yy + 10, 'ou', { size: 14, fill: C.muted, anchor: 'middle' });
  yy += 20 + 20;
  s += R(x + 0.5, yy + 0.5, w - 1, 47, { fill: C.surface, stroke: C.borderStrong, r: 8 });
  const gl = 'Entrar com Google';
  const gw = 20 + 12 + tw(gl, 16, 500);
  s += googleG(x + (w - gw) / 2, yy + 14, 20);
  s += T(x + (w - gw) / 2 + 32, yy + 24, gl, { size: 16, weight: 500 });
  yy += 48 + 24;
  const note = 'Somente leitura. Nenhuma credencial bancária é armazenada por este app.';
  const lines = wrap(note, w - 28, 14);
  const nw = Math.max(...lines.map((l) => tw(l, 14)));
  lines.forEach((l, i) => {
    s += T(x + w / 2 + 12, yy + 10 + i * 20, l, { size: 14, fill: C.muted, anchor: 'middle' });
  });
  s += Ic('shieldCheck', x + w / 2 + 12 - tw(lines[0], 14) / 2 - 14, yy + 10, 16, C.muted);
  yy += lines.length * 20;
  return { s, h: yy - y };
}

function themeBtn(x, y, h) {
  const w = 104;
  let s = R(x + 0.5, y + 0.5, w - 1, h - 1, { fill: C.surface, stroke: C.border, r: 8 });
  s += Ic('sun', x + 22, y + h / 2, 18, C.muted);
  s += T(x + 40, y + h / 2, 'Tema', { size: 14, weight: 500 });
  s += Ic('chevD', x + w - 20, y + h / 2, 16, C.muted);
  return s;
}

function celular() {
  const W = 390;
  const H = 844;
  let s = themeBtn(W - 16 - 104, 12, 44);
  const f = form(16, 72, W - 32, { mobile: true });
  s += f.s;
  s += T(W / 2, H - 28, '© 2026 Painel Financeiro · Uso pessoal', { size: 12, fill: C.muted, anchor: 'middle' });
  return finalize(W, H, s, 'Login (celular)');
}

function desktop() {
  const W = 1440;
  const H = 900;
  const cw = 420;
  const pad = 32;
  const probe = form(0, 0, cw - pad * 2).h;
  const ch = probe + pad * 2;
  const cx = (W - cw) / 2;
  const cy = (H - ch) / 2;
  let s = themeBtn(W - 32 - 104, 16, 40);
  s += R(cx + 0.5, cy + 0.5, cw - 1, ch - 1, { fill: C.surface, stroke: C.border, r: 16, filter: 'sh-lg' });
  s += form(cx + pad, cy + pad, cw - pad * 2).s;
  s += T(W / 2, H - 28, '© 2026 Painel Financeiro · Uso pessoal', { size: 12, fill: C.muted, anchor: 'middle' });
  return finalize(W, H, s, 'Login (desktop)');
}

module.exports = { id: '01', slug: 'login', nome: 'Login', celular, desktop };
