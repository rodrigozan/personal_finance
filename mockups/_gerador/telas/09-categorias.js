const H = require('../lib/h');
const { D, ic, m, brl, btn, banner, card, field, select, check, sw2, dlg, seg, tabs, badge, sk, skRows, loadingWrap, errorState, emptyCard, esc, sw, iconBtn } = H;

const arvore = [
  { c: D.cat.moradia, tipo: 'Despesa', n: 48, open: true, subs: ['Aluguel', 'Condomínio', 'Energia elétrica', 'Internet'] },
  { c: D.cat.alimentacao, tipo: 'Despesa', n: 312, open: true, sel: true, subs: ['Supermercado', 'Restaurantes', 'Delivery', 'Padaria'] },
  { c: D.cat.transporte, tipo: 'Despesa', n: 187, subs: [] },
  { c: D.cat.saude, tipo: 'Despesa', n: 64, subs: [] },
  { c: D.cat.lazer, tipo: 'Despesa', n: 96, subs: [] },
  { c: D.cat.educacao, tipo: 'Despesa', n: 24, subs: [] },
  { c: D.cat.assinaturas, tipo: 'Despesa', n: 71, subs: [] },
  { c: D.cat.compras, tipo: 'Despesa', n: 58, subs: [] },
  { c: D.cat.outros, tipo: 'Despesa', n: 43, subs: [], padrao: true },
  { c: D.cat.salario, tipo: 'Receita', n: 12, subs: [] },
  { c: D.cat.freelance, tipo: 'Receita', n: 9, subs: [] },
  { c: { nome: 'Rendimentos', icon: 'trendUp', cor: 6 }, tipo: 'Receita', n: 18, subs: [], padrao: true },
];

const regras = [
  { cond: 'Descrição contém UBER *TRIP', cat: D.cat.transporte, sub: 'Aplicativos', n: 42, on: true },
  { cond: 'Descrição contém IFOOD', cat: D.cat.alimentacao, sub: 'Delivery', n: 31, on: true },
  { cond: 'Descrição começa com SMART FIT', cat: D.cat.saude, sub: 'Academia', n: 6, on: true },
  { cond: 'Descrição contém NETFLIX ou SPOTIFY', cat: D.cat.assinaturas, sub: null, n: 12, on: true },
  { cond: 'Valor entre R$ 2.000,00 e R$ 2.200,00 em Itaú Corrente', cat: D.cat.moradia, sub: 'Aluguel', n: 6, on: true },
  { cond: 'Descrição contém POSTO', cat: D.cat.transporte, sub: 'Combustível', n: 38, on: false },
];

const catIcon = { home: 'home', utensils: 'utensils', car: 'car', heart: 'heart', gamepad: 'gamepad', grad: 'grad', play: 'play', bag: 'bag', tag: 'tag', briefcase: 'briefcase', trendUp: 'trendUp', swap: 'swap' };

function tree() {
  const rows = arvore
    .map((a) => {
      const head = `<li class="tr${a.sel ? ' tr--sel' : ''}"><button type="button" class="tr__btn" data-open="dlg-cat"${a.sel ? ' aria-current="true"' : ''}><span class="tr__chev">${ic(a.subs.length ? 'chevD' : 'chevR', 18)}</span>${sw(a.c.cor, 14)}${ic(catIcon[a.c.icon] || 'tag', 18, 'muted-i')}<span class="tr__n">${esc(a.c.nome)}${a.padrao ? badge('Padrão', 'neutral', null, { chip: true }) : ''}</span><span class="tr__t muted small">${a.tipo}</span><span class="tr__c muted small only-l">${a.n} transações</span></button>${iconBtn('dotsV', 'Ações de ' + a.c.nome, { cls: 'c-icon-button--sm tr__menu' })}</li>`;
      const subs = a.open ? a.subs.map((s) => `<li class="tr tr--sub"><button type="button" class="tr__btn" data-open="dlg-cat">${sw(a.c.cor, 10)}<span class="tr__n">${s}</span></button>${iconBtn('dotsV', 'Ações de ' + s, { cls: 'c-icon-button--sm tr__menu' })}</li>`).join('') : '';
      return head + subs;
    })
    .join('');
  return `<ul class="tree">${rows}</ul>`;
}

function detalhe() {
  const cores = Array.from({ length: 12 }, (_, i) => `<label class="swp"><input type="radio" name="cor${H.nid('c')}" ${i === 1 ? 'checked' : ''} class="u-visually-hidden"><span class="swp__c" style="background:var(--category-${i + 1})">${ic('check', 22)}</span><span class="u-visually-hidden">Cor ${i + 1}</span></label>`).join('');
  const nm = ['Azul', 'Verde-azulado', 'Laranja', 'Rosa', 'Ocre', 'Oliva', 'Ardósia', 'Ciano', 'Marrom', 'Vinho', 'Azul-marinho', 'Cinza'];
  const g = 'cor' + H.nid('g');
  const swatches = `<div class="swatches" role="radiogroup" aria-label="Cor da categoria">${nm.map((n, i) => `<label class="swp"><input type="radio" name="${g}" class="u-visually-hidden"${i === 1 ? ' checked' : ''}><span class="swp__c" style="background:var(--category-${i + 1})">${ic('check', 22)}</span><span class="u-visually-hidden">${n}</span></label>`).join('')}</div>`;
  const gi = 'ico' + H.nid('g');
  const icons = ['utensils', 'cart', 'home', 'car', 'heart', 'grad', 'plane', 'receipt'].map((n, i) => `<label class="icp"><input type="radio" name="${gi}" class="u-visually-hidden"${i === 0 ? ' checked' : ''}><span class="icp__c">${ic(n, 20)}</span><span class="u-visually-hidden">${n}</span></label>`).join('');
  return `<div class="form-stack">${field('Nome', { value: 'Alimentação' })}<div class="c-field"><span class="c-field__label">Tipo</span>${seg('Tipo', ['Despesa', 'Receita'], 0)}</div><div class="c-field"><span class="c-field__label">Cor</span>${swatches}</div><div class="c-field"><span class="c-field__label">Ícone</span><div class="icons" role="radiogroup" aria-label="Ícone">${icons}</div></div>${select('Categoria pai', ['Nenhuma (categoria principal)', 'Moradia'], { value: 'Nenhuma (categoria principal)' })}<p class="small muted">${ic('info', 16)} Mapeia da Pluggy: Food and Drinks</p><p class="small muted">Transações: <a class="c-link" href="03-transacoes.html">312 (ver transações)</a></p><dl class="kv kv--lines"><div><dt>Orçamento de out/2026</dt><dd>R$&nbsp;1.800,00</dd></div><div><dt>Realizado no mês</dt><dd>R$&nbsp;1.950,00</dd></div><div><dt>Subcategorias</dt><dd>4</dd></div><div><dt>Regras que apontam para ela</dt><dd>1</dd></div></dl></div>`;
}

function regraM(r) {
  return `<article class="regra${r.on ? '' : ' regra--off'}"><p class="regra__c">${esc(r.cond)}</p><p class="regra__d">${ic('arrowRight', 16)}${sw(r.cat.cor)}<span>${esc(r.cat.nome)}${r.sub ? ' › ' + r.sub : ''}</span></p><p class="muted small">Aplicada a ${r.n} transações</p><div class="regra__f">${sw2(r.on ? 'Ativa' : 'Inativa', r.on)}<div class="regra__o"><span class="muted small">Ordem</span>${iconBtn('chevU', 'Subir regra', { v: 'secondary' })}${iconBtn('chevD', 'Descer regra', { v: 'secondary' })}</div></div></article>`;
}

function regrasT() {
  const rows = regras.map((r, i) => `<tr class="${r.on ? '' : 'row-off'}"><td><span class="prio">${ic('grip', 20, 'muted-i')}<span class="tnum">${i + 1}</span>${iconBtn('chevU', 'Subir', { cls: 'c-icon-button--sm' })}${iconBtn('chevD', 'Descer', { cls: 'c-icon-button--sm' })}</span></td><td>${esc(r.cond)}</td><td><span class="cat-list__name">${sw(r.cat.cor)}<span>${esc(r.cat.nome)}${r.sub ? ' › ' + r.sub : ''}</span></span></td><td>${sw2(r.on ? 'Ativa' : 'Inativa', r.on)}</td><td class="num muted small">${r.n} transações</td><td>${btn('Aplicar retroativamente', { v: 'ghost', sm: true, attrs: 'data-open="dlg-retro"' })}</td><td class="col-menu">${iconBtn('dotsV', 'Ações da regra', { cls: 'c-icon-button--sm' })}</td></tr>`).join('');
  return `<div class="c-card c-card--flush c-card--table"><div class="c-table-wrap"><table class="c-table"><caption class="u-visually-hidden">Regras automáticas por prioridade</caption><thead><tr><th>Prioridade</th><th>Condição</th><th>Categoria de destino</th><th>Ativa</th><th class="num">Aplicada a</th><th>Ações</th><th class="col-menu"><span class="u-visually-hidden">Menu</span></th></tr></thead><tbody>${rows}</tbody></table></div></div>`;
}

const painelCat = () => `<div class="stack"><div class="only-s">${btn('Nova categoria', { v: 'secondary', icon: 'plus', block: true, attrs: 'data-open="dlg-nova-cat"' })}</div><div class="grid-7-5"><section class="c-card c-card--flush"><div class="tree-head only-l"><h2 class="c-card__title">Categorias</h2>${check('Mostrar arquivadas', false)}</div>${tree()}</section><section class="c-card only-l"><h2 class="c-card__title">Detalhe da categoria</h2>${detalhe()}<div class="det-foot">${btn('Arquivar', { v: 'danger-outline' })}${btn('Salvar', { v: 'primary', attrs: 'data-toast="Categoria salva."' })}</div></section></div></div>`;

const painelRegras = () => `<div class="stack"><div class="block__head"><h2 class="block__title">Regras automáticas</h2>${btn('Nova regra', { v: 'primary', icon: 'plus', sm: true, attrs: 'data-open="dlg-regra"' })}</div><p class="muted small only-s">Por prioridade: a primeira que combinar vence.</p>${banner('info', 'As regras são aplicadas por ordem de prioridade: a primeira que combinar define a categoria. Edições manuais nunca são sobrescritas.', { dismiss: true })}<div class="only-s stack">${regras.map(regraM).join('')}</div><div class="only-l">${regrasT()}</div></div>`;

const dataView = () => `<div class="stack"><div class="only-l self-end">${btn('Nova categoria', { v: 'primary', icon: 'plus', attrs: 'data-open="dlg-nova-cat"' })}</div>${tabs('cat', [{ label: 'Categorias', html: painelCat() }, { label: 'Regras', html: painelRegras() }], { equal: true, label: 'Categorias e regras' })}</div>`;

const loadingView = () => loadingWrap(`${skRows(8)}`, 'Carregando categorias');
const emptyView = () => emptyCard('tag', 'Nenhuma regra criada', 'Crie regras para categorizar automaticamente transações recorrentes.', btn('Nova regra', { v: 'primary', attrs: 'data-open="dlg-regra"' }));

const dialogs =
  dlg('dlg-cat', { title: 'Detalhe da categoria', variant: 'drawer', body: detalhe(), footer: `${btn('Arquivar', { v: 'danger-outline', cls: 'push-start' })}${btn('Salvar', { v: 'primary', attrs: 'data-close data-toast="Categoria salva."' })}` }) +
  dlg('dlg-nova-cat', { title: 'Nova categoria', body: `<div class="form-stack">${field('Nome', { placeholder: 'Ex.: Pets' })}${seg('Tipo', ['Despesa', 'Receita'], 0)}${select('Categoria pai', ['Nenhuma (categoria principal)', 'Moradia', 'Alimentação'], { value: 'Nenhuma (categoria principal)' })}</div>`, footer: `${btn('Cancelar', { v: 'ghost', attrs: 'data-close' })}${btn('Criar', { v: 'primary', attrs: 'data-close data-toast="Categoria criada."' })}` }) +
  dlg('dlg-regra', { title: 'Nova regra', body: `<div class="form-stack"><div class="form-grid">${select('Campo', ['Descrição', 'Valor', 'Conta'], { value: 'Descrição' })}${select('Operador', ['contém', 'começa com', 'é igual a'], { value: 'contém' })}</div>${field('Valor', { placeholder: 'Ex.: POSTO' })}${btn('Adicionar condição', { v: 'ghost', icon: 'plus' })}${select('Categoria de destino', ['Transporte', 'Alimentação', 'Saúde'], { value: 'Transporte' })}${check('Aplicar às transações existentes', true)}${banner('info', '142 transações serão afetadas.')}</div>`, footer: `${btn('Cancelar', { v: 'ghost', attrs: 'data-close' })}${btn('Criar regra', { v: 'primary', attrs: 'data-close data-toast="Regra criada."' })}` }) +
  dlg('dlg-retro', { title: 'Aplicar retroativamente', body: `<ul class="plain-list">${['UBER *TRIP · 04/10/2026', 'UBER *TRIP · 28/09/2026', 'UBER *TRIP · 21/09/2026', 'UBER *TRIP · 14/09/2026', 'UBER *TRIP · 07/09/2026'].map((x) => `<li>${x}</li>`).join('')}</ul><p><strong>42 transações</strong> serão atualizadas.</p>${banner('warning', 'Edições manuais não serão sobrescritas (3 ignoradas).')}`, footer: `${btn('Cancelar', { v: 'ghost', attrs: 'data-close' })}${btn('Aplicar', { v: 'primary', attrs: 'data-close data-toast="Regra aplicada. Desfazer disponível."' })}` });

module.exports = { id: '09', slug: '09-categorias', titulo: 'Categorias e regras', active: '09-categorias', period: 'none', build: () => ({ views: { data: dataView(), loading: loadingView(), empty: emptyView(), error: errorState('Não foi possível carregar as categorias.') }, dialogs }) };
