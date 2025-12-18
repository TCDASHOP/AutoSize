/* =========================================
   TCDA Size Guide (rebuilt, clarity-first)
   - JP/EN tabs (JP=cm, EN=inch fixed)
   - Custom dropdown (2-line labels)
   - Show only required inputs per product
   - 1-line rationale
   - Error + next action buttons
   - CSV table
   - After recommendation: highlight row + auto scroll
   - State saved
========================================= */

const $ = (q) => document.querySelector(q);

const el = {
  langJP: $("#langJP"),
  langEN: $("#langEN"),
  brandSub: $("#brandSub"),
  unitPill: $("#unitPill"),

  titleGuide: $("#titleGuide"),
  hintGuide: $("#hintGuide"),
  guideImage: $("#guideImage"),
  imgNote: $("#imgNote"),
  imgFallback: $("#imgFallback"),

  titleInput: $("#titleInput"),
  hintInput: $("#hintInput"),
  labelProduct: $("#labelProduct"),

  productButton: $("#productButton"),
  productButtonText: $("#productButtonText"),
  productList: $("#productList"),

  inputArea: $("#inputArea"),
  calcBtn: $("#calcBtn"),

  titleNotes: $("#titleNotes"),
  noticeBox: $("#noticeBox"),

  titleResult: $("#titleResult"),
  resultBox: $("#resultBox"),

  titleTable: $("#titleTable"),
  hintTable: $("#hintTable"),
  tableHead: $("#tableHead"),
  tableBody: $("#tableBody"),

  inputCard: $("#inputCard"),
  tableCard: $("#tableCard"),

  footerCopy: $("#footerCopy"),
};

const CM_PER_IN = 2.54;
const STORAGE_KEY = "tcda_sizeguide_rebuilt_v1";

/* ---------- i18n ---------- */
const T = {
  jp: {
    sub: "Size Guide",
    guideTitle: "採寸ガイド",
    guideHint: "画像は商品に応じて切り替わります。",
    inputTitle: "サイズ算出（任意入力）",
    inputHint: "入力なしでもサイズ表だけ見て選べます。",
    product: "商品",
    calc: "おすすめサイズを計算",
    notes: "選ぶときの注意事項",
    result: "おすすめ",
    table: "サイズ表",
    tableHint: "数値は平置き採寸です（誤差 ±1〜2）。",

    chestLabel: (unit) => `ヌード胸囲（${unit}）`,
    footLabel: (unit) => `足長（かかと〜一番長い指・${unit}）`,
    easeLabel: "ゆとり（目安）",
    allowLabel: "捨て寸（目安）",

    easeStd: (v) => `標準（+${v}）`,
    easeLoose: (v) => `ゆったり（+${v}）`,
    easeMore: (v) => `かなりゆったり（+${v}）`,

    allowS: (v) => `+${v}（標準）`,
    allowM: (v) => `+${v}（ゆったり）`,
    allowL: (v) => `+${v}（しっかり）`,

    noMatchTitle: "該当するサイズが見当たりませんでした。",
    noMatchMeta: "入力値とサイズ表の範囲が合っていない可能性があります。",
    fixBtn: "入力を見直す",
    tableBtn: "サイズ表で選ぶ",
    tableBtn2: "サイズ表を確認",

    rationaleChest: (nude, ease, unit, target, chosen) =>
      `根拠：ヌード胸囲 ${nude}${unit} + ゆとり ${ease}${unit} = 目安 ${target}${unit} → 最小で満たすサイズ：${chosen}`,
    rationaleFoot: (foot, allow, unit, target, chosen) =>
      `根拠：足長 ${foot}${unit} + 捨て寸 ${allow}${unit} = 目安 ${target}${unit} → 最小で満たすサイズ：${chosen}`,

    imgNote: "※ 画像は商品に応じて切り替わります",
    imgFail: "画像を読み込めませんでした。assets内のファイル名（拡張子・大小文字）とパスが一致しているか確認してください。",
  },

  en: {
    sub: "Size Guide",
    guideTitle: "Measuring Guide",
    guideHint: "Image changes by product.",
    inputTitle: "Size recommendation (optional input)",
    inputHint: "You can also choose from the size table without input.",
    product: "Product",
    calc: "Calculate recommended size",
    notes: "Notes when choosing",
    result: "Recommended",
    table: "Size Table",
    tableHint: "Values are flat measurements (±1–2).",

    chestLabel: (unit) => `Body chest (${unit})`,
    footLabel: (unit) => `Foot length (heel to longest toe, ${unit})`,
    easeLabel: "Ease (guide)",
    allowLabel: "Toe allowance (guide)",

    easeStd: (v) => `Standard (+${v})`,
    easeLoose: (v) => `Relaxed (+${v})`,
    easeMore: (v) => `Very relaxed (+${v})`,

    allowS: (v) => `+${v} (standard)`,
    allowM: (v) => `+${v} (relaxed)`,
    allowL: (v) => `+${v} (more room)`,

    noMatchTitle: "No matching size was found.",
    noMatchMeta: "Your input may be outside the size table range.",
    fixBtn: "Review input",
    tableBtn: "Choose from table",
    tableBtn2: "Check size table",

    rationaleChest: (nude, ease, unit, target, chosen) =>
      `Why: body chest ${nude}${unit} + ease ${ease}${unit} = target ${target}${unit} → smallest size that fits: ${chosen}`,
    rationaleFoot: (foot, allow, unit, target, chosen) =>
      `Why: foot length ${foot}${unit} + allowance ${allow}${unit} = target ${target}${unit} → smallest size that fits: ${chosen}`,

    imgNote: "Image changes by product.",
    imgFail: "Image failed to load. Please confirm the filename/path in the assets folder (including extension/case).",
  }
};

/* ---------- Products ---------- */
const PRODUCTS = [
  {
    id: "mens_tshirt",
    type: "apparel",
    labelJP: ["Men's Crew Neck", "T-Shirt"],
    labelEN: ["Men's Crew Neck", "T-Shirt"],
    guideImgCandidates: ["assets/guide_tshirt.jpg", "assets/guide_tshirt.jpeg", "assets/guide_tshirt.png"],
    csvCandidates: {
      cm: [
        "data/All-over print men's crew neck T-shirt【cm】-表1.csv",
        "data/aop_mens_crew_cm.csv",
        "data/mens_tshirt_cm.csv",
      ],
      inch: [
        "data/All-over print men's crew neck T-shirt【inch】-表1.csv",
        "data/aop_mens_crew_inch.csv",
        "data/mens_tshirt_inch.csv",
      ]
    },
    notes: {
      jp: [
        "Men’sはゆったり・直線的、Women’sはフィット寄りになりやすい。",
        "最短で失敗を減らす：手持ちの「いちばん好きな服」を平置きで測り、サイズ表の近い数値を選ぶ。",
        "体から逆算：ヌード胸囲＋ゆとり → 仕上がり胸囲 → 身幅（仕上がり胸囲÷2）。",
        "優先順位：身幅 → 着丈 → 袖丈（袖は肩線位置で体感が変わる）。"
      ],
      en: [
        "Men’s tends to be roomier/straighter; Women’s tends to be more fitted.",
        "Fastest way: measure your favorite tee (flat) and choose the closest numbers.",
        "From body: chest + ease → target finished chest → half chest (target ÷ 2).",
        "Priority: width → length → sleeve."
      ]
    }
  },

  {
    id: "womens_tshirt",
    type: "apparel",
    labelJP: ["Women's Crew Neck", "T-Shirt"],
    labelEN: ["Women's Crew Neck", "T-Shirt"],
    guideImgCandidates: ["assets/guide_tshirt.jpg", "assets/guide_tshirt.jpeg", "assets/guide_tshirt.png"],
    csvCandidates: {
      cm: [
        "data/All-Over Print Women's Crew Neck T-Shirt【cm】-表1.csv",
        "data/aop_womens_crew_cm.csv",
        "data/womens_tshirt_cm.csv",
      ],
      inch: [
        "data/All-Over Print Women's Crew Neck T-Shirt【inch】-表1.csv",
        "data/aop_womens_crew_inch.csv",
        "data/womens_tshirt_inch.csv",
      ]
    },
    notes: {
      jp: [
        "Women’sはフィット寄りになりやすいので、迷ったら身幅を優先。",
        "最短で失敗を減らす：手持ちの「いちばん好きな服」を平置きで測って照合。",
        "体から逆算：ヌード胸囲＋ゆとり → 仕上がり胸囲 → 身幅（仕上がり胸囲÷2）。",
        "優先順位：身幅 → 着丈 → 袖丈。"
      ],
      en: [
        "Women’s can feel more fitted—if unsure, prioritize width.",
        "Fastest method: measure your favorite shirt (flat) and match the table.",
        "From body: chest + ease → target finished chest → half chest (target ÷ 2).",
        "Priority: width → length → sleeve."
      ]
    }
  },

  {
    id: "unisex_hoodie",
    type: "apparel",
    labelJP: ["Unisex", "Hoodie"],
    labelEN: ["Unisex", "Hoodie"],
    guideImgCandidates: ["assets/guide_hoodie.jpg", "assets/guide_hoodie.jpeg", "assets/guide_hoodie.png"],
    csvCandidates: {
      cm: [
        "data/All-Over Print Recycled Unisex Hoodie【cm】-表1.csv",
        "data/aop_recycled_hoodie_cm.csv",
        "data/unisex_hoodie_cm.csv",
      ],
      inch: [
        "data/All-Over Print Recycled Unisex Hoodie【inch】-表1.csv",
        "data/aop_recycled_hoodie_inch.csv",
        "data/unisex_hoodie_inch.csv",
      ]
    },
    notes: {
      jp: [
        "基本はTシャツと同じ（胸囲→身幅→着丈→袖）。",
        "フーディは裾リブ等で体感が変わるため、同じ数値でも印象が少し違う。",
      ],
      en: [
        "Same base logic as tees (chest → width → length → sleeve).",
        "Hoodies can feel different even with the same numbers due to rib/structure.",
      ]
    }
  },

  {
    id: "unisex_zip_hoodie",
    type: "apparel",
    labelJP: ["Unisex", "ZIP Hoodie"],
    labelEN: ["Unisex", "ZIP Hoodie"],
    guideImgCandidates: ["assets/guide_zip_hoodie.jpg", "assets/guide_zip_hoodie.jpeg", "assets/guide_zip_hoodie.png"],
    csvCandidates: {
      cm: [
        "data/All-Over Print Recycled Unisex Zip Hoodie【cm】-表1.csv",
        "data/aop_recycled_zip_hoodie_cm.csv",
        "data/unisex_zip_hoodie_cm.csv",
      ],
      inch: [
        "data/All-Over Print Recycled Unisex Zip Hoodie【inch】-表1.csv",
        "data/aop_recycled_zip_hoodie_inch.csv",
        "data/unisex_zip_hoodie_inch.csv",
      ]
    },
    notes: {
      jp: [
        "基本はTシャツと同じ（胸囲→身幅→着丈→袖）。",
        "ジップも裾リブ/構造で体感が変わります。",
      ],
      en: [
        "Same base logic as tees (chest → width → length → sleeve).",
        "Zip hoodies can still feel different due to structure.",
      ]
    }
  },

  {
    id: "womens_slipon",
    type: "shoes",
    labelJP: ["Women's Slip-On", "Canvas Shoes"],
    labelEN: ["Women's Slip-On", "Canvas Shoes"],
    guideImgCandidates: ["assets/guide_slipon.jpg", "assets/guide_slipon.jpeg", "assets/guide_slipon.png"],
    csvCandidates: {
      cm: [
        "data/Women's slip-on canvas shoes｢cm｣.csv",
        "data/womens_slipon_cm.csv",
      ],
      inch: [
        "data/Women's slip-on canvas shoes｢inch｣.csv",
        "data/womens_slipon_inch.csv",
      ]
    },
    notes: {
      jp: [
        "主役は足長（左右を測り、長い方を採用）。",
        "足長＋捨て寸（目安7〜12mm）で選ぶ。",
        "アウトソール長は外寸なので足長と同一視しない。",
        "Women’sはタイトになりやすい。幅広/甲高は迷ったら大きめ寄り。"
      ],
      en: [
        "Foot length is key (measure both feet; use the longer one).",
        "Choose by foot length + allowance (about 7–12mm).",
        "Outsole length is the outside measurement—don’t treat it as foot length.",
        "Women’s can feel tighter; wide/high instep: consider sizing up if unsure."
      ]
    }
  },

  {
    id: "mens_slipon",
    type: "shoes",
    labelJP: ["Men's Slip-On", "Canvas Shoes"],
    labelEN: ["Men's Slip-On", "Canvas Shoes"],
    guideImgCandidates: ["assets/guide_slipon.jpg", "assets/guide_slipon.jpeg", "assets/guide_slipon.png"],
    csvCandidates: {
      cm: [
        "data/Men's slip-on canvas shoes｢cm｣.csv",
        "data/mens_slipon_cm.csv",
      ],
      inch: [
        "data/Men's slip-on canvas shoes｢inch｣.csv",
        "data/mens_slipon_inch.csv",
      ]
    },
    notes: {
      jp: [
        "主役は足長（左右を測り、長い方を採用）。",
        "足長＋捨て寸（目安7〜12mm）で選ぶ。",
        "アウトソール長は外寸なので足長と同一視しない。",
        "Men’sは幅広め。迷ったら大きめ寄り。"
      ],
      en: [
        "Foot length is key (measure both feet; use the longer one).",
        "Choose by foot length + allowance (about 7–12mm).",
        "Outsole length is the outside measurement—don’t treat it as foot length.",
        "Men’s tends to be wider; if unsure, choose slightly roomier."
      ]
    }
  },
];

/* ---------- state ---------- */
const state = {
  lang: "jp",         // jp | en
  unit: "cm",         // cm | inch (JP=cm / EN=inch)
  productId: PRODUCTS[0].id,

  chest: "",
  foot: "",
  easeKey: "std",     // std | loose | more
  allowKey: "m",      // s | m | l

  lastRec: null,      // { productId, unit, size }
};

/* ---------- helpers ---------- */
function currentT(){ return T[state.lang]; }
function unitLabel(){ return state.unit; }

function escapeHTML(s){
  return String(s).replace(/[&<>"']/g, (m) => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[m]));
}

function normalizeNumberLike(v){
  if(v == null) return "";
  let s = String(v).trim();
  s = s.replace(/[０-９]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0xFEE0));
  s = s.replace(/[，、]/g, ",").replace(/[．]/g, ".");
  s = s.replace(/[^0-9.\-]/g, "");
  s = s.replace(/,/g, "");
  return s;
}
function toFloatSafe(v){
  const s = normalizeNumberLike(v);
  if(!s) return NaN;
  const n = Number(s);
  return Number.isFinite(n) ? n : NaN;
}
function round1(n){ return Math.round(n * 10) / 10; }
function cmToIn(cm){ return cm / CM_PER_IN; }

function saveState(){
  try{
    const payload = { ...state };
    const c = $("#chestInput"); const f = $("#footInput");
    if(c) payload.chest = c.value ?? "";
    if(f) payload.foot = f.value ?? "";
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }catch(_){}
}
function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return;
    const s = JSON.parse(raw);
    if(s && typeof s === "object") Object.assign(state, s);
  }catch(_){}
}

function setActive(btnOn, btnOff){
  btnOn.classList.add("active");
  btnOff.classList.remove("active");
}

function currentProduct(){
  return PRODUCTS.find(p => p.id === state.productId) || PRODUCTS[0];
}

function scrollToId(id){
  const t = document.getElementById(id);
  if(!t) return;
  t.scrollIntoView({ behavior:"smooth", block:"start" });
}

/* ---------- language/unit ---------- */
function setLang(next){
  state.lang = next;
  // 固定運用：JP=cm / EN=inch（迷いを消す）
  state.unit = (next === "jp") ? "cm" : "inch";
  state.lastRec = null; // 言語/単位が変わるとハイライトの前提が変わるのでリセット
  renderAll();
  saveState();
}

/* ---------- dropdown ---------- */
function optionHTML(prod){
  const lines = (state.lang === "jp") ? prod.labelJP : prod.labelEN;
  const l1 = lines[0] ?? "";
  const l2 = lines[1] ?? "";
  return `
    <div class="comboLine1">${escapeHTML(l1)}</div>
    <div class="comboLine2">${escapeHTML(l2)}</div>
  `;
}

function closeCombo(){
  el.productList.hidden = true;
  el.productButton.setAttribute("aria-expanded","false");
}
function openCombo(){
  el.productList.hidden = false;
  el.productButton.setAttribute("aria-expanded","true");
  requestAnimationFrame(() => {
    const selected = el.productList.querySelector('[aria-selected="true"]');
    if(selected) selected.scrollIntoView({ block:"nearest" });
  });
}

function rebuildProductDropdown(){
  const p = currentProduct();
  el.productButtonText.innerHTML = optionHTML(p);

  el.productList.innerHTML = "";
  PRODUCTS.forEach((prod) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "comboOption";
    btn.role = "option";
    btn.setAttribute("aria-selected", prod.id === state.productId ? "true" : "false");
    btn.innerHTML = optionHTML(prod);

    btn.addEventListener("click", () => {
      state.productId = prod.id;
      state.lastRec = null;      // 商品が変わったらおすすめは無効化
      el.resultBox.textContent = "—";
      closeCombo();
      renderAll();
      saveState();
    });

    el.productList.appendChild(btn);
  });
}

function wireComboEvents(){
  el.productButton.addEventListener("click", () => {
    const isOpen = el.productButton.getAttribute("aria-expanded") === "true";
    if(isOpen) closeCombo(); else openCombo();
  });

  document.addEventListener("click", (e) => {
    if(e.target?.closest("#productCombo")) return;
    closeCombo();
  });

  el.productButton.addEventListener("keydown", (e) => {
    if(e.key === "Enter" || e.key === " " || e.key === "ArrowDown"){
      e.preventDefault();
      openCombo();
      el.productList.focus();
    }
  });

  el.productList.addEventListener("keydown", (e) => {
    const opts = [...el.productList.querySelectorAll(".comboOption")];
    if(!opts.length) return;

    const idx = opts.findIndex(x => x.getAttribute("aria-selected")==="true");
    const setSelected = (i) => {
      const n = Math.max(0, Math.min(i, opts.length-1));
      opts.forEach((b, k) => b.setAttribute("aria-selected", k===n ? "true":"false"));
      opts[n].scrollIntoView({block:"nearest"});
    };

    if(e.key === "Escape"){
      e.preventDefault();
      closeCombo();
      el.productButton.focus();
      return;
    }
    if(e.key === "ArrowDown"){
      e.preventDefault();
      setSelected((idx>=0?idx:0)+1);
      return;
    }
    if(e.key === "ArrowUp"){
      e.preventDefault();
      setSelected((idx>=0?idx:0)-1);
      return;
    }
    if(e.key === "Enter"){
      e.preventDefault();
      const pick = opts.find(x => x.getAttribute("aria-selected")==="true");
      if(pick) pick.click();
    }
  });
}

/* ---------- guide image ---------- */
async function setGuideImageByCandidates(candidates){
  const t = currentT();

  el.imgFallback.hidden = true;
  el.guideImage.hidden = false;

  for(const src of candidates){
    const ok = await testImage(src);
    if(ok){
      el.guideImage.src = src;
      el.imgNote.textContent = t.imgNote;
      return;
    }
  }

  // fail
  el.guideImage.hidden = true;
  el.imgFallback.hidden = false;
  el.imgFallback.textContent = t.imgFail;
}

function testImage(src){
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}

/* ---------- inputs ---------- */
function clearInputArea(){
  el.inputArea.innerHTML = "";
  const err = $("#inputErrorBox");
  if(err) err.remove();
}
function showInputError(msg){
  let box = $("#inputErrorBox");
  if(!box){
    box = document.createElement("div");
    box.id = "inputErrorBox";
    box.className = "inputError";
    el.inputArea.prepend(box);
  }
  box.textContent = msg;
  el.inputArea.classList.add("shake");
  setTimeout(()=> el.inputArea.classList.remove("shake"), 550);
}

function getEaseValues(){
  // cm: +8/+10/+12, inch: convert
  if(state.unit === "cm") return { std: 8, loose: 10, more: 12 };
  return { std: round1(cmToIn(8)), loose: round1(cmToIn(10)), more: round1(cmToIn(12)) };
}
function getAllowValues(){
  // cm: 0.7/1.0/1.2 (7-12mm), inch: convert
  if(state.unit === "cm") return { s: 0.7, m: 1.0, l: 1.2 };
  return { s: round1(cmToIn(0.7)), m: round1(cmToIn(1.0)), l: round1(cmToIn(1.2)) };
}

function buildApparelInputs(){
  const t = currentT();
  const unit = unitLabel();
  const easeValues = getEaseValues();

  const wrap = document.createElement("div");
  const row = document.createElement("div");
  row.className = "inputRow";

  const col1 = document.createElement("div");
  const lab1 = document.createElement("label");
  lab1.className = "label";
  lab1.textContent = t.chestLabel(unit);
  const inp = document.createElement("input");
  inp.className = "input";
  inp.id = "chestInput";
  inp.inputMode = "decimal";
  inp.placeholder = (state.lang==="jp") ? "例：88" : "e.g. 34.6";
  inp.value = state.chest || "";
  inp.addEventListener("input", ()=>{ state.chest = inp.value; saveState(); });
  col1.append(lab1, inp);

  const col2 = document.createElement("div");
  const lab2 = document.createElement("label");
  lab2.className = "label";
  lab2.textContent = t.easeLabel;

  const sel = document.createElement("select");
  sel.className = "select";
  sel.id = "easeSelect";
  sel.add(new Option(t.easeStd(`${easeValues.std}${unit}`), "std"));
  sel.add(new Option(t.easeLoose(`${easeValues.loose}${unit}`), "loose"));
  sel.add(new Option(t.easeMore(`${easeValues.more}${unit}`), "more"));
  sel.value = state.easeKey || "std";
  sel.addEventListener("change", ()=>{ state.easeKey = sel.value; saveState(); });
  col2.append(lab2, sel);

  row.append(col1, col2);
  wrap.appendChild(row);
  return wrap;
}

function buildShoesInputs(){
  const t = currentT();
  const unit = unitLabel();
  const allowValues = getAllowValues();

  const wrap = document.createElement("div");
  const row = document.createElement("div");
  row.className = "inputRow";

  const col1 = document.createElement("div");
  const lab1 = document.createElement("label");
  lab1.className = "label";
  lab1.textContent = t.footLabel(unit);
  const inp = document.createElement("input");
  inp.className = "input";
  inp.id = "footInput";
  inp.inputMode = "decimal";
  inp.placeholder = (state.lang==="jp") ? "例：23.5" : "e.g. 9.25";
  inp.value = state.foot || "";
  inp.addEventListener("input", ()=>{ state.foot = inp.value; saveState(); });
  col1.append(lab1, inp);

  const col2 = document.createElement("div");
  const lab2 = document.createElement("label");
  lab2.className = "label";
  lab2.textContent = t.allowLabel;

  const sel = document.createElement("select");
  sel.className = "select";
  sel.id = "allowSelect";
  sel.add(new Option(t.allowS(`${allowValues.s}${unit}`), "s"));
  sel.add(new Option(t.allowM(`${allowValues.m}${unit}`), "m"));
  sel.add(new Option(t.allowL(`${allowValues.l}${unit}`), "l"));
  sel.value = state.allowKey || "m";
  sel.addEventListener("change", ()=>{ state.allowKey = sel.value; saveState(); });
  col2.append(lab2, sel);

  row.append(col1, col2);
  wrap.appendChild(row);
  return wrap;
}

function renderInputs(){
  clearInputArea();
  const prod = currentProduct();
  if(prod.type === "shoes") el.inputArea.appendChild(buildShoesInputs());
  else el.inputArea.appendChild(buildApparelInputs());
}

/* ---------- notes ---------- */
function renderNotes(){
  const prod = currentProduct();
  const items = prod.notes[state.lang] || [];
  el.noticeBox.innerHTML = `
    <ul>${items.map(x => `<li>${escapeHTML(x)}</li>`).join("")}</ul>
  `;
}

/* ---------- CSV ---------- */
const csvCache = new Map();

async function fetchFirstWorkingCSV(candidates){
  for(const path of candidates){
    const ok = await tryFetchCSV(path);
    if(ok) return ok;
  }
  throw new Error("CSV not found");
}

async function tryFetchCSV(path){
  try{
    if(csvCache.has(path)) return csvCache.get(path);
    const res = await fetch(path, { cache:"no-store" });
    if(!res.ok) return null;
    const text = await res.text();
    const parsed = parseCSV(text);
    csvCache.set(path, parsed);
    return parsed;
  }catch(_){
    return null;
  }
}

function parseCSV(text){
  const rows = [];
  let row = [];
  let cur = "";
  let inQuotes = false;

  for(let i=0;i<text.length;i++){
    const c = text[i];
    const n = text[i+1];

    if(inQuotes){
      if(c === '"' && n === '"'){ cur += '"'; i++; continue; }
      if(c === '"'){ inQuotes = false; continue; }
      cur += c;
      continue;
    }

    if(c === '"'){ inQuotes = true; continue; }
    if(c === ","){ row.push(cur); cur=""; continue; }
    if(c === "\r"){ continue; }
    if(c === "\n"){
      row.push(cur); cur="";
      if(row.some(x => String(x).trim() !== "")) rows.push(row);
      row = [];
      continue;
    }
    cur += c;
  }
  row.push(cur);
  if(row.some(x => String(x).trim() !== "")) rows.push(row);

  const header = (rows[0] || []).map(h => String(h || "").trim());
  const body = rows.slice(1).map(r => {
    const o = {};
    header.forEach((h, idx) => o[h] = (r[idx] ?? "").trim());
    return o;
  });
  return { header, body };
}

function findSizeColumn(header){
  return header.find(h => /^(size|サイズ)$/i.test(h)) || header[0];
}
function findChestFlatColumn(header){
  return header.find(h => /chest/i.test(h) && /(flat|width)/i.test(h))
    || header.find(h => /身幅|胸幅/.test(h))
    || header.find(h => /chest/i.test(h))
    || null;
}
function findFootLenColumn(header){
  return header.find(h => /foot/i.test(h) && /length/i.test(h))
    || header.find(h => /足の長さ|足長/.test(h))
    || header.find(h => /foot/i.test(h))
    || null;
}

function renderTable({header, body}){
  el.tableHead.innerHTML = "";
  el.tableBody.innerHTML = "";

  const sizeCol = findSizeColumn(header);

  const trh = document.createElement("tr");
  header.forEach(h => {
    const th = document.createElement("th");
    th.textContent = h;
    trh.appendChild(th);
  });
  el.tableHead.appendChild(trh);

  body.forEach(row => {
    const tr = document.createElement("tr");
    const sizeVal = (row[sizeCol] ?? "").trim();
    if(sizeVal) tr.dataset.size = sizeVal;

    header.forEach(h => {
      const td = document.createElement("td");
      td.textContent = row[h] ?? "";
      tr.appendChild(td);
    });
    el.tableBody.appendChild(tr);
  });

  // テーブル描画後：lastRecが有効ならハイライトだけ反映（スクロールなし）
  applyHighlightFromState({ autoScroll:false });
}

async function loadAndRenderTable(){
  try{
    const prod = currentProduct();
    const candidates = (state.unit === "cm") ? prod.csvCandidates.cm : prod.csvCandidates.inch;
    const parsed = await fetchFirstWorkingCSV(candidates);
    renderTable(parsed);
  }catch(_){
    el.tableHead.innerHTML = `<tr><th>${state.lang==="jp" ? "読み込みエラー" : "Load error"}</th></tr>`;
    el.tableBody.innerHTML = `<tr><td>${state.lang==="jp"
      ? "CSVが見つかりません。dataフォルダのCSVファイル名を確認してください。"
      : "CSV not found. Please confirm filenames in the data folder."}</td></tr>`;
  }
}

/* ---------- Highlight + auto scroll ---------- */
function applyHighlightFromState({ autoScroll = false } = {}) {
  document.querySelectorAll(".table tr.hitRow").forEach(tr => tr.classList.remove("hitRow"));

  if(!state.lastRec) return;
  if(state.lastRec.productId !== state.productId) return;
  if(state.lastRec.unit !== state.unit) return;

  const targetSize = String(state.lastRec.size || "").trim();
  if(!targetSize) return;

  const hit = el.tableBody.querySelector(`tr[data-size="${CSS.escape(targetSize)}"]`);
  if(!hit) return;

  hit.classList.add("hitRow");

  if(autoScroll){
    scrollToId("tableCard");
    setTimeout(() => {
      hit.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 450);
  }
}

/* ---------- result rendering ---------- */
function renderNoMatch(){
  const t = currentT();
  el.resultBox.innerHTML = `
    <div class="resultSize">${escapeHTML(t.noMatchTitle)}</div>
    <div class="resultMeta">${escapeHTML(t.noMatchMeta)}</div>
    <div class="resultActions">
      <button class="btnMini" type="button" id="btnFix">${escapeHTML(t.fixBtn)}</button>
      <button class="btnMini" type="button" id="btnTable">${escapeHTML(t.tableBtn)}</button>
    </div>
  `;
  $("#btnFix")?.addEventListener("click", () => scrollToId("inputCard"));
  $("#btnTable")?.addEventListener("click", () => scrollToId("tableCard"));
}

function renderRecommended(sizeLabel, rationaleOneLine){
  const t = currentT();
  el.resultBox.innerHTML = `
    <div class="resultSize">${escapeHTML(sizeLabel)}</div>
    <div class="resultMeta">${escapeHTML(rationaleOneLine)}</div>
    <div class="resultActions">
      <button class="btnMini" type="button" id="btnTable2">${escapeHTML(t.tableBtn2)}</button>
    </div>
  `;
  $("#btnTable2")?.addEventListener("click", () => scrollToId("tableCard"));
}

/* ---------- validation ---------- */
function validateRange(kind, v){
  if(!Number.isFinite(v)) return { ok:false, msg: state.lang==="jp" ? "数値を入力してください。" : "Please enter a number." };

  if(kind === "chest"){
    if(state.unit==="cm" && (v<60 || v>160)) return { ok:false, msg: state.lang==="jp" ? "胸囲が範囲外です（60〜160cm目安）。" : "Chest is out of range (60–160 cm guide)." };
    if(state.unit==="inch" && (v<24 || v>63)) return { ok:false, msg: state.lang==="jp" ? "胸囲が範囲外です（24〜63inch目安）。" : "Chest is out of range (24–63 in guide)." };
  }
  if(kind === "foot"){
    if(state.unit==="cm" && (v<20 || v>32)) return { ok:false, msg: state.lang==="jp" ? "足長が範囲外です（20〜32cm目安）。" : "Foot length is out of range (20–32 cm guide)." };
    if(state.unit==="inch" && (v<7.9 || v>12.6)) return { ok:false, msg: state.lang==="jp" ? "足長が範囲外です（7.9〜12.6inch目安）。" : "Foot length is out of range (7.9–12.6 in guide)." };
  }
  return { ok:true, msg:"" };
}

/* ---------- calculate ---------- */
async function calculate(){
  const prod = currentProduct();
  const t = currentT();
  const unit = unitLabel();

  const err = $("#inputErrorBox");
  if(err) err.remove();

  // CSV
  let parsed = null;
  try{
    const candidates = (state.unit === "cm") ? prod.csvCandidates.cm : prod.csvCandidates.inch;
    parsed = await fetchFirstWorkingCSV(candidates);
  }catch(_){
    renderNoMatch();
    return;
  }

  const header = parsed.header;
  const body = parsed.body;
  const sizeCol = findSizeColumn(header);

  if(prod.type === "shoes"){
    const foot = toFloatSafe($("#footInput")?.value);
    const vr = validateRange("foot", foot);
    if(!vr.ok){ showInputError(vr.msg); renderNoMatch(); return; }

    const allowValues = getAllowValues();
    const allow = allowValues[state.allowKey || "m"];
    const target = round1(foot + allow);

    const footCol = findFootLenColumn(header);
    if(!footCol){ renderNoMatch(); return; }

    let best = null;
    for(const r of body){
      const v = toFloatSafe(r[footCol]);
      if(!Number.isFinite(v)) continue;
      if(v >= target && (!best || v < best.v)){
        best = { v, row:r };
      }
    }
    if(!best){ renderNoMatch(); return; }

    const size = (best.row[sizeCol] || "").trim() || "—";
    const rationale = t.rationaleFoot(foot, allow, unit, target, size);

    renderRecommended(size, rationale);

    // ★ここ：確定 → ハイライト＆自動スクロール
    state.lastRec = { productId: state.productId, unit: state.unit, size };
    saveState();
    applyHighlightFromState({ autoScroll:true });
    return;
  }

  // apparel
  const nude = toFloatSafe($("#chestInput")?.value);
  const vr = validateRange("chest", nude);
  if(!vr.ok){ showInputError(vr.msg); renderNoMatch(); return; }

  const easeValues = getEaseValues();
  const ease = easeValues[state.easeKey || "std"];
  const target = round1(nude + ease);

  const chestCol = findChestFlatColumn(header);
  if(!chestCol){ renderNoMatch(); return; }

  let best = null;
  for(const r of body){
    const flat = toFloatSafe(r[chestCol]);
    if(!Number.isFinite(flat)) continue;
    const finished = flat * 2;
    if(finished >= target && (!best || finished < best.finished)){
      best = { finished, row:r };
    }
  }
  if(!best){ renderNoMatch(); return; }

  const size = (best.row[sizeCol] || "").trim() || "—";
  const rationale = t.rationaleChest(nude, ease, unit, target, size);

  renderRecommended(size, rationale);

  // ★ここ：確定 → ハイライト＆自動スクロール
  state.lastRec = { productId: state.productId, unit: state.unit, size };
  saveState();
  applyHighlightFromState({ autoScroll:true });
}

/* ---------- render ---------- */
function renderTexts(){
  const t = currentT();
  el.brandSub.textContent = t.sub;

  el.titleGuide.textContent = t.guideTitle;
  el.hintGuide.textContent = t.guideHint;

  el.titleInput.textContent = t.inputTitle;
  el.hintInput.textContent = t.inputHint;

  el.labelProduct.textContent = t.product;
  el.calcBtn.textContent = t.calc;

  el.titleNotes.textContent = t.notes;
  el.titleResult.textContent = t.result;

  el.titleTable.textContent = t.table;
  el.hintTable.textContent = t.tableHint;

  el.unitPill.textContent = state.unit;
}

function renderToggles(){
  if(state.lang === "jp"){
    setActive(el.langJP, el.langEN);
  }else{
    setActive(el.langEN, el.langJP);
  }
}

async function renderGuide(){
  const prod = currentProduct();
  const t = currentT();
  await setGuideImageByCandidates(prod.guideImgCandidates);
  el.imgNote.textContent = t.imgNote;
}

function renderFooter(){
  const y = new Date().getFullYear();
  el.footerCopy.textContent = `© ${y} Transcend Color Digital Apparel`;
}

function renderAll(){
  renderToggles();
  renderTexts();
  rebuildProductDropdown();
  renderInputs();
  renderNotes();
  renderGuide();
  loadAndRenderTable();
}

/* ---------- events ---------- */
function wireEvents(){
  el.langJP.addEventListener("click", () => setLang("jp"));
  el.langEN.addEventListener("click", () => setLang("en"));

  el.calcBtn.addEventListener("click", async () => {
    try{ await calculate(); }
    catch(_){ renderNoMatch(); }
  });
}

/* ---------- boot ---------- */
(function boot(){
  loadState();

  // safety
  if(!PRODUCTS.some(p => p.id === state.productId)) state.productId = PRODUCTS[0].id;
  if(state.lang !== "jp" && state.lang !== "en") state.lang = "jp";

  // 固定運用：言語に合わせて単位決定
  state.unit = (state.lang === "jp") ? "cm" : "inch";

  wireEvents();
  wireComboEvents();
  renderFooter();
  renderAll();
  saveState();
})();
