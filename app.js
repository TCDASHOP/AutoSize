/* =========================
   TCDA Size Guide - v2
   - JP=cm / EN=inch 完全同期
   - スマホ/タブレットで同じUI（レスポンシブ）
   - Download CSVなし
   - ガイド図下のA/B/Cテキストなし
   - ロゴはフッターのみ
   ========================= */

const state = {
  lang: "jp",         // "jp" | "en"
  unit: "cm",         // "cm" | "inch"  (langと同期)
  productKey: "aop_mens_crew",
  rows: [],
  headers: [],
};

const I18N = {
  jp: {
    guide_title: "採寸ガイド",
    guide_note: "※画像は商品に応じて切り替わります",
    calc_title: "サイズ算出（任意入力）",
    calc_note: "入力しなくてもサイズ表だけ見て選べます",
    product_label: "商品",
    calc_btn: "おすすめサイズを計算",
    tips_title: "選ぶときの注意事項",
    result_title: "おすすめ",
    table_title: "サイズ表",
    back_to_shop: "ショップに戻る",

    // dynamic labels
    nude_chest: "ヌード胸囲",
    body_length: "身長（目安）",
    foot_length: "足長（かかと〜一番長い指）",
    ease: "ゆとり（目安）",
    allowance: "捨て寸（目安）",

    // result hints
    hint_no_input: "数値を入力してから計算してください。",
    hint_not_found: "該当が見つかりません。サイズ表でご確認ください。",
    hint_tops: "※目安：仕上がり胸囲（身幅×2）が、ヌード胸囲＋ゆとり以上になる最小サイズを表示",
    hint_shoes: "※目安：足長＋捨て寸以上に対応する最小サイズを表示",

    // tips
    tips_tops: [
      "基本はヌード胸囲を基準に選びます。",
      "ゆったり着たい場合は「ゆとり」を増やしてください。",
      "仕上がり寸法は測り方で±1〜2cmほど誤差があります。"
    ],
    tips_shoes: [
      "左右の足長を測り、長い方を採用してください。",
      "足長＋捨て寸（目安7〜12mm）で選びます。",
      "アウトソール長は外寸なので、足長と同一視しないでください。"
    ],
  },

  en: {
    guide_title: "Measurement Guide",
    guide_note: "Images change depending on the product",
    calc_title: "Size Calculator (Optional)",
    calc_note: "You can also choose from the size table without input",
    product_label: "Product",
    calc_btn: "Calculate recommended size",
    tips_title: "Notes",
    result_title: "Recommendation",
    table_title: "Size Chart",
    back_to_shop: "Back to Shop",

    nude_chest: "Body chest",
    body_length: "Height (reference)",
    foot_length: "Foot length (heel to longest toe)",
    ease: "Ease (guide)",
    allowance: "Allowance (guide)",

    hint_no_input: "Please enter a number, then calculate.",
    hint_not_found: "No match found. Please check the size chart.",
    hint_tops: "Guide: picks the smallest size where (Chest flat × 2) ≥ (Body chest + ease).",
    hint_shoes: "Guide: picks the smallest size that supports (Foot length + allowance).",

    tips_tops: [
      "Choose based on your body chest measurement.",
      "For a looser fit, increase the ease value.",
      "Finished measurements may vary by about ±1–2 cm (or similar in inches)."
    ],
    tips_shoes: [
      "Measure both feet and use the longer one.",
      "Choose using foot length + allowance (about 7–12 mm).",
      "Outsole length is an outer measurement—do not treat it as foot length."
    ],
  }
};

// “商品”定義（ガイド画像もここで切替）
const PRODUCTS = [
  { key: "aop_mens_crew",   jp: "メンズ クルーネックT",   en: "Men’s Crew Neck T-Shirt",      guide: "guide_tshirt.jpg", kind: "tops" },
  { key: "aop_womens_crew", jp: "ウィメンズ クルーネックT", en: "Women’s Crew Neck T-Shirt",   guide: "guide_tshirt.jpg", kind: "tops" },
  { key: "aop_recycled_hoodie", jp: "ユニセックス パーカー", en: "Recycled Unisex Hoodie",     guide: "guide_hoodie.jpg", kind: "tops" },
  { key: "aop_recycled_zip",    jp: "ユニセックス ジップフーディ", en: "Recycled Unisex Zip Hoodie", guide: "guide_zip_hoodie.jpg", kind: "tops" },
  { key: "mens_slipon",    jp: "メンズ スリッポン",         en: "Men’s Slip-On Canvas Shoes",  guide: "guide_slipon.jpg", kind: "shoes" },
  { key: "womens_slipon",  jp: "ウィメンズ スリッポン",      en: "Women’s Slip-On Canvas Shoes", guide: "guide_slipon.jpg", kind: "shoes" },
];

// CSVファイル名（data/ に置いてある前提）
function csvFile(productKey, unit){
  const suffix = (unit === "cm") ? "cm" : "inch";
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
  return productKey.includes("slipon");
}

// ----------------- elements
const els = {
  langJP: document.getElementById("langJP"),
  langEN: document.getElementById("langEN"),
  unitBadge: document.getElementById("unitBadge"),
  backToShopBtn: document.getElementById("backToShopBtn"),

  productSelect: document.getElementById("productSelect"),
  guideImg: document.getElementById("guideImg"),

  measureLabel: document.getElementById("measureLabel"),
  measureInput: document.getElementById("measureInput"),
  allowanceLabel: document.getElementById("allowanceLabel"),
  allowanceSelect: document.getElementById("allowanceSelect"),

  calcBtn: document.getElementById("calcBtn"),
  tipsList: document.getElementById("tipsList"),
  resultText: document.getElementById("resultText"),
  resultHint: document.getElementById("resultHint"),

  sizeTable: document.getElementById("sizeTable"),
};

// ----------------- helpers
function t(key){
  return I18N[state.lang][key] ?? key;
}

function setLang(lang){
  state.lang = lang;
  // JP=cm / EN=inch を完全同期
  state.unit = (lang === "jp") ? "cm" : "inch";
  renderAll(true);
}

function getProduct(){
  return PRODUCTS.find(p => p.key === state.productKey) || PRODUCTS[0];
}

// CSV parse
function parseCSV(text){
  const lines = text.trim().split(/\r?\n/);
  const headers = lines[0].split(",").map(s => s.trim());
  const rows = lines.slice(1).filter(Boolean).map(line => {
    const cols = line.split(",").map(s => s.trim());
    const obj = {};
    headers.forEach((h,i)=> obj[h] = cols[i] ?? "");
    return obj;
  });
  return { headers, rows };
}

async function loadCSV(){
  const file = csvFile(state.productKey, state.unit);
  if(!file) return;

  const url = `./data/${file}?v=${Date.now()}`; // キャッシュで事故るのを避ける
  const res = await fetch(url);
  if(!res.ok) throw new Error(`Failed to load ${url}`);
  const text = await res.text();
  const parsed = parseCSV(text);
  state.headers = parsed.headers;
  state.rows = parsed.rows;
}

// テーブル描画
function renderTable(){
  const table = els.sizeTable;
  table.innerHTML = "";

  if(!state.headers.length){
    table.innerHTML = `<tr><td>—</td></tr>`;
    return;
  }

  const thead = document.createElement("thead");
  const trh = document.createElement("tr");
  state.headers.forEach(h => {
    const th = document.createElement("th");
    th.textContent = h;
    trh.appendChild(th);
  });
  thead.appendChild(trh);

  const tbody = document.createElement("tbody");
  state.rows.forEach(r => {
    const tr = document.createElement("tr");
    state.headers.forEach(h => {
      const td = document.createElement("td");
      td.textContent = r[h] ?? "";
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  table.appendChild(thead);
  table.appendChild(tbody);
}

// ガイド画像・入力UI
function renderGuideAndInputs(){
  const p = getProduct();
  els.guideImg.src = `./assets/${p.guide}`;
  els.guideImg.alt = `${p.en} guide`;

  // 入力ラベル/プレースホルダー/許容値
  const unit = state.unit;

  if(isShoes(state.productKey)){
    els.measureLabel.textContent = `${t("foot_length")} (${unit})`;
    els.measureInput.placeholder = (unit === "cm") ? "例：23.5" : "e.g. 9.25";

    els.allowanceLabel.textContent = t("allowance");

    // shoes: allowance (cm or inch)
    const opts = (unit === "cm")
      ? [
          { v: "0.7", label: "+0.7 cm (Standard)" },
          { v: "1.0", label: "+1.0 cm (Roomy)" },
          { v: "0.5", label: "+0.5 cm (Snug)" },
        ]
      : [
          { v: "0.28", label: "+0.28 in (Standard)" }, // 0.7cm
          { v: "0.39", label: "+0.39 in (Roomy)" },    // 1.0cm
          { v: "0.20", label: "+0.20 in (Snug)" },     // 0.5cm
        ];

    els.allowanceSelect.innerHTML = "";
    opts.forEach(o=>{
      const op = document.createElement("option");
      op.value = o.v;
      op.textContent = o.label;
      els.allowanceSelect.appendChild(op);
    });

    // tips
    renderTips(I18N[state.lang].tips_shoes);
    els.resultHint.textContent = t("hint_shoes");

  } else {
    els.measureLabel.textContent = `${t("nude_chest")} (${unit})`;
    els.measureInput.placeholder = (unit === "cm") ? "例：88" : "e.g. 34.6";

    els.allowanceLabel.textContent = t("ease");

    // tops: ease
    const opts = (unit === "cm")
      ? [
          { v: "8",  label: "+8 cm（標準）" },
          { v: "12", label: "+12 cm（ゆったり）" },
          { v: "16", label: "+16 cm（オーバー）" },
        ]
      : [
          { v: "3.15", label: "+3.15 in (Standard)" }, // 8cm
          { v: "4.72", label: "+4.72 in (Roomy)" },    // 12cm
          { v: "6.30", label: "+6.30 in (Oversized)" } // 16cm
        ];

    els.allowanceSelect.innerHTML = "";
    opts.forEach(o=>{
      const op = document.createElement("option");
      op.value = o.v;
      op.textContent = o.label;
      els.allowanceSelect.appendChild(op);
    });

    renderTips(I18N[state.lang].tips_tops);
    els.resultHint.textContent = t("hint_tops");
  }
}

function renderTips(list){
  els.tipsList.innerHTML = "";
  list.forEach(line=>{
    const li = document.createElement("li");
    li.textContent = line;
    els.tipsList.appendChild(li);
  });
}

// i18n反映
function applyI18n(){
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const key = el.getAttribute("data-i18n");
    const text = t(key);
    if(text) el.textContent = text;
  });

  els.backToShopBtn.textContent = t("back_to_shop");

  els.unitBadge.textContent = state.unit;

  els.langJP.classList.toggle("pill--active", state.lang === "jp");
  els.langEN.classList.toggle("pill--active", state.lang === "en");
}

// 商品プルダウン
function renderProducts(){
  els.productSelect.innerHTML = "";
  PRODUCTS.forEach(p=>{
    const op = document.createElement("option");
    op.value = p.key;
    op.textContent = (state.lang === "jp") ? p.jp : p.en;
    els.productSelect.appendChild(op);
  });
  els.productSelect.value = state.productKey;
}

// 推奨サイズ計算
function toNum(v){
  const n = Number(String(v).replace(/[^\d.]/g,""));
  return Number.isFinite(n) ? n : NaN;
}

function normalizeHeader(h){
  return String(h).toLowerCase().replace(/\s+/g,"").replace(/（.*?）|\(.*?\)/g,"");
}

function findCol(possibleNames){
  // possibleNames: array of normalized keys
  const map = {};
  state.headers.forEach(h=>{
    map[normalizeHeader(h)] = h;
  });
  for(const n of possibleNames){
    if(map[n]) return map[n];
  }
  return null;
}

function calcRecommended(){
  const input = toNum(els.measureInput.value);
  if(!Number.isFinite(input) || input <= 0){
    els.resultText.textContent = "—";
    els.resultHint.textContent = t("hint_no_input");
    return;
  }

  const add = toNum(els.allowanceSelect.value);
  const rows = state.rows;

  if(!rows.length){
    els.resultText.textContent = "—";
    els.resultHint.textContent = t("hint_not_found");
    return;
  }

  // サイズ列
  const sizeCol = findCol(["size","サイズ"]);
  if(!sizeCol){
    els.resultText.textContent = "—";
    els.resultHint.textContent = t("hint_not_found");
    return;
  }

  if(isShoes(state.productKey)){
    // foot length column（csvにより表記が揺れるので候補を多め）
    const footCol = findCol([
      "footlength","足の長さ","足長","足長さ",
      "footlength(cm)","footlength(in)"
    ]);

    if(!footCol){
      els.resultText.textContent = "—";
      els.resultHint.textContent = t("hint_not_found");
      return;
    }

    const target = input + add; // foot + allowance
    let pick = null;

    for(const r of rows){
      const foot = toNum(r[footCol]);
      if(Number.isFinite(foot) && foot >= target){
        pick = r;
        break;
      }
    }

    if(!pick){
      els.resultText.textContent = "—";
      els.resultHint.textContent = t("hint_not_found");
      return;
    }

    els.resultText.textContent = String(pick[sizeCol]);
    els.resultHint.textContent = t("hint_shoes");
    return;
  }

  // tops:
  // chest(flat) column（候補）
  const chestFlatCol = findCol([
    "chest(flat)","chestflat","身幅","身幅（平置き）","身幅(平置き)","1/2胸幅","halfchestwidth"
  ]);

  if(!chestFlatCol){
    els.resultText.textContent = "—";
    els.resultHint.textContent = t("hint_not_found");
    return;
  }

  const targetGarmentChest = input + add; // nude chest + ease
  let pick = null;

  for(const r of rows){
    const chestFlat = toNum(r[chestFlatCol]);
    const garmentChest = chestFlat * 2; // flat ×2
    if(Number.isFinite(garmentChest) && garmentChest >= targetGarmentChest){
      pick = r;
      break;
    }
  }

  if(!pick){
    els.resultText.textContent = "—";
    els.resultHint.textContent = t("hint_not_found");
    return;
  }

  els.resultText.textContent = String(pick[sizeCol]);
  els.resultHint.textContent = t("hint_tops");
}

// 全体レンダリング
async function renderAll(reloadCsv=false){
  applyI18n();
  renderProducts();
  renderGuideAndInputs();

  // unitが変わったらCSV読み直し
  if(reloadCsv){
    els.resultText.textContent = "—";
    try{
      await loadCSV();
    }catch(e){
      console.error(e);
      state.headers = [];
      state.rows = [];
    }
  }
  renderTable();
}

// init
(async function init(){
  // language buttons
  els.langJP.addEventListener("click", ()=> setLang("jp"));
  els.langEN.addEventListener("click", ()=> setLang("en"));

  // product select
  els.productSelect.addEventListener("change", async (e)=>{
    state.productKey = e.target.value;
    els.resultText.textContent = "—";
    renderGuideAndInputs();
    try{
      await loadCSV();
    }catch(err){
      console.error(err);
      state.headers = [];
      state.rows = [];
    }
    renderTable();
  });

  // calc
  els.calcBtn.addEventListener("click", calcRecommended);

  // first render
  applyI18n();
  renderProducts();
  renderGuideAndInputs();

  try{
    await loadCSV();
  }catch(e){
    console.error(e);
  }
  renderTable();
})();
