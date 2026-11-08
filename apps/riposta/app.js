'use strict';

window.__ripostaErr = null;
window.addEventListener('error', (e) => { window.__ripostaErr = String(e.message) + ' @' + (e.filename || '') + ':' + (e.lineno || 0); });

/* Riposta — generator ciętych ripost (quick-apps-hub, artefakt statyczny).
   Tryb demo działa bez klucza; z kluczem OpenRouter generacja idzie
   prosto z przeglądarki do api.openrouter.ai. Klucz żyje tylko w localStorage. */

const LEVELS = {
  1: { name: 'Ironia', desc: 'subtelna, uprzejma, z podtekstem' },
  2: { name: 'Sarkazm', desc: 'zimna, sucha riposta z podtekstem' },
  3: { name: 'Riposta', desc: 'szybka, ostra, zapada w pamięć' },
  4: { name: 'Brutalna meritoria', desc: 'pełny skalpel: kompromituje argument, nie człowieka' },
};

const MODES = {
  reply: {
    commentLabel: 'Komentarz, na który odpowiadasz',
    commentPlaceholder: 'np. „typu kupił drukarkę 3D i myśli że jest inżynierem lol”',
    contextLabel: 'Kontekst — treść twojego posta lub wątku',
    btn: 'Generuj ripostę',
  },
  roast: {
    commentLabel: 'Twój post — materiał do roastu',
    commentPlaceholder: 'np. „Po 3 latach przerwy wracam do biegu. Cel: maraton w październiku.”',
    contextLabel: 'Kontekst — gdzie to publikujesz, kim chcesz być odbierany',
    btn: 'Roastuj mnie',
  },
};

/* ---------- karta wyników ---------- */
function resultCard(text, meta, isBest) {
  const card = document.createElement('article');
  card.className = 'result-card' + (isBest ? ' best' : '');
  const head = document.createElement('div');
  head.className = 'result-meta';
  const badge = document.createElement('span');
  badge.className = 'badge';
  badge.textContent = meta;
  head.append(badge);
  const p = document.createElement('p');
  p.className = 'result-text';
  p.textContent = text;
  const row = document.createElement('div');
  row.className = 'result-actions';
  const copy = document.createElement('button');
  copy.type = 'button';
  copy.textContent = 'Kopiuj';
  copy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(text);
      copy.textContent = 'Skopiowano ✓';
    } catch {
      copy.textContent = 'Zaznacz ręcznie';
    }
    setTimeout(() => { copy.textContent = 'Kopiuj'; }, 1600);
  });
  row.append(copy);
  card.append(head, p, row);
  return card;
}

/* ---------- status ---------- */
function setStatus(msg, isErr) {
  let el = document.getElementById('status-line');
  if (!msg) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement('p');
    el.id = 'status-line';
    el.className = 'status-line';
    const results = document.getElementById('results');
    results.before(el);
  }
  el.classList.toggle('err', Boolean(isErr));
  el.textContent = msg;
}

/* ---------- tryb demo ---------- */
const DEMO = {
  reply: {
    1: 'Rozumiem, że drukarka 3D to dla ciebie novum. Mi przestała być już dwa lata temu.',
    2: 'Tak, kupiłem. I dalej drukuję — inżynierem być nie musisz, żeby wcisnąć „drukuj”.',
    3: 'Drukarka drukuje obudowy, nie opinie. Te drugie wymagają materiału.',
    4: 'Wygląda na to, że twoim jedynym dorobkiem w druku 3D jest komentarz pod cudzym. Zapraszam do zestawienia wyników.',
  },
  roast: {
    1: 'Maraton w październiku, plan treningowy pisany o 23:40. Klasyczne dwie ambicje naraz.',
    2: 'Trzy lata przerwy i od razu maraton — bardzo dobrze, że nie stawiasz sobie niskich celów. Tylko szkoda, że nieosiągalnych.',
    3: 'Cel: maraton. Plan: zacznę w poniedziałek. Poniedziałek od trzech lat jest przełożony.',
    4: 'Trzy lata przerwy, zero przebiegniętych kilometrów i już kątem oka wybierasz medal. Szacun dla pewności siebie — forma może być innego zdania.',
  },
};

function demoGenerate(mode, level) {
  const bank = DEMO[mode] || {};
  const base = bank[level] || bank[2] || 'W trybie demo ta kombinacja nie ma przykładu — dodaj klucz OpenRouter.';
  return [base];
}

/* ---------- localStorage ---------- */
const LS = { key: 'riposta.openrouter.key', model: 'riposta.openrouter.model', lang: 'riposta.lang' };

function loadSettings() {
  let key = '';
  try { key = localStorage.getItem(LS.key) || ''; } catch { /* prywatny tryb */ }
  let model = '';
  try { model = localStorage.getItem(LS.model) || ''; } catch { /* j.w. */ }
  let lang = 'auto';
  try { lang = localStorage.getItem(LS.lang) || 'auto'; } catch { /* j.w. */ }
  return { key, model: model || 'deepseek/deepseek-chat-v3.1', lang };
}

function saveSettings(s) {
  try {
    if (s.key) localStorage.setItem(LS.key, s.key); else localStorage.removeItem(LS.key);
    localStorage.setItem(LS.model, s.model);
    localStorage.setItem(LS.lang, s.lang);
  } catch { /* prywatny tryb — pomijamy */ }
}

/* ---------- OpenRouter ---------- */
const SYSTEM_PROMPT = [
  'Jesteś generatorem ciętych ripost w języku polskim.',
  'Dostajesz komentarz (i opcjonalny kontekst) i tworzysz ODPOWIEDŹ, którą użytkownik wyśle jako swoją.',
  'Cel: użytkownik wychodzi z wymiany obronną ręką — dowcipnie, konkretnie, na meritorium.',
  'ZASADY TWARDE:',
  '- Zero wulgaryzmów, zero gróźb, zero doxxingu.',
  '- Żadnych ataków na wygląd, pochodzenie, orientację, religię, niepełnosprawność, płeć, wiek.',
  '- Atakuj argument i zachowanie, nigdy cechy osoby.',
  '- Bez polskich wulgaryzmów „dla żartu”, bez przeklinania.',
  'ZASADY STYLU:',
  '- Maksymalnie 2 zdania na ripostę (poziom 4 może mieć 3).',
  '- Im wyższy poziom, tym ostrzej, ale meritorium rośnie razem z ostrością.',
  '- Jedna dobra puenta > trzy średnie.',
  'FORMAT: dokładnie 3 propozycje, każda w osobnym akapicie, bez numeracji, bez wyjaśnień, bez cudzysłowów.',
].join('\n');

const ROAST_EXTRA = [
  'TRYB SELF-ROAST: użytkownik wrzuca WŁASNY post i prosi o roast skierowany do niego samego.',
  'To roast za zgodą właściciela (jak w stand-up) — nawet poziom 4 musi być zabawny, nie okrutny.',
  'Zero wulgaryzmów, zero ataków na cechy (wygląd/pochodzenie/orientacja/religia/niepełnosprawność).',
].join('\n');

async function callOpenRouter(settings, mode, level, style, comment, context) {
  const lvl = LEVELS[level];
  const modeTxt = mode === 'roast' ? ROAST_EXTRA : '';
  const langTxt = settings.lang === 'auto'
    ? 'Język riposty: język komentarza użytkownika.'
    : `Język riposty: ${settings.lang}.`;
  const styleTxt = style.trim()
    ? `Persona/styl użytkownika (przyjmij go w pełni): ${style.trim()}`
    : '';
  const target = mode === 'roast' ? 'Własny post do roastu' : 'Komentarz do riposty';
  const user = [
    `POZIOM OSTROŚCI: ${level} — ${lvl.name} (${lvl.desc}).`,
    langTxt,
    styleTxt,
    `${target}:`,
    comment,
    context.trim() ? `\nKontekst:\n${context}` : '',
    modeTxt,
  ].filter(Boolean).join('\n');

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${settings.key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: settings.model,
      temperature: 1.0,
      max_tokens: 400,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT + '\n' + modeTxt },
        { role: 'user', content: user },
      ],
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`OpenRouter ${res.status}: ${detail.slice(0, 180)}`);
  }
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error('Model nie zwrócił treści — spróbuj innego modelu w ustawieniach.');
  return text
    .split(/\n{2,}/)
    .map(s => s.replace(/^\s*[-•\d.]+\s*/, '').trim())
    .filter(Boolean)
    .slice(0, 3);
}

/* ---------- UI wiring ---------- */
function init() {
  const $ = (id) => document.getElementById(id);

  const form = $('composer');
  const comment = $('inp-comment');
  const context = $('inp-context');
  const style = $('inp-style');
  const level = $('rng-level');
  const lvlName = $('lvl-name');
  const lvlDesc = $('lvl-desc');
  const results = $('results');
  const generateBtn = $('btn-generate');
  const clearBtn = $('btn-clear');
  const modeReply = $('mode-reply');
  const modeRoast = $('mode-roast');
  const lblComment = $('lbl-comment');
  const lblCommentText = $('lbl-comment-text');
  const lblContextText = $('lbl-context-text');
  const fldContext = $('fld-context');
  const demoNote = $('demo-note');
  const keyOpenBtn = $('btn-key-open');
  const keyOpen2 = $('btn-open-key');
  const dlgHelp = $('dlg-help');
  const dlgKey = $('dlg-key');
  const inpKey = $('inp-key');
  const selModel = $('sel-model');
  const selLang = $('sel-lang');
  const btnSaveKey = $('btn-save-key');
  const btnRemoveKey = $('btn-remove-key');
  const keyStatus = $('key-status');
  const btnHelp = $('btn-help');
  const btnCloseHelp = $('btn-close-help');

  const settings = loadSettings();

  if (settings.model && [...selModel.options].some(o => o.value === settings.model)) {
    selModel.value = settings.model;
  }
  inpKey.value = settings.key;

  function refreshModeBadge() {
    keyOpenBtn.textContent = settings.key ? 'Tryb: na żywo' : 'Tryb: demo';
    demoNote.textContent = settings.key
      ? 'Tryb na żywo: riposty generuje model przez OpenRouter, koszty idą na twój klucz.'
      : 'Tryb demo: przykładowe riposty generowane lokalnie, bez modelu. Dodaj własny klucz OpenRouter (przycisk „Tryb: demo” u góry), żeby generować na żywo — klucz zostaje w twojej przeglądarce.';
  }

  function applyMode() {
    const mode = modeRoast.checked ? 'roast' : 'reply';
    const cfg = MODES[mode];
    lblCommentText.textContent = cfg.commentLabel;
    comment.placeholder = cfg.commentPlaceholder;
    lblContextText.textContent = cfg.contextLabel;
    generateBtn.textContent = cfg.btn;
  }

  function refreshLevel() {
    const lvl = LEVELS[level.value];
    lvlName.textContent = lvl.name;
    lvlDesc.textContent = lvl.desc;
  }

  async function generate() {
    if (!comment.value.trim()) {
      comment.focus();
      setStatus(modeRoast.checked
        ? 'Wklej najpierw swój post do roastu.'
        : 'Wklej najpierw komentarz, na który chcesz odpowiedzieć.', true);
      return;
    }
    setStatus('');
    results.hidden = false;
    results.replaceChildren();
    const mode = modeRoast.checked ? 'roast' : 'reply';
    const statusEl = document.createElement('p');
    statusEl.className = 'status-line';
    statusEl.textContent = settings.key
      ? `Generuję przez ${settings.model.split('/').pop()}…`
      : 'Tryb demo — przykładowe riposty.';
    results.append(statusEl);
    generateBtn.disabled = true;
    try {
      let lines;
      if (settings.key) {
        lines = await callOpenRouter(settings, mode, Number(level.value), style.value, comment.value, context.value);
      } else {
        await new Promise(r => setTimeout(r, 350));
        lines = demoGenerate(mode, Number(level.value));
      }
      statusEl.remove();
      lines.forEach((line, i) => results.append(resultCard(line, `Wariant ${i + 1} · ${LEVELS[level.value].name}`, i === 0)));
      results.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (err) {
      statusEl.remove();
      setStatus(`Nie wyszło: ${err.message} (sprawdź klucz/model w ustawieniach)`, true);
    } finally {
      generateBtn.disabled = false;
    }
  }

  form.addEventListener('submit', (e) => { e.preventDefault(); generate(); });
  clearBtn.addEventListener('click', () => {
    comment.value = '';
    context.value = '';
    style.value = '';
    results.hidden = true;
    results.replaceChildren();
    setStatus('');
  });

  level.addEventListener('input', refreshLevel);
  modeReply.addEventListener('change', applyMode);
  modeRoast.addEventListener('change', applyMode);

  btnHelp.addEventListener('click', () => dlgHelp.showModal());
  btnCloseHelp.addEventListener('click', () => dlgHelp.close());
  keyOpenBtn.addEventListener('click', () => dlgKey.showModal());
  keyOpen2.addEventListener('click', () => { dlgHelp.close(); dlgKey.showModal(); });
  btnCloseKey.addEventListener('click', () => dlgKey.close());
  btnSaveKey.addEventListener('click', () => {
    settings.key = inpKey.value.trim();
    settings.model = selModel.value;
    settings.lang = selLang.value;
    saveSettings(settings);
    refreshModeBadge();
    keyStatus.textContent = settings.key
      ? `Zapisano. Model: ${settings.model}`
      : 'Zapisano bez klucza — tryb demo.';
  });
  btnRemoveKey.addEventListener('click', () => {
    settings.key = '';
    inpKey.value = '';
    saveSettings(settings);
    refreshModeBadge();
    keyStatus.textContent = 'Klucz usunięty — wracamy do trybu demo.';
  });

  refreshModeBadge();
  applyMode();
  refreshLevel();
  window.__ripostaInit = 'ok@' + Date.now();
  window.__ripostaWired = { save: !!btnSaveKey, close: !!btnCloseKey, open2: !!keyOpen2 };
}

document.addEventListener('DOMContentLoaded', init);
