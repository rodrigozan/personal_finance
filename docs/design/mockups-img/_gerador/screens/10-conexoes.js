const { C, T, R, L, G, Ic, tw, brl, pct, wrap } = require('../lib/core');
const K = require('../lib/comp');
const B = require('../lib/blocks');
const { logo } = require('../lib/logos');
const { mobileShell, desktopShell } = require('../lib/shell');
const D = require('../data');

const ordem = ['inter', 'xp', 'itau', 'nubank'];
const lista = ordem.map((id) => D.conexoes.find((c) => c.id === id));

const historico = [
  { ini: '05/10/2026 14:21', fim: '05/10/2026 14:22', con: 'Itaú', inst: 'itau', res: 'ok', itens: 38, erros: 0 },
  { ini: '05/10/2026 14:21', fim: '05/10/2026 14:22', con: 'Nubank', inst: 'nubank', res: 'ok', itens: 21, erros: 0 },
  { ini: '05/10/2026 14:21', fim: '05/10/2026 14:22', con: 'XP Investimentos', inst: 'xp', res: 'ok', itens: 7, erros: 0 },
  { ini: '05/10/2026 14:20', fim: '05/10/2026 14:21', con: 'Banco Inter', inst: 'inter', res: 'error', itens: 0, erros: 1 },
  { ini: '04/10/2026 21:03', fim: '04/10/2026 21:04', con: 'Itaú', inst: 'itau', res: 'ok', itens: 12, erros: 0 },
  { ini: '03/10/2026 09:40', fim: '03/10/2026 09:41', con: 'Banco Inter', inst: 'inter', res: 'ok', itens: 15, erros: 0 },
];

function statusBadge(x, cy, c) {
  if (c.status === 'ok') return K.badge(x, cy, 'Atualizado', 'ok', 'circleCheck');
  if (c.status === 'warning') return K.badge(x, cy, 'Ação necessária', 'warning', 'triAlert');
  return K.badge(x, cy, 'Erro', 'error', 'octAlert');
}

function resBadge(x, cy, r) {
  if (r === 'ok') return K.badge(x, cy, 'Sucesso', 'ok', 'circleCheck');
  if (r === 'warning') return K.badge(x, cy, 'Parcial', 'warning', 'triAlert');
  return K.badge(x, cy, 'Falha', 'error', 'octAlert');
}

function actionLabel(c) {
  if (c.status === 'error') return { t: 'Reconectar', v: 'primary' };
  if (c.status === 'warning') return { t: 'Renovar consentimento', v: 'primary' };
  return { t: 'Sincronizar', v: 'secondary' };
}

function segBar(x, y, w, used, total) {
  const gap = 6;
  const sw = (w - gap * (total - 1)) / total;
  let s = '';
  for (let i = 0; i < total; i++) s += R(x + i * (sw + gap), y, sw, 12, { fill: i < used ? C.primary : C.track, r: 6 });
  return s;
}

function chipsDados(x, cy, dados, maxX) {
  let s = '';
  let cx = x;
  dados.forEach((d) => {
    const b = K.badge(cx, cy, d, 'neutral', undefined, { chip: true });
    if (cx + b.w > maxX) return;
    s += b.s;
    cx += b.w + 6;
  });
  return s;
}

function chipRows(dados, maxW) {
  const rows = [[]];
  let cx = 0;
  dados.forEach((d) => {
    const b = K.badge(0, 0, d, 'neutral', undefined, { chip: true });
    if (cx + b.w > maxW && rows[rows.length - 1].length) {
      rows.push([]);
      cx = 0;
    }
    rows[rows.length - 1].push({ d, x: cx });
    cx += b.w + 6;
  });
  return rows;
}

function cardMobile(x, y, w, c) {
  const problem = c.status !== 'ok';
  const msg = c.msg ? wrap(c.msg, w - 32, 14) : [];
  const rows = chipRows(c.dados, w - 32);
  const h = 16 + 44 + 4 + 28 + rows.length * 28 + msg.length * 20 + (msg.length ? 8 : 0) + 24 + 12 + 44 + 20;
  let s = K.card(x, y, w, h);
  if (problem) s += R(x, y + 8, 3, h - 16, { fill: c.status === 'error' ? C.danger : C.warning, r: 1.5 });
  s += logo(c.inst, x + 16, y + 16, 40);
  s += T(x + 68, y + 28, c.nome, { size: 16, weight: 600 });
  s += statusBadge(x + 68, y + 52, c).s;
  s += Ic('dotsV', x + w - 16 - 10, y + 32, 20, C.muted);
  let yy = y + 16 + 44 + 16;
  s += Ic('clock', x + 16 + 8, yy + 4, 16, C.muted);
  s += T(x + 16 + 24, yy + 4, `Última sincronização: ${c.sync}`, { size: 13, fill: C.muted, tnum: true });
  yy += 28;
  rows.forEach((row, ri) => {
    row.forEach((it) => {
      s += K.badge(x + 16 + it.x, yy + 4 + ri * 28, it.d, 'neutral', undefined, { chip: true }).s;
    });
  });
  yy += rows.length * 28;
  msg.forEach((ln, i) => {
    s += T(x + 16, yy + 6 + i * 20, ln, { size: 14, weight: 500, fill: c.status === 'error' ? C.dangerText : C.warningText });
  });
  yy += msg.length * 20 + (msg.length ? 8 : 0);
  s += Ic(c.status === 'warning' ? 'clock' : 'shieldCheck', x + 16 + 8, yy + 10, 16, c.status === 'warning' ? C.warning : C.muted);
  s += T(x + 16 + 24, yy + 10, c.consent, { size: 13, fill: c.status === 'warning' ? C.warningText : C.muted, max: w - 32 - 24 });
  yy += 24 + 12;
  const a = actionLabel(c);
  s += K.btn(x + 16, yy, a.t, { variant: a.v, w: w - 32, h: 44, icon: a.v === 'secondary' ? 'refresh' : undefined }).s;
  return { s, h };
}

function celular() {
  return mobileShell({
    title: 'Conexões',
    active: 'conexoes',
    body: (x, y, w) => {
      const f = new K.Flow(x, y, w, 16);
      f.add((fx, fy, fw) => {
        const h = 292;
        let s = K.card(fx, fy, fw, h);
        s += T(fx + 16, fy + 28, '4 de 5 conexões', { size: 18, weight: 600 });
        s += segBar(fx + 16, fy + 48, fw - 32, 4, 5);
        s += K.btn(fx + 16, fy + 76, 'Conectar instituição', { variant: 'primary', w: fw - 32, h: 44, icon: 'plus' }).s;
        s += K.btn(fx + 16, fy + 128, 'Sincronizar tudo', { variant: 'secondary', w: fw - 32, h: 44, icon: 'refresh' }).s;
        s += Ic('shieldCheck', fx + 16 + 8, fy + 200, 16, C.muted);
        const nl = wrap('Acesso somente leitura. Suas credenciais bancárias não são armazenadas por este app.', fw - 32 - 24, 13);
        nl.forEach((ln, i) => {
          s += T(fx + 16 + 24, fy + 200 + i * 18, ln, { size: 13, fill: C.muted });
        });
        s += T(fx + 16, fy + 260, 'Ordenadas por gravidade: erro, atenção e atualizadas.', { size: 12, fill: C.muted, max: fw - 32 });
        return { s, h };
      });
      lista.forEach((c) => f.add((fx, fy, fw) => cardMobile(fx, fy, fw, c)));
      f.add((fx, fy, fw) => {
        let s = T(fx, fy + 14, 'Histórico de sincronizações', { size: 18, weight: 600 });
        s += Ic('chevD', fx + fw - 12, fy + 14, 22, C.text, 2);
        return { s, h: 28 };
      }, 12);
      historico.slice(0, 4).forEach((h) => {
        f.add((fx, fy, fw) => {
          const hh = 108;
          let s = K.card(fx, fy, fw, hh);
          s += logo(h.inst, fx + 16, fy + 16, 28);
          s += T(fx + 54, fy + 30, h.con, { size: 15, weight: 600 });
          const b = resBadge(0, 0, h.res);
          s += resBadge(fx + fw - 16 - b.w, fy + 30, h.res).s;
          s += T(fx + 16, fy + 66, `${h.ini} → ${h.fim.slice(11)}`, { size: 13, fill: C.muted, tnum: true });
          s += T(fx + 16, fy + 88, `${h.itens} itens · ${h.erros} ${h.erros === 1 ? 'erro' : 'erros'}`, { size: 13, fill: C.muted });
          return { s, h: hh };
        }, 8);
      });
      return { s: f.s, h: f.h };
    },
  });
}

function cardD(x, y, w, c) {
  const problem = c.status !== 'ok';
  const h = 144 + (c.msg ? 26 : 0);
  let s = K.card(x, y, w, h);
  if (problem) s += R(x, y + 8, 3, h - 16, { fill: c.status === 'error' ? C.danger : C.warning, r: 1.5 });
  s += logo(c.inst, x + 24, y + 24, 48);
  s += T(x + 88, y + 36, c.nome, { size: 18, weight: 600 });
  const sb = statusBadge(x + 88 + tw(c.nome, 18, 600) + 12, y + 36, c);
  s += sb.s;
  s += Ic('clock', x + 88 + 8, y + 66, 16, C.muted);
  s += T(x + 88 + 24, y + 66, `Última sincronização: ${c.sync} (${c.rel})`, { size: 14, fill: C.muted, tnum: true });
  s += T(x + 88, y + 96, 'Dados:', { size: 13, fill: C.muted });
  s += chipsDados(x + 88 + 46, y + 96, c.dados, x + w - 400);
  let yy = y + 124;
  s += Ic(c.status === 'warning' ? 'clock' : 'shieldCheck', x + 88 + 8, yy, 16, c.status === 'warning' ? C.warning : C.muted);
  s += T(x + 88 + 24, yy, c.consent, { size: 13, weight: c.status === 'warning' ? 600 : 400, fill: c.status === 'warning' ? C.warningText : C.muted });
  if (c.msg) {
    yy += 26;
    s += Ic(c.status === 'error' ? 'octAlert' : 'triAlert', x + 88 + 8, yy, 16, c.status === 'error' ? C.danger : C.warning);
    s += T(x + 88 + 24, yy, c.msg, { size: 13, weight: 600, fill: c.status === 'error' ? C.dangerText : C.warningText });
  }
  const a = actionLabel(c);
  const ab = K.btn(0, 0, a.t, { variant: a.v, h: 40, size: 15 });
  s += K.btn(x + w - 24 - 40 - 8 - ab.w, y + 24, a.t, { variant: a.v, h: 40, size: 15 }).s;
  s += K.iconBtn(x + w - 24 - 40, y + 24, 40, 'dotsV', { variant: 'secondary', isz: 20 }).s;
  return { s, h };
}

function desktop() {
  return desktopShell({
    title: 'Conexões',
    active: 'conexoes',
    body: (x, y, w) => {
      const f = new K.Flow(x, y, w, 24);
      f.add((fx, fy, fw) => {
        let s = T(fx, fy + 12, 'Conexões ativas: 4 de 5', { size: 18, weight: 600 });
        s += segBar(fx + 250, fy + 6, 180, 4, 5);
        const b1 = K.btn(0, 0, 'Conectar instituição', { variant: 'primary', h: 40, size: 15, icon: 'plus' });
        const b2 = K.btn(0, 0, 'Sincronizar tudo', { variant: 'secondary', h: 40, size: 15, icon: 'refresh' });
        s += K.btn(fx + fw - b1.w, fy - 8, 'Conectar instituição', { variant: 'primary', h: 40, size: 15, icon: 'plus' }).s;
        s += K.btn(fx + fw - b1.w - 12 - b2.w, fy - 8, 'Sincronizar tudo', { variant: 'secondary', h: 40, size: 15, icon: 'refresh' }).s;
        return { s, h: 24 };
      }, 16);
      f.add((fx, fy, fw) => K.banner(fx, fy, fw, 'info', null, 'Acesso somente leitura. Suas credenciais bancárias não são armazenadas por este app.', { icon: 'shieldCheck' }), 24);
      lista.forEach((c) => f.add((fx, fy, fw) => cardD(fx, fy, fw, c), 16));
      f.add((fx, fy, fw) => {
        let s = T(fx, fy + 14, 'Histórico de sincronizações', { size: 20, weight: 600 });
        const sel = (sx, label, val, sw) => {
          let o = R(sx + 0.5, fy - 6 + 0.5, sw - 1, 39, { fill: C.surface, stroke: C.borderStrong, r: 8 });
          o += T(sx + 12, fy + 14, label + ': ', { size: 14, fill: C.muted });
          o += T(sx + 12 + tw(label + ': ', 14), fy + 14, val, { size: 14, weight: 500 });
          o += Ic('chevD', sx + sw - 20, fy + 14, 16, C.muted);
          return o;
        };
        s += sel(fx + fw - 220 - 12 - 200, 'Conexão', 'Todas', 200);
        s += sel(fx + fw - 220, 'Resultado', 'Todos', 220);
        return { s, h: 36 };
      }, 12);
      f.add((fx, fy, fw) => {
        const rh = 52;
        const head = 44;
        const defs = [
          { label: 'Início', w: 140, r: (r, cx, cy) => T(cx, cy, r.ini, { size: 14, tnum: true }) },
          { label: 'Fim', w: 140, r: (r, cx, cy) => T(cx, cy, r.fim, { size: 14, tnum: true }) },
          { label: 'Conexão', r: (r, cx, cy) => logo(r.inst, cx, cy - 11, 22) + T(cx + 32, cy, r.con, { size: 14, weight: 500 }) },
          { label: 'Resultado', w: 130, r: (r, cx, cy) => resBadge(cx, cy, r.res).s },
          { label: 'Itens', w: 70, align: 'right', r: (r, cx, cy, cw) => T(cx + cw, cy, String(r.itens), { size: 14, anchor: 'end', tnum: true }) },
          { label: 'Erros', w: 70, align: 'right', r: (r, cx, cy, cw) => T(cx + cw, cy, String(r.erros), { size: 14, anchor: 'end', tnum: true, fill: r.erros ? C.dangerText : C.text, weight: r.erros ? 600 : 400 }) },
          { label: 'Detalhes', w: 90, r: (r, cx, cy) => T(cx, cy, 'Ver detalhes', { size: 13, weight: 600, fill: C.link }) },
        ];
        const cols = K.colsFit(fw, defs, 16, 24);
        const h = head + historico.length * rh + 60;
        let s = K.card(fx, fy, fw, h);
        const hd = K.tableHead(fx, fy, fw, cols, { h: head, pad: 24, gap: 16 });
        const rw = K.tableRows(fx, fy + head, fw, cols, historico, { rh, pad: 24, gap: 16, lastLine: true });
        s += `<clipPath id="hs"><rect x="${fx}" y="${fy}" width="${fw}" height="${h}" rx="12"/></clipPath><g clip-path="url(#hs)">${hd.s}${rw.s}</g>`;
        const py = fy + head + historico.length * rh;
        s += T(fx + 24, py + 30, 'Mostrando 1–6 de 48 sincronizações', { size: 13, fill: C.muted });
        const pages = ['1', '2', '3', '…', '8'];
        let px = fx + fw - 24 - 40;
        s += R(px + 0.5, py + 14 + 0.5, 39, 31, { fill: C.surface, stroke: C.borderStrong, r: 8 });
        s += Ic('chevR', px + 20, py + 30, 16, C.text, 2);
        for (let i = pages.length - 1; i >= 0; i--) {
          px -= 40;
          const on = i === 0;
          s += R(px + 0.5, py + 14 + 0.5, 35, 31, { fill: on ? C.primary : C.surface, stroke: on ? C.primary : C.border, r: 8 });
          s += T(px + 18, py + 30, pages[i], { size: 14, weight: 600, fill: on ? '#FFFFFF' : C.text, anchor: 'middle' });
        }
        s += R(px - 40 + 0.5, py + 14 + 0.5, 35, 31, { fill: C.surface, stroke: C.border, r: 8 });
        s += Ic('chevL', px - 40 + 18, py + 30, 16, C.disabledText, 2);
        s += R(fx + 0.5, fy + 0.5, fw - 1, h - 1, { stroke: C.border, r: 11.5 });
        return { s, h };
      });
      return { s: f.s, h: f.h };
    },
  });
}

module.exports = { id: '10', slug: 'conexoes', nome: 'Conexões', celular, desktop };
