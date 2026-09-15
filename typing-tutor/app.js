'use strict';

/* ================= Data ================= */

const WORD_LIST = [
  "the","be","to","of","and","a","in","that","have","it","for","not","on","with","he","as","you","do","at",
  "this","but","his","by","from","they","we","say","her","she","or","an","will","my","one","all","would",
  "there","their","what","so","up","out","if","about","who","get","which","go","me","when","make","can",
  "like","time","no","just","him","know","take","people","into","year","your","good","some","could","them",
  "see","other","than","then","now","look","only","come","its","over","think","also","back","after","use",
  "two","how","our","work","first","well","way","even","new","want","because","any","these","give","day",
  "most","us","is","was","are","been","has","had","were","said","may","part","life","world","hand","high",
  "old","school","water","room","small","thought","great","child","home","place","big","land","here","must",
  "name","men","write","long","point","right","study","still","learn","plant","cover","food","sun","four",
  "between","state","keep","eye","never","last","let","since","might","mile","book","hear","each","side",
  "off","need","house","picture","try","again","animal","near","ask","order","red","door","sure","become",
  "top","ship","across","today","during","short","better","best","however","sing","change","body","area",
  "story","put","end","does","another","large","form","dad","sad","gas","all","fall","hall","half","glass",
  "flags","flag","flask","salad","salads","dash","lash","gash","gala","slag","lag","lags","gag","gags","add",
  "ads","aha","dads","fads","glad","gladly","flasks","ladle","ladles","alas","halls","falls","jack","jazz",
  "quick","brown","fox","jump","lazy","dog","zebra","yellow","orange","purple","green","blue","black","white",
  "happy","sunny","cloud","storm","river","ocean","mountain","forest","garden","flower","music","dance",
  "dream","smile","laugh","friend","family","travel","journey","adventure","mystery","puzzle","wonder",
  "magic","spark","light","shadow","bridge","castle","dragon","knight","wizard","queen","king","prince",
  "horizon","galaxy","planet","comet","rocket","engine","system","signal","pixel","code","cursor","screen",
  "laptop","mobile","robot","sensor","camera","coffee","tea","bread","apple","grape","lemon","melon","cherry",
  "peach","mango","kitchen","market","office","street","subway","ticket","ladder","window","mirror","pillow",
  "blanket","candle","letter","pencil","marker","folder","wallet","pocket","quiet","proud","brave","gentle",
  "honest","clever","eager","patient","curious","simple","modern","ancient","hidden","bright","steady",
];

const QUOTES = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Life is what happens when you are busy making other plans.", author: "John Lennon" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Success is not final, failure is not fatal, it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
  { text: "Whether you think you can or you think you cannot, you are right.", author: "Henry Ford" },
  { text: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "Do not watch the clock, do what it does, keep going.", author: "Sam Levenson" },
  { text: "A journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
  { text: "What we know is a drop, what we do not know is an ocean.", author: "Isaac Newton" },
  { text: "The two most important days in your life are the day you are born and the day you find out why.", author: "Mark Twain" },
  { text: "I can resist everything except temptation.", author: "Oscar Wilde" },
  { text: "In the beginning the Universe was created. This has made a lot of people very angry and been widely regarded as a bad move.", author: "Douglas Adams" },
  { text: "It ain't over till it's over.", author: "Yogi Berra" },
  { text: "I refuse to join any club that would have me as a member.", author: "Groucho Marx" },
  { text: "You only live once, but if you do it right, once is enough.", author: "Mae West" },
  { text: "Somewhere, something incredible is waiting to be known.", author: "Carl Sagan" },
  { text: "I would rather have questions that can't be answered than answers that can't be questioned.", author: "Richard Feynman" },
  { text: "There is nothing to writing. All you do is sit down at a typewriter and bleed.", author: "Ernest Hemingway" },
  { text: "Not all those who wander are lost.", author: "J.R.R. Tolkien" },
  { text: "The universe is under no obligation to make sense to you.", author: "Neil deGrasse Tyson" },
  { text: "Float like a butterfly, sting like a bee.", author: "Muhammad Ali" },
  { text: "There is nothing I would not do for those who are really my friends.", author: "Jane Austen" },
  { text: "All the world's a stage, and all the men and women merely players.", author: "William Shakespeare" },
  { text: "Tell me and I forget, teach me and I may remember, involve me and I learn.", author: "Benjamin Franklin" },
];

const SENTENCES = [
  "The quick brown fox jumps over the lazy dog.",
  "She sells seashells by the seashore, doesn't she?",
  "Practice makes perfect, so keep typing every day!",
  "Jack quietly moved up front and seized the big ax.",
  "My favorite season is autumn, when the leaves turn gold.",
  "Can you believe it's already Friday afternoon?",
  "The coffee shop on Main Street opens at seven.",
  "Never give up, even when the road gets tough.",
  "We packed our bags and left before sunrise.",
  "Learning to type well takes patience and practice.",
];

const PUNCT_DRILLS = [
  "Wait, really? That's amazing!",
  "Yes, I agree; let's do it.",
  "Hello, world! How are you today?",
  "It's fine, don't worry about it.",
  "Stop! Look both ways before crossing.",
  "Well, well, well... look who's here.",
  "Are you sure? she asked, smiling.",
  "First, wash; second, rinse; third, dry.",
];

const HOME_ROW_PAIRS = [
  { pair: ["f", "j"], label: "F & J" },
  { pair: ["d", "k"], label: "D & K" },
  { pair: ["s", "l"], label: "S & L" },
  { pair: ["a", ";"], label: "A & ;" },
  { pair: ["g", "h"], label: "G & H" },
];
const TOP_ROW_PAIRS = [
  { pair: ["r", "u"], label: "R & U" },
  { pair: ["e", "i"], label: "E & I" },
  { pair: ["w", "o"], label: "W & O" },
  { pair: ["q", "p"], label: "Q & P" },
  { pair: ["t", "y"], label: "T & Y" },
];
const BOTTOM_ROW_PAIRS = [
  { pair: ["v", "m"], label: "V & M" },
  { pair: ["c", ","], label: "C & ," },
  { pair: ["x", "."], label: "X & ." },
  { pair: ["z", "/"], label: "Z & /" },
  { pair: ["b", "n"], label: "B & N" },
];

/* ================= Utilities ================= */

function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function capitalize(w) { return w.charAt(0).toUpperCase() + w.slice(1); }

function charToKey(ch) {
  if (ch === " ") return { key: "space", shift: false };
  if (/[a-z]/.test(ch)) return { key: ch, shift: false };
  if (/[A-Z]/.test(ch)) return { key: ch.toLowerCase(), shift: true };
  if (/[0-9]/.test(ch)) return { key: ch, shift: false };
  const shiftMap = { "!":"1","@":"2","#":"3","$":"4","%":"5","^":"6","&":"7","*":"8","(":"9",")":"0","_":"-","+":"=","{":"[","}":"]","|":"\\",":":";",'"':"'","<":",",">":".","?":"/","~":"`" };
  if (shiftMap[ch]) return { key: shiftMap[ch], shift: true };
  const directKeys = "-=[]\\;',./`";
  if (directKeys.includes(ch)) return { key: ch, shift: false };
  return { key: null, shift: false };
}

function normalizeTypedKey(e) {
  const k = e.key;
  if (k.length === 1 && /[a-zA-Z]/.test(k)) {
    const capsOn = typeof e.getModifierState === "function" && e.getModifierState("CapsLock");
    if (capsOn) return e.shiftKey ? k.toUpperCase() : k.toLowerCase();
  }
  return k;
}

/* ================= Drill generators ================= */

function genKeyDrill(focus, pool, groups = 12) {
  const source = pool && pool.length ? pool : focus;
  const words = [];
  for (let i = 0; i < groups; i++) {
    const len = 3 + Math.floor(Math.random() * 2);
    let w = "";
    for (let j = 0; j < len; j++) {
      const useFocus = source.length < 2 || Math.random() < 0.7;
      const chars = useFocus ? focus : source;
      w += chars[Math.floor(Math.random() * chars.length)];
    }
    words.push(w);
  }
  return words.join(" ");
}

function genWordsFromPool(pool, count = 18) {
  const set = new Set(pool);
  const matches = WORD_LIST.filter(w => [...w].every(ch => set.has(ch)));
  if (matches.length < 6) return null;
  const words = [];
  for (let i = 0; i < count; i++) words.push(pickRandom(matches));
  return words.join(" ");
}

function genNumberDrill(groups = 10) {
  const digits = "0123456789";
  const words = [];
  for (let i = 0; i < groups; i++) {
    const len = 3 + Math.floor(Math.random() * 3);
    let w = "";
    for (let j = 0; j < len; j++) w += digits[Math.floor(Math.random() * 10)];
    words.push(w);
  }
  return words.join(" ");
}

function genCapitalsDrill(pool, count = 14) {
  const set = new Set(pool && pool.length ? pool : "abcdefghijklmnopqrstuvwxyz".split(""));
  let matches = WORD_LIST.filter(w => [...w].every(ch => set.has(ch)));
  if (matches.length < 6) matches = WORD_LIST;
  const words = [];
  for (let i = 0; i < count; i++) words.push(capitalize(pickRandom(matches)));
  return words.join(" ");
}

function genPracticeWords(count, cfg) {
  const words = [];
  let sinceSentence = 0;
  let sentenceTarget = 6 + Math.floor(Math.random() * 5);
  for (let i = 0; i < count; i++) {
    let w;
    if (cfg.numbers && Math.random() < 0.1) w = String(1 + Math.floor(Math.random() * 9999));
    else w = pickRandom(WORD_LIST);
    if (cfg.punctuation) {
      sinceSentence++;
      if (sinceSentence === 1) w = capitalize(w);
      if (sinceSentence >= sentenceTarget) {
        w += pickRandom([".", ".", ".", "!", "?"]);
        sinceSentence = 0;
        sentenceTarget = 6 + Math.floor(Math.random() * 5);
      } else if (Math.random() < 0.12) {
        w += ",";
      }
    }
    words.push(w);
  }
  return words;
}

/* ================= Lessons ================= */

let LESSONS = [];
function buildLessons() {
  const lessons = [];
  let learned = [];
  function addKeyLesson(pair, label, section) {
    learned = learned.concat(pair);
    lessons.push({ id: `k-${pair.join("")}`, title: `${section} · ${label}`, type: "keys", focus: [...pair], pool: [...learned] });
  }
  function addWordsLesson(title) {
    lessons.push({ id: `w-${lessons.length}`, title, type: "words", pool: [...learned] });
  }
  HOME_ROW_PAIRS.forEach(p => addKeyLesson(p.pair, p.label, "Home Row"));
  addWordsLesson("Home Row Words");
  TOP_ROW_PAIRS.forEach(p => addKeyLesson(p.pair, p.label, "Top Row"));
  addWordsLesson("Top Row Words");
  BOTTOM_ROW_PAIRS.forEach(p => addKeyLesson(p.pair, p.label, "Bottom Row"));
  addWordsLesson("Full Alphabet Words");
  lessons.push({ id: "numbers", title: "Numbers Row", type: "numbers", pool: [...learned] });
  lessons.push({ id: "capitals", title: "Capital Letters", type: "capitals", pool: [...learned] });
  lessons.push({ id: "punctuation", title: "Punctuation", type: "punctuation", pool: [...learned] });
  lessons.push({ id: "sentences", title: "Full Sentences", type: "sentences", pool: [...learned] });
  lessons.forEach((l, i) => (l.index = i));
  return lessons;
}

function generateDrillText(lesson) {
  switch (lesson.type) {
    case "keys": return genKeyDrill(lesson.focus, lesson.pool);
    case "words": return genWordsFromPool(lesson.pool, 18) || genKeyDrill(lesson.pool.slice(-2), lesson.pool);
    case "numbers": return genNumberDrill();
    case "capitals": return genCapitalsDrill(lesson.pool);
    case "punctuation": return pickRandom(PUNCT_DRILLS);
    case "sentences": return pickRandom(SENTENCES);
    default: return WORD_LIST.slice(0, 18).join(" ");
  }
}

function describeLesson(lesson) {
  switch (lesson.type) {
    case "keys": return `Reach for ${lesson.focus.map(k => (k === " " ? "space" : `"${k}"`)).join(" and ")} without looking down. Keep your other fingers resting on the home row.`;
    case "words": return "Type these words using only the keys you've learned so far.";
    case "numbers": return "Practice the number row along the top of the keyboard.";
    case "capitals": return "Hold Shift to capitalize the first letter of each word.";
    case "punctuation": return "Practice common punctuation: commas, periods, and more.";
    case "sentences": return "Put it all together with full sentences.";
    default: return "";
  }
}

/* ================= Persistent storage ================= */

const STORAGE_KEY = "typecraft_data_v1";
function defaultData() { return { keys: {}, history: [], lessonProgress: { completed: [], current: 0 }, totals: { testsCompleted: 0, bestWpm: 0 } }; }
function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultData();
    const parsed = JSON.parse(raw);
    return {
      keys: parsed.keys || {},
      history: parsed.history || [],
      lessonProgress: Object.assign({ completed: [], current: 0 }, parsed.lessonProgress),
      totals: Object.assign({ testsCompleted: 0, bestWpm: 0 }, parsed.totals),
    };
  } catch (e) { return defaultData(); }
}
function saveData(d) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); } catch (e) {} }
function mergeKeyStats(keyLog) {
  const d = loadData();
  Object.entries(keyLog).forEach(([k, v]) => {
    if (!d.keys[k]) d.keys[k] = { correct: 0, incorrect: 0 };
    d.keys[k].correct += v.correct;
    d.keys[k].incorrect += v.incorrect;
  });
  saveData(d);
}
function pushHistory(entry) {
  const d = loadData();
  d.history.unshift(entry);
  d.history = d.history.slice(0, 50);
  d.totals.testsCompleted++;
  if (entry.wpm > d.totals.bestWpm) d.totals.bestWpm = entry.wpm;
  saveData(d);
}
function markLessonDone(id) {
  const d = loadData();
  if (!d.lessonProgress.completed.includes(id)) d.lessonProgress.completed.push(id);
  saveData(d);
}
function setLessonCurrent(idx) { const d = loadData(); d.lessonProgress.current = idx; saveData(d); }
function getLessonCurrent() { return loadData().lessonProgress.current || 0; }

/* ================= Keyboard ================= */

const KB_ROWS = [
  ["`","1","2","3","4","5","6","7","8","9","0","-","="],
  ["q","w","e","r","t","y","u","i","o","p","[","]"],
  ["a","s","d","f","g","h","j","k","l",";","'"],
  ["z","x","c","v","b","n","m",",",".","/"],
];

function renderKeyboard(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = "";
  KB_ROWS.forEach(row => {
    const rowEl = document.createElement("div");
    rowEl.className = "kb-row";
    row.forEach(k => {
      const keyEl = document.createElement("div");
      keyEl.className = "key";
      keyEl.dataset.key = k;
      keyEl.textContent = /[a-z]/.test(k) ? k.toUpperCase() : k;
      rowEl.appendChild(keyEl);
    });
    el.appendChild(rowEl);
  });
  const spaceRow = document.createElement("div");
  spaceRow.className = "kb-row";
  const spaceKey = document.createElement("div");
  spaceKey.className = "key space";
  spaceKey.dataset.key = "space";
  spaceKey.textContent = "space";
  spaceRow.appendChild(spaceKey);
  el.appendChild(spaceRow);
}

function findKeyEl(keyboardId, key) {
  const el = document.getElementById(keyboardId);
  if (!el) return null;
  const keys = el.querySelectorAll(".key");
  for (const k of keys) if (k.dataset.key === key) return k;
  return null;
}

function highlightNextKey(keyboardId, ch) {
  const el = document.getElementById(keyboardId);
  if (!el) return;
  el.querySelectorAll(".key.next").forEach(k => k.classList.remove("next"));
  const { key } = charToKey(ch);
  if (!key) return;
  const target = findKeyEl(keyboardId, key);
  if (target) target.classList.add("next");
}

function flashKey(keyboardId, ch, correct) {
  const { key } = charToKey(ch);
  if (!key) return;
  const el = findKeyEl(keyboardId, key);
  if (!el) return;
  el.classList.add(correct ? "flash-correct" : "flash-incorrect");
  setTimeout(() => el.classList.remove("flash-correct", "flash-incorrect"), 150);
}

function renderHeatmap(keyboardId) {
  renderKeyboard(keyboardId);
  const data = loadData();
  const el = document.getElementById(keyboardId);
  el.querySelectorAll(".key").forEach(k => {
    const key = k.dataset.key;
    if (key === "space") return;
    const stat = data.keys[key];
    if (!stat) return;
    const total = stat.correct + stat.incorrect;
    if (total < 4) return;
    const rate = stat.incorrect / total;
    k.classList.remove("heat-1", "heat-2", "heat-3");
    if (rate > 0.5) k.classList.add("heat-3");
    else if (rate > 0.28) k.classList.add("heat-2");
    else if (rate > 0.12) k.classList.add("heat-1");
  });
}

/* ================= Typing engine ================= */

const panelStates = { lessons: null, practice: null, quotes: null };
let activeState = null;
let currentRestart = null;
let currentNext = null;
let modalBlurState = null;
let currentTabName = "lessons";
let currentLessonIndex = 0;

function stopState(state) { if (state && state.liveInterval) clearInterval(state.liveInterval); }

function appendWordSpans(state, words, startIndex) {
  const frag = document.createDocumentFragment();
  words.forEach((w, i) => {
    const idx = startIndex + i;
    const wordEl = document.createElement("span");
    wordEl.className = "word";
    const chEls = [];
    for (const ch of w) {
      const s = document.createElement("span");
      s.className = "char";
      s.textContent = ch;
      wordEl.appendChild(s);
      chEls.push(s);
    }
    const anchor = document.createElement("span");
    anchor.className = "char caret-anchor";
    wordEl.appendChild(anchor);
    frag.appendChild(wordEl);
    state.wordEls[idx] = wordEl;
    state.charEls[idx] = chEls;
    state.extraEls[idx] = [];
    state.anchorEls[idx] = anchor;
    state.charStatus[idx] = new Array(w.length).fill("pending");
  });
  state.container.appendChild(frag);
  if (state.caretEl) state.container.appendChild(state.caretEl);
}

function initRenderContainer(state) {
  state.container.innerHTML = "";
  state.wordEls = []; state.charEls = []; state.extraEls = []; state.anchorEls = []; state.charStatus = [];
  state.caretEl = document.createElement("div");
  state.caretEl.className = "caret-el";
  appendWordSpans(state, state.words, 0);
  state.container.appendChild(state.caretEl);
  state.container.scrollTop = 0;
}

function setCharStatus(state, w, c, status) {
  state.charStatus[w][c] = status;
  const el = state.charEls[w][c];
  el.classList.remove("correct", "incorrect", "missed");
  el.classList.add(status);
}

function appendExtraChar(state, w, ch) {
  const s = document.createElement("span");
  s.className = "char extra";
  s.textContent = ch;
  state.wordEls[w].appendChild(s);
  state.extraEls[w].push(s);
}

function positionCaret(state) {
  const w = state.wordIndex;
  if (w >= state.words.length) { if (state.caretEl) state.caretEl.style.opacity = "0"; return; }
  const word = state.words[w];
  let targetEl, alignRight = false;
  if (state.charIndex < word.length) targetEl = state.charEls[w][state.charIndex];
  else if (state.extraEls[w].length > 0) { targetEl = state.extraEls[w][state.extraEls[w].length - 1]; alignRight = true; }
  else targetEl = state.anchorEls[w];
  if (!targetEl) return;
  const contRect = state.container.getBoundingClientRect();
  const elRect = targetEl.getBoundingClientRect();
  let left = elRect.left - contRect.left + state.container.scrollLeft;
  if (alignRight) left += elRect.width;
  const top = elRect.top - contRect.top + state.container.scrollTop;
  state.caretEl.style.transform = `translate(${left}px, ${top}px)`;
  state.caretEl.style.height = Math.max(elRect.height, 20) + "px";
  state.caretEl.style.opacity = "1";
  const lineH = elRect.height || 30;
  const visibleBottom = state.container.scrollTop + state.container.clientHeight;
  if (top + lineH > visibleBottom) state.container.scrollTop = top - lineH * 1.2;
}

function updateNextKeyHighlight(state) {
  const w = state.wordIndex;
  if (w >= state.words.length) return;
  const word = state.words[w];
  const expected = state.charIndex < word.length ? word[state.charIndex] : " ";
  highlightNextKey(state.keyboardId, expected);
}

function logKey(state, ch, correct) {
  const { key } = charToKey(ch);
  if (!key) return;
  if (!state.keyLog[key]) state.keyLog[key] = { correct: 0, incorrect: 0 };
  state.keyLog[key][correct ? "correct" : "incorrect"]++;
}

function computeStats(state, final) {
  const nowT = final ? state.endTime : Date.now();
  const minutes = state.startTime ? Math.max((nowT - state.startTime) / 60000, 1 / 3600) : 1 / 3600;
  const typedChars = state.correctCount + state.incorrectCount + state.extraCount;
  const totalAttempts = typedChars + state.missedCount;
  const raw = Math.round(typedChars / 5 / minutes) || 0;
  const acc = totalAttempts ? Math.round((100 * state.correctCount) / totalAttempts) : 100;
  const wpm = Math.round(raw * (acc / 100)) || 0;
  return { wpm, raw, acc, time: Math.round(minutes * 60), correct: state.correctCount, incorrect: state.incorrectCount, extra: state.extraCount, missed: state.missedCount };
}

function updateLiveStats(state) {
  const s = computeStats(state, false);
  let timeDisplay;
  const elapsed = state.startTime ? (Date.now() - state.startTime) / 1000 : 0;
  if (state.mode === "time") timeDisplay = Math.max(0, Math.ceil(state.timeLimit - elapsed)) + "s";
  else timeDisplay = Math.floor(elapsed) + "s";
  state.liveStatsEl.innerHTML = `
    <div class="live-stat"><div class="val">${s.wpm}</div><div class="lbl">wpm</div></div>
    <div class="live-stat"><div class="val">${s.acc}%</div><div class="lbl">accuracy</div></div>
    <div class="live-stat"><div class="val">${timeDisplay}</div><div class="lbl">${state.mode === "time" ? "time left" : "time"}</div></div>
  `;
}

function growWords(state) {
  if (!state.wordGenerator) return;
  const extra = state.wordGenerator();
  const startIdx = state.words.length;
  state.words = state.words.concat(extra);
  appendWordSpans(state, extra, startIdx);
}

function tick(state) {
  if (state.finished) return;
  updateLiveStats(state);
  if (state.mode === "time") {
    const elapsed = (Date.now() - state.startTime) / 1000;
    if (elapsed >= state.timeLimit) finishTest(state);
  }
}

function handleChar(state, key) {
  if (state.finished || !state.words.length) return;
  if (!state.startTime) {
    state.startTime = Date.now();
    state.liveInterval = setInterval(() => tick(state), 200);
  }
  const w = state.wordIndex;
  if (w >= state.words.length) return;
  const word = state.words[w];

  if (key === " ") {
    const typedSomething = state.charIndex > 0 || state.extraEls[w].length > 0;
    if (!typedSomething) return;
    for (let i = state.charIndex; i < word.length; i++) {
      setCharStatus(state, w, i, "missed");
      state.missedCount++;
      logKey(state, word[i], false);
    }
    state.wordIndex++;
    state.charIndex = 0;
    if (state.wordIndex >= state.words.length) {
      if (state.mode === "time") growWords(state);
      else { finishTest(state); return; }
    }
  } else {
    if (state.charIndex < word.length) {
      const expected = word[state.charIndex];
      const correct = expected === key;
      setCharStatus(state, w, state.charIndex, correct ? "correct" : "incorrect");
      logKey(state, expected, correct);
      if (correct) state.correctCount++; else state.incorrectCount++;
      flashKey(state.keyboardId, expected, correct);
      state.charIndex++;
      if (state.charIndex === word.length && w === state.words.length - 1 && state.mode !== "time") {
        finishTest(state);
        return;
      }
    } else if (state.extraEls[w].length < 15) {
      appendExtraChar(state, w, key);
      state.extraCount++;
      flashKey(state.keyboardId, key, false);
    }
  }

  if (state.mode === "time" && state.wordIndex > state.words.length - 12) growWords(state);
  positionCaret(state);
  updateNextKeyHighlight(state);
  updateLiveStats(state);
}

function handleBackspace(state) {
  if (state.finished) return;
  const w = state.wordIndex;
  if (w >= state.words.length) return;
  if (state.extraEls[w].length > 0) {
    const el = state.extraEls[w].pop();
    el.remove();
    state.extraCount--;
  } else if (state.charIndex > 0) {
    state.charIndex--;
    const prevStatus = state.charStatus[w][state.charIndex];
    if (prevStatus === "correct") state.correctCount--;
    else if (prevStatus === "incorrect") state.incorrectCount--;
    state.charStatus[w][state.charIndex] = "pending";
    state.charEls[w][state.charIndex].classList.remove("correct", "incorrect", "missed");
  }
  positionCaret(state);
  updateNextKeyHighlight(state);
  updateLiveStats(state);
}

function badgeFor(acc) {
  if (acc >= 100) return "Flawless! 🎯";
  if (acc >= 95) return "Excellent! 🔥";
  if (acc >= 85) return "Nice work! 👍";
  return "Keep practicing 💪";
}
function resultStat(val, lbl) { return `<div class="result-stat"><div class="val">${val}</div><div class="lbl">${lbl}</div></div>`; }

function showResultModal(stats, state) {
  document.getElementById("resultBadge").textContent = badgeFor(stats.acc);
  document.getElementById("resultHeadline").textContent =
    state.context.type === "lesson" ? "Lesson Complete" : state.context.type === "quote" ? "Quote Complete" : "Test Complete";
  document.getElementById("resultStats").innerHTML =
    resultStat(stats.wpm, "wpm") + resultStat(stats.acc + "%", "accuracy") + resultStat(stats.raw, "raw wpm") + resultStat(stats.time + "s", "time");
  const nextBtn = document.getElementById("resultNext");
  if (state.context.type === "lesson" && state.context.lesson.index < LESSONS.length - 1) nextBtn.classList.remove("hidden");
  else nextBtn.classList.add("hidden");
  document.getElementById("resultModal").classList.remove("hidden");
  state.container.classList.add("blurred");
  modalBlurState = state;
}
function hideModal() {
  document.getElementById("resultModal").classList.add("hidden");
  if (modalBlurState) { modalBlurState.container.classList.remove("blurred"); modalBlurState = null; }
}

function finishTest(state) {
  if (state.finished) return;
  state.finished = true;
  clearInterval(state.liveInterval);
  state.endTime = Date.now();
  if (!state.startTime) state.startTime = state.endTime;
  const stats = computeStats(state, true);
  mergeKeyStats(state.keyLog);
  pushHistory({ date: Date.now(), mode: state.modeLabel, wpm: stats.wpm, accuracy: stats.acc });
  if (state.context.type === "lesson") {
    markLessonDone(state.context.lesson.id);
    renderLessonList();
  }
  if (state.caretEl) state.caretEl.style.opacity = "0";
  showResultModal(stats, state);
}

function createEngineState(opts) {
  const state = {
    words: opts.words,
    container: opts.container,
    keyboardId: opts.keyboardId,
    liveStatsEl: opts.liveStatsEl,
    mode: opts.mode || "normal",
    timeLimit: opts.timeLimit || null,
    wordGenerator: opts.wordGenerator || null,
    context: opts.context || { type: "practice" },
    modeLabel: opts.modeLabel || "practice",
    wordIndex: 0, charIndex: 0,
    correctCount: 0, incorrectCount: 0, extraCount: 0, missedCount: 0,
    startTime: null, endTime: null, finished: false,
    liveInterval: null, keyLog: {},
  };
  initRenderContainer(state);
  renderKeyboard(state.keyboardId);
  updateNextKeyHighlight(state);
  positionCaret(state);
  updateLiveStats(state);
  return state;
}

/* ================= Lessons panel ================= */

function renderLessonList() {
  const data = loadData();
  const listEl = document.getElementById("lessonList");
  listEl.innerHTML = "";
  LESSONS.forEach(l => {
    const li = document.createElement("li");
    li.className = "lesson-item" + (data.lessonProgress.completed.includes(l.id) ? " done" : "") + (l.index === currentLessonIndex ? " current" : "");
    li.innerHTML = `<span class="dot"></span><span>${l.title}</span>`;
    li.addEventListener("click", () => loadLesson(l.index));
    listEl.appendChild(li);
  });
}

function loadLesson(index) {
  index = Math.max(0, Math.min(LESSONS.length - 1, index));
  currentLessonIndex = index;
  setLessonCurrent(index);
  const lesson = LESSONS[index];
  document.getElementById("lessonTitle").textContent = `${index + 1}. ${lesson.title}`;
  document.getElementById("lessonDesc").textContent = describeLesson(lesson);
  const text = generateDrillText(lesson);
  const words = text.split(" ").filter(Boolean);
  stopState(panelStates.lessons);
  panelStates.lessons = createEngineState({
    words,
    container: document.getElementById("typeArea-lessons"),
    keyboardId: "keyboard-lessons",
    liveStatsEl: document.getElementById("liveStats-lessons"),
    mode: "normal",
    context: { type: "lesson", lesson },
    modeLabel: "lesson",
  });
  if (currentTabName === "lessons") activeState = panelStates.lessons;
  currentRestart = () => loadLesson(currentLessonIndex);
  currentNext = () => loadLesson(currentLessonIndex + 1);
  renderLessonList();
  document.getElementById("lessonPrev").disabled = index === 0;
  document.getElementById("lessonNext").disabled = index === LESSONS.length - 1;
  focusHiddenInput();
}

/* ================= Quotes panel ================= */

let lastQuoteIdx = -1;
function loadQuote() {
  let idx;
  do { idx = Math.floor(Math.random() * QUOTES.length); } while (QUOTES.length > 1 && idx === lastQuoteIdx);
  lastQuoteIdx = idx;
  const q = QUOTES[idx];
  const words = q.text.split(" ").filter(Boolean);
  stopState(panelStates.quotes);
  panelStates.quotes = createEngineState({
    words,
    container: document.getElementById("typeArea-quotes"),
    keyboardId: "keyboard-quotes",
    liveStatsEl: document.getElementById("liveStats-quotes"),
    mode: "normal",
    context: { type: "quote", quote: q },
    modeLabel: "quote",
  });
  if (currentTabName === "quotes") activeState = panelStates.quotes;
  currentRestart = loadQuote;
  currentNext = null;
  focusHiddenInput();
}

/* ================= Practice panel ================= */

const practiceConfig = { subMode: "time", value: 30, punctuation: false, numbers: false };

function renderValueGroup() {
  const el = document.getElementById("practiceValueGroup");
  el.innerHTML = "";
  const values = practiceConfig.subMode === "time" ? [15, 30, 60, 120] : [10, 25, 50, 100];
  values.forEach(v => {
    const b = document.createElement("button");
    b.className = "opt" + (practiceConfig.value === v ? " active" : "");
    b.textContent = v;
    b.addEventListener("click", () => { practiceConfig.value = v; renderValueGroup(); startPractice(); });
    el.appendChild(b);
  });
}

function startPractice() {
  const initialCount = practiceConfig.subMode === "words" ? practiceConfig.value : 60;
  const words = genPracticeWords(initialCount, practiceConfig);
  stopState(panelStates.practice);
  panelStates.practice = createEngineState({
    words,
    container: document.getElementById("typeArea-practice"),
    keyboardId: "keyboard-practice",
    liveStatsEl: document.getElementById("liveStats-practice"),
    mode: practiceConfig.subMode === "time" ? "time" : "normal",
    timeLimit: practiceConfig.subMode === "time" ? practiceConfig.value : null,
    wordGenerator: practiceConfig.subMode === "time" ? () => genPracticeWords(40, practiceConfig) : null,
    context: { type: "practice" },
    modeLabel: "practice-" + practiceConfig.subMode,
  });
  if (currentTabName === "practice") activeState = panelStates.practice;
  currentRestart = startPractice;
  currentNext = null;
  focusHiddenInput();
}

/* ================= Stats panel ================= */

function statCard(val, lbl) { return `<div class="stat-card"><div class="val">${val}</div><div class="lbl">${lbl}</div></div>`; }

function renderStatsPanel() {
  const data = loadData();
  const grid = document.getElementById("statsGrid");
  const avgWpm = data.history.length ? Math.round(data.history.reduce((a, h) => a + h.wpm, 0) / data.history.length) : 0;
  const avgAcc = data.history.length ? Math.round(data.history.reduce((a, h) => a + h.accuracy, 0) / data.history.length) : 0;
  grid.innerHTML =
    statCard(data.totals.bestWpm, "Best WPM") +
    statCard(avgWpm, "Average WPM") +
    statCard(avgAcc + "%", "Average Accuracy") +
    statCard(data.totals.testsCompleted, "Tests Completed");
  renderHeatmap("keyboard-stats");
  const histEl = document.getElementById("historyList");
  if (!data.history.length) {
    histEl.innerHTML = '<p class="muted">No sessions yet — finish a lesson or test to see your history here.</p>';
  } else {
    histEl.innerHTML = data.history.slice(0, 15).map(h => `
      <div class="history-row">
        <span><span class="mode-tag">${h.mode}</span>${new Date(h.date).toLocaleDateString()}</span>
        <span>${h.wpm} wpm · ${h.accuracy}% acc</span>
      </div>
    `).join("");
  }
}

/* ================= Tabs / focus / theme ================= */

function focusHiddenInput() {
  const el = document.getElementById("hiddenInput");
  if (el) el.focus({ preventScroll: true });
}

function switchTab(name) {
  currentTabName = name;
  document.querySelectorAll(".tab").forEach(t => t.classList.toggle("active", t.dataset.tab === name));
  document.querySelectorAll(".panel").forEach(p => p.classList.toggle("active", p.id === `panel-${name}`));
  if (name === "lessons") {
    if (!panelStates.lessons) loadLesson(currentLessonIndex);
    activeState = panelStates.lessons;
  } else if (name === "practice") {
    if (!panelStates.practice) startPractice();
    activeState = panelStates.practice;
  } else if (name === "quotes") {
    if (!panelStates.quotes) loadQuote();
    activeState = panelStates.quotes;
  } else if (name === "stats") {
    activeState = null;
    renderStatsPanel();
  }
  focusHiddenInput();
}

function initTheme() {
  const saved = localStorage.getItem("typecraft_theme");
  const theme = saved || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", theme);
  document.getElementById("themeToggle").textContent = theme === "dark" ? "☀️" : "🌙";
}

/* ================= Wire up & init ================= */

function init() {
  initTheme();
  LESSONS = buildLessons();
  currentLessonIndex = Math.min(getLessonCurrent(), LESSONS.length - 1);
  renderValueGroup();

  document.getElementById("tabs").addEventListener("click", e => {
    const btn = e.target.closest(".tab");
    if (btn) switchTab(btn.dataset.tab);
  });

  document.getElementById("themeToggle").addEventListener("click", () => {
    const cur = document.documentElement.getAttribute("data-theme");
    const next = cur === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("typecraft_theme", next);
    document.getElementById("themeToggle").textContent = next === "dark" ? "☀️" : "🌙";
  });

  document.getElementById("lessonPrev").addEventListener("click", () => loadLesson(currentLessonIndex - 1));
  document.getElementById("lessonNext").addEventListener("click", () => loadLesson(currentLessonIndex + 1));
  document.getElementById("lessonRestart").addEventListener("click", () => loadLesson(currentLessonIndex));

  document.getElementById("quoteNew").addEventListener("click", loadQuote);

  document.getElementById("practiceModeGroup").addEventListener("click", e => {
    const b = e.target.closest(".opt");
    if (!b) return;
    practiceConfig.subMode = b.dataset.mode;
    practiceConfig.value = practiceConfig.subMode === "time" ? 30 : 25;
    document.querySelectorAll("#practiceModeGroup .opt").forEach(x => x.classList.toggle("active", x === b));
    renderValueGroup();
    startPractice();
  });
  document.getElementById("togglePunct").addEventListener("click", () => {
    practiceConfig.punctuation = !practiceConfig.punctuation;
    document.getElementById("togglePunct").dataset.on = practiceConfig.punctuation ? "1" : "0";
    startPractice();
  });
  document.getElementById("toggleNums").addEventListener("click", () => {
    practiceConfig.numbers = !practiceConfig.numbers;
    document.getElementById("toggleNums").dataset.on = practiceConfig.numbers ? "1" : "0";
    startPractice();
  });
  document.getElementById("practiceRestart").addEventListener("click", startPractice);

  document.getElementById("resultRestart").addEventListener("click", () => { hideModal(); if (currentRestart) currentRestart(); });
  document.getElementById("resultNext").addEventListener("click", () => { hideModal(); if (currentNext) currentNext(); });

  document.getElementById("resetStats").addEventListener("click", () => {
    if (confirm("Reset all saved stats and lesson progress? This cannot be undone.")) {
      localStorage.removeItem(STORAGE_KEY);
      renderStatsPanel();
      renderLessonList();
    }
  });

  document.addEventListener("keydown", e => {
    if (currentTabName === "stats") return;
    if (!document.getElementById("resultModal").classList.contains("hidden")) return;
    if (!activeState) return;
    if (e.key === "Tab") { e.preventDefault(); if (currentRestart) currentRestart(); return; }
    if (e.key === "Backspace") { e.preventDefault(); handleBackspace(activeState); return; }
    if (e.key.length === 1) { e.preventDefault(); handleChar(activeState, normalizeTypedKey(e)); return; }
  });

  document.addEventListener("click", e => {
    if (e.target.closest("button, a, .modal")) return;
    focusHiddenInput();
  });

  switchTab("lessons");
}

init();
