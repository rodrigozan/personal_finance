const ICONS = require('../icons.json');
const D = require('../data');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const nf = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const nfi = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });

function brl(v, o = {}) {
  const { sign = 'auto', dec = true } = o;
  const abs = Math.abs(v);
  const body = dec ? nf.format(abs) : nfi.format(Math.round(abs));
  let s = '';
  if (sign === 'always') s = v < 0 ? '−' : '+';
  else if (sign === 'auto') s = v < 0 ? '−' : '';
  else if (sign === 'plus') s = v < 0 ? '−' : v > 0 ? '+' : '';
  return `${s}R$ ${body}`;
}

const pct = (v, d = 1, sign = false) => `${sign && v > 0 ? '+' : v < 0 ? '−' : ''}${Math.abs(v).toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d })}%`;

function ic(name, size = 20, cls = '') {
  const p = ICONS[name];
  if (!p) throw new Error('icone ausente: ' + name);
  const dots = name === 'grip' || name === 'dotsV' || name === 'dotsH';
  return `<svg class="i${cls ? ' ' + cls : ''}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${dots ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${p.map((d) => `<path d="${d}"/>`).join('')}</svg>`;
}

function m(v, o = {}) {
  const { sign, kind, cls = '', dec = true } = o;
  const k = kind === undefined ? '' : kind;
  const sg = sign || (k === 'income' ? 'plus' : 'auto');
  return `<span class="money${k ? ' money--' + k : ''}${cls ? ' ' + cls : ''}"><span class="money__v">${brl(v, { sign: sg, dec })}</span></span>`;
}

function badge(label, status = 'neutral', icon, o = {}) {
  return `<span class="badge badge--${status}${o.chip ? ' badge--chip' : ''}${o.dashed ? ' badge--dashed' : ''}">${icon ? ic(icon, 14) : ''}<span>${esc(label)}</span></span>`;
}

const catVar = (c) => `var(--category-${c.cor + 1})`;
const sw = (c, size = 12) => `<span class="sw" style="--sw:${size}px;background:${typeof c === 'number' ? `var(--category-${c + 1})` : c}" aria-hidden="true"></span>`;
const catBadge = (c) => `<span class="badge badge--neutral badge--cat">${sw(c.cor)}<span>${esc(c.nome)}</span></span>`;
const swCat = (c, size) => sw(c.cor, size);

function logo(inst, size = 36) {
  return `<img class="logo" src="assets/logos/${inst}.svg" alt="" width="${size}" height="${size}" style="--lg:${size}px">`;
}

function btn(label, o = {}) {
  const { v = 'secondary', icon, iconEnd, block, attrs = '', href, cls = '', sm } = o;
  const c = `c-button c-button--${v}${block ? ' c-button--block' : ''}${sm ? ' c-button--sm' : ''}${cls ? ' ' + cls : ''}`;
  const inner = `${icon ? ic(icon, 20) : ''}<span>${esc(label)}</span>${iconEnd ? ic(iconEnd, 20) : ''}`;
  if (href) return `<a class="${c}" href="${href}" ${attrs}>${inner}</a>`;
  return `<button type="button" class="${c}" ${attrs}>${inner}</button>`;
}

function iconBtn(icon, label, o = {}) {
  const { v = 'ghost', attrs = '', badge: b, cls = '', href } = o;
  const inner = `${ic(icon, 22)}${b ? `<span class="icon-count">${b}</span>` : ''}`;
  if (href) return `<a class="c-icon-button c-icon-button--${v} ${cls}" href="${href}" aria-label="${esc(label)}" ${attrs}>${inner}</a>`;
  return `<button type="button" class="c-icon-button c-icon-button--${v} ${cls}" aria-label="${esc(label)}" ${attrs}>${inner}</button>`;
}

const card = (inner, o = {}) => `<section class="c-card${o.cls ? ' ' + o.cls : ''}"${o.attrs ? ' ' + o.attrs : ''}>${inner}</section>`;

function banner(status, text, o = {}) {
  const icon = o.icon || { info: 'info', warning: 'triAlert', error: 'octAlert', ok: 'circleCheck' }[status];
  return `<div class="c-banner c-banner--${status}" role="${status === 'error' ? 'alert' : 'status'}">${ic(icon, 20)}<div class="c-banner__text">${o.title ? `<strong>${esc(o.title)}</strong> ` : ''}${text}</div>${o.action ? `<div class="c-banner__action">${o.action}</div>` : ''}${o.dismiss ? `<button type="button" class="c-icon-button c-icon-button--ghost c-banner__close" aria-label="Dispensar aviso" data-dismiss>${ic('x', 18)}</button>` : ''}</div>`;
}

let uid = 0;
const nid = (p = 'x') => `${p}${++uid}`;

function seg(label, opts, active = 0, o = {}) {
  const id = nid('seg');
  return `<div class="c-segmented${o.cls ? ' ' + o.cls : ''}" role="radiogroup" aria-label="${esc(label)}"${o.group ? ` data-seg="${o.group}"` : ''}>${opts
    .map((t, i) => {
      const lab = Array.isArray(t) ? t : [t];
      return `<button type="button" role="radio" aria-checked="${i === active}" data-v="${o.values ? o.values[i] : i}">${lab.length > 1 ? `<span class="only-s">${esc(lab[0])}</span><span class="only-l">${esc(lab[1])}</span>` : esc(lab[0])}</button>`;
    })
    .join('')}</div>`;
}

function tabs(id, items, o = {}) {
  const list = `<div class="c-tabs${o.equal ? ' c-tabs--equal' : ''}" role="tablist" aria-label="${esc(o.label || 'Seções')}">${items
    .map((t, i) => `<button type="button" role="tab" id="${id}-t${i}" aria-controls="${id}-p${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}"${t.cls ? ` class="${t.cls}"` : ''}>${t.short ? `<span class="only-s">${esc(t.short)}</span><span class="only-l">${esc(t.label)}</span>` : esc(t.label)}</button>`)
    .join('')}</div>`;
  const panels = items.map((t, i) => `<div class="c-tabpanel" role="tabpanel" id="${id}-p${i}" aria-labelledby="${id}-t${i}"${i ? ' hidden' : ''} tabindex="0">${t.html}</div>`).join('');
  return `<div class="tabs-wrap" data-tabs>${list}${panels}</div>`;
}

function field(label, o = {}) {
  const id = o.id || nid('f');
  const { value = '', type = 'text', icon, iconEnd, help, placeholder = '', readonly, inputmode, ac, money, mono, cls = '', invalid, hideLabel } = o;
  const lab = label ? `<label class="c-field__label${hideLabel ? ' u-visually-hidden' : ''}" for="${id}">${esc(label)}</label>` : '';
  const inp = `<input class="c-field__input${mono ? ' c-field__input--mono' : ''}" id="${id}" type="${type}" value="${esc(value)}" placeholder="${esc(placeholder)}"${readonly ? ' readonly' : ''}${ac ? ` autocomplete="${ac}"` : ''}${inputmode ? ` inputmode="${inputmode}"` : ''}${help ? ` aria-describedby="${id}-h"` : ''}${invalid ? ' aria-invalid="true"' : ''}>`;
  return `<div class="c-field${readonly ? ' c-field--readonly' : ''}${cls ? ' ' + cls : ''}">${lab}<div class="c-field__box">${icon ? ic(icon, 20, 'c-field__icon') : ''}${inp}${iconEnd ? ic(iconEnd, 20, 'c-field__icon c-field__icon--end') : ''}</div>${help ? `<p class="c-field__help" id="${id}-h">${help}</p>` : ''}</div>`;
}

function select(label, options, o = {}) {
  const id = o.id || nid('s');
  const sel = o.value;
  return `<div class="c-field${o.cls ? ' ' + o.cls : ''}"><label class="c-field__label${o.hideLabel ? ' u-visually-hidden' : ''}" for="${id}">${esc(label)}</label><div class="c-field__box c-field__box--select"><select class="c-field__input" id="${id}">${options.map((x) => `<option${x === sel ? ' selected' : ''}>${esc(x)}</option>`).join('')}</select>${ic('chevD', 16, 'c-field__icon c-field__icon--end')}</div></div>`;
}

function sw2(label, on, o = {}) {
  const id = o.id || nid('sw');
  return `<label class="c-switch" for="${id}"><input type="checkbox" role="switch" id="${id}"${on ? ' checked' : ''}${o.attrs ? ' ' + o.attrs : ''}><span class="c-switch__track" aria-hidden="true"></span><span class="c-switch__label${o.hide ? ' u-visually-hidden' : ''}">${esc(label)}</span></label>`;
}

function check(label, on, o = {}) {
  const id = o.id || nid('cb');
  return `<label class="c-check" for="${id}"><input type="checkbox" id="${id}"${on ? ' checked' : ''}${o.attrs ? ' ' + o.attrs : ''}><span class="c-check__box" aria-hidden="true">${ic('check', 14)}</span><span class="c-check__label${o.hide ? ' u-visually-hidden' : ''}">${o.raw ? label : esc(label)}</span></label>`;
}

function radio(name, label, on, o = {}) {
  const id = o.id || nid('rd');
  return `<label class="c-radio" for="${id}"><input type="radio" name="${name}" id="${id}"${on ? ' checked' : ''}><span class="c-radio__dot" aria-hidden="true"></span><span>${o.raw ? label : esc(label)}</span></label>`;
}

function delta(dir, text, fav, ref = '') {
  return `<span class="delta delta--${fav ? 'fav' : 'unfav'}">${ic(dir === 'up' ? 'arrowUp' : 'arrowDown', 16, 'delta__i')}<span class="u-visually-hidden">${dir === 'up' ? 'Aumento' : 'Queda'}, ${fav ? 'favorável' : 'desfavorável'}: </span><span class="delta__v">${text}</span></span>${ref ? `<span class="delta__ref">${ref}</span>` : ''}`;
}

function progress(ratio, status = 'primary', o = {}) {
  const w = Math.max(0, Math.min(1, ratio)) * 100;
  return `<div class="c-progress c-progress--${status}${o.lg ? ' c-progress--lg' : ''}" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(ratio * 100)}" aria-label="${esc(o.label || 'Progresso')}"><span class="c-progress__fill" style="width:${w}%"></span>${o.mark ? '<span class="c-progress__mark" style="left:100%"></span>' : ''}</div>`;
}

function budgetBar(ratio, label) {
  const status = ratio > 1 ? 'error' : ratio >= 0.9 ? 'warning' : 'ok';
  const scale = 1.25;
  const fill = Math.min(1, ratio / scale) * 100;
  return `<div class="c-progress c-progress--${status} c-budget" role="progressbar" aria-valuemin="0" aria-valuemax="125" aria-valuenow="${Math.round(ratio * 100)}" aria-label="${esc(label)}"><span class="c-progress__fill" style="width:${fill}%"></span><span class="c-progress__mark" style="left:${(100 / scale).toFixed(1)}%"></span></div>`;
}

function budgetSit(g) {
  const r = g.v / g.plan;
  if (r > 1.0000001) return { st: 'error', txt: `Excedido em ${brl(g.v - g.plan)}`, icon: 'octAlert', r };
  if (Math.abs(r - 1) < 1e-9) return { st: 'warning', txt: 'No limite', icon: 'circleCheck', r };
  if (r >= 0.9) return { st: 'warning', txt: 'Próximo do limite', icon: 'triAlert', r };
  return { st: 'ok', txt: 'Dentro do planejado', icon: 'circleCheck', r };
}

function sk(w = '100%', h = 16, o = {}) {
  return `<span class="c-skeleton${o.round ? ' c-skeleton--round' : ''}" style="width:${typeof w === 'number' ? w + 'px' : w};height:${h}px"></span>`;
}
const skCard = (inner, cls = '') => `<div class="c-card ${cls}">${inner}</div>`;
const skKpi = () => skCard(`<div class="stack-sm">${sk(110, 14)}${sk('70%', 32)}${sk(130, 14)}</div>`);
const skRows = (n, o = {}) => `<div class="c-card c-card--flush">${Array.from({ length: n }, () => `<div class="sk-row">${o.logo ? sk(36, 36, { round: true }) : ''}<div class="sk-row__body">${sk('55%', 16)}${sk('35%', 12)}</div>${sk(70, 16)}</div>`).join('')}</div>`;
const skChart = (h = 220, title = true) => skCard(`<div class="stack-sm">${title ? sk(180, 20) : ''}${sk('65%', 14)}${sk('100%', h)}</div>`);
const skTable = (n = 8) => `<div class="c-card c-card--flush"><div class="sk-head">${sk('100%', 16)}</div>${Array.from({ length: n }, () => `<div class="sk-row">${sk('100%', 16)}</div>`).join('')}</div>`;
const loadingWrap = (inner, label = 'Carregando conteúdo') => `<div aria-busy="true" class="stack">${inner}<span class="u-visually-hidden" role="status">${label}...</span></div>`;

function state(icon, title, text, actions = '', o = {}) {
  const kind = o.error ? 'error' : 'empty';
  return `<div class="c-state c-state--${kind}${o.compact ? ' c-state--compact' : ''}" ${o.error ? 'role="alert"' : 'role="status"'}><div class="c-state__icon">${ic(icon, o.compact ? 32 : 40)}</div><h2 class="c-state__title">${esc(title)}</h2><p class="c-state__text">${text}</p>${actions ? `<div class="c-state__actions">${actions}</div>` : ''}${o.error ? '<p class="c-state__ref">Ref.: 7F3A</p>' : ''}</div>`;
}
const errorState = (title = 'Não foi possível carregar esta tela.', text = 'Seus dados não foram alterados. Tente novamente em instantes.', extra = '') => card(state('octAlert', title, text, btn('Tentar novamente', { v: 'secondary', icon: 'refresh', attrs: 'data-retry' }) + extra, { error: true }));
const emptyCard = (...a) => card(state(...a));

function dlg(id, o) {
  const { title, body, footer = '', variant = 'modal', persistent, alert, sub } = o;
  return `<dialog id="${id}" class="c-modal c-modal--${variant}" aria-labelledby="${id}-t"${alert ? ' role="alertdialog"' : ''}${persistent ? ' data-persistent' : ''}><div class="c-modal__panel"><header class="c-modal__header"><div><h2 class="c-modal__title" id="${id}-t">${esc(title)}</h2>${sub ? `<p class="c-modal__sub">${sub}</p>` : ''}</div>${persistent ? '' : `<button type="button" class="c-icon-button c-icon-button--ghost" aria-label="Fechar" data-close>${ic('x', 22)}</button>`}</header><div class="c-modal__body">${body}</div>${footer ? `<footer class="c-modal__footer">${footer}</footer>` : ''}</div></dialog>`;
}

const only = (s, l) => `<div class="only-s">${s}</div><div class="only-l">${l}</div>`;

const DOW = { '04/10': 'Domingo', '03/10': 'Sábado', '02/10': 'Sexta-feira', '01/10': 'Quinta-feira', '30/09': 'Quarta-feira', '29/09': 'Terça-feira' };

function chipsFor(chips = []) {
  return chips
    .map((ch) => {
      if (ch === 'interna') return badge('Interna', 'neutral', 'swap', { chip: true });
      if (ch === 'pendente') return badge('Pendente', 'warning', 'hourglass', { chip: true });
      if (ch.startsWith('parcela:')) return badge('Parcela ' + ch.split(':')[1], 'neutral', 'calendarClock', { chip: true });
      if (ch === 'manual') return badge('Manual', 'info', 'penLine', { chip: true });
      return '';
    })
    .join('');
}

function valueKind(t) {
  if (t.chips && t.chips.includes('interna')) return 'internal';
  return t.v > 0 ? 'income' : 'expense';
}

function txValue(t) {
  return m(t.v, { kind: valueKind(t), sign: t.v > 0 ? 'plus' : 'auto' });
}

function txList(list, o = {}) {
  let last = null;
  let out = '';
  list.forEach((t) => {
    if (t.d !== last) {
      const key = t.d.slice(0, 5);
      out += `<li class="c-card-list__group"><h3>${DOW[key] || ''} · ${t.d}</h3></li>`;
      last = t.d;
    }
    const chips = chipsFor(t.chips || []);
    const inner = `<span class="tx__top"><span class="tx__desc">${esc(t.desc)}</span>${txValue(t)}</span><span class="tx__meta">${sw(t.cat.cor)}<span>${esc(t.cat.nome)}</span><span aria-hidden="true">·</span><span class="tx__acc">${esc(t.conta)}</span></span>${chips ? `<span class="tx__chips">${chips}</span>` : ''}`;
    out += o.open ? `<li class="c-card-list__item"><button type="button" class="tx" data-open="${o.open}">${inner}</button></li>` : `<li class="c-card-list__item"><div class="tx">${inner}</div></li>`;
  });
  return `<ul class="c-card-list">${out}</ul>`;
}

function txTable(list, o = {}) {
  const { select: sel, menu, open, caption = 'Transações' } = o;
  const head = `<tr>${sel ? `<th class="col-sel"><span class="u-visually-hidden">Selecionar</span></th>` : ''}<th>Data</th><th>Descrição</th><th>Categoria</th><th class="col-p3">Conta / Cartão</th><th class="num">Valor</th>${menu ? '<th class="col-menu"><span class="u-visually-hidden">Ações</span></th>' : ''}</tr>`;
  const rows = list
    .map((t) => {
      const chips = chipsFor(t.chips || []);
      return `<tr>${sel ? `<td class="col-sel">${check('Selecionar ' + t.desc, false, { hide: true, attrs: 'class="js-rowcheck"' })}</td>` : ''}<td class="tnum">${t.d}</td><td><span class="cell-desc">${open ? `<button type="button" class="link-btn" data-open="${open}">${esc(t.desc)}</button>` : `<span>${esc(t.desc)}</span>`}${chips}</span></td><td>${catBadge(t.cat)}</td><td class="col-p3 muted">${esc(t.conta)}</td><td class="num">${txValue(t)}</td>${menu ? `<td class="col-menu">${iconBtn('dotsV', 'Ações da transação ' + t.desc, { cls: 'c-icon-button--sm' })}</td>` : ''}</tr>`;
    })
    .join('');
  return `<div class="c-table-wrap"><table class="c-table"><caption class="u-visually-hidden">${caption}</caption><thead>${head}</thead><tbody>${rows}</tbody></table></div>`;
}

function pagination(total = 9, label = 'Itens por página: 15') {
  const pages = ['1', '2', '3', '…', String(total)];
  return `<nav class="c-pagination" aria-label="Paginação"><span class="c-pagination__info only-l">${label}</span><button type="button" class="c-pagination__btn" disabled aria-label="Página anterior">${ic('chevL', 18)}</button>${pages.map((p, i) => (p === '…' ? '<span class="c-pagination__gap only-l-inline" aria-hidden="true">…</span>' : `<button type="button" class="c-pagination__btn only-l-inline" ${i === 0 ? 'aria-current="page"' : ''}>${p}</button>`)).join('')}<span class="c-pagination__info only-s">Página 1 de ${total}</span><button type="button" class="c-pagination__btn" aria-label="Próxima página">${ic('chevR', 18)}</button></nav>`;
}

function dataTable(caption, heads, rows) {
  return `<div class="c-table-wrap"><table class="c-table c-table--plain"><caption class="u-visually-hidden">${esc(caption)}</caption><thead><tr>${heads.map((h, i) => `<th${i ? ' class="num"' : ''}>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c, i) => `<td${i ? ' class="num"' : ''}>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

function altTable(caption, heads, rows) {
  return `<details class="alt-table"><summary>${ic('chevR', 16, 'alt-table__i')}Ver como tabela</summary>${dataTable(caption, heads, rows)}</details>`;
}

const kpi = (o) => `<section class="d-kpi${o.cls ? ' ' + o.cls : ''}" aria-label="${esc(o.label)}"><h3 class="d-kpi__label">${o.icon ? ic(o.icon, 18, o.iconCls || '') : ''}<span>${esc(o.label)}</span></h3><p class="d-kpi__value">${o.value}</p>${o.foot ? `<p class="d-kpi__foot">${o.foot}</p>` : ''}</section>`;

const cardHead = (title, right = '') => `<div class="c-card__header"><h2 class="c-card__title">${esc(title)}</h2>${right}</div>`;

const mask = (s) => s;

module.exports = { D, esc, brl, pct, ic, m, badge, catBadge, sw, swCat, catVar, logo, btn, iconBtn, card, banner, seg, tabs, field, select, sw2, check, radio, delta, progress, budgetBar, budgetSit, sk, skCard, skKpi, skRows, skChart, skTable, loadingWrap, state, errorState, emptyCard, dlg, only, txList, txTable, txValue, pagination, altTable, dataTable, kpi, cardHead, chipsFor, nid, mask, DOW };
