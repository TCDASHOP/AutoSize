/* TCDA Size Guide - Rebuild (JP=cm / EN=inch) */

const SHOP_URL = "https://www.tcda.shop/";

const PRODUCTS = [
  {
    id: "aop_mens_crew",
    type: "top",
    label: { jp: "メンズ / クルーネックT", en: "Men's Crew Neck T-Shirt" },
    guide: "assets/guide_tshirt.jpg",
    csv: { cm: "data/aop_mens_crew_cm.csv", inch: "data/aop_mens_crew_inch.csv" },
    tips: {
      jp: "・胸囲（ヌード）をメジャーで測る → 仕上がり胸囲（身幅×2）で比較。\n・迷ったら「ゆとり（目安）」を少し増やすと安全。",
      en: "• Measure your body chest. Compare with garment chest (Chest flat × 2).\n• If unsure, increase the ease for a looser fit."
    }
  },
  {
    id: "aop_womens_crew",
    type: "top",
    label: { jp: "ウィメンズ / クルーネックT", en: "Women's Crew Neck T-Shirt" },
    guide: "assets/guide_tshirt.jpg",
    csv: { cm: "data/aop_womens_crew_cm.csv", inch: "data/aop_womens_crew_inch.csv" },
    tips: {
      jp: "・胸囲（ヌード）＋ゆとりで選ぶのが基本。\n・フィット感が好みなら、ゆとりを小さめに。",
      en: "• Base your choice on body chest + ease.\n• For a closer fit, reduce ease."
    }
  },
  {
    id: "aop_recycled_hoodie",
    type: "top",
    label: { jp: "ユニセックス / パーカー", en: "Recycled Unisex Hoodie" },
    guide: "assets/guide_hoodie.jpg",
    csv: { cm: "data/aop_recycled_hoodie_cm.csv", inch: "data/aop_recycled_hoodie_inch.csv" },
    tips: {
      jp: "・厚手なので、迷ったら少しゆったり推奨。\n・胸囲（ヌード）＋ゆとりで選ぶ。",
      en: "• Hoodies are thicker—when unsure, go slightly looser.\n• Choose by body chest + ease."
    }
  },
  {
    id: "aop_recycled_zip_hoodie",
    type: "top",
    label: { jp: "ユニセックス / ジップフーディ", en: "Recycled Unisex Zip Hoodie" },
    guide: "assets/guide_zip_hoodie.jpg",
    csv: { cm: "data/aop_recycled_zip_hoodie_cm.csv", inch: "data/aop_recycled_zip_hoodie_inch.csv" },
    tips: {
      jp: "・胸囲（ヌード）＋ゆとりで選ぶ。\n・中に着込むなら、ゆとりを増やす。",
      en: "• Choose by body chest + ease.\n• If layering, increase ease."
    }
  },
  {
    id: "womens_slipon",
    type: "shoe",
    label: { jp: "ウィメンズ / スリッポン", en: "Women's Slip-On Canvas Shoes" },
    guide: "assets/guide_slipon.jpg",
    csv: { cm: "data/womens_slipon_cm.csv", inch: "data/womens_slipon_inch.csv" },
    tips: {
      jp: "・主役は足長（かかと〜一番長い指）。左右を測り長い方を採用。\n・足長＋捨て寸（目安 0.7cm）で選ぶ。\n・アウトソール長は外寸。足長と同一視しない。",
      en: "• Use foot length (heel to longest toe). Measure both feet; use the longer.\n• Choose by foot length + allowance (default 0.7cm).\n• Outsole length is an external measurement—do not treat it as foot length."
    }
  },
  {
    id: "mens_slipon",
    type: "shoe",
    label: { jp: "メンズ / スリッポン", en: "Men's Slip-On Canvas Shoes" },
    guide: "assets/guide_slipon.jpg",
    csv: { cm: "data/mens_slipon_cm.csv", inch: "data/mens_slipon_inch.csv" },
    tips: {
      jp: "・主役は足長（かかと〜一番長い指）。左右を測り長い方を採用。\n・足長＋捨て寸（目安 0.7cm）で選ぶ。\n・アウトソール長は外寸。足長と同一視しない。",
      en: "• Use foot length (heel to longest toe). Measure both feet; use the longer.\n• Choose by foot length + allowance (default 0.7cm).\n• Outsole length is an external measurement—do not treat it as foot length."
    }
  }
];

const els = {
  backToShop: document.getElementById("backToShop"),
  langBtns: document.querySelectorAll("[data-lang]"),
  unitBadge: document.getElementById("unitBadge"),

  guideTitle: document.getElementById("guideTitle"),
  guideNote: document.getElementById("guideNote"),
  guideImage: document.getElementById("guideImage"),

  productSelect: document.getElementById("productSelect"),
  inputsArea: document.getElementById("inputsArea"),
  calcBtn: document.getElementById("calcBtn"),
  resetBtn: document.getElementById("resetBtn"),
  scrollTableBtn: document.getElementById("scrollTableBtn"),

  tipsBox: document.getElementById("tipsBox"),
  recommendValue: document.getElementById("recommendValue"),
  errorBox: document.getElementById("errorBox"),

  tableHead: document.getElementById("tableHead"),
  tableBody: document.getElementById("tableBody"),
  tableCard: document.getElementById("tableCard")
};

let state = {
  lang: "jp",          // jp or en
  unit: "cm",          // cm or inch (JP=cm, EN=inch)
  productId: PRODUCTS[0].id,
  rows: [],
  columns: [],
  selectedRowIndex: null
};

function setLang(lang){
  state.lang = lang;
  state.unit = (lang === "jp") ? "cm" : "inch";

  els.langBtns.forEach(btn => {
    const on = btn.dataset.lang === lang;
    btn.setAttribute("aria-pressed", on ? "true" : "false");
  });

  els.unitBadge.textContent = state.unit;

  // Texts that change by language
  document.documentElement.lang = (lang === "jp") ? "ja" : "en";
  document.getElementById("guideTitle").textContent = (lang === "jp") ? "採寸ガイド" : "Measurement Guide";
  document.getElementById("guideNote").textContent = (lang === "jp") ? "※画像は商品に応じて切り替わります" : "Images change depending on the product.";
  document.getElementById("calcTitle").textContent = (lang === "jp") ? "サイズ算出（任意入力）" : "Size Calculator (Optional)";
  document.getElementById("calcNote").textContent = (lang === "jp") ? "入力しなくてもサイズ表だけ見て選べます" : "You can choose from the table without entering values.";
  document.getElementById("productLabel").textContent = (lang === "jp") ? "商品" : "Product";
  document.getElementById("recommendLabel").textContent = (lang === "jp") ? "おすすめ" : "Recommended";
  document.getElementById("resetBtn").textContent = (lang === "jp") ? "入力を見直す" : "Reset";
  document.getElementById("scrollTableBtn").textContent = (lang === "jp") ? "サイズ表で選ぶ" : "Choose from table";
  document.getElementById("calcBtn").textContent = (lang === "jp") ? "おすすめサイズを計算" : "Calculate recommended size";
  document.getElementById("tableTitle").textContent = (lang === "jp") ? "サイズ表" : "Size Table";
  document.getElementById("tableNote").textContent = (lang === "jp") ? "数値は平置き採寸です（誤差 ±1〜2）" : "Measurements are taken flat (tolerance ±1–2).";

  // Rebuild product options (JP/EN labels)
  buildProductOptions();
  // Reload data for current product in new unit
  loadProduct(state.productId);
}

function buildProductOptions(){
  const current = state.productId;
  els.productSelect.innerHTML = "";

  for(const p of PRODUCTS){
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.textContent = (state.lang === "jp") ? p.label.jp : p.label.en;
    els.productSelect.appendChild(opt);
  }
  els.productSelect.value = current;
}

function num(v){
  const n = parseFloat(String(v).trim());
  return Number.isFinite(n) ? n : null;
}

// Very tolerant CSV parser (no quotes needed for your data)
function parseCSV(text){
  const lines = text.replace(/\r/g, "").split("\n").map(l => l.trim()).filter(Boolean);
  if(lines.length < 2) return { head: [], rows: [] };

  const head = lines[0].split(",").map(h => h.trim());
  const rows = lines.slice(1).map(line => {
    const cells = line.split(",").map(c => c.trim());
    const obj = {};
    head.forEach((h, i) => obj[h] = (cells[i] ?? ""));
    return obj;
  });

  return { head, rows };
}

function pickKey(head, candidates){
  // find best matching header key (case-insensitive, ignores spaces)
  const norm = s => s.toLowerCase().replace(/\s+/g, "");
  const hmap = new Map(head.map(h => [norm(h), h]));
  for(const c of candidates){
    const k = hmap.get(norm(c));
    if(k) return k;
  }
  // also allow partial match
  for(const h of head){
    const nh = norm(h);
    for(const c of candidates){
      if(nh.includes(norm(c))) return h;
    }
  }
  return null;
}

function buildColumnsForProduct(product, head){
  if(product.type === "shoe"){
    const kSize = pickKey(head, ["Size", "サイズ"]);
    const kOutsole = pickKey(head, ["Outsole Length", "アウトソールの長さ", "アウトソール長"]);
    const kFoot = pickKey(head, ["Foot Length", "足の長さ", "足長", "足長さ"]);

    return [
      { key: kSize ?? head[0], label: (state.lang === "jp") ? "サイズ" : "Size" },
      { key: kOutsole ?? head[1], label: (state.lang === "jp") ? "アウトソールの長さ" : "Outsole Length" },
      { key: kFoot ?? head[2], label: (state.lang === "jp") ? "足の長さ" : "Foot Length" }
    ];
  }

  // top
  const kSize = pickKey(head, ["Size", "サイズ"]);
  const kChest = pickKey(head, ["Chest (flat)", "Chest(flat)", "身幅", "1/2胸幅", "Half Chest Width"]);
  const kLen = pickKey(head, ["Length", "着丈", "Body Length"]);
  const kSleeve = pickKey(head, ["Sleeve", "Sleeve length", "袖丈"]);

  return [
    { key: kSize ?? head[0], label: "Size" },
    { key: kChest ?? head[1], label: (state.lang === "jp") ? "Chest (flat)" : "Chest (flat)" },
    { key: kLen ?? head[2], label: (state.lang === "jp") ? "Length" : "Length" },
    { key: kSleeve ?? head[3], label: (state.lang === "jp") ? "Sleeve" : "Sleeve" }
  ];
}

function renderTable(){
  els.tableHead.innerHTML = "";
  els.tableBody.innerHTML = "";

  // head
  const trh = document.createElement("tr");
  for(const c of state.columns){
    const th = document.createElement("th");
    th.textContent = c.label;
    trh.appendChild(th);
  }
  const theadTr = document.createElement("tr");
  theadTr.append(...trh.childNodes);
  const thead = document.createElement("thead");
  thead.appendChild(theadTr);
  els.tableHead.appendChild(theadTr); // (we already target THEAD container)

  // body
  state.rows.forEach((row, idx) => {
    const tr = document.createElement("tr");
    if(state.selectedRowIndex === idx) tr.classList.add("selected");

    state.columns.forEach(c => {
      const td = document.createElement("td");
      td.textContent = row[c.key] ?? "";
      tr.appendChild(td);
    });

    tr.addEventListener("click", () => {
      state.selectedRowIndex = idx;
      const size = row[state.columns[0].key] ?? "—";
      els.recommendValue.textContent = size;
      hideError();
      renderTable();
    });

    els.tableBody.appendChild(tr);
  });
}

function showError(msg){
  els.errorBox.hidden = false;
  els.errorBox.textContent = msg;
}
function hideError(){
  els.errorBox.hidden = true;
  els.errorBox.textContent = "";
}

function renderInputs(product){
  els.inputsArea.innerHTML = "";

  if(product.type === "shoe"){
    const wrap = document.createElement("div");
    wrap.className = "row2";

    const f1 = document.createElement("label");
    f1.className = "field";
    f1.innerHTML = `
      <span class="label">${(state.lang==="jp") ? "足長（かかと〜一番長い指）" : "Foot length (heel to longest toe)"} (${state.unit})</span>
      <input id="valFoot" inputmode="decimal" placeholder="${(state.lang==="jp") ? "例：23.5" : "e.g. 9.25"}" />
    `;

    const f2 = document.createElement("label");
    f2.className = "field";
    f2.innerHTML = `
      <span class="label">${(state.lang==="jp") ? "捨て寸（目安）" : "Allowance"} (${state.unit})</span>
      <select id="valAllowance">
        <option value="0.3">0.3</option>
        <option value="0.5">0.5</option>
        <option value="0.7" selected>0.7</option>
        <option value="1.0">1.0</option>
      </select>
    `;

    wrap.appendChild(f1);
    wrap.appendChild(f2);

    els.inputsArea.appendChild(wrap);
    return;
  }

  // top
  const wrap = document.createElement("div");
  wrap.className = "row2";

  const f1 = document.createElement("label");
  f1.className = "field";
  f1.innerHTML = `
    <span class="label">${(state.lang==="jp") ? "胸囲（ヌード）" : "Body chest"} (${state.unit})</span>
    <input id="valChest" inputmode="decimal" placeholder="${(state.lang==="jp") ? "例：88" : "e.g. 34.5"}" />
  `;

  const f2 = document.createElement("label");
  f2.className = "field";
  f2.innerHTML = `
    <span class="label">${(state.lang==="jp") ? "ゆとり（目安）" : "Ease"} (${state.unit})</span>
    <select id="valEase">
      <option value="8" selected>${(state.lang==="jp") ? "標準（+8）" : "Standard (+8)"} </option>
      <option value="10">${(state.lang==="jp") ? "ゆったり（+10）" : "Relaxed (+10)"} </option>
      <option value="12">${(state.lang==="jp") ? "かなりゆったり（+12）" : "Loose (+12)"} </option>
    </select>
  `;

  wrap.appendChild(f1);
  wrap.appendChild(f2);

  els.inputsArea.appendChild(wrap);
}

function convertEaseForInch(cm){
  // If EN: interpret the dropdown values as cm in concept, but convert to inch to match inch datasets
  return cm / 2.54;
}

function recommendForTop(rows, columns){
  const keySize = columns[0].key;
  const keyChestFlat = columns[1].key;

  const chest = num(document.getElementById("valChest")?.value);
  if(chest === null) return { error: (state.lang==="jp") ? "胸囲の数値を入力してください。" : "Please enter your chest measurement." };

  let ease = num(document.getElementById("valEase")?.value);
  if(ease === null) ease = 8;

  // If EN/inch, convert the "cm-ease concept" to inches so it behaves similarly
  if(state.unit === "inch"){
    ease = convertEaseForInch(ease);
  }

  const required = chest + ease;

  // choose smallest size whose (chest_flat*2) >= required
  let best = null;
  for(const r of rows){
    const chestFlat = num(r[keyChestFlat]);
    if(chestFlat === null) continue;
    const garmentChest = chestFlat * 2;

    if(garmentChest >= required){
      if(!best || garmentChest < best.garmentChest){
        best = { size: r[keySize], garmentChest };
      }
    }
  }

  // fallback: largest size
  if(!best){
    let max = null;
    for(const r of rows){
      const chestFlat = num(r[keyChestFlat]);
      if(chestFlat === null) continue;
      const garmentChest = chestFlat * 2;
      if(!max || garmentChest > max.garmentChest){
        max = { size: r[keySize], garmentChest };
      }
    }
    best = max;
  }

  if(!best?.size) return { error: (state.lang==="jp") ? "サイズ表の読み込みに失敗しました。" : "Failed to read the size table." };
  return { size: best.size };
}

function recommendForShoe(rows, columns){
  const keySize = columns[0].key;

  // try to locate foot length column (3rd)
  const keyFoot = columns[2].key;

  const foot = num(document.getElementById("valFoot")?.value);
  if(foot === null) return { error: (state.lang==="jp") ? "足長の数値を入力してください。" : "Please enter your foot length." };

  let allowance = num(document.getElementById("valAllowance")?.value);
  if(allowance === null) allowance = 0.7;

  const target = foot + allowance;

  let best = null;
  for(const r of rows){
    const fl = num(r[keyFoot]);
    if(fl === null) continue;
    if(fl >= target){
      if(!best || fl < best.footLen){
        best = { size: r[keySize], footLen: fl };
      }
    }
  }

  // fallback: largest
  if(!best){
    let max = null;
    for(const r of rows){
      const fl = num(r[keyFoot]);
      if(fl === null) continue;
      if(!max || fl > max.footLen){
        max = { size: r[keySize], footLen: fl };
      }
    }
    best = max;
  }

  if(!best?.size) return { error: (state.lang==="jp") ? "サイズ表の読み込みに失敗しました。" : "Failed to read the size table." };
  return { size: best.size };
}

async function loadProduct(productId){
  state.productId = productId;
  state.selectedRowIndex = null;
  els.recommendValue.textContent = "—";
  hideError();

  const product = PRODUCTS.find(p => p.id === productId) ?? PRODUCTS[0];

  // guide
  els.guideImage.src = product.guide;

  // tips
  els.tipsBox.textContent = (state.lang === "jp") ? product.tips.jp : product.tips.en;

  // inputs
  renderInputs(product);

  // data
  const csvPath = (state.unit === "cm") ? product.csv.cm : product.csv.inch;

  try{
    const res = await fetch(csvPath, { cache: "no-store" });
    if(!res.ok) throw new Error(`fetch failed: ${res.status}`);
    const text = await res.text();

    const parsed = parseCSV(text);
    const cols = buildColumnsForProduct(product, parsed.head);

    state.columns = cols;
    state.rows = parsed.rows;

    renderTable();
  }catch(e){
    console.error(e);
    showError((state.lang==="jp") ? "CSVの読み込みに失敗しました。ファイル名・パスを確認してください。" : "Failed to load CSV. Please check file name/path.");
    state.columns = [];
    state.rows = [];
    renderTable();
  }
}

function onCalculate(){
  hideError();
  const product = PRODUCTS.find(p => p.id === state.productId) ?? PRODUCTS[0];

  if(!state.rows.length){
    showError((state.lang==="jp") ? "サイズ表が読み込めていません。" : "Size table is not loaded.");
    return;
  }

  const result = (product.type === "shoe")
    ? recommendForShoe(state.rows, state.columns)
    : recommendForTop(state.rows, state.columns);

  if(result.error){
    showError(result.error);
    return;
  }

  els.recommendValue.textContent = result.size ?? "—";

  // highlight the matching row
  const keySize = state.columns[0]?.key;
  const idx = state.rows.findIndex(r => String(r[keySize]).trim() === String(result.size).trim());
  state.selectedRowIndex = (idx >= 0) ? idx : null;
  renderTable();
}

function resetInputs(){
  hideError();
  els.recommendValue.textContent = "—";
  state.selectedRowIndex = null;

  // clear inputs
  const inputs = els.inputsArea.querySelectorAll("input");
  inputs.forEach(i => i.value = "");

  // reset selects (keep defaults)
  const selects = els.inputsArea.querySelectorAll("select");
  selects.forEach(s => s.selectedIndex = 0);

  renderTable();
}

function scrollToTable(){
  els.tableCard.scrollIntoView({ behavior: "smooth", block: "start" });
}

function bind(){
  els.backToShop.href = SHOP_URL;

  els.langBtns.forEach(btn => {
    btn.addEventListener("click", () => setLang(btn.dataset.lang));
  });

  els.productSelect.addEventListener("change", (e) => {
    loadProduct(e.target.value);
  });

  els.calcBtn.addEventListener("click", onCalculate);
  els.resetBtn.addEventListener("click", resetInputs);
  els.scrollTableBtn.addEventListener("click", scrollToTable);

  // Enter key triggers calculation
  document.addEventListener("keydown", (e) => {
    if(e.key === "Enter"){
      const active = document.activeElement;
      if(active && (active.tagName === "INPUT" || active.tagName === "SELECT")){
        onCalculate();
      }
    }
  });
}

function init(){
  bind();
  setLang("jp"); // default JP=cm
}

init();
