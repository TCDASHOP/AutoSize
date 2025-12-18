// ===== State =====
const state = {
  lang: "jp",   // "jp" | "en"
  unit: "cm",   // "cm" | "inch"
  productKey: "aop_mens_crew",
};

const PRODUCTS = [
  { key: "aop_mens_crew",        jp: "メンズ クルーネックT", en: "Men's Crew Neck T-Shirt", guide: "guide_tshirt.jpg" },
  { key: "aop_womens_crew",      jp: "ウィメンズ クルーネックT", en: "Women's Crew Neck T-Shirt", guide: "guide_tshirt.jpg" },
  { key: "aop_recycled_hoodie",  jp: "ユニセックス パーカー", en: "Recycled Unisex Hoodie", guide: "guide_hoodie.jpg" },
  { key: "aop_recycled_zip",     jp: "ユニセックス ジップフーディ", en: "Recycled Unisex Zip Hoodie", guide: "guide_zip_hoodie.jpg" },
  { key: "mens_slipon",          jp: "メンズ スリッポン", en: "Men's Slip-On Canvas Shoes", guide: "guide_slipon.jpg" },
  { key: "womens_slipon",        jp: "ウィメンズ スリッポン", en: "Women's Slip-On Canvas Shoes", guide: "guide_slipon.jpg" },
];

// CSV filenames (repoの data/ に合わせる)
function csvFile(productKey, unit){
  const suffix = unit === "cm" ? "cm" : "inch";
  const map = {
    aop_mens_crew:       `aop_mens_crew_${suffix}.csv`,
    aop_womens_crew:     `aop_womens_crew_${suffix}.csv`,
    aop_recycled_hoodie: `aop_recycled_hoodie_${suffix}.csv`,
    aop_recycled_zip:    `aop_recycled_zip_hoodie_${suffix}.csv`,
    mens_slipon:         `mens_slipon_${suffix}.csv`,
    womens_slipon:       `womens_slipon_${suffix}.csv`,
  };
  return map[productKey];
}

function isShoes(productKey){
  return productKey.includes("slipon");
}

// ===== Elements =====
const els = {
  langBtns: document.querySelectorAll("[data-lang]"),
  unitBtns: document.querySelectorAll("[data-unit]"),
  productSelect: document.getElementById("productSelect"),
  guideImage: document.getElementById("guideImage"),
  inputArea: document.getElementById("inputArea"),
  calcBtn: document.getElementById("calcBtn"),
  resetBtn: document.getElementById("resetBtn"),
  pickBtn: document.getElementById("pickFromTableBtn"),
  noticeBox: document.getElementById("noticeBox"),
  recommendValue: document.getElementById("recommendValue"),
  sizeTable: document.getElementById("sizeTable"),
  tableCard: document.getElementById("tableCard"),
};

// ===== i18n =====
const I18N = {
  jp: {
    guideTitle: "採寸ガイド",
    guideNote: "※画像は商品に応じて切り替わります",
    calcTitle: "サイズ算出（任意入力）",
    calcNote: "入力なしでもサイズ表だけ見て選べます",
    productLabel: "商品",
    calcBtn: "おすすめサイズを計算",
    resetBtn: "入力を見直す",
    pickBtn: "サイズ表で選ぶ",
    recommendLabel: "おすすめ",
    tableTitle: "サイズ表",
    tableNote: "数値は平置き採寸です（誤差 ±1〜2）",
    needInput: "入力がありません。サイズ表で選ぶか、数値を入力してください。",
    chest: "ヌード胸囲",
    ease: "ゆとり（目安）",
    foot: "足長（かかと〜一番長い指）",
    allowance: "捨て寸（目安）",
    cm: "cm",
    inch: "inch",
  },
  en: {
    guideTitle: "Measurement Guide",
    guideNote: "Images change depending on the product.",
    calcTitle: "Size Calculator (Optional)",
    calcNote: "You can also choose only by the size chart.",
    productLabel: "Product",
    calcBtn: "Calculate recommended size",
    resetBtn: "Reset input",
    pickBtn: "Pick from size chart",
    recommendLabel: "Recommended",
    tableTitle: "Size Chart",
    tableNote: "Flat measurements. Allow ±1–2.",
    needInput: "No input. Pick from the size chart or enter a value.",
    chest: "Body chest",
    ease: "Ease (guide)",
    foot: "Foot length (heel to longest toe)",
    allowance: "Allowance (guide)",
    cm: "cm",
    inch: "inch",
  }
};

function t(key){
  return I18N[state.lang][key] ?? key;
}

function applyI18n(){
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const k = el.getAttribute("data-i18n");
    el.textContent = t(k);
  });
}

// ===== UI helpers =====
function setNotice(msg, isError=false){
  els.noticeBox.textContent = msg || "";
  els.noticeBox.classList.toggle("is-error", !!isError);
}

function setRecommended(v){
  els.recommendValue.textContent = v || "—";
}

function setActiveBtns(nodeList, attr, value){
  nodeList.forEach(btn=>{
    btn.classList.toggle("is-active", btn.getAttribute(attr) === value);
  });
}

function buildProductSelect(){
  els.productSelect.innerHTML = "";
  PRODUCTS.forEach(p=>{
    const opt = document.createElement("option");
    opt.value = p.key;
    opt.textContent = state.lang === "jp" ? p.jp : p.en;
    els.productSelect.appendChild(opt);
  });
  els.productSelect.value = state.productKey;
}

function updateGuideImage(){
  const prod = PRODUCTS.find(p=>p.key===state.productKey);
  const filename = prod?.guide ?? "guide_tshirt.jpg";
  els.guideImage.src = `./assets/${filename}`;
}

function buildInputArea(){
  els.inputArea.innerHTML = "";

  if (isShoes(state.productKey)){
    // Shoes input
    const row = document.createElement("div");
    row.className = "input-row";

    row.innerHTML = `
      <div>
        <label class="label">${t("foot")} (${t(state.unit)})</label>
        <input id="footInput" class="input" inputmode="decimal" placeholder="例: 23.5" />
      </div>
      <div>
        <label class="label">${t("allowance")} (${t(state.unit)})</label>
        <select id="allowanceSelect" class="select">
          <option value="0.7">+0.7 (${t("cm")})</option>
          <option value="1.0">+1.0 (${t("cm")})</option>
          <option value="0.3">+0.3 (${t("cm")})</option>
        </select>
      </div>
    `;
    els.inputArea.appendChild(row);

    // inch時は目安だけ変える（値はそのまま扱うより、実務はcm推奨）
    if (state.unit === "inch"){
      row.querySelector("#allowanceSelect").innerHTML = `
        <option value="0.28">+0.28 (inch)</option>
        <option value="0.39">+0.39 (inch)</option>
        <option value="0.12">+0.12 (inch)</option>
      `;
    }
  } else {
    // Tops/Hoodies input
    const row = document.createElement("div");
    row.className = "input-row";

    row.innerHTML = `
      <div>
        <label class="label">${t("chest")} (${t(state.unit)})</label>
        <input id="chestInput" class="input" inputmode="decimal" placeholder="例: 88" />
      </div>
      <div>
        <label class="label">${t("ease")} (${t(state.unit)})</label>
        <select id="easeSelect" class="select">
          <option value="8">標準（+8）</option>
          <option value="12">ゆったり（+12）</option>
          <option value="16">かなりゆったり（+16）</option>
        </select>
      </div>
    `;
    els.inputArea.appendChild(row);

    if (state.lang === "en"){
      row.querySelector("#easeSelect").innerHTML = `
        <option value="8">Standard (+8)</option>
        <option value="12">Relaxed (+12)</option>
        <option value="16">Oversized (+16)</option>
      `;
    }
  }
}

function parseCSV(text){
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  const rows = lines.map(l => l.split(",").map(x=>x.trim()));
  // headerあり想定：先頭行が文字列なら除外
  const header = rows[0];
  const looksHeader = header.some(x => /[A-Za-zぁ-んァ-ン一-龥]/.test(x));
  return looksHeader ? rows.slice(1) : rows;
}

function renderTable(rows){
  // rows: array of arrays
  // shoes: [size, outsole, foot]
  // tops:  [size, chestWidth, length, sleeve]
  const shoes = isShoes(state.productKey);

  const thead = shoes
    ? `<tr><th>Size</th><th>Outsole</th><th>Foot</th></tr>`
    : `<tr><th>Size</th><th>Chest (flat)</th><th>Length</th><th>Sleeve</th></tr>`;

  const body = rows.map(r=>{
    const safe = r.map(x=>String(x ?? ""));
    return `<tr data-size="${safe[0]}">${safe.map(x=>`<td>${x}</td>`).join("")}</tr>`;
  }).join("");

  els.sizeTable.innerHTML = `<thead>${thead}</thead><tbody>${body}</tbody>`;
}

async function loadTable(){
  setNotice("");
  setRecommended("—");

  const file = csvFile(state.productKey, state.unit);
  if (!file){
    setNotice("CSV file mapping not found.", true);
    return;
  }

  // cache bust: GitHub Pages / iOS 対策
  const url = `./data/${file}?v=20251219_1`;

  try{
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const text = await res.text();
    const rows = parseCSV(text);
    renderTable(rows);
  }catch(e){
    setNotice(`データの読み込みに失敗: ${String(e.message || e)}`, true);
  }
}

function findRecommendedFromRows(rows, target){
  // rows: parsed csv rows
  // returns size (string)
  // shoes: compare foot column (index 2)
  // tops: compare garment chest = chestWidth*2 (index 1)
  const shoes = isShoes(state.productKey);

  let best = null;
  for (const r of rows){
    const size = r[0];
    if (shoes){
      const foot = Number(r[2]);
      if (!Number.isFinite(foot)) continue;
      if (foot >= target){
        best = size;
        break;
      }
    } else {
      const chestW = Number(r[1]);
      if (!Number.isFinite(chestW)) continue;
      const garmentChest = chestW * 2;
      if (garmentChest >= target){
        best = size;
        break;
      }
    }
  }
  // fallback: 最後
  if (!best && rows.length) best = rows[rows.length - 1][0];
  return best;
}

async function calculate(){
  setNotice("");
  setRecommended("—");

  const file = csvFile(state.productKey, state.unit);
  const url = `./data/${file}?v=20251219_1`;

  try{
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const text = await res.text();
    const rows = parseCSV(text);

    if (isShoes(state.productKey)){
      const foot = Number(document.getElementById("footInput")?.value);
      const allowance = Number(document.getElementById("allowanceSelect")?.value);
      if (!Number.isFinite(foot)){
        setNotice(t("needInput"), true);
        return;
      }
      const target = foot + (Number.isFinite(allowance) ? allowance : 0);
      const rec = findRecommendedFromRows(rows, target);
      setRecommended(rec);
    } else {
      const chest = Number(document.getElementById("chestInput")?.value);
      const ease = Number(document.getElementById("easeSelect")?.value);
      if (!Number.isFinite(chest)){
        setNotice(t("needInput"), true);
        return;
      }
      const target = chest + (Number.isFinite(ease) ? ease : 0);
      const rec = findRecommendedFromRows(rows, target);
      setRecommended(rec);
    }
  }catch(e){
    setNotice(`計算に失敗: ${String(e.message || e)}`, true);
  }
}

function scrollToTable(){
  els.tableCard.scrollIntoView({ behavior:"smooth", block:"start" });
}

// ===== Events =====
function bindEvents(){
  els.langBtns.forEach(btn=>{
    btn.addEventListener("click", ()=>{
      state.lang = btn.getAttribute("data-lang");
      setActiveBtns(els.langBtns, "data-lang", state.lang);
      applyI18n();
      buildProductSelect();
      buildInputArea();
      updateGuideImage();
      loadTable();
    });
  });

  els.unitBtns.forEach(btn=>{
    btn.addEventListener("click", ()=>{
      state.unit = btn.getAttribute("data-unit");
      setActiveBtns(els.unitBtns, "data-unit", state.unit);
      buildInputArea();
      loadTable();
    });
  });

  els.productSelect.addEventListener("change", ()=>{
    state.productKey = els.productSelect.value;
    buildInputArea();
    updateGuideImage();
    loadTable();
  });

  els.calcBtn.addEventListener("click", calculate);

  els.resetBtn.addEventListener("click", ()=>{
    setNotice("");
    setRecommended("—");
    buildInputArea();
  });

  els.pickBtn.addEventListener("click", ()=>{
    setNotice("");
    scrollToTable();
  });

  // table row click => set recommended
  els.sizeTable.addEventListener("click", (e)=>{
    const tr = e.target.closest("tr[data-size]");
    if (!tr) return;
    setRecommended(tr.getAttribute("data-size"));
  });
}

// ===== Init =====
function init(){
  applyI18n();
  setActiveBtns(els.langBtns, "data-lang", state.lang);
  setActiveBtns(els.unitBtns, "data-unit", state.unit);
  buildProductSelect();
  buildInputArea();
  updateGuideImage();
  bindEvents();
  loadTable();
}

init();
