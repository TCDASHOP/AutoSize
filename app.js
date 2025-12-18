/* =========================
   TCDA Size Guide (New)
   - JP/EN tabs
   - JP -> default cm, EN -> default inch
   - Product-specific cautions
   - Size Finder (inputs differ by product kind)
   - No copy / no csv download
========================= */

const els = {
  langJP: document.getElementById("langJP"),
  langEN: document.getElementById("langEN"),
  unitCM: document.getElementById("unitCM"),
  unitIN: document.getElementById("unitIN"),
  unitBadge: document.getElementById("unitBadge"),

  labelProduct: document.getElementById("labelProduct"),
  productSelect: document.getElementById("productSelect"),

  titleGuide: document.getElementById("titleGuide"),
  noteGuide: document.getElementById("noteGuide"),
  guideImage: document.getElementById("guideImage"),

  titleFinder: document.getElementById("titleFinder"),
  noteFinder: document.getElementById("noteFinder"),
  finderArea: document.getElementById("finderArea"),
  finderResult: document.getElementById("finderResult"),

  titleCaution: document.getElementById("titleCaution"),
  noteCaution: document.getElementById("noteCaution"),
  cautionArea: document.getElementById("cautionArea"),

  titleTable: document.getElementById("titleTable"),
  tableStatus: document.getElementById("tableStatus"),
  tableWrap: document.getElementById("tableWrap"),

  subtitle: document.getElementById("subtitle"),
  hintLine: document.getElementById("hintLine"),
  backToShop: document.getElementById("backToShop"),
  footerText: document.getElementById("footerText"),
  footerYear: document.getElementById("footerYear"),
};

const STORAGE_KEY = "tcda_sizeguide_state_v2";

const PRODUCTS = [
  {
    id: "womens_slipon",
    kind: "shoes",
    name: { JP: "Women's slip-on canvas shoes", EN: "Women's slip-on canvas shoes" },
    guideImage: "assets/guide_slipon.jpg",
    csv: { cm: "data/womens_slipon_cm.csv", inch: "data/womens_slipon_inch.csv" }
  },
  {
    id: "mens_slipon",
    kind: "shoes",
    name: { JP: "Men's slip-on canvas shoes", EN: "Men's slip-on canvas shoes" },
    guideImage: "assets/guide_slipon.jpg",
    csv: { cm: "data/mens_slipon_cm.csv", inch: "data/mens_slipon_inch.csv" }
  },
  {
    id: "womens_crew",
    kind: "tshirt",
    name: { JP: "Women's Crew Neck T-Shirt", EN: "Women's Crew Neck T-Shirt" },
    guideImage: "assets/guide_tshirt.jpg",
    csv: { cm: "data/aop_womens_crew_cm.csv", inch: "data/aop_womens_crew_inch.csv" }
  },
  {
    id: "mens_crew",
    kind: "tshirt",
    name: { JP: "Men's crew neck T-shirt", EN: "Men's crew neck T-shirt" },
    guideImage: "assets/guide_tshirt.jpg",
    csv: { cm: "data/aop_mens_crew_cm.csv", inch: "data/aop_mens_crew_inch.csv" }
  },
  {
    id: "unisex_hoodie",
    kind: "hoodie",
    name: { JP: "Unisex Hoodie", EN: "Unisex Hoodie" },
    guideImage: "assets/guide_hoodie.jpg",
    csv: { cm: "data/aop_recycled_hoodie_cm.csv", inch: "data/aop_recycled_hoodie_inch.csv" }
  },
  {
    id: "unisex_zip_hoodie",
    kind: "hoodie",
    name: { JP: "Unisex ZIP Hoodie", EN: "Unisex ZIP Hoodie" },
    guideImage: "assets/guide_zip_hoodie.jpg",
    csv: { cm: "data/aop_recycled_zip_hoodie_cm.csv", inch: "data/aop_recycled_zip_hoodie_inch.csv" }
  }
];

const I18N = {
  JP: {
    productLabel: "商品",
    guideTitle: "採寸ガイド",
    guideNote: "※ 画像は商品に応じて切り替わります",
    finderTitle: "サイズの選び方（入力）",
    finderNote: "できるだけ失敗を減らすために、必要情報だけ入力してください。",
    cautionTitle: "選ぶときの注意事項",
    cautionNote: "選択中の商品の「必要な注意事項だけ」表示します。",
    tableTitle: "サイズ表",
    statusLoading: "読み込み中…",
    statusError: "読み込みに失敗しました（CSVパス・ファイル名を確認してください）",
    hint: "商品を選択すると、採寸ガイド・注意事項・サイズ表が切り替わります。",
    backToShop: "Back to Shop",
    unitBadge: (u) => `単位: ${u}`,
    finderButton: "おすすめを計算",
    finderReset: "入力をクリア",
    resultTitle: "おすすめサイズ",
    resultSub: "表の数値と照合して最終判断してください（±誤差あり）。",
    shoes: {
      methodTitle: "足の情報を入力",
      footLength: "足長（かかと〜一番長い指）",
      allowance: "捨て寸（目安）",
      widthNote: "幅/甲が広い場合は、迷ったら大きめ寄り。",
      defaultAllowance: 1.0, // cm
      allowanceHelp: "目安 0.7〜1.2 cm（7〜12mm）",
      unitSuffix: "cm"
    },
    tops: {
      methodTitle: "入力方法を選択",
      methodA: "手持ちの服（平置き）から選ぶ（推奨）",
      methodB: "体（ヌード胸囲）から逆算する",
      chestWidth: "身幅（平置き）",
      bodyLength: "着丈（任意）",
      sleeve: "袖丈（任意）",
      nudeChest: "ヌード胸囲",
      ease: "ゆとり（目安）",
      defaultEase: 10, // cm
      easeHelp: "目安 8〜12 cm",
      unitSuffix: "cm"
    }
  },

  EN: {
    productLabel: "Item",
    guideTitle: "How to Measure",
    guideNote: "Image changes by product.",
    finderTitle: "Size Finder (Input)",
    finderNote: "Enter only what you can—this is designed to reduce mistakes.",
    cautionTitle: "Choosing Tips",
    cautionNote: "Only tips relevant to the selected item are shown.",
    tableTitle: "Size Table",
    statusLoading: "Loading…",
    statusError: "Failed to load (check CSV path / filename).",
    hint: "Selecting an item switches the guide image, tips, and size table.",
    backToShop: "Back to Shop",
    unitBadge: (u) => `Unit: ${u}`,
    finderButton: "Calculate",
    finderReset: "Clear",
    resultTitle: "Recommended Size",
    resultSub: "Please verify with the table (values may vary).",
    shoes: {
      methodTitle: "Enter foot details",
      footLength: "Foot length (heel to longest toe)",
      allowance: "Allowance (typ.)",
      widthNote: "Wide/high instep: if unsure, consider sizing up.",
      defaultAllowance: 0.39, // inch (~10mm)
      allowanceHelp: "Typical 0.28–0.47 in",
      unitSuffix: "in"
    },
    tops: {
      methodTitle: "Choose an input method",
      methodA: "Use your favorite garment (flat) (recommended)",
      methodB: "From body measurement (nude chest)",
      chestWidth: "Chest width (flat)",
      bodyLength: "Body length (optional)",
      sleeve: "Sleeve (optional)",
      nudeChest: "Nude chest circumference",
      ease: "Ease (typ.)",
      defaultEase: 4.0, // inch
      easeHelp: "Typical 3–5 in",
      unitSuffix: "in"
    }
  }
};

const CAUTIONS = {
  JP: {
    tshirt: [
      "Tシャツ（Men’s / Women’s）：Men’sはゆったり・直線的、Women’sはフィット寄りになりやすい。",
      "最短で失敗を減らす：手持ちの「いちばん好きな服」を平置きで測り、サイズ表の近い数値を選ぶ。",
      "体から逆算：ヌード胸囲＋ゆとり → 仕上がり胸囲 → 身幅（仕上がり胸囲÷2）。",
      "優先順位：身幅 → 着丈 → 袖丈（袖は肩線位置で体感が変わる）。"
    ],
    hoodie: [
      "パーカー：基本はTシャツと同じ（胸囲基準＋ゆとり→身幅→着丈→袖）。",
      "裾リブ等で体感が変わるので「同じ数値でも印象が少し違う」点に注意。",
      "最短で失敗を減らす：手持ちの“好きなパーカー/スウェット”を平置きで測って近い数値を選ぶ。",
      "優先順位：身幅 → 着丈 → 袖丈（袖は肩線位置で体感が変わる）。"
    ],
    shoes: [
      "スリッポン：足長（かかと〜一番長い指）が主役。左右を測り長い方を採用。",
      "捨て寸：足長＋7〜12mm（目安）。アウトソール長は外寸なので足長と同一視しない。",
      "幅/甲：Men’sは幅広め、Women’sはタイトになりやすい。幅広/甲高は注意（迷ったら大きめ寄り）。"
    ],
    common: "国籍でロジックは変わりません。変わるのは表記（cm/inch）と好み。見るべきは「仕上がり寸法（服）」と「足長（靴）」。"
  },

  EN: {
    tshirt: [
      "T-shirts: Men’s tends to be roomier/straighter; Women’s tends to fit closer.",
      "Fastest reliable method: measure your favorite garment flat and match the chart.",
      "From body: nude chest + ease → finished chest → chest width (flat = finished/2).",
      "Priority: chest width → length → sleeve (sleeve feel depends on shoulder seam position)."
    ],
    hoodie: [
      "Hoodies: same logic as T-shirts (chest + ease → width → length → sleeve).",
      "Ribs/hem can change perceived fit even with the same numbers.",
      "Fastest method: measure your favorite hoodie/sweatshirt flat and match the chart.",
      "Priority: chest width → length → sleeve."
    ],
    shoes: [
      "Slip-ons: foot length (heel to longest toe) is primary; measure both feet and use the longer.",
      "Allowance: foot length + ~0.28–0.47 in. Outsole length is an external reference only.",
      "Wide/high instep: if unsure, consider sizing up."
    ],
    common: "The logic is global: only units & fit culture differ. Use finished garment measurements and foot length."
  }
};

// CSV header normalization (JP/EN混在OK)
const HEADER_ALIASES = {
  "size": ["サイズ", "Size", "US", "UK", "EU"],
  "foot_length": ["足の長さ", "Foot length", "Foot Length", "leg length", "Leg length", "foot length"],
  "outsole_length": ["アウトソールの長さ", "Outsole length", "Outsole Length", "outsole length"],

  "chest_width": ["身幅", "身幅（平置き）", "Chest width", "Chest Width", "Chest (flat)", "Chest (flat) ", "Chest (Flat)"],
  "body_length": ["着丈", "Body length", "Body Length", "Length"],
  "sleeve_length": ["袖丈", "Sleeve length", "Sleeve Length", "Sleeve"]
};

let state = loadState() || {
  lang: detectLang(),
  unit: "cm",
  productId: PRODUCTS[0].id
};

// language default unit rule
if (state.lang === "JP") state.unit = "cm";
if (state.lang === "EN") state.unit = "inch";

init();

function init() {
  // footer year
  const year = new Date().getFullYear();
  els.footerText.textContent = "© Transcend Color Digital Apparel";
  els.footerYear.textContent = String(year);

  bindEvents();
  applyLanguageUI();
  buildProductOptions();
  setActiveTabs();
  renderAll();
}

function bindEvents() {
  els.langJP.addEventListener("click", () => {
    state.lang = "JP";
    state.unit = "cm"; // JP -> cm
    persist();
    applyLanguageUI();
    buildProductOptions(true);
    setActiveTabs();
    renderAll();
  });

  els.langEN.addEventListener("click", () => {
    state.lang = "EN";
    state.unit = "inch"; // EN -> inch
    persist();
    applyLanguageUI();
    buildProductOptions(true);
    setActiveTabs();
    renderAll();
  });

  els.unitCM.addEventListener("click", () => {
    state.unit = "cm";
    persist();
    setActiveTabs();
    renderAll();
  });

  els.unitIN.addEventListener("click", () => {
    state.unit = "inch";
    persist();
    setActiveTabs();
    renderAll();
  });

  els.productSelect.addEventListener("change", (e) => {
    state.productId = e.target.value;
    persist();
    renderAll();
  });
}

function applyLanguageUI() {
  const t = I18N[state.lang];

  els.labelProduct.textContent = t.productLabel;
  els.titleGuide.textContent = t.guideTitle;
  els.noteGuide.textContent = t.guideNote;
  els.titleFinder.textContent = t.finderTitle;
  els.noteFinder.textContent = t.finderNote;
  els.titleCaution.textContent = t.cautionTitle;
  els.noteCaution.textContent = t.cautionNote;
  els.titleTable.textContent = t.tableTitle;
  els.hintLine.textContent = t.hint;

  els.backToShop.textContent = t.backToShop;
  els.subtitle.textContent = "Size Guide";
}

function buildProductOptions(keepSelection = false) {
  const prev = state.productId;

  els.productSelect.innerHTML = "";
  for (const p of PRODUCTS) {
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.textContent = p.name[state.lang];
    els.productSelect.appendChild(opt);
  }

  if (keepSelection && PRODUCTS.some(p => p.id === prev)) {
    els.productSelect.value = prev;
  } else {
    els.productSelect.value = state.productId;
  }
}

function setActiveTabs() {
  const isJP = state.lang === "JP";
  els.langJP.classList.toggle("active", isJP);
  els.langEN.classList.toggle("active", !isJP);
  els.langJP.setAttribute("aria-selected", String(isJP));
  els.langEN.setAttribute("aria-selected", String(!isJP));

  const isCM = state.unit === "cm";
  els.unitCM.classList.toggle("active", isCM);
  els.unitIN.classList.toggle("active", !isCM);
  els.unitCM.setAttribute("aria-selected", String(isCM));
  els.unitIN.setAttribute("aria-selected", String(!isCM));

  els.unitBadge.textContent = I18N[state.lang].unitBadge(state.unit);
}

function renderAll() {
  const product = getProduct();
  if (!product) return;

  // guide image
  els.guideImage.src = product.guideImage;
  els.guideImage.alt = `${product.name[state.lang]} guide`;

  // cautions
  renderCautions(product);

  // size finder
  renderFinder(product);

  // table
  loadAndRenderTable(product).catch(() => {});
}

function getProduct() {
  return PRODUCTS.find(p => p.id === state.productId) || PRODUCTS[0];
}

/* =========================
   Cautions (product-specific)
========================= */
function renderCautions(product) {
  const c = CAUTIONS[state.lang];
  const list = c[product.kind] || [];
  const items = [...list, c.common];

  els.cautionArea.innerHTML = `
    <ul class="bullets">
      ${items.map(x => `<li>${escapeHTML(x)}</li>`).join("")}
    </ul>
  `;
}

/* =========================
   Finder (product kind)
========================= */
function renderFinder(product) {
  els.finderResult.innerHTML = "";

  if (product.kind === "shoes") {
    renderFinderShoes();
    return;
  }

  if (product.kind === "tshirt" || product.kind === "hoodie") {
    renderFinderTops(product.kind);
    return;
  }

  // fallback
  els.finderArea.innerHTML = "";
}

function renderFinderShoes() {
  const t = I18N[state.lang].shoes;
  const unit = state.unit;
  const suffix = (unit === "cm") ? (state.lang === "JP" ? "cm" : "cm") : "in";

  const defaultAllowance = (unit === "cm") ? (state.lang === "JP" ? 1.0 : 1.0) : t.defaultAllowance;

  els.finderArea.innerHTML = `
    <div class="finder-grid">
      <div class="finder-card">
        <div class="finder-card-title">${escapeHTML(t.methodTitle)}</div>

        <label class="field">
          <span class="field-label">${escapeHTML(t.footLength)} (${escapeHTML(suffix)})</span>
          <input class="input" id="inFoot" type="number" inputmode="decimal" step="0.1" placeholder="${unit === "cm" ? "例: 24.5" : "e.g. 9.6"}">
        </label>

        <label class="field">
          <span class="field-label">${escapeHTML(t.allowance)} (${escapeHTML(suffix)})</span>
          <input class="input" id="inAllowance" type="number" inputmode="decimal" step="0.1" value="${defaultAllowance}">
          <span class="field-help">${escapeHTML(t.allowanceHelp)}</span>
        </label>

        <p class="mini-note">${escapeHTML(t.widthNote)}</p>

        <div class="finder-actions">
          <button class="btn primary" id="btnCalc" type="button">${escapeHTML(I18N[state.lang].finderButton)}</button>
          <button class="btn ghost" id="btnClear" type="button">${escapeHTML(I18N[state.lang].finderReset)}</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById("btnClear").addEventListener("click", () => {
    document.getElementById("inFoot").value = "";
    document.getElementById("inAllowance").value = defaultAllowance;
    els.finderResult.innerHTML = "";
  });

  document.getElementById("btnCalc").addEventListener("click", async () => {
    const foot = parseFloat(document.getElementById("inFoot").value);
    const allowance = parseFloat(document.getElementById("inAllowance").value);

    if (!isFinite(foot) || foot <= 0 || !isFinite(allowance) || allowance < 0) {
      els.finderResult.innerHTML = renderResultError();
      return;
    }

    const product = getProduct();
    const data = await loadCSV(product.csv[state.unit]);
    const norm = normalizeTable(data);

    // need Foot length column
    const col = norm.columns.find(c => c.key === "foot_length");
    const sizeCol = norm.columns.find(c => c.key === "size") || norm.columns[0];

    if (!col || !sizeCol) {
      els.finderResult.innerHTML = renderResultError("必要列（Foot length）が見つかりません。CSVヘッダーを確認してください。");
      return;
    }

    const target = foot + allowance;

    // pick smallest size whose foot_length >= target, else last
    const rows = norm.rows
      .map(r => ({ raw: r, v: toNumber(r[col.index]) }))
      .filter(x => isFinite(x.v))
      .sort((a, b) => a.v - b.v);

    if (rows.length === 0) {
      els.finderResult.innerHTML = renderResultError();
      return;
    }

    let pick = rows.find(x => x.v >= target) || rows[rows.length - 1];
    const recommended = pick.raw[sizeCol.index];

    els.finderResult.innerHTML = renderResultBox(recommended, `${state.lang === "JP" ? "基準足長" : "Target foot length"}: ${formatNum(target)} ${suffix}`);
  });
}

function renderFinderTops(kind) {
  const t = I18N[state.lang].tops;
  const unit = state.unit;
  const suffix = (unit === "cm") ? "cm" : "in";

  const defaultEase = (unit === "cm") ? (state.lang === "JP" ? 10 : 10) : t.defaultEase;

  els.finderArea.innerHTML = `
    <div class="finder-grid">
      <div class="finder-card">
        <div class="finder-card-title">${escapeHTML(t.methodTitle)}</div>

        <div class="radio-group">
          <label class="radio">
            <input type="radio" name="method" value="A" checked>
            <span>${escapeHTML(t.methodA)}</span>
          </label>
          <label class="radio">
            <input type="radio" name="method" value="B">
            <span>${escapeHTML(t.methodB)}</span>
          </label>
        </div>

        <div id="methodAFields">
          <label class="field">
            <span class="field-label">${escapeHTML(t.chestWidth)} (${suffix})</span>
            <input class="input" id="inChestWidth" type="number" inputmode="decimal" step="0.1" placeholder="${unit === "cm" ? "例: 54" : "e.g. 21.3"}">
          </label>

          <div class="two-cols">
            <label class="field">
              <span class="field-label">${escapeHTML(t.bodyLength)} (${suffix})</span>
              <input class="input" id="inBodyLen" type="number" inputmode="decimal" step="0.1" placeholder="${unit === "cm" ? "任意" : "optional"}">
            </label>

            <label class="field">
              <span class="field-label">${escapeHTML(t.sleeve)} (${suffix})</span>
              <input class="input" id="inSleeve" type="number" inputmode="decimal" step="0.1" placeholder="${unit === "cm" ? "任意" : "optional"}">
            </label>
          </div>
        </div>

        <div id="methodBFields" style="display:none;">
          <label class="field">
            <span class="field-label">${escapeHTML(t.nudeChest)} (${suffix})</span>
            <input class="input" id="inNudeChest" type="number" inputmode="decimal" step="0.1" placeholder="${unit === "cm" ? "例: 92" : "e.g. 36.2"}">
          </label>

          <label class="field">
            <span class="field-label">${escapeHTML(t.ease)} (${suffix})</span>
            <input class="input" id="inEase" type="number" inputmode="decimal" step="0.1" value="${defaultEase}">
            <span class="field-help">${escapeHTML(t.easeHelp)}</span>
          </label>
        </div>

        <div class="finder-actions">
          <button class="btn primary" id="btnCalc" type="button">${escapeHTML(I18N[state.lang].finderButton)}</button>
          <button class="btn ghost" id="btnClear" type="button">${escapeHTML(I18N[state.lang].finderReset)}</button>
        </div>
      </div>
    </div>
  `;

  const radios = [...document.querySelectorAll('input[name="method"]')];
  const A = document.getElementById("methodAFields");
  const B = document.getElementById("methodBFields");

  function syncMethod() {
    const v = radios.find(r => r.checked)?.value || "A";
    A.style.display = (v === "A") ? "" : "none";
    B.style.display = (v === "B") ? "" : "none";
    els.finderResult.innerHTML = "";
  }
  radios.forEach(r => r.addEventListener("change", syncMethod));
  syncMethod();

  document.getElementById("btnClear").addEventListener("click", () => {
    const ids = ["inChestWidth","inBodyLen","inSleeve","inNudeChest","inEase"];
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      if (id === "inEase") el.value = defaultEase;
      else el.value = "";
    });
    els.finderResult.innerHTML = "";
  });

  document.getElementById("btnCalc").addEventListener("click", async () => {
    const v = radios.find(r => r.checked)?.value || "A";

    const product = getProduct();
    const data = await loadCSV(product.csv[state.unit]);
    const norm = normalizeTable(data);

    // Need a chest width-like column to recommend
    const chestCol = norm.columns.find(c => c.key === "chest_width") || findByHeaderContains(norm, ["Chest", "身幅"]);
    const sizeCol = norm.columns.find(c => c.key === "size") || norm.columns[0];

    if (!chestCol || !sizeCol) {
      els.finderResult.innerHTML = renderResultError("必要列（身幅/Chest width）が見つかりません。CSVヘッダーを確認してください。");
      return;
    }

    let targetWidth = null;
    let explain = "";

    if (v === "A") {
      const w = parseFloat(document.getElementById("inChestWidth").value);
      if (!isFinite(w) || w <= 0) {
        els.finderResult.innerHTML = renderResultError();
        return;
      }
      targetWidth = w;
      explain = `${state.lang === "JP" ? "目標身幅" : "Target width"}: ${formatNum(targetWidth)} ${suffix}`;
    } else {
      const nude = parseFloat(document.getElementById("inNudeChest").value);
      const ease = parseFloat(document.getElementById("inEase").value);

      if (!isFinite(nude) || nude <= 0 || !isFinite(ease)) {
        els.finderResult.innerHTML = renderResultError();
        return;
      }
      // finished chest -> half
      const finished = nude + ease;
      targetWidth = finished / 2;
      explain = `${state.lang === "JP" ? "推定身幅" : "Estimated width"}: ${formatNum(targetWidth)} ${suffix} (${state.lang === "JP" ? "仕上がり胸囲" : "finished chest"} ${formatNum(finished)} ${suffix})`;
    }

    const rows = norm.rows
      .map(r => ({ raw: r, v: toNumber(r[chestCol.index]) }))
      .filter(x => isFinite(x.v))
      .sort((a, b) => a.v - b.v);

    if (rows.length === 0) {
      els.finderResult.innerHTML = renderResultError();
      return;
    }

    // pick smallest width >= target, else last
    const pick = rows.find(x => x.v >= targetWidth) || rows[rows.length - 1];
    const recommended = pick.raw[sizeCol.index];

    els.finderResult.innerHTML = renderResultBox(recommended, explain);
  });
}

/* =========================
   Table
========================= */
async function loadAndRenderTable(product) {
  els.tableStatus.textContent = I18N[state.lang].statusLoading;
  els.tableWrap.innerHTML = "";

  try {
    const data = await loadCSV(product.csv[state.unit]);
    const norm = normalizeTable(data);

    const display = buildDisplayTable(norm);
    els.tableWrap.innerHTML = display;
    els.tableStatus.textContent = "";

  } catch (e) {
    console.error(e);
    els.tableStatus.textContent = I18N[state.lang].statusError;
  }
}

async function loadCSV(path) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`CSV fetch failed: ${res.status}`);
  const text = await res.text();
  return parseCSV(text);
}

/* =========================
   CSV parser (simple + robust)
========================= */
function parseCSV(text) {
  const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n").filter(l => l.trim().length > 0);
  if (lines.length === 0) return { headers: [], rows: [] };

  const rows = lines.map(parseCSVLine);
  const headers = rows[0].map(h => h.trim());
  const body = rows.slice(1);

  return { headers, rows: body };
}

function parseCSVLine(line) {
  const out = [];
  let cur = "";
  let inQ = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];

    if (ch === '"') {
      const next = line[i + 1];
      if (inQ && next === '"') { cur += '"'; i++; }
      else inQ = !inQ;
      continue;
    }

    if (ch === "," && !inQ) {
      out.push(cur);
      cur = "";
      continue;
    }

    cur += ch;
  }
  out.push(cur);
  return out.map(x => x.trim());
}

/* =========================
   Normalize columns
========================= */
function normalizeTable(data) {
  const headers = data.headers;
  const columns = headers.map((h, idx) => ({
    raw: h,
    key: detectKey(h),
    index: idx
  }));

  return { columns, rows: data.rows };
}

function detectKey(header) {
  const h = header.trim();

  for (const [key, list] of Object.entries(HEADER_ALIASES)) {
    if (list.some(a => a.toLowerCase() === h.toLowerCase())) return key;
  }

  // contains fallback
  const hl = h.toLowerCase();
  if (hl.includes("foot") || hl.includes("足")) return "foot_length";
  if (hl.includes("outsole") || hl.includes("アウトソール")) return "outsole_length";
  if (hl.includes("chest") || hl.includes("身幅")) return "chest_width";
  if (hl.includes("length") || hl.includes("着丈")) return "body_length";
  if (hl.includes("sleeve") || hl.includes("袖")) return "sleeve_length";

  return "other";
}

function findByHeaderContains(norm, words) {
  const w = words.map(x => x.toLowerCase());
  return norm.columns.find(c => w.some(k => c.raw.toLowerCase().includes(k))) || null;
}

/* =========================
   Display table builder
========================= */
function buildDisplayTable(norm) {
  const headers = norm.columns.map(c => prettyHeader(c));
  const rows = norm.rows;

  return `
    <div class="table-scroller">
      <table class="table">
        <thead>
          <tr>
            ${headers.map(h => `<th>${escapeHTML(h)}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${rows.map(r => `
            <tr>
              ${norm.columns.map(c => `<td>${escapeHTML(r[c.index] ?? "")}</td>`).join("")}
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function prettyHeader(col) {
  // 「日本語CSVでも英語表示でもOK」のため、基本はCSVヘッダーを尊重。
  // ただし、誤解を減らすために代表列だけ整形（特に shoes）。
  if (col.key === "foot_length") return "Foot length";
  if (col.key === "outsole_length") return "Outsole length";
  return col.raw;
}

/* =========================
   Result UI
========================= */
function renderResultBox(sizeValue, sub) {
  const t = I18N[state.lang];
  return `
    <div class="result-box">
      <div class="result-title">${escapeHTML(t.resultTitle)}</div>
      <div class="result-main">${escapeHTML(String(sizeValue || "-"))}</div>
      <div class="result-sub">${escapeHTML(sub || "")}</div>
      <div class="result-foot">${escapeHTML(t.resultSub)}</div>
    </div>
  `;
}

function renderResultError(msg) {
  const m = msg || (state.lang === "JP" ? "入力値を確認してください。" : "Please check your input.");
  return `
    <div class="result-box error">
      <div class="result-title">Error</div>
      <div class="result-sub">${escapeHTML(m)}</div>
    </div>
  `;
}

/* =========================
   Utils
========================= */
function toNumber(x) {
  if (x == null) return NaN;
  const s = String(x).trim()
    .replace(/[^\d.\-]/g, ""); // remove symbols like ⅛ etc won't parse; keep simple numeric only
  return parseFloat(s);
}

function formatNum(n) {
  if (!isFinite(n)) return "-";
  return Number(n).toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
}

function escapeHTML(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function detectLang() {
  const lang = (navigator.language || "").toLowerCase();
  return lang.startsWith("ja") ? "JP" : "EN";
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
