const fs = require('fs');
const path = require('path');
const H = require('./lib/h');
const { shell, loginShell, head, themeSwitch, logoMarca } = require('./lib/shell');

const out = path.join(__dirname, '..');
const ids = ['01-login', '02-dashboard', '03-transacoes', '04-contas', '05-cartoes', '06-investimentos', '07-orcamento', '08-recorrencias', '09-categorias', '10-conexoes', '11-importacao', '12-alertas', '13-relatorios', '14-configuracoes'];
const only = process.argv.slice(2);

const telas = [];
ids.forEach((id) => {
  if (only.length && !only.some((o) => id.startsWith(o))) {
    telas.push({ ...require(`./telas/${id}.js`), id });
    return;
  }
  const t = require(`./telas/${id}.js`);
  const b = t.build();
  const def = { ...t, ...b };
  const html = t.login ? loginShell(def) : shell(def);
  fs.writeFileSync(path.join(out, `${id}.html`), html);
  telas.push({ ...t, id });
  console.log('ok', id);
});

const desc = {
  '01-login': 'E-mail, senha, Google, 2FA e recuperação de senha',
  '02-dashboard': 'Saldo, receitas, despesas, gráficos e faturas',
  '03-transacoes': 'Tabela, filtros, lote, detalhe e nova transação',
  '04-contas': 'Saldo consolidado e contas por instituição',
  '05-cartoes': 'Faturas, limite, parcelas e projeção',
  '06-investimentos': 'Carteira, alocação, evolução e movimentações',
  '07-orcamento': 'Planejado x realizado e metas',
  '08-recorrencias': 'Detectadas, ativas e projeção de saldo',
  '09-categorias': 'Árvore, detalhe e regras automáticas',
  '10-conexoes': 'Instituições, consentimento e histórico',
  '11-importacao': 'Assistente OFX/CSV em 4 passos e lotes',
  '12-alertas': 'Central de alertas e preferências',
  '13-relatorios': 'Relatório mensal e exportações',
  '14-configuracoes': 'Perfil, aparência, segurança e dados',
};

const cards = telas
  .map((t) => {
    const n = t.id.slice(0, 2);
    const u = `${t.id}.html`;
    return `<li class="ix-card"><div class="ix-card__h"><span class="ix-card__n">${n}</span><div><h2 class="ix-card__t"><a href="${u}">${H.esc(t.titulo)}</a></h2><p class="muted small">${desc[t.id]}</p></div></div><div class="ix-links"><span class="ix-lab">Estado</span><a href="${u}">Dados</a><a href="${u}?estado=loading">Carregando</a><a href="${u}?estado=empty">Vazio</a><a href="${u}?estado=error">Erro</a></div><div class="ix-links"><span class="ix-lab">Tema</span><a href="${u}?tema=claro">Claro</a><a href="${u}?tema=escuro">Escuro</a></div><div class="ix-links"><span class="ix-lab">Moldura</span><a href="visualizar.html?pagina=${t.id}&largura=390">Celular 390</a><a href="visualizar.html?pagina=${t.id}&largura=768">Tablet 768</a><a href="visualizar.html?pagina=${t.id}&largura=1440">Desktop 1440</a></div></li>`;
  })
  .join('');

const index = `${head({ titulo: 'Índice dos mockups' })}
<body class="ix">
<a class="l-skip" href="#conteudo">Pular para o conteúdo</a>
<header class="ix-head"><div class="ix-brand">${logoMarca(40)}<div><h1>Painel Financeiro Pessoal</h1><p class="muted">Mockups navegáveis · Etapa 1.5 · dados fictícios · hoje fictício 05/10/2026 14:34</p></div></div><div class="ix-tema"><span class="muted small">Tema</span>${themeSwitch()}</div></header>
<main id="conteudo" class="ix-main" tabindex="-1"><p class="ix-note">Estáticos e isolados do app. As molduras abrem a tela em larguras de celular, tablet e desktop; os atalhos de estado e tema abrem a página diretamente. Dentro de cada tela, o botão de controles no canto inferior esquerdo troca estado e tema.</p><ul class="ix-grid">${cards}</ul></main>
<script src="assets/js/app.js" defer></script>
</body>
</html>
`;
fs.writeFileSync(path.join(out, 'index.html'), index);

const viewer = `${head({ titulo: 'Visualizador' })}
<body class="vz">
<header class="vz-bar"><a class="c-button c-button--ghost" href="index.html">${H.ic('chevL', 18)}<span>Índice</span></a><label class="vz-f"><span>Tela</span><select id="vz-pagina">${ids.map((i) => `<option value="${i}">${i.slice(0, 2)} · ${H.esc(telas.find((t) => t.id === i).titulo)}</option>`).join('')}</select></label><label class="vz-f"><span>Largura</span><select id="vz-largura"><option value="390">Celular 390 px</option><option value="768">Tablet 768 px</option><option value="1440">Desktop 1440 px</option></select></label><label class="vz-f"><span>Estado</span><select id="vz-estado"><option value="data">Dados</option><option value="loading">Carregando</option><option value="empty">Vazio</option><option value="error">Erro</option></select></label><label class="vz-f"><span>Tema</span><select id="vz-tema"><option value="claro">Claro</option><option value="escuro">Escuro</option><option value="sistema">Sistema</option></select></label></header>
<main id="conteudo" class="vz-main" tabindex="-1"><iframe id="vz-frame" title="Pré-visualização do mockup" class="vz-frame"></iframe></main>
<script src="assets/js/visualizar.js" defer></script>
</body>
</html>
`;
fs.writeFileSync(path.join(out, 'visualizar.html'), viewer);
console.log('index e visualizador gerados');
