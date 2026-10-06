const H = require('../lib/h');
const B = require('../lib/blocks');
const { D, ic, m, brl, btn, banner, delta, kpi, card, field, dlg, txList, txTable, sk, skKpi, skChart, skRows, skTable, loadingWrap, errorState, emptyCard, check } = H;

const vs = (s, l) => `<span class="only-s">${s}</span><span class="only-l">${l}</span>`;

function kpis() {
  return `<div class="kpi-grid">${kpi({ cls: 'd-kpi--saldo', label: 'Saldo total', icon: 'landmark', value: m(D.saldoTotal, { kind: '' }), foot: `<span class="only-s">4 contas · Totais consideram 4 de 5 contas</span><span class="only-l">4 de 5 contas no consolidado</span>` })}${kpi({ cls: 'd-kpi--compact', label: 'Receitas', icon: 'arrowDownL', iconCls: 'ic-income', value: m(D.receitas, { kind: 'income', sign: 'auto' }), foot: delta('up', '10,2%', true, vs('vs. set.', 'vs. setembro')) })}${kpi({ cls: 'd-kpi--compact', label: 'Despesas', icon: 'arrowUpR', iconCls: 'ic-expense', value: m(-D.despesas, { kind: 'expense' }), foot: delta('up', '6,4%', false, vs('vs. set.', 'vs. setembro')) })}${kpi({ cls: 'd-kpi--resultado', label: 'Resultado do mês', icon: 'trendUp', value: m(D.resultado, { kind: 'income', sign: 'always' }), foot: delta('up', 'R$ 612,00', true, `<span class="only-s">vs. set. (resultado de ${brl(D.setembro.resultado)})</span><span class="only-l">vs. setembro</span>`) })}</div>`;
}

function dataView() {
  return `<div class="stack">
<div class="period-line only-l"><span>Período: 05/09 a 04/10/2026 · <button type="button" class="link-btn" data-open="dlg-periodo">Personalizar</button></span><span>Comparando com: setembro de 2026</span></div>
${banner('warning', 'Dados do Banco Inter atualizados há 2 dias.<span class="only-l"> O saldo da conta Inter Conta Digital pode estar desatualizado.</span>', { action: btn('Reconectar', { v: 'secondary', sm: true, href: '10-conexoes.html' }), dismiss: true })}
${kpis()}
<div class="grid-7-5">${B.gastosCard()}${B.fluxoCard()}</div>
<div class="grid-7-5">${B.patrimonioCard()}${B.faturasCard()}</div>
<section class="block" aria-labelledby="ult-t"><div class="block__head"><h2 id="ult-t" class="block__title">Últimas transações</h2>${btn('Ver todas', { v: 'ghost', sm: true, iconEnd: 'chevR', href: '03-transacoes.html', cls: 'only-l-inline' })}</div><div class="only-s">${txList(D.trx.slice(0, 5))}${btn('Ver todas as transações', { v: 'secondary', block: true, href: '03-transacoes.html' })}</div><div class="only-l">${txTable(D.trx.slice(0, 5), { caption: 'Últimas transações' })}</div></section>
</div>`;
}

function loadingView() {
  return loadingWrap(`<div class="kpi-grid">${skKpi()}${skKpi()}${skKpi()}${skKpi()}</div><div class="grid-7-5">${skChart(220)}${skChart(220)}</div><div class="grid-7-5">${skChart(220)}${skRows(2, { logo: true })}</div>${skRows(5)}`, 'Carregando o dashboard');
}

function emptyView() {
  const passos = ['Conecte uma instituição pelo Open Finance (somente leitura).', 'Aguarde a primeira sincronização das contas e cartões.', 'Revise as categorias sugeridas e defina seu orçamento.'];
  const zero = (label, icon) => kpi({ cls: 'd-kpi--compact', label, icon, value: `<span class="money money--neutral"><span class="money__v">R$ 0,00</span></span>`, foot: 'Sem dados no período' });
  return `<div class="stack"><section class="c-card welcome"><h2 class="welcome__t">Comece conectando uma instituição</h2><ol class="steps">${passos.map((p, i) => `<li><span class="steps__n">${i + 1}</span><span>${p}</span></li>`).join('')}</ol><div class="welcome__act">${btn('Conectar instituição', { v: 'primary', icon: 'plus', href: '10-conexoes.html' })}<a class="c-link" href="11-importacao.html">Importar extrato</a></div></section><div class="kpi-grid kpi-grid--zero">${zero('Saldo total', 'landmark')}${zero('Receitas', 'arrowDownL')}${zero('Despesas', 'arrowUpR')}${zero('Resultado do mês', 'trendUp')}</div></div>`;
}

const dialogs = dlg('dlg-periodo', {
  title: 'Período personalizado',
  body: `<div class="form-grid">${field('Data inicial', { value: '05/09/2026', inputmode: 'numeric', icon: 'calendar' })}${field('Data final', { value: '04/10/2026', inputmode: 'numeric', icon: 'calendar' })}</div><div class="tags-row"><button type="button" class="c-tag" aria-pressed="false">Últimos 30 dias</button><button type="button" class="c-tag" aria-pressed="false">Este ano</button></div><p class="note">${ic('info', 16)}<span>Mês financeiro começa no dia 5.</span></p>`,
  footer: `${btn('Cancelar', { v: 'ghost', attrs: 'data-close' })}${btn('Aplicar', { v: 'primary', attrs: 'data-close data-toast="Período aplicado."' })}`,
});

module.exports = {
  id: '02',
  slug: '02-dashboard',
  titulo: 'Dashboard',
  active: '02-dashboard',
  period: 'full',
  build: () => ({
    views: { data: dataView(), loading: loadingView(), empty: emptyView(), error: errorState('Não foi possível carregar o dashboard.', 'Seus dados não foram alterados. Cada bloco falha isoladamente; tente novamente.') },
    dialogs,
    extraHeader: '',
  }),
};
