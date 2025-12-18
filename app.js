/* TCDA Size Guide (CSV-driven)
   - JP: cm fixed
   - EN: inch fixed
   - Per-category tips + simple recommendation helper
*/

const state = {
  lang: "JP",          // JP / EN
  unit: "cm",          // cm / inch (derived from lang)
  productKey: "mens_crew",
  table: null,         // { headers:[], rows:[{...}] }
};

const PRODUCTS = [
  {
    key: "womens_slipon",
    category: "shoes",
    name: { JP: "Women's slip-on canvas shoes", EN: "Women's slip-on canvas shoes" },
    nameShort: { JP: "ウィメンズ スリッポン", EN: "Women’s Slip-On" },
    csvBase: "womens_slipon",
    guide: "./assets/guide_slipon.jpg",
  },
  {
    key: "mens_slipon",
    category: "shoes",
    name: { JP: "Men's slip-on canvas shoes", EN: "Men's slip-on canvas shoes" },
    nameShort: { JP: "メンズ スリッポン", EN: "Men’s Slip-On" },
    csvBase: "mens_slipon",
    guide: "./assets/guide_slipon.jpg",
  },
  {
    key: "womens_crew",
    category: "tshirt",
    name: { JP: "Women's Crew Neck T-Shirt", EN: "Women's Crew Neck T-Shirt" },
    nameShort: { JP: "ウィメンズ クルーネックT", EN: "Women’s Crew Neck T-Shirt" },
    csvBase: "aop_womens_crew",
    guide: "./assets/guide_tshirt.jpg",
  },
  {
    key: "mens_crew",
    category: "tshirt",
    name: { JP: "Men's Crew Neck T-Shirt", EN: "Men's Crew Neck T-Shirt" },
    nameShort: { JP: "メンズ クルーネックT", EN: "Men’s Crew Neck T-Shirt" },
    csvBase: "aop_mens_crew",
    guide: "./assets/guide_tshirt.jpg",
  },
  {
    key: "unisex_hoodie",
    category: "hoodie",
    name: { JP: "Unisex Hoodie", EN: "Unisex Hoodie" },
    nameShort: { JP: "ユニセックス パーカー", EN: "Unisex Hoodie" },
    csvBase: "aop_recycled_hoodie",
    guide: "./assets/guide_hoodie.jpg",
  },
  {
    key: "unisex_zip_hoodie",
    category: "hoodie",
    name: { JP: "Unisex ZIP Hoodie", EN: "Unisex ZIP Hoodie" },
    nameShort: { JP: "ユニセックス ZIP", EN: "Unisex ZIP Hoodie" },
    csvBase: "aop_recycled_zip_hoodie",
    guide: "./assets/guide_zip_hoodie.jpg",
  },
];

const TEXT = {
  JP: {
    product: "商品",
    unit: "単位",
    guide: "採寸ガイド",
    tips: "選ぶときの注意事項",
    calc: "サイズ目安（入力）",
    table: "サイズ表",
    recommend: "おすすめ",
    imgNote: "※ 画像は商品に応じて切り替わります",
    resultNone: "—",
    // calculator labels
    chest: "ヌード胸囲（体の胸囲）",
    fit: "着用のゆとり",
    fit_regular: "標準（+8〜12cm 目安）",
    fit_relaxed: "ゆったり（+12〜16cm 目安）",
    fit_oversize: "オーバー（+16〜22cm 目安）",
    foot: "足長（かかと〜一番長い指）",
    allowance: "捨て寸",
    calcBtn: "おすすめサイズを計算",
    metaTop: "胸囲→仕上がり胸囲→身幅（平置き×2）で照合",
    metaShoe: "足長＋捨て寸で「Foot length」に近いサイズを選定",
  },
  EN: {
    product: "Product",
    unit: "Unit",
    guide: "Measurement Guide",
    tips: "Sizing Tips",
    calc: "Quick Recommendation",
    table: "Size Table",
    recommend: "Recommended",
    imgNote: "Image changes by product.",
    resultNone: "—",
    // calculator labels
    chest: "Nude chest (body)",
    fit: "Ease preference",
    fit_regular: "Regular (+3–5 in typical)",
    fit_relaxed: "Relaxed (+5–6 in typical)",
    fit_oversize: "Oversized (+6–9 in typical)",
    foot: "Foot length (heel → longest toe)",
    allowance: "Allowance",
    calcBtn: "Calculate recommended size",
    metaTop: "Match: body chest → finished chest → chest width (flat ×2)",
    metaShoe: "Use: foot length + allowance, match to Foot length",
  },
};

function $(id) { return document.getElementById(id); }

function setLang(lang) {
  state.lang = lang;
  state.unit = (lang === "JP") ? "cm" : "inch";

  $("langJP").classList.toggle("is-active", lang === "JP");
  $("langEN").classList.toggle("is-active", lang === "EN");
  $("langJP").setAttribute("aria-pressed", lang === "JP");
  $("langEN").setAttribute("aria-pressed", lang === "EN");

  applyText();
  loadProduct(state.productKey);
}

function applyText() {
  const t = TEXT[state.lang];
  $("productLabel").textContent = t.product;
  $("unitLabel").textContent = t.unit;
  $("unitValue").textContent = state.unit;
  $("guideTitle").textContent = t.guide;
  $("tipsTitle").textContent = t.tips;
  $("calcTitle").textContent = t.calc;
  $("tableTitle").textContent = t.table;
  $("resultLabel").textContent = t.recommend;
  $("imgNote").textContent = t.imgNote;

  // product select options (language-aware)
  const sel = $("productSelect");
  sel.innerHTML = "";
  for (const p of PRODUCTS) {
    const opt = document.createElement("option");
    opt.value = p.key;
    // 表示は短く、改行はしない（iOS selectが崩れるので）
    opt.textContent = (state.lang === "JP") ? p.nameShort.JP : p.nameShort.EN;
    sel.appendChild(opt);
  }
  sel.value = state.productKey;
}

function getProduct(key) {
  return PRODUCTS.find(p => p.key === key) || PRODUCTS[0];
}

function csvPathFor(product) {
  const suffix = (state.unit === "cm") ? "_cm.csv" : "_inch.csv";
  return `./data/${product.csvBase}${suffix}`;
}

/* -------- CSV parser (quotes supported) -------- */
function parseCSV(text) {
  const lines = text.replace(/\r/g, "").split("\n").filter(l => l.trim().length > 0);
  const rows = lines.map(parseCSVLine);
  const headers = rows[0].map(h => h.trim());
  const data = [];
  for (let i = 1; i < rows.length; i++) {
    const obj = {};
    for (let c = 0; c < headers.length; c++) {
      obj[headers[c]] = (rows[i][c] ?? "").trim();
    }
    data.push(obj);
  }
  return { headers, rows: data };
}

function parseCSVLine(line) {
  const out = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQ && line[i + 1] === '"') { cur += '"'; i++; }
      else { inQ = !inQ; }
    } else if (ch === "," && !inQ) {
      out.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

/* -------- numeric parsing for cm / inch incl fractions -------- */
const UNICODE_FRACTIONS = {
  "¼": 0.25, "½": 0.5, "¾": 0.75,
  "⅛": 0.125, "⅜": 0.375, "⅝": 0.625, "⅞": 0.875,
  "⅓": 1 / 3, "⅔": 2 / 3,
  "⅕": 0.2, "⅖": 0.4, "⅗": 0.6, "⅘": 0.8,
  "⅙": 1 / 6, "⅚": 5 / 6,
};

function toNumber(v) {
  if (v == null) return NaN;
  let s = String(v).trim();
  if (!s) return NaN;

  // normalize weird spaces
  s = s.replace(/\u00A0/g, " ");

  // pure float
  if (/^[0-9]+(\.[0-9]+)?$/.test(s)) return parseFloat(s);

  // "10 1/4"
  if (/^[0-9]+\s+[0-9]+\/[0-9]+$/.test(s)) {
    const [w, f] = s.split(/\s+/);
    const [a, b] = f.split("/").map(Number);
    return Number(w) + (a / b);
  }

  // "1/4"
  if (/^[0-9]+\/[0-9]+$/.test(s)) {
    const [a, b] = s.split("/").map(Number);
    return a / b;
  }

  // unicode fraction "9 ⅛" or just "⅛"
  for (const uf of Object.keys(UNICODE_FRACTIONS)) {
    if (s === uf) return UNICODE_FRACTIONS[uf];
    if (s.endsWith(uf)) {
      const base = s.replace(uf, "").trim();
      const whole = base ? parseFloat(base) : 0;
      if (!Number.isNaN(whole)) return whole + UNICODE_FRACTIONS[uf];
    }
  }

  // fallback: pick first float in string
  const m = s.match(/[0-9]+(\.[0-9]+)?/);
  return m ? parseFloat(m[0]) : NaN;
}

/* -------- column detection -------- */
function findHeader(headers, candidates) {
  const lower = headers.map(h => h.toLowerCase());
  for (const c of candidates) {
    const idx = lower.findIndex(h => h.includes(c));
    if (idx >= 0) return headers[idx];
  }
  return null;
}

function renderTable(table) {
  const wrap = $("tableArea");
  wrap.innerHTML = "";

  const t = document.createElement("table");
  t.className = "dataTable";

  const thead = document.createElement("thead");
  const trh = document.createElement("tr");
  for (const h of table.headers) {
    const th = document.createElement("th");
    th.textContent = h;
    trh.appendChild(th);
  }
  thead.appendChild(trh);
  t.appendChild(thead);

  const tbody = document.createElement("tbody");
  for (const row of table.rows) {
    const tr = document.createElement("tr");
    for (const h of table.headers) {
      const td = document.createElement("td");
      td.textContent = row[h] ?? "";
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  t.appendChild(tbody);

  wrap.appendChild(t);
}

function setGuideImage(product) {
  $("guideImage").src = product.guide;
  $("guideImage").alt = `${product.name[state.lang]} guide`;
}

/* -------- tips by category -------- */
function setTips(product) {
  const ul = $("tipsList");
  ul.innerHTML = "";
  const lang = state.lang;

  const tipsByCat = {
    tshirt: {
      JP: [
        "Men’s はゆったり・直線的、Women’s はフィット寄りになりやすい。",
        "最短で失敗を減らす：手持ちの「いちばん好きなTシャツ」を平置きで測り、近い数値を選ぶ。",
        "体から逆算：ヌード胸囲＋ゆとり → 仕上がり胸囲 → 身幅（仕上がり胸囲÷2）。",
        "優先順位：身幅 → 着丈 → 袖丈（袖は肩線位置で体感が変わる）。",
      ],
      EN: [
        "Men’s tees tend to feel straighter/roomier; Women’s tees tend to feel more fitted.",
        "Fastest, safest route: measure your favorite tee (flat) and pick the closest numbers.",
        "From body: nude chest + ease → finished chest → chest width (finished chest ÷ 2).",
        "Priority: chest width → length → sleeve (sleeve feel changes with shoulder seam).",
      ]
    },
    hoodie: {
      JP: [
        "基本はTシャツと同じ：胸囲基準＋ゆとりで身幅を合わせ、次に着丈、最後に袖。",
        "フーディは裾リブ等で体感が変わるため、同じ数値でも印象が少し違う。",
      ],
      EN: [
        "Same base logic as tees: match chest width first, then length, then sleeves.",
        "Hoodies can feel different even with same numbers due to ribbing and structure.",
      ]
    },
    shoes: {
      JP: [
        "主役は足長（かかと〜一番長い指）。左右を測って長い方を採用。",
        "捨て寸：足長＋7〜12mm（目安）。アウトソール長は外寸なので同一視しない。",
        "Men’s は幅広め、Women’s はタイトになりやすい。幅広/甲高は注意（迷ったら大きめ寄り）。",
      ],
      EN: [
        "Main metric is foot length (heel → longest toe). Measure both feet; use the longer one.",
        "Allowance: foot length + ~0.25–0.5 in. Outsole length is external; don’t treat it as foot length.",
        "Men’s tends to be wider; Women’s can feel tighter. Wide/high instep: consider sizing up if unsure.",
      ]
    }
  };

  const tips = tipsByCat[product.category]?.[lang] ?? [];
  for (const s of tips) {
    const li = document.createElement("li");
    li.textContent = s;
    ul.appendChild(li);
  }
}

/* -------- calculator UI + recommendation -------- */
function renderCalculator(product, table) {
  const area = $("calcArea");
  area.innerHTML = "";

  $("resultValue").textContent = TEXT[state.lang].resultNone;
  $("resultMeta").textContent = "";

  if (!table) return;

  if (product.category === "tshirt" || product.category === "hoodie") {
    const t = TEXT[state.lang];

    const chestHeader =
      findHeader(table.headers, ["身幅", "chest", "width"]) ||
      table.headers[1] || null;

    const sizeHeader =
      findHeader(table.headers, ["サイズ", "size"]) ||
      table.headers[0] || null;

    const chestRowInfo = document.createElement("div");
    chestRowInfo.className = "miniNote";
    chestRowInfo.textContent = (state.lang === "JP")
      ? "計算は「身幅（平置き）×2」を仕上がり胸囲として扱います。"
      : "We treat “chest width (flat) × 2” as the finished chest.";

    area.appendChild(chestRowInfo);

    const row1 = document.createElement("div");
    row1.className = "calc__row";

    row1.innerHTML = `
      <div class="field">
        <label class="label">${t.chest} (${state.unit})</label>
        <input id="inpChest" class="input" inputmode="decimal" type="number" min="0" step="0.1" placeholder="${state.unit === "cm" ? "例: 88" : "e.g. 36.5"}">
      </div>

      <div class="field">
        <label class="label">${t.fit}</label>
        <select id="inpFit" class="select">
          <option value="regular">${t.fit_regular}</option>
          <option value="relaxed">${t.fit_relaxed}</option>
          <option value="oversize">${t.fit_oversize}</option>
        </select>
      </div>
    `;
    area.appendChild(row1);

    const btn = document.createElement("button");
    btn.className = "btn";
    btn.type = "button";
    btn.textContent = t.calcBtn;
    btn.addEventListener("click", () => {
      const nude = parseFloat($("inpChest").value);
      if (!nude || nude <= 0) {
        $("resultValue").textContent = state.lang === "JP" ? "胸囲を入力してください" : "Enter your chest measurement";
        $("resultMeta").textContent = "";
        return;
      }
      const fit = $("inpFit").value;

      // ease defaults
      let easeMin, easeMax;
      if (state.unit === "cm") {
        if (fit === "regular") [easeMin, easeMax] = [8, 12];
        if (fit === "relaxed") [easeMin, easeMax] = [12, 16];
        if (fit === "oversize") [easeMin, easeMax] = [16, 22];
      } else {
        if (fit === "regular") [easeMin, easeMax] = [3, 5];
        if (fit === "relaxed") [easeMin, easeMax] = [5, 6];
        if (fit === "oversize") [easeMin, easeMax] = [6, 9];
      }

      const targetMin = nude + easeMin;
      const targetMax = nude + easeMax;

      // pick smallest size where (chestWidth*2) >= targetMin
      let best = null;
      let bestChest = null;

      for (const r of table.rows) {
        const size = r[sizeHeader];
        const cw = toNumber(r[chestHeader]);
        if (!Number.isFinite(cw)) continue;
        const finishedChest = cw * 2;

        if (finishedChest >= targetMin) {
          best = size;
          bestChest = finishedChest;
          break;
        }
      }

      if (!best) {
        // fallback: largest
        const last = table.rows[table.rows.length - 1];
        best = last?.[sizeHeader] ?? "—";
        bestChest = null;
      }

      $("resultValue").textContent = best;
      const meta = (state.lang === "JP")
        ? `目標：${targetMin.toFixed(1)}〜${targetMax.toFixed(1)}${state.unit}（仕上がり胸囲） / 判定列：${chestHeader}`
        : `Target: ${targetMin.toFixed(1)}–${targetMax.toFixed(1)} ${state.unit} (finished chest) / Using: ${chestHeader}`;
      $("resultMeta").textContent = meta;
    });
    area.appendChild(btn);

    const meta = document.createElement("div");
    meta.className = "miniNote";
    meta.textContent = t.metaTop;
    area.appendChild(meta);

  } else if (product.category === "shoes") {
    const t = TEXT[state.lang];

    const sizeHeader =
      findHeader(table.headers, ["サイズ", "size", "us"]) ||
      table.headers[0] || null;

    const footHeader =
      findHeader(table.headers, ["足の長さ", "foot"]) ||
      null;

    const outHeader =
      findHeader(table.headers, ["アウトソール", "outsole"]) ||
      null;

    const row1 = document.createElement("div");
    row1.className = "calc__row";
    row1.innerHTML = `
      <div class="field">
        <label class="label">${t.foot} (${state.unit})</label>
        <input id="inpFoot" class="input" inputmode="decimal" type="number" min="0" step="0.1" placeholder="${state.unit === "cm" ? "例: 24.3" : "e.g. 9.6"}">
      </div>

      <div class="field">
        <label class="label">${t.allowance} (${state.unit})</label>
        <input id="inpAllow" class="input" inputmode="decimal" type="number" min="0" step="0.1" value="${state.unit === "cm" ? "1.0" : "0.4"}">
        <div class="miniNote">${state.lang === "JP" ? "目安：0.7〜1.2cm（7〜12mm）" : "Typical: ~0.25–0.5 in"}</div>
      </div>
    `;
    area.appendChild(row1);

    const btn = document.createElement("button");
    btn.className = "btn";
    btn.type = "button";
    btn.textContent = t.calcBtn;
    btn.addEventListener("click", () => {
      const foot = parseFloat($("inpFoot").value);
      const allow = parseFloat($("inpAllow").value);
      if (!foot || foot <= 0 || !Number.isFinite(allow)) {
        $("resultValue").textContent = state.lang === "JP" ? "足長と捨て寸を入力してください" : "Enter foot length and allowance";
        $("resultMeta").textContent = "";
        return;
      }

      const target = foot + allow;

      // choose smallest row where Foot length >= target
      let bestRow = null;

      // If we have a Foot length column, use it; otherwise, do nothing
      if (!footHeader) {
        $("resultValue").textContent = state.lang === "JP" ? "Foot length 列が見つかりません" : "Foot length column not found";
        $("resultMeta").textContent = "";
        return;
      }

      for (const r of table.rows) {
        const fl = toNumber(r[footHeader]);
        if (!Number.isFinite(fl)) continue;
        if (fl >= target) { bestRow = r; break; }
      }
      if (!bestRow) bestRow = table.rows[table.rows.length - 1];

      const size = bestRow?.[sizeHeader] ?? "—";
      $("resultValue").textContent = size;

      const metaParts = [];
      metaParts.push((state.lang === "JP")
        ? `目標足長：${target.toFixed(1)}${state.unit}（足長＋捨て寸）`
        : `Target: ${target.toFixed(1)} ${state.unit} (foot + allowance)`
      );

      if (outHeader) {
        metaParts.push((state.lang === "JP")
          ? `参考：アウトソール=${bestRow[outHeader]}`
          : `Ref: outsole=${bestRow[outHeader]}`
        );
      }
      $("resultMeta").textContent = metaParts.join(" / ");
    });
    area.appendChild(btn);

    const meta = document.createElement("div");
    meta.className = "miniNote";
    meta.textContent = t.metaShoe;
    area.appendChild(meta);
  }
}

async function loadCSV(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`CSV load failed: ${res.status}`);
  const text = await res.text();
  return parseCSV(text);
}

async function loadProduct(key) {
  state.productKey = key;
  const product = getProduct(key);

  // Guide image + tips
  setGuideImage(product);
  setTips(product);

  // Load CSV
  const url = csvPathFor(product);

  try {
    const table = await loadCSV(url);
    state.table = table;
    renderTable(table);
    renderCalculator(product, table);
  } catch (e) {
    state.table = null;
    $("tableArea").innerHTML = `<div class="error">
      ${state.lang === "JP" ? "CSVの読み込みに失敗しました：" : "Failed to load CSV: "}
      <code>${escapeHtml(String(e.message || e))}</code>
      <div class="miniNote">${state.lang === "JP"
        ? `パス確認：${url}`
        : `Check path: ${url}`
      }</div>
    </div>`;
    $("calcArea").innerHTML = "";
    $("resultValue").textContent = TEXT[state.lang].resultNone;
    $("resultMeta").textContent = "";
  }
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

/* -------- init -------- */
document.addEventListener("DOMContentLoaded", () => {
  $("year").textContent = String(new Date().getFullYear());

  // default
  applyText();

  $("langJP").addEventListener("click", () => setLang("JP"));
  $("langEN").addEventListener("click", () => setLang("EN"));

  $("productSelect").addEventListener("change", (e) => {
    loadProduct(e.target.value);
  });

  // initial load
  loadProduct(state.productKey);
});
