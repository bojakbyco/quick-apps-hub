/* Ceny materiałów: zł/kg brutto (założenie rynkowe: Bambu Lab i odpowiedniki). */
window.MATERIALS = {
  "PLA": 80, "PETG": 95, "PETG-CF": 165, "ABS": 110, "ASA": 120,
  "PA-CF": 280, "PAHT-CF": 300, "PC": 200, "TPU 95A": 150, "TPU 90A": 175
};

/* Koszt energii: X2D ok. 0,12 kWh/h × 0,95 zł/kWh ≈ 1 zł/h (założenie). */
window.RATE = { energy: 1.0, packaging: 6, waste: 1.15 };

/* conf: W = cena OEM potwierdzona źródłem, E = szacunek.
   oem: widełki cen OEM w zł. price: sugerowana cena sprzedaży detalicznej w zł. */
window.PARTS = [
  {id:"lens-hood", cat:"foto", part:"Osłona przeciwsłoneczna", device:"Canon EW-88B (TS-E 24, 24-70 L)",
   oem:[250,290], conf:"W", src:"https://www.usa.canon.com/shop/p/lens-hood-ew-88b",
   srcLabel:"Canon USA: 66,99 USD (B&H 46,95 USD)", mat:"ABS", g:28, h:1.2, price:79,
   demand:3, ease:5, risk:3, repeat:3,
   why:"Canon liczy 66,99 USD. Wydruk to ok. 3 zł materiału. Klient z obiektywem za 6 tys. zł nie negocjuje 79 zł.",
   warn:"Kształt bywa chroniony wzorem. Zaprojektuj własną geometrię, bez logotypów, w tytule tylko „pasuje do”."},

  {id:"qr-plate", cat:"foto", part:"Płyta szybkozłączki Arca-Swiss", device:"Statywy Arca / Manfrotto",
   oem:[70,200], conf:"E", src:"", srcLabel:"szacunek rynkowy", mat:"PA-CF", g:40, h:1.5, price:69,
   demand:3, ease:4, risk:3, repeat:4,
   why:"Płyta gubi się najczęściej z całego osprzętu. Standard Arca pasuje do dziesiątek statywów, więc jeden projekt obsługuje szeroki rynek.",
   warn:"Test nośności obowiązkowy. Aparat za 5 tys. zł nie może spaść przez wydruk — dodaj metalową śrubę i smycz."},

  {id:"dji-cover", cat:"foto", part:"Osłona gimbala", device:"DJI Mini 3/4, Air 3",
   oem:[80,200], conf:"E", src:"", srcLabel:"szacunek rynkowy", mat:"TPU 95A", g:25, h:1.5, price:49,
   demand:4, ease:4, risk:3, repeat:3,
   why:"OEM osłona bywa tylko w serwisie, a pęka przy każdym transporcie. Dron za 4 tys. zł, osłona za 49 zł — decyzja natychmiastowa.",
   warn:"Nie zasłaniaj czujników, wentylacji i śmigieł. Nie obiecuj ochrony przed upadkiem — tylko transport."},

  {id:"sony-hinge", cat:"audio", part:"Zawias / pałąk", device:"Sony WH-1000XM4 / XM5",
   oem:[330,420], conf:"W", src:"https://www.etsy.com/market/headphones_hinge",
   srcLabel:"naprawa pałąka ok. 99 USD; listingi Etsy 9,99 USD, 1,2 tys. opinii", mat:"PA-CF", g:22, h:2.0, price:69,
   demand:5, ease:4, risk:2, repeat:4,
   why:"Najlepiej udokumentowany popyt w całej tabeli: listing naprawy zawiasu na Etsy ma 1,2 tys. opinii przy cenie 9,99 USD. Plastik pęka, elektronika zostaje sprawna.",
   warn:"Osobne SKU dla XM4 i XM5 — inna grubość sworznia. Nie sprzedawaj jako „oryginał”, tylko część zamienna."},

  {id:"bose-hinge", cat:"audio", part:"Zawias muszli (L/P)", device:"Bose QC35 / QC45",
   oem:[120,200], conf:"E", src:"", srcLabel:"szacunek rynkowy", mat:"PA-CF", g:15, h:1.5, price:55,
   demand:5, ease:4, risk:2, repeat:4,
   why:"Zawias pęka przy rozciąganiu, a Bose nie sprzedaje go osobno. Zamienniki na Etsy schodzą po 15–30 USD.",
   warn:"QC35 i QC45 mają inne sworznie i tłumiki — dwa projekty, nie jeden uniwersalny."},

  {id:"hyperx-fork", cat:"audio", part:"Widelec zawiasu", device:"HyperX Cloud II / Cloud X",
   oem:[100,180], conf:"E", src:"", srcLabel:"szacunek rynkowy", mat:"PA-CF", g:12, h:1.2, price:45,
   demand:4, ease:5, risk:2, repeat:5,
   why:"Metalowy pałąk przeżywa plastikowy widelec. Wymiana samego widelca ratuje słuchawki za 400 zł — najlepszy stosunek wartości do kosztu w audio.",
   warn:"Luz sworznia 0,2 mm. Za ciasno — pęka przy zakładaniu; za luźno — muszla lata."},

  {id:"steelseries-band", cat:"audio", part:"Pałąk wewnętrzny", device:"SteelSeries Arctis 7 / 9 / Nova",
   oem:[150,260], conf:"E", src:"", srcLabel:"szacunek rynkowy", mat:"PETG", g:30, h:2.0, price:65,
   demand:4, ease:4, risk:2, repeat:4,
   why:"Serwis wymienia całe słuchawki, więc użytkownicy szukają części na forach. Pałąk to najsłabszy punkt konstrukcji.",
   warn:"Długi element — drukuj w orientacji poziomej lub dzielony, inaczej warstwy pękają przy zginaniu."},

  {id:"hose-adapter", cat:"narzedzia", part:"Adapter odciągu 27/36 mm", device:"Festool / Makita / Bosch",
   oem:[100,150], conf:"W", src:"https://www.etsy.com/listing/4298612818/dust-extractor-hose-adapter-for-festool",
   srcLabel:"aktywny listing Etsy: 20,79 USD", mat:"PETG", g:22, h:0.8, price:59,
   demand:5, ease:5, risk:1, repeat:4,
   why:"Najlepszy stosunek marży do ryzyka w raporcie. Aktywny listing Etsy po 20,79 USD potwierdza, że rynek płaci za przejściówkę, której producent nie robi.",
   warn:"Tolerancja 0,2 mm decyduje o szczelności. Mierz suwmiarką króciec i gwint, nie po zdjęciu z internetu."},

  {id:"battery-adapter", cat:"narzedzia", part:"Adapter akumulatorów", device:"Makita ↔ Parkside / DeWalt",
   oem:[90,220], conf:"E", src:"", srcLabel:"szacunek rynkowy", mat:"PA-CF", g:55, h:3.0, price:99,
   demand:4, ease:3, risk:4, repeat:3,
   why:"Oryginalne adaptery są drogie lub nie istnieją. Wysoka cena, ale też najwyższe ryzyko w tabeli.",
   warn:"Ryzyko prądowe i pożarowe. Sprzedawaj jako obudowę bez styków, z ostrzeżeniem, bez deklaracji bezpieczeństwa."},

  {id:"saw-insert", cat:"narzedzia", part:"Wkładka stołu pilarki", device:"Makita / Bosch / DeWalt",
   oem:[80,180], conf:"E", src:"", srcLabel:"szacunek rynkowy", mat:"PETG", g:40, h:1.5, price:59,
   demand:3, ease:4, risk:1, repeat:3,
   why:"Wkładka zużywa się przy każdym cięciu, a oryginał jest drogi i trudno dostępny w wersji pod wąską szczelinę.",
   warn:"Musi być równo z blatem — szlifuj po wydruku. Wystająca wkładka zakleszcza materiał."},

  {id:"drill-guide", cat:"narzedzia", part:"Prowadnica wiertła", device:"Wiertarki ręczne (uniwersalna)",
   oem:[60,150], conf:"E", src:"", srcLabel:"szacunek rynkowy", mat:"PETG", g:60, h:2.5, price:69,
   demand:3, ease:4, risk:1, repeat:3,
   why:"Sprzedaje się jako akcesorium, nie część awaryjna — większy rynek i mniejsza presja cenowa.",
   warn:"Bez metalowych tulei otwór rozbija się po 20 użyciach. Tuleje w zestawie to warunek sensu produktu."},

  {id:"garmin-mount", cat:"rower", part:"Uchwyt out-front", device:"Garmin Edge / Wahoo",
   oem:[150,220], conf:"W", src:"https://www.garmin.com/en-US/p/114881/",
   srcLabel:"Garmin: oryginał z wysyłką 40–50 USD", mat:"PA-CF", g:20, h:1.0, price:55,
   demand:5, ease:5, risk:3, repeat:5,
   why:"Uchwyt pęka przy upadku, licznik zostaje. Popyt stały, produkt prosty, a wersje „flush” i „adjustable” to osobne SKU.",
   warn:"Ryzyko zgubienia sprzętu. Test 3× obciążenia i smycz w zestawie — jedna reklamacja zjada dziesięć sprzedaży."},

  {id:"ninebot-fender", cat:"rower", part:"Błotnik tylny", device:"Ninebot Max G30",
   oem:[80,200], conf:"E", src:"", srcLabel:"szacunek rynkowy", mat:"ASA", g:70, h:4.0, price:75,
   demand:4, ease:4, risk:2, repeat:3,
   why:"Pęka po uderzeniu, a hulajnoga jest sprawna. Duży, widoczny element — klient kupuje wygląd, nie tylko funkcję.",
   warn:"Cienki element: 4 obrysy + ASA. PETG odkształca się na słońcu i błotnik „siada” po sezonie."},

  {id:"chain-guard", cat:"rower", part:"Osłona łańcucha", device:"Rowery miejskie / e-bike",
   oem:[60,150], conf:"E", src:"", srcLabel:"szacunek rynkowy", mat:"PETG", g:50, h:2.5, price:55,
   demand:3, ease:4, risk:1, repeat:3,
   why:"Osłona pęka przy przewrotce, a OEM sprzedaje ją z całym zestawem napędowym.",
   warn:"Niska pilność zakupu. Sprzedawaj w zestawie z błotnikiem — pojedynczo nie wygrywa z AliExpress."},

  {id:"dyson-catch", cat:"odkurzacze", part:"Zatrzask / pokrywa kosza", device:"Dyson V10 / V11 / V15",
   oem:[180,260], conf:"W", src:"https://www.dyson.com/support/journey/spare-details.970423-01",
   srcLabel:"Dyson: cały kosz 59,99 USD", mat:"ABS", g:25, h:1.2, price:45,
   demand:5, ease:5, risk:2, repeat:4,
   why:"Dyson sprzedaje cały kosz za 59,99 USD, choć psuje się sam zatrzask. Klasyczna luka: producent nie sprzedaje podzespołu.",
   warn:"Luz 0,3 mm — inaczej pokrywa się nie domyka i klient zwraca. Testuj na trzech egzemplarzach."},

  {id:"dyson-wand-clip", cat:"odkurzacze", part:"Klips różdżki", device:"Dyson V8 / V10 / V11",
   oem:[60,150], conf:"E", src:"", srcLabel:"szacunek rynkowy", mat:"PETG", g:12, h:0.8, price:30,
   demand:4, ease:5, risk:2, repeat:4,
   why:"Klips pęka, a OEM sprzedaje całą rurę. Bardzo tani wydruk, wysyłka listem.",
   warn:"V8, V10 i V11 mają różne średnice — trzy SKU. Jeden „uniwersalny” projekt generuje zwroty."},

  {id:"roomba-wheel", cat:"odkurzacze", part:"Obudowa modułu koła", device:"iRobot Roomba i / j / e",
   oem:[100,200], conf:"E", src:"", srcLabel:"szacunek rynkowy", mat:"PETG", g:45, h:2.5, price:65,
   demand:4, ease:3, risk:2, repeat:4,
   why:"Moduł koła to 40–45 USD. Po zalaniu pęka obudowa, a silnik i przekładnia zostają sprawne.",
   warn:"Sprzedawaj samą obudowę z instrukcją przełożenia silnika. Nie obiecuj wodoodporności."},

  {id:"fridge-shelf", cat:"agd", part:"Wspornik półki drzwi", device:"Lodówki Bosch / Samsung / Whirlpool",
   oem:[150,350], conf:"E", src:"", srcLabel:"szacunek rynkowy (USA: do 92 USD)", mat:"PETG", g:30, h:2.0, price:45,
   demand:4, ease:4, risk:2, repeat:3,
   why:"W USA wspornik potrafi kosztować 92 USD, w Polsce 150–350 zł, a to 30 g PETG. Klient płaci za dostępność.",
   warn:"Nośność: min. 4 obrysy, 40% wypełnienia, test 5 kg przez 24 h. Sprawdź cenę OEM — jeśli 30 zł, odpuść."},

  {id:"dryer-catch", cat:"agd", part:"Zaczep / zawias drzwi", device:"Suszarki Bosch / Beko / Electrolux",
   oem:[90,220], conf:"E", src:"", srcLabel:"szacunek rynkowy", mat:"ASA", g:20, h:1.5, price:45,
   demand:4, ease:3, risk:2, repeat:3,
   why:"Zaczep blokuje pracę całej suszarki, a dla starszych modeli OEM bywa wycofany. Alternatywą klienta jest nowa suszarka.",
   warn:"Temperatura i cykle: tylko ASA, nie PLA. Test 200 otwarć przed sprzedażą."},

  {id:"automower-wheel", cat:"ogrod", part:"Koło napędowe", device:"Husqvarna Automower 305–450",
   oem:[180,400], conf:"E", src:"https://www.gplshop.co.uk/en/spare-parts-robotic-lawn-mower/wheels-tires-husqvarna-automower/",
   srcLabel:"GPLshop: koła i opony Automower", mat:"TPU 95A + PETG", g:180, h:7.0, price:149,
   demand:4, ease:3, risk:3, repeat:3,
   why:"Bieżnik zużywa się po 2–3 sezonach, a OEM zmienia modele. Koło to 180–400 zł, a druk ok. 35 zł.",
   warn:"Moment obrotowy i masa: inserty metalowe na oś obowiązkowe. Sprawdź średnicę osi dla konkretnego modelu."},

  {id:"dolphin-tracks", cat:"ogrod", part:"Gąsienice (para)", device:"Maytronics Dolphin M400 / Sigma",
   oem:[130,270], conf:"W", src:"https://www.maytronics.com/en-us/store/parts-and-accessories/tracks/tracks-grey-2pk-m/9985",
   srcLabel:"Maytronics: 34,99 USD para (sklep zewn. 64,98 USD)", mat:"TPU 90A", g:140, h:5.0, price:99,
   demand:3, ease:3, risk:2, repeat:3,
   why:"Para gąsienic to 34,99–64,98 USD i starzeje się w chlorowanej wodzie. Wymiana jest trywialna dla klienta.",
   warn:"Zbyt sztywne TPU spada z rolek. Strojenie twardości to połowa sukcesu — kup 90A i 95A, testuj oba."},

  {id:"mower-dock", cat:"ogrod", part:"Obudowa stacji dokującej", device:"Roboty koszące (wybrane modele)",
   oem:[90,220], conf:"E", src:"", srcLabel:"szacunek rynkowy", mat:"ASA", g:60, h:2.5, price:69,
   demand:3, ease:3, risk:3, repeat:3,
   why:"Obudowa pęka na mrozie i przy najechaniu, a stacja działa. Element duży i widoczny — dobra marża na gram.",
   warn:"ASA + test UV. Nie zmieniaj geometrii styków ładowania — to warunek, że robot w ogóle dokuje."},

  {id:"stroller-wheel", cat:"dom", part:"Koło wózka", device:"Bugaboo Fox / Donkey / Buffalo",
   oem:[270,500], conf:"W", src:"https://www.bugaboo.com/fi-en/parts/wheels/",
   srcLabel:"Bugaboo: 64–119 EUR za koło", mat:"TPU 95A + PA-CF", g:90, h:4.0, price:129,
   demand:4, ease:3, risk:3, repeat:3,
   why:"Bugaboo liczy 64–119 EUR za jedno koło. Rodzic z wózkiem za 4 tys. zł płaci za naprawę od ręki, nie za plastik.",
   warn:"Bezpieczeństwo dziecka: sprzedawaj wyłącznie koło, nigdy hamulec ani element nośny ramy. Test 30 kg."},

  {id:"armrest-pad", cat:"dom", part:"Podłokietnik fotela", device:"Herman Miller / IKEA Markus",
   oem:[100,260], conf:"E", src:"", srcLabel:"szacunek rynkowy", mat:"TPU 95A", g:80, h:4.0, price:79,
   demand:4, ease:4, risk:1, repeat:3,
   why:"Skóra się przeciera, a nowy podłokietnik to 150–260 zł. Montaż na dwie śruby, klient robi to sam.",
   warn:"Element widoczny: wykończenie i kolor ważniejsze niż wytrzymałość. Kup TPU w trzech odcieniach czerni."},

  {id:"toilet-hinge", cat:"dom", part:"Zawias deski", device:"Deski sedesowe (wybrane modele)",
   oem:[80,200], conf:"E", src:"", srcLabel:"szacunek rynkowy", mat:"PA-CF", g:35, h:2.0, price:55,
   demand:3, ease:4, risk:3, repeat:3,
   why:"Plastikowy zawias pęka, a nowa deska to 150–300 zł. Prostota montażu i natychmiastowa dostępność.",
   warn:"Element nośny: test 100 kg. Nie sprzedawaj do toalet publicznych — inna odpowiedzialność."},

  {id:"trim-clips", cat:"auto", part:"Zestaw klipsów tapicerki", device:"Konkretny model auta (nie „uniwersalne”)",
   oem:[30,150], conf:"E", src:"", srcLabel:"szacunek rynkowy", mat:"PA-CF", g:10, h:0.6, price:39,
   demand:4, ease:5, risk:2, repeat:5,
   why:"Klipsy pękają przy każdym demontażu, a zestaw 20 szt. kosztuje 39 zł. Sprzedaż pakietowa podnosi wartość koszyka bez pracy.",
   warn:"Nie konkuruj z AliExpress na pojedynczych sztukach — wygrywasz doborem modelu, opisem i wysyłką w 24 h."},

  {id:"visor-clip", cat:"auto", part:"Klips osłony przeciwsłonecznej", device:"VW / Skoda / BMW (wybrane roczniki)",
   oem:[50,150], conf:"E", src:"", srcLabel:"szacunek rynkowy", mat:"ASA", g:8, h:0.7, price:29,
   demand:4, ease:5, risk:2, repeat:4,
   why:"Klips pęka i osłona wisi. Naprawa w 2 minuty, a część bywa niedostępna w ASO dla starszych roczników.",
   warn:"Mała wartość: wysyłka listem, pakuj po 2 szt. Inaczej opłaty zjadają marżę."},

  {id:"oldtimer-part", cat:"auto", part:"Element „unobtainium”", device:"Youngtimery / oldtimery (zlecenie)",
   oem:[250,800], conf:"E", src:"https://oldtimerstudio.com/3d-printed-parts",
   srcLabel:"Oldtimer Studio: projekt 80–400 EUR + druk 150–350 EUR", mat:"ABS", g:45, h:3.0, price:250,
   demand:2, ease:2, risk:3, repeat:2,
   why:"Najwyższa marża w raporcie, ale to usługa, nie produkt: skan lub modelowanie + wydruk. Wzorzec rynkowy: 80–400 EUR za sam projekt.",
   warn:"Niski wolumen i wysokie ryzyko nietrafionego kształtu. Bierz zaliczkę na projekt, druk rozliczaj osobno."},

  {id:"rc-arm", cat:"hobby", part:"Wahacz zawieszenia", device:"Arrma / Traxxas 1:10",
   oem:[50,150], conf:"E", src:"", srcLabel:"szacunek rynkowy", mat:"PA-CF", g:25, h:2.0, price:45,
   demand:4, ease:3, risk:3, repeat:4,
   why:"Wahacz pęka przy każdym kontakcie, a w hobby shopach wiecznie brakuje części. Klient kupuje po 2–3 pary.",
   warn:"Klienci wymagają wytrzymałości — PETG odpada. Testuj na skokach; dobierz wypełnienie i obrysy."},

  {id:"b2b-guard", cat:"b2b", part:"Osłona / gałka maszynowa", device:"Maszyny produkcyjne (zlecenie)",
   oem:[200,600], conf:"E", src:"", srcLabel:"szacunek rynkowy", mat:"PA-CF", g:80, h:5.0, price:350,
   demand:3, ease:3, risk:2, repeat:2,
   why:"Producent każe czekać tygodniami i żąda 400–600 zł. Zakład płaci od razu, jeśli część wstrzymuje linię. Najwyższa wartość zlecenia.",
   warn:"B2B: faktura, VAT, odpowiedzialność za przestój. Potrzebna wizyta i kontakt, nie listing na Etsy."},

  {id:"cable-chain", cat:"b2b", part:"Ogniwo prowadnicy kablowej", device:"Maszyny CNC / automatyka",
   oem:[150,400], conf:"E", src:"", srcLabel:"szacunek rynkowy", mat:"PA-CF", g:60, h:4.0, price:250,
   demand:2, ease:3, risk:2, repeat:2,
   why:"Pęka pojedyncze ogniwo, a producent sprzedaje cały łańcuch. Wysoka wartość zlecenia i naturalna powtarzalność — te same maszyny wracają.",
   warn:"Klient przemysłowy wymaga powtarzalności wymiaru i karty materiału. Zapisuj partie filamentu."}
];

/* Części, których NIE warto drukować — z potwierdzonymi cenami rynkowymi. */
window.DEAD_ENDS = [
  {part:"Tacka ociekowa De'Longhi Dedica EC685", price:"3,90 EUR (ok. 17 zł)",
   src:"https://brewive.com/p/tray-for-delonghi-dedica-ec-685-coffee-machines",
   why:"Nowa część klasy OEM za 17 zł. Konkurentem jest magazyn, nie producent."},
  {part:"Rączka węża Miele S500–S5000", price:"19,90–21,99 zł (zamiennik)",
   src:"https://allegro.pl/produkt/raczka-uchwyt-weza-do-odkurzacza-miele-s500-s700-s800-s4000-s5000",
   why:"Chiński zamiennik ustawia cenę podłogową. Po opłatach i wysyłce marża wynosi zero."},
  {part:"Kółko kosza zmywarki Bosch", price:"5,90 zł/szt OEM; zestaw 8 szt. 44 zł",
   src:"https://expertagd.pl/kolko-kosza-dolnego-zmywarki-bosch-00611475-611475-zam",
   why:"Klasyk z poradników „wydrukuj i sprzedaj” — w Polsce oryginał kosztuje 5,90 zł."},
  {part:"Uchwyt portafiltra Gaggia", price:"8,08 USD",
   src:"https://www.wholelattelove.com/products/portafilter-handle-and-end-cap",
   why:"Element za 8 dolarów z magazynu w USA. Druk ma sens tylko jako dizajn, nie zamiennik."},
  {part:"Uchwyt drzwi pralki Bosch", price:"29,90 zł OEM",
   src:"https://expertagd.pl/uchwyt-raczka-drzwi-pralki-bosch-00751782",
   why:"Dokładnie ten przykład „drogiego plastiku” z branżowych poradników. W Polsce kosztuje 30 zł."}
];

window.SOURCES = [
  ["Bambu Lab X2D — specyfikacja", "https://bambulab.com/en-us/x2d/specs", "dysza 300 °C, stal hartowana, 256×256×260 mm"],
  ["Bambu Lab X2D — zgodność filamentów", "https://wiki.bambulab.com/en/x2d/manual/filament-compatibility", "PA-CF/PPA-CF od 0,4 mm; PPS-CF niedostępny"],
  ["EUIPO — nowy reżim wzorów od 1.07.2026", "https://www.euipo.europa.eu/en/news/design-law-aficionados-beware-a-new-era-is-about-to-begin-", "klauzula naprawy od 1.05.2025, zakaz udostępniania plików 3D"],
  ["Maytronics — gąsienice Dolphin", "https://www.maytronics.com/en-us/store/parts-and-accessories/tracks/tracks-grey-2pk-m/9985", "34,99 USD za parę"],
  ["Bugaboo — części i koła", "https://www.bugaboo.com/fi-en/parts/wheels/", "64–119 EUR za koło"],
  ["Canon — osłona EW-88B", "https://www.usa.canon.com/shop/p/lens-hood-ew-88b", "66,99 USD"],
  ["Dyson — kosz 970423-01", "https://www.dyson.com/support/journey/spare-details.970423-01", "59,99 USD za cały kosz"],
  ["Etsy — adapter odciągu Festool", "https://www.etsy.com/listing/4298612818/dust-extractor-hose-adapter-for-festool", "aktywny listing 20,79 USD"],
  ["Etsy — naprawa zawiasu słuchawek", "https://www.etsy.com/market/headphones_hinge", "9,99 USD, 1,2 tys. opinii"],
  ["biznes.gov.pl — działalność nierejestrowana", "https://www.biznes.gov.pl/pl/portal/00115", "10 813,50 zł/kwartał w 2026"],
  ["Etsy — opłaty (Polska)", "https://growtsy.com/etsy-fees/poland", "6,5% + 4% + 0,30 EUR + 0,20 USD za listing"],
  ["Limit zwolnienia z VAT", "https://businessinsider.com.pl/prawo/podatki/limit-zwolnienia-z-vat-wzrosl-do-240-tys-zl-k", "240 tys. zł od 1.01.2026 (było 200 tys.)"]
];
