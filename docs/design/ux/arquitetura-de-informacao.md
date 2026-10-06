# Arquitetura de Informação — Painel Financeiro Pessoal

**Etapa:** 1.1 (Sprint 1) — Arquitetura de UX
**Agente:** UX Architect
**Data:** 05/10/2026
**Base:** URS v1.1 (seções 4, 8.5 e 9) e Plano de Execução (seções 3.2 a 3.4)
**Consumidores:** UI Designer (Etapa 1.2), Frontend Developer (Etapa 1.3), revisão cruzada (Etapa 1.4)

---

## 1. Premissas de experiência

| Premissa | Origem | Consequência na arquitetura |
|---|---|---|
| Titular único, sem cadastro público | RF-AUT-01/02 | Login é a única tela pública; não existe tela de cadastro nem convite. Entrada por e-mail e senha ou "Entrar com Google", ambas restritas ao titular pré-criado |
| Mobile first, com bom uso de navegadores desktop (decisão do titular) | RNF-USA-01, URS 2.4 | O celular é o desenho-base de toda tela; o desktop é uma expansão que usa o espaço (menu lateral, várias colunas, painel de detalhe, tabelas densas, mouse). Dois padrões de navegação: inferior com drawer (celular) e lateral (desktop) |
| pt-BR, BRL, America/Sao_Paulo | RNF-USA-02, RF-CFG-01 | Toda formatação segue `sistema-de-layout.md`, seção 9 |
| Estados carregando, vazio e erro em todas as telas | RNF-USA-03 | Cada tela do mapa tem os três estados definidos em `wireframes.md` |
| Acessibilidade básica | RNF-USA-04 | Landmarks, ordem de foco e rótulos definidos por região do shell |
| Aplicação somente leitura sobre dados bancários | C03, RN-12 | Nenhum fluxo sugere mover dinheiro; ações são de leitura, organização e conexão |
| Tema claro, escuro e sistema | RF-CFG-03, Plano 3.3 | Seletor tripartido acessível no menu do usuário e em Configurações |
| Dados financeiros sensíveis | RNF-SEG, RNF-LGPD | Ações destrutivas sempre com confirmação explícita e texto das consequências |

---

## 2. Mapa do site

### 2.1 Árvore completa

```
Painel Financeiro Pessoal
|
|-- Área pública
|   |-- /login                           Tela 1  Login
|   |-- /recuperar-senha                 (estado da Tela 1) solicitar link por e-mail
|   `-- /redefinir-senha                 (estado da Tela 1) nova senha a partir do link
|
`-- Área autenticada (shell: menu + cabeçalho)
    |
    |-- VISÃO GERAL
    |   `-- /dashboard                   Tela 2  Dashboard
    |
    |-- MOVIMENTAÇÃO
    |   |-- /transacoes                  Tela 3  Transações
    |   |       `-- ?transacao={id}      painel de detalhe (estado da tela)
    |   |-- /contas                      Tela 4  Contas
    |   |       `-- /contas/{id}         detalhe da conta: histórico de saldo
    |   |-- /cartoes                     Tela 5  Cartões
    |   |       `-- /cartoes/{id}        detalhe do cartão: faturas, compras, parcelas
    |   `-- /investimentos               Tela 6  Investimentos
    |
    |-- PLANEJAMENTO
    |   |-- /orcamento                   Tela 7  Orçamento e metas
    |   `-- /recorrencias                Tela 8  Recorrências
    |
    |-- ORGANIZAÇÃO
    |   |-- /categorias                  Tela 9  Categorias e regras
    |   |-- /importacao                  Tela 11 Importação
    |   `-- /relatorios                  Tela 13 Relatórios
    |
    `-- SISTEMA
        |-- /conexoes                    Tela 10 Conexões
        |-- /alertas                     Tela 12 Alertas (central + preferências)
        `-- /configuracoes               Tela 14 Configurações
```

### 2.2 Inventário de telas e rotas

| # | Tela | Rota | Grupo | Acesso | Requisitos centrais |
|---|---|---|---|---|---|
| 1 | Login | `/login` (+ `/recuperar-senha`, `/redefinir-senha`) | Pública | Sem sessão | RF-AUT-01, 02, 05, 06, 07 |
| 2 | Dashboard | `/dashboard` | Visão geral | Sessão | RF-DSH-01 a 07 |
| 3 | Transações | `/transacoes` | Movimentação | Sessão | RF-TRX-01 a 08 |
| 4 | Contas | `/contas` | Movimentação | Sessão | RF-CTA-01 a 04 |
| 5 | Cartões | `/cartoes` | Movimentação | Sessão | RF-CAR-01 a 07 |
| 6 | Investimentos | `/investimentos` | Movimentação | Sessão | RF-INV-01 a 06 |
| 7 | Orçamento e metas | `/orcamento` | Planejamento | Sessão | RF-ORC-01 a 04 |
| 8 | Recorrências | `/recorrencias` | Planejamento | Sessão | RF-REC-01 a 03 |
| 9 | Categorias e regras | `/categorias` | Organização | Sessão | RF-CAT-01 a 06 |
| 10 | Conexões | `/conexoes` | Sistema | Sessão | RF-CON-01 a 08, RF-SYN-05, 07 |
| 11 | Importação | `/importacao` | Organização | Sessão | RF-IMP-01 a 04 |
| 12 | Alertas | `/alertas` | Sistema | Sessão | RF-ALR-01 a 03 |
| 13 | Relatórios | `/relatorios` | Organização | Sessão | RF-REL-01 a 03 |
| 14 | Configurações | `/configuracoes` | Sistema | Sessão | RF-CFG-01 a 04, RF-AUT-05, 07, RNF-LGPD |

Regra de acesso: toda rota, exceto as de `Área pública`, redireciona para `/login` sem sessão válida (RF-AUT-03). Após login, retorna à rota solicitada originalmente; sem rota de origem, vai para `/dashboard`.

### 2.3 Rotas de apoio não navegáveis pelo menu

| Elemento | Forma | Motivo |
|---|---|---|
| Detalhe de transação | Painel lateral (desktop) / tela cheia deslizante (celular), via `?transacao={id}` | Preserva filtros e posição da lista; permite link direto |
| Widget de conexão Pluggy | Modal sobre `/conexoes` | Fluxo externo ao app (RF-CON-01) |
| Edição em lote | Barra de ação + modal na lista de Transações | RF-TRX-07 |
| Nova transação manual | Painel lateral/modal sobre Transações | RF-TRX-05 |
| Nova meta, novo investimento manual, nova recorrência, nova regra, nova categoria | Modal sobre a tela de origem | Evita telas de formulário isoladas |

---

## 3. Agrupamento das 14 telas

Critério: agrupar pelo verbo mental do titular, não pela estrutura de dados.

| Grupo | Pergunta que responde | Telas | Frequência de uso esperada |
|---|---|---|---|
| Visão geral | "Como estou?" | Dashboard | Diária |
| Movimentação | "O que entrou, saiu e onde está meu dinheiro?" | Transações, Contas, Cartões, Investimentos | Diária a semanal |
| Planejamento | "Como me organizo para frente?" | Orçamento e metas, Recorrências | Semanal a mensal |
| Organização | "Como mantenho meus dados bem classificados e como os extraio?" | Categorias e regras, Importação, Relatórios | Mensal / eventual |
| Sistema | "A plataforma está saudável e sob meu controle?" | Conexões, Alertas, Configurações | Eventual; Alertas e Conexões sobem quando há problema |

Justificativas de decisão:

- **Conexões fica em Sistema, mas seu status é onipresente.** O indicador de sincronização no cabeçalho leva a Conexões. O titular raramente navega ali, salvo reconexão (RF-CON-04) ou consentimento a vencer (RF-CON-07).
- **Alertas tem acesso duplo.** Entrada no menu (Sistema) e sino no cabeçalho com contador de não lidos (RF-ALR-01). O sino abre um popover com os 5 mais recentes e link "Ver todos".
- **Importação em Organização, não em Sistema.** É um ato de manutenção de dados do titular, próximo a Categorias e Relatórios; evita sugerir que seja o caminho principal (o principal é a conexão automática, C05 a mantém como contingência).
- **Recorrências em Planejamento.** A projeção de saldo e contas a pagar (RF-REC-03) é prospectiva e se conecta a Orçamento.
- **Cartões e Contas separados.** Modelos mentais distintos (saldo vs. fatura) e regras de negócio distintas (RN-02, RN-03, RF-CAR-06).

---

## 4. Hierarquia de navegação

### 4.1 Níveis

| Nível | Elemento | Conteúdo |
|---|---|---|
| N0 | Shell | Menu de navegação + cabeçalho global + área de conteúdo |
| N1 | Destino de menu | As 13 telas autenticadas (Login fica fora do shell) |
| N2 | Sub-navegação interna | Abas ou segmentos dentro da tela (tabela 4.2) |
| N3 | Detalhe | Painel lateral, modal ou página de detalhe (contas/{id}, cartoes/{id}) |

Profundidade máxima: 3 níveis a partir do menu. Nenhuma tela exige mais de 2 toques/cliques depois do menu para alcançar o conteúdo principal.

### 4.2 Sub-navegação por tela (N2)

| Tela | Abas / segmentos | Padrão |
|---|---|---|
| Dashboard | Nenhuma; seções roláveis | Seletor de período no cabeçalho da página |
| Transações | Segmento rápido: Todas, Receitas, Despesas, Transferências | Controle segmentado (equivale ao filtro de tipo, RF-TRX-02) |
| Contas | Nenhuma; lista + detalhe | Lista com drill-down |
| Cartões | Seletor de cartão + abas: Fatura atual, Faturas, Parcelas e projeção, Consolidado | Abas com `role="tablist"` |
| Investimentos | Abas: Carteira, Alocação, Evolução, Movimentações | Abas |
| Orçamento e metas | Abas: Orçamento, Metas | Abas; seletor de mês |
| Recorrências | Abas: Detectadas, Ativas, Projeção | Abas |
| Categorias e regras | Abas: Categorias, Regras | Abas |
| Conexões | Seções: Conexões, Histórico de sincronizações | Seções roláveis com âncora |
| Importação | Passos: 1 Arquivo, 2 Mapeamento (CSV), 3 Pré-visualização, 4 Confirmação; aba Lotes | Stepper + aba |
| Alertas | Abas: Central, Preferências | Abas |
| Relatórios | Abas: Relatório mensal, Exportações | Abas |
| Configurações | Seções: Perfil e região, Aparência, Segurança (2FA), Dados e privacidade | Lista de seções com âncora; no celular, lista que abre subpágina |

### 4.3 Estados de navegação

| Estado | Regra |
|---|---|
| Item ativo | `aria-current="page"` + indicador visual (barra, preenchimento e peso de fonte; nunca só cor) |
| Item com pendência | Ponto/contador: Alertas (não lidos), Conexões (conexão com erro ou consentimento a vencer) |
| Item desabilitado | Não existe; todas as telas ficam sempre disponíveis, mesmo sem dados (mostram estado vazio com ação) |
| Primeiro acesso, sem conexão | Dashboard exibe estado vazio orientando a conectar (leva a Conexões); menu permanece completo |

---

## 5. Navegação no celular (inferior e drawer, desenho-base)

### 5.1 Barra inferior (abaixo de 768 px)

Cinco destinos, escolhidos pela frequência de consulta:

| Posição | Destino | Justificativa |
|---|---|---|
| 1 | Início (Dashboard) | Ponto de partida |
| 2 | Transações | Tarefa mais frequente |
| 3 | Contas | Consulta rápida de saldo |
| 4 | Cartões | Consulta de fatura e vencimento |
| 5 | Mais | Abre o drawer com as demais telas |

```
+----------------------------------+
|  Conteúdo da tela                |
|                                  |
+----------------------------------+
| [Início] [Trans.] [Contas] [Cart.] [Mais]
+----------------------------------+
```

### 5.2 Drawer "Mais"

Abre como folha inferior (bottom sheet) ocupando até 85% da altura, com grupos idênticos aos do menu lateral, exceto os itens já presentes na barra.

```
+----------------------------------+
|  ------   (alça)                 |
|  Mais                       [X]  |
|----------------------------------|
|  MOVIMENTAÇÃO                    |
|   Investimentos                  |
|  PLANEJAMENTO                    |
|   Orçamento e metas              |
|   Recorrências                   |
|  ORGANIZAÇÃO                     |
|   Categorias e regras            |
|   Importação                     |
|   Relatórios                     |
|  SISTEMA                         |
|   Conexões                  (!)  |
|   Alertas                   (3)  |
|   Configurações                  |
|----------------------------------|
|  Tema: (Claro)(Escuro)(Sistema)  |
|  [Sair]                          |
+----------------------------------+
```

### 5.3 Regras do celular

| Regra | Valor |
|---|---|
| Altura da barra inferior | 56 px + safe-area inferior (`env(safe-area-inset-bottom)`) |
| Alvo de toque | Mínimo 44 x 44 px |
| Item "Mais" ativo | Quando a tela atual pertence ao drawer, o item "Mais" fica ativo com `aria-current` e o título da tela aparece no cabeçalho |
| Fechar drawer | Botão fechar, toque no fundo, gesto para baixo e tecla `Esc`; foco retorna a "Mais" |
| Foco e leitores de tela | Drawer é `role="dialog"` modal, `aria-label="Mais opções"`, com focus trap |
| Ações primárias | Botão de ação flutuante apenas onde há criação frequente (Transações: "Nova transação"); demais ações no cabeçalho da página |
| Cabeçalho rolável | Título da tela encolhe ao rolar; indicador de sincronização permanece visível |
| Troca de tema | Disponível dentro do drawer e em Configurações |

---

## 6. Navegação no desktop (lateral, expansão)

### 6.1 Estrutura (a partir de 1024 px)

```
+------------------------+----------------------------------------------------+
| [logo] Painel          |  Cabeçalho global (seção 7)                        |
|                        +----------------------------------------------------+
| VISÃO GERAL            |                                                    |
|  > Dashboard           |                                                    |
|                        |                                                    |
| MOVIMENTAÇÃO           |           Área de conteúdo                         |
|    Transações          |           (main, rolagem própria)                  |
|    Contas              |                                                    |
|    Cartões             |                                                    |
|    Investimentos       |                                                    |
|                        |                                                    |
| PLANEJAMENTO           |                                                    |
|    Orçamento e metas   |                                                    |
|    Recorrências        |                                                    |
|                        |                                                    |
| ORGANIZAÇÃO            |                                                    |
|    Categorias e regras |                                                    |
|    Importação          |                                                    |
|    Relatórios          |                                                    |
|                        |                                                    |
| SISTEMA                |                                                    |
|    Conexões        (!) |                                                    |
|    Alertas         (3) |                                                    |
|    Configurações       |                                                    |
|                        |                                                    |
| [<] Recolher menu      |                                                    |
+------------------------+----------------------------------------------------+
```

### 6.2 Regras

| Regra | Valor |
|---|---|
| Largura expandida | 256 px |
| Largura recolhida (trilho de ícones) | 72 px, com rótulo em tooltip e `aria-label` |
| Recolher | Botão no rodapé do menu; preferência persistida por usuário (cliente) |
| Entre 768 e 1023 px | Trilho de ícones por padrão; expande como sobreposição ao acionar |
| Rótulos de grupo | Texto pequeno em caixa alta, `role="presentation"` visual, agrupados com `<nav>` + `aria-labelledby` ou lista com `aria-label` |
| Ordem de foco | Link "Pular para o conteúdo" → menu → cabeçalho → conteúdo |
| Uso com mouse | Itens com estado de hover e foco visíveis; tooltip nos ícones do trilho recolhido; área clicável do item ocupa toda a largura do menu |
| Menu fixo | `position: sticky`, altura da viewport, rolagem independente se necessário |

---

## 7. Cabeçalho global

### 7.1 Composição (celular, desenho-base)

```
+----------------------------------+
| Título da tela        (o) 12 min (3)|
+----------------------------------+
```

| Elemento | Adaptação |
|---|---|
| Seletor de período | Move-se para a primeira linha do conteúdo da tela, em barra fixa sob o título |
| Indicador de sincronização | Reduz para ícone + tempo curto ("12 min"); toque abre folha com detalhes e botão "Sincronizar" |
| Botão sincronizar | Dentro da folha de status e em "puxar para atualizar" onde a tela for lista |
| Sino | Permanece no cabeçalho; toque abre a Central de Alertas completa (sem popover) |
| Menu do usuário | Sai do cabeçalho; vive no drawer "Mais", que inclui "Ocultar valores", tema e Sair |
| Ocultar valores | Botão de ícone (olho) no cabeçalho do celular, com área de toque de 44 px, além da opção no drawer |

### 7.2 Composição (desktop, expansão)

```
+-------------------------------------------------------------------------------+
| Título da tela            [Período: Out/2026 v]   (o) Atualizado há 12 min [↻]  (3) [RA v] |
+-------------------------------------------------------------------------------+
   1                              2                     3                    4    5   6
```

| # | Elemento | Comportamento | Requisitos |
|---|---|---|---|
| 1 | Título da página e breadcrumb curto (apenas em detalhes: `Cartões > Nubank final 1234`) | `h1` único da página | RNF-USA-04 |
| 2 | Seletor de período | Presente em Dashboard, Transações, Orçamento e Relatórios; ausente nas demais. Opções: Mês, Trimestre, Ano, Personalizado; respeita dia de início do mês | RF-DSH-07, RF-CFG-02 |
| 3 | Indicador de sincronização | Chip com ícone, texto e cor; clique abre popover de status | RF-DSH-06, RF-CON-03, RF-SYN-05 |
| 4 | Botão sincronizar tudo | Dispara sincronização global; vira indicador de progresso durante execução | RF-SYN-05 |
| 5 | Sino de alertas | Contador de não lidos; abre popover com os 5 mais recentes | RF-ALR-01 |
| 6 | Menu do usuário | Nome, botão "Ocultar valores" (alternância com `aria-pressed`, ver `sistema-de-layout.md` 9.5), seletor de tema (Claro, Escuro, Sistema), Configurações, Sair | RF-AUT-05, RF-CFG-03 |

### 7.3 Indicador de sincronização — máquina de estados

| Estado | Texto (desktop) | Ícone / cor semântica | Condição | Ação ao clicar |
|---|---|---|---|---|
| Atualizado | "Atualizado há 12 min" | Check / sucesso | Todas as conexões `UPDATED`, última sincronização recente | Popover com lista de conexões |
| Sincronizando | "Sincronizando... 2 de 4" | Spinner / informação | Existe `sync_job` em execução | Popover com progresso por conexão |
| Desatualizado | "Desatualizado há 2 dias" | Relógio / alerta | Última sincronização acima de 36 h (decisão do titular) | Popover com botão "Sincronizar agora" |
| Atenção | "1 conexão precisa de ação" | Triângulo / alerta | Status `WAITING_USER_ACTION`, `LOGIN_ERROR`, consentimento a vencer | Leva a Conexões, conexão destacada |
| Erro | "Falha ao sincronizar" | Octógono / erro | Conexão com 5 falhas consecutivas (RN-13) ou erro geral | Leva a Conexões |
| Sem conexões | "Nenhuma conexão" | Link / neutro | Zero conexões | Leva a Conexões, abre fluxo de conexão |
| Sem rede | "Sem conexão com a internet" | Nuvem cortada / neutro | `navigator.onLine` falso | Exibe dados em cache, sem ação |

Regras:

- O estado nunca é comunicado apenas por cor: sempre ícone distinto e texto.
- Mudanças de estado são anunciadas em região `aria-live="polite"`; erros em `role="alert"`.
- O tempo relativo atualiza a cada minuto sem recarregar a página ("há 1 min", "há 2 h", "ontem às 08:10").
- Quando há mais de um problema, vale o estado de maior gravidade: Erro > Atenção > Desatualizado > Sincronizando > Atualizado.

### 7.4 Popover do indicador

```
+--------------------------------------------+
| Status das conexões                        |
|--------------------------------------------|
| (ok) Nubank            há 12 min           |
| (ok) Itaú              há 12 min           |
| (!)  Inter  Ação necessária     [Reconectar]|
| (x)  XP     Erro de login       [Reconectar]|
|--------------------------------------------|
| Limite: 4 de 5 conexões                    |
| [Sincronizar tudo]     [Gerenciar conexões]|
+--------------------------------------------+
```

Requisitos cobertos: RF-CON-03, RF-CON-04, RF-CON-06, RF-DSH-06, RF-SYN-05.

### 7.5 Popover do sino

```
+--------------------------------------------+
| Alertas                    [Marcar lidos]  |
|--------------------------------------------|
| (•) Fatura Nubank vence em 3 dias          |
| (•) Orçamento Alimentação em 92%           |
|     Nova assinatura detectada: Spotify     |
|--------------------------------------------|
| [Ver todos os alertas]                     |
+--------------------------------------------+
```

---

## 8. Hierarquia de conteúdo e peso visual (para todas as telas)

| Nível | Papel | Regra de hierarquia |
|---|---|---|
| H1 | Título da tela | Um por página; no cabeçalho global |
| H2 | Seção/cartão principal dentro da tela | Sempre presente em blocos de dashboard, abas e painéis |
| H3 | Subseção | Dentro de painéis e modais |
| Valor-chave | Indicador financeiro principal (saldo, resultado, fatura) | Maior corpo de texto da seção, números tabulares, rótulo acima em menor peso |
| Ação primária | Um único botão primário por região | Posição consistente: canto superior direito do bloco (desktop) ou rodapé fixo do modal |
| Ação destrutiva | Nunca primária; sempre separada e com confirmação | Estilo "perigo", alinhada à esquerda do rodapé de modal |

Ordem de leitura do conteúdo (ordem do DOM = ordem visual):

1. Cabeçalho da página (título, período, ações).
2. Resumo (indicadores).
3. Visualização principal (gráfico ou tabela).
4. Detalhamento e listas.
5. Ações secundárias e informações de apoio.

---

## 9. Princípios de conteúdo (microcopy)

| Tema | Regra |
|---|---|
| Idioma | pt-BR; tratamento direto, sem jargão técnico ("conexão", não "item Pluggy"; "instituição", não "connector") |
| Verbos de ação | Imperativo curto: "Conectar instituição", "Sincronizar agora", "Reconectar", "Criar regra" |
| Valores | Sempre em BRL e com sinal explícito para despesas (`-R$ 120,00`) |
| Erros | Dizer o que aconteceu, por que (quando conhecido) e o que fazer; sem códigos técnicos como texto principal |
| Ações destrutivas | Nomear o objeto e as consequências: "Excluir todos os dados" vs. "Desconectar Itaú e manter histórico" |
| Segurança | Reforçar nas telas de conexão que o app não armazena credenciais bancárias e é somente leitura (C01, C03) |
| Somente leitura | Quando houver tentação de implicar escrita no banco (ex.: "pagar fatura"), o texto deixa claro que o app apenas consulta |

---

## 10. Matriz resumida: elemento transversal x requisito

| Elemento transversal | Requisitos |
|---|---|
| Shell com menu lateral/inferior | RNF-USA-01, Plano 3.3 |
| Indicador de sincronização | RF-DSH-06, RF-SYN-05, RF-CON-03 |
| Sino e central de alertas | RF-ALR-01 |
| Seletor de período | RF-DSH-07, RF-CFG-02 |
| Tema claro/escuro/sistema | RF-CFG-03 |
| Logout e expiração de sessão | RF-AUT-05 |
| Formatação BRL e pt-BR | RNF-USA-02, RF-CFG-01 |
| Estados carregando, vazio, erro | RNF-USA-03 |
| Acessibilidade básica | RNF-USA-04 |
