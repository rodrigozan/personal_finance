# Plano de Execução — Painel Financeiro Pessoal

**Base:** `URS-Painel-Financeiro-Pessoal.md` v1.1
**Arquivo de controle:** `docs/STATUS.md`
**Data:** 05/10/2026

---

## 1. Princípios do plano

1. Cada sprint tem entregáveis, critérios de aceite (DoD) e um portão de saída.
2. **Uma sprint só inicia quando a anterior estiver com status `CONCLUÍDA` em `docs/STATUS.md`.** Nenhuma exceção.
3. Somente a sprint em andamento pode ter tarefas `EM ANDAMENTO`. Sprints posteriores permanecem `BLOQUEADA`.
4. A mudança de status de sprint para `CONCLUÍDA` exige: todos os itens do DoD marcados, evidência registrada e aprovação do titular (Rod).
5. Stack fixa conforme URS 2.1: Next.js (App Router) + TypeScript, Supabase, Vercel, Pluggy, yarn.
6. Idioma pt-BR em interface, documentação e planos.
7. Sem comentários no código.

---

## 2. Visão geral das sprints

| Sprint | Nome | Fase da URS | Depende de |
|---|---|---|---|
| 1 | Mockups de todas as telas | Pré-Fase 0 (design) | — |
| 2 | Fundação | Fase 0 | Sprint 1 |
| 3 | Conexão e sincronização | Fase 1 | Sprint 2 |
| 4 | Transações e categorização | Fase 2 | Sprint 3 |
| 5 | Cartões | Fase 3 | Sprint 4 |
| 6 | Investimentos | Fase 4 | Sprint 5 |
| 7 | Dashboard, orçamento e metas | Fase 5 | Sprint 6 |
| 8 | Recorrências, alertas, importação e relatórios | Fase 6 | Sprint 7 |
| 9 | Endurecimento | Fase 7 | Sprint 8 |

---

## 3. Sprint 1 — Mockups de todas as telas

### 3.1 Objetivo
Produzir mockups navegáveis, responsivos e fiéis ao URS para as 14 telas da seção 9, antes de qualquer código de produto. O resultado é a referência visual e de interação obrigatória das sprints seguintes.

### 3.2 Regra de autoria (obrigatória)
O layout das telas **não pode ser gerado pelo Claude em modo padrão**. Todo o trabalho de design e construção dos mockups deve ser executado pelos três agentes abaixo, invocados como subagentes. O orquestrador (Claude principal) apenas coordena, registra status e valida entregas contra o DoD; não escreve layout.

| Agente | Arquivo de definição | Responsabilidade nesta sprint |
|---|---|---|
| UX Architect | `C:\Users\rodrigo.alves\.claude\agents\design\design-ux-architect.md` | Arquitetura de informação, mapa de navegação, fluxos, wireframes, sistema de layout/CSS, breakpoints, comportamento de tema claro/escuro, regras de acessibilidade e estados |
| UI Designer | `C:\Users\rodrigo.alves\.claude\agents\design\design-ui-designer.md` | Design system (tokens, tipografia, cores, componentes), identidade visual, gráficos, hierarquia visual, dark mode, conformidade WCAG AA e imagens (SVG/PNG) dos mockups |
| Frontend Developer | `C:\Users\rodrigo.alves\.claude\agents\engineering\engineering-frontend-developer.md` | Implementação dos mockups navegáveis em HTML, somente após aprovação das imagens, a partir das especificações e imagens dos agentes anteriores, com dados fictícios, responsivos e acessíveis |

Evidência de cumprimento: cada artefato em `docs/design/` e `mockups/` deve indicar no `STATUS.md` qual agente o produziu.

### 3.3 Telas e estados cobertos

| # | Tela | Conteúdo mínimo do mockup (referência URS) |
|---|---|---|
| 1 | Login | E-mail, senha, recuperação de senha, erro de credencial, sem cadastro público (RF-AUT-01/02/06) |
| 2 | Dashboard | Saldo, receitas, despesas, resultado, gastos por categoria com drill-down, fluxo de caixa, evolução do patrimônio, faturas a vencer, últimas transações, comparativo, seletor de período, indicador "atualizado há X min" (RF-DSH-01 a 07) |
| 3 | Transações | Tabela paginada, filtros completos, busca, edição em lote, painel de detalhe, edição de categoria/descrição/notas/tags, marcar interna/ignorar, criar manual, dividir em categorias (RF-TRX-01 a 08) |
| 4 | Contas | Lista, saldo consolidado, apelido/ocultar/excluir do consolidado, histórico de saldo (RF-CTA-01 a 04) |
| 5 | Cartões | Cartões com limite e datas, fatura atual/fechadas/futuras, compras com parcela atual/total, projeção de parcelas, consolidação por cartão/categoria (RF-CAR-01 a 07) |
| 6 | Investimentos | Carteira por classe, valor atual/aplicado/rentabilidade/vencimento, alocação por classe e instituição, movimentações, evolução, cadastro manual (RF-INV-01 a 06) |
| 7 | Orçamento e metas | Planejado x realizado com indicação visual, copiar mês anterior, metas de economia (RF-ORC-01 a 04) |
| 8 | Recorrências | Detectadas (confirmar/editar/descartar), manuais, projeção de saldo e contas a pagar (RF-REC-01 a 03) |
| 9 | Categorias e regras | Árvore categoria/subcategoria, arquivar, regras automáticas com prioridade, aplicação retroativa (RF-CAT-01 a 06) |
| 10 | Conexões | Lista de instituições, status, última sincronização, erro, reconectar, desconectar (manter/excluir histórico), uso X de 5, consentimento a vencer, dados por instituição, sincronização manual com progresso, histórico de sincronizações (RF-CON, RF-SYN-05/07) |
| 11 | Importação | Upload OFX/CSV, mapeamento de colunas, pré-visualização, deduplicação, lotes e desfazer (RF-IMP-01 a 04) |
| 12 | Alertas | Central de alertas, tipos, ativar/desativar e limites, e-mail opcional (RF-ALR-01 a 03) |
| 13 | Relatórios | Relatório mensal, exportação CSV filtrada, exportação total JSON/CSV (RF-REL-01 a 03) |
| 14 | Configurações | Moeda/fuso, dia de início do mês, tema, 2FA, exportação, exclusão total com revogação de conexões (RF-CFG, RF-AUT-07, RNF-LGPD) |

Cada tela deve ter mockup para: **desktop**, **celular**, **tema claro**, **tema escuro** e os estados **carregando**, **vazio** e **erro** (RNF-USA-01/03). Fluxos modais e painéis (widget de conexão da Pluggy, confirmação de exclusão, edição em lote) entram como estados da tela de origem.

Elementos transversais: shell de navegação (menu lateral no desktop, navegação inferior/drawer no celular), cabeçalho com indicador de sincronização e alertas, componentes de moeda BRL e datas pt-BR (RNF-USA-02).

### 3.4 Etapas e ordem de execução

As etapas são sequenciais. Cada uma só começa quando a anterior for aceita.

**Etapa 1.1 — Arquitetura de UX (agente: UX Architect)**
Entrada: URS completo (seções 4, 8.5 e 9).
Saídas em `docs/design/ux/`:
- `arquitetura-de-informacao.md`: mapa do site, hierarquia de navegação, agrupamento das 14 telas.
- `fluxos.md`: fluxos principais (login, conectar instituição, reconectar, categorizar e criar regra, importar arquivo, fechar/consultar fatura, excluir todos os dados).
- `wireframes.md`: wireframes de baixa fidelidade das 14 telas, desktop e celular.
- `sistema-de-layout.md`: grid, breakpoints mobile-first, espaçamentos, regras de tabelas responsivas, tema claro/escuro/sistema, requisitos de acessibilidade e de estados (carregando/vazio/erro).

**Etapa 1.2 — Design visual e design system (agente: UI Designer)**
Entrada: saídas da Etapa 1.1.
Saídas em `docs/design/ui/`:
- `design-system.md`: tokens (cor, tipografia, espaçamento, raio, sombra), paleta semântica financeira (receita, despesa, interno, alerta, erro) validada em contraste WCAG AA nos dois temas.
- `componentes.md`: especificação de cada componente (botões, campos, tabela, cartão de indicador, badge de status, seletor de período, gráficos, modal, painel lateral, toasts, estados vazios).
- `guia-de-graficos.md`: padrões visuais dos gráficos (categorias, fluxo de caixa, patrimônio, alocação) com acessibilidade.

**Etapa 1.3 — Imagens dos mockups (agente: UI Designer)**
Entrada: saídas das Etapas 1.1 e 1.2.
Decisão do titular: as imagens são aprovadas **antes** de qualquer arquivo HTML.
Saídas em `docs/design/mockups-img/`:
- `svg/`: uma imagem SVG por tela e viewport, fiel ao design system (tokens, tipografia, contraste, logos de instituições em SVG).
- `png/`: exportação PNG de cada SVG para revisão.
- Escopo desta fase: 14 telas x 2 viewports (celular 390 px e desktop 1440 px) x tema claro = 28 imagens. Tema escuro e estados (carregando, vazio, erro) são derivados dos mesmos tokens na etapa de HTML.
- `README.md`: índice das imagens.

**Etapa 1.4 — Aprovação das imagens (titular)**
- O titular revisa as 28 imagens e aprova ou pede ajustes. Ajustes retornam ao UI Designer.
- A Etapa 1.5 (HTML) só inicia com a aprovação registrada no `STATUS.md`.

**Etapa 1.5 — Implementação dos mockups em HTML (agente: Frontend Developer)**
Entrada: imagens aprovadas e saídas das Etapas 1.1 e 1.2.
Saídas em `mockups/`:
- `mockups/index.html`: índice navegável com as 14 telas e atalhos para estados.
- `mockups/assets/`: CSS com tokens e componentes compartilhados, JS mínimo para navegação, troca de tema e alternância de estados, e logos SVG das instituições.
- Uma página por tela, com dados fictícios realistas em BRL e pt-BR, alternância de tema e de estado (carregando/vazio/erro) e comportamento responsivo, fiel às imagens aprovadas.
- Os mockups são estáticos e isolados do app Next.js: não importam código de `app/`, não usam Supabase nem Pluggy, e não afetam o build.

**Etapa 1.6 — Revisão cruzada (agentes: UX Architect e UI Designer)**
- UX Architect confere os mockups contra fluxos, wireframes, navegação e requisitos do URS (matriz de rastreabilidade).
- UI Designer confere fidelidade às imagens aprovadas e ao design system, consistência entre telas e contraste.
- Saída: `docs/design/revisao.md` com divergências encontradas e correções aplicadas pelo Frontend Developer. Ciclo repetido até zero divergências abertas.

**Etapa 1.7 — Portão de saída**
- Preenchimento da matriz de rastreabilidade `docs/design/rastreabilidade.md` (cada RF com tela e estado correspondentes; nenhuma tela do URS sem mockup).
- Apresentação ao titular e registro da aprovação em `docs/STATUS.md`.

### 3.5 Critérios de aceite (DoD) da Sprint 1
- [ ] As 14 telas possuem imagem de mockup (celular e desktop, tema claro) aprovada pelo titular antes do HTML.
- [ ] As 14 telas da seção 9 do URS possuem mockup navegável.
- [ ] Cada tela existe em desktop e celular, tema claro e escuro.
- [ ] Cada tela possui estados carregando, vazio e erro.
- [ ] Todos os requisitos de interface listados na seção 3.3 estão representados.
- [ ] Todos os artefatos foram produzidos pelos agentes UX Architect, UI Designer e Frontend Developer, com autoria registrada no `STATUS.md`.
- [ ] Contraste WCAG AA validado nos dois temas; navegação por teclado e rótulos presentes.
- [ ] Revisão cruzada com zero divergências abertas.
- [ ] Matriz de rastreabilidade completa.
- [ ] Aprovação do titular registrada.

### 3.6 Portão para a Sprint 2
A Sprint 2 permanece `BLOQUEADA` até que a Sprint 1 esteja `CONCLUÍDA` no `STATUS.md`.

---

## 4. Sprint 2 — Fundação (Fase 0)

**Objetivo:** base técnica do projeto.
**Escopo:**
- Ajustar o projeto Next.js (App Router, TypeScript) conforme seção 3.1 da URS; lint e Prettier; estrutura `app/`, `components/`, `lib/`, `supabase/migrations/`.
- Tokens e componentes base portados do design system aprovado na Sprint 1 (Tailwind), com tema claro/escuro e shell de navegação.
- Projeto Supabase, migrações iniciais (todas as tabelas da seção 6), RLS em todas as tabelas, Auth com usuário único e cadastro público desabilitado.
- Middleware de proteção de rotas; tela de Login implementada a partir do mockup.
- Variáveis de ambiente (seção 3.3), deploy na Vercel.

**DoD (aceite Fase 0):** login funcional, rota protegida, deploy ativo, migrações aplicáveis do zero, nenhum segredo no bundle.

---

## 5. Sprint 3 — Conexão e sincronização (Fase 1)

**Escopo:**
- Camada isolada de integração Pluggy (autenticação, connect token, adaptação de contratos).
- Widget em Client Component, registro de conexões com validação de propriedade; tela de Conexões fiel ao mockup.
- Webhook com `WEBHOOK_SECRET`, fila `sync_jobs`, sincronização idempotente de contas e transações com paginação por cursor, backoff, RN-13, cron diário protegido por `CRON_SECRET`, `sync_logs`.
- Telas de Contas integradas a dados reais.

**DoD:** conectar instituição real via Meu Pluggy; contas e transações importadas sem duplicidade após múltiplas sincronizações; falha de uma conexão não afeta as demais (CA-01, CA-03, CA-07).

---

## 6. Sprint 4 — Transações e categorização (Fase 2)

**Escopo:** listagem, filtros, edição, tags, lote, manuais, divisão; categorias padrão e hierarquia; mapeamento Pluggy; regras automáticas com precedência; detecção de transferências internas e pagamentos de fatura; telas Transações e Categorias e regras.

**DoD:** edições do usuário preservadas após nova sincronização; transferências internas e pagamentos de fatura fora de receitas/despesas.

---

## 7. Sprint 5 — Cartões (Fase 3)

**Escopo:** cartões, faturas, parcelas, projeção de parcelas futuras, alerta de vencimento; tela Cartões.

**DoD:** valor da fatura confere com o do banco; parcelas futuras projetadas corretamente.

---

## 8. Sprint 6 — Investimentos (Fase 4)

**Escopo:** carteira, alocação, histórico de valor, movimentações, investimentos manuais; tela Investimentos.

**DoD:** patrimônio total confere com a soma dos saldos informados pelas instituições.

---

## 9. Sprint 7 — Dashboard, orçamento e metas (Fase 5)

**Escopo:** dashboard completo com agregações em SQL/views e drill-down; orçamento por categoria; metas; telas Dashboard e Orçamento e metas.

**DoD:** RNF-DES-01/02 atendidos com massa de teste de 100 mil transações; CA-06.

---

## 10. Sprint 8 — Recorrências, alertas, importação e relatórios (Fase 6)

**Escopo:** detecção de recorrências e projeção; alertas internos e e-mail opcional; importação OFX/CSV com pré-visualização, deduplicação e lotes; relatório mensal e exportações; telas Recorrências, Alertas, Importação e Relatórios.

**DoD:** importação sem duplicidade; alertas gerados nos cenários definidos; exportação CSV íntegra (CA-08).

---

## 11. Sprint 9 — Endurecimento (Fase 7)

**Escopo:** revisão de segurança (seção 8.1), testes das regras críticas (RNF-MAN-03), observabilidade, exportação e exclusão total de dados, tela Configurações completa, documentação de operação, rate limiting, cabeçalhos de segurança.

**DoD:** checklist de segurança (8.1) e LGPD (8.2) concluído; critérios gerais CA-01 a CA-08 verificados.

---

## 12. Regra de fidelidade ao mockup nas Sprints 2 a 9

Toda tela implementada deve seguir o mockup aprovado na Sprint 1. Divergências exigem registro em `docs/STATUS.md` (seção Decisões) e nova aprovação do titular. Em cada sprint, o Frontend Developer implementa a interface e o UX Architect/UI Designer revisam a fidelidade antes do aceite.

---

## 13. Riscos do plano

| Risco | Mitigação |
|---|---|
| Mockups incompletos gerarem retrabalho nas sprints de código | Matriz de rastreabilidade RF x tela como pré-requisito do portão da Sprint 1 |
| Escopo de 14 telas x 2 temas x 2 viewports x 3 estados ser grande | Componentes e CSS compartilhados; alternância de tema/estado via atributos, sem duplicar páginas |
| Orquestrador gerar layout fora dos agentes | Autoria registrada por artefato no `STATUS.md`; revisão cruzada na Etapa 1.4 |
| Contratos da Pluggy divergirem do esperado | Conferir documentação vigente e changelog no início da Sprint 3 (URS seção 7) |
| Sprint avançar sem fechamento da anterior | Regra do portão e bloqueio explícito no `STATUS.md` |
