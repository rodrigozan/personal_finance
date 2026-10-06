const H = require('../lib/h');
const CH = require('../lib/charts');
const { D, ic, m, brl, pct, btn, banner, card, field, select, dlg, seg, tabs, badge, logo, sk, skRows, skChart, skKpi, loadingWrap, errorState, emptyCard, esc, kpi, delta, altTable, dataTable, sw } = H;

const clsIcon = { 'Renda fixa': 'landmark', 'Renda variável': 'trendUp', Previdência: 'shield', Outros: 'wallet' };
const clsColor = (i) => `var(--chart-${i + 1})`;
const evol = [
  { l: 'mai', v: 55820.4 },
  { l: 'jun', v: 57210.15 },
  { l: 'jul', v: 58632.8 },
  { l: 'ago', v: 60105.35 },
  { l: 'set', v: 62340.1 },
  { l: 'out', v: D.invAtual },
];

const rent = (it) => {
  const v = it.atual - it.aplicado;
  const p = (v / it.aplicado) * 100;
  const up = v >= 0;
  return `<span class="rent rent--${up ? 'up' : 'down'}">${ic(up ? 'arrowUp' : 'arrowDown', 16)}<span class="u-visually-hidden">${up ? 'Ganho' : 'Perda'}: </span>${m(v, { kind: up ? 'income' : 'expense', sign: 'plus' })} <span class="tnum">(${pct(p, 1, true)})</span></span>`;
};

const alloc = () => `<div class="alloc-bar" role="img" aria-label="Alocação: ${D.invClasses.map((c) => `${c.nome} ${pct((c.atual / D.invAtual) * 100, 0)}`).join(', ')}">${D.invClasses.map((c, i) => `<span style="flex:${c.atual};background:${clsColor(i)}"></span>`).join('')}</div><ul class="legend legend--grid">${D.invClasses.map((c, i) => `<li>${sw(clsColor(i))}${esc(c.nome)} ${pct((c.atual / D.invAtual) * 100, 0)}</li>`).join('')}</ul>`;

function itemM(it) {
  return `<li class="inv"><div class="inv__top"><span class="inv__n">${esc(it.nome)}${it.manual ? badge('Manual', 'info', 'penLine', { chip: true }) : ''}</span>${m(it.atual, { kind: '' })}</div><div class="inv__mid"><span class="inv__i">${logo(it.inst, 20)}<span class="muted">${esc(it.instNome)}</span></span>${rent(it)}</div><div class="inv__bot muted small tnum"><span>Aplicado ${brl(it.aplicado)}</span><span>${it.venc ? `Vence em ${it.venc}` : 'Vencimento: —'}</span></div></li>`;
}

function classHead(c, i, big) {
  return `<header class="cls__head"><span class="cls__ic" style="--c:${clsColor(i)}">${ic(clsIcon[c.nome], 18)}</span><div><h3>${c.nome}</h3><p class="muted small">${pct((c.atual / D.invAtual) * 100, 1)} da carteira<span class="only-l"> · ${c.itens.length} ${c.itens.length === 1 ? 'investimento' : 'investimentos'}</span></p></div>${m(c.atual, { kind: '', cls: big ? 'cls__v' : '' })}</header>`;
}

function classT(c, i) {
  const rows = c.itens
    .map((it) => `<tr><td><span class="cell-desc"><span>${esc(it.nome)}</span>${it.manual ? badge('Manual', 'info', 'penLine', { chip: true }) : ''}</span></td><td><span class="inst-cell">${logo(it.inst, 20)}<span class="muted">${esc(it.instNome)}</span></span></td><td class="num">${m(it.aplicado, { kind: '' })}</td><td class="num"><strong>${m(it.atual, { kind: '' })}</strong></td><td class="num">${rent(it)}</td><td class="tnum">${it.venc || '<span class="muted">—</span>'}</td><td class="col-menu">${it.manual ? H.iconBtn('dotsV', 'Ações de ' + it.nome, { cls: 'c-icon-button--sm' }) : ''}</td></tr>`)
    .join('');
  return `<div class="c-table-wrap"><table class="c-table"><caption class="u-visually-hidden">${c.nome}</caption><thead><tr><th>Nome</th><th>Instituição</th><th class="num">Aplicado</th><th class="num">Atual</th><th class="num">Rentabilidade</th><th>Vencimento</th><th class="col-menu"><span class="u-visually-hidden">Ações</span></th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

const carteira = () => `<div class="stack">${D.invClasses.map((c, i) => `<section class="cls" aria-label="${c.nome}">${classHead(c, i, true)}<div class="only-s"><ul class="inv-list">${c.itens.map(itemM).join('')}</ul></div><div class="only-l"><div class="c-card c-card--flush">${classT(c, i)}</div></div></section>`).join('')}</div>`;

function donutAloc(size, th) {
  return CH.donut(size, th, D.invClasses.map((c, i) => ({ v: c.atual, color: clsColor(i) })), ['Total', brl(D.invAtual, { dec: false })], 'Rosca da alocação por classe de investimento');
}

const alocacao = () => card(`<div class="aloc"><div class="aloc__plot">${H.only(donutAloc(176, 26), donutAloc(200, 30))}</div><ul class="aloc__list">${D.invClasses.map((c, i) => `<li>${sw(clsColor(i))}<div><strong>${c.nome}</strong><p class="muted small tnum">${pct((c.atual / D.invAtual) * 100, 1)} · ${m(c.atual, { kind: '' })}</p></div></li>`).join('')}</ul></div>${altTable('Alocação por classe', ['Classe', '%', 'Valor'], D.invClasses.map((c) => [c.nome, pct((c.atual / D.invAtual) * 100, 1), m(c.atual, { kind: '' })]))}<p class="cap">Posição em 05/10/2026</p>`);

const evolucao = (W) => card(`<div class="c-card__header"><h3 class="block__title">Evolução do valor atual</h3>${seg('Período', ['3M', '6M', '1A', 'Tudo'], 1, { cls: 'seg-head' })}</div><div class="chart">${H.only(CH.line(326, 210, evol, { min: 50000, max: 70000, ticks: 2, left: 56, endLabel: brl(D.invAtual), label: 'Linha da evolução do valor atual da carteira' }), CH.line(W, 260, evol, { min: 50000, max: 70000, ticks: 4, left: 64, endLabel: brl(D.invAtual), label: 'Linha da evolução do valor atual da carteira' }))}</div>${altTable('Evolução do valor atual', ['Mês', 'Valor atual'], evol.map((p) => [p.l, m(p.v, { kind: '' })]))}<p class="cap">Eixo não começa em zero · Valor atual da carteira</p>`);

const movs = [['02/10/2026', 'Tesouro Selic 2029', 'Aporte', 'in', 1000], ['01/10/2026', 'Caixinha Reserva (CDB)', 'Rendimento', 'in', 63.21], ['15/09/2026', 'HGLG11 (30 cotas)', 'Rendimento', 'in', 42.9], ['10/09/2026', 'ITUB4 (100 ações)', 'Resgate', 'out', 600], ['01/09/2026', 'LCI 2027 (95% do CDI)', 'Imposto', 'tax', 12.4]];
const movimentacoes = () => card(`<div class="block__head"><h3 class="block__title">Movimentações</h3></div>${dataTable('Movimentações de investimentos', ['Data', 'Investimento', 'Tipo', 'Valor'], movs.map((r) => [r[0], esc(r[1]), `${badge(r[2], 'neutral', r[3] === 'in' ? 'arrowDownL' : r[3] === 'out' ? 'arrowUpR' : 'receipt', { chip: true })}`, m(r[3] === 'in' ? r[4] : -r[4], { kind: r[3] === 'in' ? 'income' : 'expense', sign: 'plus' })]))}`, { cls: 'c-card--table' });

function dataView() {
  const rentV = D.invRent;
  const t = tabs('invest', [{ label: 'Carteira', html: carteira() }, { label: 'Alocação', cls: 'hide-xl', html: alocacao() }, { label: 'Evolução', cls: 'hide-xl', html: evolucao(600) }, { label: 'Movimentações', short: 'Movim.', html: movimentacoes() }], { equal: true, label: 'Seções de investimentos' });
  return `<div class="stack">${btn('Investimento manual', { v: 'secondary', icon: 'plus', cls: 'self-end', attrs: 'data-open="dlg-manual"' })}
<div class="inv-sum"><div class="only-s">${card(`<p class="muted">Valor atual</p><p class="big">${m(D.invAtual, { kind: '' })}</p><hr><div class="sum2"><div><p class="muted small">Aplicado</p>${m(D.invAplicado, { kind: '' })}</div><div><p class="muted small">Rentabilidade</p>${delta('up', pct((rentV / D.invAplicado) * 100, 1), true)}<p>${m(rentV, { kind: 'income', sign: 'plus' })}</p></div></div><p class="muted small strong">Alocação por classe</p>${alloc()}`)}</div><div class="only-l kpi-3">${kpi({ label: 'Valor atual', value: m(D.invAtual, { kind: '' }), cls: 'd-kpi--big', foot: '7 investimentos · 4 instituições e 1 manual' })}${kpi({ label: 'Valor aplicado', value: m(D.invAplicado, { kind: '' }), cls: 'd-kpi--compact', foot: 'Soma dos aportes líquidos' })}${kpi({ label: 'Rentabilidade', value: m(rentV, { kind: 'income', sign: 'always' }), cls: 'd-kpi--compact', foot: delta('up', pct((rentV / D.invAplicado) * 100, 1), true, 'desde o início') })}</div></div>
<div class="grid-5-7 show-xl">${alocacao()}${evolucao(540)}</div>${t}</div>`;
}

const loadingView = () => loadingWrap(`<div class="kpi-3">${skKpi()}${skKpi()}${skKpi()}</div>${skRows(4)}`, 'Carregando investimentos');
const emptyView = () => emptyCard('trendUp', 'Nenhum investimento encontrado', 'Conecte uma instituição ou cadastre um investimento manualmente.', btn('Conectar instituição', { v: 'primary', href: '10-conexoes.html' }) + btn('Investimento manual', { attrs: 'data-open="dlg-manual"' }));

const dialogs = dlg('dlg-manual', {
  title: 'Investimento manual',
  body: `<div class="form-stack">${field('Nome', { placeholder: 'Ex.: Reserva em dólar' })}${select('Classe', ['Renda fixa', 'Renda variável', 'Previdência', 'Outros'], { value: 'Outros' })}${field('Instituição', { placeholder: 'Opcional' })}${field('Vencimento', { placeholder: 'dd/mm/aaaa', inputmode: 'numeric' })}<div class="form-grid">${field('Valor aplicado', { value: '0,00', inputmode: 'decimal' })}${field('Valor atual', { value: '0,00', inputmode: 'decimal' })}</div>${field('Observações', { placeholder: 'Opcional' })}</div>`,
  footer: `${btn('Cancelar', { v: 'ghost', attrs: 'data-close' })}${btn('Salvar', { v: 'primary', attrs: 'data-close data-toast="Investimento salvo."' })}`,
});

module.exports = { id: '06', slug: '06-investimentos', titulo: 'Investimentos', active: '06-investimentos', period: 'none', build: () => ({ views: { data: dataView(), loading: loadingView(), empty: emptyView(), error: errorState('Não foi possível carregar os investimentos.') }, dialogs }) };
