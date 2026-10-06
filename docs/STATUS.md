# Status do Projeto — Painel Financeiro Pessoal

**Plano:** `docs/PLANO-DE-EXECUCAO.md`
**Última atualização:** 06/10/2026

## Regras de uso deste arquivo

- Valores permitidos para status de sprint: `BLOQUEADA`, `EM ANDAMENTO`, `CONCLUÍDA`.
- Valores permitidos para tarefa: `PENDENTE`, `EM ANDAMENTO`, `CONCLUÍDA`.
- Uma sprint só pode sair de `BLOQUEADA` quando a sprint anterior estiver `CONCLUÍDA`.
- Uma sprint só vira `CONCLUÍDA` com todos os itens do DoD marcados, evidência registrada e aprovação do titular.
- Toda alteração neste arquivo deve ser registrada no Histórico.

## Painel de sprints

| Sprint | Nome | Status | Início | Conclusão | Aprovação do titular |
|---|---|---|---|---|---|
| 1 | Mockups de todas as telas | EM ANDAMENTO | 05/10/2026 | — | — |
| 2 | Fundação | BLOQUEADA | — | — | — |
| 3 | Conexão e sincronização | BLOQUEADA | — | — | — |
| 4 | Transações e categorização | BLOQUEADA | — | — | — |
| 5 | Cartões | BLOQUEADA | — | — | — |
| 6 | Investimentos | BLOQUEADA | — | — | — |
| 7 | Dashboard, orçamento e metas | BLOQUEADA | — | — | — |
| 8 | Recorrências, alertas, importação e relatórios | BLOQUEADA | — | — | — |
| 9 | Endurecimento | BLOQUEADA | — | — | — |

Sprint 1 é a única liberada para início; as demais dependem da conclusão da anterior.

## Sprint 1 — Mockups

### Etapas

| Etapa | Descrição | Agente responsável | Status | Evidência |
|---|---|---|---|---|
| 1.1 | Arquitetura de UX (IA, fluxos, wireframes, sistema de layout) | UX Architect | CONCLUÍDA | `docs/design/ux/arquitetura-de-informacao.md`, `fluxos.md`, `wireframes.md`, `sistema-de-layout.md` (14 telas com wireframe desktop e celular, estados e modais; matriz RF x tela em `wireframes.md` seção 15) |
| 1.2 | Design visual e design system | UI Designer | CONCLUÍDA | `docs/design/ui/design-system.md` (tokens claro e escuro em CSS, paleta semântica financeira, categórica e de status, razões de contraste WCAG AA calculadas por script nos dois temas: zero falhas em 35 pares de texto, 23 de componentes e 12 cores categóricas por tema), `componentes.md` (catálogo completo com estados, medidas e CSS), `guia-de-graficos.md` (7 gráficos com versão celular e desktop e alternativa acessível), `telas.md` (direção visual das 14 telas); pendências P-UI-01 a P-UI-14 registradas em `design-system.md` seção 14 |
| 1.3 | Imagens dos mockups (SVG/PNG, 14 telas x celular e desktop, tema claro) | UI Designer | CONCLUÍDA | `docs/design/mockups-img/`: 28 SVG em `svg/` e 28 PNG em `png/` (14 telas x 2 viewports), `logos/` (11 instituições + Google), `README.md` com índice e pontos de atenção, gerador em `_gerador/`; conferência visual imagem a imagem |
| 1.4 | Aprovação das imagens | Titular | CONCLUÍDA | Aprovação das 28 imagens registrada em Decisões e desvios (06/10/2026) |
| 1.5 | Implementação dos mockups em HTML | Frontend Developer | EM ANDAMENTO | `mockups/` |
| 1.6 | Revisão cruzada | UX Architect + UI Designer | PENDENTE | `docs/design/revisao.md` |
| 1.7 | Matriz de rastreabilidade e aprovação | Orquestrador + titular | PENDENTE | `docs/design/rastreabilidade.md` |

Etapa N só inicia com a etapa N-1 `CONCLUÍDA`.

### Telas

| # | Tela | Wireframe (UX Architect) | Visual (UI Designer) | Imagem aprovada (UI Designer) | Mockup HTML (Frontend Developer) | Desktop | Celular | Claro | Escuro | Carregando | Vazio | Erro | Revisada |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Login | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] | n/a | [x] | [ ] |
| 2 | Dashboard | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [ ] |
| 3 | Transações | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [ ] |
| 4 | Contas | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [ ] |
| 5 | Cartões | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [ ] |
| 6 | Investimentos | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [ ] |
| 7 | Orçamento e metas | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [ ] |
| 8 | Recorrências | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [ ] |
| 9 | Categorias e regras | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [ ] |
| 10 | Conexões | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [ ] |
| 11 | Importação | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [ ] |
| 12 | Alertas | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [ ] |
| 13 | Relatórios | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [ ] |
| 14 | Configurações | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] | n/a | [x] | [ ] |

Nota: Desktop = 1440 px e Celular = 390 px. Claro e Escuro verificados com dados; Carregando, Vazio e Erro verificados somente no tema claro. Detalhes e pendências em `mockups/NOTAS.md`.

### DoD da Sprint 1

- [ ] As 14 telas possuem imagem de mockup (celular e desktop, tema claro) aprovada pelo titular antes do HTML.
- [ ] As 14 telas da seção 9 do URS possuem mockup navegável.
- [ ] Cada tela existe em desktop e celular, tema claro e escuro.
- [ ] Cada tela possui estados carregando, vazio e erro.
- [ ] Todos os requisitos de interface da seção 3.3 do plano estão representados.
- [ ] Todos os artefatos foram produzidos por UX Architect, UI Designer e Frontend Developer, com autoria registrada neste arquivo.
- [ ] Contraste WCAG AA validado nos dois temas; navegação por teclado e rótulos presentes.
- [ ] Revisão cruzada com zero divergências abertas.
- [ ] Matriz de rastreabilidade completa.
- [ ] Aprovação do titular registrada.

### Registro de autoria dos artefatos

| Artefato | Agente | Data |
|---|---|---|
| `docs/design/ux/arquitetura-de-informacao.md` | UX Architect | 05/10/2026 |
| `docs/design/ux/fluxos.md` | UX Architect | 05/10/2026 |
| `docs/design/ux/wireframes.md` | UX Architect | 05/10/2026 |
| `docs/design/ux/sistema-de-layout.md` | UX Architect | 05/10/2026 |
| `docs/design/ui/design-system.md` | UI Designer | 05/10/2026 |
| `docs/design/ui/componentes.md` | UI Designer | 05/10/2026 |
| `docs/design/ui/guia-de-graficos.md` | UI Designer | 05/10/2026 |
| `docs/design/ui/telas.md` | UI Designer | 05/10/2026 |
| `mockups/index.html` e `mockups/visualizar.html` | Frontend Developer | 06/10/2026 |
| `mockups/01-login.html` a `mockups/14-configuracoes.html` (14 telas) | Frontend Developer | 06/10/2026 |
| `mockups/assets/css/tokens.css` e `mockups/assets/css/componentes.css` | Frontend Developer | 06/10/2026 |
| `mockups/assets/js/` (tema.js, app.js, visualizar.js) e `mockups/assets/logos/`, `mockups/assets/fonts/` | Frontend Developer | 06/10/2026 |
| `mockups/_gerador/` (gerador das páginas e script de verificação) | Frontend Developer | 06/10/2026 |
| `mockups/NOTAS.md` | Frontend Developer | 06/10/2026 |

## Sprints 2 a 9

Sem tarefas liberadas. Detalhamento de etapas e DoD em `docs/PLANO-DE-EXECUCAO.md`. Esta seção será expandida no início de cada sprint, após a anterior ser `CONCLUÍDA`.

## Decisões e desvios

| Data | Decisão / desvio | Aprovado por |
|---|---|---|
| 05/10/2026 | Política de senha: mínimo de 12 caracteres. | Rod |
| 05/10/2026 | Login com Google adicionado além de e-mail/senha (extensão de RF-AUT-01). Sem cadastro público (RF-AUT-02): só o e-mail do titular previamente criado é aceito; qualquer outra conta Google é recusada. | Rod |
| 05/10/2026 | Limite de arquivo de importação: 20 MB. | Rod |
| 05/10/2026 | Dados considerados desatualizados após 36 h sem sincronização. | Rod |
| 05/10/2026 | "Interna" é selo/atributo da transação (RN-02), não categoria. | Rod |
| 05/10/2026 | Barra inferior do celular: Início, Transações, Contas, Cartões e Mais. | Rod |
| 05/10/2026 | Extras aprovados: exportar relatório em PDF/imprimir, modo ocultar valores, densidade de tabela configurável, códigos de recuperação do 2FA, opção de encerrar a conta de acesso na exclusão total. Atalhos de teclado: NÃO aprovado (fora do escopo). | Rod |
| 05/10/2026 | Requisito transversal: aplicação mobile first e com boa experiência em navegadores desktop. | Rod |
| 05/10/2026 | Variações: seta indica direção e cor indica favorabilidade (despesa em queda = verde). Receitas em listas e tabelas com sinal +R$. | Rod |
| 05/10/2026 | Ocultar valores: proporções dos gráficos permanecem visíveis, números ocultos. | Rod |
| 05/10/2026 | Exceções visuais aprovadas: ícone "G" colorido do Google e QR code do 2FA com fundo branco no tema escuro. Instituições devem usar logos em SVG (substitui o avatar com iniciais proposto). | Rod |
| 05/10/2026 | Cor principal: trocar o índigo/azul por roxo escuro. UI Designer deve derivar uma paleta completa a partir do roxo (ação, neutros, estados, categórica, gráficos), recalcular contraste AA e regenerar as 28 imagens. | Rod |

| 06/10/2026 | Titular aprovou as 28 imagens dos mockups (14 telas x celular e desktop, tema claro). Etapa 1.5 liberada. | Rod |
| 06/10/2026 | Receita e sucesso deixam de ser verdes e passam a ciano (`#0E7490` claro, `#2BB6E6` escuro). Substitui o registro anterior de que verde é receita e sucesso. | Rod |

## Histórico

| Data | Alteração |
|---|---|
| 05/10/2026 | Criação do plano de execução e do arquivo de status. Sprint 1 liberada para início; Sprints 2 a 9 bloqueadas. |
| 05/10/2026 | Etapa 1.1 (Arquitetura de UX) concluída pelo agente UX Architect: artefatos em `docs/design/ux/` (arquitetura de informação, fluxos, wireframes, sistema de layout); coluna Wireframe marcada para as 14 telas; autoria registrada. |
| 05/10/2026 | Etapa 1.1 revisada conforme decisões do titular: login com Google, senha mínima de 12 caracteres, importação até 20 MB, dados desatualizados após 36 h, exportação em PDF, ocultar valores, densidade de tabela, códigos de recuperação do 2FA e encerramento da conta na exclusão total aprovados; atalhos de teclado removidos; requisito mobile first aplicado (wireframes com celular primeiro, breakpoints e larguras máximas de desktop declarados). |
| 05/10/2026 | Sprint 1 passou para EM ANDAMENTO; entregas da Etapa 1.1 conferidas pelo orquestrador (4 arquivos em docs/design/ux/). Etapa 1.2 aguardando decisões do titular. |
| 05/10/2026 | Decisões do titular registradas (ver Decisões e desvios). Ajuste dos documentos de UX solicitado ao UX Architect antes da Etapa 1.2. |
| 05/10/2026 | Etapa 1.2 (Design visual e design system) concluída pelo agente UI Designer: artefatos em `docs/design/ui/` (design-system, componentes, guia-de-graficos, telas); coluna Visual (UI Designer) marcada para as 14 telas; autoria registrada; contraste WCAG AA validado por cálculo nos temas claro e escuro; pendências P-UI-01 a P-UI-14 para a revisão cruzada (Etapa 1.4). |
| 05/10/2026 | Titular exigiu imagens dos mockups antes de qualquer HTML: plano reestruturado (1.3 imagens SVG/PNG, 1.4 aprovação, 1.5 HTML, 1.6 revisão, 1.7 portão). Escopo das imagens: 14 telas x celular e desktop, tema claro. |
| 05/10/2026 | Decisões do titular sobre pendências do UI Designer registradas. Etapa 1.3 aguardando liberação. |
| 05/10/2026 | Etapa 1.3 (Imagens dos mockups) concluída pelo agente UI Designer: 28 SVG e 28 PNG em `docs/design/mockups-img/`, logos reutilizáveis, README e gerador; autoria registrada. Etapa 1.4 (aprovação das imagens pelo titular) permanece PENDENTE; coluna "Imagem aprovada" não marcada. |
| 05/10/2026 | Titular pediu troca da cor principal para roxo escuro; design system e imagens da Etapa 1.3 serão refeitos. Etapa 1.4 aguarda as novas imagens. |
| 05/10/2026 | Titular reprovou o índigo; UI Designer trocou a cor de ação para roxo escuro (`#5B21B6`), recriou paleta, neutros, informação (azul-céu) e categórica/gráficos sem roxo, recalculou contraste WCAG AA (zero falhas) em `design-system.md` (seções 1.3, 3, 5, 7 e 8) e regenerou as 28 imagens (SVG e PNG) com correções de layout no celular. Etapa 1.4 permanece PENDENTE; "Imagem aprovada" não marcada. |
| 06/10/2026 | Cor de receita e sucesso trocada de verde para ciano em `design-system.md` e no gerador; 28 imagens (SVG e PNG) regeneradas. Tabelas de contraste do design system ainda precisam ser recalculadas. |
| 06/10/2026 | Etapa 1.4 concluída com a aprovação das imagens pelo titular. Etapa 1.5 (HTML) iniciada pelo Frontend Developer. |
| 06/10/2026 | Etapa 1.5: Frontend Developer gerou os mockups em `mockups/` (14 telas, índice, visualizador, CSS/JS, logos, fonte Inter). Verificação em Chrome headless a 390 e 1440 px: tema claro e escuro com dados e estados carregando, vazio e erro no tema claro, sem overflow nem erros de console, comparado às PNGs aprovadas. Não verificados: estados no tema escuro, larguras intermediárias, teclado/leitor de tela. Pendências em `mockups/NOTAS.md`. Etapa 1.5 permanece EM ANDAMENTO para validação do orquestrador; coluna "Revisada" não marcada. |
