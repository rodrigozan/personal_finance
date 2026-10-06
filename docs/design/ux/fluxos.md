# Fluxos de Usuário — Painel Financeiro Pessoal

**Etapa:** 1.1 (Sprint 1) — Arquitetura de UX
**Agente:** UX Architect
**Data:** 05/10/2026
**Base:** URS v1.1 seções 4, 5, 7, 8.5 e 9; Plano seção 3.4

Convenções: `[Tela]` indica a tela de origem; `(decisão)` indica ramificação; `{estado}` indica um estado de interface definido em `wireframes.md`; `RF-xxx` rastreia o requisito. Todos os fluxos assumem apenas um usuário (titular).

Lista de fluxos:

1. Login, 2FA e logout
2. Recuperação de senha
3. Conectar instituição (widget Pluggy)
4. Reconectar conexão
5. Categorizar transação e criar regra com aplicação retroativa
6. Importar OFX/CSV com pré-visualização
7. Consultar fatura e parcelas
8. Desconectar instituição (manter ou excluir histórico)
9. Excluir todos os dados
10. Fluxos de apoio (sincronização manual, edição em lote, expiração de sessão)

---

## 1. Login, 2FA e logout

**Objetivo:** acessar o painel com e-mail e senha ou com a conta Google do titular. **Requisitos:** RF-AUT-01, 02, 03, 05, 07; RNF-SEG-06. O login com Google é uma extensão aprovada pelo titular; continua valendo RF-AUT-02 (sem cadastro público).
**Tela:** Login (`/login`).

### 1.1 Caminho principal

1. Titular acessa qualquer URL protegida sem sessão. O middleware redireciona para `/login?retorno={rota}` (RF-AUT-03).
2. [Login] exibe campos E-mail e Senha, botão "Entrar", link "Esqueci minha senha" e, abaixo do separador "ou", o botão "Entrar com Google". Não existe link de cadastro; aviso discreto: "Acesso restrito ao titular." (RF-AUT-02).
3. Titular preenche e aciona "Entrar" (ou Enter). O botão entra em `{carregando}` e os campos ficam `aria-busy`.
4. (decisão) Credenciais válidas?
   - Sim, sem 2FA ativo: redireciona para a rota de retorno ou `/dashboard`.
   - Sim, com 2FA ativo (RF-AUT-07): exibe etapa "Código de verificação" com campo de 6 dígitos (TOTP) e opção "Usar código de recuperação". Código válido leva ao destino; inválido mantém a etapa com erro.
   - Não: exibe `{erro de credencial}`.

### 1.1.1 Caminho alternativo: Entrar com Google

Regras de acesso (a identidade Google nunca cria usuário):

- O cadastro público segue desabilitado (RF-AUT-02). O provedor Google é usado apenas para autenticar um usuário que **já existe** no Supabase Auth (o titular pré-criado). Nenhum usuário novo é criado a partir do Google.
- Critério de autorização: o e-mail devolvido pelo Google deve estar **verificado** e ser **igual ao e-mail do titular** cadastrado. Qualquer outra conta Google é negada.
- Vinculação da identidade: no primeiro login com Google do e-mail do titular, a identidade Google é **vinculada ao usuário existente** (mesmo usuário, mesmos dados, mesmo RLS); não se forma um segundo usuário. Nos acessos seguintes, o Google apenas autentica esse usuário. A vinculação fica visível em Configurações > Segurança ("Entrar com Google: conta vinculada") e pode ser desvinculada (o acesso por e-mail e senha continua).
- Implementação esperada (Sprint 2, a validar): provedor Google habilitado no Supabase Auth com vinculação automática por e-mail verificado e criação de novos usuários desabilitada; a lista de e-mails permitidos fica restrita ao titular. Se a plataforma não impedir a criação, o servidor rejeita o login (sem sessão) e remove o usuário criado.

Passos:

1. Titular aciona "Entrar com Google". O botão entra em `{carregando}` ("Abrindo o Google...") e o formulário de e-mail e senha é desabilitado.
2. O navegador é redirecionado ao Google (fluxo de página inteira, sem pop-up) preservando a rota de retorno.
3. Titular escolhe a conta e autoriza o acesso ao perfil básico (nome e e-mail). O app não pede nenhum outro escopo.
4. (decisão) Retorno do Google:
   - E-mail verificado e igual ao do titular: vincula (primeira vez) ou autentica; segue para a etapa 2FA se ativa (o Google não dispensa o TOTP) e depois para a rota de retorno ou `/dashboard`.
   - Outro e-mail ou e-mail não verificado: nenhuma sessão é criada e o titular volta ao Login com `{acesso negado}`.
   - Titular cancelou na tela do Google: volta ao Login com aviso informativo.
   - Falha do provedor ou da rede: volta ao Login com `{erro}` e opção de tentar novamente ou usar e-mail e senha.

### 1.2 Estados de erro

| Situação | Mensagem (pt-BR) | Comportamento |
|---|---|---|
| Credencial inválida | "E-mail ou senha incorretos." | Mensagem genérica, sem indicar qual campo errou; `role="alert"`; foco vai para o campo E-mail; senha é limpa |
| Campos vazios / e-mail inválido | "Informe um e-mail válido." / "Informe a senha." | Validação inline no envio, `aria-describedby` |
| Muitas tentativas (RNF-SEG-06) | "Muitas tentativas. Tente novamente em {n} minutos." | Botão desabilitado com contagem regressiva textual |
| Falha de rede/servidor | "Não foi possível entrar agora. Verifique sua conexão e tente novamente." | Botão volta ao estado normal; link "Tentar novamente" |
| Código 2FA inválido | "Código incorreto ou expirado." | Campo limpo, foco no campo, contador de tentativas |
| Conta sem permissão (cadastro público desabilitado) | Mesma mensagem de credencial inválida | Nunca revela se o e-mail existe |
| Google: conta não autorizada (e-mail diferente do titular) | "Esta conta Google não tem acesso a este painel. Entre com a conta do titular ou use e-mail e senha." | `role="alert"`; nenhuma sessão criada; nunca exibe nem sugere o e-mail do titular; botões "Tentar com outra conta" e "Entrar com e-mail e senha" |
| Google: e-mail não verificado | "Não foi possível confirmar o e-mail desta conta Google." | Tratado como acesso negado |
| Google: cancelado | "Login com Google cancelado." | Aviso informativo, sem erro |
| Google: falha do provedor, rede ou retorno inválido (estado/CSRF) | "Não foi possível entrar com Google agora. Tente novamente ou use e-mail e senha." | Botão volta ao normal; "Tentar novamente" |
| Google: muitas tentativas (RNF-SEG-06) | Mesma mensagem de bloqueio por tentativas | Botão desabilitado com contagem |

### 1.3 Logout e expiração de sessão (RF-AUT-05)

1. Logout: menu do usuário (desktop) ou drawer "Mais" (celular) > "Sair". Sem confirmação (ação reversível); encerra sessão, limpa dados em cache do cliente e retorna a `/login` com aviso "Você saiu da sua conta."
2. Expiração: ao detectar sessão inválida durante uso, abre modal `{sessão expirada}` com título "Sua sessão expirou", texto "Entre novamente para continuar de onde parou." e botão "Entrar". Dados não salvos de formulários abertos são preservados na memória do cliente quando possível e o retorno leva à mesma rota.
3. Inatividade prolongada não exibe aviso intrusivo; a expiração ocorre na próxima requisição.

```
[Rota protegida] --sem sessão--> [Login] --ok (e-mail/senha ou Google)--> (2FA?) --sim--> [Código] --ok--> [Destino]
                                    |                  `--não-----------------------^
                                    `--erro--> {erro de credencial} --> [Login]
```

---

## 2. Recuperação de senha

**Requisito:** RF-AUT-06. **Telas:** Login (estados `/recuperar-senha` e `/redefinir-senha`).

### 2.1 Caminho principal

1. Em [Login], titular aciona "Esqueci minha senha". Vai para `/recuperar-senha` (mesmo layout de cartão central).
2. Informa o e-mail e aciona "Enviar link de recuperação". Botão em `{carregando}`.
3. Sistema exibe sempre a mesma confirmação, independentemente de o e-mail existir: "Se esse e-mail estiver cadastrado, enviamos um link para redefinir a senha. Verifique também a caixa de spam." Botão secundário "Voltar ao login". Opção "Reenviar" liberada após 60 s com contagem regressiva.
4. Titular abre o e-mail e segue o link. O app abre `/redefinir-senha` com token na URL.
5. (decisão) Token válido?
   - Sim: formulário com "Nova senha" e "Confirmar nova senha", requisitos de senha visíveis e checados em tempo real (mínimo de 12 caracteres, decisão do titular) e botão "Salvar nova senha".
   - Não ou expirado: `{erro}` "Este link expirou ou já foi usado." com botão "Solicitar novo link".
6. Sucesso: mensagem "Senha alterada." e redirecionamento para `/login` com aviso; sessões anteriores são encerradas.

### 2.2 Erros

| Situação | Mensagem | Comportamento |
|---|---|---|
| E-mail em formato inválido | "Informe um e-mail válido." | Validação inline |
| Limite de envios | "Aguarde {n} s para reenviar." | Botão desabilitado |
| Senhas não coincidem | "As senhas não coincidem." | Foco no segundo campo |
| Senha fraca | Lista de requisitos pendentes | Botão desabilitado até atender |
| Falha de rede | "Não foi possível concluir. Tente novamente." | Preserva o que foi digitado |

---

## 3. Conectar instituição (widget Pluggy)

**Requisitos:** RF-CON-01, 02, 03, 06, 08; RF-SYN-03, 10; C01, C03. **Tela:** Conexões (`/conexoes`). **Estados/modais:** `{modal de conexão}`, `{widget Pluggy}`, `{limite atingido}`.

### 3.1 Caminho principal

1. Titular abre [Conexões]. Vê o contador "Conexões: X de 5" (RF-CON-06) e o botão primário "Conectar instituição".
2. (decisão) Limite de 5 atingido? Se sim, o botão fica desabilitado com `aria-disabled` e texto auxiliar "Limite de 5 conexões atingido. Desconecte uma instituição para adicionar outra." (RF-CON-06). Fim do fluxo.
3. Acionar "Conectar instituição" abre o modal `{modal de conexão}` com:
   - Explicação curta: "Você será levado ao ambiente seguro da Pluggy. Suas credenciais bancárias não passam por este aplicativo e o acesso é somente leitura."
   - Lista de dados que serão lidos: contas, transações, cartões, investimentos (RF-CON-08, informado por instituição dentro do widget).
   - Botões "Continuar" e "Cancelar".
4. Ao "Continuar", o cliente solicita um connect token ao servidor (RF-CON-01). Estado `{carregando}` no botão ("Preparando conexão...").
   - Falha na obtenção do token: `{erro}` no modal: "Não foi possível iniciar a conexão. Tente novamente em instantes." com "Tentar novamente".
5. O widget da Pluggy abre sobre a tela (`{widget Pluggy}`), em tela cheia no celular e modal central no desktop. O foco é movido para o widget; `Esc` e botão fechar do widget encerram sem salvar.
6. Titular escolhe a instituição, autentica no ambiente do banco/Pluggy, autoriza o consentimento.
7. (decisão) Resultado do widget:
   - Sucesso: widget devolve `itemId`; o cliente o envia ao servidor, que valida a propriedade e registra a conexão (RF-CON-02). O modal fecha.
   - Cancelado pelo titular: retorna a [Conexões] sem alterações; toast neutro "Conexão cancelada."
   - Erro no widget (credencial inválida, instituição indisponível, MFA expirado): o widget mostra seu próprio erro; ao fechar, o app exibe toast de erro "A conexão não foi concluída. Você pode tentar novamente." e mantém o botão disponível.
8. Retorno a [Conexões]: nova linha da instituição aparece com status `Sincronizando` e barra de progresso (carga inicial, RF-SYN-10). Toast de sucesso "Itaú conectado. Importando seus dados..."
9. Enquanto a carga inicial ocorre, a linha mostra etapas por recurso: Contas, Transações, Cartões, Investimentos (concluídas, em andamento, aguardando). O titular pode sair da tela; o indicador do cabeçalho segue "Sincronizando".
10. Conclusão (via webhook, RF-SYN-01): status passa a `Atualizado`, exibe "Última sincronização: agora", tipos de dados disponíveis (RF-CON-08) e, se algum recurso não for disponibilizado pela instituição, uma nota "Esta instituição não disponibiliza investimentos." (URS 7, Cobertura).
11. Opcionalmente, toast com link "Ver contas".

### 3.2 Estados e erros do fluxo

| Estado | Apresentação |
|---|---|
| Primeira conexão, lista vazia | `{vazio}` em Conexões: explicação, aviso de somente leitura e botão "Conectar instituição" |
| Carga inicial demorada | Barra de progresso indeterminada + texto "Isso pode levar alguns minutos. Pode continuar usando o painel." |
| Carga com falha parcial | Status `Atualizado com ressalvas`: lista quais recursos falharam e botão "Tentar novamente" (RF-SYN-08) |
| Item duplicado (mesma instituição) | Aviso "Você já tem uma conexão com esta instituição." e opção "Ir para a conexão existente" |
| Item não pertence ao titular | Erro "Não foi possível registrar a conexão." (RF-CON-02); sem detalhes técnicos |
| Instituição sem sub-produto desejado | Nota informativa na linha da conexão (RF-CON-08) |

```
[Conexões] -> "Conectar" -> (limite?) --sim--> {limite atingido}
                              `--não--> {modal de conexão} -> token -> {widget Pluggy}
   {widget} --sucesso--> registrar item -> linha "Sincronizando" -> "Atualizado"
   {widget} --cancelar/erro--> toast -> [Conexões]
```

---

## 4. Reconectar conexão

**Requisitos:** RF-CON-03, 04, 07; RF-SYN-08; RN-13. **Tela:** Conexões; alertas e cabeçalho como pontos de entrada.

### 4.1 Pontos de entrada

| Origem | Gatilho | Destino |
|---|---|---|
| Indicador de sincronização (cabeçalho) | Estado Atenção ou Erro | Conexões, linha destacada |
| Popover do indicador | Botão "Reconectar" ao lado da conexão | Inicia diretamente o widget em modo atualização |
| Central de Alertas | Alerta "Conexão com erro" ou "Consentimento a expirar" | Conexões, linha destacada |
| Dashboard | Faixa de aviso quando houver conexão com problema | Conexões |

### 4.2 Caminho principal

1. Em [Conexões], a linha da instituição mostra o status, a mensagem de erro em linguagem simples e a data da última sincronização bem-sucedida. Exemplos:
   - `Erro de login` — "As credenciais mudaram. Reconecte para continuar atualizando."
   - `Aguardando ação` — "O banco pediu uma confirmação adicional (código/aprovação no app)."
   - `Consentimento a vencer` — "Seu consentimento vence em 12 dias. Renove para não perder atualizações." (RF-CON-07)
   - `Consentimento expirado` — "Seu consentimento expirou. Renove para voltar a sincronizar."
   - `Falha de sincronização` — "Tentamos 5 vezes sem sucesso. Reprocesse ou reconecte." (RN-13)
2. Titular aciona "Reconectar" (primário na linha). Abre o modal `{modal de conexão}` em modo atualização: mostra a instituição e explica o que será renovado.
3. Cliente pede um connect token vinculado ao item existente; abre o `{widget Pluggy}` em modo atualização.
4. (decisão) Resultado:
   - Sucesso: item retoma; linha vai para `Sincronizando`, depois `Atualizado`. Alerta correspondente é marcado como resolvido. Toast "Itaú reconectado."
   - Cancelado: sem alterações.
   - Erro persistente: linha mantém o erro; toast "Não foi possível reconectar. Tente novamente ou fale com o suporte da instituição."
5. Alternativa "Reprocessar" (somente para falha de sincronização sem problema de credencial, RN-13): reexecuta a sincronização sem o widget; `{carregando}` na linha, com resultado em toast.

### 4.3 Estados do status da conexão (mapeamento visual)

Mapeamento interno de status (URS 7, Tratamento de erros) para rótulo, ícone, severidade e ação primária.

| Status interno | Rótulo | Severidade | Ação primária |
|---|---|---|---|
| Atualizado | Atualizado | Sucesso | Sincronizar |
| Atualizando | Sincronizando | Informação | Nenhuma (progresso) |
| Desatualizado | Desatualizado | Alerta | Sincronizar |
| Erro de login | Erro de login | Erro | Reconectar |
| Aguardando ação do usuário | Ação necessária | Alerta | Reconectar |
| Consentimento a vencer | Vence em {n} dias | Alerta | Renovar |
| Consentimento expirado | Consentimento expirado | Erro | Renovar |
| Falha após 5 tentativas | Falha de sincronização | Erro | Reprocessar |

---

## 5. Categorizar transação e criar regra com aplicação retroativa

**Requisitos:** RF-TRX-03, 07; RF-CAT-02, 04, 05, 06; RN-05, RN-10. **Telas:** Transações (principal), Categorias e regras.

### 5.1 Caminho A: recategorizar uma transação

1. Em [Transações], titular seleciona a linha (ou toca no cartão da transação). Abre o painel de detalhe `{detalhe de transação}`.
2. No painel, altera a categoria usando um seletor pesquisável com hierarquia (categoria > subcategoria). Pode também editar descrição amigável, notas e tags (RF-TRX-03). O dado original da origem fica visível e somente leitura.
3. Ao salvar uma categoria diferente da atual, o sistema abre o diálogo `{criar regra}` (RF-CAT-05): "Quer aplicar a mesma categoria a outras transações parecidas?"
   - Resumo: "Descrição contém `UBER *TRIP`" (condição sugerida a partir da descrição original; editável).
   - Contador ao vivo: "Encontramos 18 transações anteriores com essa descrição."
   - Opções:
     - `( ) Apenas esta transação` (padrão ao fechar sem escolher).
     - `( ) Criar regra para as próximas transações`.
     - `(•) Criar regra e aplicar às 18 transações existentes` (aplicação retroativa).
   - Campos avançados recolhidos: condição (contém/igual), faixa de valor, conta/cartão, prioridade.
   - Botões "Confirmar" e "Só esta transação".
4. (decisão) Escolha:
   - Apenas esta: salva e fecha. Toast "Categoria atualizada."
   - Criar regra: salva a regra com prioridade padrão; toast "Regra criada. Será aplicada às próximas transações." com ação "Ver regra".
   - Criar regra e aplicar: abre pré-visualização `{prévia de aplicação}` listando até 10 amostras e o total. Confirmar executa; barra de progresso se houver muitas; ao concluir: toast "Regra criada e aplicada a 18 transações." com ação "Desfazer" por 10 s.
5. Edições manuais anteriores do titular nunca são sobrescritas pela aplicação retroativa; transações já editadas manualmente aparecem como "Ignoradas por terem edição manual: N" no resumo (RN-05).

### 5.2 Caminho B: categorizar em lote (RF-TRX-07)

1. Em [Transações], titular marca checkboxes de várias linhas. No celular, pressiona e segura uma linha para entrar no modo de seleção.
2. Barra de ação contextual surge fixa: "N selecionadas" + "Categoria", "Tags", "Marcar como interna", "Ignorar", "Limpar seleção".
3. "Categoria" abre `{edição em lote}` com seletor de categoria e prévia "N transações serão alteradas". "Aplicar" salva; toast com "Desfazer".
4. O diálogo de criação de regra também pode ser oferecido ao final se as transações compartilharem um padrão ("Criar regra com base nestas?"), opcional.
5. Seleção "todas as {total} do filtro atual" é oferecida quando todas as linhas da página estão marcadas, com confirmação explícita do total.

### 5.3 Caminho C: criar regra diretamente em Categorias e regras

1. Em [Categorias e regras] > aba Regras, titular aciona "Nova regra".
2. Modal `{nova regra}`: condições (descrição contém/igual, valor entre, conta, cartão), categoria de destino, prioridade, ativa/inativa, caixa "Aplicar às transações existentes".
3. Pré-visualização ao vivo do número de transações afetadas.
4. Salvar; resolução de conflitos exibida em texto: "Esta regra tem prioridade 3. Em empate, vale a mais específica." (RN-10).
5. A lista de regras mostra ordem de precedência e permite reordenar por arrastar (com alternativa por botões "Subir/Descer" para teclado).

### 5.4 Erros e estados

| Situação | Tratamento |
|---|---|
| Nenhuma transação similar encontrada | Diálogo omite a opção retroativa e mostra "Nenhuma transação anterior parecida." |
| Conflito com regra existente | Aviso "Já existe a regra '{nome}' para esta descrição. Editar a existente ou criar nova com prioridade maior?" |
| Falha ao salvar | Toast de erro; alteração mantida no painel para nova tentativa |
| Aplicação retroativa interrompida | Mensagem com quantas foram aplicadas; botão "Continuar" |
| Categoria arquivada escolhida | Não listada em seletores; aparece em transações antigas com rótulo "(arquivada)" |

---

## 6. Importar OFX/CSV com pré-visualização

**Requisitos:** RF-IMP-01 a 04; RF-TRX-05; RN-01, RN-06; C05. **Tela:** Importação (`/importacao`).

### 6.1 Passos (stepper)

**Passo 1 — Arquivo**
1. Titular escolhe a conta ou cartão de destino (seletor) e arrasta ou seleciona um arquivo `.ofx` ou `.csv` (campo acessível por teclado e botão "Selecionar arquivo").
2. Validações imediatas: formato aceito, tamanho máximo de 20 MB (decisão do titular; a plataforma serverless deve ser validada na Sprint 8, pois o limite de corpo de requisição pode ser menor e exigir envio direto ao armazenamento), arquivo não vazio. Erros listados abaixo do campo.
3. Tipo detectado automaticamente (OFX/CSV); mostra "Arquivo: extrato.ofx, 128 lançamentos detectados" quando possível.

**Passo 2 — Mapeamento (apenas CSV)**
1. Mostra as 5 primeiras linhas do arquivo e, acima de cada coluna, um seletor de campo: Data, Descrição, Valor, Débito, Crédito, Saldo, Ignorar.
2. Opções de formato: separador (`;`, `,`, tabulação), codificação, formato de data (dd/MM/aaaa, aaaa-MM-dd), separador decimal (vírgula ou ponto) e convenção de sinal (valor com sinal, colunas débito/crédito, sinal invertido) alinhada a RN-01.
3. Sugestão automática de mapeamento com selo "Sugerido"; mapeamento salvo para a próxima importação do mesmo layout (opcional).
4. Botão "Continuar" só habilita com Data, Descrição e Valor (ou Débito/Crédito) mapeados.

**Passo 3 — Pré-visualização (RF-IMP-02, RF-IMP-03)**
1. Tabela com todos os lançamentos interpretados, valores já normalizados (receitas positivas, despesas negativas) e coluna de situação:
   - `Nova` (será importada)
   - `Duplicada` (já existe por data, valor e descrição; desmarcada por padrão)
   - `Duplicada no arquivo` (repetida dentro do próprio arquivo)
   - `Com erro` (data ou valor inválidos; linha explicada)
2. Resumo no topo: "128 lidos: 112 novas, 14 duplicadas, 2 com erro. Total a importar: R$ 8.431,20 em receitas e -R$ 6.002,77 em despesas."
3. Filtros rápidos por situação; alternar inclusão linha a linha; "Incluir duplicadas" como caixa global, desligada por padrão.
4. Categoria sugerida pelas regras do usuário é exibida por linha (editável antes de importar). Linhas com erro são exportáveis para correção.
5. Nada é gravado neste passo.

**Passo 4 — Confirmação**
1. Resumo final e botão primário "Importar N lançamentos". Texto: "Os lançamentos serão adicionados à conta Itaú Corrente com origem Importação. Você poderá desfazer este lote depois."
2. `{carregando}` com barra de progresso. Ao concluir: tela de sucesso com "N lançamentos importados, M ignorados" e ações "Ver transações importadas" e "Importar outro arquivo".

### 6.2 Lotes e desfazer (RF-IMP-04)

1. Aba "Lotes" lista cada importação: arquivo, data, formato, destino, quantidade, status (Ativo, Desfeito).
2. "Desfazer lote" abre confirmação: "Remover os 112 lançamentos deste lote? Edições feitas neles (categorias, notas) também serão removidas. Esta ação não afeta transações vindas do Open Finance." Botão destrutivo "Desfazer lote".
3. Lote desfeito permanece listado com data de desfazimento; não pode ser reativado (é preciso reimportar).

### 6.3 Erros e estados

| Situação | Mensagem / comportamento |
|---|---|
| Formato não suportado | "Formato não suportado. Envie um arquivo .ofx ou .csv." |
| Arquivo ilegível ou corrompido | "Não conseguimos ler este arquivo. Verifique se é um extrato exportado do banco." |
| Mapeamento incompleto | Botão "Continuar" desabilitado e lista do que falta |
| Todas as linhas duplicadas | Aviso "Todos os lançamentos já existem. Nada para importar." e botão "Voltar" |
| Falha durante a gravação | "A importação falhou. Nenhum lançamento foi adicionado." (operação atômica); botão "Tentar novamente" |
| Sem lotes | `{vazio}` na aba Lotes |

```
[Arquivo] -> [Mapeamento (CSV)] -> [Pré-visualização] -> [Confirmação] -> sucesso -> [Lotes]
   OFX pula Mapeamento ^                  |                                    `--> desfazer lote
```

---

## 7. Consultar fatura e parcelas

**Requisitos:** RF-CAR-01 a 07; RN-02, RN-03, RN-04. **Tela:** Cartões (`/cartoes`, `/cartoes/{id}`).

### 7.1 Caminho principal

1. Titular abre [Cartões]. Vê a lista de cartões com nome, instituição, final, limite total, limite disponível (barra de uso), dia de fechamento e vencimento (RF-CAR-01), valor da fatura atual e selo de vencimento próximo quando aplicável (RF-CAR-07).
2. Seleciona um cartão. A tela mostra a aba **Fatura atual** (padrão):
   - Cabeçalho da fatura: período, data de fechamento, data de vencimento, valor total, valor mínimo, status (Aberta, Fechada, Paga, Vencida), contagem de dias até o vencimento.
   - Lista de compras da fatura com data, estabelecimento, categoria, valor e, para parcelas, rótulo "3/10" mais o vínculo à compra original (RN-04).
   - Observação fixa: "Pagamento da fatura não conta como despesa; as compras já foram contabilizadas." (RF-CAR-06, RN-03).
3. Aba **Faturas**: seletor/linha do tempo com faturas futuras, atual e fechadas (RF-CAR-02), cada uma com valor e status. Selecionar uma fatura carrega suas compras.
4. Ao tocar numa compra parcelada, abre painel `{detalhe de compra parcelada}`: valor total da compra, parcela atual/total, valor da parcela, parcelas pagas e restantes, calendário das próximas parcelas com mês de cada fatura.
5. Aba **Parcelas e projeção** (RF-CAR-04): gráfico/tabela por mês dos valores de parcelas já comprometidas para os próximos meses, com total comprometido e lista expansível das compras que compõem cada mês.
6. Aba **Consolidado** (RF-CAR-05): gasto por cartão, por categoria e por período, com seletor de período. Drill-down leva a [Transações] com filtros aplicados.
7. Alternativa de entrada: no [Dashboard], card "Faturas a vencer" leva diretamente à fatura do cartão em `/cartoes/{id}`.

### 7.2 Regras de interação

| Regra | Descrição |
|---|---|
| Conferência com o banco | O valor total da fatura é exibido junto de "Atualizado em {data/hora}" para o titular confrontar com o app do banco (aceite da Fase 3) |
| Status por cor e texto | Aberta (neutro), Fechada (informação), Paga (sucesso), Vencida (erro); nunca só cor |
| Fatura futura | Marcada como "Projetada" quando composta apenas por parcelas |
| Cartão sem faturas | `{vazio}` "Nenhuma fatura disponível para este cartão ainda." |
| Instituição sem dados de cartão | Nota "Esta instituição não disponibiliza dados de cartão." com link para Conexões |
| Erro ao carregar fatura | `{erro}` no bloco, com "Tentar novamente"; demais blocos permanecem funcionais |

```
[Cartões] -> seleciona cartão -> Fatura atual -> compra parcelada -> {detalhe de compra parcelada}
                 |-> Faturas (futura/fechada)
                 |-> Parcelas e projeção
                 `-> Consolidado -> drill-down -> [Transações filtradas]
```

---

## 8. Desconectar instituição (manter ou excluir histórico)

**Requisitos:** RF-CON-05; RNF-LGPD-03; RN-12. **Tela:** Conexões. **Modais:** `{confirmar desconexão}`, `{confirmar exclusão do histórico}`.

### 8.1 Caminho principal

1. Em [Conexões], menu da linha (`...`) > "Desconectar". Ação nunca é o botão primário da linha.
2. Abre `{confirmar desconexão}` com título "Desconectar {instituição}?" e o texto: "O painel deixará de receber novos dados desta instituição e o consentimento no Open Finance será revogado. Nenhum dinheiro é movimentado."
3. Duas opções, mutuamente exclusivas, sem padrão pré-selecionado destrutivo (a opção segura vem marcada):
   - `(•) Manter histórico` — "Contas, transações, faturas e investimentos já importados permanecem no painel e continuam nos relatórios. Ficam marcados como 'conexão encerrada'."
   - `( ) Excluir histórico` — "Remove também todos os dados importados desta instituição (N contas, N transações, N cartões, N investimentos). Não é possível desfazer."
4. Resumo de impacto, calculado: "Esta conexão tem 2 contas e 1.340 transações."
5. (decisão) Opção escolhida:
   - Manter: botão "Desconectar e manter histórico" (estilo de atenção) executa diretamente.
   - Excluir: botão muda para "Desconectar e excluir histórico" (estilo perigo) e abre segunda confirmação `{confirmar exclusão do histórico}`: pedir digitação do nome da instituição ("Digite Itaú para confirmar") habilita o botão final.
6. Execução em `{carregando}`: "Revogando consentimento..." e depois "Removendo dados..." quando aplicável.
7. Conclusão: linha some (excluir) ou muda para status `Desconectada` com rótulo "histórico mantido" e ação "Reconectar" (manter). O contador "X de 5" é atualizado imediatamente. Toast "Itaú desconectado. Histórico mantido." / "Itaú desconectado e dados excluídos."

### 8.2 Efeitos colaterais comunicados ao titular

| Efeito | Comunicação |
|---|---|
| Alertas relacionados à conexão | Marcados como resolvidos |
| Totais do dashboard | Ao manter, contas continuam entrando no consolidado salvo se o titular as ocultar (RF-CTA-03); ao excluir, deixam de aparecer |
| Regras e categorias do usuário | Preservadas |
| Transações manuais e importadas ligadas à instituição | Preservadas, conforme escolha de histórico (a origem manual é independente) |
| Slot de conexão | Liberado na hora (RF-CON-06) |

### 8.3 Erros

| Situação | Tratamento |
|---|---|
| Falha ao revogar consentimento na Pluggy | "Não conseguimos revogar o consentimento agora. Nada foi alterado." com "Tentar novamente"; dados locais intactos |
| Revogação OK, falha ao excluir dados | "Conexão encerrada, mas a exclusão do histórico não terminou. Tentar novamente." (estado persistido e retomável) |
| Conexão em sincronização | Aviso "Há uma sincronização em andamento. Será cancelada." com confirmação extra |

---

## 9. Excluir todos os dados

**Requisitos:** RF-CFG-04; RNF-LGPD-02, RNF-LGPD-03; RF-REL-03. **Tela:** Configurações > Dados e privacidade. **Modais:** `{exclusão total}`.

### 9.1 Caminho principal

1. Em [Configurações], seção "Dados e privacidade", zona de perigo isolada visualmente ("Zona de perigo") no fim da página, com duas ações: "Exportar todos os dados" e "Excluir todos os dados".
2. Antes da exclusão, o sistema recomenda exportar: card "Recomendado: exporte seus dados antes" com botão "Exportar todos os dados (JSON/CSV)" (RF-REL-03).
3. Acionar "Excluir todos os dados" abre `{exclusão total}`, em três etapas dentro do mesmo modal:
   - **Etapa 1 — O que será removido.** Lista com contagens: conexões (revogadas), contas, cartões, faturas, transações, categorias e regras, orçamento e metas, recorrências, alertas, importações e preferências. Texto: "A exclusão é permanente e não pode ser desfeita. Seu acesso (e-mail e senha) será mantido."
   - **Etapa 2 — Escolha.** Duas opções: "Excluir dados e manter minha conta de acesso" (padrão) e "Excluir dados e encerrar minha conta" (aprovado pelo titular: remove a conta de acesso, os vínculos e a sessão).
   - **Etapa 3 — Confirmação reforçada.** Reautenticação com senha e digitação da frase "EXCLUIR TUDO". O botão "Excluir tudo permanentemente" só habilita quando ambos estiverem corretos.
4. Execução em `{carregando}` com etapas: "Revogando conexões", "Excluindo dados", "Concluindo". Não permite fechar o modal por clique externo durante a execução.
5. Conclusão: se a conta foi mantida, o titular vai para `/dashboard` em estado vazio inicial (sem conexões) com toast "Todos os dados foram excluídos." Se encerrou a conta, vai para `/login` com aviso.

### 9.2 Erros

| Situação | Tratamento |
|---|---|
| Senha incorreta na reautenticação | "Senha incorreta." sem avançar |
| Falha parcial na revogação | Lista conexões não revogadas e botão "Tentar novamente"; nada é excluído enquanto houver revogação pendente, para evitar dados órfãos de consentimento ativo |
| Falha durante a exclusão | Estado retomável; mensagem "A exclusão não foi concluída. Tente novamente." |
| Perda de rede | Mantém o modal aberto; ao reconectar, oferece "Verificar andamento" |

```
[Configurações] -> Dados e privacidade -> (exportar?) -> {exclusão total}
   Etapa 1 (impacto) -> Etapa 2 (escolha) -> Etapa 3 (senha + frase) -> executar -> [Dashboard vazio | Login]
```

---

## 10. Fluxos de apoio

### 10.1 Sincronização manual com progresso (RF-SYN-05, RF-SYN-07)

1. Pontos de entrada: botão "Sincronizar tudo" no cabeçalho (global) e "Sincronizar" na linha de cada conexão (por conexão).
2. Ao acionar, o indicador do cabeçalho passa a "Sincronizando... 1 de 4" e a linha da conexão mostra barra de progresso com a etapa atual (Contas, Transações, Cartões, Investimentos).
3. Botões ficam desabilitados com `aria-busy` enquanto a sincronização roda; é possível navegar para outras telas.
4. Término: toast "Sincronização concluída. 23 novas transações." ou erro com ação "Ver detalhes". Resultado gravado em Histórico de sincronizações (início, fim, itens processados, erros), exibido em Conexões, seção Histórico.
5. Falha de uma conexão não interrompe as demais (RNF-DIS-03): o resumo informa "3 de 4 concluídas; 1 com erro".
6. Quando houver sincronização já em andamento, o botão é substituído por "Sincronizando...".

### 10.2 Criar transação manual (RF-TRX-05)

1. [Transações] > "Nova transação" abre painel `{nova transação}`: tipo (receita, despesa, transferência), valor, data, conta ou cartão, descrição, categoria, tags, notas.
2. Transações manuais exibem selo "Manual" e são as únicas com opção "Excluir" (confirmação simples).
3. Dividir em categorias (RF-TRX-06): no detalhe, "Dividir" mostra linhas categoria + valor com contador "Restante: R$ 0,00"; só salva quando a soma é igual ao valor total.

### 10.3 Marcar como interna ou ignorar (RF-TRX-04, RF-TRX-08)

1. No detalhe, interruptores "Transferência interna" e "Ignorar nos cálculos", cada um com texto explicativo do efeito em receitas/despesas.
2. Quando o sistema detecta automaticamente (RF-TRX-08), a linha exibe selo "Interna (detectada)" e permite "Não é interna" para reverter; a decisão do titular prevalece (RN-05).

### 10.4 Orçamento: copiar mês anterior (RF-ORC-03)

1. [Orçamento e metas] > "Copiar do mês anterior" abre confirmação com a pré-visualização dos valores que serão preenchidos e aviso "Valores já definidos neste mês serão substituídos".
2. Confirmar aplica; toast com "Desfazer".

### 10.5 Recorrências detectadas (RF-REC-01, RF-REC-02)

1. Aba "Detectadas": cada card traz estabelecimento, valor estimado, periodicidade, última ocorrência e confiança; ações "Confirmar", "Editar" e "Descartar".
2. Confirmar move para "Ativas" e passa a compor a projeção; descartar remove da lista e evita nova sugestão idêntica.

### 10.6 Alertas (RF-ALR-01 a 03)

1. Alerta chega à Central e incrementa o sino. Cada alerta tem tipo, mensagem, data e ação de destino (ex.: "Ver fatura").
2. Marcar como lido individual ou em massa. Aba "Preferências": interruptor por tipo, campos de limite (ex.: percentual do orçamento, dias antes do vencimento, valor de gasto atípico) e interruptor "Receber também por e-mail".

### 10.7 Exportações (RF-REL-02, RF-REL-03)

1. Relatórios > aba Exportações: "Exportar transações filtradas (CSV)" reaproveita os filtros da última visão de Transações ou permite redefini-los ali; mostra contagem prévia de linhas.
2. "Exportar todos os dados" gera JSON ou CSV em arquivo; estado `{carregando}` com texto "Preparando arquivo..." e download automático; aviso de que o arquivo contém dados financeiros sensíveis.

### 10.8 Primeira utilização

1. Primeiro login: Dashboard em estado vazio com card de boas-vindas em três passos: "1. Conecte uma instituição", "2. Aguarde a primeira sincronização", "3. Organize suas categorias". Alternativa: "Prefere importar um extrato? Importar OFX/CSV" (C05).
2. Sem dados, as demais telas mostram `{vazio}` com a ação equivalente.

---

### 10.9 Ocultar valores (aprovado)

1. Botão com ícone de olho no cabeçalho (celular e desktop) e no drawer "Mais"; `aria-pressed` indica o estado.
2. Ao ativar, todos os valores em R$ de todas as telas viram `R$ ••••` e gráficos exibem barras sem rótulos de valor; o estado vale até ser desativado.
3. A preferência "Ocultar valores por padrão" (Configurações > Aparência) define o estado inicial ao abrir o painel.
4. Exportações e relatórios impressos não são mascarados; o app avisa "Os valores aparecerão no arquivo" antes de exportar quando o modo estiver ativo.

### 10.10 Exportar relatório mensal em PDF ou imprimir (aprovado)

1. [Relatórios] > Relatório mensal > "Exportar PDF" ou "Imprimir".
2. O app aplica o tema claro e o layout de impressão (A4 retrato, sem menu); mostra "Preparando arquivo..." e inicia o download ou abre o diálogo de impressão do navegador.
3. Falha: toast "Não foi possível gerar o PDF." com "Tentar novamente".

### 10.11 Códigos de recuperação do 2FA (aprovado)

1. Ao ativar o 2FA, o app exibe 8 códigos de uso único uma única vez, com copiar, baixar e imprimir, e exige marcar "Guardei meus códigos".
2. No login, "Usar código de recuperação" aceita um código; cada código vale uma vez e o app informa quantos restam.
3. "Gerar novos códigos" em Configurações > Segurança exige a senha atual e invalida os anteriores.

## 11. Matriz de rastreabilidade: fluxo x requisitos

| Fluxo | Requisitos cobertos |
|---|---|
| 1. Login, 2FA, logout | RF-AUT-01, 02, 03, 04, 05, 07; RNF-SEG-06 |
| 2. Recuperação de senha | RF-AUT-06 |
| 3. Conectar instituição | RF-CON-01, 02, 03, 06, 08; RF-SYN-01, 03, 10; C01, C03 |
| 4. Reconectar | RF-CON-03, 04, 07; RF-SYN-08; RN-13 |
| 5. Categorizar e criar regra | RF-TRX-03, 07; RF-CAT-02, 04, 05, 06; RN-05, RN-10 |
| 6. Importar OFX/CSV | RF-IMP-01 a 04; RN-01, RN-06 |
| 7. Fatura e parcelas | RF-CAR-01 a 07; RN-02, RN-03, RN-04 |
| 8. Desconectar | RF-CON-05, RF-CON-06; RNF-LGPD-03 |
| 9. Excluir todos os dados | RF-CFG-04; RNF-LGPD-02, 03 |
| 10. Apoio | RF-SYN-05, 07; RF-AUT-07; RF-TRX-04, 05, 06, 08; RF-ORC-03; RF-REC-01, 02; RF-ALR-01 a 03; RF-REL-02, 03 |

---

## 12. Decisões do titular e pontos ainda em aberto

### 12.1 Decisões aplicadas (05/10/2026)

| # | Tema | Decisão |
|---|---|---|
| F1 | Política de senha | Mínimo de 12 caracteres |
| F1b | Login com Google | Aprovado; só o e-mail do titular; sem cadastro; vinculação ao usuário existente e mensagem de acesso negado definidas na seção 1.1.1 |
| F2 | Tamanho máximo do arquivo de importação | 20 MB |
| F3 | Exclusão total: encerrar a conta de acesso | Aprovado como opção (padrão: manter o acesso) |
| F4 | Limiar de "Desatualizado" | 36 h |
| F5 | Códigos de recuperação do 2FA | Aprovados (8 códigos de uso único; gerar novos em Configurações > Segurança) |

### 12.2 Pontos ainda em aberto

| # | Tema | Situação |
|---|---|---|
| F6 | "Desfazer" por toast em aplicações em lote | UX assume janela de 10 s; exige suporte no backend (Sprint 4) |
| F7 | Vinculação do Google no Supabase | Validar na Sprint 2 se a plataforma permite bloquear criação de novos usuários via provedor; caso contrário, rejeição no servidor (seção 1.1.1) |
| F8 | Upload de 20 MB em ambiente serverless | Validar limite de corpo de requisição da Vercel; se necessário, envio direto ao armazenamento (Sprint 8) |
