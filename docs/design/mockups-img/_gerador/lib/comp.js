const { C, STATUS, T, R, RB, L, Ci, G, I, Ic, tw, fit, wrap, brl } = require('./core');

class Flow {
  constructor(x, y, w, gap = 16) {
    this.x = x;
    this.y0 = y;
    this.y = y;
    this.w = w;
    this.gap = gap;
    this.parts = [];
  }
  add(fn, gap) {
    const r = typeof fn === 'function' ? fn(this.x, this.y, this.w) : fn;
    this.parts.push(r.s);
    this.last = gap === undefined ? this.gap : gap;
    this.y += r.h + this.last;
    return r;
  }
  space(h) {
    this.y += h;
  }
  get h() {
    return this.y - this.y0 - (this.last === undefined ? this.gap : this.last);
  }
  get s() {
    return this.parts.join('');
  }
}

function cols(x, w, gap, spans, total = 12) {
  const unit = (w - gap * (total - 1)) / total;
  let cx = x;
  return spans.map((sp) => {
    const cw = unit * sp + gap * (sp - 1);
    const r = { x: cx, w: cw };
    cx += cw + gap;
    return r;
  });
}

function card(x, y, w, h, o = {}) {
  const { r = 12, fill = C.surface, stroke = C.border, shadow = true, sw = 1, dash } = o;
  return R(x + sw / 2, y + sw / 2, w - sw, h - sw, { fill, stroke, r, sw, filter: shadow ? 'sh' : undefined, dash });
}

function badge(x, cy, label, status = 'neutral', icon, o = {}) {
  const st = STATUS[status];
  const chip = o.chip;
  const iw = icon ? 16 + 4 : 0;
  const w = Math.ceil(8 + iw + tw(label, 12, 600, false, 0.12) + 8 + 2);
  let s = R(x + 0.5, cy - 12 + 0.5, w - 1, 23, { fill: st.bg, stroke: st.bd, r: chip ? 6 : 11.5, dash: o.dash });
  if (icon) s += Ic(icon, x + 1 + 8 + 8, cy, 16, st.ic, 1.9);
  s += T(x + 1 + 8 + iw, cy, label, { size: 12, weight: 600, fill: st.tx, ls: 0.12 });
  return { s, w, h: 24 };
}

function btn(x, y, label, o = {}) {
  const { variant = 'secondary', w, h = 44, icon, size = 16, block, iconEnd, weight = 500 } = o;
  const padX = h <= 32 ? 12 : 16;
  const iw = icon ? 20 + 8 : 0;
  const bw = w || Math.ceil(padX * 2 + iw + tw(label, size, weight) + (iconEnd ? 28 : 0));
  const V = {
    primary: { fill: C.primary, stroke: C.primary, tx: C.primaryContrast },
    secondary: { fill: C.surface, stroke: C.borderStrong, tx: C.text },
    ghost: { fill: 'none', stroke: 'none', tx: C.text },
    danger: { fill: C.danger, stroke: C.danger, tx: '#FFFFFF' },
    dangerOutline: { fill: C.surface, stroke: C.danger, tx: C.danger },
    disabled: { fill: C.disabledBg, stroke: C.disabledBg, tx: C.disabledText },
    link: { fill: 'none', stroke: 'none', tx: C.link },
  }[variant];
  let s = R(x + 0.5, y + 0.5, bw - 1, h - 1, { fill: V.fill, stroke: V.stroke === 'none' ? undefined : V.stroke, r: 8 });
  const contentW = iw + tw(label, size, weight) + (iconEnd ? 28 : 0);
  let cx = x + (bw - contentW) / 2;
  const cy = y + h / 2;
  if (icon) {
    s += Ic(icon, cx + 10, cy, size <= 14 ? 16 : 20, V.tx, 1.75);
    cx += iw;
  }
  s += T(cx, cy, label, { size, weight, fill: V.tx });
  if (iconEnd) s += Ic(iconEnd, cx + tw(label, size, weight) + 18, cy, 20, V.tx);
  return { s, w: bw, h };
}

function iconBtn(x, y, size, icon, o = {}) {
  const { variant = 'ghost', color = C.text, isz = 22, badge: bd } = o;
  let s = '';
  if (variant === 'secondary') s += R(x + 0.5, y + 0.5, size - 1, size - 1, { fill: C.surface, stroke: C.borderStrong, r: 8 });
  s += Ic(icon, x + size / 2, y + size / 2, isz, color);
  if (bd) {
    const bw = Math.max(16, tw(String(bd), 11, 700) + 8);
    s += R(x + size / 2 + 2, y + size / 2 - 17, bw, 16, { fill: C.primary, r: 8 });
    s += T(x + size / 2 + 2 + bw / 2, y + size / 2 - 9, String(bd), { size: 11, weight: 700, fill: '#FFFFFF', anchor: 'middle' });
  }
  return { s, w: size, h: size };
}

function segmented(x, y, w, h, opts, active, o = {}) {
  const size = o.size || 14;
  const cw = (w - 4) / opts.length;
  let s = R(x, y, w, h, { fill: C.surfaceSunken, r: 8, stroke: C.border });
  opts.forEach((lab, i) => {
    const sx = x + 2 + i * cw;
    const on = i === active;
    if (on) s += R(sx, y + 2, cw, h - 4, { fill: C.surface, stroke: C.borderStrong, r: 6 });
    s += T(sx + cw / 2, y + h / 2, lab, { size, weight: on ? 600 : 500, fill: on ? C.text : C.muted, anchor: 'middle', max: cw - 8 });
  });
  return { s, h };
}

function tabs(x, y, w, labels, active, o = {}) {
  const { h = 44, equal = false, size = 14 } = o;
  let s = L(x, y + h - 0.5, x + w, y + h - 0.5, C.border);
  let cx = x;
  const cw = w / labels.length;
  labels.forEach((lab, i) => {
    const lw = tw(lab, size, i === active ? 600 : 500);
    const iw = equal ? cw : lw + 32;
    const mid = cx + iw / 2;
    const on = i === active;
    s += T(mid, y + h / 2 - 1, lab, { size, weight: on ? 600 : 500, fill: on ? C.text : C.muted, anchor: 'middle' });
    if (on) s += R(cx + (equal ? 8 : 12), y + h - 2, iw - (equal ? 16 : 24), 2, { fill: C.primary, r: 1 });
    cx += iw;
  });
  return { s, h };
}

function field(x, y, w, label, value, o = {}) {
  const { h = 44, icon, iconEnd, placeholder, size = 16, help, error, mono, required } = o;
  let s = '';
  let yy = y;
  if (label) {
    s += T(x, yy + 10, label, { size: 14, weight: 500 });
    yy += 24;
  }
  s += R(x + 0.5, yy + 0.5, w - 1, h - 1, { fill: o.disabled ? C.disabledBg : C.surface, stroke: error ? C.danger : C.borderStrong, r: 8, sw: error ? 2 : 1 });
  let tx = x + 12;
  if (icon) {
    s += Ic(icon, x + 12 + 10, yy + h / 2, 20, C.muted);
    tx += 28;
  }
  const mw = w - (tx - x) - (iconEnd ? 44 : 12);
  if (value !== undefined && value !== '') s += T(tx, yy + h / 2, value, { size, fill: o.disabled ? C.disabledText : C.text, max: mw, mono });
  else if (placeholder) s += T(tx, yy + h / 2, placeholder, { size, fill: C.muted, max: mw });
  if (iconEnd) s += Ic(iconEnd, x + w - 26, yy + h / 2, 20, C.muted);
  yy += h;
  if (help) {
    s += T(x, yy + 12, help, { size: 12, fill: error ? C.dangerText : C.muted, max: w });
    yy += 20;
  }
  return { s, h: yy - y };
}

function switchC(x, cy, on, o = {}) {
  const w = 44;
  const h = 24;
  let s = R(x, cy - h / 2, w, h, { fill: on ? C.primary : C.borderStrong, r: 12 });
  s += Ci(on ? x + w - 12 : x + 12, cy, 9, { fill: '#FFFFFF' });
  if (on) s += Ic('check', x + w - 12, cy, 12, C.primary, 3);
  return s;
}

function checkbox(x, cy, on, o = {}) {
  const sz = 20;
  let s = R(x + 0.5, cy - sz / 2 + 0.5, sz - 1, sz - 1, { fill: on ? C.primary : C.surface, stroke: on ? C.primary : C.borderStrong, r: 4 });
  if (on) s += Ic('check', x + sz / 2, cy, 14, '#FFFFFF', 3);
  return s;
}

function radio(x, cy, on) {
  let s = Ci(x + 10, cy, 9.5, { fill: C.surface, stroke: on ? C.primary : C.borderStrong, sw: on ? 2 : 1 });
  if (on) s += Ci(x + 10, cy, 5, { fill: C.primary });
  return s;
}

function progress(x, y, w, h, ratio, status = 'primary', o = {}) {
  const col = { primary: C.primary, ok: C.success, warning: C.warning, error: C.danger }[status];
  let s = R(x, y, w, h, { fill: C.track, r: h / 2 });
  const rr = Math.min(ratio, 1);
  const fw = Math.max(h, w * rr);
  if (ratio > 0) {
    s += R(x, y, fw, h, { fill: col, r: h / 2 });
    if (status === 'warning') s += `<rect x="${x}" y="${y}" width="${fw}" height="${h}" rx="${h / 2}" fill="url(#st-w)"/>`;
    if (status === 'error') s += `<rect x="${x}" y="${y}" width="${fw}" height="${h}" rx="${h / 2}" fill="url(#st-e)"/>`;
  }
  if (o.mark) s += R(x + w * (o.mark) - 1, y - 3, 2, h + 6, { fill: C.text, r: 1 });
  return { s, h };
}

function budgetBar(x, y, w, h, ratio) {
  const status = ratio > 1 ? 'error' : ratio >= 0.9 ? 'warning' : 'ok';
  const maxScale = 1.25;
  const markX = x + (w * 1) / maxScale;
  const fillW = Math.min(w, (w * ratio) / maxScale);
  const col = { ok: C.success, warning: C.warning, error: C.danger }[status];
  let s = R(x, y, w, h, { fill: C.track, r: h / 2 });
  s += R(x, y, fillW, h, { fill: col, r: h / 2 });
  if (status === 'warning') s += `<rect x="${x}" y="${y}" width="${fillW}" height="${h}" rx="${h / 2}" fill="url(#st-w)"/>`;
  if (status === 'error') s += `<rect x="${x}" y="${y}" width="${fillW}" height="${h}" rx="${h / 2}" fill="url(#st-e)"/>`;
  s += R(markX - 1, y - 3, 2, h + 6, { fill: C.text, r: 1 });
  return { s, h, status };
}

const BUDGET_TXT = {
  ok: { icon: 'circleCheck', col: C.successText, ic: C.success, txt: 'Dentro do planejado' },
  warning: { icon: 'triAlert', col: C.warningText, ic: C.warning, txt: 'Próximo do limite' },
  error: { icon: 'octAlert', col: C.dangerText, ic: C.danger, txt: 'Excedido' },
};

function budgetStatus(ratio) {
  if (ratio > 1) return 'error';
  if (Math.abs(ratio - 1) < 1e-9) return 'limite';
  return ratio >= 0.9 ? 'warning' : 'ok';
}

function money(x, cy, v, o = {}) {
  const { size = 16, weight = 500, anchor = 'start', kind = 'plain', sign, ls, max, dec = true } = o;
  const col = { plain: C.text, income: C.income, expense: C.expense, internal: C.internal, neutral: C.neutralValue, muted: C.muted, primary: C.primary }[kind];
  const sg = sign || (kind === 'income' ? 'plus' : kind === 'expense' ? 'auto' : 'auto');
  return T(x, cy, brl(v, { sign: sg, dec }), { size, weight, fill: col, anchor, tnum: true, ls, max });
}

function moneyW(v, size, weight, sign = 'auto', dec = true, ls = 0) {
  return tw(brl(v, { sign, dec }), size, weight, true, ls);
}

function delta(x, cy, dir, text, fav, o = {}) {
  const col = fav ? C.income : C.expense;
  const icon = dir === 'up' ? 'arrowUp' : 'arrowDown';
  const size = o.size || 14;
  let s = Ic(icon, x + 8, cy, 16, col, 2.2);
  s += T(x + 20, cy, text, { size, weight: 600, fill: col, tnum: true });
  return { s, w: 20 + tw(text, size, 600, true) };
}

function section(x, y, w, title, o = {}) {
  return T(x, y + 12, title, { size: o.size || 18, weight: 600 });
}

function banner(x, y, w, status, title, text, o = {}) {
  const st = STATUS[status];
  const icon = o.icon || { info: 'info', warning: 'triAlert', error: 'octAlert', ok: 'circleCheck' }[status];
  const pad = 12;
  const tx = x + pad + 28;
  const actionW = o.action ? tw(o.action, 14, 600) + 24 : 0;
  const mw = w - (tx - x) - pad - actionW - (o.dismiss ? 36 : 0) - (o.actionBelow ? 0 : 0);
  const lines = wrap(text, o.actionBelow ? w - 52 - pad : mw, 14, 400);
  const titleH = title ? 22 : 0;
  const bodyH = lines.length * 20;
  let h = pad * 2 + titleH + bodyH;
  if (o.actionBelow) h += 44 + 4;
  h = Math.max(h, 48);
  let s = R(x + 0.5, y + 0.5, w - 1, h - 1, { fill: st.bg, stroke: st.bd, r: 8 });
  s += Ic(icon, x + pad + 10, y + pad + 10, 20, st.ic);
  let yy = y + pad;
  if (title) {
    s += T(tx, yy + 10, title, { size: 14, weight: 600, fill: st.tx });
    yy += 22;
  }
  lines.forEach((ln, i) => {
    s += T(tx, yy + 10 + i * 20, ln, { size: 14, fill: st.tx });
  });
  if (o.action && !o.actionBelow) {
    const bx = x + w - pad - actionW - (o.dismiss ? 36 : 0);
    s += R(bx + 0.5, y + h / 2 - 16 + 0.5, actionW - 1, 31, { fill: C.surface, stroke: st.bd, r: 6 });
    s += T(bx + actionW / 2, y + h / 2, o.action, { size: 14, weight: 600, fill: st.tx, anchor: 'middle' });
  }
  if (o.action && o.actionBelow) {
    const bw = tw(o.action, 14, 600) + 32;
    s += R(tx + 0.5, yy + bodyH + 4 + 0.5, bw - 1, 43, { fill: C.surface, stroke: st.bd, r: 8 });
    s += T(tx + bw / 2, yy + bodyH + 4 + 22, o.action, { size: 14, weight: 600, fill: st.tx, anchor: 'middle' });
  }
  if (o.dismiss) s += Ic('x', x + w - pad - 10, y + h / 2, 18, st.tx);
  return { s, h };
}

function logoBox(id, x, y, size) {
  return require('./logos').logo(id, x, y, size);
}

function divider(x, y, w) {
  return L(x, y + 0.5, x + w, y + 0.5, C.border);
}

function avatar(x, cy, text, size = 32) {
  let s = Ci(x + size / 2, cy, size / 2, { fill: C.rowSelected, stroke: C.border });
  s += T(x + size / 2, cy, text, { size: size * 0.38, weight: 600, fill: C.link, anchor: 'middle' });
  return s;
}

function swatch(x, cy, color, size = 12) {
  return R(x, cy - size / 2, size, size, { fill: color, r: size >= 16 ? 4 : 3 });
}

function tableHead(x, y, w, cols, o = {}) {
  const h = o.h || 44;
  let s = R(x, y, w, h, { fill: C.surfaceSunken });
  s += L(x, y + h - 0.5, x + w, y + h - 0.5, C.border);
  let cx = x + (o.pad ?? 16);
  cols.forEach((c) => {
    const ax = c.align === 'right' ? cx + c.w : c.align === 'center' ? cx + c.w / 2 : cx;
    s += T(ax, y + h / 2, c.label, { size: 13, weight: 600, fill: C.muted, anchor: c.align === 'right' ? 'end' : c.align === 'center' ? 'middle' : 'start', max: c.w });
    cx += c.w + (o.gap ?? 16);
  });
  return { s, h };
}

function tableRows(x, y, w, cols, rows, o = {}) {
  const rh = o.rh || 48;
  let s = '';
  rows.forEach((row, i) => {
    const ry = y + i * rh;
    if (row.selected) s += R(x, ry, w, rh, { fill: C.rowSelected });
    let cx = x + (o.pad ?? 16);
    cols.forEach((c) => {
      const cy = ry + rh / 2;
      const content = c.r ? c.r(row, cx, cy, c.w) : T(cx, cy, row[c.k] ?? '', { size: 14, max: c.w, anchor: c.align === 'right' ? 'end' : 'start' });
      s += content;
      cx += c.w + (o.gap ?? 16);
    });
    if (i < rows.length - 1 || o.lastLine) s += L(x, ry + rh - 0.5, x + w, ry + rh - 0.5, C.border);
  });
  return { s, h: rows.length * rh };
}

function colsFit(totalW, defs, gap = 16, pad = 16) {
  const fixed = defs.filter((d) => d.w).reduce((a, d) => a + d.w, 0);
  const flex = defs.filter((d) => !d.w);
  const avail = totalW - pad * 2 - gap * (defs.length - 1) - fixed;
  return defs.map((d) => ({ ...d, w: d.w || avail / flex.length }));
}

function emptyBlock() {
  return '';
}

module.exports = { Flow, cols, card, badge, btn, iconBtn, segmented, tabs, field, switchC, checkbox, radio, progress, budgetBar, BUDGET_TXT, budgetStatus, money, moneyW, delta, section, banner, logoBox, divider, avatar, swatch, tableHead, tableRows, colsFit, emptyBlock };
