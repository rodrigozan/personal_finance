(function () {
  var d = document.documentElement;
  var $ = function (s, r) {
    return (r || document).querySelector(s);
  };
  var $$ = function (s, r) {
    return Array.prototype.slice.call((r || document).querySelectorAll(s));
  };
  var store = window.mockStore || { get: function () {}, set: function () {} };

  function reflectTema() {
    var t = d.getAttribute('data-tema') || 'sistema';
    $$('[data-tema-set]').forEach(function (b) {
      b.setAttribute('aria-checked', String(b.getAttribute('data-tema-set') === t));
    });
  }
  function setTema(t) {
    d.setAttribute('data-tema', t);
    if (t === 'claro') d.setAttribute('data-theme', 'light');
    else if (t === 'escuro') d.setAttribute('data-theme', 'dark');
    else d.removeAttribute('data-theme');
    store.set('mock-tema', t);
    reflectTema();
  }
  function reflectEstado() {
    var e = d.getAttribute('data-estado');
    $$('[data-estado-set]').forEach(function (b) {
      b.setAttribute('aria-checked', String(b.getAttribute('data-estado-set') === e));
    });
  }
  function setEstado(e, silent) {
    d.setAttribute('data-estado', e);
    reflectEstado();
    if (!silent) {
      try {
        var u = new URL(location.href);
        u.searchParams.set('estado', e);
        history.replaceState(null, '', u);
      } catch (x) {}
    }
    var main = $('#conteudo');
    if (main) main.setAttribute('aria-busy', String(e === 'loading'));
  }
  function reflectHide() {
    var on = d.getAttribute('data-masked') === 'true';
    $$('[data-hide-toggle]').forEach(function (b) {
      if (b.type === 'checkbox') b.checked = on;
      else b.setAttribute('aria-pressed', String(on));
    });
  }
  function setHide(on) {
    if (on) d.setAttribute('data-masked', 'true');
    else d.removeAttribute('data-masked');
    store.set('mock-ocultar', on ? '1' : '0');
    reflectHide();
  }

  var toastT;
  function toast(msg) {
    var t = $('#toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('is-on');
    clearTimeout(toastT);
    toastT = setTimeout(function () {
      t.classList.remove('is-on');
    }, 3200);
  }

  function openDlg(id) {
    var dl = document.getElementById(id);
    if (!dl || typeof dl.showModal !== 'function') return;
    if (!dl.open) dl.showModal();
    if (id === 'dlg-widget') widgetLoad(dl);
  }
  function widgetLoad(dl) {
    var l = $('[data-widget-load]', dl);
    var b = $('[data-widget-body]', dl);
    if (!l || !b) return;
    l.hidden = false;
    b.hidden = true;
    setTimeout(function () {
      l.hidden = true;
      b.hidden = false;
    }, 1200);
  }

  function selectTab(tab) {
    var wrap = tab.closest('[data-tabs]');
    $$('[role="tab"]', wrap).forEach(function (t) {
      if (t.closest('[data-tabs]') !== wrap) return;
      var on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.setAttribute('tabindex', on ? '0' : '-1');
      var p = document.getElementById(t.getAttribute('aria-controls'));
      if (p) p.hidden = !on;
    });
  }

  var stepNames = ['Arquivo', 'Mapeamento', 'Pré-visualização', 'Confirmação'];
  function goStep(box, n) {
    var total = Number(box.getAttribute('data-total') || 4);
    n = Math.max(1, Math.min(total, n));
    box.setAttribute('data-current', String(n));
    $$('[data-step-panel]', box).forEach(function (p) {
      p.hidden = Number(p.getAttribute('data-step-panel')) !== n;
    });
    $$('.stepper li', box).forEach(function (li) {
      var k = Number(li.getAttribute('data-n'));
      li.setAttribute('data-state', k < n ? 'done' : k === n ? 'current' : 'todo');
      if (k === n) li.setAttribute('aria-current', 'step');
      else li.removeAttribute('aria-current');
    });
    $$('.step-m .segbar span', box).forEach(function (s) {
      s.className = Number(s.getAttribute('data-n')) <= n ? 'on' : '';
    });
    var sn = $('[data-step-n]', box);
    if (sn) sn.textContent = String(n);
    var nm = $('[data-step-name]', box);
    if (nm) nm.textContent = stepNames[n - 1];
    var dl = box.closest('dialog');
    if (dl) {
      var back = $('[data-step-back]', dl);
      var next = $('[data-step-next]', dl);
      var fin = $('[data-step-final]', dl);
      if (back) back.hidden = n === 1;
      if (next) next.hidden = n === total;
      if (fin) fin.hidden = n !== total;
    }
  }

  document.addEventListener('click', function (e) {
    var t = e.target;
    var el = t.closest ? t.closest('button, a, [data-open], [data-close]') : null;
    if (!el) {
      closePops(null);
      return;
    }
    if (el.hasAttribute('data-tema-set')) setTema(el.getAttribute('data-tema-set'));
    if (el.hasAttribute('data-estado-set')) setEstado(el.getAttribute('data-estado-set'));
    if (el.hasAttribute('data-hide-toggle') && el.type !== 'checkbox') setHide(d.getAttribute('data-masked') !== 'true');
    if (el.hasAttribute('data-open')) {
      e.preventDefault();
      openDlg(el.getAttribute('data-open'));
    }
    if (el.hasAttribute('data-switch-dlg')) {
      var cur = el.closest('dialog');
      if (cur) cur.close();
      openDlg(el.getAttribute('data-switch-dlg'));
    }
    if (el.hasAttribute('data-toast')) toast(el.getAttribute('data-toast'));
    if (el.hasAttribute('data-close')) {
      var dl = el.closest('dialog');
      if (dl) dl.close();
    }
    if (el.hasAttribute('data-print')) setTimeout(function () { window.print(); }, 50);
    if (el.hasAttribute('data-dismiss')) {
      var bn = el.closest('.c-banner');
      if (bn) bn.remove();
    }
    if (el.getAttribute('role') === 'tab') selectTab(el);
    if (el.getAttribute('role') === 'radio' && el.closest('.c-segmented') && !el.hasAttribute('data-tema-set') && !el.hasAttribute('data-estado-set')) {
      var g = el.closest('.c-segmented');
      $$('[role="radio"]', g).forEach(function (b) {
        b.setAttribute('aria-checked', String(b === el));
      });
      var grp = g.getAttribute('data-seg');
      if (grp) {
        var v = el.getAttribute('data-v');
        $$('[data-seg-panel^="' + grp + ':"]').forEach(function (p) {
          p.hidden = p.getAttribute('data-seg-panel') !== grp + ':' + v;
        });
        if (grp === 'dens') {
          if (v === 'comp') d.setAttribute('data-dens', 'comp');
          else d.removeAttribute('data-dens');
          $$('[data-seg="dens"]').forEach(function (o) {
            $$('[role="radio"]', o).forEach(function (b) {
              b.setAttribute('aria-checked', String(b.getAttribute('data-v') === v));
            });
          });
        }
      }
    }
    if (el.classList.contains('mk__btn')) {
      var p = $('#mk-panel');
      var open = p.hidden;
      p.hidden = !open;
      el.setAttribute('aria-expanded', String(open));
    }
    if (el.classList.contains('user__btn')) {
      var m = $('#menu-user');
      var o2 = m.hidden;
      closePops(null);
      m.hidden = !o2;
      el.setAttribute('aria-expanded', String(o2));
      e.stopPropagation();
    }
    if (el.hasAttribute('data-sync-now')) {
      var s = $('.d-sync');
      if (s) {
        s.setAttribute('data-status', 'info');
        s.querySelector('.d-sync__s').textContent = 'Sincronizando';
        s.querySelector('.d-sync__l').textContent = 'Sincronizando... 2 de 4';
        setTimeout(function () {
          s.setAttribute('data-status', 'ok');
          s.querySelector('.d-sync__s').textContent = 'agora';
          s.querySelector('.d-sync__l').textContent = 'Sincronizado agora';
          toast('Sincronização concluída.');
        }, 1800);
      }
    }
    if (el.hasAttribute('data-retry')) {
      setEstado('loading', true);
      setTimeout(function () {
        setEstado('data');
      }, 900);
    }
    if (el.hasAttribute('data-step-go')) {
      var box = el.closest('[data-steps]');
      if (box) goStep(box, Number(el.getAttribute('data-step-go')));
    }
    if (el.hasAttribute('data-step-next') || el.hasAttribute('data-step-back')) {
      var b2 = el.closest('dialog');
      var bx = b2 && $('[data-steps]', b2);
      if (bx) goStep(bx, Number(bx.getAttribute('data-current')) + (el.hasAttribute('data-step-next') ? 1 : -1));
    }
    if (el.hasAttribute('data-read')) {
      var li = el.closest('.al');
      li.classList.remove('al--un');
      el.textContent = 'Lido';
      el.disabled = true;
      var dot = $('.al__dot', li);
      if (dot) dot.remove();
      countUnread();
    }
    if (el.hasAttribute('data-read-all')) {
      $$('.al--un').forEach(function (li) {
        li.classList.remove('al--un');
        var b3 = $('[data-read]', li);
        if (b3) {
          b3.textContent = 'Lido';
          b3.disabled = true;
        }
        var dt = $('.al__dot', li);
        if (dt) dt.remove();
      });
      countUnread();
    }
    if (el.hasAttribute('data-bulk-clear')) {
      $$('.js-rowcheck').forEach(function (c) {
        c.checked = false;
      });
      bulk();
    }
    var acc = el.closest('[data-acc] .rep-sec__h');
    if (acc) {
      var btn = $('button', acc);
      var body = document.getElementById(btn.getAttribute('aria-controls'));
      var ex = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!ex));
      body.hidden = ex;
    }
    var cfg = el.closest('.cfg-nav a');
    if (cfg) {
      $$('.cfg-nav a').forEach(function (a) {
        a.removeAttribute('aria-current');
      });
      cfg.setAttribute('aria-current', 'true');
    }
    if (el.classList.contains('c-tag') && el.hasAttribute('aria-pressed')) el.setAttribute('aria-pressed', String(el.getAttribute('aria-pressed') !== 'true'));
    if (el.classList.contains('c-tag__x')) {
      var tg = el.closest('.c-tag');
      if (tg) tg.remove();
    }
  });

  function closePops(except) {
    var m = $('#menu-user');
    if (m && m !== except) {
      m.hidden = true;
      var b = $('.user__btn');
      if (b) b.setAttribute('aria-expanded', 'false');
    }
  }

  function countUnread() {
    var n = $$('.al--un').length;
    var c = $('[data-unread]');
    if (c) c.textContent = String(n);
  }

  function bulk() {
    var bar = $('#bulk');
    if (!bar) return;
    var n = $$('.js-rowcheck:checked').length;
    bar.hidden = n === 0;
    var c = $('[data-bulk-count]', bar);
    if (c) c.textContent = String(n);
  }

  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t.matches && t.matches('.js-rowcheck')) bulk();
    if (t.matches && t.matches('[data-hide-toggle]') && t.type === 'checkbox') setHide(t.checked);
    if (t.matches && t.matches('[data-open-on-change]')) openDlg(t.getAttribute('data-open-on-change'));
  });

  document.addEventListener('input', function (e) {
    var t = e.target;
    if (t.matches && t.matches('[data-confirm-text]')) {
      var dl = t.closest('dialog');
      var fin = dl && $('[data-step-final]', dl);
      if (fin) fin.disabled = t.value !== t.getAttribute('data-confirm-text');
    }
  });

  document.addEventListener('keydown', function (e) {
    var t = e.target;
    if (e.key === 'Escape') {
      closePops(null);
      var p = $('#mk-panel');
      if (p && !p.hidden) p.hidden = true;
    }
    if (t.getAttribute && t.getAttribute('role') === 'tab') {
      var tabs = $$('[role="tab"]', t.closest('[role="tablist"]'));
      var i = tabs.indexOf(t);
      var n = null;
      if (e.key === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
      if (e.key === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
      if (e.key === 'Home') n = tabs[0];
      if (e.key === 'End') n = tabs[tabs.length - 1];
      if (n) {
        e.preventDefault();
        n.focus();
        selectTab(n);
      }
    }
  });

  document.addEventListener('submit', function (e) {
    var f = e.target;
    if (f.hasAttribute('data-login')) {
      e.preventDefault();
      openDlg('dlg-2fa');
    } else if (f.hasAttribute('data-nav')) {
      e.preventDefault();
      location.href = f.getAttribute('data-nav');
    }
  });

  $$('dialog').forEach(function (dl) {
    dl.addEventListener('click', function (e) {
      if (e.target === dl && !dl.hasAttribute('data-persistent')) dl.close();
    });
    dl.addEventListener('cancel', function (e) {
      if (dl.hasAttribute('data-persistent')) e.preventDefault();
    });
    dl.addEventListener('close', function () {
      var box = $('[data-steps]', dl);
      if (box && dl.id === 'dlg-excluir-tudo') goStep(box, 1);
    });
  });

  $$('[data-steps]').forEach(function (b) {
    goStep(b, Number(b.getAttribute('data-current') || 1));
  });

  $$('.c-field__box').forEach(function (b) {
    var eye = b.querySelector('.c-field__icon--end');
    var inp = b.querySelector('input[type="password"]');
    if (eye && inp) {
      eye.style.pointerEvents = 'auto';
      eye.style.cursor = 'pointer';
      eye.addEventListener('click', function () {
        inp.type = inp.type === 'password' ? 'text' : 'password';
      });
    }
  });

  reflectTema();
  reflectEstado();
  reflectHide();
  var main = $('#conteudo');
  if (main && d.getAttribute('data-estado') === 'loading') main.setAttribute('aria-busy', 'true');
})();
