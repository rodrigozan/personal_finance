const H = require('../lib/h');
const { D, ic, m, brl, btn, banner, card, field, select, radio, dlg, seg, badge, logo, sk, skRows, skKpi, loadingWrap, errorState, emptyCard, esc, iconBtn, pagination } = H;

const lista = ['inter', 'xp', 'itau', 'nubank'].map((id) => D.conexoes.find((c) => c.id === id));

const historico = [
  { ini: '05/10/2026 14:21', fim: '05/10/2026 14:22', con: 'Itaú', inst: 'itau', res: 'ok', itens: 38, erros: 0 },
  { ini: '05/10/2026 14:21', fim: '05/10/2026 14:22', con: 'Nubank', inst: 'nubank', res: 'ok', itens: 21, erros: 0 },
  { ini: '05/10/2026 14:21', fim: '05/10/2026 14:22', con: 'XP Investimentos', inst: 'xp', res: 'ok', itens: 7, erros: 0 },
  { ini: '05/10/2026 14:20', fim: '05/10/2026 14:21', con: 'Banco Inter', inst: 'inter', res: 'error', itens: 0, erros: 1 },
  { ini: '04/10/2026 21:03', fim: '04/10/2026 21:04', con: 'Itaú', inst: 'itau', res: 'ok', itens: 12, erros: 0 },
  { ini: '03/10/2026 09:40', fim: '03/10/2026 09:41', con: 'Banco Inter', inst: 'inter', res: 'ok', itens: 15, erros: 0 },
];

const st = (c) => (c.status === 'ok' ? badge('Atualizado', 'ok', 'circleCheck') : c.status === 'warning' ? badge('Ação necessária', 'warning', 'triAlert') : badge('Erro', 'error', 'octAlert'));
const rs = (r) => (r === 'ok' ? badge('Sucesso', 'ok', 'circleCheck') : badge('Falha', 'error', 'octAlert'));
const acao = (c) => (c.status === 'error' ? { t: 'Reconectar', v: 'primary', a: 'data-open="dlg-widget"' } : c.status === 'warning' ? { t: 'Renovar consentimento', v: 'primary', a: 'data-open="dlg-widget"' } : { t: 'Sincronizar', v: 'secondary', a: 'data-sync-now', icon: 'refresh' });

function conCard(c) {
  const a = acao(c);
  const prob = c.status !== 'ok';
  return `<article class="con${prob ? ` con--${c.status}` : ''}" aria-label="${esc(c.nome)}"><div class="con__logo">${logo(c.inst, 48)}</div><div class="con__body"><h3 class="con__n">${esc(c.nome)}${st(c)}</h3><p class="con__s muted small tnum">${ic('clock', 16)}Última sincronização: ${c.sync}<span class="only-l"> (${c.rel})</span></p><p class="con__d"><span class="muted small only-l">Dados:</span>${c.dados.map((d) => badge(d, 'neutral', null, { chip: true })).join('')}</p>${c.msg ? `<p class="con__m con__m--${c.status}">${ic(c.status === 'error' ? 'octAlert' : 'triAlert', 16)}${esc(c.msg)}</p>` : ''}<p class="con__c small ${c.status === 'warning' ? 'con__c--w' : 'muted'}">${ic(c.status === 'warning' ? 'clock' : 'shieldCheck', 16)}${esc(c.consent)}</p></div><div class="con__act">${btn(a.t, { v: a.v, icon: a.icon, attrs: a.a })}${iconBtn('dotsV', 'Mais ações de ' + c.nome, { v: 'secondary', attrs: 'data-open="dlg-desconectar"' })}</div></article>`;
}

function histT() {
  const rows = historico.map((h) => `<tr><td class="tnum">${h.ini}</td><td class="tnum">${h.fim}</td><td><span class="inst-cell">${logo(h.inst, 22)}<span>${h.con}</span></span></td><td>${rs(h.res)}</td><td class="num tnum">${h.itens}</td><td class="num tnum${h.erros ? ' err-t' : ''}">${h.erros}</td><td><a class="c-link" href="#">Ver detalhes</a></td></tr>`).join('');
  return `<div class="c-card c-card--flush c-card--table"><div class="c-table-wrap"><table class="c-table"><caption class="u-visually-hidden">Histórico de sincronizações</caption><thead><tr><th>Início</th><th>Fim</th><th>Conexão</th><th>Resultado</th><th class="num">Itens</th><th class="num">Erros</th><th>Detalhes</th></tr></thead><tbody>${rows}</tbody></table></div><div class="tx-foot"><span class="muted small">Mostrando 1–6 de 48 sincronizações</span>${pagination(8, '')}</div></div>`;
}

function histM() {
  return historico.slice(0, 4).map((h) => `<article class="c-card hist"><header>${logo(h.inst, 28)}<strong>${h.con}</strong>${rs(h.res)}</header><p class="muted small tnum">${h.ini} → ${h.fim.slice(11)}</p><p class="muted small">${h.itens} itens · ${h.erros} ${h.erros === 1 ? 'erro' : 'erros'}</p></article>`).join('');
}

const seg5 = (n, t) => `<div class="segbar" role="img" aria-label="${n} de ${t} conexões em uso">${Array.from({ length: t }, (_, i) => `<span class="${i < n ? 'on' : ''}"></span>`).join('')}</div>`;

function dataView() {
  return `<div class="stack"><div class="con-top"><div class="con-top__t"><h2 class="block__title"><span class="only-s">4 de 5 conexões</span><span class="only-l">Conexões ativas: 4 de 5</span></h2>${seg5(4, 5)}</div><div class="con-top__a">${btn('Sincronizar tudo', { v: 'secondary', icon: 'refresh', attrs: 'data-sync-now' })}${btn('Conectar instituição', { v: 'primary', icon: 'plus', attrs: 'data-open="dlg-conectar"' })}</div></div><p class="muted small only-s">Ordenadas por gravidade: erro, atenção e atualizadas.</p>${banner('info', 'Acesso somente leitura. Suas credenciais bancárias não são armazenadas por este app.', { icon: 'shieldCheck' })}<div class="stack">${lista.map(conCard).join('')}</div><section aria-labelledby="hist-t" class="stack"><div class="block__head"><h2 class="block__title" id="hist-t">Histórico de sincronizações</h2><div class="hist-filters only-l">${select('Conexão', ['Todas', 'Itaú', 'Nubank'], { value: 'Todas', cls: 'c-field--inline' })}${select('Resultado', ['Todos', 'Sucesso', 'Falha'], { value: 'Todos', cls: 'c-field--inline' })}</div></div><div class="only-s stack">${histM()}</div><div class="only-l">${histT()}</div></section></div>`;
}

const loadingView = () => loadingWrap(`${skKpi()}${skRows(3, { logo: true })}`, 'Carregando conexões');
const emptyView = () => emptyCard('link', 'Nenhuma instituição conectada', 'O acesso é somente leitura: o painel nunca movimenta seu dinheiro.', btn('Conectar instituição', { v: 'primary', attrs: 'data-open="dlg-conectar"' }) + btn('Importar extrato', { href: '11-importacao.html' }));

const dialogs =
  dlg('dlg-conectar', { title: 'Conectar instituição', body: `<ul class="garantias"><li>${ic('shieldCheck', 20)}<span>Acesso somente leitura: não é possível movimentar dinheiro.</span></li><li>${ic('lock', 20)}<span>Suas credenciais bancárias não são armazenadas por este app.</span></li><li>${ic('eye', 20)}<span>Você escolhe quais dados compartilhar e pode revogar a qualquer momento.</span></li></ul><p class="muted">Você tem 4 de 5 conexões em uso.</p>`, footer: `${btn('Cancelar', { v: 'ghost', attrs: 'data-close' })}${btn('Continuar', { v: 'primary', attrs: 'data-switch-dlg="dlg-widget"' })}` }) +
  dlg('dlg-widget', { title: 'Conectar com segurança', variant: 'widget', sub: 'Ambiente simulado do widget da Pluggy', body: `<div class="widget"><div class="widget__load" data-widget-load aria-live="polite"><span class="c-spinner" aria-hidden="true"></span><p>Abrindo ambiente seguro...</p></div><div class="widget__body" data-widget-body hidden><h3>Escolha sua instituição</h3><ul class="widget__list">${['itau', 'nubank', 'bb', 'bradesco', 'santander', 'c6'].map((i) => `<li><button type="button" class="widget__it" data-close data-toast="Conexão simulada concluída.">${logo(i, 32)}<span>${{ itau: 'Itaú', nubank: 'Nubank', bb: 'Banco do Brasil', bradesco: 'Bradesco', santander: 'Santander', c6: 'C6 Bank' }[i]}</span>${ic('chevR', 18)}</button></li>`).join('')}</ul><p class="muted small">${ic('lock', 14)} Simulação visual. Nenhum dado real é enviado.</p></div></div>`, footer: `${btn('Cancelar', { v: 'ghost', attrs: 'data-close' })}` }) +
  dlg('dlg-desconectar', { title: 'Desconectar instituição', body: `<fieldset class="radio-set"><legend class="u-visually-hidden">O que fazer com o histórico</legend>${radio('hist', 'Manter histórico (padrão)', true)}${radio('hist', 'Excluir histórico', false)}</fieldset><p class="muted small">Com a opção de manter, as transações já importadas continuam disponíveis.</p>`, footer: `${btn('Cancelar', { v: 'ghost', attrs: 'data-close' })}${btn('Desconectar e manter histórico', { v: 'primary', attrs: 'data-close data-toast="Instituição desconectada."' })}` });

module.exports = { id: '10', slug: '10-conexoes', titulo: 'Conexões', active: '10-conexoes', period: 'none', build: () => ({ views: { data: dataView(), loading: loadingView(), empty: emptyView(), error: errorState('Não foi possível carregar as conexões.') }, dialogs }) };
