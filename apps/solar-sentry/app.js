/* Solar Sentry — kalkulatory i interakcje */
(function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };
  var fmt = function (n, d) { return n.toFixed(d !== undefined ? d : 1); };

  /* ---- Tabs: ESP32 vs kamera IP ---- */
  var tabs = document.querySelectorAll(".tab");
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) { t.classList.remove("active"); t.setAttribute("aria-selected", "false"); });
      document.querySelectorAll(".tab-panel").forEach(function (p) { p.classList.remove("active"); });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");
      $("panel-" + tab.dataset.tab).classList.add("active");
    });
  });

  /* ---- Pomocnik: slider + output + callback ---- */
  function bind(id, out, fn) {
    var el = $(id), o = $(out);
    el.addEventListener("input", function () { o.textContent = fn(el.value); });
    el.dispatchEvent(new Event("input"));
  }

  /* ================= ESP32 + PIR ================= */
  var V_SYS = 3.7, EFF = 0.85; // tor zasilania

  function seasonDays() {
    // kWh/m²/dzień: lato ~3.5, zima ~0.7; kWh efektywne/dzień = Wh * eff
    return $("season").value === "0" ? 3.5 : 0.7;
  }

  function espCalc() {
    var events = +$("events").value;
    var active = +$("active").value;
    var sound = +$("sound").value;
    var sleepUA = +$("sleep").value;
    var panelW = +$("panel").value;

    var sleepA = sleepUA / 1e6;
    var daySleepAh = sleepA * 24;
    var burstAh = (0.250 * active / 3600) * events;            // kamera + wifi
    var soundAh = (0.500 * sound / 3600) * events;             // głośnik
    var totalAh = (daySleepAh + burstAh + soundAh) / EFF;      // sprawność toru

    var panelEff = seasonDays() * 0.3;                          // 25-40% znamionowej
    var solarAh = panelW * panelEff / V_SYS;

    var cellAh = 3.0;                                           // 18650 3000 mAh
    var days;
    if (solarAh >= totalAh) {
      days = Infinity;                                          // panel pokrywa całe zużycie
    } else {
      days = cellAh / Math.max(totalAh - solarAh, 1e-6);
    }

    $("esp-day").textContent = fmt(totalAh * 1000, 1) + " mAh/dobę";
    $("esp-solar").textContent = fmt(solarAh * 1000, 0) + " mAh/dobę" + (panelW === 0 ? " (brak panelu)" : "");
    $("esp-days").textContent = isFinite(days)
      ? fmt(days, 1) + " dni (1 ogniwo 3000 mAh)"
      : "∞ — panel pokrywa całe dobowe zużycie";

    var verdict;
    if (totalAh < 0.05) verdict = "Śmiech — to ~" + fmt(totalAh * 1000, 0) + " mAh/dobę: setki dni na baterii bez słońca. Świetny projekt dla PIR.";
    else if (totalAh < 0.4) verdict = "Bardzo dobry budżet: " + fmt(totalAh * 1000, 0) + " mAh/dobę — panel 6 W z nadwyżką nadąża, zapas na 3–7 pochmurnych dni.";
    else if (totalAh < 1.5) verdict = "Umiarkowanie: " + fmt(totalAh * 1000, 0) + " mAh/dobę — rozważ panel 10 W i 2× 18650 (lub mniej odtwarzania dźwięku).";
    else verdict = "Za dużo: " + fmt(totalAh * 1000, 0) + " mAh/dobę — ogranicz czas dźwięku i liczbę zdarzeń albo przejdź na tryb „zdjęcie zamiast klipu”.";
    $("esp-verdict").textContent = verdict;
  }

  bind("events", "o-events", function (v) { espCalc(); return v; });
  bind("active", "o-active", function (v) { espCalc(); return v + " s"; });
  bind("sound", "o-sound", function (v) { espCalc(); return v + " s"; });
  bind("sleep", "o-sleep", function (v) { espCalc(); return v < 1000 ? v + " µA" : fmt(v / 1000, 1) + " mA"; });
  bind("panel", "o-panel", function (v) { espCalc(); return v + " W"; });
  bind("season", "o-season", function (v) { espCalc(); return v === "0" ? "lato" : "zima"; });

  /* ================= Kamera IP ================= */
  function ipCalc() {
    var w = +$("ipw").value;
    var h = +$("iph").value;
    var v = +$("ipv").value;
    var days = +$("ipd").value;
    var lipo = $("iptype").value === "1";

    var whDay = w * h;                       // Wh/dobę
    var dod = lipo ? 0.5 : 0.8;              // LiFePO4 do 80% DoD, kwasowy 50%
    var ah = whDay * days / v / dod;         // pojemność
    var panel = whDay / 0.12;                // grudzień PL: panel daje ~12% mocy znamionowej w ciągu dnia

    $("ip-wh").textContent = fmt(whDay, 0) + " Wh/dobę";
    $("ip-ah").textContent = "~" + fmt(ah, 1) + " Ah @" + fmt(v, 1) + " V" + (days > 1 ? " (" + days + " dni autonomii)" : "");
    $("ip-panel").textContent = "~" + fmt(panel, 0) + " W";

    var verdict;
    if (whDay <= 25) verdict = "Jeszcze realne off-grid (mała kamera ~2 W, tryb oszczędny).";
    else if (whDay <= 80) verdict = "Robisz z tego fotopułapkę: 10–20 W panelu i ~10 Ah 12 V. Kabel byłby tańszy.";
    else verdict = "Kosztowne: akumulator " + fmt(ah, 1) + " Ah i panel ~" + fmt(panel, 0) + " W to wydatek ~" + fmt(panel * 3 + ah * 30, 0) + "+ zł. ESP32+PIR robi to za ułamek.";
    $("ip-verdict").textContent = verdict;
  }

  bind("ipw", "o-ipw", function (v) { ipCalc(); return v + " W"; });
  bind("iph", "o-iph", function (v) { ipCalc(); return v + " h"; });
  bind("ipv", "o-ipv", function (v) { ipCalc(); return v + " V"; });
  bind("ipd", "o-ipd", function (v) { ipCalc(); return v + " dni"; });
  bind("iptype", "o-iptype", function (v) { ipCalc(); return v === "0" ? "LiFePO₄ (DoD 80%)" : "Kwasowy (DoD 50%)"; });

  /* ================= Koszty ================= */
  function costCalc() {
    var bom = +$("bom").value;
    var asm = +$("asm").value / 100;
    var marza = +$("marza").value / 100;

    var make = bom * (1 + asm);
    var net = make * (1 + marza);
    var gross = net * 1.23;

    $("cost-make").textContent = fmt(make, 0) + " zł";
    $("cost-net").textContent = fmt(net, 0) + " zł";
    $("cost-gross").textContent = fmt(gross, 0) + " zł";

    var v;
    if (gross < 500) v = "Tanio — możesz przebić fotopułapki 4G, ale sprawdź, czy marża pokrywa serwis i logistykę.";
    else if (gross <= 1350) v = "Realna półka cenowa (fotopułapka 4G: 680–1000 zł bez odstraszania). Sprzedawaj wartość = monitoring + push + dźwięk.";
    else if (gross <= 2000) v = "Rynkowo wysoko; uzasadnij 4G + AI rozpoznawania gatunków + gwarancją 2 lata.";
    else v = "Powyżej rynku: albo wersja Pro z 4G, zintegrowanym AI i aplikacją abonamentową, albo obniż marżę.";
    $("cost-verdict").textContent = v;
  }

  bind("bom", "o-bom", function (v) { costCalc(); return v + " zł"; });
  bind("asm", "o-asm", function (v) { costCalc(); return v + "%"; });
  bind("marza", "o-marza", function (v) { costCalc(); return v + "%"; });

  espCalc(); ipCalc(); costCalc();
})();