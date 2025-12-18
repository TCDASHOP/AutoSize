/* TCDA Size Guide - rewritten for clarity-first UX */

const $ = (q) => document.querySelector(q);

const el = {
  langJP: $("#langJP"),
  langEN: $("#langEN"),
  unitBadge: $("#unitBadge"),
  productSelect: $("#productSelect"),
  guideImage: $("#guideImage"),
  imgNote: $("#imgNote"),
  inputArea: $("#inputArea"),
  noticeBox: $("#noticeBox"),
  resultBox: $("#resultBox"),
  tableHead: $("#tableHead"),
  tableBody: $("#tableBody"),
  labelProduct: $("#labelProduct"),
  pageTitle: $("#pageTitle"),
  titleGuide: $("#titleGuide"),
  titleInput: $("#titleInput"),
  hintInput: $("#hintInput"),
  titleTable: $("#titleTable"),
  hintTable: $("#hintTable"),
};

// ---- Products (CSV paths are your current data files) ----
const PRODUCTS = [
  {
    id: "womens_slipon",
    type: "shoes",
    labelJP: "ウィメンズ スリッポン",
    labelEN: "Women's Slip-On Canvas Shoes",
    csv: { cm: "./data/womens_slipon_cm.csv", inch: "./data/womens_slipon_inch.csv" },
    guideImg: "./assets/guide_shoes.png",
  },
  {
    id: "mens_slipon",
    type: "shoes",
    labelJP: "メンズ スリッポン",
    labelEN: "Men's Slip-On Canvas Shoes",
    csv: { cm: "./data/mens_slipon_cm.csv", inch: "./data/mens_slipon_inch.csv" },
    guideImg: "./assets/guide_shoes.png",
  },
  {
    id: "womens_crew",
    type: "top",
    labelJP: "ウィメンズ クルーネックT",
    labelEN: "Women's Crew Neck T-Shirt",
    csv: { cm: "./data/aop_womens_crew_cm.csv", inch: "./data/aop_womens_crew_inch.csv" },
    guideImg: "./assets/guide_tee.png",
  },
  {
    id: "mens_crew",
    type: "top",
    labelJP: "メンズ クルーネックT",
    labelEN: "Men's Crew Neck T-Shirt",
    csv: { cm: "./data/aop_mens_crew_cm.csv", inch: "./data/aop_mens_crew_inch.csv" },
    guideImg: "./assets/guide_tee.png",
  },
  {
    id: "unisex_hoodie",
    type: "hoodie",
    labelJP: "ユニセックス パーカー",
    labelEN: "Unisex Hoodie",
    csv: { cm: "./data/aop_recycled_hoodie_cm.csv", inch: "./data/aop_recycled_hoodie_inch.csv" },
    guideImg: "./assets/guide_hoodie.png",
  },
  {
    id: "unisex_zip_hoodie",
    type: "hoodie",
    labelJP: "ユニセックス ジップパーカー",
    labelEN: "Unisex ZIP Hoodie",
    csv: { cm: "./data/aop_recycled_zip_hoodie_cm.csv", inch: "./data/aop_recycled_zip_hoodie_inch.csv" },
    guideImg: "./assets/guide_ziphoodie.png",
  },
];

// ---- i18n ----
const I18N = {
  jp: {
    pageTitle: "サイズガイド",
    product: "商品",
    guide: "採寸ガイド",
    input: "入力（任意）",
    inputHint: "入力しなくてもサイズ表は見られます",
    table: "サイズ表",
    tableHint: "数値は平置き採寸です（誤差 ±1〜2 あり）",
    unit: "単位：cm",
    imgNote: "※ 画像は商品に応じて切り替わります",
    calcBtn: "おすすめサイズを計算",
    noticeTitle: "選ぶときの注意事項",
    resultTitle: "おすすめ",
    notFound: "該当するサイズが見当たりませんでした。",
    actionsRetry: "入力を見直す",
    actionsSeeTable: "サイズ表で選ぶ",
    // Modes
    modeBody: "体から選ぶ",
    modeGarment: "手持ちの服から選ぶ",
    // Fields (tops/hoodies)
    nudeChest: "ヌード胸囲（cm）",
    ease: "ゆとり（目安）",
    easeStd: "標準（+10cm 目安）",
    easeRelax: "ゆったり（+12cm 目安）",
    easeTight: "すっきり（+8cm 目安）",
    favHalfChest: "手持ちの服：身幅（平置き・cm）",
    // shoes
    footLen: "足長（かかと〜一番長い指・cm）",
    allowance: "捨て寸（目安）",
    allowStd: "+1.0cm（標準）",
    allowSmall: "+0.7cm（タイト寄り）",
    allowLarge: "+1.2cm（ゆとり）",
    // why
    whyBody: (nude, add, target, key) =>
      `根拠：ヌード胸囲 ${nude} + ゆとり ${add} = 目標胸囲 ${target} → サイズ表の「${key}」に最も近いサイズ`,
    whyGarment: (half, key) =>
      `根拠：手持ちの服の身幅（平置き） ${half} → サイズ表の「${key}」に最も近いサイズ`,
    whyShoes: (foot, add, target, key) =>
      `根拠：足長 ${foot} + 捨て寸 ${add} = 目標 ${target} → サイズ表の「${key}」に合う最小サイズ`,
    // notices
    notices: {
      top: [
        "Men’sはゆったり・直線的、Women’sはフィット寄りになりやすい。",
        "最短で失敗を減らす：手持ちの“いちばん好きな服”の平置き寸法で合わせる。",
        "優先順位：身幅 → 着丈 → 袖丈（袖は肩線位置で体感が変わります）。",
      ],
      hoodie: [
        "基本はTシャツと同じ（胸囲 → 着丈 → 袖）。",
        "裾リブ等で体感が変わるため、同じ数値でも印象が少し変わります。",
        "迷ったら「ゆったり」寄りが無難です。",
      ],
      shoes: [
        "主役は足長（左右を測り、長い方を採用）。",
        "足長 + 捨て寸（目安7〜12mm）で選ぶ。アウトソール長は外寸なので足長と同一視しない。",
        "Men’sは幅広め／Women’sはタイト寄り。幅広・甲高は迷ったら大きめ寄り。",
      ],
    },
  },

  en: {
    pageTitle: "Size Guide",
    product: "Product",
    guide: "Measurement Guide",
    input: "Optional Input",
    inputHint: "You can use the table without entering anything",
    table: "Size Table",
    tableHint: "Flat measurements (allow ±1–2 differences)",
    unit: "Unit: inch",
    imgNote: "Image changes by product.",
    calcBtn: "Calculate recommended size",
    noticeTitle: "Notes when choosing",
    resultTitle: "Recommendation",
    notFound: "No matching size was found.",
    actionsRetry: "Review input",
    actionsSeeTable: "Choose from table",
    modeBody: "Choose from body",
    modeGarment: "Choose from your favorite item",
    nudeChest: "Body chest (inch)",
    ease: "Ease (guide)",
    easeStd: "Standard (+4 in)",
    easeRelax: "Relaxed (+5 in)",
    easeTight: "Closer (+3 in)",
    favHalfChest: "Your item: chest width (flat, inch)",
    footLen: "Foot length (heel to longest toe, inch)",
    allowance: "Toe allowance (guide)",
    allowStd: "+0.4 in (standard)",
    allowSmall: "+0.3 in (snug)",
    allowLarge: "+0.5 in (roomy)",
    whyBody: (nude, add, target, key) =>
      `Why: body chest ${nude} + ease ${add} = target ${target} → closest match in "${key}"`,
    whyGarment: (half, key) =>
      `Why: your item flat width ${half} → closest match in "${key}"`,
    whyShoes: (foot, add, target, key) =>
      `Why: foot length ${foot} + allowance ${add} = target ${target} → smallest size that fits "${key}"`,
    notices: {
      top: [
        "Men’s tends to be straighter/roomier; Women’s tends to be more fitted.",
        "Fastest way: measure your favorite item flat and match the closest numbers.",
        "Priority: chest width → length → sleeve (sleeve feel changes by shoulder seam).",
      ],
      hoodie: [
        "Same logic as T-shirts (chest → length → sleeve).",
        "Rib hems can change the feel even with the same numbers.",
        "If unsure, pick the roomier option.",
      ],
      shoes: [
        "Foot length is key (measure both feet and use the longer one).",
        "Use foot length + allowance; outsole length is external and not equal to foot length.",
        "Men’s tends to be wider; Women’s can feel tighter. Wide/high instep: size up if unsure.",
      ],
    },
  },
};

// ---- State ----
const state = {
  lang: "jp",
  unit: "cm",        // derived from lang: JP->cm / EN->inch
  productId: PRODUCTS[0].id,
  csvRows: [],
  headers: [],
  product: PRODUCTS[0],
  lastMode: "body",  // "body" | "garment"
};

// ---- Utilities ----
function isJaBrowser() {
  const lang = (navigator.language || "").toLowerCase();
  return lang.startsWith("ja");
}

function setLang(nextLang) {
  state.lang = nextLang;
  state.unit = (nextLang === "jp") ? "cm" : "inch";

  el.langJP.setAttribute("aria-pressed", nextLang === "jp" ? "true" : "false");
  el.langEN.setAttribute("aria-pressed", nextLang === "en" ? "true" : "false");

  renderStaticText();
  loadAndRender();
}

function fmt(n) {
  if (Number.isNaN(n)) return "";
  // keep 1 decimal if needed
  const s = (Math.round(n * 10) / 10).toString();
  return s;
}

function normalizeHeader(h) {
  return (h || "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[’']/g, "'");
}

// Basic CSV parser (handles quoted commas)
function parseCSV(text) {
  const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n").filter(l => l.trim().length);
  if (!lines.length) return { headers: [], rows: [] };

  const parseLine = (line) => {
    const out = [];
    let cur = "";
    let inQ = false;
    for (let i=0;i<line.length;i++){
      const ch = line[i];
      if (ch === '"') {
        if (inQ && line[i+1] === '"') { cur += '"'; i++; }
        else inQ = !inQ;
      } else if (ch === "," && !inQ) {
        out.push(cur); cur = "";
      } else {
        cur += ch;
      }
    }
    out.push(cur);
    return out.map(v => v.trim());
  };

  const headers = parseLine(lines[0]);
  const rows = lines.slice(1).map(l => {
    const cols = parseLine(l);
    const obj = {};
    headers.forEach((h, idx) => obj[h] = (cols[idx] ?? "").trim());
    return obj;
  });

  return { headers, rows };
}

// unicode fractions to decimal
const UNICODE_FRAC = {
  "¼": 0.25, "½": 0.5, "¾": 0.75,
  "⅛": 0.125, "⅜": 0.375, "⅝": 0.625, "⅞": 0.875,
  "⅓": 1/3, "⅔": 2/3, "⅕": 0.2, "⅖": 0.4, "⅗": 0.6, "⅘": 0.8,
};

// parse numbers like "10 1/4", "10¼", "9 ⅛"
function parseNumberLoose(v) {
  if (v == null) return NaN;
  let s = String(v).trim();
  if (!s) return NaN;

  // normalize weird spaces
  s = s.replace(/\u00A0/g, " ").replace(/\s+/g, " ").trim();

  // handle unicode fractions attached (e.g., "10¼")
  for (const k of Object.keys(UNICODE_FRAC)) {
    if (s.includes(k)) {
      // split "10¼" or "10 ¼"
      s = s.replace(k, ` ${UNICODE_FRAC[k]}`);
    }
  }

  // handle "10 1/4"
  const m = s.match(/^(\d+(?:\.\d+)?)\s+(\d+)\s*\/\s*(\d+)$/);
  if (m) {
    const a = parseFloat(m[1]);
    const b = parseFloat(m[2]);
    const c = parseFloat(m[3]);
    if (!Number.isNaN(a) && c) return a + (b / c);
  }

  // handle "9 0.125" (after unicode replacement)
  const m2 = s.match(/^(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)$/);
  if (m2) {
    const a = parseFloat(m2[1]);
    const b = parseFloat(m2[2]);
    if (!Number.isNaN(a) && !Number.isNaN(b)) return a + b;
  }

  // plain float
  const x = parseFloat(s);
  return Number.isNaN(x) ? NaN : x;
}

function nearestRowByColumn(rows, colName, target) {
  let best = null;
  let bestDiff = Infinity;

  for (const r of rows) {
    const val = parseNumberLoose(r[colName]);
    if (Number.isNaN(val)) continue;
    const diff = Math.abs(val - target);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = r;
    }
  }
  return best;
}

// For shoes: choose smallest row where footLenCol >= target
function smallestThatFits(rows, footLenCol, target) {
  let best = null;
  let bestVal = Infinity;
  for (const r of rows) {
    const v = parseNumberLoose(r[footLenCol]);
    if (Number.isNaN(v)) continue;
    if (v >= target && v < bestVal) {
      bestVal = v;
      best = r;
    }
  }
  return best;
}

function pickFirstExistingHeader(headers, candidates) {
  const map = new Map(headers.map(h => [normalizeHeader(h), h]));
  for (const c of candidates) {
    const k = normalizeHeader(c);
    if (map.has(k)) return map.get(k);
  }
  // fallback: partial match
  for (const h of headers) {
    const nh = normalizeHeader(h);
    for (const c of candidates) {
      if (nh.includes(normalizeHeader(c))) return h;
    }
  }
  return null;
}

function safeText(s) {
  return String(s ?? "").replace(/[<>&]/g, (m) => ({ "<":"&lt;", ">":"&gt;", "&":"&amp;" }[m]));
}

// ---- Rendering ----
function renderStaticText() {
  const t = I18N[state.lang];
  el.pageTitle.textContent = t.pageTitle;
  el.labelProduct.textContent = t.product;
  el.titleGuide.textContent = t.guide;
  el.titleInput.textContent = t.input;
  el.hintInput.textContent = t.inputHint;
  el.titleTable.textContent = t.table;
  el.hintTable.textContent = t.tableHint;
  el.unitBadge.textContent = t.unit;
  el.imgNote.textContent = t.imgNote;
}

function renderProductOptions() {
  el.productSelect.innerHTML = "";
  for (const p of PRODUCTS) {
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.textContent = (state.lang === "jp") ? p.labelJP : p.labelEN;
    el.productSelect.appendChild(opt);
  }
  el.productSelect.value = state.productId;
}

function renderGuide() {
  const p = state.product;
  // If asset missing, keep empty alt. (GitHub Pages won't break)
  el.guideImage.src = p.guideImg;
  el.guideImage.alt = (state.lang === "jp") ? `${p.labelJP} 採寸ガイド` : `${p.labelEN} measurement guide`;
}

function renderNotice() {
  const t = I18N[state.lang];
  const list = t.notices[state.product.type] || [];
  el.noticeBox.innerHTML = `
    <div class="noteBox__title">${safeText(t.noticeTitle)}</div>
    <ul>
      ${list.map(x => `<li>${safeText(x)}</li>`).join("")}
    </ul>
    <div class="muted">${safeText(state.lang === "jp"
      ? "国籍でロジックは変わりません。見るべきは「仕上がり寸法（服）」と「足長（靴）」です。"
      : "The logic is universal. Focus on garment measurements (clothes) and foot length (shoes)."
    )}</div>
  `;
}

function renderInputArea() {
  const t = I18N[state.lang];
  const p = state.product;

  // mode tabs only for tops/hoodies
  const modeTabs = (p.type === "top" || p.type === "hoodie") ? `
    <div class="modeTabs">
      <button type="button" id="modeBody" aria-pressed="${state.lastMode === "body"}">${t.modeBody}</button>
      <button type="button" id="modeGarment" aria-pressed="${state.lastMode === "garment"}">${t.modeGarment}</button>
    </div>
  ` : "";

  let inner = `<div class="form">${modeTabs}`;

  if (p.type === "top" || p.type === "hoodie") {
    // body mode fields
    const unit = state.unit === "cm" ? "cm" : "inch";
    inner += `
      <div class="row" id="bodyFields" style="display:${state.lastMode==="body"?"grid":"none"}">
        <div class="field">
          <label for="nudeChest">${t.nudeChest}</label>
          <input class="input" id="nudeChest" inputmode="decimal" placeholder="${state.lang==="jp"?"例: 88":"e.g. 34.5"}" />
        </div>
        <div class="field">
          <label for="ease">${t.ease}</label>
          <select class="selectSmall" id="ease">
            <option value="tight">${t.easeTight}</option>
            <option value="std" selected>${t.easeStd}</option>
            <option value="relax">${t.easeRelax}</option>
          </select>
        </div>
      </div>

      <div class="row" id="garmentFields" style="display:${state.lastMode==="garment"?"grid":"none"}">
        <div class="field">
          <label for="favHalfChest">${t.favHalfChest}</label>
          <input class="input" id="favHalfChest" inputmode="decimal" placeholder="${state.lang==="jp"?"例: 52":"e.g. 20.5"}" />
        </div>
        <div class="field">
          <label>&nbsp;</label>
          <div class="muted" style="padding:10px 0; line-height:1.35;">
            ${safeText(state.lang==="jp"
              ? "身幅 → 着丈 → 袖丈の順で近い数値を選ぶと失敗が減ります。"
              : "Match chest width first, then length, then sleeve."
            )}
          </div>
        </div>
      </div>
    `;
  }

  if (p.type === "shoes") {
    inner += `
      <div class="row">
        <div class="field">
          <label for="footLen">${t.footLen}</label>
          <input class="input" id="footLen" inputmode="decimal" placeholder="${state.lang==="jp"?"例: 23.5":"e.g. 9.25"}" />
        </div>
        <div class="field">
          <label for="allow">${t.allowance}</label>
          <select class="selectSmall" id="allow">
            <option value="small">${t.allowSmall}</option>
            <option value="std" selected>${t.allowStd}</option>
            <option value="large">${t.allowLarge}</option>
          </select>
        </div>
      </div>
    `;
  }

  inner += `
      <button class="primaryBtn" type="button" id="calcBtn">${t.calcBtn}</button>
    </div>
  `;

  el.inputArea.innerHTML = inner;

  // bind mode toggle
  if (p.type === "top" || p.type === "hoodie") {
    $("#modeBody").addEventListener("click", () => {
      state.lastMode = "body";
      renderInputArea();
      bindCalc();
    });
    $("#modeGarment").addEventListener("click", () => {
      state.lastMode = "garment";
      renderInputArea();
      bindCalc();
    });
  }
}

function renderTable(headers, rows) {
  el.tableHead.innerHTML = "";
  el.tableBody.innerHTML = "";

  if (!headers.length) return;

  // Map headers to more readable labels (without forcing CSV edits)
  const t = I18N[state.lang];
  const p = state.product;

  const normalized = headers.map(h => normalizeHeader(h));

  function labelFor(h) {
    const nh = normalizeHeader(h);

    // shoes
    if (p.type === "shoes") {
      if (state.lang === "jp") {
        // prefer JP terms if detected
        if (nh.includes("サイズ")) return "サイズ";
        if (nh.includes("足") && nh.includes("長")) return "足の長さ";
        if (nh.includes("アウトソール")) return "アウトソールの長さ";
      } else {
        if (nh === "us") return "US";
        if (nh === "uk") return "UK";
        if (nh === "eu") return "EU";
        if (nh.includes("foot")) return "Foot length";
        if (nh.includes("outsole")) return "Outsole length";
      }
    }

    // tops/hoodies
    if (nh === "size" || nh.includes("サイズ")) return (state.lang==="jp") ? "サイズ" : "Size";
    if (nh.includes("chest") || nh.includes("身幅") || nh.includes("width")) return (state.lang==="jp") ? "身幅（平置き）" : "Chest width (flat)";
    if (nh.includes("length") || nh.includes("着丈") || nh.includes("body")) return (state.lang==="jp") ? "着丈" : "Body length";
    if (nh.includes("sleeve") || nh.includes("袖")) return (state.lang==="jp") ? "袖丈" : "Sleeve length";

    return h; // fallback
  }

  const trh = document.createElement("tr");
  headers.forEach(h => {
    const th = document.createElement("th");
    th.textContent = labelFor(h);
    trh.appendChild(th);
  });
  el.tableHead.appendChild(trh);

  rows.forEach(r => {
    const tr = document.createElement("tr");
    headers.forEach(h => {
      const td = document.createElement("td");
      td.textContent = r[h] ?? "";
      tr.appendChild(td);
    });
    el.tableBody.appendChild(tr);
  });
}

function renderResultNone() {
  const t = I18N[state.lang];
  el.resultBox.innerHTML = `
    <div class="result__title">${safeText(t.resultTitle)}</div>
    <div class="result__main">${safeText(t.notFound)}</div>
    <div class="result__why">${safeText(state.lang==="jp"
      ? "入力値を見直すか、サイズ表で最も近い数値を選んでください。"
      : "Review your input or pick the closest numbers from the table."
    )}</div>
    <div class="result__actions">
      <button type="button" class="smallBtn" id="actRetry">${safeText(t.actionsRetry)}</button>
      <button type="button" class="smallBtn" id="actTable">${safeText(t.actionsSeeTable)}</button>
    </div>
  `;

  $("#actRetry")?.addEventListener("click", () => {
    // focus first input if exists
    const first = $("#nudeChest") || $("#favHalfChest") || $("#footLen");
    first?.focus();
  });

  $("#actTable")?.addEventListener("click", () => {
    // scroll to table
    $("#sizeTable")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function renderResultOk(sizeText, whyText) {
  const t = I18N[state.lang];
  el.resultBox.innerHTML = `
    <div class="result__title">${safeText(t.resultTitle)}</div>
    <div class="result__main">${safeText(sizeText)}</div>
    <div class="result__why">${safeText(whyText)}</div>
  `;
}

// ---- Calculation logic per product type ----
function computeRecommendation() {
  const t = I18N[state.lang];
  const p = state.product;
  const headers = state.headers;
  const rows = state.csvRows;

  if (!rows.length || !headers.length) {
    renderResultNone();
    return;
  }

  // Detect key columns
  const sizeCol = pickFirstExistingHeader(headers, ["サイズ", "size", "Size"]);
  const chestHalfCol = pickFirstExistingHeader(headers, ["身幅", "chest (flat)", "chest flat", "chest width", "half chest width", "width"]);
  const footLenCol = pickFirstExistingHeader(headers, ["足の長さ", "foot length", "foot_len", "footlen"]);
  const outsoleCol = pickFirstExistingHeader(headers, ["アウトソール", "outsole length", "outsole"]);

  // TOPS / HOODIES
  if (p.type === "top" || p.type === "hoodie") {
    if (!sizeCol || !chestHalfCol) {
      renderResultNone();
      return;
    }

    if (state.lastMode === "garment") {
      const half = parseNumberLoose($("#favHalfChest")?.value);
      if (Number.isNaN(half) || half <= 0) {
        renderResultNone();
        return;
      }

      const best = nearestRowByColumn(rows, chestHalfCol, half);
      if (!best) { renderResultNone(); return; }

      const size = best[sizeCol] ?? "";
      const why = t.whyGarment(fmt(half), labelForWhy(chestHalfCol));
      renderResultOk(size, why);
      return;
    }

    // body mode
    const nude = parseNumberLoose($("#nudeChest")?.value);
    if (Number.isNaN(nude) || nude <= 0) {
      renderResultNone();
      return;
    }

    // ease presets
    const easeSel = $("#ease")?.value || "std";
    const ease = getEaseValue(easeSel);
    const targetChest = nude + ease;

    // Convert target chest to half width for matching:
    const targetHalf = targetChest / 2;

    const best = nearestRowByColumn(rows, chestHalfCol, targetHalf);
    if (!best) { renderResultNone(); return; }

    const size = best[sizeCol] ?? "";
    const why = t.whyBody(fmt(nude), fmt(ease), fmt(targetChest), labelForWhy(chestHalfCol));
    renderResultOk(size, why);
    return;
  }

  // SHOES
  if (p.type === "shoes") {
    // Size display column could be "サイズ" (JP cm CSV) or "US" etc (inch CSV)
    const footKey = footLenCol || pickFirstExistingHeader(headers, ["足長", "foot"]);
    if (!footKey) { renderResultNone(); return; }

    const foot = parseNumberLoose($("#footLen")?.value);
    if (Number.isNaN(foot) || foot <= 0) { renderResultNone(); return; }

    const allowSel = $("#allow")?.value || "std";
    const allow = getAllowanceValue(allowSel);
    const target = foot + allow;

    const best = smallestThatFits(rows, footKey, target) || nearestRowByColumn(rows, footKey, target);
    if (!best) { renderResultNone(); return; }

    // Decide how to show size text
    let sizeText = "";

    // JP cm shoes: "サイズ" column
    const jpSizeCol = pickFirstExistingHeader(headers, ["サイズ"]);
    if (jpSizeCol) {
      sizeText = best[jpSizeCol] ?? "";
    } else {
      // EN shoes: prefer US + EU
      const us = pickFirstExistingHeader(headers, ["US", "us"]);
      const uk = pickFirstExistingHeader(headers, ["UK", "uk"]);
      const eu = pickFirstExistingHeader(headers, ["EU", "eu"]);
      const parts = [];
      if (us) parts.push(`US ${best[us]}`);
      if (uk) parts.push(`UK ${best[uk]}`);
      if (eu) parts.push(`EU ${best[eu]}`);
      sizeText = parts.join(" / ") || t.notFound;
    }

    const why = t.whyShoes(fmt(foot), fmt(allow), fmt(target), labelForWhy(footKey));
    renderResultOk(sizeText, why);
    return;
  }

  renderResultNone();

  // local helpers for why
  function labelForWhy(col) {
    // show friendly name
    const nh = normalizeHeader(col);
    if (p.type === "shoes") {
      return (state.lang==="jp") ? "足の長さ" : "Foot length";
    }
    if (nh.includes("身幅") || nh.includes("chest") || nh.includes("width")) {
      return (state.lang==="jp") ? "身幅（平置き）" : "Chest width (flat)";
    }
    return col;
  }

  function getEaseValue(sel) {
    if (state.unit === "cm") {
      if (sel === "tight") return 8;
      if (sel === "relax") return 12;
      return 10; // std
    } else {
      if (sel === "tight") return 3;
      if (sel === "relax") return 5;
      return 4;
    }
  }

  function getAllowanceValue(sel) {
    if (state.unit === "cm") {
      if (sel === "small") return 0.7;
      if (sel === "large") return 1.2;
      return 1.0;
    } else {
      if (sel === "small") return 0.3;
      if (sel === "large") return 0.5;
      return 0.4;
    }
  }
}

function bindCalc() {
  $("#calcBtn")?.addEventListener("click", computeRecommendation);
}

// ---- Load CSV and render all ----
async function loadCSV(path) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load: ${path}`);
  const text = await res.text();
  return parseCSV(text);
}

async function loadAndRender() {
  state.product = PRODUCTS.find(p => p.id === state.productId) || PRODUCTS[0];

  renderProductOptions();
  renderGuide();
  renderInputArea();
  renderNotice();

  // Load CSV based on unit (JP->cm / EN->inch)
  const csvPath = state.product.csv[state.unit];
  try {
    const parsed = await loadCSV(csvPath);
    state.headers = parsed.headers;
    state.csvRows = parsed.rows;

    renderTable(state.headers, state.csvRows);

    // reset result area to a calm default (not error)
    el.resultBox.innerHTML = `
      <div class="result__title">${safeText(I18N[state.lang].resultTitle)}</div>
      <div class="result__why">${safeText(state.lang==="jp"
        ? "入力があればおすすめを表示します。入力なしの場合はサイズ表をご確認ください。"
        : "Enter optional values to get a recommendation. Otherwise, use the size table."
      )}</div>
    `;

    bindCalc();
  } catch (e) {
    // if CSV missing or fetch blocked, show friendly
    renderResultNone();
    el.tableHead.innerHTML = "";
    el.tableBody.innerHTML = "";
  }
}

// ---- Events ----
el.langJP.addEventListener("click", () => setLang("jp"));
el.langEN.addEventListener("click", () => setLang("en"));

el.productSelect.addEventListener("change", () => {
  state.productId = el.productSelect.value;
  // keep lastMode for tops/hoodies; shoes ignores it
  loadAndRender();
});

// ---- Init ----
(function init(){
  state.lang = isJaBrowser() ? "jp" : "en";
  state.unit = (state.lang === "jp") ? "cm" : "inch";
  renderStaticText();
  renderProductOptions();
  loadAndRender();
})();
