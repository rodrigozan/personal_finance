# Guia de Gráficos — Painel Financeiro Pessoal

**Etapa:** 1.2 (Sprint 1) — Design visual e design system
**Agente:** UI Designer
**Data:** 05/10/2026
**Base:** `design-system.md` (cores, contraste, tipografia, `d-money`), `componentes.md`, `docs/design/ux/sistema-de-layout.md` seção 8.5 (gráficos acessíveis) e seção 12, `wireframes.md`
**Consumidor:** Frontend Developer (mockups de SVG estático na Etapa 1.3; biblioteca escolhida na Sprint 7, requisito L6)

Este guia define como os gráficos **parecem e se comportam**, independentemente da biblioteca. Exigências para qualquer biblioteca (L6): renderização em SVG com estilo por CSS variables (`fill: var(--chart-1)`), troca de tema sem recriar o gráfico, acesso por teclado e tabela alternativa.

---

## 1. Regras comuns

### 1.1 Estrutura do componente (`d-chart`)

```html
<figure class="d-chart" data-state="ready" aria-labelledby="g1-titulo" aria-describedby="g1-resumo">
  <header class="d-chart__header">
    <h2 class="d-chart__title" id="g1-titulo">Gastos por categoria</h2>
    <div class="c-segmented" role="radiogroup" aria-label="Exibir como">...</div>
  </header>
  <p class="d-chart__summary" id="g1-resumo">Moradia lidera com R$ 2.800,00 (31%) ...</p>
  <div class="d-chart__plot" role="img" aria-label="Rosca de gastos por categoria. Use a tabela para ver todos os valores.">...</div>
  <ul class="d-chart__legend">...</ul>
  <div class="d-chart__table" hidden>...</div>
  <figcaption class="d-chart__caption">Despesas de 05/09 a 04/10 · Atualizado há 12 min</figcaption>
</figure>
```

| Elemento | Regra |
|---|---|
| Contêiner | `c-card` (padding `--space-4`/`--space-6`), `figure` com `figcaption` |
| Título | `--type-h2`; um parágrafo de **resumo textual do insight** (`--type-caption`, `--color-text-muted`) logo abaixo; é o texto lido por leitores de tela |
| Alternância | `c-segmented` "Gráfico | Tabela" (padrão do Dashboard e das telas com gráfico); a tabela é equivalente completa, não resumo |
| Área do gráfico | `role="img"` com `aria-label` curto; o SVG interno é `aria-hidden` quando há tabela; teclado: ver 1.6 |
| Legenda | Lista com swatch + rótulo (+ valor e percentual quando couber); botões de 44 px no celular quando alternam séries |
| Legenda (rodapé) | `figcaption`: período e referência de dados |
| Estados | `data-state="loading|ready|empty|error"` com a mesma altura do gráfico final |

### 1.2 Alturas e margens

| Tipo | Celular (< 768) | md | lg e acima |
|---|---|---|---|
| Rosca | Diâmetro 176 px | 200 px | 240 px |
| Barras e linhas | Altura 220 px | 260 px | 300 px (320 px em `xl`) |
| Barra empilhada horizontal | Altura 24 px | 24 px | 28 px |
| Barras horizontais por categoria | 40 px por linha | 40 px | 36 px |
| Margens internas do SVG | Esquerda 44 px (eixo Y), direita 8 px, topo 12 px, base 28 px | Esq. 56 px | Esq. 64 px |

A largura é fluida (100% do cartão). Gráficos nunca ultrapassam a largura da coluna do grid.

### 1.3 Eixos, grade e rótulos

| Item | Regra |
|---|---|
| Fonte | Rótulos dos eixos `--text-xs` (12 px), peso 400, `--chart-axis`, números tabulares; rótulos de dados `--text-xs` peso 600, `--color-text` |
| Grade | Somente linhas horizontais, 1 px `--chart-grid`, 4 a 5 linhas; sem grade vertical |
| Linha de zero | 1 px `--color-border-strong` quando o eixo passa por zero (fluxo, resultado, saldo projetado) |
| Eixo X | Sem linha de eixo (a grade basta); rótulos curtos pt-BR: `out`, `nov` (mensal), `05/10` (diário), `2026` (anual); no celular mostram-se de dois em dois rótulos quando faltar espaço, nunca rotacionados |
| Eixo Y | Valores abreviados pt-BR compactos: `R$ 10 mil`, `R$ 1,2 mi`; sem casas decimais desnecessárias; começa em zero em gráficos de barras; em linhas de saldo/patrimônio pode começar acima de zero quando a variação seria invisível, com a indicação "Eixo não começa em zero" na legenda |
| Valores exatos | Sempre no tooltip e na tabela (`R$ 1.234,56`, nunca abreviados) |
| Rótulos diretos | Valor da última barra/ponto e dos extremos em linhas; fatias de rosca nomeadas na lista de apoio |
| Texto sobre formas | **Nunca** colocar texto sobre preenchimentos; rótulos ficam fora ou em lista (evita depender de contraste da série) |
| Ocultar valores | Eixo Y e rótulos de valor mostram `••••`; tooltips mostram `R$ ••••`; legendas mantêm percentuais (ver `design-system.md` 10.3, pendência P-UI-04) |

### 1.4 Cores, padrões e marcadores

| Item | Regra |
|---|---|
| Receita e despesa | `--chart-income` e `--chart-expense` (também em tabelas) |
| Categorias | Cor do índice da categoria (`--category-N`) |
| Outras séries | `--chart-1` a `--chart-8`, em ordem fixa, da maior para a menor |
| Saldo e patrimônio | `--chart-1` (linha) |
| Projeção | Mesma cor da série real, **tracejada** (`stroke-dasharray: 6 4`) em linhas e com **hachura diagonal** em barras; rótulo "Projeção" na legenda |
| Orçamento | Planejado: contorno (`--color-border-strong` 2 px, sem preenchimento); realizado: preenchido pela situação (sucesso, alerta, erro; ver `design-system.md` 4.3) |
| Marcadores de linha (séries adjacentes) | Série 1 círculo, série 2 quadrado, série 3 triângulo, série 4 losango; 8 px, contorno de 2 px `--color-surface` |
| Padrões de preenchimento (séries adjacentes em barras/áreas, impressão em tons de cinza, `forced-colors`) | Série 1 sólido; 2 hachura diagonal; 3 pontos; 4 linhas horizontais; 5 linhas verticais; 6 xadrez; 7 hachura inversa; 8 grade |
| Separador entre formas | 2 px de `--color-surface` entre fatias de rosca e entre segmentos empilhados |
| Estado "selecionado" | Contorno de 2 px `--color-text` na forma; as demais permanecem com opacidade total (não se reduz contraste) |
| Foco do teclado | Contorno de 2 px `--color-focus-ring` com offset de 2 px sobre a forma ou ponto |

Definições de padrão (SVG, `currentColor` herda a cor da série pela variável de estilo):

```html
<svg width="0" height="0" aria-hidden="true" focusable="false">
  <defs>
    <pattern id="p-diagonal" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="8" height="8" fill="var(--color-surface)"/>
      <rect width="3" height="8" fill="currentColor"/>
    </pattern>
    <pattern id="p-pontos" width="8" height="8" patternUnits="userSpaceOnUse">
      <rect width="8" height="8" fill="var(--color-surface)"/>
      <circle cx="4" cy="4" r="1.75" fill="currentColor"/>
    </pattern>
    <pattern id="p-horizontal" width="8" height="8" patternUnits="userSpaceOnUse">
      <rect width="8" height="8" fill="var(--color-surface)"/>
      <rect width="8" height="3" fill="currentColor"/>
    </pattern>
    <pattern id="p-vertical" width="8" height="8" patternUnits="userSpaceOnUse">
      <rect width="8" height="8" fill="var(--color-surface)"/>
      <rect width="3" height="8" fill="currentColor"/>
    </pattern>
    <pattern id="p-xadrez" width="8" height="8" patternUnits="userSpaceOnUse">
      <rect width="8" height="8" fill="var(--color-surface)"/>
      <rect width="4" height="4" fill="currentColor"/>
      <rect x="4" y="4" width="4" height="4" fill="currentColor"/>
    </pattern>
  </defs>
</svg>
```

### 1.5 Tooltip de gráfico (`d-chart__tooltip`)

| Aspecto | Valor |
|---|---|
| Aparência | `--color-surface-raised`, borda `--border-default`, raio `--radius-md`, `--elevation-raised`, padding `--space-2` `--space-3`, largura 200 a 280 px, `--z-popover`, `pointer-events: none` |
| Conteúdo | Título (rótulo do ponto: "outubro de 2026") em `--text-xs` `--color-text-muted`; linhas: swatch/marcador/padrão de 12 px + nome (`--text-sm`) + valor `d-money--sm` à direita; linha de resultado/total separada por filtro de 1 px |
| Disparo | Hover (desktop), toque (celular, fixa e some ao tocar fora ou em outro ponto), foco do teclado (setas) |
| Posição | Acima do ponto/forma quando houver espaço; senão abaixo; encosta nas bordas do cartão sem cortar; no celular fixada na parte superior do gráfico |
| Alvos de toque | Áreas invisíveis de no mínimo 44 px de largura por barra/ponto (a barra visual pode ser mais estreita) |
| Anúncio | Região `aria-live="polite"` (visualmente oculta) repete o texto do tooltip ao navegar por teclado |

```css
.d-chart__tooltip {
  position: absolute;
  z-index: var(--z-popover);
  min-width: 200px;
  max-width: 280px;
  padding: var(--space-2) var(--space-3);
  background: var(--color-surface-raised);
  border: var(--border-default);
  border-radius: var(--radius-md);
  box-shadow: var(--elevation-raised);
  font-size: var(--text-sm);
  line-height: var(--leading-sm);
  color: var(--color-text);
  pointer-events: none;
}

.d-chart__tooltip-title {
  font-size: var(--text-xs);
  line-height: var(--leading-xs);
  color: var(--color-text-muted);
  margin-block-end: var(--space-1);
}

.d-chart__tooltip-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}
```

### 1.6 Teclado e alternativa acessível

| Requisito | Implementação |
|---|---|
| Foco | Contêiner do gráfico com `tabindex="0"`, `role="group"`, `aria-label` com título e instrução "Use as setas para percorrer os pontos" |
| Navegação | Setas esquerda/direita percorrem categorias/pontos; Home/End vão ao primeiro/último; Enter em uma fatia ou barra navega ao drill-down (quando existir); `Esc` fecha o tooltip |
| Anúncio | "Out/2026: Entradas R$ 12.400,00, Saídas R$ 8.915,40, resultado R$ 3.484,60" via `aria-live="polite"` |
| Tabela alternativa | Equivalente completo, alternável por `c-segmented` "Gráfico | Tabela"; `<table>` real com `<caption>`, `<th scope>`, valores com `d-money`; alinhamento à direita dos números; sem rolagem horizontal (se larga, vira lista de pares rótulo e valor no celular) |
| Resumo textual | Parágrafo `d-chart__summary`, gerado a partir dos dados (maior, menor, tendência, total) |
| Cor | Nenhuma informação só por cor (legenda com marcador/padrão, rótulos, tabela) |
| Movimento | Nenhuma animação de entrada; com `prefers-reduced-motion` não há transições de tooltip |
| Contraste | Todas as cores categóricas >= 3:1 contra superfície e fundo nos dois temas (`design-system.md` seção 8) |
| Alto contraste forçado | Formas usam `CanvasText`/`Highlight` com padrões e marcadores preservados |

### 1.7 Estados padrão

| Estado | Visual |
|---|---|
| Carregando | Esqueleto da mesma altura; formas simplificadas conforme o tipo (anel cinza para rosca; 6 barras de alturas variadas; faixa ondulada para linha), `--color-skeleton-*`, `aria-busy="true"`; atraso de 150 ms |
| Vazio | Eixos esmaecidos opcionais; no lugar do gráfico, `c-state` compacto: ícone 32 px (`ChartColumn`, `ChartLine` ou `ChartPie`; nas versões antigas do lucide `BarChart3`, `LineChart`, `PieChart`), título "Sem dados no período", explicação e ação ("Alterar período", "Conectar instituição") |
| Erro | `c-state` de erro compacto, mensagem "Não foi possível carregar este gráfico. Seus dados não foram alterados.", "Tentar novamente"; os demais blocos da tela permanecem |
| Dado parcial | Gráfico visível + selo "Dados parciais" (`c-badge` warning) e nota explicando a lacuna |
| Recarga | Gráfico anterior com opacidade 0,6 e barra de progresso de 2 px no topo do cartão |

```css
.d-chart {
  display: grid;
  gap: var(--space-3);
  margin: 0;
}

.d-chart__header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}

.d-chart__summary {
  font-size: var(--type-caption-size);
  line-height: var(--type-caption-leading);
  color: var(--color-text-muted);
}

.d-chart__plot {
  position: relative;
  min-height: 220px;
}

.d-chart__plot svg {
  display: block;
  width: 100%;
  height: auto;
  overflow: visible;
}

.d-chart__legend {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2) var(--space-4);
  margin: 0;
  padding: 0;
  list-style: none;
}

.d-chart__legend-item {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  min-height: var(--touch-target);
  font-size: var(--text-sm);
  line-height: var(--leading-sm);
  color: var(--color-text);
}

.d-chart__swatch {
  width: 12px;
  height: 12px;
  border-radius: var(--radius-xs);
  background: var(--swatch-color, var(--chart-1));
  flex-shrink: 0;
}

.d-chart__caption {
  font-size: var(--text-xs);
  line-height: var(--leading-xs);
  color: var(--color-text-muted);
}

@media (min-width: 768px) {
  .d-chart__plot {
    min-height: 260px;
  }
}

@media (min-width: 1024px) {
  .d-chart__plot {
    min-height: 300px;
  }

  .d-chart__legend-item {
    min-height: 24px;
  }
}
```

---

## 2. Gastos por categoria (Dashboard, Cartões > Consolidado, Relatórios)

| Aspecto | Especificação |
|---|---|
| Pergunta | "Para onde foi meu dinheiro?" (RF-DSH-02) |
| Tipo | **Rosca** (anel de 38% de espessura relativa; raio interno de 62% do externo) + **lista ranqueada** que funciona como legenda, tabela e drill-down |
| Dados | Despesas do período por categoria (sem internas e ignoradas, RN-02); até 7 categorias; as menores (< 3% ou além da 7ª) agrupadas em "Outros" (`--category-12`) |
| Cor | Cor da categoria (`--category-N`); "Outros" `--category-12` |
| Centro da rosca | "Despesas" (`--type-caption`, muted) e total `d-money--lg`; oculto quando "Ocultar valores" (`R$ ••••`) |
| Separadores | 2 px `--color-surface` entre fatias; sem rótulo sobre as fatias |
| Lista ranqueada | Linha de 56 px (celular) / 44 px (desktop): swatch de 12 px, nome, valor `d-money--md`, percentual `--text-sm` tabular, `ChevronRight`; ordenada do maior para o menor; a linha inteira é um link de drill-down para Transações com categoria e período (CA-06) |
| Hover / foco | Fatia e linha da lista se realçam em conjunto (contorno 2 px `--color-text` na fatia; fundo `--color-row-hover` na linha); tooltip com nome, valor e percentual |
| Seleção | Clique/Enter na fatia ou na linha navega ao drill-down |
| Celular | Rosca de 176 px centralizada acima da lista; lista com as 5 primeiras + "Ver todas"; sem rolagem horizontal |
| Desktop | Cartão de 7 colunas: rosca de 240 px à esquerda e lista à direita (ou lista abaixo em `lg` estreito); "Ver todas" abre a tabela |
| Vazio | "Nenhuma despesa neste período." + "Alterar período" |
| Resumo textual | "Moradia lidera os gastos com R$ 2.800,00 (31%), seguida de Alimentação (22%) e Transporte (12%). Total de despesas: R$ 8.915,40." |
| Tabela alternativa | Colunas: Categoria, Valor, % do total, Variação vs. período anterior (com seta e texto); linha de total; ordenável |

---

## 3. Fluxo de caixa mensal (Dashboard, Relatórios)

| Aspecto | Especificação |
|---|---|
| Pergunta | "Quanto entrou e quanto saiu a cada mês?" (RF-DSH-03) |
| Tipo | **Barras agrupadas** por mês (entradas à esquerda, saídas à direita) + **linha opcional de saldo acumulado** no mesmo eixo |
| Dados | Entradas, saídas, resultado por mês; 6 meses por padrão, 12 sob demanda |
| Cores | Entradas `--chart-income`, saídas `--chart-expense`, saldo `--chart-1` |
| Diferença além da cor | Entradas e saídas com larguras iguais mas **ordem fixa** (entradas à esquerda); ícones `ArrowDownLeft` (entrada) e `ArrowUpRight` (saída) na legenda; saídas com hachura diagonal quando a impressão for em tons de cinza |
| Barras | Largura 16 px (celular), 20 px (desktop), `--space-1` entre as do par, `--space-4` entre grupos, cantos superiores `--radius-xs` |
| Rótulos | Valor abreviado sobre a barra do mês atual (desktop); demais só no tooltip |
| Linha de saldo | 2 px `--chart-1`, marcadores circulares de 8 px; eixo secundário somente se escala divergir muito (>= 5x), caso contrário o mesmo eixo |
| Mês corrente | Barras em tom normal com selo "em andamento" (hachura leve no topo) quando o período não terminou |
| Tooltip | Mês, Entradas, Saídas, Resultado (com sinal e cor financeira) e, se exibido, Saldo final |
| Celular | 6 meses visíveis sem rolagem; botão "Ver 12 meses" alterna para tabela ou rolagem horizontal interna contida (contêiner `role="region"`, `aria-label`, focável, com sombra de borda); alvo de 44 px por mês |
| Desktop | 12 meses visíveis, rótulos completos |
| Vazio | "Sem movimentações nos meses selecionados." |
| Resumo textual | "Em outubro entraram R$ 12.400,00 e saíram R$ 8.915,40, com resultado de R$ 3.484,60. O melhor mês do período foi agosto." |
| Tabela alternativa | Colunas: Mês, Entradas, Saídas, Resultado, Saldo final; resultado com sinal |

---

## 4. Evolução do saldo e do patrimônio (Dashboard, Contas, Investimentos)

| Aspecto | Especificação |
|---|---|
| Perguntas | "Como meu saldo/patrimônio evoluiu?" (RF-DSH-04, RF-CTA-04, RF-INV-05) |
| Tipo | **Linha com área suave** (gradiente de `--chart-1` a 18% de opacidade até transparente via `color-mix`) |
| Variantes | Saldo consolidado (Contas), histórico de uma conta (detalhe da conta), **patrimônio líquido** (Dashboard: contas + investimentos − faturas em aberto, RN-08) e valor total de investimentos (Investimentos) |
| Linha | 2 px `--chart-1`, junção arredondada; sem marcadores por padrão (marcador de 8 px no ponto ativo e no último) |
| Pontos de interesse | Rótulo direto do valor final (à direita da linha, `--text-xs` 600) e marcas de mínimo e máximo do período (pontos de 6 px com valor), omitidas no celular exceto o final |
| Patrimônio: composição | Opção "Ver composição" (`c-switch`) empilha contas (`--chart-1`), investimentos (`--chart-2`) e faturas (valor negativo, `--chart-3` com hachura diagonal) sobre a linha do total; legenda com marcadores |
| Seletor de intervalo | `c-segmented`: 30 dias, 90 dias, 1 ano, Tudo (contas); 3M, 6M, 1A, Tudo (investimentos); 44 px no celular |
| Eixo Y | 4 linhas de grade; começa em zero se o intervalo de variação for > 25% do valor, senão aproxima ao intervalo e mostra "Eixo não começa em zero" na legenda |
| Tooltip | Data (`dd/MM/aaaa`), valor total e, no patrimônio, a decomposição |
| Interação | Linha de mira vertical de 1 px `--color-border-strong` seguindo o ponteiro; no celular, toque e arraste horizontalmente com área de 44 px |
| Celular | Altura 220 px, sem rótulos de extremos, seletor de intervalo acima |
| Desktop | Altura 300 px, extremos rotulados |
| Sem histórico | Mensagem "O histórico começa a ser registrado a partir da próxima sincronização." no lugar do gráfico (sem eixos) |
| Resumo textual | "O patrimônio líquido subiu 4,2% em 12 meses, de R$ 156.100,00 a R$ 163.870,00. Menor valor: R$ 149.200,00 em 12/2025." |
| Tabela alternativa | Colunas: Data (um snapshot por sincronização, agregados por dia/semana/mês conforme o intervalo), Valor, Variação |

---

## 5. Alocação de investimentos (Investimentos)

| Aspecto | Especificação |
|---|---|
| Pergunta | "Onde está meu patrimônio investido?" (RF-INV-03) |
| Dimensões | Por classe (renda fixa, fundos, renda variável, previdência, outros) ou por instituição (alternável por `c-segmented`) |
| Tipo | **Desktop: rosca** de 240 px com lista ranqueada; **celular: barra empilhada horizontal 100%** (altura 24 px, separadores de 2 px) com lista abaixo (economiza altura e facilita a leitura) |
| Cores | `--chart-1` a `--chart-8` em ordem fixa por tamanho (identidade por classe/instituição não é fixa) |
| Padrões | A barra empilhada usa padrão diferente em segmentos adjacentes de tamanhos próximos (hachura diagonal, pontos) para independência de cor |
| Centro da rosca | "Total investido" e valor atual |
| Lista | Swatch (com padrão), nome, valor `d-money--md`, percentual, variação de rentabilidade com seta quando existir |
| Tooltip | Nome, valor, % do total, aplicado e rentabilidade |
| Vazio | "Nenhum investimento encontrado" + ações (conectar, cadastrar) |
| Resumo textual | "Renda fixa concentra 61% da carteira (R$ 70.200,00), seguida de fundos (18%) e renda variável (14%)." |
| Tabela alternativa | Classe, Valor atual, % da carteira, Aplicado, Rentabilidade |

---

## 6. Projeção de parcelas (Cartões > Parcelas e projeção)

| Aspecto | Especificação |
|---|---|
| Pergunta | "Quanto já comprometi nos próximos meses?" (RF-CAR-04) |
| Tipo | **Barras verticais** por mês (nov a abr...), uma barra por mês com o total comprometido; opcionalmente empilhadas por cartão |
| Cores | Total: `--chart-1`; empilhado por cartão: `--chart-1` a `--chart-n` com padrões diferentes por segmento |
| Projeção | Todas as barras representam valores futuros: preenchimento sólido (valores contratados são certos) com contorno tracejado de 1 px no topo e legenda "Parcelas contratadas"; só parcelas estimadas (recorrências) usam hachura diagonal e legenda "Estimado" |
| Rótulos | Valor abreviado sobre cada barra (celular: apenas a maior e a atual), mês no eixo; total comprometido em destaque acima do gráfico ("Total comprometido R$ 4.710,00", `d-money--lg`) |
| Interação | Clique/toque na barra expande o mês na tabela abaixo com a lista de compras (Notebook Dell 5/10, Geladeira 3/12...) |
| Tooltip | Mês, total, número de parcelas, principais compras |
| Celular | 6 meses com largura de barra 28 px; sem rolagem; "Ver tudo" abre a tabela |
| Desktop | 12 meses, tabela expansível ao lado ou abaixo |
| Vazio | "Nenhuma parcela futura encontrada." |
| Resumo textual | "As parcelas comprometem R$ 4.710,00 nos próximos 6 meses. O maior mês é novembro, com R$ 1.250,00." |
| Tabela alternativa | A própria tabela do mês (colunas: Mês, Total, Nº de parcelas) com linhas expansíveis (`aria-expanded`) para as compras |

---

## 7. Projeção de saldo e contas a pagar (Recorrências > Projeção)

| Aspecto | Especificação |
|---|---|
| Pergunta | "Como estará meu saldo nos próximos meses?" (RF-REC-03) |
| Tipo | **Linha** de saldo: trecho real (últimos 30 dias) sólido e trecho projetado **tracejado** (`stroke-dasharray: 6 4`), cor `--chart-1`, com faixa de projeção sombreada de forma sutil (`color-mix` 8%) |
| Eventos | Marcadores triangulares de 10 px nos dias de grandes saídas (aluguel, fatura) com rótulo na lista abaixo, não sobre o gráfico |
| Zero | Linha de zero de 1 px; área abaixo de zero preenchida com `--color-expense-bg` e legenda "Saldo negativo" com ícone `OctagonAlert` (informação não só por cor) |
| Horizonte | `c-segmented`: 3 meses, 6 meses, 12 meses |
| Lista "Contas a pagar" | Agrupada por mês: data, descrição, valor `d-money--md`, origem (Recorrência/Fatura/Parcela) com selo; "Saldo previsto ao fim do mês" em destaque |
| Tooltip | Data, saldo projetado, eventos do dia |
| Nota | `c-banner--info` "A projeção considera recorrências ativas e parcelas de cartão comprometidas." |
| Celular | Gráfico 220 px + lista cronológica |
| Desktop | Gráfico 300 px com lista ao lado (5/7 do grid) |
| Vazio | "Sem dados para projetar. Confirme recorrências ou conecte cartões." + ações |
| Resumo textual | "O saldo projetado fica entre R$ 38.400,00 e R$ 46.900,00 nos próximos 3 meses e não fica negativo." |
| Tabela alternativa | Data, Evento, Valor, Saldo após o evento |

---

## 8. Orçamento planejado x realizado (Orçamento e metas, Relatórios)

| Aspecto | Especificação |
|---|---|
| Pergunta | "Estou dentro do que planejei?" (RF-ORC-02) |
| Tipo principal | **Lista de `d-budget-bar`** por categoria (barra de progresso com marca de limite); é o formato padrão da tela de Orçamento |
| Tipo comparativo | **Barras horizontais agrupadas** (planejado e realizado) na seção "Comparativo" (desktop) e em Relatórios |
| Planejado | Barra de contorno (2 px `--color-border-strong`, sem preenchimento), com rótulo do valor planejado |
| Realizado | Barra preenchida: `--color-success` (< 90%), `--color-warning` com listras finas (90 a 100%), `--color-danger` com excedente hachurado (> 100%) |
| Rótulo da situação | Ícone (`CircleCheck`, `TriangleAlert`, `OctagonAlert`) + texto ("Excedido") + percentual ao final de cada linha |
| Ordenação | Maior excedente primeiro; categorias dentro do limite abaixo |
| Eixo | Eixo X compartilhado em valor (R$) com grade vertical leve apenas neste gráfico; categorias à esquerda (celular: acima da barra) |
| Resumo | Barra de resumo do mês: Planejado, Realizado, Restante e percentual (`c-progress--lg`) |
| Tooltip | Categoria, planejado, realizado, diferença (com sinal), percentual |
| Interação | Clique na categoria leva a Transações filtradas (categoria e mês); campo de planejado editável inline na tabela |
| Celular | Cartão por categoria (nome, situação, barra de 12 px, valores em duas linhas); sem gráfico comparativo agrupado |
| Desktop | Tabela com barra na linha + comparativo agrupado opcional |
| Vazio | "Você ainda não definiu um orçamento para este mês." + ações |
| Resumo textual | "7 de 9 categorias estão dentro do planejado. Alimentação excedeu em R$ 150,00 (108%) e Transporte está próximo do limite (92%)." |
| Tabela alternativa | Categoria, Planejado, Realizado, %, Situação (ícone e texto) |

---

## 9. Outros gráficos (reuso dos padrões)

| Gráfico | Tela | Padrão a reutilizar |
|---|---|---|
| Consolidado de cartões por cartão/categoria/período | Cartões > Consolidado | Barras horizontais ranqueadas (como seção 8, sem planejado), cores `--chart-N`/`--category-N`, drill-down por linha |
| Histórico de saldo da conta | Contas > detalhe | Linha e área (seção 4), seletor 30 dias, 90 dias, 1 ano, Tudo |
| Evolução do valor investido | Investimentos > Evolução | Linha e área (seção 4), seletor 3M, 6M, 1A, Tudo |
| Categorias e variação no relatório mensal | Relatórios | Rosca + lista (seção 2) e comparativo (seção 8); versão impressa em tema claro com padrões ativos |
| Meta de economia (progresso) | Orçamento > Metas | `c-progress--lg` com percentual e prazo (sem gráfico adicional) |

---

## 10. Impressão e exportação em PDF

- Sempre tema claro (`design-system.md` 13.1), fundo branco e sem animação.
- Padrões de preenchimento e marcadores **ativos** para que o documento seja legível em tons de cinza.
- Rosca e listas permanecem lado a lado; `break-inside: avoid` em cada `d-chart`.
- Tooltips e controles interativos (segmentos, seletores) não são impressos; a tabela alternativa **é impressa** abaixo do gráfico quando o espaço permitir (opção padrão do relatório).
- O período e a data de geração aparecem no topo; valores nunca mascarados (aviso prévio ao titular).

---

## 11. Lista de verificação para a Etapa 1.3 e a revisão 1.4

- [ ] Cada gráfico tem título, resumo textual, tabela alternativa e legenda com marcador/padrão.
- [ ] Nenhuma informação depende só da cor; séries adjacentes têm marcador ou padrão.
- [ ] Todas as cores categóricas vêm dos tokens `--chart-*`/`--category-*`/`--chart-income`/`--chart-expense` (nenhum hexadecimal).
- [ ] Tooltips aparecem em hover, toque e foco de teclado, e o conteúdo é anunciado.
- [ ] Alvos de toque de 44 px em barras, pontos e itens de legenda no celular.
- [ ] Estados carregando, vazio e erro mantêm a altura do gráfico.
- [ ] "Ocultar valores" mascara eixos, rótulos e tooltips.
- [ ] Os gráficos não ultrapassam a largura do contêiner no celular e não geram rolagem horizontal da página.
- [ ] Impressão em tema claro com padrões ativos.
