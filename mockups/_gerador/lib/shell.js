const H = require('./h');
const { ic, esc, btn, iconBtn, dlg } = H;

const NAV = [
  { g: 'Visão geral', items: [['02-dashboard', 'Dashboard', 'chartCol']] },
  { g: 'Movimentação', items: [['03-transacoes', 'Transações', 'swap'], ['04-contas', 'Contas', 'landmark'], ['05-cartoes', 'Cartões', 'card'], ['06-investimentos', 'Investimentos', 'trendUp']] },
  { g: 'Planejamento', items: [['07-orcamento', 'Orçamento e metas', 'target'], ['08-recorrencias', 'Recorrências', 'repeat']] },
  { g: 'Organização', items: [['09-categorias', 'Categorias e regras', 'tag'], ['11-importacao', 'Importação', 'upload'], ['13-relatorios', 'Relatórios', 'fileText']] },
  { g: 'Sistema', items: [['10-conexoes', 'Conexões', 'link'], ['12-alertas', 'Alertas', 'bell', 3], ['14-configuracoes', 'Configurações', 'settings']] },
];

const BOTTOM = [['02-dashboard', 'Início', 'home'], ['03-transacoes', 'Transações', 'swap'], ['04-contas', 'Contas', 'landmark'], ['05-cartoes', 'Cartões', 'card']];

const logoMarca = (s = 32) => `<svg class="c-logo" viewBox="0 0 32 32" width="${s}" height="${s}" role="img" aria-label="Painel Financeiro"><rect width="32" height="32" rx="8" style="fill:var(--color-primary)"/><rect x="8" y="17" width="4" height="8" rx="1.5" style="fill:var(--color-primary-contrast)"/><rect x="14" y="12" width="4" height="13" rx="1.5" style="fill:var(--color-primary-contrast)"/><rect x="20" y="7" width="4" height="18" rx="1.5" style="fill:var(--color-primary-contrast)"/></svg>`;

function themeSwitch(cls = '') {
  const it = [['claro', 'Claro', 'sun'], ['escuro', 'Escuro', 'moon'], ['sistema', 'Sistema', 'monitor']];
  return `<div class="c-segmented c-theme-switch ${cls}" role="radiogroup" aria-label="Tema">${it.map(([v, l, i]) => `<button type="button" role="radio" aria-checked="false" data-tema-set="${v}">${ic(i, 16)}<span>${l}</span></button>`).join('')}</div>`;
}

function head(def, extra = '') {
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(def.titulo)} · Painel Financeiro (mockup)</title>
<meta name="theme-color" content="#F6F5F9" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0E0B16" media="(prefers-color-scheme: dark)">
<meta name="robots" content="noindex">
<link rel="stylesheet" href="assets/css/tokens.css">
<link rel="stylesheet" href="assets/css/componentes.css">
${extra}<script src="assets/js/tema.js"></script>
</head>`;
}

function mockPanel() {
  const est = [['data', 'Dados'], ['loading', 'Carregando'], ['empty', 'Vazio'], ['error', 'Erro']];
  return `<div class="mk" id="mk"><button type="button" class="mk__btn" aria-expanded="false" aria-controls="mk-panel" aria-label="Controles do mockup">${ic('sliders', 22)}</button><div class="mk__panel" id="mk-panel" hidden role="group" aria-label="Controles do mockup"><p class="mk__title">Controles do mockup</p><div class="mk__group"><span class="mk__label" id="mk-e">Estado da tela</span><div class="c-segmented c-segmented--wrap" role="radiogroup" aria-labelledby="mk-e">${est.map(([v, l]) => `<button type="button" role="radio" aria-checked="false" data-estado-set="${v}">${l}</button>`).join('')}</div></div><div class="mk__group"><span class="mk__label">Tema</span>${themeSwitch()}</div><a class="mk__link" href="index.html">${ic('chevL', 16)}Índice dos mockups</a></div></div>`;
}

function maisSheet(active) {
  const bottom = BOTTOM.map((b) => b[0]);
  const groups = NAV.map((g) => ({ g: g.g, items: g.items.filter((i) => !bottom.includes(i[0])) })).filter((g) => g.items.length);
  const body = `${groups.map((g) => `<div class="mais-group"><p class="mais-group__t">${g.g}</p><ul class="mais-list">${g.items.map(([id, l, i, b]) => `<li><a class="mais-item" href="${id}.html"${id === active ? ' aria-current="page"' : ''}>${ic(i, 20)}<span>${l}</span>${b ? `<span class="count">${b}</span>` : ''}</a></li>`).join('')}</ul></div>`).join('')}<div class="mais-group"><p class="mais-group__t">Preferências</p><div class="mais-pref">${H.sw2('Ocultar valores', false, { attrs: 'data-hide-toggle' })}</div><div class="mais-pref">${themeSwitch()}</div></div><a class="c-button c-button--secondary c-button--block" href="01-login.html">${ic('logout', 20)}<span>Sair</span></a>`;
  return dlg('dlg-mais', { title: 'Mais', body, variant: 'sheet' });
}

function periodBar(kind) {
  if (kind === 'full') return `<div class="d-period-bar"><button type="button" class="c-select-btn" aria-label="Tipo de período: Mensal" data-open="dlg-periodo"><span>Mensal</span>${ic('chevD', 16)}</button><div class="d-period-bar__nav">${iconBtn('chevL', 'Período anterior')}<span class="d-period-bar__label">Out/2026</span>${iconBtn('chevR', 'Próximo período')}</div><span class="d-period-bar__range">05/09 a 04/10</span></div>`;
  if (kind === 'month') return `<div class="d-period-bar d-period-bar--center">${iconBtn('chevL', 'Mês anterior')}<div class="d-period-bar__stack"><span class="d-period-bar__label">Out/2026</span><span class="d-period-bar__range">05/09 a 04/10</span></div>${iconBtn('chevR', 'Próximo mês')}</div>`;
  return '';
}

function periodDesktop() {
  return `<div class="d-period" role="group" aria-label="Período">${iconBtn('chevL', 'Período anterior', { cls: 'c-icon-button--sm' })}<span class="d-period__label">${ic('calendar', 16)}<span>Out/2026</span></span>${iconBtn('chevR', 'Próximo período', { cls: 'c-icon-button--sm' })}</div>`;
}

function shell(def) {
  const views = def.views;
  const nav = NAV.map((g) => `<p class="c-side-nav__group-label">${g.g}</p><ul class="c-side-nav__list">${g.items.map(([id, l, i, b]) => `<li><a class="c-side-nav__item" href="${id}.html" title="${l}"${id === def.active ? ' aria-current="page"' : ''}>${ic(i, 20)}<span class="c-side-nav__label">${l}</span>${b ? `<span class="count">${b}</span>` : ''}</a></li>`).join('')}</ul>`).join('');
  const bottom = BOTTOM.map(([id, l, i]) => `<a class="c-bottom-nav__item" href="${id}.html"${id === def.active ? ' aria-current="page"' : ''}><span class="c-bottom-nav__icon">${ic(i, 24)}</span><span>${l}</span></a>`).join('');
  const maisActive = !BOTTOM.some((b) => b[0] === def.active);
  const header = `<header class="l-shell__header"><h1 class="l-shell__title">${esc(def.titulo)}</h1><div class="l-shell__actions"><div class="only-l">${periodDesktop()}</div><a class="d-sync" data-status="ok" href="10-conexoes.html" aria-label="Sincronizado há 12 minutos. Abrir conexões">${ic('circleCheck', 18)}<span class="d-sync__s">12 min</span><span class="d-sync__l">Sincronizado há 12 min</span></a><button type="button" class="c-icon-button c-icon-button--secondary only-l-inline" aria-label="Sincronizar agora" data-sync-now>${ic('refresh', 20)}</button><button type="button" class="c-icon-button c-icon-button--ghost" aria-label="Ocultar valores" aria-pressed="false" data-hide-toggle>${ic('eye', 22, 'i-eye')}${ic('eyeOff', 22, 'i-eyeoff')}</button><a class="c-icon-button c-icon-button--ghost d-bell" href="12-alertas.html" aria-label="Alertas, 3 não lidos">${ic('bell', 22)}<span class="icon-count">3</span></a><div class="user only-l-inline"><button type="button" class="user__btn" aria-haspopup="true" aria-expanded="false" aria-controls="menu-user" aria-label="Menu do usuário"><span class="avatar" aria-hidden="true">RM</span>${ic('chevD', 16)}</button><div class="c-popover" id="menu-user" hidden><div class="c-popover__head"><strong>Rafael Moreira</strong><span>rafael.moreira@exemplo.com.br</span></div><div class="c-popover__sec">${H.sw2('Ocultar valores', false, { attrs: 'data-hide-toggle' })}</div><div class="c-popover__sec">${themeSwitch()}</div><a class="c-popover__item" href="14-configuracoes.html">${ic('settings', 18)}<span>Configurações</span></a><a class="c-popover__item" href="01-login.html">${ic('logout', 18)}<span>Sair</span></a></div></div></div></header>`;
  const fab = def.fab ? `<button type="button" class="c-fab" aria-label="Nova transação" data-open="${def.fab}">${ic('plus', 26)}</button>` : '';
  const viewHtml = ['data', 'loading', 'empty', 'error'].map((k) => `<div class="view" data-view="${k}"${k === 'loading' ? ' aria-busy="true"' : ''}>${views[k] || ''}</div>`).join('');
  return `${head(def)}
<body data-page="${def.id}">
<a class="l-skip" href="#conteudo">Pular para o conteúdo</a>
<div class="l-shell">
<nav class="l-shell__nav c-side-nav" aria-label="Principal"><a class="c-side-nav__brand" href="02-dashboard.html" aria-label="Painel Financeiro, ir ao Dashboard">${logoMarca(32)}<span class="c-side-nav__word">Painel Financeiro</span></a>${nav}</nav>
${header}
<main class="l-shell__main" id="conteudo" tabindex="-1">${periodBar(def.period)}<div class="l-page">${viewHtml}</div></main>
</div>
<nav class="c-bottom-nav" aria-label="Navegação inferior">${bottom}<button type="button" class="c-bottom-nav__item" data-open="dlg-mais"${maisActive ? ' aria-current="page"' : ''} aria-haspopup="dialog"><span class="c-bottom-nav__icon">${ic('menu', 24)}</span><span>Mais</span><span class="c-bottom-nav__badge">3</span></button></nav>
${fab}${maisSheet(def.active)}${def.dialogs || ''}${mockPanel()}<div class="c-toast" id="toast" role="status" aria-live="polite"></div>
<script src="assets/js/app.js" defer></script>
</body>
</html>
`;
}

function loginShell(def) {
  return `${head(def)}
<body data-page="${def.id}" class="login-body">
<a class="l-skip" href="#conteudo">Pular para o conteúdo</a>
<div class="login-top"><button type="button" class="c-button c-button--ghost" data-open="dlg-tema" aria-haspopup="dialog">${ic('sun', 18)}<span>Tema</span>${ic('chevD', 16)}</button></div>
<main class="login-main" id="conteudo" tabindex="-1"><div class="login-card">${['data', 'loading', 'empty', 'error'].map((k) => `<div class="view" data-view="${k}">${def.views[k] || def.views.data}</div>`).join('')}</div></main>
<p class="login-foot">© 2026 Painel Financeiro · Uso pessoal</p>
${def.dialogs}${dlg('dlg-tema', { title: 'Tema', body: themeSwitch(), variant: 'modal' })}${mockPanel()}<div class="c-toast" id="toast" role="status" aria-live="polite"></div>
<script src="assets/js/app.js" defer></script>
</body>
</html>
`;
}

module.exports = { shell, loginShell, head, themeSwitch, NAV, logoMarca };
