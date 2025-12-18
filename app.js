/* TCDA Size Guide - clarity-first UX (rewrite) */

const $ = (q) => document.querySelector(q);

const el = {
  langJP: $("#langJP"),
  langEN: $("#langEN"),
  unitValue: $("#unitValue"),
  unitLabel: $("#unitLabel"),

  pageTitle: $("#pageTitle"),
  titleGuide: $("#titleGuide"),
  imgNote: $("#imgNote"),
  titleInput: $("#titleInput"),
  hintInput: $("#hintInput"),
  labelProduct: $("#labelProduct"),
  titleNotice: $("#titleNotice"),
  titleResult: $("#titleResult"),
  titleTable: $("#titleTable"),
  hintTable: $("#hintTable"),

  productSelect: $("#productSelect"),

  inputTops: $("#inputTops"),
  inputShoes: $("#inputShoes"),

  labelBodyChest: $("#labelBodyChest"),
  bodyChest: $("#bodyChest"),
  labelEase: $("#labelEase"),
  easeSelect: $("#easeSelect"),
  easeHint: $("#easeHint"),

  labelFootLen: $("#labelFootLen"),
  footLen: $("#footLen"),
  footHint: $("#footHint"),
  labelAllowance: $("#labelAllowance"),
  allowanceSelect: $("#allowanceSelect"),

  calcBtn: $("#calcBtn"),

  noticeList: $("#noticeList"),

  guideImage: $("#guideImage"),
  guideFallback: $("#guideFallback"),
  guidePathText: $("#guidePathText"),

  tableHead: $("#tableHead"),
  tableBody: $("#tableBody"),

  resultMain: $("#resultMain"),
  calcReason: $("#calcReason"),
  resultActions: $("#resultActions"),
  btnReview: $("#btnReview"),
  btnChooseTable: $("#btnChooseTable"),

  inputCard: $("#inputCard"),
  tableCard: $("#tableCard"),
};

const LANG_KEY = "tcda_sizeguide_lang";
const LANG = { JP: "JP", EN: "EN" };

const TEXT = {
  JP: {
    pageTitle: "サイズガイド",
    unitLabel: "単位",
    titleGuide: "採寸ガイド",
    imgNote: "※ 画像は商品に応じて切り替わります",
    titleInput: "入力（任意）",
    hintInput: "入力しなくてもサイズ表は見られます",
    labelProduct: "商品",
    titleNotice: "選ぶときの注意事項",
    titleResult: "おすすめ",
    titleTable: "サイズ表",
    hintTable: "※ 採寸方法により ±1〜2 の誤差が出る場合があります",
    calcBtn: "おすすめサイズを計算",
    bodyChest: "ヌード胸囲（cm）",
    ease: "ゆとり（目安）",
    footLen: "足長（cm）",
    allowance: "捨て寸（目安）",
    easeHint: "標準は +8〜12cm 目安（動きやすさ重視は多め）",
    footHint: "左右を測り、長い方を採用（かかと〜一番長い指）",
    resultEmpty: "—",
    errNoSize: "該当するサイズが見当たりませんでした。",
    errNeedNumber: "数値を入力してください。",
    btnReview: "入力を見直す",
    btnChooseTable: "サイズ表で選ぶ",
  },
  EN: {
    pageTitle: "Size Guide",
    unitLabel: "Unit",
    titleGuide: "Measuring Guide",
    imgNote: "Image changes by product.",
    titleInput: "Input (optional)",
    hintInput: "You can view the size table without input.",
    labelProduct: "Product",
    titleNotice: "Notes when choosing",
    titleResult: "Recommended",
    titleTable: "Size Table",
    hintTable: "Measurements may vary by ±1–2 depending on the method.",
    calcBtn: "Calculate recommended size",
    bodyChest: "Body chest (in)",
    ease: "Ease (guide)",
    footLen: "Foot length (in)",
    allowance: "Allowance (guide)",
    easeHint: "Standard ease is about +3–5 in (more for easier movement).",
    footHint: "Measure both feet and use the longer one (heel to longest toe).",
    resultEmpty: "—",
    errNoSize: "No matching size was found.",
    errNeedNumber: "Please enter a number.",
    btnReview: "Review input",
    btnChooseTable: "Choose from table",
  }
};

/**
 * Product list
 * CSVはあなたの /data にあるものが「元データ」です（＝算出の根拠）。
 */
const PRODUCTS = [
  {
    id: "womens_slipon",
    type: "shoes",
    labelJP: "ウィメンズ スリッポン",
    labelEN: "Women's slip-on canvas shoes",
    csv: { cm: "./data/womens_slipon_cm.csv", inch: "./data/womens_slipon_inch.csv" },
    guideImg: "./assets/guide_slipon.jpg",
  },
  {
    id: "mens_slipon",
    type: "shoes",
    labelJP: "メンズ スリッポン",
    labelEN: "Men's slip-on canvas shoes",
    csv: { cm: "./data/mens_slipon_cm.csv", inch: "./data/mens_slipon_inch.csv" },
    guideImg: "./assets/guide_slipon.jpg",
  },
  {
    id: "womens_crew",
    type: "tops",
    labelJP: "ウィメンズ クルーネックT",
    labelEN: "Women's Crew Neck T-Shirt",
    csv: { cm: "./data/aop_womens_crew_cm.csv", inch: "./data/aop_womens_crew_inch.csv" },
    guideImg: "./assets/guide_tshirt.jpg",
  },
  {
    id: "mens_crew",
    type: "tops",
    // ここ：あなたの希望どおり “Men's Crew Neck T-Shirt” を2行に見える短め表記に寄せる
    labelJP: "メンズ クルーネックT",
    labelEN: "Men's Crew Neck T-Shirt",
    csv: { cm: "./data/aop_mens_crew_cm.csv", inch: "./data/aop_mens_crew_inch.csv" },
    guideImg: "./assets/guide_tshirt.jpg",
  },
  {
    id: "unisex_hoodie",
    type: "hoodie",
    labelJP: "ユニセックス パーカー",
    labelEN: "Unisex Hoodie",
    csv: { cm: "./data/aop_recycled_hoodie_cm.csv", inch: "./data/aop_recycled_hoodie_inch.csv" },
    guideImg: "./assets/guide_hoodie.jpg",
  },
  {
    id: "unisex_zip_hoodie",
    type: "ziphoodie",
    labelJP: "ユニセックス ジップパーカー",
    labelEN: "Unisex ZIP Hoodie",
    csv: { cm: "./data/aop_recycled_zip_hoodie_cm.csv", inch: "./data/aop_recycled_zip_hoodie_inch.csv" },
    guideImg: "./assets/guide_zip_hoodie.jpg",
  },
];

const NOTICE = {
  JP: {
    tops: [
      "Men’sはゆったり・直線的、Women’sはフィット寄りになりやすい。",
      "最短で失敗を減らす：手持ちの“いちばん好きな服”を平置きで測り、近い数値を選ぶ。",
      "体から逆算：ヌード胸囲＋ゆとり → 仕上がり胸囲 → 身幅（仕上がり胸囲÷2）。",
      "優先順位：身幅 → 着丈 → 袖丈（袖は肩線位置で体感が変わる）。",
    ],
    hoodie: [
      "基本はTシャツと同じ（胸囲→身幅→着丈→袖）。",
      "フーディは裾リブ等で体感が変わるため、同じ数値でも印象が少し変わる。",
      "迷ったら：標準→動きやすさ重視は「ゆったり」寄り。",
    ],
    shoes: [
      "主役は足長（左右を測り、長い方を採用）。",
      "足長＋捨て寸（目安7〜12mm）で選ぶ。アウトソール長は外寸なので足長と同一視しない。",
      "Men’sは幅広め / Women’sはタイト寄り。幅広・甲高で迷ったら大きめ寄り。",
      "国籍でロジックは変わらない。見るべきは「仕上がり寸法（服）」と「足長（靴）」。",
    ],
  },
  EN: {
    tops: [
      "Men’s tends to be straighter/roomier; Women’s tends to fit closer.",
      "Fastest way to avoid mistakes: measure your favorite tee flat and pick the closest numbers.",
      "From body: body chest + ease → target chest → half chest (target/2).",
      "Priority: half chest → length → sleeve (sleeve feel changes by shoulder seam).",
    ],
    hoodie: [
      "Same logic as tees (chest → half chest → length → sleeve).",
      "Hoodies may feel different even with the same numbers due to rib/structure.",
      "If unsure: choose slightly roomier for comfort/movement.",
    ],
    shoes: [
      "Main metric is foot length (measure both feet, use the longer one).",
      "Foot length + allowance (about 0.3–0.5 in). Outsole length is an outer measurement—don’t treat it as foot length.",
      "Men’s tends to be wider; Women’s can feel tighter. Wide/high instep: consider sizing up if unsure.",
      "Logic is universal; only units and fit preference differ.",
    ],
  }
};

let state = {
  lang: LANG.JP,
  unit: "cm",        // fixed by lang (JP=cm, EN=inch)
  productId: PRODUCTS[0].id,
  csvRows: [],
  headers: [],
};

function setLang(lang){
  state.lang = lang;
  state.unit = (lang === LANG.JP) ? "cm" : "inch";
  localStorage.setItem(LANG_KEY, lang);

  el.langJP.classList.toggle("is-active", lang === LANG.JP);
  el.langEN.classList.toggle("is-active", lang === LANG.EN);

  applyTexts();
  renderProducts();
  updateForProduct();
}

function applyTexts(){
  const t = TEXT[state.lang];

  el.pageTitle.textContent = t.pageTitle;
  el.unitLabel.textContent = t.unitLabel;
  el.unitValue.textContent = state.unit;

  el.titleGuide.textContent = t.titleGuide;
  el.imgNote.textContent = t.imgNote;
  el.titleInput.textContent = t.titleInput;
  el.hintInput.textContent = t.hintInput;
  el.labelProduct.textContent = t.labelProduct;
  el.titleNotice.textContent = t.titleNotice;
  el.titleResult.textContent = t.titleResult;
  el.titleTable.textContent = t.titleTable;
  el.hintTable.textContent = t.hintTable;

  el.calcBtn.textContent = t.calcBtn;

  // input labels with unit
  el.labelBodyChest.textContent = t.bodyChest;
  el.labelFootLen.textContent = t.footLen;
  el.labelEase.textContent = t.ease;
  el.labelAllowance.textContent = t.allowance;

  el.easeHint.textContent = t.easeHint;
  el.footHint.textContent = t.footHint;

  el.btnReview.textContent = t.btnReview;
  el.btnChooseTable.textContent = t.btnChooseTable;
}

function renderProducts(){
  el.productSelect.innerHTML = "";
  for (const p of PRODUCTS){
    const opt = document.createElement("option");
    opt.value = p.id;

    // 表示ラベルは言語で切替
    opt.textContent = (state.lang === LANG.JP) ? p.labelJP : p.labelEN;
    el.productSelect.appendChild(opt);
  }
  el.productSelect.value = state.productId;
}

function getProduct(){
  return PRODUCTS.find(p => p.id === state.productId) || PRODUCTS[0];
}

function showGroup(type){
  el.inputTops.classList.add("hidden");
  el.inputShoes.classList.add("hidden");

  // type -> input group
  if (type === "tops" || type === "hoodie" || type === "ziphoodie"){
    el.inputTops.classList.remove("hidden");
  }
  if (type === "shoes"){
    el.inputShoes.classList.remove("hidden");
  }
}

function buildEaseOptions(){
  // cm / inch で候補を変える
  const isCM = state.unit === "cm";
  const opts = isCM
    ? [
        {v: 8,  label: (state.lang===LANG.JP) ? "標準（+8cm 目安）" : "Standard (+3.1 in)"},
        {v: 10, label: (state.lang===LANG.JP) ? "ゆったり（+10cm 目安）" : "Roomy (+3.9 in)"},
        {v: 12, label: (state.lang===LANG.JP) ? "かなりゆったり（+12cm 目安）" : "Very roomy (+4.7 in)"},
      ]
    : [
        {v: 3.1, label: "Standard (+3.1 in)"},
        {v: 3.9, label: "Roomy (+3.9 in)"},
        {v: 4.7, label: "Very roomy (+4.7 in)"},
      ];

  el.easeSelect.innerHTML = "";
  for (const o of opts){
    const opt = document.createElement("option");
    opt.value = String(o.v);
    opt.textContent = o.label;
    el.easeSelect.appendChild(opt);
  }
  el.easeSelect.value = String(opts[0].v);
}

function buildAllowanceOptions(){
  // 捨て寸：cmなら0.7〜1.2cm、inchなら0.3〜0.5in
  const isCM = state.unit === "cm";
  const opts = isCM
    ? [
        {v: 0.7, label: (state.lang===LANG.JP) ? "+0.7cm（タイト寄り）" : "+0.28 in (snug)"},
        {v: 1.0, label: (state.lang===LANG.JP) ? "+1.0cm（標準）" : "+0.39 in (standard)"},
        {v: 1.2, label: (state.lang===LANG.JP) ? "+1.2cm（ゆとり）" : "+0.47 in (roomy)"},
      ]
    : [
        {v: 0.28, label: "+0.28 in (snug)"},
        {v: 0.39, label: "+0.39 in (standard)"},
        {v: 0.47, label: "+0.47 in (roomy)"},
      ];

  el.allowanceSelect.innerHTML = "";
  for (const o of opts){
    const opt = document.createElement("option");
    opt.value = String(o.v);
    opt.textContent = o.label;
    el.allowanceSelect.appendChild(opt);
  }
  el.allowanceSelect.value = String(opts[1].v);
}

function renderNotice(type){
  const langKey = state.lang;
  let key = "tops";
  if (type === "shoes") key = "shoes";
  if (type === "hoodie" || type === "ziphoodie") key = "hoodie";

  const list = NOTICE[langKey][key] || [];
  el.noticeList.innerHTML = "";
  for (const s of list){
    const li = document.createElement("li");
    li.textContent = s;
    el.noticeList.appendChild(li);
  }
}

function setGuideImage(src){
  el.guideFallback.classList.add("hidden");
  el.guidePathText.textContent = src;

  // 画像が404等で死んだときにフォールバック表示
  el.guideImage.onerror = () => {
    el.guideFallback.classList.remove("hidden");
  };
  el.guideImage.onload = () => {
    el.guideFallback.classList.add("hidden");
  };

  // GitHub Pagesで確実に通るように相対パスをそのまま使う
  el.guideImage.src = src;
}

async function loadCSV(path){
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error("CSV load failed: " + path);
  const text = await res.text();
  const { headers, rows } = parseCSV(text);
  state.headers = headers;
  state.csvRows = rows;
  renderTable(headers, rows);
}

function parseCSV(text){
  // シンプルCSV（あなたのデータ形式想定：カンマ区切り、引用符は最低限対応）
  const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n").filter(l => l.trim() !== "");
  if (lines.length === 0) return { headers: [], rows: [] };

  const parseLine = (line) => {
    const out = [];
    let cur = "";
    let inQ = false;
    for (let i=0;i<line.length;i++){
      const ch = line[i];
      if (ch === '"'){
        if (inQ && line[i+1] === '"'){ cur += '"'; i++; }
        else inQ = !inQ;
      } else if (ch === "," && !inQ){
        out.push(cur.trim());
        cur = "";
      } else {
        cur += ch;
      }
    }
    out.push(cur.trim());
    return out;
  };

  const headers = parseLine(lines[0]);
  const rows = lines.slice(1).map(parseLine).map(arr => {
    const obj = {};
    headers.forEach((h, idx) => obj[h] = arr[idx] ?? "");
    return obj;
  });

  return { headers, rows };
}

function renderTable(headers, rows){
  el.tableHead.innerHTML = "";
  el.tableBody.innerHTML = "";

  const tr = document.createElement("tr");
  for (const h of headers){
    const th = document.createElement("th");
    th.textContent = h;
    tr.appendChild(th);
  }
  el.tableHead.appendChild(tr);

  for (const r of rows){
    const trb = document.createElement("tr");
    for (const h of headers){
      const td = document.createElement("td");
      td.textContent = r[h];
      trb.appendChild(td);
    }
    el.tableBody.appendChild(trb);
  }
}

function findHeader(headers, patterns){
  for (const h of headers){
    for (const p of patterns){
      const re = new RegExp(p, "i");
      if (re.test(h)) return h;
    }
  }
  return null;
}

function toNum(v){
  if (v == null) return NaN;
  const s = String(v).trim().replace(/[^\d.\-]/g, "");
  return parseFloat(s);
}

function fmt(n){
  // 余計な桁を抑える
  if (!isFinite(n)) return "";
  const isInt = Math.abs(n - Math.round(n)) < 1e-9;
  return isInt ? String(Math.round(n)) : String(Math.round(n*10)/10);
}

function showResult(main, reason = "", isError = false){
  el.resultMain.textContent = main;
  el.calcReason.textContent = reason || "";
  el.resultActions.classList.toggle("hidden", !isError);
}

function scrollToEl(target){
  target.scrollIntoView({ behavior: "smooth", block: "start" });
}

function updateForProduct(){
  const p = getProduct();

  showGroup(p.type);
  renderNotice(p.type);
  buildEaseOptions();
  buildAllowanceOptions();

  // ガイド画像切替
  setGuideImage(p.guideImg);

  // CSV読み込み（言語で単位固定）
  const csvPath = p.csv[state.unit];
  loadCSV(csvPath).catch(() => {
    // CSVロード失敗時は表を空にして、結果もエラー
    el.tableHead.innerHTML = "";
    el.tableBody.innerHTML = "";
    const t = TEXT[state.lang];
    showResult(t.errNoSize, "", true);
  });

  // 結果をリセット
  const t = TEXT[state.lang];
  showResult(t.resultEmpty, "", false);

  // 入力欄プレースホルダ
  if (p.type === "shoes"){
    el.footLen.placeholder = (state.unit === "cm") ? "例：23.5" : "e.g. 9.3";
  } else {
    el.bodyChest.placeholder = (state.unit === "cm") ? "例：88" : "e.g. 34.6";
  }
}

function calcRecommended(){
  const p = getProduct();
  const t = TEXT[state.lang];

  // 必要な列を特定（ヘッダ表記はCSVのままでも拾えるようにする）
  const sizeCol = findHeader(state.headers, ["^サイズ$", "^size$"]);
  if (!sizeCol){
    showResult(t.errNoSize, "", true);
    return;
  }

  if (p.type === "shoes"){
    const footCol = findHeader(state.headers, ["足の長さ", "足長", "foot\\s*length"]);
    if (!footCol){
      // 列が無い場合でもユーザー文言に寄せる（技術文言は禁止）
      showResult(t.errNoSize, "", true);
      return;
    }

    const foot = toNum(el.footLen.value);
    const allowance = toNum(el.allowanceSelect.value);

    if (!isFinite(foot)){
      showResult(t.errNeedNumber, "", true);
      return;
    }

    const target = foot + allowance;

    // 最小で target を満たすサイズを選ぶ
    const candidates = state.csvRows
      .map(r => ({
        size: r[sizeCol],
        footLen: toNum(r[footCol]),
      }))
      .filter(x => isFinite(x.footLen))
      .sort((a,b) => a.footLen - b.footLen);

    const hit = candidates.find(x => x.footLen >= target);

    if (!hit){
      showResult(t.errNoSize, "", true);
      return;
    }

    const reasonJP = `足長 ${fmt(foot)}${state.unit} + 捨て寸 ${fmt(allowance)}${state.unit} = ${fmt(target)}${state.unit} → ${hit.size}`;
    const reasonEN = `Foot ${fmt(foot)}${state.unit} + allowance ${fmt(allowance)}${state.unit} = ${fmt(target)}${state.unit} → ${hit.size}`;
    showResult(String(hit.size), (state.lang===LANG.JP) ? reasonJP : reasonEN, false);
    return;
  }

  // tops/hoodie/ziphoodie
  const halfChestCol = findHeader(state.headers, [
    "身幅", "1/2\\s*胸幅", "half\\s*chest", "chest\\s*\\(flat\\)", "chest\\s*width"
  ]);
  if (!halfChestCol){
    showResult(t.errNoSize, "", true);
    return;
  }

  const chest = toNum(el.bodyChest.value);
  const ease = toNum(el.easeSelect.value);

  if (!isFinite(chest)){
    showResult(t.errNeedNumber, "", true);
    return;
  }

  const targetChest = chest + ease;
  const targetHalf = targetChest / 2;

  const candidates = state.csvRows
    .map(r => ({
      size: r[sizeCol],
      half: toNum(r[halfChestCol]),
    }))
    .filter(x => isFinite(x.half))
    .sort((a,b) => a.half - b.half);

  const hit = candidates.find(x => x.half >= targetHalf);
  if (!hit){
    showResult(t.errNoSize, "", true);
    return;
  }

  const reasonJP = `ヌード胸囲 ${fmt(chest)}${state.unit} + ゆとり ${fmt(ease)}${state.unit} = 仕上がり ${fmt(targetChest)}${state.unit} → 身幅目安 ${fmt(targetHalf)}${state.unit} → ${hit.size}`;
  const reasonEN = `Body ${fmt(chest)}${state.unit} + ease ${fmt(ease)}${state.unit} = target ${fmt(targetChest)}${state.unit} → half ${fmt(targetHalf)}${state.unit} → ${hit.size}`;

  showResult(String(hit.size), (state.lang===LANG.JP) ? reasonJP : reasonEN, false);
}

function wire(){
  el.langJP.addEventListener("click", () => setLang(LANG.JP));
  el.langEN.addEventListener("click", () => setLang(LANG.EN));

  el.productSelect.addEventListener("change", () => {
    state.productId = el.productSelect.value;
    updateForProduct();
  });

  el.calcBtn.addEventListener("click", () => calcRecommended());

  el.btnReview.addEventListener("click", () => {
    scrollToEl(el.inputCard);
    // 表示されている入力をフォーカス
    const p = getProduct();
    if (p.type === "shoes") el.footLen.focus();
    else el.bodyChest.focus();
  });

  el.btnChooseTable.addEventListener("click", () => {
    scrollToEl(el.tableCard);
  });
}

function init(){
  const saved = localStorage.getItem(LANG_KEY);
  state.lang = (saved === LANG.EN) ? LANG.EN : LANG.JP;
  state.unit = (state.lang === LANG.JP) ? "cm" : "inch";
  state.productId = PRODUCTS[0].id;

  wire();
  applyTexts();
  renderProducts();
  updateForProduct();
}

init();
