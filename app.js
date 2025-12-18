/* =========================================
   TCDA Size Guide (clarity-first, rebuilt)
   - JP/EN
   - cm/inch
   - Custom dropdown (2-line labels)
   - Show only required inputs per product
   - 1-line rationale in result
   - Error + next action buttons
   - CSV table + download
   - State saved (language/unit/product/input)
========================================= */

const $ = (q) => document.querySelector(q);

const el = {
  langJP: $("#langJP"),
  langEN: $("#langEN"),
  unitCM: $("#unitCM"),
  unitIN: $("#unitIN"),
  unitBadge: $("#unitBadge"),

  brandSub: $("#brandSub"),

  productButton: $("#productButton"),
  productButtonText: $("#productButtonText"),
  productList: $("#productList"),

  guideImage: $("#guideImage"),
  imgNote: $("#imgNote"),
  imgFallback: $("#imgFallback"),

  titleGuide: $("#titleGuide"),
  hintGuide: $("#hintGuide"),
  titleInput: $("#titleInput"),
  hintInput: $("#hintInput"),
  labelProduct: $("#labelProduct"),
  calcBtn: $("#calcBtn"),
  titleNotes: $("#titleNotes"),
  noticeBox: $("#noticeBox"),
  titleResult: $("#titleResult"),
  resultBox: $("#resultBox"),

  titleTable: $("#titleTable"),
  hintTable: $("#hintTable"),
  tableHead: $("#tableHead"),
  tableBody: $("#tableBody"),
  downloadCsvBtn: $("#downloadCsvBtn"),

  inputArea: $("#inputArea"),
  inputCard: $("#inputCard"),
  tableCard: $("#tableCard"),

  footerCopy: $("#footerCopy"),
};

const CM_PER_IN = 2.54;
const STORAGE_KEY = "tcda_sizeguide_v2";

/* ---------- i18n ---------- */
const T = {
  jp: {
    sub: "Size Guide",
    guideTitle: "採寸ガイド",
    guideHint: "画像は商品に応じて切り替わります。",
    inputTitle: "入力（任意）",
    inputHint: "入力なしでもサイズ表は見られます",
    product: "商品",
    calc: "おすすめサイズを計算",
    notes: "選ぶときの注意事項",
    result: "おすすめ",
    table: "サイズ表",
    tableHint: "数値は平置き採寸です（誤差 ±1〜2）",
    download: "CSVをダウンロード",
    // inputs
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
    // result messages
    noMatchTitle: "該当するサイズが見当たりませんでした。",
    noMatchMeta: "入力値とサイズ表の範囲が合っていない可能性があります。",
    fixBtn: "入力を見直す",
    tableBtn: "サイズ表で選ぶ",
    tableBtn2: "サイズ表を確認",
    // rationale templates
    rationaleChest: (nude, ease, unit, target, chosen) =>
      `根拠：ヌード胸囲 ${nude}${unit} + ゆとり ${ease}${unit} = 目安 ${target}${unit} → 最小で満たすサイズ：${chosen}`,
    rationaleFoot: (foot, allow, unit, target, chosen) =>
      `根拠：足長 ${foot}${unit} + 捨て寸 ${allow}${unit} = 目安 ${target}${unit} → 最小で満たすサイズ：${chosen}`,
  },
  en: {
    sub: "Size Guide",
    guideTitle: "Measuring Guide",
    guideHint: "Image changes by product.",
    inputTitle: "Input (optional)",
    inputHint: "You can view the size table without input.",
    product: "Product",
    calc: "Calculate recommended size",
    notes: "Notes when choosing",
    result: "Recommended",
    table: "Size Table",
    tableHint: "Values are flat measurements (±1–2).",
    download: "Download CSV",
    // inputs
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
    // result messages
    noMatchTitle: "No matching size was found.",
    noMatchMeta: "Your input may be outside the size table range.",
    fixBtn: "Review input",
    tableBtn: "Choose from table",
    tableBtn2: "Check size table",
    // rationale templates
    rationaleChest: (nude, ease, unit, target, chosen) =>
      `Why: body chest ${nude}${unit} + ease ${ease}${unit} = target ${target}${unit} → smallest size that fits: ${chosen}`,
    rationaleFoot: (foot, allow, unit, target, chosen) =>
      `Why: foot length ${foot}${unit} + allowance ${allow}${unit} = target ${target}${unit} → smallest size that fits: ${chosen}`,
  }
};

/* ---------- Products (match your repo filenames) ---------- */
const PRODUCTS = [
  {
    id: "mens_tshirt",
    type: "tee",
    labelJP: ["Men's Crew Neck", "T-Shirt"],
    labelEN: ["Men's Crew Neck", "T-Shirt"],
    guideImg: "assets/guide_tshirt.jpg",
    csv: { cm: "data/aop_mens_crew_cm.csv", inch: "data/aop_mens_crew_inch.csv" },
    notes: {
      jp: [
        "Men’sはゆったり・直線的、Women’sはフィット寄りになりやすい。",
        "最短で失敗を減らす：手持ちの「いちばん好きな服」を平置きで測り、サイズ表の近い数値を選ぶ。",
        "体から逆算：ヌード胸囲＋ゆとり → 仕上がり胸囲 → 身幅（仕上がり胸囲÷2）。",
        "優先順位：身幅 → 着丈 → 袖丈（袖は肩線位置で体感が変わる）。"
      ],
      en: [
        "Men’s tends to be roomier/straighter; Women’s tends to be more fitted.",
        "Fastest way to avoid mistakes: measure your favorite tee (flat) and pick the closest numbers in the table.",
        "From body: body chest + ease → target finished chest → half chest (target ÷ 2).",
        "Priority: width → length → sleeve (sleeve feel changes with shoulder seam position)."
      ]
    }
  },
  {
    id: "womens_tshirt",
    type: "tee",
    labelJP: ["Women's Crew Neck", "T-Shirt"],
    labelEN: ["Women's Crew Neck", "T-Shirt"],
    guideImg: "assets/guide_tshirt.jpg",
    csv: { cm: "data/aop_womens_crew_cm.csv", inch: "data/aop_womens_crew_inch.csv" },
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
    type: "hoodie",
    labelJP: ["All-Over Print", "Recycled Unisex Hoodie"],
    labelEN: ["All-Over Print", "Recycled Unisex Hoodie"],
    guideImg: "assets/guide_hoodie.jpg",
    csv: { cm: "data/aop_recycled_hoodie_cm.csv", inch: "data/aop_recycled_hoodie_inch.csv" },
    notes: {
      jp: [
        "基本はTシャツと同じ（胸囲→身幅→着丈→袖）。",
        "フーディは裾リブ等で体感が変わるため、同じ数値でも印象が少し違う。",
        "迷ったら：標準→動きやすさ重視は「ゆったり」寄り。"
      ],
      en: [
        "Same base logic as tees (chest → width → length → sleeve).",
        "Hoodies can feel different even with the same numbers due to rib/structure.",
        "If unsure: choose slightly roomier for comfort/movement."
      ]
    }
  },
  {
    id: "unisex_zip_hoodie",
    type: "hoodie",
    labelJP: ["All-Over Print", "Recycled Unisex Zip Hoodie"],
    labelEN: ["All-Over Print", "Recycled Unisex Zip Hoodie"],
    guideImg: "assets/guide_zip_hoodie.jpg",
    csv: { cm: "data/aop_recycled_zip_hoodie_cm.csv", inch: "data/aop_recycled_zip_hoodie_inch.csv" },
    notes: {
      jp: [
        "基本はTシャツと同じ（胸囲→身幅→着丈→袖）。",
        "ジップは前開きでも、裾リブ/構造で体感が変わる。",
        "迷ったら：標準→動きやすさ重視は「ゆったり」寄り。"
      ],
      en: [
        "Same base logic as tees (chest → width → length → sleeve).",
        "Zip hoodies can still feel different due to rib/structure.",
        "If unsure: choose slightly roomier for comfort/movement."
      ]
    }
  },
  {
    id: "womens_slipon",
    type: "shoes",
    labelJP: ["Women's Slip-On", "Canvas Shoes"],
    labelEN: ["Women's Slip-On", "Canvas Shoes"],
    guideImg: "assets/guide_slipon.jpg",
    csv: { cm: "data/womens_slipon_cm.csv", inch: "data/womens_slipon_inch.csv" },
    notes: {
      jp: [
        "主役は足長（左右を測り、長い方を採用）。",
        "足長＋捨て寸（目安7〜12mm）で選ぶ。",
        "アウトソール長は外寸なので足長と同一視しない。",
        "Women’sはタイトになりやすい。幅広/甲高は迷ったら大きめ寄り。"
      ],
      en: [
        "Foot length is key (measure both feet and use the longer one).",
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
    guideImg: "assets/guide_slipon.jpg",
    csv: { cm: "data/mens_slipon_cm.csv", inch: "data/mens_slipon_inch.csv" },
    notes: {
      jp: [
        "主役は足長（左右を測り、長い方を採用）。",
        "足長＋捨て寸（目安7〜12mm）で選ぶ。",
        "アウトソール長は外寸なので足長と同一視しない。",
        "Men’sは幅広め。幅広/甲高でも迷ったら大きめ寄り。"
      ],
      en: [
        "Foot length is key (measure both feet and use the longer one).",
        "Choose by foot length + allowance (about 7–12mm).",
        "Outsole length is the outside measurement—don’t treat it as foot length.",
        "Men’s tends to be wider; if unsure, consider slightly roomier."
      ]
    }
  },
];

const state = {
  lang: "jp",      // "jp" | "en"
  unit: "cm",      // "cm" | "inch"
  productId: PRODUCTS[0].id,
  // inputs cache
  chest: "",
  foot: "",
  // selections
  easeKey: "std",   // std | loose | more
  allowKey: "m",    // s | m | l
};

/* ---------- helpers ---------- */
function round1(n){ return Math.round(n * 10) / 10; }
function cmToIn(cm){ return cm / CM_PER_IN; }
function inToCm(inch){ return inch * CM_PER_IN; }

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

function saveState(){
  try{
    const payload = { ...state };
    // 現在の入力欄からも拾う（存在する場合だけ）
    const chestEl = $("#chestInput");
    const footEl  = $("#footInput");
    if(chestEl) payload.chest = chestEl.value ?? "";
    if(footEl) payload.foot = footEl.value ?? "";
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }catch(_){}
}
function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return;
    const s = JSON.parse(raw);
    if(s && typeof s === "object"){
      Object.assign(state, s);
    }
  }catch(_){}
}

function setActive(btnOn, btnOff){
  btnOn.classList.add("active");
  btnOff.classList.remove("active");
}

function setLang(next){
  state.lang = next;
  // 仕様：JPはcm、ENはinch（ここは固定運用）
  if(next === "jp") setUnit("cm", {convertInputs:true});
  if(next === "en") setUnit("inch", {convertInputs:true});
  renderAll();
  saveState();
}

function setUnit(next, {convertInputs} = {convertInputs:true}){
  const prev = state.unit;
  state.unit = next;

  // 入力値も追従変換（混乱防止）
  if(convertInputs && prev !== next){
    const chestEl = $("#chestInput");
    const footEl  = $("#footInput");
    const conv = (x) => {
      if(!Number.isFinite(x)) return NaN;
      if(prev === "cm" && next === "inch") return cmToIn(x);
      if(prev === "inch" && next === "cm") return inToCm(x);
      return x;
    };
    if(chestEl){
      const v = toFloatSafe(chestEl.value);
      if(Number.isFinite(v)) chestEl.value = String(round1(conv(v)));
    }
    if(footEl){
      const v = toFloatSafe(footEl.value);
      if(Number.isFinite(v)) footEl.value = String(round1(conv(v)));
    }
  }

  renderAll();
  saveState();
}

function currentT(){ return T[state.lang]; }
function unitLabel(){ return state.unit === "cm" ? "cm" : "inch"; }

function currentProduct(){
  return PRODUCTS.find(p => p.id === state.productId) || PRODUCTS[0];
}

function scrollToId(id){
  const t = document.getElementById(id);
  if(!t) return;
  t.scrollIntoView({ behavior:"smooth", block:"start" });
}

/* ---------- UI: dropdown ---------- */
function optionHTML(p){
  const lines = (state.lang === "jp") ? p.labelJP : p.labelEN;
  const l1 = lines[0] ?? "";
  const l2 = lines[1] ?? "";
  return `
    <div class="comboLine1">${escapeHTML(l1)}</div>
    <div class="comboLine2">${escapeHTML(l2)}</div>
  `;
}
function escapeHTML(s){
  return String(s).replace(/[&<>"']/g, (m) => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[m]));
}

function closeCombo(){
  el.productList.hidden = true;
  el.productButton.setAttribute("aria-expanded","false");
}
function openCombo(){
  el.productList.hidden = false;
  el.productButton.setAttribute("aria-expanded","true");

  // 選択中が見える位置へスクロール（迷い防止）
  requestAnimationFrame(() => {
    const selected = el.productList.querySelector('[aria-selected="true"]');
    if(selected) selected.scrollIntoView({block:"nearest"});
  });
}

function rebuildProductDropdown(){
  // button text
  const p = currentProduct();
  el.productButtonText.innerHTML = optionHTML(p);

  // list
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

  // click outside
  document.addEventListener("click", (e) => {
    if(!e.target) return;
    if(e.target.closest("#productCombo")) return;
    closeCombo();
  });

  // keyboard UX
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
      return;
    }
  });
}

/* ---------- Inputs (show only needed) ---------- */
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

function buildApparelInputs(){
  const t = currentT();
  const unit = unitLabel();

  const wrapper = document.createElement("div");

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
  inp.placeholder = state.lang === "jp" ? "例：88" : "e.g. 34.6";
  inp.value = state.chest || "";
  inp.addEventListener("input", () => { state.chest = inp.value; saveState(); });
  col1.append(lab1, inp);

  const col2 = document.createElement("div");
  const lab2 = document.createElement("label");
  lab2.className = "label";
  lab2.textContent = t.easeLabel;

  const sel = document.createElement("select");
  sel.className = "select";
  sel.id = "easeSelect";

  const easeValues = getEaseValues(); // {std,loose,more} in current unit
  const opt1 = new Option(t.easeStd(`${easeValues.std}${unit}`), "std");
  const opt2 = new Option(t.easeLoose(`${easeValues.loose}${unit}`), "loose");
  const opt3 = new Option(t.easeMore(`${easeValues.more}${unit}`), "more");
  sel.add(opt1); sel.add(opt2); sel.add(opt3);
  sel.value = state.easeKey || "std";
  sel.addEventListener("change", () => { state.easeKey = sel.value; saveState(); });

  col2.append(lab2, sel);

  row.append(col1, col2);
  wrapper.appendChild(row);

  return wrapper;
}

function buildShoesInputs(){
  const t = currentT();
  const unit = unitLabel();

  const wrapper = document.createElement("div");
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
  inp.placeholder = state.lang === "jp" ? "例：23.5" : "e.g. 9.25";
  inp.value = state.foot || "";
  inp.addEventListener("input", () => { state.foot = inp.value; saveState(); });
  col1.append(lab1, inp);

  const col2 = document.createElement("div");
  const lab2 = document.createElement("label");
  lab2.className = "label";
  lab2.textContent = t.allowLabel;

  const sel = document.createElement("select");
  sel.className = "select";
  sel.id = "allowSelect";

  const allowValues = getAllowValues(); // {s,m,l} in current unit
  const opt1 = new Option(t.allowS(`${allowValues.s}${unit}`), "s");
  const opt2 = new Option(t.allowM(`${allowValues.m}${unit}`), "m");
  const opt3 = new Option(t.allowL(`${allowValues.l}${unit}`), "l");
  sel.add(opt1); sel.add(opt2); sel.add(opt3);
  sel.value = state.allowKey || "m";
  sel.addEventListener("change", () => { state.allowKey = sel.value; saveState(); });

  col2.append(lab2, sel);

  row.append(col1, col2);
  wrapper.appendChild(row);

  return wrapper;
}

function getEaseValues(){
  // 基準：cmは +8/+10/+12、inchは換算（小数1桁）
  if(state.unit === "cm") return { std: 8, loose: 10, more: 12 };
  return { std: round1(cmToIn(8)), loose: round1(cmToIn(10)), more: round1(cmToIn(12)) };
}
function getAllowValues(){
  // 基準：cmは 0.7/1.0/1.2（=7-12mm）
  if(state.unit === "cm") return { s: 0.7, m: 1.0, l: 1.2 };
  return { s: round1(cmToIn(0.7)), m: round1(cmToIn(1.0)), l: round1(cmToIn(1.2)) };
}

function renderInputs(){
  clearInputArea();

  const prod = currentProduct();
  if(prod.type === "shoes"){
    el.inputArea.appendChild(buildShoesInputs());
  }else{
    el.inputArea.appendChild(buildApparelInputs());
  }
}

/* ---------- Notes ---------- */
function renderNotes(){
  const prod = currentProduct();
  const items = prod.notes[state.lang] || [];
  el.noticeBox.innerHTML = `
    <ul>
      ${items.map(x => `<li>${escapeHTML(x)}</li>`).join("")}
    </ul>
    <div class="muted" style="margin-top:10px;">
      ${state.lang==="jp"
        ? "国籍でロジックは変わりません。見るべきは「仕上がり寸法（服）」と「足長（靴）」です。"
        : "The logic doesn’t change by nationality. Focus on finished garment measurements and foot length."}
    </div>
  `;
}

/* ---------- Guide image ---------- */
function renderGuideImage(){
  const prod = currentProduct();
  const src = prod.guideImg;

  el.imgFallback.hidden = true;
  el.guideImage.hidden = false;

  el.guideImage.onerror = () => {
    el.guideImage.hidden = true;
    el.imgFallback.hidden = false;
    el.imgFallback.textContent =
      state.lang === "jp"
        ? "画像を読み込めませんでした。assets フォルダ内のファイル名（拡張子・大小文字）とパスが一致しているか確認してください。"
        : "Image failed to load. Please confirm the filename (including extension/case) and path in the assets folder.";
  };

  el.guideImage.src = src;
  el.imgNote.textContent = state.lang === "jp"
    ? "※ 画像は商品に応じて切り替わります"
    : "Image changes by product.";
}

/* ---------- CSV loading + table ---------- */
const csvCache = new Map();

async function fetchCSV(path){
  if(csvCache.has(path)) return csvCache.get(path);
  const res = await fetch(path, { cache:"no-store" });
  if(!res.ok) throw new Error(`CSV load failed: ${path}`);
  const text = await res.text();
  const parsed = parseCSV(text);
  csvCache.set(path, parsed);
  return parsed;
}

function parseCSV(text){
  // simple robust CSV parser (quotes supported)
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
      // skip empty last line
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

function renderTable({header, body}){
  el.tableHead.innerHTML = "";
  el.tableBody.innerHTML = "";

  const trh = document.createElement("tr");
  header.forEach(h => {
    const th = document.createElement("th");
    th.textContent = h;
    trh.appendChild(th);
  });
  el.tableHead.appendChild(trh);

  body.forEach(row => {
    const tr = document.createElement("tr");
    header.forEach(h => {
      const td = document.createElement("td");
      td.textContent = row[h] ?? "";
      tr.appendChild(td);
    });
    el.tableBody.appendChild(tr);
  });
}

function csvPathForCurrent(){
  const prod = currentProduct();
  return (state.unit === "cm") ? prod.csv.cm : prod.csv.inch;
}

async function loadAndRenderTable(){
  try{
    const path = csvPathForCurrent();
    const parsed = await fetchCSV(path);
    renderTable(parsed);
  }catch(err){
    // show a simple table error
    el.tableHead.innerHTML = `<tr><th>${state.lang==="jp" ? "読み込みエラー" : "Load error"}</th></tr>`;
    el.tableBody.innerHTML = `<tr><td>${escapeHTML(String(err.message || err))}</td></tr>`;
  }
}

/* ---------- Recommendation logic ---------- */
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

function findSizeColumn(header){
  // common: "Size" / "サイズ"
  return header.find(h => /^(size|サイズ)$/i.test(h)) || header[0];
}
function findChestFlatColumn(header){
  // common: "Chest (flat)" / "Chest｜..." / "身幅"
  return header.find(h => /chest/i.test(h) && /(flat|width)/i.test(h))
    || header.find(h => /身幅|胸幅/.test(h))
    || header.find(h => /chest/i.test(h))
    || null;
}
function findFootLenColumn(header){
  // common: "Foot length" / "足の長さ" / "足長"
  return header.find(h => /foot/i.test(h) && /length/i.test(h))
    || header.find(h => /足の長さ|足長/.test(h))
    || header.find(h => /foot/i.test(h))
    || null;
}

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

async function calculate(){
  const prod = currentProduct();
  const t = currentT();
  const unit = unitLabel();

  // clear error
  const err = $("#inputErrorBox");
  if(err) err.remove();

  // load csv
  const path = csvPathForCurrent();
  const parsed = await fetchCSV(path);
  const header = parsed.header;
  const body = parsed.body;

  const sizeCol = findSizeColumn(header);

  if(prod.type === "shoes"){
    const footEl = $("#footInput");
    const foot = toFloatSafe(footEl?.value);
    const vr = validateRange("foot", foot);
    if(!vr.ok){ showInputError(vr.msg); renderNoMatch(); return; }

    const allowValues = getAllowValues();
    const allow = allowValues[state.allowKey || "m"];
    const target = round1(foot + allow);

    const footCol = findFootLenColumn(header);
    if(!footCol){ renderNoMatch(); return; }

    // pick smallest footLen >= target
    let best = null;
    for(const r of body){
      const v = toFloatSafe(r[footCol]);
      if(!Number.isFinite(v)) continue;
      if(v >= target){
        if(!best || v < best.v){
          best = { v, row:r };
        }
      }
    }
    if(!best){ renderNoMatch(); return; }

    const size = best.row[sizeCol] || "—";
    const rationale = t.rationaleFoot(foot, allow, unit, target, size);
    renderRecommended(size, rationale);
    saveState();
    return;
  }

  // apparel
  const chestEl = $("#chestInput");
  const nude = toFloatSafe(chestEl?.value);
  const vr = validateRange("chest", nude);
  if(!vr.ok){ showInputError(vr.msg); renderNoMatch(); return; }

  const easeValues = getEaseValues();
  const ease = easeValues[state.easeKey || "std"];
  const target = round1(nude + ease);

  const chestCol = findChestFlatColumn(header);
  if(!chestCol){ renderNoMatch(); return; }

  // target finished chest -> choose smallest (flat*2) >= target
  let best = null;
  for(const r of body){
    const flat = toFloatSafe(r[chestCol]);
    if(!Number.isFinite(flat)) continue;
    const finished = flat * 2;
    if(finished >= target){
      if(!best || finished < best.finished){
        best = { finished, flat, row:r };
      }
    }
  }
  if(!best){ renderNoMatch(); return; }

  const size = best.row[sizeCol] || "—";
  const rationale = t.rationaleChest(nude, ease, unit, target, size);
  renderRecommended(size, rationale);
  saveState();
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

  el.downloadCsvBtn.textContent = t.download;

  el.unitBadge.textContent = unitLabel();
}

function renderToggles(){
  setActive(el.langJP, el.langEN);
  setActive(el.unitCM, el.unitIN);

  if(state.lang === "en"){
    el.langEN.classList.add("active"); el.langJP.classList.remove("active");
  }else{
    el.langJP.classList.add("active"); el.langEN.classList.remove("active");
  }
  if(state.unit === "inch"){
    el.unitIN.classList.add("active"); el.unitCM.classList.remove("active");
  }else{
    el.unitCM.classList.add("active"); el.unitIN.classList.remove("active");
  }
}

function renderFooter(){
  const y = new Date().getFullYear();
  el.footerCopy.textContent = `© ${y} Transcend Color Digital Apparel`;
}

function renderAll(){
  renderToggles();
  renderTexts();
  rebuildProductDropdown();
  renderGuideImage();
  renderInputs();
  renderNotes();
  loadAndRenderTable();
  // 画面の初期結果は「—」でOK（押した時だけ出す）
}

/* ---------- events ---------- */
function wireEvents(){
  el.langJP.addEventListener("click", () => setLang("jp"));
  el.langEN.addEventListener("click", () => setLang("en"));

  // 単位ボタンは残しつつ、言語切替時はJP=cm / EN=inchに戻る設計
  el.unitCM.addEventListener("click", () => setUnit("cm", {convertInputs:true}));
  el.unitIN.addEventListener("click", () => setUnit("inch", {convertInputs:true}));

  el.calcBtn.addEventListener("click", async () => {
    try{ await calculate(); }
    catch(e){ renderNoMatch(); }
  });

  el.downloadCsvBtn.addEventListener("click", () => {
    const path = csvPathForCurrent();
    const a = document.createElement("a");
    a.href = path;
    a.download = path.split("/").pop() || "size.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
  });
}

/* ---------- boot ---------- */
(function boot(){
  loadState();

  // 初期：状態が壊れていた時の保険
  if(!PRODUCTS.some(p => p.id === state.productId)) state.productId = PRODUCTS[0].id;
  if(state.lang !== "jp" && state.lang !== "en") state.lang = "jp";
  if(state.unit !== "cm" && state.unit !== "inch") state.unit = "cm";

  // 仕様固定：言語に合わせて単位を整える（迷い防止）
  if(state.lang === "jp") state.unit = "cm";
  if(state.lang === "en") state.unit = "inch";

  wireEvents();
  wireComboEvents();
  renderFooter();
  renderAll();
})();
