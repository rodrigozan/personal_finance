const H = require('../lib/h');
const { D, ic, m, brl, pct, btn, banner, card, field, dlg, seg, tabs, badge, sk, skRows, skKpi, skTable, loadingWrap, errorState, emptyCard, esc, progress, budgetBar, budgetSit, sw, dataTable } = H;

const metas = [
  { nome: 'Reserva de emergência', atual: 18000, alvo: 30000, prazo: '31/12/2027', meses: 15 },
  { nome: 'Viagem a Lisboa', atual: 6200, alvo: 12000, prazo: '30/06/2027', meses: 9 },
  { nome: 'Entrada do apartamento', atual: 41000, alvo: 120000, prazo: '31/12/2030', meses: 51 },
];

const realizado = D.despesas;
const planejado = D.planejadoTotal;
const restante = planejado - realizado;
const sitCls = (st) => (st === 'ok' ? 'ok' : st === 'warning' ? 'warn' : 'err');

function resumo() {
  return `<div class="only-s">${card(`<div class="sum2"><div><p class="muted small">Planejado</p><p class="med">${m(planejado, { kind: '' })}</p></div><div><p class="muted small">Realizado (${pct((realizado / planejado) * 100, 1)})</p><p class="med">${m(realizado, { kind: '' })}</p></div></div>${progress(realizado / planejado, 'warning', { lg: true, label: 'Orçamento realizado' })}<div class="row-sb"><span class="sit sit--warn">${ic('triAlert', 16)}Próximo do limite</span><strong>Restante ${m(restante, { kind: '' })}</strong></div><p class="muted small">3 de 9 categorias excedidas</p>${btn('Copiar mês anterior', { v: 'secondary', icon: 'copy', block: true, attrs: 'data-open="dlg-copiar"' })}`)}</div><div class="only-l">${card(`<dl class="resumo resumo--4">${[['Planejado', brl(planejado), ''], ['Realizado', brl(realizado), ''], ['Restante', brl(restante), ''], ['Percentual usado', pct((realizado / planejado) * 100, 1), ' sit--warn-t']].map((x) => `<div class="resumo__i"><dt>${x[0]}</dt><dd class="tnum${x[2]}">${x[2] ? x[1] : `<span class="money"><span class="money__v">${x[1]}</span></span>`}</dd></div>`).join('')}</dl>${progress(realizado / planejado, 'warning', { lg: true, mark: true, label: 'Orçamento realizado' })}<p class="sit sit--warn">${ic('triAlert', 16)}Próximo do limite · 3 de 9 categorias excedidas</p>`)}</div>`;
}

function catM(g) {
  const s = budgetSit(g);
  return `<article class="bcard"><header class="bcard__h"><span class="bcard__n">${sw(g.c.cor)}<strong>${esc(g.c.nome)}</strong></span><span class="tnum">${pct(s.r * 100, 0)}</span>${H.iconBtn('pencil', 'Editar planejado de ' + g.c.nome, { cls: 'c-icon-button--sm', attrs: 'data-open="dlg-plan"' })}</header><p class="sit sit--${sitCls(s.st)}">${ic(s.icon, 16)}${s.txt}</p>${budgetBar(s.r, 'Realizado de ' + g.c.nome)}<p class="muted small tnum">Realizado ${m(g.v, { kind: '' })} de ${m(g.plan, { kind: '' })}</p></article>`;
}

function catT() {
  const rows = D.gastosCat
    .map((g) => {
      const s = budgetSit(g);
      return `<tr><td><span class="cat-list__name">${sw(g.c.cor)}<span>${esc(g.c.nome)}</span></span></td><td class="num"><label class="u-visually-hidden" for="pl-${g.c.id}">Planejado para ${esc(g.c.nome)}</label><input class="c-field__input plan-in" id="pl-${g.c.id}" value="${brl(g.plan).replace('R$ ', 'R$ ')}" inputmode="decimal"></td><td class="num">${m(g.v, { kind: g.v > g.plan ? 'expense' : '', sign: 'none' })}</td><td class="num tnum">${pct(s.r * 100, 0)}</td><td><span class="sit-cell">${budgetBar(s.r, 'Realizado de ' + g.c.nome)}<span class="sit sit--${sitCls(s.st)}">${ic(s.icon, 16)}${s.txt}</span></span></td></tr>`;
    })
    .join('');
  return `<div class="c-card c-card--flush c-card--table"><div class="c-table-wrap"><table class="c-table"><caption class="u-visually-hidden">Orçamento por categoria</caption><thead><tr><th>Categoria</th><th class="num">Planejado</th><th class="num">Realizado</th><th class="num">% usado</th><th>Situação</th></tr></thead><tbody>${rows}</tbody><tfoot><tr><td><strong>Total</strong></td><td class="num">${m(planejado, { kind: '' })}</td><td class="num">${m(realizado, { kind: '' })}</td><td class="num tnum">${pct((realizado / planejado) * 100, 1)}</td><td></td></tr></tfoot></table></div></div>`;
}

const painelOrc = () => `<div class="stack">${resumo()}<div class="only-s stack">${D.gastosCat.map(catM).join('')}</div><div class="only-l">${catT()}</div></div>`;

function metaCard(mt) {
  const p = mt.atual / mt.alvo;
  return `<article class="meta"><header class="meta__h">${ic('target', 20, 'meta__i')}<h3>${esc(mt.nome)}</h3>${H.iconBtn('dotsV', 'Ações da meta ' + mt.nome, { cls: 'c-icon-button--sm' })}</header><div class="meta__v"><span class="tnum"><strong>${m(mt.atual, { kind: '', dec: false })}</strong> <span class="muted small">de ${m(mt.alvo, { kind: '', dec: false })}</span></span><strong class="tnum">${pct(p * 100, 0)}</strong></div>${progress(p, 'primary', { lg: true, label: 'Progresso da meta ' + mt.nome })}<p class="muted small tnum">Prazo ${mt.prazo} · Faltam ${m(mt.alvo - mt.atual, { kind: '', dec: false })}</p><p class="muted small tnum">Sugestão: ${m((mt.alvo - mt.atual) / mt.meses, { kind: '' })}/mês</p>${btn('Registrar aporte', { v: 'secondary', sm: true, attrs: 'data-open="dlg-aporte"' })}</article>`;
}

const painelMetas = () => `<div class="stack"><div class="block__head"><h2 class="block__title">Metas de economia</h2>${btn('Nova meta', { v: 'secondary', icon: 'plus', sm: true, attrs: 'data-open="dlg-meta"' })}</div><div class="metas">${metas.map(metaCard).join('')}</div></div>`;

function dataView() {
  return `<div class="stack"><div class="page-head only-l"><span class="muted tnum">Mês financeiro: 05/09 a 04/10/2026 (início no dia 5)</span>${btn('Copiar mês anterior', { v: 'secondary', icon: 'copy', attrs: 'data-open="dlg-copiar"' })}</div>${tabs('orc', [{ label: 'Orçamento', html: painelOrc() }, { label: 'Metas', html: painelMetas() }], { equal: true, label: 'Orçamento e metas' })}</div>`;
}

const loadingView = () => loadingWrap(`${skKpi()}${skRows(6)}`, 'Carregando orçamento');
const emptyView = () => emptyCard('target', 'Você ainda não definiu um orçamento para este mês.', 'Defina limites por categoria para acompanhar o planejado e o realizado.', btn('Definir orçamento', { v: 'primary', attrs: 'data-open="dlg-plan"' }) + btn('Copiar mês anterior', { attrs: 'data-open="dlg-copiar"' })) + `<div class="spacer"></div>${emptyCard('target', 'Nenhuma meta criada.', 'Crie metas de economia com prazo e valor-alvo.', btn('Criar meta', { v: 'secondary', attrs: 'data-open="dlg-meta"' }), { compact: true })}`;

const dialogs =
  dlg('dlg-copiar', {
    title: 'Copiar mês anterior',
    body: `${dataTable('Prévia da cópia', ['Categoria', 'Mês anterior → Este mês'], D.gastosCat.slice(0, 4).map((g) => [esc(g.c.nome), `${brl(g.plan)} → ${brl(g.plan)}`]))}<div class="spacer"></div>${banner('warning', 'Valores já definidos serão substituídos.')}`,
    footer: `${btn('Cancelar', { v: 'ghost', attrs: 'data-close' })}${btn('Copiar', { v: 'primary', attrs: 'data-close data-toast="Orçamento copiado do mês anterior."' })}`,
  }) +
  dlg('dlg-plan', { title: 'Editar planejado', body: `<div class="form-stack">${field('Planejado para Alimentação', { value: 'R$ 1.800,00', inputmode: 'decimal' })}</div>`, footer: `${btn('Cancelar', { v: 'ghost', attrs: 'data-close' })}${btn('Salvar', { v: 'primary', attrs: 'data-close data-toast="Planejado salvo."' })}`, variant: 'sheet' }) +
  dlg('dlg-meta', { title: 'Nova meta', body: `<div class="form-stack">${field('Nome da meta', { placeholder: 'Ex.: Reserva de emergência' })}<div class="form-grid">${field('Valor-alvo', { value: '0,00', inputmode: 'decimal' })}${field('Valor atual', { value: '0,00', inputmode: 'decimal' })}</div>${field('Prazo', { placeholder: 'dd/mm/aaaa', inputmode: 'numeric' })}<p class="note">${ic('info', 16)}<span>Economia mensal necessária: R$&nbsp;0,00</span></p></div>`, footer: `${btn('Cancelar', { v: 'ghost', attrs: 'data-close' })}${btn('Criar meta', { v: 'primary', attrs: 'data-close data-toast="Meta criada."' })}` }) +
  dlg('dlg-aporte', { title: 'Registrar aporte', body: `<div class="form-stack">${field('Valor do aporte', { value: '0,00', inputmode: 'decimal' })}${field('Data', { value: '05/10/2026', inputmode: 'numeric' })}</div>`, footer: `${btn('Cancelar', { v: 'ghost', attrs: 'data-close' })}${btn('Registrar', { v: 'primary', attrs: 'data-close data-toast="Aporte registrado."' })}` });

module.exports = { id: '07', slug: '07-orcamento', titulo: 'Orçamento e metas', active: '07-orcamento', period: 'month', build: () => ({ views: { data: dataView(), loading: loadingView(), empty: emptyView(), error: errorState('Não foi possível carregar o orçamento.', 'Valores digitados foram preservados e nada foi alterado.') }, dialogs }) };
