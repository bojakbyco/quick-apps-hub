// Dane modeli — pola: name, price(średnia zł), press(0 brak/1 tak), hook(w wahadłowy/r rotacyjny),
// weight(kg), power(W), spm(ściegów/min), stitches, rating(0-5), opinions, note
const MODELS = [
  {name:"Bernette Sew&Go 3", price:598, press:1, hook:"wahadłowy", weight:6.0, power:70, spm:750, stitches:15, rating:4.8, opinions:"5/5, 5 lat gwar.", note:"Jedyna marka z dociskiem w najniższym budżecie; gwarancja door-to-door (Bernina)."},
  {name:"Bernette Sew&Go 5", price:823, press:1, hook:"wahadłowy", weight:6.0, power:70, spm:850, stitches:23, rating:5.0, opinions:"5/5 (Allegro)", note:"8 warstw weluru tapicerskiego wg dystrybutora; automatyczna dziurka."},
  {name:"Singer HD 4411", price:840, press:0, hook:"wahadłowy", weight:6.0, power:60, spm:1100, stitches:11, rating:4.5, opinions:"4,5/5", note:"Klasa Heavy Duty, ale brak regulacji docisku."},
  {name:"Singer HD 4423", price:900, press:1, hook:"wahadłowy", weight:6.7, power:60, spm:1100, stitches:23, rating:4.7, opinions:"4,6–4,8/5", note:"Najtańsze wejście w HD: 1100/min, metalowa rama; bywa głośna."},
  {name:"Singer HD 4432", price:1000, press:1, hook:"wahadłowy", weight:7.0, power:60, spm:1100, stitches:32, rating:4.2, opinions:"4,2/5 (US)", note:"Dodaje ściegi względem 4423, nie moc."},
  {name:"Janome HD523", price:1220, press:1, hook:"wahadłowy", weight:7.2, power:60, spm:860, stitches:23, rating:4.94, opinions:"4,94/5 (355 rec.)", note:"4-stopn. docisk, 6 lat gwarancji, cicha; pewniak na grube materiały.", best:true},
  {name:"Janome 423S", price:1100, press:1, hook:"wahadłowy", weight:7.0, power:60, spm:860, stitches:23, rating:4.5, opinions:"4,5+/5, 6 lat gwar.", note:"Schodzi z rynku — końcówki serii."},
  {name:"Juki HZL-27Z", price:990, press:0, hook:"wahadłowy", weight:5.9, power:60, spm:610, stitches:27, rating:4.9, opinions:"4,9/5 (107 opinii)", note:"Świetna jakość ściegu, ale brak docisku i tylko 610/min."},
  {name:"Redstar R30S", price:700, press:0, hook:"rotacyjny", weight:7.5, power:70, spm:800, stitches:23, rating:4.0, opinions:"pozytywne, mało", note:"Chwytacz rotacyjny i waga, ale brak regulacji docisku."},
  {name:"Minerva Next 363D II", price:635, press:1, hook:"wahadłowy", weight:6.0, power:60, spm:850, stitches:36, rating:5.0, opinions:"5/5 (ME 30, Allegro 46)", note:"Kultowa rodzina 363: dziurka 4-krok., nawlekacz, LED."},
  {name:"Minerva M832B", price:649, press:1, hook:"wahadłowy", weight:6.0, power:60, spm:850, stitches:36, rating:4.95, opinions:"4,9–5/5 (~95 opinii)", note:"Następca Next 363 — najwięcej maszyny za złotówkę w zestawieniu.", best:true},
  {name:"Minerva HS1000", price:954, press:1, hook:"rotacyjny", weight:6.9, power:100, spm:850, stitches:34, rating:4.6, opinions:"4,6/5 (Allegro 32)", note:"Pełny metal, silnik servo 100 W, 7-punktowy transport, dziurka 1-stopn., ścieg do 6 mm, stopka pływająca w zestawie."},
  {name:"Janome 1522", price:855, press:1, hook:"wahadłowy", weight:6.5, power:60, spm:860, stitches:25, rating:4.9, opinions:"4,9/5 (Ceneo 43)", note:"Podbudowa HD, przestrzeń robocza 10,5×11 cm (rekord), stopy Matic; od 855 zł (Dark Grey), Light Grey 900 zł.", best:true},
  {name:"Husqvarna Viking E20", price:770, press:1, hook:"wahadłowy", weight:6.5, power:60, spm:750, stitches:32, rating:4.9, opinions:"4,9/5 (ME 11)", note:"Szwedzka marka premium za ~750 zł; opuszczane ząbki transportu; mało opinii PL."},
  {name:"Texi Bro", price:490, press:1, hook:"wahadłowy", weight:6.8, power:100, spm:750, stitches:24, rating:0, opinions:"brak ocen PL (nowość)", note:"Marka Strima (Poznań); pierwszy domowy silnik AC Servo 100 W; 3-stop. podnośnik stopki, płytka do haftu; wolniejsze tempo i węższy zygzak (4 mm)."},
  {name:"Texi Force", price:690, press:1, hook:"wahadłowy", weight:6.4, power:100, spm:1100, stitches:23, rating:0, opinions:"5/5 (Muziker, 2 oceny)", note:"Najtaniej 1100/min + servo 100 W na rynku; 1-stop. dziurka, szer. ściegu 6 mm, 3 pozycje igły; HD z regulacją docisku."}
];

const fmtPrice = v => v ? v.toLocaleString("pl-PL") + " zł" : "—";
const fmt1 = v => v ? String(v).replace(".", ",") : "b.d.";

const tbody = document.querySelector("#allmodels tbody");
const KEY = {name:m=>m.name, price:m=>m.price||0, press:m=>m.press, hook:m=>m.hook==="rotacyjny"?1:0,
  weight:m=>m.weight||0, power:m=>m.power||0, spm:m=>m.spm||0, stitches:m=>m.stitches||0, rating:m=>m.rating||0};

let sortKey = "price", sortAsc = true, selected = new Set();

function renderTable(){
  const rows = [...MODELS].sort((a,b)=> (KEY[sortKey](a)-KEY[sortKey](b)) * (sortAsc?1:-1) || a.name.localeCompare(b.name,"pl"));
  tbody.innerHTML = rows.map(m => `<tr data-m="${m.name}" class="${selected.has(m.name)?"sel":""}" tabindex="0" role="button" aria-pressed="${selected.has(m.name)}" aria-label="Dodaj ${m.name} do porównania">
    <td>${m.name}${m.best?'<span class="badge best">TOP</span>':""}</td>
    <td class="num">${fmtPrice(m.price)}</td>
    <td class="${m.press?"ok":"no"}">${m.press?"TAK":"NIE"}</td>
    <td>${m.hook}</td>
    <td class="num">${m.weight?m.weight.toFixed(1).replace(".",",")+" kg":"b.d."}</td>
    <td class="num">${m.power?m.power+" W":"b.d."}</td>
    <td class="num">${m.spm?m.spm:"b.d."}</td>
    <td class="num">${m.stitches}</td>
    <td class="num">${m.rating?m.rating.toFixed(2).replace(".",","):"b.d."}<br><small style="color:var(--mut)">${m.opinions||""}</small></td>
    <td aria-hidden="true">${selected.has(m.name)?"✓":"+"}</td></tr>`).join("");
}

function renderSortHeads(){
  document.querySelectorAll("#allmodels th[data-sort]").forEach(th=>{
    const k = th.dataset.sort;
    th.innerHTML = th.textContent.replace(/[▲▼]/g,"").trim() + (k===sortKey ? `<span class="arrow">${sortAsc?"▲":"▼"}</span>` : "");
  });
}

function toggle(name){
  if(selected.has(name)) selected.delete(name);
  else { if(selected.size >= 4) selected.delete(selected.values().next().value); selected.add(name); }
  renderTable(); renderCmp();
}

function specRow(label, vals, unit="", best=null){
  const bestVal = best ? best(vals) : null;
  return `<dt>${label}</dt><dd>${vals.map((v,i)=> v===bestVal ? `<b style="color:var(--ok)">${v}${unit}</b>` : v+unit).join(" / ")}</dd>`;
}

function renderCmp(){
  const area = document.querySelector("#cmp-area"), empty = document.querySelector("#cmp-empty"), clear = document.querySelector("#cmp-clear");
  if(!selected.size){ area.hidden = true; empty.hidden = false; clear.hidden = true; return; }
  empty.hidden = true; clear.hidden = false; area.hidden = false;
  const ms = [...selected].map(n=>MODELS.find(m=>m.name===n));
  const max = k => Math.max(...ms.map(m=>m[k]||0));
  area.innerHTML = ms.map(m=>`<article class="cmpcard">
    <h4>${m.name}</h4><span class="price">${fmtPrice(m.price)}</span>
    <dl>
      ${specRow("Docisk stopki", [m.press?"TAK":"NIE"])}
      ${specRow("Chwytacz", [m.hook])}
      ${specRow("Waga", [m.weight?fmt1(m.weight):"b.d."], " kg")}
      ${specRow("Moc", [m.power?m.power:"b.d."], m.power?" W":"")}
      ${specRow("Tempo", [m.spm?m.spm:"b.d."], m.spm?" /min":"")}
      ${specRow("Ściegi", [m.stitches])}
      ${specRow("Ocena", [m.rating?m.rating.toFixed(2).replace(".",","):"b.d."], m.rating?"/5":"")}
    </dl>
    <p style="color:var(--mut);font-size:13.5px;margin-top:12px">${m.note} <b>${m.opinions||""}</b></p>
  </article>`).join("") + (()=> {
    if(ms.length<2) return "";
    const rows = [
      ["Najtaniej", ms.slice().sort((a,b)=>(a.price||9e9)-(b.price||9e9))[0].name],
      ["Najszybsza", ms.slice().sort((a,b)=>(b.spm||0)-(a.spm||0))[0].name],
      ["Najcięższa (stabilniejsza)", ms.slice().sort((a,b)=>(b.weight||0)-(a.weight||0))[0].name],
      ["Najwyżej oceniana", ms.slice().sort((a,b)=>(b.rating||0)-(a.rating||0))[0].name]
    ];
    return `<div class="cmpcard" style="border-color:var(--acc)"><h4>Werdykt porównania</h4><dl>${rows.map(r=>`<dt>${r[0]}</dt><dd>${r[1]}</dd>`).join("")}</dl></div>`;
  })();
}

document.querySelectorAll("#allmodels th[data-sort]").forEach(th=>{
  th.addEventListener("click", ()=>{
    const k = th.dataset.sort;
    if(sortKey===k) sortAsc = !sortAsc; else { sortKey = k; sortAsc = (k==="name"); }
    renderTable(); renderSortHeads();
  });
});

tbody.addEventListener("click", e=>{ const tr = e.target.closest("tr[data-m]"); if(tr) toggle(tr.dataset.m); });
tbody.addEventListener("keydown", e=>{ if(e.key==="Enter"||e.key===" "){ const tr = e.target.closest("tr[data-m]"); if(tr){ e.preventDefault(); toggle(tr.dataset.m); } } });
document.querySelector("#cmp-clear").addEventListener("click", ()=>{ selected.clear(); renderTable(); renderCmp(); });

renderTable(); renderSortHeads(); renderCmp();
