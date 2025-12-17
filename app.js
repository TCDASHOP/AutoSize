// TCDA Size Guide (GitHub Pages)
// Hash params: #p=<productId>&u=cm|inch

const products = [
  {
    id: "womensSlipon",
    name: "Women's slip-on canvas shoes",
    guide: "assets/guide_slipon.jpg",
    cm: "data/womens_slipon_cm.csv",
    inch: "data/womens_slipon_inch.csv",
  },
  {
    id: "mensSlipon",
    name: "Men's slip-on canvas shoes",
    guide: "assets/guide_slipon.jpg",
    cm: "data/mens_slipon_cm.csv",
    inch: "data/mens_slipon_inch.csv",
  },
  {
    id: "womensCrew",
    name: "All-Over Print Women's Crew Neck T-Shirt",
    guide: "assets/guide_tshirt.jpg",
    cm: "data/aop_womens_crew_cm.csv",
    inch: "data/aop_womens_crew_inch.csv",
  },
  {
    id: "mensCrew",
    name: "All-over print men's crew neck T-shirt",
    guide: "assets/guide_tshirt.jpg",
    cm: "data/aop_mens_crew_cm.csv",
    inch: "data/aop_mens_crew_inch.csv",
  },
  {
    id: "hoodie",
    name: "All-Over Print Recycled Unisex Hoodie",
    guide: "assets/guide_hoodie.jpg",
    cm: "data/aop_recycled_hoodie_cm.csv",
    inch: "data/aop_recycled_hoodie_inch.csv",
  },
  {
    id: "zipHoodie",
    name: "All-Over Print Recycled Unisex Zip Hoodie",
    guide: "assets/guide_zip_hoodie.jpg",
    cm: "data/aop_recycled_zip_hoodie_cm.csv",
    inch: "data/aop_recycled_zip_hoodie_inch.csv",
  },
];

const elProduct = document.getElementById("productSelect");
const btnCm = document.getElementById("btnCm");
const btnInch = document.getElementById("btnInch");
const tableWrap = document.getElementById("tableWrap");
const guideImg = document.getElementById("guideImg");
const btnCopy = document.getElementById("btnCopy");
const btnDownload = document.getElementById("btnDownload");

let state = {
  productId: products[0].id,
  unit: "cm",
  currentCsvText: "",
};

function setActiveUnitButtons() {
  btnCm.classList.toggle("active", state.unit === "cm");
  btnInch.classList.toggle("active", state.unit === "inch");
}

function getProductById(id) {
  return products.find(p => p.id === id) || products[0];
}

function parseHash() {
  const hash = (location.hash || "").replace(/^#/, "");
  const params = new URLSearchParams(hash);
  const p = params.get("p");
  const u = params.get("u");
  if (p && products.some(x => x.id === p)) state.productId = p;
  if (u === "cm" || u === "inch") state.unit = u;
}

function writeHash() {
  const params = new URLSearchParams();
  params.set("p", state.productId);
  params.set("u", state.unit);
  const next = "#" + params.toString();
  if (location.hash !== next) history.replaceState(null, "", next);
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, m => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[m]));
}

// CSV parser that respects quotes (simple, enough for our files)
function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (c === '"' && next === '"') { field += '"'; i++; continue; }
      if (c === '"') { inQuotes = false; continue; }
      field += c;
      continue;
    }

    if (c === '"') { inQuotes = true; continue; }
    if (c === ",") { row.push(field); field = ""; continue; }
    if (c === "\r") continue;
    if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; continue; }
    field += c;
  }
  // last field
  row.push(field);
  rows.push(row);

  // normalize: drop empty rows
  const cleaned = rows
    .map(r => r.map(x => (x ?? "").trim()))
    .filter(r => r.some(x => x !== ""));
  return cleaned;
}

function buildTable(rows) {
  if (!rows.length) return "<div class='note' style='padding:12px'>CSVが空です</div>";

  const header = rows[0];
  const body = rows.slice(1);

  const thead = "<thead><tr>" + header.map(h => `<th>${escapeHtml(h)}</th>`).join("") + "</tr></thead>";
  const tbody = "<tbody>" + body.map(r => {
    // pad row
    const rr = r.slice();
    while (rr.length < header.length) rr.push("");
    return "<tr>" + rr.slice(0, header.length).map(v => `<td>${escapeHtml(v)}</td>`).join("") + "</tr>";
  }).join("") + "</tbody>";

  return `<table>${thead}${tbody}</table>`;
}

async function loadAndRender() {
  const p = getProductById(state.productId);
  guideImg.src = p.guide;

  setActiveUnitButtons();
  writeHash();

  const url = state.unit === "cm" ? p.cm : p.inch;
  btnDownload.href = url;

  tableWrap.innerHTML = "<div class='note' style='padding:12px'>読み込み中…</div>";

  try {
    const res = await fetch(url, { cache: "no-cache" });
    if (!res.ok) throw new Error("fetch failed");
    const text = await res.text();
    state.currentCsvText = text;

    const rows = parseCSV(text);
    tableWrap.innerHTML = buildTable(rows);
  } catch (e) {
    tableWrap.innerHTML = "<div class='note' style='padding:12px'>読み込みに失敗しました。ファイル名と配置を確認してください。</div>";
  }
}

function copyTableAsTSV() {
  const rows = parseCSV(state.currentCsvText);
  if (!rows.length) return;

  // TSV
  const tsv = rows.map(r => r.join("\t")).join("\n");
  navigator.clipboard.writeText(tsv).then(() => {
    btnCopy.textContent = "コピーしました";
    setTimeout(() => btnCopy.textContent = "表をコピー", 1200);
  }).catch(() => {
    // fallback
    const ta = document.createElement("textarea");
    ta.value = tsv;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    btnCopy.textContent = "コピーしました";
    setTimeout(() => btnCopy.textContent = "表をコピー", 1200);
  });
}

function init() {
  // populate select
  products.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.textContent = p.name;
    elProduct.appendChild(opt);
  });

  parseHash();

  elProduct.value = state.productId;
  setActiveUnitButtons();

  elProduct.addEventListener("change", () => {
    state.productId = elProduct.value;
    loadAndRender();
  });

  btnCm.addEventListener("click", () => {
    state.unit = "cm";
    loadAndRender();
  });

  btnInch.addEventListener("click", () => {
    state.unit = "inch";
    loadAndRender();
  });

  btnCopy.addEventListener("click", copyTableAsTSV);

  window.addEventListener("hashchange", () => {
    // allow external links to change state
    const before = { ...state };
    parseHash();
    if (before.productId !== state.productId) elProduct.value = state.productId;
    loadAndRender();
  });

  loadAndRender();
}

init();
