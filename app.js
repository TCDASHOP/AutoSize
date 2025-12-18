/* TCDA Size Guide — device-consistent rewrite (custom dropdown + smart inputs + highlight row) */

const $ = (q) => document.querySelector(q);

const el = {
  langJP: $("#langJP"),
  langEN: $("#langEN"),
  unitCM: $("#unitCM"),
  unitIN: $("#unitIN"),

  productBtn: $("#productBtn"),
  productBtnText: $("#productBtnText"),
  productList: $("#productList"),
  productDropdown: $("#productDropdown"),

  guideImage: $("#guideImage"),
  legendText: $("#legendText"),

  inputArea: $("#inputArea"),
  calcBtn: $("#calcBtn"),
  noticeBox: $("#noticeBox"),
  resultBox: $("#resultBox"),
  basisLine: $("#basisLine"),
  errorBox: $("#errorBox"),

  btnFix: $("#btnFix"),
  btnTable: $("#btnTable"),

  tableCard: $("#tableCard"),
  tableHead: $("#tableHead"),
  tableBody: $("#tableBody"),
};

const state = {
  lang: "jp",
  unit: "cm",
  productId: null,
  tableRows: [],
  lastHighlighted: null,
};

// 1) Products (file paths match your repo screenshots)
const PRODUCTS = [
  {
    id: "womens_slipon",
    type: "shoes",
    guideImg: "./assets/guide_slipon.jpg",
    csv: { cm: "./data/womens_slipon_cm.csv", inch: "./data/womens_slipon_inch.csv" },
    label: {
      jp: { main: "ウィメンズ", sub: "スリッポン" },
      en: { main: "Women’s", sub: "Slip-On Canvas Shoes" },
    },
    notes: {
      jp: [
        "主役は足長（左右を測り、長い方を採用）。",
        "足長＋捨て寸（目安 7〜12mm）で選ぶ。",
        "アウトソール長は外寸。足長と同一視しない。",
      ],
      en: [
        "Use foot length (measure both; use the longer one).",
        "Choose by foot length + toe room (about 7–12mm).",
        "Outsole length is the outer length; do not treat it as foot length.",
      ],
    },
  },
  {
    id: "mens_slipon",
    type: "shoes",
    guideImg: "./assets/guide_slipon.jpg",
    csv: { cm: "./data/mens_slipon_cm.csv", inch: "./data/mens_slipon_inch.csv" },
    label: {
      jp: { main: "メンズ", sub: "スリッポン" },
      en: { main: "Men’s", sub: "Slip-On Canvas Shoes" },
    },
    notes: {
      jp: [
        "主役は足長（左右を測り、長い方を採用）。",
        "足長＋捨て寸（目安 7〜12mm）で選ぶ。",
        "アウトソール長は外寸。足長と同一視しない。",
      ],
      en: [
        "Use foot length (measure both; use the longer one).",
        "Choose by foot length + toe room (about 7–12mm).",
        "Outsole length is the outer length; do not treat it as foot length.",
      ],
    },
  },
  {
    id: "aop_womens_crew",
    type: "tops",
    guideImg: "./assets/guide_tshirt.jpg",
    csv: { cm: "./data/aop_womens_crew_cm.csv", inch: "./data/aop_womens_crew_inch.csv" },
    label: {
      jp: { main: "ウィメンズ", sub: "クルーネックT" },
      en: { main: "Women’s Crew Neck", sub: "T-Shirt" },
    },
    notes: {
      jp: [
        "基本：ヌード胸囲 → 仕上がり胸囲（身幅×2）で比較。",
        "迷ったら動きやすさ重視で 1 サイズ上も検討。",
      ],
      en: [
        "Basic: body chest → compare with garment chest (flat chest ×2).",
        "If unsure, consider 1 size up for comfort/movement.",
      ],
    },
  },
  {
    id: "aop_mens_crew",
    type: "tops",
    guideImg: "./assets/guide_tshirt.jpg",
    csv: { cm: "./data/aop_mens_crew_cm.csv", inch: "./data/aop_mens_crew_inch.csv" },
    label: {
      jp: { main: "メンズ", sub: "クルーネックT" },
      en: { main: "Men’s Crew Neck", sub: "T-Shirt" }, // ←2行表示OK
    },
    notes: {
      jp: [
        "基本：ヌード胸囲 → 仕上がり胸囲（身幅×2）で比較。",
        "迷ったら動きやすさ重視で 1 サイズ上も検討。",
      ],
      en: [
        "Basic: body chest → compare with garment chest (flat chest ×2).",
        "If unsure, consider 1 size up for comfort/movement.",
      ],
    },
  },
  {
    id: "aop_recycled_hoodie",
    type: "tops",
    guideImg: "./assets/guide_hoodie.jpg",
    csv: { cm: "./data/aop_recycled_hoodie_cm.csv", inch: "./data/aop_recycled_hoodie_inch.csv" },
    label: {
      jp: { main: "ユニセックス", sub: "パーカー" },
      en: { main: "Unisex", sub: "Hoodie" },
    },
    notes: {
      jp: [
        "基本：Tシャツと同じ（胸囲→身幅→着丈→袖）。",
        "フーディは生地/リブで体感が変わる。迷ったら少しゆとり。",
      ],
      en: [
        "Same logic as tees (chest → width → length → sleeve).",
        "Hoodies can feel different due to fabric/rib; choose slightly roomier if unsure.",
      ],
    },
  },
  {
    id: "aop_recycled_zip_hoodie",
    type: "tops",
    guideImg: "./assets/guide_zip_hoodie.jpg",
    csv: { cm: "./data/aop_recycled_zip_hoodie_cm.csv", inch: "./data/aop_recycled_zip_hoodie_inch.csv" },
    label: {
      jp: { main: "ユニセックス", sub: "ジップパーカー" },
      en: { main: "Unisex Zip", sub: "Hoodie" },
    },
    notes: {
      jp: [
        "基本：Tシャツと同じ（胸囲→身幅→着丈→袖）。",
        "ジップは前開き分、インナー厚で体感が変わる。迷ったら少しゆとり。",
      ],
      en: [
        "Same logic as tees (chest → width → length → sleeve).",
        "Zip hoodies may feel different with layers; choose slightly roomier if unsure.",
      ],
    },
  },
];

// 2) Labels
const I18N = {
  jp: {
    guideTitle: "採寸ガイド",
    guideNote: "※画像は商品に応じて切り替わります",
    legendTops: "A：身幅 / B：着丈 / C：袖丈",
    legendShoes: "足長 / アウトソールの長さ",
    inputTitle: "サイズ算出（任意入力）",
    inputNote: "入力しなくてもサイズ表だけ見て選べます",
    product: "商品",
    calc: "おすすめサイズを計算",
    notes: "選ぶときの注意事項",
    rec: "おすすめ",
    table: "サイズ表",
    tableNote: "数値は平置き採寸です（誤差 ±1〜2）",
    errNeedInput: "入力がありません。サイズ表で選ぶか、数値を入力してください。",
    btnFix: "入力を見直す",
    btnTable: "サイズ表で選ぶ",

    // inputs
    bodyChest: "ヌード胸囲",
    ease: "ゆとり（目安）",
    footLength: "足長（かかと〜一番長い指）",
    toeRoom: "捨て寸（目安）",
    placeholderNumber: "例：88",

    // ease options (cm/in)
    easeStdCm: "標準（+8cm 目安）",
    easeLooseCm: "ゆったり（+10cm 目安）",
    easeMoreCm: "かなりゆったり（+12cm 目安）",
    easeStdIn: "Standard (+3.1 in)",
    easeLooseIn: "Loose (+3.9 in)",
    easeMoreIn: "More loose (+4.7 in)",

    toe07cm: "+0.7cm（標準）",
    toe10cm: "+1.0cm（ゆったり）",
    toe12cm: "+1.2cm（かなりゆったり）",
    toe03in: "+0.3 in (standard)",
    toe04in: "+0.4 in (loose)",
    toe05in: "+0.5 in (more)",

    // result phrases
    recPrefix: "おすすめ：",
    basisPrefix: "根拠：",
  },
  en: {
    guideTitle: "Measuring Guide",
    guideNote: "Image changes by product.",
    legendTops: "A: Half Chest Width / B: Body Length / C: Sleeve Length",
    legendShoes: "Foot Length / Outsole Length",
    inputTitle: "Size recommendation (optional input)",
    inputNote: "You can also choose from the size table without input.",
    product: "Product",
    calc: "Calculate recommended size",
    notes: "Notes when choosing",
    rec: "Recommended",
    table: "Size Table",
    tableNote: "Values are flat measurements (±1–2).",
    errNeedInput: "No input. Please enter a value, or choose from the size table.",
    btnFix: "Review input",
    btnTable: "Choose from table",

    bodyChest: "Body chest",
    ease: "Ease (guide)",
    footLength: "Foot length (heel → longest toe)",
    toeRoom: "Toe room (guide)",
    placeholderNumber: "e.g. 34.6",

    easeStdCm: "Standard (+8cm)",
    easeLooseCm: "Loose (+10cm)",
    easeMoreCm: "More (+12cm)",
    easeStdIn: "Standard (+3.1 in)",
    easeLooseIn: "Loose (+3.9 in)",
    easeMoreIn: "More (+4.7 in)",

    toe07cm: "+0.7cm (standard)",
    toe10cm: "+1.0cm (loose)",
    toe12cm: "+1.2cm (more)",
    toe03in: "+0.3 in (standard)",
    toe04in: "+0.4 in (loose)",
    toe05in: "+0.5 in (more)",

    recPrefix: "Recommended: ",
    basisPrefix: "Basis: ",
  }
};

// 3) CSV utils
function splitCSVLine(line) {
  const out = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQ && line[i + 1] === '"') { cur += '"'; i++; }
      else inQ = !inQ;
    } else if (ch === "," && !inQ) {
      out.push(cur.trim());
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur.trim());
  return out;
}

function parseCSV(text) {
  const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n").filter(l => l.trim().length);
  if (!lines.length) return [];
  const headers = splitCSVLine(lines[0]).map(h => h.replace(/^"|"$/g, "").trim());
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = splitCSVLine(lines[i]).map(c => c.replace(/^"|"$/g, "").trim());
    const obj = {};
    headers.forEach((h, idx) => obj[h] = (cols[idx] ?? ""));
    rows.push(obj);
  }
  return rows;
}

function toNum(v) {
  if (v === null || v === undefined) return NaN;
  const s = String(v).replace(/[^\d.\-]/g, "");
  const n = Number(s);
  return Number.isFinite(n) ? n : NaN;
}

// normalize columns across JP/EN headers
function normalizeRows(raw) {
  const norm = [];
  for (const r of raw) {
    const size =
      r["Size"] ?? r["サイズ"] ?? r["size"] ?? r["SIZE"] ?? "";

    // tops
    const chestFlat =
      toNum(r["Chest (flat)"] ?? r["Chest(flat)"] ?? r["身幅"] ?? r["身幅（平置き）"] ?? r["身幅(平置き)"]);

    const length =
      toNum(r["Length"] ?? r["Body Length"] ?? r["着丈"] ?? r["長さ"]);

    const sleeve =
      toNum(r["Sleeve length"] ?? r["Sleeve Length"] ?? r["袖丈"] ?? r["袖の長さ"]);

    // shoes
    const footLength =
      toNum(r["Foot length"] ?? r["Foot Length"] ?? r["足の長さ"] ?? r["足長"] ?? r["足長さ"]);

    const outsoleLength =
      toNum(r["Outsole length"] ?? r["Outsole Length"] ?? r["アウトソールの長さ"] ?? r["アウトソール長"] ?? r["アウトソール長さ"]);

    norm.push({
      size: String(size).trim(),
      chestFlat, length, sleeve,
      footLength, outsoleLength,
      _raw: r
    });
  }
  // filter invalid size rows
  return norm.filter(x => x.size && x.size !== "—");
}

async function loadCSV(path) {
  const res = await fetch(path + (path.includes("?") ? "" : `?v=${Date.now()}`), { cache: "no-store" });
  if (!res.ok) throw new Error("CSV load failed: " + path);
  const text = await res.text();
  return normalizeRows(parseCSV(text));
}

// 4) UI helpers
function setSeg(activeBtn, inactiveBtn) {
  activeBtn.classList.add("isOn");
  inactiveBtn.classList.remove("isOn");
}

function t() { return I18N[state.lang]; }

function closeDropdown() {
  el.productList.classList.remove("isOpen");
  el.productBtn.setAttribute("aria-expanded", "false");
}

function openDropdown() {
  el.productList.classList.add("isOpen");
  el.productBtn.setAttribute("aria-expanded", "true");
}

function renderDropdown() {
  el.productList.innerHTML = "";
  for (const p of PRODUCTS) {
    const item = document.createElement("div");
    item.className = "ddItem" + (p.id === state.productId ? " isSel" : "");
    item.setAttribute("role", "option");
    item.dataset.id = p.id;

    const main = document.createElement("div");
    main.className = "ddMain";
    main.textContent = p.label[state.lang].main;

    const sub = document.createElement("div");
    sub.className = "ddSub";
    sub.textContent = p.label[state.lang].sub;

    item.appendChild(main);
    item.appendChild(sub);

    item.addEventListener("click", () => {
      selectProduct(p.id);
      closeDropdown();
    });

    el.productList.appendChild(item);
  }
}

function currentProduct() {
  return PRODUCTS.find(p => p.id === state.productId) || PRODUCTS[0];
}

function setGuide(product) {
  el.guideImage.src = product.guideImg;
  el.legendText.textContent = product.type === "shoes" ? t().legendShoes : t().legendTops;
}

function clearResult() {
  el.resultBox.textContent = "—";
  el.basisLine.textContent = "";
  el.errorBox.hidden = true;
  el.errorBox.textContent = "";
  if (state.lastHighlighted) {
    state.lastHighlighted.classList.remove("trHilite");
    state.lastHighlighted = null;
  }
}

function scrollTo(elm) {
  elm.scrollIntoView({ behavior: "smooth", block: "start" });
}

// 5) Inputs (show only required by product type)
function renderInputs(product) {
  el.inputArea.innerHTML = "";

  if (product.type === "tops") {
    const row = document.createElement("div");
    row.className = "row2";

    const f1 = document.createElement("div");
    f1.className = "field";
    const l1 = document.createElement("label");
    l1.textContent = `${t().bodyChest} (${state.unit})`;
    const i1 = document.createElement("input");
    i1.id = "inpChest";
    i1.className = "input";
    i1.inputMode = "decimal";
    i1.placeholder = t().placeholderNumber;
    f1.appendChild(l1); f1.appendChild(i1);

    const f2 = document.createElement("div");
    f2.className = "field";
    const l2 = document.createElement("label");
    l2.textContent = t().ease;
    const s2 = document.createElement("select");
    s2.id = "selEase";
    const opts = state.unit === "cm"
      ? [
          { v: "8",  label: t().easeStdCm },
          { v: "10", label: t().easeLooseCm },
          { v: "12", label: t().easeMoreCm },
        ]
      : [
          { v: "3.1", label: t().easeStdIn },
          { v: "3.9", label: t().easeLooseIn },
          { v: "4.7", label: t().easeMoreIn },
        ];
    for (const o of opts) {
      const op = document.createElement("option");
      op.value = o.v;
      op.textContent = o.label;
      s2.appendChild(op);
    }
    f2.appendChild(l2); f2.appendChild(s2);

    row.appendChild(f1);
    row.appendChild(f2);
    el.inputArea.appendChild(row);

  } else {
    const row = document.createElement("div");
    row.className = "row2";

    const f1 = document.createElement("div");
    f1.className = "field";
    const l1 = document.createElement("label");
    l1.textContent = `${t().footLength} (${state.unit})`;
    const i1 = document.createElement("input");
    i1.id = "inpFoot";
    i1.className = "input";
    i1.inputMode = "decimal";
    i1.placeholder = state.unit === "cm" ? "例：23.5" : "e.g. 9.25";
    f1.appendChild(l1); f1.appendChild(i1);

    const f2 = document.createElement("div");
    f2.className = "field";
    const l2 = document.createElement("label");
    l2.textContent = t().toeRoom;
    const s2 = document.createElement("select");
    s2.id = "selToe";
    const opts = state.unit === "cm"
      ? [
          { v: "0.7", label: t().toe07cm },
          { v: "1.0", label: t().toe10cm },
          { v: "1.2", label: t().toe12cm },
        ]
      : [
          { v: "0.3", label: t().toe03in },
          { v: "0.4", label: t().toe04in },
          { v: "0.5", label: t().toe05in },
        ];
    for (const o of opts) {
      const op = document.createElement("option");
      op.value = o.v;
      op.textContent = o.label;
      s2.appendChild(op);
    }
    f2.appendChild(l2); f2.appendChild(s2);

    row.appendChild(f1);
    row.appendChild(f2);
    el.inputArea.appendChild(row);
  }
}

// 6) Notes
function renderNotes(product) {
  const lines = product.notes[state.lang] || [];
  const ul = document.createElement("ul");
  for (const s of lines) {
    const li = document.createElement("li");
    li.textContent = s;
    ul.appendChild(li);
  }
  el.noticeBox.innerHTML = "";
  el.noticeBox.appendChild(ul);
}

// 7) Table render
function renderTable(product) {
  const isShoes = product.type === "shoes";

  const headCells = isShoes
    ? (state.lang === "jp"
        ? ["サイズ", "アウトソールの長さ", "足の長さ"]
        : ["Size", "Outsole length", "Foot length"])
    : (state.lang === "jp"
        ? ["サイズ", "身幅", "丈", "袖丈"]
        : ["Size", "Chest (flat)", "Length", "Sleeve length"]);

  const tr = document.createElement("tr");
  for (const h of headCells) {
    const th = document.createElement("th");
    th.textContent = h;
    tr.appendChild(th);
  }
  el.tableHead.innerHTML = "";
  el.tableHead.appendChild(tr);

  el.tableBody.innerHTML = "";

  state.tableRows.forEach((r, idx) => {
    const row = document.createElement("tr");
    row.dataset.idx = String(idx);

    const tdSize = document.createElement("td");
    tdSize.textContent = r.size;

    row.appendChild(tdSize);

    if (isShoes) {
      const tdOut = document.createElement("td");
      tdOut.textContent = Number.isFinite(r.outsoleLength) ? String(r.outsoleLength) : "—";
      const tdFoot = document.createElement("td");
      tdFoot.textContent = Number.isFinite(r.footLength) ? String(r.footLength) : "—";
      row.appendChild(tdOut);
      row.appendChild(tdFoot);
    } else {
      const tdChest = document.createElement("td");
      tdChest.textContent = Number.isFinite(r.chestFlat) ? String(r.chestFlat) : "—";
      const tdLen = document.createElement("td");
      tdLen.textContent = Number.isFinite(r.length) ? String(r.length) : "—";
      const tdSlv = document.createElement("td");
      tdSlv.textContent = Number.isFinite(r.sleeve) ? String(r.sleeve) : "—";
      row.appendChild(tdChest);
      row.appendChild(tdLen);
      row.appendChild(tdSlv);
    }

    // click to select size (manual choice)
    row.addEventListener("click", () => {
      clearResult();
      el.resultBox.textContent = `${t().recPrefix}${r.size}`;
      el.basisLine.textContent = state.lang === "jp"
        ? "根拠：サイズ表から選択"
        : "Basis: chosen from size table";
      highlightRow(row);
    });

    el.tableBody.appendChild(row);
  });
}

function highlightRow(tr) {
  if (state.lastHighlighted) state.lastHighlighted.classList.remove("trHilite");
  tr.classList.add("trHilite");
  state.lastHighlighted = tr;
  tr.scrollIntoView({ behavior: "smooth", block: "center" });
}

// 8) Recommendation logic
function recommendForTops() {
  const chest = toNum($("#inpChest")?.value);
  const ease = toNum($("#selEase")?.value);

  if (!Number.isFinite(chest)) return { ok:false, err: t().errNeedInput };

  // target garment chest (finished) = body chest + ease
  const target = chest + (Number.isFinite(ease) ? ease : 0);

  // find smallest size where chestFlat*2 >= target
  const candidates = state.tableRows
    .map((r, idx) => ({ r, idx, garmentChest: r.chestFlat * 2 }))
    .filter(x => Number.isFinite(x.r.chestFlat) && Number.isFinite(x.garmentChest))
    .sort((a,b) => a.garmentChest - b.garmentChest);

  const pick = candidates.find(x => x.garmentChest >= target) || candidates[candidates.length - 1];
  if (!pick) return { ok:false, err: "No data" };

  const basis = state.lang === "jp"
    ? `${t().basisPrefix}${chest}${state.unit} + ゆとり ${Number.isFinite(ease)? ease:0}${state.unit} = ${target.toFixed(1)}${state.unit} → 仕上がり胸囲(身幅×2)が以上の最小サイズ`
    : `${t().basisPrefix}${chest}${state.unit} + ease ${Number.isFinite(ease)? ease:0}${state.unit} = ${target.toFixed(1)}${state.unit} → smallest size where (flat chest×2) ≥ target`;

  return { ok:true, size: pick.r.size, idx: pick.idx, basis };
}

function recommendForShoes() {
  const foot = toNum($("#inpFoot")?.value);
  const toe = toNum($("#selToe")?.value);

  if (!Number.isFinite(foot)) return { ok:false, err: t().errNeedInput };

  const target = foot + (Number.isFinite(toe) ? toe : 0);

  const candidates = state.tableRows
    .map((r, idx) => ({ r, idx }))
    .filter(x => Number.isFinite(x.r.footLength))
    .sort((a,b) => a.r.footLength - b.r.footLength);

  const pick = candidates.find(x => x.r.footLength >= target) || candidates[candidates.length - 1];
  if (!pick) return { ok:false, err: "No data" };

  const basis = state.lang === "jp"
    ? `${t().basisPrefix}${foot}${state.unit} + 捨て寸 ${Number.isFinite(toe)? toe:0}${state.unit} = ${target.toFixed(1)}${state.unit} → 足の長さが以上の最小サイズ`
    : `${t().basisPrefix}${foot}${state.unit} + toe room ${Number.isFinite(toe)? toe:0}${state.unit} = ${target.toFixed(2)}${state.unit} → smallest size where foot length ≥ target`;

  return { ok:true, size: pick.r.size, idx: pick.idx, basis };
}

// 9) Main select flow
async function selectProduct(id) {
  state.productId = id;
  const p = currentProduct();

  // button label (2 lines)
  const L = p.label[state.lang];
  el.productBtnText.innerHTML = `
    <span class="ddMain">${escapeHTML(L.main)}</span>
    <span class="ddSub">${escapeHTML(L.sub)}</span>
  `;

  renderDropdown();
  setGuide(p);
  renderInputs(p);
  renderNotes(p);
  clearResult();

  // load table
  try {
    const path = p.csv[state.unit];
    state.tableRows = await loadCSV(path);
    renderTable(p);
  } catch (e) {
    state.tableRows = [];
    el.tableHead.innerHTML = "";
    el.tableBody.innerHTML = "";
    el.errorBox.hidden = false;
    el.errorBox.textContent = "データ読み込みに失敗しました。CSVパス/ファイル名を確認してください。";
  }
}

function escapeHTML(s){
  return String(s).replace(/[&<>"']/g, (m)=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[m]));
}

// 10) Events
function applyLang(lang) {
  state.lang = lang;
  setSeg(lang === "jp" ? el.langJP : el.langEN, lang === "jp" ? el.langEN : el.langJP);

  // static labels
  $("#titleGuide").textContent = t().guideTitle;
  $("#guideNote").textContent = t().guideNote;
  $("#titleInput").textContent = t().inputTitle;
  $("#inputNote").textContent = t().inputNote;
  $("#labelProduct").textContent = t().product;
  $("#titleNotes").textContent = t().notes;
  $("#titleRec").textContent = t().rec;
  $("#titleTable").textContent = t().table;
  $("#tableNote").textContent = t().tableNote;

  el.calcBtn.textContent = t().calc;
  el.btnFix.textContent = t().btnFix;
  el.btnTable.textContent = t().btnTable;

  renderDropdown();
  // re-render selected product label + notes + inputs + table head text
  selectProduct(state.productId || PRODUCTS[0].id);
}

function applyUnit(unit) {
  state.unit = unit;
  setSeg(unit === "cm" ? el.unitCM : el.unitIN, unit === "cm" ? el.unitIN : el.unitCM);
  selectProduct(state.productId || PRODUCTS[0].id);
}

// Dropdown open/close
el.productBtn.addEventListener("click", () => {
  const open = el.productList.classList.contains("isOpen");
  if (open) closeDropdown();
  else openDropdown();
});

document.addEventListener("click", (e) => {
  if (!el.productDropdown.contains(e.target)) closeDropdown();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeDropdown();
});

el.langJP.addEventListener("click", () => applyLang("jp"));
el.langEN.addEventListener("click", () => applyLang("en"));
el.unitCM.addEventListener("click", () => applyUnit("cm"));
el.unitIN.addEventListener("click", () => applyUnit("inch"));

el.btnFix.addEventListener("click", () => {
  el.errorBox.hidden = true;
  scrollTo(el.inputArea);
});
el.btnTable.addEventListener("click", () => {
  el.errorBox.hidden = true;
  scrollTo(el.tableCard);
});

el.calcBtn.addEventListener("click", () => {
  const p = currentProduct();
  el.errorBox.hidden = true;
  el.errorBox.textContent = "";

  const res = (p.type === "shoes") ? recommendForShoes() : recommendForTops();

  if (!res.ok) {
    clearResult();
    el.errorBox.hidden = false;
    el.errorBox.textContent = res.err || t().errNeedInput;
    return;
  }

  // show result
  el.resultBox.textContent = `${t().recPrefix}${res.size}`;
  el.basisLine.textContent = res.basis || "";

  // highlight + auto scroll to row
  const tr = el.tableBody.querySelector(`tr[data-idx="${res.idx}"]`);
  if (tr) highlightRow(tr);

  // Also bring table into view (so user sees highlight even on mobile)
  scrollTo(el.tableCard);
});

// 11) Init
(function init(){
  // default
  applyLang("jp");
  applyUnit("cm");
  // product
  selectProduct(PRODUCTS[0].id);
})();
