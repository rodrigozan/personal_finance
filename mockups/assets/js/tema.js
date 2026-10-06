(function () {
  var d = document.documentElement;
  var q = new URLSearchParams(location.search);
  function get(k) {
    try {
      return localStorage.getItem(k);
    } catch (e) {
      return null;
    }
  }
  function set(k, v) {
    try {
      localStorage.setItem(k, v);
    } catch (e) {}
  }
  var tema = q.get('tema') || get('mock-tema') || 'sistema';
  if (q.get('tema')) set('mock-tema', tema);
  d.setAttribute('data-tema', tema);
  if (tema === 'claro') d.setAttribute('data-theme', 'light');
  else if (tema === 'escuro') d.setAttribute('data-theme', 'dark');
  else d.removeAttribute('data-theme');
  var est = q.get('estado');
  d.setAttribute('data-estado', ['data', 'loading', 'empty', 'error'].indexOf(est) >= 0 ? est : 'data');
  if (get('mock-ocultar') === '1') d.setAttribute('data-masked', 'true');
  window.mockStore = { get: get, set: set };
})();
