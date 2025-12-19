/* TCDA Size Guide
   - JP/EN + cm/inch toggle (JP=cm, EN=inch)
   - Product-based CSV loading
   - Size recommendation:
     * TOPS/OUTER: nude chest (preferred) OR estimated chest from height+weight/BMI+gender
     * SHOES: foot length + allowance
*/

const state = {
  lang: "jp",   // "jp" | "en"
  unit: "cm",   // "cm" | "inch"
  productKey: "aop_mens_crew",
  rows: [],
  columns: [],
};

const I18N = {
  jp: {
    guideTitle: "採寸ガイド",
    guideNote: "※画像は商品に応じて切り替わります",
    calcTitle: "サイズ算出",
    calcSub: "入力しなくてもサイズ表だけ見て選べます",
    product: "商品",
    nudeChest: "ヌード胸囲",
    fit: "ゆとり（目安）",
    tight: "ぴったり",
    standard: "標準",
    relaxed: "ゆったり",
    estimateSummary: "推定入力（身長＋体重/BMI＋性別）",
    height: "身長",
    weight: "体重",
    bmi: "BMI（任意）",
    bmiHint: "体重を入れると自動計算（BMIだけ入力でもOK）",
    gender: "性別",
    female: "女性",
    male: "男性",
    other: "その他/未回答",
    region: "基準",
    jp: "日本平均",
    global: "海外平均",
    regionHint: "推定にのみ使用（実測胸囲が最優先）",
    foot: "足の長さ（かかと〜一番長い指）",
    allowance: "捨て寸（目安）",
    calcBtn: "おすすめサイズを計算",
    result: "おすすめ",
    reset: "入力を見直す",
    chooseByTable: "サイズ表で選ぶ",
    tableTitle: "サイズ表",
    tableNote: "数値は平置き採寸です（誤差 ±1〜2）",
    backToShop: "ショップに戻る",
    msgNeedMore: "入力が不足しています",
  },
  en: {
    guideTitle: "Measurement Guide",
    guideNote: "Image switches depending on the product.",
    calcTitle: "Size Calculator",
    calcSub: "You can also choose by the size chart without input.",
    product: "Product",
    nudeChest: "Body Chest (nude)",
    fit: "Fit (ease)",
    tight: "Tight",
    standard: "Standard",
    relaxed: "Relaxed",
    estimateSummary: "Estimation (height + weight/BMI + gender)",
    height: "Height",
    weight: "Weight",
    bmi: "BMI (optional)",
    bmiHint: "Auto-calculated when weight is provided (BMI-only also OK).",
    gender: "Gender",
    female: "Female",
    male: "Male",
    other: "Other/Prefer not to say",
    region: "Baseline",
    jp: "Japan avg",
    global: "Global avg",
    regionHint: "Used only for estimation (actual chest is best).",
    foot: "Foot length (heel to longest toe)",
    allowance: "Allowance",
    calcBtn: "Calculate recommended size",
    result: "Recommendation",
    reset: "Reset inputs",
    chooseByTable: "Choose by table",
    tableTitle: "Size Chart",
    tableNote: "Measured flat (±1–2 tolerance).",
    backToShop: "Back to Shop",
    msgNeedMore: "Not enough input",
  }
};

const PRODUCTS = [
  { key: "aop_mens_crew",   jp: "メンズ クルーネックT", en: "Men’s Crew Neck T-Shirt",   guide: "assets/guide_tshirt.jpg", type: "tops" },
  { key: "aop_womens_crew", jp: "ウィメンズ クルーネックT", en: "Women’s Crew Neck T-Shirt", guide: "assets/guide_tshirt.jpg", type: "tops" },
  { key: "aop_recycled_hoodie", jp: "ユニセックス パーカー", en: "Recycled Unisex Hoodie", guide: "assets/guide_hoodie.jpg", type: "tops" },
  { key: "aop_recycled_zip", jp: "ユニセックス ジップフーディ", en: "Recycled Unisex Zip Hoodie", guide: "assets/guide_zip_hoodie.jpg", type: "tops" },
  { key: "mens_slipon",     jp: "メンズ スリッポン", en: "Men’s Slip-On Canvas Shoes",     guide: "assets/guide_slipon.jpg", type: "shoes" },
  { key: "womens_slipon",   jp: "ウィメンズ スリッポン", en: "Women’s Slip-On Canvas Shoes", guide: "assets/guide_slipon.jpg", type: "shoes" },
];

// repo の data/ に置いてあるCSVファイル名に合わせる
function csvFile(productKey, unit){
  const suffix = unit === "cm" ? "cm" : "inch";
  const map = {
    aop_mens_crew:        `aop_mens_crew_${suffix}.csv`,
    aop_womens_crew:      `aop_womens_crew_${suffix}.csv`,
    aop_recycled_hoodie:  `aop_recycled_hoodie_${suffix}.csv`,
    aop_recycled_zip:     `aop_recycled_zip_hoodie_${suffix}.csv`,
    mens_slipon:          `mens_slipon_${suffix}.csv`,
    womens_slipon:        `womens_slipon_${suffix}.csv`,
  };
  return map[productKey];
}

function isShoes(productKey){
  const p = PRODUCTS.find(x => x.key === productKey);
  return p?.type === "shoes";
}

const els = {
  backToShop: document.getElementById("backToShop"),
  guideTitle: document.getElementById("guideTitle"),
  guideNote: document.getElementById("guideNote"),
  calcTitle: document.getElementById("calcTitle"),
  calcSub: document.getElementById("calcSub"),
  productLabel: document.getElementById("productLabel"),
  chestLabel: document.getElementById("chestLabel"),
  fitLabel: document.getElementById("fitLabel"),
  estimateSummary: document.getElementById("estimateSummary"),
  heightLabel: document.getElementById("heightLabel"),
  weightLabel: document.getElementById("weightLabel"),
  bmiLabel: document.getElementById("bmiLabel"),
  bmiHint: document.getElementById("bmiHint"),
  genderLabel: document.getElementById("genderLabel"),
  regionLabel: document.getElementById("regionLabel"),
  regionHint: document.getElementById("regionHint"),
  footLabel: document.getElementById("footLabel"),
  allowLabel: document.getElementById("allowLabel"),
  calcBtn: document.getElementById("calcBtn"),
  resultTitle: document.getElementById("resultTitle"),
  tableTitle: document.getElementById("tableTitle"),
  tableNote: document.getElementById("tableNote"),

  productSelect: document.getElementById("productSelect"),
  chestInput: document.getElementById("chestInput"),
  fitSelect: document.getElementById("fitSelect"),
  heightInput: document.getElementById("heightInput"),
  weightInput: document.getElementById("weightInput"),
  bmiInput: document.getElementById("bmiInput"),
  genderSelect: document.getElementById("genderSelect"),
  regionSelect: document.getElementById("regionSelect"),

  footInput: document.getElementById("footInput"),
  allowSelect: document.getElementById("allowSelect"),

  topsInputs: document.getElementById("topsInputs"),
  shoesInputs: document.getElementById("shoesInputs"),

  guideImage: document.getElementById("guideImage"),
  sizeTable: document.getElementById("sizeTable"),
  tableSection: document.getElementById("tableSection"),

  resultValue: document.getElementById("resultValue"),
  resultDetail: document.getElementById("resultDetail"),

  btnReset: document.getElementById("btnReset"),
  btnScrollTable: document.getElementById("btnScrollTable"),
};

// ---------- utilities ----------
function clamp(n, a, b){ return Math.min(b, Math.max(a, n)); }
function toNumber(v){ const n = Number(v); return Number.isFinite(n) ? n : null; }
function unitLabel(){ return state.unit === "cm" ? "cm" : "in"; }
function round1(n){ return Math.round(n * 10) / 10; }
function cmToIn(cm){ return cm / 2.54; }

// minimal CSV parser (no quoted commas needed for your current files)
function parseCSV(text){
  const lines = text.trim().split(/\r?\n/);
  if (!lines.length) return { columns: [], rows: [] };

  const columns = lines[0].split(",").map(s => s.trim());
  const rows = lines.slice(1).filter(l => l.trim().length).map(line => {
    const vals = line.split(",").map(s => s.trim());
    const obj = {};
    columns.forEach((c, i) => obj[c] = vals[i] ?? "");
    return obj;
  });
  return { columns, rows };
}

function getColumnKey(columns, kind){
  const c = columns.map(x => x.toLowerCase());
  const findBy = (pred) => {
    const idx = c.findIndex(pred);
    return idx >= 0 ? columns[idx] : null;
  };

  if (kind === "size") {
    return findBy(x => x === "size" || x.includes("サイズ"));
  }

  // TOPS
  if (kind === "chest_flat") {
    return findBy(x => (x.includes("chest") && (x.includes("flat") || x.includes("1/2"))) || x.includes("身幅") || x.includes("胸幅"));
  }
  if (kind === "length") {
    return findBy(x => x === "length" || x.includes("着丈") || x.includes("body length"));
  }
  if (kind === "sleeve") {
    return findBy(x => x.includes("sleeve") || x.includes("袖"));
  }

  // SHOES
  if (kind === "foot_length") {
    return findBy(x => (x.includes("foot") && x.includes("length")) || x.includes("足の長さ") || x.includes("足長"));
  }
  if (kind === "outsole") {
    return findBy(x => x.includes("outsole") || x.includes("アウトソール"));
  }

  return null;
}

function localizeColumn(kind){
  if (state.lang === "jp") {
    if (kind === "size") return "サイズ";
    if (kind === "chest_flat") return "身幅（平置き）";
    if (kind === "length") return "着丈";
    if (kind === "sleeve") return "袖丈";
    if (kind === "outsole") return "アウトソールの長さ";
    if (kind === "foot_length") return "足の長さ";
  } else {
    if (kind === "size") return "Size";
    if (kind === "chest_flat") return "Chest (flat)";
    if (kind === "length") return "Length";
    if (kind === "sleeve") return "Sleeve";
    if (kind === "outsole") return "Outsole length";
    if (kind === "foot_length") return "Foot length";
  }
  return kind;
}

// ---------- anthropometric baselines (from your uploaded average datasets) ----------
const ANTHRO = {
  jp: {
    female: [
      { h: 152.5, chest: 80.0 },
      { h: 157.5, chest: 82.0 },
      { h: 162.5, chest: 84.0 },
      { h: 167.5, chest: 86.0 }
    ]
  },
  global: {
    female: [
      { h: 152.5, chest: 82.0 },
      { h: 157.5, chest: 84.0 },
      { h: 162.5, chest: 86.0 },
      { h: 167.5, chest: 88.0 }
    ]
  }
};

function interpChestByHeight(regionKey, genderKey, heightCm){
  const series = ANTHRO?.[regionKey]?.[genderKey];
  if (!series || !series.length || !heightCm) return null;

  const h = heightCm;
  const s = series.slice().sort((a,b)=>a.h-b.h);

  if (h <= s[0].h) return s[0].chest;
  if (h >= s[s.length-1].h) return s[s.length-1].chest;

  for (let i=0;i<s.length-1;i++) {
    const a=s[i], b=s[i+1];
    if (h >= a.h && h <= b.h) {
      const t = (h - a.h) / (b.h - a.h);
      return a.chest + (b.chest - a.chest) * t;
    }
  }
  return null;
}

function estimateChestCircumferenceCm(){
  const height = toNumber(els.heightInput.value);
  const weight = toNumber(els.weightInput.value);
  const bmiIn = toNumber(els.bmiInput.value);
  const gender = els.genderSelect.value; // female/male/other
  const region = els.regionSelect.value; // jp/global

  if (!height) return null;

  const hM = height / 100;
  let bmi = null;
  let w = null;

  if (weight && hM > 0) {
    w = weight;
    bmi = weight / (hM*hM);
  } else if (bmiIn && hM > 0) {
    bmi = bmiIn;
    w = bmiIn * (hM*hM);
  } else {
    bmi = 22;
    w = 22 * (hM*hM);
  }

  // base from dataset if available (female only)
  let base = null;
  if (gender === "female") base = interpChestByHeight(region, "female", height);

  // fallback base (rough heuristic) for male/other OR missing data
  if (!base) {
    const gOffset = (gender === "male") ? 8 : (gender === "female") ? 2 : 5;
    base = 0.40*height + 0.28*w + gOffset;
  }

  // BMI adjustment around ~22 (keep gentle)
  const k = (gender === "male") ? 1.4 : 1.1;
  const adj = (bmi - 22) * k;

  return clamp(base + adj, 70, 140);
}

// ---------- rendering ----------
function setPressedButtons(){
  document.querySelectorAll('[data-action="set-lang"]').forEach(btn=>{
    btn.setAttribute("aria-pressed", btn.dataset.value === state.lang ? "true" : "false");
  });
  document.querySelectorAll('[data-action="set-unit"]').forEach(btn=>{
    btn.setAttribute("aria-pressed", btn.dataset.value === state.unit ? "true" : "false");
  });
}

function renderProductOptions(){
  const prev = els.productSelect.value || state.productKey;
  els.productSelect.innerHTML = "";

  PRODUCTS.forEach(p=>{
    const opt = document.createElement("option");
    opt.value = p.key;
    opt.textContent = (state.lang === "jp") ? p.jp : p.en;
    els.productSelect.appendChild(opt);
  });

  els.productSelect.value = prev;
}

function renderAllowOptions(){
  const opts = state.unit === "cm"
    ? [
        { v: 0.5, jp: "＋0.5cm（薄め）", en: "+0.5cm (thin socks)" },
        { v: 0.7, jp: "＋0.7cm（標準）", en: "+0.7cm (standard)" },
        { v: 1.0, jp: "＋1.0cm（ゆとり）", en: "+1.0cm (roomy)" },
        { v: 1.2, jp: "＋1.2cm（厚手）", en: "+1.2cm (thick socks)" },
      ]
    : [
        { v: 0.2, jp: "＋0.2in（薄め）", en: "+0.2in (thin socks)" },
        { v: 0.3, jp: "＋0.3in（標準）", en: "+0.3in (standard)" },
        { v: 0.4, jp: "＋0.4in（ゆとり）", en: "+0.4in (roomy)" },
        { v: 0.5, jp: "＋0.5in（厚手）", en: "+0.5in (thick socks)" },
      ];

  els.allowSelect.innerHTML = "";
  opts.forEach((o, i)=>{
    const opt = document.createElement("option");
    opt.value = String(o.v);
    opt.textContent = (state.lang === "jp") ? o.jp : o.en;
    if (i === 1) opt.selected = true;
    els.allowSelect.appendChild(opt);
  });
}

function applyI18n(){
  const t = I18N[state.lang];

  els.guideTitle.textContent = t.guideTitle;
  els.guideNote.textContent = t.guideNote;
  els.calcTitle.textContent = t.calcTitle;
  els.calcSub.textContent = t.calcSub;

  els.productLabel.textContent = t.product;

  els.fitLabel.textContent = t.fit;
  els.fitSelect.querySelector('option[value="tight"]').textContent = t.tight;
  els.fitSelect.querySelector('option[value="standard"]').textContent = t.standard;
  els.fitSelect.querySelector('option[value="relaxed"]').textContent = t.relaxed;

  els.estimateSummary.textContent = t.estimateSummary;

  els.chestLabel.textContent = `${t.nudeChest} (${unitLabel()})`;
  els.footLabel.textContent = `${t.foot} (${unitLabel()})`;

  els.heightLabel.textContent = `${t.height} (cm)`;
  els.weightLabel.textContent = `${t.weight} (kg)`;
  els.bmiLabel.textContent = t.bmi;
  els.bmiHint.textContent = t.bmiHint;

  els.genderLabel.textContent = t.gender;
  els.genderSelect.querySelector('option[value="female"]').textContent = t.female;
  els.genderSelect.querySelector('option[value="male"]').textContent = t.male;
  els.genderSelect.querySelector('option[value="other"]').textContent = t.other;

  els.regionLabel.textContent = t.region;
  els.regionSelect.querySelector('option[value="jp"]').textContent = t.jp;
  els.regionSelect.querySelector('option[value="global"]').textContent = t.global;
  els.regionHint.textContent = t.regionHint;

  els.allowLabel.textContent = t.allowance;

  els.calcBtn.textContent = t.calcBtn;
  els.resultTitle.textContent = t.result;
  els.btnReset.textContent = t.reset;
  els.btnScrollTable.textContent = t.chooseByTable;

  els.tableTitle.textContent = t.tableTitle;
  els.tableNote.textContent = t.tableNote;

  if (els.backToShop) {
    const span = els.backToShop.querySelector('[data-i18n="backToShop"]');
    if (span) span.textContent = t.backToShop;
    else els.backToShop.textContent = t.backToShop;
  }

  renderProductOptions();

  // baseline dropdown default binds to lang
  if (state.lang === "jp") els.regionSelect.value = "jp";
  if (state.lang === "en") els.regionSelect.value = "global";
}

function setProduct(key){
  state.productKey = key;

  const p = PRODUCTS.find(x=>x.key===key);
  if (p) els.guideImage.src = p.guide;

  const shoes = isShoes(key);
  els.topsInputs.classList.toggle("hidden", shoes);
  els.shoesInputs.classList.toggle("hidden", !shoes);

  els.resultValue.textContent = "—";
  els.resultDetail.textContent = "";

  loadAndRender();
}

async function loadCSV(){
  const file = csvFile(state.productKey, state.unit);
  if (!file) throw new Error("CSV not mapped for this product/unit.");

  const url = `data/${file}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load ${url}`);
  const text = await res.text();
  const parsed = parseCSV(text);

  state.columns = parsed.columns;
  state.rows = parsed.rows;
}

function renderTable(){
  const cols = state.columns;
  const rows = state.rows;

  const sizeKey = getColumnKey(cols, "size");
  const chestKey = getColumnKey(cols, "chest_flat");
  const lengthKey = getColumnKey(cols, "length");
  const sleeveKey = getColumnKey(cols, "sleeve");
  const outsoleKey = getColumnKey(cols, "outsole");
  const footKey = getColumnKey(cols, "foot_length");

  const wantedKinds = isShoes(state.productKey)
    ? ["size","outsole","foot_length"]
    : ["size","chest_flat","length","sleeve"];

  const keyByKind = {
    size: sizeKey,
    chest_flat: chestKey,
    length: lengthKey,
    sleeve: sleeveKey,
    outsole: outsoleKey,
    foot_length: footKey,
  };

  const table = els.sizeTable;
  table.innerHTML = "";

  const thead = document.createElement("thead");
  const trh = document.createElement("tr");

  wantedKinds.forEach(kind=>{
    const th = document.createElement("th");
    th.textContent = localizeColumn(kind);
    trh.appendChild(th);
  });
  thead.appendChild(trh);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  rows.forEach(r=>{
    const tr = document.createElement("tr");
    wantedKinds.forEach(kind=>{
      const td = document.createElement("td");
      const k = keyByKind[kind];
      td.textContent = k ? (r[k] ?? "") : "";
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
}

function easeByFit(){
  const fit = els.fitSelect.value;
  const cm = (fit === "tight") ? 4 : (fit === "standard") ? 10 : 16;
  return (state.unit === "cm") ? cm : cmToIn(cm);
}

function recommendSizeTops(){
  const cols = state.columns;
  const rows = state.rows;

  const t = I18N[state.lang];
  const sizeKey = getColumnKey(cols, "size");
  const chestKey = getColumnKey(cols, "chest_flat");
  if (!sizeKey || !chestKey || !rows.length) return null;

  let chest = toNumber(els.chestInput.value);
  let usedEst = false;

  if (!chest){
    const estCm = estimateChestCircumferenceCm();
    if (!estCm) return { error: t.msgNeedMore };
    chest = (state.unit === "cm") ? estCm : cmToIn(estCm);
    usedEst = true;
  }

  const ease = easeByFit();
  const target = chest + ease;

  let best = null;
  for (const r of rows){
    const size = r[sizeKey];
    const flat = toNumber(r[chestKey]);
    if (!flat || !size) continue;

    const garmentChest = flat * 2;
    if (garmentChest >= target){
      best = { size, garmentChest };
      break;
    }
  }

  if (!best){
    const last = rows[rows.length - 1];
    best = { size: last[sizeKey], garmentChest: toNumber(last[chestKey]) * 2 };
  }

  const chestShown = round1(chest);
  const easeShown = round1(ease);
  const tgtShown = round1(target);

  const detail = (state.lang === "jp")
    ? `${usedEst ? "（推定胸囲）" : "（実測胸囲）"} 胸囲 ${chestShown}${unitLabel()} + ゆとり ${easeShown}${unitLabel()} → 目標 ${tgtShown}${unitLabel()}`
    : `${usedEst ? "(estimated)" : "(measured)"} Chest ${chestShown}${unitLabel()} + ease ${easeShown}${unitLabel()} → target ${tgtShown}${unitLabel()}`;

  return { size: best.size, detail };
}

function recommendSizeShoes(){
  const cols = state.columns;
  const rows = state.rows;

  const t = I18N[state.lang];
  const sizeKey = getColumnKey(cols, "size");
  const footKey = getColumnKey(cols, "foot_length");
  if (!sizeKey || !footKey || !rows.length) return null;

  const foot = toNumber(els.footInput.value);
  const allow = toNumber(els.allowSelect.value) ?? 0;

  if (!foot) return { error: t.msgNeedMore };

  const target = foot + allow;

  let best = null;
  for (const r of rows){
    const size = r[sizeKey];
    const maxFoot = toNumber(r[footKey]);
    if (!size || !maxFoot) continue;
    if (maxFoot >= target){
      best = { size, maxFoot };
      break;
    }
  }
  if (!best){
    const last = rows[rows.length - 1];
    best = { size: last[sizeKey], maxFoot: toNumber(last[footKey]) };
  }

  const detail = (state.lang === "jp")
    ? `足長 ${round1(foot)}${unitLabel()} + 捨て寸 ${round1(allow)}${unitLabel()} → 目標 ${round1(target)}${unitLabel()}`
    : `Foot ${round1(foot)}${unitLabel()} + allowance ${round1(allow)}${unitLabel()} → target ${round1(target)}${unitLabel()}`;

  return { size: best.size, detail };
}

function runCalc(){
  const rec = isShoes(state.productKey) ? recommendSizeShoes() : recommendSizeTops();

  if (!rec){
    els.resultValue.textContent = "—";
    els.resultDetail.textContent = "";
    return;
  }

  if (rec.error){
    els.resultValue.textContent = "—";
    els.resultDetail.textContent = rec.error;
    return;
  }

  els.resultValue.textContent = rec.size;
  els.resultDetail.textContent = rec.detail;
}

async function loadAndRender(){
  try{
    await loadCSV();
    renderAllowOptions();
    applyI18n();
    setPressedButtons();
    renderTable();
  }catch(err){
    els.sizeTable.innerHTML = "";
    els.resultValue.textContent = "—";
    els.resultDetail.textContent = String(err?.message ?? err);
  }
}

// ---------- event wiring ----------
function bindEvents(){
  document.addEventListener("click", (e)=>{
    const btn = e.target.closest("[data-action]");
    if (!btn) return;

    const action = btn.dataset.action;
    const value = btn.dataset.value;

    if (action === "set-lang"){
      state.lang = value;
      state.unit = (value === "jp") ? "cm" : "inch"; // spec
      setPressedButtons();
      applyI18n();
      loadAndRender();
    }

    if (action === "set-unit"){
      state.unit = value;
      // Unit selection implies language (JP=cm / EN=inch)
      state.lang = (value === "cm") ? "jp" : "en";
      setPressedButtons();
      applyI18n();
      loadAndRender();
    }
  });

  els.productSelect.addEventListener("change", ()=>{
    setProduct(els.productSelect.value);
  });

  els.calcBtn.addEventListener("click", runCalc);

  els.btnReset.addEventListener("click", ()=>{
    els.chestInput.value = "";
    els.heightInput.value = "";
    els.weightInput.value = "";
    els.bmiInput.value = "";
    els.footInput.value = "";
    els.resultValue.textContent = "—";
    els.resultDetail.textContent = "";
  });

  els.btnScrollTable.addEventListener("click", ()=>{
    document.getElementById("tableSection")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  // BMI auto-calc when weight/height changes
  const recalcBMI = ()=>{
    const height = toNumber(els.heightInput.value);
    const weight = toNumber(els.weightInput.value);
    if (!height || !weight) return;
    const hM = height / 100;
    if (hM <= 0) return;
    const bmi = weight / (hM*hM);
    if (Number.isFinite(bmi)) els.bmiInput.value = String(round1(bmi));
  };
  els.heightInput.addEventListener("input", recalcBMI);
  els.weightInput.addEventListener("input", recalcBMI);
}

function init(){
  renderProductOptions();
  els.productSelect.value = state.productKey;

  bindEvents();
  setPressedButtons();
  applyI18n();

  setProduct(state.productKey);
}

init();
