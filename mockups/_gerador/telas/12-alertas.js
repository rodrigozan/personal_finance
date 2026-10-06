const H = require('../lib/h');
const { D, ic, btn, banner, card, field, select, sw2, check, dlg, seg, tabs, sk, skRows, loadingWrap, errorState, emptyCard, esc, state } = H;

const alertas = [
  { st: 'warning', icon: 'calendarClock', t: 'Fatura do Nubank vence em 3 dias', d: 'R$ 2.310,00 · vence em 08/10/2026', h: '05/10/2026 08:00', a: 'Ver fatura', href: '05-cartoes.html', un: true },
  { st: 'error', icon: 'octAlert', t: 'Orçamento de Alimentação excedido', d: 'R$ 1.950,00 de R$ 1.800,00 (108%)', h: '04/10/2026 19:42', a: 'Ver orçamento', href: '07-orcamento.html', un: true },
  { st: 'error', icon: 'link', t: 'Banco Inter precisa ser reconectado', d: 'A autorização expirou; os dados estão desatualizados.', h: '03/10/2026 09:42', a: 'Reconectar', href: '10-conexoes.html', un: true },
  { st: 'warning', icon: 'clock', t: 'Consentimento da XP Investimentos expira em 14 dias', d: 'Renove até 19/10/2026 para continuar sincronizando.', h: '02/10/2026 10:15', a: 'Renovar', href: '10-conexoes.html', un: false },
  { st: 'info', icon: 'trendUp', t: 'Gasto atípico: Posto Shell BR-116', d: 'R$ 212,30, cerca de 2,5x a média de combustível.', h: '01/10/2026 17:20', a: 'Ver transação', href: '03-transacoes.html', un: false },
  { st: 'info', icon: 'sparkles', t: 'Nova assinatura detectada: Disney+', d: 'R$ 33,90 por mês, última cobrança em 28/09/2026.', h: '29/09/2026 08:05', a: 'Ver recorrência', href: '08-recorrencias.html', un: false },
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

function alerta(a) {
  return `<li class="al${a.un ? ' al--un' : ''}">${a.un ? '<span class="al__dot" aria-hidden="true"></span><span class="u-visually-hidden">Não lido.</span>' : ''}<span class="al__ic al__ic--${a.st}">${ic(a.icon, 20)}</span><div class="al__b"><p class="al__t">${esc(a.t)}</p><p class="al__d muted small">${a.d}</p><p class="al__h muted small tnum">${a.h}</p><a class="c-button c-button--secondary c-button--sm" href="${a.href}"><span>${a.a}</span></a></div><button type="button" class="link-btn al__r"${a.un ? ' data-read' : ' disabled'}>${a.un ? 'Marcar como lido' : 'Lido'}</button></li>`;
}

function central() {
  return `<section class="c-card c-card--flush"><div class="al-head"><div class="al-head__r"><h2 class="c-card__title">Central de alertas</h2>${btn('Marcar todos como lidos', { v: 'ghost', sm: true, icon: 'check', attrs: 'data-read-all' })}</div><div class="al-head__f"><span class="muted small only-s"><strong data-unread>3</strong> não lidos</span>${select('Tipo de alerta', ['Todos os tipos', 'Faturas', 'Orçamento', 'Conexões'], { value: 'Todos os tipos', hideLabel: true, cls: 'only-l c-field--inline' })}${seg('Filtro', ['Não lidos', 'Todos'], 1, { cls: 'only-l' })}</div></div><ul class="al-list">${alertas.map(alerta).join('')}</ul></section>`;
}

function pref(p) {
  return `<li class="pf"><div class="pf__t"><p class="pf__l">${esc(p.l)}</p><p class="muted small">${p.d}</p></div>${p.v ? `<div class="pf__v">${field('Limite de ' + p.l, { value: p.v, hideLabel: true, readonly: false, cls: p.on ? '' : 'is-disabled' })}</div>` : ''}${sw2(p.l, p.on, { hide: true })}</li>`;
}

function preferencias() {
  return `<section class="c-card c-card--flush"><div class="al-head"><h2 class="c-card__title">Preferências</h2></div><ul class="pf-list">${prefs.map(pref).join('')}</ul><div class="mail"><div class="row-sb"><h3 class="block__title block__title--sm">Notificações por e-mail</h3>${sw2('Notificações por e-mail', true, { hide: true })}</div>${field('E-mail de destino', { value: 'rafael.moreira@exemplo.com.br', icon: 'mail', type: 'email' })}<p class="muted small">Receber por e-mail:</p><div class="mail__c">${check('Fatura a vencer', true)}${check('Conexão com erro', true)}${check('Consentimento a expirar', true)}${check('Orçamento excedido', false)}</div><div class="mail__f">${btn('Descartar', { v: 'ghost', sm: true })}${btn('Salvar', { v: 'primary', sm: true, attrs: 'data-toast="Preferências salvas."' })}</div></div></section>`;
}

const dataView = () => `<div class="tabs--split">${tabs('al', [{ label: 'Central (3)', html: central() }, { label: 'Preferências', html: preferencias() }], { equal: true, label: 'Alertas' })}</div>`;
const loadingView = () => loadingWrap(`${skRows(5, { logo: true })}`, 'Carregando alertas');
const emptyView = () => emptyCard('bellOff', 'Tudo em dia. Nenhum alerta por enquanto.', 'Quando houver faturas a vencer ou conexões com problema, elas aparecem aqui.', btn('Ajustar preferências', { v: 'secondary' }));

module.exports = { id: '12', slug: '12-alertas', titulo: 'Alertas', active: '12-alertas', period: 'none', build: () => ({ views: { data: dataView(), loading: loadingView(), empty: emptyView(), error: errorState('Não foi possível carregar os alertas.') }, dialogs: '' }) };
