/* TCDA Size Guide - app.js (Full Rewrite)
   - JP/EN tabs
   - JP => cm / EN => inch (auto)
   - Product list labels simplified
   - No "Copy table" / "Download CSV"
   - Image note switches by language
*/

const T = {
  JP: {
    lang: "JP",
    unit: "cm",
    labelProduct: "商品",
    guideTitle: "採寸ガイド",
    tableTitle: "サイズ表",
    hint: "※ 商品を選択 → 自動で cm 表示（JP）",
    imageNote: "※ 画像は商品に応じて切り替わります",
    statusSelect: "商品を選択してください。",
    statusLoading: "読み込み中…",
    statusError: "読み込みに失敗しました。CSVのパス/ファイル名を確認してください。",
    ariaGuideAlt: "採寸ガイド画像",
  },
  EN: {
    lang: "EN",
    unit: "inch",
    labelProduct: "Item",
    guideTitle: "Size Guide",
    tableTitle: "Size Table",
    hint: "Select an item → auto shows inches (EN)",
    imageNote: "Image changes by product.",
    statusSelect: "Please select an item.",
    statusLoading: "Loading…",
    statusError: "Failed to load. Check CSV path/filename.",
    ariaGuideAlt: "Size guide image",
  }
};

// ★ あなたのリポジトリ構成に合わせたパス
// 画像：/assets/guide_***.jpg
// CSV ：/data/*.csv
const PRODUCTS = [
  {
    id: "womens_slipon",
    name: { JP: "Women's slip-on canvas shoes", EN: "Women's slip-on canvas shoes" },
    guideImage: "assets/guide_slipon.jpg",
    csv: { cm: "data/womens_slipon_cm.csv", inch: "data/womens_slipon_inch.csv" }
  },
  {
    id: "mens_slipon",
    name: { JP: "Men's slip-on canvas shoes", EN: "Men's slip-on canvas shoes" },
    guideImage: "assets/guide_slipon.jpg",
    csv: { cm: "data/mens_slipon_cm.csv", inch: "data/mens_slipon_inch.csv" }
  },
  {
    id: "womens_crew",
    name: { JP: "Women's Crew Neck T-Shirt", EN: "Women's Crew Neck T-Shirt" },
    guideImage: "assets/guide_tshirt.jpg",
    csv: { cm: "data/aop_womens_crew_cm.csv", inch: "data/aop_womens_crew_inch.csv" }
  },
  {
    id: "mens_crew",
    name: { JP: "Men's crew neck T-shirt", EN: "Men's crew neck T-shirt" },
    guideImage: "assets/guide_tshirt.jpg",
    csv: { cm: "data/aop_mens_crew_cm.csv", inch: "data/aop_mens_crew_inch.csv" }
  },
  {
    id: "unisex_hoodie",
    name: { JP: "Unisex Hoodie", EN: "Unisex Hoodie" },
    guideImage: "assets/guide_hoodie.jpg",
    csv: { cm: "data/aop_recycled_hoodie_cm.csv", inch: "data/aop_recycled_hoodie_inch.csv" }
  },
  {
    id: "unisex_zip_hoodie",
    name: { JP: "Unisex ZIP Hoodie", EN: "Unisex ZIP Hoodie" },
    guideImage: "assets/guide_zip_hoodie.jpg",
    csv: { cm: "data/aop_recycled_zip_hoodie_cm.csv", inch: "data/aop_recycled_zip_hoodie_inch.csv" }
  }
];

// ---------- DOM ----------
const els = {
  btnJP: document.getElementById("btnLangJP"),
  btnEN: document.getElementById("btnLangEN"),
  labelProduct: document.getElementById("labelProduct"),
  productSelect: document.getElementById("productSelect"),
  unitLabel: document.getElementById("unitLabel"),
  hintText: document.getElementById("hintText"),

  guideTitle: document.getElementById("guideTitle"),
  guideImage: document.getElementById("guideImage"),
  imageNote: document.getElementById("imageNote"),

  tableTitle: document.getElementById("tableTitle"),
  statusText: document.getElementById("statusText"),
  sizeTable: document.getElementById("sizeTable"),
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
  unit: "cm",   // JP=>cm / EN=>inch
  productId: "" // selected product id
};

// ---------- helpers ----------
function getTr() {
  return T[state.lang];
}

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

  // lang => unit auto
  state.unit = (state.lang === "JP") ? "cm" : "inch";
}

function buildProductOptions() {
  const tr = getTr();

  // select を作り直す
  els.productSelect.innerHTML = "";

  // placeholder
  const opt0 = document.createElement("option");
  opt0.value = "";
  opt0.textContent = (state.lang === "JP") ? "選択してください" : "Select an item";
  els.productSelect.appendChild(opt0);

  for (const p of PRODUCTS) {
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.textContent = p.name[tr.lang] || p.name.EN || p.id;
    els.productSelect.appendChild(opt);
  }

  // saved selection
  if (state.productId && PRODUCTS.some(p => p.id === state.productId)) {
    els.productSelect.value = state.productId;
  } else {
    els.productSelect.value = "";
    state.productId = "";
  }
}

function setTexts() {
  const tr = getTr();

  els.labelProduct.textContent = tr.labelProduct;
  els.guideTitle.textContent = tr.guideTitle;
  els.tableTitle.textContent = tr.tableTitle;
  els.hintText.textContent = tr.hint;
  els.imageNote.textContent = tr.imageNote;

  els.unitLabel.textContent = tr.unit;

  const year = new Date().getFullYear();
  els.footerText.textContent = `© Transcend Color Digital Apparel ${year}`;
}

function clearTable() {
  els.thead.innerHTML = "";
  els.tbody.innerHTML = "";
}

function setStatus(text) {
  els.statusText.textContent = text || "";
}

function getSelectedProduct() {
  return PRODUCTS.find(p => p.id === state.productId) || null;
}

function setGuideImage(product) {
  const tr = getTr();

  if (!product) {
    els.guideImage.src = "";
    els.guideImage.alt = "";
    els.guideImage.style.display = "none";
    return;
  }

  els.guideImage.src = product.guideImage;
  els.guideImage.alt = tr.ariaGuideAlt;
  els.guideImage.style.display = "block";
}

// --- CSV parse (simple but works for your current CSVs) ---
function parseCSV(text) {
  // normalize line breaks
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) return { headers: [], rows: [] };

  const rows = lines.map(line => {
    // handle basic quoted commas (minimal)
    const out = [];
    let cur = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === "," && !inQuotes) {
        out.push(cur.trim());
        cur = "";
      } else {
        cur += ch;
      }
    }
    out.push(cur.trim());
    return out.map(v => v.replace(/^"|"$/g, ""));
  });

  const headers = rows[0];
  const body = rows.slice(1);
  return { headers, rows: body };
}

function renderTable(headers, rows) {
  clearTable();

  // THEAD
  const trHead = document.createElement("tr");
  for (const h of headers) {
    const th = document.createElement("th");
    th.textContent = h;
    trHead.appendChild(th);
  }
  els.thead.appendChild(trHead);

  // TBODY
  for (const r of rows) {
    const tr = document.createElement("tr");
    for (let i = 0; i < headers.length; i++) {
      const td = document.createElement("td");
      td.textContent = (r[i] ?? "");
      tr.appendChild(td);
    }
    els.tbody.appendChild(tr);
  }
}

async function loadAndRender() {
  const tr = getTr();
  const product = getSelectedProduct();

  setGuideImage(product);
  clearTable();

  if (!product) {
    setStatus(tr.statusSelect);
    return;
  }

  setStatus(tr.statusLoading);

  // unit auto by lang
  const csvPath = (state.unit === "cm") ? product.csv.cm : product.csv.inch;

  try {
    const res = await fetch(csvPath, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();

    const { headers, rows } = parseCSV(text);
    renderTable(headers, rows);
    setStatus("");
  } catch (e) {
    console.error(e);
    setStatus(tr.statusError);
  }
}

function applyLanguage(lang) {
  state.lang = lang;
  state.unit = (lang === "JP") ? "cm" : "inch";

  setActiveLangUI();
  setTexts();
  buildProductOptions();
  saveState();

  // re-render (unit changes => csv changes)
  loadAndRender();
}

function onProductChange() {
  state.productId = els.productSelect.value || "";
  saveState();
  loadAndRender();
}

// ---------- init ----------
function init() {
  loadState();

  // button events
  els.btnJP.addEventListener("click", () => applyLanguage("JP"));
  els.btnEN.addEventListener("click", () => applyLanguage("EN"));

  // select event
  els.productSelect.addEventListener("change", onProductChange);

  // initial paint
  setActiveLangUI();
  setTexts();
  buildProductOptions();
  loadAndRender();
}

document.addEventListener("DOMContentLoaded", init);
