/* TCDA Size Guide — full rewrite (robust + clarity-first UX) */

const $ = (q) => document.querySelector(q);

const el = {
  btnJP: $("#btnJP"),
  btnEN: $("#btnEN"),
  btnCM: $("#btnCM"),
  btnIN: $("#btnIN"),

  productDropdown: $("#productDropdown"),
  inputsArea: $("#inputsArea"),
  btnCalc: $("#btnCalc"),

  notesBox: $("#notesBox"),
  resultBox: $("#resultBox"),
  basisLine: $("#basisLine"),
  actionRow: $("#actionRow"),
  btnReview: $("#btnReview"),
  btnGoTable: $("#btnGoTable"),
  noticeBox: $("#noticeBox"),

  guideImage: $("#guideImage"),
  imgFallback: $("#imgFallback"),

  tableHead: $("#tableHead"),
  tableBody: $("#tableBody"),
  btnDownload: $("#btnDownload"),
  tableCard: $("#tableCard"),
  tableFilter: $("#tableFilter"),

  footerCopy: $("#footerCopy"),

  ui: {
    guideTitle: $("#uiGuideTitle"),
    guideSub: $("#uiGuideSub"),
    guideLegend: $("#uiGuideLegend"),
    calcTitle: $("#uiCalcTitle"),
    calcSub: $("#uiCalcSub"),
    productLabel: $("#uiProductLabel"),
    notesTitle: $("#uiNotesTitle"),
    recTitle: $("#uiRecTitle"),
    tableTitle: $("#uiTableTitle"),
    tableSub: $("#uiTableSub"),
  }
};

const state = {
  lang: "jp",   // jp | en
  unit: "cm",   // cm | inch
  productId: null,
  csvText: "",
  headers: [],
  rows: [],
  keyToIndex: new Map(),
  lastRecommendedSize: null,
  dropdownOpen: false,
};

const EASE_CM = [
  { v: 8,  jp: "標準（+8cm 目安）",  en: "Standard (+3.1 in)" },
  { v: 10, jp: "ゆったり（+10cm 目安）", en: "Roomy (+3.9 in)" },
  { v: 12, jp: "かなりゆったり（+12cm 目安）", en: "Very roomy (+4.7 in)" },
];

const ALLOW_CM = [
  { v: 0.7,  jp: "+0.7cm（標準）", en: "+0.28 in (standard)" },
  { v: 1.0,  jp: "+1.0cm（標準）", en: "+0.39 in (standard)" },
  { v: 1.2,  jp: "+1.2cm（ゆったり）", en: "+0.47 in (roomy)" },
];

const PRODUCTS = [
  {
    id: "womens_slipon",
    type: "shoes",
    label: {
      jp: ["ウィメンズ", "スリッポン"],
      en: ["Women's Slip-On", "Canvas Shoes"]
    },
    guideImg: "assets/guide_slipon.jpg",
    csv: {
      cm: "data/womens_slipon_cm.csv",
      inch: "data/womens_slipon_inch.csv",
    },
    notes: {
      jp: [
        "主役は足長（左右を測り、長い方を採用）。",
        "足長＋捨て寸（目安 7〜12mm）で選ぶ。",
        "アウトソール長は外寸なので、足長と同一視しない。",
      ],
      en: [
        "Use foot length (measure both feet; use the longer).",
        "Choose by foot length + allowance (about 0.3–0.5 in).",
        "Outsole length is outside length — don’t treat it as foot length.",
      ]
    }
  },
  {
    id: "mens_slipon",
    type: "shoes",
    label: {
      jp: ["メンズ", "スリッポン"],
      en: ["Men's Slip-On", "Canvas Shoes"]
    },
    guideImg: "assets/guide_slipon.jpg",
    csv: {
      cm: "data/mens_slipon_cm.csv",
      inch: "data/mens_slipon_inch.csv",
    },
    notes: {
      jp: [
        "主役は足長（左右を測り、長い方を採用）。",
        "足長＋捨て寸（目安 7〜12mm）で選ぶ。",
        "幅広の人は、迷ったら大きめ寄り。",
      ],
      en: [
        "Use foot length (measure both feet; use the longer).",
        "Choose by foot length + allowance (about 0.3–0.5 in).",
        "If you have wider feet, size up when unsure.",
      ]
    }
  },
  {
    id: "aop_womens_crew",
    type: "tops",
    label: {
      jp: ["ウィメンズ", "クルーネックT"],
      en: ["Women's Crew Neck", "T-Shirt"]
    },
    guideImg: "assets/guide_tshirt.jpg",
    csv: {
      cm: "data/aop_womens_crew_cm.csv",
      inch: "data/aop_womens_crew_inch.csv",
    },
    notes: {
      jp: [
        "基本：ヌード胸囲 → 仕上がり胸囲（身幅×2）で照合。",
        "動きやすさ重視なら「ゆったり」寄り。",
        "身長は必須ではありません。心配なら「着丈」も確認。",
      ],
      en: [
        "Basic: body chest → compare to garment chest (half chest ×2).",
        "For easier movement, pick a roomier ease option.",
        "Height is not required — check length if you care.",
      ]
    }
  },
  {
    id: "aop_mens_crew",
    type: "tops",
    label: {
      jp: ["メンズ", "クルーネックT"],
      en: ["Men's Crew Neck", "T-Shirt"]
    },
    guideImg: "assets/guide_tshirt.jpg",
    csv: {
      cm: "data/aop_mens_crew_cm.csv",
      inch: "data/aop_mens_crew_inch.csv",
    },
    notes: {
      jp: [
        "基本：ヌード胸囲 → 仕上がり胸囲（身幅×2）で照合。",
        "迷ったら「標準」→動きやすさ重視は「ゆったり」。",
      ],
      en: [
        "Basic: body chest → compare to garment chest (half chest ×2).",
        "If unsure: Standard → choose Roomy for movement.",
      ]
    }
  },
  {
    id: "aop_recycled_hoodie",
    type: "tops",
    label: {
      jp: ["ユニセックス", "パーカー"],
      en: ["Unisex Hoodie", "All-Over Print"]
    },
    guideImg: "assets/guide_hoodie.jpg",
    csv: {
      cm: "data/aop_recycled_hoodie_cm.csv",
      inch: "data/aop_recycled_hoodie_inch.csv",
    },
    notes: {
      jp: [
        "基本はTシャツと同じ（胸囲 → 身幅×2）。",
        "フーディは生地・リブで体感が変わるため、迷ったら大きめ寄り。",
      ],
      en: [
        "Same logic as tees (body chest → half chest ×2).",
        "Hoodies can feel tighter due to structure — size up if unsure.",
      ]
    }
  },
  {
    id: "aop_recycled_zip_hoodie",
    type: "tops",
    label: {
      jp: ["ユニセックス", "ジップパーカー"],
      en: ["Unisex Zip Hoodie", "All-Over Print"]
    },
    guideImg: "assets/guide_zip_hoodie.jpg",
    csv: {
      cm: "data/aop_recycled_zip_hoodie_cm.csv",
      inch: "data/aop_recycled_zip_hoodie_inch.csv",
    },
    notes: {
      jp: [
        "基本：胸囲 → 身幅×2（仕上がり胸囲）。",
        "ジップは前開きの見え方が出るので、迷ったら“ゆったり”寄り。",
      ],
      en: [
        "Basic: body chest → half chest ×2.",
        "Zip hoodies show the front opening — go roomier if unsure.",
      ]
    }
  },
];

// ---------------- i18n strings ----------------
const I18N = {
  jp: {
    guideTitle: "採寸ガイド",
    guideSub: "※画像は商品に応じて切り替わります",
    guideLegend: "A：身幅 / B：着丈 / C：袖丈",
    calcTitle: "サイズ算出（任意入力）",
    calcSub: "入力なしでもサイズ表だけ見て選べます",
    product: "商品",
    calc: "おすすめサイズを計算",
    notes: "選ぶときの注意事項",
    rec: "おすすめ",
    table: "サイズ表",
    tableSub: "数値は平置き採寸です（誤差 ±1〜2）",
    filterPh: "サイズ検索（例：M / 25）",
    download: "Download CSV",
    errNoProduct: "商品を選択してください。",
    errNoInput: "入力がありません。サイズ表で選ぶか、数値を入力してください。",
    errNoMatch: "該当するサイズが見当たりませんでした。",
    btnReview: "入力を見直す",
    btnGoTable: "サイズ表で選ぶ",
    unitCM: "cm",
    unitIN: "inch",
    inBodyChest: "ヌード胸囲",
    inFootLen: "足長（かかと〜一番長い指）",
    inEase: "ゆとり（目安）",
    inAllow: "捨て寸（目安）",
    example: "例：",
  },
  en: {
    guideTitle: "Measuring Guide",
    guideSub: "Image changes by product.",
    guideLegend: "A: Chest Width / B: Body Length / C: Sleeve Length",
    calcTitle: "Size recommendation (optional input)",
    calcSub: "You can also choose from the size table without input.",
    product: "Product",
    calc: "Calculate recommended size",
    notes: "Notes when choosing",
    rec: "Recommended",
    table: "Size Table",
    tableSub: "Values are flat measurements (±1–2).",
    filterPh: "Filter (e.g. M / 25)",
    download: "Download CSV",
    errNoProduct: "Please choose a product.",
    errNoInput: "No input. Choose from the size table or enter your numbers.",
    errNoMatch: "No matching size was found.",
    btnReview: "Review input",
    btnGoTable: "Choose from table",
    unitCM: "cm",
    unitIN: "inch",
    inBodyChest: "Body chest",
    inFootLen: "Foot length (heel to toe)",
    inEase: "Ease (guide)",
    inAllow: "Allowance (guide)",
    example: "e.g.",
  }
};

// ---------------- helpers ----------------
function setActive(btn, on){
  btn.classList.toggle("isActive", !!on);
}
function t(){ return I18N[state.lang]; }

function toNumber(x){
  if (x == null) return NaN;
  const s = String(x).replace(/[^\d.\-]/g,"");
  return parseFloat(s);
}

function keyify(s){
  return String(s || "")
    .replace(/\uFEFF/g,"")
    .trim()
    .toLowerCase()
    .replace(/[’'"]/g,"")
    .replace(/\s+/g,"")
    .replace(/[\(\)\/\-\_]/g,"")
    .replace(/：/g,":");
}

function showNotice(msg){
  el.noticeBox.textContent = msg;
  el.noticeBox.classList.remove("hidden");
}
function hideNotice(){
  el.noticeBox.classList.add("hidden");
  el.noticeBox.textContent = "";
}

function showActions(){
  el.actionRow.classList.remove("hidden");
  el.btnReview.textContent = t().btnReview;
  el.btnGoTable.textContent = t().btnGoTable;
}
function hideActions(){
  el.actionRow.classList.add("hidden");
}

function showBasis(text){
  el.basisLine.textContent = text;
  el.basisLine.classList.remove("hidden");
}
function hideBasis(){
  el.basisLine.classList.add("hidden");
  el.basisLine.textContent = "";
}

function setResult(text){
  el.resultBox.textContent = text;
}

function scrollToTable(){
  el.tableCard.scrollIntoView({ behavior:"smooth", block:"start" });
}

// ---------------- CSV parser (simple but robust enough) ----------------
function parseCSV(text){
  const lines = text.replace(/\r\n/g,"\n").replace(/\r/g,"\n").split("\n").filter(l => l.trim().length > 0);
  if (!lines.length) return { headers: [], rows: [] };

  const parseLine = (line) => {
    const out = [];
    let cur = "";
    let inQ = false;
    for (let i=0;i<line.length;i++){
      const ch = line[i];
      if (ch === '"' ){
        if (inQ && line[i+1] === '"'){ cur += '"'; i++; }
        else inQ = !inQ;
      } else if (ch === "," && !inQ){
        out.push(cur);
        cur = "";
      } else {
        cur += ch;
      }
    }
    out.push(cur);
    return out.map(s => s.trim());
  };

  const headers = parseLine(lines[0]);
  const rows = [];

  for (let i=1;i<lines.length;i++){
    const cols = parseLine(lines[i]);
    if (cols.every(c => c === "")) continue;

    const obj = {};
    for (let j=0;j<headers.length;j++){
      obj[headers[j]] = cols[j] ?? "";
    }
    rows.push(obj);
  }
  return { headers, rows };
}

function buildKeyIndex(headers){
  const m = new Map();
  headers.forEach((h, idx) => {
    m.set(keyify(h), idx);
    m.set(h.trim(), idx);
  });
  return m;
}

function findHeader(headers, keys){
  const map = buildKeyIndex(headers);
  for (const k of keys){
    const kk = keyify(k);
    if (map.has(kk)) return headers[map.get(kk)];
  }
  // fallback: partial contains
  const normalized = headers.map(h => ({ h, k: keyify(h) }));
  for (const want of keys){
    const w = keyify(want);
    const hit = normalized.find(x => x.k.includes(w));
    if (hit) return hit.h;
  }
  return null;
}

// ---------------- UI: custom dropdown (2-line) ----------------
function renderDropdown(){
  const current = PRODUCTS.find(p => p.id === state.productId) || PRODUCTS[0];
  if (!state.productId) state.productId = current.id;

  const box = document.createElement("div");

  const btn = document.createElement("button");
  btn.type = "button";
  btn.id = "productButton";
  btn.className = "ddBtn";
  btn.setAttribute("aria-haspopup","listbox");
  btn.setAttribute("aria-expanded", String(state.dropdownOpen));

  const txt = document.createElement("div");
  txt.className = "ddBtnText";
  const main = document.createElement("div");
  main.className = "ddMain";
  const sub = document.createElement("div");
  sub.className = "ddSub";

  const lines = current.label[state.lang];
  main.textContent = lines[0] || "";
  sub.textContent = lines[1] || "";

  txt.appendChild(main);
  if (sub.textContent) txt.appendChild(sub);

  const chev = document.createElement("div");
  chev.className = "ddChevron";
  chev.textContent = state.dropdownOpen ? "▲" : "▼";

  btn.appendChild(txt);
  btn.appendChild(chev);

  const panel = document.createElement("div");
  panel.className = "ddPanel" + (state.dropdownOpen ? "" : " hidden");
  panel.setAttribute("role","listbox");

  PRODUCTS.forEach(p => {
    const opt = document.createElement("div");
    opt.className = "ddOpt" + (p.id === state.productId ? " isActive" : "");
    opt.setAttribute("role","option");
    opt.setAttribute("aria-selected", String(p.id === state.productId));

    const l = p.label[state.lang];
    const oMain = document.createElement("div");
    oMain.className = "oMain";
    oMain.textContent = l[0] || "";

    const oSub = document.createElement("div");
    oSub.className = "oSub";
    oSub.textContent = l[1] || "";

    opt.appendChild(oMain);
    if (oSub.textContent) opt.appendChild(oSub);

    opt.addEventListener("click", async () => {
      state.productId = p.id;
      state.dropdownOpen = false;
      renderDropdown();
      await loadAndRender();
      // 商品変更時は結果をリセット
      setResult("—");
      hideBasis();
      hideActions();
      hideNotice();
    });

    panel.appendChild(opt);
  });

  btn.addEventListener("click", () => {
    state.dropdownOpen = !state.dropdownOpen;
    renderDropdown();
  });

  // click outside to close
  setTimeout(() => {
    const handler = (ev) => {
      if (!el.productDropdown.contains(ev.target)){
        state.dropdownOpen = false;
        renderDropdown();
        document.removeEventListener("click", handler);
      }
    };
    document.addEventListener("click", handler);
  }, 0);

  box.appendChild(btn);
  box.appendChild(panel);

  el.productDropdown.innerHTML = "";
  el.productDropdown.appendChild(box);
}

function applyI18n(){
  const s = t();
  el.ui.guideTitle.textContent = s.guideTitle;
  el.ui.guideSub.textContent = s.guideSub;
  el.ui.guideLegend.textContent = s.guideLegend;
  el.ui.calcTitle.textContent = s.calcTitle;
  el.ui.calcSub.textContent = s.calcSub;
  el.ui.productLabel.textContent = s.product;
  el.ui.notesTitle.textContent = s.notes;
  el.ui.recTitle.textContent = s.rec;
  el.ui.tableTitle.textContent = s.table;
  el.ui.tableSub.textContent = s.tableSub;
  el.tableFilter.placeholder = s.filterPh;
  el.btnDownload.textContent = s.download;
  el.btnCalc.textContent = s.calc;
  el.btnReview.textContent = s.btnReview;
  el.btnGoTable.textContent = s.btnGoTable;
}

function setGuideImage(path){
  el.guideImage.classList.remove("hidden");
  el.imgFallback.classList.add("hidden");
  el.guideImage.src = path;

  el.guideImage.onerror = () => {
    el.guideImage.classList.add("hidden");
    el.imgFallback.classList.remove("hidden");
  };
}

// ---------------- Inputs (dynamic) ----------------
function renderInputs(){
  const p = PRODUCTS.find(x => x.id === state.productId);
  el.inputsArea.innerHTML = "";

  if (!p) return;

  if (p.type === "tops"){
    const wrap = document.createElement("div");
    wrap.className = "block";

    // body chest
    const f1 = document.createElement("div");
    f1.className = "field";
    const l1 = document.createElement("label");
    l1.textContent = `${t().inBodyChest} (${state.unit})`;
    const i1 = document.createElement("input");
    i1.id = "inputBodyChest";
    i1.type = "number";
    i1.inputMode = "decimal";
    i1.placeholder = state.lang === "jp" ? `${t().example} 88` : `${t().example} 34.6`;
    i1.className = "filter";
    i1.style.width = "100%";

    f1.appendChild(l1);
    f1.appendChild(i1);

    // ease
    const f2 = document.createElement("div");
    f2.className = "field";
    const l2 = document.createElement("label");
    l2.textContent = t().inEase;
    const sel = document.createElement("select");
    sel.id = "inputEase";
    sel.className = "filter";
    sel.style.width = "100%";

    EASE_CM.forEach((o) => {
      const opt = document.createElement("option");
      const v = (state.unit === "cm") ? o.v : +(o.v/2.54).toFixed(2);
      opt.value = String(v);
      opt.textContent = (state.lang === "jp") ? o.jp : o.en;
      sel.appendChild(opt);
    });

    f2.appendChild(l2);
    f2.appendChild(sel);

    wrap.appendChild(f1);
    wrap.appendChild(f2);

    el.inputsArea.appendChild(wrap);
  }

  if (p.type === "shoes"){
    const wrap = document.createElement("div");
    wrap.className = "block";

    // foot length
    const f1 = document.createElement("div");
    f1.className = "field";
    const l1 = document.createElement("label");
    l1.textContent = `${t().inFootLen} (${state.unit})`;
    const i1 = document.createElement("input");
    i1.id = "inputFootLen";
    i1.type = "number";
    i1.inputMode = "decimal";
    i1.placeholder = state.lang === "jp" ? `${t().example} 23.5` : `${t().example} 9.25`;
    i1.className = "filter";
    i1.style.width = "100%";

    f1.appendChild(l1);
    f1.appendChild(i1);

    // allowance
    const f2 = document.createElement("div");
    f2.className = "field";
    const l2 = document.createElement("label");
    l2.textContent = t().inAllow;
    const sel = document.createElement("select");
    sel.id = "inputAllow";
    sel.className = "filter";
    sel.style.width = "100%";

    ALLOW_CM.forEach((o) => {
      const opt = document.createElement("option");
      const v = (state.unit === "cm") ? o.v : +(o.v/2.54).toFixed(2);
      opt.value = String(v);
      opt.textContent = (state.lang === "jp") ? o.jp : o.en;
      sel.appendChild(opt);
    });

    f2.appendChild(l2);
    f2.appendChild(sel);

    wrap.appendChild(f1);
    wrap.appendChild(f2);

    el.inputsArea.appendChild(wrap);
  }
}

// ---------------- Load CSV + render table ----------------
async function fetchText(path){
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load: ${path}`);
  return await res.text();
}

function renderNotes(){
  const p = PRODUCTS.find(x => x.id === state.productId);
  if (!p) return;
  const lines = p.notes[state.lang] || [];
  el.notesBox.innerHTML = lines.map(x => `• ${x}`).join("<br>");
}

function renderTable(headers, rows){
  // head
  el.tableHead.innerHTML = "";
  const trh = document.createElement("tr");
  headers.forEach(h => {
    const th = document.createElement("th");
    th.textContent = h;
    trh.appendChild(th);
  });
  el.tableHead.appendChild(trh);

  // body
  el.tableBody.innerHTML = "";
  rows.forEach((r) => {
    const tr = document.createElement("tr");
    const sizeVal = r.__sizeVal || "";
    if (sizeVal) tr.dataset.size = String(sizeVal);

    headers.forEach(h => {
      const td = document.createElement("td");
      td.textContent = (r[h] ?? "");
      tr.appendChild(td);
    });
    el.tableBody.appendChild(tr);
  });

  // re-apply highlight if exists
  if (state.lastRecommendedSize){
    highlightRow(state.lastRecommendedSize, false);
  }
}

function filterTable(query){
  const q = (query || "").trim().toLowerCase();
  [...el.tableBody.querySelectorAll("tr")].forEach(tr => {
    if (!q){ tr.classList.remove("hidden"); return; }
    const txt = tr.textContent.toLowerCase();
    tr.classList.toggle("hidden", !txt.includes(q));
  });
}

function highlightRow(sizeVal, scroll = true){
  const rows = [...el.tableBody.querySelectorAll("tr")];
  rows.forEach(r => r.classList.remove("isHit"));

  const hit = rows.find(r => String(r.dataset.size) === String(sizeVal));
  if (hit){
    hit.classList.add("isHit");
    if (scroll){
      // まずテーブルまでスクロール → 次に行へ
      el.tableCard.scrollIntoView({ behavior:"smooth", block:"start" });
      setTimeout(() => hit.scrollIntoView({ behavior:"smooth", block:"center" }), 240);
    }
  }
}

async function loadAndRender(){
  const p = PRODUCTS.find(x => x.id === state.productId) || PRODUCTS[0];
  state.productId = p.id;

  // guide image
  setGuideImage(p.guideImg);

  // inputs + notes
  renderInputs();
  renderNotes();

  // load csv
  const csvPath = p.csv[state.unit];
  state.csvText = "";

  try{
    const text = await fetchText(csvPath);
    state.csvText = text;

    const parsed = parseCSV(text);
    state.headers = parsed.headers;
    state.rows = parsed.rows;

    // derive a "size" value for highlighting (best effort)
    const sizeHeader = findHeader(state.headers, [
      "size", "サイズ", "Size"
    ]);
    state.rows.forEach(r => r.__sizeVal = sizeHeader ? (r[sizeHeader] ?? "") : "");

    renderTable(state.headers, state.rows);
    hideNotice();
  }catch(err){
    // show graceful error, but keep UI alive
    showNotice(`${err.message}`);
    state.headers = [];
    state.rows = [];
    renderTable([], []);
  }
}

// ---------------- Recommendation logic ----------------
function recommend(){
  hideNotice();
  hideBasis();
  hideActions();

  const p = PRODUCTS.find(x => x.id === state.productId);
  if (!p){
    showNotice(t().errNoProduct);
    showActions();
    return;
  }

  if (!state.rows.length || !state.headers.length){
    showNotice("CSVが読み込めていません。data/ のファイル名とパスを確認してください。");
    showActions();
    return;
  }

  if (p.type === "tops"){
    const vChest = toNumber($("#inputBodyChest")?.value);
    const vEase = toNumber($("#inputEase")?.value);

    if (!isFinite(vChest) || !isFinite(vEase)){
      showNotice(t().errNoInput);
      showActions();
      return;
    }

    // find chest column: half chest or full chest
    const halfHeader = findHeader(state.headers, [
      "身幅", "chest(flat)", "chestflat", "halfchest", "halfchestwidth", "1/2chest", "chestwidth"
    ]);
    const fullHeader = findHeader(state.headers, [
      "胸囲", "chest", "garmentchest", "finishedchest", "chestcircumference"
    ]);
    const sizeHeader = findHeader(state.headers, ["size", "サイズ"]);

    const target = vChest + vEase;

    let best = null;
    for (const r of state.rows){
      const size = sizeHeader ? r[sizeHeader] : (r.__sizeVal || "");
      let garmentChest = NaN;

      if (halfHeader){
        garmentChest = toNumber(r[halfHeader]) * 2;
      } else if (fullHeader){
        garmentChest = toNumber(r[fullHeader]);
      }

      if (!isFinite(garmentChest)) continue;
      if (garmentChest >= target){
        if (!best || garmentChest < best.garmentChest){
          best = { size, garmentChest, target };
        }
      }
    }

    if (!best || !best.size){
      showNotice(t().errNoMatch);
      setResult("—");
      showActions();
      return;
    }

    state.lastRecommendedSize = String(best.size);
    setResult(String(best.size));

    const unit = state.unit;
    const chestTxt = `${vChest}${unit}`;
    const easeTxt = `+${vEase}${unit}`;
    const targetTxt = `${best.target.toFixed( (unit==="cm") ? 0 : 1 )}${unit}`;
    const gTxt = `${best.garmentChest.toFixed( (unit==="cm") ? 0 : 1 )}${unit}`;

    const basis = (state.lang === "jp")
      ? `根拠：胸囲 ${chestTxt} ${easeTxt} → 目標 ${targetTxt} ／ 仕上がり胸囲 ${gTxt} の「${best.size}」`
      : `Basis: body chest ${chestTxt} ${easeTxt} → target ${targetTxt} / garment chest ${gTxt} → "${best.size}"`;

    showBasis(basis);
    showActions();

    // highlight + scroll
    highlightRow(best.size, true);
    return;
  }

  if (p.type === "shoes"){
    const vFoot = toNumber($("#inputFootLen")?.value);
    const vAllow = toNumber($("#inputAllow")?.value);

    if (!isFinite(vFoot) || !isFinite(vAllow)){
      showNotice(t().errNoInput);
      showActions();
      return;
    }

    const sizeHeader = findHeader(state.headers, ["size", "サイズ"]);
    const footHeader = findHeader(state.headers, [
      "足の長さ", "footlength", "foot length", "foot"
    ]);

    const target = vFoot + vAllow;

    let best = null;
    for (const r of state.rows){
      const size = sizeHeader ? r[sizeHeader] : (r.__sizeVal || "");
      const fitFoot = footHeader ? toNumber(r[footHeader]) : NaN;
      if (!isFinite(fitFoot)) continue;

      if (fitFoot >= target){
        if (!best || fitFoot < best.fitFoot){
          best = { size, fitFoot, target };
        }
      }
    }

    if (!best || !best.size){
      showNotice(t().errNoMatch);
      setResult("—");
      showActions();
      return;
    }

    state.lastRecommendedSize = String(best.size);
    setResult(String(best.size));

    const unit = state.unit;
    const footTxt = `${vFoot}${unit}`;
    const alTxt = `+${vAllow}${unit}`;
    const targetTxt = `${best.target.toFixed( (unit==="cm") ? 1 : 2 )}${unit}`;
    const fitTxt = `${best.fitFoot.toFixed( (unit==="cm") ? 1 : 2 )}${unit}`;

    const basis = (state.lang === "jp")
      ? `根拠：足長 ${footTxt} ${alTxt} → 目標 ${targetTxt} ／ 対応足長 ${fitTxt} の「${best.size}」`
      : `Basis: foot ${footTxt} ${alTxt} → target ${targetTxt} / fits ${fitTxt} → "${best.size}"`;

    showBasis(basis);
    showActions();

    // highlight + scroll
    highlightRow(best.size, true);
    return;
  }
}

// ---------------- download ----------------
function downloadCSV(){
  if (!state.csvText) return;
  const p = PRODUCTS.find(x => x.id === state.productId);
  const name = (p ? `${p.id}_${state.unit}.csv` : `size_${state.unit}.csv`);
  const blob = new Blob([state.csvText], { type:"text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// ---------------- wiring ----------------
function init(){
  // footer year
  const y = new Date().getFullYear();
  el.footerCopy.textContent = `© ${y} Transcend Color Digital Apparel`;

  // initial
  state.productId = PRODUCTS[0].id;
  applyI18n();
  renderDropdown();

  // toggles
  el.btnJP.addEventListener("click", async () => {
    state.lang = "jp";
    setActive(el.btnJP, true);
    setActive(el.btnEN, false);
    applyI18n();
    renderDropdown();
    renderInputs();
    renderNotes();
  });

  el.btnEN.addEventListener("click", async () => {
    state.lang = "en";
    setActive(el.btnJP, false);
    setActive(el.btnEN, true);
    applyI18n();
    renderDropdown();
    renderInputs();
    renderNotes();
  });

  el.btnCM.addEventListener("click", async () => {
    state.unit = "cm";
    setActive(el.btnCM, true);
    setActive(el.btnIN, false);
    applyI18n();
    await loadAndRender();
  });

  el.btnIN.addEventListener("click", async () => {
    state.unit = "inch";
    setActive(el.btnCM, false);
    setActive(el.btnIN, true);
    applyI18n();
    await loadAndRender();
  });

  // calc
  el.btnCalc.addEventListener("click", () => {
    recommend();
  });

  // actions
  el.btnReview.addEventListener("click", () => {
    // focus first input if exists
    const first = el.inputsArea.querySelector("input,select");
    if (first) first.focus();
  });

  el.btnGoTable.addEventListener("click", () => {
    scrollToTable();
  });

  // filter
  el.tableFilter.addEventListener("input", (e) => {
    filterTable(e.target.value);
  });

  // download
  el.btnDownload.addEventListener("click", downloadCSV);

  // initial load
  loadAndRender();
}

init();
