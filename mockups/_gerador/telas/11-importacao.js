const H = require('../lib/h');
const { D, ic, m, brl, btn, banner, card, field, select, radio, check, dlg, seg, tabs, badge, catBadge, sk, skRows, skTable, loadingWrap, errorState, emptyCard, esc, progress } = H;

const linhas = [
  { d: '31/08/2026', desc: 'PIX RECEB. LUCAS FERREIRA', v: 1200.0, cat: D.cat.freelance, sit: 'nova' },
  { d: '31/08/2026', desc: 'NETFLIX.COM', v: -55.9, cat: D.cat.assinaturas, sit: 'nova' },
  { d: '30/08/2026', desc: 'PADARIA ESTRELA DO SUL', v: -24.5, cat: D.cat.alimentacao, sit: 'nova' },
  { d: '29/08/2026', desc: 'UBER *TRIP', v: -18.4, cat: D.cat.transporte, sit: 'dup' },
  { d: '29/08/2026', desc: 'SUPERMERCADO ATACADÃO', v: -312.77, cat: D.cat.alimentacao, sit: 'nova' },
  { d: '28/08/2026', desc: 'FARMACIA PAGUE MENOS', v: -89.9, cat: D.cat.saude, sit: 'nova' },
  { d: '28/08/2026', desc: 'PIX ENVIADO MARIA SOUZA', v: -150.0, cat: null, sit: 'nova' },
  { d: '31/02/2026', desc: 'PAGTO BOLETO DIVERSOS', v: -240.0, cat: null, sit: 'erro', msg: 'Data inválida' },
  { d: '27/08/2026', desc: 'SPOTIFY', v: -21.9, cat: D.cat.assinaturas, sit: 'dup' },
  { d: '26/08/2026', desc: 'POSTO IPIRANGA', v: -180.0, cat: null, sit: 'nova', c2: D.cat.transporte },
];

const lotes = [
  { arq: 'extrato-inter-set-2026.ofx', data: '02/10/2026', dest: 'Inter Conta Digital', fmt: 'OFX', qtd: 112, st: 'ativo' },
  { arq: 'fatura-nubank-ago-2026.csv', data: '03/09/2026', dest: 'Nubank •4821', fmt: 'CSV', qtd: 64, st: 'ativo' },
  { arq: 'extrato-inter-jul-2026.csv', data: '05/08/2026', dest: 'Inter Conta Digital', fmt: 'CSV', qtd: 41, st: 'desfeito' },
];

const sit = (s) => (s === 'nova' ? badge('Nova', 'ok', 'circleCheck') : s === 'dup' ? badge('Duplicada', 'neutral', 'copy') : badge('Erro', 'error', 'octAlert'));
const loteB = (s) => (s === 'ativo' ? badge('Ativo', 'ok', 'circleCheck') : badge('Desfeito', 'neutral', 'circleX'));
const val = (r) => m(r.v, { kind: r.v > 0 ? 'income' : 'expense', sign: r.v > 0 ? 'plus' : 'auto' });
const catOf = (r) => (r.cat ? catBadge(r.cat) : r.c2 ? catBadge(r.c2) : '<span class="muted small">Sem categoria</span>');

const steps = ['Arquivo', 'Mapeamento', 'Pré-visualização', 'Confirmação'];

const stepper = () => `<ol class="stepper" data-stepper>${steps.map((s, i) => `<li data-n="${i + 1}"><span class="stepper__c">${ic('check', 16)}<span>${i + 1}</span></span><span class="stepper__l">${s}</span></li>`).join('')}</ol><div class="step-m"><p><strong>Passo <span data-step-n>3</span> de 4 · <span data-step-name>Pré-visualização</span></strong></p><div class="segbar segbar--thin">${[1, 2, 3, 4].map((i) => `<span data-n="${i}"></span>`).join('')}</div></div>`;

const foot = (back, next, nextLabel = 'Continuar') => `<div class="step-foot">${btn('Cancelar', { v: 'ghost', cls: 'only-l-inline' })}<span class="step-foot__sp"></span>${back ? btn('Voltar', { v: 'secondary', attrs: `data-step-go="${back}"`, cls: 'only-l-inline' }) : ''}${btn(nextLabel, { v: 'primary', attrs: `data-step-go="${next}"` })}</div>`;

const p1 = () => `<div class="stack">${select('Destino', ['Inter Conta Digital', 'Itaú Corrente', 'Nubank •4821'], { value: 'Inter Conta Digital' })}<div class="dropzone"><div class="dropzone__i">${ic('upload', 40)}</div><p><strong>Arraste o arquivo aqui</strong><span class="only-s"> ou selecione</span></p>${btn('Selecionar arquivo', { v: 'secondary' })}<p class="muted small">.ofx ou .csv · até 20 MB</p></div>${banner('info', 'Importação é um complemento. Prefira conectar a instituição para manter tudo sincronizado.')}${foot(0, 2)}</div>`;

const p2 = () => `<div class="stack"><p class="muted">extrato-inter-ago-2026.csv · ${ic('circleCheck', 16)} Sugerido automaticamente</p><div class="map-grid">${[['Coluna 1', 'Data', '31/08/2026'], ['Coluna 2', 'Descrição', 'PIX RECEB. LUCAS FERREIRA'], ['Coluna 3', 'Valor', '1.200,00'], ['Coluna 4', 'Ignorar', 'Saldo parcial']].map((c, i) => `<div class="map-item"><p class="muted small">${c[0]} (amostra: <span class="mono">${c[2]}</span>)</p>${select('Campo da ' + c[0], ['Data', 'Descrição', 'Valor', 'Ignorar'], { value: c[1], id: 'map' + i, hideLabel: true })}</div>`).join('')}</div><div class="form-grid">${select('Separador', ['Ponto e vírgula (;)', 'Vírgula (,)'], { value: 'Ponto e vírgula (;)' })}${select('Formato de data', ['dd/mm/aaaa', 'aaaa-mm-dd'], { value: 'dd/mm/aaaa' })}</div><fieldset class="radio-set"><legend>Valores</legend>${radio('modo', 'Despesas negativas e receitas positivas', true)}${radio('modo', 'Coluna separada para débito e crédito', false)}</fieldset>${foot(1, 3)}</div>`;

function p3() {
  const sum = [['86', 'Lidos', 'fileText', ''], ['71', 'Novas', 'circleCheck', 'ok'], ['13', 'Duplicadas', 'copy', ''], ['2', 'Com erro', 'octAlert', 'err']];
  const rowsT = linhas.map((r) => `<tr><td class="col-sel">${check('Incluir ' + r.desc, r.sit === 'nova', { hide: true })}</td><td class="tnum${r.sit === 'erro' ? ' err-t' : ''}">${r.d}</td><td${r.sit === 'dup' ? ' class="muted"' : ''}>${esc(r.desc)}</td><td class="num">${val(r)}</td><td>${catOf(r)}</td><td>${sit(r.sit)}${r.msg ? ` <span class="err-t small">${r.msg}</span>` : ''}</td></tr>`).join('');
  const rowsM = linhas.slice(0, 6).map((r) => `<li class="imp"><span class="imp__ck">${check('Incluir ' + r.desc, r.sit === 'nova', { hide: true })}</span><div class="imp__b"><div class="imp__top"><span class="imp__d${r.sit === 'dup' ? ' muted' : ''}">${esc(r.desc)}</span>${val(r)}</div><div class="imp__m"><span class="muted small tnum${r.sit === 'erro' ? ' err-t' : ''}">${r.d}</span>${catOf(r)}</div><div>${sit(r.sit)}${r.msg ? `<p class="err-t small">${r.msg}</p>` : ''}</div></div></li>`).join('');
  return `<div class="stack"><p class="file-line"><strong>extrato-inter-ago-2026.csv</strong><span class="muted"> · destino: Inter Conta Digital · 86 linhas lidas</span></p>
<div class="imp-sum">${sum.map((s) => `<div class="imp-sum__i imp-sum__i--${s[3]}">${ic(s[2], 18)}<strong class="tnum">${s[0]}</strong><span class="muted">${s[1].toLowerCase()}</span></div>`).join('')}<div class="imp-sum__t"><span class="muted small">A importar</span><span>${m(4120, { kind: 'income', sign: 'plus' })} <span class="sep">/</span> ${m(-2386.17, { kind: 'expense' })}</span></div></div>
<div class="imp-filter">${seg('Filtrar linhas', [['Todas', 'Todas (86)'], ['Novas', 'Novas (71)'], ['Dupl.', 'Duplicadas (13)'], ['Erro', 'Com erro (2)']], 0)}<span class="only-l">${check('Incluir duplicadas', false)}</span></div>
<div class="only-l"><div class="c-card c-card--flush c-card--table"><div class="c-table-wrap"><table class="c-table"><caption class="u-visually-hidden">Pré-visualização da importação</caption><thead><tr><th class="col-sel"><span class="u-visually-hidden">Incluir</span></th><th>Data</th><th>Descrição</th><th class="num">Valor</th><th>Categoria sugerida</th><th>Situação</th></tr></thead><tbody>${rowsT}</tbody></table></div></div></div><ul class="c-card c-card--flush imp-list only-s">${rowsM}</ul>
<div class="row-sb"><span class="muted small only-l">Mostrando 10 de 86 linhas</span>${btn('Exportar linhas com erro', { v: 'secondary', sm: true, icon: 'download', attrs: 'data-toast="Arquivo de erros exportado."' })}</div>${foot(2, 4)}</div>`;
}

const p4 = () => `<div class="stack">${card(`<h3 class="block__title">Resumo da importação</h3><dl class="kv kv--lines"><div><dt>Arquivo</dt><dd>extrato-inter-ago-2026.csv</dd></div><div><dt>Destino</dt><dd>Inter Conta Digital</dd></div><div><dt>Lançamentos a importar</dt><dd>71</dd></div><div><dt>Duplicadas ignoradas</dt><dd>13</dd></div><div><dt>Com erro (não importadas)</dt><dd>2</dd></div></dl>`)}<div class="step-foot">${btn('Voltar', { v: 'secondary', attrs: 'data-step-go="3"', cls: 'only-l-inline' })}<span class="step-foot__sp"></span>${btn('Importar 71 lançamentos', { v: 'primary', attrs: 'data-toast="Importação simulada: 71 lançamentos."' })}</div></div>`;

const nova = () => `<div class="stack"><div class="c-card steps-card"><div data-steps data-current="3">${stepper()}<div data-step-panel="1" hidden>${p1()}</div><div data-step-panel="2" hidden>${p2()}</div><div data-step-panel="3">${p3()}</div><div data-step-panel="4" hidden>${p4()}</div></div></div></div>`;

function lotesP() {
  const rows = lotes.map((l) => `<tr><td><span class="inst-cell">${ic('fileText', 18, 'muted-i')}<span>${l.arq}</span></span></td><td class="tnum">${l.data}</td><td>${l.dest}</td><td>${l.fmt}</td><td class="num tnum">${l.qtd}</td><td>${loteB(l.st)}</td><td>${l.st === 'ativo' ? btn('Desfazer lote', { v: 'danger-outline', sm: true, attrs: 'data-open="dlg-desfazer"' }) : ''}</td></tr>`).join('');
  const cards = lotes.map((l) => `<article class="c-card lote"><p class="lote__n">${ic('fileText', 18, 'muted-i')}<strong>${l.arq}</strong></p><p class="muted small tnum">${l.data} · ${l.dest}</p><div class="row-sb"><span class="muted small">${l.fmt} · ${l.qtd} lançamentos</span>${loteB(l.st)}</div>${l.st === 'ativo' ? btn('Desfazer lote', { v: 'danger-outline', block: true, attrs: 'data-open="dlg-desfazer"' }) : ''}</article>`).join('');
  return `<div class="stack"><h2 class="block__title">Lotes anteriores</h2><div class="only-s stack">${cards}</div><div class="only-l"><div class="c-card c-card--flush c-card--table"><div class="c-table-wrap"><table class="c-table"><caption class="u-visually-hidden">Lotes anteriores</caption><thead><tr><th>Arquivo</th><th>Data</th><th>Destino</th><th>Formato</th><th class="num">Qtd.</th><th>Status</th><th>Ação</th></tr></thead><tbody>${rows}</tbody></table></div></div></div></div>`;
}

const dataView = () => tabs('imp', [{ label: 'Nova importação', short: 'Nova', html: nova() }, { label: 'Lotes', html: lotesP() }], { equal: true, label: 'Importação' });
const loadingView = () => loadingWrap(`${skRows(3)}${skTable(6)}`, 'Lendo arquivo');
const emptyView = () => `<div class="stack">${emptyCard('upload', 'Nenhuma importação realizada', 'Importe um extrato OFX ou CSV para começar.', btn('Importar arquivo', { v: 'primary' }))}${emptyCard('circleCheck', 'Todos os lançamentos já existem. Nada para importar.', 'O arquivo foi lido, mas não há lançamentos novos.', '', { compact: true })}</div>`;
const errorView = () => `<div class="stack">${banner('error', 'A importação falhou. Nenhum lançamento foi adicionado.', { action: btn('Tentar novamente', { v: 'secondary', sm: true, attrs: 'data-retry' }) })}${card(`<div class="dropzone dropzone--err"><div class="dropzone__i">${ic('octAlert', 40)}</div><p><strong>Não conseguimos ler este arquivo.</strong></p>${btn('Escolher outro arquivo', { v: 'secondary' })}</div>`)}</div>`;

const dialogs = dlg('dlg-desfazer', { title: 'Desfazer lote?', alert: true, body: '<p>Os lançamentos deste lote serão removidos. Edições feitas neles serão perdidas. Transações do Open Finance não são afetadas.</p>', footer: `${btn('Cancelar', { v: 'ghost', attrs: 'data-close' })}${btn('Desfazer lote', { v: 'danger', attrs: 'data-close data-toast="Lote desfeito."' })}` });

module.exports = { id: '11', slug: '11-importacao', titulo: 'Importação', active: '11-importacao', period: 'none', build: () => ({ views: { data: dataView(), loading: loadingView(), empty: emptyView(), error: errorView() }, dialogs }) };
