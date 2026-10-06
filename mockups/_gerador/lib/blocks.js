const H = require('./h');
const CH = require('./charts');
const { D, ic, m, brl, pct, esc, btn, seg, card, cardHead, sw, swCat, badge, logo, altTable } = H;

const v2 = (s, l) => `<div class="v-s">${s}</div><div class="v-l">${l}</div>`;
const v3 = (s, mid, l) => `<div class="v-s">${s}</div><div class="v-m">${mid}</div><div class="v-l">${l}</div>`;

function topCats() {
  const sorted = [...D.gastosCat].sort((a, b) => b.v - a.v);
  const top = sorted.slice(0, 5);
  const rest = sorted.slice(5);
  return { top, rest, restV: rest.reduce((a, r) => a + r.v, 0), all: sorted };
}

function donutBlock(size, th) {
  const { top, restV } = topCats();
  const slices = top.map((t) => ({ v: t.v, color: CH.catColors[t.c.cor] })).concat([{ v: restV, color: CH.catColors[11] }]);
  return CH.donut(size, th, slices, ['Despesas', brl(D.despesas, { dec: false })], 'Rosca de gastos por categoria. Use a tabela para ver todos os valores.');
}

function catList() {
  const { top, rest, restV } = topCats();
  const rows = top.map((t) => ({ nome: t.c.nome, v: t.v, c: t.c.cor })).concat([{ nome: `Demais (${rest.length})`, v: restV, c: 11 }]);
  return `<ul class="cat-list">${rows.map((r) => `<li class="cat-list__row"><span class="cat-list__name">${sw(r.c)}<span>${esc(r.nome)}</span></span><span class="cat-list__pct">${pct((r.v / D.despesas) * 100, 1)}</span>${m(r.v, { kind: '', sign: 'auto', cls: 'cat-list__v' })}</li>`).join('')}</ul>`;
}

function gastosCard() {
  const t0 = topCats().top[0];
  const resumo = `${t0.c.nome} lidera com ${brl(t0.v)} (${pct((t0.v / D.despesas) * 100, 0)} do total).`;
  const tabela = H.dataTable('Gastos por categoria', ['Categoria', '% do total', 'Valor'], topCats().all.map((g) => [`<span class="cat-list__name">${sw(g.c.cor)}<span>${esc(g.c.nome)}</span></span>`, pct((g.v / D.despesas) * 100, 1), m(g.v, { kind: '' })]));
  return card(
    `${cardHead('Gastos por categoria', seg('Exibir como', ['Gráfico', 'Tabela'], 0, { group: 'gastos', values: ['g', 't'] }))}<p class="c-card__sum">${resumo}</p><div data-seg-panel="gastos:g"><div class="gastos"><div class="gastos__plot">${v2(donutBlock(176, 26), donutBlock(200, 30))}</div><div class="gastos__list">${catList()}</div></div></div><div data-seg-panel="gastos:t" hidden>${tabela}</div><div class="c-card__foot"><span class="cap">Despesas de 05/09 a 04/10/2026 · Atualizado há 12 min</span>${btn('Ver todas', { v: 'ghost', sm: true, iconEnd: 'chevR', href: '03-transacoes.html', cls: 'only-l-inline' })}${btn('Ver todas as categorias', { v: 'secondary', block: true, href: '03-transacoes.html', cls: 'only-s' })}</div>`,
    { cls: 'c-card--chart' }
  );
}

function fluxoCard() {
  const r = D.fluxo[5];
  const data = D.fluxo.map((d, i) => ({ ...d, focus: i === 5 }));
  const lab = 'Barras de receitas e despesas dos últimos 6 meses';
  const tb = altTable('Fluxo de caixa dos últimos 6 meses', ['Mês', 'Receitas', 'Despesas'], D.fluxo.map((d) => [d.l, m(d.a, { kind: 'income', sign: 'auto' }), m(d.b, { kind: 'expense', sign: 'auto' })]));
  return card(
    `${cardHead('Fluxo de caixa', seg('Janela', ['6 meses', '12 meses'], 0, { cls: 'only-l' }))}<p class="c-card__sum">Em out/2026 entraram ${brl(r.a)} e saíram ${brl(r.b)}: resultado de ${brl(r.a - r.b, { sign: 'always' })}.</p><div class="chart">${v3(CH.flow(326, 220, data, { left: 52, barW: 18, label: lab }), CH.flow(640, 260, data, { left: 60, barW: 30, label: lab }), CH.flow(400, 264, data, { left: 58, barW: 20, label: lab }))}</div><ul class="legend"><li>${sw('var(--chart-income)')}Receitas</li><li>${sw('var(--chart-expense)')}Despesas</li></ul>${tb}<p class="cap">Últimos 6 meses · Atualizado há 12 min</p>`,
    { cls: 'c-card--chart' }
  );
}

function patrimonioCard() {
  const lab = 'Linha da evolução do patrimônio nos últimos 6 meses';
  const pts = D.patrimonioSerie;
  const o = { min: 60000, max: 90000, ticks: 3, endLabel: brl(D.patrimonio), label: lab };
  const grow = ((D.patrimonio - pts[0].v) / pts[0].v) * 100;
  const tb = altTable('Patrimônio líquido por mês', ['Mês', 'Patrimônio'], pts.map((p) => [p.l, m(p.v, { kind: '' })]));
  return card(
    `${cardHead('Evolução do patrimônio', seg('Período', ['3M', '6M', '1A', 'Tudo'], 1, { cls: 'seg-head' }))}<p class="c-card__sum">Patrimônio líquido de ${brl(D.patrimonio)} em out/2026, +${pct(grow, 1)} em 6 meses.</p><div class="chart">${v2(CH.line(326, 220, pts, { ...o, left: 56 }), CH.line(580, 232, pts, { ...o, left: 64 }))}</div>${tb}<p class="cap">Eixo não começa em zero. Patrimônio = contas + investimentos - faturas.</p>`,
    { cls: 'c-card--chart' }
  );
}

function faturasCard() {
  const [nu, it] = D.cartoes;
  const row = (c, urg) => `<li class="fat"><span class="fat__logo">${logo(c.inst, 36)}</span><div class="fat__body"><div class="fat__top"><span class="fat__n">${esc(c.curto)} •${c.final}</span>${m(c.fechada.valor, { kind: '' })}</div><div class="fat__sub">${urg ? badge(`Vence em ${c.fechada.dias} dias`, 'warning', 'triAlert') + `<time>${c.fechada.venc}</time>` : `${ic('calendarClock', 16)}<span>Vence em ${c.fechada.dias} dias · ${c.fechada.venc}</span>`}</div></div></li>`;
  return card(
    `${cardHead('Faturas a vencer', `<span class="cap-strong">${m(nu.fechada.valor + it.fechada.valor, { kind: '' })}</span>`)}<ul class="fat-list">${row(nu, true)}${row(it, false)}</ul>${btn('Ver cartões', { v: 'secondary', block: true, href: '05-cartoes.html' })}<div class="fat-open"><h3>Faturas abertas (ainda não fecharam)</h3><ul>${D.cartoes.map((c) => `<li><span>${esc(c.curto)} •${c.final} · fecha ${c.aberta.fecha.slice(0, 5)}</span>${m(c.aberta.valor, { kind: '' })}</li>`).join('')}</ul></div>`,
    { cls: 'c-card--faturas' }
  );
}

module.exports = { v2, v3, topCats, gastosCard, fluxoCard, patrimonioCard, faturasCard, catList };
