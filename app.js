(() => {
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => [...document.querySelectorAll(sel)];

  const state = {
    lang: "jp",   // "jp" | "en"
    unit: "cm",   // "cm" | "inch"
    productKey: "aop_mens_crew",
    csvRows: [],
    csvHeaders: [],
    headerMap: {}, // normalized column ids -> index
    lastRecommendedSize: null,
  };

  // ===== Products (filenames are based on your repo screenshot) =====
  const PRODUCTS = [
    {
      key: "aop_mens_crew",
      type: "top",
      jp: ["メンズ", "クルーネックT"],
      en: ["Men’s Crew Neck", "T-Shirt"],
      guide: "./assets/guide_tshirt.jpg",
      csv: { cm: "./data/aop_mens_crew_cm.csv", inch: "./data/aop_mens_crew_inch.csv" },
      notesJP: [
        "Men’sはゆったりめ。Women'sはフィット寄りになりやすい。",
        "最短で失敗を減らす：手持ちの“いちばん好きなTシャツ”の平置き寸法で照合。",
        "優先順位：身幅 → 着丈 → 袖丈（袖は肩線位置で体感が変わる）。",
      ],
      notesEN: [
        "Men’s tends to be roomier; Women’s is more fitted.",
        "Fastest way: compare with your favorite T-shirt (flat measurements).",
        "Priority: chest width → length → sleeve (sleeve feel depends on shoulder seam).",
      ],
    },
    {
      key: "aop_womens_crew",
      type: "top",
      jp: ["ウィメンズ", "クルーネックT"],
      en: ["Women’s Crew Neck", "T-Shirt"],
      guide: "./assets/guide_tshirt.jpg",
      csv: { cm: "./data/aop_womens_crew_cm.csv", inch: "./data/aop_womens_crew_inch.csv" },
      notesJP: [
        "ウィメンズは“ややフィット感”が出やすい。",
        "迷ったら：身幅（仕上がり胸囲）がヌード胸囲＋8〜12cmになるサイズ。",
      ],
      notesEN: [
        "Women’s is designed to be slightly fitted.",
        "If unsure: choose a size where finished chest ≈ your body chest + 3–5 in.",
      ],
    },
    {
      key: "aop_recycled_hoodie",
      type: "hoodie",
      jp: ["ユニセックス", "パーカー"],
      en: ["Unisex Recycled", "Hoodie"],
      guide: "./assets/guide_hoodie.jpg",
      csv: { cm: "./data/aop_recycled_hoodie_cm.csv", inch: "./data/aop_recycled_hoodie_inch.csv" },
      notesJP: [
        "基本はTシャツと同じ（胸囲→身幅→着丈→袖）。",
        "フーディは生地厚で体感が変わる。迷ったら少しゆとり。",
      ],
      notesEN: [
        "Same logic as tees (chest → width → length → sleeve).",
        "Hoodies feel tighter due to thickness—go slightly roomier if unsure.",
      ],
    },
    {
      key: "aop_recycled_zip_hoodie",
      type: "hoodie",
      jp: ["ユニセックス", "ジップフーディ"],
      en: ["Unisex Recycled", "Zip Hoodie"],
      guide: "./assets/guide_zip_hoodie.jpg",
      csv: { cm: "./data/aop_recycled_zip_hoodie_cm.csv", inch: "./data/aop_recycled_zip_hoodie_inch.csv" },
      notesJP: [
        "ジップは前開きなので“胸まわりの窮屈さ”は出にくい。",
        "でも肩・腕はサイズの影響が大きい。肩が広いなら+1が無難。",
      ],
      notesEN: [
        "Zip hoodies feel less restrictive in the chest.",
        "Shoulder/arms matter—broad shoulders often benefit from +1 size.",
      ],
    },
    {
      key: "womens_slipon",
      type: "shoes",
      jp: ["ウィメンズ", "スリッポン"],
      en: ["Women’s", "Slip-On"],
      guide: "./assets/guide_slipon.jpg",
      csv: { cm: "./data/womens_slipon_cm.csv", inch: "./data/womens_slipon_inch.csv" },
      notesJP: [
        "主役は足長（左右を測り、長い方を採用）。",
        "足長＋捨て寸（目安 7〜12mm）で選ぶ。",
        "アウトソール長は外寸なので、足長と同一視しない。",
      ],
      notesEN: [
        "Use foot length (measure both feet; use the longer one).",
        "Foot length + toe allowance (about 0.3–0.5 in) is the guideline.",
        "Outsole length is outer measurement—don’t treat it as foot length.",
      ],
    },
    {
      key: "mens_slipon",
      type: "shoes",
      jp: ["メンズ", "スリッポン"],
      en: ["Men’s", "Slip-On"],
      guide: "./assets/guide_slipon.jpg",
      csv: { cm: "./data/mens_slipon_cm.csv", inch: "./data/mens_slipon_inch.csv" },
      notesJP: [
        "主役は足長（左右を測り、長い方を採用）。",
        "足長＋捨て寸（目安 7〜12mm）で選ぶ。",
        "アウトソール長は外寸なので、足長と同一視しない。",
      ],
      notesEN: [
        "Use foot length (measure both feet; use the longer one).",
        "Foot length + toe allowance (about 0.3–0.5 in) is the guideline.",
        "Outsole length is outer measurement—don’t treat it as foot length.",
      ],
    },
  ];

  // ===== i18n =====
  const I18N = {
    jp: {
      back: "ショップに戻る",
      guideTitle: "採寸ガイド",
      guideDesc: "※画像は商品に応じて切り替わります",
      calcTitle: "サイズ算出（任意入力）",
      calcDesc: "入力しなくてもサイズ表だけ見て選べます",
      product: "商品",
      calcBtn: "おすすめサイズを計算",
      notesTitle: "選ぶときの注意事項",
      recommended: "おすすめ",
      reset: "入力を見直す",
      pickFromTable: "サイズ表で選ぶ",
      tableTitle: "サイズ表",
      tableHint: "数値は平置き採寸です（誤差 ±1〜2）。",

      bodyChest: "ヌード胸囲（cm）",
      bodyChestIn: "Body chest (in)",
      ease: "ゆとり（目安）",
      footLen: "足長（かかと〜一番長い指）(cm)",
      footLenIn: "Foot length (in)",
      toe: "捨て寸（目安）",
      errNoProduct: "商品を選択してください。",
      errNoInput: "入力がありません。サイズ表で選ぶか、数値を入力してください。",
    },
    en: {
      back: "Back to Shop",
      guideTitle: "Measuring Guide",
      guideDesc: "Image changes by product.",
      calcTitle: "Size recommendation (optional input)",
      calcDesc: "You can also choose from the size table without input.",
      product: "Product",
      calcBtn: "Calculate recommended size",
      notesTitle: "Notes when choosing",
      recommended: "Recommended",
      reset: "Review input",
      pickFromTable: "Pick from table",
      tableTitle: "Size Table",
      tableHint: "Values are flat measurements (±1–2).",

      bodyChest: "Your body chest (cm)",
      bodyChestIn: "Your body chest (in)",
      ease: "Ease (guide)",
      footLen: "Foot length (cm)",
      footLenIn: "Foot length (in)",
      toe: "Toe allowance (guide)",
      errNoProduct: "Please select a product.",
      errNoInput: "No input found. Choose from the table or enter a value.",
    },
  };

  // ===== CSV parsing (supports quoted commas) =====
  function parseCSV(text) {
    const rows = [];
    let row = [];
    let cur = "";
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      const next = text[i + 1];

      if (ch === '"' && inQuotes && next === '"') { cur += '"'; i++; continue; }
      if (ch === '"') { inQuotes = !inQuotes; continue; }

      if (!inQuotes && (ch === ",")) {
        row.push(cur.trim());
        cur = "";
        continue;
      }
      if (!inQuotes && (ch === "\n")) {
        row.push(cur.trim());
        rows.push(row);
        row = [];
        cur = "";
        continue;
      }
      if (ch === "\r") continue;

      cur += ch;
    }
    if (cur.length || row.length) {
      row.push(cur.trim());
      rows.push(row);
    }

    // remove empty last rows
    return rows.filter(r => r.some(c => String(c).trim() !== ""));
  }

  function normalizeHeader(h) {
    return String(h || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ")
      .replace(/[（）()]/g, "")
      .replace(/（.*?）/g, "");
  }

  // map various headers to ids we need
  function buildHeaderMap(headers) {
    const map = {};
    headers.forEach((h, idx) => {
      const nh = normalizeHeader(h);

      // size
      if (nh === "size" || nh.includes("サイズ") || nh.includes("size")) map.size = idx;

      // tops: chest flat width
      if (nh.includes("身幅") || (nh.includes("chest") && (nh.includes("flat") || nh.includes("width")))) map.chestFlat = idx;

      // length
      if (nh.includes("着丈") || nh.includes("丈") || nh.includes("body length") || (nh.includes("length") && !nh.includes("outsole") && !nh.includes("foot"))) map.length = idx;

      // sleeve
      if (nh.includes("袖丈") || nh.includes("sleeve")) map.sleeve = idx;

      // shoes: foot length
      if (nh.includes("足の長さ") || nh.includes("足長") || (nh.includes("foot") && nh.includes("length"))) map.foot = idx;

      // shoes: outsole length
      if (nh.includes("アウトソール") || (nh.includes("outsole") && nh.includes("length"))) map.outsole = idx;
    });

    return map;
  }

  function num(v) {
    const n = Number(String(v).replace(/[^\d.\-]/g, ""));
    return Number.isFinite(n) ? n : null;
  }

  // ===== UI: Dropdown =====
  const productNative = $("#productNative");
  const productBtn = $("#productBtn");
  const productBtnText = $("#productBtnText");
  const productMenu = $("#productMenu");
  const overlay = $("#dropdownOverlay");

  function openMenu() {
    productMenu.hidden = false;
    overlay.hidden = false;
    productBtn.setAttribute("aria-expanded", "true");
  }
  function closeMenu() {
    productMenu.hidden = true;
    overlay.hidden = true;
    productBtn.setAttribute("aria-expanded", "false");
  }

  function renderDropdown() {
    // native options
    productNative.innerHTML = "";
    PRODUCTS.forEach(p => {
      const opt = document.createElement("option");
      opt.value = p.key;
      opt.textContent = state.lang === "jp" ? p.jp.join(" ") : p.en.join(" ");
      productNative.appendChild(opt);
    });

    // custom options (2 lines)
    productMenu.innerHTML = "";
    PRODUCTS.forEach(p => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "dropdown__item";
      btn.dataset.key = p.key;

      const title = document.createElement("span");
      title.className = "dd__title";
      title.textContent = (state.lang === "jp" ? p.jp[0] : p.en[0]);

      const sub = document.createElement("span");
      sub.className = "dd__sub";
      sub.textContent = (state.lang === "jp" ? p.jp[1] : p.en[1]); // ← 2行表示（意図通り）

      btn.appendChild(title);
      btn.appendChild(sub);

      btn.addEventListener("click", () => {
        setProduct(p.key);
        closeMenu();
      });

      productMenu.appendChild(btn);
    });

    // reflect current selection
    productNative.value = state.productKey;
    updateDropdownButtonLabel();
  }

  function updateDropdownButtonLabel() {
    const p = PRODUCTS.find(x => x.key === state.productKey);
    if (!p) { productBtnText.textContent = "—"; return; }

    productBtnText.innerHTML = "";
    const l1 = document.createElement("span");
    l1.textContent = state.lang === "jp" ? p.jp[0] : p.en[0];
    const l2 = document.createElement("span");
    l2.textContent = state.lang === "jp" ? p.jp[1] : p.en[1];
    l1.style.fontWeight = "800";
    l2.style.fontSize = "12px";
    l2.style.color = "rgba(255,255,255,.65)";
    productBtnText.appendChild(l1);
    productBtnText.appendChild(l2);
  }

  // ===== Inputs =====
  const inputArea = $("#inputArea");

  function buildInputs() {
    inputArea.innerHTML = "";
    const p = PRODUCTS.find(x => x.key === state.productKey);
    if (!p) return;

    // Notes
    const notes = $("#notesList");
    notes.innerHTML = "";
    const list = state.lang === "jp" ? p.notesJP : p.notesEN;
    list.forEach(t => {
      const li = document.createElement("li");
      li.textContent = t;
      notes.appendChild(li);
    });

    if (p.type === "top" || p.type === "hoodie") {
      // Body chest + ease
      const row = document.createElement("div");
      row.className = "row";

      const chestWrap = document.createElement("div");
      const chestLabel = document.createElement("label");
      chestLabel.className = "label";
      chestLabel.textContent = state.lang === "jp"
        ? I18N.jp.bodyChest.replace("(cm)", `(${state.unit})`).replace("cm", state.unit)
        : (state.unit === "cm" ? I18N.en.bodyChest : I18N.en.bodyChestIn);

      const chest = document.createElement("input");
      chest.className = "input";
      chest.id = "inpChest";
      chest.inputMode = "decimal";
      chest.placeholder = state.unit === "cm" ? (state.lang === "jp" ? "例：88" : "e.g. 35") : (state.lang === "jp" ? "例：35" : "e.g. 35");
      chestWrap.appendChild(chestLabel);
      chestWrap.appendChild(chest);

      const easeWrap = document.createElement("div");
      const easeLabel = document.createElement("label");
      easeLabel.className = "label";
      easeLabel.textContent = (state.lang === "jp") ? I18N.jp.ease : I18N.en.ease;

      const easeSel = document.createElement("select");
      easeSel.className = "select";
      easeSel.id = "selEase";

      const easeOptionsCm = [
        { v: 8, jp: "標準（+8cm 目安）", en: "Standard (+3.1 in)" },
        { v: 12, jp: "ゆったり（+12cm 目安）", en: "Relaxed (+4.7 in)" },
        { v: 16, jp: "オーバー（+16cm 目安）", en: "Oversized (+6.3 in)" },
      ];

      const easeOptions = easeOptionsCm.map(o => {
        if (state.unit === "cm") return o;
        return {
          v: +(o.v / 2.54).toFixed(2),
          jp: `${o.jp.replace("cm", "inch").replace(/\+(\d+)cm/, `+${(o.v/2.54).toFixed(2)}inch`)}`,
          en: o.en,
        };
      });

      easeOptions.forEach(o => {
        const opt = document.createElement("option");
        opt.value = String(o.v);
        opt.textContent = state.lang === "jp" ? o.jp : o.en;
        easeSel.appendChild(opt);
      });

      easeWrap.appendChild(easeLabel);
      easeWrap.appendChild(easeSel);

      row.appendChild(chestWrap);
      row.appendChild(easeWrap);

      inputArea.appendChild(row);
    }

    if (p.type === "shoes") {
      const row = document.createElement("div");
      row.className = "row";

      const footWrap = document.createElement("div");
      const footLabel = document.createElement("label");
      footLabel.className = "label";
      footLabel.textContent = state.lang === "jp"
        ? (state.unit === "cm" ? I18N.jp.footLen : I18N.jp.footLenIn)
        : (state.unit === "cm" ? I18N.en.footLen : I18N.en.footLenIn);

      const foot = document.createElement("input");
      foot.className = "input";
      foot.id = "inpFoot";
      foot.inputMode = "decimal";
      foot.placeholder = state.unit === "cm" ? (state.lang === "jp" ? "例：23.5" : "e.g. 23.5") : (state.lang === "jp" ? "例：9.25" : "e.g. 9.25");
      footWrap.appendChild(footLabel);
      footWrap.appendChild(foot);

      const toeWrap = document.createElement("div");
      const toeLabel = document.createElement("label");
      toeLabel.className = "label";
      toeLabel.textContent = state.lang === "jp" ? I18N.jp.toe : I18N.en.toe;

      const toeSel = document.createElement("select");
      toeSel.className = "select";
      toeSel.id = "selToe";

      const toeOptionsCm = [
        { v: 0.7, jp: "+0.7cm（標準）", en: "+0.28 in (standard)" },
        { v: 1.0, jp: "+1.0cm（ゆとり）", en: "+0.39 in (roomy)" },
        { v: 1.2, jp: "+1.2cm（厚手ソックス）", en: "+0.47 in (thick socks)" },
      ];
      const toeOptions = toeOptionsCm.map(o => {
        if (state.unit === "cm") return o;
        return { v: +(o.v/2.54).toFixed(2), jp: o.jp.replace("cm","inch"), en: o.en };
      });

      toeOptions.forEach(o => {
        const opt = document.createElement("option");
        opt.value = String(o.v);
        opt.textContent = state.lang === "jp" ? o.jp : o.en;
        toeSel.appendChild(opt);
      });

      toeWrap.appendChild(toeLabel);
      toeWrap.appendChild(toeSel);

      row.appendChild(footWrap);
      row.appendChild(toeWrap);
      inputArea.appendChild(row);
    }

    // Guide image
    $("#guideImage").src = p.guide;
    $("#guideCaption").textContent = state.lang === "jp"
      ? "A/B/Cの見方は図の通り。入力しなくてもサイズ表で選べます。"
      : "See A/B/C on the diagram. You can pick from the size table without input.";
  }

  // ===== Table render =====
  const tableThead = $("#tableThead");
  const tableTbody = $("#tableTbody");

  function clearHighlight() {
    $$("#tableTbody tr").forEach(tr => tr.classList.remove("row-highlight"));
  }

  function highlightAndScroll(sizeLabel) {
    clearHighlight();
    if (!sizeLabel) return;

    const rows = $$("#tableTbody tr");
    const target = rows.find(tr => String(tr.dataset.size).trim() === String(sizeLabel).trim());
    if (!target) return;

    target.classList.add("row-highlight");
    target.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function renderTable(headers, rows) {
    tableThead.innerHTML = "";
    tableTbody.innerHTML = "";

    const trh = document.createElement("tr");
    headers.forEach(h => {
      const th = document.createElement("th");
      th.textContent = h;
      trh.appendChild(th);
    });
    tableThead.appendChild(trh);

    rows.forEach(r => {
      const tr = document.createElement("tr");
      const sizeIdx = state.headerMap.size ?? 0;
      tr.dataset.size = r[sizeIdx] ?? "";

      r.forEach(cell => {
        const td = document.createElement("td");
        td.textContent = cell;
        tr.appendChild(td);
      });

      // click-to-pick from table
      tr.addEventListener("click", () => {
        const size = tr.dataset.size;
        setRecommended(size, { fromTable: true });
        highlightAndScroll(size);
      });

      tableTbody.appendChild(tr);
    });
  }

  async function loadCSVForCurrentProduct() {
    const p = PRODUCTS.find(x => x.key === state.productKey);
    if (!p) return;

    const path = p.csv[state.unit];
    const res = await fetch(path, { cache: "no-store" });
    if (!res.ok) throw new Error(`CSV load failed: ${path}`);

    const text = await res.text();
    const parsed = parseCSV(text);

    const headers = parsed[0] || [];
    const rows = parsed.slice(1);

    state.csvHeaders = headers;
    state.csvRows = rows;
    state.headerMap = buildHeaderMap(headers);

    renderTable(headers, rows);

    // if we already recommended something, re-highlight
    if (state.lastRecommendedSize) {
      highlightAndScroll(state.lastRecommendedSize);
    }
  }

  // ===== Recommendation logic =====
  const resultBox = $("#resultBox");
  const resultMeta = $("#resultMeta");
  const alertBox = $("#alert");

  function showAlert(msg) {
    alertBox.textContent = msg;
    alertBox.hidden = false;
  }
  function hideAlert() {
    alertBox.hidden = true;
    alertBox.textContent = "";
  }

  function setRecommended(size, meta = {}) {
    state.lastRecommendedSize = size || null;
    resultBox.textContent = size ? String(size) : "—";

    if (meta.fromTable) {
      resultMeta.textContent = state.lang === "jp"
        ? "サイズ表から選択しました（行をタップで確定できます）。"
        : "Selected from the table (tap a row to confirm).";
      return;
    }

    if (meta.text) resultMeta.textContent = meta.text;
  }

  function recommendTopOrHoodie() {
    const chestEl = $("#inpChest");
    const easeEl = $("#selEase");

    const chest = num(chestEl?.value);
    const ease = num(easeEl?.value);

    if (!chest || !ease) return { error: I18N[state.lang].errNoInput };

    const targetFinishedChest = chest + ease;

    // find chest flat column
    const idxChest = state.headerMap.chestFlat;
    const idxSize = state.headerMap.size ?? 0;

    if (idxChest == null) {
      return { error: state.lang === "jp" ? "CSVの「身幅 / Chest (flat)」列が見つかりません。" : "Cannot find chest width column in CSV." };
    }

    const candidates = state.csvRows
      .map(r => {
        const size = r[idxSize];
        const chestFlat = num(r[idxChest]);
        if (!size || chestFlat == null) return null;
        const finished = chestFlat * 2;
        return { size, chestFlat, finished };
      })
      .filter(Boolean);

    if (!candidates.length) return { error: I18N[state.lang].errNoInput };

    let pick = candidates.find(c => c.finished >= targetFinishedChest);
    if (!pick) pick = candidates[candidates.length - 1];

    const unit = state.unit;
    const meta = state.lang === "jp"
      ? `目標仕上がり胸囲：${targetFinishedChest.toFixed(1)}${unit}（ヌード ${chest}${unit} + ゆとり ${ease}${unit}）／このサイズの仕上がり胸囲：${pick.finished.toFixed(1)}${unit}`
      : `Target finished chest: ${targetFinishedChest.toFixed(1)}${unit} (body ${chest}${unit} + ease ${ease}${unit}) / this size finished chest: ${pick.finished.toFixed(1)}${unit}`;

    return { size: pick.size, meta };
  }

  function recommendShoes() {
    const footEl = $("#inpFoot");
    const toeEl = $("#selToe");
    const foot = num(footEl?.value);
    const toe = num(toeEl?.value);

    if (!foot || !toe) return { error: I18N[state.lang].errNoInput };

    const target = foot + toe;

    const idxFoot = state.headerMap.foot;
    const idxSize = state.headerMap.size ?? 0;

    if (idxFoot == null) {
      return { error: state.lang === "jp" ? "CSVの「足の長さ / Foot length」列が見つかりません。" : "Cannot find foot length column in CSV." };
    }

    const candidates = state.csvRows
      .map(r => {
        const size = r[idxSize];
        const footLen = num(r[idxFoot]);
        if (!size || footLen == null) return null;
        return { size, footLen };
      })
      .filter(Boolean);

    if (!candidates.length) return { error: I18N[state.lang].errNoInput };

    let pick = candidates.find(c => c.footLen >= target);
    if (!pick) pick = candidates[candidates.length - 1];

    const unit = state.unit;
    const meta = state.lang === "jp"
      ? `目標：${target.toFixed(2)}${unit}（足長 ${foot}${unit} + 捨て寸 ${toe}${unit}）／このサイズの足長目安：${pick.footLen.toFixed(2)}${unit}`
      : `Target: ${target.toFixed(2)}${unit} (foot ${foot}${unit} + allowance ${toe}${unit}) / size foot-length guide: ${pick.footLen.toFixed(2)}${unit}`;

    return { size: pick.size, meta };
  }

  function calculate() {
    hideAlert();

    const p = PRODUCTS.find(x => x.key === state.productKey);
    if (!p) { showAlert(I18N[state.lang].errNoProduct); return; }

    // If user didn’t input anything, force table pick flow
    const anyInput = !!($("#inpChest")?.value || $("#inpFoot")?.value);
    if (!anyInput) {
      showAlert(I18N[state.lang].errNoInput);
      $("#tableCard").scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    const result = (p.type === "shoes") ? recommendShoes() : recommendTopOrHoodie();
    if (result.error) {
      showAlert(result.error);
      return;
    }

    setRecommended(result.size, { text: result.meta });

    // ✅ ここが要件：おすすめ確定→該当行ハイライト＆自動スクロール
    highlightAndScroll(result.size);
  }

  // ===== Set product =====
  async function setProduct(key) {
    state.productKey = key;
    updateDropdownButtonLabel();
    productNative.value = key;

    // reset recommendation
    setRecommended(null, { text: "" });
    clearHighlight();
    hideAlert();

    buildInputs();
    await loadCSVForCurrentProduct();
  }

  // ===== Language / Unit toggles =====
  function applyI18n() {
    $$("[data-i18n]").forEach(el => {
      const k = el.getAttribute("data-i18n");
      el.textContent = I18N[state.lang][k] ?? el.textContent;
    });
    renderDropdown();
    buildInputs();

    // table hint already updated by data-i18n
  }

  function setLang(lang) {
    state.lang = lang;
    $("#btnLangJP").classList.toggle("is-active", lang === "jp");
    $("#btnLangEN").classList.toggle("is-active", lang === "en");
    applyI18n();
  }

  async function setUnit(unit) {
    state.unit = unit;
    $("#btnUnitCM").classList.toggle("is-active", unit === "cm");
    $("#btnUnitIN").classList.toggle("is-active", unit === "inch");

    // reset recommendation & highlight (units changed)
    setRecommended(null, { text: "" });
    clearHighlight();
    hideAlert();

    buildInputs();
    await loadCSVForCurrentProduct();
  }

  // ===== Events =====
  function bindEvents() {
    // dropdown open/close
    productBtn.addEventListener("click", () => {
      const expanded = productBtn.getAttribute("aria-expanded") === "true";
      expanded ? closeMenu() : openMenu();
    });
    overlay.addEventListener("click", closeMenu);
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });

    // native select fallback
    productNative.addEventListener("change", async (e) => {
      await setProduct(e.target.value);
    });

    // toggles
    $("#btnLangJP").addEventListener("click", () => setLang("jp"));
    $("#btnLangEN").addEventListener("click", () => setLang("en"));
    $("#btnUnitCM").addEventListener("click", () => setUnit("cm"));
    $("#btnUnitIN").addEventListener("click", () => setUnit("inch"));

    // calc
    $("#btnCalc").addEventListener("click", calculate);

    // reset
    $("#btnReset").addEventListener("click", () => {
      hideAlert();
      setRecommended(null, { text: "" });
      clearHighlight();
      // clear inputs
      $("#inpChest") && ($("#inpChest").value = "");
      $("#inpFoot") && ($("#inpFoot").value = "");
      inputArea.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    // pick from table
    $("#btnPickFromTable").addEventListener("click", () => {
      hideAlert();
      $("#tableCard").scrollIntoView({ behavior: "smooth", block: "start" });
      $("#tableWrap").focus();
    });
  }

  // ===== Init =====
  async function init() {
    bindEvents();
    applyI18n();
    buildInputs();
    renderDropdown();

    // initial load
    await loadCSVForCurrentProduct();
    updateDropdownButtonLabel();

    // default product selection UI label
    setRecommended(null, { text: "" });
  }

  init().catch(err => {
    console.error(err);
    showAlert(state.lang === "jp"
      ? "読み込みに失敗しました。CSVパス（/data）とファイル名を確認してください。"
      : "Failed to load. Please check CSV paths (/data) and filenames.");
  });
})();
