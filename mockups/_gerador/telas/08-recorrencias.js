const H = require('../lib/h');
const CH = require('../lib/charts');
const { D, ic, m, brl, pct, btn, banner, card, field, select, dlg, seg, tabs, badge, catBadge, sk, skRows, skTable, loadingWrap, errorState, emptyCard, esc, altTable, dataTable, sw, iconBtn } = H;

const detectadas = [
  { nome: 'Disney+', v: 33.9, per: 'Mensal', ult: '28/09/2026', conf: 'Alta', cat: D.cat.assinaturas },
  { nome: 'Associação AABB (mensalidade)', v: 128.0, per: 'Mensal', ult: '02/10/2026', conf: 'Média', cat: D.cat.lazer },
  { nome: 'Estacionamento Park Center', v: 250.0, per: 'Mensal', ult: '01/10/2026', conf: 'Baixa', cat: D.cat.transporte },
];

const pagar = [
  { d: '07/10', desc: 'Curso de inglês', v: -480.0 },
  { d: '08/10', desc: 'Fatura Nubank', v: -2310.0 },
  { d: '10/10', desc: 'Aluguel · Imobiliária Central', v: -2100.0 },
  { d: '10/10', desc: 'Condomínio Edifício Aurora', v: -420.0 },
  { d: '10/10', desc: 'Fatura Itaú Mastercard', v: -1874.52 },
  { d: '12/10', desc: 'Internet Vivo Fibra', v: -129.9 },
  { d: '18/10', desc: 'Energia elétrica (estimada)', v: -150.1 },
  { d: '20/10', desc: 'Plano de saúde Unimed', v: -455.6 },
  { d: '30/10', desc: 'Smart Fit Mensalidade', v: -119.9 },
];
const totalPagar = pagar.reduce((a, p) => a + p.v, 0);
const saldoFim = D.saldoTotal + totalPagar;
const liq = 9800 - D.recMensal - 450 - 3800;
const proj = [{ l: 'hoje', v: D.saldoTotal }, { l: 'out', v: saldoFim }];
let acc = saldoFim + 9800 - D.recMensal - (D.cartoes[0].aberta.valor + D.cartoes[1].aberta.valor) - 3800;
proj.push({ l: 'nov', v: acc });
['dez', 'jan', 'fev', 'mar', 'abr'].forEach((x) => {
  acc += liq;
  proj.push({ l: x, v: acc });
});

const conf = (c) => (c === 'Alta' ? badge('Confiança alta', 'ok', 'circleCheck') : c === 'Média' ? badge('Confiança média', 'warning', 'triAlert') : badge('Confiança baixa', 'neutral', 'circle'));
const origem = (o) => (o === 'Manual' ? badge('Manual', 'info', 'penLine', { chip: true }) : badge('Detectada', 'info', 'sparkles', { chip: true }));

function det(d) {
  return `<article class="det"><div class="det__main"><h3 class="det__n">${ic('sparkles', 18, 'ic-info')}${esc(d.nome)}</h3><p class="muted small tnum det__u"><span class="only-l">Última ocorrência: ${d.ult}</span><span class="only-s">Última ${d.ult.slice(0, 5)}</span></p></div><div class="det__val"><strong>${m(-d.v, { kind: 'expense' })}</strong><span class="muted small">${d.per}</span></div><div class="det__cat">${catBadge(d.cat)}</div><div class="det__conf">${conf(d.conf)}</div><div class="det__act">${btn('Descartar', { v: 'ghost', attrs: 'data-open="dlg-descartar"' })}${btn('Editar', { v: 'secondary', attrs: 'data-open="dlg-rec"' })}${btn('Confirmar', { v: 'primary', attrs: 'data-toast="Recorrência confirmada."' })}</div></article>`;
}

const painelDet = () => `<div class="stack"><div class="det-intro"><h2 class="block__title">${ic('sparkles', 20, 'ic-info')}Detectadas a confirmar</h2><p class="muted small only-l">Encontramos padrões no seu histórico. Confirme para incluí-las na projeção.</p></div><div class="det-list">${detectadas.map(det).join('')}</div></div>`;

function painelAtivas() {
  const rows = D.recorrencias
    .map((r) => `<tr><td>${esc(r.desc)}</td><td class="num">${m(r.v, { kind: r.receita ? 'income' : 'expense', sign: r.receita ? 'plus' : 'auto' })}</td><td>${r.per}</td><td class="tnum">${r.prox}</td><td>${catBadge(r.cat)}</td><td>${origem(r.origem)}</td><td class="col-menu">${iconBtn('dotsV', 'Ações de ' + r.desc, { cls: 'c-icon-button--sm' })}</td></tr>`)
    .join('');
  const list = D.recorrencias
    .map((r) => `<li class="rec"><div class="rec__top"><span class="rec__d">${esc(r.desc)}</span>${m(r.v, { kind: r.receita ? 'income' : 'expense', sign: r.receita ? 'plus' : 'auto' })}</div><div class="rec__bot"><span class="muted small tnum">Próx. ${r.prox}</span><span class="rec__c muted small">${sw(r.cat.cor, 10)}${esc(r.cat.nome)}</span>${origem(r.origem)}</div></li>`)
    .join('');
  const tot = `<div class="totais"><div><p class="muted">Total mensal estimado<span class="only-l"> (despesas)</span></p><p class="totais__v">${m(-D.recMensal, { kind: 'expense' })}</p></div><div><p class="muted">Total anual estimado<span class="only-l"> (despesas)</span></p><p class="totais__v">${m(-D.recAnual, { kind: 'expense' })}</p></div><p class="muted small totais__n"><span class="only-s">Só despesas (o salário não entra no total).</span><span class="only-l">O salário recorrente não entra nos totais de despesa.</span></p></div>`;
  return `<div class="stack"><h2 class="block__title">Ativas</h2><div class="only-s"><ul class="c-card c-card--flush rec-list">${list}</ul></div><div class="only-l"><div class="c-card c-card--flush c-card--table"><div class="c-table-wrap"><table class="c-table"><caption class="u-visually-hidden">Recorrências ativas</caption><thead><tr><th>Descrição</th><th class="num">Valor</th><th>Periodicidade</th><th>Próxima data</th><th>Categoria</th><th>Origem</th><th class="col-menu"><span class="u-visually-hidden">Ações</span></th></tr></thead><tbody>${rows}</tbody></table></div></div></div>${card(tot, { cls: 'c-card--totais' })}</div>`;
}

function painelProj() {
  const lab = 'Linha da projeção de saldo; trecho tracejado é projeção';
  const pagarRows = pagar.map((p) => `<li><span class="muted tnum pg__d">${p.d}</span><span class="pg__n">${esc(p.desc)}</span>${m(p.v, { kind: 'expense' })}</li>`).join('');
  return `<div class="stack">${banner('info', 'Considera recorrências ativas, parcelas de cartão e gasto variável médio de R$&nbsp;3.800,00 por mês (últimos 3 meses). Em outubro, apenas os compromissos listados.', { title: 'Premissas da projeção' })}<div class="grid-7-5">${card(`<div class="c-card__header"><h3 class="block__title">Saldo previsto</h3>${seg('Horizonte', ['3 meses', '6 meses', '12 meses'], 1, { cls: 'seg-head' })}</div><p class="c-card__sum">Em 31/10/2026 o saldo previsto é ${brl(saldoFim)}, após as faturas e contas do mês.</p><div class="chart">${H.only(CH.line(326, 230, proj, { min: 10000, max: 30000, ticks: 4, left: 56, dashFrom: 1, label: lab }), CH.line(600, 300, proj, { min: 10000, max: 30000, ticks: 4, left: 64, dashFrom: 1, label: lab }))}</div>${altTable('Saldo previsto por mês', ['Mês', 'Saldo previsto'], proj.map((p) => [p.l, m(p.v, { kind: '' })]))}<p class="cap">Tracejado = projeção · Eixo não começa em zero · Atualizado há 12 min</p>`, { cls: 'c-card--chart' })}${card(`<h3 class="block__title">Contas a pagar em outubro</h3><ul class="pg">${pagarRows}</ul><p class="pg__t"><strong>Saldo previsto ao fim do mês</strong>${m(saldoFim, { kind: '' })}</p>`)}</div></div>`;
}

function dataView() {
  return `<div class="stack">${btn('Nova recorrência', { v: 'secondary', icon: 'plus', cls: 'self-end', attrs: 'data-open="dlg-rec"' })}${tabs('rec', [{ label: 'Detectadas (3)', html: painelDet() }, { label: 'Ativas', html: painelAtivas() }, { label: 'Projeção', html: painelProj() }], { equal: true, label: 'Recorrências' })}</div>`;
}

const loadingView = () => loadingWrap(`${skRows(5)}${skRows(4)}`, 'Carregando recorrências');
const emptyView = () => `<div class="stack">${emptyCard('sparkles', 'Nenhuma recorrência detectada', 'Precisamos de pelo menos 3 meses de histórico para detectar padrões.', '', { compact: true })}${emptyCard('repeat', 'Nenhuma recorrência ativa', 'Cadastre uma recorrência manualmente.', btn('Nova recorrência', { v: 'primary', attrs: 'data-open="dlg-rec"' }))}</div>`;

const dialogs =
  dlg('dlg-rec', { title: 'Nova recorrência', body: `<div class="form-stack">${field('Descrição', { placeholder: 'Ex.: Aluguel' })}${field('Valor estimado', { value: '0,00', inputmode: 'decimal' })}${seg('Periodicidade', ['Semanal', 'Mensal', 'Anual'], 1)}${field('Próxima data', { placeholder: 'dd/mm/aaaa', inputmode: 'numeric' })}${select('Categoria', ['Moradia', 'Saúde', 'Assinaturas'], { value: 'Moradia' })}</div>`, footer: `${btn('Cancelar', { v: 'ghost', attrs: 'data-close' })}${btn('Salvar', { v: 'primary', attrs: 'data-close data-toast="Recorrência salva."' })}` }) +
  dlg('dlg-descartar', { title: 'Descartar recorrência?', alert: true, body: '<p>O padrão detectado não será mais sugerido. Você pode cadastrá-lo manualmente depois.</p>', footer: `${btn('Cancelar', { v: 'ghost', attrs: 'data-close' })}${btn('Descartar', { v: 'danger', attrs: 'data-close data-toast="Recorrência descartada."' })}` });

module.exports = { id: '08', slug: '08-recorrencias', titulo: 'Recorrências', active: '08-recorrencias', period: 'none', build: () => ({ views: { data: dataView(), loading: loadingView(), empty: emptyView(), error: errorState('Não foi possível carregar as recorrências.') }, dialogs }) };
