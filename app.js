/* ==========
   TCDA Auto Size (Fresh rewrite)
   JP=cm / EN=inch (auto)
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

    estTitle: "ヌード寸法が分からない場合（推定入力）",
    height: "身長",
    weight: "体重",
    sex: "性別",
    bmi: "BMI（自動計算）",
    estNote: "推定値は実測ではありません。自動で上書きせず、必要な場合のみ「推定値をセット」で反映できます。",
    estSummary: (v, unit) => `推定胸囲：${v}${unit}`,
    estSummaryNone: "推定胸囲：—",
    setEstimated: "推定値をセット",

    footLen: "足長（実測）",
    footHint: "左右を測って長い方を採用。",
    shoeFit: "好み",
    shoeFitHint: "捨て寸（余裕）が変わります。",
    shoeNote: "アウトソール長は外寸です。足長と同一視しないでください（補助指標）。",

    guideCaption: "※ 画像は商品に応じて切り替わります。",

    resultTitle: "おすすめ",
    basisTops: (target, ease, unit) => `根拠：ヌード胸囲 + ゆとり（${ease}${unit}）→ 目標仕上がり胸囲 ${target}${unit} を満たす最小サイズ`,
    basisShoes: (target, add, unit) => `根拠：足長 + 捨て寸（${add}${unit}）→ 目標 ${target}${unit} を満たす最小サイズ`,
    notFound: "該当するサイズが見当たりませんでした。",
    selfCheckTitle: "サイズが合わなかったと感じたら（2〜3問チェック）",

    selfT1: "きついのはどこ？",
    selfT1a: "胸・肩まわり → 次は 1サイズ上（または「ゆったり」）",
    selfT1b: "丈だけ短い/長い → サイズ表の「着丈」を優先して近いサイズへ",
    selfT1c: "袖だけ違和感 → 体感は肩線で変わるので「身幅→着丈→袖丈」の順で選ぶ",
    selfT2: "入力は実測？推定？",
    selfT2a: "推定入力だった → 次回はヌード寸法を実測して再計算（推定は誤差が出ます）",
    selfT3: "迷う場合の最短ルート",
    selfT3a: "手持ちの“いちばん好きな服”を平置きで測り、サイズ表の近い数値を選ぶ",

    selfS1: "どこがきつい？",
    selfS1a: "つま先が当たる → 足長が足りない可能性（次は大きめ寄り）",
    selfS1b: "幅/甲がきつい → 幅広/甲高は体感が変わる（迷ったら大きめ寄り）",
    selfS2: "入力は足長（実測）？",
    selfS2a: "推定や感覚だった → 左右の足長を測り、長い方で選ぶ",
    selfS3: "アウトソールの扱い",
    selfS3a: "アウトソール長は外寸なので補助指標。足長と同一視しない"
  },

  en: {
    backToShop: "Back to shop",
    title: "Auto Size Guide",
    lead: "Choose a product and enter only the required fields. JP shows cm, EN shows inches.",
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

    estTitle: "If you don’t know your nude measurement (Estimator)",
    height: "Height",
    weight: "Weight",
    sex: "Sex",
    bmi: "BMI (auto)",
    estNote: "This is not an actual measurement. It will NOT overwrite automatically. Tap “Set estimated value” only if needed.",
    estSummary: (v, unit) => `Estimated chest: ${v}${unit}`,
    estSummaryNone: "Estimated chest: —",
    setEstimated: "Set estimated value",

    footLen: "Foot length (measured)",
    footHint: "Measure both feet and use the longer one.",
    shoeFit: "Preference",
    shoeFitHint: "Toe allowance changes by preference.",
    shoeNote: "Outsole length is an external measurement. Treat it as a reference (do not equate it with foot length).",

    guideCaption: "*Image changes by product.",

    resultTitle: "Recommended",
    basisTops: (target, ease, unit) => `Basis: nude chest + ease (${ease}${unit}) → target finished chest ${target}${unit}, pick the smallest size that meets it`,
    basisShoes: (target, add, unit) => `Basis: foot length + allowance (${add}${unit}) → target ${target}${unit}, pick the smallest size that meets it`,
    notFound: "No matching size was found.",
    selfCheckTitle: "If the size didn’t feel right (2–3 quick checks)",

    selfT1: "Where did it feel off?",
    selfT1a: "Tight in chest/shoulders → choose one size up (or select “Loose”)",
    selfT1b: "Only length feels off → prioritize “Length” in the size chart",
    selfT1c: "Only sleeves feel off → shoulder seam changes the feel; prioritize Chest (flat) → Length → Sleeve",
    selfT2: "Measured value or estimate?",
    selfT2a: "If estimated → re-check with actual nude measurements (estimates can vary)",
    selfT3: "Fastest way to avoid mistakes",
    selfT3a: "Measure your best-fitting item flat and pick the closest numbers in the chart",

    selfS1: "What feels tight?",
    selfS1a: "Toes hit the front → foot length may be too short (go slightly bigger)",
    selfS1b: "Width/instep feels tight → wide/high instep can change fit (if unsure, go bigger)",
    selfS2: "Did you measure foot length?",
    selfS2a: "If not → measure both feet and use the longer one",
    selfS3: "About outsole length",
    selfS3a: "Outsole length is external; treat it as a reference (not the same as foot length)"
  }
};

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
    csv: { cm: "data/womens_crew_cm.csv", inch: "data/womens_crew_inch.csv" }
  },
  {
    key: "unisex_hoodie",
    type: "tops",
    titleJP: "Unisex",
    subJP: "Hoodie",
    titleEN: "Unisex",
    subEN: "Hoodie",
    guideImg: "assets/guide_hoodie.jpg",
    csv: { cm: "data/unisex_hoodie_cm.csv", inch: "data/unisex_hoodie_inch.csv" }
  },
  {
    key: "unisex_zip_hoodie",
    type: "tops",
    titleJP: "Unisex ZIP",
    subJP: "Hoodie",
    titleEN: "Unisex ZIP",
    subEN: "Hoodie",
    guideImg: "assets/guide_zip_hoodie.jpg",
    csv: { cm: "data/unisex_zip_hoodie_cm.csv", inch: "data/unisex_zip_hoodie_inch.csv" }
  },
  {
    key: "slipon_womens",
    type: "shoes",
    titleJP: "Women's Slip-On",
    subJP: "Canvas Shoes",
    titleEN: "Women's Slip-On",
    subEN: "Canvas Shoes",
    guideImg: "assets/guide_slipon.jpg",
    csv: { cm: "data/slipon_womens_cm.csv", inch: "data/slipon_womens_inch.csv" }
  },
  {
    key: "slipon_mens",
    type: "shoes",
    titleJP: "Men's Slip-On",
    subJP: "Canvas Shoes",
    titleEN: "Men's Slip-On",
    subEN: "Canvas Shoes",
    guideImg: "assets/guide_slipon.jpg",
    csv: { cm: "data/slipon_mens_cm.csv", inch: "data/slipon_mens_inch.csv" }
  }
];

const els = {
  backToShop: document.getElementById("backToShop"),
  langJP: document.getElementById("langJP"),
  langEN: document.getElementById("langEN"),

  pageTitle: document.getElementById("pageTitle"),
  pageLead: document.getElementById("pageLead"),
  productLabel: document.getElementById("productLabel"),
  productBtn: document.getElementById("productBtn"),
  productBtnText: document.getElementById("productBtnText"),
  productMenu: document.getElementById("productMenu"),

  inputsArea: document.getElementById("inputsArea"),
  groupTops: document.getElementById("groupTops"),
  groupShoes: document.getElementById("groupShoes"),

  topsTitle: document.getElementById("topsTitle"),
  shoesTitle: document.getElementById("shoesTitle"),

  nudeChest: document.getElementById("nudeChest"),
  unitChest: document.getElementById("unitChest"),
  labelNudeChest: document.getElementById("labelNudeChest"),
  hintNudeChest: document.getElementById("hintNudeChest"),

  fitPref: document.getElementById("fitPref"),
  labelFit: document.getElementById("labelFit"),
  hintFit: document.getElementById("hintFit"),

  height: document.getElementById("height"),
  weight: document.getElementById("weight"),
  sex: document.getElementById("sex"),
  bmi: document.getElementById("bmi"),
  unitHeight: document.getElementById("unitHeight"),
  unitWeight: document.getElementById("unitWeight"),
  labelHeight: document.getElementById("labelHeight"),
  labelWeight: document.getElementById("labelWeight"),
  labelSex: document.getElementById("labelSex"),
  labelBmi: document.getElementById("labelBmi"),
  estTitle: document.getElementById("estTitle"),
  estSummary: document.getElementById("estSummary"),
  estNote: document.getElementById("estNote"),
  btnSetEstimated: document.getElementById("btnSetEstimated"),

  footLen: document.getElementById("footLen"),
  unitFoot: document.getElementById("unitFoot"),
  labelFootLen: document.getElementById("labelFootLen"),
  hintFoot: document.getElementById("hintFoot"),
  shoeFit: document.getElementById("shoeFit"),
  labelShoeFit: document.getElementById("labelShoeFit"),
  hintShoeFit: document.getElementById("hintShoeFit"),
  shoeNote: document.getElementById("shoeNote"),

  guideImg: document.getElementById("guideImg"),
  guideCaption: document.getElementById("guideCaption"),

  calcBtn: document.getElementById("calcBtn"),
  resetBtn: document.getElementById("resetBtn"),
  scrollTableBtn: document.getElementById("scrollTableBtn"),

  resultArea: document.getElementById("resultArea"),
  resultTitle: document.getElementById("resultTitle"),
  resultValue: document.getElementById("resultValue"),
  resultDetail: document.getElementById("resultDetail"),

  selfCheckWrap: document.getElementById("selfCheckWrap"),

  errorBox: document.getElementById("errorBox"),
  errorText: document.getElementById("errorText"),
  errorResetBtn: document.getElementById("errorResetBtn"),
  errorTableBtn: document.getElementById("errorTableBtn"),

  chartTitle: document.getElementById("chartTitle"),
  chartMeta: document.getElementById("chartMeta"),
  tableHead: document.getElementById("tableHead"),
  tableBody: document.getElementById("tableBody"),
  sizeTable: document.getElementById("sizeTable")
};

const state = {
  lang: "jp",           // jp / en
  unit: "cm",           // cm / inch (auto from lang)
  productKey: null,     // selected product key
  productType: null,    // tops / shoes
  table: { headers: [], rows: [] }, // loaded CSV
  lastEstimatedChestCm: null,       // for set button
  usedEstimateInCalc: false
};

function tget() { return i18n[state.lang]; }
let t = tget();

/* ---------- Helpers ---------- */
function clamp(n, a, b){ return Math.max(a, Math.min(b, n)); }
function round1(n){ return Math.round(n * 10) / 10; }
function cmToIn(cm){ return cm / 2.54; }
function inToCm(inch){ return inch * 2.54; }

function parseNumberSmart(s){
  if (s == null) return null;
  const raw = String(s).trim();
  if (!raw) return null;

  // handle "7 1/2"
  const mixed = raw.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (mixed){
    const a = parseFloat(mixed[1]);
    const b = parseFloat(mixed[2]);
    const c = parseFloat(mixed[3]);
    if (isFinite(a)&&isFinite(b)&&isFinite(c)&&c!==0) return a + (b/c);
  }

  // handle "1/2"
  const frac = raw.match(/^(\d+)\/(\d+)$/);
  if (frac){
    const b = parseFloat(frac[1]);
    const c = parseFloat(frac[2]);
    if (isFinite(b)&&isFinite(c)&&c!==0) return b / c;
  }

  // normal number (allow commas)
  const v = parseFloat(raw.replace(/,/g,""));
  if (!isFinite(v)) return null;
  return v;
}

function csvSplitLine(line){
  // simple CSV split (supports quoted commas)
  const out = [];
  let cur = "";
  let q = false;
  for (let i=0;i<line.length;i++){
    const ch = line[i];
    if (ch === '"'){ q = !q; continue; }
    if (ch === "," && !q){ out.push(cur); cur=""; continue; }
    cur += ch;
  }
  out.push(cur);
  return out.map(s => s.trim());
}

async function loadCSV(path){
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`CSV load failed: ${path}`);
  const text = await res.text();
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (lines.length < 2) return { headers: [], rows: [] };

  const headers = csvSplitLine(lines[0]);
  const rows = lines.slice(1).map(l => {
    const cols = csvSplitLine(l);
    const row = {};
    headers.forEach((h, idx) => row[h] = cols[idx] ?? "");
    return row;
  });

  return { headers, rows };
}

/* ---------- UI: language + units ---------- */
function setLang(lang){
  state.lang = lang;
  state.unit = (lang === "jp") ? "cm" : "inch";
  t = tget();

  els.langJP.classList.toggle("isActive", lang==="jp");
  els.langEN.classList.toggle("isActive", lang==="en");
  els.langJP.setAttribute("aria-selected", lang==="jp" ? "true":"false");
  els.langEN.setAttribute("aria-selected", lang==="en" ? "true":"false");

  applyI18n();
  refreshUnits();
  rerenderProductButton();
  rerenderTable();   // keeps same product but flips csv on next load; user must reselect? we auto reload if selected
  if (state.productKey) selectProduct(state.productKey, true);
}

function applyI18n(){
  els.backToShop.textContent = t.backToShop;
  els.pageTitle.textContent = t.title;
  els.pageLead.textContent = t.lead;
  els.productLabel.textContent = t.product;

  els.topsTitle.textContent = t.topsTitle;
  els.shoesTitle.textContent = t.shoesTitle;

  els.labelNudeChest.textContent = t.nudeChest;
  els.hintNudeChest.textContent = t.nudeChestHint;

  els.labelFit.textContent = t.fit;
  els.hintFit.textContent = t.fitHint;

  els.estTitle.textContent = t.estTitle;
  els.labelHeight.textContent = t.height;
  els.labelWeight.textContent = t.weight;
  els.labelSex.textContent = t.sex;
  els.labelBmi.textContent = t.bmi;
  els.estNote.textContent = t.estNote;

  // Fit select labels (JP/EN)
  setSelectLabels();

  els.labelFootLen.textContent = t.footLen;
  els.hintFoot.textContent = t.footHint;
  els.labelShoeFit.textContent = t.shoeFit;
  els.hintShoeFit.textContent = t.shoeFitHint;
  els.shoeNote.textContent = t.shoeNote;

  els.guideCaption.textContent = t.guideCaption;

  els.calcBtn.textContent = t.calc;
  els.resetBtn.textContent = t.reset;
  els.scrollTableBtn.textContent = t.pickFromChart;

  els.resultTitle.textContent = t.resultTitle;

  els.errorText.textContent = t.notFound;
  els.errorResetBtn.textContent = t.reset;
  els.errorTableBtn.textContent = t.pickFromChart;

  els.chartTitle.textContent = t.chart;
  els.chartMeta.textContent = t.chartLead;

  if (!state.productKey){
    els.productBtnText.textContent = t.chooseProduct;
  }

  // Set Estimated button label (even if hidden)
  els.btnSetEstimated.textContent = t.setEstimated;

  // Self-check title updates on next render
}

function setSelectLabels(){
  const opts = {
    jp: { standard:"標準", snug:"ぴったり", loose:"ゆったり" },
    en: { standard:"Standard", snug:"Snug", loose:"Loose" }
  }[state.lang];

  for (const sel of [els.fitPref, els.shoeFit]){
    [...sel.options].forEach(o => {
      o.textContent = opts[o.value] ?? o.textContent;
    });
  }
}

function refreshUnits(){
  els.unitChest.textContent = state.unit === "cm" ? "cm" : "in";
  els.unitFoot.textContent = state.unit === "cm" ? "cm" : "in";
  els.unitHeight.textContent = "cm";
  els.unitWeight.textContent = "kg";
}

/* ---------- Product dropdown ---------- */
function openMenu(open){
  els.productMenu.hidden = !open;
  els.productBtn.setAttribute("aria-expanded", open ? "true":"false");
}

function buildProductMenu(){
  els.productMenu.innerHTML = "";
  PRODUCTS.forEach(p => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.setAttribute("role", "option");
    btn.dataset.key = p.key;

    const title = (state.lang==="jp") ? p.titleJP : p.titleEN;
    const sub   = (state.lang==="jp") ? p.subJP : p.subEN;

    btn.innerHTML = `<span class="optTitle">${escapeHtml(title)}</span><span class="optSub">${escapeHtml(sub)}</span>`;
    btn.addEventListener("click", () => {
      openMenu(false);
      selectProduct(p.key);
    });

    els.productMenu.appendChild(btn);
  });
}

function rerenderProductButton(){
  const p = PRODUCTS.find(x => x.key === state.productKey);
  if (!p){
    els.productBtnText.textContent = t.chooseProduct;
    return;
  }
  const title = (state.lang==="jp") ? p.titleJP : p.titleEN;
  const sub   = (state.lang==="jp") ? p.subJP : p.subEN;
  els.productBtnText.textContent = `${title} ${sub}`;
}

function escapeHtml(s){
  return String(s)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

/* ---------- Product selection ---------- */
async function selectProduct(key, silent=false){
  const p = PRODUCTS.find(x => x.key === key);
  if (!p) return;

  state.productKey = p.key;
  state.productType = p.type;

  rerenderProductButton();

  // show inputs area
  els.inputsArea.hidden = false;
  els.groupTops.hidden = (p.type !== "tops");
  els.groupShoes.hidden = (p.type !== "shoes");

  // guide image
  els.guideImg.src = p.guideImg;

  // reset estimate state
  state.lastEstimatedChestCm = null;
  state.usedEstimateInCalc = false;
  els.btnSetEstimated.hidden = true;
  els.estSummary.textContent = t.estSummaryNone;

  // clear result UI
  clearResult();

  // load CSV for current lang/unit
  const csvPath = (state.unit === "cm") ? p.csv.cm : p.csv.inch;
  try{
    state.table = await loadCSV(csvPath);
    rerenderTable();
    if (!silent) els.chartMeta.textContent = `${t.chart}：${(state.lang==="jp") ? p.titleJP+" "+p.subJP : p.titleEN+" "+p.subEN}`;
  }catch(e){
    // if csv fails, show empty table but keep UI
    state.table = { headers: [], rows: [] };
    rerenderTable();
    if (!silent) els.chartMeta.textContent = `CSV load error: ${csvPath}`;
  }
}

/* ---------- Table rendering + highlight ---------- */
function rerenderTable(){
  const { headers, rows } = state.table;

  // head
  if (!headers.length){
    els.tableHead.innerHTML = "<tr><th>—</th></tr>";
    els.tableBody.innerHTML = "<tr><td>—</td></tr>";
    return;
  }

  els.tableHead.innerHTML = `<tr>${headers.map(h => `<th>${escapeHtml(h)}</th>`).join("")}</tr>`;

  els.tableBody.innerHTML = rows.map((r, idx) => {
    const tds = headers.map(h => `<td>${escapeHtml(r[h] ?? "")}</td>`).join("");
    return `<tr data-idx="${idx}">${tds}</tr>`;
  }).join("");
}

function clearHighlight(){
  els.tableBody.querySelectorAll("tr").forEach(tr => tr.classList.remove("isHit"));
}

function highlightRow(rowIndex){
  clearHighlight();
  const tr = els.tableBody.querySelector(`tr[data-idx="${rowIndex}"]`);
  if (!tr) return;
  tr.classList.add("isHit");
  tr.scrollIntoView({ behavior:"smooth", block:"center" });
}

/* ---------- Estimator (tops only) ---------- */
function calcBmi(heightCm, weightKg){
  if (!heightCm || !weightKg) return null;
  const h = heightCm / 100;
  if (h <= 0) return null;
  return weightKg / (h*h);
}

// deliberately heuristic (support feature)
function estimateChestCm(heightCm, weightKg, sex){
  const bmi = calcBmi(heightCm, weightKg);
  if (!bmi) return null;

  // baseline by sex + height
  const base = (sex === "male") ? (heightCm * 0.54) : (heightCm * 0.52);
  // bmi adjustment around 22
  const adj = (bmi - 22) * 1.2;
  const est = base + adj;

  return clamp(est, 68, 140);
}

function updateEstimatorUI(){
  if (state.productType !== "tops") return;

  const h = parseNumberSmart(els.height.value);
  const w = parseNumberSmart(els.weight.value);
  const bmi = calcBmi(h, w);

  els.bmi.value = bmi ? round1(bmi) : "";

  const estCm = estimateChestCm(h, w, els.sex.value);
  if (!estCm){
    state.lastEstimatedChestCm = null;
    els.estSummary.textContent = t.estSummaryNone;
    if (!state.usedEstimateInCalc) els.btnSetEstimated.hidden = true;
    return;
  }

  state.lastEstimatedChestCm = estCm;

  // display in current unit
  const v = (state.unit === "cm") ? Math.round(estCm) : round1(cmToIn(estCm));
  const unitLabel = (state.unit === "cm") ? "cm" : "in";
  els.estSummary.textContent = t.estSummary(v, unitLabel);

  // show set button only if last calc used estimate OR nudeChest is empty (user likely needs it)
  const nude = parseNumberSmart(els.nudeChest.value);
  els.btnSetEstimated.hidden = !!nude; // hide if manual input exists
}

/* ---------- Recommendation logic ---------- */
function easeByFit(){
  // industry-ish ease guidelines (simple)
  // snug: smaller ease / standard: medium / loose: larger
  const mapCm = { snug: 6, standard: 10, loose: 14 };
  const v = mapCm[els.fitPref.value] ?? 10;
  return (state.unit === "cm") ? v : round1(cmToIn(v));
}

function allowanceByFit(){
  // toe allowance 7-12mm -> in inches ~0.28-0.47
  const mapCm = { snug: 0.7, standard: 1.0, loose: 1.2 };
  const v = mapCm[els.shoeFit.value] ?? 1.0;
  return (state.unit === "cm") ? v : round1(cmToIn(v));
}

function findNumericColumn(headers, candidates){
  const lower = headers.map(h => h.toLowerCase());
  for (const cand of candidates){
    const idx = lower.findIndex(h => h.replaceAll(" ","") === cand.replaceAll(" ",""));
    if (idx >= 0) return headers[idx];
  }
  // fallback: contains match
  for (const cand of candidates){
    const idx = lower.findIndex(h => h.includes(cand));
    if (idx >= 0) return headers[idx];
  }
  return null;
}

function recommendTops(){
  const { headers, rows } = state.table;
  if (!headers.length || !rows.length) return { ok:false };

  const colSize = findNumericColumn(headers, ["size"]);
  const colChestFlat = findNumericColumn(headers, ["chest(flat)", "chestflat", "chest (flat)", "chest"]);
  // some of your csv might use: "Chest (flat)" / "Chest (flat)" etc.

  if (!colSize || !colChestFlat) return { ok:false };

  let nude = parseNumberSmart(els.nudeChest.value);
  const ease = easeByFit();

  state.usedEstimateInCalc = false;

  // if nude missing, try estimate -> convert to current unit
  if (!nude){
    const estCm = state.lastEstimatedChestCm;
    if (isFinite(estCm)){
      nude = (state.unit === "cm") ? estCm : cmToIn(estCm);
      state.usedEstimateInCalc = true;
      // show set button AFTER calc (user can apply)
      els.btnSetEstimated.hidden = false;
    }
  }

  if (!nude) return { ok:false };

  const target = nude + ease; // target finished chest circumference
  const targetFlat = target / 2; // target chest flat (1/2)

  // Find minimal row where chestFlat >= targetFlat
  let bestIdx = -1;
  let bestVal = Infinity;

  rows.forEach((r, idx) => {
    const v = parseNumberSmart(r[colChestFlat]);
    if (!isFinite(v)) return;
    if (v >= targetFlat && v < bestVal){
      bestVal = v;
      bestIdx = idx;
    }
  });

  if (bestIdx < 0){
    // no size large enough
    return { ok:false, notFound:true };
  }

  const sizeLabel = rows[bestIdx][colSize] ?? "—";
  const unitLabel = (state.unit === "cm") ? "cm" : "in";

  const basis = t.basisTops(
    formatNum(target, state.unit),
    formatNum(ease, state.unit),
    unitLabel
  );

  return { ok:true, bestIdx, sizeLabel, basis };
}

function recommendShoes(){
  const { headers, rows } = state.table;
  if (!headers.length || !rows.length) return { ok:false };

  const colSize = findNumericColumn(headers, ["us", "size"]);
  const colFoot = findNumericColumn(headers, ["footlength", "foot length", "foot"]);
  if (!colSize || !colFoot) return { ok:false };

  const foot = parseNumberSmart(els.footLen.value);
  if (!foot) return { ok:false };

  const add = allowanceByFit();
  const target = foot + add;

  let bestIdx = -1;
  let bestVal = Infinity;

  rows.forEach((r, idx) => {
    const v = parseNumberSmart(r[colFoot]);
    if (!isFinite(v)) return;
    if (v >= target && v < bestVal){
      bestVal = v;
      bestIdx = idx;
    }
  });

  if (bestIdx < 0) return { ok:false, notFound:true };

  const sizeLabel = rows[bestIdx][colSize] ?? "—";
  const unitLabel = (state.unit === "cm") ? "cm" : "in";
  const basis = t.basisShoes(
    formatNum(target, state.unit),
    formatNum(add, state.unit),
    unitLabel
  );

  return { ok:true, bestIdx, sizeLabel, basis };
}

function formatNum(n, unit){
  if (!isFinite(n)) return "—";
  if (unit === "cm") return `${Math.round(n)}`;
  return `${round1(n)}`;
}

/* ---------- Self-check rendering ---------- */
function renderSelfCheck(type){
  const isShoes = (type === "shoes");
  const items = isShoes ? [
    [t.selfS1, [t.selfS1a, t.selfS1b]],
    [t.selfS2, [t.selfS2a]],
    [t.selfS3, [t.selfS3a]],
  ] : [
    [t.selfT1, [t.selfT1a, t.selfT1b, t.selfT1c]],
    [t.selfT2, [t.selfT2a]],
    [t.selfT3, [t.selfT3a]],
  ];

  const html = `
    <details>
      <summary>${escapeHtml(t.selfCheckTitle)}</summary>
      <div class="selfCheckBody">
        <ol>
          ${items.map(([q, arr]) => `
            <li>
              <strong>${escapeHtml(q)}</strong><br>
              ${arr.map(x => `• ${escapeHtml(x)}`).join("<br>")}
            </li>
          `).join("")}
        </ol>
      </div>
    </details>
  `;

  els.selfCheckWrap.innerHTML = html;
  els.selfCheckWrap.hidden = false;
}

/* ---------- Result / Error ---------- */
function clearResult(){
  els.resultArea.hidden = true;
  els.errorBox.hidden = true;
  els.resultValue.textContent = "—";
  els.resultDetail.textContent = "";
  els.selfCheckWrap.hidden = true;
  els.selfCheckWrap.innerHTML = "";
  clearHighlight();
}

function showError(){
  els.resultArea.hidden = false;
  els.errorBox.hidden = false;
  els.resultValue.textContent = "—";
  els.resultDetail.textContent = "";
  els.selfCheckWrap.hidden = true;
  els.selfCheckWrap.innerHTML = "";
}

function showResult(sizeLabel, basis, bestIdx){
  els.resultArea.hidden = false;
  els.errorBox.hidden = true;

  els.resultValue.textContent = sizeLabel;
  els.resultDetail.textContent = basis;

  renderSelfCheck(state.productType);

  // highlight & scroll
  highlightRow(bestIdx);
}

/* ---------- Actions ---------- */
async function runCalc(){
  clearHighlight();
  els.btnSetEstimated.hidden = true; // will be shown only if estimate used & tops

  if (!state.productKey){
    showError();
    return;
  }

  if (state.productType === "tops"){
    updateEstimatorUI();
    const r = recommendTops();
    if (!r.ok){
      showError();
      return;
    }
    showResult(r.sizeLabel, r.basis, r.bestIdx);
    return;
  }

  if (state.productType === "shoes"){
    const r = recommendShoes();
    if (!r.ok){
      showError();
      return;
    }
    showResult(r.sizeLabel, r.basis, r.bestIdx);
    return;
  }

  showError();
}

/* ---------- Events ---------- */
function bind(){
  // language tabs
  els.langJP.addEventListener("click", ()=> setLang("jp"));
  els.langEN.addEventListener("click", ()=> setLang("en"));

  // dropdown
  els.productBtn.addEventListener("click", ()=>{
    const open = els.productMenu.hidden;
    if (open) buildProductMenu();
    openMenu(open);
  });

  document.addEventListener("click", (e)=>{
    if (!els.productBtn.contains(e.target) && !els.productMenu.contains(e.target)){
      openMenu(false);
    }
  });

  document.addEventListener("keydown", (e)=>{
    if (e.key === "Escape") openMenu(false);
  });

  // estimator updates
  ["input","change"].forEach(evt=>{
    els.height.addEventListener(evt, updateEstimatorUI);
    els.weight.addEventListener(evt, updateEstimatorUI);
    els.sex.addEventListener(evt, updateEstimatorUI);
    els.nudeChest.addEventListener(evt, updateEstimatorUI);
  });

  // set estimated (manual apply)
  els.btnSetEstimated.addEventListener("click", ()=>{
    const estCm = state.lastEstimatedChestCm;
    if (!isFinite(estCm)) return;

    const v = (state.unit === "cm") ? Math.round(estCm) : round1(cmToIn(estCm));
    els.nudeChest.value = String(v);

    // hide set button after apply
    els.btnSetEstimated.hidden = true;

    runCalc();
  });

  // actions
  els.calcBtn.addEventListener("click", runCalc);

  els.resetBtn.addEventListener("click", ()=>{
    els.nudeChest.value = "";
    els.footLen.value = "";
    els.height.value = "";
    els.weight.value = "";
    els.bmi.value = "";
    state.lastEstimatedChestCm = null;
    state.usedEstimateInCalc = false;
    els.estSummary.textContent = t.estSummaryNone;
    els.btnSetEstimated.hidden = true;
    clearResult();
  });

  els.scrollTableBtn.addEventListener("click", ()=>{
    // scroll to chart
    els.sizeTable.scrollIntoView({ behavior:"smooth", block:"start" });
  });

  els.errorResetBtn.addEventListener("click", ()=> els.resetBtn.click());
  els.errorTableBtn.addEventListener("click", ()=> els.scrollTableBtn.click());
}

/* ---------- Init ---------- */
function init(){
  setLang("jp");
  applyI18n();
  refreshUnits();
  buildProductMenu();
  openMenu(false);
  clearResult();
  bind();
}

init();
