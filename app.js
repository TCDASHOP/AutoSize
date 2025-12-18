/* TCDA Size Guide — clarity-first UX (full rewrite) */

const $ = (q) => document.querySelector(q);

const el = {
  btnJP: $("#btnJP"),
  btnEN: $("#btnEN"),
  btnCM: $("#btnCM"),
  btnIN: $("#btnIN"),

  titleGuide: $("#titleGuide"),
  subGuide: $("#subGuide"),
  titleInput: $("#titleInput"),
  hintInput: $("#hintInput"),
  labelProduct: $("#labelProduct"),
  titleNotes: $("#titleNotes"),
  titleReco: $("#titleReco"),
  titleTable: $("#titleTable"),
  hintTable: $("#hintTable"),
  imgNote: $("#imgNote"),

  guideImage: $("#guideImage"),

  productSelect: $("#productSelect"),
  productBtn: $("#productBtn"),
  productBtnText: $("#productBtnText"),
  productPanel: $("#productPanel"),

  inputArea: $("#inputArea"),
  btnCalc: $("#btnCalc"),
  noticeBox: $("#noticeBox"),

  resultMain: $("#resultMain"),
  resultBasis: $("#resultBasis"),
  resultActions: $("#resultActions"),

  tableHead: $("#tableHead"),
  tableBody: $("#tableBody"),
  btnDownload: $("#btnDownload"),
  tableWrap: $("#tableWrap"),

  footerCopy: $("#footerCopy"),
};

const state = {
  lang: "jp",   // "jp" | "en"
  unit: "cm",   // "cm" | "inch"
  productId: null,
  table: null,  // { headers:[], rows:[{...}], rawRows:[[]] }
  highlightedSize: null,
};

const PRODUCTS = [
  {
    id: "mens_crew",
    kind: "apparel",
    guideImg: "assets/guide_tshirt.jpg",
    csv: { cm: "data/aop_mens_crew_cm.csv", inch: "data/aop_mens_crew_inch.csv" },
    label: {
      jp: ["メンズ クルーネックT", ""],
      en: ["Men’s Crew Neck", "T-Shirt"], // <- 2行
    }
  },
  {
    id: "womens_crew",
    kind: "apparel",
    guideImg: "assets/guide_tshirt.jpg",
    csv: { cm: "data/aop_womens_crew_cm.csv", inch: "data/aop_womens_crew_inch.csv" },
    label: {
      jp: ["ウィメンズ クルーネックT", ""],
      en: ["Women’s Crew Neck", "T-Shirt"],
    }
  },
  {
    id: "unisex_hoodie",
    kind: "apparel",
    guideImg: "assets/guide_hoodie.jpg",
    csv: { cm: "data/aop_recycled_hoodie_cm.csv", inch: "data/aop_recycled_hoodie_inch.csv" },
    label: {
      jp: ["ユニセックス パーカー", ""],
      en: ["Unisex", "Hoodie"],
    }
  },
  {
    id: "unisex_zip_hoodie",
    kind: "apparel",
    guideImg: "assets/guide_zip_hoodie.jpg",
    csv: { cm: "data/aop_recycled_zip_hoodie_cm.csv", inch: "data/aop_recycled_zip_hoodie_inch.csv" },
    label: {
      jp: ["ユニセックス ジップパーカー", ""],
      en: ["Unisex ZIP", "Hoodie"],
    }
  },
  {
    id: "womens_slipon",
    kind: "shoes",
    guideImg: "assets/guide_slipon.jpg",
    csv: { cm: "data/womens_slipon_cm.csv", inch: "data/womens_slipon_inch.csv" },
    label: {
      jp: ["ウィメンズ スリッポン", ""],
      en: ["Women’s Slip-On", "Canvas Shoes"],
    }
  },
  {
    id: "mens_slipon",
    kind: "shoes",
    guideImg: "assets/guide_slipon.jpg",
    csv: { cm: "data/mens_slipon_cm.csv", inch: "data/mens_slipon_inch.csv" },
    label: {
      jp: ["メンズ スリッポン", ""],
      en: ["Men’s Slip-On", "Canvas Shoes"],
    }
  },
];

const i18n = {
  jp: {
    guideTitle: "採寸ガイド",
    guideSub: "※画像は商品に応じて切り替わります",
    inputTitle: "サイズ算出（任意入力）",
    inputHint: "入力しなくてもサイズ表だけ見て選べます",
    product: "商品",
    calc: "おすすめサイズを計算",
    notes: "選ぶときの注意事項",
    reco: "おすすめ",
    table: "サイズ表",
    tableHint: "数値は平置き採寸です（誤差 ±1〜2）",
    placeholderProduct: "商品を選択してください",
    bodyChest: "ヌード胸囲（cm）",
    ease: "ゆとり（目安）",
    footLen: "足長（かかと〜一番長い指・cm）",
    allowance: "捨て寸（目安）",
    basisPrefix: "根拠：",
    notFound: "該当するサイズが見当たりませんでした。",
    fixBtn: "入力を見直す",
    chooseTableBtn: "サイズ表で選ぶ",
    noProduct: "まず商品を選択してください。",
    noInput: "必要な数値を入力してください。",
    apparelNotes: [
      "最短で失敗を減らす：手持ちの“いちばん好きな服”を平置きで測り、近い数値を選ぶ。",
      "体から逆算：ヌード胸囲＋ゆとり → 仕上がり胸囲 → 身幅（仕上がり胸囲÷2）。",
      "優先順位：身幅 → 着丈 → 袖丈（袖は肩線位置で体感が変わる）。",
      "フーディは裾リブ等で体感が変わるため、同じ数値でも印象が少し違うことがあります。"
    ],
    tshirtNotes: [
      "Men’sはゆったり・直線的、Women’sはフィット寄りになりやすい。",
      "最短で失敗を減らす：手持ちの“いちばん好きなTシャツ”の平置き寸法で照合。",
      "優先順位：身幅 → 着丈 → 袖丈（袖は肩線位置で体感が変わる）。"
    ],
    shoesNotes: [
      "主役は足長（左右を測り、長い方を採用）。",
      "足長＋捨て寸（目安7〜12mm）で選ぶ。",
      "アウトソール長は外寸なので、足長と同一視しない。",
      "幅/甲：Men’sは幅広め、Women’sはタイト寄り。迷ったら大きめ寄り。"
    ]
  },
  en: {
    guideTitle: "Measuring Guide",
    guideSub: "Image changes by product.",
    inputTitle: "Size recommendation (optional input)",
    inputHint: "You can also choose from the size table without input.",
    product: "Product",
    calc: "Calculate recommended size",
    notes: "Notes when choosing",
    reco: "Recommended",
    table: "Size Table",
    tableHint: "Values are flat measurements (±1–2).",
    placeholderProduct: "Select a product",
    bodyChest: "Body chest (in)",
    ease: "Ease (guide)",
    footLen: "Foot length (heel → longest toe, in)",
    allowance: "Allowance (guide)",
    basisPrefix: "Basis: ",
    notFound: "No matching size was found.",
    fixBtn: "Review input",
    chooseTableBtn: "Choose from table",
    noProduct: "Please select a product first.",
    noInput: "Please enter the required value(s).",
    apparelNotes: [
      "Fastest way to reduce mistakes: measure your favorite garment flat and match close numbers.",
      "Reverse-calc: body chest + ease → target garment chest → target half chest (÷2).",
      "Priority: half chest → length → sleeve (sleeve feel changes with shoulder seam).",
      "Hoodies can feel different even with the same numbers due to rib/structure."
    ],
    tshirtNotes: [
      "Men’s tends to be roomier/straight; Women’s may feel more fitted.",
      "Fastest way: compare with your favorite tee (flat measurements).",
      "Priority: half chest → length → sleeve."
    ],
    shoesNotes: [
      "Main metric is foot length (measure both feet; use the longer one).",
      "Choose by foot length + allowance (about 0.3–0.5 in).",
      "Outsole length is an outer measurement; do not treat it as foot length.",
      "Width/instep: Men’s tends to be wider; Women’s can feel tighter. If unsure, go slightly bigger."
    ]
  }
};

// ---------- CSV ----------
function parseCSV(text){
  // Simple CSV parser with quotes support
  const rows = [];
  let row = [];
  let cur = "";
  let inQuotes = false;

  for(let i=0;i<text.length;i++){
    const c = text[i];
    const n = text[i+1];

    if(c === '"' && inQuotes && n === '"'){
      cur += '"'; i++; continue;
    }
    if(c === '"'){
      inQuotes = !inQuotes; continue;
    }
    if(c === "\r") continue;

    if(c === "," && !inQuotes){
      row.push(cur); cur=""; continue;
    }
    if(c === "\n" && !inQuotes){
      row.push(cur); rows.push(row);
      row = []; cur=""; continue;
    }
    cur += c;
  }
  row.push(cur);
  rows.push(row);

  // remove empty trailing rows
  const cleaned = rows.filter(r => r.some(v => String(v).trim() !== ""));
  return cleaned;
}

function toNum(v){
  if(v == null) return NaN;
  const s = String(v).replace(/[^\d.\-]/g,"").trim();
  if(!s) return NaN;
  return Number(s);
}

function findHeader(headers, candidates){
  const norm = (x)=>String(x).toLowerCase().replace(/\s+/g," ").trim();
  const map = headers.map(h => norm(h));
  for(const cand of candidates){
    const idx = map.indexOf(norm(cand));
    if(idx >= 0) return headers[idx];
  }
  // contains match
  for(const cand of candidates){
    const c = norm(cand);
    for(let i=0;i<map.length;i++){
      if(map[i].includes(c)) return headers[i];
    }
  }
  return null;
}

async function loadTable(product, unit){
  const path = product.csv[unit];
  const res = await fetch(path, { cache: "no-store" });
  if(!res.ok) throw new Error(`CSV fetch failed: ${path}`);
  const text = await res.text();
  const grid = parseCSV(text);

  const headers = grid[0].map(h => String(h).trim());
  const rows = grid.slice(1).map(r=>{
    const obj = {};
    headers.forEach((h,i)=> obj[h] = (r[i] ?? "").trim());
    return obj;
  });

  return { headers, rows, path };
}

// ---------- UI ----------
function setLang(lang){
  state.lang = lang;
  el.btnJP.classList.toggle("is-active", lang==="jp");
  el.btnEN.classList.toggle("is-active", lang==="en");

  // language default unit (you can still switch manually)
  if(lang === "jp") setUnit("cm", {silent:true});
  if(lang === "en") setUnit("inch", {silent:true});

  renderTexts();
  renderProductButtonText();
  renderInputs();
  renderNotes();
  renderResultReset();
  renderTable(); // re-render (head labels depend on CSV; keep)
}

function setUnit(unit, opts={silent:false}){
  state.unit = unit;
  el.btnCM.classList.toggle("is-active", unit==="cm");
  el.btnIN.classList.toggle("is-active", unit==="inch");
  if(!opts.silent){
    refreshForProduct();
  }
}

function productById(id){
  return PRODUCTS.find(p => p.id === id) || null;
}

function renderTexts(){
  const t = i18n[state.lang];
  el.titleGuide.textContent = t.guideTitle;
  el.subGuide.textContent = t.guideSub;
  el.titleInput.textContent = t.inputTitle;
  el.hintInput.textContent = t.inputHint;
  el.labelProduct.textContent = t.product;
  el.btnCalc.textContent = t.calc;
  el.titleNotes.textContent = t.notes;
  el.titleReco.textContent = t.reco;
  el.titleTable.textContent = t.table;
  el.hintTable.textContent = t.tableHint;

  // footer year (auto)
  const y = new Date().getFullYear();
  el.footerCopy.textContent = `© ${y} Transcend Color Digital Apparel`;
}

function openProductDropdown(open){
  el.productSelect.classList.toggle("is-open", open);
  el.productBtn.setAttribute("aria-expanded", open ? "true" : "false");
}

function buildProductDropdown(){
  el.productPanel.innerHTML = "";
  PRODUCTS.forEach(p=>{
    const lines = p.label[state.lang];
    const opt = document.createElement("div");
    opt.className = "opt";
    opt.setAttribute("role","option");
    opt.dataset.value = p.id;

    const t = document.createElement("div");
    t.className = "opt__t";

    const l1 = document.createElement("div");
    l1.textContent = lines[0] || "";
    t.appendChild(l1);

    if(lines[1]){
      const l2 = document.createElement("div");
      l2.className = "opt__l2";
      l2.textContent = lines[1];
      t.appendChild(l2);
    }

    opt.appendChild(t);

    opt.addEventListener("click", ()=>{
      setProduct(p.id);
      openProductDropdown(false);
    });

    el.productPanel.appendChild(opt);
  });
  syncSelectedOption();
}

function syncSelectedOption(){
  const opts = [...el.productPanel.querySelectorAll(".opt")];
  opts.forEach(o=>{
    o.classList.toggle("is-selected", o.dataset.value === state.productId);
  });
}

function renderProductButtonText(){
  const t = i18n[state.lang];
  const p = productById(state.productId);
  el.productBtnText.innerHTML = "";
  if(!p){
    el.productBtnText.textContent = t.placeholderProduct;
    return;
  }
  const lines = p.label[state.lang];
  const l1 = document.createElement("div");
  l1.textContent = lines[0] || "";
  el.productBtnText.appendChild(l1);
  if(lines[1]){
    const l2 = document.createElement("div");
    l2.className = "line2";
    l2.textContent = lines[1];
    el.productBtnText.appendChild(l2);
  }
  syncSelectedOption();
}

function setGuideImage(src){
  // cache-bust helps when Safari holds old image
  el.guideImage.src = `${src}?v=${Date.now()}`;
  // alt note is stable
}

function renderNotes(){
  const t = i18n[state.lang];
  const p = productById(state.productId);

  let lines = [];
  if(!p){
    lines = [];
  }else if(p.kind === "shoes"){
    lines = t.shoesNotes;
  }else{
    // tee vs hoodie notes
    if(p.id.includes("crew")) lines = t.tshirtNotes;
    else lines = t.apparelNotes;
  }

  if(lines.length === 0){
    el.noticeBox.textContent = "—";
    return;
  }

  el.noticeBox.innerHTML = `<ul style="margin:0; padding-left:18px;">${
    lines.map(s=>`<li>${escapeHTML(s)}</li>`).join("")
  }</ul>`;
}

function renderInputs(){
  const t = i18n[state.lang];
  const p = productById(state.productId);
  el.inputArea.innerHTML = "";

  if(!p){
    el.btnCalc.disabled = true;
    return;
  }

  const wrap = document.createElement("div");
  wrap.className = "inputRow";

  if(p.kind === "apparel"){
    // body chest
    const chest = document.createElement("div");
    chest.innerHTML = `
      <label class="label">${t.bodyChest}</label>
      <input id="inBodyChest" class="input" inputmode="decimal" placeholder="${state.lang==='jp'?'例: 88':'e.g. 34.6'}" />
    `;
    wrap.appendChild(chest);

    // ease
    const ease = document.createElement("div");
    const easeSelect = document.createElement("select");
    easeSelect.id = "selEase";
    easeSelect.className = "select";

    const easeCm = [8,10,12];
    const easeIn = easeCm.map(v => +(v/2.54).toFixed(1)); // 3.1 / 3.9 / 4.7

    const opts = state.unit === "cm" ? easeCm : easeIn;
    const labels = opts.map(v=>{
      if(state.lang==="jp"){
        return `標準（+${v}${state.unit} 目安）`;
      }
      return `Standard (+${v} ${state.unit})`;
    });

    labels.forEach((lab,i)=>{
      const o = document.createElement("option");
      o.value = String(opts[i]);
      o.textContent = lab;
      easeSelect.appendChild(o);
    });

    ease.innerHTML = `<label class="label">${t.ease}</label>`;
    ease.appendChild(easeSelect);
    wrap.appendChild(ease);

  }else{
    // shoes
    const foot = document.createElement("div");
    foot.innerHTML = `
      <label class="label">${t.footLen}</label>
      <input id="inFootLen" class="input" inputmode="decimal" placeholder="${state.lang==='jp'?'例: 23.5':'e.g. 9.3'}" />
    `;
    wrap.appendChild(foot);

    const allowance = document.createElement("div");
    const sel = document.createElement("select");
    sel.id = "selAllowance";
    sel.className = "select";

    // 7–12mm ≈ 0.7–1.2cm ≈ 0.3–0.5in
    const allowCm = [0.7, 1.0, 1.2];
    const allowIn = allowCm.map(v => +(v/2.54).toFixed(1)); // 0.3 / 0.4 / 0.5
    const opts = state.unit === "cm" ? allowCm : allowIn;

    opts.forEach((v,idx)=>{
      const o = document.createElement("option");
      o.value = String(v);
      if(state.lang==="jp"){
        const tag = idx===1 ? "（標準）" : "";
        o.textContent = `+${v}${state.unit} ${tag}`.trim();
      }else{
        const tag = idx===1 ? " (standard)" : "";
        o.textContent = `+${v} ${state.unit}${tag}`;
      }
      sel.appendChild(o);
    });

    allowance.innerHTML = `<label class="label">${t.allowance}</label>`;
    allowance.appendChild(sel);
    wrap.appendChild(allowance);
  }

  el.inputArea.appendChild(wrap);
  el.btnCalc.disabled = false;
}

function renderResultReset(){
  el.resultMain.textContent = "—";
  el.resultBasis.textContent = "";
  el.resultActions.innerHTML = "";
  clearHighlight();
}

function clearHighlight(){
  state.highlightedSize = null;
  [...el.tableBody.querySelectorAll("tr")].forEach(tr=>tr.classList.remove("hl"));
}

function setProduct(productId){
  state.productId = productId;
  renderProductButtonText();
  renderNotes();
  renderInputs();
  renderResultReset();

  const p = productById(productId);
  if(p){
    setGuideImage(p.guideImg);
  }
  refreshForProduct();
}

async function refreshForProduct(){
  const p = productById(state.productId);
  if(!p){
    el.btnDownload.href = "#";
    el.btnDownload.classList.add("is-disabled");
    el.tableHead.innerHTML = "";
    el.tableBody.innerHTML = "";
    return;
  }

  try{
    const table = await loadTable(p, state.unit);
    state.table = table;

    el.btnDownload.href = table.path;
    el.btnDownload.download = table.path.split("/").pop();

    renderTable();
  }catch(e){
    // if CSV fails, clear table but keep UI alive
    state.table = null;
    el.tableHead.innerHTML = "";
    el.tableBody.innerHTML = "";
    el.btnDownload.href = "#";
    showError(i18n[state.lang].notFound);
  }
}

function renderTable(){
  clearHighlight();
  if(!state.table){
    el.tableHead.innerHTML = "";
    el.tableBody.innerHTML = "";
    return;
  }

  const { headers, rows } = state.table;

  el.tableHead.innerHTML = `
    <tr>${headers.map(h=>`<th>${escapeHTML(h)}</th>`).join("")}</tr>
  `;

  el.tableBody.innerHTML = rows.map(r=>{
    const sizeVal = r[findHeader(headers, ["Size","サイズ"]) || headers[0]] ?? "";
    return `<tr data-size="${escapeHTML(String(sizeVal))}">
      ${headers.map(h=>`<td>${escapeHTML(String(r[h] ?? ""))}</td>`).join("")}
    </tr>`;
  }).join("");
}

// ---------- Recommendation ----------
function showError(msg){
  const t = i18n[state.lang];
  el.resultMain.textContent = msg;
  el.resultBasis.textContent = "";
  el.resultActions.innerHTML = `
    <button class="btn" type="button" id="actFix">${t.fixBtn}</button>
    <button class="btn" type="button" id="actTable">${t.chooseTableBtn}</button>
  `;
  $("#actFix").addEventListener("click", ()=>scrollToInputs(true));
  $("#actTable").addEventListener("click", ()=>scrollToTable(true));
}

function showResult(sizeLabel, basisLine){
  const t = i18n[state.lang];
  el.resultMain.textContent = sizeLabel;
  el.resultBasis.textContent = basisLine ? `${t.basisPrefix}${basisLine}` : "";
  el.resultActions.innerHTML = `
    <button class="btn" type="button" id="actFix">${t.fixBtn}</button>
    <button class="btn" type="button" id="actTable">${t.chooseTableBtn}</button>
  `;
  $("#actFix").addEventListener("click", ()=>scrollToInputs(true));
  $("#actTable").addEventListener("click", ()=>scrollToTable(true));
}

function scrollToInputs(smooth){
  const top = el.inputArea.getBoundingClientRect().top + window.scrollY - 110;
  window.scrollTo({ top, behavior: smooth ? "smooth" : "auto" });
  // focus first input
  const first = el.inputArea.querySelector("input");
  if(first) setTimeout(()=>first.focus(), 250);
}

function scrollToTable(smooth){
  const top = el.tableWrap.getBoundingClientRect().top + window.scrollY - 110;
  window.scrollTo({ top, behavior: smooth ? "smooth" : "auto" });
}

function highlightSizeRow(sizeValue){
  clearHighlight();
  if(!sizeValue) return;
  const row = el.tableBody.querySelector(`tr[data-size="${CSS.escape(String(sizeValue))}"]`);
  if(!row) return;
  row.classList.add("hl");
  state.highlightedSize = String(sizeValue);

  // auto scroll to highlighted row (your request)
  setTimeout(()=>{
    row.scrollIntoView({ behavior:"smooth", block:"center" });
  }, 120);
}

function recommend(){
  const t = i18n[state.lang];
  const p = productById(state.productId);
  if(!p){
    showError(t.noProduct);
    return;
  }
  if(!state.table || !state.table.rows.length){
    showError(t.notFound);
    return;
  }

  const { headers, rows } = state.table;
  const sizeKey = findHeader(headers, ["Size","サイズ"]) || headers[0];

  if(p.kind === "apparel"){
    const inChest = $("#inBodyChest");
    const easeSel = $("#selEase");
    const body = toNum(inChest?.value);
    const ease = toNum(easeSel?.value);

    if(!isFinite(body) || !isFinite(ease)){
      showError(t.noInput);
      return;
    }

    // target garment chest and half chest
    const targetChest = body + ease;
    const targetHalf = targetChest / 2;

    // find half-chest column
    const halfKey =
      findHeader(headers, [
        "1/2 Chest Width",
        "Half Chest Width",
        "Chest (flat)",
        "Chest flat",
        "身幅",
        "身幅（平置き）",
        "身幅 (平置き)",
        "身幅（平置き）　",
        "Half chest",
      ]);

   
    // if we can't find a usable column, we still show user-friendly notFound
    if(!halfKey){
      showError(t.notFound);
      return;
    }

    // choose smallest size where half >= targetHalf
    const candidates = rows
      .map(r => ({ size: r[sizeKey], half: toNum(r[halfKey]), row: r }))
      .filter(x => isFinite(x.half));

    const sorted = candidates.slice().sort((a,b)=>a.half-b.half);
    const pick = sorted.find(x => x.half >= targetHalf);

    if(!pick){
      showError(t.notFound);
      return;
    }

    const basisLine = (state.lang==="jp")
      ? `仕上がり胸囲=${fmt(body)}+${fmt(ease)}=${fmt(targetChest)} → 身幅目安=${fmt(targetHalf)}`
      : `target garment chest = ${fmt(body)} + ${fmt(ease)} = ${fmt(targetChest)} → target half chest = ${fmt(targetHalf)}`;

    showResult(String(pick.size), basisLine);
    highlightSizeRow(pick.size);

  }else{
    // shoes
    const inFoot = $("#inFootLen");
    const allowSel = $("#selAllowance");
    const foot = toNum(inFoot?.value);
    const allow = toNum(allowSel?.value);

    if(!isFinite(foot) || !isFinite(allow)){
      showError(t.noInput);
      return;
    }

    const target = foot + allow;

    const footKey =
      findHeader(headers, [
        "Foot length",
        "Foot Length",
        "Length",
        "足の長さ",
        "足長",
        "足長さ",
        "足長（cm）",
        "足長 (cm)",
      ]);

    if(!footKey){
      showError(t.notFound);
      return;
    }

    const candidates = rows
      .map(r => ({ size: r[sizeKey], foot: toNum(r[footKey]), row: r }))
      .filter(x => isFinite(x.foot));

    const sorted = candidates.slice().sort((a,b)=>a.foot-b.foot);
    const pick = sorted.find(x => x.foot >= target);

    if(!pick){
      showError(t.notFound);
      return;
    }

    const basisLine = (state.lang==="jp")
      ? `足長目安=${fmt(foot)}+${fmt(allow)}=${fmt(target)} → 以上で最小のサイズ`
      : `target foot length = ${fmt(foot)} + ${fmt(allow)} = ${fmt(target)} → smallest size that meets/exceeds target`;

    showResult(String(pick.size), basisLine);
    highlightSizeRow(pick.size);
  }
}

function fmt(n){
  if(!isFinite(n)) return "";
  // keep 1 decimal for inch-like values, 1 decimal for cm shoe allowance too
  const s = (Math.round(n*10)/10).toFixed(1);
  // remove trailing .0 when looks nicer
  return s.endsWith(".0") ? s.slice(0,-2) : s;
}

function escapeHTML(s){
  return String(s)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

// ---------- Events ----------
el.btnJP.addEventListener("click", ()=>setLang("jp"));
el.btnEN.addEventListener("click", ()=>setLang("en"));
el.btnCM.addEventListener("click", ()=>setUnit("cm"));
el.btnIN.addEventListener("click", ()=>setUnit("inch"));

el.productBtn.addEventListener("click", (e)=>{
  e.stopPropagation();
  buildProductDropdown();
  openProductDropdown(!el.productSelect.classList.contains("is-open"));
});

document.addEventListener("click", ()=>{
  openProductDropdown(false);
});

el.btnCalc.addEventListener("click", ()=>{
  recommend();
});

// ---------- Init ----------
(function init(){
  renderTexts();
  buildProductDropdown();
  renderProductButtonText();
  renderInputs();
  renderNotes();
  renderResultReset();

  // default product (optional): Men’s crew
  setProduct("mens_crew");
})();
