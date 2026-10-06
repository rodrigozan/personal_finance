# Direção Visual por Tela — Painel Financeiro Pessoal

**Etapa:** 1.2 (Sprint 1) — Design visual e design system
**Agente:** UI Designer
**Data:** 05/10/2026
**Base:** `wireframes.md` (estrutura e conteúdo), `arquitetura-de-informacao.md`, `sistema-de-layout.md`, `design-system.md`, `componentes.md`, `guia-de-graficos.md`
**Consumidor:** Frontend Developer (mockups da Etapa 1.3 e telas da Sprint 2 em diante)

Este documento descreve a composição visual **final** de cada uma das 14 telas. A estrutura e o conteúdo vêm dos wireframes; aqui se definem hierarquia, componentes, medidas, cores semânticas, comportamento por breakpoint, estados e temas. Nomes de classe e de tokens referem-se aos documentos irmãos; nada aqui introduz valores literais.

---

## 0. Regras globais de composição

### 0.1 Quadro da página

| Regra | Valor |
|---|---|
| Ordem de projeto | Celular (320 a 767 px) é o desenho-base; `md` (768), `lg` (1024), `xl` (1280) e `2xl` (1536) expandem sem criar novas funções |
| Estrutura | `l-shell` > `l-shell__main` > `l-page` > `l-page__header` + `l-page__body`; o título (`h1`) fica no cabeçalho global |
| `l-page__header` | Linha de ações e filtros da página: celular, empilhada (filtros acima, ação primária no `c-fab` ou como botão de largura total no topo); `md` e acima, ações à direita em linha |
| Espaço entre seções | `--space-8` (32 px) no desktop; `--space-6` (24 px) no celular; entre cartões em grade, `--grid-gap` |
| Largura | Fluido em `lg`; 1280 px em `xl`; 1440 px em `2xl`, centralizado (`--container-page`) |
| Camadas de superfície | Fundo `--color-bg`; blocos em `c-card` (`--color-surface`, borda e sombra mínimas); formulários e listas dentro de cartões |
| Hierarquia de peso | 1) valor-chave da tela (`d-money--xl` ou `--lg`), 2) bloco principal (gráfico ou tabela), 3) listas e apoio, 4) ações secundárias e notas |
| Ação primária | Um único `c-button--primary` por região; no desktop, no canto superior direito do bloco; no celular, `c-fab` (Transações) ou botão de largura total no cabeçalho da página |
| Valores | Sempre `d-money`; sinais e cores conforme `design-system.md` 10 |
| Datas | `<time>` com `dd/MM/aaaa` ou relativo; tabelas e cartões usam números tabulares |

### 0.2 Estados de bloco (todas as telas)

- **Carregando**: esqueleto da geometria final (`c-skeleton`), `aria-busy="true"`; os filtros ficam desabilitados só na primeira carga.
- **Vazio de origem**: `c-state` com ícone de 48 px, título, explicação e até 2 ações.
- **Vazio de filtro**: `c-state` compacto com "Limpar filtros".
- **Erro de bloco**: `c-state` de erro; cada bloco falha isoladamente e mantém o restante da tela.
- Faixas globais (`c-banner`): conexão com erro (persistente, `error`), dados desatualizados (`warning`, dispensável), sem rede (`info`); empilham abaixo do cabeçalho.

### 0.3 Temas (válido para todas as telas)

Nenhuma tela tem variante de tema própria: todos os componentes usam tokens e trocam de tema apenas pelos três blocos de variáveis. Pontos de atenção que a revisão deve conferir em ambos os temas:

- Hierarquia por elevação: no claro, borda e sombra; no escuro, clareamento da superfície (`--color-surface-raised`) e borda.
- Gráficos usam a paleta própria de cada tema (tons claros no escuro).
- O botão do Google e as imagens usam tokens de superfície; nenhum elemento tem versão fixa branca ou preta, com a única exceção do QR code do 2FA, que mantém fundo branco e margem de segurança para ser lido pelo aplicativo autenticador.
- Fundos de badge e banner (`-bg`) são mais escuros e sutis no tema escuro.

### 0.4 Medidas de referência por breakpoint

| Elemento | 320 a 359 | 360 a 767 | 768 a 1023 | 1024 a 1279 | >= 1280 |
|---|---|---|---|---|---|
| Margem lateral | 16 px | 16 px | 24 px | 32 px | 32 px |
| Navegação | Barra inferior | Barra inferior | Trilho 72 px | Menu 256 px | Menu 256 px |
| Largura útil do conteúdo (aprox.) | 288 px | 328 px a 735 px | 648 px a 695 px | 704 px a 735 px | 960 px a 1216 px |
| Grid | 4 colunas | 4 colunas | 8 colunas | 12 colunas | 12 colunas |
| Pares de gráficos | Pilha | Pilha | Pilha | 6/6 | 7/5 |

---

## 1. Login

**Rota:** `/login` (e estados `/recuperar-senha`, `/redefinir-senha`). Tela pública, fora do shell.

### 1.1 Hierarquia

1) Título "Entrar" e formulário; 2) ação primária "Entrar"; 3) alternativa "Entrar com Google"; 4) nota de segurança.

### 1.2 Composição

| Aspecto | Celular | Desktop (`md` e acima) |
|---|---|---|
| Fundo | `--color-bg` | `--color-bg`, conteúdo centralizado vertical e horizontalmente (`min-height: 100dvh`) |
| Contêiner | Sem cartão; coluna de 100% com `padding: var(--space-6) var(--page-gutter)`, `padding-block-start: var(--space-12)` | `c-card` de largura 420 px, `padding: var(--space-8)`, `--radius-xl`, `--elevation-raised` |
| Marca | Símbolo 40 px + wordmark "Painel Financeiro" (`--text-xl`, 600) centralizados, `--space-8` abaixo | idem, dentro do cartão |
| Seletor de tema | Botão `ghost` pequeno no canto superior direito ("Tema" com ícone `Sun`/`Moon`/`Monitor`), abre `c-popover`/sheet com `c-theme-switch`; discreto, 44 px de alvo | idem, 40 px |
| Título | `h1` "Entrar" `--type-h1`; subtítulo "Acesso restrito ao titular." `--type-caption` `--color-text-muted` | idem |
| Campos | `c-field` e-mail (`autocomplete="username"`) e senha (`current-password`, botão "Mostrar senha" `Eye` de 44 px); `--space-4` entre campos | idem |
| Link | "Esqueci minha senha" (`c-link`, alvo 44 px, alinhado à direita sob a senha) | idem |
| Ação primária | `c-button--primary c-button--lg c-button--block`, "Entrar" | idem |
| Separador | Linha com "ou" centralizado (`--text-sm`, `--color-text-muted`, linhas `--color-border`), `--space-5` acima e abaixo | idem |
| Google | `c-button--google` de 48 px, largura total | idem |
| Nota | `ShieldCheck` 16 px + "Somente leitura. Nenhuma credencial bancária é armazenada por este app." `--text-sm` muted, centralizada, `--space-6` acima | idem |

### 1.3 Cores semânticas

Cor de ação apenas no botão primário; erro em `c-banner--error` (ícone `OctagonAlert` + texto em `--color-danger-text`); informação (sessão expirada, login cancelado) em `c-banner--info`; bordas dos campos em `--color-border-strong`.

### 1.4 Variantes de tela (mesmo cartão, conteúdo trocado)

| Variante | Visual |
|---|---|
| 2FA | Título "Verificação em duas etapas"; `c-otp` com seis caixas de 48 x 56 px (celular: 44 x 56 px), fonte `--font-mono` 24 px; "Verificar" primário; "Usar código de recuperação" (link) e "Voltar" (ghost) |
| Recuperar senha (solicitar) | Um campo de e-mail + "Enviar link de recuperação" primário; "Voltar ao login"; confirmação em `c-banner--info` "Se esse e-mail estiver cadastrado... Reenviar em 0:59" (contador tabular, botão desabilitado) |
| Redefinir senha | Dois campos de senha; lista de requisitos com ícone (`CircleCheck` em `--color-success` quando atendido, `Circle` em `--color-text-muted` quando não) e texto ("Mínimo de 12 caracteres", "Letras e números"), atualizada em tempo real com `aria-live="polite"`; "Salvar nova senha" primário |
| Acesso negado (Google) | `c-banner--error` "Esta conta Google não tem acesso a este painel..." + "Tentar com outra conta" (secundário) e "Entrar com e-mail e senha" (ghost); nenhuma sessão criada |

### 1.5 Estados

| Estado | Tratamento |
|---|---|
| Carregando | Botão "Entrar" com `c-spinner` e "Entrando..." (largura mantida), campos desabilitados (`--color-disabled-*`), `aria-busy` no formulário; Google: "Abrindo o Google..." e formulário de e-mail desabilitado. Não há spinner de tela cheia; o spinner é do botão |
| Vazio | Não se aplica |
| Erro de credencial | `c-banner--error` acima do botão ("E-mail ou senha incorretos."), `role="alert"`; campo de senha limpo; foco no e-mail; bordas dos campos com erro (2 px `--color-danger`) |
| Bloqueio por tentativas | Banner "Muitas tentativas. Tente novamente em 4 min." e botão desabilitado com contador tabular |
| Erro de rede | Banner "Não foi possível entrar agora. Verifique sua conexão." + "Tentar novamente" |
| Sessão expirada | `c-banner--info` no topo do formulário |
| Link de recuperação expirado | `c-banner--error` + "Solicitar novo link" |

### 1.6 Temas

Tema claro: cartão branco sobre `--color-bg` cinza muito claro (`#F6F5F9`). Tema escuro: cartão `--color-surface` sobre `--color-bg`, borda `--color-border` visível, sombra mínima; o botão do Google mantém `--color-surface` com borda `--color-border-strong`.

---

## 2. Dashboard

**Rota:** `/dashboard`. Pergunta: "Como estou?"

### 2.1 Hierarquia

1) Saldo total (valor `display`); 2) Receitas, Despesas e Resultado; 3) Gastos por categoria e Fluxo de caixa; 4) Evolução do patrimônio; 5) Faturas a vencer; 6) Últimas transações.

### 2.2 Celular (ordem do DOM)

| # | Bloco | Composição |
|---|---|---|
| 0 | `d-period-picker` | Barra fixa sob o cabeçalho (52 px): tipo, setas e rótulo "Out/2026", legenda "05/09 a 04/10" |
| 0b | Faixas | `c-banner` de dados desatualizados ou conexão com erro (se houver), com ação "Sincronizar agora"/"Reconectar" |
| 1 | Saldo total | `d-kpi` em largura total, `d-money--xl` (32/40, 700), rótulo "Saldo total", subtexto "4 contas" e, se houver contas fora do consolidado, "Totais consideram 4 de 5 contas"; `c-card` |
| 2 | Receitas e Despesas | Grade de 2 colunas (`--grid-gap`) com `d-kpi--compact` (valor 18/26); entre 320 e 359 px, uma coluna. Receitas: ícone `ArrowDownLeft` em `--color-income`, valor sem sinal e variação com seta e referência; Despesas: ícone `ArrowUpRight` em `--color-expense`, valor com `-`, variação |
| 3 | Resultado do mês | `d-kpi` largura total, `d-money--lg` com `+`/`-` e cor financeira, delta "▲ R$ 612 vs. set." (ícone + texto) |
| 4 | Gastos por categoria | `d-chart` (rosca 176 px + lista das 5 maiores + "Ver todas"); alternância "Gráfico | Tabela" |
| 5 | Fluxo de caixa | `d-chart` barras de 6 meses, legenda com ícones, "Ver 12 meses" |
| 6 | Evolução do patrimônio | `d-chart` linha 220 px, seletor 3M, 6M, 1A, Tudo |
| 7 | Faturas a vencer | `c-card` com lista: cartão (avatar), "Nubank R$ 2.310,00", "em 3 dias" com `CalendarClock`; urgência (<= 3 dias) com `c-badge` `warning` "Vence em 3 dias" (ícone `TriangleAlert`); item inteiro é link de 56 px |
| 8 | Últimas transações | `c-card-list` das 5 mais recentes (agrupadas por dia) + "Ver todas" (`c-button--secondary c-button--block`) |

### 2.3 Desktop (`lg` a `2xl`)

| Faixa | Composição |
|---|---|
| Cabeçalho da página | `d-period-picker` à esquerda; legenda "Comparando com: setembro de 2026" à direita (`--type-caption`) |
| `lg` (1024 a 1279) | Linha 1: Saldo total (6 col) e Resultado (6 col) com `display`/`lg`; Linha 2: Receitas (6) e Despesas (6); Linha 3: Gastos por categoria (12, rosca 240 px + lista lado a lado); Linha 4: Fluxo de caixa (12); Linha 5: Patrimônio (7) e Faturas (5); Linha 6: Últimas transações (12, tabela de 5 linhas) |
| `xl` e `2xl` (>= 1280) | Linha 1: quatro `d-kpi` de 3 colunas (Saldo total em destaque com `display` quando o cartão tem largura >= 240 px; os demais `lg`); Linha 2: Gastos por categoria (7) e Fluxo de caixa (5); Linha 3: Patrimônio (7) e Faturas a vencer (5); Linha 4: Últimas transações (12, `c-table` de 5 linhas e colunas Data, Descrição, Categoria, Conta, Valor) |
| Interação | Fatias, linhas de categoria e indicadores com "Ver transações" levam a Transações filtrada por período e categoria (CA-06); hover realça cartões clicáveis (`--elevation-raised`) |

### 2.4 Cores semânticas

Receitas `--color-income`, Despesas `--color-expense`, Resultado conforme sinal; saldo total em `--color-text` (não é receita); variações pela favorabilidade; faturas urgentes em `--color-warning`; atrasadas em `--color-danger` com ícone e texto "Vencida".

### 2.5 Estados

| Estado | Tratamento |
|---|---|
| Carregando | 4 `d-kpi` em esqueleto (112 px de altura), rosca em anel cinza, barras de alturas variadas, linha ondulada, 5 linhas de lista; o indicador de sincronização do cabeçalho permanece ativo |
| Vazio de origem | Cartão de boas-vindas no topo (`c-card` com borda `--color-primary` de 1 px e fundo `--color-row-selected`): título "Comece conectando uma instituição", 3 passos numerados (círculos de 28 px), `c-button--primary` "Conectar instituição", link "Importar extrato"; KPIs com `R$ 0,00` em `--color-neutral-value` e legenda "Sem dados no período"; demais blocos ocultos (não mostram gráficos vazios) |
| Vazio de período | KPIs zerados e `c-state` compacto "Nenhuma movimentação neste período." com "Alterar período" |
| Erro por bloco | `c-state` de erro dentro do `c-card` com "Tentar novamente"; os KPIs permanecem quando disponíveis |
| Dados desatualizados | `c-banner--warning` "Dados atualizados há 2 dias." + "Sincronizar agora"; conexão com erro: `c-banner--error` + "Reconectar" |
| Valores ocultos | Todos os `d-money` viram `R$ ••••`; gráficos sem valores nos eixos e tooltips |

### 2.6 Modais

`{período personalizado}`: modal central 480 px (folha no celular) com dois campos de data (`c-field`), atalhos "Últimos 30 dias" e "Este ano" como `c-tag` selecionáveis, nota `Info` "Mês financeiro começa no dia 5.", rodapé "Cancelar" e "Aplicar".

---

## 3. Transações

**Rota:** `/transacoes` (detalhe: `?transacao={id}`). Tarefa mais frequente.

### 3.1 Hierarquia

1) Lista/tabela; 2) filtros e busca; 3) totais do filtro; 4) ação primária "Nova transação".

### 3.2 Celular

| Região | Composição |
|---|---|
| Cabeçalho da página | Linha: busca (`Search`, 44 px) e botão "Filtros" com contador (44 px); abaixo, `c-segmented` "Todas | Receitas | Despesas | Transf." em largura total (4 opções de 44 px) |
| Filtros ativos | Linha rolável de `c-tag` ("Out/2026 x", "Alimentação x") com `--space-2` de espaço; rola só dentro do contêiner |
| Lista | `c-card-list` agrupada por dia (cabeçalho sticky), item de 64 px+; valor à direita na 1ª linha (`d-money--md`, `+` em receitas, `-` em despesas); 3ª linha com `c-chip` (Interna, Pendente, Dividida, Manual, Parcela "4/10") |
| Totais | Linha de resumo no fim da lista: "128 transações · Receitas +R$ 12.400,00 · Despesas -R$ 8.915,40" (`--text-sm`) |
| Paginação | `c-pagination` compacta ("Página 1 de 11", botões de 44 px) |
| Ação primária | `c-fab` "Nova transação" (56 px) no canto inferior direito, 16 px acima da barra inferior; lista com `padding-block-end` de 88 px |
| Seleção em lote | Toque longo ou menu "Selecionar" ativa checkboxes de 44 px; a barra de ação fixa (56 px, `--color-surface-raised`, `--elevation-drawer`) substitui o cabeçalho com "3 selecionadas", "Ações" e `X` |
| Detalhe | `c-drawer` em tela cheia deslizante, botão voltar (44 px) |
| Filtros | `c-sheet` (até 90dvh) com campos em coluna única; rodapé fixo: "Limpar" (secundário) e "Aplicar" (primário) |

### 3.3 Desktop

| Região | `md` | `lg` e acima |
|---|---|---|
| Cabeçalho da página | Título e ações no cabeçalho global; abaixo, linha com `c-segmented` de tipo, busca (320 px) e botões "Nova transação" (primário) e "Exportar CSV" (secundário) | idem; "Nova transação" no canto superior direito |
| Filtros | Linha de `c-select` (40 px) com "Mais filtros" | idem; densidade `c-segmented` "Confortável | Compacta" à direita |
| Tabela | `c-table` sem colunas de prioridade 3 (Tags no detalhe) | `c-table` completa: seleção (48 px), Data (96 px), Descrição (flexível, truncada com tooltip), Categoria (180 px, `c-badge` neutro com swatch de 12 px da categoria), Conta/Cartão (180 px), Tags (a partir de `xl`), Valor (140 px, à direita), menu `⋮` (48 px) |
| Painel | `c-drawer` 420 px sobreposto | `c-drawer` 480 px à direita; a tabela ocupa as 8 colunas restantes e continua visível |
| Barra de lote | Faixa sob a tabela, sticky no topo da tabela: "12 selecionadas" + botões "Categoria", "Tags", "Marcar interna", "Ignorar", "Limpar" e opção "Selecionar as 128 do filtro" | idem |
| Rodapé da tabela | Totais do filtro (Receitas e Despesas) + paginação numérica e "Itens por página" | idem |
| Linhas especiais | Interna: valor em `--color-internal`, selo "Interna"; ignorada: texto em `--color-text-muted` com selo "Ignorada"; pendente: selo `warning` | idem |

### 3.4 Painel de detalhe

Cabeçalho do painel: valor `d-money--xl` com a cor financeira, data e hora, conta e meio de pagamento (`--type-caption`), selos (`c-chip`). Corpo em seções de `--space-6`: Descrição amigável (`c-field`, com "Original: ..." somente leitura em `--font-mono` `--text-xs`), Categoria (`c-combobox` + botão "Dividir" secundário e sugestão da Pluggy em `--type-caption`), Tags (`c-tag` removíveis e campo de adicionar), Notas (área de texto), "Tratamento nos cálculos" com dois `c-switch` (Transferência interna; Ignorar nos cálculos) cada um com linha explicativa, e Origem. Rodapé fixo: "Excluir" (`c-button--danger-outline`, só manuais, alinhado à esquerda), "Cancelar" (ghost) e "Salvar" (primário).

### 3.5 Cores semânticas

Receita `--color-income` (com `+`), despesa `--color-expense` (com `-`), interna `--color-internal` (sem cor financeira), selos conforme mapeamento; categoria com swatch da cor (`--category-N`); nenhuma linha usa cor de fundo semântica (somente hover e selecionada).

### 3.6 Estados

| Estado | Tratamento |
|---|---|
| Carregando | Celular: cabeçalho de grupo + 6 itens de esqueleto; desktop: cabeçalho real da tabela + 10 linhas de esqueleto; filtros desabilitados; troca de página: tabela com opacidade 0,6, barra de 2 px no topo, `aria-busy` |
| Vazio de origem | `c-state` central: ícone `Inbox` 48 px, "Nenhuma transação ainda", explicação, "Conectar instituição" (primário), "Importar extrato" e "Nova transação" (secundários) |
| Vazio de filtro | `c-state` compacto "Nenhuma transação encontrada com esses filtros." + "Limpar filtros"; sugestão "Tente ampliar o período" |
| Erro | `c-state` de erro dentro do cartão da tabela; filtros preservados; "Tentar novamente" |
| Erro ao salvar | `c-toast` de erro; o painel permanece aberto com o valor anterior restaurado e o campo com erro |

### 3.7 Modais

`{nova transação}`: painel lateral/folha; `c-segmented` de tipo (Despesa, Receita, Transferência), `c-field--money`, data, conta/cartão (`c-select`), descrição, categoria, tags, notas. `{dividir transação}`: linhas de divisão (categoria, valor, remover), "Restante: R$ 0,00" com ícone `CircleCheck` em `--color-success` (ou `--color-danger-text` com `OctagonAlert` e valor restante quando diferente de zero), "Aplicar divisão" desabilitado até zerar. `{edição em lote}`, `{criar regra}`: modal central 480 px (folha no celular) com rádios, prévia em `c-banner--info`. `{excluir transação}`: `alertdialog` com botão `danger`.

---

## 4. Contas

**Rota:** `/contas` (detalhe `/contas/{id}`).

### 4.1 Hierarquia

1) Saldo consolidado (`display`); 2) lista de contas por instituição; 3) histórico de saldo (no detalhe).

### 4.2 Celular

- Cartão de saldo consolidado: `c-card` com rótulo, `d-money--xl`, legenda "4 de 5 contas no consolidado".
- Lista agrupada por instituição: cabeçalho de grupo (sobrelinha com avatar de 24 px e nome), itens `d-account-card` de 72 px (apelido em `--type-body` 500, "Conta corrente" em `--type-caption`, saldo `d-money--md` à direita, `ChevronRight`); selos "Oculta", "Fora do consolidado", "Manual".
- Instituição com problema: borda esquerda de 3 px `--color-warning` e `c-badge` "Ação necessária" (ícone + texto) no cabeçalho do grupo, nota "Saldo pode estar desatualizado" com `Clock`.
- Interruptor "Mostrar contas ocultas" (`c-switch`, linha de 44 px) no fim da lista.
- Detalhe: tela cheia com voltar; ações (Editar apelido, Ocultar, Excluir do consolidado) no menu "Ações" (`c-icon-button` no cabeçalho).

### 4.3 Desktop

| Região | Composição |
|---|---|
| Cabeçalho da página | "Sincronizar contas" (secundário) à direita |
| Consolidado | `c-card` de 12 colunas: valor `display`, legenda "4 de 5 contas no consolidado" e gráfico de histórico do consolidado (linha 160 px, seletor 30 dias, 90 dias, 1 ano, Tudo) à direita (a partir de `lg`, 5/12 do cartão) |
| Lista | Um `c-card` por instituição com cabeçalho (avatar, nome, status, última sincronização) e linhas de conta (hover `--color-row-hover`, clique abre o detalhe, `⋮` com Editar apelido, Ocultar, Excluir do consolidado, Ver histórico); coluna de saldo à direita, `d-money--md` |
| Detalhe da conta | Cabeçalho: "Contas > Itaú Corrente (Principal)", saldo atual `display`, "Conectada via Itaú · atualizada há 12 min", ações "Editar apelido" e "Ocultar"; `d-chart` de histórico de saldo (300 px) com tabela alternativa; opções (`c-switch`) "Excluir do consolidado" e "Ocultar conta"; "Últimas transações da conta" (`c-table` de 5 linhas) com "Ver todas" |

### 4.4 Cores semânticas

Saldos em `--color-text` (negativos em `--color-expense` com `-`); selos neutros; status da conexão por `c-badge`.

### 4.5 Estados

| Estado | Tratamento |
|---|---|
| Carregando | Cartão de consolidado e 4 linhas de conta em esqueleto |
| Vazio | `c-state` "Nenhuma conta ainda" (ícone `Landmark`), "Conectar instituição" (primário), nota "As contas aparecem depois da primeira sincronização." |
| Erro | `c-state` de erro no bloco; se for conexão, `c-banner--error` com "Reconectar" |
| Sem histórico | Gráfico substituído por texto "O histórico começa a ser registrado a partir da próxima sincronização." |

### 4.6 Modais

`{editar apelido}` (modal 480 px: `c-field` "Apelido da conta", Cancelar/Salvar); `{ocultar conta}` (confirmação média: texto de consequência, botão "Ocultar").

---

## 5. Cartões

**Rota:** `/cartoes` (detalhe `/cartoes/{id}`).

### 5.1 Hierarquia

1) Cartão selecionado e fatura atual (valor `lg`/`xl`, vencimento); 2) limite e disponibilidade; 3) abas (Fatura atual, Faturas, Parcelas e projeção, Consolidado); 4) compras.

### 5.2 Celular

| Região | Composição |
|---|---|
| Seletor de cartão | Carrossel horizontal de chips de cartão (altura 56 px, avatar + "Nubank 1234"), `scroll-snap-type: x mandatory`, mostra 1,5 chips para indicar rolagem, selecionado com borda 2 px `--color-primary` e `aria-current` |
| Cartão detalhado | `d-card-card`: nome e final; "Fatura" `d-money--xl`; `c-badge` de status (Aberta `info`); vencimento "Vence 05/11 (3 dias)" com `CalendarClock` e `TriangleAlert` quando <= 3 dias; `d-budget-bar` de limite (12 px) com "34% usado"; "Disponível R$ 9.860 de R$ 15.000"; "Fecha dia 25 · Vence dia 5" |
| Abas | `c-tabs` roláveis (Atual, Faturas, Parcelas, Consol.) |
| Fatura atual | `c-banner--info` "Pagamento de fatura não é despesa." (descartável), `c-card-list` das compras (valor, categoria, parcela "4/10" em `c-chip`) |
| Faturas | Lista agrupada: Futuras (projetadas, borda tracejada e selo "Projetada"), Atual (Aberta), Fechadas (Paga `ok`, Vencida `error`); selecionar carrega as compras abaixo |
| Parcelas | Total comprometido `d-money--lg`, gráfico de barras 6 meses (28 px por barra) e lista expansível por mês (`aria-expanded`) |
| Consolidado | `c-segmented` "Cartão | Categoria | Período", barras horizontais ranqueadas e tabela alternativa |
| Detalhe de compra parcelada | `c-drawer` em tela cheia |

### 5.3 Desktop

- Linha de cartões: grade `repeat(auto-fill, minmax(280px, 1fr))` de `d-card-card` (altura uniforme, valor `lg`); o selecionado tem borda de 2 px `--color-primary` e fundo `--color-row-selected`.
- Abaixo: título "Nubank Ultravioleta" (`--type-h2`) e `c-tabs`.
- **Fatura atual**: `c-card` de resumo (período 26/09 a 25/10, "Fecha em 25/10", "Vence em 05/11", "Total R$ 2.310,00", "Mínimo R$ 346,50", tudo `<time>` e `d-money`), banner informativo e `c-table` (Data, Estabelecimento, Categoria, Parcela, Valor).
- **Faturas**: três grupos (Futuras, Atual, Fechadas) como linhas selecionáveis com mês, valor e selo.
- **Parcelas e projeção**: gráfico de barras 12 meses (7/12) e tabela expansível por mês (5/12).
- **Consolidado**: gráfico de barras horizontais (7/12) e tabela (5/12).
- Painel `{detalhe de compra parcelada}` (480 px): título, "Compra em 12/07/2026 · 10 parcelas de R$ 450,00", total, "Parcela atual 4/10", pagas e restantes, calendário em lista (4/10 Out/2026 `Fatura atual`, 5/10 Nov/2026 `Projetada`...), "Ver transação original".

### 5.4 Cores semânticas

Status da fatura: Aberta `info`, Fechada `neutral`, Paga `ok`, Vencida `error`, Projetada `neutral` tracejado; limite: `--color-primary` até 80%, `--color-warning` de 80% a 100%; vencimento próximo em `--color-warning` com ícone e texto; compras como despesas em `--color-expense` com `-`.

### 5.5 Estados

| Estado | Tratamento |
|---|---|
| Carregando | 3 cartões de cartão e a área de abas em esqueleto |
| Vazio | `c-state` "Nenhum cartão encontrado" (ícone `CreditCard`): "As instituições conectadas ainda não disponibilizaram dados de cartão." + "Ir para Conexões" |
| Cartão sem faturas | Texto "Nenhuma fatura disponível para este cartão ainda." no lugar da lista |
| Erro | `c-state` de erro no bloco da fatura; falha em uma fatura não afeta a lista de cartões |
| Instituição sem cartão | Nota `c-banner--info` por instituição |

---

## 6. Investimentos

**Rota:** `/investimentos`.

### 6.1 Hierarquia

1) Valor atual, aplicado e rentabilidade; 2) abas (Carteira, Alocação, Evolução, Movimentações); 3) carteira por classe.

### 6.2 Celular

- Cabeçalho da página: botão "+ Manual" (`c-button--secondary`, 44 px) no cabeçalho.
- Resumo: `c-card` com "Valor atual" `d-money--xl`, "Aplicado" e "Rentabilidade" lado a lado (`d-money--md`, rentabilidade com `+` e `--color-income` ou `-` e `--color-expense`, com percentual e seta).
- `c-tabs` roláveis.
- **Carteira**: seções por classe (cabeçalho com nome, valor da classe e percentual; ícone da classe); cada investimento é um cartão compacto (nome, instituição, valor atual, rentabilidade, vencimento em `<time>`); toque expande para aplicado e detalhes (`aria-expanded`); campos ausentes "—" com tooltip/texto "Não informado pela instituição".
- **Alocação**: `c-segmented` "Classe | Instituição", barra empilhada horizontal 24 px + lista.
- **Evolução**: seletor 3M, 6M, 1A, Tudo e linha 220 px.
- **Movimentações**: lista de cartões (data, investimento, tipo com `c-chip`, valor); filtro por tipo e período em sheet.

### 6.3 Desktop

- Três `d-kpi` (Valor atual `lg`, Valor aplicado `lg`, Rentabilidade com valor e percentual) em 4 colunas cada (12 colunas em 3 x 4); botão "Investimento manual" no canto superior direito.
- **Carteira**: um `c-card` por classe com cabeçalho (classe, valor, percentual) e `c-table` (Nome, Instituição, Aplicado, Atual, Rentab., Vencimento); linhas manuais com selo "Manual" e menu `⋮` (Editar, Excluir).
- **Alocação**: rosca 240 px (5 colunas) + lista/tabela (7 colunas).
- **Evolução**: gráfico de 300 px com tabela alternativa.
- **Movimentações**: `c-table` (Data, Investimento, Tipo, Valor) com filtros.

### 6.4 Cores semânticas

Rentabilidade positiva `--color-income` (sinal `+`, seta), negativa `--color-expense` (sinal `-`, seta); classes e instituições com `--chart-N` (série sem identidade própria); tipos de movimentação: aporte e rendimento (entrada, ícone `ArrowDownLeft`), resgate (`ArrowUpRight`), imposto (`Receipt`) em `c-chip` neutro com texto.

### 6.5 Estados

| Estado | Tratamento |
|---|---|
| Carregando | 3 KPIs e lista em esqueleto |
| Vazio | `c-state` "Nenhum investimento encontrado" (ícone `TrendingUp`) com "Conectar instituição" (primário) e "Investimento manual" (secundário) |
| Evolução sem histórico | "O histórico começa a partir da primeira sincronização." |
| Cobertura parcial | `c-banner--info` "Esta instituição não disponibiliza investimentos." |
| Erro | `c-state` de erro no bloco |

### 6.6 Modais

`{investimento manual}`: modal central 480 px (folha no celular), campos Nome, Classe (`c-select`), Instituição, Vencimento (data), Valor aplicado e Valor atual (`c-field--money`), Observações; "Cancelar" e "Salvar".

---

## 7. Orçamento e metas

**Rota:** `/orcamento`.

### 7.1 Hierarquia

1) Resumo do mês (planejado, realizado, restante, percentual); 2) categorias com situação; 3) metas.

### 7.2 Celular

| Região | Composição |
|---|---|
| Período | Barra de mês (`d-period-picker` com apenas navegação mensal, sem tipo) |
| Abas | `c-tabs` "Orçamento | Metas" (2 abas de largura igual) |
| Resumo | `c-card`: "Planejado" e "Realizado (85%)" (`d-money--lg`), `c-progress--lg` (12 px), "Restante R$ 1.360,00"; "Copiar mês anterior" (`c-button--secondary c-button--block`) |
| Categorias | Cartões `c-card` (padding 12) por categoria: swatch da cor, nome, percentual e situação (ícone + texto) na 1ª linha; `d-budget-bar` (12 px); "Realizado R$ 1.950 de R$ 1.800" (`--text-sm`); "Editar planejado" (ghost 44 px) abre `c-sheet` com `c-field--money` |
| Metas | Cartões de meta: nome, "R$ 18.000 de R$ 30.000", `c-progress--lg` com 60%, "Prazo 31/12/2027 · Faltam R$ 12.000"; botão "Registrar aporte" (secundário); botão flutuante opcional ausente (ação "Nova meta" no cabeçalho da aba) |

### 7.3 Desktop

- Cabeçalho da página: seletor de mês à esquerda, "Copiar mês anterior" (secundário) à direita; abas abaixo.
- **Orçamento**: bloco de resumo (12 colunas): quatro métricas em linha (Planejado, Realizado, Restante, % usado) + barra grande; abaixo, `c-card` com tabela de categorias: Categoria (swatch + nome), Planejado (campo editável inline `c-field--money` de 40 px, alinhado à direita, com `aria-label` "Planejado para Alimentação" e feedback "Salvo"/"Não salvo" em `--text-xs`), Realizado (`d-money`), %, Situação (`d-budget-bar` de 160 px + ícone + texto); subcategorias recolhíveis (`ChevronDown`); "+ Adicionar categoria ao orçamento"; seção "Comparativo" (opcional, `d-chart` agrupado) em `lg` e acima.
- **Metas**: grade de cartões (`repeat(auto-fill, minmax(320px, 1fr))`) com progresso, prazo, "Sugestão: R$ 1.054/mês" e menu `⋮`; "Nova meta" primário no canto superior direito.
- Clique no nome da categoria vai a Transações filtradas por categoria e mês.

### 7.4 Cores semânticas

Situações pela regra de `design-system.md` 4.3 (sucesso, alerta, erro) sempre com ícone, texto e padrão; metas em `--color-primary` (neutro) com `--color-success` e `CircleCheck` ao atingir 100%; valores em `--color-text`; excedente em `--color-expense`.

### 7.5 Estados

| Estado | Tratamento |
|---|---|
| Carregando | Resumo e 6 linhas em esqueleto |
| Vazio de orçamento | `c-state` "Você ainda não definiu um orçamento para este mês." com "Definir orçamento" (primário) e "Copiar mês anterior" (secundário, se existir) |
| Vazio de metas | `c-state` "Nenhuma meta criada." com "Criar meta" |
| Erro | `c-state` de erro; falha ao salvar um campo preserva o valor digitado e marca "Não salvo" (`CircleAlert`, `--color-danger-text`) com "Tentar novamente" |

### 7.6 Modais

`{copiar mês anterior}`: prévia em tabela (Categoria, Mês anterior → Este mês) e `c-banner--warning` "Valores já definidos serão substituídos."; `{nova meta}`: nome, valor-alvo, valor atual, prazo, "Economia mensal necessária" calculada (`d-money--md`, `--type-caption`); `{aporte em meta}`: `c-field--money` e data.

---

## 8. Recorrências

**Rota:** `/recorrencias`.

### 8.1 Hierarquia

1) Detectadas a confirmar (com contador); 2) ativas e totais; 3) projeção.

### 8.2 Celular

- Abas `c-tabs` ("Detectadas (3)", "Ativas", "Projeção"); botão "+ Nova" no cabeçalho da página (secundário, 44 px).
- **Detectadas**: cartões de 3 linhas: nome (`--type-h3`), valor e periodicidade ("R$ 21,90 · Mensal"), "Última 28/09", `c-badge` de confiança (Alta `ok`, Média `warning`, Baixa `neutral`, ícone + texto), categoria sugerida; ações em linha de 3 botões de 44 px: "Descartar" (ghost), "Editar" (secundário), "Confirmar" (primário).
- **Ativas**: lista de cartões (descrição, valor, "Próxima 05/11", categoria, origem `c-chip` Manual/Detectada); totais "Total mensal estimado" e "Total anual estimado" em `c-card` no fim.
- **Projeção**: `c-segmented` 3 meses, 6 meses, 12 meses; gráfico de 220 px e lista cronológica "Contas a pagar" agrupada por mês, com "Saldo previsto ao fim do mês".

### 8.3 Desktop

- Detectadas: `c-card` com linhas de 72 px (nome, valor, periodicidade, última data, confiança, categoria sugerida) e ações à direita ("Descartar", "Editar", "Confirmar" primário).
- Ativas: `c-table` (Descrição, Valor, Periodicidade, Próxima data, Categoria, Origem, menu) e rodapé de totais (mensal e anual) em `d-money--lg`.
- Projeção: gráfico de saldo (7/12, 300 px) + lista de contas a pagar (5/12) com `c-banner--info` de premissas acima.

### 8.4 Cores semânticas

Recorrências são despesas: valores em `--color-expense` com `-` (receitas recorrentes em `--color-income` com `+`); confiança com ícone e texto; "Detectada" com `Sparkles` em `--color-info`; saldo projetado negativo em `--color-danger` com ícone e texto "Saldo negativo".

### 8.5 Estados

| Estado | Tratamento |
|---|---|
| Carregando | Lista em esqueleto; na projeção, gráfico e lista |
| Vazio de detectadas | `c-state` "Nenhuma recorrência detectada": "Precisamos de pelo menos 3 meses de histórico para detectar padrões." |
| Vazio de ativas | `c-state` "Nenhuma recorrência ativa" + "Nova recorrência" (primário) |
| Projeção sem dados | "Sem dados para projetar. Confirme recorrências ou conecte cartões." |
| Erro | `c-state` de erro |

### 8.6 Modais

`{recorrência}` (criar/editar): descrição, valor estimado (`c-field--money`), periodicidade (`c-segmented` Semanal/Mensal/Anual), próxima data, categoria, status; `{descartar recorrência}`: `alertdialog` de gravidade média.

---

## 9. Categorias e regras

**Rota:** `/categorias`.

### 9.1 Hierarquia

1) Árvore de categorias (ou lista de regras); 2) detalhe da categoria selecionada; 3) ações de criação.

### 9.2 Celular

- `c-tabs` "Categorias | Regras".
- **Categorias**: botão "+ Nova categoria" (secundário, largura total, 44 px); árvore de itens de 48 px: seta de expandir (`ChevronRight`/`ChevronDown`, 44 px de alvo), swatch de 16 px da cor, ícone, nome, tipo (Despesa/Receita em `--text-sm`), menu `⋮`; subcategorias recuadas em `--space-6`; selos "Padrão" e "Arquivada" (`c-chip` neutro). Toque abre o detalhe em tela cheia.
- **Regras**: cartões com condição em linguagem natural ("Descrição contém UBER *TRIP"), categoria de destino (swatch + nome), contagem de aplicações, `c-switch` "Ativa" (44 px) e menu; reordenação por botões "Subir"/"Descer" de 44 px (alternativa ao arrastar).

### 9.3 Desktop

- Árvore (7/12) e painel de detalhe (5/12) lado a lado em `lg`; árvore em `role="tree"` com setas, Home/End; linha de 44 px (hover `--color-row-hover`, selecionada `--color-row-selected` com indicador de 3 px); coluna de tipo e menu `⋮`; "Mostrar arquivadas" (`c-checkbox`) acima.
- Detalhe: Nome (`c-field`), Tipo (`c-segmented` Despesa/Receita), Cor (`c-swatch-picker`: 12 amostras de 44 px, `Check` na selecionada, nome acessível), Ícone (grade de 8 ícones), Categoria pai (`c-select`), "Mapeia da Pluggy: Housing" (informação, `--type-caption`), "Transações: 214" (link), "Arquivar" (`c-button--danger-outline`) e "Salvar" (primário).
- **Regras**: `c-table` (Prioridade, Condição, Categoria, Ativa, Aplicada a, ações): coluna de prioridade com alça `GripVertical` + botões "Subir"/"Descer" (ícones `ChevronUp`/`ChevronDown`), `c-switch` de ativa, botão "Aplicar retroativamente" (ghost) e `⋮`; texto explicativo da precedência em `c-banner--info` (descartável).

### 9.4 Cores semânticas

Cores de categoria (`--category-1` a `--category-12`) são **identificação**, nunca semântica financeira; tipo sempre em texto; arquivadas em `--color-text-muted`; regras inativas em `--color-text-muted` com interruptor desligado e texto "Inativa".

### 9.5 Estados

| Estado | Tratamento |
|---|---|
| Carregando | Árvore e lista de regras em esqueleto |
| Vazio de regras | `c-state` "Nenhuma regra criada": "Crie regras para categorizar automaticamente transações recorrentes." + "Nova regra" (primário) |
| Vazio de categorias | Não ocorre (categorias padrão); falha de carregamento usa o estado de erro |
| Erro | `c-state` de erro |
| Arquivar com transações | `alertdialog` com opção de reatribuir (`c-select`) |

### 9.6 Modais

`{nova regra}`: condições com "+ Adicionar condição" (cada condição: campo, operador, valor), categoria de destino, prioridade, `c-checkbox` "Aplicar às transações existentes" e prévia "142 transações serão afetadas" em `c-banner--info`; `{aplicação retroativa}`: lista de amostras (5 linhas), total, aviso "Edições manuais não serão sobrescritas (N ignoradas)", "Aplicar" e toast com "Desfazer"; `{arquivar categoria}`: confirmação média; `{nova categoria}`: nome, tipo, categoria pai, cor, ícone.

---

## 10. Conexões

**Rota:** `/conexoes`. O status é onipresente (indicador do cabeçalho leva aqui).

### 10.1 Hierarquia

1) Estado geral e limite de conexões; 2) cartões de conexão (problemas primeiro); 3) histórico de sincronizações.

### 10.2 Celular

| Região | Composição |
|---|---|
| Resumo | `c-card` com "4 de 5 conexões" (`--type-h2`) e `c-progress` segmentado de 5 posições (4 preenchidas), "Conectar instituição" (primário, largura total, desabilitado com texto "Limite de 5 conexões atingido" quando 5/5), "Sincronizar tudo" (secundário, largura total); nota `ShieldCheck` "Acesso somente leitura. Suas credenciais bancárias não são armazenadas por este app." |
| Lista | `d-connection-card` em 1 coluna: ordenação por gravidade (Erro, Atenção, Sincronizando, Atualizado); ação primária contextual de 44 px (Reconectar ou Sincronizar) e menu `⋮` |
| Histórico | Seção recolhível "Histórico de sincronizações" (`aria-expanded`); itens como cartões (conexão, resultado com `c-badge`, início e fim, itens e erros); rolagem horizontal não é usada |
| Detalhe da conexão | `c-drawer` em tela cheia |

### 10.3 Desktop

- Cabeçalho da página: "Conectar instituição" (primário) e "Sincronizar tudo" (secundário) à direita; contador "Conexões ativas: 4 de 5" com barra segmentada.
- Nota de segurança em `c-banner--info` persistente.
- Lista: `c-card` por conexão em largura total (avatar, nome, `c-badge` de status, última sincronização, dados disponibilizados em chips, consentimento, mensagem de erro, ação contextual à direita e `⋮`).
- Histórico: `c-table` (Início, Fim, Conexão, Resultado, Itens, Erros, "Detalhes") com filtros (`c-select` conexão e resultado) e paginação; em `md` e abaixo, lista de cartões; a rolagem horizontal contida só é usada se a tabela for mantida em celular (exceção permitida, `role="region"` com primeira coluna sticky).
- Detalhe da conexão: `c-drawer` 480 px: instituição, status, mensagem de erro, última sincronização, validade do consentimento, dados disponibilizados e histórico filtrado.

### 10.4 Cores semânticas

Status por `c-badge`: Atualizado `ok` (`CircleCheck`), Ação necessária `warning` (`TriangleAlert`), Erro `error` (`OctagonAlert`), Sincronizando `info` (`RefreshCw`); consentimento a vencer em `--color-warning-text` com ícone e texto; destaque do cartão com problema por borda esquerda de 3 px (apoio ao ícone e ao texto); o botão "Reconectar" é primário nos cartões com problema.

### 10.5 Estados

| Estado | Tratamento |
|---|---|
| Carregando | Contador e 3 cartões de conexão em esqueleto |
| Vazio | `c-state` "Nenhuma instituição conectada" (ícone `Link2`): explicação de somente leitura, "Conectar instituição" (primário) e "Importar extrato" (secundário) |
| Erro de carregamento | `c-state` de erro |
| Limite atingido | Botão desabilitado + texto "Limite de 5 conexões atingido" visível (não só tooltip) |
| Sincronização em curso | `c-progress` por conexão com "Contas ok · Transações 60%" e indicador global ativo; "Sincronizar" desabilitado |
| Histórico vazio | "Nenhuma sincronização registrada ainda." |

### 10.6 Modais

`{modal de conexão}`: modal central 480 px com lista de garantias (ícones `ShieldCheck`, `Lock`, `Eye`), "Você tem 4 de 5 conexões em uso." e "Continuar" (primário); `{widget Pluggy}`: contêiner (modal 480 a 520 px no desktop, tela cheia no celular) com esqueleto "Abrindo ambiente seguro..." e estado de erro; `{confirmar desconexão}`: modal 480 px com dois rádios ("Manter histórico" padrão e "Excluir histórico"), botão primário "Desconectar e manter histórico" que, ao escolher excluir, vira `c-button--danger` "Desconectar e excluir histórico" e abre `{confirmar exclusão do histórico}` (campo "Digite Itaú para confirmar", botão final desabilitado até coincidir).

---

## 11. Importação

**Rota:** `/importacao`.

### 11.1 Hierarquia

1) Passo atual do assistente; 2) área de envio; 3) pré-visualização com resumo; 4) lotes anteriores.

### 11.2 Celular

- `c-tabs` "Nova | Lotes".
- `c-stepper` compacto ("Passo 1 de 4 · Arquivo" + barra de 4 segmentos) no topo.
- **Passo 1**: `c-select` "Destino" (conta ou cartão), `c-dropzone` (altura 120 px, só "Selecionar arquivo"), legenda ".ofx ou .csv · até 20 MB", `c-banner--info` "Importação é um complemento. Prefira conectar a instituição."; "Continuar" fixo no rodapé (barra inferior fixa da etapa, acima da barra de navegação).
- **Passo 2 (CSV)**: cartões por coluna ("Coluna 1: Data (amostra: 05/10/2026)" com `c-select` de campo), opções (separador, codificação, formato de data, decimal) em acordeão; "Sugerido automaticamente" com `CircleCheck`.
- **Passo 3**: resumo fixo no topo ("128 lidos · 112 novas · 14 duplicadas · 2 com erro", cada contagem com `c-badge` e ícone), filtro `c-segmented` (Todas, Novas, Duplicadas, Com erro), lista de cartões (descrição, data, valor, categoria sugerida, situação `c-badge`: Nova `ok`, Duplicada `neutral`, Erro `error` com mensagem) com `c-switch`/checkbox de inclusão (44 px); "Exportar linhas com erro" (secundário); "Continuar" fixo.
- **Passo 4**: `c-card` de resumo e "Importar 112 lançamentos" (primário, largura total); em andamento: `c-progress` "Importando... 40 de 112".
- **Lotes**: cartões (arquivo, data, destino, formato, quantidade, status `c-badge` Ativo `ok`/Desfeito `neutral`) com "Desfazer lote" (`c-button--danger-outline`).

### 11.3 Desktop

- `c-stepper` horizontal (4 círculos de 32 px com rótulos Arquivo, Mapeamento, Pré-visualização, Confirmação) acima do corpo, em `c-card` de largura até 960 px (centralizado).
- Passo 1: `c-dropzone` grande (altura 200 px) com ícone e texto de arrastar; rodapé do cartão com "Cancelar" (ghost) e "Continuar" (primário).
- Passo 2: `c-table` de amostra (rolagem horizontal contida, `role="region"`, `aria-label="Pré-visualização do arquivo"`, primeira coluna sticky) com seletores de campo no cabeçalho; opções de leitura em linha; escolha de modo de valores (`c-radio`).
- Passo 3: resumo em linha (contadores e totais de receitas e despesas a importar, `d-money`), `c-table` com seleção (Data, Descrição, Valor, Categoria sugerida, Situação) e "Incluir duplicadas" (`c-checkbox`).
- Passo 4: resumo e "Importar N lançamentos".
- Lotes: `c-table` (Arquivo, Data, Destino, Formato, Qtd, Status, Ação).

### 11.4 Cores semânticas

Situações por `c-badge` com ícone e texto (Nova `ok`, Duplicada `neutral`, Erro `error`); valores a importar com cor financeira e sinais; dropzone ativa em `--color-primary`; erro em `--color-danger`.

### 11.5 Estados

| Estado | Tratamento |
|---|---|
| Carregando | Leitura: `c-progress` "Lendo arquivo..."; gravação: "Importando... 40 de 112" com `aria-live="polite"` |
| Vazio (lotes) | `c-state` "Nenhuma importação realizada" + "Importar arquivo" (primário) |
| Erro de arquivo | `c-dropzone` em erro com "Não conseguimos ler este arquivo." + "Escolher outro arquivo" |
| Erro de gravação | `c-banner--error` "A importação falhou. Nenhum lançamento foi adicionado." + "Tentar novamente" |
| Nada a importar | `c-state` informativo "Todos os lançamentos já existem. Nada para importar." |
| Sucesso | Cartão de resultado (`CircleCheck` `--color-success`, "112 importados") + "Ver transações importadas" (primário) e "Importar outro arquivo" (secundário) |

### 11.6 Modais

`{desfazer lote}`: `alertdialog` com a consequência ("Edições feitas neles serão perdidas. Transações do Open Finance não são afetadas.") e botão `c-button--danger` "Desfazer lote".

---

## 12. Alertas

**Rota:** `/alertas`.

### 12.1 Hierarquia

1) Alertas não lidos; 2) ações de cada alerta; 3) preferências.

### 12.2 Celular

- `c-tabs` "Central (3) | Preferências"; botão "Marcar lidos" (ghost) no cabeçalho da página.
- Central: lista de cartões de alerta: marcador de não lido (ponto de 8 px `--color-primary` e texto "Não lido" oculto visualmente + fonte em peso 600), ícone do tipo em círculo de 40 px com fundo `-bg` do status, título (`--type-body`, 500), detalhe com valor, data e hora, ação ("Ver fatura", "Ver orçamento", "Reconectar", `c-button--secondary c-button--sm` de 44 px) e "Lido"; lidos em peso 400 com texto `--color-text-muted`.
- Preferências: lista de linhas de 56 px com `c-switch` e rótulo; ao ligar, campo de limite abaixo (`c-field` pequeno com unidade: "3 dias antes", "90%", "15 dias", "2,5x"); salvamento automático com "Salvo" (`--text-xs`, `CircleCheck`) e `aria-live`; seção "Notificações por e-mail" com `c-switch`, campo de e-mail e `c-checkbox`s por tipo.

### 12.3 Desktop

- Central: `c-card` com lista de alertas (largura 100%): cabeçalho com filtros (`c-select` "Todos os tipos" e `c-segmented` "Não lidos | Todos") e "Marcar todos como lidos"; cada linha: ícone do tipo, título e detalhe, data/hora à direita (`--type-caption`, tabular), ações à direita (hover revela "Lido"); o sino abre `c-popover` com os 5 mais recentes.
- Preferências: `c-card` com seções "Alertas internos" e "Notificações por e-mail" em coluna de até 640 px; linha: rótulo e descrição à esquerda, `c-switch` e campo de limite à direita; rodapé "Descartar" e "Salvar" quando houver alteração pendente (desktop usa salvamento explícito para e-mail; limites salvam inline).

### 12.4 Cores semânticas

Tipo por ícone e cor de status: fatura a vencer `warning` (`CalendarClock`), orçamento excedido `error` (`OctagonAlert`) ou próximo `warning` (`TriangleAlert`), conexão com erro `error` (`Link2` com `OctagonAlert`), consentimento a expirar `warning` (`Clock`), gasto atípico `info` (`TrendingUp`), nova assinatura `info` (`Sparkles`); sempre ícone, título e texto; contador do sino em `--color-primary`.

### 12.5 Estados

| Estado | Tratamento |
|---|---|
| Carregando | Lista de 5 itens em esqueleto |
| Vazio | `c-state` "Tudo em dia. Nenhum alerta por enquanto." (ícone `BellOff`) com link "Ajustar preferências" |
| Vazio de filtro | "Nenhum alerta deste tipo." + "Limpar filtro" |
| Erro | `c-state` de erro; erro ao salvar preferência: `c-toast` de erro e interruptor volta ao valor anterior |

### 12.6 Painéis

Popover do sino: `c-popover` de 360 px, cabeçalho "Alertas" com "Marcar lidos", 5 itens de 56 px, rodapé "Ver todos os alertas".

---

## 13. Relatórios

**Rota:** `/relatorios`.

### 13.1 Hierarquia

1) Resumo do mês (receitas, despesas, resultado); 2) seções do relatório; 3) exportações.

### 13.2 Celular

- `c-tabs` "Mensal | Exportações"; seletor de mês (`d-period-picker` mensal).
- **Mensal**: `c-card` de resumo (Receitas, Despesas, Resultado em três linhas com `d-money--lg`, rótulo à esquerda), seguido de acordeões `c-card` (`Categorias`, `Cartões`, `Patrimônio`) com `aria-expanded`; cada acordeão: cabeçalho de 56 px com `ChevronDown`; conteúdo com tabela em lista de pares e gráfico compacto; "Imprimir" e "Exportar PDF" no menu de ações do cabeçalho.
- **Exportações**: formulário em coluna única; "Exportar transações filtradas (CSV)" com filtros em `c-field`/`c-select`, prévia "128 transações · Receitas ... · Despesas ..." e "Exportar CSV" (primário, largura total); "Exportar todos os dados": `c-radio` JSON/CSV, `c-banner--warning` "O arquivo contém dados financeiros sensíveis. Guarde com cuidado.", botão primário.

### 13.3 Desktop

- Cabeçalho da página: seletor de mês à esquerda; "Imprimir" (secundário) e "Exportar PDF" (secundário) à direita.
- Relatório em `c-card` de leitura (largura até 960 px, centralizado): cabeçalho "Relatório de outubro de 2026" com "Gerado em 05/10/2026", três `d-kpi` em linha (Receitas, Despesas, Resultado), "Categorias" (rosca + tabela com valor, % e variação), "Cartões" (gasto por cartão, faturas do mês, parcelas comprometidas), "Patrimônio" (Contas + Investimentos − Faturas = Patrimônio líquido, em equação visual com sinais).
- Exportações: dois `c-card` empilhados (filtros em grade de 2 a 3 colunas, prévia e botão; exportação total com opções).
- **Impressão/PDF**: tema claro, A4 retrato, sem menu e cabeçalho global, data e período no topo, gráficos com padrões ativos, `break-inside: avoid` por seção.

### 13.4 Cores semânticas

Receitas, despesas e resultado pelas cores financeiras com sinais; patrimônio líquido em `--color-text` com peso 700; avisos de dados sensíveis em `--color-warning` com ícone e texto.

### 13.5 Estados

| Estado | Tratamento |
|---|---|
| Carregando | Seções em esqueleto |
| Mês sem dados | `c-state` "Nenhuma movimentação em outubro de 2026." + "Escolher outro mês" |
| Gerando exportação | Botão com `c-spinner` "Preparando arquivo...", `aria-busy`; download automático ao concluir; `c-toast` de sucesso |
| Exportação sem registros | "Nenhuma transação corresponde aos filtros." e botão desabilitado |
| Erro | `c-state` de erro ("Não foi possível gerar o relatório/arquivo.") + "Tentar novamente" |

### 13.6 Modais

Confirmação de exportação total: `c-modal` 480 px com aviso de dados sensíveis, "Cancelar" e "Exportar"; aviso de valores ocultos: "Exportações e impressão não são mascaradas" (`c-banner--info`) antes de imprimir.

---

## 14. Configurações

**Rota:** `/configuracoes`.

### 14.1 Hierarquia

1) Seção atual (Perfil e região, Aparência, Segurança, Dados e privacidade); 2) campos; 3) zona de perigo (isolada).

### 14.2 Celular

- Lista de seções (cartões de 56 px com ícone 20 px, nome e `ChevronRight`); cada uma abre a seção em tela cheia com botão voltar (44 px) e coluna única.
- **Perfil e região**: Nome (`c-field`), e-mail (somente leitura), Moeda "BRL - Real brasileiro (fixa)" e Fuso "America/Sao_Paulo (fixo)" (campos somente leitura com `Lock`), Dia de início do mês (`c-select` 1 a 28) com `Info` explicativo; "Salvar" (primário, largura total, fixo no rodapé).
- **Aparência**: `c-theme-switch` em largura total, prévia pequena do tema; densidade da tabela (`c-segmented`) com texto "Vale a partir de telas largas; no celular os cartões mantêm 44 px"; "Ocultar valores por padrão" (`c-switch`).
- **Segurança**: linhas com ação: "Senha" + "Alterar senha"; "Entrar com Google" com conta vinculada e "Desvincular" (secundário); "Verificação em duas etapas" com `c-switch`; "Códigos de recuperação" (aparece com 2FA ativo; "Ver status", "Gerar novos códigos"); "Sessão atual" e "Sair de todos os dispositivos" (`c-button--danger-outline`).
- **Dados e privacidade**: "Exportar seus dados" (secundário), "Conexões Open Finance" (link para Conexões), texto de armazenamento e `c-danger-zone` "Excluir todos os dados" no fim.

### 14.3 Desktop

- Duas colunas: navegação de seções à esquerda (largura 240 px, `c-tabs` vertical ou lista de itens de 44 px com indicador de 3 px na seleção, `aria-current`) e conteúdo à direita em `c-card` de até 640 px; a navegação é sticky.
- Campos em 1 coluna (máx. 640 px) ou 2 colunas quando curtos; rodapé do cartão com "Descartar" e "Salvar" quando houver alterações.
- Segurança: linhas com rótulo e descrição à esquerda e ação à direita; "Códigos de recuperação" mostra "8 códigos restantes" com `c-badge` `ok` (ou `warning` com 2 ou menos).
- Aparência: prévia ao vivo de duas linhas de tabela nas duas densidades (confortável 48 px, compacta 40 px).

### 14.4 Cores semânticas

Cor de ação só nos primários; zona de perigo em `--color-danger-*` (borda `--color-danger-border`, título `--color-danger-text`, botão `danger-outline`); estados de 2FA: Ativado `ok` (`ShieldCheck`) e Desativado `neutral` (`ShieldOff`) com texto; "Salvo" `--color-success-text` com `CircleCheck`.

### 14.5 Estados

| Estado | Tratamento |
|---|---|
| Carregando | Campos em esqueleto (rótulo e controle) |
| Vazio | Não se aplica (valores padrão presentes) |
| Erro ao carregar | `c-state` de erro + "Tentar novamente" |
| Erro ao salvar | Mensagem inline sob o campo (`CircleAlert`) e `c-toast` de erro; valor anterior restaurado |
| Exclusão em andamento | Modal de passos não fechável com `c-progress` e lista "Revogando conexões ✓, Excluindo dados..., Concluindo" |
| 2FA ativado | `c-banner--success` e exibição única dos códigos de recuperação |

### 14.6 Modais

`{ativar 2FA}`: modal central 480 px (folha no celular): passo 1 QR code (200 x 200 px sobre fundo **branco fixo**, único elemento com fundo claro em tema escuro, com borda `--color-border-strong` e margem de 12 px para leitura) e chave em `--font-mono` com `c-button--ghost` "Copiar"; passo 2 `c-otp` de 6 dígitos; "Cancelar" e "Ativar". Após ativar: 8 códigos em grade 2 x 4 (`--font-mono`, `--text-base`), botões "Copiar", "Baixar", "Imprimir" e `c-checkbox` "Guardei meus códigos" que habilita "Concluir". `{alterar senha}`: três campos e lista de requisitos em tempo real. `{exclusão total}`: modal de passos (Etapa 1 de 3 "O que será removido" com lista, Etapa 2 de 3 escolha por `c-radio` de manter ou encerrar o acesso, Etapa 3 de 3 com senha e frase "EXCLUIR TUDO"); botão final `c-button--danger` "Excluir tudo permanentemente" desabilitado até validar; execução em andamento com progresso e fechamento bloqueado.

---

## 15. Checklist de aceite visual por tela (para a Etapa 1.4)

| Critério | Verificar |
|---|---|
| Desenho-base | A tela funciona integralmente em 320 px, sem rolagem horizontal de página |
| Desktop | Usa o espaço em `lg`, `xl` e `2xl` (colunas, painel, tabela densa), não é o celular esticado |
| Tokens | Nenhum valor literal de cor, espaço ou tipografia |
| Temas | Contraste e hierarquia validados em claro e escuro |
| Estados | Carregando, vazio e erro conforme as tabelas da tela |
| Sinais | Cor nunca é o único sinal |
| Foco e teclado | Foco visível, ordem lógica, sem armadilha |
| Valores | `d-money`, sinais, cores e ocultar valores conforme o design system |
| Alvos | 44 x 44 px no celular |
| Rótulos | `h1` único, rótulos em todos os campos e botões de ícone |
