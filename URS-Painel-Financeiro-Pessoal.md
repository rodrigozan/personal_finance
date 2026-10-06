# URS — Painel Financeiro Pessoal

**Documento:** User Requirements Specification
**Versão:** 1.1 (stack migrada para Next.js em projeto único)
**Data:** 05/10/2026
**Autor:** Rod
**Status:** Rascunho para execução

---

## 1. Introdução

### 1.1 Objetivo
Especificar os requisitos de uma aplicação web pessoal que consolida automaticamente, via Open Finance Brasil, contas, transações, cartões de crédito e investimentos do usuário, permitindo analisar gastos, recebimentos, patrimônio e organizar a vida financeira.

### 1.2 Escopo
**Dentro do escopo**
- Uso por um único titular (uso pessoal).
- Ingestão automática de dados reais via Open Finance usando o Meu Pluggy (conector gratuito para uso pessoal).
- Importação manual (OFX/CSV) como contingência.
- Análise, categorização, orçamento, metas, recorrências, alertas e relatórios.

**Fora do escopo**
- Iniciação de pagamentos/Pix e qualquer movimentação de dinheiro.
- Múltiplos usuários, CPFs ou perfis de terceiros.
- Aplicativo mobile nativo.
- Recomendação de investimentos ou aconselhamento financeiro.
- Integração com sistemas contábeis/ERP.

### 1.3 Definições e siglas
| Termo | Significado |
|---|---|
| URS | User Requirements Specification |
| Open Finance | Sistema regulado pelo Banco Central de compartilhamento de dados financeiros |
| Pluggy | Provedor de infraestrutura de Open Finance via API |
| Meu Pluggy | Fluxo gratuito da Pluggy para uso pessoal (conector 200) |
| Item | Conexão de uma instituição na Pluggy |
| RLS | Row Level Security (Supabase/Postgres) |
| RF / RNF / RN | Requisito Funcional / Não Funcional / Regra de Negócio |

---

## 2. Contexto e premissas

### 2.1 Stack obrigatória
| Camada | Tecnologia |
|---|---|
| Aplicação | Next.js (App Router) com TypeScript, projeto único com frontend e backend (Server Components, Server Actions e Route Handlers) |
| Banco de dados | Supabase (PostgreSQL) |
| Autenticação | Supabase Auth (`@supabase/ssr`) |
| Hospedagem | Vercel (projeto único) |
| Agregador Open Finance | Pluggy (Meu Pluggy) |
| Gerenciador de pacotes | yarn |

### 2.2 Premissas
- P01: O Meu Pluggy permanece gratuito para uso pessoal, com limite de 5 conexões ativas, todas do mesmo titular.
- P02: O usuário possui contas nas instituições que participam do Open Finance.
- P03: A Vercel executa Route Handlers e Server Actions como funções serverless (sem filesystem persistente e com limite de tempo de execução).
- P04: Os planos gratuitos de Vercel e Supabase atendem ao volume de uso pessoal.

### 2.3 Restrições
- C01: Nenhuma credencial bancária do usuário pode ser armazenada pela aplicação; a autorização ocorre no ambiente do banco/Pluggy.
- C02: Chaves e segredos nunca podem chegar ao navegador.
- C03: A aplicação é somente leitura em relação aos dados bancários.
- C04: A implementação deve funcionar sem custo recorrente obrigatório.
- C05: Se o fluxo gratuito do provedor for descontinuado, a aplicação deve continuar operável por importação manual.

### 2.4 Perfil do usuário
Titular único, com conhecimento técnico, que acessa por desktop e celular (navegador responsivo).

---

## 3. Arquitetura de alto nível

```
Banco → Open Finance → Meu Pluggy → Pluggy API
                                       │ webhook
                                       ▼
        Next.js (UI + Server Actions + Route Handlers) ⇄ Supabase (Postgres + Auth)
                                       ▲
                          Vercel Cron (sincronização de contingência)
```

### 3.1 Organização do repositório
Projeto único Next.js, sem monorepo e sem workspaces, com yarn:
- `app/` — páginas (App Router) e Route Handlers (`app/api/`)
- `components/` — componentes de interface
- `lib/` — integração Pluggy, clientes Supabase, regras de negócio e schemas de validação
- `supabase/migrations/` — migrações versionadas
- `vercel.json` — configuração do cron

### 3.2 Decisões de arquitetura
- AR01: As páginas protegidas são renderizadas no servidor (Server Components) com a sessão do Supabase obtida via cookies; mutações usam Server Actions ou Route Handlers, sempre validando a sessão no servidor.
- AR02: A service role key do Supabase é usada exclusivamente em código server-only (nunca em Client Components nem em variáveis `NEXT_PUBLIC_`).
- AR03: RLS habilitado em todas as tabelas como segunda camada de proteção.
- AR04: A sincronização é orientada a eventos (webhook da Pluggy) com cron diário de contingência.
- AR05: Todo processamento de sincronização é idempotente e fragmentado por item/recurso para respeitar o limite de tempo das funções serverless.
- AR06: Fila de trabalho persistida em tabela do Supabase (`sync_jobs`), consumida pelo webhook e pelo cron.
- AR07: Server Components por padrão; Client Components apenas onde houver interatividade (gráficos, widget da Pluggy, formulários dinâmicos).
- AR08: Route Handlers de webhook e cron com duração máxima configurada (`maxDuration`) e processamento em lotes.

### 3.3 Variáveis de ambiente
| Variável | Uso |
|---|---|
| `PLUGGY_CLIENT_ID` | Autenticação na API Pluggy |
| `PLUGGY_CLIENT_SECRET` | Autenticação na API Pluggy |
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto (cliente e servidor) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave pública para autenticação |
| `SUPABASE_SERVICE_ROLE_KEY` | Somente servidor |
| `WEBHOOK_SECRET` | Validação dos webhooks recebidos |
| `CRON_SECRET` | Proteção do endpoint de cron |
| `APP_URL` | URL pública da aplicação (redirecionamentos de autenticação) |

---

## 4. Requisitos funcionais

### 4.1 Autenticação e acesso (RF-AUT)
| ID | Requisito | Prioridade |
|---|---|---|
| RF-AUT-01 | O sistema deve permitir login com e-mail e senha via Supabase Auth. | Alta |
| RF-AUT-02 | O cadastro público deve ser desabilitado; apenas o titular previamente criado acessa. | Alta |
| RF-AUT-03 | Todas as páginas, exceto login, devem exigir sessão válida, verificada por middleware do Next.js. | Alta |
| RF-AUT-04 | Todos os Route Handlers e Server Actions, exceto webhook e cron, devem exigir sessão válida. | Alta |
| RF-AUT-05 | O sistema deve permitir logout e expiração de sessão. | Alta |
| RF-AUT-06 | O sistema deve permitir recuperação de senha por e-mail. | Média |
| RF-AUT-07 | O sistema deve suportar autenticação de dois fatores (TOTP). | Baixa |

### 4.2 Conexões Open Finance (RF-CON)
| ID | Requisito | Prioridade |
|---|---|---|
| RF-CON-01 | O sistema deve gerar um connect token no servidor e abrir o widget de conexão da Pluggy em um Client Component. | Alta |
| RF-CON-02 | O sistema deve registrar cada conexão (item) vinculada ao usuário, validando a propriedade do item antes de salvar. | Alta |
| RF-CON-03 | O sistema deve listar as conexões com instituição, status, data da última sincronização e mensagem de erro. | Alta |
| RF-CON-04 | O sistema deve permitir reconectar/renovar uma conexão com erro de login, consentimento expirado ou aguardando ação do usuário. | Alta |
| RF-CON-05 | O sistema deve permitir desconectar uma conexão, com opção de manter ou excluir os dados históricos. | Alta |
| RF-CON-06 | O sistema deve exibir o uso do limite de conexões (X de 5) e impedir novas conexões acima do limite. | Média |
| RF-CON-07 | O sistema deve avisar com antecedência sobre consentimentos próximos do vencimento. | Média |
| RF-CON-08 | O sistema deve exibir quais tipos de dados (contas, cartões, investimentos) cada instituição disponibiliza. | Baixa |

### 4.3 Sincronização (RF-SYN)
| ID | Requisito | Prioridade |
|---|---|---|
| RF-SYN-01 | O sistema deve expor endpoint de webhook para receber eventos da Pluggy (criação/atualização de item, novas transações, erros). | Alta |
| RF-SYN-02 | O webhook deve validar a autenticidade do evento (segredo em header e/ou reconsulta do item na API Pluggy) e responder rapidamente, enfileirando o processamento. | Alta |
| RF-SYN-03 | O sistema deve sincronizar contas, transações, faturas e investimentos de um item, respeitando paginação (incluindo paginação por cursor). | Alta |
| RF-SYN-04 | A gravação deve ser idempotente (upsert por identificador externo), sem duplicar registros em reprocessamentos. | Alta |
| RF-SYN-05 | O sistema deve permitir sincronização manual por conexão e global, com indicação de progresso. | Alta |
| RF-SYN-06 | O sistema deve executar sincronização diária de contingência via Vercel Cron. | Média |
| RF-SYN-07 | O sistema deve registrar histórico de sincronizações (início, fim, itens processados, erros). | Média |
| RF-SYN-08 | O sistema deve tratar falhas parciais, repetindo o trabalho com backoff e marcando a conexão como com erro após tentativas esgotadas. | Média |
| RF-SYN-09 | O sistema deve reconciliar exclusões/alterações de lançamentos pendentes que passam a efetivados ou deixam de existir na origem. | Média |
| RF-SYN-10 | A carga inicial deve buscar o máximo de histórico disponibilizado pela instituição. | Alta |

### 4.4 Contas bancárias (RF-CTA)
| ID | Requisito | Prioridade |
|---|---|---|
| RF-CTA-01 | O sistema deve listar contas correntes, poupança e demais contas com saldo atual e instituição. | Alta |
| RF-CTA-02 | O sistema deve exibir o saldo consolidado das contas. | Alta |
| RF-CTA-03 | O sistema deve permitir apelidar, ocultar e excluir do consolidado uma conta. | Média |
| RF-CTA-04 | O sistema deve manter histórico de saldo ao longo do tempo (snapshot a cada sincronização). | Média |

### 4.5 Transações (RF-TRX)
| ID | Requisito | Prioridade |
|---|---|---|
| RF-TRX-01 | O sistema deve listar transações com paginação e ordenação por data. | Alta |
| RF-TRX-02 | O sistema deve filtrar por período, conta, cartão, categoria, tipo (receita/despesa/transferência), faixa de valor, tags e texto livre. | Alta |
| RF-TRX-03 | O sistema deve permitir editar categoria, descrição amigável, notas e tags sem alterar o dado original da origem. | Alta |
| RF-TRX-04 | O sistema deve permitir marcar uma transação como transferência interna ou ignorá-la nos cálculos. | Alta |
| RF-TRX-05 | O sistema deve permitir criar, editar e excluir transações manuais (apenas as manuais podem ser excluídas). | Média |
| RF-TRX-06 | O sistema deve permitir dividir uma transação em múltiplas categorias. | Baixa |
| RF-TRX-07 | O sistema deve permitir edição em lote (categoria, tags). | Média |
| RF-TRX-08 | O sistema deve detectar automaticamente transferências entre contas próprias e pagamentos de fatura, evitando dupla contagem. | Alta |

### 4.6 Categorias e regras (RF-CAT)
| ID | Requisito | Prioridade |
|---|---|---|
| RF-CAT-01 | O sistema deve fornecer categorias padrão (moradia, alimentação, transporte, saúde, lazer, educação, assinaturas, impostos, renda, investimentos, etc.). | Alta |
| RF-CAT-02 | O sistema deve permitir criar, editar, arquivar e organizar categorias hierarquicamente (categoria e subcategoria). | Alta |
| RF-CAT-03 | O sistema deve mapear a categoria sugerida pela Pluggy para a categoria interna. | Alta |
| RF-CAT-04 | O sistema deve permitir regras automáticas de categorização (texto contém/igual, valor, conta, cartão). | Alta |
| RF-CAT-05 | Ao recategorizar uma transação, o sistema deve oferecer a criação de regra e a aplicação retroativa. | Média |
| RF-CAT-06 | As regras do usuário devem ter precedência sobre o mapeamento padrão. | Alta |

### 4.7 Cartões de crédito (RF-CAR)
| ID | Requisito | Prioridade |
|---|---|---|
| RF-CAR-01 | O sistema deve listar cartões com limite total, limite disponível, fechamento e vencimento. | Alta |
| RF-CAR-02 | O sistema deve exibir a fatura atual, faturas fechadas e faturas futuras, com valor e status. | Alta |
| RF-CAR-03 | O sistema deve exibir as compras de cada fatura, identificando parcelamentos (parcela atual/total). | Alta |
| RF-CAR-04 | O sistema deve projetar parcelas futuras comprometidas por mês. | Alta |
| RF-CAR-05 | O sistema deve consolidar gasto por cartão, por categoria e por período. | Alta |
| RF-CAR-06 | O pagamento de fatura não deve ser contabilizado como despesa (apenas as compras). | Alta |
| RF-CAR-07 | O sistema deve exibir alerta de vencimento de fatura próximo. | Média |

### 4.8 Investimentos (RF-INV)
| ID | Requisito | Prioridade |
|---|---|---|
| RF-INV-01 | O sistema deve listar investimentos por classe (renda fixa, fundos, renda variável, previdência, outros), conforme disponibilizado pela instituição. | Alta |
| RF-INV-02 | O sistema deve exibir valor atual, valor aplicado, rentabilidade e data de vencimento quando disponíveis. | Alta |
| RF-INV-03 | O sistema deve exibir a alocação do patrimônio por classe e por instituição. | Alta |
| RF-INV-04 | O sistema deve exibir movimentações (aportes, resgates, rendimentos, impostos) quando disponíveis. | Média |
| RF-INV-05 | O sistema deve manter histórico de valor para evolução patrimonial. | Média |
| RF-INV-06 | O sistema deve permitir cadastrar investimentos manuais (ativos não cobertos pelo Open Finance). | Média |

### 4.9 Dashboard (RF-DSH)
| ID | Requisito | Prioridade |
|---|---|---|
| RF-DSH-01 | O sistema deve exibir saldo total, receitas, despesas e resultado do período selecionado. | Alta |
| RF-DSH-02 | O sistema deve exibir gastos por categoria (gráfico e tabela) com drill-down para as transações. | Alta |
| RF-DSH-03 | O sistema deve exibir o fluxo de caixa mensal (entradas x saídas) e a evolução do saldo. | Alta |
| RF-DSH-04 | O sistema deve exibir a evolução do patrimônio (contas + investimentos − faturas em aberto). | Alta |
| RF-DSH-05 | O sistema deve exibir faturas a vencer, últimas transações e comparativo com o mês anterior. | Alta |
| RF-DSH-06 | O sistema deve exibir o indicador "dados atualizados há X minutos" com status das conexões. | Média |
| RF-DSH-07 | O sistema deve permitir selecionar o período (mês, trimestre, ano, personalizado) respeitando o dia de início do mês configurado. | Alta |

### 4.10 Orçamento e metas (RF-ORC)
| ID | Requisito | Prioridade |
|---|---|---|
| RF-ORC-01 | O sistema deve permitir definir orçamento mensal por categoria. | Alta |
| RF-ORC-02 | O sistema deve exibir realizado x planejado com percentual e indicação visual. | Alta |
| RF-ORC-03 | O sistema deve permitir copiar o orçamento do mês anterior. | Média |
| RF-ORC-04 | O sistema deve permitir criar metas de economia com valor-alvo, prazo e progresso. | Média |

### 4.11 Recorrências e projeções (RF-REC)
| ID | Requisito | Prioridade |
|---|---|---|
| RF-REC-01 | O sistema deve detectar automaticamente gastos recorrentes e assinaturas (mesmo estabelecimento, valor e periodicidade similares). | Média |
| RF-REC-02 | O sistema deve permitir confirmar, editar ou descartar recorrências detectadas e criar recorrências manuais. | Média |
| RF-REC-03 | O sistema deve projetar o saldo e as contas a pagar dos próximos meses considerando recorrências e parcelas de cartão. | Média |

### 4.12 Importação manual (RF-IMP)
| ID | Requisito | Prioridade |
|---|---|---|
| RF-IMP-01 | O sistema deve importar extratos em OFX e CSV, com mapeamento de colunas para CSV. | Média |
| RF-IMP-02 | O sistema deve exibir pré-visualização antes de confirmar a importação. | Média |
| RF-IMP-03 | O sistema deve deduplicar contra registros existentes (data, valor, descrição) e entre importações. | Média |
| RF-IMP-04 | O sistema deve registrar lotes de importação e permitir desfazer um lote. | Baixa |

### 4.13 Alertas (RF-ALR)
| ID | Requisito | Prioridade |
|---|---|---|
| RF-ALR-01 | O sistema deve gerar alertas internos para: fatura próxima do vencimento, orçamento excedido ou próximo do limite, conexão com erro ou consentimento a expirar, gasto atípico, nova assinatura detectada. | Média |
| RF-ALR-02 | O sistema deve permitir ativar/desativar cada tipo de alerta e definir limites. | Média |
| RF-ALR-03 | O sistema deve permitir envio opcional de alertas por e-mail. | Baixa |

### 4.14 Relatórios e exportação (RF-REL)
| ID | Requisito | Prioridade |
|---|---|---|
| RF-REL-01 | O sistema deve gerar relatório mensal (receitas, despesas, categorias, cartões, patrimônio). | Média |
| RF-REL-02 | O sistema deve exportar transações filtradas em CSV. | Alta |
| RF-REL-03 | O sistema deve exportar todos os dados do usuário em formato estruturado (JSON/CSV). | Média |

### 4.15 Configurações (RF-CFG)
| ID | Requisito | Prioridade |
|---|---|---|
| RF-CFG-01 | O sistema deve usar BRL como moeda e America/Sao_Paulo como fuso padrão. | Alta |
| RF-CFG-02 | O sistema deve permitir configurar o dia de início do mês financeiro. | Média |
| RF-CFG-03 | O sistema deve permitir tema claro/escuro. | Baixa |
| RF-CFG-04 | O sistema deve permitir excluir todos os dados e revogar as conexões. | Alta |

---

## 5. Regras de negócio

| ID | Regra |
|---|---|
| RN-01 | Convenção de sinal normalizada internamente: receitas positivas, despesas negativas, independentemente do formato da origem. |
| RN-02 | Transferências entre contas próprias e pagamentos de fatura são classificados como "interno" e excluídos de receitas e despesas. |
| RN-03 | Compras de cartão são despesas na data da compra; o pagamento da fatura não é despesa. |
| RN-04 | Compras parceladas devem ser exibidas por parcela, mantendo o vínculo com a compra original. |
| RN-05 | Edições do usuário (categoria, descrição, notas, tags) nunca são sobrescritas por sincronizações posteriores. |
| RN-06 | Registros vindos do Open Finance são identificados por `(user_id, external_id)` único. |
| RN-07 | Transações pendentes que são substituídas por efetivadas na origem não podem gerar duplicidade. |
| RN-08 | Patrimônio líquido = saldo das contas + valor dos investimentos − faturas de cartão em aberto. |
| RN-09 | Contas ocultas ou excluídas do consolidado não entram nos totais do dashboard. |
| RN-10 | Regras de categorização do usuário têm precedência sobre o mapeamento padrão; entre regras, vale a de maior prioridade e, em empate, a mais específica. |
| RN-11 | Valores monetários são armazenados com precisão decimal (nunca ponto flutuante). |
| RN-12 | A aplicação não executa nenhuma operação de escrita nas instituições financeiras. |
| RN-13 | Uma conexão com 5 falhas consecutivas é marcada como com erro e exige ação do usuário ou reprocessamento. |

---

## 6. Modelo de dados (conceitual)

Todas as tabelas possuem `id` (uuid), `user_id`, `created_at`, `updated_at` e RLS habilitado por `user_id`.

| Entidade | Principais campos |
|---|---|
| `profiles` | nome, dia_inicio_mes, fuso, tema, preferências de alerta |
| `connections` | pluggy_item_id, connector_id, connector_name, status, execution_status, last_synced_at, consent_expires_at, error_message |
| `accounts` | connection_id, external_id, tipo, nome, apelido, saldo, moeda, oculta, excluir_consolidado |
| `account_balance_snapshots` | account_id, saldo, capturado_em |
| `credit_cards` | connection_id, external_id, nome, limite_total, limite_disponivel, dia_fechamento, dia_vencimento |
| `credit_card_bills` | card_id, external_id, periodo, data_fechamento, data_vencimento, valor_total, valor_minimo, status |
| `transactions` | account_id ou card_id, bill_id, external_id, origem (openfinance/manual/import), data, valor, tipo, descricao_original, descricao_usuario, category_id, parcela_atual, parcela_total, is_internal, is_ignored, status, notas |
| `transaction_tags` | transaction_id, tag |
| `transaction_splits` | transaction_id, category_id, valor |
| `categories` | nome, parent_id, tipo (receita/despesa), cor, ícone, arquivada |
| `category_rules` | condições (jsonb), category_id, prioridade, ativa |
| `investments` | connection_id, external_id, classe, subclasse, nome, valor_atual, valor_aplicado, rentabilidade, vencimento, origem |
| `investment_snapshots` | investment_id, valor, capturado_em |
| `investment_transactions` | investment_id, external_id, tipo, data, valor, imposto |
| `budgets` | category_id, mês, valor_planejado |
| `goals` | nome, valor_alvo, valor_atual, prazo |
| `recurring_items` | descrição, valor_estimado, periodicidade, próxima_data, category_id, status |
| `alerts` | tipo, mensagem, lido, referência |
| `sync_jobs` | connection_id, recurso, status, tentativas, próximo_retry, erro |
| `sync_logs` | connection_id, início, fim, resumo, erro |
| `webhook_events` | event_id, tipo, payload, processado_em |
| `import_batches` | arquivo, formato, qtd_registros, status, desfeito_em |

Índices mínimos: `transactions(user_id, data desc)`, `transactions(user_id, category_id, data)`, unicidade em `(user_id, external_id)` nas tabelas de origem Open Finance.

---

## 7. Integração com a Pluggy

| Item | Requisito |
|---|---|
| Autenticação | Obter API key com client id/secret no servidor e renová-la antes de expirar. |
| Connect token | Gerado no servidor por sessão de conexão; nunca expor client secret. |
| Widget | Client Component abre o widget da Pluggy com o connect token; ao concluir, envia o `itemId` ao servidor. |
| Conector | Meu Pluggy (conector 200) e conectores de Open Finance equivalentes por instituição. |
| Recursos consumidos | Accounts, Transactions, Credit card bills, Investments, Investment transactions, Identity (opcional). |
| Webhooks | Eventos de item criado/atualizado/erro e transações criadas/atualizadas, com URL pública da aplicação. |
| Paginação | Suportar paginação por cursor nos endpoints que a adotam. |
| Tratamento de erros | Mapear estados de item (atualizado, atualizando, erro de login, desatualizado, aguardando ação do usuário) para status internos. |
| Cobertura | Respeitar sub-produtos informados por instituição e tratar instituições deslistadas ou indisponíveis sem quebrar a sincronização. |

Observação: os nomes exatos de endpoints, eventos e campos devem ser conferidos na documentação vigente da Pluggy durante a implementação.

---

## 8. Requisitos não funcionais

### 8.1 Segurança
| ID | Requisito |
|---|---|
| RNF-SEG-01 | Todo tráfego deve usar HTTPS. |
| RNF-SEG-02 | Segredos apenas em variáveis de ambiente do servidor; nenhum segredo hardcoded ou versionado. |
| RNF-SEG-03 | RLS ativo em todas as tabelas; service role key usada apenas em código server-only. |
| RNF-SEG-04 | Route Handlers apenas em mesma origem, sem CORS aberto; verificação de origem em mutações. |
| RNF-SEG-05 | Validação de entrada em todos os Route Handlers e Server Actions com schemas zod. |
| RNF-SEG-06 | Rate limiting nas rotas públicas (webhook, login, cron). |
| RNF-SEG-07 | Endpoint de cron protegido por `CRON_SECRET`; webhook protegido por `WEBHOOK_SECRET`. |
| RNF-SEG-08 | Cabeçalhos de segurança HTTP e proteção contra XSS/CSRF. |
| RNF-SEG-09 | Logs não podem conter dados financeiros sensíveis nem tokens. |
| RNF-SEG-10 | Dependências auditadas periodicamente. |

### 8.2 Privacidade e LGPD
| ID | Requisito |
|---|---|
| RNF-LGPD-01 | Coletar somente os dados necessários ao propósito da aplicação. |
| RNF-LGPD-02 | Permitir exportação e exclusão completa dos dados do titular. |
| RNF-LGPD-03 | Permitir revogação do consentimento do Open Finance a partir da aplicação. |
| RNF-LGPD-04 | Não compartilhar dados com terceiros além da Pluggy e do Supabase. |

### 8.3 Desempenho
| ID | Requisito |
|---|---|
| RNF-DES-01 | Dashboard carregado em até 2 s (p95) com até 100 mil transações. |
| RNF-DES-02 | Listagens paginadas no servidor; resposta de página em até 500 ms (p95). |
| RNF-DES-03 | Agregações do dashboard por consultas SQL/views no banco, não no cliente. |
| RNF-DES-04 | Webhook responde em até 3 s, delegando processamento pesado à fila. |
| RNF-DES-05 | Cada execução serverless de sincronização deve respeitar o limite de tempo da Vercel, processando em lotes. |

### 8.4 Disponibilidade e confiabilidade
| ID | Requisito |
|---|---|
| RNF-DIS-01 | Disponibilidade em regime de melhor esforço, compatível com planos gratuitos. |
| RNF-DIS-02 | Reprocessamento seguro de eventos duplicados ou fora de ordem. |
| RNF-DIS-03 | Falha de uma conexão não pode interromper a sincronização das demais. |
| RNF-DIS-04 | Backups do banco conforme o plano Supabase e exportação periódica dos dados pelo usuário. |

### 8.5 Usabilidade
| ID | Requisito |
|---|---|
| RNF-USA-01 | Interface responsiva (desktop e celular). |
| RNF-USA-02 | Idioma pt-BR, formatação de moeda e datas no padrão brasileiro. |
| RNF-USA-03 | Estados de carregamento, vazio e erro em todas as telas. |
| RNF-USA-04 | Acessibilidade básica (contraste, navegação por teclado, rótulos). |

### 8.6 Manutenibilidade e qualidade
| ID | Requisito |
|---|---|
| RNF-MAN-01 | TypeScript em todo o projeto. |
| RNF-MAN-02 | Lint e formatação padronizados. |
| RNF-MAN-03 | Testes automatizados para regras de negócio críticas (normalização de sinal, transferências internas, parcelas, categorização, idempotência). |
| RNF-MAN-04 | Migrações de banco versionadas. |
| RNF-MAN-05 | Logs estruturados e rastreáveis por conexão/job. |
| RNF-MAN-06 | Uso exclusivo de yarn como gerenciador de pacotes. |

### 8.7 Custo
| ID | Requisito |
|---|---|
| RNF-CUS-01 | Operação dentro dos planos gratuitos de Vercel, Supabase e Meu Pluggy. |

---

## 9. Telas

| Tela | Conteúdo principal |
|---|---|
| Login | E-mail e senha, recuperação de senha |
| Dashboard | Indicadores, gráficos, faturas a vencer, últimas transações |
| Transações | Tabela com filtros, busca, edição em lote, detalhe |
| Contas | Lista de contas, saldos, histórico |
| Cartões | Cartões, faturas, parcelas e projeção |
| Investimentos | Carteira, alocação, evolução |
| Orçamento e metas | Planejado x realizado, metas |
| Recorrências | Assinaturas e contas projetadas |
| Categorias e regras | Gestão de categorias e regras automáticas |
| Conexões | Instituições conectadas, status, sincronização, reconexão |
| Importação | Upload OFX/CSV, pré-visualização, lotes |
| Alertas | Central de alertas |
| Relatórios | Relatório mensal e exportações |
| Configurações | Preferências, exportação e exclusão de dados |

---

## 10. Entrega por fases

### Fase 0 — Fundação
- Projeto Next.js (App Router) com TypeScript, lint e formatação.
- Projeto Supabase, migrações iniciais, RLS, Auth com usuário único e middleware de proteção de rotas.
- Deploy na Vercel e variáveis de ambiente.

**Aceite:** login funcional, rota protegida, deploy do projeto, migrações aplicáveis do zero.

### Fase 1 — Conexão e sincronização
- Connect token, widget, registro de conexões, tela de Conexões.
- Webhook, fila `sync_jobs`, sincronização de contas e transações, cron de contingência, logs.

**Aceite:** conectar instituição real via Meu Pluggy, ver contas e transações importadas sem duplicidade após múltiplas sincronizações.

### Fase 2 — Transações e categorização
- Listagem, filtros, edição, tags, transações manuais.
- Categorias padrão, mapeamento Pluggy, regras automáticas, detecção de transferências internas.

**Aceite:** edições do usuário preservadas após nova sincronização; transferências internas e pagamentos de fatura fora de receitas/despesas.

### Fase 3 — Cartões
- Cartões, faturas, parcelas, projeção de parcelas futuras, alerta de vencimento.

**Aceite:** valor da fatura exibida confere com o do banco; parcelas futuras projetadas corretamente.

### Fase 4 — Investimentos
- Carteira, alocação, histórico de valor, movimentações, investimentos manuais.

**Aceite:** patrimônio total confere com a soma dos saldos informados pelas instituições.

### Fase 5 — Dashboard, orçamento e metas
- Dashboard completo com drill-down, orçamento por categoria, metas.

**Aceite:** requisitos de desempenho RNF-DES-01/02 atendidos com massa de dados de teste.

### Fase 6 — Recorrências, alertas, importação e relatórios
- Detecção de recorrências, projeção, alertas, importação OFX/CSV, exportações e relatório mensal.

**Aceite:** importação sem duplicidade, alertas gerados nos cenários definidos, exportação CSV íntegra.

### Fase 7 — Endurecimento
- Revisão de segurança, testes das regras críticas, observabilidade, exportação/exclusão total de dados, documentação de operação.

**Aceite:** checklist de segurança (seção 8.1) e LGPD (seção 8.2) concluído.

---

## 11. Critérios gerais de aceite

- CA-01: Dados de ao menos uma instituição real aparecem automaticamente após a conexão, sem intervenção manual.
- CA-02: Novas transações do banco aparecem na aplicação via webhook ou, no máximo, na sincronização diária.
- CA-03: Reexecutar qualquer sincronização não altera contagem nem valores já importados.
- CA-04: Nenhum segredo é acessível no bundle do frontend nem em respostas da API.
- CA-05: Usuário não autenticado não acessa nenhum dado via frontend, API ou consulta direta ao banco.
- CA-06: Totais do dashboard são reproduzíveis a partir da listagem de transações com os mesmos filtros.
- CA-07: Falha de uma conexão não afeta a atualização das demais.
- CA-08: A aplicação permanece utilizável via importação manual caso o fluxo gratuito da Pluggy seja descontinuado.

---

## 12. Riscos e mitigação

| ID | Risco | Mitigação |
|---|---|---|
| R01 | Pluggy alterar ou encerrar o plano gratuito pessoal | Camada de integração isolada; importação OFX/CSV como fallback |
| R02 | Instituição indisponível, deslistada ou com dados incompletos | Tratar status por instituição; exibir cobertura; permitir cadastro manual |
| R03 | Consentimento Open Finance expirar | Alertas de vencimento e fluxo simples de renovação |
| R04 | Limite de tempo das funções serverless na carga inicial | Processamento em lotes via `sync_jobs` e cron |
| R05 | Duplicidade de transações (pendente x efetivada, reprocessamento) | Chave externa única, upsert e reconciliação (RN-06, RN-07) |
| R06 | Erros de classificação de transferências/pagamentos de fatura | Detecção automática com revisão manual e regras do usuário |
| R07 | Estouro dos limites do plano gratuito do Supabase | Índices, agregações em SQL, monitoramento de uso |
| R08 | Vazamento de dados financeiros | RLS, segredos no servidor, logs sem dados sensíveis, rate limit |
| R09 | Mudanças de contrato na API da Pluggy (paginação, campos) | Acompanhar changelog; camada de adaptação com testes |

---

## 13. Rastreabilidade

| Objetivo do usuário | Requisitos |
|---|---|
| Dados reais automáticos | RF-CON, RF-SYN |
| Analisar gastos e recebimentos | RF-TRX, RF-CAT, RF-DSH |
| Controlar cartões | RF-CAR |
| Acompanhar investimentos e patrimônio | RF-INV, RF-DSH-04 |
| Organizar a vida financeira | RF-ORC, RF-REC, RF-ALR, RF-REL |
| Segurança e privacidade | RNF-SEG, RNF-LGPD |
| Operar sem custo | RNF-CUS, C04 |