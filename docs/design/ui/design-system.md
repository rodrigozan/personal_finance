# Design System — Painel Financeiro Pessoal

**Etapa:** 1.2 (Sprint 1) — Design visual e design system
**Agente:** UI Designer
**Data:** 05/10/2026
**Base:** `docs/design/ux/sistema-de-layout.md` (nomes de tokens, breakpoints, nomenclatura BEM `l-`, `c-`, `d-`, `u-`), `arquitetura-de-informacao.md`, `wireframes.md`, URS v1.1 (RNF-USA-01 a 04, RF-CFG-01, RF-CFG-03)
**Consumidores:** Frontend Developer (mockups da Etapa 1.3 e, na Sprint 2, Next.js + Tailwind v4), UX Architect (revisão cruzada da Etapa 1.4)
**Documentos irmãos:** `componentes.md`, `guia-de-graficos.md`, `telas.md`
**Revisão de identidade (05/10/2026):** o titular reprovou o índigo; a cor de ação passou a ser roxo escuro, com nova escala (seção 1.3), neutros com subtom de roxo, informação em azul-céu e paleta categórica sem roxo. Todos os valores e as tabelas de contraste (seções 7 e 8) foram recalculados por script, com zero falhas.

Este documento fixa os valores concretos de todos os tokens nomeados pelo UX Architect, nos temas claro, escuro e sistema, a identidade visual própria do produto e a validação de contraste WCAG 2.1 AA. Os valores de contraste das seções 7 e 8 foram calculados por script (fórmula de luminância relativa da WCAG 2.1) sobre os mesmos valores hexadecimais que constam no CSS da seção 3; nenhuma razão foi estimada.

---

## 1. Identidade visual

### 1.1 Direção

Produto pessoal independente. Nenhuma relação com marcas, paletas ou guias de outros projetos. A prioridade é **legibilidade de números, confiança e calma**; a interface não compete com os dados.

| Atributo | Decisão |
|---|---|
| Caráter | Sóbrio, moderno, preciso. Superfícies planas e quietas; cor reservada ao significado (receita, despesa, status) e a uma única cor de ação |
| Cor de ação (marca) | **Roxo escuro** (`#5B21B6` no claro, `#B79DF3` lavanda dessaturada no escuro), decisão do titular. O roxo é exclusivo da marca, da ação e da seleção: verde é receita e sucesso, vermelho é despesa e erro, âmbar é alerta, azul-céu (`#0369A1`) é informação, e nenhuma série de gráfico nem categoria usa roxo (seção 1.3) |
| Neutros | Família **cinza-ameixa** (matiz 250 a 265, saturação de 6% a 18%), com subtom de roxo quase imperceptível, para reduzir o brilho do branco puro e dar coerência com a marca; no escuro, superfícies roxo-ardósia profundas. Nenhum neutro chega perto da saturação da cor de ação |
| Tipografia | **Inter** (variável), sem serifa, com números tabulares em todo valor monetário |
| Forma | Raios moderados (6 a 12 px), cartões com borda fina e sombra mínima; sem gradientes decorativos, sem vidro fosco, sem ilustrações pesadas |
| Movimento | Curto e funcional (120 a 320 ms); nenhum movimento decorativo |
| Ícones | `lucide-react`, traço de 1,75 px, cantos arredondados, sempre acompanhando texto ou `aria-label` |
| Tom da interface | Direto e calmo, em português do Brasil; avisos informam o que aconteceu e o que fazer, sem alarmismo |

### 1.2 Logotipo e marca-d'água

Símbolo: quadrado de cantos arredondados com três barras ascendentes (leitura de "painel" e "evolução"), em roxo escuro (`--color-primary`). Wordmark "Painel Financeiro" em Inter 600. Em contextos sem espaço (trilho de 72 px, favicon) usa-se só o símbolo.

```html
<svg class="c-logo" viewBox="0 0 32 32" width="32" height="32" role="img" aria-label="Painel Financeiro">
  <rect width="32" height="32" rx="8" fill="var(--color-primary)"/>
  <rect x="8" y="17" width="4" height="8" rx="1.5" fill="var(--color-primary-contrast)"/>
  <rect x="14" y="12" width="4" height="13" rx="1.5" fill="var(--color-primary-contrast)"/>
  <rect x="20" y="7" width="4" height="18" rx="1.5" fill="var(--color-primary-contrast)"/>
</svg>
```

| Contexto | Regra |
|---|---|
| Menu lateral expandido | Símbolo 32 px + wordmark `--text-lg` peso 600, `--color-text` |
| Trilho (72 px) e cabeçalho celular | Apenas símbolo 32 px |
| Login | Símbolo 40 px + wordmark `--text-xl` |
| Favicon e ícone de instalação | Símbolo sobre quadrado `--color-primary`, sem borda |
| `<meta name="theme-color">` | `#F6F5F9` (claro) e `#0E0B16` (escuro), via duas metas com `media="(prefers-color-scheme: ...)"` |

### 1.3 Paleta de marca (escala do roxo)

Matiz base 266 a 270. A escala abaixo é a fonte dos tokens de ação; os tokens da seção 3 usam apenas os degraus indicados na coluna "Papel".

| Degrau | Hex | Papel |
|---|---|---|
| 50 | #F5F1FD | Reserva (fundos de destaque muito suaves) |
| 100 | #EEE8FB | `--color-row-selected` (claro): linha, item de menu e cartão selecionados |
| 200 | #DCCFF6 | Fundos de selo de marca, hover de item secundário |
| 300 | #C4AEEE | Bordas de destaque suaves |
| 400 | #A57FE2 | Reserva |
| 500 | #8B55D6 | Reserva |
| 600 | #7C3AED | `--color-focus-ring` (claro) |
| **700** | **#5B21B6** | **`--color-primary` (claro)**: botão primário, ícone de marca, marcador de não lido, contador do sino |
| 800 | #4C1D95 | `--color-primary-hover` e `--color-text-link` (claro) |
| 900 | #3B1676 | `--color-primary-active` (claro) |
| 950 | #26104A | Reserva (texto sobre fundos roxos claros) |

Tema escuro: ação em lavanda dessaturada `#B79DF3` (hover `#C7B4F7`, ativo `#D8CBFA`, foco e link `#CDBBF9`), texto sobre ela `#0E0B16`, seleção `#2A2047`. Superfícies: `#0E0B16` (página), `#171321` (cartão), `#1F1A2D` (elevada), `#0A0810` (rebaixada).

**Regras de convivência com a cor de ação**

| Colisão possível | Solução |
|---|---|
| Informação | Deixou de ser azul-royal: usa azul-céu (`#0369A1` claro, `#5FB8EC` escuro), matiz 200, a mais de 60 graus do roxo (ΔE 69) (ΔE 69); sempre com ícone `Info` e texto |
| Selos "Interna", "Ignorada" e neutros | Cinza-ameixa de saturação baixa (`--color-internal`, `--color-neutral-*`), nunca roxo saturado; o texto do selo identifica o estado |
| Paleta categórica e séries | Nenhum dos 12 tons está entre os matizes 245 e 320 (roxo, violeta, índigo); a série 1 é azul (matiz 217), claramente diferente do roxo da ação (distância perceptual ΔE de 44 no claro e de 25 no escuro, no mínimo) |
| Variação de roxo | Existe um único roxo de ação por tema; as variações (hover, ativo, selecionado, foco) são degraus da mesma escala, nunca matizes novos |
| Receita, despesa, alerta | Receita e sucesso passam de verde a ciano (`#0E7490` claro, `#2BB6E6` escuro), decisão do titular; vermelho `#B91C1C` e âmbar `#B45309` inalterados |

---

## 2. Arquitetura dos tokens

| Camada | Descrição |
|---|---|
| Tokens semânticos | Os únicos usados por componentes (`--color-surface`, `--space-4`, `--radius-md`...). Nomes idênticos aos de `sistema-de-layout.md` (seções 5 e 6) |
| Valores | Definidos em três blocos: claro em `:root`; escuro em `@media (prefers-color-scheme: dark)` para `:root:not([data-theme="light"])`; escuro em `:root[data-theme="dark"]`. Os dois blocos escuros têm conteúdo idêntico |
| Tokens acrescentados | Variantes necessárias ao design visual, sem alterar nenhum nome do UX: `-bg`, `-border`, `-text`, `-hover`, `-active`, `-contrast`, `--color-income-bg`, `--color-expense-bg`, `--color-internal-bg`, `--color-neutral-*`, `--color-track`, `--color-row-hover`, `--color-row-selected`, `--color-tooltip-bg`, `--color-danger-*`, `--category-1` a `--category-12`, `--chart-income`, `--chart-expense`, `--z-skip`, `--focus-ring-*`, `--elevation-*`, `--ease-enter`, `--ease-exit` |
| Regra | Nenhum componente usa hexadecimal, `rgb()` literal ou nome de cor. Valores literais existem somente neste bloco de tokens |

### 2.1 Mapeamento para Tailwind v4 (Sprint 2)

Recomendação para o Frontend Developer: declarar os tokens de cor no bloco `@theme static` com os valores do tema claro e sobrescrever os mesmos nomes nos blocos escuros de `app/globals.css`. Os utilitários do Tailwind compilam para `var(--color-...)`, então `bg-surface` e `text-income` mudam de tema sem variante `dark:`. Assim os nomes são 1:1 entre mockup e app (princípio P8). Antes de implementar, o Frontend Developer deve conferir esse comportamento no guia de `node_modules/next/dist/docs/` e na documentação do Tailwind v4 instalada, conforme `AGENTS.md`.

```css
@theme static {
  --color-bg: #F6F5F9;
  --color-surface: #FFFFFF;
  --color-text: #17132B;
  --color-income: #047857;
  --color-expense: #B91C1C;
  --font-sans: "Inter", "Inter Fallback", system-ui, sans-serif;
  --radius-md: 0.5rem;
}

:root[data-theme="dark"] {
  --color-bg: #0E0B16;
  --color-surface: #171321;
  --color-text: #EAE6F5;
  --color-income: #2BB6E6;
  --color-expense: #F87171;
}
```

O exemplo é ilustrativo e parcial; a lista completa é o CSS da seção 3.

---

## 3. Tokens em CSS (prontos para uso)

### 3.1 Cores, tema claro (padrão)

```css
:root {
  color-scheme: light;

  --color-bg: #F6F5F9;
  --color-surface: #FFFFFF;
  --color-surface-raised: #FFFFFF;
  --color-surface-sunken: #EDEAF3;
  --color-overlay: rgb(23 19 43 / 0.5);

  --color-text: #17132B;
  --color-text-muted: #4C4663;
  --color-text-inverse: #FFFFFF;
  --color-text-link: #4C1D95;

  --color-border: #D9D5E4;
  --color-border-strong: #7F7898;
  --color-focus-ring: #7C3AED;

  --color-primary: #5B21B6;
  --color-primary-hover: #4C1D95;
  --color-primary-active: #3B1676;
  --color-primary-contrast: #FFFFFF;

  --color-income: #0E7490;
  --color-income-bg: #E3F4F9;
  --color-expense: #B91C1C;
  --color-expense-bg: #FDECEC;
  --color-internal: #4C4663;
  --color-internal-bg: #E9E6F0;
  --color-neutral-value: #5D5775;

  --color-success: #0E7490;
  --color-success-bg: #E3F4F9;
  --color-success-border: #7CC4D8;
  --color-success-text: #155E75;
  --color-info: #0369A1;
  --color-info-bg: #E6F3FA;
  --color-info-border: #8CC3E3;
  --color-info-text: #075985;
  --color-warning: #B45309;
  --color-warning-bg: #FEF3DC;
  --color-warning-border: #E7B15A;
  --color-warning-text: #7C3A06;
  --color-danger: #B91C1C;
  --color-danger-bg: #FDECEC;
  --color-danger-border: #EE9A9A;
  --color-danger-text: #991B1B;
  --color-danger-hover: #991B1B;
  --color-danger-contrast: #FFFFFF;
  --color-neutral-bg: #E9E6F0;
  --color-neutral-border: #CBC6DA;
  --color-neutral-text: #342E4A;

  --color-row-hover: #F1EFF6;
  --color-row-selected: #EEE8FB;
  --color-tooltip-bg: #17132B;
  --color-track: #DFDBE9;
  --color-skeleton-base: #E6E3EE;
  --color-skeleton-shine: #F2F0F7;
  --color-disabled-bg: #E5E2EC;
  --color-disabled-text: #6C6684;

  --chart-1: #2563C4;
  --chart-2: #0B7F70;
  --chart-3: #C2570C;
  --chart-4: #C2255C;
  --chart-5: #8A6D00;
  --chart-6: #4F7D1A;
  --chart-7: #5A6B85;
  --chart-8: #0A7C99;
  --chart-grid: #E3E0EC;
  --chart-axis: #4C4663;
  --chart-income: var(--color-income);
  --chart-expense: var(--color-expense);

  --category-1: var(--chart-1);
  --category-2: var(--chart-2);
  --category-3: var(--chart-3);
  --category-4: var(--chart-4);
  --category-5: var(--chart-5);
  --category-6: var(--chart-6);
  --category-7: var(--chart-7);
  --category-8: var(--chart-8);
  --category-9: #8A5A2B;
  --category-10: #8F2434;
  --category-11: #1F3A7A;
  --category-12: #6B7280;

  --shadow-xs: 0 1px 2px rgb(23 19 43 / 0.06);
  --shadow-sm: 0 1px 3px rgb(23 19 43 / 0.08), 0 1px 2px rgb(23 19 43 / 0.04);
  --shadow-md: 0 4px 12px rgb(23 19 43 / 0.10), 0 2px 4px rgb(23 19 43 / 0.05);
  --shadow-lg: 0 12px 28px rgb(23 19 43 / 0.14), 0 4px 8px rgb(23 19 43 / 0.06);
  --shadow-xl: 0 24px 48px rgb(23 19 43 / 0.18), 0 8px 16px rgb(23 19 43 / 0.08);
}
```

### 3.2 Cores, tema escuro (dois blocos de conteúdo idêntico)

Bloco 1, modo sistema (sem `data-theme` forçando claro):

```css
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    color-scheme: dark;

    --color-bg: #0E0B16;
    --color-surface: #171321;
    --color-surface-raised: #1F1A2D;
    --color-surface-sunken: #0A0810;
    --color-overlay: rgb(0 0 0 / 0.6);

    --color-text: #EAE6F5;
    --color-text-muted: #A59DBB;
    --color-text-inverse: #0E0B16;
    --color-text-link: #CDBBF9;

    --color-border: #2D2642;
    --color-border-strong: #6F6693;
    --color-focus-ring: #CDBBF9;

    --color-primary: #B79DF3;
    --color-primary-hover: #C7B4F7;
    --color-primary-active: #D8CBFA;
    --color-primary-contrast: #0E0B16;

    --color-income: #2BB6E6;
    --color-income-bg: #0B2733;
    --color-expense: #F87171;
    --color-expense-bg: #341618;
    --color-internal: #A59DBB;
    --color-internal-bg: #211B33;
    --color-neutral-value: #9A92B3;

    --color-success: #2BB6E6;
    --color-success-bg: #0B2733;
    --color-success-border: #1B6A87;
    --color-success-text: #8FDDF5;
    --color-info: #5FB8EC;
    --color-info-bg: #0F2536;
    --color-info-border: #28597D;
    --color-info-text: #A6D8F6;
    --color-warning: #FBBF24;
    --color-warning-bg: #33260A;
    --color-warning-border: #7A5A12;
    --color-warning-text: #FCD679;
    --color-danger: #F87171;
    --color-danger-bg: #341618;
    --color-danger-border: #7F2D2D;
    --color-danger-text: #FCA5A5;
    --color-danger-hover: #FCA5A5;
    --color-danger-contrast: #0E0B16;
    --color-neutral-bg: #211B33;
    --color-neutral-border: #3A3253;
    --color-neutral-text: #D0C9E0;

    --color-row-hover: #1B1629;
    --color-row-selected: #2A2047;
    --color-tooltip-bg: #EAE6F5;
    --color-track: #2F2849;
    --color-skeleton-base: #1E182E;
    --color-skeleton-shine: #2A2340;
    --color-disabled-bg: #1D1830;
    --color-disabled-text: #766E92;

    --chart-1: #4D8EEA;
    --chart-2: #2DD4BF;
    --chart-3: #F59E54;
    --chart-4: #F472A0;
    --chart-5: #E3C34A;
    --chart-6: #A3C93A;
    --chart-7: #7F9BC7;
    --chart-8: #3CC3E0;
    --chart-grid: #271F3A;
    --chart-axis: #A59DBB;

    --category-9: #D4A373;
    --category-10: #E0746B;
    --category-11: #A9C8F7;
    --category-12: #9A97A8;

    --shadow-xs: 0 1px 2px rgb(0 0 0 / 0.35);
    --shadow-sm: 0 1px 3px rgb(0 0 0 / 0.40), 0 1px 2px rgb(0 0 0 / 0.30);
    --shadow-md: 0 4px 12px rgb(0 0 0 / 0.45), 0 2px 4px rgb(0 0 0 / 0.30);
    --shadow-lg: 0 12px 28px rgb(0 0 0 / 0.55), 0 4px 8px rgb(0 0 0 / 0.35);
    --shadow-xl: 0 24px 48px rgb(0 0 0 / 0.65), 0 8px 16px rgb(0 0 0 / 0.40);
  }
}
```

Bloco 2, escuro forçado (mesmos valores):

```css
:root[data-theme="dark"] {
  color-scheme: dark;

  --color-bg: #0E0B16;
  --color-surface: #171321;
  --color-surface-raised: #1F1A2D;
  --color-surface-sunken: #0A0810;
  --color-overlay: rgb(0 0 0 / 0.6);

  --color-text: #EAE6F5;
  --color-text-muted: #A59DBB;
  --color-text-inverse: #0E0B16;
  --color-text-link: #CDBBF9;

  --color-border: #2D2642;
  --color-border-strong: #6F6693;
  --color-focus-ring: #CDBBF9;

  --color-primary: #B79DF3;
  --color-primary-hover: #C7B4F7;
  --color-primary-active: #D8CBFA;
  --color-primary-contrast: #0E0B16;

  --color-income: #2BB6E6;
  --color-income-bg: #0B2733;
  --color-expense: #F87171;
  --color-expense-bg: #341618;
  --color-internal: #A59DBB;
  --color-internal-bg: #211B33;
  --color-neutral-value: #9A92B3;

  --color-success: #2BB6E6;
  --color-success-bg: #0B2733;
  --color-success-border: #1B6A87;
  --color-success-text: #8FDDF5;
  --color-info: #5FB8EC;
  --color-info-bg: #0F2536;
  --color-info-border: #28597D;
  --color-info-text: #A6D8F6;
  --color-warning: #FBBF24;
  --color-warning-bg: #33260A;
  --color-warning-border: #7A5A12;
  --color-warning-text: #FCD679;
  --color-danger: #F87171;
  --color-danger-bg: #341618;
  --color-danger-border: #7F2D2D;
  --color-danger-text: #FCA5A5;
  --color-danger-hover: #FCA5A5;
  --color-danger-contrast: #0E0B16;
  --color-neutral-bg: #211B33;
  --color-neutral-border: #3A3253;
  --color-neutral-text: #D0C9E0;

  --color-row-hover: #1B1629;
  --color-row-selected: #2A2047;
  --color-tooltip-bg: #EAE6F5;
  --color-track: #2F2849;
  --color-skeleton-base: #1E182E;
  --color-skeleton-shine: #2A2340;
  --color-disabled-bg: #1D1830;
  --color-disabled-text: #766E92;

  --chart-1: #4D8EEA;
  --chart-2: #2DD4BF;
  --chart-3: #F59E54;
  --chart-4: #F472A0;
  --chart-5: #E3C34A;
  --chart-6: #A3C93A;
  --chart-7: #7F9BC7;
  --chart-8: #3CC3E0;
  --chart-grid: #271F3A;
  --chart-axis: #A59DBB;

  --category-9: #D4A373;
  --category-10: #E0746B;
  --category-11: #A9C8F7;
  --category-12: #9A97A8;

  --shadow-xs: 0 1px 2px rgb(0 0 0 / 0.35);
  --shadow-sm: 0 1px 3px rgb(0 0 0 / 0.40), 0 1px 2px rgb(0 0 0 / 0.30);
  --shadow-md: 0 4px 12px rgb(0 0 0 / 0.45), 0 2px 4px rgb(0 0 0 / 0.30);
  --shadow-lg: 0 12px 28px rgb(0 0 0 / 0.55), 0 4px 8px rgb(0 0 0 / 0.35);
  --shadow-xl: 0 24px 48px rgb(0 0 0 / 0.65), 0 8px 16px rgb(0 0 0 / 0.40);
}

:root[data-theme="light"] {
  color-scheme: light;
}
```

Observação: o bloco `:root[data-theme="light"]` não redefine tokens; o `:root` já é claro. Ele existe só para fixar `color-scheme`.

### 3.3 Tipografia

```css
:root {
  --font-sans: "Inter", "Inter Fallback", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --font-mono: ui-monospace, "SFMono-Regular", "Cascadia Mono", Menlo, Consolas, monospace;

  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.75rem;
  --text-4xl: 2rem;
  --text-5xl: 2.25rem;

  --leading-xs: 1rem;
  --leading-sm: 1.25rem;
  --leading-base: 1.5rem;
  --leading-lg: 1.625rem;
  --leading-xl: 1.75rem;
  --leading-2xl: 2rem;
  --leading-3xl: 2.25rem;
  --leading-4xl: 2.5rem;
  --leading-5xl: 2.75rem;

  --weight-regular: 400;
  --weight-medium: 500;
  --weight-semibold: 600;
  --weight-bold: 700;

  --tracking-tight: -0.02em;
  --tracking-normal: 0;
  --tracking-wide: 0.06em;

  --type-display-size: var(--text-4xl);
  --type-display-leading: var(--leading-4xl);
  --type-kpi-size: var(--text-2xl);
  --type-kpi-leading: var(--leading-2xl);
  --type-kpi-size-wide: var(--text-3xl);
  --type-kpi-leading-wide: var(--leading-3xl);
  --type-kpi-size-compact: var(--text-lg);
  --type-kpi-leading-compact: var(--leading-lg);
  --type-h1-size: 1.375rem;
  --type-h1-leading: 1.75rem;
  --type-h2-size: var(--text-lg);
  --type-h2-leading: 1.5rem;
  --type-h3-size: var(--text-base);
  --type-h3-leading: var(--leading-base);
  --type-body-size: var(--text-base);
  --type-body-leading: var(--leading-base);
  --type-table-size: var(--text-base);
  --type-table-leading: var(--leading-base);
  --type-caption-size: var(--text-sm);
  --type-caption-leading: var(--leading-sm);
  --type-overline-size: var(--text-xs);
  --type-overline-leading: var(--leading-xs);
}

@media (min-width: 1024px) {
  :root {
    --type-display-size: var(--text-5xl);
    --type-display-leading: var(--leading-5xl);
    --type-h1-size: var(--text-3xl);
    --type-h1-leading: var(--leading-3xl);
    --type-h2-size: var(--text-xl);
    --type-h2-leading: var(--leading-xl);
    --type-body-size: 0.9375rem;
    --type-body-leading: 1.375rem;
    --type-table-size: var(--text-sm);
    --type-table-leading: var(--leading-sm);
  }
}
```

### 3.4 Espaçamento, raio, bordas, elevação, movimento, camadas, layout

```css
:root {
  --space-0: 0;
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;

  --radius-xs: 0.25rem;
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-full: 9999px;

  --border-width: 1px;
  --border-width-strong: 2px;
  --border-default: var(--border-width) solid var(--color-border);
  --border-control: var(--border-width) solid var(--color-border-strong);

  --focus-ring-width: 2px;
  --focus-ring-offset: 2px;

  --elevation-card: var(--shadow-xs);
  --elevation-raised: var(--shadow-md);
  --elevation-drawer: var(--shadow-lg);
  --elevation-modal: var(--shadow-xl);
  --elevation-toast: var(--shadow-lg);

  --motion-fast: 120ms;
  --motion-base: 200ms;
  --motion-slow: 320ms;
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --ease-enter: cubic-bezier(0, 0, 0, 1);
  --ease-exit: cubic-bezier(0.4, 0, 1, 1);

  --z-sticky: 10;
  --z-nav: 20;
  --z-popover: 30;
  --z-drawer: 40;
  --z-modal: 50;
  --z-toast: 60;
  --z-skip: 100;

  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;
  --container-2xl: 1440px;

  --nav-width: 256px;
  --nav-width-collapsed: 72px;
  --header-height: 56px;
  --bottom-nav-height: 56px;
  --drawer-width: 480px;
  --modal-width-sm: 480px;
  --modal-width-md: 640px;
  --touch-target: 44px;

  --page-gutter: 16px;
  --grid-gap: 16px;
  --grid-cols: 4;
}

@media (min-width: 768px) {
  :root {
    --page-gutter: 24px;
    --grid-cols: 8;
  }
}

@media (min-width: 1024px) {
  :root {
    --page-gutter: 32px;
    --grid-gap: 24px;
    --grid-cols: 12;
    --header-height: 64px;
  }
}

@media (min-width: 1280px) {
  :root {
    --container-page: var(--container-xl);
  }
}

@media (min-width: 1536px) {
  :root {
    --container-page: var(--container-2xl);
  }
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --motion-fast: 0ms;
    --motion-base: 0ms;
    --motion-slow: 0ms;
  }
}
```

Nota: `sistema-de-layout.md` usa `max-width: var(--container-xl)` no esqueleto de `.l-page`. O token `--container-page` acima é o valor efetivo por breakpoint (1280 px em `xl`, 1440 px em `2xl`, ver pendência P-UI-01 na seção 14); `l-page` deve usar `max-width: var(--container-page, 100%)`.

### 3.5 Base mínima

```css
html {
  font-family: var(--font-sans);
  font-size: 100%;
  color: var(--color-text);
  background: var(--color-bg);
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
}

body {
  font-size: var(--type-body-size);
  line-height: var(--type-body-leading);
  font-weight: var(--weight-regular);
  min-height: 100dvh;
  -webkit-font-smoothing: antialiased;
}

:focus-visible {
  outline: var(--focus-ring-width) solid var(--color-focus-ring);
  outline-offset: var(--focus-ring-offset);
}

input:focus-visible,
select:focus-visible,
textarea:focus-visible {
  outline: var(--focus-ring-width) solid var(--color-focus-ring);
  outline-offset: 0;
}

::selection {
  background: var(--color-row-selected);
  color: var(--color-text);
}

@media (forced-colors: active) {
  :focus-visible {
    outline-color: Highlight;
  }
}

.u-visually-hidden {
  position: absolute !important;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}

.u-tabular {
  font-variant-numeric: tabular-nums lining-nums;
}
```

---

## 4. Paleta semântica financeira

### 4.1 Significado das cores

| Papel | Token de texto/ícone | Token de fundo | Quando usar | Sinal não cromático obrigatório |
|---|---|---|---|---|
| Receita | `--color-income` | `--color-income-bg` | Valor de receita, entradas, variação favorável de receita, barra de entradas | Sinal `+` quando a direção importa, ícone `ArrowDownLeft` (entrada) ao lado do valor em listas densas, rótulo "Receita" |
| Despesa | `--color-expense` | `--color-expense-bg` | Valor de despesa, saídas, barra de saídas | Sinal `-` sempre (RN-01), ícone `ArrowUpRight` (saída) em listas densas, rótulo "Despesa" |
| Interno / transferência | `--color-internal` | `--color-internal-bg` | Transferências internas, transações ignoradas, pagamento de fatura | Selo textual "Interna" ou "Ignorada"; valor sem sinal de cor; ícone `ArrowLeftRight` |
| Valor neutro | `--color-neutral-value` | `--color-neutral-bg` | `R$ 0,00`, valor indisponível, saldo sem classificação | Texto "R$ 0,00" ou "—" |
| Sucesso | `--color-success` (`-text`) | `--color-success-bg` | Sincronizado, fatura paga, meta cumprida, orçamento dentro do limite | Ícone `CircleCheck` + texto |
| Informação | `--color-info` (`-text`) | `--color-info-bg` | Sincronizando, dicas, avisos neutros | Ícone `Info` + texto |
| Alerta | `--color-warning` (`-text`) | `--color-warning-bg` | Desatualizado, orçamento próximo do limite, consentimento a vencer | Ícone `TriangleAlert` + texto |
| Erro | `--color-danger` (`-text`) | `--color-danger-bg` | Falha de conexão, orçamento excedido, ação destrutiva | Ícone `OctagonAlert` ou `CircleX` + texto |

Regras:

- Receita é verde-esmeralda e despesa é vermelho-tijolo; a distinção é redundante com o sinal (+/-), a posição (valor à direita) e o ícone de seta. Nunca depender só da cor (RNF-USA-04).
- Verde e vermelho têm luminâncias distintas nos dois temas (ver razões da seção 7), o que preserva a separação para daltonismo vermelho-verde; ainda assim o sinal textual é obrigatório.
- Cor de despesa não indica erro. Um valor `-R$ 212,30` em vermelho é normal; para erro usa-se ícone, texto e fundo `--color-danger-bg`.
- **Variação** (▲/▼ em cartões de indicador): a seta indica a direção (subiu ou caiu); a cor indica se a variação é favorável ou desfavorável ao titular. Receita subindo é favorável (`--color-income`); despesa caindo é favorável (`--color-income`); despesa subindo é desfavorável (`--color-expense`); receita caindo é desfavorável (`--color-expense`). O texto sempre traz a referência ("vs. setembro"). Ver pendência P-UI-02.
- Saldos (positivos ou negativos) usam `--color-text`; só ficam vermelhos quando negativos e a semântica é de dívida (conta no vermelho, fatura). Resultado do mês e variações usam as cores financeiras.

### 4.2 Estados de conexão e sincronização

Mapeiam a máquina de estados de `arquitetura-de-informacao.md` 7.3 e os status de `d-connection-card`. Ícones são do `lucide-react`.

| Estado | `data-status` | Cor (ícone/texto) | Fundo / borda | Ícone | Texto | Animação |
|---|---|---|---|---|---|---|
| Atualizado | `ok` | `--color-success-text` / ícone `--color-success` | `--color-success-bg` / `--color-success-border` | `CircleCheck` | "Atualizado há 12 min" | nenhuma |
| Sincronizando | `info` | `--color-info-text` / ícone `--color-info` | `--color-info-bg` / `--color-info-border` | `RefreshCw` (giro lento 1,2 s) | "Sincronizando... 2 de 4" | giro; estático com `prefers-reduced-motion` |
| Desatualizado | `warning` | `--color-warning-text` / ícone `--color-warning` | `--color-warning-bg` / `--color-warning-border` | `Clock` | "Desatualizado há 2 dias" | nenhuma |
| Atenção | `warning` | `--color-warning-text` / ícone `--color-warning` | `--color-warning-bg` / `--color-warning-border` | `TriangleAlert` | "1 conexão precisa de ação" | nenhuma |
| Erro | `error` | `--color-danger-text` / ícone `--color-danger` | `--color-danger-bg` / `--color-danger-border` | `OctagonAlert` | "Falha ao sincronizar" | nenhuma |
| Sem conexões | `neutral` | `--color-neutral-text` / ícone `--color-internal` | `--color-neutral-bg` / `--color-neutral-border` | `Link2` | "Nenhuma conexão" | nenhuma |
| Sem rede | `neutral` | `--color-neutral-text` / ícone `--color-internal` | `--color-neutral-bg` / `--color-neutral-border` | `CloudOff` | "Sem conexão com a internet" | nenhuma |

Atenção e Desatualizado compartilham a família de alerta; a distinção é feita pelo ícone (`Clock` x `TriangleAlert`) e pelo texto, nunca pela cor.

Status adicionais de entidades (badges): Aberta (`info`, `CircleDot`), Fechada (`neutral`, `Lock`), Paga (`ok`, `CircleCheck`), Projetada (`neutral` tracejado, `CalendarClock`), Vencida (`error`, `OctagonAlert`), Ativo/Desfeito de lote (`ok`/`neutral`), Confiança Alta/Média/Baixa (`ok`/`warning`/`neutral`, texto sempre presente).

### 4.3 Barras de orçamento e de limite

| Situação | Condição | Preenchimento | Ícone | Texto | Padrão da barra |
|---|---|---|---|---|---|
| Dentro | < 90% | `--color-success` | `CircleCheck` | "Dentro do planejado" | sólido |
| Próximo | 90% a 100% | `--color-warning` | `TriangleAlert` | "Próximo do limite" | listras diagonais finas sobre o preenchimento |
| No limite | exatamente 100% | `--color-warning` | `CircleCheck` | "No limite" | sólido, marca de limite em 100% |
| Excedido | > 100% | `--color-danger` | `OctagonAlert` | "Excedido em R$ 150,00" | listras diagonais largas e trecho excedente além da marca de 100% |

O limiar de 90% segue a preferência de alerta do wireframe (`Avisar a partir de [90]%`); o componente recebe o limiar por propriedade. Detalhes em `componentes.md`.

---

## 5. Paleta categórica (categorias e gráficos)

### 5.1 Princípios

| Princípio | Regra |
|---|---|
| Tamanho | 8 cores para gráficos (`--chart-1` a `--chart-8`) e 12 para categorias (`--category-1` a `--category-12`, as 8 primeiras idênticas às de gráfico) |
| Ordem de uso | **Categorias** usam sempre a cor do próprio índice (`--category-N`), para que a mesma categoria tenha a mesma cor em listas, gráficos e relatórios. **Séries sem identidade própria** (cartões, instituições, classes de investimento, parcelas por cartão) usam `--chart-1` a `--chart-8` em ordem fixa, da maior para a menor. Em gráficos com mais de 7 itens, os menores são agrupados em "Outros" (`--category-12`, cinza) |
| Matiz | Alterna famílias frias e quentes entre vizinhas (azul, verde-azulado, laranja, rosa-cereja, ocre, oliva, ardósia, ciano) para separação em sequência. **Não há roxo, violeta nem índigo**: o roxo é exclusivo da marca (seção 1.3). Distância perceptual mínima entre as 8 séries: ΔE 19,5 (claro) e 28,2 (escuro), contra 14,8 da paleta anterior |
| Contraste | Todas as cores têm razão >= 3:1 contra `--color-surface` e `--color-bg` nos dois temas (seção 8) |
| Tema | A paleta escura é própria (tons claros e dessaturados), não inversão automática |
| Cor não é único sinal | Todo gráfico tem rótulo direto, legenda com valor e percentual, e tabela alternativa; séries de linha usam marcadores distintos; áreas e barras de séries adjacentes usam padrões (ver `guia-de-graficos.md`) |
| Texto sobre cor | Não se coloca texto sobre preenchimentos categóricos (a cor `--chart-3` claro tem 4,50:1 contra branco, no limite); rótulos ficam fora da forma |
| Receita x despesa | Gráficos que comparam entradas e saídas usam `--chart-income` e `--chart-expense` em vez da paleta categórica |

### 5.2 Valores e uso

| Token | Claro | Escuro | Matiz | Uso preferencial |
|---|---|---|---|---|
| `--chart-1` / `--category-1` | #2563C4 | #4D8EEA | Azul | 1ª série; patrimônio; saldo |
| `--chart-2` / `--category-2` | #0B7F70 | #2DD4BF | Verde-azulado | 2ª série |
| `--chart-3` / `--category-3` | #C2570C | #F59E54 | Laranja-queimado | 3ª série |
| `--chart-4` / `--category-4` | #C2255C | #F472A0 | Rosa-cereja | 4ª série |
| `--chart-5` / `--category-5` | #8A6D00 | #E3C34A | Ocre | 5ª série |
| `--chart-6` / `--category-6` | #4F7D1A | #A3C93A | Oliva | 6ª série |
| `--chart-7` / `--category-7` | #5A6B85 | #7F9BC7 | Ardósia | 7ª série |
| `--chart-8` / `--category-8` | #0A7C99 | #3CC3E0 | Ciano | 8ª série |
| `--category-9` | #8A5A2B | #D4A373 | Marrom | Apenas categorias |
| `--category-10` | #8F2434 | #E0746B | Vinho | Apenas categorias |
| `--category-11` | #1F3A7A | #A9C8F7 | Azul-marinho | Apenas categorias |
| `--category-12` | #6B7280 | #9A97A8 | Cinza | "Outros" e categorias sem cor |
| `--chart-grid` | #E3E0EC | #271F3A | Neutro | Linhas de grade (decorativas) |
| `--chart-axis` | #4C4663 | #A59DBB | Neutro | Texto dos eixos (4,5:1) |

O seletor de cor da categoria (Categorias e regras) oferece essas 12 cores como amostras 44 x 44 px com nome acessível ("Azul", "Verde-azulado"...) e marca de seleção `Check`; a cor armazenada é o índice (1 a 12), não o hexadecimal, para que cada tema use a variante adequada.

---

## 6. Cor e sinais alternativos (resumo normativo)

| Informação | Canais obrigatórios além da cor |
|---|---|
| Receita x despesa | Sinal `+`/`-`, alinhamento, ícone de seta, rótulo textual em tabelas ("Receita", "Despesa") e filtros |
| Transferência interna / ignorada | Selo "Interna" / "Ignorada" (texto), ícone `ArrowLeftRight`, valor sem sinal |
| Status de conexão e sincronização | Ícone distinto por estado e texto |
| Orçamento (dentro, próximo, excedido) | Ícone, texto, padrão da barra e percentual numérico |
| Fatura (aberta, fechada, paga, projetada, vencida) | Texto do selo; projetada com borda tracejada |
| Variação (▲/▼) | Seta, valor percentual, texto de referência |
| Seleção (linha, categoria, aba) | Marca `Check`/indicador de borda além do fundo; `aria-selected`/`aria-current` |
| Erro de campo | Ícone `CircleAlert`, mensagem de texto, borda de 2 px, `aria-invalid` |
| Gráficos | Rótulo direto, legenda, marcadores e padrões, tabela alternativa |
| Foco | Anel de 2 px com offset de 2 px (forma), nunca só mudança de cor de fundo |

---

## 7. Contraste WCAG 2.1 AA: método e resumo

### 7.1 Método

| Item | Definição |
|---|---|
| Fórmula | Razão de contraste da WCAG 2.1: `(L1 + 0,05) / (L2 + 0,05)`, com `L` a luminância relativa sRGB (limiar linear 0,03928) |
| Limiares | Texto normal 4,5:1 (1.4.3); texto grande (>= 24 px, ou >= 18,66 px em negrito) 3:1; componentes de interface, ícones informativos e gráficos 3:1 (1.4.11) |
| Cobertura | Cada par de primeiro plano e fundo que o design usa de fato, nos temas claro e escuro, incluindo texto de botões, badges, links, valores financeiros, rótulos de eixo, bordas de campo, anel de foco, ícones de status, preenchimentos de barras e cada cor categórica |
| Execução | Cálculo por script sobre os hexadecimais do CSS da seção 3; arredondamento a duas casas. O script e os valores são reproduzíveis: qualquer alteração de token exige recalcular a tabela da seção 8 |
| Resultado | **Zero falhas** nas 2 x (35 pares de texto + 23 pares de componentes + 12 cores categóricas) verificações |

### 7.2 Resumo dos mínimos

| Categoria | Tema claro | Tema escuro |
|---|---|---|
| Texto (menor razão) | 4,91:1 (receita sobre `--color-income-bg`) | 5,96:1 (despesa sobre `--color-expense-bg`) |
| Texto principal sobre superfícies | de 15,17:1 a 18,03:1 | de 13,78:1 a 16,24:1 |
| Texto secundário sobre superfícies | de 7,47:1 a 8,89:1 | de 6,54:1 a 7,71:1 |
| Componentes e ícones (menor razão) | 3,69:1 (preenchimento de barra de alerta sobre o trilho) | 3,21:1 (borda de campo sobre `--color-surface-raised`) |
| Paleta categórica (menor razão) | 4,15:1 (`--chart-3` sobre `--color-bg`) | 5,53:1 (`--chart-1` sobre `--color-surface`) |

### 7.3 Itens isentos ou decorativos (documentados, não ocultados)

| Item | Razão medida | Tratamento |
|---|---|---|
| `--color-border` (borda de cartão e divisores) | 1,44:1 claro; 1,27:1 escuro | Decorativa: a informação nunca depende dela; o contorno do cartão é reforçado por `--color-surface` x `--color-bg` e pela sombra. Controles que precisam ser identificados (campos, checkbox, select, botão secundário) usam `--color-border-strong` (3:1) |
| `--color-*-border` dos status | de 1,90 a 2,16:1 claro; de 2,01 a 2,86:1 escuro | Decorativas: o significado vem do ícone e do texto (contrastes de 4,56:1 ou mais, ver tabela) |
| `--color-track` (trilho de barras) | 1,36:1 claro; 1,32:1 escuro sobre a superfície | O preenchimento tem 3:1 sobre o trilho e sobre a superfície; o valor também é dado em texto (percentual e valores) |
| `--color-disabled-text` sobre `--color-disabled-bg` | 4,24:1 claro; 3,60:1 escuro | Componentes inativos são isentos (WCAG 1.4.3); mesmo assim ficam acima de 3:1 e vêm acompanhados de texto auxiliar quando relevante |
| `--chart-grid` | decorativo | Linhas de grade não carregam informação; valores estão nos eixos e na tabela alternativa |
| Esqueleto (`--color-skeleton-*`) | decorativo | Estado transitório sem informação |
| `--color-surface` x `--color-bg` | 1,09:1 claro | Separação sutil de superfície; a borda e a sombra delimitam o cartão |

### 7.4 Regras de uso derivadas

- Texto de corpo e de valores usa só pares da tabela de texto; texto secundário (`--color-text-muted`) é o mais claro permitido para texto, inclusive rótulos, placeholders e texto de ajuda. **Não existe um terceiro nível de cinza para texto.**
- Placeholder usa `--color-text-muted`; nunca substitui o rótulo.
- Texto sobre botão primário usa `--color-primary-contrast`; sobre botão perigo, `--color-danger-contrast`.
- Ícones informativos isolados (sem texto adjacente) usam a cor do par de 3:1; ícones decorativos usam `currentColor` herdado.
- O anel de foco (`--color-focus-ring`) é validado contra `--color-bg`, `--color-surface` e `--color-surface-raised`; como tem offset de 2 px, nunca fica sobre o preenchimento do próprio controle.
- Nenhuma cor semântica é usada como cor de texto sobre fundo colorido de outro papel (por exemplo, texto de despesa sobre fundo de sucesso); cada fundo `-bg` aceita apenas o seu `-text` e o seu ícone.

---

## 8. Razões de contraste calculadas

As tabelas a seguir foram geradas por script a partir dos tokens da seção 3.

### Tabela de contraste, tema claro

**Texto (mínimo 4,5:1, WCAG 1.4.3)**

| Par | Primeiro plano | Fundo | Razão | Resultado |
|---|---|---|---|---|
| Texto principal sobre fundo da página | `--color-text` #17132B | `--color-bg` #F6F5F9 | 16,61:1 | Passa AA |
| Texto principal sobre superfície (cartão) | `--color-text` #17132B | `--color-surface` #FFFFFF | 18,03:1 | Passa AA |
| Texto principal sobre superfície elevada | `--color-text` #17132B | `--color-surface-raised` #FFFFFF | 18,03:1 | Passa AA |
| Texto principal sobre superfície rebaixada | `--color-text` #17132B | `--color-surface-sunken` #EDEAF3 | 15,17:1 | Passa AA |
| Texto secundário sobre fundo da página | `--color-text-muted` #4C4663 | `--color-bg` #F6F5F9 | 8,19:1 | Passa AA |
| Texto secundário sobre superfície | `--color-text-muted` #4C4663 | `--color-surface` #FFFFFF | 8,89:1 | Passa AA |
| Texto secundário sobre superfície elevada | `--color-text-muted` #4C4663 | `--color-surface-raised` #FFFFFF | 8,89:1 | Passa AA |
| Texto secundário sobre superfície rebaixada | `--color-text-muted` #4C4663 | `--color-surface-sunken` #EDEAF3 | 7,47:1 | Passa AA |
| Texto secundário sobre linha em hover | `--color-text-muted` #4C4663 | `--color-row-hover` #F1EFF6 | 7,79:1 | Passa AA |
| Texto principal sobre linha selecionada | `--color-text` #17132B | `--color-row-selected` #EEE8FB | 15,09:1 | Passa AA |
| Link sobre superfície | `--color-text-link` #4C1D95 | `--color-surface` #FFFFFF | 10,95:1 | Passa AA |
| Link sobre fundo da página | `--color-text-link` #4C1D95 | `--color-bg` #F6F5F9 | 10,09:1 | Passa AA |
| Link sobre item de menu ativo / linha selecionada | `--color-text-link` #4C1D95 | `--color-row-selected` #EEE8FB | 9,17:1 | Passa AA |
| Texto do botão primário | `--color-primary-contrast` #FFFFFF | `--color-primary` #5B21B6 | 8,98:1 | Passa AA |
| Texto do botão primário em hover | `--color-primary-contrast` #FFFFFF | `--color-primary-hover` #4C1D95 | 10,95:1 | Passa AA |
| Texto do botão primário pressionado | `--color-primary-contrast` #FFFFFF | `--color-primary-active` #3B1676 | 13,44:1 | Passa AA |
| Texto do botão perigo | `--color-danger-contrast` #FFFFFF | `--color-danger` #B91C1C | 6,47:1 | Passa AA |
| Texto do botão perigo em hover | `--color-danger-contrast` #FFFFFF | `--color-danger-hover` #991B1B | 8,31:1 | Passa AA |
| Valor de receita sobre superfície | `--color-income` #047857 | `--color-surface` #FFFFFF | 5,48:1 | Passa AA |
| Valor de receita sobre fundo da página | `--color-income` #047857 | `--color-bg` #F6F5F9 | 5,05:1 | Passa AA |
| Valor de receita sobre fundo de receita | `--color-income` #047857 | `--color-income-bg` #E6F6EF | 4,91:1 | Passa AA |
| Valor de despesa sobre superfície | `--color-expense` #B91C1C | `--color-surface` #FFFFFF | 6,47:1 | Passa AA |
| Valor de despesa sobre fundo da página | `--color-expense` #B91C1C | `--color-bg` #F6F5F9 | 5,96:1 | Passa AA |
| Valor de despesa sobre fundo de despesa | `--color-expense` #B91C1C | `--color-expense-bg` #FDECEC | 5,66:1 | Passa AA |
| Valor interno / transferência sobre superfície | `--color-internal` #4C4663 | `--color-surface` #FFFFFF | 8,89:1 | Passa AA |
| Valor interno sobre fundo interno | `--color-internal` #4C4663 | `--color-internal-bg` #E9E6F0 | 7,21:1 | Passa AA |
| Valor neutro (zero) sobre superfície | `--color-neutral-value` #5D5775 | `--color-surface` #FFFFFF | 6,81:1 | Passa AA |
| Valor neutro (zero) sobre fundo da página | `--color-neutral-value` #5D5775 | `--color-bg` #F6F5F9 | 6,27:1 | Passa AA |
| Badge de sucesso | `--color-success-text` #065F46 | `--color-success-bg` #E6F6EF | 6,88:1 | Passa AA |
| Badge de informação | `--color-info-text` #075985 | `--color-info-bg` #E6F3FA | 6,69:1 | Passa AA |
| Badge de alerta | `--color-warning-text` #7C3A06 | `--color-warning-bg` #FEF3DC | 7,74:1 | Passa AA |
| Badge de erro | `--color-danger-text` #991B1B | `--color-danger-bg` #FDECEC | 7,28:1 | Passa AA |
| Badge neutro | `--color-neutral-text` #342E4A | `--color-neutral-bg` #E9E6F0 | 10,42:1 | Passa AA |
| Tooltip | `--color-text-inverse` #FFFFFF | `--color-tooltip-bg` #17132B | 18,03:1 | Passa AA |
| Rótulos dos eixos de gráfico sobre superfície | `--chart-axis` #4C4663 | `--color-surface` #FFFFFF | 8,89:1 | Passa AA |

**Componentes de interface e gráficos (mínimo 3:1, WCAG 1.4.11)**

| Par | Primeiro plano | Fundo | Razão | Resultado |
|---|---|---|---|---|
| Borda de campo e controle sobre superfície | `--color-border-strong` #7F7898 | `--color-surface` #FFFFFF | 4,16:1 | Passa AA |
| Borda de campo e controle sobre fundo da página | `--color-border-strong` #7F7898 | `--color-bg` #F6F5F9 | 3,84:1 | Passa AA |
| Borda de campo sobre superfície elevada | `--color-border-strong` #7F7898 | `--color-surface-raised` #FFFFFF | 4,16:1 | Passa AA |
| Anel de foco sobre superfície | `--color-focus-ring` #7C3AED | `--color-surface` #FFFFFF | 5,70:1 | Passa AA |
| Anel de foco sobre fundo da página | `--color-focus-ring` #7C3AED | `--color-bg` #F6F5F9 | 5,25:1 | Passa AA |
| Anel de foco sobre superfície elevada | `--color-focus-ring` #7C3AED | `--color-surface-raised` #FFFFFF | 5,70:1 | Passa AA |
| Preenchimento do botão primário sobre superfície | `--color-primary` #5B21B6 | `--color-surface` #FFFFFF | 8,98:1 | Passa AA |
| Preenchimento do botão primário sobre fundo da página | `--color-primary` #5B21B6 | `--color-bg` #F6F5F9 | 8,28:1 | Passa AA |
| Ícone de receita sobre superfície | `--color-income` #047857 | `--color-surface` #FFFFFF | 5,48:1 | Passa AA |
| Ícone de despesa sobre superfície | `--color-expense` #B91C1C | `--color-surface` #FFFFFF | 6,47:1 | Passa AA |
| Ícone interno sobre superfície | `--color-internal` #4C4663 | `--color-surface` #FFFFFF | 8,89:1 | Passa AA |
| Ícone de sucesso sobre fundo de badge | `--color-success` #047857 | `--color-success-bg` #E6F6EF | 4,91:1 | Passa AA |
| Ícone de informação sobre fundo de badge | `--color-info` #0369A1 | `--color-info-bg` #E6F3FA | 5,25:1 | Passa AA |
| Ícone de alerta sobre fundo de badge | `--color-warning` #B45309 | `--color-warning-bg` #FEF3DC | 4,56:1 | Passa AA |
| Ícone de erro sobre fundo de badge | `--color-danger` #B91C1C | `--color-danger-bg` #FDECEC | 5,66:1 | Passa AA |
| Ícone de sucesso sobre superfície | `--color-success` #047857 | `--color-surface` #FFFFFF | 5,48:1 | Passa AA |
| Ícone de informação sobre superfície | `--color-info` #0369A1 | `--color-surface` #FFFFFF | 5,93:1 | Passa AA |
| Ícone de alerta sobre superfície | `--color-warning` #B45309 | `--color-surface` #FFFFFF | 5,02:1 | Passa AA |
| Ícone de erro sobre superfície | `--color-danger` #B91C1C | `--color-surface` #FFFFFF | 6,47:1 | Passa AA |
| Preenchimento de barra (sucesso) sobre trilho | `--color-success` #047857 | `--color-track` #DFDBE9 | 4,03:1 | Passa AA |
| Preenchimento de barra (alerta) sobre trilho | `--color-warning` #B45309 | `--color-track` #DFDBE9 | 3,69:1 | Passa AA |
| Preenchimento de barra (erro) sobre trilho | `--color-danger` #B91C1C | `--color-track` #DFDBE9 | 4,76:1 | Passa AA |
| Preenchimento de barra (primário) sobre trilho | `--color-primary` #5B21B6 | `--color-track` #DFDBE9 | 6,61:1 | Passa AA |

**Paleta categórica contra a superfície e contra o fundo da página (mínimo 3:1)**

| Token | Valor | Sobre `--color-surface` | Sobre `--color-bg` | Resultado |
|---|---|---|---|---|
| `--chart-1` / `--category-1` | #2563C4 | 5,74:1 | Azul | 1ª série; patrimônio; saldo |
| `--chart-2` / `--category-2` | #0B7F70 | 4,90:1 | Verde-azulado | 2ª série |
| `--chart-3` / `--category-3` | #C2570C | 4,50:1 | Laranja-queimado | 3ª série |
| `--chart-4` / `--category-4` | #C2255C | 5,66:1 | Rosa-cereja | 4ª série |
| `--chart-5` / `--category-5` | #8A6D00 | 4,92:1 | Ocre | 5ª série |
| `--chart-6` / `--category-6` | #4F7D1A | 4,91:1 | Oliva | 6ª série |
| `--chart-7` / `--category-7` | #5A6B85 | 5,42:1 | Ardósia | 7ª série |
| `--chart-8` / `--category-8` | #0A7C99 | 4,82:1 | Ciano | 8ª série |
| `--chart-9` / `--category-9` | #8A5A2B | 5,87:1 | 5,41:1 | Passa AA |
| `--chart-10` / `--category-10` | #8F2434 | 8,50:1 | 7,83:1 | Passa AA |
| `--chart-11` / `--category-11` | #1F3A7A | 10,80:1 | 9,95:1 | Passa AA |
| `--chart-12` / `--category-12` | #6B7280 | 4,83:1 | 4,45:1 | Passa AA |

### Tabela de contraste, tema escuro

**Texto (mínimo 4,5:1, WCAG 1.4.3)**

| Par | Primeiro plano | Fundo | Razão | Resultado |
|---|---|---|---|---|
| Texto principal sobre fundo da página | `--color-text` #EAE6F5 | `--color-bg` #0E0B16 | 15,89:1 | Passa AA |
| Texto principal sobre superfície (cartão) | `--color-text` #EAE6F5 | `--color-surface` #171321 | 14,88:1 | Passa AA |
| Texto principal sobre superfície elevada | `--color-text` #EAE6F5 | `--color-surface-raised` #1F1A2D | 13,78:1 | Passa AA |
| Texto principal sobre superfície rebaixada | `--color-text` #EAE6F5 | `--color-surface-sunken` #0A0810 | 16,24:1 | Passa AA |
| Texto secundário sobre fundo da página | `--color-text-muted` #A59DBB | `--color-bg` #0E0B16 | 7,55:1 | Passa AA |
| Texto secundário sobre superfície | `--color-text-muted` #A59DBB | `--color-surface` #171321 | 7,07:1 | Passa AA |
| Texto secundário sobre superfície elevada | `--color-text-muted` #A59DBB | `--color-surface-raised` #1F1A2D | 6,54:1 | Passa AA |
| Texto secundário sobre superfície rebaixada | `--color-text-muted` #A59DBB | `--color-surface-sunken` #0A0810 | 7,71:1 | Passa AA |
| Texto secundário sobre linha em hover | `--color-text-muted` #A59DBB | `--color-row-hover` #1B1629 | 6,82:1 | Passa AA |
| Texto principal sobre linha selecionada | `--color-text` #EAE6F5 | `--color-row-selected` #2A2047 | 12,27:1 | Passa AA |
| Link sobre superfície | `--color-text-link` #CDBBF9 | `--color-surface` #171321 | 10,48:1 | Passa AA |
| Link sobre fundo da página | `--color-text-link` #CDBBF9 | `--color-bg` #0E0B16 | 11,20:1 | Passa AA |
| Link sobre item de menu ativo / linha selecionada | `--color-text-link` #CDBBF9 | `--color-row-selected` #2A2047 | 8,65:1 | Passa AA |
| Texto do botão primário | `--color-primary-contrast` #0E0B16 | `--color-primary` #B79DF3 | 8,47:1 | Passa AA |
| Texto do botão primário em hover | `--color-primary-contrast` #0E0B16 | `--color-primary-hover` #C7B4F7 | 10,48:1 | Passa AA |
| Texto do botão primário pressionado | `--color-primary-contrast` #0E0B16 | `--color-primary-active` #D8CBFA | 12,84:1 | Passa AA |
| Texto do botão perigo | `--color-danger-contrast` #0E0B16 | `--color-danger` #F87171 | 7,04:1 | Passa AA |
| Texto do botão perigo em hover | `--color-danger-contrast` #0E0B16 | `--color-danger-hover` #FCA5A5 | 10,26:1 | Passa AA |
| Valor de receita sobre superfície | `--color-income` #34D399 | `--color-surface` #171321 | 9,49:1 | Passa AA |
| Valor de receita sobre fundo da página | `--color-income` #34D399 | `--color-bg` #0E0B16 | 10,13:1 | Passa AA |
| Valor de receita sobre fundo de receita | `--color-income` #34D399 | `--color-income-bg` #0F2A22 | 7,95:1 | Passa AA |
| Valor de despesa sobre superfície | `--color-expense` #F87171 | `--color-surface` #171321 | 6,59:1 | Passa AA |
| Valor de despesa sobre fundo da página | `--color-expense` #F87171 | `--color-bg` #0E0B16 | 7,04:1 | Passa AA |
| Valor de despesa sobre fundo de despesa | `--color-expense` #F87171 | `--color-expense-bg` #341618 | 5,96:1 | Passa AA |
| Valor interno / transferência sobre superfície | `--color-internal` #A59DBB | `--color-surface` #171321 | 7,07:1 | Passa AA |
| Valor interno sobre fundo interno | `--color-internal` #A59DBB | `--color-internal-bg` #211B33 | 6,41:1 | Passa AA |
| Valor neutro (zero) sobre superfície | `--color-neutral-value` #9A92B3 | `--color-surface` #171321 | 6,20:1 | Passa AA |
| Valor neutro (zero) sobre fundo da página | `--color-neutral-value` #9A92B3 | `--color-bg` #0E0B16 | 6,62:1 | Passa AA |
| Badge de sucesso | `--color-success-text` #86EFC1 | `--color-success-bg` #0F2A22 | 11,01:1 | Passa AA |
| Badge de informação | `--color-info-text` #A6D8F6 | `--color-info-bg` #0F2536 | 10,29:1 | Passa AA |
| Badge de alerta | `--color-warning-text` #FCD679 | `--color-warning-bg` #33260A | 10,57:1 | Passa AA |
| Badge de erro | `--color-danger-text` #FCA5A5 | `--color-danger-bg` #341618 | 8,69:1 | Passa AA |
| Badge neutro | `--color-neutral-text` #D0C9E0 | `--color-neutral-bg` #211B33 | 10,33:1 | Passa AA |
| Tooltip | `--color-text-inverse` #0E0B16 | `--color-tooltip-bg` #EAE6F5 | 15,89:1 | Passa AA |
| Rótulos dos eixos de gráfico sobre superfície | `--chart-axis` #A59DBB | `--color-surface` #171321 | 7,07:1 | Passa AA |

**Componentes de interface e gráficos (mínimo 3:1, WCAG 1.4.11)**

| Par | Primeiro plano | Fundo | Razão | Resultado |
|---|---|---|---|---|
| Borda de campo e controle sobre superfície | `--color-border-strong` #6F6693 | `--color-surface` #171321 | 3,47:1 | Passa AA |
| Borda de campo e controle sobre fundo da página | `--color-border-strong` #6F6693 | `--color-bg` #0E0B16 | 3,71:1 | Passa AA |
| Borda de campo sobre superfície elevada | `--color-border-strong` #6F6693 | `--color-surface-raised` #1F1A2D | 3,21:1 | Passa AA |
| Anel de foco sobre superfície | `--color-focus-ring` #CDBBF9 | `--color-surface` #171321 | 10,48:1 | Passa AA |
| Anel de foco sobre fundo da página | `--color-focus-ring` #CDBBF9 | `--color-bg` #0E0B16 | 11,20:1 | Passa AA |
| Anel de foco sobre superfície elevada | `--color-focus-ring` #CDBBF9 | `--color-surface-raised` #1F1A2D | 9,70:1 | Passa AA |
| Preenchimento do botão primário sobre superfície | `--color-primary` #B79DF3 | `--color-surface` #171321 | 7,93:1 | Passa AA |
| Preenchimento do botão primário sobre fundo da página | `--color-primary` #B79DF3 | `--color-bg` #0E0B16 | 8,47:1 | Passa AA |
| Ícone de receita sobre superfície | `--color-income` #34D399 | `--color-surface` #171321 | 9,49:1 | Passa AA |
| Ícone de despesa sobre superfície | `--color-expense` #F87171 | `--color-surface` #171321 | 6,59:1 | Passa AA |
| Ícone interno sobre superfície | `--color-internal` #A59DBB | `--color-surface` #171321 | 7,07:1 | Passa AA |
| Ícone de sucesso sobre fundo de badge | `--color-success` #34D399 | `--color-success-bg` #0F2A22 | 7,95:1 | Passa AA |
| Ícone de informação sobre fundo de badge | `--color-info` #5FB8EC | `--color-info-bg` #0F2536 | 7,14:1 | Passa AA |
| Ícone de alerta sobre fundo de badge | `--color-warning` #FBBF24 | `--color-warning-bg` #33260A | 8,84:1 | Passa AA |
| Ícone de erro sobre fundo de badge | `--color-danger` #F87171 | `--color-danger-bg` #341618 | 5,96:1 | Passa AA |
| Ícone de sucesso sobre superfície | `--color-success` #34D399 | `--color-surface` #171321 | 9,49:1 | Passa AA |
| Ícone de informação sobre superfície | `--color-info` #5FB8EC | `--color-surface` #171321 | 8,30:1 | Passa AA |
| Ícone de alerta sobre superfície | `--color-warning` #FBBF24 | `--color-surface` #171321 | 10,92:1 | Passa AA |
| Ícone de erro sobre superfície | `--color-danger` #F87171 | `--color-surface` #171321 | 6,59:1 | Passa AA |
| Preenchimento de barra (sucesso) sobre trilho | `--color-success` #34D399 | `--color-track` #2F2849 | 7,18:1 | Passa AA |
| Preenchimento de barra (alerta) sobre trilho | `--color-warning` #FBBF24 | `--color-track` #2F2849 | 8,27:1 | Passa AA |
| Preenchimento de barra (erro) sobre trilho | `--color-danger` #F87171 | `--color-track` #2F2849 | 4,99:1 | Passa AA |
| Preenchimento de barra (primário) sobre trilho | `--color-primary` #B79DF3 | `--color-track` #2F2849 | 6,00:1 | Passa AA |

**Paleta categórica contra a superfície e contra o fundo da página (mínimo 3:1)**

| Token | Valor | Sobre `--color-surface` | Sobre `--color-bg` | Resultado |
|---|---|---|---|---|
| `--chart-1` / `--category-1` | #4D8EEA | 5,53:1 | Azul | 1ª série; patrimônio; saldo |
| `--chart-2` / `--category-2` | #2DD4BF | 9,80:1 | Verde-azulado | 2ª série |
| `--chart-3` / `--category-3` | #F59E54 | 8,60:1 | Laranja-queimado | 3ª série |
| `--chart-4` / `--category-4` | #F472A0 | 6,74:1 | Rosa-cereja | 4ª série |
| `--chart-5` / `--category-5` | #E3C34A | 10,57:1 | Ocre | 5ª série |
| `--chart-6` / `--category-6` | #A3C93A | 9,53:1 | Oliva | 6ª série |
| `--chart-7` / `--category-7` | #7F9BC7 | 6,44:1 | Ardósia | 7ª série |
| `--chart-8` / `--category-8` | #3CC3E0 | 8,75:1 | Ciano | 8ª série |
| `--chart-9` / `--category-9` | #D4A373 | 8,06:1 | 8,61:1 | Passa AA |
| `--chart-10` / `--category-10` | #E0746B | 5,97:1 | 6,38:1 | Passa AA |
| `--chart-11` / `--category-11` | #A9C8F7 | 10,67:1 | 11,40:1 | Passa AA |
| `--chart-12` / `--category-12` | #9A97A8 | 6,40:1 | 6,83:1 | Passa AA |

---

## 9. Tipografia

### 9.1 Família e carregamento

| Item | Decisão |
|---|---|
| Família | **Inter** variável (eixo de peso 400 a 700), sem serifa, desenhada para interfaces e com números tabulares e alinhamento nítido |
| Fallback | `system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`; em Next.js usar `next/font` (gera fallback métrico `Inter Fallback`); nos mockups, `@font-face` com `font-display: swap` e arquivo local ou, se o Frontend Developer preferir, link da fonte hospedada; o fallback do sistema mantém o layout legível sem a fonte |
| Pesos usados | 400 (corpo), 500 (rótulos, botões, cabeçalhos de tabela), 600 (títulos, valores-chave); 700 apenas no valor `display` e em estados enfatizados |
| Monoespaçada | `--font-mono` somente para códigos de recuperação do 2FA, chave secreta e referências de suporte ("Ref.: 7F3A") |
| Números | `font-variant-numeric: tabular-nums lining-nums` em **todo** valor monetário, percentual, data numérica e contador (`.u-tabular`, aplicado por `d-money`, `c-table__cell--numeric`, `d-kpi__value`) |
| Tamanho mínimo | 12 px (`--text-xs`) apenas para sobrelinhas e selos; nenhum texto de conteúdo menor que 14 px no celular, exceto sobrelinhas |
| Campos de formulário no celular | 16 px, para evitar zoom automático do iOS |
| Zoom e fonte do navegador | Todos os tamanhos em `rem`; layout testado a 200% (WCAG 1.4.4) |

### 9.2 Escala de papéis (celular e desktop)

Celular é o valor-base (mobile first); a coluna Desktop vale a partir de `lg` (1024 px). Entre `md` e `lg` valem os valores do celular.

| Papel | Token(s) | Celular (px / altura de linha) | Desktop (px / altura de linha) | Peso | Espaçamento de letras | Uso |
|---|---|---|---|---|---|---|
| Display | `--type-display-*` | 32 / 40 | 36 / 44 | 700 | `--tracking-tight` | Valor-chave principal de uma tela (saldo consolidado em Contas, valor atual em Investimentos, saldo total no Dashboard) |
| Valor de indicador (KPI) | `--type-kpi-*` | 24 / 32 (18 / 26 no modo compacto de duas colunas) | 24 / 32; 28 / 36 quando o cartão tem 240 px ou mais de largura (container query, `--type-kpi-size-wide`) | 600 | `--tracking-tight` | `d-kpi__value` |
| H1 | `--type-h1-*` | 22 / 28 | 28 / 36 | 600 | `--tracking-tight` | Título da página, único por tela |
| H2 | `--type-h2-*` | 18 / 24 | 20 / 28 | 600 | normal | Título de cartão e seção |
| H3 | `--type-h3-*` | 16 / 24 | 16 / 24 | 600 | normal | Subseções, títulos de modal e painel |
| Corpo | `--type-body-*` | 16 / 24 | 15 / 22 | 400 | normal | Texto corrido, descrições, itens de lista no celular |
| Tabela | `--type-table-*` | 16 / 24 (item do `c-card-list`) | 14 / 20 | 400 | normal | Células da `c-table` |
| Rótulo (label) | `--text-sm` / `--leading-sm` | 14 / 20 | 14 / 20 | 500 | normal | Rótulos de campo, abas, botões pequenos, cabeçalhos de coluna |
| Legenda (caption) | `--type-caption-*` | 14 / 20 | 14 / 20 | 400 | normal | Ajuda, metadados ("Atualizado há 12 min"), segunda linha de itens |
| Sobrelinha (overline) | `--type-overline-*` | 12 / 16 | 12 / 16 | 600 | `--tracking-wide`, caixa alta | Rótulos de grupo do menu, cabeçalho de grupo por dia |
| Botão | `--text-base` | 16 / 24 | 15 / 22 | 500 | normal | `c-button` |
| Selo / badge | `--text-xs` | 12 / 16 | 12 / 16 | 600 | `0.01em` | `c-badge`, `c-chip`, `c-tag` |

Regras:

- Rótulo acima do valor (cartão de indicador): rótulo em `--type-caption` com `--color-text-muted`; valor em `--type-kpi` com `--color-text`.
- Largura de linha máxima de texto corrido: 70 caracteres (`max-width: 70ch`).
- Truncamento: uma linha com reticências (`text-overflow: ellipsis`) para descrições em listas, com título completo em tooltip (desktop) e no detalhe; valores nunca truncam.
- Capitalização de sentença; caixa alta só em sobrelinhas.

```css
h1 {
  font-size: var(--type-h1-size);
  line-height: var(--type-h1-leading);
  font-weight: var(--weight-semibold);
  letter-spacing: var(--tracking-tight);
}

h2 {
  font-size: var(--type-h2-size);
  line-height: var(--type-h2-leading);
  font-weight: var(--weight-semibold);
}

h3 {
  font-size: var(--type-h3-size);
  line-height: var(--type-h3-leading);
  font-weight: var(--weight-semibold);
}

.u-text-muted {
  color: var(--color-text-muted);
}

.u-overline {
  font-size: var(--type-overline-size);
  line-height: var(--type-overline-leading);
  font-weight: var(--weight-semibold);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--color-text-muted);
}
```

---

## 10. Formatação visual de valores

Formato textual (BRL, sinal, abreviação) segue `sistema-de-layout.md` seção 9; esta seção define a **apresentação visual**.

### 10.1 Anatomia do `d-money`

```html
<span class="d-money d-money--md" data-sign="negative" data-masked="false" aria-label="menos 212 reais e 30 centavos">
  <span class="d-money__sign" aria-hidden="true">-</span>
  <span class="d-money__currency" aria-hidden="true">R$</span>
  <span class="d-money__amount" aria-hidden="true">212,30</span>
</span>
```

```css
.d-money {
  display: inline-flex;
  align-items: baseline;
  gap: 0.25em;
  font-variant-numeric: tabular-nums lining-nums;
  white-space: nowrap;
  color: var(--color-text);
}

.d-money__currency {
  font-weight: var(--weight-medium);
}

.d-money__sign {
  margin-inline-end: -0.15em;
}

.d-money[data-sign="positive"] {
  color: var(--color-income);
}

.d-money[data-sign="negative"] {
  color: var(--color-expense);
}

.d-money[data-sign="neutral"] {
  color: var(--color-neutral-value);
}

.d-money[data-sign="internal"] {
  color: var(--color-internal);
}

.d-money[data-masked="true"] {
  color: var(--color-text-muted);
  letter-spacing: 0.08em;
}

.d-money--sm {
  font-size: var(--text-sm);
  line-height: var(--leading-sm);
}

.d-money--md {
  font-size: var(--type-table-size);
  line-height: var(--type-table-leading);
  font-weight: var(--weight-medium);
}

.d-money--lg {
  font-size: var(--type-kpi-size);
  line-height: var(--type-kpi-leading);
  font-weight: var(--weight-semibold);
  letter-spacing: var(--tracking-tight);
}

.d-money--xl {
  font-size: var(--type-display-size);
  line-height: var(--type-display-leading);
  font-weight: var(--weight-bold);
  letter-spacing: var(--tracking-tight);
}
```

Observação de dependência: o atributo `aria-label` é obrigatório porque o valor visual é dividido em três elementos; o leitor de tela lê só o rótulo.

### 10.2 Regras por tipo de valor

| Caso | Exemplo | Cor (`data-sign`) | Peso | Sinais alternativos |
|---|---|---|---|---|
| Despesa | `-R$ 212,30` | `negative` (`--color-expense`) | 500 | Sinal `-`; na lista do celular o valor fica à direita na 1ª linha |
| Receita em lista/tabela de transações | `+R$ 9.800,00` | `positive` (`--color-income`) | 500 | Sinal `+` explícito (ver pendência P-UI-03) |
| Saldo positivo (conta, patrimônio, total) | `R$ 31.420,15` | padrão (`--color-text`) | 600 | Sem cor: saldo não é receita |
| Saldo negativo (conta no vermelho, fatura devedora) | `-R$ 1.200,00` | `negative` | 600 | Sinal `-` |
| Resultado do mês e variação monetária | `+R$ 3.484,60` / `-R$ 450,00` | `positive` / `negative` | 600 | Sinal `+` ou `-` e rótulo "Resultado" |
| Percentual de variação | `▲ 5,2% vs. setembro` | pela favorabilidade (seção 4.1) | 500 | Ícone `ArrowUp` / `ArrowDown`, texto "vs. setembro" |
| Zero | `R$ 0,00` | `neutral` (`--color-neutral-value`) | 400 | Texto numérico |
| Interna / ignorada | `R$ 2.310,00` (sem sinal de cor) | `internal` (`--color-internal`) | 400 | Selo "Interna"/"Ignorada" e ícone `ArrowLeftRight`; o sinal `-` pode aparecer, a cor não indica despesa |
| Indisponível | `—` | `neutral` | 400 | Tooltip "Não informado pela instituição" |
| Projetado (parcela futura, saldo projetado) | `R$ 1.250,00` | padrão | 400, itálico não usado | Selo "Projetada" e borda tracejada no contêiner |
| Valor excedido (orçamento) | `R$ 1.950,00` | `negative` | 600 | Ícone e texto "Excedido" |

Alinhamento: sempre à direita em tabelas e listas, com os símbolos de moeda alinhando-se pela largura tabular; mínimo de largura reservado por coluna (`min-width: 9ch` em células de valor) para evitar saltos.

Tamanhos em contexto: valor em linha de lista `--md`; KPI `--lg`; destaque de tela `--xl`; apoio (totais da barra de filtros, rodapés) `--sm`.

### 10.3 Ocultar valores (RF decidido pelo titular)

| Aspecto | Regra visual |
|---|---|
| Botão | `c-icon-button` com `Eye` (valores visíveis) e `EyeOff` (ocultos), `aria-pressed`, 44 px no celular e 40 px no desktop; rótulo acessível "Ocultar valores" |
| Valor oculto | `R$ ••••` em `--color-text-muted`, mesmo tamanho e peso do valor original para não deslocar o layout; sem sinal e sem cor financeira (o sinal poderia revelar a natureza do valor) |
| `aria-label` | "Valor oculto" |
| Largura | O espaço do valor mascarado tem `min-width` igual ao de um valor médio da coluna (9ch), preservando o alinhamento |
| Percentuais e quantidades | Permanecem visíveis (não são valores monetários); variações monetárias são mascaradas |
| Gráficos | Rótulos de valor, valores nos eixos Y e valores nos tooltips são substituídos por `••••`; o formato visual do gráfico permanece (proporções são exibidas) ou, se o titular preferir, ver pendência P-UI-04; legendas mostram só percentuais |
| Tabelas alternativas | Colunas de valor mascaradas |
| Campos de entrada | Nunca mascarados (o titular está digitando) |
| Persistência | Estado atual persiste por usuário; padrão inicial vem de Configurações > Aparência |
| Transição | Troca instantânea, sem animação |

---

## 11. Ícones (lucide-react)

### 11.1 Estilo

| Propriedade | Valor |
|---|---|
| Biblioteca | `lucide-react`, conjunto único (L7 de `sistema-de-layout.md`); nenhum outro conjunto, exceto a marca do Google (SVG oficial colorido) no botão de login |
| Traço | `strokeWidth={1.75}`, `stroke-linecap: round`, `stroke-linejoin: round`, sem preenchimento |
| Tamanhos | 16 px (em texto, badges, tags, inputs compactos), 20 px (botões, itens de menu e de lista, campos), 24 px (cabeçalho, navegação inferior, ações de ícone), 32 px (cartões de estado inline), 48 px (estados vazio e erro) |
| Cor | `currentColor`; ícones semânticos herdam a cor do papel (`--color-success`, etc.) |
| Acessibilidade | Decorativos: `aria-hidden="true"`; botões somente de ícone: `aria-label` descritivo + tooltip; ícone informativo isolado: `role="img"` + `aria-label` |
| Alvo | O ícone nunca é o alvo; o alvo de 44 px é o botão (`c-icon-button`) |
| Importação | Importação nominal de cada ícone (permite remoção de ícones não usados no build); não importar o pacote inteiro; sprite SVG inline permitido nos mockups |

### 11.2 Inventário por conceito

| Conceito | Ícone lucide |
|---|---|
| Início / Dashboard | `LayoutDashboard` |
| Transações | `ArrowLeftRight` |
| Contas | `Landmark` |
| Cartões | `CreditCard` |
| Investimentos | `TrendingUp` |
| Orçamento e metas | `Target` |
| Recorrências | `Repeat` |
| Categorias e regras | `Tags` |
| Importação | `FileUp` |
| Relatórios | `FileText` |
| Conexões | `Link2` |
| Alertas / sino | `Bell` |
| Configurações | `Settings` |
| Mais (drawer) | `Menu` |
| Recolher / expandir menu | `PanelLeftClose` / `PanelLeftOpen` |
| Menu da linha (⋮) | `EllipsisVertical` |
| Ocultar / mostrar valores | `EyeOff` / `Eye` |
| Sincronizar | `RefreshCw` |
| Buscar | `Search` |
| Filtros | `ListFilter` |
| Adicionar | `Plus` |
| Fechar | `X` |
| Confirmar / selecionado | `Check` |
| Expandir / recolher | `ChevronDown` / `ChevronUp` |
| Navegar (detalhe, mês) | `ChevronRight` / `ChevronLeft` |
| Ordenar | `ArrowUp` / `ArrowDown` / `ChevronsUpDown` |
| Período / data | `Calendar` |
| Tema | `Sun` / `Moon` / `Monitor` |
| Sair | `LogOut` |
| Editar | `Pencil` |
| Excluir | `Trash2` |
| Baixar / exportar | `Download` |
| Imprimir | `Printer` |
| Senha e segurança | `KeyRound`, `ShieldCheck`, `Lock` |
| Copiar | `Copy` |
| Dividir transação | `Split` |
| Interna | `ArrowLeftRight` |
| Ignorada | `EyeOff` |
| Manual | `PenLine` |
| Pendente | `Hourglass` |
| Parcela | `CalendarClock` |
| Sucesso / informação / alerta / erro | `CircleCheck` / `Info` / `TriangleAlert` / `OctagonAlert` (ou `CircleX` para erro de campo) |
| Entrada / saída | `ArrowDownLeft` / `ArrowUpRight` |
| Meta | `Flag` |
| Recorrência detectada | `Sparkles` |
| Estados vazios | ilustração por ícone em 48 px (`Inbox`, `Wallet`, `Link2`, `CreditCard`, `PiggyBank`, `FileSearch`, `BellOff`) |

---

## 12. Escalas de espaçamento, raio, elevação e movimento (uso)

### 12.1 Espaçamento

| Contexto | Token |
|---|---|
| Ícone e texto adjacentes | `--space-1` (4) a `--space-2` (8) |
| Rótulo e campo | `--space-1` |
| Campos de formulário entre si | `--space-4` |
| Padding de cartão | `--space-4` (celular), `--space-6` (`lg`) |
| Padding de modal | `--space-4` (folha), `--space-6` (central) |
| Entre cartões em grade | `--grid-gap` |
| Entre seções | `--space-8` |
| Entre blocos de página | `--space-12` |
| Estados vazios (respiro vertical) | `--space-16` |
| Alvo de toque mínimo | `--touch-target` (44 px) |
| Linha de tabela | 48 px (confortável), 40 px (compacta) |

### 12.2 Raio

| Token | Valor | Uso |
|---|---|---|
| `--radius-xs` | 4 px | Barras de progresso, marcadores, tag removível interna |
| `--radius-sm` | 6 px | Botões pequenos, chips quadrados, tooltips |
| `--radius-md` | 8 px | Botões, campos, selects, itens de menu, toasts |
| `--radius-lg` | 12 px | Cartões, popovers, banners |
| `--radius-xl` | 16 px | Modais centrais, painéis, folhas inferiores (cantos superiores) |
| `--radius-full` | 9999 px | Badges, chips, avatares, interruptor |

### 12.3 Elevação

| Nível | Tema claro | Tema escuro | Uso |
|---|---|---|---|
| 0 | `--color-bg` sem sombra | `--color-bg` sem sombra | Fundo da página |
| 1 | `--color-surface` + borda `--color-border` + `--elevation-card` | `--color-surface` + borda `--color-border` | Cartões, tabelas, listas |
| 2 | `--color-surface-raised` + `--elevation-raised` | `--color-surface-raised` (mais claro) + `--elevation-raised` | Popover, menu suspenso, combobox aberto, tooltip |
| 3 | `--elevation-drawer` | `--color-surface-raised` + sombra | Painel lateral, folha inferior, barra de ação em lote |
| 4 | `--elevation-modal` | `--color-surface-raised` + sombra | Modal central, toast |

No tema escuro a elevação é comunicada principalmente pelo **clareamento da superfície** e pela borda; as sombras são mais fortes, mas pouco visíveis sobre fundo escuro. Camadas sobrepostas usam `--color-overlay` entre a página e o modal ou painel.

### 12.4 Movimento

| Interação | Duração | Curva | Propriedades animadas |
|---|---|---|---|
| Hover, foco, pressão de botão | `--motion-fast` (120 ms) | `--ease-standard` | `background-color`, `border-color`, `color`, `box-shadow` |
| Troca de tema | `--motion-base` (200 ms) | `--ease-standard` | `background-color`, `color`, `border-color` somente |
| Abrir/fechar popover, menu, toast, tooltip | `--motion-base` | `--ease-enter` (entrada) e `--ease-exit` (saída) | `opacity`, `transform: translateY(4px)` |
| Modal central | `--motion-base` | `--ease-enter` | `opacity` e `transform: scale(0.98)` para 1 |
| Folha inferior, painel lateral | `--motion-slow` (320 ms) | `--ease-enter` | `transform: translateY(100%)` ou `translateX(100%)` para 0; fundo `opacity` |
| Esqueleto | 1,4 s em laço | linear | `background-position` do brilho; estático com `prefers-reduced-motion` |
| Barras de progresso | `--motion-slow` | `--ease-standard` | `width` ao mudar de valor (não na primeira carga) |
| Gráficos | Sem animação de entrada | nenhuma | Nenhuma animação essencial (acessibilidade de gráficos) |

Com `prefers-reduced-motion: reduce`, os tokens de duração viram `0ms` (seção 3.4), esqueletos ficam estáticos e o ícone de sincronização não gira (é substituído por texto "Sincronizando...").

---

## 13. Modos especiais

### 13.1 Impressão e PDF (sempre tema claro)

```css
@media print {
  :root,
  :root[data-theme="dark"] {
    color-scheme: light;
    --color-bg: #FFFFFF;
    --color-surface: #FFFFFF;
    --color-surface-raised: #FFFFFF;
    --color-surface-sunken: #FFFFFF;
    --color-text: #17132B;
    --color-text-muted: #4C4663;
    --color-border: #D9D5E4;
    --color-border-strong: #7F7898;
    --color-income: #047857;
    --color-expense: #B91C1C;
    --color-internal: #4C4663;
    --color-neutral-value: #5D5775;
    --color-primary: #5B21B6;
    --chart-1: #2563C4;
    --chart-2: #0B7F70;
    --chart-3: #C2570C;
    --chart-4: #C2255C;
    --chart-5: #8A6D00;
    --chart-6: #4F7D1A;
    --chart-7: #5A6B85;
    --chart-8: #0A7C99;
    --chart-grid: #E3E0EC;
    --chart-axis: #4C4663;
    --category-9: #8A5A2B;
    --category-10: #8F2434;
    --category-11: #1F3A7A;
    --category-12: #6B7280;
  }

  .l-shell__nav,
  .l-shell__header,
  .c-bottom-nav,
  .c-toast,
  .c-banner,
  .c-drawer,
  .c-modal {
    display: none;
  }

  body {
    font-size: 11pt;
  }

  .c-card,
  .d-chart {
    break-inside: avoid;
    box-shadow: none;
  }
}
```

Em impressão, os padrões e marcadores dos gráficos são mantidos (o PDF pode ser em escala de cinza). Valores mascarados não são aplicados (o app avisa antes, conforme `sistema-de-layout.md` 9.5).

### 13.2 Alto contraste forçado (`forced-colors`)

| Elemento | Regra |
|---|---|
| Botões, campos, selects | Bordas de 1 px visíveis em `ButtonText` (não depender de `background`) |
| Foco | `outline-color: Highlight` |
| Badges e chips | Borda de 1 px em `CanvasText`; ícone e texto preservados |
| Barras de progresso | `forced-color-adjust: none` apenas no preenchimento, com `background: Highlight` e borda `CanvasText` |
| Gráficos | Marcadores e padrões preservam a distinção; linhas usam `CanvasText` e `Highlight` alternados |
| Ícones | `currentColor` (herdam `ButtonText`/`CanvasText`) |

### 13.3 Redução de movimento, tela sensível ao toque e densidade

- `@media (hover: none)`: estados de hover em linhas e cartões não são aplicados em telas de toque (evita hover "preso").
- `@media (pointer: coarse)`: `--touch-target` efetivo de 44 px em todos os controles; no desktop controles compactos usam altura de 36 a 40 px.
- Densidade da tabela: `data-density="compact"` reduz a linha para 40 px e o padding vertical, apenas a partir de `lg`.

---

## 14. Pendências e observações para o UX Architect

Itens em que o design visual discorda de, complementa ou depende de decisão sobre os documentos do UX. Nenhum arquivo do UX foi editado. Todos têm tratamento visual proposto para não bloquear a Etapa 1.3.

| # | Tema | Situação e proposta |
|---|---|---|
| P-UI-01 | `l-page` usa `max-width: var(--container-xl)` (`sistema-de-layout.md` 3.2), mas a regra de breakpoints exige 1280 px em `xl` e 1440 px em `2xl`, fluido em `lg` | Criado `--container-page` (1280/1440 por breakpoint, `100%` abaixo de `xl`). Sugere-se atualizar o esqueleto de `l-page` para `max-width: var(--container-page, 100%)` |
| P-UI-02 | Variação ▲/▼: o wireframe mostra `▼ 3,1%` para despesas sem dizer se a cor indica direção ou favorabilidade | Adotado: seta indica direção, cor indica favorabilidade (despesa caindo é verde, receita caindo é vermelha), com texto de referência. Confirmar com o titular se preferir cor neutra nas variações |
| P-UI-03 | Wireframes mostram receitas em listas sem sinal (`R$ 9.800,00`) | Adotado `+R$ 9.800,00` em listas e tabelas de transações para a receita não depender só da cor, conforme permitido por `sistema-de-layout.md` 9.1 ("receitas relevantes"). KPIs rotulados ("Receitas") mantêm o valor sem `+` |
| P-UI-04 | Em "Ocultar valores", gráficos: ocultar apenas rótulos (padrão adotado) ou também achatar as proporções | Adotado: proporções permanecem visíveis e valores numéricos viram `••••`. Se o titular considerar as proporções sensíveis, avaliar substituir o gráfico por esqueleto estático com a mensagem "Valores ocultos" |
| P-UI-05 | Dashboard celular: "Fluxo de caixa (barras com rolagem horizontal)" | Compatível com P5 (contêiner de dados rolável), mas recomenda-se mostrar por padrão os 6 últimos meses sem rolagem e oferecer "Ver 12 meses" em tabela. Registrado em `guia-de-graficos.md` |
| P-UI-06 | Botão "Entrar com Google" | Seguir as diretrizes de marca do Google: ícone "G" multicolorido sobre fundo neutro com texto "Entrar com Google"; no tema escuro, variante com fundo `--color-surface` e borda. É a única exceção à regra de "ícones apenas lucide" |
| P-UI-07 | `wireframes.md` 3.1 e `arquitetura-de-informacao.md` 5.3 preveem botão flutuante "+" em Transações, no canto inferior direito | Posicionado 16 px acima da barra inferior; pode cobrir o último item da lista: adicionado `padding-bottom` de 88 px ao conteúdo (ver `componentes.md`) |
| P-UI-08 | Indicador de sincronização no cabeçalho do celular exibe só ícone e "12 min" | Compatível; em 320 px o título é truncado com reticências para preservar o alvo de 44 px do indicador, do olho e do sino (3 x 44 px + 2 x 8 px) |
| P-UI-09 | Lucide não possui o logotipo do Google nem de bancos | Logos de instituições (Itaú, Nubank etc.) não serão desenhados; usa-se um avatar com as iniciais da instituição sobre `--color-neutral-bg`; logos oficiais só se vierem da Pluggy |
| P-UI-10 | Cores de categoria definidas pelo usuário | O sistema armazena o índice 1 a 12 em vez do hexadecimal para que cada tema use sua variante; se o modelo de dados guardar hexadecimal, a Sprint 2 deve mapear o valor ao índice mais próximo |
| P-UI-11 | `sistema-de-layout.md` 3.3 prevê "4 colunas de 3" para indicadores em `lg`; com o menu lateral de 256 px, a área útil em 1024 px é de cerca de 704 px e cada cartão teria cerca de 158 px, insuficiente para valores monetários de 24 px sem truncar | Adotado: `lg` (1024 a 1279) em 2 x 2; 4 colunas a partir de `xl` (1280). No celular, 2 colunas a partir de 360 px com `d-kpi--compact`. Sugere-se ajustar a tabela 3.3 do UX |
| P-UI-12 | Pares de gráficos 7/5 em `lg` deixam o gráfico de fluxo de caixa com cerca de 280 px | Adotado: pares 6/6 em `lg` e 7/5 a partir de `xl` (ver `telas.md` 0.4) |
| P-UI-13 | Preferência "Padrões nos gráficos" não consta nas decisões do titular | Não foi criada configuração: rótulos, legendas, marcadores e tabela alternativa já cumprem 1.4.1; padrões de preenchimento ficam ativos em impressão, alto contraste forçado e quando duas séries adjacentes compartilham matiz próximo |
| P-UI-14 | O QR code do 2FA exige fundo claro para leitura | Exceção única à regra "sem versões fixas em branco ou preto" de `sistema-de-layout.md` 6.5: QR sobre fundo branco com margem de segurança também no tema escuro |
