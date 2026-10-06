(function () {
  var q = new URLSearchParams(location.search);
  var f = document.getElementById('vz-frame');
  var sel = { pagina: document.getElementById('vz-pagina'), largura: document.getElementById('vz-largura'), estado: document.getElementById('vz-estado'), tema: document.getElementById('vz-tema') };
  sel.pagina.value = q.get('pagina') || '02-dashboard';
  sel.largura.value = q.get('largura') || '390';
  sel.estado.value = q.get('estado') || 'data';
  sel.tema.value = q.get('tema') || document.documentElement.getAttribute('data-tema') || 'claro';
  function apply() {
    var w = sel.largura.value;
    f.style.width = w + 'px';
    f.style.height = w === '1440' ? '900px' : w === '768' ? '1024px' : '844px';
    var u = sel.pagina.value + '.html?estado=' + sel.estado.value + '&tema=' + sel.tema.value;
    if (f.getAttribute('data-u') !== u) {
      f.setAttribute('data-u', u);
      f.src = u;
    }
    history.replaceState(null, '', 'visualizar.html?pagina=' + sel.pagina.value + '&largura=' + w + '&estado=' + sel.estado.value + '&tema=' + sel.tema.value);
  }
  Object.keys(sel).forEach(function (k) {
    sel[k].addEventListener('change', apply);
  });
  apply();
})();
