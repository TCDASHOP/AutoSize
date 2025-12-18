(() => {
  "use strict";

  const $ = (sel) => document.querySelector(sel);

  // ---- Locale / unit ---------------------------------------------------------
  const detectLocale = () => {
    const lang = (navigator.language || "ja").toLowerCase();
    return lang.startsWith("ja") ? "JP" : "EN";
  };

  const state = {
    locale: detectLocale(), // "JP" | "EN"
    unit: null,             // "cm" | "inch" (auto from locale)
    productId: null,
    csvRows: [],
    csvHeaders: [],
  };

  const setUnitFromLocale = () => {
    state.unit = (state.locale === "JP") ? "cm" : "inch";
  };

  // ---- Products --------------------------------------------------------------
  // CSV filenames must match your repo: /data/*.csv
  // Images must match your repo: /assets/guide_*.jpg
  const PRODUCTS = [
    {
      id: "slipon_w",
      category: "shoes",
      nameJP: "ウィメンズ スリッポン",
      nameEN: "Women's slip-on canvas shoes",
      guideImage: "./assets/guide_slipon.jpg",
      csv: { cm: "./data/womens_slipon_cm.csv", inch: "./data/womens_slipon_inch.csv" },
    },
    {
      id: "slipon_m",
      category: "shoes",
      nameJP: "メンズ スリッポン",
      nameEN: "Men's slip-on canvas shoes",
      guideImage: "./assets/guide_slipon.jpg",
      csv: { cm: "./data/mens_slipon_cm.csv", inch: "./data/mens_slipon_inch.csv" },
    },
    {
      id: "tee_w",
      category: "tshirt",
      nameJP: "ウィメンズ クルーネックT",
      nameEN: "Women's Crew Neck T-Shirt",
      guideImage: "./assets/guide_tshirt.jpg",
      csv: { cm: "./data/aop_womens_crew_cm.csv", inch: "./data/aop_womens_crew_inch.csv" },
    },
    {
      id: "tee_m",
      category: "tshirt",
      nameJP: "メンズ クルーネックT",
      nameEN: "Men's Crew Neck T-Shirt",
      guideImage: "./assets/guide_tshirt.jpg",
      csv: { cm: "./data/aop_mens_crew_cm.csv", inch: "./data/aop_mens_crew_inch.csv" },
    },
    {
      id: "hoodie",
      category: "hoodie",
      nameJP: "ユニセックス パーカー",
      nameEN: "Unisex Hoodie",
      guideImage: "./assets/guide_hoodie.jpg",
      csv: { cm: "./data/aop_recycled_hoodie_cm.csv", inch: "./data/aop_recycled_hoodie_inch.csv" },
    },
    {
      id: "ziphoodie",
      category: "hoodie",
      nameJP: "ユニセックス ジップパーカー",
      nameEN: "Unisex ZIP Hoodie",
      guideImage: "./assets/guide_zip_hoodie.jpg",
      csv: { cm: "./data/aop_recycled_zip_hoodie_cm.csv", inch: "./data/aop_recycled_zip_hoodie_inch.csv" },
    },
  ];

  // ---- Copy ------------------------------------------------------------------
  const COPY = {
    JP: {
      panelTitle: "サイズガイド",
      productLabel: "商品",
      guideTitle: "採寸ガイド",
      guideCap: "※ 画像は商品に応じて切り替わります",
      inputTitle: "入力（任意）",
      notesTitle: "選ぶときの注意事項",
      resultTitle: "おすすめ",
      tableTitle: "サイズ表",
      tableHint: "※ 採寸方法により ±1–2 の誤差が出る場合があります",
      resultHint: "入力しなくてもサイズ表は見られます。迷う場合は「手持ちの好きな服（靴）」の実寸と照合してください。",
      // Form labels
      chestLabel: "ヌード胸囲（cm）",
      footLabel: "足長（cm）",
      easeLabel: "ゆとり（目安）",
      allowLabel: "捨て寸（目安）",
      calcBtn: "おすすめサイズを計算",
      // Result text
      recTitle: "おすすめサイズ",
      recNone: "おすすめ算出に必要な列がCSVに見つかりませんでした。サイズ表で確認してください。",
      // Notes per category
      notes: {
        tshirt: [
          "Men’sはゆったり・直線的、Women’sはフィット寄りになりやすい。",
          "最短で失敗を減らす：手持ちの「いちばん好きな服」を平置きで測り、近い数値を選ぶ。",
          "優先順位：身幅 → 着丈 → 袖丈（袖は肩線位置で体感が変わります）。",
        ],
        hoodie: [
          "基本はTシャツと同じ（胸囲→身幅→着丈→袖）。",
          "フーディは裾リブ等で体感が変わるため、同じ数値でも印象が少し変わります。",
          "迷ったら「標準」→動きやすさ重視は「ゆったり」。",
        ],
        shoes: [
          "主役は足長（かかと〜一番長い指）。左右を測って長い方を採用。",
          "捨て寸：足長＋0.7〜1.2cm（目安）。アウトソール長は外寸なので足長と同一視しない。",
          "幅/甲：Men’sは幅広め、Women’sはタイトになりやすい。幅広/甲高は迷ったら大きめ寄り。",
        ],
      },
      // Ease options (cm)
      easeOptions: [
        { value: "8", label: "標準（+8cm 目安）" },
        { value: "10", label: "ゆったり（+10cm 目安）" },
        { value: "12", label: "かなりゆったり（+12cm 目安）" },
      ],
      // Shoe allowance options (cm)
      shoeAllow: [
        { value: "0.7", label: "+0.7cm（ぴったり寄り）" },
        { value: "0.9", label: "+0.9cm（標準）" },
        { value: "1.2", label: "+1.2cm（ゆったり寄り）" },
      ],
    },

    EN: {
      panelTitle: "Size Guide",
      productLabel: "Product",
      guideTitle: "Measuring Guide",
      guideCap: "Image changes by product.",
      inputTitle: "Input (optional)",
      notesTitle: "Notes when choosing",
      resultTitle: "Recommended",
      tableTitle: "Size Table",
      tableHint: "Measurements may vary by about ±1–2 depending on how they are measured.",
      resultHint: "You can view the size table without input. To avoid mistakes, compare with your favorite item’s flat measurements.",
      // Form labels
      chestLabel: "Nude chest (in)",
      footLabel: "Foot length (in)",
      easeLabel: "Ease (guide)",
      allowLabel: "Allowance (guide)",
      calcBtn: "Calculate recommended size",
      // Result text
      recTitle: "Recommended size",
      recNone: "Required columns were not found in the CSV. Please check the size table.",
      // Notes per category
      notes: {
        tshirt: [
          "Men’s tends to be straighter/roomier; Women’s tends to fit closer.",
          "Fastest way to avoid mistakes: measure your favorite T-shirt (flat width/length/sleeve) and pick the closest numbers.",
          "Priority: chest width → length → sleeve (sleeve feel changes with shoulder seam position).",
        ],
        hoodie: [
          "Same logic as T-shirts (chest → width → length → sleeve).",
          "Hoodies can feel different even with the same numbers due to rib/hem structure.",
          "If unsure: start with “Standard”, size up for easier movement.",
        ],
        shoes: [
          "Foot length (heel to longest toe) is key. Measure both feet and use the longer one.",
          "Allowance: add ~0.3–0.5 in. Outsole length is the outer measurement—do not treat it as foot length.",
          "Men’s tends to be wider; Women’s can feel tighter. For wide/high instep, consider sizing up.",
        ],
      },
      // Ease options (inch) approx 8–12cm
      easeOptions: [
        { value: "3.0", label: "Standard (+3.0 in guide)" },
        { value: "4.0", label: "Relaxed (+4.0 in guide)" },
        { value: "5.0", label: "Very relaxed (+5.0 in guide)" },
      ],
      // Shoe allowance options (inch) approx 7–12mm
      shoeAllow: [
        { value: "0.30", label: "+0.30 in (snug)" },
        { value: "0.40", label: "+0.40 in (standard)" },
        { value: "0.50", label: "+0.50 in (roomy)" },
      ],
    },
  };

  // ---- CSV parsing -----------------------------------------------------------
  const stripBOM = (s) => s.replace(/^\uFEFF/, "");

  function parseCSV(text) {
    // small but robust CSV parser (handles quotes)
    const rows = [];
    let row = [];
    let field = "";
    let inQuotes = false;

    const pushField = () => {
      row.push(field);
      field = "";
    };
    const pushRow = () => {
      // ignore completely empty rows
      if (row.some(v => String(v).trim() !== "")) rows.push(row);
      row = [];
    };

    const src = stripBOM(text).replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    for (let i = 0; i < src.length; i++) {
      const c = src[i];

      if (inQuotes) {
        if (c === '"') {
          if (src[i + 1] === '"') { field += '"'; i++; }
          else { inQuotes = false; }
        } else {
          field += c;
        }
        continue;
      }

      if (c === '"') { inQuotes = true; continue; }
      if (c === ",") { pushField(); continue; }
      if (c === "\n") { pushField(); pushRow(); continue; }
      field += c;
    }
    pushField();
    pushRow();

    const headers = (rows[0] || []).map(h => String(h).trim());
    const data = rows.slice(1).map(r => {
      const obj = {};
      headers.forEach((h, idx) => obj[h] = (r[idx] ?? "").trim());
      return obj;
    });

    return { headers, data };
  }

  const norm = (s) => String(s || "")
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[_-]/g, "")
    .replace(/[()]/g, "");

  const findHeader = (headers, candidates) => {
    const hs = headers.map(h => ({ raw: h, n: norm(h) }));
    for (const c of candidates) {
      const cn = norm(c);
      const hit = hs.find(x => x.n === cn);
      if (hit) return hit.raw;
    }
    return null;
  };

  // ---- number parsing --------------------------------------------------------
  const FRACTIONS = new Map([
    ["¼", 0.25], ["½", 0.5], ["¾", 0.75],
    ["⅛", 0.125], ["⅜", 0.375], ["⅝", 0.625], ["⅞", 0.875],
    ["⅓", 1/3], ["⅔", 2/3],
  ]);

  const toFloat = (v) => {
    if (v == null) return NaN;
    let s = String(v).trim();
    if (!s) return NaN;

    // remove unit words
    s = s.replace(/(cm|in|inch|inches)/gi, "").trim();

    // unicode fractions like "10½"
    for (const [k, val] of FRACTIONS.entries()) {
      if (s.includes(k)) {
        s = s.replace(k, ` ${val}`);
      }
    }

    // "9 1/4" or "91/4"
    const mMixed = s.match(/^(\d+)\s+(\d+)\s*\/\s*(\d+)$/);
    if (mMixed) return Number(mMixed[1]) + Number(mMixed[2]) / Number(mMixed[3]);

    const mJoined = s.match(/^(\d+)\s*(\d+)\s*\/\s*(\d+)$/);
    if (mJoined) return Number(mJoined[1]) + Number(mJoined[2]) / Number(mJoined[3]);

    const mFrac = s.match(/^(\d+)\s*\/\s*(\d+)$/);
    if (mFrac) return Number(mFrac[1]) / Number(mFrac[2]);

    const mNum = s.match(/-?\d+(\.\d+)?/);
    return mNum ? Number(mNum[0]) : NaN;
  };

  // ---- UI rendering ----------------------------------------------------------
  function applyCopy() {
    const t = COPY[state.locale];
    $("#panelTitle").textContent = t.panelTitle;
    $("#productLabel").textContent = t.productLabel;
    $("#guideTitle").textContent = t.guideTitle;
    $("#guideCap").textContent = t.guideCap;
    $("#inputTitle").textContent = t.inputTitle;
    $("#notesTitle").textContent = t.notesTitle;
    $("#resultTitle").textContent = t.resultTitle;
    $("#tableTitle").textContent = t.tableTitle;
    $("#tableHint").textContent = t.tableHint;
    $("#resultHint").textContent = t.resultHint;
    $("#unitBadge").textContent = state.unit;

    $("#langJP").setAttribute("aria-pressed", state.locale === "JP" ? "true" : "false");
    $("#langEN").setAttribute("aria-pressed", state.locale === "EN" ? "true" : "false");
  }

  function renderProducts() {
    const sel = $("#productSelect");
    sel.innerHTML = "";
    PRODUCTS.forEach(p => {
      const opt = document.createElement("option");
      opt.value = p.id;
      opt.textContent = (state.locale === "JP") ? p.nameJP : p.nameEN;
      sel.appendChild(opt);
    });

    if (!state.productId) state.productId = PRODUCTS[0]?.id || null;
    sel.value = state.productId;
  }

  function currentProduct() {
    return PRODUCTS.find(p => p.id === state.productId) || PRODUCTS[0];
  }

  function renderGuide() {
    const p = currentProduct();
    const img = $("#guideImg");
    img.src = p.guideImage;

    if (state.locale === "JP") {
      img.alt = `採寸ガイド：${p.nameJP}`;
    } else {
      img.alt = `Measuring guide: ${p.nameEN}`;
    }
  }

  function renderNotes() {
    const p = currentProduct();
    const t = COPY[state.locale];
    const notes = t.notes[p.category] || [];
    const area = $("#notesArea");
    area.innerHTML = "";
    notes.forEach(txt => {
      const div = document.createElement("div");
      div.className = "note";
      div.textContent = txt;
      area.appendChild(div);
    });
  }

  function renderForm() {
    const p = currentProduct();
    const t = COPY[state.locale];
    const area = $("#formArea");

    const makeHelp = (text) => {
      const div = document.createElement("div");
      div.className = "help";
      div.textContent = text;
      return div;
    };

    area.innerHTML = "";

    if (p.category === "shoes") {
      const row = document.createElement("div");
      row.className = "row";

      const input = document.createElement("input");
      input.className = "input";
      input.type = "number";
      input.inputMode = "decimal";
      input.step = "0.1";
      input.min = "0";
      input.placeholder = (state.locale === "JP") ? "例: 23.5" : "e.g. 9.25";
      input.id = "footInput";

      const select = document.createElement("select");
      select.className = "selectSmall";
      select.id = "allowSelect";
      (t.shoeAllow || []).forEach(o => {
        const opt = document.createElement("option");
        opt.value = o.value;
        opt.textContent = o.label;
        select.appendChild(opt);
      });

      const field1 = document.createElement("div");
      field1.className = "field";
      const l1 = document.createElement("div");
      l1.className = "field__label";
      l1.textContent = t.footLabel;
      field1.appendChild(l1);
      field1.appendChild(input);

      const field2 = document.createElement("div");
      field2.className = "field";
      const l2 = document.createElement("div");
      l2.className = "field__label";
      l2.textContent = t.allowLabel;
      field2.appendChild(l2);
      field2.appendChild(select);

      row.appendChild(field1);
      row.appendChild(field2);

      const btn = document.createElement("button");
      btn.className = "btn";
      btn.type = "button";
      btn.textContent = t.calcBtn;
      btn.addEventListener("click", () => calculateRecommendation());

      area.appendChild(makeHelp(
        state.locale === "JP"
          ? "足長（かかと〜一番長い指）を入力 → 捨て寸を選択 → サイズ表と照合します。"
          : "Enter foot length → choose allowance → we match it against the size table."
      ));
      area.appendChild(row);
      area.appendChild(btn);
      return;
    }

    // apparel (tshirt / hoodie)
    const row = document.createElement("div");
    row.className = "row";

    const input = document.createElement("input");
    input.className = "input";
    input.type = "number";
    input.inputMode = "decimal";
    input.step = "0.5";
    input.min = "0";
    input.placeholder = (state.locale === "JP") ? "例: 88" : "e.g. 38";
    input.id = "chestInput";

    const select = document.createElement("select");
    select.className = "selectSmall";
    select.id = "easeSelect";
    (t.easeOptions || []).forEach(o => {
      const opt = document.createElement("option");
      opt.value = o.value;
      opt.textContent = o.label;
      select.appendChild(opt);
    });

    const field1 = document.createElement("div");
    field1.className = "field";
    const l1 = document.createElement("div");
    l1.className = "field__label";
    l1.textContent = t.chestLabel;
    field1.appendChild(l1);
    field1.appendChild(input);

    const field2 = document.createElement("div");
    field2.className = "field";
    const l2 = document.createElement("div");
    l2.className = "field__label";
    l2.textContent = t.easeLabel;
    field2.appendChild(l2);
    field2.appendChild(select);

    row.appendChild(field1);
    row.appendChild(field2);

    const btn = document.createElement("button");
    btn.className = "btn";
    btn.type = "button";
    btn.textContent = t.calcBtn;
    btn.addEventListener("click", () => calculateRecommendation());

    area.appendChild(makeHelp(
      state.locale === "JP"
        ? "胸囲（ヌード）＋ゆとり → 仕上がり胸囲 → 身幅（平置き）×2 と照合しておすすめを出します。"
        : "Nude chest + ease → target garment chest → we match it against (flat chest width × 2)."
    ));
    area.appendChild(row);
    area.appendChild(btn);
  }

  // ---- Table ----------------------------------------------------------------
  function renderTable(headers, rows) {
    const thead = $("#tableHead");
    const tbody = $("#tableBody");
    thead.innerHTML = "";
    tbody.innerHTML = "";

    // Header
    const trh = document.createElement("tr");
    headers.forEach(h => {
      const th = document.createElement("th");
      th.textContent = h;
      trh.appendChild(th);
    });
    thead.appendChild(trh);

    // Body
    rows.forEach(r => {
      const tr = document.createElement("tr");
      headers.forEach(h => {
        const td = document.createElement("td");
        td.textContent = r[h] ?? "";
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }

  async function loadCSVForCurrent() {
    const p = currentProduct();
    const path = p.csv[state.unit];
    $("#resultArea").innerHTML = `<div class="muted" id="resultHint">${COPY[state.locale].resultHint}</div>`;

    try {
      const res = await fetch(path, { cache: "no-store" });
      if (!res.ok) throw new Error(`Failed to fetch CSV: ${res.status}`);
      const text = await res.text();
      const { headers, data } = parseCSV(text);

      state.csvHeaders = headers;
      state.csvRows = data;

      renderTable(headers, data);
    } catch (e) {
      state.csvHeaders = [];
      state.csvRows = [];
      renderTable(["Error"], [{ "Error": String(e.message || e) }]);
    }
  }

  // ---- Recommendation --------------------------------------------------------
  function calculateRecommendation() {
    const p = currentProduct();
    const t = COPY[state.locale];

    if (!state.csvHeaders.length || !state.csvRows.length) {
      $("#resultArea").innerHTML = `<div class="muted">${t.recNone}</div>`;
      return;
    }

    if (p.category === "shoes") {
      const foot = toFloat($("#footInput")?.value);
      const allow = toFloat($("#allowSelect")?.value);

      if (!Number.isFinite(foot) || foot <= 0) {
        $("#resultArea").innerHTML = `<div class="muted">${state.locale === "JP" ? "足長を入力してください。" : "Please enter foot length."}</div>`;
        return;
      }
      const target = foot + (Number.isFinite(allow) ? allow : 0);

      // Find column keys
      const sizeKey =
        findHeader(state.csvHeaders, ["サイズ", "size", "US"]) || state.csvHeaders[0];

      const footKey =
        findHeader(state.csvHeaders, ["足の長さ", "足長", "Foot length", "foot length", "leg length"]) ||
        findHeader(state.csvHeaders, ["footlength", "leglength"]);

      if (!footKey) {
        $("#resultArea").innerHTML = `<div class="muted">${t.recNone}</div>`;
        return;
      }

      const scored = state.csvRows
        .map((r, idx) => {
          const v = toFloat(r[footKey]);
          return { idx, v, size: r[sizeKey] };
        })
        .filter(x => Number.isFinite(x.v))
        .sort((a, b) => a.v - b.v);

      let pick = scored.find(x => x.v >= target) || scored[scored.length - 1];
      const pickRow = state.csvRows[pick.idx];

      const outsoleKey = findHeader(state.csvHeaders, ["アウトソールの長さ", "Outsole length", "outsole length"]);
      const outsole = outsoleKey ? pickRow[outsoleKey] : "";

      const next = scored.find(x => x.v > pick.v);
      const nextText = next ? ` / ${state.locale === "JP" ? "迷ったら一つ上" : "If unsure, size up"}: ${next.size}` : "";

      $("#resultArea").innerHTML = `
        <div class="result__big">${t.recTitle}: ${pick.size}${nextText}</div>
        <div class="result__sub">
          ${state.locale === "JP"
            ? `入力: 足長 ${foot}${state.unit} / 目安+${allow || 0}${state.unit} → 目標 ${target.toFixed(2)}${state.unit}`
            : `Input: foot ${foot}${state.unit} / +${allow || 0}${state.unit} → target ${target.toFixed(2)}${state.unit}`
          }<br>
          ${state.locale === "JP"
            ? `サイズ表の「${footKey}」で照合しています。アウトソールは外寸（参考）${outsole ? `：${outsole}` : ""}`
            : `Matched against “${footKey}”. Outsole is outer measurement (reference)${outsole ? `: ${outsole}` : ""}`
          }
        </div>
      `;
      return;
    }

    // Apparel
    const chest = toFloat($("#chestInput")?.value);
    const ease = toFloat($("#easeSelect")?.value);

    if (!Number.isFinite(chest) || chest <= 0) {
      $("#resultArea").innerHTML = `<div class="muted">${state.locale === "JP" ? "胸囲を入力してください。" : "Please enter nude chest."}</div>`;
      return;
    }

    const targetGarmentChest = chest + (Number.isFinite(ease) ? ease : 0);

    // find keys
    const sizeKey = findHeader(state.csvHeaders, ["サイズ", "Size", "size"]) || state.csvHeaders[0];

    // chest width (flat)
    const chestFlatKey =
      findHeader(state.csvHeaders, ["身幅（平置き）", "身幅", "Chest (flat)", "Chest flat", "Chest width", "chest width", "Chest"]) ||
      findHeader(state.csvHeaders, ["halfchest", "half chest", "halfc", "1/2 chest", "half chest width", "Half Chest Width"]);

    if (!chestFlatKey) {
      $("#resultArea").innerHTML = `<div class="muted">${t.recNone}</div>`;
      return;
    }

    const scored = state.csvRows
      .map((r, idx) => {
        const flat = toFloat(r[chestFlatKey]);
        const garment = Number.isFinite(flat) ? flat * 2 : NaN;
        return { idx, flat, garment, size: r[sizeKey] };
      })
      .filter(x => Number.isFinite(x.garment))
      .sort((a, b) => a.garment - b.garment);

    let pick = scored.find(x => x.garment >= targetGarmentChest) || scored[scored.length - 1];
    const pickIdxInSorted = scored.findIndex(x => x.idx === pick.idx);
    const next = scored[pickIdxInSorted + 1];

    const nextText = next
      ? ` / ${state.locale === "JP" ? "ゆったりなら" : "Size up (roomier)"}: ${next.size}`
      : "";

    $("#resultArea").innerHTML = `
      <div class="result__big">${t.recTitle}: ${pick.size}${nextText}</div>
      <div class="result__sub">
        ${state.locale === "JP"
          ? `入力: 胸囲 ${chest}${state.unit} / ゆとり +${ease || 0}${state.unit} → 目標仕上がり胸囲 ${targetGarmentChest.toFixed(1)}${state.unit}`
          : `Input: chest ${chest}${state.unit} / +${ease || 0}${state.unit} → target garment chest ${targetGarmentChest.toFixed(1)}${state.unit}`
        }<br>
        ${state.locale === "JP"
          ? `サイズ表の「${chestFlatKey}」×2（仕上がり胸囲）で照合しています。`
          : `Matched using “${chestFlatKey} × 2” as garment chest.`
        }
      </div>
    `;
  }

  // ---- Language toggle -------------------------------------------------------
  function setLocale(locale) {
    state.locale = locale;
    setUnitFromLocale();
    applyCopy();
    renderProducts();
    renderGuide();
    renderNotes();
    renderForm();
    loadCSVForCurrent();
  }

  function setProduct(id) {
    state.productId = id;
    renderGuide();
    renderNotes();
    renderForm();
    loadCSVForCurrent();
  }

  // ---- Init -----------------------------------------------------------------
  function init() {
    setUnitFromLocale();
    applyCopy();
    renderProducts();
    renderGuide();
    renderNotes();
    renderForm();

    // events
    $("#langJP").addEventListener("click", () => setLocale("JP"));
    $("#langEN").addEventListener("click", () => setLocale("EN"));
    $("#productSelect").addEventListener("change", (e) => setProduct(e.target.value));

    // footer year
    $("#year").textContent = String(new Date().getFullYear());

    // default product
    state.productId = $("#productSelect").value;
    loadCSVForCurrent();
  }

  init();
})();
