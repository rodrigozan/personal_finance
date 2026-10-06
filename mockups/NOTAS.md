# Notas da Etapa 1.5 (mockups em HTML)

Autor: Frontend Developer. Data: 06/10/2026.

## Como abrir e regenerar

- Abrir `mockups/index.html` no navegador (sem servidor). `visualizar.html` mostra qualquer tela em moldura de 390, 768 ou 1440 px.
- Parâmetros de URL em qualquer tela: `?estado=data|loading|empty|error` e `?tema=claro|escuro|sistema`.
- Fonte das páginas: `mockups/_gerador/` (Node, sem dependências). Regenerar: `node mockups/_gerador/build.js`. Verificação em Chrome headless: `node mockups/_gerador/verificar.js <telas> <larguras> <temas> <estados>` (capturas na pasta temporária do sistema).

## O que foi verificado

- Chrome headless, 390 e 1440 px: as 14 telas nos temas claro e escuro, estado com dados; estados carregando, vazio e erro das 14 telas no tema claro. Sem overflow horizontal, sem erros de console e sem texto cortado nos casos medidos.
- Comparação visual com as PNGs aprovadas (versão clara): Login, Dashboard, Transações, Contas, Cartões, Investimentos, Orçamento, Recorrências, Categorias, Conexões, Importação, Alertas, Relatórios e Configurações.
- Todos os modais e painéis abrem sem sair da viewport nas duas larguras.

## O que NÃO foi verificado

- Estados carregando, vazio e erro no tema escuro (as telas usam os mesmos tokens; não houve captura).
- Larguras intermediárias (768, 1024 e 1280 px): sem captura nem medição de overflow.
- Navegação por teclado e leitores de tela: a estrutura segue o planejado (landmarks, rótulos, abas com setas, `dialog` nativo, foco visível global), mas não houve teste com tecnologia assistiva nem auditoria automática de contraste.
- Impressão e exportação em PDF do relatório.

## Pontos a decidir (divergências e lacunas)

1. **Ocultar valores e textos corridos.** Valores em componentes de moeda, tabelas e eixos de gráfico são mascarados (`R$ ••••`). Frases com valores embutidos não são: resumos de gráficos, avisos (ex.: fatura de R$ 2.310,00), textos de alertas, subtítulos e rótulos `aria-label`. Decidir se esses textos devem ser mascarados.
2. **Painéis sem imagem aprovada.** Não existiam imagens de: Cartões > Faturas e Consolidado; Investimentos > Alocação, Evolução (versão em aba) e Movimentações; Importação passos 1, 2 e 4; todos os modais e painéis. Foram derivados de `telas.md`. Dados inventados para eles: faturas de jul e ago/2026 (R$ 2.105,15 e R$ 2.268,40), cinco movimentações de investimentos, listas de modais, chave e códigos do 2FA (fictícios).
3. **Projeção de parcelas.** O gráfico usa meses dez a mai, como na imagem aprovada (meses de vencimento da fatura). Confirmar a convenção.
4. **Botões pequenos no celular.** As imagens mostram botões de 31 px em banners e cartões; os mockups usam 44 px para cumprir o alvo de toque. Isso altera ligeiramente a altura de banners no celular.
5. **Largura intermediária.** Abaixo de 1280 px os blocos empilham e os KPIs ficam em 2 colunas; os pares 7/5 do wireframe só aparecem a partir de 1280 px, para evitar gráficos e valores espremidos. A tela de Alertas só mostra Central e Preferências lado a lado a partir de 1280 px (abaixo, abas).
6. **Itens extras fora das imagens.** Link "Personalizar" no Dashboard (abre o modal de período), "Ver como tabela" sob cada gráfico (alternativa acessível do guia de gráficos), botão flutuante de controles do mockup, `visualizar.html` e `index.html`.
7. **Seleção em lote.** Só existe na tabela (a partir de 768 px). O toque longo do celular previsto em `telas.md` não foi simulado.
8. **Estados sem aplicação.** Login não tem estado vazio e Configurações não tem estado vazio (exibem mensagem informando isso; o login repete o formulário).
9. **Cabeçalho desktop.** O seletor de período aparece em todas as telas desktop, como nas imagens, inclusive onde o período não filtra nada (Contas, Conexões, Categorias).
10. **Contraste.** Os tokens foram copiados literalmente. As tabelas de contraste do design system seguem pendentes de recálculo para o ciano (registro do STATUS de 06/10/2026); não foi feita nova medição.
11. **Sobras de execução.** Não consegui apagar `mockups/_verificacao/` (capturas), `mockups/_gerador/copiar.js` e `mockups/assets/fonts/LEIAME.txt`: comandos de exclusão foram negados pelo ambiente. Remover manualmente antes do commit.
