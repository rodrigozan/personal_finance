# Wireframes de Baixa Fidelidade — Painel Financeiro Pessoal

**Etapa:** 1.1 (Sprint 1) — Arquitetura de UX
**Agente:** UX Architect
**Data:** 05/10/2026
**Base:** URS v1.1 seção 9, RF-xxx da seção 4, Plano seção 3.3

Os wireframes definem estrutura, hierarquia e conteúdo. Não definem cor, tipografia final, ícones finais nem proporções exatas (responsabilidade do UI Designer, Etapa 1.2). Dados são ilustrativos.

---

## 0. Convenções

### 0.1 Legenda

| Símbolo | Significado |
|---|---|
| `[ Botão ]` | Botão; `[* Primário *]` = ação primária da região |
| `[____]` | Campo de texto |
| `[Valor v]` | Seletor (select/combobox) |
| `[x]` / `[ ]` | Checkbox marcado/vazio |
| `(•)` / `( )` | Radio selecionado/vazio |
| `[=o ]` / `[ o=]` | Interruptor ligado/desligado |
| `~~~~` | Gráfico de linha ou área |
| `####` | Barras de gráfico ou de progresso |
| `░░░░` | Esqueleto de carregamento |
| `(!)`, `(x)`, `(ok)`, `(i)` | Ícones de alerta, erro, sucesso, informação |
| `RF-xxx` entre colchetes | Requisito atendido pelo bloco |
| `...` | Conteúdo repetido ou truncado |

### 0.2 Princípio mobile first (decisão do titular)

A aplicação é **mobile first** e deve funcionar bem em navegadores desktop. Em cada tela deste documento:

- O wireframe de **celular vem primeiro (subseção N.1) e é o desenho-base**; o de desktop (N.2) é uma expansão que reorganiza e amplia o mesmo conteúdo, nunca o contrário.
- O conteúdo e as ações são os mesmos nos dois; o desktop acrescenta densidade e simultaneidade (várias colunas, lista e detalhe lado a lado, tabelas completas), não funcionalidade exclusiva.
- **Alvos de toque de no mínimo 44 x 44 px** em todos os controles do celular, com 8 px de espaço entre alvos.
- **Ações principais ao alcance do polegar:** barra de navegação inferior; ação primária de criação em botão flutuante ou no rodapé fixo (canto inferior direito, acima da barra); filtros, seleção em lote e confirmações em folhas inferiores (bottom sheets); ações destrutivas nunca no canto de difícil alcance sem confirmação.
- **Tabelas viram cards (listas de cartões) no celular**; tabelas completas e densas aparecem a partir de `lg`.
- **No desktop** o espaço é usado de fato: menu lateral fixo, grid de 12 colunas, painel lateral de detalhe com a lista visível, tabelas densas com todas as colunas, estados de hover e de foco visíveis em todos os controles, menus de contexto por linha, tooltips, clique em linha e suporte pleno a mouse (além de teclado).
- Breakpoints e larguras máximas: `sistema-de-layout.md`, seção 2.

### 0.3 Shell (aplicado a todas as telas autenticadas)

Os wireframes das telas 2 a 14 mostram somente a **área de conteúdo** (o que fica dentro de `main`). O shell é sempre o definido em `arquitetura-de-informacao.md` (seções 5, 6 e 7).

Celular (base, < 768 px):

```
+----------------------------------+
| Título da tela  [olho] (ok) 12 min (3)|
+----------------------------------+
|  ÁREA DE CONTEÚDO                |
|  (rolagem vertical)              |
+----------------------------------+
| [Início] [Trans.] [Contas] [Cart.] [Mais]
+----------------------------------+
```

Desktop (expansão, >= 1024 px):

```
+----------+--------------------------------------------------------------------+
| MENU     | Título da tela [Período v] [olho] (ok) Atualizado há 12 min [↻] (3) [RA v]|
| lateral  +--------------------------------------------------------------------+
| 256 px   | ÁREA DE CONTEÚDO (máx. 1280 px em xl; 1440 px em 2xl; centralizada)|
|          |                                                                    |
+----------+--------------------------------------------------------------------+
```

### 0.4 Padrão dos três estados (RNF-USA-03)

Todo bloco de dados (cartão, gráfico, tabela, lista) tem os três estados abaixo. As telas detalham apenas o que é específico.

**Carregando** — esqueleto com a mesma geometria do conteúdo final (evita salto de layout); `aria-busy="true"` e texto oculto "Carregando..." para leitores de tela. Sem spinner de tela cheia, exceto na tela de login.

```
+--------------------------------+
| ░░░░░░░░░░                     |
| ░░░░░░░░░░░░░░░░░              |
| ░░░░░░░░░░░░                   |
+--------------------------------+
```

**Vazio** — ícone discreto + título + frase explicando o motivo + uma ação.

```
+--------------------------------+
|            (ícone)             |
|     Nenhuma transação ainda    |
|  Conecte uma instituição ou    |
|  importe um extrato para ver   |
|  seus lançamentos aqui.        |
|  [* Conectar instituição *]    |
|  [ Importar extrato ]          |
+--------------------------------+
```

Distinção entre dois vazios: **vazio de origem** (nunca houve dados; oferece conectar/importar) e **vazio de filtro** (existem dados, mas o filtro não retorna nada; oferece "Limpar filtros").

**Erro** — ícone de erro + o que aconteceu + o que fazer + ação; erro por bloco não derruba a tela.

```
+--------------------------------+
|  (x) Não foi possível carregar |
|  as transações.                |
|  Seus dados não foram alterados|
|  [* Tentar novamente *]        |
+--------------------------------+
```

Erro de tela inteira (rota inexistente, falha geral) usa o mesmo padrão centralizado, com "Voltar ao Dashboard" como segunda ação.

### 0.5 Padrões de modal e painel

| Padrão | Uso | Desktop | Celular |
|---|---|---|---|
| Modal central | Confirmações, formulários curtos (largura 480 a 640 px) | Centralizado com fundo escurecido | Folha inferior (bottom sheet) até 90% da altura |
| Modal de passos | Fluxos de várias etapas (importação, exclusão total) | Modal 640 px com indicador de etapa | Tela cheia com botão voltar |
| Painel lateral | Detalhe de transação, nova transação, detalhe de compra parcelada | Painel à direita 480 px, lista permanece visível | Tela cheia deslizante, botão voltar |
| Popover | Status de sincronização, alertas recentes | Ancorado ao gatilho | Folha inferior |
| Toast | Resultado de ações | Canto inferior direito, 5 s, com ação opcional | Parte inferior acima da barra de navegação |

Regras comuns: foco inicial no primeiro controle ou título; focus trap; `Esc` fecha (exceto durante execução destrutiva); foco retorna ao gatilho; rodapé com ação primária à direita e cancelar à esquerda; ação destrutiva com estilo "perigo".

---

## 1. Tela 1 — Login

**Requisitos:** RF-AUT-01, RF-AUT-02, RF-AUT-05, RF-AUT-06, RF-AUT-07, RNF-SEG-06, RNF-USA-03. Login com Google adicionado por decisão do titular (extensão de RF-AUT-01; sujeito a RF-AUT-02: sem cadastro público).
Tela pública, fora do shell. Sem menu e sem cabeçalho global; apenas seletor de tema discreto no canto superior direito.

### 1.1 Celular (desenho-base)

```
+----------------------------------+
|                    [Tema v]      |
|        (logo) Painel Financeiro  |
|                                  |
|  Entrar                          |
|  Acesso restrito ao titular.     |
|                                  |
|  E-mail                          |
|  [____________________________]  |
|  Senha                           |
|  [_______________________][olho] |
|  Esqueci minha senha             |
|                                  |
|  [* Entrar *]  (largura total)   |
|                                  |
|  ------------- ou -------------  |
|                                  |
|  [ (G) Entrar com Google ]       |
|  (largura total, 48 px)          |
|                                  |
|  Somente leitura. Nenhuma        |
|  credencial bancária é           |
|  armazenada por este app.        |
+----------------------------------+
```

### 1.2 Desktop (expansão)

```
+--------------------------------------------------------------------------------+
|                                                              [Tema: Sistema v] |
|                                                                                |
|                    +--------------------------------------+                    |
|                    |           (logo)  Painel Financeiro  |                    |
|                    |                                      |                    |
|                    |   Entrar                             |   h1               |
|                    |   Acesso restrito ao titular.        |   [RF-AUT-02]      |
|                    |                                      |                    |
|                    |   E-mail                             |                    |
|                    |   [__________________________]       |   [RF-AUT-01]      |
|                    |                                      |                    |
|                    |   Senha                              |                    |
|                    |   [______________________] [mostrar] |                    |
|                    |                                      |                    |
|                    |   Esqueci minha senha                |   [RF-AUT-06]      |
|                    |                                      |                    |
|                    |   [* Entrar *]                       |                    |
|                    |   ------------- ou -------------     |                    |
|                    |   [ (G) Entrar com Google ]          |   [RF-AUT-02]      |
|                    |                                      |                    |
|                    |   Somente leitura. Nenhuma credencial|                    |
|                    |   bancária é armazenada por este app.|                    |
|                    +--------------------------------------+                    |
+--------------------------------------------------------------------------------+
```

### 1.3 Variantes da tela

**Etapa 2FA (RF-AUT-07)**

```
+--------------------------------------+
|  Verificação em duas etapas          |
|  Digite o código de 6 dígitos do     |
|  seu aplicativo autenticador.        |
|  [_][_][_][_][_][_]                  |
|  [* Verificar *]                     |
|  Usar código de recuperação          |
|  Voltar                              |
+--------------------------------------+
```

**Acesso negado no login com Google (RF-AUT-02)**

```
+----------------------------------+
|  Entrar                          |
|  (x) Esta conta Google não tem   |
|  acesso a este painel. Entre com |
|  a conta do titular ou use       |
|  e-mail e senha.                 |
|  [ Tentar com outra conta ]      |
|  [ Entrar com e-mail e senha ]   |
+----------------------------------+
```

**Recuperação de senha — solicitar (RF-AUT-06)**

```
+--------------------------------------+
|  Recuperar senha                     |
|  Informe seu e-mail e enviaremos um  |
|  link para criar uma nova senha.     |
|  E-mail [____________________]       |
|  [* Enviar link de recuperação *]    |
|  Voltar ao login                     |
+--------------------------------------+
```

Confirmação: "Se esse e-mail estiver cadastrado, enviamos um link... Reenviar em 0:59".

**Recuperação de senha — redefinir (RF-AUT-06)**

```
+--------------------------------------+
|  Criar nova senha                    |
|  Nova senha        [____________]    |
|  Confirmar senha   [____________]    |
|  (ok) Mínimo de 12 caracteres        |
|  ( ) Letras e números                |
|  [* Salvar nova senha *]             |
+--------------------------------------+
```

### 1.4 Estados

| Estado | Wireframe / descrição |
|---|---|
| Carregando | Botão "Entrar" com spinner e texto "Entrando..."; campos desabilitados; `aria-busy` no formulário |
| Vazio | Não se aplica (formulário). Equivalente: primeiro acesso mostra o mesmo formulário |
| Erro de credencial | Banner acima do botão: `(x) E-mail ou senha incorretos.` com `role="alert"`; campo senha limpo; foco no e-mail |
| Erro de bloqueio por tentativas (RNF-SEG-06) | `(x) Muitas tentativas. Tente novamente em 4 min.`; botão desabilitado |
| Erro de rede | `(x) Não foi possível entrar agora. Verifique sua conexão.` + "Tentar novamente" |
| Google: acesso negado (RF-AUT-02) | Banner `role="alert"`: `(x) Esta conta Google não tem acesso a este painel. Entre com a conta do titular ou use e-mail e senha.` + [ Tentar com outra conta ]; nenhuma sessão é criada |
| Google: e-mail não verificado | `(x) Não foi possível confirmar o e-mail desta conta Google.` + [ Tentar com outra conta ]; tratado como acesso negado |
| Google: cancelado pelo titular | `(i) Login com Google cancelado.` (aviso informativo, sem erro); formulário permanece |
| Google: falha do provedor ou da rede | `(x) Não foi possível entrar com Google agora. Tente novamente ou use e-mail e senha.` + [ Tentar novamente ] |
| Google: carregando | Botão com spinner e texto "Abrindo o Google..."; o formulário de e-mail fica desabilitado até o retorno |
| Google: titular com 2FA | Após o retorno, abre a etapa 2FA (código TOTP ou de recuperação) antes de entrar |
| Link de recuperação expirado | `(x) Este link expirou ou já foi usado.` + [ Solicitar novo link ] |
| Sessão expirada (RF-AUT-05) | Aviso informativo no topo do formulário: `(i) Sua sessão expirou. Entre novamente.` |

### 1.5 Modais e painéis

O login com Google usa redirecionamento de página inteira (sem pop-up), o que funciona melhor no celular e evita bloqueio de pop-up; o retorno traz o titular de volta ao Login (em caso de erro) ou à rota solicitada. A expiração de sessão dentro do app abre o modal central `{sessão expirada}`: título "Sua sessão expirou", texto, [* Entrar *].

---

## 2. Tela 2 — Dashboard

**Requisitos:** RF-DSH-01 a 07, RF-CTA-02, RF-CAR-07, RF-INV, RN-08, RN-09, CA-06.
Cabeçalho da página inclui o seletor de período (RF-DSH-07).

### 2.1 Celular (desenho-base)

```
+----------------------------------+
| [Mês v] [< Out/2026 >]           |
+----------------------------------+
| Saldo total                      |
| R$ 48.320,15                     |
| 4 contas                         |
+----------------------------------+
| Receitas        Despesas         |
| R$ 12.400,00    -R$ 8.915,40     |
| ▲ 5,2%          ▼ 3,1%           |
+----------------------------------+
| Resultado do mês                 |
| R$ 3.484,60   ▲ R$ 612 vs. set.  |
+----------------------------------+
| Gastos por categoria             |
| [Gráfico | Tabela]               |
|  (rosca compacta)                |
|  Moradia      R$ 2.800   31% [>] |
|  Alimentação  R$ 1.950   22% [>] |
|  [Ver todas]                     |
+----------------------------------+
| Fluxo de caixa                   |
|  (barras com rolagem horizontal) |
+----------------------------------+
| Evolução do patrimônio           |
|  ~~~~~~~~~~~~~~                  |
+----------------------------------+
| Faturas a vencer                 |
|  Nubank R$ 2.310 em 3 dias       |
+----------------------------------+
| Últimas transações               |
|  Mercado PdA   04/10  -R$ 212,30 |
|  ...  [Ver todas]                |
+----------------------------------+
```

Ordem no celular: indicadores, categorias, fluxo, patrimônio, faturas, últimas transações. Gráficos com rolagem horizontal interna quando necessário, nunca rolagem da página.

### 2.2 Desktop (expansão) — grade de 12 colunas

```
Período: [Mês v] [< Outubro de 2026 >]  Início do mês: dia 5          [RF-DSH-07]
Comparando com: setembro de 2026

+-----------------+-----------------+-----------------+-----------------+
| Saldo total     | Receitas        | Despesas        | Resultado       |  [RF-DSH-01]
| R$ 48.320,15    | R$ 12.400,00    | -R$ 8.915,40    | R$ 3.484,60     |
| 4 contas        | ▲ 5,2% vs. mês  | ▼ 3,1% vs. mês  | ▲ R$ 612 vs. mês|  [RF-DSH-05]
+-----------------+-----------------+-----------------+-----------------+

+-------------------------------------------+-----------------------------+
| Gastos por categoria                      | Fluxo de caixa mensal       |
| [Gráfico | Tabela]                        | Entradas x Saídas           |
|   (rosca/barras)                          |  ####  ####  ####  ####     |
|  Moradia        R$ 2.800  31%  [>]        |  ####  ####  ####  ####     |
|  Alimentação    R$ 1.950  22%  [>]        |  ~~~~ evolução do saldo ~~~~|
|  Transporte     R$ 1.100  12%  [>]        |  [RF-DSH-03]                |
|  ...  [Ver todas]    [RF-DSH-02]          |                             |
+-------------------------------------------+-----------------------------+

+-------------------------------------------+-----------------------------+
| Evolução do patrimônio                    | Faturas a vencer            |
| contas + investimentos - faturas em aberto|  Nubank   R$ 2.310  em 3 d  |
|  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~         |  Itaú     R$ 1.045  em 9 d  |
|  Patrimônio líquido: R$ 163.870,00        |  [Ver cartões]  [RF-DSH-05] |
|  [RF-DSH-04]                              |  [RF-CAR-07]                |
+-------------------------------------------+-----------------------------+

+-----------------------------------------------------------------------+
| Últimas transações                                  [Ver todas]       |
| 04/10  Mercado Pão de Açúcar   Alimentação   Itaú Corrente  -R$ 212,30|
| 04/10  Salário                 Renda         Itaú Corrente  R$ 9.800,00|
| 03/10  Uber                    Transporte    Nubank         -R$ 24,90 |
| ...                                              [RF-DSH-05]          |
+-----------------------------------------------------------------------+
```

Comportamentos: clicar em categoria ou fatia = drill-down para Transações filtrada por categoria e período (RF-DSH-02, CA-06). Alternar "Gráfico | Tabela" oferece equivalente textual para acessibilidade. Cartões de indicador têm link "Ver transações" com os mesmos filtros (CA-06). Contas ocultas ou excluídas do consolidado não entram nos totais (RN-09), com nota "Totais consideram 4 de 5 contas".

### 2.3 Estados

| Estado | Descrição |
|---|---|
| Carregando | Quatro cartões de indicador e seis blocos em esqueleto; indicador de sincronização do cabeçalho permanece ativo |
| Vazio de origem | Cartão de boas-vindas no topo: "Comece conectando uma instituição" com três passos, [* Conectar instituição *], link "Importar extrato"; indicadores mostram `R$ 0,00` em cinza com texto "Sem dados no período" |
| Vazio de período | Indicadores zerados e nota "Nenhuma movimentação neste período." com [ Alterar período ] |
| Erro por bloco | Cada bloco falha isoladamente com `(x)` e [ Tentar novamente ]; indicadores permanecem se disponíveis |
| Dados desatualizados | Faixa informativa sob o cabeçalho: `(!) Dados atualizados há 2 dias. [ Sincronizar agora ]`; faixa de ação se há conexão com erro: `(!) Inter precisa de reconexão. [ Reconectar ]` [RF-DSH-06] |

### 2.4 Modais e painéis

Seletor de período `{período personalizado}` (RF-DSH-07):

```
+--------------------------------------+
| Período personalizado                |
| De  [dd/mm/aaaa]   Até [dd/mm/aaaa]  |
| Períodos rápidos: [Últimos 30 dias] [Este ano]|
| (i) Mês financeiro começa no dia 5.  |
| [ Cancelar ]        [* Aplicar *]    |
+--------------------------------------+
```

---

## 3. Tela 3 — Transações

**Requisitos:** RF-TRX-01 a 08, RF-CAT-05, RN-01, RN-02, RN-05.

### 3.1 Celular (desenho-base)

```
+----------------------------------+
| Transações        [🔍] [Filtros 2]|
| [Todas|Receitas|Despesas|Transf.]|
+----------------------------------+
| (Out/2026 x) (Alimentação x)     |
+----------------------------------+
| Hoje, 04 de outubro              |
| Mercado Pão de Açúcar            |
| Alimentação · Itaú     -R$ 212,30|
| Salário                          |
| Renda · Itaú         R$ 9.800,00 |
|----------------------------------|
| Sexta, 03 de outubro             |
| Uber *Trip                       |
| Transporte · Nubank     -R$ 24,90|
| Parcela Notebook   4/10          |
| Compras · Nubank       -R$ 450,00|
| ...                              |
+----------------------------------+
| Página 1 de 11  [<] [>]          |
+----------------------------------+
                              [ + ]   botão flutuante: Nova transação
```

Filtros abrem uma folha inferior com todos os campos e botões [ Limpar ] [* Aplicar *]. Seleção em lote: toque longo na linha; barra de ação fixa no topo substitui o cabeçalho ("3 selecionadas" + menu "Ações"). Linhas agrupadas por dia; valores alinhados à direita; tocar abre o detalhe em tela cheia.

### 3.2 Desktop (expansão)

```
Transações                                   [ Nova transação ] [ Exportar CSV ]  [RF-TRX-05][RF-REL-02]

[Todas | Receitas | Despesas | Transferências]   Busca [🔍 descrição, nota...____]   [RF-TRX-02]

Filtros: [Período v] [Conta/Cartão v] [Categoria v] [Tags v] [Valor: mín__ máx__] [Mais filtros]
Exibição: [Confortável | Compacta]  (densidade da tabela, RF-CFG-03/Configurações)
Ativos:  (Out/2026 x) (Alimentação x)                                  [Limpar filtros]

+--------------------------------------------------------------------------------------+
| [ ] Data   Descrição              Categoria     Conta/Cartão    Tags    Valor    ⋮     |
|--------------------------------------------------------------------------------------|
| [ ] 04/10  Mercado Pão de Açúcar  Alimentação   Itaú Corrente   casa    -R$ 212,30 ⋮  |
| [ ] 04/10  Salário                Renda         Itaú Corrente   -      R$ 9.800,00 ⋮  |
| [ ] 03/10  Pgto fatura Nubank     (Interna)     Itaú Corrente   -      -R$ 2.310,00 ⋮ |
| [ ] 03/10  Uber *Trip             Transporte    Nubank  3/3     -        -R$ 24,90 ⋮  |
| [ ] 02/10  Parcela Notebook       Compras       Nubank  4/10    -       -R$ 450,00 ⋮  |
| ...                                                                                  |
+--------------------------------------------------------------------------------------+
Total filtrado: 128 transações · Receitas R$ 12.400,00 · Despesas -R$ 8.915,40
< Anterior   1  2  3 ... 11   Próxima >      Itens por página [50 v]      [RF-TRX-01]
```

Colunas: Data, Descrição (amigável, com original em tooltip), Categoria, Conta/Cartão, Tags, Valor (alinhado à direita), menu de linha. Ordenação por clique no cabeçalho (padrão: data decrescente) [RF-TRX-01]. Selos na linha: `Interna`, `Ignorada`, `Manual`, `Pendente`, `Dividida`, `3/10` (parcela) [RF-TRX-04, 05, 06, RN-04, RN-07].

**Barra de ação em lote** (aparece ao marcar linhas) [RF-TRX-07]:

```
+--------------------------------------------------------------------------------------+
| 12 selecionadas   [ Categoria ] [ Tags ] [ Marcar interna ] [ Ignorar ]   [ Limpar ] |
| ( ) Selecionar as 128 do filtro                                                      |
+--------------------------------------------------------------------------------------+
```

### 3.3 Estados

| Estado | Descrição |
|---|---|
| Carregando | Cabeçalho da tabela real + 10 linhas em esqueleto; filtros desabilitados durante a primeira carga; trocas de página mantêm a tabela com opacidade reduzida e `aria-busy` |
| Vazio de origem | Cartão central: "Nenhuma transação ainda" + [ Conectar instituição ] [ Importar extrato ] [ Nova transação ] |
| Vazio de filtro | "Nenhuma transação encontrada com esses filtros." + [ Limpar filtros ]; sugestão de ampliar período |
| Erro | `(x) Não foi possível carregar as transações.` + [ Tentar novamente ]; filtros preservados |
| Erro ao salvar edição | Toast de erro e retorno do valor anterior; painel permanece aberto |

### 3.4 Painel de detalhe `{detalhe de transação}` (RF-TRX-03, 04, 06, RN-05)

Desktop: painel lateral à direita (480 px). Celular: tela cheia.

```
+------------------------------------------------+
| [<]  Detalhe da transação                  [X] |
|------------------------------------------------|
| -R$ 212,30                    04/10/2026 14:32 |
| Itaú Corrente · Débito                         |
| Selos: [Pendente]                              |
|                                                |
| Descrição amigável                             |
| [Mercado Pão de Açúcar_________________]       |
| Original: PAO DE ACUCAR 1234 SAO PAULO  (só leitura) |
|                                                |
| Categoria                                      |
| [Alimentação > Supermercado v]  [ Dividir ]    |
| Sugerida pela Pluggy: Supermercado             |
|                                                |
| Tags                                           |
| (casa x) (mensal x)  [+ adicionar tag____]     |
|                                                |
| Notas                                          |
| [__________________________________]           |
|                                                |
| Tratamento nos cálculos                        |
| Transferência interna   [ o=]                  |
|  Não conta como receita nem despesa            |
| Ignorar nos cálculos    [ o=]                  |
|                                                |
| Origem: Open Finance · ID externo ocultável    |
|------------------------------------------------|
| [ Excluir ] (só manuais)  [ Cancelar ] [* Salvar *]|
+------------------------------------------------+
```

**Dividir em categorias `{dividir transação}` (RF-TRX-06):**

```
Dividir -R$ 212,30
 Alimentação > Supermercado   [R$ 150,00]  [x]
 Limpeza                      [R$  62,30]  [x]
 [ + Adicionar divisão ]
 Restante: R$ 0,00   (ok)
 [ Cancelar ]  [* Aplicar divisão *]  (habilita só com restante zero)
```

### 3.5 Outros modais

**Nova transação `{nova transação}` (RF-TRX-05):** tipo `(•) Despesa ( ) Receita ( ) Transferência`, valor, data, conta/cartão, descrição, categoria, tags, notas; [ Cancelar ] [* Salvar *].

**Edição em lote `{edição em lote}` (RF-TRX-07):**

```
+--------------------------------------------+
| Editar 12 transações                       |
| ( ) Alterar categoria  [Selecione v]       |
| ( ) Adicionar tags     [____________]      |
| ( ) Remover tags       [____________]      |
| Prévia: 12 transações serão alteradas.     |
| Edições manuais anteriores serão substituídas|
| [ Cancelar ]               [* Aplicar *]   |
+--------------------------------------------+
```

**Criar regra `{criar regra}` e prévia de aplicação (RF-CAT-05):**

```
+--------------------------------------------------+
| Aplicar a transações parecidas?                  |
| Descrição contém  [UBER *TRIP__]  [Editar]       |
| Categoria  Transporte                            |
| ( ) Apenas esta transação                        |
| ( ) Criar regra para as próximas                 |
| (•) Criar regra e aplicar às 18 anteriores       |
| > Opções avançadas (valor, conta, prioridade)    |
| [ Só esta transação ]          [* Confirmar *]   |
+--------------------------------------------------+
```

**Confirmar exclusão de manual `{excluir transação}`:** "Excluir esta transação manual? Não pode ser desfeita." [ Cancelar ] [ Excluir ] (perigo).

### 3.6 Rastreabilidade

RF-TRX-01 (tabela paginada, ordenação, seção 3.2); RF-TRX-02 (filtros, busca); RF-TRX-03 (detalhe); RF-TRX-04 (interruptores interna/ignorar); RF-TRX-05 (nova transação, exclusão de manual); RF-TRX-06 (dividir); RF-TRX-07 (lote); RF-TRX-08 (selo "Interna (detectada)" e reversão); RF-CAT-05 (criar regra).

---

## 4. Tela 4 — Contas

**Requisitos:** RF-CTA-01 a 04, RN-09.

### 4.1 Celular (desenho-base)

```
+----------------------------------+
| Contas                           |
+----------------------------------+
| Saldo consolidado                |
| R$ 48.320,15                     |
| 4 de 5 contas                    |
+----------------------------------+
| ITAÚ                             |
| Itaú Corrente (Principal)        |
| Conta corrente                   |
|                    R$ 31.420,15 >|
| Itaú Poupança                    |
|                     R$ 9.800,00 >|
| NUBANK                           |
| ...                              |
+----------------------------------+
```

Toque na conta abre o detalhe em tela cheia; ações de apelido/ocultar/excluir do consolidado ficam num menu "Ações" no topo do detalhe.

### 4.2 Desktop (expansão)

```
Contas                                                       [ Sincronizar contas ]

+--------------------------------------------------------------------------+
| Saldo consolidado                                                        |
| R$ 48.320,15            4 de 5 contas no consolidado     [RF-CTA-02][RN-09]|
| ~~~~~~~~~~~ histórico do consolidado ~~~~~~~~~~~                         |
+--------------------------------------------------------------------------+

Itaú
+---------------------------------------------------------------+
| Itaú Corrente (apelido: Principal)  Conta corrente   R$ 31.420,15  [⋮] |
| Atualizado há 12 min                                          |
+---------------------------------------------------------------+
| Itaú Poupança                       Poupança         R$ 9.800,00   [⋮] |
+---------------------------------------------------------------+
Nubank
| Nubank Conta                        Conta corrente   R$ 7.100,00   [⋮] |
Inter     (!) Ação necessária - saldo pode estar desatualizado
| Inter Conta (oculta)                Conta corrente   R$ 0,00  [Oculta] [⋮] |
                                                       [RF-CTA-01]
```

Menu de linha `⋮` [RF-CTA-03]: Editar apelido, Ocultar, Excluir do consolidado, Ver histórico.
Selos de linha: `Oculta`, `Fora do consolidado`, `Manual`.

**Detalhe da conta `/contas/{id}` (RF-CTA-04):**

```
< Contas    Itaú Corrente (Principal)           [ Editar apelido ] [ Ocultar ]
Saldo atual  R$ 31.420,15      Conectada via Itaú · atualizada há 12 min

Histórico de saldo   [30 dias | 90 dias | 1 ano | Tudo]
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Tabela alternativa: Data | Saldo   (snapshot a cada sincronização)

Opções: [ ] Excluir do consolidado   [ ] Ocultar conta
Últimas transações da conta                                  [Ver todas]
```

### 4.3 Estados

| Estado | Descrição |
|---|---|
| Carregando | Cartão de saldo consolidado e 4 cartões de conta em esqueleto |
| Vazio | "Nenhuma conta ainda" + [ Conectar instituição ]; nota de que contas aparecem após a primeira sincronização |
| Erro | Bloco de contas com `(x)` e [ Tentar novamente ]; se for conexão com erro, banner com [ Reconectar ] |
| Sem histórico | Gráfico substituído por "O histórico começa a ser registrado a partir da próxima sincronização." |

### 4.4 Modais

`{editar apelido}`: campo "Apelido da conta", [ Cancelar ] [* Salvar *].
`{ocultar conta}`: "Contas ocultas somem das listas e dos totais. Você pode reexibi-las em 'Contas ocultas'." [ Cancelar ] [* Ocultar *].
Filtro "Mostrar contas ocultas" como interruptor na lista.

---

## 5. Tela 5 — Cartões

**Requisitos:** RF-CAR-01 a 07, RN-02, RN-03, RN-04.

### 5.1 Celular (desenho-base)

```
+----------------------------------+
| Cartões                          |
| (Nubank 1234) (Itaú 4521) (Inter)|   carrossel de cartões com snap
+----------------------------------+
| Nubank Ultravioleta final 1234   |
| Fatura R$ 2.310,00    Aberta     |
| Vence 05/11 (3 dias)  (!)        |
| Limite  ####### 34%              |
| Disponível R$ 9.860 de R$ 15.000 |
| Fecha dia 25 · Vence dia 5       |
+----------------------------------+
| [Atual|Faturas|Parcelas|Consol.]  |   abas roláveis
+----------------------------------+
| (i) Pagamento de fatura não é    |
|     despesa.                     |
| 03/10 Uber *Trip      -R$ 24,90  |
| 02/10 Notebook Dell              |
|       Parcela 4/10   -R$ 450,00 |
| ...                              |
+----------------------------------+
```

### 5.2 Desktop (expansão) — lista e fatura atual

```
Cartões

+----------------------+ +----------------------+ +----------------------+
| Nubank Ultravioleta  | | Itaú Azul final 4521 | | Inter Black          |
| final 1234           | | Fatura R$ 1.045,00   | | Fatura R$ 0,00       |
| Fatura R$ 2.310,00   | | Vence em 9 dias      | | Sem fatura aberta    |
| Limite R$ 15.000     | | Limite R$ 8.000      | | Limite R$ 5.000      |
| Disponível R$ 9.860  | | Disponível R$ 6.100  | | Disponível R$ 5.000  |
| ####### 34% usado    | | #####  24% usado     | |                      |
| Fecha dia 25         | | Fecha dia 12         | |                      |
| Vence dia 5  (!) 3 d | | Vence dia 20         | |                      |
+----------------------+ +----------------------+ +----------------------+
 [RF-CAR-01][RF-CAR-07]

Nubank Ultravioleta · [Fatura atual | Faturas | Parcelas e projeção | Consolidado]

Fatura atual                                   Status: Aberta   [RF-CAR-02]
Período 26/09 a 25/10 · Fecha em 25/10 · Vence em 05/11 · Atualizada há 12 min
Total R$ 2.310,00      Mínimo R$ 346,50
(i) O pagamento da fatura não conta como despesa; as compras já foram contabilizadas.
                                                                [RF-CAR-06]
+-----------------------------------------------------------------------+
| Data   Estabelecimento        Categoria     Parcela   Valor           |
| 03/10  Uber *Trip             Transporte    -         -R$ 24,90       |
| 02/10  Notebook Dell          Compras       4/10      -R$ 450,00      |
| 29/09  Netflix                Assinaturas   -         -R$ 55,90       |
| ...                                                  [RF-CAR-03]      |
+-----------------------------------------------------------------------+
```

**Aba Faturas (RF-CAR-02):**

```
 Futuras:   Dez/2026 R$ 780,00 (Projetada)   Nov/2026 R$ 1.250,00 (Projetada)
 Atual:     Out/2026 R$ 2.310,00  Aberta
 Fechadas:  Set/2026 R$ 2.095,10  Paga      Ago/2026 R$ 1.980,00 Paga
 [selecionar fatura carrega suas compras abaixo]
```

**Aba Parcelas e projeção (RF-CAR-04):**

```
Parcelas comprometidas por mês
  Nov  Dez  Jan  Fev  Mar  Abr
  ####  ####  ###  ##   ##   #
 R$ 1.250  R$ 780  R$ 640 ...
Total comprometido: R$ 4.710,00
[Tabela por mês: expandir para ver as compras]
 Nov/2026  R$ 1.250,00  [v]
   Notebook Dell   5/10   R$ 450,00
   Geladeira       3/12   R$ 320,00
```

**Aba Consolidado (RF-CAR-05):**

```
[Período v]  Por: (•) Cartão  ( ) Categoria  ( ) Período
 Cartão       Gasto      %
 Nubank       R$ 2.310   69%     [>] drill-down para Transações
 Itaú         R$ 1.045   31%
 (gráfico de barras)  +  tabela equivalente
```

### 5.3 Estados

| Estado | Descrição |
|---|---|
| Carregando | Três cartões de cartão em esqueleto; área de abas em esqueleto |
| Vazio | "Nenhum cartão encontrado" + explicação: "As instituições conectadas ainda não disponibilizaram dados de cartão." + [ Ir para Conexões ] |
| Cartão sem faturas | "Nenhuma fatura disponível para este cartão ainda." |
| Erro | Bloco com `(x)` e [ Tentar novamente ]; falha em uma fatura não afeta a lista de cartões |
| Instituição sem cartão | Nota informativa por instituição (RF-CON-08) |

### 5.4 Painel `{detalhe de compra parcelada}` (RN-04)

```
+------------------------------------------+
| Notebook Dell                        [X] |
| Compra em 12/07/2026 · 10 parcelas de R$ 450,00 |
| Total R$ 4.500,00 · Parcela atual 4/10   |
| Pagas 3 · Restantes 6 (incl. a atual)    |
| Calendário                               |
|  4/10 Out/2026  R$ 450,00  Fatura atual  |
|  5/10 Nov/2026  R$ 450,00  Projetada     |
|  ...                                     |
| [ Ver transação original ]               |
+------------------------------------------+
```

---

## 6. Tela 6 — Investimentos

**Requisitos:** RF-INV-01 a 06, RN-08.

### 6.1 Celular (desenho-base)

```
+----------------------------------+
| Investimentos          [+ Manual]|
| Valor atual R$ 115.550,00        |
| Aplicado R$ 102.300,00           |
| Rentabilidade +13% (+R$ 13.250)  |
| [Carteira|Alocação|Evol.|Mov.]   |
| RENDA FIXA        R$ 70.200  61% |
|  CDB 110% CDI · XP               |
|  Atual R$ 33.120  +10,4%         |
|  Vence 15/03/2028                |
|  Tesouro Selic · Itaú            |
|  ...                             |
+----------------------------------+
```

Cada investimento é um cartão compacto; toque expande para aplicado, rentabilidade e vencimento.

### 6.2 Desktop (expansão)

```
Investimentos                                      [ + Investimento manual ]  [RF-INV-06]

+------------------+------------------+------------------+
| Valor atual      | Valor aplicado   | Rentabilidade    |
| R$ 115.550,00    | R$ 102.300,00    | +R$ 13.250 (13%) |   [RF-INV-02]
+------------------+------------------+------------------+

[Carteira | Alocação | Evolução | Movimentações]

Carteira (padrão) - agrupada por classe                          [RF-INV-01]
Renda fixa                                         R$ 70.200,00   61%
+---------------------------------------------------------------------------+
| Nome           Instituição  Aplicado    Atual       Rentab.   Vencimento   |
| CDB 110% CDI   XP           R$ 30.000   R$ 33.120   +10,4%    15/03/2028   |
| Tesouro Selic  Itaú         R$ 35.000   R$ 37.080   +5,9%     01/03/2029   |
+---------------------------------------------------------------------------+
Fundos            ...    Renda variável   ...   Previdência   ...   Outros (manual) ...
```

Campos ausentes na origem exibem "—" com tooltip "Não informado pela instituição" [RF-INV-02]. Selo `Manual` em investimentos cadastrados.

**Aba Alocação (RF-INV-03):**

```
Por: (•) Classe  ( ) Instituição
 (rosca)   Renda fixa 61% · Fundos 18% · Renda variável 14% · Previdência 7%
 Tabela equivalente: Classe | Valor | %
```

**Aba Evolução (RF-INV-05):** gráfico de linha do valor total ao longo do tempo com seletor 3M, 6M, 1A, Tudo, e tabela alternativa Data | Valor.

**Aba Movimentações (RF-INV-04):** tabela Data | Investimento | Tipo (aporte, resgate, rendimento, imposto) | Valor, com filtro por tipo e período.

### 6.3 Estados

| Estado | Descrição |
|---|---|
| Carregando | Três indicadores e lista em esqueleto |
| Vazio | "Nenhum investimento encontrado" + [ Conectar instituição ] [ + Investimento manual ] |
| Evolução sem histórico | "O histórico começa a partir da primeira sincronização." |
| Erro | `(x)` + [ Tentar novamente ] |
| Cobertura parcial | Nota "Esta instituição não disponibiliza investimentos." |

### 6.4 Modal `{investimento manual}` (RF-INV-06)

```
+--------------------------------------------+
| Novo investimento manual                   |
| Nome [____________]   Classe [Renda fixa v]|
| Instituição [________]  Vencimento [data]  |
| Valor aplicado [R$ ____]  Valor atual [R$ ____]|
| Observações [__________________]           |
| [ Cancelar ]                 [* Salvar *]  |
+--------------------------------------------+
```

Edição e exclusão disponíveis apenas para manuais.

---

## 7. Tela 7 — Orçamento e metas

**Requisitos:** RF-ORC-01 a 04.

### 7.1 Celular (desenho-base)

```
+----------------------------------+
| Orçamento e metas                |
| [< Outubro de 2026 >]            |
| [Orçamento | Metas]              |
| Planejado R$ 9.000               |
| Realizado R$ 7.640 (85%)         |
| ################.....            |
| [ Copiar mês anterior ]          |
|----------------------------------|
| Alimentação              108%    |
| Realizado R$ 1.950 de R$ 1.800   |
| ##################  (x) Excedido |
| [Editar planejado]               |
| Transporte                92%    |
| ...                              |
+----------------------------------+
```

Cada categoria vira cartão com barra; "Editar planejado" abre folha com campo numérico.

### 7.2 Desktop (expansão)

```
Orçamento e metas        Mês: [< Outubro de 2026 >]       [ Copiar mês anterior ]

[Orçamento | Metas]

Resumo do mês: Planejado R$ 9.000,00 · Realizado R$ 7.640,00 · Restante R$ 1.360,00 (85%)
####################..........  [RF-ORC-02]

+---------------------------------------------------------------------------+
| Categoria       Planejado          Realizado     %     Situação           |
| Moradia         [R$ 2.800,00]      R$ 2.800,00   100%  ####### (ok) No limite|
| Alimentação     [R$ 1.800,00]      R$ 1.950,00   108%  ########(x) Excedido |
| Transporte      [R$ 1.200,00]      R$ 1.100,00    92%  ####### (!) Próximo  |
| Lazer           [R$   600,00]      R$   310,00    52%  ####... (ok) Dentro  |
|   Subcategorias recolhidas  [v]                                [RF-ORC-01]  |
| [ + Adicionar categoria ao orçamento ]                                      |
+---------------------------------------------------------------------------+
Situação nunca só por cor: ícone + texto + padrão da barra.

Metas (aba)
+--------------------------------------------------------------+
| Reserva de emergência        R$ 18.000 de R$ 30.000   60%    |
| ########......  Prazo 31/12/2027 · Faltam R$ 12.000  [⋮]     |
| Viagem Japão                 R$ 4.200 de R$ 20.000    21%    |
| ##..........   Prazo 30/06/2027 · Sugestão: R$ 1.054/mês     |
| [ + Nova meta ]                                   [RF-ORC-04]|
+--------------------------------------------------------------+
```

Edição do valor planejado inline (campo com `aria-label` "Planejado para Alimentação"), salva ao sair do campo ou Enter, com feedback "Salvo". Linha com drill-down: clicar na categoria leva a Transações filtradas pela categoria e mês.

### 7.3 Estados

| Estado | Descrição |
|---|---|
| Carregando | Resumo e 6 linhas em esqueleto |
| Vazio de orçamento | "Você ainda não definiu um orçamento para este mês." + [* Definir orçamento *] [ Copiar mês anterior ] (se existir) |
| Vazio de metas | "Nenhuma meta criada." + [* Criar meta *] |
| Erro | `(x)` + [ Tentar novamente ]; falha ao salvar campo preserva valor digitado e marca "Não salvo" |

### 7.4 Modais

`{copiar mês anterior}` (RF-ORC-03): mostra prévia `Alimentação: R$ 1.800 -> R$ 1.800` e aviso "Valores já definidos serão substituídos." [ Cancelar ] [* Copiar *].
`{nova meta}` (RF-ORC-04): nome, valor-alvo, valor atual (opcional), prazo, cálculo automático de "Economia mensal necessária".
`{aporte em meta}`: registrar valor guardado; [ Cancelar ] [* Salvar *].

---

## 8. Tela 8 — Recorrências

**Requisitos:** RF-REC-01 a 03.

### 8.1 Celular (desenho-base)

```
+----------------------------------+
| Recorrências          [+ Nova]   |
| [Detect.(3)|Ativas|Projeção]     |
| Spotify                          |
| R$ 21,90 · Mensal                |
| Última 28/09 · Confiança Alta    |
| [Descartar] [Editar] [Confirmar] |
| ...                              |
+----------------------------------+
```

Projeção: gráfico compacto + lista cronológica de contas a pagar agrupada por mês.

### 8.2 Desktop (expansão)

```
Recorrências                                      [ + Nova recorrência ]

[Detectadas (3) | Ativas | Projeção]

Detectadas - confirme para incluir na projeção                    [RF-REC-01]
+--------------------------------------------------------------------------+
| Spotify         R$ 21,90   Mensal   Última 28/09   Confiança Alta        |
| Categoria sugerida: Assinaturas       [ Descartar ] [ Editar ] [* Confirmar *]|
|--------------------------------------------------------------------------|
| Academia Smart  R$ 119,90  Mensal   Última 05/10   Confiança Média       |
|                                   [ Descartar ] [ Editar ] [* Confirmar *]|
+--------------------------------------------------------------------------+

Ativas  (manuais e confirmadas)                                    [RF-REC-02]
 Descrição        Valor      Periodicidade  Próxima data  Categoria    Origem
 Aluguel          R$ 2.800   Mensal         05/11         Moradia      Manual
 Netflix          R$ 55,90   Mensal         29/10         Assinaturas  Detectada
 Total mensal estimado: R$ 3.720,60        Total anual estimado: R$ 44.647,20

Projeção (aba)                                                     [RF-REC-03]
 Horizonte: [3 meses | 6 meses | 12 meses]
 Saldo projetado
  ~~~~~~~~~~~~~~~~~~~~~~~~  (linha com recorrências e parcelas de cartão)
 Contas a pagar
  Nov/2026  Aluguel 05/11 R$ 2.800 · Fatura Nubank 05/11 R$ 2.310 · ...
  Saldo previsto ao fim do mês: R$ 41.210,00
 (i) A projeção considera recorrências ativas e parcelas de cartão comprometidas.
```

### 8.3 Estados

| Estado | Descrição |
|---|---|
| Carregando | Lista em esqueleto; na projeção, gráfico e lista em esqueleto |
| Vazio de detectadas | "Nenhuma recorrência detectada" + "Precisamos de pelo menos 3 meses de histórico para detectar padrões." |
| Vazio de ativas | "Nenhuma recorrência ativa" + [ + Nova recorrência ] |
| Projeção sem dados | "Sem dados para projetar. Confirme recorrências ou conecte cartões." |
| Erro | `(x)` + [ Tentar novamente ] |

### 8.4 Modais

`{recorrência}` (criar/editar, RF-REC-02): descrição, valor estimado, periodicidade (semanal, mensal, anual), próxima data, categoria, status.
`{descartar recorrência}`: "Descartar esta sugestão? Ela não será sugerida novamente." [ Cancelar ] [ Descartar ].

---

## 9. Tela 9 — Categorias e regras

**Requisitos:** RF-CAT-01 a 06, RN-10.

### 9.1 Celular (desenho-base)

```
+----------------------------------+
| Categorias e regras              |
| [Categorias | Regras]            |
| [+ Nova categoria]               |
| (v) Moradia              [⋮]     |
|      Aluguel                     |
|      Condomínio                  |
| (>) Alimentação          [⋮]     |
| ...                              |
+----------------------------------+
```

Toque na categoria abre detalhe em tela cheia. Regras viram cartões com condição, categoria, interruptor de ativa e menu; reordenação por botões Subir/Descer.

### 9.2 Desktop (expansão)

```
Categorias e regras

[Categorias | Regras]

Categorias                                       [ + Nova categoria ]  [x] Mostrar arquivadas
+------------------------------------------------+---------------------------+
| (v) Moradia                    Despesa    [⋮]  | Detalhe da categoria      |
|     Aluguel                                    | Nome [Moradia____]        |
|     Condomínio                                 | Tipo  (•) Despesa ( ) Receita|
| (v) Alimentação                Despesa    [⋮]  | Cor [■]  Ícone [🏠]       |
|     Supermercado                               | Categoria pai [Nenhuma v] |
|     Restaurantes                               | Mapeia da Pluggy: Housing |
| (>) Transporte                 Despesa    [⋮]  | Transações: 214           |
| (>) Renda                      Receita    [⋮]  | [ Arquivar ] [* Salvar *] |
| (>) Investimentos / Interno    ...             |                           |
| Padrão [padrão]  Arquivada [arquivada]         |      [RF-CAT-01][RF-CAT-02]|
+------------------------------------------------+---------------------------+
```

Árvore com expansão por teclado (setas) e menu `⋮`: Editar, Criar subcategoria, Mover, Arquivar. Categorias padrão exibem selo "Padrão" e permitem editar nome/cor, mas não excluir (arquivar). Mapeamento Pluggy visível em "Mapeia da Pluggy" [RF-CAT-03].

**Aba Regras (RF-CAT-04, RF-CAT-06, RN-10):**

```
Regras automáticas                                [ + Nova regra ]
As regras do usuário têm precedência sobre o mapeamento padrão. Entre regras,
vale a de maior prioridade; em empate, a mais específica.

 Pri.  Condição                         Categoria         Ativa   Aplicada a
 1     Descrição contém "UBER *TRIP"    Transporte        [=o ]   18  [Aplicar retroativamente] [⋮]
 2     Descrição igual "Netflix"        Assinaturas       [=o ]   9   [⋮]
 3     Valor >= 5.000 e conta Itaú      Renda             [ o=]   0   [⋮]
 Reordenar: arrastar ou [Subir] [Descer]
```

### 9.3 Estados

| Estado | Descrição |
|---|---|
| Carregando | Árvore e lista de regras em esqueleto |
| Vazio de regras | "Nenhuma regra criada" + "Crie regras para categorizar automaticamente transações recorrentes." + [* Nova regra *] |
| Vazio de categorias | Não ocorre (categorias padrão existem, RF-CAT-01); se falhar o carregamento, estado de erro |
| Erro | `(x)` + [ Tentar novamente ] |
| Categoria com transações ao arquivar | Aviso com opção de reatribuir |

### 9.4 Modais

`{nova regra}` (RF-CAT-04, RF-CAT-05): condições com [+ Adicionar condição], categoria, prioridade, ativa, [x] Aplicar às transações existentes, prévia "142 transações serão afetadas".
`{aplicação retroativa}`: lista de amostras, total, "Edições manuais não serão sobrescritas (N ignoradas)", [ Cancelar ] [* Aplicar *], toast com Desfazer.
`{arquivar categoria}`: "Arquivar 'Lazer'? Transações existentes continuam com a categoria; ela não aparecerá em novas seleções." [ Cancelar ] [ Arquivar ].
`{nova categoria}`: nome, tipo, categoria pai, cor, ícone.

---

## 10. Tela 10 — Conexões

**Requisitos:** RF-CON-01 a 08, RF-SYN-05, RF-SYN-07, RN-13, C01, C03.

### 10.1 Celular (desenho-base)

```
+----------------------------------+
| Conexões                         |
| 4 de 5 conexões     ####.        |
| [* Conectar instituição *]       |
| [ Sincronizar tudo ]             |
+----------------------------------+
| Itaú              (ok) Atualizado|
| Há 12 min                        |
| Contas · Cartões · Invest.       |
| [Sincronizar]   [⋮]              |
|----------------------------------|
| Inter        (!) Ação necessária |
| Consentimento vence em 12 dias   |
| [* Reconectar *]  [⋮]            |
| ...                              |
+----------------------------------+
| Histórico de sincronizações [v]  |
+----------------------------------+
```

### 10.2 Desktop (expansão)

```
Conexões                                              [* Conectar instituição *]
Conexões ativas: 4 de 5   ####.   [RF-CON-06]       [ Sincronizar tudo ]  [RF-SYN-05]
(i) Acesso somente leitura. Suas credenciais bancárias não são armazenadas por este app.

+--------------------------------------------------------------------------------+
| Itaú                              (ok) Atualizado                              |
| Última sincronização: hoje 14:20 (há 12 min)                                   |
| Dados: Contas · Cartões · Investimentos                      [RF-CON-08]       |
| Consentimento válido até 12/03/2027                          [ Sincronizar ] [⋮]|
|--------------------------------------------------------------------------------|
| Inter                             (!) Ação necessária                          |
| Última sincronização: 28/09 08:10                                              |
| O banco pediu uma confirmação adicional.                       [RF-CON-04]     |
| Consentimento vence em 12 dias.                          [* Reconectar *]  [⋮]  |
|--------------------------------------------------------------------------------|
| XP                                (x) Erro de login                            |
| As credenciais mudaram. Reconecte para continuar atualizando.                  |
|                                                          [* Reconectar *]  [⋮]  |
|--------------------------------------------------------------------------------|
| Nubank                            (i) Sincronizando...                         |
| Contas ok · Transações 60% ...    ######....  [RF-SYN-05]                      |
+--------------------------------------------------------------------------------+
 Menu ⋮: Sincronizar agora, Reconectar, Ver detalhes, Desconectar

Histórico de sincronizações                                          [RF-SYN-07]
 Início            Fim               Conexão   Resultado        Itens   Erros
 05/10 14:20       05/10 14:21       Itaú      Concluída        23      0
 05/10 14:20       05/10 14:22       Inter     Falhou           0       1  [Detalhes]
 [Filtro: conexão v, resultado v]    < Anterior  1  2  3  Próxima >
```

### 10.3 Estados

| Estado | Descrição |
|---|---|
| Carregando | Contador e três cartões de conexão em esqueleto |
| Vazio | "Nenhuma instituição conectada" + explicação de somente leitura + [* Conectar instituição *] + [ Importar extrato ] como alternativa |
| Erro de carregamento | `(x)` + [ Tentar novamente ] |
| Limite atingido | Botão "Conectar instituição" desabilitado com texto "Limite de 5 conexões atingido" [RF-CON-06] |
| Sincronização em curso | Barra de progresso por conexão e indicador global |
| Histórico vazio | "Nenhuma sincronização registrada ainda." |

### 10.4 Modais e painéis

**Modal de conexão `{modal de conexão}` (RF-CON-01):**

```
+----------------------------------------------+
| Conectar instituição                     [X] |
| Você será levado ao ambiente seguro da Pluggy.|
|  - Somente leitura: não movimentamos dinheiro |
|  - Suas credenciais bancárias não passam por  |
|    este aplicativo                            |
|  - Dados lidos: contas, transações, cartões e |
|    investimentos, conforme a instituição      |
| Você tem 4 de 5 conexões em uso.              |
| [ Cancelar ]               [* Continuar *]    |
+----------------------------------------------+
```

**Widget Pluggy `{widget Pluggy}`:** conteúdo e visual fornecidos pela Pluggy; o app define apenas o contêiner (modal central no desktop com largura sugerida 480 a 520 px, tela cheia no celular), o fundo escurecido e o retorno de foco. Estados do contêiner: `carregando` (esqueleto com "Abrindo ambiente seguro..."), `erro` (falha ao carregar o widget: "Não foi possível abrir a conexão. Tente novamente.").

**Desconectar `{confirmar desconexão}` (RF-CON-05):**

```
+------------------------------------------------+
| Desconectar Itaú?                          [X] |
| O painel deixará de receber dados e o          |
| consentimento será revogado. Nenhum dinheiro   |
| é movimentado.                                 |
| Esta conexão tem 2 contas e 1.340 transações.  |
| (•) Manter histórico                           |
|     Os dados importados continuam no painel.   |
| ( ) Excluir histórico                          |
|     Remove todos os dados desta instituição.   |
|     Não pode ser desfeito.                     |
| [ Cancelar ]    [* Desconectar e manter histórico *]|
+------------------------------------------------+
```

Ao selecionar "Excluir histórico", o botão vira [ Desconectar e excluir histórico ] (perigo) e abre `{confirmar exclusão do histórico}`: "Digite Itaú para confirmar: [______]" com o botão final habilitado apenas ao coincidir.

**Detalhe da conexão (painel lateral):** instituição, status, mensagem de erro, última sincronização, consentimento (data de validade), dados disponibilizados, histórico filtrado da conexão.

### 10.5 Rastreabilidade

RF-CON-01 (modal + widget); RF-CON-02 (registro/validação, fluxo 3); RF-CON-03 (lista com status, última sincronização, erro); RF-CON-04 (Reconectar); RF-CON-05 (desconectar); RF-CON-06 (contador e limite); RF-CON-07 (aviso de consentimento); RF-CON-08 (dados por instituição); RF-SYN-05 (sincronizar manual com progresso); RF-SYN-07 (histórico).

---

## 11. Tela 11 — Importação

**Requisitos:** RF-IMP-01 a 04.

### 11.1 Celular (desenho-base)

```
+----------------------------------+
| Importação                       |
| [Nova | Lotes]                   |
| Passo 1 de 4                     |
| Destino [Itaú Corrente v]        |
| +------------------------------+ |
| | [ Selecionar arquivo ]       | |
| | .ofx ou .csv · até 20 MB      | |
| +------------------------------+ |
| [* Continuar *]                  |
+----------------------------------+
```

Mapeamento: cada coluna vira um cartão "Coluna 1: Data (amostra: 05/10/2026)" com seletor. Pré-visualização: lista de cartões com situação e interruptor de inclusão; resumo fixo no topo; botão "Continuar" fixo no rodapé.

### 11.2 Desktop (expansão)

```
Importação                                          [Nova importação | Lotes]

Passo 1 de 4 ●────○────○────○     Arquivo > Mapeamento > Pré-visualização > Confirmação

Destino  [Itaú Corrente v]                                       
+-----------------------------------------------------------+
|                                                           |
|      Arraste um arquivo .ofx ou .csv aqui                 |
|      ou [ Selecionar arquivo ]                            |
|                                                           |
+-----------------------------------------------------------+
Formatos aceitos: OFX, CSV · Tamanho máximo 20 MB             [RF-IMP-01]
(i) Importação é um complemento. Prefira conectar a instituição.
                                                   [ Cancelar ]  [* Continuar *]
```

**Passo 2 — Mapeamento de colunas (somente CSV):**

```
Separador [; v]  Codificação [UTF-8 v]  Formato de data [dd/MM/aaaa v]  Decimal [vírgula v]
Valores: (•) Uma coluna com sinal  ( ) Débito e crédito em colunas  ( ) Sinal invertido

 Campo:     [Data v]        [Descrição v]       [Valor v]       [Ignorar v]
 Linha 1    05/10/2026      PAO DE ACUCAR       -212,30         ...
 Linha 2    04/10/2026      SALARIO             9800,00         ...
 Linha 3    ...
 Sugerido automaticamente (ok)                         [RF-IMP-01]
                                      [ Voltar ]  [* Continuar *]
```

**Passo 3 — Pré-visualização (RF-IMP-02, RF-IMP-03):**

```
128 lidos · 112 novas · 14 duplicadas · 2 com erro
Receitas a importar R$ 8.431,20 · Despesas -R$ 6.002,77
Filtrar: [Todas | Novas | Duplicadas | Com erro]     [ ] Incluir duplicadas

+--------------------------------------------------------------------------+
| [x] Data    Descrição          Valor        Categoria sug.   Situação      |
| [x] 04/10   Mercado PdA        -R$ 212,30   Alimentação      Nova          |
| [ ] 03/10   Uber *Trip         -R$ 24,90    Transporte       Duplicada     |
| [ ] 02/10   ???                 R$ ----     -                Erro: valor inválido |
| ...                                                                       |
+--------------------------------------------------------------------------+
                                 [ Voltar ]  [ Exportar linhas com erro ]  [* Continuar *]
```

**Passo 4 — Confirmação:**

```
Resumo
 Arquivo extrato-out.ofx · Destino Itaú Corrente · Origem: Importação
 112 lançamentos serão importados · 16 ignorados
 Você poderá desfazer este lote depois.
                       [ Voltar ]  [* Importar 112 lançamentos *]
```

**Aba Lotes (RF-IMP-04):**

```
 Arquivo          Data         Destino          Formato  Qtd   Status    Ação
 extrato-out.ofx  05/10/2026   Itaú Corrente    OFX      112   Ativo     [ Desfazer lote ]
 extrato-set.csv  02/10/2026   Nubank           CSV       98   Desfeito  -
```

### 11.3 Estados

| Estado | Descrição |
|---|---|
| Carregando | Leitura do arquivo: "Lendo arquivo..." com barra; gravação: "Importando... 40 de 112" |
| Vazio (lotes) | "Nenhuma importação realizada" + [* Importar arquivo *] |
| Erro de arquivo | `(x) Não conseguimos ler este arquivo.` + [ Escolher outro arquivo ] |
| Erro de gravação | `(x) A importação falhou. Nenhum lançamento foi adicionado.` + [ Tentar novamente ] |
| Nada a importar | "Todos os lançamentos já existem. Nada para importar." |
| Sucesso | Cartão de resultado "112 importados" + [ Ver transações importadas ] [ Importar outro arquivo ] |

### 11.4 Modais

`{desfazer lote}` (RF-IMP-04): "Remover os 112 lançamentos do lote 'extrato-out.ofx'? Edições feitas neles serão perdidas. Transações do Open Finance não são afetadas." [ Cancelar ] [ Desfazer lote ] (perigo).

---

## 12. Tela 12 — Alertas

**Requisitos:** RF-ALR-01 a 03.

### 12.1 Celular (desenho-base)

```
+----------------------------------+
| Alertas      [Marcar lidos]      |
| [Central (3) | Preferências]     |
| (•) Fatura Nubank vence em 3 dias|
|     R$ 2.310 · 08/10             |
|     [Ver fatura]                 |
| (•) Orçamento Alimentação 108%   |
| ...                              |
+----------------------------------+
```

Preferências: lista de interruptores com campo de limite abaixo de cada um, salvamento automático com confirmação "Salvo".

### 12.2 Desktop (expansão)

```
Alertas                                         [ Marcar todos como lidos ]

[Central (3) | Preferências]

Filtrar: [Todos os tipos v]  [Não lidos | Todos]

+--------------------------------------------------------------------------+
| (•) Fatura Nubank vence em 3 dias                         05/10 08:00    |
|     R$ 2.310,00 · Vencimento 08/10               [ Ver fatura ] [ Lido ] |
|--------------------------------------------------------------------------|
| (•) Orçamento Alimentação em 108%                         04/10 19:10    |
|     R$ 1.950 de R$ 1.800                     [ Ver orçamento ] [ Lido ]  |
|--------------------------------------------------------------------------|
| (•) Conexão Inter precisa de ação                         03/10 06:30    |
|                                                  [ Reconectar ] [ Lido ] |
|--------------------------------------------------------------------------|
|     Gasto atípico: R$ 1.200 em Eletrônicos                01/10 15:00    |
|     Nova assinatura detectada: Spotify         [ Ver recorrência ]       |
+--------------------------------------------------------------------------+
 Tipos: fatura a vencer, orçamento, conexão com erro, consentimento a expirar,
 gasto atípico, nova assinatura                                [RF-ALR-01]
```

**Aba Preferências (RF-ALR-02, RF-ALR-03):**

```
Alertas internos
 Fatura próxima do vencimento        [=o ]   Avisar [3 v] dias antes
 Orçamento excedido ou próximo       [=o ]   Avisar a partir de [90]% do planejado
 Conexão com erro                    [=o ]
 Consentimento a expirar             [=o ]   Avisar [15 v] dias antes
 Gasto atípico                       [ o=]   Acima de [2,5]x a média da categoria
 Nova assinatura detectada           [=o ]

Notificações por e-mail (opcional)   [ o=]   E-mail: [titular@exemplo.com]
 Receber por e-mail: [x] Fatura  [x] Conexão  [ ] Orçamento  [ ] Gasto atípico  [ ] Assinatura
                                                        [ Descartar ] [* Salvar *]
```

### 12.3 Estados

| Estado | Descrição |
|---|---|
| Carregando | Lista de 5 itens em esqueleto |
| Vazio | "Tudo em dia. Nenhum alerta por enquanto." + link "Ajustar preferências" |
| Vazio de filtro | "Nenhum alerta deste tipo." + [ Limpar filtro ] |
| Erro | `(x)` + [ Tentar novamente ] |
| Erro ao salvar preferências | Toast de erro; interruptor volta ao valor anterior |

### 12.4 Painéis

O sino do cabeçalho abre popover com os 5 mais recentes (desktop) ou leva a esta tela (celular). Alerta lido some do contador; permanece no histórico.

---

## 13. Tela 13 — Relatórios

**Requisitos:** RF-REL-01 a 03, CA-06.

### 13.1 Celular (desenho-base)

```
+----------------------------------+
| Relatórios                       |
| [Mensal | Exportações]           |
| [< Outubro de 2026 >]            |
| Resumo                           |
|  Receitas R$ 12.400,00           |
|  Despesas -R$ 8.915,40           |
|  Resultado R$ 3.484,60           |
| Categorias [v]                   |
| Cartões [v]                      |
| Patrimônio [v]                   |
+----------------------------------+
```

Seções recolhíveis (acordeão). Exportações em formulário de coluna única; o download usa o gerenciador do navegador.

### 13.2 Desktop (expansão)

```
Relatórios                                        

[Relatório mensal | Exportações]

Mês: [< Outubro de 2026 >]                    [ Imprimir ] [ Exportar PDF ]
+--------------------------------------------------------------------------+
| Relatório de outubro de 2026                          Gerado em 05/10/2026|
| Resumo      Receitas R$ 12.400,00 · Despesas -R$ 8.915,40 · Resultado R$ 3.484,60 |
| Categorias  tabela + gráfico (valor, % e variação vs. mês anterior)      |
| Cartões     Gasto por cartão, faturas do mês, parcelas comprometidas     |
| Patrimônio  Contas R$ 48.320 · Investimentos R$ 115.550 · Faturas -R$ 3.355 |
|             = Patrimônio líquido R$ 160.515,00 (RN-08)                    |
+--------------------------------------------------------------------------+
                                                              [RF-REL-01]
Exportações (aba)
+--------------------------------------------------------------------------+
| Exportar transações filtradas (CSV)                         [RF-REL-02]  |
| Período [Out/2026 v] Conta/Cartão [Todos v] Categoria [Todas v]          |
| Tipo [Todos v] Valor [mín__ máx__] Tags [__]                              |
| Prévia: 128 transações · Receitas R$ 12.400,00 · Despesas -R$ 8.915,40   |
|                                        [* Exportar CSV *]                |
|--------------------------------------------------------------------------|
| Exportar todos os dados                                     [RF-REL-03]  |
| Formato: (•) JSON  ( ) CSV (um arquivo por tabela, em .zip)              |
| (!) O arquivo contém dados financeiros sensíveis. Guarde com cuidado.     |
|                                       [* Exportar todos os dados *]      |
+--------------------------------------------------------------------------+
```

Exportar PDF e Imprimir foram aprovados pelo titular. A impressão e o PDF usam sempre o tema claro, em formato A4 retrato, sem menu e sem cabeçalho global, com data de geração e período no topo.

### 13.3 Estados

| Estado | Descrição |
|---|---|
| Carregando relatório | Seções em esqueleto |
| Mês sem dados | "Nenhuma movimentação em outubro de 2026." + [ Escolher outro mês ] |
| Gerando exportação | Botão com "Preparando arquivo..." e `aria-busy`; download automático ao concluir |
| Exportação sem registros | "Nenhuma transação corresponde aos filtros." botão desabilitado |
| Erro | `(x) Não foi possível gerar o relatório/arquivo.` + [ Tentar novamente ] |

---

## 14. Tela 14 — Configurações

**Requisitos:** RF-CFG-01 a 04, RF-AUT-05, RF-AUT-07, RNF-LGPD-01 a 03.

### 14.1 Celular (desenho-base)

```
+----------------------------------+
| Configurações                    |
| Perfil e região              >   |
| Aparência                    >   |
| Segurança                    >   |
| Dados e privacidade          >   |
+----------------------------------+
```

Cada linha abre a seção em tela cheia com botão voltar. Mesma estrutura de campos do desktop em coluna única; zona de perigo no fim da seção "Dados e privacidade".

### 14.2 Desktop (expansão)

```
Configurações

+---------------------+--------------------------------------------------+
| Perfil e região     | Perfil e região                                  |
| Aparência           |  Nome [Rodrigo_______]                           |
| Segurança           |  E-mail titular@exemplo.com (somente leitura)            |
| Dados e privacidade |  Moeda  BRL - Real brasileiro (fixa)   [RF-CFG-01]|
|                     |  Fuso horário  America/Sao_Paulo (fixo)           |
|                     |  Dia de início do mês financeiro [ 5 v ] [RF-CFG-02]|
|                     |  (i) Afeta o período mensal em Dashboard,        |
|                     |      Orçamento e Relatórios.                      |
|                     |                              [* Salvar *]        |
+---------------------+--------------------------------------------------+
```

**Aparência (RF-CFG-03):**

```
 Tema:  (•) Claro   ( ) Escuro   ( ) Sistema
 Prévia pequena do tema ao lado. A escolha é aplicada na hora e salva no perfil.
 Densidade das tabelas:  (•) Confortável   ( ) Compacta
   Prévia: duas linhas de tabela nas duas densidades. Vale para todas as tabelas
   a partir de lg; no celular os cards mantêm tamanho fixo de toque (44 px).
 Ocultar valores por padrão   [ o=]
   Mascara todos os valores em R$ ao abrir o painel; o botão do olho no cabeçalho
   alterna a qualquer momento.
```

**Segurança (RF-AUT-07, RF-AUT-05):**

```
 Senha                      [ Alterar senha ]   (mínimo de 12 caracteres)
 Entrar com Google          Conta vinculada: titular@exemplo.com   [ Desvincular ]
   (i) O Google só funciona com o e-mail do titular. Não é possível cadastrar outras contas.
 Verificação em duas etapas (TOTP)     [ o=]  Desativada
   [ Ativar ] > abre {ativar 2FA}
 Códigos de recuperação     8 códigos restantes   [ Ver status ] [ Gerar novos códigos ]
   (aparece quando o 2FA está ativo; gerar novos invalida os anteriores)
 Sessão atual               Este dispositivo · desde 05/10 08:10     [ Sair ]
 [ Sair de todos os dispositivos ]
```

**Dados e privacidade (RF-CFG-04, RNF-LGPD-02, RNF-LGPD-03):**

```
 Exportar seus dados
   Baixe uma cópia de tudo em JSON ou CSV.            [ Exportar todos os dados ]
 Conexões Open Finance
   4 conexões ativas. Você pode revogar cada uma em Conexões.   [ Ir para Conexões ]
 Armazenamento
   Este app só guarda dados necessários e os compartilha apenas com Pluggy e Supabase.
 +----------------------------- ZONA DE PERIGO -----------------------------+
 | Excluir todos os dados                                                    |
 | Remove permanentemente todos os dados importados e revoga as conexões.    |
 | [ Excluir todos os dados ]  (perigo)                                      |
 +---------------------------------------------------------------------------+
```

### 14.3 Estados

| Estado | Descrição |
|---|---|
| Carregando | Campos em esqueleto |
| Vazio | Não se aplica; valores padrão presentes |
| Erro ao carregar | `(x)` + [ Tentar novamente ] |
| Erro ao salvar | Mensagem inline sob o campo e toast; valor anterior restaurado |
| Exclusão em andamento | Modal com etapas e barra de progresso; bloqueia fechamento |
| 2FA ativado com sucesso | Banner de sucesso e exibição única dos códigos de recuperação |

### 14.4 Modais

**Ativar 2FA `{ativar 2FA}` (RF-AUT-07):**

```
+-----------------------------------------------+
| Ativar verificação em duas etapas             |
| 1. Leia o QR code com seu app autenticador    |
|    [ QR code ]   ou digite: ABCD EFGH IJKL    |
| 2. Digite o código de 6 dígitos               |
|    [_][_][_][_][_][_]                         |
| [ Cancelar ]               [* Ativar *]       |
+-----------------------------------------------+
```

Após ativar: exibe 8 códigos de recuperação de uso único com [ Copiar ] [ Baixar ] [ Imprimir ] e caixa "Guardei meus códigos" para concluir; os códigos são mostrados somente uma vez. "Gerar novos códigos" em Segurança exige senha atual, invalida os anteriores e repete essa exibição.

**Exclusão total `{exclusão total}` (RF-CFG-04):**

```
Etapa 1 de 3 - O que será removido
+---------------------------------------------------------+
| Excluir todos os dados                                   |
| Serão removidos permanentemente:                         |
|  - 4 conexões (consentimentos revogados)                 |
|  - 7 contas e 3 cartões                                  |
|  - 14.380 transações, 36 faturas, 42 investimentos       |
|  - Categorias personalizadas, regras, orçamento, metas   |
|  - Recorrências, alertas, importações e preferências     |
| Esta ação é permanente e não pode ser desfeita.          |
| (i) Recomendado: [ Exportar todos os dados ] antes.      |
| [ Cancelar ]                          [ Continuar ]      |
+---------------------------------------------------------+
Etapa 2 de 3 - Escolha
 (•) Excluir dados e manter meu acesso (e-mail, senha e Google)
 ( ) Excluir dados e encerrar minha conta de acesso
     (o titular será desconectado e não poderá mais entrar; a conta de acesso, os
      vínculos e a sessão são removidos. Para voltar, será preciso recriar o acesso)
Etapa 3 de 3 - Confirmação
 Senha atual [____________]
 Digite EXCLUIR TUDO para confirmar [____________]
 [ Voltar ]            [* Excluir tudo permanentemente *] (perigo, habilita ao validar)
Execução: (1) Revogando conexões ✓  (2) Excluindo dados ...  (3) Concluindo
```

**Alterar senha `{alterar senha}`:** senha atual, nova, confirmação, requisitos (mínimo de 12 caracteres, verificados em tempo real); [ Cancelar ] [* Salvar *].
**Sair de todos os dispositivos:** confirmação simples.

---

## 15. Matriz de rastreabilidade: tela x requisitos x estados

Legenda: C = carregando, V = vazio, E = erro. "Wireframe desktop/celular" aponta a seção deste documento.

| # | Tela | Requisitos cobertos | Celular (base) | Desktop (expansão) | C | V | E | Modais/painéis |
|---|---|---|---|---|---|---|---|---|
| 1 | Login | RF-AUT-01, 02, 05, 06, 07; RNF-SEG-06 | 1.1 | 1.2 | 1.4 | 1.4 | 1.4 | Sessão expirada; etapa 2FA; acesso negado do Google; recuperação e redefinição |
| 2 | Dashboard | RF-DSH-01 a 07; RF-CAR-07; RN-08, RN-09 | 2.1 | 2.2 | 2.3 | 2.3 | 2.3 | Período personalizado |
| 3 | Transações | RF-TRX-01 a 08; RF-CAT-05 | 3.1 | 3.2 | 3.3 | 3.3 | 3.3 | Detalhe, nova, dividir, lote, criar regra, excluir manual |
| 4 | Contas | RF-CTA-01 a 04 | 4.1 | 4.2 | 4.3 | 4.3 | 4.3 | Editar apelido, ocultar |
| 5 | Cartões | RF-CAR-01 a 07 | 5.1 | 5.2 | 5.3 | 5.3 | 5.3 | Detalhe de compra parcelada |
| 6 | Investimentos | RF-INV-01 a 06 | 6.1 | 6.2 | 6.3 | 6.3 | 6.3 | Investimento manual |
| 7 | Orçamento e metas | RF-ORC-01 a 04 | 7.1 | 7.2 | 7.3 | 7.3 | 7.3 | Copiar mês, nova meta, aporte |
| 8 | Recorrências | RF-REC-01 a 03 | 8.1 | 8.2 | 8.3 | 8.3 | 8.3 | Recorrência, descartar |
| 9 | Categorias e regras | RF-CAT-01 a 06; RN-10 | 9.1 | 9.2 | 9.3 | 9.3 | 9.3 | Nova regra, aplicação retroativa, arquivar, nova categoria |
| 10 | Conexões | RF-CON-01 a 08; RF-SYN-05, 07; RN-13 | 10.1 | 10.2 | 10.3 | 10.3 | 10.3 | Modal de conexão, widget Pluggy, desconectar, excluir histórico |
| 11 | Importação | RF-IMP-01 a 04 | 11.1 | 11.2 | 11.3 | 11.3 | 11.3 | Desfazer lote |
| 12 | Alertas | RF-ALR-01 a 03 | 12.1 | 12.2 | 12.3 | 12.3 | 12.3 | Popover do sino |
| 13 | Relatórios | RF-REL-01 a 03 | 13.1 | 13.2 | 13.3 | 13.3 | 13.3 | Confirmação de exportação total |
| 14 | Configurações | RF-CFG-01 a 04; RF-AUT-05, 07; RNF-LGPD-01 a 03 | 14.1 | 14.2 | 14.3 | 14.3 | 14.3 | Ativar 2FA, códigos de recuperação, alterar senha, exclusão total |

Transversais: shell e navegação (0.3, arquitetura seções 5 a 7); indicador de sincronização e sino (arquitetura 7); estados padrão (0.4); modais/painéis (0.5); toasts (0.5).

---

## 16. Decisões do titular e pontos ainda em aberto

### 16.1 Decisões aplicadas (05/10/2026)

| # | Decisão | Onde aparece |
|---|---|---|
| W1 | Exportar relatório em PDF e imprimir: aprovado | 13 Relatórios |
| W4 | "Interna" é selo/atributo da transação, não categoria: confirmado | 3 Transações, 2 Dashboard |
| W6 | Encerrar a conta de acesso na exclusão total: aprovado | 14 Configurações, modal de exclusão total |
| W8 | Login com Google (só o e-mail do titular; sem cadastro): aprovado | 1 Login, 14 Segurança |
| W9 | Limite do arquivo de importação: 20 MB | 11 Importação |
| W10 | Dados desatualizados após 36 h | Indicador de sincronização |
| W11 | Densidade de tabela configurável, modo ocultar valores, códigos de recuperação do 2FA: aprovados | 14 Configurações, cabeçalho |
| W12 | Barra inferior do celular: Início, Transações, Contas, Cartões, Mais: confirmada | Shell |
| W13 | Mobile first (celular é o desenho-base) | Todas as telas, seção 0.2 |

### 16.2 Pontos ainda em aberto

| # | Tema | Observação |
|---|---|---|
| W2 | Campo "Nome" em Configurações | URS cita `profiles.nome`; wireframe inclui o campo. Confirmar |
| W3 | Limite de "gasto atípico" | RF-ALR-01 não define a regra; wireframe usa múltiplo da média por categoria como proposta |
| W5 | Mapeamento Pluggy visível ao usuário | Mostrado como informação (RF-CAT-03); edição do mapeamento fora de escopo salvo decisão contrária |
| W7 | Duplicidade fuzzy na importação | RF-IMP-03 define critério (data, valor, descrição); tolerância de descrição a definir na Sprint 8 |
