# Sistema de Layout — Painel Financeiro Pessoal

**Etapa:** 1.1 (Sprint 1) — Arquitetura de UX
**Agente:** UX Architect
**Data:** 05/10/2026
**Base:** URS v1.1 (RNF-USA-01 a 04, RF-CFG-01, RF-CFG-03), Plano seções 3.3 e 3.4
**Consumidores:** UI Designer (valores dos tokens, componentes), Frontend Developer (mockups e, depois, Next.js + Tailwind v4)

Este documento define estrutura, regras e nomenclatura. **Os valores finais de cor, tipografia, raio e sombra são definidos pelo UI Designer na Etapa 1.2**; aqui constam os nomes dos tokens, escalas estruturais (espaçamento, breakpoints, grid) e requisitos que os valores devem cumprir.

---

## 1. Princípios

| # | Princípio | Consequência |
|---|---|---|
| P1 | **Mobile first (requisito prioritário)** | O celular (320 px) é o desenho-base de toda tela e do CSS; `min-width` acrescenta recursos em telas maiores. O desktop é expansão, e o app deve funcionar bem em navegadores desktop (ver 2.1). Em wireframes, o celular vem primeiro |
| P2 | Tokens semânticos | Componentes usam `--color-surface`, nunca valores literais ou nomes de cor ("azul") |
| P3 | Uma fonte da verdade por tema | Componentes não têm variantes de tema; só os tokens mudam |
| P4 | Densidade de dados controlada | Telas financeiras são densas; hierarquia e espaço em branco asseguram leitura |
| P5 | Sem rolagem horizontal de página | Exceção apenas em contêineres de dados explicitamente rolláveis |
| P6 | Estados como cidadãos de primeira classe | Todo componente de dados define carregando, vazio e erro |
| P7 | Acessibilidade na base | Foco, rótulos, contraste e navegação por teclado fazem parte do componente, não de uma fase posterior |
| P9 | Toque e mouse como cidadãos de primeira classe | Alvos de 44 px no celular; hover, foco visível e menus de contexto no desktop |
| P8 | Mockups e app compartilham nomenclatura | Classes/atributos dos mockups (Etapa 1.3) mapeiam 1:1 para o app Next.js (Sprint 2) |

---

## 2. Breakpoints (mobile-first)

Alinhados aos padrões do Tailwind v4 para evitar tradução na Sprint 2.

| Nome | Largura mínima | Dispositivo típico | Shell | Colunas do conteúdo |
|---|---|---|---|---|
| base | 0 (alvo mínimo 320 px) | Celular retrato | Barra inferior + cabeçalho compacto | 4 |
| `sm` | 640 px | Celular grande / paisagem | Igual ao base; cartões podem lado a lado | 4 a 6 |
| `md` | 768 px | Tablet retrato | Trilho de ícones (72 px) em vez de barra inferior | 8 |
| `lg` | 1024 px | Notebook / tablet paisagem | Menu lateral expandido (256 px) | 12 |
| `xl` | 1280 px | Desktop | Conteúdo com largura máxima de 1280 px, centralizado | 12 |
| `2xl` | 1536 px | Monitor grande | Conteúdo com largura máxima de 1440 px, centralizado; margens laterais absorvem o excedente | 12 |

Regras:

- **Breakpoints de desktop declarados:** `lg` (>= 1024 px, desktop padrão e notebook), `xl` (>= 1280 px, desktop confortável) e `2xl` (>= 1536 px, monitor grande). `md` (768 a 1023 px) é a faixa de tablet.
- **Largura máxima do conteúdo:** fluido com margens de 32 px em `lg`; **1280 px** em `xl`; **1440 px** em `2xl`. Acima disso, as margens laterais crescem e o conteúdo permanece centralizado. O menu lateral fica fora dessa largura (o limite vale para a área de conteúdo). Tabelas e gráficos não se esticam além do máximo.
- Transições de layout ocorrem somente nos breakpoints acima; nenhum componente cria breakpoints próprios sem registro no UI Designer.
- Teste obrigatório nas larguras: 320, 375, 414, 768, 1024, 1280, 1440, 1536 e 1920 px, mais zoom de 200% e fonte do navegador ampliada (WCAG 1.4.4, 1.4.10).
- Orientação não é bloqueada; layouts funcionam em retrato e paisagem.
- Safe areas (`env(safe-area-inset-*)`) respeitadas na barra inferior, no cabeçalho e em folhas inferiores.

### 2.1 Declaração mobile first

Ordem de projeto e de implementação: celular (base) primeiro, depois `md`, depois `lg`, `xl` e `2xl`. Nenhuma funcionalidade existe só no desktop.

**Celular (desenho-base, 320 a 767 px)**

| Requisito | Regra |
|---|---|
| Alvos de toque | Mínimo **44 x 44 px** em todos os controles (botões, itens da barra inferior, linhas clicáveis, checkboxes com área ampliada, ícones); 8 px de espaço entre alvos adjacentes |
| Zona do polegar | Navegação principal na barra inferior; ação primária de criação em botão flutuante ou rodapé fixo no canto inferior (acima da barra); filtros, seleção em lote, seletores e confirmações em folhas inferiores; informações de leitura no terço superior; ações destrutivas exigem confirmação |
| Tabelas | Viram listas de cartões (`c-card-list`); sem rolagem horizontal da página (ver seção 7) |
| Formulários | Uma coluna; teclado adequado por campo (`inputmode`, `type`); campo focado não fica sob o teclado virtual |
| Gestos | Toda ação por gesto (puxar para atualizar, toque longo, deslizar) tem botão visível equivalente |
| Desempenho | Gráficos e blocos pesados carregam de forma tardia; esqueletos com geometria final |
| Rolagem | Vertical apenas; cabeçalho compacto encolhe ao rolar |

**Desktop (expansão, a partir de 1024 px)**

| Requisito | Regra |
|---|---|
| Uso do espaço | Menu lateral fixo (256 px); grid de 12 colunas; múltiplas colunas e cartões lado a lado; gráfico e tabela simultâneos; em Transações, lista e painel lateral de detalhe visíveis ao mesmo tempo |
| Tabelas | Tabelas densas com todas as colunas, cabeçalho fixo, ordenação por clique, seleção por checkbox e densidade configurável (confortável ou compacta) |
| Mouse | Estado de hover em linhas, cartões, botões e itens de menu; cursor correto; menu de contexto por linha (botão `⋮`); tooltips em ícones e textos truncados; clique em linha abre o detalhe; arrastar para reordenar com alternativa por botões |
| Foco | Anel de foco visível e consistente em todos os controles interativos (também operáveis só por teclado) |
| Painéis | Modais centrais em vez de folhas inferiores; painel de detalhe à direita sem cobrir a lista (em `lg` e acima) |
| Navegação | Menu lateral recolhível a trilho; cabeçalho completo com período, status de sincronização, alertas e menu do usuário |
| Largura | Conteúdo limitado a 1280 px (`xl`) ou 1440 px (`2xl`), centralizado |

Critério de aceite: cada tela funciona integralmente em 320 px e é melhor aproveitada em `lg`, `xl` e `2xl`, sem que o desktop seja apenas o celular esticado.

### 2.2 Comportamento do shell por breakpoint

| Elemento | base (< 768) | md (768-1023) | lg (>= 1024) |
|---|---|---|---|
| Navegação | Barra inferior 56 px + drawer "Mais" | Trilho 72 px; expande sobreposto | Lateral 256 px, recolhível a 72 px |
| Cabeçalho | Compacto: título, indicador reduzido, sino | Título, período, indicador completo, sino | Completo, com botão sincronizar e menu do usuário |
| Seletor de período | Linha fixa no topo do conteúdo | No cabeçalho | No cabeçalho |
| Painel de detalhe | Tela cheia deslizante | Painel lateral 420 px sobreposto | Painel lateral 480 px, lista visível |
| Modais | Folha inferior | Modal central | Modal central |
| Ação de criação principal | Botão flutuante (onde aplicável) | Botão no cabeçalho da página | Botão no cabeçalho da página |

---

## 3. Grid e estrutura de página

### 3.1 Estrutura do documento

```
<body>
  <a class="l-skip" href="#conteudo">Pular para o conteúdo</a>
  <div class="l-shell">
    <nav class="l-shell__nav" aria-label="Navegação principal">...</nav>
    <header class="l-shell__header">...</header>
    <main class="l-shell__main" id="conteudo" tabindex="-1">
      <div class="l-page">
        <div class="l-page__header">h1, ações, filtros</div>
        <div class="l-page__body">seções</div>
      </div>
    </main>
  </div>
  <div class="l-overlay-root"></div>
</body>
```

Landmarks: `nav` (principal), `header` (global), `main` (único), região de alertas `role="status"` e `role="alert"` para avisos dinâmicos, `footer` apenas em telas públicas se houver.

### 3.2 Grid de conteúdo

Grid de 12 colunas a partir de `lg`; 8 em `md`; 4 em `base`. Implementado com CSS Grid.

| Propriedade | base | md | lg e acima |
|---|---|---|---|
| Colunas | 4 | 8 | 12 |
| Gutter (`--grid-gap`) | 16 px | 16 px | 24 px |
| Margem lateral (`--page-gutter`) | 16 px | 24 px | 32 px |
| Largura máxima | 100% | 100% | fluido em `lg`; 1280 px em `xl`; 1440 px em `2xl` |

Esqueleto base do grid (valores finais de espaçamento vêm dos tokens da seção 5):

```css
.l-page {
  width: 100%;
  max-width: var(--container-xl);
  margin-inline: auto;
  padding-inline: var(--page-gutter);
  padding-block: var(--space-4) var(--space-8);
}

.l-grid {
  display: grid;
  grid-template-columns: repeat(var(--grid-cols), minmax(0, 1fr));
  gap: var(--grid-gap);
}

.l-grid > .l-col-full { grid-column: 1 / -1; }

@media (min-width: 768px) {
  .l-grid { --grid-cols: 8; }
}

@media (min-width: 1024px) {
  .l-grid { --grid-cols: 12; }
}
```

### 3.3 Padrões de composição

| Padrão | Uso | base | lg |
|---|---|---|---|
| Indicadores (KPI) | Dashboard, Investimentos, Orçamento | Pilha de 1 coluna (dois por linha para Receitas/Despesas) | 4 colunas de 3 |
| Gráfico + tabela | Gastos por categoria | Pilha; alternância "Gráfico / Tabela" | 7 colunas gráfico + 5 colunas apoio, ou lado a lado |
| Lista + detalhe | Transações, Categorias, Contas | Lista; detalhe em tela cheia | Lista 8 colunas + painel 4 colunas à direita |
| Cartões de entidade | Cartões, Contas, Conexões | 1 coluna | `repeat(auto-fill, minmax(280px, 1fr))` |
| Formulário | Configurações, modais | 1 coluna | 1 coluna (máx. 640 px) ou 2 colunas quando campos curtos |
| Assistente por passos | Importação, exclusão total | Pilha com passo atual em destaque | Indicador horizontal + corpo |
| Faixa de alerta | Dados desatualizados, conexão com erro | Abaixo do cabeçalho, largura total | Abaixo do cabeçalho, largura total |

### 3.4 Alturas e rolagem

- A página rola no `main`; menu lateral e cabeçalho ficam fixos (`position: sticky`).
- Painéis e modais rolam internamente; corpo da página não rola atrás de modal (`overflow: hidden` no `body` enquanto aberto).
- Cabeçalhos de tabela são `sticky` abaixo do cabeçalho global em listas longas.
- Altura mínima de conteúdo é calculada com `100dvh` (não `100vh`) para evitar saltos de barra de navegador no celular.

---

## 4. Estrutura de CSS e nomenclatura

### 4.1 Organização de arquivos

Mockups (Etapa 1.3), em `mockups/assets/`:

```
mockups/assets/
  css/
    tokens.css
    base.css
    layout.css
    componentes.css
    utilitarios.css
    telas.css
  js/
    tema.js
    navegacao.js
    estados.js
```

App Next.js (Sprint 2), em Tailwind v4:

```
app/
  globals.css
components/
  ui/
  layout/
  domain/
```

Mapeamento mockup para app:

| Mockup | App Next.js |
|---|---|
| `tokens.css` | Bloco `@theme` e variáveis de tema em `app/globals.css` |
| `base.css` | `@layer base` em `app/globals.css` |
| `layout.css` | Componentes de `components/layout/` com utilitários Tailwind equivalentes |
| `componentes.css` | Componentes de `components/ui/` e `components/domain/` |
| `tema.js` | Script inline anti-flash + componente cliente de tema |
| `estados.js` | Somente mockup (alternância de estado fictícia) |

Observação para o Frontend Developer da Sprint 2: o projeto usa uma versão do Next.js com mudanças relevantes; ler o guia em `node_modules/next/dist/docs/` antes de implementar (AGENTS.md).

### 4.2 Ordem de camadas

`tokens` > `base` (reset, tipografia de elementos) > `layout` > `componentes` > `utilitários`. Utilitários têm a maior precedência e são poucos e semânticos (`u-visually-hidden`, `u-text-right`, `u-tabular`).

### 4.3 Convenção de nomes

Metodologia: BEM com prefixos de camada.

| Prefixo | Camada | Exemplo |
|---|---|---|
| `l-` | Layout | `l-shell`, `l-page`, `l-grid`, `l-stack`, `l-cluster` |
| `c-` | Componente de UI | `c-button`, `c-field`, `c-table`, `c-badge` |
| `d-` | Componente de domínio financeiro | `d-kpi`, `d-money`, `d-bill-card`, `d-sync-status` |
| `u-` | Utilitário | `u-visually-hidden`, `u-tabular` |
| `is-` / `has-` | Estado transitório de JS | `is-open`, `is-loading`, `has-error` |

Formato: `bloco__elemento--modificador`. Exemplos: `c-button--primary`, `c-table__cell--numeric`, `d-kpi__value`.

Atributos de dados (preferidos a classes para estado e tema, por serem acessíveis a CSS e a testes):

| Atributo | Valores | Uso |
|---|---|---|
| `data-theme` | `light`, `dark` (ausente = sistema) | Elemento `html` |
| `data-state` | `loading`, `empty`, `error`, `ready` | Bloco de dados |
| `data-variant` | Específico por componente | Variação visual |
| `data-density` | `comfortable`, `compact` | Tabelas |
| `data-status` | `ok`, `info`, `warning`, `error`, `neutral` | Badge e faixas de status |
| `data-sign` | `positive`, `negative`, `neutral` | `d-money` |

Regras:

- Máximo 2 níveis de elemento: `bloco__elemento`, nunca `bloco__elemento__subelemento`.
- Sem seletores de ID para estilo. Sem `!important`, exceto utilitário `u-visually-hidden` justificado.
- Sem valores literais (cor, espaçamento, tamanho de fonte) em componentes; apenas tokens.
- Sem comentários no código (decisão do projeto); a intenção é comunicada pelo nome.

### 4.4 Catálogo de componentes (contrato UX para o UI Designer)

| Componente | Classe | Variantes e estados exigidos | Telas |
|---|---|---|---|
| Shell | `l-shell` | nav expandida, recolhida, trilho; barra inferior | Todas autenticadas |
| Cabeçalho global | `l-shell__header` | com/sem seletor de período | Todas autenticadas |
| Status de sincronização | `d-sync-status` | atualizado, sincronizando, desatualizado, atenção, erro, sem conexões, sem rede | Cabeçalho, Conexões |
| Sino de alertas | `d-bell` | zero, com contador, popover | Cabeçalho |
| Seletor de período | `d-period-picker` | mês, trimestre, ano, personalizado | Dashboard, Transações, Orçamento, Relatórios |
| Botão | `c-button` | primary, secondary, ghost, danger, icon; loading, disabled | Todas |
| Campo de texto | `c-field` | rótulo, ajuda, erro, desabilitado, somente leitura | Formulários |
| Campo de valor BRL | `c-field--money` | máscara pt-BR, sinal | Formulários |
| Select / combobox | `c-select`, `c-combobox` | busca, hierarquia (categoria > sub) | Filtros, categorização |
| Checkbox, radio, interruptor | `c-checkbox`, `c-radio`, `c-switch` | indeterminado (seleção parcial em lote) | Várias |
| Controle segmentado | `c-segmented` | 2 a 5 opções | Tipo de transação |
| Abas | `c-tabs` | rolável no celular | Cartões, Investimentos etc. |
| Tabela | `c-table` | densidade, seleção, ordenação, sticky, responsiva | Transações, Investimentos etc. |
| Lista de cartões (versão celular da tabela) | `c-card-list` | agrupada por dia | Transações |
| Cartão de indicador | `d-kpi` | variação positiva/negativa/neutra; carregando | Dashboard |
| Valor monetário | `d-money` | positivo, negativo, neutro, oculto (privacidade, ver 9.5) | Todas |
| Barra de progresso/orçamento | `c-progress`, `d-budget-bar` | dentro, próximo, excedido (com texto) | Orçamento, Cartões |
| Badge de status | `c-badge` | ok, info, warning, error, neutral; com ícone | Conexões, faturas, transações |
| Selo de tipo de transação | `c-chip` | Interna, Ignorada, Manual, Pendente, Dividida, Parcela | Transações |
| Tag removível | `c-tag` | com/sem remoção | Transações |
| Card de entidade | `d-account-card`, `d-card-card` (cartão de crédito), `d-connection-card` | estados de status | Contas, Cartões, Conexões |
| Gráfico | `d-chart` | com tabela alternativa e descrição | Dashboard, Cartões, Investimentos |
| Modal | `c-modal` | central, folha inferior, passos | Várias |
| Painel lateral | `c-drawer` | direita, tela cheia no celular | Detalhe |
| Popover | `c-popover` | ancorado, folha inferior no celular | Status, alertas |
| Toast | `c-toast` | sucesso, erro, informação; com ação | Global |
| Faixa de aviso | `c-banner` | info, warning, error; descartável ou persistente | Dashboard, Conexões |
| Estado de bloco | `c-state` | loading (esqueleto), empty, error | Todos os blocos |
| Upload | `c-dropzone` | vazio, arrastando, com arquivo, erro | Importação |
| Stepper | `c-stepper` | passo atual, concluído, bloqueado | Importação, exclusão total |
| Paginação | `c-pagination` | numérica, anterior/próxima | Transações, histórico |
| Seletor de tema | `c-theme-switch` | claro, escuro, sistema | Cabeçalho, drawer, Configurações |
| Zona de perigo | `c-danger-zone` | com ação destrutiva isolada | Configurações |

---

## 5. Escala de espaçamento e tokens estruturais

### 5.1 Espaçamento (grade de 4 px)

| Token | Valor | Uso típico |
|---|---|---|
| `--space-0` | 0 | Reset |
| `--space-1` | 4 px | Espaço entre ícone e texto |
| `--space-2` | 8 px | Espaço entre elementos relacionados |
| `--space-3` | 12 px | Padding de chip e campo compacto |
| `--space-4` | 16 px | Padding padrão de cartão, gutter mobile |
| `--space-5` | 20 px | |
| `--space-6` | 24 px | Padding de cartão em desktop, gutter de grid |
| `--space-8` | 32 px | Entre seções |
| `--space-10` | 40 px | |
| `--space-12` | 48 px | Entre blocos de página |
| `--space-16` | 64 px | Respiro de estados vazios |

Regras de uso:

| Contexto | Espaço |
|---|---|
| Entre rótulo e campo | `--space-1` a `--space-2` |
| Entre campos de formulário | `--space-4` |
| Padding interno de cartão | `--space-4` (base) / `--space-6` (lg) |
| Entre cartões em grade | `--grid-gap` |
| Entre seções de página | `--space-8` |
| Linha de tabela (altura mínima) | 48 px (confortável), 40 px (compacta) |
| Alvo de toque mínimo | 44 x 44 px (WCAG 2.5.5; 24 px mínimo absoluto em 2.5.8) |

### 5.2 Outros tokens estruturais

| Grupo | Tokens | Observação |
|---|---|---|
| Contêineres | `--container-sm` 640 px, `--container-md` 768 px, `--container-lg` 1024 px, `--container-xl` 1280 px, `--container-2xl` 1440 px | |
| Shell | `--nav-width` 256 px, `--nav-width-collapsed` 72 px, `--header-height` 56 px (base) / 64 px (lg), `--bottom-nav-height` 56 px | |
| Painéis | `--drawer-width` 480 px, `--modal-width-sm` 480 px, `--modal-width-md` 640 px | |
| Camadas (z-index) | `--z-sticky` 10, `--z-nav` 20, `--z-popover` 30, `--z-drawer` 40, `--z-modal` 50, `--z-toast` 60 | |
| Movimento | `--motion-fast` 120 ms, `--motion-base` 200 ms, `--motion-slow` 320 ms; `--ease-standard` | Reduzidos a 0 em `prefers-reduced-motion` |
| Raio, sombra, bordas | Definidos pelo UI Designer (`--radius-*`, `--shadow-*`, `--border-*`) | |
| Tipografia | Definida pelo UI Designer (`--font-*`, `--text-*`, `--leading-*`, `--weight-*`) | Exigência: números tabulares |

### 5.3 Tokens semânticos de cor (nomes; valores do UI Designer)

| Grupo | Tokens |
|---|---|
| Superfícies | `--color-bg`, `--color-surface`, `--color-surface-raised`, `--color-surface-sunken`, `--color-overlay` |
| Texto | `--color-text`, `--color-text-muted`, `--color-text-inverse`, `--color-text-link` |
| Bordas | `--color-border`, `--color-border-strong`, `--color-focus-ring` |
| Marca/ação | `--color-primary`, `--color-primary-hover`, `--color-primary-contrast` |
| Financeiros | `--color-income`, `--color-expense`, `--color-internal`, `--color-neutral-value` |
| Status | `--color-success`, `--color-info`, `--color-warning`, `--color-danger` (e variantes `-bg`, `-border`, `-text`) |
| Gráficos | `--chart-1` a `--chart-8` e `--chart-grid`, `--chart-axis` |
| Estados | `--color-skeleton-base`, `--color-skeleton-shine`, `--color-disabled-bg`, `--color-disabled-text` |

Requisitos para o UI Designer: cada par texto/fundo e cada componente interativo atende WCAG 2.1 AA nos dois temas (texto normal 4,5:1; texto grande 3:1; elementos de interface e gráficos 3:1); cores financeiras nunca são o único canal de informação (ver seção 8).

---

## 6. Tema claro, escuro e sistema

### 6.1 Modelo

| Preferência | Comportamento | Atributo no `html` |
|---|---|---|
| Claro | Força tema claro | `data-theme="light"` |
| Escuro | Força tema escuro | `data-theme="dark"` |
| Sistema (padrão) | Acompanha `prefers-color-scheme`, inclusive mudanças em tempo real | Atributo ausente |

Persistência (RF-CFG-03): a preferência é salva em `profiles.tema` quando houver sessão e em `localStorage` (chave `tema`) para aplicar antes do carregamento da sessão e na tela de Login. Na ausência de ambos, vale Sistema.

### 6.2 Mecanismo CSS

Os componentes usam apenas tokens semânticos; apenas três blocos trocam seus valores:

```css
:root {
  color-scheme: light dark;
}

:root:not([data-theme]) {
  color-scheme: light;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    color-scheme: dark;
  }
}

:root[data-theme="light"] {
  color-scheme: light;
}

:root[data-theme="dark"] {
  color-scheme: dark;
}
```

A atribuição dos valores dos tokens semânticos segue a mesma estrutura de seletores, em três blocos que definem o mesmo conjunto de tokens, definidos pelo UI Designer:

1. Valores claros em `:root` (padrão e `[data-theme="light"]`).
2. Valores escuros em `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { ... } }`.
3. Valores escuros em `:root[data-theme="dark"]`.

Em Tailwind v4, os tokens expostos em `@theme` referenciam variáveis CSS (`--color-surface: var(--surface)`) para que utilitários (`bg-surface`) funcionem nos dois temas sem variantes `dark:`. Se o time optar por usar `dark:`, declarar a variante personalizada com o seletor `[data-theme="dark"]` e o equivalente de mídia para o modo sistema.

### 6.3 Script anti-flash

Script inline no `<head>`, executado antes da primeira pintura, lê `localStorage.tema`. Se for `light` ou `dark`, define `data-theme`; se for `system` ou ausente, não define. Envolve acesso ao storage com `try/catch` (navegação privada).

```javascript
(function () {
  try {
    var t = localStorage.getItem("tema");
    if (t === "light" || t === "dark") {
      document.documentElement.setAttribute("data-theme", t);
    }
  } catch (e) {}
})();
```

### 6.4 Seletor de tema (`c-theme-switch`)

| Aspecto | Regra |
|---|---|
| Padrão de interação | Grupo de rádio (`role="radiogroup"`, `aria-label="Tema"`) com três opções: Claro, Escuro, Sistema |
| Posições | Menu do usuário (desktop), drawer "Mais" (celular), Configurações > Aparência, tela de Login (discreto) |
| Setas | Esquerda/direita movem seleção; Tab sai do grupo |
| Rótulos | Texto visível sempre; ícone é decorativo (`aria-hidden`) |
| Resposta | Aplicação imediata, sem recarregar; transição de cor de no máximo `--motion-base`, desativada com `prefers-reduced-motion` |
| Sincronização | Alterações em outra aba atualizam via evento `storage` |

### 6.5 Requisitos por tema

| Requisito | Claro | Escuro |
|---|---|---|
| Contraste AA | Obrigatório | Obrigatório |
| Hierarquia de superfícies | Elevação por sombra e borda | Elevação por clareamento da superfície e borda (sombras fracas) |
| Gráficos | Paleta categórica com 3:1 contra o fundo | Paleta própria, não inversão automática |
| Imagens/ícones | Sem versões fixas em branco ou preto | Usam `currentColor` |
| Estados de foco | Anel visível com contraste mínimo 3:1 | Idem |
| Impressão (relatório) | Sempre tema claro, via `@media print` | |

---

## 7. Padrões de tabela responsiva

### 7.1 Estratégia por faixa de largura

| Largura | Padrão | Observações |
|---|---|---|
| >= 1024 px | Tabela completa com todas as colunas | Cabeçalho sticky; seleção por checkbox; ordenação |
| 768-1023 px | Tabela com colunas de baixa prioridade ocultas (prioridade 3) | Ocultas ficam acessíveis no detalhe |
| < 768 px | **Lista de cartões** (`c-card-list`): cada linha vira um item de duas linhas | Sem rolagem horizontal; toque abre detalhe |

### 7.2 Prioridade de colunas — Transações (modelo para as demais)

| Coluna | Prioridade | Visível em |
|---|---|---|
| Seleção (checkbox) | 1 | md e acima; celular via toque longo |
| Data | 1 | Todas |
| Descrição | 1 | Todas |
| Valor | 1 | Todas |
| Categoria | 2 | md e acima; celular na segunda linha |
| Conta/Cartão | 2 | lg e acima; celular na segunda linha (abreviado) |
| Tags | 3 | xl e acima; detalhe nas demais |
| Ações (menu da linha) | 1 | md e acima; celular no detalhe |

### 7.3 Composição do item da lista (celular)

```
+----------------------------------+
| Descrição amigável               |
| Categoria · Conta     -R$ 212,30 |
| [Interna] [3/10]                 |
+----------------------------------+
```

Agrupamento por dia com subtítulo sticky ("Hoje, 04 de outubro"); valor sempre alinhado à direita e na primeira linha visível; selos na terceira linha somente quando existirem.

### 7.4 Regras gerais de tabela

| Regra | Descrição |
|---|---|
| Semântica | `<table>` real com `<caption>` (pode ser oculto visualmente), `<th scope="col">`; ordenação por `aria-sort` |
| Alinhamento | Texto à esquerda; valores monetários e percentuais à direita com `font-variant-numeric: tabular-nums` |
| Densidade | `data-density="comfortable"` (padrão, 48 px) e `compact` (40 px); preferência do usuário em Configurações > Aparência (aprovada) e alternância rápida na barra da tabela; vale a partir de `lg` (no celular os cards mantêm 44 px de toque) |
| Seleção | Checkbox de cabeçalho com estado indeterminado; barra de ação contextual; anúncio "N selecionadas" em `aria-live` |
| Ordenação | Cabeçalho é botão; ícone e `aria-sort`; padrão por data decrescente |
| Paginação | Servidor (RNF-DES-02); numérica no desktop, anterior/próxima com "Página X de Y" no celular; "Itens por página" 25/50/100 |
| Totais | Linha de resumo fora do corpo, sempre refletindo o filtro (CA-06) |
| Texto longo | Truncamento com reticências e título completo em tooltip e no detalhe; nunca quebra o alinhamento de valores |
| Rolagem horizontal | Somente em tabelas largas por natureza (pré-visualização de importação, histórico de sync em celular) com contêiner `role="region"` focável, `aria-label` e primeira coluna sticky |
| Linha clicável | Elemento interativo único na linha (link ou botão) com a área ampliada por CSS; evitar `onclick` em `tr` sem foco |
| Hover | Realce sutil; não é o único indicador de interatividade |

---

## 8. Acessibilidade (RNF-USA-04, WCAG 2.1 AA)

### 8.1 Teclado

| Requisito | Regra |
|---|---|
| Ordem de foco | Segue a ordem visual e do DOM: pular link, navegação, cabeçalho, conteúdo, rodapé |
| Pular para o conteúdo | Primeiro elemento focável; visível ao receber foco |
| Todos os controles | Operáveis por teclado: Enter e Espaço em botões; Enter em links; setas em abas, grupos de rádio, menus e árvore; `Esc` fecha camadas |
| Abas | Padrão WAI-ARIA Tabs: setas movem, Tab entra no painel |
| Menus (`⋮`) | `aria-haspopup="menu"`, `aria-expanded`; setas e Home/End; Esc devolve foco ao gatilho |
| Árvore de categorias | `role="tree"` com setas, Home/End, `*` expande irmãos |
| Reordenação de regras | Alternativa por botões "Subir/Descer", não depende de arrastar |
| Tabelas com linhas selecionáveis | Espaço marca; Shift+clique seleciona intervalo; `Ctrl/Cmd+A` seleciona página |
| Sem armadilhas | Modais e painéis têm focus trap e saída por `Esc`; nada prende o foco fora de camadas |

### 8.2 Foco visível

| Requisito | Regra |
|---|---|
| Indicador | Anel de 2 px com offset de 2 px usando `--color-focus-ring`; nunca `outline: none` sem substituto |
| Seletor | `:focus-visible` para teclado; campos de texto mostram foco sempre |
| Contraste | Mínimo 3:1 contra o fundo adjacente em ambos os temas |
| Gestão de foco | Ao abrir modal/painel, foco no título ou primeiro controle; ao fechar, retorna ao gatilho; após navegação de rota, foco no `h1` |
| Âncoras | Elementos com `scroll-margin-top` igual à altura do cabeçalho sticky |

### 8.3 Rótulos e semântica

| Elemento | Requisito |
|---|---|
| Campos | `<label for>` visível; ajuda e erro vinculados por `aria-describedby`; obrigatórios marcados em texto ("obrigatório"), não só com asterisco |
| Erros de formulário | `aria-invalid="true"`; resumo no topo para formulários longos com links aos campos; mensagens específicas |
| Botões de ícone | `aria-label` descritivo ("Editar apelido da conta Itaú Corrente"); tooltip complementar |
| Imagens e ícones | Decorativos com `aria-hidden="true"`; informativos com texto alternativo |
| Títulos | Um `h1` por página, hierarquia sem saltos |
| Listas | Listas reais (`ul/ol`) para menus, filtros ativos e alertas |
| Linguagem | `lang="pt-BR"` no `html` |
| Valores monetários | Texto real (`-R$ 212,30`); sinal e unidade não dependem de cor; leitura por leitor de tela como "menos 212 reais e 30 centavos" via `aria-label` quando necessário |
| Datas | Elemento `<time datetime>` com formato ISO e texto pt-BR |
| Gráficos | Cada gráfico tem título, resumo textual e tabela alternativa (ver 8.5) |
| Região dinâmica | Toasts e status de sincronização em `aria-live="polite"`; erros críticos em `role="alert"` |
| Carregamento | Contêiner `aria-busy="true"` com texto "Carregando..." oculto visualmente |
| Modal | `role="dialog"` (ou `alertdialog` em destrutivos), `aria-modal="true"`, `aria-labelledby`, `aria-describedby` |

### 8.4 Contraste e cor

| Requisito | Regra |
|---|---|
| Texto | 4,5:1 (normal) e 3:1 (>= 24 px ou >= 18,66 px em negrito) |
| Componentes e gráficos | 3:1 contra adjacentes |
| Cor não é o único sinal | Receita/despesa: sinal (+/-), posição e ícone de seta; status: ícone + texto; orçamento: ícone + texto + padrão da barra; selos de transação: texto |
| Estados desabilitados | Indicar com texto auxiliar quando relevante (ex.: botão de conectar com limite atingido) |
| Modo de alto contraste | Respeitar `forced-colors` (bordas e foco visíveis em `ButtonText`/`Highlight`) |
| Temas | Validação de contraste obrigatória em claro e escuro (DoD da Sprint 1) |

### 8.5 Gráficos acessíveis

| Requisito | Regra |
|---|---|
| Título e descrição | `<figure>` com `<figcaption>` e descrição curta do insight |
| Alternativa | Tabela equivalente alternável por controle "Gráfico / Tabela" (padrão do Dashboard) |
| Teclado | Pontos/barras focáveis ou acesso aos dados via tabela; tooltips também surgem no foco |
| Cor | Séries distinguíveis por rótulo direto, padrão ou marcador, não só por cor |
| Movimento | Sem animação essencial; animações respeitam `prefers-reduced-motion` |

### 8.6 Movimento, toque e zoom

| Requisito | Regra |
|---|---|
| `prefers-reduced-motion` | Desativa transições não essenciais, esqueletos pulsantes viram estáticos, nenhuma animação automática de dados |
| Alvos de toque | Mínimo 44 x 44 px; espaçamento mínimo de 8 px entre alvos |
| Zoom | Sem `user-scalable=no`; layout funcional a 200% e reflow a 400% de zoom em 320 px |
| Gestos | Todo gesto (deslizar, pressionar longo) tem alternativa por botão visível |
| Tempo | Toasts com ação ficam visíveis por pelo menos 6 s e pausam com foco/hover; nenhuma ação crítica depende de temporizador |

---

## 9. Formatação pt-BR (RNF-USA-02, RF-CFG-01)

### 9.1 Moeda (BRL)

| Aspecto | Regra |
|---|---|
| Formato | `R$ 1.234,56`: símbolo, espaço, milhar com ponto, decimal com vírgula, duas casas |
| Implementação | `Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })` único e centralizado; mockups usam o mesmo formato com dados fictícios |
| Negativos | Sinal antes do símbolo: `-R$ 212,30` (despesas, saldos negativos); sem parênteses |
| Positivos | Sem sinal em saldos; em variações e receitas relevantes pode-se exibir `+R$ 3.484,60` quando a direção importa (resultado, variação) |
| Zero | `R$ 0,00` em cinza neutro |
| Valores grandes | Em cartões compactos, até R$ 999.999,99 completos; acima disso pode abreviar `R$ 1,2 mi` com valor completo em tooltip/`aria-label`; na tabela nunca abreviar |
| Alinhamento | À direita, números tabulares |
| Precisão | Exibição não altera o valor armazenado (RN-11); sem arredondamentos intermediários na UI |
| Campos de entrada | Máscara com vírgula decimal; aceitar colar `1234.56` e `1.234,56`; teclado numérico no celular (`inputmode="decimal"`) |
| Convenção de sinal | Receitas positivas e despesas negativas (RN-01); transferências internas e ignoradas em cinza neutro sem sinal de cor |
| Privacidade | Alternância "Ocultar valores" (aprovada) no cabeçalho e no drawer; ver 9.5 |

### 9.2 Percentuais e números

| Tipo | Formato | Exemplo |
|---|---|---|
| Percentual | Vírgula decimal, uma casa em variações, zero casas em barras de progresso | `12,5%`, `85%` |
| Variação | Seta + percentual + referência | `▲ 5,2% vs. setembro` |
| Quantidades | Milhar com ponto | `14.380 transações` |
| Parcelas | `parcela/total` | `4/10` |

### 9.3 Datas e horas

| Contexto | Formato | Exemplo |
|---|---|---|
| Data padrão (tabelas) | `dd/MM/aaaa`; `dd/MM` quando o ano é o corrente e o contexto é claro | `04/10/2026`, `04/10` |
| Data por extenso | `d de mês de aaaa` | `4 de outubro de 2026` |
| Mês | `mês de aaaa`; abreviado `out/2026` | `outubro de 2026` |
| Cabeçalho de grupo | Relativo para hoje e ontem; depois dia da semana | `Hoje, 04 de outubro`, `Ontem`, `Sexta, 03 de outubro` |
| Hora | 24 h `HH:mm`, fuso America/Sao_Paulo | `14:32` |
| Relativo (sincronização) | `há 12 min`, `há 3 h`, `ontem às 08:10`, `há 2 dias` | |
| Dia de início do mês | Períodos mensais seguem o dia configurado (RF-CFG-02) e exibem o intervalo ao lado | `05/09 a 04/10` |
| Semana | Começa no domingo (padrão pt-BR) em calendários | |
| Entrada | Campo de data com máscara `dd/mm/aaaa`; no celular, seletor nativo `type="date"` com rótulo e formato de ajuda | |
| Marcação | `<time datetime="2026-10-04T14:32:00-03:00">` | |
| Fuso | Todas as datas exibidas em America/Sao_Paulo (RF-CFG-01); armazenamento em UTC | |

Implementação centralizada (`Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo" })`) para que mockups e app produzam o mesmo texto.

### 9.4 Idioma e microcopy

| Regra | Descrição |
|---|---|
| Idioma da interface | pt-BR; termos técnicos evitados |
| Capitalização | Sentença (apenas primeira letra e nomes próprios em maiúscula) |
| Plural | Concordância: `1 transação`, `2 transações` |
| Listas | Separadores com vírgula e "e" |
| Termos fixos | "Conexão" (não "item"), "Instituição" (não "conector"), "Fatura", "Parcela", "Categoria", "Regra", "Sincronizar", "Consentimento" |

### 9.5 Ocultar valores (aprovado)

Mecanismo: botão no cabeçalho "Ocultar valores" com `aria-pressed`; `d-money` recebe `data-masked="true"` e exibe `R$ ••••`, mantendo `aria-label` descritivo "Valor oculto". Aplica-se a todas as telas; a preferência inicial vem de "Ocultar valores por padrão" em Configurações > Aparência e o estado atual persiste por usuário. Gráficos omitem rótulos de valor. Exportações e impressão não são mascaradas e o app avisa antes. Aprovado pelo titular (fora do URS).

---

## 10. Padrões de estados (RNF-USA-03)

### 10.1 Máquina de estados de um bloco de dados

```
carregando -> pronto
carregando -> vazio
carregando -> erro
pronto -> carregando (nova consulta: filtro, página, período)
erro -> carregando (tentar novamente)
```

Atributo: `data-state="loading|ready|empty|error"` no contêiner (`c-state`).

### 10.2 Especificação por estado

| Estado | Visual | ARIA | Interação |
|---|---|---|---|
| Carregando (primeira carga) | Esqueleto com a geometria do conteúdo; sem spinner de bloco | `aria-busy="true"`, texto oculto "Carregando..." | Controles de filtro desabilitados somente na primeira carga |
| Carregando (recarga) | Conteúdo anterior com opacidade reduzida e barra de progresso fina no topo do bloco | `aria-busy="true"` | Controles permanecem; ações destrutivas desabilitadas |
| Vazio de origem | Ícone + título + explicação + ação principal (conectar/importar/criar) | Texto no fluxo normal; sem `role="alert"` | Ação leva ao fluxo relacionado |
| Vazio de filtro | Título + explicação + "Limpar filtros" | `role="status"` | Limpar restaura a lista |
| Erro de bloco | Ícone de erro + mensagem + causa quando conhecida + "Tentar novamente" | `role="alert"` | Retry refaz apenas o bloco |
| Erro de tela | Estado central com "Voltar ao Dashboard" | `role="alert"`; foco no título | |
| Dados desatualizados | Faixa informativa e selo de horário no bloco | `role="status"` | "Sincronizar agora" |
| Parcial | Conteúdo disponível + aviso do que faltou | | |
| Offline | Faixa "Sem conexão com a internet. Exibindo dados salvos." | `role="status"` | Ações de escrita desabilitadas com explicação |
| Sucesso de ação | Toast curto com ação "Desfazer" quando aplicável | `aria-live="polite"` | |
| Ação em andamento | Botão com spinner e rótulo de progresso; mantém largura | `aria-busy` no botão | Evita duplo envio |

### 10.3 Esqueletos

| Regra | Descrição |
|---|---|
| Geometria | Mesma altura e largura aproximadas do conteúdo final para evitar salto (CLS) |
| Animação | Pulso/brilho suave; estático com `prefers-reduced-motion` |
| Duração mínima | Evitar piscar: esqueleto aparece apenas se a carga ultrapassar 150 ms |
| Contraste | Visível nos dois temas via `--color-skeleton-*` |

### 10.4 Mensagens de erro (estrutura)

1. O que aconteceu, em linguagem simples.
2. Por que (somente quando conhecido e útil).
3. O que fazer a seguir (ação).
4. Garantia quando aplicável: "Seus dados não foram alterados."

Nunca exibir identificadores técnicos, stack traces, tokens ou dados financeiros em mensagens (RNF-SEG-09). Um código curto de referência pode aparecer em texto secundário para suporte pessoal ("Ref.: 7F3A").

### 10.5 Confirmações e ações destrutivas

| Gravidade | Padrão | Exemplos |
|---|---|---|
| Baixa e reversível | Executa e mostra toast com "Desfazer" | Recategorizar, edição em lote, ocultar conta |
| Média | Diálogo de confirmação com consequência descrita | Desfazer lote de importação, descartar recorrência |
| Alta e irreversível | Confirmação reforçada: digitar nome/frase; reautenticação quando afetar todos os dados | Excluir histórico da conexão, excluir todos os dados |

Regras: botão destrutivo com estilo `danger` e rótulo específico ("Excluir histórico"); foco inicial no botão seguro (Cancelar); `Esc` cancela; resultado comunicado em toast.

---

## 11. Padrões de formulário e filtros

| Regra | Descrição |
|---|---|
| Validação | No envio e ao sair do campo (blur) para campos já tocados; nunca ao digitar o primeiro caractere |
| Obrigatórios | Marcação textual; mensagens sob o campo |
| Máscaras | Valor BRL, data, e-mail sem máscara forçada |
| Autocompletar | `autocomplete` correto em login (`username`, `current-password`, `new-password`, `one-time-code`) |
| Filtros | Barra de filtros com chips de filtros ativos removíveis; estado refletido na URL (query string) para compartilhar e voltar |
| Seleção de categoria | Combobox pesquisável com agrupamento por categoria pai, teclado completo e rótulo da hierarquia |
| Salvamento | Inline (orçamento, preferências) com feedback "Salvo"/"Não salvo"; formulários em modal com botão explícito |
| Dados sensíveis | Campos de senha com botão "mostrar" acessível; sem armazenar em cache do navegador quando aplicável |

---

## 12. Princípios de desempenho percebido (alinhados a RNF-DES)

| Princípio | Aplicação |
|---|---|
| Servidor primeiro | Esqueletos aparecem com streaming de Server Components; paginação e agregações no servidor |
| Gráficos | Carregados de forma tardia (Client Components), com esqueleto da mesma altura |
| Imagens e ícones | SVG inline/sprite; sem imagens pesadas |
| Fontes | Número limitado de pesos; `font-display: swap` com fallback métrico próximo |
| Layout estável | Alturas reservadas para evitar deslocamento (CLS < 0,1) |
| Listas longas | Paginação (não rolagem infinita), alinhada a RF-TRX-01 |

---

## 13. Decisões do titular e pontos ainda em aberto

### 13.1 Decisões aplicadas (05/10/2026)

| # | Decisão | Onde se aplica |
|---|---|---|
| L0 | Mobile first e bom uso em desktop | Seções 1, 2 e 7; wireframes (celular primeiro) |
| L2 | Densidade de tabela configurável | Seção 7.4; Configurações > Aparência |
| L3 | Modo ocultar valores | Seções 9.1 e 9.5 |
| L8 | Exportar relatório em PDF e imprimir, sempre em tema claro | Seção 6.5 |
| L9 | Barra inferior do celular confirmada: Início, Transações, Contas, Cartões, Mais | Seção 2.2 |
| L10 | Dados desatualizados após 36 h; "Interna" como selo da transação | Arquitetura 7.3; wireframes |

### 13.2 Pontos ainda em aberto

| # | Tema | Situação |
|---|---|---|
| L1 | Valores dos tokens (cor, tipografia, raio, sombra) | A definir pelo UI Designer na Etapa 1.2; este documento fixa nomes e requisitos |
| L5 | Estratégia de rolagem em tabelas largas no celular | Padrão: lista de cartões; exceção com rolagem horizontal contida nas pré-visualizações de importação |
| L6 | Biblioteca de gráficos | Escolha na Sprint 7; exigência: tabela alternativa e acesso por teclado (8.5) |
| L7 | Ícones | Conjunto único definido pelo UI Designer; todos com rótulo textual ou `aria-label` |
| L11 | Persistência do menu recolhido | Cliente (localStorage); sem persistência no servidor |

---

## 14. Checklist de aceite do sistema de layout (usado na revisão cruzada, Etapa 1.4)

- [ ] Todas as telas funcionam em 320, 375, 768, 1024, 1280, 1440, 1536 e 1920 px sem rolagem horizontal de página.
- [ ] Celular é o desenho-base: todos os controles têm alvo de 44 px, ações principais ao alcance do polegar e tabelas viram cards.
- [ ] Desktop usa o espaço: menu lateral, múltiplas colunas, painel lateral de detalhe, tabelas densas, hover e foco visíveis, largura máxima de 1280 px (`xl`) e 1440 px (`2xl`).
- [ ] Shell: barra inferior abaixo de 768 px, trilho entre 768 e 1023 px, menu lateral a partir de 1024 px.
- [ ] Cabeçalho tem indicador de sincronização com sete estados e sino de alertas.
- [ ] Temas claro, escuro e sistema funcionam sem flash e persistem.
- [ ] Nenhum valor literal de cor ou espaçamento em componentes; só tokens.
- [ ] Tabelas viram listas de cartões abaixo de 768 px.
- [ ] Valores BRL, datas e horas seguem a seção 9 em todas as telas.
- [ ] Cada bloco de dados tem estados carregando, vazio e erro.
- [ ] Foco visível, ordem de foco correta, pular para o conteúdo, modais com focus trap e retorno de foco.
- [ ] Rótulos em todos os campos e botões de ícone; um `h1` por tela; `lang="pt-BR"`.
- [ ] Contraste AA validado nos dois temas; cor nunca é o único sinal.
- [ ] `prefers-reduced-motion` respeitado.
- [ ] Ações destrutivas seguem 10.5.
