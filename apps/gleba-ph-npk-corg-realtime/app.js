/* Sortowalna tabela metod */
(function () {
  var table = document.getElementById('cmp');
  if (!table) return;
  var ths = table.querySelectorAll('thead th');

  function value(row, th) {
    var idx = Array.prototype.indexOf.call(row.parentNode.children, row);
    // use data-num from matching cell if present
    var cell = row.cells[th.cellIndex];
    if (th.dataset.type === 'num' && cell.dataset.num !== undefined) {
      return parseFloat(cell.dataset.num);
    }
    return (cell.textContent || '').trim().toLowerCase();
  }

  ths.forEach(function (th) {
    th.setAttribute('tabindex', '0');
    th.setAttribute('role', 'button');
    th.setAttribute('aria-sort', 'none');
    var dir = 1;
    function sort() {
      var tbody = table.querySelector('tbody');
      var rows = Array.prototype.slice.call(tbody.rows);
      dir = -dir;
      rows.sort(function (a, b) {
        var va = value(a, th), vb = value(b, th);
        if (va < vb) return -1 * dir;
        if (va > vb) return 1 * dir;
        return 0;
      });
      rows.forEach(function (r) { tbody.appendChild(r); });
      ths.forEach(function (o) {
        o.classList.remove('sorted-asc', 'sorted-desc');
        o.setAttribute('aria-sort', 'none');
      });
      th.classList.add(dir === 1 ? 'sorted-asc' : 'sorted-desc');
      th.setAttribute('aria-sort', dir === 1 ? 'ascending' : 'descending');
    }
    th.addEventListener('click', sort);
    th.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); sort(); }
    });
  });
})();

/* Kalkulator Nernsta dla elektrody azotanowej */
(function () {
  var conc = document.getElementById('conc');
  var slope = document.getElementById('slope');
  var temp = document.getElementById('temp');
  if (!conc || !slope || !temp) return;

  var concOut = document.getElementById('concOut');
  var slopeOut = document.getElementById('slopeOut');
  var tempOut = document.getElementById('tempOut');
  var mvOut = document.getElementById('mvOut');
  var mvdecOut = document.getElementById('mvdecOut');
  var warn = document.getElementById('warn');

  // elektroda anionowa (NO3-): nachylenie ujemne
  var T_REF = 298.15; // 25 °C w K
  var R = 8.314462618, F = 96485.33212; // J/(mol·K), C/mol
  var ZERO_C = 100; // punkt zerowy kalibracji: 100 mg/L NO3-

  function mgLToMol(l) { return l / 62.0049; }

  function fmt(x, d) { return x.toFixed(d).replace('.', ','); }

  function update() {
    var c = Math.max(0.5, Number(conc.value)); // mg/L, unikamy log(0)
    var eff = Number(slope.value) / 100; // sprawność elektrody
    var T = Number(temp.value) + 273.15;

    var nernst = (R * T) / F * 1000; // mV na dekadę (ln), jednorednkowy
    var mVPerDecade = -nernst * Math.log(10) * eff; // mV na dekadę (log10), znak ujemny dla anionu

    var cMol = mgLToMol(c), zMol = mgLToMol(ZERO_C);
    var mV = mVPerDecade * Math.log10(cMol / zMol);

    concOut.textContent = fmt(c, c < 10 ? 1 : 0) + ' mg/L';
    slopeOut.textContent = fmt(Number(slope.value), 0) + '%';
    tempOut.textContent = fmt(Number(temp.value), 0) + ' °C';
    mvOut.textContent = fmt(mV, 1) + ' mV';
    mvdecOut.textContent = fmt(mVPerDecade, 1) + ' mV/dekadę';

    if (eff < 0.9) {
      warn.hidden = false;
      warn.textContent = 'Uwaga: sprawność < 90% oznacza starą/wyczerpaną membranę — typowy powód dryfu odczytów w polu, elektroda wymaga kalibracji lub wymiany.';
    } else if (Number(temp.value) < 5 || Number(temp.value) > 35) {
      warn.hidden = false;
      warn.textContent = 'Przy tej temperaturze nachylenie znacząco odbiega od 59,2 mV/dekadę — bez kompensacji temperatury odczyt ISE będzie systematycznie zafałszowany.';
    } else {
      warn.hidden = true;
    }
  }

  [conc, slope, temp].forEach(function (el) {
    el.addEventListener('input', update);
  });
  update();
})();
