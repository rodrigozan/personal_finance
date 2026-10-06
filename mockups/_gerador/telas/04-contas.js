const H = require('../lib/h');
const CH = require('../lib/charts');
const B = require('../lib/blocks');
const { D, ic, m, brl, pct, btn, banner, card, field, sw2, dlg, seg, badge, logo, sk, skRows, skChart, skKpi, loadingWrap, errorState, emptyCard, esc, iconBtn, altTable, delta } = H;

const grupos = [
  { inst: 'itau', nome: 'Itaú', status: 'ok', sync: '05/10/2026 14:22', contas: D.contas.filter((c) => c.inst === 'itau') },
  { inst: 'nubank', nome: 'Nubank', status: 'ok', sync: '05/10/2026 14:22', contas: D.contas.filter((c) => c.inst === 'nubank') },
  { inst: 'inter', nome: 'Banco Inter', status: 'error', sync: '03/10/2026 09:41', contas: D.contas.filter((c) => c.inst === 'inter') },
  { inst: 'manual', nome: 'Contas manuais', status: 'manual', contas: D.contas.filter((c) => c.inst === 'manual') },
];

const hist = [
  { l: '07/07', v: 20184.3 },
  { l: '21/07', v: 21640.9 },
  { l: '04/08', v: 19875.45 },
  { l: '18/08', v: 22310.0 },
  { l: '01/09', v: 21092.6 },
  { l: '15/09', v: 22875.35 },
  { l: '05/10', v: D.saldoTotal },
];

const stBadge = (s) => (s === 'ok' ? badge('Atualizado há 12 min', 'ok', 'circleCheck') : s === 'error' ? badge('Ação necessária', 'warning', 'triAlert') : badge('Manual', 'info', 'penLine'));

function grupo(g) {
  const warn = g.status === 'error';
  const rows = g.contas
    .map((c) => `<li><button type="button" class="acc" data-open="dlg-apelido"><span class="acc__main"><span class="acc__n">${esc(c.nome)}</span><span class="acc__t">${c.manual ? '' : `<span class="muted">${esc(c.tipo)}</span>`}${c.manual ? badge('Manual', 'info', 'penLine', { chip: true }) : ''}${!c.consolidado ? badge('Fora do consolidado', 'neutral', null, { chip: true }) : ''}${c.manual ? '' : ''}</span></span>${m(c.saldo, { kind: '', cls: 'acc__v' })}${ic('chevR', 20, 'acc__go')}</button></li>`)
    .join('');
  return `<section class="inst${warn ? ' inst--warn' : ''}" aria-label="${esc(g.nome)}"><header class="inst__head">${logo(g.inst, 32)}<div class="inst__title"><h3>${esc(g.nome)}</h3><p class="muted small only-l">${g.sync ? `Última sincronização: ${g.sync}` : 'Cadastradas e atualizadas manualmente'}</p></div>${g.status !== 'manual' ? `<span class="inst__badge">${stBadge(g.status)}</span>` : ''}<span class="only-l-inline">${iconBtn('dotsV', 'Ações de ' + g.nome, { attrs: 'data-open="dlg-apelido"' })}</span></header><ul class="acc-list">${rows}</ul>${warn ? `<div class="inst__warn">${ic('clock', 16)}<span><span class="only-s">Saldo pode estar desatualizado (há 2 dias)</span><span class="only-l">Saldo pode estar desatualizado. Reconecte a instituição para sincronizar.</span></span>${btn('Reconectar', { v: 'primary', sm: true, href: '10-conexoes.html', cls: 'only-l-inline' })}</div>` : ''}</section>`;
}

function dataView() {
  const var90 = pct(((D.saldoTotal - hist[0].v) / hist[0].v) * 100, 1);
  const lab = 'Linha do saldo consolidado nos últimos 90 dias';
  return `<div class="stack">${btn('Sincronizar contas', { v: 'secondary', icon: 'refresh', cls: 'self-end', attrs: 'data-sync-now' })}
${card(`<div class="cons"><div class="cons__main"><h2 class="cons__l">Saldo consolidado</h2><p class="cons__v">${m(D.saldoTotal, { kind: '' })}</p><p class="muted">4 de 5 contas no consolidado</p><p class="only-l">${badge('Inter Conta Digital: desatualizada', 'warning', 'clock')}</p><p class="cons__var only-l"><span class="muted small">Variação em 90 dias</span> ${delta('up', var90, true)}</p></div><div class="cons__chart only-l"><div class="cons__seg">${seg('Janela', ['30 dias', '90 dias', '1 ano', 'Tudo'], 1)}</div>${CH.line(500, 190, hist, { min: 15000, max: 25000, ticks: 2, left: 64, every: 2, endLabel: brl(D.saldoTotal), label: lab })}<p class="cap">Eixo não começa em zero · Saldo das contas no consolidado</p>${altTable('Histórico do saldo consolidado', ['Data', 'Saldo'], hist.map((p) => [p.l, m(p.v, { kind: '' })]))}</div></div>`, { cls: 'c-card--cons' })}
${grupos.map(grupo).join('')}
<div class="c-card c-card--row">${sw2('Mostrar contas ocultas', false)}</div></div>`;
}

const loadingView = () => loadingWrap(`${skKpi()}${skRows(4, { logo: true })}`, 'Carregando contas');

const emptyView = () => emptyCard('landmark', 'Nenhuma conta ainda', 'As contas aparecem depois da primeira sincronização.', btn('Conectar instituição', { v: 'primary', href: '10-conexoes.html' }));

const dialogs = dlg('dlg-apelido', {
  title: 'Editar apelido da conta',
  body: `<div class="form-stack">${field('Apelido da conta', { value: 'Itaú Corrente (Principal)' })}${sw2('Excluir do consolidado', false)}${sw2('Ocultar conta', false)}</div>`,
  footer: `${btn('Cancelar', { v: 'ghost', attrs: 'data-close' })}${btn('Salvar', { v: 'primary', attrs: 'data-close data-toast="Apelido salvo."' })}`,
});

module.exports = { id: '04', slug: '04-contas', titulo: 'Contas', active: '04-contas', period: 'none', build: () => ({ views: { data: dataView(), loading: loadingView(), empty: emptyView(), error: errorState('Não foi possível carregar as contas.') }, dialogs }) };
