const H = require('../lib/h');
const { D, ic, m, brl, btn, banner, card, field, select, sw2, check, radio, dlg, seg, txList, txTable, pagination, badge, catBadge, sk, skRows, skTable, loadingWrap, errorState, emptyCard, state, esc, iconBtn } = H;

const tag = (t) => `<span class="c-tag c-tag--rem">${t}<button type="button" class="c-tag__x" aria-label="Remover filtro ${esc(t)}">${ic('x', 14)}</button></span>`;

const totals = () => `<p class="tx-totals"><strong>128 transações no filtro</strong><span class="tx-totals__r">Receitas ${m(D.receitas, { kind: 'income' })}</span><span class="tx-totals__r">Despesas ${m(-D.despesas, { kind: 'expense' })}</span></p>`;

function controls() {
  return `<div class="tx-bar1"><div class="tx-search-row"><div class="tx-search">${field('Buscar', { icon: 'search', placeholder: 'Buscar descrição', hideLabel: true, cls: 'only-s' })}${field('Buscar', { icon: 'search', placeholder: 'Buscar por descrição ou valor', hideLabel: true, cls: 'only-l' })}</div><button type="button" class="c-button c-button--secondary tx-filtros only-s" data-open="dlg-filtros">${ic('sliders', 20)}<span>Filtros</span><span class="icon-count icon-count--abs">1</span></button></div>${seg('Tipo de transação', [['Todas'], ['Receitas'], ['Despesas'], ['Transf.', 'Transferências']], 0, { cls: 'tx-seg' })}<div class="tx-actions only-l">${btn('Exportar CSV', { v: 'secondary', icon: 'download', attrs: 'data-toast="Exportação do CSV iniciada."' })}${btn('Nova transação', { v: 'primary', icon: 'plus', attrs: 'data-open="dlg-nova"' })}</div></div>
<div class="tx-bar2 only-l"><div class="tx-selects">${select('Período', ['Out/2026', 'Set/2026', 'Ago/2026'], { value: 'Out/2026', cls: 'c-field--inline' })}${select('Conta', ['Todas', 'Itaú Corrente', 'Nubank •4821', 'Itaú Mastercard •7305'], { value: 'Todas', cls: 'c-field--inline' })}${select('Categoria', ['Todas', 'Alimentação', 'Transporte', 'Saúde'], { value: 'Todas', cls: 'c-field--inline' })}${btn('Mais filtros', { v: 'ghost', icon: 'sliders', attrs: 'data-open="dlg-filtros"' })}</div><div class="tx-density"><span class="muted">Densidade</span>${seg('Densidade da tabela', ['Confortável', 'Compacta'], 0, { group: 'dens', values: ['conf', 'comp'] })}</div></div>
<div class="tx-active"><span class="c-tag c-tag--rem">05/09 a 04/10/2026<button type="button" class="c-tag__x" aria-label="Remover filtro de período">${ic('x', 14)}</button></span><span class="muted small only-l">Filtros ativos: 1</span></div>
<div class="bulk" id="bulk" hidden role="region" aria-label="Ações em lote"><span class="bulk__n"><strong data-bulk-count>0</strong> selecionadas</span><div class="bulk__act">${btn('Categoria', { v: 'secondary', sm: true, attrs: 'data-open="dlg-lote"' })}${btn('Tags', { v: 'secondary', sm: true, attrs: 'data-open="dlg-lote"' })}${btn('Marcar interna', { v: 'secondary', sm: true, attrs: 'data-open="dlg-lote"' })}${btn('Ignorar', { v: 'secondary', sm: true, attrs: 'data-open="dlg-lote"' })}${btn('Limpar', { v: 'ghost', sm: true, attrs: 'data-bulk-clear' })}</div></div>`;
}

function dataView() {
  return `<div class="stack">${controls()}<div class="only-s">${txList(D.trx, { open: 'dlg-detalhe' })}${totals()}${pagination(9)}</div><div class="only-l"><div class="c-card c-card--flush c-card--table">${txTable(D.trx, { select: true, menu: true, open: 'dlg-detalhe' })}</div><div class="tx-foot"><span class="muted">Mostrando 1–15 de 128</span><span class="tx-foot__t">Receitas ${m(D.receitas, { kind: 'income' })}</span><span class="tx-foot__t">Despesas ${m(-D.despesas, { kind: 'expense' })}</span>${pagination(9)}</div></div></div>`;
}

function loadingView() {
  return loadingWrap(`<div class="only-s">${skRows(6)}</div><div class="only-l">${skTable(10)}</div>`, 'Carregando transações');
}

function emptyView() {
  return `<div class="stack">${emptyCard('inbox', 'Nenhuma transação ainda', 'As transações aparecem depois da primeira sincronização ou de uma importação de extrato.', btn('Conectar instituição', { v: 'primary', href: '10-conexoes.html' }) + btn('Importar extrato', { href: '11-importacao.html' }) + btn('Nova transação', { attrs: 'data-open="dlg-nova"' }))}${card(state('search', 'Nenhuma transação encontrada com esses filtros.', 'Tente ampliar o período.', btn('Limpar filtros', { v: 'secondary' }), { compact: true }), { cls: 'c-card--sub' })}</div>`;
}

const catSel = (id) => select('Categoria', ['Alimentação', 'Transporte', 'Saúde', 'Lazer', 'Moradia'], { id, value: 'Alimentação' });

const detalhe = dlg('dlg-detalhe', {
  title: 'Detalhe da transação',
  variant: 'drawer',
  body: `<div class="det-head"><p class="det-valor">${m(-187.43, { kind: 'expense' })}</p><p class="muted small">04/10/2026 às 18:12 · Itaú Mastercard •7305 · Crédito</p><p class="chips">${badge('Pendente', 'warning', 'hourglass', { chip: true })}</p></div>
<div class="form-stack">${field('Descrição amigável', { value: 'Pão de Açúcar Supermercado', help: 'Original: <code class="mono">PAO DE ACUCAR 1234 SAO PAULO</code>' })}
<div class="row-end">${catSel('det-cat')}${btn('Dividir', { v: 'secondary', icon: 'split', attrs: 'data-open="dlg-dividir"' })}</div>
<p class="small muted">Sugestão da Pluggy: Supermercados</p>
<div class="c-field"><span class="c-field__label" id="tags-l">Tags</span><div class="tags-row" aria-labelledby="tags-l"><span class="c-tag c-tag--rem">compras do mês<button type="button" class="c-tag__x" aria-label="Remover tag compras do mês">${ic('x', 14)}</button></span><input class="c-field__input c-field__input--tag" aria-label="Adicionar tag" placeholder="Adicionar tag"></div></div>
<div class="c-field"><label class="c-field__label" for="det-notas">Notas</label><div class="c-field__box"><textarea class="c-field__input" id="det-notas" rows="3" placeholder="Anotações sobre esta transação"></textarea></div></div>
<fieldset class="calc"><legend>Tratamento nos cálculos</legend><div class="calc__row">${sw2('Transferência interna', false)}<p class="small muted">Não entra em receitas nem despesas.</p></div><div class="calc__row">${sw2('Ignorar nos cálculos', false)}<p class="small muted">Mantém a transação, mas fora dos totais.</p></div></fieldset>
<p class="small muted">Origem: Open Finance (Itaú) · Sincronizada em 05/10/2026 14:22</p></div>`,
  footer: `${btn('Excluir', { v: 'danger-outline', attrs: 'data-open="dlg-excluir"', cls: 'push-start' })}${btn('Cancelar', { v: 'ghost', attrs: 'data-close' })}${btn('Salvar', { v: 'primary', attrs: 'data-close data-toast="Transação salva."' })}`,
});

const nova = dlg('dlg-nova', {
  title: 'Nova transação',
  variant: 'drawer',
  body: `<div class="form-stack">${seg('Tipo', ['Despesa', 'Receita', 'Transferência'], 0)}${field('Valor', { value: '0,00', inputmode: 'decimal', icon: 'wallet' })}${field('Data', { value: '05/10/2026', inputmode: 'numeric', icon: 'calendar' })}${select('Conta ou cartão', ['Itaú Corrente', 'Nubank •4821', 'Itaú Mastercard •7305', 'Dinheiro em espécie'], { value: 'Itaú Corrente' })}${field('Descrição', { placeholder: 'Ex.: Almoço com cliente' })}${catSel('nova-cat')}${field('Tags', { placeholder: 'Separe por vírgula' })}<div class="c-field"><label class="c-field__label" for="nova-n">Notas</label><div class="c-field__box"><textarea class="c-field__input" id="nova-n" rows="3"></textarea></div></div></div>`,
  footer: `${btn('Cancelar', { v: 'ghost', attrs: 'data-close' })}${btn('Salvar', { v: 'primary', attrs: 'data-close data-toast="Transação criada."' })}`,
});

const dividir = dlg('dlg-dividir', {
  title: 'Dividir transação',
  sub: `Valor total ${brl(187.43)}`,
  body: `<div class="split">${[['Alimentação', '150,00'], ['Saúde', '37,43']].map((x, i) => `<div class="split__row">${select('Categoria', ['Alimentação', 'Saúde', 'Lazer'], { value: x[0], id: 'sp' + i, hideLabel: true })}${field('Valor', { value: x[1], inputmode: 'decimal', hideLabel: true, id: 'spv' + i })}${iconBtn('trash', 'Remover divisão ' + (i + 1))}</div>`).join('')}</div>${btn('Adicionar divisão', { v: 'ghost', icon: 'plus' })}<p class="split__rest ok">${ic('circleCheck', 18)}<span>Restante: R$&nbsp;0,00</span></p>`,
  footer: `${btn('Cancelar', { v: 'ghost', attrs: 'data-close' })}${btn('Aplicar divisão', { v: 'primary', attrs: 'data-close data-toast="Divisão aplicada."' })}`,
});

const lote = dlg('dlg-lote', {
  title: 'Editar em lote',
  sub: 'As alterações valem para as transações selecionadas.',
  body: `<div class="form-stack">${select('Nova categoria', ['Manter como está', 'Alimentação', 'Transporte', 'Saúde'], { value: 'Manter como está' })}<fieldset class="radio-set"><legend>Tratamento</legend>${radio('lote', 'Não alterar', true)}${radio('lote', 'Marcar como transferência interna', false)}${radio('lote', 'Ignorar nos cálculos', false)}</fieldset>${banner('info', 'Prévia: a categoria de até 128 transações pode mudar. Edições manuais não são sobrescritas por regras.')}</div>`,
  footer: `${btn('Cancelar', { v: 'ghost', attrs: 'data-close' })}${btn('Aplicar', { v: 'primary', attrs: 'data-close data-toast="Alterações aplicadas. Desfazer disponível por 10 s."' })}`,
});

const excluir = dlg('dlg-excluir', {
  title: 'Excluir transação?',
  alert: true,
  body: '<p>A transação manual será removida permanentemente e deixará de entrar nos cálculos. Esta ação não pode ser desfeita.</p>',
  footer: `${btn('Cancelar', { v: 'ghost', attrs: 'data-close' })}${btn('Excluir', { v: 'danger', attrs: 'data-close data-toast="Transação excluída."' })}`,
});

const filtros = dlg('dlg-filtros', {
  title: 'Filtros',
  variant: 'sheet',
  body: `<div class="form-stack">${select('Período', ['Out/2026', 'Set/2026', 'Ago/2026'], { value: 'Out/2026' })}${select('Conta ou cartão', ['Todas', 'Itaú Corrente', 'Nubank •4821'], { value: 'Todas' })}${select('Categoria', ['Todas', 'Alimentação', 'Transporte', 'Saúde'], { value: 'Todas' })}${field('Valor mínimo', { placeholder: 'R$ 0,00', inputmode: 'decimal' })}${field('Valor máximo', { placeholder: 'R$ 0,00', inputmode: 'decimal' })}${check('Somente pendentes', false)}</div>`,
  footer: `${btn('Limpar', { v: 'secondary', attrs: 'data-close' })}${btn('Aplicar', { v: 'primary', attrs: 'data-close' })}`,
});

module.exports = {
  id: '03',
  slug: '03-transacoes',
  titulo: 'Transações',
  active: '03-transacoes',
  period: 'none',
  fab: 'dlg-nova',
  build: () => ({
    views: { data: dataView(), loading: loadingView(), empty: emptyView(), error: errorState('Não foi possível carregar as transações.', 'Seus filtros foram preservados e nenhum dado foi alterado.') },
    dialogs: detalhe + nova + dividir + lote + excluir + filtros,
  }),
};
