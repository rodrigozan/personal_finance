# Imagens dos mockups (Etapa 1.3)

Autor: UI Designer, 05/10/2026. Escopo: 14 telas x 2 viewports (celular e desktop), tema claro, estado "com dados". Não há HTML nesta etapa.

- `svg/`: 28 imagens vetoriais (fonte Inter embutida em cada arquivo).
- `png/`: 28 exportações. Desktop 1440 px de largura (escala 1x). Celular 390 px de largura, exportado em escala 2x (780 px) para leitura; a altura varia porque a rolagem é representada em página única longa.
- `logos/`: conjunto reutilizável de logos simplificados de instituições (itau, nubank, bb, bradesco, santander, inter, c6, xp, caixa, mercadopago, manual) e o G do Google. Estilizados (cor aproximada da marca + monograma), sem arquivos oficiais.
- `_gerador/`: gerador em Node. Regenerar tudo: `node _gerador/build.js` (opções: ids de tela, ex. `node _gerador/build.js 05 06`; `--no-png` para só SVG). Usa o Chrome headless para o PNG e `fonts/inter-latin-wght.woff2`. Dados fictícios coerentes em `_gerador/data.js`.

## Índice

| # | Tela | Celular | Desktop | O que mostra |
|---|---|---|---|---|
| 01 | Login | 01-login-celular | 01-login-desktop | E-mail/senha, "Entrar com Google", nota de somente leitura, seletor de tema |
| 02 | Dashboard | 02-dashboard-celular | 02-dashboard-desktop | Saldo total, receitas, despesas e resultado com variação (seta + favorabilidade), faixa de dados desatualizados (Inter), rosca por categoria, fluxo de caixa, patrimônio, faturas a vencer, últimas transações |
| 03 | Transações | 03-transacoes-celular | 03-transacoes-desktop | Busca, filtros, lista agrupada por dia (celular) e tabela (desktop), selos Interna/Pendente/Parcela, totais, paginação, FAB |
| 04 | Contas | 04-contas-celular | 04-contas-desktop | Saldo consolidado + histórico, contas por instituição, instituição com ação necessária, conta manual fora do consolidado |
| 05 | Cartões | 05-cartoes-celular | 05-cartoes-desktop | Cartões, limite, fatura aberta e fechada, compras com parcela, parcelas e projeção |
| 06 | Investimentos | 06-investimentos-celular | 06-investimentos-desktop | Valor atual/aplicado/rentabilidade, alocação, evolução, carteira por classe, item manual |
| 07 | Orçamento e metas | 07-orcamento-celular | 07-orcamento-desktop | Resumo, categorias com situação (dentro, próximo, no limite, excedido), metas |
| 08 | Recorrências | 08-recorrencias-celular | 08-recorrencias-desktop | Detectadas com confiança, ativas com totais, projeção de saldo e contas a pagar |
| 09 | Categorias e regras | 09-categorias-celular | 09-categorias-desktop | Árvore, detalhe com cor/ícone, regras com prioridade e ativação |
| 10 | Conexões | 10-conexoes-celular | 10-conexoes-desktop | 4 de 5 conexões (erro, atenção, atualizadas), nota de segurança, histórico de sincronizações |
| 11 | Importação | 11-importacao-celular | 11-importacao-desktop | Passo 3 (pré-visualização) com novas/duplicadas/erro, lotes anteriores com desfazer |
| 12 | Alertas | 12-alertas-celular | 12-alertas-desktop | Central (3 não lidos) e preferências com limites e e-mail |
| 13 | Relatórios | 13-relatorios-celular | 13-relatorios-desktop | Relatório mensal (categorias, cartões, patrimônio) e exportações |
| 14 | Configurações | 14-configuracoes-celular | 14-configuracoes-desktop | Perfil e região, aparência, segurança (Google, 2FA, códigos), dados e zona de perigo |

## Revisão de cor (05/10/2026)

O titular reprovou o índigo; todas as 28 imagens foram regeneradas com **roxo escuro** como cor de ação (`#5B21B6`, hover `#4C1D95`, ativo `#3B1676`, seleção `#EEE8FB`), neutros com subtom de roxo (fundo `#F6F5F9`, texto `#17132B`), informação em azul-céu (`#0369A1`) e paleta categórica sem roxo (azul, verde-azulado, laranja, rosa-cereja, ocre, oliva, ardósia, ciano, marrom, vinho, azul-marinho, cinza). Fonte dos valores: `docs/design/ui/design-system.md` seções 1.3, 3 e 5. Nessa revisão foram corrigidos também detalhes de espaçamento do celular (Contas, Investimentos, Recorrências, Categorias e regras).

## Convenções adotadas

- Telas com abas (Orçamento e metas, Recorrências, Categorias e regras, Importação, Alertas, Relatórios, Investimentos, Configurações) aparecem em rolagem contínua mostrando o conteúdo das abas principais, com a primeira aba marcada; no HTML cada aba terá seu próprio painel.
- Celular: a barra inferior fica no fim da página longa (posição após rolar até o final); no desktop o menu lateral ocupa 900 px de altura (sticky).
- "Hoje" fictício: 05/10/2026 14:34. Mês financeiro Out/2026 = 05/09 a 04/10 (início no dia 5). Ocultar valores NÃO está ativo.
- Valores negativos usam o sinal de menos tipográfico (U+2212) em vez de hífen.
- Dados coerentes entre telas: saldo consolidado R$ 23.924,77; receitas R$ 12.400,00; despesas R$ 8.915,40; resultado +R$ 3.484,60; investimentos R$ 63.631,47 (aplicado R$ 58.700,00); faturas a pagar R$ 5.345,70 (Nubank 2.310,00 + 842,30; Itaú 1.874,52 + 318,88); patrimônio líquido R$ 82.210,54.

## Pontos de atenção

- Logos são aproximações estilizadas; os monogramas dos logos avulsos usam fonte do sistema (sem Inter embutida).
- Gráficos são estáticos em SVG (sem tooltip, estado selecionado só no fluxo de caixa).
- O QR code do 2FA, modais e painéis (widget Pluggy, detalhe de transação, mapeamento de colunas) não foram desenhados nesta etapa (sem imagens -modal).
- Alvos de toque de 44 px aplicados nos botões e linhas do celular; ícones de ação em linhas de tabela do desktop seguem 20 px (alvo de 40 px).
- Verificação visual feita imagem a imagem (texto cortado, sobreposição, números, alinhamento, fonte Inter); truncamentos com reticências existem apenas onde o design prevê (descrições longas).
