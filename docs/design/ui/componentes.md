# Componentes — Especificação Visual

**Etapa:** 1.2 (Sprint 1) — Design visual e design system
**Agente:** UI Designer
**Data:** 05/10/2026
**Base:** `design-system.md` (tokens, contraste, tipografia, ícones), `docs/design/ux/sistema-de-layout.md` seção 4.4 (catálogo), `wireframes.md`, `arquitetura-de-informacao.md`
**Consumidor:** Frontend Developer (mockups da Etapa 1.3 e componentes da Sprint 2)

Convenções deste documento:

- Nomes de classe seguem BEM com prefixos `l-`, `c-`, `d-`, `u-`, máximo de dois níveis (`bloco__elemento`), estados por atributos (`data-*`, `aria-*`) e `is-`/`has-` apenas para estados transitórios de JavaScript.
- Todo CSS usa **somente tokens** de `design-system.md`. Sem valores literais de cor, sem `!important` e sem comentários.
- **Mobile first**: o CSS-base é o do celular (320 px); recursos de desktop entram com `min-width`. Alvo de toque mínimo de 44 x 44 px no celular.
- Os trechos CSS são referência de estrutura e valores; o Frontend Developer pode reorganizar seletores, mas não alterar medidas e tokens sem registro.

---

## 0. Fundamentos comuns

### 0.1 Alturas de controle

Celular e telas de toque: 44 px. Desktop com ponteiro preciso (`lg`, `pointer: fine`): controles menores.

```css
:root {
  --control-height-sm: 44px;
  --control-height-md: 44px;
  --control-height-lg: 48px;
}

@media (min-width: 1024px) and (pointer: fine) {
  :root {
    --control-height-sm: 32px;
    --control-height-md: 40px;
    --control-height-lg: 48px;
  }
}
```

### 0.2 Matriz de estados interativos (vale para todos os componentes)

| Estado | Regra visual | Atributo |
|---|---|---|
| Padrão | Conforme cada componente | |
| Hover | Deslocamento de fundo para o próximo nível (ver cada componente). Somente com `@media (hover: hover)`; nunca é o único indicador de interatividade | |
| Foco | Anel de `--focus-ring-width` (2 px) em `--color-focus-ring`, offset de `--focus-ring-offset` (2 px), em `:focus-visible`; campos de texto mostram foco sempre | |
| Ativo (pressionado) | Fundo um nível além do hover; sem deslocamento de posição | |
| Desabilitado | Fundo `--color-disabled-bg`, texto e ícones `--color-disabled-text`, `cursor: not-allowed`; texto auxiliar explica o motivo quando relevante | `disabled` ou `aria-disabled="true"` |
| Erro | Borda efetiva de 2 px em `--color-danger`, ícone `CircleAlert`, mensagem em `--color-danger-text` ligada por `aria-describedby` | `aria-invalid="true"` |
| Carregando | Spinner no lugar do ícone (ou antes do rótulo), rótulo mantido, largura preservada, sem duplo envio | `aria-busy="true"` |
| Selecionado | Marca de seleção (`Check` ou indicador de borda) além do fundo `--color-row-selected` | `aria-selected`, `aria-current`, `aria-pressed`, `aria-checked` |

```css
@media (hover: none) {
  .c-card:hover,
  .c-table__row:hover,
  .c-card-list__item:hover {
    background: inherit;
  }
}
```

### 0.3 Spinner

```css
.c-spinner {
  width: 1em;
  height: 1em;
  border: 2px solid currentColor;
  border-inline-end-color: transparent;
  border-radius: var(--radius-full);
  animation: c-spin 800ms linear infinite;
}

@keyframes c-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .c-spinner {
    animation-duration: 0.01ms;
    animation-iteration-count: 1;
    border-inline-end-color: currentColor;
  }
}
```

Com movimento reduzido o spinner vira um anel estático; o texto "Carregando..." ou o rótulo de progresso comunica o estado.

### 0.4 Superfícies base

```css
.c-card {
  background: var(--color-surface);
  border: var(--border-default);
  border-radius: var(--radius-lg);
  box-shadow: var(--elevation-card);
  padding: var(--space-4);
  min-width: 0;
}

@media (min-width: 1024px) {
  .c-card {
    padding: var(--space-6);
  }
}

.c-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  margin-block-end: var(--space-4);
}

.c-card__title {
  font-size: var(--type-h2-size);
  line-height: var(--type-h2-leading);
  font-weight: var(--weight-semibold);
}
```

---

## 1. Shell e navegação

### 1.1 Link de pular (`l-skip`)

| Item | Valor |
|---|---|
| Posição | Primeiro elemento focável; fora da tela até receber foco |
| Aparência ao foco | Botão primário, `--space-3` de margem, `--z-skip` |

```css
.l-skip {
  position: fixed;
  inset-block-start: var(--space-2);
  inset-inline-start: var(--space-2);
  z-index: var(--z-skip);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  background: var(--color-primary);
  color: var(--color-primary-contrast);
  font-weight: var(--weight-medium);
  transform: translateY(-200%);
}

.l-skip:focus-visible {
  transform: translateY(0);
}
```

### 1.2 Estrutura do shell (`l-shell`)

| Largura | Estrutura |
|---|---|
| base (< 768) | Cabeçalho no topo (56 px), conteúdo, barra inferior (56 px + safe-area) |
| md (768 a 1023) | Trilho de 72 px à esquerda, cabeçalho no topo da coluna de conteúdo (56 px) |
| lg (>= 1024) | Menu lateral de 256 px (ou 72 px recolhido), cabeçalho de 64 px |

```css
.l-shell {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: auto 1fr;
  min-height: 100dvh;
  background: var(--color-bg);
}

.l-shell__main {
  min-width: 0;
  padding-block-end: calc(var(--bottom-nav-height) + env(safe-area-inset-bottom) + var(--space-8));
}

.l-shell__nav {
  display: none;
}

@media (min-width: 768px) {
  .l-shell {
    grid-template-columns: var(--nav-width-collapsed) minmax(0, 1fr);
    grid-template-rows: auto 1fr;
  }

  .l-shell__nav {
    display: block;
    grid-row: 1 / -1;
  }

  .l-shell__main {
    padding-block-end: var(--space-8);
  }
}

@media (min-width: 1024px) {
  .l-shell {
    grid-template-columns: var(--nav-width) minmax(0, 1fr);
  }

  .l-shell[data-nav="collapsed"] {
    grid-template-columns: var(--nav-width-collapsed) minmax(0, 1fr);
  }
}
```

### 1.3 Barra inferior (`c-bottom-nav`), celular

Cinco destinos: Início, Transações, Contas, Cartões, Mais.

| Medida | Valor |
|---|---|
| Altura | `--bottom-nav-height` (56 px) + `env(safe-area-inset-bottom)` |
| Item | Mínimo 64 x 56 px (5 x 64 = 320 px cabem em 320 px) |
| Ícone | 24 px; rótulo `--text-xs` peso 600 sempre visível |
| Fundo | `--color-surface`, borda superior `--border-default`, `--z-nav` |
| Item ativo | Pílula `--color-row-selected` de 56 x 32 px atrás do ícone, rótulo `--color-text` peso 600, ícone `--color-primary`, `aria-current="page"` |
| Item "Mais" | Ativo quando a tela atual pertence ao drawer; contador (!) ou número como ponto/badge de 16 px |
| Estados | Hover (fundo `--color-row-hover` na pílula), foco (anel no item), ativo (pílula `--color-row-selected` com fundo mais forte via `--color-primary-active` a 12% de opacidade) |

```css
.c-bottom-nav {
  position: fixed;
  inset-inline: 0;
  inset-block-end: 0;
  z-index: var(--z-nav);
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  height: calc(var(--bottom-nav-height) + env(safe-area-inset-bottom));
  padding-block-end: env(safe-area-inset-bottom);
  background: var(--color-surface);
  border-block-start: var(--border-default);
}

.c-bottom-nav__item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-1);
  min-height: var(--bottom-nav-height);
  font-size: var(--text-xs);
  line-height: var(--leading-xs);
  font-weight: var(--weight-semibold);
  color: var(--color-text-muted);
  text-decoration: none;
}

.c-bottom-nav__icon {
  display: grid;
  place-items: center;
  width: 56px;
  height: 32px;
  border-radius: var(--radius-full);
  transition: background-color var(--motion-fast) var(--ease-standard);
}

.c-bottom-nav__item[aria-current="page"] {
  color: var(--color-text);
}

.c-bottom-nav__item[aria-current="page"] .c-bottom-nav__icon {
  background: var(--color-row-selected);
  color: var(--color-primary);
}

.c-bottom-nav__badge {
  position: absolute;
  inset-block-start: var(--space-1);
  inset-inline-start: calc(50% + 8px);
  min-width: 16px;
  height: 16px;
  padding-inline: var(--space-1);
  border-radius: var(--radius-full);
  background: var(--color-danger);
  color: var(--color-danger-contrast);
  font-size: var(--text-xs);
  line-height: 16px;
  text-align: center;
}

@media (min-width: 768px) {
  .c-bottom-nav {
    display: none;
  }
}
```

### 1.4 Menu lateral (`c-side-nav`): expandido (lg) e trilho (md e recolhido)

| Medida | Expandido | Trilho |
|---|---|---|
| Largura | `--nav-width` (256 px) | `--nav-width-collapsed` (72 px) |
| Fundo | `--color-surface`, borda direita `--border-default` | idem |
| Topo | Altura = `--header-height`; símbolo 32 px + wordmark | Símbolo 32 px centralizado |
| Grupo | Sobrelinha (12 px, caixa alta) em `--color-text-muted`, `--space-4` acima do 1º item, `--space-2` abaixo | Separador `--color-border` de 1 px, 32 px de largura |
| Item | Altura `--control-height-md`, padding `--space-3`, ícone 20 px, gap `--space-3`, rótulo `--text-sm` peso 500, raio `--radius-md` | Quadrado de 48 x 48 px, ícone 24 px centralizado, tooltip à direita com o rótulo |
| Contador | Badge à direita, ver `c-badge` | Ponto de 8 px sobre o ícone |
| Item ativo | Fundo `--color-row-selected`, texto `--color-text` peso 600, ícone `--color-primary`, indicador de 3 px (`--color-primary`) na borda esquerda; `aria-current="page"` | idem sem rótulo |
| Rodapé | Botão "Recolher menu" (`PanelLeftClose`) | Botão `PanelLeftOpen` |
| Em `md` expandido | Sobreposto, largura 256 px, `--elevation-drawer`, fundo `--color-overlay` atrás, `--z-nav` | |

| Estado do item | Visual |
|---|---|
| Padrão | Texto `--color-text-muted`, ícone `--color-text-muted` |
| Hover | Fundo `--color-row-hover`, texto `--color-text` |
| Foco | Anel de foco com offset 2 px; no trilho, anel quadrado de 48 px |
| Ativo (pressionado) | Fundo `--color-row-selected` |
| Atual | Ver "Item ativo" |
| Desabilitado | Não ocorre (todos os destinos estão sempre disponíveis) |

```css
.c-side-nav {
  position: sticky;
  inset-block-start: 0;
  display: flex;
  flex-direction: column;
  height: 100dvh;
  width: var(--nav-width-collapsed);
  background: var(--color-surface);
  border-inline-end: var(--border-default);
  z-index: var(--z-nav);
  overflow-y: auto;
}

.c-side-nav__brand {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  height: var(--header-height);
  padding-inline: var(--space-5);
  flex-shrink: 0;
}

.c-side-nav__group-label {
  display: none;
  padding: var(--space-4) var(--space-4) var(--space-2);
  font-size: var(--type-overline-size);
  line-height: var(--type-overline-leading);
  font-weight: var(--weight-semibold);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.c-side-nav__item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  width: 48px;
  height: 48px;
  margin: var(--space-1) auto;
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  line-height: var(--leading-sm);
  font-weight: var(--weight-medium);
  text-decoration: none;
  transition: background-color var(--motion-fast) var(--ease-standard);
}

.c-side-nav__label {
  display: none;
}

@media (hover: hover) {
  .c-side-nav__item:hover {
    background: var(--color-row-hover);
    color: var(--color-text);
  }
}

.c-side-nav__item[aria-current="page"] {
  background: var(--color-row-selected);
  color: var(--color-text);
  font-weight: var(--weight-semibold);
}

.c-side-nav__item[aria-current="page"]::before {
  content: "";
  position: absolute;
  inset-block: var(--space-2);
  inset-inline-start: calc(-1 * var(--space-3));
  width: 3px;
  border-radius: var(--radius-full);
  background: var(--color-primary);
}

@media (min-width: 1024px) {
  .c-side-nav {
    width: var(--nav-width);
  }

  .c-side-nav__group-label {
    display: block;
  }

  .c-side-nav__item {
    justify-content: flex-start;
    width: auto;
    height: var(--control-height-md);
    margin: var(--space-1) var(--space-3);
    padding-inline: var(--space-3);
  }

  .c-side-nav__label {
    display: inline;
  }

  .c-side-nav__item[aria-current="page"]::before {
    inset-inline-start: calc(-1 * var(--space-3));
  }

  .l-shell[data-nav="collapsed"] .c-side-nav {
    width: var(--nav-width-collapsed);
  }

  .l-shell[data-nav="collapsed"] .c-side-nav__label,
  .l-shell[data-nav="collapsed"] .c-side-nav__group-label {
    display: none;
  }

  .l-shell[data-nav="collapsed"] .c-side-nav__item {
    justify-content: center;
    width: 48px;
    height: 48px;
    margin-inline: auto;
    padding-inline: 0;
  }
}
```

### 1.5 Cabeçalho global (`l-shell__header`)

| Medida | Celular | md | lg |
|---|---|---|---|
| Altura | 56 px | 56 px | 64 px |
| Fundo | `--color-surface`, borda inferior `--border-default`, `position: sticky`, `--z-sticky` | idem | idem |
| Padding lateral | `--page-gutter` (16) | 24 | 32 |
| Título (`h1`) | `--type-h2` (18/24, 600), truncado | `--type-h1` | `--type-h1` |
| Conteúdo | Título, olho (44 x 44), indicador reduzido (ícone + tempo), sino (44 x 44) | Título, período, indicador completo, olho, sino | Título, período, indicador completo + botão sincronizar, olho, sino, menu do usuário |
| Menu do usuário | Fora (vive no drawer "Mais") | Fora | Botão com iniciais (avatar 32 px, alvo 40 px) + `ChevronDown` |

```css
.l-shell__header {
  position: sticky;
  inset-block-start: 0;
  z-index: var(--z-sticky);
  display: flex;
  align-items: center;
  gap: var(--space-2);
  min-height: var(--header-height);
  padding-inline: var(--page-gutter);
  background: var(--color-surface);
  border-block-end: var(--border-default);
}

.l-shell__title {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: var(--type-h2-size);
  line-height: var(--type-h2-leading);
  font-weight: var(--weight-semibold);
}

@media (min-width: 768px) {
  .l-shell__title {
    font-size: var(--type-h1-size);
    line-height: var(--type-h1-leading);
    letter-spacing: var(--tracking-tight);
  }
}

.l-shell__actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-shrink: 0;
}
```

### 1.6 Botão de ícone (`c-icon-button`)

Quadrado `--control-height-md` (44 px celular, 40 px desktop); ícone 24 px (20 px em compactos). Variantes: `ghost` (padrão), `secondary`, `primary`. Estados como `c-button`. Sempre com `aria-label` e tooltip no desktop; `aria-pressed` quando alternável (olho, tema).

```css
.c-icon-button {
  display: inline-grid;
  place-items: center;
  width: var(--control-height-md);
  height: var(--control-height-md);
  padding: 0;
  border: var(--border-width) solid transparent;
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--color-text);
  cursor: pointer;
  transition: background-color var(--motion-fast) var(--ease-standard);
}

@media (hover: hover) {
  .c-icon-button:hover {
    background: var(--color-row-hover);
  }
}

.c-icon-button:active {
  background: var(--color-row-selected);
}

.c-icon-button[aria-pressed="true"] {
  background: var(--color-row-selected);
  color: var(--color-primary);
}

.c-icon-button:disabled {
  color: var(--color-disabled-text);
  cursor: not-allowed;
}
```

### 1.7 Indicador de sincronização (`d-sync-status`)

Sete estados (mapeamento de cor e ícone em `design-system.md` 4.2). Alvo de 44 px no celular, 32 px no desktop.

| Aspecto | Celular | Desktop |
|---|---|---|
| Forma | Pílula, altura 44 px (alvo), ícone 20 px + tempo curto ("12 min") `--text-sm` peso 500 | Pílula, altura 32 px, ícone 16 px + texto completo ("Atualizado há 12 min") |
| Largura | Conteúdo, mínimo 44 px | Conteúdo, máximo 280 px, truncamento do texto |
| Fundo e borda | `--color-{status}-bg` e `--color-{status}-border` | idem |
| Texto | `--color-{status}-text` | idem |
| Botão sincronizar (lg) | Fora; vive no popover | `c-icon-button` 32 px ao lado (`RefreshCw`), vira spinner durante execução |
| Ao ativar | Abre `c-popover` (desktop) ou `c-sheet` (celular) com a lista de conexões | |

Estados:

| Estado | Visual | Observações |
|---|---|---|
| Atualizado | Verde: `CircleCheck`, fundo `--color-success-bg` | |
| Sincronizando | Info: `RefreshCw` girando, texto "Sincronizando... 2 de 4" | `aria-live="polite"` |
| Desatualizado | Alerta: `Clock` | Após 36 h |
| Atenção | Alerta: `TriangleAlert`, texto "1 conexão precisa de ação" | |
| Erro | Erro: `OctagonAlert`, texto "Falha ao sincronizar" | `role="alert"` ao entrar neste estado |
| Sem conexões | Neutro: `Link2` | |
| Sem rede | Neutro: `CloudOff` | Ações de escrita desabilitadas |

```css
.d-sync-status {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  min-height: var(--touch-target);
  min-width: var(--touch-target);
  padding-inline: var(--space-3);
  border: var(--border-width) solid var(--color-neutral-border);
  border-radius: var(--radius-full);
  background: var(--color-neutral-bg);
  color: var(--color-neutral-text);
  font-size: var(--text-sm);
  line-height: var(--leading-sm);
  font-weight: var(--weight-medium);
  white-space: nowrap;
  cursor: pointer;
}

.d-sync-status[data-status="ok"] {
  background: var(--color-success-bg);
  border-color: var(--color-success-border);
  color: var(--color-success-text);
}

.d-sync-status[data-status="info"] {
  background: var(--color-info-bg);
  border-color: var(--color-info-border);
  color: var(--color-info-text);
}

.d-sync-status[data-status="warning"] {
  background: var(--color-warning-bg);
  border-color: var(--color-warning-border);
  color: var(--color-warning-text);
}

.d-sync-status[data-status="error"] {
  background: var(--color-danger-bg);
  border-color: var(--color-danger-border);
  color: var(--color-danger-text);
}

.d-sync-status__text-full {
  display: none;
}

@media (min-width: 768px) {
  .d-sync-status {
    min-height: 32px;
  }

  .d-sync-status__text-short {
    display: none;
  }

  .d-sync-status__text-full {
    display: inline;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
```

### 1.8 Sino (`d-bell`)

`c-icon-button` com `Bell` 24 px. Contador: círculo de 18 px com `--color-primary` / `--color-primary-contrast`, `--text-xs` peso 600, posicionado no canto superior direito do ícone; "99+" acima de 99. Zero alertas: sem contador, `aria-label="Alertas"`. Com contador: `aria-label="Alertas, 3 não lidos"`. Desktop: abre `c-popover` de 360 px com os 5 mais recentes; celular: navega para Alertas.

```css
.d-bell {
  position: relative;
}

.d-bell__count {
  position: absolute;
  inset-block-start: var(--space-1);
  inset-inline-end: var(--space-1);
  min-width: 18px;
  height: 18px;
  padding-inline: var(--space-1);
  border-radius: var(--radius-full);
  background: var(--color-primary);
  color: var(--color-primary-contrast);
  font-size: var(--text-xs);
  line-height: 18px;
  font-weight: var(--weight-semibold);
  text-align: center;
  font-variant-numeric: tabular-nums;
}
```

### 1.9 Menu do usuário (desktop) e drawer "Mais" (celular)

Menu do usuário (`c-popover`, 280 px): nome e e-mail em `--text-sm`, interruptor "Ocultar valores", seletor de tema (`c-theme-switch`), "Configurações", "Sair" (item com `LogOut`). Itens de 40 px.

Drawer "Mais" (`c-sheet`, até 85dvh): alça, título "Mais", grupos com sobrelinha, itens de 48 px com ícone 20 px, contadores, ao final: "Ocultar valores" (interruptor), `c-theme-switch` e botão "Sair". Mesmos grupos do menu lateral exceto os cinco itens da barra.

### 1.10 Seletor de tema (`c-theme-switch`)

| Medida | Valor |
|---|---|
| Padrão | `role="radiogroup"` `aria-label="Tema"` com três `role="radio"`: Claro (`Sun`), Escuro (`Moon`), Sistema (`Monitor`) |
| Forma | `c-segmented` com ícone 16 px e texto sempre visível |
| Altura | 44 px no celular, 36 px no desktop |
| Atual | Fundo `--color-surface`, `--elevation-card`, texto `--color-text` peso 600; os demais `--color-text-muted` sobre `--color-surface-sunken` |

### 1.11 Seletor de período (`d-period-picker`)

| Aspecto | Celular (barra fixa sob o título) | Desktop (cabeçalho) |
|---|---|---|
| Tipo (Mês, Trimestre, Ano, Personalizado) | Botão que abre `c-sheet` de opções (`c-radio` em linhas de 48 px) | `c-segmented` de 4 opções (36 px) |
| Navegação | `ChevronLeft` e `ChevronRight` em `c-icon-button` 44 px, rótulo central de 44 px com `Calendar` e "Outubro de 2026" | Mesmo, rótulo `--text-base` peso 500 |
| Referência | Linha de legenda "05/09 a 04/10" (`--text-sm`, `--color-text-muted`) sob o rótulo | Ao lado do rótulo, mesma legenda |
| Personalizado | Abre `c-modal` (folha) com dois campos de data e atalhos "Últimos 30 dias" e "Este ano" | `c-modal` central 480 px |
| Barra no celular | Sticky em `top: var(--header-height)`, fundo `--color-surface`, borda inferior, altura 52 px, `--z-sticky` | Não se aplica |

Estados: padrão, hover (botões), foco, desabilitado (setas "próximo" em período futuro), carregando (rótulo estático, `aria-busy` na tela).

```css
.d-period-picker {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  min-height: 52px;
  padding-inline: var(--page-gutter);
  background: var(--color-surface);
  border-block-end: var(--border-default);
  position: sticky;
  inset-block-start: var(--header-height);
  z-index: var(--z-sticky);
}

.d-period-picker__label {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  min-height: var(--touch-target);
  padding-inline: var(--space-3);
  border-radius: var(--radius-md);
  font-weight: var(--weight-medium);
  background: transparent;
  color: var(--color-text);
  border: 0;
  cursor: pointer;
}

.d-period-picker__range {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

@media (min-width: 768px) {
  .d-period-picker {
    position: static;
    min-height: 0;
    padding-inline: 0;
    background: transparent;
    border: 0;
  }
}
```

---

## 2. Ações

### 2.1 Botão (`c-button`)

Variantes: `primary` (uma por região), `secondary`, `ghost`, `danger`, `danger-outline`. Tamanhos: `sm`, `md` (padrão), `lg`. Modificadores: `--block` (largura total), `--icon-start`, `--icon-end`. Ícone de 20 px (16 px em `sm`).

| Medida | sm | md | lg |
|---|---|---|---|
| Altura (celular / desktop) | 44 / 32 px | 44 / 40 px | 48 / 48 px |
| Padding horizontal | `--space-3` | `--space-4` | `--space-6` |
| Fonte | `--text-sm` peso 500 | `--text-base` peso 500 (desktop 15 px) | `--text-base` peso 600 |
| Raio | `--radius-md` | `--radius-md` | `--radius-md` |
| Largura mínima | 64 px | 80 px | 96 px |

| Estado | primary | secondary | ghost | danger | danger-outline |
|---|---|---|---|---|---|
| Padrão | fundo `--color-primary`, texto `--color-primary-contrast` | fundo `--color-surface`, borda `--color-border-strong`, texto `--color-text` | transparente, texto `--color-text` | fundo `--color-danger`, texto `--color-danger-contrast` | fundo transparente, borda e texto `--color-danger` |
| Hover | `--color-primary-hover` | `--color-row-hover` | `--color-row-hover` | `--color-danger-hover` | `--color-danger-bg` |
| Ativo | `--color-primary-active` | `--color-surface-sunken` | `--color-row-selected` | `--color-danger-hover` | `--color-danger-bg` |
| Foco | anel de foco com offset de 2 px (todas) | | | | |
| Desabilitado | fundo `--color-disabled-bg`, texto `--color-disabled-text`, sem borda | idem | texto `--color-disabled-text` | idem primary | idem primary |
| Carregando | spinner + rótulo ("Salvando..."), `aria-busy`, largura fixa | idem | idem | idem | idem |

Regras: um único `primary` por região; destrutivo nunca é `primary`; "Cancelar" é `ghost` ou `secondary`; rótulo específico ("Excluir histórico", não "OK").

```css
.c-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  min-height: var(--control-height-md);
  min-width: 80px;
  padding-inline: var(--space-4);
  border: var(--border-width) solid transparent;
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--color-text);
  font-family: var(--font-sans);
  font-size: var(--text-base);
  line-height: var(--leading-base);
  font-weight: var(--weight-medium);
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  transition:
    background-color var(--motion-fast) var(--ease-standard),
    border-color var(--motion-fast) var(--ease-standard),
    color var(--motion-fast) var(--ease-standard);
}

.c-button--primary {
  background: var(--color-primary);
  color: var(--color-primary-contrast);
}

.c-button--secondary {
  background: var(--color-surface);
  border-color: var(--color-border-strong);
}

.c-button--danger {
  background: var(--color-danger);
  color: var(--color-danger-contrast);
}

.c-button--danger-outline {
  border-color: var(--color-danger);
  color: var(--color-danger);
}

.c-button--sm {
  min-height: var(--control-height-sm);
  min-width: 64px;
  padding-inline: var(--space-3);
  font-size: var(--text-sm);
  line-height: var(--leading-sm);
}

.c-button--lg {
  min-height: var(--control-height-lg);
  min-width: 96px;
  padding-inline: var(--space-6);
  font-weight: var(--weight-semibold);
}

.c-button--block {
  width: 100%;
}

@media (hover: hover) {
  .c-button--primary:hover {
    background: var(--color-primary-hover);
  }

  .c-button--secondary:hover,
  .c-button--ghost:hover {
    background: var(--color-row-hover);
  }

  .c-button--danger:hover {
    background: var(--color-danger-hover);
  }

  .c-button--danger-outline:hover {
    background: var(--color-danger-bg);
  }
}

.c-button--primary:active {
  background: var(--color-primary-active);
}

.c-button--secondary:active {
  background: var(--color-surface-sunken);
}

.c-button--ghost:active {
  background: var(--color-row-selected);
}

.c-button--danger:active {
  background: var(--color-danger-hover);
}

.c-button:disabled,
.c-button[aria-disabled="true"] {
  background: var(--color-disabled-bg);
  border-color: transparent;
  color: var(--color-disabled-text);
  cursor: not-allowed;
}

.c-button[aria-busy="true"] {
  pointer-events: none;
}

@media (min-width: 1024px) {
  .c-button {
    font-size: var(--type-body-size);
  }
}
```

### 2.2 Botão de ação flutuante (`c-fab`), celular

Usado somente em Transações ("Nova transação").

| Medida | Valor |
|---|---|
| Forma | Pílula 56 px de altura; ícone `Plus` 24 px + rótulo "Nova" opcional (rótulo some ao rolar, ícone permanece com `aria-label="Nova transação"`) |
| Posição | `position: fixed`, `inset-inline-end: var(--page-gutter)`, `bottom: calc(var(--bottom-nav-height) + env(safe-area-inset-bottom) + var(--space-4))`; `--z-sticky` |
| Estilo | `c-button--primary` com `--elevation-raised` |
| Conteúdo | O contêiner da lista reserva `padding-block-end: 88px` (ver P-UI-07) |
| md e acima | Não existe; o botão vai para o cabeçalho da página |

### 2.3 Botão "Entrar com Google" (`c-button--google`)

| Medida | Valor |
|---|---|
| Altura | 48 px (`--control-height-lg`), largura total no celular; no desktop, largura do formulário (máx. 360 px) |
| Fundo e borda | `--color-surface` e `--color-border-strong`; texto `--color-text`, peso 500 |
| Ícone | "G" oficial multicolorido, 20 px, à esquerda, `aria-hidden`; única imagem colorida fora da paleta (ver P-UI-06) |
| Rótulo | "Entrar com Google" |
| Hover / ativo | Fundo `--color-row-hover` / `--color-surface-sunken` |
| Carregando | Spinner + "Abrindo o Google...", formulário de e-mail desabilitado |
| Erro | Banner `c-banner--error` acima do botão (acesso negado) |

```css
.c-button--google {
  min-height: var(--control-height-lg);
  background: var(--color-surface);
  border-color: var(--color-border-strong);
  color: var(--color-text);
}
```

### 2.4 Link (`c-link`)

Cor `--color-text-link`, sublinhado permanente (`text-decoration: underline; text-underline-offset: 2px`) em texto corrido; em navegação, sublinhado só no hover. Alvo mínimo de 44 px de altura quando isolado (padding vertical). Visitado: sem mudança de cor.

---

## 3. Formulários

### 3.1 Campo de texto (`c-field`)

Anatomia (de cima para baixo): rótulo, controle (com adornos opcionais), ajuda, erro.

| Medida | Valor |
|---|---|
| Rótulo | `--text-sm`, peso 500, `--color-text`; sufixo "(obrigatório)" em `--color-text-muted` |
| Controle | Altura `--control-height-md` (44 / 40), padding horizontal `--space-3`, borda `--border-control`, raio `--radius-md`, fundo `--color-surface`, fonte 16 px no celular e `--type-body-size` no desktop, texto `--color-text` |
| Placeholder | `--color-text-muted`; exemplo de formato, nunca substitui rótulo |
| Adornos | Ícone de 20 px à esquerda (`Search`) ou botão à direita (mostrar senha, limpar) de 44 px |
| Ajuda | `--text-sm`, `--color-text-muted`, `--space-1` abaixo, ligada por `aria-describedby` |
| Erro | Ícone `CircleAlert` 16 px + mensagem `--text-sm` em `--color-danger-text` |
| Espaço entre campos | `--space-4` |

| Estado | Visual |
|---|---|
| Padrão | Borda `--color-border-strong` |
| Hover | Borda `--color-text-muted` |
| Foco | Borda `--color-focus-ring` + anel de 2 px (`outline`) sem offset |
| Preenchido | Idêntico ao padrão |
| Erro | Borda `--color-danger` efetiva de 2 px (via `box-shadow: inset`), ícone e mensagem; `aria-invalid="true"` |
| Desabilitado | Fundo `--color-disabled-bg`, texto `--color-disabled-text`, borda `--color-border` |
| Somente leitura | Fundo `--color-surface-sunken`, borda tracejada `--color-border`, texto `--color-text`; selecionável |
| Carregando (validação assíncrona) | Spinner no adorno direito |

```css
.c-field {
  display: grid;
  gap: var(--space-1);
}

.c-field__label {
  font-size: var(--text-sm);
  line-height: var(--leading-sm);
  font-weight: var(--weight-medium);
  color: var(--color-text);
}

.c-field__required {
  font-weight: var(--weight-regular);
  color: var(--color-text-muted);
}

.c-field__control {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  min-height: var(--control-height-md);
  padding-inline: var(--space-3);
  border: var(--border-control);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  color: var(--color-text);
  transition: border-color var(--motion-fast) var(--ease-standard);
}

.c-field__input {
  flex: 1;
  min-width: 0;
  min-height: calc(var(--control-height-md) - 2px);
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: var(--text-base);
}

.c-field__input::placeholder {
  color: var(--color-text-muted);
}

.c-field__input:focus-visible {
  outline: none;
}

@media (hover: hover) {
  .c-field__control:hover {
    border-color: var(--color-text-muted);
  }
}

.c-field__control:focus-within {
  border-color: var(--color-focus-ring);
  outline: var(--focus-ring-width) solid var(--color-focus-ring);
}

.c-field__control[aria-invalid="true"],
.c-field[data-invalid="true"] .c-field__control {
  border-color: var(--color-danger);
  box-shadow: inset 0 0 0 1px var(--color-danger);
}

.c-field__help {
  font-size: var(--text-sm);
  line-height: var(--leading-sm);
  color: var(--color-text-muted);
}

.c-field__error {
  display: flex;
  align-items: flex-start;
  gap: var(--space-1);
  font-size: var(--text-sm);
  line-height: var(--leading-sm);
  color: var(--color-danger-text);
}

.c-field[data-disabled="true"] .c-field__control {
  background: var(--color-disabled-bg);
  border-color: var(--color-border);
  color: var(--color-disabled-text);
}

.c-field[data-readonly="true"] .c-field__control {
  background: var(--color-surface-sunken);
  border-style: dashed;
  border-color: var(--color-border);
}

@media (min-width: 1024px) {
  .c-field__input {
    font-size: var(--type-body-size);
  }
}
```

Variantes: texto, e-mail, senha (com botão `Eye`/`EyeOff` de 44 px, rótulo "Mostrar senha"), busca (ícone `Search` à esquerda e botão `X` para limpar), área de texto (`min-height` de 96 px, redimensionável na vertical), data (`type="date"` nativo no celular; máscara `dd/mm/aaaa` no desktop com ícone `Calendar`), código de 6 dígitos (`c-otp`, seis caixas de 48 x 56 px, fonte `--font-mono` 24 px, foco avança automaticamente, colar preenche todas, `autocomplete="one-time-code"`, `inputmode="numeric"`).

### 3.2 Campo de valor BRL (`c-field--money`)

| Aspecto | Valor |
|---|---|
| Prefixo | "R$" fixo à esquerda em `--color-text-muted`, peso 500 |
| Texto | Alinhado à direita, `font-variant-numeric: tabular-nums`, vírgula decimal, máscara pt-BR ao digitar; `inputmode="decimal"` |
| Sinal | Controle `c-segmented` ("Despesa", "Receita", "Transferência") em transação nova; em campos genéricos, o sinal é inferido do tipo, nunca digitado como "-" |
| Largura | 100% no celular; 200 px de controle em formulários de duas colunas no desktop |
| Erro | "Informe um valor maior que zero." etc., com o mesmo padrão de erro |
| Colar | Aceita `1234.56` e `1.234,56` |

### 3.3 Select e combobox (`c-select`, `c-combobox`)

| Item | Especificação |
|---|---|
| Gatilho | Mesmas medidas do `c-field__control`, `ChevronDown` 20 px à direita, texto selecionado truncado |
| Select nativo | No celular, `<select>` nativo é preferido (picker do sistema) para listas curtas (até 8 opções) |
| Combobox | `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-activedescendant`; digitação filtra |
| Lista | `c-popover` com `max-height: 320px` (celular: `c-sheet` com campo de busca no topo), itens de 44 px no celular e 36 px no desktop, `--elevation-raised` |
| Hierarquia (categoria > subcategoria) | Cabeçalhos de grupo em sobrelinha, subitens recuados em `--space-4`, trilha "Alimentação > Supermercado" no rótulo selecionado |
| Opção em foco | Fundo `--color-row-hover` |
| Opção selecionada | Fundo `--color-row-selected` + `Check` à direita |
| Vazio | Texto "Nenhum resultado" em `--color-text-muted` |
| Amostra de cor (categorias) | Quadrado de 12 px com a cor da categoria + nome |

### 3.4 Checkbox, radio e interruptor

| Componente | Visual | Alvo |
|---|---|---|
| `c-checkbox` | Caixa de 20 x 20 px, raio `--radius-xs`, borda `--color-border-strong`; marcado: fundo `--color-primary` com `Check` em `--color-primary-contrast`; indeterminado: traço `Minus` | Linha inteira (rótulo + caixa) com altura mínima de 44 px e área de toque ampliada em tabela (célula de 44 px) |
| `c-radio` | Círculo de 20 px, borda `--color-border-strong`; selecionado: borda `--color-primary` e ponto interno de 10 px `--color-primary` | Idem |
| `c-switch` | Trilho 44 x 24 px; desligado: trilho `--color-surface-sunken` com borda `--color-border-strong`, botão (knob) de 18 px em `--color-border-strong`; ligado: trilho `--color-primary`, knob `--color-primary-contrast` com `Check` de 12 px (sinal não cromático); `role="switch"`, `aria-checked` | Linha de 44 px com rótulo à esquerda e interruptor à direita |

Estados (todos): hover (borda `--color-text-muted`), foco (anel de 2 px, offset 2 px), ativo (fundo `--color-row-selected` no halo de 32 px), desabilitado (`--color-disabled-*`), erro (borda `--color-danger` + mensagem de grupo).

```css
.c-checkbox {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  min-height: var(--touch-target);
  cursor: pointer;
}

.c-checkbox__box {
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  border: var(--border-width-strong) solid var(--color-border-strong);
  border-radius: var(--radius-xs);
  background: var(--color-surface);
  color: var(--color-primary-contrast);
  flex-shrink: 0;
}

.c-checkbox__input:checked + .c-checkbox__box,
.c-checkbox__input:indeterminate + .c-checkbox__box {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.c-checkbox__input:focus-visible + .c-checkbox__box {
  outline: var(--focus-ring-width) solid var(--color-focus-ring);
  outline-offset: var(--focus-ring-offset);
}

.c-switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  border: var(--border-width) solid var(--color-border-strong);
  border-radius: var(--radius-full);
  background: var(--color-surface-sunken);
  transition: background-color var(--motion-fast) var(--ease-standard);
}

.c-switch::after {
  content: "";
  position: absolute;
  inset-block-start: 2px;
  inset-inline-start: 2px;
  width: 18px;
  height: 18px;
  border-radius: var(--radius-full);
  background: var(--color-border-strong);
  transition: transform var(--motion-fast) var(--ease-standard);
}

.c-switch[aria-checked="true"] {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.c-switch[aria-checked="true"]::after {
  background: var(--color-primary-contrast);
  transform: translateX(20px);
}
```

### 3.5 Controle segmentado (`c-segmented`)

2 a 5 opções (tipo de transação, "Gráfico | Tabela", período, tema).

| Medida | Celular | Desktop |
|---|---|---|
| Contêiner | Fundo `--color-surface-sunken`, padding 4 px, raio `--radius-md`, altura 52 px | Altura 40 px |
| Opção | Altura 44 px, padding `--space-3`, `--text-sm` peso 500, raio `--radius-sm` | Altura 32 px |
| Selecionada | Fundo `--color-surface`, `--elevation-card`, texto `--color-text` peso 600, borda `--color-border`; `aria-checked`/`aria-pressed` | idem |
| Não selecionada | Texto `--color-text-muted`; hover `--color-text` | idem |
| Largura | Opções de largura igual; até 3 opções: largura total no celular | Largura do conteúdo |
| Contadores | Contagem opcional entre parênteses | |

Teclado: setas movem a seleção (padrão de grupo de rádio); `Tab` sai do grupo.

### 3.6 Abas (`c-tabs`)

| Medida | Valor |
|---|---|
| Lista | `role="tablist"`, borda inferior `--border-default`, rolável na horizontal no celular (`overflow-x: auto`, `scrollbar-width: none`, `scroll-snap-type: x proximity`), sem rolagem visível; fade de 24 px na borda quando há mais conteúdo (gradiente de `--color-bg`) |
| Aba | Altura 44 px, padding horizontal `--space-4`, `--text-sm` peso 500, `--color-text-muted`; `role="tab"` |
| Selecionada | Texto `--color-text` peso 600, indicador inferior de 3 px `--color-primary` com raio superior; `aria-selected="true"` |
| Hover | Texto `--color-text`, fundo `--color-row-hover` |
| Foco | Anel interno (offset -2 px) para não ser cortado pela rolagem |
| Contador | Badge pequeno junto ao rótulo ("Detectadas (3)") |
| Painel | `role="tabpanel"` com `tabindex="0"` |

```css
.c-tabs__list {
  display: flex;
  gap: var(--space-1);
  overflow-x: auto;
  scrollbar-width: none;
  border-block-end: var(--border-default);
}

.c-tabs__tab {
  position: relative;
  flex-shrink: 0;
  min-height: var(--touch-target);
  padding-inline: var(--space-4);
  border: 0;
  background: transparent;
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  line-height: var(--leading-sm);
  font-weight: var(--weight-medium);
  cursor: pointer;
}

.c-tabs__tab[aria-selected="true"] {
  color: var(--color-text);
  font-weight: var(--weight-semibold);
}

.c-tabs__tab[aria-selected="true"]::after {
  content: "";
  position: absolute;
  inset-inline: var(--space-3);
  inset-block-end: 0;
  height: 3px;
  border-radius: var(--radius-xs) var(--radius-xs) 0 0;
  background: var(--color-primary);
}

.c-tabs__tab:focus-visible {
  outline-offset: -2px;
}

@media (hover: hover) {
  .c-tabs__tab:hover {
    color: var(--color-text);
    background: var(--color-row-hover);
  }
}
```

### 3.7 Barra de filtros e chips de filtro ativo

| Item | Celular | Desktop |
|---|---|---|
| Busca | Botão `Search` (44 px) que expande o campo sobre o título | Campo de busca de 320 px na barra |
| Filtros | Botão "Filtros 2" (com contador de ativos) abre `c-sheet` com todos os campos; rodapé fixo "Limpar" (secundário) e "Aplicar" (primário) | Linha de seletores (`c-select` de 40 px) com "Mais filtros" |
| Chips ativos | Linha rolável horizontal de `c-tag` removíveis, `--space-2` entre eles | Linha quebrável |
| Densidade (desktop) | Não aparece | `c-segmented` "Confortável | Compacta" |

### 3.7b Seletor de cor de categoria (`c-swatch-picker`)

| Aspecto | Valor |
|---|---|
| Forma | Grade de 12 amostras (`--category-1` a `--category-12`), 44 x 44 px de alvo com círculo visível de 28 px, `--space-2` de espaço; 6 por linha no celular e 12 numa linha em `lg` |
| Semântica | `role="radiogroup"`, cada amostra `role="radio"` com nome acessível ("Azul", "Verde-azulado", "Laranja-queimado", "Rosa-cereja", "Ocre", "Oliva", "Ardósia", "Ciano", "Marrom", "Vinho", "Azul-marinho", "Cinza") |
| Selecionada | Anel de 2 px `--color-text` com offset de 2 px e ícone `Check` de 16 px no centro, em `--color-surface` quando o contraste for suficiente ou com contorno de 1 px `--color-surface-raised`; `aria-checked="true"` |
| Foco | Anel de foco padrão sobre a amostra |
| Armazenamento | Índice 1 a 12 (ver pendência P-UI-10) |

### 3.8 Área de envio (`c-dropzone`)

| Estado | Visual |
|---|---|
| Vazio | Borda tracejada de 2 px `--color-border-strong`, raio `--radius-lg`, fundo `--color-surface`, altura mínima 160 px (celular 120 px), ícone `FileUp` 32 px, texto "Arraste um arquivo .ofx ou .csv aqui" (desktop) / só botão "Selecionar arquivo" (celular), legenda "Até 20 MB" |
| Hover / arrastando | Borda `--color-primary` sólida, fundo `--color-row-selected`, texto "Solte o arquivo para enviar", ícone `Download` |
| Foco | Anel de foco no botão "Selecionar arquivo" (o contêiner é só alvo de soltar) |
| Com arquivo | Borda sólida `--color-border`, linha com ícone `FileText`, nome (truncado), tamanho, botão "Remover" (44 px) |
| Carregando | Barra `c-progress` e texto "Lendo arquivo..." |
| Erro | Borda `--color-danger` sólida, ícone `CircleAlert`, mensagem "Não conseguimos ler este arquivo." e botão "Escolher outro arquivo" |
| Desabilitado | Fundo `--color-disabled-bg`, sem interação |

### 3.9 Indicador de passos (`c-stepper`)

| Aspecto | Celular | Desktop |
|---|---|---|
| Forma | Texto "Passo 2 de 4 · Mapeamento" (`--text-sm`, peso 600) + barra de 4 segmentos (altura 4 px, `--space-1` entre eles) | Lista horizontal: círculo de 32 px com número, rótulo abaixo/ao lado, linha conectora de 2 px |
| Concluído | Segmento `--color-primary`; círculo `--color-primary` com `Check` | |
| Atual | Segmento `--color-primary` + realce; círculo com borda de 2 px `--color-primary`, número `--color-text`, `aria-current="step"` | |
| Futuro | Segmento `--color-track`; círculo com borda `--color-border-strong`, número `--color-text-muted` | |
| Bloqueado | Círculo `--color-disabled-bg`, texto `--color-disabled-text` | |

---

## 4. Exibição de dados

### 4.1 Tabela responsiva (`c-table`) e lista de cartões (`c-card-list`)

A partir de `md` (768 px) o mesmo conjunto de dados aparece em `c-table`; abaixo disso, em `c-card-list`. Colunas por prioridade conforme `sistema-de-layout.md` 7.2.

**Tabela (md e acima)**

| Elemento | Especificação |
|---|---|
| Contêiner | `c-card` sem padding interno (tabela até as bordas), `overflow: hidden`, `border-radius: var(--radius-lg)` |
| Cabeçalho | `<thead>` com fundo `--color-surface-sunken`, texto `--text-sm` peso 600 `--color-text-muted`, altura 40 px, `position: sticky` abaixo do cabeçalho global (`top: var(--header-height)`), `--z-sticky`; em células ordenáveis, `<button>` com `ChevronsUpDown` (neutro), `ArrowUp`/`ArrowDown` (ordenado) e `aria-sort` |
| Linha | Altura 48 px (confortável) ou 40 px (compacta, `data-density="compact"`), borda inferior `--color-border` de 1 px |
| Célula de texto | `--type-table-size`, alinhamento à esquerda, padding horizontal `--space-4` (compacta: `--space-3`), truncamento com reticências |
| Célula numérica | Alinhada à direita, `d-money`, `min-width: 9ch` |
| Hover | Fundo `--color-row-hover` |
| Selecionada | Fundo `--color-row-selected`, checkbox marcado, indicador de 3 px `--color-primary` na borda esquerda |
| Foco | Linha clicável: anel de foco interno (offset -2 px) no elemento interativo da linha |
| Seleção | Primeira coluna de 48 px com `c-checkbox` (cabeçalho: indeterminado quando parcial) |
| Menu da linha | Última coluna de 48 px, `c-icon-button` `EllipsisVertical` (40 px, alvo 40 px) |
| Rodapé de totais | Linha de resumo fora do `<tbody>`, fundo `--color-surface-sunken`, `d-money--md`, refletindo o filtro |
| Estados | `data-state="loading"` (10 linhas de esqueleto), `empty` e `error` (substituem o corpo; cabeçalho permanece) |
| Recarga | Corpo com opacidade 0,6 e barra de progresso fina de 2 px no topo, `aria-busy` |

```css
.c-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: var(--type-table-size);
  line-height: var(--type-table-leading);
  --row-height: 48px;
}

.c-table[data-density="compact"] {
  --row-height: 40px;
}

.c-table__head {
  position: sticky;
  inset-block-start: var(--header-height);
  z-index: var(--z-sticky);
  background: var(--color-surface-sunken);
}

.c-table__cell,
.c-table__heading {
  height: var(--row-height);
  padding-inline: var(--space-4);
  border-block-end: var(--border-default);
  text-align: start;
  vertical-align: middle;
  max-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.c-table__heading {
  height: 40px;
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  color: var(--color-text-muted);
}

.c-table__cell--numeric,
.c-table__heading--numeric {
  text-align: end;
  min-width: 9ch;
  font-variant-numeric: tabular-nums lining-nums;
}

.c-table__row {
  transition: background-color var(--motion-fast) var(--ease-standard);
}

@media (hover: hover) {
  .c-table__row:hover {
    background: var(--color-row-hover);
  }
}

.c-table__row[aria-selected="true"] {
  background: var(--color-row-selected);
  box-shadow: inset 3px 0 0 var(--color-primary);
}

.c-table__sort {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
}
```

**Lista de cartões (celular)**

| Elemento | Especificação |
|---|---|
| Cabeçalho de grupo (dia) | Sobrelinha (`--type-overline`) em `--color-text-muted`, fundo `--color-bg`, altura 32 px, `position: sticky` em `top: calc(var(--header-height) + 52px)` (abaixo do cabeçalho e da barra de período), `--z-sticky`; texto "Hoje, 04 de outubro" |
| Item | Altura mínima 64 px (alvo inteiro de toque >= 44 px), padding `--space-3` `--page-gutter`, fundo `--color-surface`, borda inferior `--border-default`; toda a linha é um único link/botão |
| Linha 1 | Descrição (`--type-body`, peso 500, truncada) à esquerda; valor `d-money--md` à direita, alinhado à direita |
| Linha 2 | Categoria · Conta (`--text-sm`, `--color-text-muted`, truncada) |
| Linha 3 (se houver) | `c-chip` (Interna, Pendente, Dividida) e parcela "3/10", `--space-2` de espaço |
| Hover/ativo | Ativo: fundo `--color-row-selected` |
| Seleção em lote | Toque longo ou botão "Selecionar" no menu; ao ativar, checkbox de 44 px aparece à esquerda; barra de ação fixa no topo substitui o cabeçalho (altura 56 px, `--color-surface-raised`, `--elevation-drawer`) com "3 selecionadas", "Ações" e `X` |
| Foco | Anel interno |
| Estados | Esqueleto (6 itens), vazio e erro em `c-state` |

```css
.c-card-list {
  display: grid;
  background: var(--color-surface);
  border-block: var(--border-default);
}

.c-card-list__group {
  position: sticky;
  inset-block-start: calc(var(--header-height) + 52px);
  z-index: var(--z-sticky);
  display: flex;
  align-items: center;
  min-height: 32px;
  padding-inline: var(--page-gutter);
  background: var(--color-bg);
  font-size: var(--type-overline-size);
  line-height: var(--type-overline-leading);
  font-weight: var(--weight-semibold);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.c-card-list__item {
  display: grid;
  gap: var(--space-1);
  min-height: 64px;
  padding: var(--space-3) var(--page-gutter);
  border-block-end: var(--border-default);
  color: inherit;
  text-decoration: none;
}

.c-card-list__row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-3);
  min-width: 0;
}

.c-card-list__title {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: var(--weight-medium);
}

.c-card-list__meta {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: var(--text-sm);
  line-height: var(--leading-sm);
  color: var(--color-text-muted);
}

.c-card-list__item:active {
  background: var(--color-row-selected);
}
```

### 4.2 Cartão de indicador (`d-kpi`)

| Elemento | Especificação |
|---|---|
| Contêiner | `c-card`, padding `--space-4` (celular) / `--space-6` (lg), altura mínima 112 px (esqueleto da mesma altura) |
| Rótulo | `--type-caption`, `--color-text-muted`, com ícone de 16 px opcional |
| Valor | `d-money--lg` (24/32; 28/36 quando o cartão tem 240 px ou mais de largura, por container query; 18/26 no modo `d-kpi--compact` de duas colunas no celular), peso 600; hero: `d-money--xl` (saldo total) |
| Subtexto | `--type-caption`, `--color-text-muted` ("4 contas", "4 de 5 contas") |
| Variação (`d-kpi__delta`) | Ícone `ArrowUp`/`ArrowDown` 16 px + percentual + referência ("vs. setembro"), `--text-sm` peso 500; cor pela favorabilidade (ver `design-system.md` 4.1); `data-sign="positive|negative|neutral"` |
| Link | "Ver transações" (`c-link`, 44 px de altura de alvo) no rodapé, desktop em linha, celular opcional |
| Composição no celular | Saldo total em linha cheia; Receitas e Despesas lado a lado em duas colunas com `d-kpi--compact` (padding `--space-3`) a partir de 360 px, e empilhados em uma coluna entre 320 e 359 px; Resultado em linha cheia |
| Composição no desktop | `lg` (1024 a 1279): 2 x 2; `xl` e acima: 4 colunas de 3 do grid de 12 (largura interna de cerca de 174 px com viewport de 1280 px; o valor de 24 px cabe até `R$ 999.999,99`) |

| Estado | Visual |
|---|---|
| Padrão | Conforme acima |
| Hover | Se o cartão é clicável (drill-down), fundo `--color-row-hover` e `--elevation-raised`, cursor pointer |
| Foco | Anel de foco no contêiner do link |
| Carregando | Esqueleto: barra de 40% x 12 px (rótulo), barra de 70% x 28 px (valor), barra de 50% x 12 px (variação) |
| Vazio | Valor `R$ 0,00` em `--color-neutral-value` e legenda "Sem dados no período" |
| Erro | Valor substituído por `—`, ícone `OctagonAlert` 16 px e botão "Tentar novamente" (ghost, `--space-2`) |
| Oculto | Valor mascarado (`R$ ••••`), variação monetária mascarada, percentuais visíveis |

```css
.d-kpi {
  display: grid;
  gap: var(--space-1);
  align-content: start;
  min-height: 112px;
}

.d-kpi {
  container-type: inline-size;
}

.d-kpi--compact .d-money--lg {
  font-size: var(--type-kpi-size-compact);
  line-height: var(--type-kpi-leading-compact);
}

@container (min-width: 240px) {
  .d-kpi:not(.d-kpi--compact) .d-money--lg {
    font-size: var(--type-kpi-size-wide);
    line-height: var(--type-kpi-leading-wide);
  }
}

.d-kpi__label {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--type-caption-size);
  line-height: var(--type-caption-leading);
  color: var(--color-text-muted);
}

.d-kpi__delta {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--text-sm);
  line-height: var(--leading-sm);
  font-weight: var(--weight-medium);
  color: var(--color-neutral-value);
}

.d-kpi__delta[data-sign="positive"] {
  color: var(--color-income);
}

.d-kpi__delta[data-sign="negative"] {
  color: var(--color-expense);
}
```

### 4.3 Barras de progresso e de orçamento (`c-progress`, `d-budget-bar`)

`c-progress` (genérico): trilho de 8 px de altura (12 px quando é o elemento principal), raio `--radius-xs`, fundo `--color-track`; preenchimento `--color-primary` com `width` transitando em `--motion-slow` (não na primeira carga). `role="progressbar"` com `aria-valuenow`, `aria-valuemin`, `aria-valuemax` e rótulo; percentual em texto.

`d-budget-bar` (orçamento e limite de cartão):

| Situação | Preenchimento | Padrão | Ícone/texto | Observação |
|---|---|---|---|---|
| Dentro (< 90%) | `--color-success` | Sólido | `CircleCheck` "Dentro do planejado" | |
| Próximo (90 a 100%) | `--color-warning` | Listras diagonais finas | `TriangleAlert` "Próximo do limite" | |
| No limite (100%) | `--color-warning` | Sólido | `CircleCheck` "No limite" | Marca de 100% visível |
| Excedido (> 100%) | `--color-danger` | Listras diagonais largas no trecho excedente | `OctagonAlert` "Excedido em R$ 150,00" | Escala do trilho passa a ser `max(100, pct)` |

Anatomia: linha de título (categoria + situação com ícone e texto), barra, linha de valores ("Realizado R$ 1.950,00 de R$ 1.800,00" e percentual `--text-sm`, peso 600). Marca de limite: linha vertical de 2 px, `--color-text`, 4 px acima e abaixo da barra (apenas quando excedido ou quando o orçamento mostra o limite). Texto de percentual sempre visível. Variante limite de cartão: preenchimento `--color-primary` (neutro) até 80% do limite, `--color-warning` entre 80 e 100%, sem excesso; sempre com percentual e valor "Disponível".

```css
.c-progress {
  position: relative;
  height: 8px;
  border-radius: var(--radius-xs);
  background: var(--color-track);
  overflow: hidden;
}

.c-progress--lg {
  height: 12px;
}

.c-progress__fill {
  height: 100%;
  width: calc(var(--value, 0) * 1%);
  border-radius: inherit;
  background: var(--color-primary);
  transition: width var(--motion-slow) var(--ease-standard);
}

.d-budget-bar {
  position: relative;
  height: 12px;
  border-radius: var(--radius-xs);
  background: var(--color-track);
  overflow: visible;
}

.d-budget-bar__fill {
  position: absolute;
  inset-block: 0;
  inset-inline-start: 0;
  width: calc(var(--fill, 0) * 1%);
  border-radius: var(--radius-xs);
  background: var(--color-success);
}

.d-budget-bar[data-status="warning"] .d-budget-bar__fill {
  background-color: var(--color-warning);
  background-image: repeating-linear-gradient(
    135deg,
    transparent 0 5px,
    color-mix(in srgb, var(--color-surface) 55%, transparent) 5px 7px
  );
}

.d-budget-bar[data-status="error"] .d-budget-bar__fill {
  background-color: var(--color-danger);
}

.d-budget-bar__excess {
  position: absolute;
  inset-block: 0;
  inset-inline-start: calc(var(--fill, 0) * 1%);
  width: calc(var(--excess, 0) * 1%);
  border-radius: 0 var(--radius-xs) var(--radius-xs) 0;
  background-color: var(--color-danger);
  background-image: repeating-linear-gradient(
    135deg,
    transparent 0 4px,
    color-mix(in srgb, var(--color-surface) 70%, transparent) 4px 8px
  );
}

.d-budget-bar__limit {
  position: absolute;
  inset-block: -4px;
  inset-inline-start: calc(var(--limit, 100) * 1%);
  width: 2px;
  background: var(--color-text);
}

@media (forced-colors: active) {
  .d-budget-bar__fill,
  .d-budget-bar__excess {
    forced-color-adjust: none;
    background: Highlight;
    border: 1px solid CanvasText;
  }
}
```

### 4.4 Badge de status (`c-badge`), selo de tipo (`c-chip`) e tag (`c-tag`)

| Componente | Forma | Medidas | Uso |
|---|---|---|---|
| `c-badge` | Pílula (`--radius-full`) | Altura 24 px, padding horizontal `--space-2`, ícone de 16 px + texto `--text-xs` peso 600, gap `--space-1` | Status de conexão, fatura, lote, confiança; `data-status="ok|info|warning|error|neutral"` |
| `c-chip` | Retângulo arredondado (`--radius-sm`) | Altura 24 px, mesmo texto | Selos de transação: Interna, Ignorada, Manual, Pendente, Dividida, Parcela |
| `c-tag` | Pílula com botão de remover | Altura 32 px, padding `--space-3`, texto `--text-sm`; botão `X` de 16 px com área de toque ampliada a 44 x 44 por pseudo-elemento | Tags de transação e filtros ativos |

Mapeamento dos selos de transação (sempre texto + ícone):

| Selo | `data-status` | Ícone | Observação |
|---|---|---|---|
| Interna | `neutral` | `ArrowLeftRight` | Tooltip: "Não conta como receita nem despesa"; "Interna (detectada)" para detecção automática |
| Ignorada | `neutral` | `EyeOff` | |
| Manual | `info` | `PenLine` | |
| Pendente | `warning` | `Hourglass` | |
| Dividida | `neutral` | `Split` | |
| Parcela "3/10" | `neutral` | `CalendarClock` | Número tabular |

| Estado | Visual |
|---|---|
| Padrão | Fundo `--color-{status}-bg`, borda `--color-{status}-border`, texto `--color-{status}-text`, ícone `--color-{status}` |
| Interativo (opcional, filtro) | Hover: borda mais escura; foco com anel; pressionado: fundo `--color-row-selected` |
| `c-tag` removível | Hover no `X`: fundo `--color-row-hover`; foco no botão; rótulo do `X`: "Remover tag casa" |

```css
.c-badge,
.c-chip {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  min-height: 24px;
  padding-inline: var(--space-2);
  border: var(--border-width) solid var(--color-neutral-border);
  background: var(--color-neutral-bg);
  color: var(--color-neutral-text);
  font-size: var(--text-xs);
  line-height: var(--leading-xs);
  font-weight: var(--weight-semibold);
  white-space: nowrap;
}

.c-badge {
  border-radius: var(--radius-full);
}

.c-chip {
  border-radius: var(--radius-sm);
}

[data-status="ok"].c-badge,
[data-status="ok"].c-chip {
  background: var(--color-success-bg);
  border-color: var(--color-success-border);
  color: var(--color-success-text);
}

[data-status="info"].c-badge,
[data-status="info"].c-chip {
  background: var(--color-info-bg);
  border-color: var(--color-info-border);
  color: var(--color-info-text);
}

[data-status="warning"].c-badge,
[data-status="warning"].c-chip {
  background: var(--color-warning-bg);
  border-color: var(--color-warning-border);
  color: var(--color-warning-text);
}

[data-status="error"].c-badge,
[data-status="error"].c-chip {
  background: var(--color-danger-bg);
  border-color: var(--color-danger-border);
  color: var(--color-danger-text);
}

.c-tag {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  min-height: 32px;
  padding-inline: var(--space-3) var(--space-1);
  border: var(--border-width) solid var(--color-border-strong);
  border-radius: var(--radius-full);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: var(--text-sm);
}

.c-tag__remove {
  position: relative;
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border: 0;
  border-radius: var(--radius-full);
  background: transparent;
  color: inherit;
  cursor: pointer;
}

.c-tag__remove::after {
  content: "";
  position: absolute;
  inset: -10px;
}
```

### 4.5 Cartões de entidade

Avatar da instituição (`c-avatar`): círculo de 40 px com as 1 a 2 iniciais da instituição em `--text-sm` peso 600, fundo `--color-neutral-bg`, texto `--color-neutral-text` (logos oficiais só se vierem da Pluggy; ver P-UI-09).

**Conta (`d-account-card`)**

| Aspecto | Celular (item de lista) | Desktop (cartão de lista) |
|---|---|---|
| Estrutura | Cabeçalho de grupo por instituição (sobrelinha); item: apelido, tipo (caption), saldo à direita, `ChevronRight`; altura mínima 72 px | Linha de cartão: avatar, apelido e "Conta corrente" (`--text-sm`), saldo `d-money--md` à direita, selos, `EllipsisVertical` |
| Selos | `Oculta`, `Fora do consolidado`, `Manual` (`c-chip` neutro) | idem |
| Estados | Padrão; hover (`--color-row-hover`); atenção (borda esquerda de 3 px `--color-warning` + `c-badge` "Ação necessária"); oculta (texto `--color-text-muted`, selo "Oculta"); carregando (esqueleto 72 px) | idem |

**Cartão de crédito (`d-card-card`)**

| Aspecto | Valor |
|---|---|
| Medida | Celular: carrossel de seletores (chips "Nubank 1234") com snap + bloco de detalhe; desktop: grade `repeat(auto-fill, minmax(280px, 1fr))` |
| Conteúdo | Avatar + nome + "final 1234" (caption); "Fatura" + `d-money--lg` + `c-badge` do status (Aberta `info`, Fechada `neutral`, Paga `ok`, Vencida `error`); vencimento "Vence 05/11 (3 dias)" com ícone `CalendarClock` e `TriangleAlert` quando <= 3 dias; `d-budget-bar` de limite com "34% usado"; "Disponível R$ 9.860 de R$ 15.000"; "Fecha dia 25 · Vence dia 5" |
| Selecionado (desktop) | Borda de 2 px `--color-primary` e fundo `--color-row-selected`; `aria-current="true"` |
| Estados | Padrão, hover (`--elevation-raised`), foco, selecionado, sem fatura aberta ("Sem fatura aberta", barra ausente), carregando, erro |

**Conexão (`d-connection-card`)**

| Aspecto | Valor |
|---|---|
| Cabeçalho | Avatar, nome da instituição, `c-badge` de status com ícone (Atualizado `ok`, Ação necessária `warning`, Erro de login `error`, Sincronizando `info`) |
| Corpo | Última sincronização ("hoje 14:20 (há 12 min)", `<time>`), dados disponibilizados (chips: Contas, Cartões, Investimentos), consentimento ("válido até 12/03/2027" ou "vence em 12 dias" com `TriangleAlert`), mensagem de erro em linguagem simples |
| Sincronizando | `c-progress` com "Contas ok · Transações 60%" |
| Ações | Botão primário contextual (**Reconectar** quando `warning`/`error`, **Sincronizar** quando `ok`) + menu `EllipsisVertical` (Sincronizar agora, Reconectar, Ver detalhes, Desconectar); celular: botões de 44 px |
| Destaque de problema | Borda esquerda de 3 px na cor do status (apoio; ícone e texto são os sinais primários) |
| Layout | 1 coluna no celular; lista no desktop (cartão por linha, largura total) |
| Estados | Padrão, hover, foco, sincronizando, atenção, erro, desabilitado (ações indisponíveis sem rede), carregando (esqueleto de 3 cartões) |

### 4.6 Paginação (`c-pagination`)

| Aspecto | Celular | Desktop |
|---|---|---|
| Forma | `[<] Página 1 de 11 [>]` com botões de 44 px | Numérica: anterior, 1, 2, 3, ..., 11, próxima (botões de 36 px), "Itens por página" `c-select` (25/50/100) |
| Página atual | Texto | Botão com fundo `--color-primary` e `--color-primary-contrast`, `aria-current="page"` |
| Desabilitado | Anterior na primeira página, próxima na última | idem |
| Texto | "Página 1 de 11" `--text-sm` tabular, `aria-live="polite"` | |

---

## 5. Camadas

### 5.1 Fundo escurecido

```css
.l-overlay-root {
  position: fixed;
  inset: 0;
  z-index: var(--z-modal);
  pointer-events: none;
}

.c-backdrop {
  position: fixed;
  inset: 0;
  background: var(--color-overlay);
  pointer-events: auto;
  animation: c-fade var(--motion-base) var(--ease-enter);
}

@keyframes c-fade {
  from {
    opacity: 0;
  }
}
```

### 5.2 Modal central e folha inferior (`c-modal`, `c-sheet`)

| Aspecto | Celular (folha inferior) | md e acima (modal central) |
|---|---|---|
| Posição | Ancorada na base, largura total, altura máxima 90dvh | Centralizada, `--modal-width-sm` (480) ou `--modal-width-md` (640), altura máxima 85dvh |
| Raio | `--radius-xl` nos cantos superiores | `--radius-xl` nos quatro cantos |
| Fundo e sombra | `--color-surface-raised`, `--elevation-modal` | idem |
| Cabeçalho | Alça de 36 x 4 px (`--color-border-strong`) centralizada, título `--type-h3`, botão `X` de 44 px | Título `--type-h3` (peso 600), `X` de 40 px |
| Corpo | `padding: var(--space-4)`, rolagem interna | `padding: var(--space-6)`, rolagem interna |
| Rodapé | Fixo, `padding` com `env(safe-area-inset-bottom)`, botões em coluna invertida (primário em cima, largura total) ou lado a lado (cancelar à esquerda, primário à direita) quando couberem | Direita: "Cancelar" (ghost) e ação primária; ação destrutiva alinhada à esquerda do rodapé quando houver |
| Passos | Tela cheia com botão voltar e `c-stepper` compacto | Modal 640 px com `c-stepper` horizontal |
| Entrada | `translateY(100%)` para 0, `--motion-slow`, `--ease-enter` | `opacity` e `scale(0.98)`, `--motion-base` |
| Acessibilidade | `role="dialog"` (ou `alertdialog` em destrutivos), `aria-modal="true"`, `aria-labelledby`, `aria-describedby`, focus trap, foco inicial no título ou primeiro controle (no destrutivo, em "Cancelar"), `Esc` fecha, retorno de foco ao gatilho, `body` com `overflow: hidden` |

```css
.c-modal {
  position: fixed;
  inset-inline: 0;
  inset-block-end: 0;
  z-index: var(--z-modal);
  display: flex;
  flex-direction: column;
  max-height: 90dvh;
  background: var(--color-surface-raised);
  border-start-start-radius: var(--radius-xl);
  border-start-end-radius: var(--radius-xl);
  box-shadow: var(--elevation-modal);
  animation: c-sheet-in var(--motion-slow) var(--ease-enter);
}

.c-modal__handle {
  width: 36px;
  height: 4px;
  margin: var(--space-2) auto 0;
  border-radius: var(--radius-full);
  background: var(--color-border-strong);
}

.c-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-2) var(--space-2) var(--space-4);
}

.c-modal__body {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-4);
  overscroll-behavior: contain;
}

.c-modal__footer {
  display: flex;
  flex-direction: column-reverse;
  gap: var(--space-2);
  padding: var(--space-4) var(--space-4) calc(var(--space-4) + env(safe-area-inset-bottom));
  border-block-start: var(--border-default);
}

@keyframes c-sheet-in {
  from {
    transform: translateY(100%);
  }
}

@media (min-width: 768px) {
  .c-modal {
    inset-block: auto;
    inset-inline: 50%;
    inset-block-start: 50%;
    width: min(var(--modal-width-sm), calc(100vw - 2 * var(--page-gutter)));
    max-height: 85dvh;
    transform: translate(-50%, -50%);
    border-radius: var(--radius-xl);
    animation: c-modal-in var(--motion-base) var(--ease-enter);
  }

  .c-modal--md {
    width: min(var(--modal-width-md), calc(100vw - 2 * var(--page-gutter)));
  }

  .c-modal__handle {
    display: none;
  }

  .c-modal__header {
    padding: var(--space-5) var(--space-5) var(--space-2) var(--space-6);
  }

  .c-modal__body {
    padding: var(--space-4) var(--space-6);
  }

  .c-modal__footer {
    flex-direction: row;
    justify-content: flex-end;
    padding: var(--space-4) var(--space-6) var(--space-6);
    border: 0;
  }

  .c-modal__footer-danger {
    margin-inline-end: auto;
  }
}

@keyframes c-modal-in {
  from {
    opacity: 0;
    transform: translate(-50%, -48%) scale(0.98);
  }
}
```

Confirmação destrutiva (`alertdialog`): ícone `OctagonAlert` (48 px, fundo `--color-danger-bg`, ícone `--color-danger`) acima do título no celular; descrição das consequências; "Cancelar" (primeiro no DOM, foco inicial) e botão `danger` com rótulo específico; confirmação por digitação mostra `c-field` e mantém o botão `disabled` até coincidir.

### 5.3 Painel lateral (`c-drawer`)

| Aspecto | Celular | md | lg |
|---|---|---|---|
| Forma | Tela cheia deslizante da direita, botão voltar (`ChevronLeft` 44 px) no cabeçalho | Painel à direita de 420 px sobreposto, fundo escurecido | Painel à direita de `--drawer-width` (480 px), **sem** fundo escurecido, lista visível à esquerda (não é modal) |
| Cabeçalho | Altura 56 px, título, ações | 64 px, título, `X` de 40 px | idem |
| Corpo | Rolagem interna, `padding: var(--space-4)` | `--space-6` | `--space-6` |
| Rodapé | Fixo com safe-area, botões lado a lado | idem | idem |
| Fundo | `--color-surface-raised` | idem + `--elevation-drawer` | `--elevation-drawer` e borda esquerda `--border-default` |
| Entrada | `translateX(100%)` para 0, `--motion-slow` | idem | idem |
| Acessibilidade | `role="dialog"` modal (celular e md); em `lg`, região complementar (`role="complementary"`, `aria-label`) com foco movido ao título e retorno ao fechar; `Esc` fecha | | |

```css
.c-drawer {
  position: fixed;
  inset-block: 0;
  inset-inline-end: 0;
  z-index: var(--z-drawer);
  display: flex;
  flex-direction: column;
  width: 100%;
  background: var(--color-surface-raised);
  box-shadow: var(--elevation-drawer);
  animation: c-drawer-in var(--motion-slow) var(--ease-enter);
}

@keyframes c-drawer-in {
  from {
    transform: translateX(100%);
  }
}

@media (min-width: 768px) {
  .c-drawer {
    width: 420px;
  }
}

@media (min-width: 1024px) {
  .c-drawer {
    width: var(--drawer-width);
    border-inline-start: var(--border-default);
  }
}
```

### 5.4 Popover (`c-popover`) e tooltip (`c-tooltip`)

| Componente | Especificação |
|---|---|
| Popover | Fundo `--color-surface-raised`, borda `--border-default`, raio `--radius-lg`, `--elevation-raised`, padding `--space-4`, largura 280 a 360 px, `--z-popover`, seta opcional; seta de ancoragem de 8 px; em celular vira `c-sheet`; fecha com `Esc` e clique fora; `aria-expanded` no gatilho; foco move-se para dentro (menus) |
| Menu (`⋮`) | `role="menu"`, itens `role="menuitem"` de 40 px (desktop) / 48 px (celular em sheet), ícone 20 px + rótulo, item destrutivo ao final separado por linha e em `--color-danger`; setas, Home/End |
| Tooltip | Fundo `--color-tooltip-bg`, texto `--color-text-inverse` (`--text-sm`), padding `--space-1` `--space-2`, raio `--radius-sm`, máximo 280 px, `--z-popover`; aparece após 400 ms no hover e **imediatamente** no foco; não existe em telas de toque; `role="tooltip"` ligado por `aria-describedby`; some com `Esc` |

### 5.5 Toast (`c-toast`)

| Aspecto | Valor |
|---|---|
| Posição | Desktop: canto inferior direito, 24 px da borda, largura 360 px, empilha para cima com `--space-2`; celular: centralizado acima da barra inferior (`bottom: calc(var(--bottom-nav-height) + env(safe-area-inset-bottom) + var(--space-3))`), largura `calc(100% - 2 * var(--page-gutter))` |
| Forma | `--color-surface-raised`, borda `--border-default`, raio `--radius-md`, `--elevation-toast`, padding `--space-3` `--space-4`, `--z-toast` |
| Anatomia | Ícone de status 20 px (sucesso `CircleCheck`, erro `OctagonAlert`, informação `Info`), mensagem `--text-sm` peso 500, ação opcional (ghost, "Desfazer") e `X` de 44 px; faixa de 4 px na borda esquerda na cor do status |
| Duração | 5 s; com ação, no mínimo 6 s; pausa com foco ou hover; erros persistem até dispensar |
| ARIA | Região `aria-live="polite"` para sucesso e informação; `role="alert"` para erro |
| Entrada e saída | `translateY(8px)` + `opacity`, `--motion-base`; sem animação com movimento reduzido |
| Estados | Sucesso, erro, informação, com ação, empilhados (máx. 3 visíveis) |

### 5.6 Faixa de aviso (`c-banner`)

| Aspecto | Valor |
|---|---|
| Posição | Abaixo do cabeçalho global (e acima da barra de período no celular), largura total |
| Forma | Fundo `--color-{status}-bg`, borda inferior `--color-{status}-border`, padding `--space-3` `--page-gutter` |
| Anatomia | Ícone 20 px, texto `--text-sm` peso 500 em `--color-{status}-text`, ação (`c-button--sm` secondary, ex.: "Sincronizar agora", "Reconectar"), `X` de 44 px se descartável |
| Variantes | `info`, `success`, `warning`, `error` (via `data-status`); persistente (conexão com erro) ou descartável (dados desatualizados dispensável por sessão) |
| Celular | Texto e ação empilhados; ação com largura total |
| ARIA | `role="status"` (info e warning) ou `role="alert"` (error) |

---

## 6. Estados de bloco (`c-state`)

Cada bloco de dados define `data-state="loading|ready|empty|error"` (`sistema-de-layout.md` 10).

### 6.1 Carregando (esqueleto)

| Regra | Valor |
|---|---|
| Forma | Barras `c-skeleton` com a geometria final (alturas: texto 14 px, título 20 px, valor 28 px, linha de tabela 48 px, gráfico = altura do gráfico); raio `--radius-sm` |
| Cor | `--color-skeleton-base` com brilho `--color-skeleton-shine` varrendo da esquerda para a direita em 1,4 s; estático com `prefers-reduced-motion` |
| Atraso | Aparece apenas se a carga ultrapassar 150 ms |
| ARIA | Contêiner `aria-busy="true"` e `<span class="u-visually-hidden">Carregando...</span>` |

```css
.c-skeleton {
  display: block;
  border-radius: var(--radius-sm);
  background: var(--color-skeleton-base);
  background-image: linear-gradient(
    90deg,
    var(--color-skeleton-base) 0%,
    var(--color-skeleton-shine) 50%,
    var(--color-skeleton-base) 100%
  );
  background-size: 200% 100%;
  animation: c-shimmer 1.4s linear infinite;
}

@keyframes c-shimmer {
  from {
    background-position: 200% 0;
  }
  to {
    background-position: -200% 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .c-skeleton {
    animation: none;
    background-image: none;
  }
}
```

### 6.2 Vazio

| Variante | Conteúdo |
|---|---|
| Vazio de origem | Ícone em 48 px dentro de círculo de 80 px (`--color-surface-sunken`, ícone `--color-text-muted`), título `--type-h3`, explicação `--text-sm` `--color-text-muted` (máx. 40 caracteres de largura), até 2 ações (1 primária + 1 secundária) |
| Vazio de filtro | Ícone `FileSearch`, título, explicação e "Limpar filtros" (secundário), `role="status"` |
| Medidas | Centralizado, `padding-block: var(--space-16)` no desktop, `var(--space-12)` no celular; ações empilhadas com largura total no celular, em linha no desktop |
| Contexto | Dentro de `c-card` (blocos) ou direto sobre `--color-bg` (tela inteira) |

### 6.3 Erro

| Variante | Conteúdo |
|---|---|
| Erro de bloco | Ícone `OctagonAlert` 32 px (círculo `--color-danger-bg`), mensagem (o que aconteceu), causa quando conhecida, garantia "Seus dados não foram alterados.", botão "Tentar novamente" (secundário), `role="alert"`; refaz só o bloco |
| Erro de tela | Mesmo padrão centralizado com 48 px, "Tentar novamente" e "Voltar ao Dashboard" |
| Referência de suporte | "Ref.: 7F3A" em `--font-mono` `--text-xs` `--color-text-muted` |
| Erro parcial | Conteúdo disponível + `c-banner--warning` interno ao bloco |

```css
.c-state {
  display: grid;
  justify-items: center;
  gap: var(--space-3);
  padding-block: var(--space-12);
  padding-inline: var(--space-4);
  text-align: center;
}

.c-state__icon {
  display: grid;
  place-items: center;
  width: 80px;
  height: 80px;
  border-radius: var(--radius-full);
  background: var(--color-surface-sunken);
  color: var(--color-text-muted);
}

.c-state[data-state="error"] .c-state__icon {
  background: var(--color-danger-bg);
  color: var(--color-danger);
}

.c-state__text {
  max-width: 40ch;
  font-size: var(--text-sm);
  line-height: var(--leading-sm);
  color: var(--color-text-muted);
}

.c-state__actions {
  display: grid;
  gap: var(--space-2);
  width: 100%;
  max-width: 320px;
}

@media (min-width: 768px) {
  .c-state {
    padding-block: var(--space-16);
  }

  .c-state__actions {
    grid-auto-flow: column;
    width: auto;
    max-width: none;
  }
}
```

---

## 7. Zona de perigo (`c-danger-zone`)

Bloco ao final de "Dados e privacidade". Borda de 1 px `--color-danger-border`, fundo `--color-surface`, raio `--radius-lg`, padding `--space-4`/`--space-6`. Cabeçalho com ícone `OctagonAlert` (`--color-danger`) e título "Zona de perigo" em `--color-danger-text`. Cada ação é uma linha (descrição à esquerda, `c-button--danger-outline` à direita; no celular, botão abaixo da descrição, largura total). A ação nunca é `primary`. A confirmação ocorre em modal de passos (`c-modal`), com botão final `c-button--danger`.

---

## 8. Resumo de comportamento por breakpoint

| Componente | base (< 768) | md (768 a 1023) | lg (>= 1024) |
|---|---|---|---|
| Navegação | `c-bottom-nav` + sheet "Mais" | `c-side-nav` em trilho de 72 px | `c-side-nav` expandido de 256 px, recolhível |
| Cabeçalho | 56 px; título, olho, sync reduzido, sino | 56 px; + período, sync completo | 64 px; + botão sincronizar, menu do usuário |
| Período | Barra sticky 52 px | No cabeçalho | No cabeçalho |
| Tabela | `c-card-list` | `c-table` sem colunas de prioridade 3 | `c-table` completa, densidade configurável |
| Painel de detalhe | Tela cheia | Painel 420 px sobreposto | Painel 480 px, lista visível |
| Modais | Folha inferior | Modal central | Modal central |
| Campos | 44 px, fonte 16 px | 44 px | 40 px, fonte 15 px |
| Botões | 44 px | 44 px | 40 px (`sm` 32 px) |
| Toast | Acima da barra inferior | Canto inferior direito | Canto inferior direito |
| Popover | Folha inferior | Ancorado | Ancorado |
| Gráfico | Altura reduzida, legenda abaixo, rolagem interna opcional | Altura intermediária | Altura completa, legenda lateral quando couber |
| Ação de criação | `c-fab` onde aplicável | Botão no cabeçalho da página | Botão no cabeçalho da página |

---

## 9. Lista de verificação visual (para a revisão da Etapa 1.4)

- [ ] Nenhum componente usa valores literais de cor, tamanho de fonte ou espaçamento; só tokens.
- [ ] Todo controle tem alvo de 44 x 44 px no celular, com 8 px de separação entre alvos adjacentes.
- [ ] Todo controle tem foco visível de 2 px com offset de 2 px nos dois temas.
- [ ] Todo valor monetário usa `d-money` com números tabulares; sinal e estado oculto conforme `design-system.md` seção 10.
- [ ] Status de conexão, orçamento, fatura e transação têm ícone e texto, além da cor.
- [ ] Cada bloco de dados tem esqueleto, vazio e erro com a geometria definida em `c-state`.
- [ ] Hover aplicado somente com `@media (hover: hover)`.
- [ ] `prefers-reduced-motion` desativa transições e animações não essenciais.
- [ ] Modal, folha e painel têm `role`, `aria-modal`, focus trap, `Esc` e retorno de foco.
- [ ] Ações destrutivas usam `c-button--danger` ou `danger-outline` com rótulo específico e confirmação adequada.
