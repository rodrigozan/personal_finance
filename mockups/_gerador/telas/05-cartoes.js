const H = require('../lib/h');
const CH = require('../lib/charts');
const { D, ic, m, brl, pct, btn, banner, card, dlg, seg, tabs, badge, logo, sk, skRows, skChart, skKpi, skTable, loadingWrap, errorState, emptyCard, esc, progress, txList, txTable, dataTable, altTable, sw } = H;

const nu = D.cartoes[0];
const itc = D.cartoes[1];

const compras = nu.compras.map((c) => ({ d: `${c.d}/2026`, desc: c.desc, cat: c.cat, conta: `${nu.curto} •${nu.final}`, v: -c.v, chips: c.parcela ? [`parcela:${c.parcela}`] : [] }));

const meses = ['dez', 'jan', 'fev', 'mar', 'abr', 'mai'].map((l) => ({ l, v: 450 }));

function limite(c) {
  const ratio = c.usado / c.limite;
  return `${progress(ratio, ratio >= 0.8 ? 'warning' : 'primary', { lg: true, label: `Limite usado de ${c.nome}` })}<div class="lim"><strong>${pct(ratio * 100, 0)} usado</strong><span class="muted small">Disponível ${m(c.disponivel, { kind: '' })} de ${m(c.limite, { kind: '', dec: false })}</span></div>`;
}

function chip(c, sel) {
  return `<a class="card-chip" href="05-cartoes.html"${sel ? ' aria-current="true"' : ''}>${logo(c.inst, 28)}<span>${esc(c.curto)} •${c.final}</span></a>`;
}

function cardD(c, sel) {
  const urg = c.fechada.dias <= 3;
  return `<article class="cc${sel ? ' cc--sel' : ''}" aria-label="${esc(c.nome)}"><header class="cc__head">${logo(c.inst, 40)}<div><h3>${esc(c.nome)}</h3><p class="muted small">Mastercard · final ${c.final}</p></div></header><div class="cc__row"><span class="muted">Fatura aberta</span>${badge('Aberta', 'info', 'circleDot')}</div><p class="cc__v">${m(c.aberta.valor, { kind: '' })}</p><p class="muted small tnum">Fecha ${c.aberta.fecha.slice(0, 5)} · Vence ${c.aberta.venc.slice(0, 5)}</p><p class="cc__due">${urg ? badge('Fechada vence em 3 dias', 'warning', 'triAlert') : `${ic('calendarClock', 16)}`}<span class="muted small tnum">${urg ? '' : `Fechada vence em ${c.fechada.dias} dias · `}${c.fechada.venc.slice(0, 5)} · ${brl(c.fechada.valor)}</span></p>${limite(c)}</article>`;
}

function cardM() {
  return `<article class="cc cc--m" aria-label="${esc(nu.nome)}"><header class="cc__head">${logo(nu.inst, 32)}<div><h3>${esc(nu.nome)}</h3><p class="muted small">Final ${nu.final}</p></div>${badge('Aberta', 'info', 'circleDot')}</header><p class="muted">Fatura aberta</p><p class="cc__v">${m(nu.aberta.valor, { kind: '' })}</p><p class="cc__d muted small tnum">${ic('calendarClock', 16)}Fecha ${nu.aberta.fecha} · Vence ${nu.aberta.venc}</p><hr><div class="cc__row"><span class="muted">Fatura fechada</span><span class="cc__f">${m(nu.fechada.valor, { kind: '' })}</span></div><p class="cc__due">${badge('Vence em 3 dias', 'warning', 'triAlert')}<span class="muted small tnum">${nu.fechada.venc}</span></p><hr><p class="muted">Limite</p>${limite(nu)}<p class="muted small">Fecha dia 28 · Vence dia 8</p></article>`;
}

function totalCard() {
  const lim = D.cartoes.reduce((a, c) => a + c.limite, 0);
  const usado = D.cartoes.reduce((a, c) => a + c.usado, 0);
  return `<article class="cc cc--tot" aria-label="Todos os cartões"><h3>Todos os cartões</h3><p class="muted">Faturas a pagar</p><p class="cc__v">${m(D.faturasTotal, { kind: '' })}</p><p class="muted small">Fechadas + abertas dos 2 cartões</p>${progress(usado / lim, 'primary', { lg: true, label: 'Limite total usado' })}<div class="lim"><strong>${pct((usado / lim) * 100, 0)} do limite total</strong><span class="muted small">Disponível ${m(lim - usado, { kind: '' })}</span></div></article>`;
}

function panelAtual() {
  const resumo = [['Período', '29/09 a 28/10/2026'], ['Fecha em', '28/10/2026'], ['Vence em', '08/11/2026'], ['Total da fatura', m(nu.aberta.valor, { kind: '' })], ['Pagamento mínimo', m(nu.aberta.minimo, { kind: '' })]];
  return `<div class="stack"><div class="only-l stack">${card(`<dl class="resumo">${resumo.map((r, i) => `<div class="resumo__i${i === 3 ? ' resumo__i--big' : ''}"><dt>${r[0]}</dt><dd class="tnum">${r[1]}</dd></div>`).join('')}</dl>`)}${banner('warning', 'A fatura fechada de R$&nbsp;2.310,00 vence em 08/10/2026 (em 3 dias).', { action: btn('Ver fatura fechada', { v: 'secondary', sm: true }) })}</div>${banner('info', '<span class="only-s">Pagamento de fatura não é despesa.</span><span class="only-l">Pagamento de fatura não é despesa e não entra nos gastos do período.</span>', { dismiss: true })}<section aria-labelledby="cmp-t"><div class="block__head"><h3 class="block__title block__title--sm" id="cmp-t">Compras da fatura aberta</h3><span class="muted small">${compras.length} lançamentos</span></div><div class="only-s">${txList(compras, { open: 'dlg-parcela' })}</div><div class="only-l"><div class="c-card c-card--flush c-card--table">${txTable(compras, { open: 'dlg-parcela', caption: 'Compras da fatura aberta' })}</div></div></section></div>`;
}

function panelFaturas() {
  const row = (mes, v, st, extra = '') => `<li class="fl__i${st === 'Projetada' ? ' fl__i--proj' : ''}"><span class="fl__m">${mes}</span>${m(v, { kind: '' })}${st === 'Aberta' ? badge('Aberta', 'info', 'circleDot') : st === 'Projetada' ? badge('Projetada', 'neutral', 'calendarClock', { dashed: true }) : st === 'Paga' ? badge('Paga', 'ok', 'circleCheck') : badge('Fechada', 'neutral', 'lock')}${extra}</li>`;
  const grp = (t, items) => `<section class="fl"><h3 class="fl__t">${t}</h3><ul class="fl__l">${items}</ul></section>`;
  return `<div class="stack">${grp('Futuras', row('Dez/2026', 450, 'Projetada') + row('Nov/2026', 450 + 0, 'Projetada'))}${grp('Atual', row('Out/2026', nu.aberta.valor, 'Aberta'))}${grp('Fechadas', row('Set/2026', nu.fechada.valor, 'Fechada') + row('Ago/2026', 2268.4, 'Paga') + row('Jul/2026', 2105.15, 'Paga'))}</div>`;
}

function panelParcelas() {
  const mk = (W, H2, o) => CH.bars(W, H2, meses, { ...o, label: 'Barras da projeção de parcelas por mês' });
  const s = mk(326, 170, { left: 56, barW: 24, ticks: 2 });
  const l = mk(520, 190, { left: 60, barW: 40, ticks: 2 });
  return `<div class="stack">${card(`<div class="parc"><div class="parc__chart"><h3 class="block__title block__title--sm">Parcelas e projeção</h3><p class="muted">Total comprometido em parcelas futuras</p><p class="parc__v">${m(nu.futuras, { kind: '' })}</p><div class="chart"><div class="v-s">${s.svg}</div><div class="v-ml">${l.svg}</div></div><p class="legend-line"><span class="sw sw--hatch" aria-hidden="true"></span><span class="muted small">Projeção · parcelas 5/10 a 10/10</span></p></div><div class="parc__list"><h3 class="parc__h">Parcelas por compra</h3><div class="parc__r"><div><strong>Magazine Luiza *Notebook</strong><p class="muted small">Parcela 4/10 · 6 restantes</p></div><div class="parc__rv">${m(450, { kind: '' })}<span class="muted small">por mês</span></div></div><div class="parc__r parc__r--t"><strong>Total comprometido</strong>${m(nu.futuras, { kind: '' })}</div><p class="muted small">Última parcela em 08/05/2027.</p></div></div>${altTable('Projeção de parcelas por mês', ['Mês', 'Parcelas'], meses.map((x) => [x.l, m(x.v, { kind: '' })]))}`)}</div>`;
}

function panelConsol() {
  const rows = [{ n: `${nu.curto} •${nu.final}`, v: 3652.3, c: 'var(--chart-1)' }, { n: `${itc.curto} •${itc.final}`, v: 2192.52, c: 'var(--chart-2)' }];
  const max = rows[0].v;
  return `<div class="stack">${card(`<div class="c-card__header"><h3 class="block__title block__title--sm">Gasto por cartão no período</h3>${seg('Agrupar por', ['Cartão', 'Categoria', 'Período'], 0)}</div><ul class="hbars">${rows.map((r) => `<li><span class="hbars__n">${esc(r.n)}</span><span class="hbars__bar"><span style="width:${(r.v / max) * 100}%;background:${r.c}"></span></span>${m(r.v, { kind: '' })}</li>`).join('')}</ul>${altTable('Gasto por cartão', ['Cartão', 'Gasto no período'], rows.map((r) => [esc(r.n), m(r.v, { kind: '' })]))}`)}</div>`;
}

function dataView() {
  const t = tabs('cartoes', [{ label: 'Fatura atual', short: 'Atual', html: panelAtual() }, { label: 'Faturas', html: panelFaturas() }, { label: 'Parcelas e projeção', short: 'Parcelas', html: panelParcelas() }, { label: 'Consolidado', short: 'Consol.', html: panelConsol() }], { equal: true, label: 'Seções do cartão' });
  return `<div class="stack"><div class="only-s"><div class="chips-row">${chip(nu, true)}${chip(itc, false)}</div>${cardM()}</div><div class="only-l cards-row">${cardD(nu, true)}${cardD(itc, false)}${totalCard()}</div><h2 class="sel-title only-l">${esc(nu.nome)}</h2>${t}</div>`;
}

const loadingView = () => loadingWrap(`<div class="cards-row">${skKpi()}${skKpi()}${skKpi()}</div>${skTable(6)}`, 'Carregando cartões');
const emptyView = () => emptyCard('card', 'Nenhum cartão encontrado', 'As instituições conectadas ainda não disponibilizaram dados de cartão.', btn('Ir para Conexões', { v: 'primary', href: '10-conexoes.html' }));

const dialogs = dlg('dlg-parcela', {
  title: 'Magazine Luiza *Notebook',
  variant: 'drawer',
  sub: 'Compra em 12/07/2026 · 10 parcelas de R$&nbsp;450,00',
  body: `<dl class="kv"><div><dt>Total da compra</dt><dd>${m(4500, { kind: '' })}</dd></div><div><dt>Parcela atual</dt><dd>4/10</dd></div><div><dt>Pagas</dt><dd>3</dd></div><div><dt>Restantes</dt><dd>6</dd></div></dl><h3 class="drawer-h">Calendário de parcelas</h3><ul class="fl__l">${[['4/10', 'Out/2026', 'Fatura atual', 'info'], ['5/10', 'Nov/2026', 'Projetada', 'neutral'], ['6/10', 'Dez/2026', 'Projetada', 'neutral']].map((x) => `<li class="fl__i"><span class="fl__m">${x[0]} · ${x[1]}</span>${badge(x[2], x[3], x[3] === 'info' ? 'circleDot' : 'calendarClock', { dashed: x[2] === 'Projetada' })}</li>`).join('')}</ul>`,
  footer: `${btn('Fechar', { v: 'ghost', attrs: 'data-close' })}${btn('Ver transação original', { v: 'secondary', href: '03-transacoes.html' })}`,
});

module.exports = { id: '05', slug: '05-cartoes', titulo: 'Cartões', active: '05-cartoes', period: 'none', build: () => ({ views: { data: dataView(), loading: loadingView(), empty: emptyView(), error: errorState('Não foi possível carregar a fatura.', 'A lista de cartões continua disponível. Seus dados não foram alterados.') }, dialogs }) };
