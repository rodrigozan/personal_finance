const H = require('../lib/h');
const CH = require('../lib/charts');
const B = require('../lib/blocks');
const { D, ic, m, brl, pct, btn, banner, card, field, select, radio, dlg, seg, tabs, badge, logo, sk, skRows, skKpi, loadingWrap, errorState, emptyCard, esc, sw, kpi } = H;

const anterior = { moradia: 2800, alimentacao: 1790, transporte: 905.5, saude: 598.7, lazer: 612.3, educacao: 480, assinaturas: 298.4, compras: 520, outros: 372.5 };
const cats = [...D.gastosCat].sort((a, b) => b.v - a.v).map((g) => ({ ...g, ant: anterior[g.c.id], var: ((g.v - anterior[g.c.id]) / anterior[g.c.id]) * 100 }));

const varCell = (v) => {
  if (Math.abs(v) < 0.05) return '<span class="muted small">Sem variação</span>';
  const up = v > 0;
  return `<span class="delta delta--${up ? 'unfav' : 'fav'} delta--sm">${ic(up ? 'arrowUp' : 'arrowDown', 14, 'delta__i')}<span class="u-visually-hidden">${up ? 'Aumento' : 'Queda'}, ${up ? 'desfavorável' : 'favorável'}: </span><span class="delta__v">${pct(Math.abs(v), 1)}</span></span>`;
};

const cartoesRel = [
  { c: D.cartoes[0], gasto: 3652.3, fatura: 2310.0, venc: '08/10/2026' },
  { c: D.cartoes[1], gasto: 2192.52, fatura: 1874.52, venc: '10/10/2026' },
];

const acc = (id, title, body) => `<section class="rep-sec" data-acc><h3 class="rep-sec__h"><button type="button" aria-expanded="true" aria-controls="${id}"><span>${title}</span>${ic('chevU', 20)}</button></h3><div class="rep-sec__b" id="${id}">${body}</div></section>`;

function donutRep(size, th) {
  const slices = cats.slice(0, 5).map((g) => ({ v: g.v, color: CH.catColors[g.c.cor] })).concat([{ v: cats.slice(5).reduce((a, g) => a + g.v, 0), color: CH.catColors[11] }]);
  return CH.donut(size, th, slices, ['Despesas', brl(D.despesas, { dec: false })], 'Rosca de despesas por categoria');
}

const catsBody = () => `<div class="rep-cat"><div class="rep-cat__plot">${H.only(donutRep(160, 24), donutRep(180, 28))}</div><div class="only-s"><ul class="rep-list">${cats.map((g) => `<li><div><span class="cat-list__name">${sw(g.c.cor)}<span>${esc(g.c.nome)}</span></span><span class="muted small tnum">${pct((g.v / D.despesas) * 100, 1)} ${varCell(g.var)} <span class="muted small">vs. set.</span></span></div>${m(g.v, { kind: '' })}</li>`).join('')}</ul></div><div class="only-l rep-cat__t">${H.dataTable('Despesas por categoria', ['Categoria', 'Valor', '% do total', 'Variação vs. set.'], cats.map((g) => [`<span class="cat-list__name">${sw(g.c.cor)}<span>${esc(g.c.nome)}</span></span>`, m(g.v, { kind: '' }), pct((g.v / D.despesas) * 100, 1), varCell(g.var)]))}</div></div>`;

const cartBody = () => `<div class="only-s"><ul class="rep-list">${cartoesRel.map((c) => `<li class="rep-card"><p class="rep-card__n">${logo(c.c.inst, 32)}<strong>${esc(c.c.curto)} •${c.c.final}</strong></p><p class="row-sb"><span class="muted small">Gasto no período</span>${m(c.gasto, { kind: '' })}</p><p class="row-sb"><span class="muted small">Fatura fechada (vence ${c.venc.slice(0, 5)})</span>${m(c.fatura, { kind: '' })}</p></li>`).join('')}</ul></div><div class="only-l">${H.dataTable('Cartões', ['Cartão', 'Gasto no período', 'Fatura fechada', 'Vencimento'], cartoesRel.map((c) => [`<span class="inst-cell">${logo(c.c.inst, 28)}<span>${esc(c.c.nome)} •${c.c.final}</span></span>`, m(c.gasto, { kind: '' }), m(c.fatura, { kind: '' }), `<span class="tnum">${c.venc}</span>`]))}</div><p class="muted small">Parcelas comprometidas em faturas futuras: ${m(2700, { kind: '' })}</p>`;

const patBody = () => `<ul class="eq">${[['Contas (consolidado)', D.saldoTotal, ''], ['Investimentos', D.invAtual, '+'], ['Faturas a pagar', D.faturasTotal, '−'], ['Patrimônio líquido', D.patrimonio, '=']].map((p, i) => `<li class="eq__i${i === 3 ? ' eq__i--t' : ''}"><span class="eq__op" aria-hidden="true">${p[2]}</span><span class="muted">${p[0]}</span>${m(p[1], { kind: '', sign: 'none' })}</li>`).join('')}</ul>`;

function mensal() {
  return `<div class="stack"><div class="rep-actions">${btn('Imprimir', { v: 'secondary', icon: 'printer', attrs: 'data-open="dlg-imprimir"' })}${btn('Exportar PDF', { v: 'secondary', icon: 'fileText', attrs: 'data-open="dlg-imprimir"' })}</div><article class="c-card rep"><header class="rep__h"><h2 class="rep__t">Relatório de outubro de 2026</h2><p class="muted small tnum"><span class="only-l">Período 05/09/2026 a 04/10/2026 · </span>Gerado em 05/10/2026</p></header><div class="rep-kpis">${[['Receitas', D.receitas, 'income', 'plus', 'arrowDownL'], ['Despesas', -D.despesas, 'expense', 'auto', 'arrowUpR'], ['Resultado', D.resultado, 'income', 'always', 'trendUp']].map((k) => `<div class="rep-kpi"><span class="muted">${ic(k[4], 18)}${k[0]}</span>${m(k[1], { kind: k[2], sign: k[3] })}</div>`).join('')}</div>${acc('rep-c', 'Categorias', catsBody())}${acc('rep-k', 'Cartões', cartBody())}${acc('rep-p', 'Patrimônio', patBody())}</article></div>`;
}

function exportacoes() {
  return `<div class="stack"><h2 class="block__title only-s">Exportações</h2>${card(`<h3 class="block__title block__title--sm">Exportar transações filtradas (CSV)</h3><div class="form-grid form-grid--3">${select('Período', ['05/09/2026 a 04/10/2026', 'Set/2026'], { value: '05/09/2026 a 04/10/2026' })}${select('Conta ou cartão', ['Todos', 'Itaú Corrente', 'Nubank •4821'], { value: 'Todos' })}${select('Categoria', ['Todas', 'Alimentação', 'Transporte'], { value: 'Todas' })}</div><div class="preview"><strong>128 transações</strong><span>Receitas ${m(D.receitas, { kind: 'income' })}</span><span>Despesas ${m(-D.despesas, { kind: 'expense' })}</span><p class="muted small only-l">Transferências internas e transações ignoradas ficam fora dos totais.</p></div>${btn('Exportar CSV', { v: 'primary', icon: 'download', attrs: 'data-toast="Preparando arquivo... download iniciado."' })}`)}${card(`<h3 class="block__title block__title--sm">Exportar todos os dados</h3><fieldset class="radio-set"><legend>Formato</legend>${radio('fmt', 'JSON (estruturado, recomendado)', true)}${radio('fmt', 'CSV (um arquivo por tabela, compactado)', false)}</fieldset>${banner('warning', 'O arquivo contém dados financeiros sensíveis. Guarde com cuidado.')}${btn('Exportar tudo', { v: 'secondary', icon: 'download', attrs: 'data-open="dlg-exportar"' })}`)}</div>`;
}

const dataView = () => tabs('rel', [{ label: 'Mensal', html: mensal() }, { label: 'Exportações', html: exportacoes() }], { equal: true, label: 'Relatórios' });
const loadingView = () => loadingWrap(`${skKpi()}${skRows(4)}`, 'Gerando relatório');
const emptyView = () => emptyCard('fileText', 'Nenhuma movimentação em outubro de 2026.', 'Escolha outro mês para gerar o relatório.', btn('Escolher outro mês', { v: 'secondary' }));

const dialogs =
  dlg('dlg-exportar', { title: 'Exportar todos os dados', body: banner('warning', 'O arquivo contém dados financeiros sensíveis. Guarde com cuidado.'), footer: `${btn('Cancelar', { v: 'ghost', attrs: 'data-close' })}${btn('Exportar', { v: 'primary', attrs: 'data-close data-toast="Exportação iniciada."' })}` }) +
  dlg('dlg-imprimir', { title: 'Imprimir ou exportar PDF', body: banner('info', 'Exportações e impressão não são mascaradas: os valores saem visíveis mesmo com “Ocultar valores” ligado.'), footer: `${btn('Cancelar', { v: 'ghost', attrs: 'data-close' })}${btn('Continuar', { v: 'primary', attrs: 'data-close data-print' })}` });

module.exports = { id: '13', slug: '13-relatorios', titulo: 'Relatórios', active: '13-relatorios', period: 'month', build: () => ({ views: { data: dataView(), loading: loadingView(), empty: emptyView(), error: errorState('Não foi possível gerar o relatório.') }, dialogs }) };
