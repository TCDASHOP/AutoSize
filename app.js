/* ==========
   TCDA Auto Size (app.js) - Improved Accuracy UX
   - 2 recommendations (Primary + Runner-up)
   - Tops: Priority toggle (Chest vs Length)
   - Shoes: Width (Narrow/Standard/Wide) quick input + correction
   - Keeps JP=cm / EN=inch logic
   - Highlights recommended row in size chart (auto scroll)
   - Logs suggestion meta to localStorage (no raw body data required)
   ========== */

const i18n = {
  jp: {
    backToShop: "ショップに戻る",
    title: "サイズ自動算出",
    lead: "商品を選び、必要な項目だけ入力してください。JPはcm、ENはinchで表示されます。",
    product: "商品",
    chooseProduct: "商品を選択",
    calc: "おすすめサイズを計算",
    reset: "入力を見直す",
    pickFromChart: "サイズ表で選ぶ",
    chart: "サイズ表",
    chartLead: "商品を選ぶとサイズ表が表示されます。",

    topsTitle: "トップス（Tシャツ / フーディ）",
    shoesTitle: "スリッポンシューズ",

    nudeChest: "ヌード胸囲",
    nudeChestHint: "分かる場合はこれが最優先です。",
    fit: "フィット感",
    fitHint: "好みで「ゆとり量」が変わります。",

    priority: "優先",
    prChest: "胸囲",
    prLength: "着丈",
    priorityHint: "同じ胸囲でも「丈の満足度」で割れやすいので、優先を選べます。",

    estTitle: "ヌード寸法が分からない場合（推定入力）",
    height: "身長",
    weight: "体重",
    sex: "性別",
    bmi: "BMI（自動計算）",
    estNote:
      "推定値は実測ではありません。自動で上書きせず、必要な場合のみ「推定値をセット」で反映できます。",
    estSummary: (v, unit) => `推定胸囲：${v}${unit}`,
    estSummaryNone: "推定胸囲：—",
    setEstimated: "推定値をセット",

    footLen: "足長（実測）",
    footHint: "左右を測って長い方を採用。",
    shoeFit: "好み",
    shoeFitHint: "捨て寸（余裕）が変わります。",
    shoeWidth: "足幅",
    shoeWidthHint: "細め/標準/広め。迷ったら大きめ寄り。",
    wNarrow: "細め",
    wStandard: "標準",
    wWide: "広め",

    shoeNote:
      "アウトソール長は外寸です。足長と同一視しないでください（補助指標）。",

    guideCaption: "※ 画像は商品に応じて切り替わります。",

    resultTitle: "おすすめ",
    recPrimary: "推奨",
    recRunner: "次点",
    basisTops: (target, ease, unit, prText) =>
      `根拠：ヌード胸囲 + ゆとり（${ease}${unit}）→ 目標仕上がり胸囲 ${target}${unit}。優先：${prText}`,
    basisShoes: (target, add, unit, widthText) =>
      `根拠：足長 + 捨て寸（${add}${unit}）→ 目標 ${target}${unit}。足幅：${widthText}`,
    runnerNoteUp: "丈の余裕を足すなら",
    runnerNoteChest: "胸囲を優先するなら",
    runnerNoteWidth: "幅広のため",
    notFound: "該当するサイズが見当たりませんでした。",

    selfCheckTitle: "サイズが合わなかったと感じたら（2〜3問チェック）",
    selfT1: "きついのはどこ？",
    selfT1a: "胸・肩まわり → 次は 1サイズ上（または「ゆったり」）",
    selfT1b: "丈だけ短い/長い → サイズ表の「着丈」を優先して近いサイズへ",
    selfT1c:
      "袖だけ違和感 → 体感は肩線で変わるので「身幅→着丈→袖丈」の順で選ぶ",
    selfT2: "入力は実測？推定？",
    selfT2a:
      "推定入力だった → 次回はヌード寸法を実測して再計算（推定は誤差が出ます）",
    selfT3: "迷う場合の最短ルート",
    selfT3a:
      "手持ちの“いちばん好きな服”を平置きで測り、サイズ表の近い数値を選ぶ",

    selfS1: "どこがきつい？",
    selfS1a:
      "つま先が当たる → 足長が足りない可能性（次は大きめ寄り）",
    selfS1b:
      "幅/甲がきつい → 幅広/甲高は体感が変わる（迷ったら大きめ寄り）",
    selfS2: "入力は足長（実測）？",
    selfS2a:
      "推定や感覚だった → 左右の足長を測り、長い方で選ぶ",
    selfS3: "アウトソールの扱い",
    selfS3a:
      "アウトソール長は外寸なので補助指標。足長と同一視しない"
  },

  en: {
    backToShop: "Back to shop",
    title: "Auto Size Guide",
    lead:
      "Choose a product and enter only the required fields. JP shows cm, EN shows inches.",
    product: "Product",
    chooseProduct: "Select a product",
    calc: "Calculate recommended size",
    reset: "Review inputs",
    pickFromChart: "Choose from size chart",
    chart: "Size chart",
    chartLead: "Select a product to display its size chart.",

    topsTitle: "Tops (T-shirt / Hoodie)",
    shoesTitle: "Slip-on canvas shoes",

    nudeChest: "Nude chest",
    nudeChestHint: "If you know it, this is the highest priority input.",
    fit: "Fit preference",
    fitHint: "Ease changes by preference.",

    priority: "Priority",
    prChest: "Chest",
    prLength: "Length",
    priorityHint:
      "Even with the same chest, satisfaction often splits by length. Choose what you care about.",

    estTitle: "If you don’t know your nude measurement (Estimator)",
    height: "Height",
    weight: "Weight",
    sex: "Sex",
    bmi: "BMI (auto)",
    estNote:
      "This is not an actual measurement. It will NOT overwrite automatically. Tap “Set estimated value” only if needed.",
    estSummary: (v, unit) => `Estimated chest: ${v}${unit}`,
    estSummaryNone: "Estimated chest: —",
    setEstimated: "Set estimated value",

    footLen: "Foot length (measured)",
    footHint: "Measure both feet and use the longer one.",
    shoeFit: "Preference",
    shoeFitHint: "Toe allowance changes by preference.",
    shoeWidth: "Width",
    shoeWidthHint: "Narrow / Standard / Wide. If unsure, size up.",
    wNarrow: "Narrow",
    wStandard: "Standard",
    wWide: "Wide",

    shoeNote:
      "Outsole length is an external measurement. Treat it as a reference (do not equate it with foot length).",

    guideCaption: "*Image changes by product.",

    resultTitle: "Recommended",
    recPrimary: "Primary",
    recRunner: "Runner-up",
    basisTops: (target, ease, unit, prText) =>
      `Basis: nude chest + ease (${ease}${unit}) → target finished chest ${target}${unit}. Priority: ${prText}`,
    basisShoes: (target, add, unit, widthText) =>
      `Basis: foot length + allowance (${add}${unit}) → target ${target}${unit}. Width: ${widthText}`,
    runnerNoteUp: "If you prefer more length",
    runnerNoteChest: "If chest feel is the priority",
    runnerNoteWidth: "Because of wide fit",
    notFound: "No matching size was found.",

    selfCheckTitle: "If the size didn’t feel right (2–3 quick checks)",
    selfT1: "Where did it feel off?",
    selfT1a:
      "Tight in chest/shoulders → choose one size up (or select “Loose”)",
    selfT1b:
      "Only length feels off → prioritize “Length” in the size chart",
    selfT1c:
      "Only sleeves feel off → shoulder seam changes the feel; prioritize Chest (flat) → Length → Sleeve",
    selfT2: "Measured value or estimate?",
    selfT2a:
      "If estimated → re-check with actual nude measurements (estimates can vary)",
    selfT3: "Fastest way to avoid mistakes",
    selfT3a:
      "Measure your best-fitting item flat and pick the closest numbers in the chart",

    selfS1: "What feels tight?",
    selfS1a:
      "Toes hit the front → foot length may be too short (go slightly bigger)",
    selfS1b:
      "Width/instep feels tight → wide/high instep can change fit (if unsure, go bigger)",
    selfS2: "Did you measure foot length?",
    selfS2a: "If not → measure both feet and use the longer one",
    selfS3: "About outsole length",
    selfS3a:
      "Outsole length is external; treat it as a reference (not the same as foot length)"
  }
};

/* === Products (keep your existing CSV paths/names) ===
   If your file names differ, edit here only.
*/
const PRODUCTS = [
  {
    key: "mens_crew",
    type: "tops",
    titleJP: "Men's Crew Neck",
    subJP: "T-Shirt",
    titleEN: "Men's Crew Neck",
    subEN: "T-Shirt",
    guideImg: "assets/guide_tshirt.jpg",
    csv: { cm: "data/mens_crew_cm.csv", inch: "data/mens_crew_inch.csv" }
  },
  {
    key: "womens_crew",
    type: "tops",
    titleJP: "Women's Crew Neck",
    subJP: "T-Shirt",
    titleEN: "Women's Crew Neck",
    subEN: "T-Shirt",
    guideImg: "assets/guide_tshirt.jpg",
    csv: {
      cm: "data/womens_crew_cm.csv",
      inch: "data/womens_crew_inch.csv"
    }
  },
  {
    key: "unisex_hoodie",
    type: "tops",
    titleJP: "Unisex",
    subJP: "Hoodie",
    titleEN: "Unisex",
    subEN: "Hoodie",
    guideImg: "assets/guide_hoodie.jpg",
    csv: {
      cm: "data/unisex_hoodie_cm.csv",
      inch: "data/unisex_hoodie_inch.csv"
    }
  },
  {
    key: "unisex_zip_hoodie",
    type: "tops",
    titleJP: "Unisex ZIP",
    subJP: "Hoodie",
    titleEN: "Unisex ZIP",
    subEN: "Hoodie",
    guideImg: "assets/guide_zip_hoodie.jpg",
    csv: {
      cm: "data/unisex_zip_hoodie_cm.csv",
      inch: "data/unisex_zip_hoodie_inch.csv"
    }
  },
  {
    key: "slipon_womens",
    type: "shoes",
    titleJP: "Women's Slip-On",
    subJP: "Canvas Shoes",
    titleEN: "Women's Slip-On",
    subEN: "Canvas Shoes",
    guideImg: "assets/guide_slipon.jpg",
    csv: {
      cm: "data/slipon_womens_cm.csv",
      inch: "data/slipon_womens_inch.csv"
    }
  },
  {
    key: "slipon_mens",
    type: "shoes",
    titleJP: "Men's Slip-On",
    subJP: "Canvas Shoes",
    titleEN: "Men's Slip-On",
    subEN: "Canvas Shoes",
    guideImg: "assets/guide_slipon.jpg",
    csv: {
      cm: "data/slipon_mens_cm.csv",
      inch: "data/slipon_mens_inch.csv"
    }
  }
];

/* ---------- State ---------- */
const state = {
  lang: "jp",
  unit: "cm", // auto by lang
  productKey: null,
  productType: null,

  // Raw CSV (as loaded)
  table: { headers: [], rows: [] },

  // Estimator (tops)
  lastEstimatedChestCm: null,
  usedEstimateInCalc: false,

  // New UX inputs
  topsPriority: "chest", // chest | length
  shoeWidth: "standard" // narrow | standard | wide
};

function tget() {
  return i18n[state.lang];
}
let t = tget();

/* ---------- DOM refs (gracefully handle missing) ---------- */
const els = {
  backToShop: byId("backToShop"),
  langJP: byId("langJP"),
  langEN: byId("langEN"),

  pageTitle: byId("pageTitle"),
  pageLead: byId("pageLead"),
  productLabel: byId("productLabel"),

  productBtn: byId("productBtn"),
  productBtnText: byId("productBtnText"),
  productMenu: byId("productMenu"),

  inputsArea: byId("inputsArea"),
  groupTops: byId("groupTops"),
  groupShoes: byId("groupShoes"),

  topsTitle: byId("topsTitle"),
  shoesTitle: byId("shoesTitle"),

  nudeChest: byId("nudeChest"),
  unitChest: byId("unitChest"),
  labelNudeChest: byId("labelNudeChest"),
  hintNudeChest: byId("hintNudeChest"),

  fitPref: byId("fitPref"),
  labelFit: byId("labelFit"),
  hintFit: byId("hintFit"),

  height: byId("height"),
  weight: byId("weight"),
  sex: byId("sex"),
  bmi: byId("bmi"),
  unitHeight: byId("unitHeight"),
  unitWeight: byId("unitWeight"),
  labelHeight: byId("labelHeight"),
  labelWeight: byId("labelWeight"),
  labelSex: byId("labelSex"),
  labelBmi: byId("labelBmi"),
  estTitle: byId("estTitle"),
  estSummary: byId("estSummary"),
  estNote: byId("estNote"),
  btnSetEstimated: byId("btnSetEstimated"),

  footLen: byId("footLen"),
  unitFoot: byId("unitFoot"),
  labelFootLen: byId("labelFootLen"),
  hintFoot: byId("hintFoot"),
  shoeFit: byId("shoeFit"),
  labelShoeFit: byId("labelShoeFit"),
  hintShoeFit: byId("hintShoeFit"),
  shoeNote: byId("shoeNote"),

  guideImg: byId("guideImg"),
  guideCaption: byId("guideCaption"),

  calcBtn: byId("calcBtn"),
  resetBtn: byId("resetBtn"),
  scrollTableBtn: byId("scrollTableBtn"),

  resultArea: byId("resultArea"),
  resultTitle: byId("resultTitle"),
  resultValue: byId("resultValue"),
  resultDetail: byId("resultDetail"),
  selfCheckWrap: byId("selfCheckWrap"),

  errorBox: byId("errorBox"),
  errorText: byId("errorText"),
  errorResetBtn: byId("errorResetBtn"),
  errorTableBtn: byId("errorTableBtn"),

  chartTitle: byId("chartTitle"),
  chartMeta: byId("chartMeta"),
  tableHead: byId("tableHead"),
  tableBody: byId("tableBody"),
  sizeTable: byId("sizeTable")
};

/* ---------- New UI containers (injected if missing) ---------- */
let injected = {
  topsPriorityWrap: null,
  shoesWidthWrap: null
};

/* ---------- Utilities ---------- */
function byId(id) {
  return document.getElementById(id);
}
function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}
function round1(n) {
  return Math.round(n * 10) / 10;
}
function cmToIn(cm) {
  return cm / 2.54;
}
function inToCm(inch) {
  return inch * 2.54;
}
function parseNumberSmart(s) {
  if (s == null) return null;
  const raw = String(s).trim();
  if (!raw) return null;

  // "7 1/2"
  const mixed = raw.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (mixed) {
    const a = parseFloat(mixed[1]);
    const b = parseFloat(mixed[2]);
    const c = parseFloat(mixed[3]);
    if (isFinite(a) && isFinite(b) && isFinite(c) && c !== 0) return a + b / c;
  }
  // "1/2"
  const frac = raw.match(/^(\d+)\/(\d+)$/);
  if (frac) {
    const b = parseFloat(frac[1]);
    const c = parseFloat(frac[2]);
    if (isFinite(b) && isFinite(c) && c !== 0) return b / c;
  }

  const v = parseFloat(raw.replace(/,/g, ""));
  if (!isFinite(v)) return null;
  return v;
}
function csvSplitLine(line) {
  const out = [];
  let cur = "";
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      q = !q;
      continue;
    }
    if (ch === "," && !q) {
      out.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  out.push(cur);
  return out.map((s) => s.trim());
}
async function loadCSV(path) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`CSV load failed: ${path}`);
  const text = await res.text();
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length < 2) return { headers: [], rows: [] };

  const headers = csvSplitLine(lines[0]);
  const rows = lines.slice(1).map((l) => {
    const cols = csvSplitLine(l);
    const row = {};
    headers.forEach((h, idx) => (row[h] = cols[idx] ?? ""));
    return row;
  });
  return { headers, rows };
}
function normalizeKey(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .replace(/[^a-z0-9\u3040-\u30ff\u4e00-\u9faf]+/g, "")
    .trim();
}
function findColumn(headers, candidates) {
  const nHeaders = headers.map((h) => normalizeKey(h));
  for (const cand of candidates) {
    const c = normalizeKey(cand);
    const idx = nHeaders.findIndex((h) => h === c);
    if (idx >= 0) return headers[idx];
  }
  // contains fallback
  for (const cand of candidates) {
    const c = normalizeKey(cand);
    const idx = nHeaders.findIndex((h) => h.includes(c));
    if (idx >= 0) return headers[idx];
  }
  return null;
}

/* ---------- Column label translation (for size table header display) ---------- */
function labelForHeader(h) {
  const k = normalizeKey(h);

  // common
  const map = {
    size: { jp: "サイズ", en: "Size" },
    us: { jp: "US", en: "US" },
    uk: { jp: "UK", en: "UK" },
    eu: { jp: "EU", en: "EU" },

    chestflat: { jp: "身幅（平置き）", en: "Chest (flat)" },
    chest: { jp: "胸囲", en: "Chest" },
    length: { jp: "着丈", en: "Length" },
    bodylength: { jp: "着丈", en: "Length" },
    sleeve: { jp: "袖丈", en: "Sleeve" },
    sleevlength: { jp: "袖丈", en: "Sleeve" },

    footlength: { jp: "足長", en: "Foot length" },
    outsolelength: { jp: "アウトソール長", en: "Outsole length" }
  };

  // soft matching
  const pick = (jp, en) => (state.lang === "jp" ? jp : en);

  if (k.includes("size")) return pick("サイズ", "Size");
  if (k === "us") return "US";
  if (k === "uk") return "UK";
  if (k === "eu") return "EU";

  if (k.includes("chest") && k.includes("flat")) return pick("身幅（平置き）", "Chest (flat)");
  if (k.includes("bodywidth") || k.includes("halfchest") || k.includes("身幅")) return pick("身幅（平置き）", "Chest (flat)");
  if (k.includes("length") || k.includes("着丈")) return pick("着丈", "Length");
  if (k.includes("sleeve") || k.includes("袖丈")) return pick("袖丈", "Sleeve");

  if (k.includes("foot") && k.includes("length")) return pick("足長", "Foot length");
  if (k.includes("outsole")) return pick("アウトソール長", "Outsole length");

  // fallback: original
  return h;
}

/* ---------- Language + units ---------- */
function setLang(lang) {
  state.lang = lang;
  state.unit = lang === "jp" ? "cm" : "inch";
  t = tget();

  if (els.langJP && els.langEN) {
    els.langJP.classList.toggle("isActive", lang === "jp");
    els.langEN.classList.toggle("isActive", lang === "en");
    els.langJP.setAttribute("aria-selected", lang === "jp" ? "true" : "false");
    els.langEN.setAttribute("aria-selected", lang === "en" ? "true" : "false");
  }

  applyI18n();
  refreshUnits();
  rerenderProductButton();

  // reload CSV to switch cm/inch chart
  if (state.productKey) {
    selectProduct(state.productKey, true);
  } else {
    rerenderTable(); // keep placeholder
  }
}

/* ---------- Apply i18n text ---------- */
function applyI18n() {
  if (els.backToShop) els.backToShop.textContent = t.backToShop;
  if (els.pageTitle) els.pageTitle.textContent = t.title;
  if (els.pageLead) els.pageLead.textContent = t.lead;
  if (els.productLabel) els.productLabel.textContent = t.product;

  if (els.topsTitle) els.topsTitle.textContent = t.topsTitle;
  if (els.shoesTitle) els.shoesTitle.textContent = t.shoesTitle;

  if (els.labelNudeChest) els.labelNudeChest.textContent = t.nudeChest;
  if (els.hintNudeChest) els.hintNudeChest.textContent = t.nudeChestHint;

  if (els.labelFit) els.labelFit.textContent = t.fit;
  if (els.hintFit) els.hintFit.textContent = t.fitHint;

  if (els.estTitle) els.estTitle.textContent = t.estTitle;
  if (els.labelHeight) els.labelHeight.textContent = t.height;
  if (els.labelWeight) els.labelWeight.textContent = t.weight;
  if (els.labelSex) els.labelSex.textContent = t.sex;
  if (els.labelBmi) els.labelBmi.textContent = t.bmi;
  if (els.estNote) els.estNote.textContent = t.estNote;

  if (els.btnSetEstimated) els.btnSetEstimated.textContent = t.setEstimated;
  if (els.estSummary) els.estSummary.textContent = t.estSummaryNone;

  if (els.labelFootLen) els.labelFootLen.textContent = t.footLen;
  if (els.hintFoot) els.hintFoot.textContent = t.footHint;
  if (els.labelShoeFit) els.labelShoeFit.textContent = t.shoeFit;
  if (els.hintShoeFit) els.hintShoeFit.textContent = t.shoeFitHint;
  if (els.shoeNote) els.shoeNote.textContent = t.shoeNote;

  if (els.guideCaption) els.guideCaption.textContent = t.guideCaption;

  if (els.calcBtn) els.calcBtn.textContent = t.calc;
  if (els.resetBtn) els.resetBtn.textContent = t.reset;
  if (els.scrollTableBtn) els.scrollTableBtn.textContent = t.pickFromChart;

  if (els.resultTitle) els.resultTitle.textContent = t.resultTitle;

  if (els.errorText) els.errorText.textContent = t.notFound;
  if (els.errorResetBtn) els.errorResetBtn.textContent = t.reset;
  if (els.errorTableBtn) els.errorTableBtn.textContent = t.pickFromChart;

  if (els.chartTitle) els.chartTitle.textContent = t.chart;
  if (els.chartMeta && !state.productKey) els.chartMeta.textContent = t.chartLead;

  if (els.productBtnText && !state.productKey) els.productBtnText.textContent = t.chooseProduct;

  setSelectLabels();
  ensureInjectedUXControls(true);
}

/* Fit select labels */
function setSelectLabels() {
  const opts =
    state.lang === "jp"
      ? { standard: "標準", snug: "ぴったり", loose: "ゆったり" }
      : { standard: "Standard", snug: "Snug", loose: "Loose" };

  [els.fitPref, els.shoeFit].forEach((sel) => {
    if (!sel) return;
    [...sel.options].forEach((o) => {
      if (opts[o.value]) o.textContent = opts[o.value];
    });
  });

  // width select (injected)
  const widthSel = byId("shoeWidthSel");
  if (widthSel) {
    const mapW =
      state.lang === "jp"
        ? { narrow: t.wNarrow, standard: t.wStandard, wide: t.wWide }
        : { narrow: t.wNarrow, standard: t.wStandard, wide: t.wWide };
    [...widthSel.options].forEach((o) => {
      if (mapW[o.value]) o.textContent = mapW[o.value];
    });
  }

  // priority select (injected)
  const prSel = byId("topsPrioritySel");
  if (prSel) {
    const mapP =
      state.lang === "jp"
        ? { chest: t.prChest, length: t.prLength }
        : { chest: t.prChest, length: t.prLength };
    [...prSel.options].forEach((o) => {
      if (mapP[o.value]) o.textContent = mapP[o.value];
    });
  }
}

function refreshUnits() {
  if (els.unitChest) els.unitChest.textContent = state.unit === "cm" ? "cm" : "in";
  if (els.unitFoot) els.unitFoot.textContent = state.unit === "cm" ? "cm" : "in";
  if (els.unitHeight) els.unitHeight.textContent = "cm";
  if (els.unitWeight) els.unitWeight.textContent = "kg";
}

/* ---------- Product dropdown ---------- */
function openMenu(open) {
  if (!els.productMenu || !els.productBtn) return;
  els.productMenu.hidden = !open;
  els.productBtn.setAttribute("aria-expanded", open ? "true" : "false");
}
function buildProductMenu() {
  if (!els.productMenu) return;
  els.productMenu.innerHTML = "";
  PRODUCTS.forEach((p) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.setAttribute("role", "option");
    btn.dataset.key = p.key;

    const title = state.lang === "jp" ? p.titleJP : p.titleEN;
    const sub = state.lang === "jp" ? p.subJP : p.subEN;

    btn.innerHTML = `<span class="optTitle">${escapeHtml(
      title
    )}</span><span class="optSub">${escapeHtml(sub)}</span>`;

    btn.addEventListener("click", () => {
      openMenu(false);
      selectProduct(p.key);
    });
    els.productMenu.appendChild(btn);
  });
}
function rerenderProductButton() {
  if (!els.productBtnText) return;
  const p = PRODUCTS.find((x) => x.key === state.productKey);
  if (!p) {
    els.productBtnText.textContent = t.chooseProduct;
    return;
  }
  const title = state.lang === "jp" ? p.titleJP : p.titleEN;
  const sub = state.lang === "jp" ? p.subJP : p.subEN;
  els.productBtnText.textContent = `${title} ${sub}`;
}

/* ---------- Injected UX controls (priority + width) ---------- */
function ensureInjectedUXControls(forceTextRefresh = false) {
  // Tops priority selector (inside groupTops)
  if (els.groupTops && !byId("topsPriorityWrap")) {
    const wrap = document.createElement("div");
    wrap.id = "topsPriorityWrap";
    wrap.style.marginTop = "10px";
    wrap.style.paddingTop = "10px";
    wrap.style.borderTop = "1px solid rgba(255,255,255,.10)";

    wrap.innerHTML = `
      <div class="field">
        <label class="label" for="topsPrioritySel">${escapeHtml(t.priority)}</label>
        <select id="topsPrioritySel">
          <option value="chest">${escapeHtml(t.prChest)}</option>
          <option value="length">${escapeHtml(t.prLength)}</option>
        </select>
        <p id="topsPriorityHint" class="hint">${escapeHtml(t.priorityHint)}</p>
      </div>
    `;

    els.groupTops.appendChild(wrap);
    injected.topsPriorityWrap = wrap;

    const sel = byId("topsPrioritySel");
    sel.value = state.topsPriority;
    sel.addEventListener("change", () => {
      state.topsPriority = sel.value;
      clearResult();
    });
  } else if (forceTextRefresh && byId("topsPriorityWrap")) {
    const lbl = byId("topsPriorityWrap").querySelector("label");
    const hint = byId("topsPriorityHint");
    if (lbl) lbl.textContent = t.priority;
    if (hint) hint.textContent = t.priorityHint;
  }

  // Shoes width selector (inside groupShoes)
  if (els.groupShoes && !byId("shoeWidthWrap")) {
    const wrap = document.createElement("div");
    wrap.id = "shoeWidthWrap";
    wrap.style.marginTop = "10px";
    wrap.style.paddingTop = "10px";
    wrap.style.borderTop = "1px solid rgba(255,255,255,.10)";

    wrap.innerHTML = `
      <div class="field">
        <label class="label" for="shoeWidthSel">${escapeHtml(t.shoeWidth)}</label>
        <select id="shoeWidthSel">
          <option value="narrow">${escapeHtml(t.wNarrow)}</option>
          <option value="standard">${escapeHtml(t.wStandard)}</option>
          <option value="wide">${escapeHtml(t.wWide)}</option>
        </select>
        <p id="shoeWidthHint" class="hint">${escapeHtml(t.shoeWidthHint)}</p>
      </div>
    `;

    els.groupShoes.appendChild(wrap);
    injected.shoesWidthWrap = wrap;

    const sel = byId("shoeWidthSel");
    sel.value = state.shoeWidth;
    sel.addEventListener("change", () => {
      state.shoeWidth = sel.value;
      clearResult();
    });
  } else if (forceTextRefresh && byId("shoeWidthWrap")) {
    const lbl = byId("shoeWidthWrap").querySelector("label");
    const hint = byId("shoeWidthHint");
    if (lbl) lbl.textContent = t.shoeWidth;
    if (hint) hint.textContent = t.shoeWidthHint;
  }
}

/* ---------- Product selection ---------- */
async function selectProduct(key, silent = false) {
  const p = PRODUCTS.find((x) => x.key === key);
  if (!p) return;

  state.productKey = p.key;
  state.productType = p.type;

  rerenderProductButton();

  if (els.inputsArea) els.inputsArea.hidden = false;
  if (els.groupTops) els.groupTops.hidden = p.type !== "tops";
  if (els.groupShoes) els.groupShoes.hidden = p.type !== "shoes";

  // guide image
  if (els.guideImg) els.guideImg.src = p.guideImg;

  // reset estimate state
  state.lastEstimatedChestCm = null;
  state.usedEstimateInCalc = false;
  if (els.btnSetEstimated) els.btnSetEstimated.hidden = true;
  if (els.estSummary) els.estSummary.textContent = t.estSummaryNone;

  // make sure new controls exist
  ensureInjectedUXControls();

  // clear result
  clearResult();

  const csvPath = state.unit === "cm" ? p.csv.cm : p.csv.inch;
  try {
    state.table = await loadCSV(csvPath);
    rerenderTable();
    if (els.chartMeta && !silent) {
      const label = state.lang === "jp" ? `${p.titleJP} ${p.subJP}` : `${p.titleEN} ${p.subEN}`;
      els.chartMeta.textContent = `${t.chart}：${label}`;
    }
  } catch (e) {
    state.table = { headers: [], rows: [] };
    rerenderTable();
    if (els.chartMeta && !silent) els.chartMeta.textContent = `CSV load error: ${csvPath}`;
  }
}

/* ---------- Table rendering + highlight ---------- */
function rerenderTable() {
  const { headers, rows } = state.table;
  if (!els.tableHead || !els.tableBody) return;

  if (!headers.length) {
    els.tableHead.innerHTML = "<tr><th>—</th></tr>";
    els.tableBody.innerHTML = "<tr><td>—</td></tr>";
    return;
  }

  // Show translated header labels (JP/EN), but keep raw keys for row values
  const viewHeaders = headers.map((h) => labelForHeader(h));
  els.tableHead.innerHTML = `<tr>${viewHeaders
    .map((h) => `<th>${escapeHtml(h)}</th>`)
    .join("")}</tr>`;

  els.tableBody.innerHTML = rows
    .map((r, idx) => {
      const tds = headers
        .map((h) => `<td>${escapeHtml(r[h] ?? "")}</td>`)
        .join("");
      return `<tr data-idx="${idx}">${tds}</tr>`;
    })
    .join("");
}
function clearHighlight() {
  if (!els.tableBody) return;
  els.tableBody.querySelectorAll("tr").forEach((tr) => tr.classList.remove("isHit"));
}
function highlightRow(rowIndex) {
  if (!els.tableBody) return;
  clearHighlight();
  const tr = els.tableBody.querySelector(`tr[data-idx="${rowIndex}"]`);
  if (!tr) return;
  tr.classList.add("isHit");
  tr.scrollIntoView({ behavior: "smooth", block: "center" });
}

/* ---------- Estimator (tops only) ---------- */
function calcBmi(heightCm, weightKg) {
  if (!heightCm || !weightKg) return null;
  const h = heightCm / 100;
  if (h <= 0) return null;
  return weightKg / (h * h);
}

// intentionally heuristic. stays a "support" feature.
function estimateChestCm(heightCm, weightKg, sex) {
  const bmi = calcBmi(heightCm, weightKg);
  if (!bmi) return null;

  const base = sex === "male" ? heightCm * 0.54 : heightCm * 0.52;
  const adj = (bmi - 22) * 1.2;
  const est = base + adj;
  return clamp(est, 68, 140);
}
function updateEstimatorUI() {
  if (state.productType !== "tops") return;

  const h = parseNumberSmart(els.height?.value);
  const w = parseNumberSmart(els.weight?.value);
  const bmi = calcBmi(h, w);
  if (els.bmi) els.bmi.value = bmi ? round1(bmi) : "";

  const estCm = estimateChestCm(h, w, els.sex?.value);
  if (!estCm) {
    state.lastEstimatedChestCm = null;
    if (els.estSummary) els.estSummary.textContent = t.estSummaryNone;
    if (els.btnSetEstimated && !state.usedEstimateInCalc) els.btnSetEstimated.hidden = true;
    return;
  }
  state.lastEstimatedChestCm = estCm;

  const v = state.unit === "cm" ? Math.round(estCm) : round1(cmToIn(estCm));
  const unitLabel = state.unit === "cm" ? "cm" : "in";
  if (els.estSummary) els.estSummary.textContent = t.estSummary(v, unitLabel);

  // show set button only when nudeChest is empty
  const nude = parseNumberSmart(els.nudeChest?.value);
  if (els.btnSetEstimated) els.btnSetEstimated.hidden = !!nude;
}

/* ---------- Ease / allowance ---------- */
function easeByFit() {
  const mapCm = { snug: 6, standard: 10, loose: 14 };
  const v = mapCm[els.fitPref?.value] ?? 10;
  return state.unit === "cm" ? v : round1(cmToIn(v));
}
function allowanceByFit() {
  const mapCm = { snug: 0.7, standard: 1.0, loose: 1.2 };
  const v = mapCm[els.shoeFit?.value] ?? 1.0;
  return state.unit === "cm" ? v : round1(cmToIn(v));
}
function widthText() {
  if (state.shoeWidth === "narrow") return t.wNarrow;
  if (state.shoeWidth === "wide") return t.wWide;
  return t.wStandard;
}
function priorityText() {
  return state.topsPriority === "length" ? t.prLength : t.prChest;
}

/* ---------- Recommendation (2 proposals) ---------- */
function recommendTopsTwo() {
  const { headers, rows } = state.table;
  if (!headers.length || !rows.length) return { ok: false };

  // columns
  const colSize = findColumn(headers, ["Size", "SIZE", "サイズ", "size"]);
  const colChestFlat = findColumn(headers, [
    "Chest (flat)",
    "Chest flat",
    "Chest(flat)",
    "身幅",
    "身幅(平置き)",
    "Body width",
    "Body width (flat)",
    "1/2 Chest",
    "Half chest"
  ]);
  const colLength = findColumn(headers, ["Length", "Body length", "着丈"]);
  const colSleeve = findColumn(headers, ["Sleeve", "Sleeve length", "袖丈"]);

  if (!colSize || !colChestFlat) return { ok: false };

  // input (measured or estimate)
  let nude = parseNumberSmart(els.nudeChest?.value);
  const ease = easeByFit();
  state.usedEstimateInCalc = false;

  if (!nude) {
    const estCm = state.lastEstimatedChestCm;
    if (isFinite(estCm)) {
      nude = state.unit === "cm" ? estCm : cmToIn(estCm);
      state.usedEstimateInCalc = true;
      if (els.btnSetEstimated) els.btnSetEstimated.hidden = false;
    }
  }
  if (!nude) return { ok: false };

  const target = nude + ease;
  const targetFlat = target / 2;

  // Build candidates that meet chestFlat >= targetFlat
  const cands = [];
  rows.forEach((r, idx) => {
    const chestFlat = parseNumberSmart(r[colChestFlat]);
    if (!isFinite(chestFlat)) return;
    if (chestFlat < targetFlat) return;

    const length = colLength ? parseNumberSmart(r[colLength]) : null;
    const sleeve = colSleeve ? parseNumberSmart(r[colSleeve]) : null;

    // scoring
    const chestDiff = chestFlat - targetFlat; // >=0
    // if length priority: prefer slightly longer within chest tolerance
    // without user length input, we cap chestDiff tolerance to avoid always picking huge sizes
    const chestTol = state.unit === "cm" ? 2.0 : 0.8; // small tolerance window
    const withinTol = chestDiff <= chestTol;

    // lengthScore: higher length is "better", convert to a penalty by negative rank
    // We'll compute relative by using the value itself (bigger is better), but only if withinTol.
    const lengthBonus = isFinite(length) ? length : 0;

    let score;
    if (state.topsPriority === "length" && isFinite(length)) {
      // primary: keep chest close (still matters), then reward length inside tolerance
      score = chestDiff * 0.9 + (withinTol ? -lengthBonus * 0.02 : chestDiff * 2.0);
    } else {
      // chest priority (default)
      score = chestDiff * 1.0 + (isFinite(length) ? 0.05 * Math.max(0, (targetFlat - chestFlat)) : 0);
    }

    cands.push({
      idx,
      size: r[colSize] ?? "—",
      chestFlat,
      length,
      sleeve,
      chestDiff,
      score
    });
  });

  if (!cands.length) return { ok: false, notFound: true };

  // Sort by score then by chestDiff then by length (stable)
  cands.sort((a, b) => a.score - b.score || a.chestDiff - b.chestDiff || (b.length ?? 0) - (a.length ?? 0));

  const primary = cands[0];

  // Runner-up: choose next distinct size (prefer next larger by row order or best score)
  let runner = null;

  // try next in score list with different size
  for (let i = 1; i < cands.length; i++) {
    if (String(cands[i].size) !== String(primary.size)) {
      runner = cands[i];
      break;
    }
  }

  // if runner exists, craft note
  let runnerNote = "";
  if (runner) {
    if (state.topsPriority === "chest") {
      // show a "length alternative" if runner is larger
      runnerNote = t.runnerNoteUp;
    } else {
      runnerNote = t.runnerNoteChest;
    }
  }

  const unitLabel = state.unit === "cm" ? "cm" : "in";
  const basis = t.basisTops(formatNum(target), formatNum(ease), unitLabel, priorityText());

  return {
    ok: true,
    primary,
    runner,
    runnerNote,
    basis
  };
}

function recommendShoesTwo() {
  const { headers, rows } = state.table;
  if (!headers.length || !rows.length) return { ok: false };

  // columns
  const colUS = findColumn(headers, ["US", "us", "Size", "size"]);
  const colFoot = findColumn(headers, ["Foot length", "Foot Length", "Footlength", "足長", "Foot"]);
  if (!colUS || !colFoot) return { ok: false };

  const foot = parseNumberSmart(els.footLen?.value);
  if (!foot) return { ok: false };

  const add = allowanceByFit();
  const unitLabel = state.unit === "cm" ? "cm" : "in";

  // base target
  const target = foot + add;

  // pick minimal row where footLen >= target
  let bestIdx = -1;
  let bestVal = Infinity;

  rows.forEach((r, idx) => {
    const v = parseNumberSmart(r[colFoot]);
    if (!isFinite(v)) return;
    if (v >= target && v < bestVal) {
      bestVal = v;
      bestIdx = idx;
    }
  });

  if (bestIdx < 0) return { ok: false, notFound: true };

  const primary = {
    idx: bestIdx,
    size: rows[bestIdx][colUS] ?? "—",
    footValue: bestVal
  };

  // Runner-up logic with width:
  // - wide: propose next bigger if possible
  // - narrow: propose one smaller if still >= target
  // - standard: propose the next bigger as "runner-up for room" (optional)
  let runner = null;
  let runnerNote = "";

  if (state.shoeWidth === "wide") {
    const next = findNextBiggerByFoot(rows, colFoot, bestIdx);
    if (next) {
      runner = { idx: next.idx, size: rows[next.idx][colUS] ?? "—", footValue: next.v };
      runnerNote = t.runnerNoteWidth;
    }
  } else if (state.shoeWidth === "narrow") {
    const prev = findPrevStillFit(rows, colFoot, bestIdx, target);
    if (prev) {
      runner = { idx: prev.idx, size: rows[prev.idx][colUS] ?? "—", footValue: prev.v };
      runnerNote = t.runnerNoteChest; // "if chest priority" doesn't fit shoes; use a neutral fallback below
      runnerNote = state.lang === "jp" ? "きれいに履きたいなら" : "If you prefer a snug feel";
    } else {
      // as runner, show one bigger for safety
      const next = findNextBiggerByFoot(rows, colFoot, bestIdx);
      if (next) {
        runner = { idx: next.idx, size: rows[next.idx][colUS] ?? "—", footValue: next.v };
        runnerNote = state.lang === "jp" ? "迷ったら大きめ寄り" : "If unsure, size up";
      }
    }
  } else {
    // standard: runner-up = next bigger for safety (if available)
    const next = findNextBiggerByFoot(rows, colFoot, bestIdx);
    if (next) {
      runner = { idx: next.idx, size: rows[next.idx][colUS] ?? "—", footValue: next.v };
      runnerNote = state.lang === "jp" ? "少し余裕を足すなら" : "If you want a bit more room";
    }
  }

  const basis = t.basisShoes(formatNum(target), formatNum(add), unitLabel, widthText());

  return { ok: true, primary, runner, runnerNote, basis };
}

function findNextBiggerByFoot(rows, colFoot, fromIdx) {
  let best = null;
  const base = parseNumberSmart(rows[fromIdx]?.[colFoot]);
  if (!isFinite(base)) return null;
  for (let i = 0; i < rows.length; i++) {
    const v = parseNumberSmart(rows[i]?.[colFoot]);
    if (!isFinite(v)) continue;
    if (v > base) {
      if (!best || v < best.v) best = { idx: i, v };
    }
  }
  return best;
}

function findPrevStillFit(rows, colFoot, fromIdx, target) {
  let best = null;
  const base = parseNumberSmart(rows[fromIdx]?.[colFoot]);
  if (!isFinite(base)) return null;
  for (let i = 0; i < rows.length; i++) {
    const v = parseNumberSmart(rows[i]?.[colFoot]);
    if (!isFinite(v)) continue;
    if (v < base && v >= target) {
      if (!best || v > best.v) best = { idx: i, v };
    }
  }
  return best;
}

function formatNum(n) {
  if (!isFinite(n)) return "—";
  return state.unit === "cm" ? `${Math.round(n)}` : `${round1(n)}`;
}

/* ---------- Self-check rendering ---------- */
function renderSelfCheck(type) {
  if (!els.selfCheckWrap) return;
  const isShoes = type === "shoes";

  const items = isShoes
    ? [
        [t.selfS1, [t.selfS1a, t.selfS1b]],
        [t.selfS2, [t.selfS2a]],
        [t.selfS3, [t.selfS3a]]
      ]
    : [
        [t.selfT1, [t.selfT1a, t.selfT1b, t.selfT1c]],
        [t.selfT2, [t.selfT2a]],
        [t.selfT3, [t.selfT3a]]
      ];

  const html = `
    <details>
      <summary>${escapeHtml(t.selfCheckTitle)}</summary>
      <div class="selfCheckBody">
        <ol>
          ${items
            .map(
              ([q, arr]) => `
            <li>
              <strong>${escapeHtml(q)}</strong><br>
              ${arr.map((x) => `• ${escapeHtml(x)}`).join("<br>")}
            </li>
          `
            )
            .join("")}
        </ol>
      </div>
    </details>
  `;
  els.selfCheckWrap.innerHTML = html;
  els.selfCheckWrap.hidden = false;
}

/* ---------- Result / Error UI ---------- */
function clearResult() {
  if (els.resultArea) els.resultArea.hidden = true;
  if (els.errorBox) els.errorBox.hidden = true;
  if (els.resultValue) els.resultValue.textContent = "—";
  if (els.resultDetail) els.resultDetail.textContent = "";
  if (els.selfCheckWrap) {
    els.selfCheckWrap.hidden = true;
    els.selfCheckWrap.innerHTML = "";
  }
  clearHighlight();
}

function showError() {
  if (els.resultArea) els.resultArea.hidden = false;
  if (els.errorBox) els.errorBox.hidden = false;
  if (els.resultValue) els.resultValue.textContent = "—";
  if (els.resultDetail) els.resultDetail.textContent = "";
  if (els.selfCheckWrap) {
    els.selfCheckWrap.hidden = true;
    els.selfCheckWrap.innerHTML = "";
  }
}

function showResultTwo(primary, runner, runnerNote, basis) {
  if (!els.resultArea) return;

  if (els.resultArea) els.resultArea.hidden = false;
  if (els.errorBox) els.errorBox.hidden = true;

  // Result headline: show 2 lines
  const primaryLabel = `${t.recPrimary}：${primary.size}`;
  const runnerLabel = runner ? `${t.recRunner}：${runner.size}${runnerNote ? `（${runnerNote}）` : ""}` : "";

  if (els.resultValue) {
    els.resultValue.textContent = runner ? `${primary.size} / ${runner.size}` : `${primary.size}`;
  }

  if (els.resultDetail) {
    const lines = [];
    lines.push(primaryLabel);
    if (runner) lines.push(runnerLabel);
    lines.push(basis);
    els.resultDetail.innerHTML = lines.map((s) => escapeHtml(s)).join("<br>");
  }

  renderSelfCheck(state.productType);

  // highlight & scroll to primary
  highlightRow(primary.idx);
}

/* ---------- Logging (no raw body data required) ---------- */
function logSuggestion(payload) {
  try {
    const key = "tcda_autosize_history";
    const cur = JSON.parse(localStorage.getItem(key) || "[]");
    cur.unshift(payload);
    localStorage.setItem(key, JSON.stringify(cur.slice(0, 50))); // keep last 50
  } catch (_) {
    // ignore
  }
}

function makeInputMeta() {
  const product = state.productKey || "—";
  const type = state.productType || "—";
  const inputMethod =
    state.productType === "tops"
      ? (parseNumberSmart(els.nudeChest?.value) ? "measured" : (state.lastEstimatedChestCm ? "estimated" : "unknown"))
      : (parseNumberSmart(els.footLen?.value) ? "measured" : "unknown");

  const fit =
    state.productType === "tops"
      ? (els.fitPref?.value || "standard")
      : (els.shoeFit?.value || "standard");

  const meta = {
    ts: new Date().toISOString(),
    lang: state.lang,
    unit: state.unit,
    productType: type,
    productKey: product,
    inputMethod,
    fit,
    priority: type === "tops" ? state.topsPriority : null,
    width: type === "shoes" ? state.shoeWidth : null
  };
  return meta;
}

/* ---------- Run calc ---------- */
async function runCalc() {
  clearHighlight();
  if (els.btnSetEstimated) els.btnSetEstimated.hidden = true;

  if (!state.productKey) {
    showError();
    return;
  }

  // Update estimator if tops
  if (state.productType === "tops") updateEstimatorUI();

  let result;
  if (state.productType === "tops") {
    result = recommendTopsTwo();
  } else if (state.productType === "shoes") {
    result = recommendShoesTwo();
  } else {
    showError();
    return;
  }

  if (!result || !result.ok) {
    showError();
    return;
  }

  showResultTwo(result.primary, result.runner, result.runnerNote, result.basis);

  // log (no raw measurement)
  const meta = makeInputMeta();
  logSuggestion({
    ...meta,
    primary: result.primary?.size ?? null,
    runner: result.runner?.size ?? null
  });
}

/* ---------- Bind events ---------- */
function bind() {
  // language tabs
  if (els.langJP) els.langJP.addEventListener("click", () => setLang("jp"));
  if (els.langEN) els.langEN.addEventListener("click", () => setLang("en"));

  // dropdown
  if (els.productBtn) {
    els.productBtn.addEventListener("click", () => {
      const open = !!els.productMenu?.hidden;
      if (open) buildProductMenu();
      openMenu(open);
    });
  }

  document.addEventListener("click", (e) => {
    if (!els.productBtn || !els.productMenu) return;
    if (!els.productBtn.contains(e.target) && !els.productMenu.contains(e.target)) openMenu(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") openMenu(false);
  });

  // estimator updates
  ["input", "change"].forEach((evt) => {
    if (els.height) els.height.addEventListener(evt, updateEstimatorUI);
    if (els.weight) els.weight.addEventListener(evt, updateEstimatorUI);
    if (els.sex) els.sex.addEventListener(evt, updateEstimatorUI);
    if (els.nudeChest) els.nudeChest.addEventListener(evt, updateEstimatorUI);
  });

  // set estimated (manual apply)
  if (els.btnSetEstimated) {
    els.btnSetEstimated.addEventListener("click", () => {
      const estCm = state.lastEstimatedChestCm;
      if (!isFinite(estCm) || !els.nudeChest) return;

      const v = state.unit === "cm" ? Math.round(estCm) : round1(cmToIn(estCm));
      els.nudeChest.value = String(v);

      els.btnSetEstimated.hidden = true;
      runCalc();
    });
  }

  // actions
  if (els.calcBtn) els.calcBtn.addEventListener("click", runCalc);

  if (els.resetBtn) {
    els.resetBtn.addEventListener("click", () => {
      if (els.nudeChest) els.nudeChest.value = "";
      if (els.footLen) els.footLen.value = "";
      if (els.height) els.height.value = "";
      if (els.weight) els.weight.value = "";
      if (els.bmi) els.bmi.value = "";

      state.lastEstimatedChestCm = null;
      state.usedEstimateInCalc = false;

      // reset new controls to defaults
      state.topsPriority = "chest";
      state.shoeWidth = "standard";
      const prSel = byId("topsPrioritySel");
      const wSel = byId("shoeWidthSel");
      if (prSel) prSel.value = state.topsPriority;
      if (wSel) wSel.value = state.shoeWidth;

      if (els.estSummary) els.estSummary.textContent = t.estSummaryNone;
      if (els.btnSetEstimated) els.btnSetEstimated.hidden = true;

      clearResult();
    });
  }

  if (els.scrollTableBtn) {
    els.scrollTableBtn.addEventListener("click", () => {
      if (els.sizeTable) els.sizeTable.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  if (els.errorResetBtn && els.resetBtn) els.errorResetBtn.addEventListener("click", () => els.resetBtn.click());
  if (els.errorTableBtn && els.scrollTableBtn) els.errorTableBtn.addEventListener("click", () => els.scrollTableBtn.click());
}

/* ---------- Init ---------- */
function init() {
  // safe init
  setLang("jp");
  applyI18n();
  refreshUnits();
  buildProductMenu();
  openMenu(false);
  clearResult();
  bind();
}

init();
