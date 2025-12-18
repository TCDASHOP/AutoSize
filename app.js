/* TCDA Size Guide - app.js (Full Rewrite + Size Finder)
   - JP/EN tabs
   - JP => cm / EN => inch (auto)
   - No "Copy table" / "Download CSV"
   - Size Finder: user inputs -> recommend nearest size
   - Caution notes shown by language
*/

const T = {
  JP: {
    lang: "JP",
    unit: "cm",
    labelProduct: "商品",
    guideTitle: "採寸ガイド",
    tableTitle: "サイズ表",
    finderTitle: "サイズ選びサポート",
    cautionTitle: "選ぶときの注意事項",
    hint: "※ 商品を選択 → JPはcm / ENはinch に自動切替",
    imageNote: "※ 画像は商品に応じて切り替わります",
    statusSelect: "商品を選択してください。",
    statusLoading: "読み込み中…",
    statusError: "読み込みに失敗しました。CSVのパス/ファイル名を確認してください。",
    ariaGuideAlt: "採寸ガイド画像",

    // Finder UI
    finderModeLabel: "入力方法",
    finderModeFav: "手持ちの“好きな服”の寸法から選ぶ（最短）",
    finderModeBody: "体（ヌード胸囲）から逆算して選ぶ",
    finderModeFoot: "足長から選ぶ（左右測って長い方）",
    inputChestFlat: "身幅（平置き）",
    inputLength: "着丈",
    inputSleeve: "袖丈",
    inputNudeChest: "ヌード胸囲",
    inputEase: "ゆとり（目安）",
    inputLeftFoot: "左足の足長",
    inputRightFoot: "右足の足長",
    inputAllowance: "捨て寸（目安）",
    btnCalc: "おすすめサイズを表示",
    optional: "（任意）",

    resultTitle: "提案",
    resultNone: "入力値とCSVから提案できませんでした。入力/CSVの列名を確認してください。",
  },

  EN: {
    lang: "EN",
    unit: "inch",
    labelProduct: "Item",
    guideTitle: "Size Guide",
    tableTitle: "Size Table",
    finderTitle: "Size Finder",
    cautionTitle: "Notes before you choose",
    hint: "Select an item → JP uses cm / EN uses inches automatically",
    imageNote: "Image changes by product.",
    statusSelect: "Please select an item.",
    statusLoading: "Loading…",
    statusError: "Failed to load. Check CSV path/filename.",
    ariaGuideAlt: "Size guide image",

    finderModeLabel: "Method",
    finderModeFav: "Use your favorite T-shirt / hoodie measurements (fastest)",
    finderModeBody: "From your body chest measurement (nude) → add ease",
    finderModeFoot: "From your foot length (measure both feet → use the longer)",
    inputChestFlat: "Chest width (flat)",
    inputLength: "Body length",
    inputSleeve: "Sleeve length",
    inputNudeChest: "Nude chest (circumference)",
    inputEase: "Ease (typical)",
    inputLeftFoot: "Left foot length",
    inputRightFoot: "Right foot length",
    inputAllowance: "Toe allowance (typical)",
    btnCalc: "Show recommended size",
    optional: "(optional)",

    resultTitle: "Suggestion",
    resultNone: "Could not suggest a size. Check your inputs / CSV column names.",
  }
};

// ---- Products (paths match your repo) ----
const PRODUCTS = [
  {
    id: "womens_slipon",
    category: "shoes",
    name: { JP: "Women's slip-on canvas shoes", EN: "Women's slip-on canvas shoes" },
    guideImage: "assets/guide_slipon.jpg",
    csv: { cm: "data/womens_slipon_cm.csv", inch: "data/womens_slipon_inch.csv" }
  },
  {
    id: "mens_slipon",
    category: "shoes",
    name: { JP: "Men's slip-on canvas shoes", EN: "Men's slip-on canvas shoes" },
    guideImage: "assets/guide_slipon.jpg",
    csv: { cm: "data/mens_slipon_cm.csv", inch: "data/mens_slipon_inch.csv" }
  },
  {
    id: "womens_crew",
    category: "tops",
    name: { JP: "Women's Crew Neck T-Shirt", EN: "Women's Crew Neck T-Shirt" },
    guideImage: "assets/guide_tshirt.jpg",
    csv: { cm: "data/aop_womens_crew_cm.csv", inch: "data/aop_womens_crew_inch.csv" }
  },
  {
    id: "mens_crew",
    category: "tops",
    name: { JP: "Men's crew neck T-shirt", EN: "Men's crew neck T-shirt" },
    guideImage: "assets/guide_tshirt.jpg",
    csv: { cm: "data/aop_mens_crew_cm.csv", inch: "data/aop_mens_crew_inch.csv" }
  },
  {
    id: "unisex_hoodie",
    category: "tops",
    name: { JP: "Unisex Hoodie", EN: "Unisex Hoodie" },
    guideImage: "assets/guide_hoodie.jpg",
    csv: { cm: "data/aop_recycled_hoodie_cm.csv", inch: "data/aop_recycled_hoodie_inch.csv" }
  },
  {
    id: "unisex_zip_hoodie",
    category: "tops",
    name: { JP: "Unisex ZIP Hoodie", EN: "Unisex ZIP Hoodie" },
    guideImage: "assets/guide_zip_hoodie.jpg",
    csv: { cm: "data/aop_recycled_zip_hoodie_cm.csv", inch: "data/aop_recycled_zip_hoodie_inch.csv" }
  }
];

// ---- DOM ----
const els = {
  btnJP: document.getElementById("btnLangJP"),
  btnEN: document.getElementById("btnLangEN"),
  labelProduct: document.getElementById("labelProduct"),
  productSelect: document.getElementById("productSelect"),
  unitLabel: document.getElementById("unitLabel"),
  hintText: document.getElementById("hintText"),

  finderTitle: document.getElementById("finderTitle"),
  finderBody: document.getElementById("finderBody"),
  finderResult: document.getElementById("finderResult"),
  cautionTitle: document.getElementById("cautionTitle"),
  cautionBody: document.getElementById("cautionBody"),

  guideTitle: document.getElementById("guideTitle"),
  guideImage: document.getElementById("guideImage"),
  imageNote: document.getElementById("imageNote"),

  tableTitle: document.getElementById("tableTitle"),
  statusText: document.getElementById("statusText"),
  thead: document.querySelector("#sizeTable thead"),
  tbody: document.querySelector("#sizeTable tbody"),

  footerText: document.getElementById("footerText")
};

const STORAGE_KEYS = {
  lang: "tcda_sizeguide_lang",
  product: "tcda_sizeguide_product"
};

let state = {
  lang: "JP",
  unit: "cm",
  productId: "",
  table: null // {headers, rows}
};

function tr() { return T[state.lang]; }

// ---- UI helpers ----
function setActiveLangUI() {
  const isJP = state.lang === "JP";
  els.btnJP.classList.toggle("active", isJP);
  els.btnEN.classList.toggle("active", !isJP);
  els.btnJP.setAttribute("aria-selected", String(isJP));
  els.btnEN.setAttribute("aria-selected", String(!isJP));
}

function saveState() {
  localStorage.setItem(STORAGE_KEYS.lang, state.lang);
  localStorage.setItem(STORAGE_KEYS.product, state.productId || "");
}

function loadState() {
  const savedLang = localStorage.getItem(STORAGE_KEYS.lang);
  const savedProduct = localStorage.getItem(STORAGE_KEYS.product);
  if (savedLang === "JP" || savedLang === "EN") state.lang = savedLang;
  if (typeof savedProduct === "string") state.productId = savedProduct;
  state.unit = (state.lang === "JP") ? "cm" : "inch";
}

function setTexts() {
  els.labelProduct.textContent = tr().labelProduct;
  els.guideTitle.textContent = tr().guideTitle;
  els.tableTitle.textContent = tr().tableTitle;
  els.finderTitle.textContent = tr().finderTitle;
  els.cautionTitle.textContent = tr().cautionTitle;
  els.hintText.textContent = tr().hint;
  els.imageNote.textContent = tr().imageNote;
  els.unitLabel.textContent = tr().unit;

  const year = new Date().getFullYear();
  els.footerText.textContent = `© Transcend Color Digital Apparel ${year}`;
}

function buildProductOptions() {
  els.productSelect.innerHTML = "";

  const opt0 = document.createElement("option");
  opt0.value = "";
  opt0.textContent = (state.lang === "JP") ? "選択してください" : "Select an item";
  els.productSelect.appendChild(opt0);

  for (const p of PRODUCTS) {
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.textContent = p.name[tr().lang] || p.name.EN || p.id;
    els.productSelect.appendChild(opt);
  }

  if (state.productId && PRODUCTS.some(p => p.id === state.productId)) {
    els.productSelect.value = state.productId;
  } else {
    els.productSelect.value = "";
    state.productId = "";
  }
}

function setStatus(text) { els.statusText.textContent = text || ""; }
function clearTable() { els.thead.innerHTML = ""; els.tbody.innerHTML = ""; }

function getProduct() {
  return PRODUCTS.find(p => p.id === state.productId) || null;
}

function setGuideImage(product) {
  if (!product) {
    els.guideImage.src = "";
    els.guideImage.alt = "";
    els.guideImage.style.display = "none";
    return;
  }
  els.guideImage.src = product.guideImage;
  els.guideImage.alt = tr().ariaGuideAlt;
  els.guideImage.style.display = "block";
}

// ---- CSV parsing ----
function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) return { headers: [], rows: [] };

  const rows = lines.map(line => {
    const out = [];
    let cur = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') inQuotes = !inQuotes;
      else if (ch === "," && !inQuotes) { out.push(cur.trim()); cur = ""; }
      else cur += ch;
    }
    out.push(cur.trim());
    return out.map(v => v.replace(/^"|"$/g, ""));
  });

  return { headers: rows[0], rows: rows.slice(1) };
}

function renderTable(headers, rows) {
  clearTable();

  const trHead = document.createElement("tr");
  headers.forEach(h => {
    const th = document.createElement("th");
    th.textContent = h;
    trHead.appendChild(th);
  });
  els.thead.appendChild(trHead);

  rows.forEach(r => {
    const trRow = document.createElement("tr");
    for (let i = 0; i < headers.length; i++) {
      const td = document.createElement("td");
      td.textContent = (r[i] ?? "");
      trRow.appendChild(td);
    }
    els.tbody.appendChild(trRow);
  });
}

// ---- Number parsing for inch fractions like "10 1/4" or unicode ½ etc ----
const UNICODE_FRAC = {
  "¼": 0.25, "½": 0.5, "¾": 0.75,
  "⅛": 0.125, "⅜": 0.375, "⅝": 0.625, "⅞": 0.875
};

function parseMixedNumber(s) {
  if (s == null) return NaN;
  let str = String(s).trim();
  if (!str) return NaN;

  // replace unicode fractions
  Object.keys(UNICODE_FRAC).forEach(k => {
    if (str.includes(k)) {
      str = str.replace(k, ` ${UNICODE_FRAC[k]}`);
    }
  });

  // "10 1/4"
  const parts = str.split(/\s+/);
  if (parts.length === 2 && parts[1].includes("/")) {
    const whole = parseFloat(parts[0]);
    const [a, b] = parts[1].split("/").map(n => parseFloat(n));
    if (!Number.isNaN(whole) && b) return whole + (a / b);
  }

  // "1/4"
  if (str.includes("/") && !str.includes(" ")) {
    const [a, b] = str.split("/").map(n => parseFloat(n));
    if (b) return a / b;
  }

  const n = parseFloat(str);
  return Number.isNaN(n) ? NaN : n;
}

// ---- Column matching (flexible) ----
function findCol(headers, candidates) {
  const lower = headers.map(h => String(h).trim().toLowerCase());
  for (const cand of candidates) {
    const c = cand.toLowerCase();
    const idx = lower.findIndex(h => h === c || h.includes(c));
    if (idx !== -1) return idx;
  }
  return -1;
}

function getTableMap(table) {
  const headers = table.headers;

  // tops
  const idxSize = findCol(headers, ["サイズ", "size"]);
  const idxChest = findCol(headers, ["身幅", "chest", "body width", "width"]);
  const idxLength = findCol(headers, ["着丈", "length", "body length"]);
  const idxSleeve = findCol(headers, ["袖丈", "sleeve"]);

  // shoes
  const idxFoot = findCol(headers, ["足の長さ", "foot length"]);
  const idxOutsole = findCol(headers, ["アウトソール", "outsole"]);

  // slipon inch has US/UK/EU sometimes
  const idxUS = findCol(headers, ["us"]);
  const idxUK = findCol(headers, ["uk"]);
  const idxEU = findCol(headers, ["eu"]);

  return { idxSize, idxChest, idxLength, idxSleeve, idxFoot, idxOutsole, idxUS, idxUK, idxEU };
}

// ---- Load CSV and render ----
async function loadAndRender() {
  const product = getProduct();
  setGuideImage(product);
  clearTable();
  state.table = null;
  els.finderResult.innerHTML = "";

  if (!product) {
    setStatus(tr().statusSelect);
    buildFinderUI(null);
    buildCautionUI(null);
    return;
  }

  setStatus(tr().statusLoading);

  const csvPath = (state.unit === "cm") ? product.csv.cm : product.csv.inch;

  try {
    const res = await fetch(csvPath, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();

    const table = parseCSV(text);
    state.table = table;

    renderTable(table.headers, table.rows);
    setStatus("");

    buildFinderUI(product);
    buildCautionUI(product);

  } catch (e) {
    console.error(e);
    setStatus(tr().statusError);
    buildFinderUI(product);
    buildCautionUI(product);
  }
}

// ---- Finder UI builders ----
function inputRowHTML(id, label, unitText, placeholder = "") {
  return `
    <div class="finder-row">
      <label class="finder-label" for="${id}">${label} <span class="muted">${unitText}</span></label>
      <input id="${id}" class="finder-input" inputmode="decimal" placeholder="${placeholder}" />
    </div>
  `;
}

function buildFinderUI(product) {
  const _t = tr();

  if (!product) {
    els.finderBody.innerHTML = `<p class="muted">${_t.statusSelect}</p>`;
    return;
  }

  const unit = _t.unit;
  const unitTag = (unit === "cm") ? "(cm)" : "(in)";

  // defaults: ease and allowance
  const defaultEase = (unit === "cm") ? "10" : "4";
  const defaultAllowance = (unit === "cm") ? "1.0" : "0.4";

  // Mode selector
  let modeOptions = "";
  if (product.category === "tops") {
    modeOptions = `
      <option value="fav">${_t.finderModeFav}</option>
      <option value="body">${_t.finderModeBody}</option>
    `;
  } else {
    modeOptions = `<option value="foot">${_t.finderModeFoot}</option>`;
  }

  let bodyHTML = `
    <div class="finder-row">
      <label class="finder-label" for="finderMode">${_t.finderModeLabel}</label>
      <select id="finderMode" class="finder-select">${modeOptions}</select>
    </div>
  `;

  if (product.category === "tops") {
    bodyHTML += `
      <div id="topsInputs"></div>
    `;
  } else {
    bodyHTML += `
      <div id="shoesInputs">
        ${inputRowHTML("leftFoot", _t.inputLeftFoot, unitTag, unit === "cm" ? "例: 23.4" : "e.g. 9.2")}
        ${inputRowHTML("rightFoot", _t.inputRightFoot, unitTag, unit === "cm" ? "例: 23.7" : "e.g. 9.3")}
        ${inputRowHTML("allowance", _t.inputAllowance, unitTag, defaultAllowance)}
      </div>
    `;
  }

  bodyHTML += `
    <div class="finder-actions">
      <button id="btnCalc" class="finder-btn" type="button">${_t.btnCalc}</button>
    </div>
  `;

  els.finderBody.innerHTML = bodyHTML;

  // wire up
  const modeEl = document.getElementById("finderMode");
  const btnCalc = document.getElementById("btnCalc");

  if (product.category === "tops") {
    renderTopsInputs("fav", defaultEase, unitTag);
    modeEl.addEventListener("change", () => {
      renderTopsInputs(modeEl.value, defaultEase, unitTag);
      els.finderResult.innerHTML = "";
    });
  } else {
    modeEl.value = "foot";
  }

  btnCalc.addEventListener("click", () => runFinder(product));
}

function renderTopsInputs(mode, defaultEase, unitTag) {
  const _t = tr();
  const box = document.getElementById("topsInputs");
  if (!box) return;

  if (mode === "body") {
    box.innerHTML = `
      ${inputRowHTML("nudeChest", _t.inputNudeChest, unitTag, _t.lang === "JP" ? "例: 86" : "e.g. 34")}
      ${inputRowHTML("ease", _t.inputEase, unitTag, defaultEase)}
      <div class="finder-row">
        <label class="finder-label">${_t.inputLength} ${_t.optional}</label>
        <input id="optLength" class="finder-input" inputmode="decimal" placeholder="${_t.lang === "JP" ? "例: 65" : "e.g. 25.5"}" />
      </div>
      <div class="finder-row">
        <label class="finder-label">${_t.inputSleeve} ${_t.optional}</label>
        <input id="optSleeve" class="finder-input" inputmode="decimal" placeholder="${_t.lang === "JP" ? "例: 20" : "e.g. 8"}" />
      </div>
    `;
  } else {
    // fav
    box.innerHTML = `
      ${inputRowHTML("favChest", _t.inputChestFlat, unitTag, _t.lang === "JP" ? "例: 52" : "e.g. 20.5")}
      ${inputRowHTML("favLength", _t.inputLength, unitTag, _t.lang === "JP" ? "例: 68" : "e.g. 26.8")}
      ${inputRowHTML("favSleeve", _t.inputSleeve, unitTag, _t.lang === "JP" ? "例: 22" : "e.g. 8.7")}
    `;
  }
}

// ---- Finder logic ----
function numOf(id) {
  const el = document.getElementById(id);
  if (!el) return NaN;
  const v = String(el.value || "").trim();
  return parseMixedNumber(v);
}

function runFinder(product) {
  const _t = tr();
  const table = state.table;
  if (!product || !table) {
    els.finderResult.innerHTML = `<div class="result-box">${_t.resultNone}</div>`;
    return;
  }

  const map = getTableMap(table);
  const headers = table.headers;
  const rows = table.rows;

  if (product.category === "tops") {
    const mode = document.getElementById("finderMode").value;

    // Ensure chest column exists at least
    if (map.idxChest === -1 || map.idxSize === -1) {
      els.finderResult.innerHTML = `<div class="result-box">${_t.resultNone}</div>`;
      return;
    }

    let targetChestFlat = NaN;
    let targetLength = NaN;
    let targetSleeve = NaN;

    if (mode === "body") {
      const nude = numOf("nudeChest");
      const ease = numOf("ease");
      if (Number.isNaN(nude) || Number.isNaN(ease)) {
        els.finderResult.innerHTML = `<div class="result-box">${_t.resultNone}</div>`;
        return;
      }
      // target garment chest circumference = nude + ease
      // target half chest = /2
      targetChestFlat = (nude + ease) / 2;

      targetLength = numOf("optLength");
      targetSleeve = numOf("optSleeve");
    } else {
      targetChestFlat = numOf("favChest");
      targetLength = numOf("favLength");
      targetSleeve = numOf("favSleeve");
      if (Number.isNaN(targetChestFlat) || Number.isNaN(targetLength) || Number.isNaN(targetSleeve)) {
        els.finderResult.innerHTML = `<div class="result-box">${_t.resultNone}</div>`;
        return;
      }
    }

    // scoring: prioritize chest > length > sleeve
    const W_CHEST = 5;
    const W_LEN = 2;
    const W_SLV = 1;

    let best = null;

    rows.forEach((r) => {
      const sizeLabel = r[map.idxSize];
      const chestFlat = parseMixedNumber(r[map.idxChest]);

      if (Number.isNaN(chestFlat)) return;

      const chestDiff = Math.abs(chestFlat - targetChestFlat);

      let score = W_CHEST * chestDiff;
      let lenDiff = null;
      let slvDiff = null;

      // length optional / available
      if (!Number.isNaN(targetLength) && map.idxLength !== -1) {
        const len = parseMixedNumber(r[map.idxLength]);
        if (!Number.isNaN(len)) {
          lenDiff = Math.abs(len - targetLength);
          score += W_LEN * lenDiff;
        }
      }

      // sleeve optional / available
      if (!Number.isNaN(targetSleeve) && map.idxSleeve !== -1) {
        const slv = parseMixedNumber(r[map.idxSleeve]);
        if (!Number.isNaN(slv)) {
          slvDiff = Math.abs(slv - targetSleeve);
          score += W_SLV * slvDiff;
        }
      }

      if (!best || score < best.score) {
        best = { sizeLabel, chestFlat, lenDiff, slvDiff, score };
      }
    });

    if (!best) {
      els.finderResult.innerHTML = `<div class="result-box">${_t.resultNone}</div>`;
      return;
    }

    const unit = _t.unit;
    const lines = [];
    lines.push(`<div class="result-title">${_t.resultTitle}</div>`);
    lines.push(`<div class="result-main"><strong>${best.sizeLabel}</strong></div>`);
    lines.push(`<div class="result-sub">Target chest width (flat): ${formatNum(targetChestFlat)} ${unit}</div>`);
    lines.push(`<div class="result-sub">Best match chest width: ${formatNum(best.chestFlat)} ${unit}</div>`);

    if (best.lenDiff != null) lines.push(`<div class="result-sub">Length diff: ${formatNum(best.lenDiff)} ${unit}</div>`);
    if (best.slvDiff != null) lines.push(`<div class="result-sub">Sleeve diff: ${formatNum(best.slvDiff)} ${unit}</div>`);

    els.finderResult.innerHTML = `<div class="result-box">${lines.join("")}</div>`;
    return;
  }

  // shoes
  if (product.category === "shoes") {
    if (map.idxFoot === -1) {
      els.finderResult.innerHTML = `<div class="result-box">${_t.resultNone}</div>`;
      return;
    }

    const left = numOf("leftFoot");
    const right = numOf("rightFoot");
    const allowance = numOf("allowance");

    if (Number.isNaN(left) || Number.isNaN(right) || Number.isNaN(allowance)) {
      els.finderResult.innerHTML = `<div class="result-box">${_t.resultNone}</div>`;
      return;
    }

    const foot = Math.max(left, right);
    const target = foot + allowance;

    // pick smallest size where "Foot length" >= target
    // if size column exists use it; else fallback to US/UK/EU row label
    let bestRow = null;

    for (const r of rows) {
      const v = parseMixedNumber(r[map.idxFoot]);
      if (Number.isNaN(v)) continue;
      if (v >= target) {
        bestRow = r;
        break;
      }
    }

    // if none, choose last
    if (!bestRow && rows.length > 0) bestRow = rows[rows.length - 1];

    if (!bestRow) {
      els.finderResult.innerHTML = `<div class="result-box">${_t.resultNone}</div>`;
      return;
    }

    const unit = _t.unit;
    const sizeText = resolveShoeSizeLabel(bestRow, map);

    const bestFoot = parseMixedNumber(bestRow[map.idxFoot]);
    const bestOutsole = (map.idxOutsole !== -1) ? parseMixedNumber(bestRow[map.idxOutsole]) : NaN;

    const lines = [];
    lines.push(`<div class="result-title">${_t.resultTitle}</div>`);
    lines.push(`<div class="result-main"><strong>${sizeText}</strong></div>`);
    lines.push(`<div class="result-sub">Your foot length (max): ${formatNum(foot)} ${unit}</div>`);
    lines.push(`<div class="result-sub">Target (foot + allowance): ${formatNum(target)} ${unit}</div>`);
    if (!Number.isNaN(bestFoot)) lines.push(`<div class="result-sub">Chart foot length: ${formatNum(bestFoot)} ${unit}</div>`);
    if (!Number.isNaN(bestOutsole)) lines.push(`<div class="result-sub">Outsole length (reference): ${formatNum(bestOutsole)} ${unit}</div>`);

    els.finderResult.innerHTML = `<div class="result-box">${lines.join("")}</div>`;
  }
}

function resolveShoeSizeLabel(row, map) {
  // Prefer: JP cm chart has "サイズ"
  if (map.idxSize !== -1 && row[map.idxSize]) return row[map.idxSize];

  // inch chart often has US/UK/EU columns
  const parts = [];
  if (map.idxUS !== -1 && row[map.idxUS]) parts.push(`US ${row[map.idxUS]}`);
  if (map.idxUK !== -1 && row[map.idxUK]) parts.push(`UK ${row[map.idxUK]}`);
  if (map.idxEU !== -1 && row[map.idxEU]) parts.push(`EU ${row[map.idxEU]}`);

  return parts.length ? parts.join(" / ") : "—";
}

function formatNum(n) {
  if (Number.isNaN(n)) return "—";
  // keep 1 decimal max (good for cm and inch)
  const s = (Math.round(n * 10) / 10).toString();
  return s;
}

// ---- Caution Notes (derived from your text) ----
function buildCautionUI(product) {
  const _t = tr();

  if (!product) {
    els.cautionBody.innerHTML = "";
    return;
  }

  if (_t.lang === "JP") {
    const html = `
      <ul class="caution-list">
        <li><strong>Tシャツ（Men’s / Women’s）</strong>：Men’sはゆったり・直線的、Women’sはフィット寄りになりやすい。</li>
        <li><strong>最短で失敗を減らす</strong>：手持ちの「いちばん好きな服」を平置きで測り、サイズ表の近い数値を選ぶ。</li>
        <li><strong>体から逆算</strong>：ヌード胸囲＋ゆとり → 仕上がり胸囲 → 身幅（仕上がり胸囲÷2）。</li>
        <li><strong>優先順位</strong>：身幅 → 着丈 → 袖丈（袖は肩線位置で体感が変わる）。</li>
        <li><strong>パーカー</strong>：基本は同じ。裾リブ等で体感が変わるので「同じ数値でも印象が少し違う」点に注意。</li>
        <li><strong>スリッポン</strong>：足長（かかと〜一番長い指）が主役。左右を測り長い方を採用。</li>
        <li><strong>捨て寸</strong>：足長＋7〜12mm（目安）。アウトソール長は外寸なので足長と同一視しない。</li>
        <li><strong>幅/甲</strong>：Men’sは幅広め、Women’sはタイトになりやすい。幅広/甲高は注意（迷ったら大きめ寄り）。</li>
        <li><strong>国籍でロジックは変わらない</strong>：変わるのは表記（cm/inch）と好み。見るべきは「仕上がり寸法（服）」と「足長（靴）」。</li>
      </ul>
    `;
    els.cautionBody.innerHTML = html;
  } else {
    const html = `
      <ul class="caution-list">
        <li><strong>T-shirts</strong>: Men’s tends to be roomier/straighter; Women’s tends to fit closer.</li>
        <li><strong>Fastest reliable method</strong>: Measure your favorite shirt/hoodie flat and match the chart.</li>
        <li><strong>From body</strong>: nude chest + ease → finished chest → chest width (flat = finished/2).</li>
        <li><strong>Priority</strong>: chest width → length → sleeve (sleeve feel depends on shoulder seam position).</li>
        <li><strong>Hoodies</strong>: same logic, but ribs/hem change perceived fit even with same numbers.</li>
        <li><strong>Slip-ons</strong>: foot length (heel to longest toe) is primary; measure both feet and use the longer.</li>
        <li><strong>Allowance</strong>: foot length + ~0.28–0.47 in. Outsole length is an external reference only.</li>
        <li><strong>Width/instep</strong>: Men’s often wider; Women’s can feel tighter. Wide/high instep: be careful.</li>
        <li><strong>The logic is global</strong>: only units & fit culture differ. Use finished garment measurements and foot length.</li>
      </ul>
    `;
    els.cautionBody.innerHTML = html;
  }
}

// ---- Language apply ----
function applyLanguage(lang) {
  state.lang = lang;
  state.unit = (lang === "JP") ? "cm" : "inch";

  setActiveLangUI();
  setTexts();
  buildProductOptions();
  saveState();

  loadAndRender();
}

// ---- Events ----
function onProductChange() {
  state.productId = els.productSelect.value || "";
  saveState();
  loadAndRender();
}

// ---- Init ----
function init() {
  loadState();

  els.btnJP.addEventListener("click", () => applyLanguage("JP"));
  els.btnEN.addEventListener("click", () => applyLanguage("EN"));
  els.productSelect.addEventListener("change", onProductChange);

  setActiveLangUI();
  setTexts();
  buildProductOptions();
  loadAndRender();
}

document.addEventListener("DOMContentLoaded", init);
