/* print-parts — logika tabeli, filtrów i kalkulatora. Bez zależności. */
(function () {
  "use strict";

  var EUR = 4.3;
  var MAT = window.MATERIALS || {};
  var RATE = window.RATE || { energy: 1, packaging: 6, waste: 1.15 };
  var PARTS = (window.PARTS || []).slice();

  var CATS = {
    foto: "Foto / dron",
    audio: "Audio",
    narzedzia: "Narzędzia",
    rower: "Rower / hulajnoga",
    odkurzacze: "Odkurzacze",
    agd: "AGD",
    ogrod: "Ogród",
    dom: "Dom / dziecko",
    auto: "Auto / moto",
    hobby: "Hobby",
    b2b: "B2B"
  };

  function matPrice(name) {
    var first = String(name).split(/[+/]/)[0].trim();
    if (MAT[first] != null) return MAT[first];
    if (/PAHT|PA-CF|PA6/i.test(name)) return MAT["PA-CF"];
    if (/TPU/i.test(name)) return MAT["TPU 95A"];
    if (/PETG/i.test(name)) return MAT["PETG"];
    if (/ASA/i.test(name)) return MAT["ASA"];
    if (/ABS/i.test(name)) return MAT["ABS"];
    return MAT["PETG"];
  }

  function fees(channel, price) {
    if (channel === "etsy") return price * 0.065 + price * 0.04 + 0.30 * EUR;
    if (channel === "allegro") return price * 0.08;
    return 0;
  }

  function econ(p, channel) {
    var matCost = (p.g / 1000) * matPrice(p.mat) * RATE.waste;
    var energy = p.h * RATE.energy;
    var pack = RATE.packaging;
    var fee = fees(channel || "etsy", p.price);
    var profit = p.price - matCost - energy - pack - fee;
    var score = p.h > 0 ? profit / p.h : 0;
    return {
      matCost: matCost,
      energy: energy,
      pack: pack,
      fee: fee,
      profit: profit,
      score: score,
      margin: p.price > 0 ? profit / p.price : 0
    };
  }

  function zl(n, dec) {
    return Number(n).toLocaleString("pl-PL", {
      minimumFractionDigits: dec == null ? 0 : dec,
      maximumFractionDigits: dec == null ? 0 : dec
    });
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  PARTS.forEach(function (p) {
    p._e = econ(p, "etsy");
    p._score = p._e.score;
    p._max = p.oem[1];
  });

  /* ---------- statystyki ---------- */
  function renderStats() {
    var el = document.getElementById("stats");
    if (!el) return;
    var best = PARTS.slice().sort(function (a, b) { return b._score - a._score; })[0];
    var bestTicket = PARTS.slice().sort(function (a, b) { return b.price - a.price; })[0];
    var bestShare = PARTS.slice().sort(function (a, b) { return b._e.margin - a._e.margin; })[0];
    el.innerHTML = [
      [String(PARTS.length), "części w analizie"],
      [zl(best._score), "zł/h — najlepsza część"],
      [zl(bestTicket.price) + " zł", "najwyższa cena sztuki"],
      [zl(bestShare._e.margin * 100) + "%", "marża netto — rekord"]
    ].map(function (s) {
      return '<div class="stat"><b>' + s[0] + '</b><span>' + s[1] + "</span></div>";
    }).join("");
  }

  /* ---------- tabela ---------- */
  var state = { q: "", cat: "all", sort: "score", open: {} };

  function sortFn(a, b) {
    if (state.sort === "price") return b.price - a.price;
    if (state.sort === "oem") return b._max - a._max;
    if (state.sort === "demand") return b.demand - a.demand || b._score - a._score;
    return b._score - a._score;
  }

  function visible() {
    var q = state.q.toLowerCase().trim();
    return PARTS.filter(function (p) {
      if (state.cat !== "all" && p.cat !== state.cat) return false;
      if (!q) return true;
      return (p.part + " " + p.device + " " + p.mat + " " + (p.why || "")).toLowerCase().indexOf(q) > -1;
    }).sort(sortFn);
  }

  function scoreClass(v) { return v >= 30 ? "hi" : v < 12 ? "lo" : ""; }
  function dots(n) { return "●●●●●".slice(0, n) + "○○○○○".slice(0, 5 - n); }

  function oemCell(p) {
    return zl(p.oem[0]) + "–" + zl(p.oem[1]) + ' <span class="conf tag ' +
      (p.conf === "W" ? "w" : "e") + '">' + p.conf + "</span>";
  }

  function renderTable(rows) {
    var tb = document.getElementById("tbody");
    if (!tb) return;
    var html = "";
    rows.forEach(function (p) {
      var e = p._e, open = state.open[p.id];
      html += '<tr data-id="' + p.id + '" tabindex="0" aria-expanded="' + (open ? "true" : "false") + '">' +
        '<td><span class="pname">' + esc(p.part) + '</span><span class="pdev">' + esc(p.device) + "</span></td>" +
        '<td class="num oemcell">' + oemCell(p) + "</td>" +
        '<td class="num">' + esc(p.mat) + '<span class="pdev">' + p.g + " g</span></td>" +
        '<td class="num">' + zl(p.h, 1) + " h</td>" +
        '<td class="num">' + zl(p.price) + " zł</td>" +
        '<td class="num">' + zl(e.profit) + " zł</td>" +
        '<td class="num score ' + scoreClass(p._score) + '">' + zl(p._score) + "</td>" +
        '<td class="num">' + dots(p.demand) + "</td></tr>";
      if (open) {
        html += '<tr class="detail"><td colspan="8"><dl>' +
          "<dt>Dlaczego</dt><dd>" + esc(p.why) + "</dd>" +
          "<dt>Ryzyko</dt><dd class=\"warnline\">" + esc(p.warn) + "</dd>" +
          "<dt>Cena OEM</dt><dd>" + zl(p.oem[0]) + "–" + zl(p.oem[1]) + " zł · " +
          (p.src ? '<a href="' + esc(p.src) + '" rel="noopener" target="_blank">' + esc(p.srcLabel) + "</a>"
                 : esc(p.srcLabel)) + "</dd>" +
          "<dt>Koszt</dt><dd>materiał " + zl(e.matCost, 2) + " zł · energia " + zl(e.energy, 2) +
          " zł · opakowanie " + zl(e.pack) + " zł · opłaty " + zl(e.fee, 2) + " zł</dd>" +
          "</dl></td></tr>";
      }
    });
    tb.innerHTML = html;
  }

  function renderCards(rows) {
    var box = document.getElementById("cards");
    if (!box) return;
    box.innerHTML = rows.map(function (p) {
      var e = p._e;
      return '<article class="card">' +
        '<div style="display:flex;justify-content:space-between;gap:.6rem;align-items:flex-start">' +
        "<div><h3>" + esc(p.part) + '</h3><span class="pdev">' + esc(p.device) + "</span></div>" +
        '<span class="scoretag ' + scoreClass(p._score) + '">' + zl(p._score) + " zł/h</span></div>" +
        '<div class="kv">' +
        "<span>OEM <b>" + zl(p.oem[0]) + "–" + zl(p.oem[1]) + " zł</b> " + p.conf + "</span>" +
        "<span>cena <b>" + zl(p.price) + " zł</b></span>" +
        "<span>zysk <b>" + zl(e.profit) + " zł</b></span>" +
        "<span>" + esc(p.mat) + " · " + p.g + " g · " + zl(p.h, 1) + " h</span>" +
        "<span>popyt " + dots(p.demand) + "</span>" +
        "</div>" +
        "<details><summary>Uzasadnienie i ryzyko</summary>" +
        "<p>" + esc(p.why) + '</p><p class="wp">⚠ ' + esc(p.warn) + "</p>" +
        (p.src ? '<p><a href="' + esc(p.src) + '" rel="noopener" target="_blank">' + esc(p.srcLabel) + "</a></p>" : "") +
        "</details></article>";
    }).join("");
  }

  function render() {
    var rows = visible();
    renderTable(rows);
    renderCards(rows);
    var c = document.getElementById("count");
    if (c) c.textContent = rows.length + " z " + PARTS.length + " części · sortowanie: " +
      ({ score: "zł/h", price: "cena", oem: "cena OEM", demand: "popyt" }[state.sort]);
  }

  function buildChips() {
    var box = document.getElementById("cats");
    if (!box) return;
    var used = {};
    PARTS.forEach(function (p) { used[p.cat] = (used[p.cat] || 0) + 1; });
    var keys = Object.keys(CATS).filter(function (k) { return used[k]; });
    box.innerHTML = '<button type="button" class="chip is-on" data-cat="all">Wszystkie ' + PARTS.length + "</button>" +
      keys.map(function (k) {
        return '<button type="button" class="chip" data-cat="' + k + '">' + CATS[k] + " " + used[k] + "</button>";
      }).join("");
  }

  /* ---------- kalkulator ---------- */
  function renderCalc() {
    var out = document.getElementById("calc-out");
    if (!out) return;
    var price = parseFloat(document.getElementById("c-price").value) || 0;
    var matKg = parseFloat(document.getElementById("c-mat").value) || 0;
    var grams = parseFloat(document.getElementById("c-g").value) || 0;
    var hours = parseFloat(document.getElementById("c-h").value) || 0;
    var ch = document.getElementById("c-ch").value;
    var shipPaid = document.getElementById("c-ship").value === "1";

    var matCost = (grams / 1000) * matKg * RATE.waste;
    var energy = hours * RATE.energy;
    var ship = shipPaid ? 0 : 12;
    var fee = fees(ch, price);
    var profit = price - matCost - energy - RATE.packaging - fee - ship;
    var perHour = hours > 0 ? profit / hours : 0;
    var breakeven = price > 0 ? (matCost + energy + RATE.packaging + ship) / (price * (1 - (ch === "etsy" ? 0.105 : ch === "allegro" ? 0.08 : 0))) : 0;
    var cls = perHour >= 25 ? "ok" : perHour < 10 ? "bad" : "";

    out.innerHTML =
      '<div><div class="k">Zysk netto / szt.</div><div class="v ' + cls + '">' + zl(profit, 2) + " zł</div></div>" +
      '<div><div class="k">zł na godzinę maszyny</div><div class="v ' + cls + '">' + zl(perHour, 2) + " zł</div></div>" +
      '<div><div class="k">Marża netto</div><div class="v">' + zl(price ? (profit / price) * 100 : 0, 1) + " %</div></div>" +
      '<div><div class="k">Koszt bezczynności</div><div class="v">' + zl(price - profit, 2) + " zł</div></div>" +
      '<div class="wide verdictline">' +
      (perHour >= 25
        ? "Dobry wynik. Próg 25 zł/h maszyny netto oznacza, że przy 8 h druku dziennie jedna drukarka generuje ok. 200 zł zysku — zanim policzysz swój czas na pakowanie."
        : perHour >= 10
        ? "Przeciętnie. To sensowna pozycja uzupełniająca katalog, ale nie produkt, na którym buduje się biznes. Podnieś cenę albo skróć czas druku."
        : "Za nisko. Poniżej 10 zł/h pracy maszyny lepiej włożyć ten czas w inną część — albo sprzedawać w pakiecie, żeby rozłożyć opłaty i pakowanie.") +
      "</div>";
  }

  /* ---------- pozostałe sekcje ---------- */
  function renderDeadEnds() {
    var box = document.getElementById("deadlist");
    if (!box) return;
    box.innerHTML = (window.DEAD_ENDS || []).map(function (d) {
      return '<article class="dead"><h3>' + esc(d.part) + '</h3>' +
        '<div class="price">' + esc(d.price) + "</div>" +
        "<p>" + esc(d.why) + "</p>" +
        '<a href="' + esc(d.src) + '" rel="noopener" target="_blank">' + esc(d.src.replace(/^https?:\/\//, "")) + "</a></article>";
    }).join("");
  }

  function renderSources() {
    var box = document.getElementById("sources");
    if (!box) return;
    box.innerHTML = (window.SOURCES || []).map(function (s) {
      return '<li><a href="' + esc(s[1]) + '" rel="noopener" target="_blank">' + esc(s[0]) + "</a>" +
        "<span>" + esc(s[2]) + "</span></li>";
    }).join("");
  }

  function stamp() {
    var d = new Date();
    var txt = d.toLocaleDateString("pl-PL", { day: "2-digit", month: "long", year: "numeric" });
    var g = document.getElementById("gen-date");
    if (g) g.textContent = txt;
    var f = document.querySelector(".footnote");
    document.querySelectorAll(".footnote").forEach(function (n) {
      if (n.textContent.indexOf("{GEN}") > -1) n.textContent = n.textContent.replace("{GEN}", txt);
    });
  }

  /* ---------- zdarzenia ---------- */
  document.addEventListener("click", function (ev) {
    var chip = ev.target.closest(".chip");
    if (chip) {
      state.cat = chip.getAttribute("data-cat");
      document.querySelectorAll(".chip").forEach(function (c) { c.classList.toggle("is-on", c === chip); });
      render();
      return;
    }
    var s = ev.target.closest(".sort");
    if (s) {
      state.sort = s.getAttribute("data-sort");
      document.querySelectorAll(".sort").forEach(function (b) { b.classList.toggle("is-on", b === s); });
      render();
      return;
    }
    var row = ev.target.closest("tr[data-id]");
    if (row && !ev.target.closest("a")) {
      var id = row.getAttribute("data-id");
      state.open[id] = !state.open[id];
      render();
    }
  });

  document.addEventListener("keydown", function (ev) {
    if (ev.key !== "Enter" && ev.key !== " ") return;
    var row = document.activeElement && document.activeElement.closest("tr[data-id]");
    if (!row) return;
    ev.preventDefault();
    var id = row.getAttribute("data-id");
    state.open[id] = !state.open[id];
    render();
    var again = document.querySelector('tr[data-id="' + id + '"]');
    if (again) again.focus();
  });

  document.addEventListener("input", function (ev) {
    if (ev.target.id === "q") {
      state.q = ev.target.value;
      render();
    }
    if (ev.target.closest("#calc")) renderCalc();
  });
  document.addEventListener("change", function (ev) {
    if (ev.target.closest("#calc")) renderCalc();
  });

  buildChips();
  renderStats();
  render();
  renderCalc();
  renderDeadEnds();
  renderSources();
  stamp();
})();
