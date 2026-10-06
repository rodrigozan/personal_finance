const { C, T, R, L, G, Ic, tw, brl, pct, wrap } = require('../lib/core');
const K = require('../lib/comp');
const { googleG } = require('../lib/logos');
const { mobileShell, desktopShell } = require('../lib/shell');
const D = require('../data');

const secoes = [
  ['Perfil e região', 'user'],
  ['Aparência', 'sun'],
  ['Segurança', 'shieldCheck'],
  ['Dados e privacidade', 'lock'],
];

function card(x, y, w, pad, title, sub, bodyFn, o = {}) {
  const inner = new K.Flow(x + pad, y + pad, w - pad * 2, o.gap || 16);
  inner.add((x2, y2, w2) => {
    let s = T(x2, y2 + 12, title, { size: o.tsize || 18, weight: 600, fill: o.danger ? C.dangerText : C.text });
    let h = 24;
    if (sub) {
      s += T(x2, y2 + 36, sub, { size: 13, fill: C.muted, max: w2 });
      h = 48;
    }
    return { s, h };
  }, 12);
  bodyFn(inner, w - pad * 2);
  const h = inner.h + pad * 2;
  const border = o.danger ? C.dangerBorder : C.border;
  return { s: K.card(x, y, w, h, { stroke: border }) + inner.s, h };
}

function readOnly(x, y, w, label, value, h = 44, size = 16) {
  let s = T(x, y + 10, label, { size: 14, weight: 500 });
  s += R(x + 0.5, y + 24 + 0.5, w - 1, h - 1, { fill: C.disabledBg, stroke: C.border, r: 8 });
  s += T(x + 12, y + 24 + h / 2, value, { size, fill: C.neutralText, max: w - 56 });
  s += Ic('lock', x + w - 26, y + 24 + h / 2, 18, C.muted);
  return { s, h: 24 + h };
}

function perfil(f, w, mobile) {
  const h = mobile ? 44 : 40;
  const size = mobile ? 16 : 15;
  f.add((x, y, ww) => K.field(x, y, ww, 'Nome', 'Rafael Moreira', { h, size }));
  f.add((x, y, ww) => readOnly(x, y, ww, 'E-mail', 'rafael.moreira@exemplo.com.br', h, size));
  f.add((x, y, ww) => {
    if (mobile) {
      const a = readOnly(x, y, ww, 'Moeda', 'BRL - Real brasileiro (fixa)', h, size);
      const b = readOnly(x, y + a.h + 16, ww, 'Fuso horário', 'America/Sao_Paulo (fixo)', h, size);
      return { s: a.s + b.s, h: a.h + 16 + b.h };
    }
    const cw = (ww - 16) / 2;
    const a = readOnly(x, y, cw, 'Moeda', 'BRL - Real brasileiro', h, size);
    const b = readOnly(x + cw + 16, y, cw, 'Fuso horário', 'America/Sao_Paulo', h, size);
    return { s: a.s + b.s, h: a.h };
  });
  f.add((x, y, ww) => {
    const a = K.field(x, y, ww, 'Dia de início do mês financeiro', '5', { h, size, iconEnd: 'chevD', help: undefined });
    let s = a.s;
    s += Ic('info', x + 8, y + a.h + 14, 16, C.muted);
    const lines = wrap('O mês financeiro vai do dia 5 ao dia 4 do mês seguinte e define o período dos relatórios e do orçamento.', ww - 28, 13);
    lines.forEach((ln, i) => {
      s += T(x + 26, y + a.h + 14 + i * 18, ln, { size: 13, fill: C.muted });
    });
    return { s, h: a.h + 14 + lines.length * 18 + 4 };
  });
  f.add((x, y, ww) => {
    const b = K.btn(x, y, 'Salvar', { variant: 'primary', h: mobile ? 44 : 40, size: mobile ? 16 : 15, w: mobile ? ww : undefined, weight: 500 });
    let s = b.s;
    if (!mobile) s += K.btn(x + b.w + 8, y, 'Descartar', { variant: 'ghost', h: 40, size: 15 }).s;
    return { s, h: b.h };
  });
}

function aparencia(f, w, mobile) {
  f.add((x, y, ww) => {
    let s = T(x, y + 10, 'Tema', { size: 14, weight: 500 });
    s += K.segmented(x, y + 24, ww, mobile ? 44 : 40, ['Claro', 'Escuro', 'Sistema'], 0, { size: 14 }).s;
    return { s, h: 24 + (mobile ? 44 : 40) };
  });
  f.add((x, y, ww) => {
    let s = T(x, y + 10, 'Densidade das tabelas', { size: 14, weight: 500 });
    s += K.segmented(x, y + 24, ww, mobile ? 44 : 40, ['Confortável', 'Compacta'], 0, { size: 14 }).s;
    const lines = wrap(mobile ? 'Vale a partir de telas largas; no celular os cartões mantêm 44 px.' : 'Pré-visualização das duas densidades.', ww, 13);
    lines.forEach((ln, i) => {
      s += T(x, y + 24 + (mobile ? 44 : 40) + 16 + i * 18, ln, { size: 13, fill: C.muted });
    });
    return { s, h: 24 + (mobile ? 44 : 40) + 16 + lines.length * 18 };
  });
  if (!mobile) {
    f.add((x, y, ww) => {
      let s = '';
      const rows = [['04/10/2026', 'Uber *Trip', '−R$ 23,90', 48], ['03/10/2026', 'Netflix.com', '−R$ 55,90', 40]];
      let yy = y;
      rows.forEach((r, i) => {
        s += R(x + 0.5, yy + 0.5, ww - 1, r[3] - 1, { fill: C.surface, stroke: C.border, r: 8 });
        s += T(x + 14, yy + r[3] / 2, r[0], { size: 14, tnum: true });
        s += T(x + 130, yy + r[3] / 2, r[1], { size: 14, weight: 500 });
        s += T(x + ww - 14, yy + r[3] / 2, r[2], { size: 14, weight: 500, fill: C.expense, anchor: 'end', tnum: true });
        s += T(x + ww - 120, yy + r[3] / 2, i === 0 ? 'Confortável · 48 px' : 'Compacta · 40 px', { size: 12, fill: C.muted, anchor: 'end' });
        yy += r[3] + 8;
      });
      return { s, h: yy - y - 8 };
    });
  }
  f.add((x, y, ww) => {
    let s = T(x, y + 14, 'Ocultar valores por padrão', { size: 15, weight: 500 });
    s += T(x, y + 36, 'Os valores aparecem como R$ •••• ao entrar.', { size: 13, fill: C.muted, max: ww - 64 });
    s += K.switchC(x + ww - 44, y + 24, false);
    return { s, h: 52 };
  });
}

function seguranca(f, w, mobile) {
  const hsz = mobile ? 44 : 40;
  const fz = mobile ? 15 : 14;
  const rows = [
    { t: 'Senha', d: 'Mínimo de 12 caracteres, com letras e números. Última alteração em 14/08/2026.', a: 'Alterar senha', v: 'secondary' },
    { t: 'Entrar com Google', d: 'Conta vinculada: rafael.moreira@gmail.com', a: 'Desvincular', v: 'secondary', google: true },
    { t: 'Verificação em duas etapas', d: 'Código do aplicativo autenticador a cada novo acesso.', sw: true, badge: (x, cy) => K.badge(x, cy, 'Ativado', 'ok', 'shieldCheck') },
    { t: 'Códigos de recuperação', d: 'Use se perder acesso ao autenticador.', a2: ['Ver status', 'Gerar novos códigos'], badge: (x, cy) => K.badge(x, cy, '8 códigos restantes', 'ok', 'circleCheck') },
    { t: 'Sessão atual', d: 'Chrome em Windows · São Paulo, BR · ativa agora.', a: 'Sair de todos os dispositivos', v: 'dangerOutline' },
  ];
  rows.forEach((r, i) => {
    f.add((x, y, ww) => {
      let s = '';
      const titleW = tw(r.t, 15, 500);
      let tx = x;
      if (r.google) {
        s += googleG(x, y + 12, 20);
        tx = x + 28;
      }
      s += T(tx, y + 22, r.t, { size: 15, weight: 500 });
      let bw = 0;
      if (r.badge) {
        const bb = r.badge(0, 0);
        if (mobile) s += r.badge(tx, y + 54).s;
        else s += r.badge(tx + titleW + 10, y + 22).s;
      }
      const dl = wrap(r.d, mobile ? ww : ww - 220, 13);
      dl.forEach((ln, k) => {
        s += T(tx, y + 46 + (mobile && r.badge ? 28 : 0) + k * 18, ln, { size: 13, fill: C.muted });
      });
      let h = 46 + (mobile && r.badge ? 28 : 0) + dl.length * 18 + 4;
      if (mobile) {
        let yy = y + h + 8;
        if (r.sw) {
          s += K.switchC(x + ww - 44, y + 22 + 0, true);
        }
        if (r.a) {
          s += K.btn(x, yy, r.a, { variant: r.v, w: ww, h: hsz, size: 15 }).s;
          yy += hsz;
        }
        if (r.a2) {
          const bw2 = (ww - 8) / 2;
          s += K.btn(x, yy, r.a2[0], { variant: 'secondary', w: bw2, h: hsz, size: 14 }).s;
          s += K.btn(x + bw2 + 8, yy, r.a2[1], { variant: 'secondary', w: bw2, h: hsz, size: 14 }).s;
          yy += hsz;
        }
        h = yy - y + (r.a || r.a2 ? 0 : 0);
        if (r.sw) s = s.replace('', '');
        if (i < rows.length - 1) s += L(x, y + h + 8 + 0.5, x + ww, y + h + 8 + 0.5, C.border);
        return { s, h: h + 16 };
      }
      if (r.sw) s += K.switchC(x + ww - 44, y + 24, true);
      if (r.a) {
        const b = K.btn(0, 0, r.a, { variant: r.v, h: 36, size: 14 });
        s += K.btn(x + ww - b.w, y + 14, r.a, { variant: r.v, h: 36, size: 14 }).s;
      }
      if (r.a2) {
        const b0 = K.btn(0, 0, r.a2[0], { variant: 'secondary', h: 36, size: 14 });
        s += K.btn(x, y + h + 4, r.a2[0], { variant: 'secondary', h: 36, size: 14 }).s;
        s += K.btn(x + b0.w + 8, y + h + 4, r.a2[1], { variant: 'secondary', h: 36, size: 14 }).s;
        h += 44;
      }
      h = Math.max(h, 66);
      if (i < rows.length - 1) s += L(x, y + h + 8 + 0.5, x + ww, y + h + 8 + 0.5, C.border);
      return { s, h: h + 16 };
    }, 0);
  });
}

function dados(f, w, mobile) {
  f.add((x, y, ww) => {
    let s = '';
    const lines = wrap('Seus dados ficam armazenados com criptografia e protegidos por regras de acesso individuais. Você pode exportá-los ou excluí-los a qualquer momento.', ww, 14);
    lines.forEach((ln, i) => {
      s += T(x, y + 10 + i * 20, ln, { size: 14, fill: C.muted });
    });
    return { s, h: lines.length * 20 };
  });
  f.add((x, y, ww) => {
    const bw = mobile ? ww : undefined;
    let s = K.btn(x, y, 'Exportar seus dados', { variant: 'secondary', h: mobile ? 44 : 40, size: mobile ? 16 : 15, icon: 'download', w: bw }).s;
    return { s, h: mobile ? 44 : 40 };
  }, 8);
  f.add((x, y, ww) => {
    let s = K.btn(x, y, 'Conexões Open Finance', { variant: 'secondary', h: mobile ? 44 : 40, size: mobile ? 16 : 15, icon: 'link', w: mobile ? ww : undefined }).s;
    return { s, h: mobile ? 44 : 40 };
  }, 0);
}

function perigo(f, w, mobile) {
  f.add((x, y, ww) => {
    const lines = wrap('Remove permanentemente transações, contas, cartões, investimentos, orçamentos e conexões. Esta ação não pode ser desfeita. Antes, você escolhe se mantém ou encerra o acesso à conta.', ww, 14);
    let s = '';
    lines.forEach((ln, i) => {
      s += T(x, y + 10 + i * 20, ln, { size: 14, fill: C.dangerText });
    });
    return { s, h: lines.length * 20 };
  });
  f.add((x, y, ww) => ({ s: K.btn(x, y, 'Excluir todos os dados', { variant: 'dangerOutline', h: mobile ? 44 : 40, size: mobile ? 16 : 15, icon: 'trash', w: mobile ? ww : undefined }).s, h: mobile ? 44 : 40 }), 0);
}

function celular() {
  return mobileShell({
    title: 'Configurações',
    active: 'configuracoes',
    body: (x, y, w) => {
      const f = new K.Flow(x, y, w, 16);
      f.add((fx, fy, fw) => {
        let yy = fy;
        let inner = '';
        secoes.forEach((sc, i) => {
          inner += Ic(sc[1], fx + 16 + 10, yy + 28, 20, C.muted);
          inner += T(fx + 16 + 36, yy + 28, sc[0], { size: 16, weight: 500 });
          inner += Ic('chevR', fx + fw - 16 - 10, yy + 28, 20, C.muted, 2);
          yy += 56;
          if (i < secoes.length - 1) inner += L(fx + 16, yy + 0.5, fx + fw - 16, yy + 0.5, C.border);
        });
        return { s: K.card(fx, fy, fw, yy - fy) + inner, h: yy - fy };
      });
      f.add((fx, fy, fw) => card(fx, fy, fw, 16, 'Perfil e região', null, (ff, ww) => perfil(ff, ww, true)));
      f.add((fx, fy, fw) => card(fx, fy, fw, 16, 'Aparência', null, (ff, ww) => aparencia(ff, ww, true)));
      f.add((fx, fy, fw) => card(fx, fy, fw, 16, 'Segurança', null, (ff, ww) => seguranca(ff, ww, true)));
      f.add((fx, fy, fw) => card(fx, fy, fw, 16, 'Dados e privacidade', null, (ff, ww) => dados(ff, ww, true)));
      f.add((fx, fy, fw) => card(fx, fy, fw, 16, 'Zona de perigo', null, (ff, ww) => perigo(ff, ww, true), { danger: true }));
      return { s: f.s, h: f.h };
    },
  });
}

function desktop() {
  return desktopShell({
    title: 'Configurações',
    active: 'configuracoes',
    body: (x, y, w) => {
      const navW = 240;
      let s = '';
      secoes.forEach((sc, i) => {
        const ny = y + i * 48;
        const on = i === 0;
        if (on) {
          s += R(x, ny, navW, 44, { fill: C.rowSelected, r: 8 });
          s += R(x, ny + 8, 3, 28, { fill: C.primary, r: 1.5 });
        }
        s += Ic(sc[1], x + 12 + 10, ny + 22, 20, on ? C.primary : C.muted);
        s += T(x + 12 + 32, ny + 22, sc[0], { size: 14, weight: on ? 600 : 500, fill: on ? C.text : C.muted });
      });
      const cx = x + navW + 24;
      const cw = 640;
      const f = new K.Flow(cx, y, cw, 24);
      f.add((fx, fy, fw) => card(fx, fy, fw, 24, 'Perfil e região', 'Dados básicos e preferências regionais.', (ff, ww) => perfil(ff, ww, false), { tsize: 20 }));
      f.add((fx, fy, fw) => card(fx, fy, fw, 24, 'Aparência', 'Tema, densidade das tabelas e privacidade visual.', (ff, ww) => aparencia(ff, ww, false), { tsize: 20 }));
      f.add((fx, fy, fw) => card(fx, fy, fw, 24, 'Segurança', 'Senha, login com Google e verificação em duas etapas.', (ff, ww) => seguranca(ff, ww, false), { tsize: 20, gap: 0 }));
      f.add((fx, fy, fw) => card(fx, fy, fw, 24, 'Dados e privacidade', 'Exportação e controle dos seus dados.', (ff, ww) => dados(ff, ww, false), { tsize: 20 }));
      f.add((fx, fy, fw) => card(fx, fy, fw, 24, 'Zona de perigo', null, (ff, ww) => perigo(ff, ww, false), { tsize: 20, danger: true }));
      return { s: s + f.s, h: f.h };
    },
  });
}

module.exports = { id: '14', slug: 'configuracoes', nome: 'Configurações', celular, desktop };
