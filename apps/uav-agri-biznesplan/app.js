/* renderer dla raportu biznes planu UAV (JSON-driven, z print-report skill) */
(function () {
  var R = window.REPORT;
  if (!R || !R.sections || !R.sections.length) {
    document.getElementById('report-root').innerHTML =
      '<p style="font-family:sans-serif">Brak danych raportu (report-data.js).</p>';
    return;
  }
  var toc = document.getElementById('toc-list');
  var root = document.getElementById('report-root');
  var li = [];
  R.sections.forEach(function (s) {
    li.push('<li><a href="#' + s.id + '">' + esc(s.title) + '</a></li>');
  });
  toc.innerHTML = li.join('');

  root.innerHTML = R.sections.map(function (s) {
    return '<section class="art" id="' + s.id + '">' +
      '<h2 data-no="Sekcja ' + pad(s.no) + '">' + esc(s.title) + '</h2>' +
      s.body_html +
      '</section>';
  }).join('');

  document.getElementById('gen-date').textContent = new Date(R.generated).toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' });

  // autolink widoczne domeny w tekście (poza istniejącymi <a>)
  autolink(root);

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  function autolink(el) {
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    var texts = [];
    while (walker.nextNode()) texts.push(walker.currentNode);
    var re = /(?:https?:\/\/)?((?:[a-z0-9-]+\.)+(?:gov|eu|com|pl|org|net|info|dev|io|europa\.eu))(?![^<]*<\/a>)/gi;
    texts.forEach(function (t) {
      if (!t.nodeValue || t.parentElement.closest('a')) return;
      if (!re.test(t.nodeValue)) { re.lastIndex = 0; return; }
      re.lastIndex = 0;
      var span = document.createElement('span');
      span.innerHTML = t.nodeValue.replace(re, function (m, dom) {
        var url = m.indexOf('http') === 0 ? m : 'https://' + dom;
        return '<a href="' + url + '" target="_blank" rel="noopener">' + dom + '</a>';
      });
      t.parentElement.replaceChild(span, t);
    });
  }

  // audit zagnieżdżonych linków
  setTimeout(function () {
    document.querySelectorAll('a a').forEach(function (bad) {
      var parent = bad.parentElement;
      while (bad.firstChild) parent.parentNode.insertBefore(bad.firstChild, parent);
      parent.parentNode.removeChild(parent);
    });
  }, 0);
})();
