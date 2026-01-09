// TCDA Auto Size Guide (GitHub Pages)
// - JP => cm, EN => inch (auto-linked)
// - Product-specific inputs only
// - 1-line calculation rationale
// - Errors provide next actions
// - After recommendation: highlight row + auto-scroll

(() => {
  const els = {
    backToShop: document.getElementById("backToShop"),
    btnLangJP: document.getElementById("btnLangJP"),
    btnLangEN: document.getElementById("btnLangEN"),

    pageTitle: document.getElementById("pageTitle"),
    pageSubtitle: document.getElementById("pageSubtitle"),
    labelProduct: document.getElementById("labelProduct"),
    productHint: document.getElementById("productHint"),

    productSelect: document.getElementById("productSelect"),
    productButton: document.getElementById("productButton"),
    productButtonText: document.getElementById("productButtonText"),
    productList: document.getElementById("productList"),

    inputsTops: document.getElementById("inputsTops"),
    inputsShoes: document.getElementById("inputsShoes"),

    labelNudeChest: document.getElementById("labelNudeChest"),
    nudeChest: document.getElementById("nudeChest"),
    hintNudeChest: document.getElementById("hintNudeChest"),
    labelFitTop: document.getElementById("labelFitTop"),
    fitTop: document.getElementById("fitTop"),
    hintFitTop: document.getElementById("hintFitTop"),

    // NEW: "measure your garment" inputs
    garmentBox: document.getElementById("garmentBox"),
    garmentSummary: document.getElementById("garmentSummary"),
    garmentNote: document.getElementById("garmentNote"),
    labelGarmentChest: document.getElementById("labelGarmentChest"),
    garmentChest: document.getElementById("garmentChest"),
    hintGarmentChest: document.getElementById("hintGarmentChest"),
    labelGarmentLength: document.getElementById("labelGarmentLength"),
    garmentLength: document.getElementById("garmentLength"),
    hintGarmentLength: document.getElementById("hintGarmentLength"),


    // NEW: tops priority toggle
    topPriorityBox: document.getElementById("topPriorityBox"),
    labelTopPriority: document.getElementById("labelTopPriority"),
    hintTopPriority: document.getElementById("hintTopPriority"),
    btnPriChest: document.getElementById("btnPriChest"),
    btnPriLength: document.getElementById("btnPriLength"),

    estimateBox: document.getElementById("estimateBox"),
    estimateSummary: document.getElementById("estimateSummary"),
    labelHeight: document.getElementById("labelHeight"),
    estHeight: document.getElementById("estHeight"),
    labelWeight: document.getElementById("labelWeight"),
    estWeight: document.getElementById("estWeight"),
    labelSex: document.getElementById("labelSex"),
    estSex: document.getElementById("estSex"),
    labelBMI: document.getElementById("labelBMI"),
    estBmi: document.getElementById("estBmi"),
    hintBMI: document.getElementById("hintBMI"),
    estimateNote: document.getElementById("estimateNote"),
    btnSetEstimated: document.getElementById("btnSetEstimated"),

    labelFootLen: document.getElementById("labelFootLen"),
    footLen: document.getElementById("footLen"),
    hintFootLen: document.getElementById("hintFootLen"),
    labelFitShoe: document.getElementById("labelFitShoe"),
    fitShoe: document.getElementById("fitShoe"),
    hintFitShoe: document.getElementById("hintFitShoe"),
    shoesNote: document.getElementById("shoesNote"),

    // NEW: shoes foot width
    labelFootWidth: document.getElementById("labelFootWidth"),
    footWidth: document.getElementById("footWidth"),
    hintFootWidth: document.getElementById("hintFootWidth"),

    calcBtn: document.getElementById("calcBtn"),
    btnReset: document.getElementById("btnReset"),
    btnScrollTable: document.getElementById("btnScrollTable"),

    result: document.getElementById("result"),
    resultTitle: document.getElementById("resultTitle"),
    resultValue: document.getElementById("resultValue"),
    resultValueAlt: document.getElementById("resultValueAlt"),
    resultDetail: document.getElementById("resultDetail"),
    btnHighlight: document.getElementById("btnHighlight"),
    btnHighlightAlt: document.getElementById("btnHighlightAlt"),

    errorBox: document.getElementById("errorBox"),
    errorMsg: document.getElementById("errorMsg"),
    btnFixInput: document.getElementById("btnFixInput"),
    btnGoTable: document.getElementById("btnGoTable"),

    guideTitle: document.getElementById("guideTitle"),
    guideCaption: document.getElementById("guideCaption"),
    guideImg: document.getElementById("guideImg"),
    notesTitle: document.getElementById("notesTitle"),
    notesList: document.getElementById("notesList"),

    tableCard: document.getElementById("tableCard"),
    tableTitle: document.getElementById("tableTitle"),
    tableUnit: document.getElementById("tableUnit"),
    tableHeadRow: document.getElementById("tableHeadRow"),
    tableBody: document.getElementById("tableBody"),
    tableNote: document.getElementById("tableNote"),
  };

  const i18n = {
    jp: {
      pageTitle: "サイズを自動でおすすめ",
      pageSubtitle: "商品を選んで、必要な数値だけ入力してください。",
      backToShop: "ショップに戻る",
      labelProduct: "商品",
      productHintTops: "トップスは「ヌード胸囲」を基準におすすめします。",
      productHintShoes: "シューズは「足長（かかと〜一番長い指）」を基準におすすめします。",

      labelNudeChest: "ヌード胸囲（cm）",
      hintNudeChest: "分からない場合は下の「推定入力」を使えます（自動で上書きしません）。",
      labelFitTop: "好み（フィット感）",
      hintFitTop: "標準：+10cm / ぴったり：+6cm / ゆったり：+14cm（目安）",
      labelTopPriority: "優先",
      priChest: "胸囲優先",
      priLength: "着丈優先",
      hintTopPriority: "同じ胸囲でも、丈（着丈）の好みで満足度が割れます。",

      estimateSummary: "ヌード寸法が分からない場合（推定入力）",
      labelHeight: "身長（cm）",
      labelWeight: "体重（kg）",
      labelSex: "性別",
      female: "女性",
      male: "男性",
      labelBMI: "BMI（任意）",
      hintBMI: "空欄なら身長と体重から自動計算します。",
      estimateNote: "推定入力は補助機能です。可能な限り実測のヌード寸法を入力してください。",
      setEstimated: "推定値をセット",
      msgSetEstimatedDone: "推定値をヌード胸囲にセットしました。",

      labelFootLen: "足長（cm）",
      hintFootLen: "左右を測って長い方を入力してください。",
      labelFitShoe: "好み（捨て寸）",
      hintFitShoe: "標準：+10mm / ぴったり：+7mm / ゆったり：+12mm",
      shoesNote: "アウトソール長は外寸（補助指標）です。足長と同一視しないでください。",
      labelFootWidth: "足幅",
      widthSlim: "細め",
      widthStandard: "標準",
      widthWide: "広め",
      hintFootWidth: "幅広は「次点（大きめ）」寄りに検討してください（厚手ソックスも同様）。",

      calcBtn: "おすすめサイズを計算",
      btnReset: "入力を見直す",
      btnScrollTable: "サイズ表で選ぶ",

      guideTitle: "測り方ガイド",
      guideCaption: "※ 画像は商品に応じて切り替わります / Image changes by product.",
      notesTitle: "選ぶときの注意事項",

      tableTitle: "サイズ表",
      tableUnitCm: "表示：cm",
      tableUnitIn: "表示：inch",
      tableNote: "※ 表の数値は仕上がり（完成）寸法です。測り方で±1〜2cm（±0.5〜0.8in）程度の誤差が出る場合があります。",

      resultTitle: "おすすめ",
      resultTitleNotFound: "該当するサイズが見当たりませんでした。",
      invalidInput: "入力値が不自然です。単位（cm/in）や桁ミスを確認してください。",
      btnHighlight: "サイズ表で該当行を見る",
      btnFixInput: "入力を見直す",
      btnGoTable: "サイズ表で選ぶ",

      // notes per category
      notesTops: [
        "最短で失敗を減らす：手持ちの「いちばん好きな服」を平置きで測り、サイズ表の近い数値を選ぶ。",
        "体から逆算：ヌード胸囲＋ゆとり → 仕上がり胸囲 → 身幅（仕上がり胸囲÷2）。",
        "優先順位：身幅 → 着丈 → 袖丈（袖は肩線位置で体感が変わる）。",
        "Men’sはゆったり・直線的、Women’sはフィット寄りになりやすい（傾向）。",
      ],
      notesHoodie: [
        "基本はTシャツと同じ（胸囲基準＋ゆとり → 身幅 → 着丈 → 袖）。",
        "フーディは裾リブ等で体感が変わるので、同じ数値でも印象が少し違う点に注意。",
      ],
      notesShoes: [
        "主役は足長（かかと〜一番長い指）。左右を測って長い方を採用。",
        "捨て寸：足長＋7〜12mm（目安）。アウトソール長は外寸なので足長と同一視しない。",
        "幅広/甲高は注意（迷ったら大きめ寄り）。Men’sは幅広め、Women’sはタイトになりやすい（傾向）。",
      ],
    },

    en: {
      pageTitle: "Auto size recommendation",
      pageSubtitle: "Choose a product, then enter only the required measurements.",
      backToShop: "Back to shop",
      labelProduct: "Product",
      productHintTops: "For tops, we recommend based on your nude chest measurement.",
      productHintShoes: "For shoes, we recommend based on your foot length (heel to longest toe).",

      labelNudeChest: "Nude chest (in)",
      hintNudeChest: "If you don't know it, you can use the estimator below (it will NOT overwrite automatically).",
      labelFitTop: "Fit preference",
      hintFitTop: "Standard: +4.0 in / Snug: +2.4 in / Loose: +5.5 in (guide)",
      labelTopPriority: "Priority",
      priChest: "Chest first",
      priLength: "Length first",
      hintTopPriority: "Even with the same chest, satisfaction often depends on preferred length.",

      estimateSummary: "If you don't know your nude measurement (Estimator)",
      labelHeight: "Height (cm)",
      labelWeight: "Weight (kg)",
      labelSex: "Sex",
      female: "Female",
      male: "Male",
      labelBMI: "BMI (optional)",
      hintBMI: "Leave blank to auto-calculate from height & weight.",
      estimateNote: "Estimator is a support feature. For best accuracy, measure and enter your actual nude measurement.",
      setEstimated: "Set estimated value",
      msgSetEstimatedDone: "Estimated value has been set to Nude chest.",

      labelFootLen: "Foot length (in)",
      hintFootLen: "Measure both feet and use the longer one.",
      labelFitShoe: "Allowance",
      hintFitShoe: "Standard: +0.39 in / Snug: +0.28 in / Loose: +0.47 in",
      shoesNote: "Outsole length is an outside measurement (reference only). Do not treat it as foot length.",
      labelFootWidth: "Foot width",
      widthSlim: "Slim",
      widthStandard: "Standard",
      widthWide: "Wide",
      hintFootWidth: "If you have wide feet / thick socks, consider the runner-up (size up).",

      calcBtn: "Calculate recommended size",
      btnReset: "Review inputs",
      btnScrollTable: "Choose from size chart",

      guideTitle: "How to measure",
      guideCaption: "※ Image changes by product.",
      notesTitle: "Notes when choosing",

      tableTitle: "Size chart",
      tableUnitCm: "Display: cm",
      tableUnitIn: "Display: inch",
      tableNote: "※ Values are finished measurements. Small variations may occur depending on how measured.",

      resultTitle: "Recommended",
      resultTitleNotFound: "No matching size was found.",
      invalidInput: "The value looks invalid. Please check units and typos.",
      btnHighlight: "Show the matching row",
      btnFixInput: "Review inputs",
      btnGoTable: "Choose from size chart",

      notesTops: [
        "Fastest way to reduce mistakes: measure your favorite item (flat) and pick the closest numbers in the chart.",
        "From body: Nude chest + ease → Finished chest → Chest (flat) = Finished chest ÷ 2.",
        "Priority: Chest (flat) → Length → Sleeve (sleeve feel depends on shoulder seam).",
        "Tendency: Men’s is straighter/looser; Women’s is more fitted.",
      ],
      notesHoodie: [
        "Same base logic as T-shirts (chest + ease → chest(flat) → length → sleeve).",
        "Hoodies can feel different due to rib hem/cuffs even with similar numbers.",
      ],
      notesShoes: [
        "Key is foot length (heel to longest toe). Measure both feet and use the longer one.",
        "Allowance: foot length + 7–12 mm (guide). Outsole length is outside length; do not treat it as foot length.",
        "Wide/high instep: consider sizing up when in doubt. Men’s tends to be wider, Women’s can feel tighter.",
      ],
    }
  };

  // Data sources (cleaned CSVs)
  const productsFallback = [
    {
      key: "mens_crew",
      type: "tops",
      labelJP: ["Men's Crew Neck", "T-Shirt"],
      labelEN: ["Men's Crew Neck", "T-Shirt"],
      guideImg: "assets/guide_tshirt.jpg",
      csv: { cm: "data/mens_crew_cm.csv", inch: "data/mens_crew_inch.csv" },
      noteSet: "tops"
    },
    {
      key: "womens_crew",
      type: "tops",
      labelJP: ["Women's Crew Neck", "T-Shirt"],
      labelEN: ["Women's Crew Neck", "T-Shirt"],
      guideImg: "assets/guide_tshirt.jpg",
      csv: { cm: "data/womens_crew_cm.csv", inch: "data/womens_crew_inch.csv" },
      noteSet: "tops"
    },
    {
      key: "unisex_hoodie",
      type: "hoodie",
      labelJP: ["Unisex", "Hoodie"],
      labelEN: ["Unisex", "Hoodie"],
      guideImg: "assets/guide_hoodie.jpg",
      csv: { cm: "data/unisex_hoodie_cm.csv", inch: "data/unisex_hoodie_inch.csv" },
      noteSet: "hoodie"
    },
    {
      key: "unisex_zip_hoodie",
      type: "hoodie",
      labelJP: ["Unisex ZIP", "Hoodie"],
      labelEN: ["Unisex ZIP", "Hoodie"],
      guideImg: "assets/guide_zip_hoodie.jpg",
      csv: { cm: "data/unisex_zip_hoodie_cm.csv", inch: "data/unisex_zip_hoodie_inch.csv" },
      noteSet: "hoodie"
    },
    {
      key: "slipon_womens",
      type: "shoes",
      labelJP: ["Women's Slip-On", "Canvas Shoes"],
      labelEN: ["Women's Slip-On", "Canvas Shoes"],
      guideImg: "assets/guide_slipon.jpg",
      csv: { cm: "data/slipon_womens_cm.csv", inch: "data/slipon_womens_inch.csv" },
      noteSet: "shoes"
    },
    {
      key: "slipon_mens",
      type: "shoes",
      labelJP: ["Men's Slip-On", "Canvas Shoes"],
      labelEN: ["Men's Slip-On", "Canvas Shoes"],
      guideImg: "assets/guide_slipon.jpg",
      csv: { cm: "data/slipon_mens_cm.csv", inch: "data/slipon_mens_inch.csv" },
      noteSet: "shoes"
    },
  ];

  // Runtime products (prefer data/manifest.json, fallback to baked list)
  let products = productsFallback;

  async function tryLoadManifestProducts(){
    try {
      const res = await fetch("data/manifest.json", { cache: "no-store" });
      if (!res.ok) return false;
      const j = await res.json();
      if (!j || !Array.isArray(j.products) || j.products.length === 0) return false;

      // Minimal validation to avoid breaking production UI
      const ok = j.products.every(p =>
        p && typeof p.key === "string" && p.key &&
        typeof p.type === "string" &&
        Array.isArray(p.labelJP) && Array.isArray(p.labelEN) &&
        typeof p.guideImg === "string" &&
        p.csv && typeof p.csv.cm === "string" && typeof p.csv.inch === "string" &&
        typeof p.noteSet === "string"
      );
      if (!ok) return false;

      products = j.products;

      // If current selection isn't present, pick the first product.
      if (!products.find(p => p.key === state.productKey)) {
        state.productKey = products[0].key;
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  const state = {
    lang: "jp",         // jp | en
    unit: "cm",         // cm | inch  (linked to lang)
    productKey: products[0].key,
    tableRows: [],
    tableCols: [],
    tableMode: "product", // product | body
    lastMatchIndex: null,
    lastAltMatchIndex: null,
    lastRecommendedSizeVal: null,
    topPriority: "chest", // chest | length
    lastEstimatedChestCm: null,
  };

  const cache = new Map(); // url -> parsed rows


// ---------- logging (localStorage) ----------
const LOG_KEY = "tcda_sizeguide_logs_v1";
const LOG_MAX = 200;

function pushLog(entry){
  try{
    const raw = localStorage.getItem(LOG_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    const next = Array.isArray(arr) ? arr : [];
    next.unshift(entry);
    if (next.length > LOG_MAX) next.length = LOG_MAX;
    localStorage.setItem(LOG_KEY, JSON.stringify(next));
  } catch(e){
    // Ignore logging failures (private mode, quota, etc.)
    console.warn("log failed", e);
  }
}

  // ---------- utilities ----------
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const round1 = (n) => Math.round(n * 10) / 10;

  function t() { return i18n[state.lang]; }

  function isShoes(productKey){
    return productKey.startsWith("slipon_");
  }

  function getProduct(){
    return products.find(p => p.key === state.productKey) || products[0];
  }

async function setLang(next){
  state.lang = next;
  state.unit = (next === "jp") ? "cm" : "inch";
  els.btnLangJP.setAttribute("aria-selected", String(next === "jp"));
  els.btnLangEN.setAttribute("aria-selected", String(next === "en"));
  applyI18n();
  await loadAndRenderCurrentProduct();

  // If a result is currently shown, re-calculate once to refresh language-dependent text.
  // (No logging / no auto-scroll on language switch)
  if (!els.result.hidden){
    await runCalc({ skipLog: true, skipScroll: true, skipHighlight: true });
  }
}

  // parse numbers including unicode fractions (e.g., "18 ⅞", "10⅝", "10 1/4", "91/4")
  const fracMap = {
    "¼": 1/4, "½": 1/2, "¾": 3/4,
    "⅛": 1/8, "⅜": 3/8, "⅝": 5/8, "⅞": 7/8,
    "⅓": 1/3, "⅔": 2/3,
    "⅕": 1/5, "⅖": 2/5, "⅗": 3/5, "⅘": 4/5,
    "⅙": 1/6, "⅚": 5/6,
    "⅐": 1/7, "⅑": 1/9, "⅒": 1/10,
  };

  function parseMixedNumber(v){
    if (v == null) return NaN;
    const s0 = String(v).trim();
    if (!s0) return NaN;

    // normalize: "10⅝" -> "10 ⅝"
    let s = s0.replace(/(\d)([¼½¾⅛⅜⅝⅞⅓⅔⅕⅖⅗⅘⅙⅚⅐⅑⅒])/g, "$1 $2");

    // "91/4" -> "9 1/4"
    s = s.replace(/^(\d+)\s*(\d+)\/(\d+)$/, (_, a, b, c) => `${a} ${b}/${c}`);

    // pure number
    if (/^-?\d+(\.\d+)?$/.test(s)) return Number(s);

    // "10 1/4"
    let m = s.match(/^(-?\d+(\.\d+)?)\s+(\d+)\s*\/\s*(\d+)$/);
    if (m){
      const base = Number(m[1]);
      const num = Number(m[3]);
      const den = Number(m[4]);
      return base + (den ? num/den : 0);
    }

    // "10 ⅝"
    m = s.match(/^(-?\d+(\.\d+)?)\s+([¼½¾⅛⅜⅝⅞⅓⅔⅕⅖⅗⅘⅙⅚⅐⅑⅒])$/);
    if (m){
      const base = Number(m[1]);
      return base + (fracMap[m[3]] ?? 0);
    }

    // only fraction char
    if (fracMap[s] != null) return fracMap[s];

    return NaN;
  }

  function toNumber(input){
    const s = String(input ?? "").trim().replace(/,/g, "");
    if (!s) return NaN;
    const n = Number(s);
    return Number.isFinite(n) ? n : NaN;
  }

  function inRange(n, min, max){
    return Number.isFinite(n) && n >= min && n <= max;
  }

  function getRange(key){
    // Ranges are intentionally generous to avoid false negatives.
    // key: "nude_chest", "flat_chest", "length", "foot"
    const u = state.unit; // "cm" or "in"
    if (key === "nude_chest"){
      return (u === "cm") ? [60, 160] : [24, 70];
    }
    if (key === "flat_chest"){
      return (u === "cm") ? [30, 100] : [12, 40];
    }
    if (key === "length"){
      return (u === "cm") ? [40, 120] : [16, 50];
    }
    if (key === "foot"){
      return (u === "cm") ? [18, 34] : [7, 13.5];
    }
    return (u === "cm") ? [0, 9999] : [0, 9999];
  }


  const cmToIn = (cm) => cm / 2.54;
  const inToCm = (inch) => inch * 2.54;

  // ---------- CSV ----------
  async function loadCsv(url){
    if (cache.has(url)) return cache.get(url);

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to load: ${url}`);
    const text = await res.text();

    // simple CSV parser (no commas inside cells in our data)
    // NOTE: Some editors accidentally add a junk first line like ",,,".
    // We robustly find the first "real" header line.
    const rawLines = text.split(/\r?\n/);
    const cleaned = rawLines
      .map(l => (l ?? "").replace(/^\uFEFF/, "").trim()) // strip UTF-8 BOM + trim
      .filter(l => l.length > 0);

    if (cleaned.length < 2) return { cols: [], data: [] };

    const looksLikeHeader = (line) => {
      const lower = line.toLowerCase();
      // We accept common header markers in this project.
      return lower.includes("size") || line.includes("サイズ") || line.includes("胸") || line.includes("length") || line.includes("長さ");
    };
    // Pick the first plausible header line (skipping ",,," and similar junk)
    let headerIndex = cleaned.findIndex(looksLikeHeader);
    if (headerIndex === -1) headerIndex = 0;

    const cols = cleaned[headerIndex].split(",").map(c => c.trim().replace(/^\uFEFF/, ""));
    const dataLines = cleaned.slice(headerIndex + 1);
    const data = dataLines.map(line => {
      const parts = line.split(",").map(p => p.trim());
      const obj = {};
      cols.forEach((c, i) => obj[c] = parts[i] ?? "");
      return obj;
    });

    const parsed = { cols, data };
    cache.set(url, parsed);
    return parsed;
  }

  // ---------- recommendation logic ----------
  function easeTop(){
    // cm basis
    const fit = els.fitTop.value;
    if (fit === "snug") return (state.unit === "cm") ? 6 : cmToIn(6);
    if (fit === "loose") return (state.unit === "cm") ? 14 : cmToIn(14);
    return (state.unit === "cm") ? 10 : cmToIn(10);
  }

  function allowanceShoe(){
    // mm basis
    const v = els.fitShoe.value;
    const mm = (v === "snug") ? 7 : (v === "loose") ? 12 : 10;
    if (state.unit === "cm") return mm / 10;     // cm
    return cmToIn(mm / 10);                      // inch
  }

  // Estimator (existing approach: BMI buckets + small sex adjustment)
  function estimateChestCircumferenceCm(){
    const h = toNumber(els.estHeight.value);
    const w = toNumber(els.estWeight.value);
    const bmiInput = toNumber(els.estBmi.value);

    let bmi = bmiInput;
    if (!Number.isFinite(bmi)){
      if (!Number.isFinite(h) || !Number.isFinite(w) || h <= 0) return NaN;
      const hm = h / 100;
      bmi = w / (hm * hm);
    }
    if (!Number.isFinite(bmi)) return NaN;

    const sex = els.estSex.value; // male|female

    // bucket mapping (rough, as a support feature)
    // baseline chest for female at given BMI
    let chest = 78;
    if (bmi < 17) chest = 74;
    else if (bmi < 19) chest = 78;
    else if (bmi < 21) chest = 82;
    else if (bmi < 23) chest = 86;
    else if (bmi < 25) chest = 90;
    else if (bmi < 27) chest = 94;
    else if (bmi < 29) chest = 98;
    else chest = 104;

    if (sex === "male") chest += 10; // typical offset

    return chest;
  }


// ---------- multi recommendation (primary + runner-up) ----------
function getHeightForLengthPriority(){
  // Use estimator height if provided (even when nude chest is measured).
  const h = toNumber(els.estHeight?.value);
  return Number.isFinite(h) ? h : NaN;
}

function neighborInSorted(sorted, idx, dir){
  // dir: +1 => larger, -1 => smaller
  const pos = sorted.findIndex(x => x.idx === idx);
  if (pos < 0) return null;
  const npos = pos + dir;
  if (npos < 0 || npos >= sorted.length) return null;
  return sorted[npos];
}

// CSV header variations support (EN/JP, case differences)
function pickCell(row, candidates){
  for (const key of candidates){
    if (row[key] != null && String(row[key]).trim() !== "") return row[key];
  }
  // case-insensitive fallback (handles "size" vs "Size" and BOM variations)
  const lowerMap = {};
  for (const k in row){
    lowerMap[k.toLowerCase()] = k;
  }
  for (const key of candidates){
    const k = lowerMap[String(key).toLowerCase()];
    if (k && row[k] != null && String(row[k]).trim() !== "") return row[k];
  }
  return "";
}

const SIZE_KEYS   = ["Size","size","SIZE","サイズ"];
const CHEST_KEYS  = ["Chest (flat)","Chest (Flat)","1/2 Chest","1/2 Chest Width","1/2胸幅","胸幅","Chest width (flat)","Chest Width (flat)","身幅（平置き）","身幅"];
const LENGTH_KEYS = ["Length","length","長さ","着丈","Body length","Body Length","丈"];
const SLEEVE_KEYS = ["Sleeve length","Sleeve Length","sleeve length","袖の長さ","袖丈"];

const FOOTLEN_KEYS = ["Foot length","Foot Length","leg length","Leg length","足の長さ","足長"];
const OUTSOLE_KEYS = ["Outsole length","Outsole Length","outsole length","アウトソールの長さ","アウトソール長"];

function chooseByChest(rows, targetHalf){
  const sorted = rows.map((r, idx) => ({
      idx,
      size: pickCell(r, SIZE_KEYS),
      half: parseMixedNumber(pickCell(r, CHEST_KEYS)),
      row: r
    }))
    .filter(x => Number.isFinite(x.half))
    .sort((a,b)=>a.half-b.half);

  const chosen = sorted.find(x => x.half >= targetHalf);
  if (!chosen) return { error: "not_found" };

  // runner-up default: next size up (more length/room)
  const alt = neighborInSorted(sorted, chosen.idx, +1);

  return { chosen, alt, sorted };
}

function chooseByLength(rows, targetHalf, idealLen){
  const sorted = rows.map((r, idx) => ({
      idx,
      size: pickCell(r, SIZE_KEYS),
      half: parseMixedNumber(pickCell(r, CHEST_KEYS)),
      len: parseMixedNumber(pickCell(r, LENGTH_KEYS)),
      row: r
    }))
    .filter(x => Number.isFinite(x.half))
    .sort((a,b)=>a.half-b.half);

  // must satisfy chest constraint first
  const ok = sorted.filter(x => x.half >= targetHalf && Number.isFinite(x.len));
  if (!ok.length) return { error: "not_found" };

  // choose length closest to idealLen
  ok.sort((a,b)=>Math.abs(a.len - idealLen) - Math.abs(b.len - idealLen));
  const chosen = ok[0];

  // runner-up: nearest different size among ok
  const alt = ok.find(x => x.idx !== chosen.idx) || neighborInSorted(sorted, chosen.idx, +1) || neighborInSorted(sorted, chosen.idx, -1);

  return { chosen, alt, sorted };
}

function runnerUpLabelTops(primary, alt){
  if (!alt) return "";
  const tt = t();
  if (state.lang === "jp"){
    // If alt is larger => longer/looser, else more compact
    const bigger = true; // neutral label; we can't reliably compare sizes lexicographically
    return `次点：${alt.size}（丈優先なら）`;
  }
  return `Runner-up: ${alt.size} (if you prefer length)`;
}

function runnerUpLabelShoes(altText){
  return altText || "";
}

function buildTopDetailMulti({ usedEst, estCm, nudeChest, ease, finishedChest, targetHalf, primary, alt, lengthModeUsed, idealLen }){
  const unit = state.unit;

  const estLine = usedEst
    ? (state.lang === "jp"
        ? `推定胸囲 ${Math.round(estCm)}cm を使用`
        : `Used estimated chest ${Math.round(estCm)} cm`)
    : "";

  const line1 = (state.lang === "jp")
    ? `胸囲 ${format(nudeChest, unit)} + ゆとり ${format(ease, unit)} = 仕上がり胸囲 ${format(finishedChest, unit)} → 1/2胸幅 ${format(targetHalf, unit)}`
    : `Chest ${format(nudeChest, unit)} + ease ${format(ease, unit)} = finished chest ${format(finishedChest, unit)} → chest (flat) ${format(targetHalf, unit)}`;

  const line2 = (state.lang === "jp")
    ? `推奨：${primary.size}` + (alt ? ` / 次点：${alt.size}` : "")
    : `Recommended: ${primary.size}` + (alt ? ` / Runner-up: ${alt.size}` : "");

  const line3 = (lengthModeUsed && Number.isFinite(idealLen))
    ? (state.lang === "jp" ? `着丈優先：身長から目安丈 ${format(idealLen, unit)} に近いサイズを優先` : `Length-first: favored the size closest to target length ${format(idealLen, unit)}`)
    : "";

  return [estLine, line1, line2, line3].filter(Boolean).join("\n");
}

function recommendTopsMulti(rows){
  // Mode A: "measure your garment" (flat chest is required; length optional)
  const garmentHalf = toNumber(els.garmentChest?.value);
  const garmentLen  = toNumber(els.garmentLength?.value);

  if (Number.isFinite(garmentHalf)){
    const [minHalf, maxHalf] = getRange("flat_chest");
    if (!inRange(garmentHalf, minHalf, maxHalf)) return { error: "invalid_input" };

    if (Number.isFinite(garmentLen)){
      const [minL, maxL] = getRange("length");
      if (!inRange(garmentLen, minL, maxL)) return { error: "invalid_input" };
    }

    const byChest = chooseByChest(rows, garmentHalf);
    if (byChest.error) return { error: byChest.error };

    let byLen = null;
    let idealLen = NaN;
    if (Number.isFinite(garmentLen)){
      idealLen = garmentLen;
      byLen = chooseByLength(rows, garmentHalf, idealLen);
      if (byLen.error) byLen = null;
    }

    // fallback runner-up if length not provided (or not found)
    if (!byLen){
      byLen = { chosen: byChest.alt || neighborInSorted(byChest.sorted, byChest.chosen.idx, +1) || neighborInSorted(byChest.sorted, byChest.chosen.idx, -1), alt: null, sorted: byChest.sorted };
    }

    // Decide primary & runner-up based on toggle
    let primary = byChest.chosen;
    let alt = byLen.chosen;
    let lengthModeUsed = false;

    if (state.topPriority === "length" && Number.isFinite(garmentLen)){
      primary = byLen.chosen;
      alt = byChest.chosen;
      lengthModeUsed = true;
    } else {
      primary = byChest.chosen;
      alt = Number.isFinite(garmentLen) ? byLen.chosen : (byChest.alt || byLen.chosen);
      lengthModeUsed = false;
    }

    // Ensure alt differs
    if (alt && alt.idx === primary.idx){
      alt = neighborInSorted(byChest.sorted, primary.idx, +1) || neighborInSorted(byChest.sorted, primary.idx, -1);
    }

    const unit = state.unit;
    const line1 = (state.lang === "jp")
      ? `手持ちの服：身幅（平置き） ${format(garmentHalf, unit)}` + (Number.isFinite(garmentLen) ? ` / 着丈 ${format(garmentLen, unit)}` : "")
      : `Your garment: chest (flat) ${format(garmentHalf, unit)}` + (Number.isFinite(garmentLen) ? ` / length ${format(garmentLen, unit)}` : "");

    const line2 = (state.lang === "jp")
      ? `推奨：${primary.size}` + (alt ? ` / 次点：${alt.size}` : "")
      : `Recommended: ${primary.size}` + (alt ? ` / Runner-up: ${alt.size}` : "");

    const line3 = (state.lang === "jp")
      ? "※このモードは「今ちょうど良い服」の寸法に合わせて選びます（ゆとり計算は使いません）。"
      : "Note: This mode matches the measurements of a garment that already fits you (no ease calculation).";

    const detail = [line1, line2, line3].filter(Boolean).join("\n");

    const altText = alt ? runnerUpLabelTops(primary, alt) : "";

    return {
      primary: { size: primary.size, matchIndex: primary.idx },
      alt: alt ? { size: alt.size, matchIndex: alt.idx, label: altText } : null,
      detail,
      usedEst: false,
      estCm: null,
      chestUsed: NaN,
      inputMethod: "garment",
      heightCm: null,
      idealLen
    };
  }

  // Mode B: Nude chest (measured / estimated)
  const chestManual = toNumber(els.nudeChest.value);

  let usedEst = false;
  let estCm = null;
  let chest = chestManual;

  if (!Number.isFinite(chest)){
    estCm = estimateChestCircumferenceCm();
    if (Number.isFinite(estCm)){
      chest = (state.unit === "cm") ? estCm : cmToIn(estCm);
      usedEst = true;
    }
  }

  if (!Number.isFinite(chest)) return { error: "need_input" };

  // basic sanity check for manual input
  if (!usedEst){
    const [minC, maxC] = getRange("nude_chest");
    if (!inRange(chest, minC, maxC)) return { error: "invalid_input" };
  }

  const ease = getEaseTop();
  const finishedChest = chest + ease;
  const targetHalf = finishedChest / 2;

  // chest-first choice
  const byChest = chooseByChest(rows, targetHalf);
  if (byChest.error) return { error: byChest.error };

  // length-first choice (if height exists; otherwise fallback to next size up from chest-first)
  const hCm = getHeightForLengthPriority();
  let byLen = null;
  let idealLen = NaN;
  if (Number.isFinite(hCm)){
    // garment length ~ 0.40 * height is a decent neutral anchor for tees/hoodies
    idealLen = clamp((hCm * 0.40), 58, 86);
    if (state.unit !== "cm") idealLen = cmToIn(idealLen);
    byLen = chooseByLength(rows, targetHalf, idealLen);
    if (byLen.error) byLen = null;
  }

  if (!byLen){
    byLen = { chosen: byChest.alt || neighborInSorted(byChest.sorted, byChest.chosen.idx, +1) || neighborInSorted(byChest.sorted, byChest.chosen.idx, -1), alt: null, sorted: byChest.sorted };
  }

  // Decide primary & runner-up based on toggle
  let primary = byChest.chosen;
  let alt = byLen.chosen;
  let lengthModeUsed = false;

  if (state.topPriority === "length"){
    primary = byLen.chosen;
    alt = byChest.chosen;
    lengthModeUsed = Number.isFinite(hCm);
  } else {
    primary = byChest.chosen;
    alt = byLen.chosen;
    lengthModeUsed = false;
  }

  // Ensure alt differs
  if (alt && alt.idx === primary.idx){
    alt = neighborInSorted(byChest.sorted, primary.idx, +1) || neighborInSorted(byChest.sorted, primary.idx, -1);
  }

  const detail = buildTopDetailMulti({
    usedEst, estCm, nudeChest: chest, ease, finishedChest, targetHalf,
    primary, alt,
    lengthModeUsed, idealLen
  });

  const altText = alt ? runnerUpLabelTops(primary, alt) : "";

  return {
    primary: { size: primary.size, matchIndex: primary.idx },
    alt: alt ? { size: alt.size, matchIndex: alt.idx, label: altText } : null,
    detail,
    usedEst,
    estCm,
    chestUsed: chest,
    inputMethod: usedEst ? "estimated" : "measured",
    heightCm: Number.isFinite(hCm) ? hCm : null,
    idealLen
  };
}

function recommendShoesMulti(rows){
  const foot = toNumber(els.footLen.value);
  if (!Number.isFinite(foot)) return { error: "need_input" };
  const [minF, maxF] = getRange("foot");
  if (!inRange(foot, minF, maxF)) return { error: "invalid_input" };

  const addBase = allowanceShoe();
  const width = els.footWidth?.value || "standard";

  // width adjustment (mm): slim -1mm, wide +3mm
  const widthMm = (width === "slim") ? -1 : (width === "wide") ? 3 : 0;
  const widthAdj = (state.unit === "cm") ? (widthMm/10) : cmToIn(widthMm/10);

  const add = addBase + widthAdj;
  const target = foot + add;

  const candidates = rows.map((r, idx) => {
    const fl = parseMixedNumber(pickCell(r, FOOTLEN_KEYS));
    return { idx, fl, row: r };
  }).filter(x => Number.isFinite(x.fl)).sort((a,b)=>a.fl-b.fl);

  const chosen = candidates.find(x => x.fl >= target);
  if (!chosen) return { error: "not_found" };

  const nextUp = neighborInSorted(candidates, chosen.idx, +1);
  const nextDown = neighborInSorted(candidates, chosen.idx, -1);

  const display = (row) => {
    if (!row) return "";
    if (state.unit === "cm") return `${row.row["Size"]}`;
    return `US ${row.row["US"]} / UK ${row.row["UK"]} / EU ${row.row["EU"]}`;
  };

  // runner-up direction
  let alt = nextUp;
  let altLabel = "";
  if (width === "slim" && nextDown){
    alt = nextDown;
    altLabel = (state.lang === "jp")
      ? `次点：${display(alt)}（細めなら）`
      : `Runner-up: ${display(alt)} (if your feet are slim)`;
  } else if (width === "wide" && nextUp){
    alt = nextUp;
    altLabel = (state.lang === "jp")
      ? `次点：${display(alt)}（幅広ならこちら寄り）`
      : `Runner-up: ${display(alt)} (wide feet / thick socks)`;
  } else if (nextUp){
    alt = nextUp;
    altLabel = (state.lang === "jp")
      ? `次点：${display(alt)}（厚手ソックス/ゆったりなら）`
      : `Runner-up: ${display(alt)} (thick socks / looser fit)`;
  } else {
    alt = null;
    altLabel = "";
  }

  const primarySizeText = (state.unit === "cm")
    ? `${pickCell(chosen.row, KEYS_SIZE)}`
    : `US ${chosen.row["US"]} / UK ${chosen.row["UK"]} / EU ${chosen.row["EU"]}`;

  const detail = buildShoeDetail({
    foot,
    add,
    target,
    row: chosen.row
  });

  return {
    primary: { size: primarySizeText, matchIndex: chosen.idx },
    alt: alt ? { size: display(alt), matchIndex: alt.idx, label: altLabel } : null,
    detail,
    footUsed: foot,
    allowanceUsed: add,
    width,
  };
}

function recommendTops(rows){
    // rows: objects with Size, Chest (flat), Length, Sleeve length
    const chestManual = toNumber(els.nudeChest.value);

    let usedEst = false;
    let estCm = null;
    let chest = chestManual;

    if (!Number.isFinite(chest)){
      estCm = estimateChestCircumferenceCm();
      if (Number.isFinite(estCm)){
        chest = (state.unit === "cm") ? estCm : cmToIn(estCm);
        usedEst = true;
      }
    }

    if (!Number.isFinite(chest)) {
      return { error: "need_input" };
    }

    const ease = easeTop();
    const finishedChest = chest + ease;
    const targetHalf = finishedChest / 2;

    // pick smallest size where chartChestHalf >= targetHalf
    const candidates = rows.map((r, idx) => {
      const half = parseMixedNumber(r["Chest (flat)"]);
      return { idx, half, size: r["Size"] };
    }).filter(x => Number.isFinite(x.half)).sort((a,b)=>a.half-b.half);

    const chosen = candidates.find(x => x.half >= targetHalf);
    if (!chosen) return { error: "not_found" };

    const detail = buildTopDetail({
      nudeChest: chest,
      usedEst,
      estCm,
      ease,
      finishedChest,
      targetHalf,
      size: chosen.size
    });

    return { size: chosen.size, matchIndex: chosen.idx, detail, usedEst, estCm };
  }

  function buildTopDetail({nudeChest, usedEst, estCm, ease, finishedChest, targetHalf, size}){
    const unit = state.unit;
    const tt = t();
    const chestTxt = format(nudeChest, unit);
    const easeTxt = format(ease, unit);
    const finTxt = format(finishedChest, unit);
    const halfTxt = format(targetHalf, unit);

    const estLine = usedEst
      ? (state.lang === "jp"
          ? `推定胸囲 ${Math.round(estCm)}cm を使用`
          : `Used estimated chest ${Math.round(estCm)} cm`)
      : "";

    const line1 = (state.lang === "jp")
      ? `胸囲 ${chestTxt} + ゆとり ${easeTxt} = 仕上がり胸囲 ${finTxt} → 1/2胸幅 ${halfTxt}`
      : `Chest ${chestTxt} + ease ${easeTxt} = finished chest ${finTxt} → chest (flat) ${halfTxt}`;

    const line2 = (state.lang === "jp")
      ? `おすすめ：${size}`
      : `Recommended: ${size}`;

    return [estLine, line1, line2].filter(Boolean).join("\n");
  }

  function recommendShoes(rows){
    const foot = toNumber(els.footLen.value);
    if (!Number.isFinite(foot)) return { error: "need_input" };

    const add = allowanceShoe();
    const target = foot + add;

    const candidates = rows.map((r, idx) => {
      const fl = parseMixedNumber(pickCell(r, FOOTLEN_KEYS));
      return { idx, fl, row: r };
    }).filter(x => Number.isFinite(x.fl)).sort((a,b)=>a.fl-b.fl);

    const chosen = candidates.find(x => x.fl >= target);
    if (!chosen) return { error: "not_found" };

    // display size label differs by unit
    const displaySize = (state.unit === "cm")
      ? `${pickCell(chosen.row, KEYS_SIZE)}`
      : `US ${chosen.row["US"]} / UK ${chosen.row["UK"]} / EU ${chosen.row["EU"]}`;

    const detail = buildShoeDetail({
      foot,
      add,
      target,
      row: chosen.row
    });

    return { size: displaySize, matchIndex: chosen.idx, detail };
  }

  function buildShoeDetail({foot, add, target, row}){
    const unit = state.unit;
    const footTxt = format(foot, unit);
    const addTxt = format(add, unit);
    const targetTxt = format(target, unit);

    const line1 = (state.lang === "jp")
      ? `足長 ${footTxt} + 捨て寸 ${addTxt} = 目安 ${targetTxt}`
      : `Foot length ${footTxt} + allowance ${addTxt} = target ${targetTxt}`;

    let line2 = "";
    if (state.unit === "cm"){
      line2 = (state.lang === "jp")
        ? `おすすめ：サイズ ${pickCell(row, KEYS_SIZE)}（足長 ${pickCell(row, FOOTLEN_KEYS)} / アウトソール ${pickCell(row, OUTSOLE_KEYS)}）`
        : `Recommended: size ${pickCell(row, KEYS_SIZE)} (foot ${pickCell(row, FOOTLEN_KEYS)} / outsole ${pickCell(row, OUTSOLE_KEYS)})`;
    } else {
      line2 = `US ${row["US"]} / UK ${row["UK"]} / EU ${row["EU"]} (foot ${pickCell(row, FOOTLEN_KEYS)}, outsole ${pickCell(row, OUTSOLE_KEYS)})`;
    }

    return [line1, line2].join("\n");
  }

  function format(n, unit){
    if (!Number.isFinite(n)) return "-";
    if (unit === "cm"){
      // show .1 for shoe cm values; otherwise integer is fine
      const isInt = Math.abs(n - Math.round(n)) < 1e-9;
      return isInt ? `${Math.round(n)}cm` : `${round1(n)}cm`;
    }
    // inch
    return `${round1(n)}in`;
  }

  // ---------- UI render ----------
  function applyI18n(){
    const tt = t();

    document.documentElement.lang = (state.lang === "jp") ? "ja" : "en";

    els.pageTitle.textContent = tt.pageTitle;
    els.pageSubtitle.textContent = tt.pageSubtitle;
    els.backToShop.textContent = tt.backToShop;

    els.labelProduct.textContent = tt.labelProduct;

    // tops inputs
    els.labelNudeChest.textContent = tt.labelNudeChest;
    els.hintNudeChest.textContent = tt.hintNudeChest;
    els.labelFitTop.textContent = tt.labelFitTop;
    els.hintFitTop.textContent = tt.hintFitTop;

    // "measure your garment" inputs
    if (els.garmentSummary) els.garmentSummary.textContent = tt.garmentSummary;
    if (els.garmentNote) els.garmentNote.textContent = tt.garmentNote;
    if (els.labelGarmentChest) els.labelGarmentChest.textContent = tt.labelGarmentChest;
    if (els.hintGarmentChest) els.hintGarmentChest.textContent = tt.hintGarmentChest;
    if (els.labelGarmentLength) els.labelGarmentLength.textContent = tt.labelGarmentLength;
    if (els.hintGarmentLength) els.hintGarmentLength.textContent = tt.hintGarmentLength;


    // update fit preference option labels (FitTop / FitShoe)
    if (els.fitTop){
      const opts = els.fitTop.querySelectorAll("option");
      opts.forEach(opt => {
        if (opt.value === "standard") opt.textContent = (state.lang === "jp") ? "標準" : "Standard";
        if (opt.value === "snug") opt.textContent = (state.lang === "jp") ? "ぴったり" : "Snug";
        if (opt.value === "loose") opt.textContent = (state.lang === "jp") ? "ゆったり" : "Loose";
      });
    }
    if (els.fitShoe){
      const fmt2 = (n) => (Math.round(n * 100) / 100).toFixed(2);
      const in10 = fmt2(cmToIn(1.0));  // 10mm = 1.0cm
      const in7  = fmt2(cmToIn(0.7));  // 7mm  = 0.7cm
      const in12 = fmt2(cmToIn(1.2));  // 12mm = 1.2cm

      const opts = els.fitShoe.querySelectorAll("option");
      opts.forEach(opt => {
        if (state.lang === "jp"){
          if (opt.value === "standard") opt.textContent = "標準（+10mm）";
          if (opt.value === "snug") opt.textContent = "ぴったり（+7mm）";
          if (opt.value === "loose") opt.textContent = "ゆったり（+12mm）";
        } else {
          if (opt.value === "standard") opt.textContent = `Standard (+${in10} in)`;
          if (opt.value === "snug") opt.textContent = `Snug (+${in7} in)`;
          if (opt.value === "loose") opt.textContent = `Loose (+${in12} in)`;
        }
      });
    }


    // NEW: tops priority
    if (els.labelTopPriority) els.labelTopPriority.textContent = tt.labelTopPriority;
    if (els.btnPriChest) els.btnPriChest.textContent = tt.priChest;
    if (els.btnPriLength) els.btnPriLength.textContent = tt.priLength;
    if (els.hintTopPriority) els.hintTopPriority.textContent = tt.hintTopPriority;

    // estimator
    els.estimateSummary.textContent = tt.estimateSummary;
    els.labelHeight.textContent = tt.labelHeight;
    els.labelWeight.textContent = tt.labelWeight;
    els.labelSex.textContent = tt.labelSex;
    // update sex select labels
    const sexOptions = els.estSex.querySelectorAll("option");
    sexOptions.forEach(opt => {
      if (opt.value === "female") opt.textContent = tt.female;
      if (opt.value === "male") opt.textContent = tt.male;
    });
    els.labelBMI.textContent = tt.labelBMI;
    els.hintBMI.textContent = tt.hintBMI;
    els.estimateNote.textContent = tt.estimateNote;
    // Always set label (the button can become visible later after a calculation)
    els.btnSetEstimated.textContent = tt.setEstimated;

    // shoes inputs
    els.labelFootLen.textContent = tt.labelFootLen;
    els.hintFootLen.textContent = tt.hintFootLen;
    els.labelFitShoe.textContent = tt.labelFitShoe;
    els.hintFitShoe.textContent = tt.hintFitShoe;
    els.shoesNote.textContent = tt.shoesNote;

    // NEW: shoes width
    if (els.labelFootWidth) els.labelFootWidth.textContent = tt.labelFootWidth;
    if (els.hintFootWidth) els.hintFootWidth.textContent = tt.hintFootWidth;
    if (els.footWidth){
      const opts = els.footWidth.querySelectorAll('option');
      opts.forEach(opt => {
        if (opt.value === 'slim') opt.textContent = tt.widthSlim;
        if (opt.value === 'standard') opt.textContent = tt.widthStandard;
        if (opt.value === 'wide') opt.textContent = tt.widthWide;
      });
    }

    // main buttons
    els.calcBtn.textContent = tt.calcBtn;
    els.btnReset.textContent = tt.btnReset;
    els.btnScrollTable.textContent = tt.btnScrollTable;
    els.btnHighlight.textContent = tt.btnHighlight;
    els.btnFixInput.textContent = tt.btnFixInput;
    els.btnGoTable.textContent = tt.btnGoTable;

    // guide
    els.guideTitle.textContent = tt.guideTitle;
    els.guideCaption.textContent = tt.guideCaption;
    els.notesTitle.textContent = tt.notesTitle;

    // table
    els.tableTitle.textContent = tt.tableTitle;
    els.tableUnit.textContent = (state.unit === "cm") ? tt.tableUnitCm : tt.tableUnitIn;
    els.tableNote.textContent = tt.tableNote;

    // placeholders update
    if (state.lang === "jp"){
      els.nudeChest.placeholder = "例：99";
      els.footLen.placeholder = "例：24.0";
    } else {
      els.nudeChest.placeholder = "e.g., 39.0";
      els.footLen.placeholder = "e.g., 9.5";
    }
  
    window.tcdaUpdateModeButtons?.();
}

  function renderProductDropdown(){
    // build options
    els.productList.innerHTML = "";
    products.forEach(p => {
      const opt = document.createElement("div");
      opt.className = "option";
      opt.setAttribute("role", "option");
      opt.dataset.key = p.key;

      const title = document.createElement("div");
      title.className = "optTitle";
      const labelLines = (state.lang === "jp") ? p.labelJP : p.labelEN;
      title.textContent = labelLines.join(" ");

      const sub = document.createElement("div");
      sub.className = "optSub";
      sub.textContent = (p.type === "shoes")
        ? (state.lang === "jp" ? "シューズ" : "Shoes")
        : (p.type === "hoodie" ? (state.lang === "jp" ? "フーディ" : "Hoodie") : (state.lang === "jp" ? "Tシャツ" : "T-shirt"));

      opt.appendChild(title);
      opt.appendChild(sub);

      opt.addEventListener("click", () => {
        setProduct(p.key);
        closeProductList();
      });

      els.productList.appendChild(opt);
    });

    updateProductButtonText();
  }

  function updateProductButtonText(){
    const p = getProduct();
    const labelLines = (state.lang === "jp") ? p.labelJP : p.labelEN;

    els.productButtonText.innerHTML = "";
    labelLines.forEach(line => {
      const sp = document.createElement("span");
      sp.textContent = line;
      els.productButtonText.appendChild(sp);
    });
  }

  function openProductList(){
    els.productList.hidden = false;
    els.productButton.setAttribute("aria-expanded", "true");
  }
  function closeProductList(){
    els.productList.hidden = true;
    els.productButton.setAttribute("aria-expanded", "false");
  }
  function toggleProductList(){
    const isOpen = !els.productList.hidden;
    if (isOpen) closeProductList(); else openProductList();
  }

  function setProduct(key){
    state.productKey = key;
    state.lastMatchIndex = null;
    state.lastAltMatchIndex = null;
    state.lastRecommendedSizeVal = null;
    state.tableMode = "product";
    state.lastEstimatedChestCm = null;
    clearResultAndError();
    clearHighlight();
    updateProductButtonText();
    loadAndRenderCurrentProduct();
  }

  function clearResultAndError(){
    els.result.hidden = true;
    els.errorBox.hidden = true;
    els.resultTitle.textContent = "";
    els.resultValue.textContent = "";
    els.resultDetail.textContent = "";
    if (els.resultValueAlt) { els.resultValueAlt.textContent = ""; els.resultValueAlt.hidden = true; }
    if (els.btnHighlightAlt) els.btnHighlightAlt.hidden = true;
    els.errorMsg.textContent = "";
  }

  function showError(kind){
    const tt = t();
    els.errorBox.hidden = false;
    els.result.hidden = true;

    if (kind === "need_input"){
      els.errorMsg.textContent = (state.lang === "jp")
        ? "必要な数値が未入力です。入力欄を確認してください。"
        : "Required measurement is missing. Please check the inputs.";
    } else if (kind === "invalid_input"){
      els.errorMsg.textContent = tt.invalidInput;
    } else {
      els.errorMsg.textContent = tt.resultTitleNotFound;
    }
  }

  function showResult(sizeText, altText, detail){
    const tt = t();
    els.errorBox.hidden = true;
    els.result.hidden = false;
    els.resultTitle.textContent = tt.resultTitle;
    els.resultValue.textContent = sizeText;
    if (els.resultValueAlt){
      els.resultValueAlt.textContent = altText || "";
      els.resultValueAlt.hidden = !altText;
    }
    els.resultDetail.textContent = detail;
  }

  function renderNotes(){
    const tt = t();
    els.notesList.innerHTML = "";
    const p = getProduct();
    let arr = tt.notesTops;
    if (p.noteSet === "hoodie") arr = [...tt.notesTops.slice(0,3), ...tt.notesHoodie];
    if (p.noteSet === "shoes") arr = tt.notesShoes;

    arr.forEach(line => {
      const li = document.createElement("li");
      li.textContent = line;
      els.notesList.appendChild(li);
    });
  }

  function renderInputs(){
    const tt = t();
    const p = getProduct();

    const tops = (p.type !== "shoes");
    els.inputsTops.hidden = !tops;
    els.inputsShoes.hidden = tops;

    // labels include unit
    if (tops){
      els.labelNudeChest.textContent = (state.lang === "jp")
        ? `ヌード胸囲（${state.unit}）`
        : `Nude chest (${state.unit})`;

      // "Set estimated" button: show only when the estimator has produced a
      // value during this session. We never overwrite automatically.
      
  els.btnSetEstimated.hidden = !(typeof state.lastEstimatedChestCm === "number" && isFinite(state.lastEstimatedChestCm));

  // NEW: show tops priority toggle
  if (els.topPriorityBox) els.topPriorityBox.hidden = false;
  if (els.btnPriChest && els.btnPriLength){
    els.btnPriChest.setAttribute("aria-selected", String(state.topPriority === "chest"));
    els.btnPriLength.setAttribute("aria-selected", String(state.topPriority === "length"));
  }

} else {
      // NEW: hide tops priority on shoes
      if (els.topPriorityBox) els.topPriorityBox.hidden = true;
      els.labelFootLen.textContent = (state.lang === "jp")
        ? `足長（${state.unit}）`
        : `Foot length (${state.unit})`;
    }

    // product hints
    els.productHint.textContent = isShoes(state.productKey) ? tt.productHintShoes : tt.productHintTops;
  }

  async function loadAndRenderCurrentProduct(){
    renderInputs();
    renderNotes();

    // guide image
    const p = getProduct();
    els.guideImg.src = p.guideImg;
    els.guideImg.alt = (state.lang === "jp")
      ? `測り方ガイド：${p.labelJP.join(" ")}`
      : `How to measure: ${p.labelEN.join(" ")}`;

    window.tcdaUpdateModeButtons?.();

    // load table
    await loadTableForCurrent();
  }

  async function loadTableForCurrent(){
    const p = getProduct();
    const url = (state.tableMode === "body" && p.bodyCsv) ? p.bodyCsv[state.unit] : p.csv[state.unit];
    try{
      const { cols, data } = await loadCsv(url);
      state.tableCols = cols;
      state.tableRows = data;
      renderTable(cols, data);
    } catch(e){
      state.tableCols = [];
      state.tableRows = [];
      renderTable([], []);
      showError("not_found");
      console.error(e);
    }
  }

  function renderTable(cols, rows){
    // header
    els.tableHeadRow.innerHTML = "";
    els.tableBody.innerHTML = "";
    clearHighlight();

    if (!cols.length){
      const tr = document.createElement("tr");
      tr.innerHTML = `<th>${state.lang === "jp" ? "読み込みエラー" : "Load error"}</th>`;
      els.tableHeadRow.appendChild(tr);
      return;
    }

    const headerTr = document.createElement("tr");
    cols.forEach(c => {
      const th = document.createElement("th");
      th.textContent = formatColumnLabel(c);
      headerTr.appendChild(th);
    });
    els.tableHeadRow.appendChild(headerTr);

    rows.forEach((r, idx) => {
      const tr = document.createElement("tr");
      tr.dataset.idx = String(idx);
      cols.forEach(c => {
        const td = document.createElement("td");
        td.textContent = (r[c] ?? "");
        tr.appendChild(td);
      });
      els.tableBody.appendChild(tr);
    });

    els.tableUnit.textContent = (state.unit === "cm") ? t().tableUnitCm : t().tableUnitIn;
  }

  function formatColumnLabel(c){
    // NOTE:
    // Some CSV headers can vary by casing (e.g., "Sleeve Length" vs "Sleeve length")
    // or have extra spaces. Normalize first, then map.
    const raw = String(c ?? "").trim();
    const key = raw.toLowerCase().replace(/\s+/g, " ");

    if (state.lang !== "jp"){
      // Keep the original header for EN, but ensure it doesn't carry odd spacing.
      return raw;
    }

    // JP labels (case-insensitive matching)
    if (key === "size") return "サイズ";
    if (key === "chest (flat)") return "身幅（平置き）";
    if (key === "length") return "着丈";
    if (key === "sleeve length") return "袖丈";
    if (key === "foot length") return "足の長さ";
    if (key === "outsole length") return "アウトソール長";
    if (key === "chest width (flat)") return "身幅（平置き）";
    if (key === "body length") return "着丈";
    if (key === "chest circumference") return "胸囲";
    if (key === "waist") return "ウエスト";
    if (key === "hip") return "ヒップ";


    return raw;
  }

  function clearHighlight(){
    [...els.tableBody.querySelectorAll("tr.highlight")].forEach(tr => tr.classList.remove("highlight"));
    [...els.tableBody.querySelectorAll("tr.highlightAlt")].forEach(tr => tr.classList.remove("highlightAlt"));
  }

  function highlightRow(index, kind = "highlight"){
    if (index == null) return;
    const tr = els.tableBody.querySelector(`tr[data-idx="${index}"]`);
    if (!tr) return;

    if (kind === "highlight") clearHighlight();
    tr.classList.add(kind);
    tr.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function scrollToTable(){
    els.tableCard.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // ---------- main action ----------

async function runCalc(opts = {}){
  const { skipLog = false, skipScroll = false, skipHighlight = false } = (opts && typeof opts === 'object') ? opts : {};
  clearResultAndError();
  if (!skipHighlight) clearHighlight();

  // ensure table loaded
  if (!state.tableRows.length){
    await loadTableForCurrent();
    if (!state.tableRows.length){
      showError("not_found");
      if (!skipLog) pushLog({
        ts: new Date().toISOString(),
        ok: false,
        reason: "table_load_failed",
        lang: state.lang,
        unit: state.unit,
        productKey: state.productKey,
      });
      return;
    }
  }

  const p = getProduct();
  let rec = null;

  if (p.type === "shoes"){
    rec = recommendShoesMulti(state.tableRows);
    if (rec.error){
      showError(rec.error);
      if (!skipLog) pushLog({
        ts: new Date().toISOString(),
        ok: false,
        reason: rec.error,
        lang: state.lang,
        unit: state.unit,
        productKey: state.productKey,
        productType: p.type,
        inputs: {
          footLen: els.footLen?.value ?? "",
          fit: els.fitShoe?.value ?? "",
          footWidth: els.footWidth?.value ?? "standard",
        }
      });
      return;
    }

    showResult(rec.primary.size, rec.alt?.label || "", rec.detail);
    state.lastRecommendedSizeVal = rec.primary.size;
    state.lastMatchIndex = rec.primary.matchIndex;
    state.lastAltMatchIndex = rec.alt?.matchIndex ?? null;

    // highlight both (primary strong, alt subtle)
    if (!skipScroll) scrollToTable();
    if (!skipHighlight) highlightRow(state.lastMatchIndex, "highlight");
    if (!skipHighlight && state.lastAltMatchIndex != null) highlightRow(state.lastAltMatchIndex, "highlightAlt");

    // alt button
    if (els.btnHighlightAlt){
      const show = rec.alt && rec.alt.matchIndex != null && rec.alt.matchIndex !== rec.primary.matchIndex;
      els.btnHighlightAlt.hidden = !show;
      if (show) els.btnHighlightAlt.textContent = (state.lang === "jp") ? "次点も見る" : "Show runner-up";
    }

    // log success
    if (!skipLog) pushLog({
      ts: new Date().toISOString(),
      ok: true,
      lang: state.lang,
      unit: state.unit,
      productKey: state.productKey,
      productType: p.type,
      inputMethod: "measured",
      inputs: {
        footLen: rec.footUsed,
        allowance: rec.allowanceUsed,
        fit: els.fitShoe?.value ?? "",
        footWidth: rec.width,
      },
      result: {
        recommended: rec.primary.size,
        runnerUp: rec.alt?.size ?? null,
      }
    });

  } else {
    rec = recommendTopsMulti(state.tableRows);
    if (rec.error){
      showError(rec.error);
      if (!skipLog) pushLog({
        ts: new Date().toISOString(),
        ok: false,
        reason: rec.error,
        lang: state.lang,
        unit: state.unit,
        productKey: state.productKey,
        productType: p.type,
        inputs: {
          nudeChest: els.nudeChest?.value ?? "",
          fit: els.fitTop?.value ?? "",
          priority: state.topPriority,
          height: els.estHeight?.value ?? "",
          weight: els.estWeight?.value ?? "",
          sex: els.estSex?.value ?? "",
          bmi: els.estBmi?.value ?? "",
        }
      });
      return;
    }

    showResult(rec.primary.size, rec.alt?.label || "", rec.detail);
    state.lastRecommendedSizeVal = rec.primary.size;
    state.lastMatchIndex = rec.primary.matchIndex;
    state.lastAltMatchIndex = rec.alt?.matchIndex ?? null;

    // show "Set estimated" only if estimate was used
    state.lastEstimatedChestCm = rec.usedEst ? rec.estCm : null;
    if (els.btnSetEstimated){
      const show = !!(rec.usedEst && Number.isFinite(rec.estCm) && p.type !== "shoes");
      els.btnSetEstimated.hidden = !show;
      if (show) els.btnSetEstimated.textContent = t().setEstimated;
    }

    // highlight both
    if (!skipScroll) scrollToTable();
    if (!skipHighlight) highlightRow(state.lastMatchIndex, "highlight");
    if (!skipHighlight && state.lastAltMatchIndex != null) highlightRow(state.lastAltMatchIndex, "highlightAlt");

    // alt button
    if (els.btnHighlightAlt){
      const show = rec.alt && rec.alt.matchIndex != null && rec.alt.matchIndex !== rec.primary.matchIndex;
      els.btnHighlightAlt.hidden = !show;
      if (show) els.btnHighlightAlt.textContent = (state.lang === "jp") ? "次点も見る" : "Show runner-up";
    }

    // log success
    if (!skipLog) pushLog({
      ts: new Date().toISOString(),
      ok: true,
      lang: state.lang,
      unit: state.unit,
      productKey: state.productKey,
      productType: p.type,
      inputMethod: rec.inputMethod,
      inputs: {
        nudeChest: rec.chestUsed,
        usedEstimator: rec.usedEst,
        estimatedChestCm: rec.usedEst ? rec.estCm : null,
        fit: els.fitTop?.value ?? "",
        priority: state.topPriority,
        heightCm: rec.heightCm,
        weightKg: toNumber(els.estWeight?.value),
        sex: els.estSex?.value ?? "",
        bmi: toNumber(els.estBmi?.value),
      },
      result: {
        recommended: rec.primary.size,
        runnerUp: rec.alt?.size ?? null,
      }
    });
  }
}

// ---------- events ----------

  function bindEvents(){
    els.btnLangJP.addEventListener("click", () => setLang("jp"));
    els.btnLangEN.addEventListener("click", () => setLang("en"));

    // NEW: tops priority toggle
    els.btnPriChest?.addEventListener("click", () => {
      state.topPriority = "chest";
      els.btnPriChest.setAttribute("aria-selected", "true");
      els.btnPriLength?.setAttribute("aria-selected", "false");
      clearResultAndError();
      clearHighlight();
    });
    els.btnPriLength?.addEventListener("click", () => {
      state.topPriority = "length";
      els.btnPriLength.setAttribute("aria-selected", "true");
      els.btnPriChest?.setAttribute("aria-selected", "false");
      clearResultAndError();
      clearHighlight();
    });

    // custom dropdown
    els.productButton.addEventListener("click", toggleProductList);
    document.addEventListener("click", (e) => {
      if (!els.productSelect.contains(e.target)) closeProductList();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeProductList();
    });

    els.calcBtn.addEventListener("click", runCalc);

    els.btnReset.addEventListener("click", () => {
      els.nudeChest.value = "";
      if (els.garmentChest) els.garmentChest.value = "";
      if (els.garmentLength) els.garmentLength.value = "";
      els.footLen.value = "";
      els.result.hidden = true;
      els.errorBox.hidden = true;
      if (els.resultValueAlt) els.resultValueAlt.hidden = true;
      if (els.btnHighlightAlt) els.btnHighlightAlt.hidden = true;
      clearHighlight();

      state.lastMatchIndex = null;
      state.lastAltMatchIndex = null;
      state.lastEstimatedChestCm = null;
      if (els.btnSetEstimated) els.btnSetEstimated.hidden = true;
    });

    els.btnScrollTable.addEventListener("click", () => {
      scrollToTable();
    });

    els.btnHighlight.addEventListener("click", () => {
      scrollToTable();
      highlightRow(state.lastMatchIndex, "highlight");
    });

    els.btnHighlightAlt?.addEventListener("click", () => {
      if (state.lastAltMatchIndex == null) return;
      scrollToTable();
      // make runner-up the focused highlight
      clearHighlight();
      highlightRow(state.lastAltMatchIndex, "highlight");
    });

    els.btnFixInput.addEventListener("click", () => {
      els.errorBox.hidden = true;
      if (els.btnHighlightAlt) els.btnHighlightAlt.hidden = true;
    });
    els.btnGoTable.addEventListener("click", () => {
      scrollToTable();
    });

    // Set estimated -> nude chest input (1-tap, no auto overwrite)
    els.btnSetEstimated?.addEventListener("click", () => {
      const estCm = state.lastEstimatedChestCm;
      if (!Number.isFinite(estCm)) return;

      if (state.unit === "cm"){
        els.nudeChest.value = String(Math.round(estCm));
      } else {
        const inch = cmToIn(estCm);
        els.nudeChest.value = String(round1(inch));
      }

      // optional feedback (prepend)
      const msg = t().msgSetEstimatedDone;
      if (els.resultDetail.textContent){
        els.resultDetail.textContent = `${msg}\n${els.resultDetail.textContent}`;
      } else {
        els.resultDetail.textContent = msg;
      }

      // re-calc based on the now-fixed nude input
      runCalc();
    });

    // re-render on fit change (optional instant feedback)
    els.fitTop.addEventListener("change", () => { clearResultAndError(); clearHighlight(); });
    els.fitShoe.addEventListener("change", () => { clearResultAndError(); clearHighlight(); });
  
    // NEW: table mode toggle (Product measurements / Body measurements)
    const modeWrap = document.createElement("div");
    modeWrap.id = "tableModeToggle";
    modeWrap.style.display = "flex";
    modeWrap.style.gap = "8px";
    modeWrap.style.marginTop = "8px";

    const btnProd = document.createElement("button");
    btnProd.type = "button";
    btnProd.id = "btnModeProduct";
    btnProd.style.padding = "6px 10px";
    btnProd.style.borderRadius = "10px";

    const btnBody = document.createElement("button");
    btnBody.type = "button";
    btnBody.id = "btnModeBody";
    btnBody.style.padding = "6px 10px";
    btnBody.style.borderRadius = "10px";

    modeWrap.appendChild(btnProd);
    modeWrap.appendChild(btnBody);

    // insert under table title
    if (els.tableTitle && !document.getElementById("tableModeToggle")){
      els.tableTitle.appendChild(modeWrap);
    }

    function updateModeButtons(){
      const p = getProduct();
      const hasBody = !!(p && p.bodyCsv);
      modeWrap.style.display = hasBody ? "flex" : "none";

      btnProd.textContent = (state.lang === "jp") ? "製品寸法" : "Product measurements";
      btnBody.textContent = (state.lang === "jp") ? "身体寸法" : "Body measurements";

      btnProd.setAttribute("aria-selected", String(state.tableMode === "product"));
      btnBody.setAttribute("aria-selected", String(state.tableMode === "body"));
    }
    window.tcdaUpdateModeButtons = updateModeButtons;

    btnProd.addEventListener("click", async () => {
      state.tableMode = "product";
      updateModeButtons();
      await loadTableForCurrent();
      clearHighlight();
      if (state.lastMatchIndex != null) highlightRow(state.lastMatchIndex, "highlight");
      if (state.lastAltMatchIndex != null) highlightRow(state.lastAltMatchIndex, "highlightAlt");
    });

    btnBody.addEventListener("click", async () => {
      state.tableMode = "body";
      updateModeButtons();
      await loadTableForCurrent();
      clearHighlight();
      // re-highlight by size label when switching tables (tops/hoodies)
      const want = String(state.lastRecommendedSizeVal ?? "").trim();
      if (want){
        const idx = state.tableRows.findIndex(r => String(pickCell(r, SIZE_KEYS)).trim() === want);
        if (idx >= 0) highlightRow(idx, "highlight");
      }
    });

}

  // ---------- init ----------
  async function init(){
    applyI18n();
    bindEvents();
    await tryLoadManifestProducts();
    renderProductDropdown();
    await loadAndRenderCurrentProduct();
  }

  init();
})();
