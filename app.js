/**
 * TCDA Auto Size Guide (single-file JS)
 * - Two recommendations: Primary + Runner-up
 * - Priority toggle for tops: chest first / length first
 * - Shoes: foot width (3 choices) + allowance selector (i18n)
 * - Estimator: height/weight/sex (+ BMI optional) -> estimated chest (support)
 * - Local log: product type, input method, inputs, fit, recommendations (auto-record)
 *
 * Notes:
 * - This is a client-side helper. It does not send any data to a server.
 * - For best accuracy, encourage users to measure their body and compare with the chart.
 */

(() => {
  "use strict";

  const $ = (sel) => document.querySelector(sel);

  // ---------- State ----------
  const state = {
    lang: "ja",      // "ja" | "en"
    unit: "cm",      // "cm" | "inch" (affects inputs + which CSV is loaded)
    product: "mens_crew",
    fit: "standard", // "snug" | "standard" | "loose"
    pri: "chest",    // "chest" | "length"
    lastEstimate: null,
    usedEstimator: false,
    dataCache: new Map(), // key: `${product}_${unit}` -> {headers, rowsNorm, rawRows}
  };

  // ---------- Product config ----------
  const PRODUCTS = {
    mens_crew: {
      type: "tops",
      label: { ja: "Men's Crew Neck T-Shirt", en: "Men's Crew Neck T-Shirt" },
      csv: { cm: "./data/mens_crew_cm.csv", inch: "./data/mens_crew_inch.csv" },
      guideImg: "./assets/guide_tshirt.jpg",
      notes: {
        ja: [
          "最短でミスを減らす方法：普段よく着るTシャツを平置きで測り、サイズ表の数値と近いものを選ぶ。",
          "身体から選ぶ場合：ヌード胸囲＋ゆとり → 仕上がり胸囲。仕上がり胸囲 ÷ 2 = 身幅（平置き）。",
          "優先の目安：胸囲（身幅）→ 着丈 → 袖丈（袖の“感じ方”は肩位置で変わります）。",
          "傾向：メンズは直線的でゆとりが出やすく、ウィメンズはフィット感が出やすい。",
        ],
        en: [
          "Fastest way to reduce mistakes: measure your favorite tee (flat) and pick the closest numbers in the chart.",
          "From body: Nude chest + ease → Finished chest. Finished chest ÷ 2 = Chest (flat).",
          "Priority: Chest (flat) → Length → Sleeve (sleeve feel depends on shoulder seam).",
          "Tendency: Men's is straighter/looser; Women's is more fitted.",
        ],
      },
    },
    womens_crew: {
      type: "tops",
      label: { ja: "Women's Crew Neck T-Shirt", en: "Women's Crew Neck T-Shirt" },
      csv: { cm: "./data/womens_crew_cm.csv", inch: "./data/womens_crew_inch.csv" },
      guideImg: "./assets/guide_tshirt.jpg",
      notes: {
        ja: [
          "普段よく着るTシャツ（ウィメンズ寄りシルエット）を平置きで測るのが最短。",
          "身体から選ぶ場合：ヌード胸囲＋ゆとり → 仕上がり胸囲。仕上がり胸囲 ÷ 2 = 身幅（平置き）。",
          "優先：胸囲（身幅）→ 着丈 → 袖丈（袖は肩位置で感じ方が変わります）。",
          "迷ったら：フィットが苦手／肩が広い人は1サイズ上も検討。",
        ],
        en: [
          "Fastest: measure a similar tee you already own (flat).",
          "From body: Nude chest + ease → Finished chest. Finished chest ÷ 2 = Chest (flat).",
          "Priority: Chest (flat) → Length → Sleeve (feel depends on shoulder seam).",
          "If unsure: broad shoulders or dislike tight fit → consider sizing up.",
        ],
      },
    },
    unisex_hoodie: {
      type: "tops",
      label: { ja: "Recycled Unisex Hoodie", en: "Recycled Unisex Hoodie" },
      csv: { cm: "./data/unisex_hoodie_cm.csv", inch: "./data/unisex_hoodie_inch.csv" },
      guideImg: "./assets/guide_hoodie.jpg",
      notes: {
        ja: [
          "パーカーは中に着込む可能性があるため、迷ったら“次点（サイズ上）”が安全。",
          "ヌード胸囲＋ゆとり → 仕上がり胸囲。仕上がり胸囲 ÷ 2 = 身幅（平置き）。",
          "丈優先にすると、見た目のバランスが良くなることが多い（特にオーバーサイズ）。",
        ],
        en: [
          "Hoodies are often layered. If unsure, runner-up (size up) is usually safer.",
          "Nude chest + ease → Finished chest. Finished chest ÷ 2 = Chest (flat).",
          "Length-first can improve silhouette (especially for oversized looks).",
        ],
      },
    },
    unisex_zip_hoodie: {
      type: "tops",
      label: { ja: "Recycled Unisex Zip Hoodie", en: "Recycled Unisex Zip Hoodie" },
      csv: { cm: "./data/unisex_zip_hoodie_cm.csv", inch: "./data/unisex_zip_hoodie_inch.csv" },
      guideImg: "./assets/guide_zip_hoodie.jpg",
      notes: {
        ja: [
          "ジップフーディはレイヤリングしやすいので、迷ったら次点（サイズ上）を用意すると返品が減りやすい。",
          "ヌード胸囲＋ゆとり → 仕上がり胸囲。仕上がり胸囲 ÷ 2 = 身幅（平置き）。",
          "丈の好みが分かれるため、胸囲が同じでも「丈優先」で満足度が上がるケースがある。",
        ],
        en: [
          "Zip hoodies layer well. Showing a runner-up (size up) tends to reduce returns.",
          "Nude chest + ease → Finished chest. Finished chest ÷ 2 = Chest (flat).",
          "Even with the same chest, satisfaction often depends on preferred length.",
        ],
      },
    },
    slipon_womens: {
      type: "shoes",
      label: { ja: "Women's Slip-On Canvas Shoes", en: "Women's Slip-On Canvas Shoes" },
      csv: { cm: "./data/slipon_womens_cm.csv", inch: "./data/slipon_womens_inch.csv" },
      guideImg: "./assets/guide_slipon.jpg",
      notes: {
        ja: [
          "キーは足長（かかと→最長指）。両足を測って長い方を使う。",
          "捨て寸の目安：足長 +7〜12mm（ガイド）。",
          "アウトソール長は外寸です（参考）。足長として扱わない。",
          "幅広／甲高は迷ったらサイズ上。メンズは幅広寄り、ウィメンズはタイトに感じやすい傾向。",
        ],
        en: [
          "Key is foot length (heel to longest toe). Measure both feet and use the longer one.",
          "Allowance guide: foot length +7–12 mm.",
          "Outsole length is outside length (reference only). Do not treat it as foot length.",
          "Wide/high instep: consider sizing up when in doubt. Men's tends to be wider; Women's can feel tighter.",
        ],
      },
    },
    slipon_mens: {
      type: "shoes",
      label: { ja: "Men's Slip-On Canvas Shoes", en: "Men's Slip-On Canvas Shoes" },
      csv: { cm: "./data/slipon_mens_cm.csv", inch: "./data/slipon_mens_inch.csv" },
      guideImg: "./assets/guide_slipon.jpg",
      notes: {
        ja: [
          "足長（かかと→最長指）を基準に選ぶ。両足を測って長い方。",
          "捨て寸：足長 +7〜12mm（目安）。",
          "アウトソール長は外寸（参考）で、足長ではない。",
          "幅広／甲高は次点（サイズ上）に寄せると失敗しにくい。",
        ],
        en: [
          "Choose based on foot length (heel to longest toe). Measure both feet and use the longer one.",
          "Allowance: foot length +7–12 mm (guide).",
          "Outsole length is outside length (reference only), not foot length.",
          "Wide/high instep: runner-up (size up) reduces risk.",
        ],
      },
    },
  };

  // ---------- i18n ----------
  const I18N = {
    ja: {
      backToShop: "ショップに戻る",
      title: "サイズを自動でおすすめ",
      subtitle: "商品を選んで、必要な数値だけ入力してください。",
      product: "商品",
      fit: "好み（フィット感）",
      fitHintCm: "標準: +10cm / ぴったり: +6cm / ゆったり: +14cm（目安）",
      fitHintIn: "Standard: +4.0 in / Snug: +2.4 in / Loose: +5.5 in (guide)",
      fitStd: "標準",
      fitSnug: "ぴったり",
      fitLoose: "ゆったり",
      nudeChestCm: "ヌード胸囲（cm）",
      nudeChestIn: "Nude chest (inch)",
      estimatorNote: "分からない場合は下の「推定入力」を使えます（自動で上書きしません）。",
      priority: "優先",
      priChest: "胸囲優先",
      priLength: "着丈優先",
      priHint: "同じ胸囲でも、丈（着丈）の好みで満足度が割れます。",
      estTitle: "ヌード寸法が分からない場合（推定入力）",
      height: "身長（cm）",
      weight: "体重（kg）",
      sex: "性別",
      female: "女性",
      male: "男性",
      bmi: "BMI（任意）",
      bmiHint: "空欄なら身長と体重から自動計算します。",
      btnEstimate: "推定胸囲を計算",
      btnSetEstimated: "推定値をセット",
      estResult: "推定結果：",
      estWarn: "推定入力は補助機能です。精度を上げるには可能な限り実測してください。",
      footLenCm: "足長（cm）",
      footLenIn: "Foot length (inch)",
      footLenHint: "両足を測って長い方を使ってください。",
      footWidth: "足幅",
      widthStd: "標準",
      widthNarrow: "細め",
      widthWide: "広め",
      footWidthHint: "幅広／厚手ソックスの人は「次点（size up）」寄りがおすすめ。",
      allowance: "捨て寸（余裕）",
      allowStd: "標準（+10mm）",
      allowSnug: "ぴったり（+7mm）",
      allowLoose: "ゆったり（+12mm）",
      allowanceHint: "アウトソール長は外寸です（参考）。足長として扱わないでください。",
      allowanceExplain: "標準: +10mm / ぴったり: +7mm / ゆったり: +12mm（目安）",
      btnCalc: "おすすめサイズを計算",
      btnReview: "入力を見直す",
      btnPickFromChart: "サイズ表で選ぶ",
      result: "結果",
      primary: "推奨",
      runnerUp: "次点",
      twoRecNote: "「次点」は、好み（丈優先／幅広など）のズレを吸収するための第2案です。",
      measure: "測り方ガイド",
      measureNote: "※画像は商品に応じて切り替わります / Image changes by product.",
      notes: "Notes when choosing",
      chart: "サイズ表",
      chartDisplay: "表示:",
      chartWarn: "※表の数値は仕上がり寸法です。測り方により±1〜2cm程度の差が出る場合があります。",
      log: "提案サイズの記録（ローカル）",
      logHint: "記録される内容：商品タイプ / 入力方式（実測・推定）/ 入力値 / フィット感 / 推奨・次点サイズ（自動記録）",
      export: "CSVで書き出し",
      clear: "履歴を消去",
      errors: {
        needNumber: "数値を入力してください。",
        needChest: "ヌード胸囲を入力してください（分からない場合は推定入力を使用）。",
        needFoot: "足長を入力してください。",
        dataLoad: "サイズ表データの読み込みに失敗しました。ファイル名とパス（/data/…）を確認してください。",
      },
    },
    en: {
      backToShop: "Back to shop",
      title: "Auto size recommendation",
      subtitle: "Choose a product, then enter only the required measurements.",
      product: "Product",
      fit: "Fit preference",
      fitHintCm: "Standard: +10cm / Snug: +6cm / Loose: +14cm (guide)",
      fitHintIn: "Standard: +4.0 in / Snug: +2.4 in / Loose: +5.5 in (guide)",
      fitStd: "Standard",
      fitSnug: "Snug",
      fitLoose: "Loose",
      nudeChestCm: "Nude chest (cm)",
      nudeChestIn: "Nude chest (inch)",
      estimatorNote: "If you don't know it, you can use the estimator below (it will NOT overwrite automatically).",
      priority: "Priority",
      priChest: "Chest first",
      priLength: "Length first",
      priHint: "Even with the same chest, satisfaction often depends on preferred length.",
      estTitle: "If you don't know your nude measurement (Estimator)",
      height: "Height (cm)",
      weight: "Weight (kg)",
      sex: "Sex",
      female: "Female",
      male: "Male",
      bmi: "BMI (optional)",
      bmiHint: "Leave blank to auto-calculate from height & weight.",
      btnEstimate: "Estimate chest",
      btnSetEstimated: "Set estimated value",
      estResult: "Estimated:",
      estWarn: "Estimator is a support feature. For best accuracy, measure and enter your actual nude measurement.",
      footLenCm: "Foot length (cm)",
      footLenIn: "Foot length (inch)",
      footLenHint: "Measure both feet and use the longer one.",
      footWidth: "Foot width",
      widthStd: "Standard",
      widthNarrow: "Narrow",
      widthWide: "Wide",
      footWidthHint: "Wide feet / thick socks → consider the runner-up (size up).",
      allowance: "Allowance",
      allowStd: "Standard (+10mm)",
      allowSnug: "Snug (+7mm)",
      allowLoose: "Loose (+12mm)",
      allowanceHint: "Outsole length is an outside measurement (reference only). Do not treat it as foot length.",
      allowanceExplain: "Standard: +10mm / Snug: +7mm / Loose: +12mm (guide)",
      btnCalc: "Calculate recommended size",
      btnReview: "Review inputs",
      btnPickFromChart: "Choose from size chart",
      result: "Result",
      primary: "Primary",
      runnerUp: "Runner-up",
      twoRecNote: "Runner-up is a second option to absorb preference differences (length / width / layering).",
      measure: "How to measure",
      measureNote: "* Image changes by product.",
      notes: "Notes when choosing",
      chart: "Size chart",
      chartDisplay: "Display:",
      chartWarn: "* Values are finished measurements. Small variations may occur depending on how measured.",
      log: "Saved recommendations (local)",
      logHint: "Saved: product type / input method (measured vs estimator) / inputs / fit / primary & runner-up (auto-recorded).",
      export: "Export CSV",
      clear: "Clear log",
      errors: {
        needNumber: "Please enter a number.",
        needChest: "Please enter your nude chest (or use the estimator).",
        needFoot: "Please enter your foot length.",
        dataLoad: "Failed to load chart data. Check filenames and paths under /data/…",
      },
    },
  };

  // ---------- Helpers ----------
  const nowISO = () => new Date().toISOString();

  function fmtNum(n, digits = 1) {
    if (n === null || n === undefined || Number.isNaN(n)) return "—";
    const d = Math.max(0, digits);
    return Number(n).toFixed(d).replace(/\.0+$/, "");
  }

  function toNumber(v) {
    if (v === null || v === undefined) return NaN;
    const s = String(v).trim().replace(",", ".");
    return s === "" ? NaN : Number(s);
  }

  function cmToIn(cm) { return cm / 2.54; }
  function mmToUnit(mm, unit) {
    if (unit === "cm") return mm / 10;
    return (mm / 10) / 2.54; // inch
  }

  // Detect and normalize headers (JP/EN CSV variations)
  function normalizeHeaders(headers) {
    const norm = headers.map(h => String(h).trim());
    const find = (preds) => {
      const idx = norm.findIndex(h => preds.some(p => p.test(h)));
      return idx >= 0 ? idx : null;
    };

    const idx = {
      size: find([/^size$/i, /サイズ/, /寸法/i]),
      chestFlat: find([/chest/i, /身幅/, /胸幅/, /bust/i]),
      length: find([/length/i, /着丈/, /body\s*length/i]),
      sleeve: find([/sleeve/i, /袖/, /袖丈/]),
      footLen: find([/foot/i, /足長/, /foot\s*length/i]),
      outsoleLen: find([/outsole/i, /アウトソール/, /sole/i]),
      us: find([/^us$/i]),
      uk: find([/^uk$/i]),
      eu: find([/^eu$/i]),
    };
    return idx;
  }

  function parseCSV(text) {
    // Simple CSV parser (supports quotes)
    const rows = [];
    let cur = "";
    let inQuotes = false;
    const out = [];
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      const n = text[i + 1];
      if (c === '"' && inQuotes && n === '"') { cur += '"'; i++; continue; }
      if (c === '"') { inQuotes = !inQuotes; continue; }
      if (c === "," && !inQuotes) { out.push(cur); cur = ""; continue; }
      if ((c === "\n" || c === "\r") && !inQuotes) {
        if (cur.length || out.length) { out.push(cur); rows.push(out.slice()); out.length = 0; cur = ""; }
        if (c === "\r" && n === "\n") i++;
        continue;
      }
      cur += c;
    }
    if (cur.length || out.length) { out.push(cur); rows.push(out.slice()); }

    if (!rows.length) return { headers: [], rows: [] };
    const headers = rows[0].map(h => String(h).trim());
    const body = rows.slice(1).filter(r => r.some(x => String(x).trim() !== ""));
    return { headers, rows: body };
  }

  async function loadData(product, unit) {
    const key = `${product}_${unit}`;
    if (state.dataCache.has(key)) return state.dataCache.get(key);

    const cfg = PRODUCTS[product];
    const url = cfg.csv[unit];

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
    const txt = await res.text();

    const { headers, rows } = parseCSV(txt);
    const idx = normalizeHeaders(headers);

    const rowsNorm = rows.map(r => {
      const get = (i) => (i === null ? "" : (r[i] ?? ""));
      const size = String(get(idx.size)).trim();
      const chestFlat = toNumber(get(idx.chestFlat));
      const length = toNumber(get(idx.length));
      const sleeve = toNumber(get(idx.sleeve));
      const footLen = toNumber(get(idx.footLen));
      const outsoleLen = toNumber(get(idx.outsoleLen));
      const us = String(get(idx.us)).trim();
      const uk = String(get(idx.uk)).trim();
      const eu = String(get(idx.eu)).trim();
      return { size, chestFlat, length, sleeve, footLen, outsoleLen, us, uk, eu, raw: r };
    }).filter(x => x.size);

    const data = { headers, rows, idx, rowsNorm };
    state.dataCache.set(key, data);
    return data;
  }

  function setActive(btnA, btnB, whichA) {
    btnA.classList.toggle("isActive", whichA);
    btnB.classList.toggle("isActive", !whichA);
  }

  function setLang(lang) {
    state.lang = lang;
    setActive($("#btnLangJa"), $("#btnLangEn"), lang === "ja");
    applyI18n();
    renderNotes();
    refreshInputsLabels();
    refreshChart();
    refreshLogList();
  }

  function setUnit(unit) {
    state.unit = unit;
    setActive($("#btnUnitCm"), $("#btnUnitIn"), unit === "cm");
    refreshInputsLabels();
    refreshFitHint();
    refreshChart();
  }

  function setProduct(product) {
    state.product = product;
    const cfg = PRODUCTS[product];

    const isShoes = cfg.type === "shoes";
    $("#blockTops").classList.toggle("hidden", isShoes);
    $("#blockShoes").classList.toggle("hidden", !isShoes);

    state.usedEstimator = false;

    $("#imgGuide").src = cfg.guideImg;
    renderNotes();
    refreshChart();

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function setFit(fit) {
    state.fit = fit;
    refreshFitHint();
  }

  function setPriority(pri) {
    state.pri = pri;
    setActive($("#btnPriChest"), $("#btnPriLength"), pri === "chest");
  }

  function refreshFitHint() {
    const t = I18N[state.lang];
    const hint = state.unit === "cm" ? t.fitHintCm : t.fitHintIn;
    $("#tFitHint").textContent = hint;
    $("#tAllowanceExplain").textContent = t.allowanceExplain;
  }

  function refreshInputsLabels() {
    const t = I18N[state.lang];
    $("#btnBackToShop").textContent = t.backToShop;

    $("#tNudeChest").textContent = (state.unit === "cm") ? t.nudeChestCm : t.nudeChestIn;
    $("#tFootLen").textContent = (state.unit === "cm") ? t.footLenCm : t.footLenIn;

    $("#inpNudeChest").placeholder = (state.unit === "cm") ? (state.lang === "ja" ? "例：99" : "e.g., 39.0") : "e.g., 39.0";
    $("#inpFootLen").placeholder = (state.unit === "cm") ? (state.lang === "ja" ? "例：24.6" : "e.g., 24.6") : "e.g., 9.5";

    $("#chartUnitLabel").textContent = state.unit;
  }

  function applyI18n() {
    const t = I18N[state.lang];

    $("#tTitle").textContent = t.title;
    $("#tSubtitle").textContent = t.subtitle;
    $("#tProduct").textContent = t.product;
    $("#tFit").textContent = t.fit;

    $("#tFitStd").textContent = t.fitStd;
    $("#tFitSnug").textContent = t.fitSnug;
    $("#tFitLoose").textContent = t.fitLoose;

    $("#tEstimatorNote").textContent = t.estimatorNote;
    $("#tPriority").textContent = t.priority;
    $("#btnPriChest").textContent = t.priChest;
    $("#btnPriLength").textContent = t.priLength;
    $("#tPriorityHint").textContent = t.priHint;

    $("#tEstimatorTitle").textContent = t.estTitle;
    $("#tHeight").textContent = t.height;
    $("#tWeight").textContent = t.weight;
    $("#tSex").textContent = t.sex;
    $("#tFemale").textContent = t.female;
    $("#tMale").textContent = t.male;
    $("#tBmi").textContent = t.bmi;
    $("#tBmiHint").textContent = t.bmiHint;
    $("#btnEstimateChest").textContent = t.btnEstimate;
    $("#btnSetEstimated").textContent = t.btnSetEstimated;
    $("#tEstimatorWarn").textContent = t.estWarn;

    $("#tFootLenHint").textContent = t.footLenHint;
    $("#tFootWidth").textContent = t.footWidth;
    $("#tWidthStd").textContent = t.widthStd;
    $("#tWidthNarrow").textContent = t.widthNarrow;
    $("#tWidthWide").textContent = t.widthWide;
    $("#tFootWidthHint").textContent = t.footWidthHint;
    $("#tAllowance").textContent = t.allowance;
    $("#tAllowStd").textContent = t.allowStd;
    $("#tAllowSnug").textContent = t.allowSnug;
    $("#tAllowLoose").textContent = t.allowLoose;
    $("#tAllowanceHint").textContent = t.allowanceHint;
    $("#tAllowanceExplain").textContent = t.allowanceExplain;

    $("#btnCalc").textContent = t.btnCalc;
    $("#btnReview").textContent = t.btnReview;
    $("#btnPickFromChart").textContent = t.btnPickFromChart;

    $("#tResult").textContent = t.result;
    $("#tPrimary").textContent = t.primary;
    $("#tRunnerUp").textContent = t.runnerUp;
    $("#tTwoRecNote").textContent = t.twoRecNote;

    $("#tMeasure").textContent = t.measure;
    $("#tMeasureNote").textContent = t.measureNote;
    $("#tNotes").textContent = t.notes;

    $("#tChart").textContent = t.chart;
    $("#tChartDisplay").textContent = t.chartDisplay;
    $("#tChartWarn").textContent = t.chartWarn;

    $("#tLog").textContent = t.log;
    $("#tLogHint").textContent = t.logHint;
    $("#btnExportLog").textContent = t.export;
    $("#btnClearLog").textContent = t.clear;

    refreshFitHint();
  }

  function renderNotes() {
    const cfg = PRODUCTS[state.product];
    const notes = cfg.notes[state.lang];
    const ul = $("#ulNotes");
    ul.innerHTML = "";
    notes.forEach(n => {
      const li = document.createElement("li");
      li.textContent = n;
      ul.appendChild(li);
    });
  }

  function computeEase(unit, fit) {
    const cm = (fit === "snug") ? 6 : (fit === "loose") ? 14 : 10;
    return unit === "cm" ? cm : cmToIn(cm);
  }

  function estimateChestFromBody(heightCm, weightKg, sex, bmiOpt) {
    const bmi = Number.isFinite(bmiOpt) ? bmiOpt : (weightKg / Math.pow(heightCm / 100, 2));
    let chest = (heightCm * 0.52) + (bmi * 1.3); // cm
    if (sex === "male") chest += 6.0; else chest += 1.5;
    chest = Math.max(70, Math.min(140, chest));
    return { chestCm: chest, bmi };
  }

  function getInputMethod() {
    return state.usedEstimator ? "estimated" : "measured";
  }

  function validateNumber(v) {
    return Number.isFinite(v) && v > 0;
  }

  function getTopsInputs() {
    const nudeChest = toNumber($("#inpNudeChest").value);
    return { nudeChest };
  }

  function getShoesInputs() {
    const footLen = toNumber($("#inpFootLen").value);
    const footWidth = $("#selFootWidth").value;
    const allowMm = Number($("#selAllowance").value);
    return { footLen, footWidth, allowMm };
  }

  function scoreTops(row, requiredFinishedChest, priMode) {
    const finishedChest = row.chestFlat * 2;
    const slack = finishedChest - requiredFinishedChest;
    const tooSmallPenalty = (slack < 0) ? (1000 + Math.abs(slack) * 20) : slack;

    const L = Number.isFinite(row.length) ? row.length : 0;
    const lengthTerm = (priMode === "length") ? (-0.18 * L) : (0.05 * L);

    const S = Number.isFinite(row.sleeve) ? row.sleeve : 0;
    const sleeveTerm = (priMode === "length") ? (-0.02 * S) : (0.01 * S);

    const score = tooSmallPenalty + lengthTerm + sleeveTerm;
    return { score, slack, finishedChest };
  }

  function pickTwoDistinct(candidates) {
    const sorted = candidates.slice().sort((a,b) => a.score - b.score);
    const primary = sorted[0] || null;
    let runner = null;
    for (let i=1;i<sorted.length;i++){
      if (sorted[i].size && primary && sorted[i].size !== primary.size) { runner = sorted[i]; break; }
    }
    return { primary, runner };
  }

  function recommendTops(rowsNorm, nudeChest, unit, fit, pri) {
    const ease = computeEase(unit, fit);
    const required = nudeChest + ease;

    const scoredA = rowsNorm.map(r => {
      const { score, slack, finishedChest } = scoreTops(r, required, pri);
      return { ...r, score, slack, finishedChest, priMode: pri };
    });

    const opposite = (pri === "chest") ? "length" : "chest";
    const scoredB = rowsNorm.map(r => {
      const { score, slack, finishedChest } = scoreTops(r, required, opposite);
      return { ...r, score, slack, finishedChest, priMode: opposite };
    });

    const pickA = pickTwoDistinct(scoredA);
    const primary = pickA.primary;

    let runner = null;
    if (primary) {
      const sortedOpp = scoredB.slice().sort((a,b)=>a.score-b.score);
      runner = sortedOpp.find(x => x.size !== primary.size) || null;
      if (!runner) runner = pickA.runner;
    } else {
      runner = pickA.runner;
    }

    return { primary, runner, requiredFinishedChest: required, ease };
  }

  function normalizeReasonTextTops(rec, required, ease) {
    if (!rec) return "—";
    const slack = rec.slack;
    const slackTxt = (slack >= 0)
      ? (state.lang === "ja" ? `胸余裕 +${fmtNum(slack,1)}${state.unit}` : `chest room +${fmtNum(slack,1)}${state.unit}`)
      : (state.lang === "ja" ? `胸不足 ${fmtNum(Math.abs(slack),1)}${state.unit}` : `too small ${fmtNum(Math.abs(slack),1)}${state.unit}`);
    const easeTxt = (state.lang === "ja")
      ? `（ゆとり ${fmtNum(ease,1)}${state.unit}）`
      : `(ease ${fmtNum(ease,1)}${state.unit})`;
    return `${slackTxt} ${easeTxt}`;
  }

  function recommendShoes(rowsNorm, footLen, unit, allowMm, footWidth) {
    const allow = mmToUnit(allowMm, unit);
    const effective = footLen + allow;

    const sorted = rowsNorm
      .filter(r => Number.isFinite(r.footLen))
      .slice()
      .sort((a,b) => a.footLen - b.footLen);

    let primary = sorted.find(r => r.footLen >= effective) || sorted[sorted.length - 1] || null;
    let runner = null;

    if (primary) {
      const idx = sorted.findIndex(r => r.size === primary.size);
      runner = (idx >= 0 && idx + 1 < sorted.length) ? sorted[idx + 1] : null;
    }

    let finalPrimary = primary;
    let finalRunner = runner;

    if (footWidth === "wide" && runner) {
      finalPrimary = runner;
      finalRunner = (sorted.findIndex(r => r.size === runner.size) + 1 < sorted.length)
        ? sorted[sorted.findIndex(r => r.size === runner.size) + 1]
        : primary;
    }

    return { primary: finalPrimary, runner: finalRunner, effectiveFoot: effective, allow };
  }

  function buildShoesReason(rec, footLen, unit, allowMm, footWidth, isPrimary) {
    if (!rec) return "—";
    const allowTxt = (state.lang === "ja")
      ? `捨て寸 +${allowMm}mm`
      : `Allowance +${allowMm}mm`;

    const widthTxt = (state.lang === "ja")
      ? `足幅：${footWidth === "wide" ? "広め" : footWidth === "narrow" ? "細め" : "標準"}`
      : `Width: ${footWidth}`;

    const footTxt = (state.lang === "ja")
      ? `入力 足長 ${fmtNum(footLen,1)}${unit}`
      : `Input foot ${fmtNum(footLen,1)}${unit}`;

    const chartFoot = Number.isFinite(rec.footLen) ? rec.footLen : NaN;
    const chartTxt = Number.isFinite(chartFoot)
      ? (state.lang === "ja" ? ` / 表の足長 ${fmtNum(chartFoot,1)}${unit}` : ` / chart foot ${fmtNum(chartFoot,1)}${unit}`)
      : "";

    const outTxt = Number.isFinite(rec.outsoleLen)
      ? (state.lang === "ja" ? ` / アウトソール ${fmtNum(rec.outsoleLen,1)}${unit}` : ` / outsole ${fmtNum(rec.outsoleLen,1)}${unit}`)
      : "";

    const tag = (state.lang === "ja") ? (isPrimary ? "推奨" : "次点") : (isPrimary ? "Primary" : "Runner-up");
    return `${tag} / ${footTxt} / ${allowTxt} / ${widthTxt}${chartTxt}${outTxt}`;
  }

  function highlightRows(primarySize, runnerSize) {
    const tbl = $("#tblChart");
    tbl.querySelectorAll("tr").forEach(tr => {
      tr.classList.remove("isHi", "isHi2");
      const s = tr.getAttribute("data-size");
      if (!s) return;
      if (primarySize && s === primarySize) tr.classList.add("isHi");
      else if (runnerSize && s === runnerSize) tr.classList.add("isHi2");
    });
  }

  // ---------- Chart rendering ----------
  function renderChartTable(data) {
    const tbl = $("#tblChart");
    tbl.innerHTML = "";

    if (!data || !data.headers.length) return;

    const thead = document.createElement("thead");
    const trh = document.createElement("tr");
    data.headers.forEach(h => {
      const th = document.createElement("th");
      th.textContent = h;
      trh.appendChild(th);
    });
    thead.appendChild(trh);
    tbl.appendChild(thead);

    const tbody = document.createElement("tbody");
    data.rows.forEach(r => {
      const tr = document.createElement("tr");
      const sizeIdx = data.idx.size ?? 0;
      const sizeVal = String(r[sizeIdx] ?? "").trim();
      if (sizeVal) tr.setAttribute("data-size", sizeVal);

      r.forEach(cell => {
        const td = document.createElement("td");
        td.textContent = String(cell ?? "").trim();
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    tbl.appendChild(tbody);
  }

  async function refreshChart() {
    try {
      const data = await loadData(state.product, state.unit);
      renderChartTable(data);
      $("#chartUnitLabel").textContent = state.unit;
    } catch (e) {
      const tbl = $("#tblChart");
      tbl.innerHTML = `<tbody><tr><td style="padding:14px;color:rgba(255,255,255,.75)">⚠ ${I18N[state.lang].errors.dataLoad}</td></tr></tbody>`;
      console.warn(e);
    }
  }

  // ---------- Log (local) ----------
  const LOG_KEY = "tcda_sizeguide_log_v1";

  function readLog() {
    try {
      const raw = localStorage.getItem(LOG_KEY);
      if (!raw) return [];
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch { return []; }
  }

  function writeLog(arr) {
    localStorage.setItem(LOG_KEY, JSON.stringify(arr));
  }

  function addLog(entry) {
    const arr = readLog();
    arr.unshift(entry);
    arr.splice(50);
    writeLog(arr);
  }

  function exportLogCsv() {
    const arr = readLog();
    if (!arr.length) return;

    const cols = [
      "timestamp","lang","unit","product","productType",
      "inputMethod","inputs","fit","priority",
      "allowanceMm","footWidth","primary","runnerUp"
    ];

    const esc = (s) => `"${String(s ?? "").replace(/"/g,'""')}"`;
    const lines = [];
    lines.push(cols.join(","));
    arr.forEach(e => {
      const row = cols.map(k => esc(e[k]));
      lines.push(row.join(","));
    });

    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tcda_size_log_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function clearLog() {
    localStorage.removeItem(LOG_KEY);
  }

  function refreshLogList() {
    const list = $("#logList");
    const arr = readLog();
    list.innerHTML = "";

    if (!arr.length) {
      const div = document.createElement("div");
      div.className = "hint";
      div.textContent = state.lang === "ja" ? "まだ履歴はありません。" : "No saved entries yet.";
      list.appendChild(div);
      return;
    }

    arr.slice(0, 8).forEach(e => {
      const item = document.createElement("div");
      item.className = "logItem";

      const top = document.createElement("div");
      top.className = "logTop";

      const title = document.createElement("div");
      title.className = "logTitle";
      const prodLabel = PRODUCTS[e.product]?.label?.[state.lang] ?? e.product;
      title.textContent = `${prodLabel} — ${e.primary}${e.runnerUp ? ` / ${e.runnerUp}` : ""}`;

      const meta = document.createElement("div");
      meta.className = "logMeta";
      const ts = e.timestamp ? new Date(e.timestamp).toLocaleString() : "";
      meta.textContent = `${ts} · ${e.unit} · ${e.inputMethod}`;

      top.appendChild(title);
      top.appendChild(meta);

      const body = document.createElement("div");
      body.className = "logBody";
      body.textContent = e.inputs;

      item.appendChild(top);
      item.appendChild(body);
      list.appendChild(item);
    });
  }

  // ---------- Main action ----------
  async function calculate() {
    const cfg = PRODUCTS[state.product];
    const t = I18N[state.lang];

    try {
      const data = await loadData(state.product, state.unit);

      if (cfg.type === "tops") {
        const { nudeChest } = getTopsInputs();
        if (!validateNumber(nudeChest)) {
          alert(t.errors.needChest);
          return;
        }

        const rec = recommendTops(data.rowsNorm, nudeChest, state.unit, state.fit, state.pri);

        $("#outPrimary").textContent = rec.primary ? rec.primary.size : "—";
        $("#outRunnerUp").textContent = rec.runner ? rec.runner.size : "—";
        $("#outPrimaryReason").textContent = rec.primary
          ? `${normalizeReasonTextTops(rec.primary, rec.requiredFinishedChest, rec.ease)} · ${state.pri === "chest" ? (state.lang==="ja"?"胸囲優先":"chest first") : (state.lang==="ja"?"着丈優先":"length first")}`
          : "—";
        $("#outRunnerReason").textContent = rec.runner
          ? `${normalizeReasonTextTops(rec.runner, rec.requiredFinishedChest, rec.ease)} · ${state.pri === "chest" ? (state.lang==="ja"?"丈寄り":"length-leaning") : (state.lang==="ja"?"胸寄り":"chest-leaning")}`
          : "—";

        highlightRows(rec.primary?.size, rec.runner?.size);

        addLog({
          timestamp: nowISO(),
          lang: state.lang,
          unit: state.unit,
          product: state.product,
          productType: "tops",
          inputMethod: getInputMethod(),
          inputs: `${state.lang==="ja"?"胸囲":"chest"}=${fmtNum(nudeChest,1)}${state.unit} / ${state.lang==="ja"?"フィット":"fit"}=${state.fit} / ${state.lang==="ja"?"優先":"pri"}=${state.pri}`,
          fit: state.fit,
          priority: state.pri,
          allowanceMm: "",
          footWidth: "",
          primary: rec.primary?.size || "",
          runnerUp: rec.runner?.size || "",
        });

        refreshLogList();
        $("#cardResult").scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        const { footLen, footWidth, allowMm } = getShoesInputs();
        if (!validateNumber(footLen)) {
          alert(t.errors.needFoot);
          return;
        }

        const rec = recommendShoes(data.rowsNorm, footLen, state.unit, allowMm, footWidth);

        $("#outPrimary").textContent = rec.primary ? rec.primary.size : "—";
        $("#outRunnerUp").textContent = rec.runner ? rec.runner.size : "—";
        $("#outPrimaryReason").textContent = rec.primary ? buildShoesReason(rec.primary, footLen, state.unit, allowMm, footWidth, true) : "—";
        $("#outRunnerReason").textContent = rec.runner ? buildShoesReason(rec.runner, footLen, state.unit, allowMm, footWidth, false) : "—";

        highlightRows(rec.primary?.size, rec.runner?.size);

        addLog({
          timestamp: nowISO(),
          lang: state.lang,
          unit: state.unit,
          product: state.product,
          productType: "shoes",
          inputMethod: "measured",
          inputs: `${state.lang==="ja"?"足長":"foot"}=${fmtNum(footLen,1)}${state.unit} / ${state.lang==="ja"?"幅":"width"}=${footWidth} / ${state.lang==="ja"?"捨て寸":"allow"}=${allowMm}mm`,
          fit: state.fit,
          priority: "",
          allowanceMm: String(allowMm),
          footWidth: footWidth,
          primary: rec.primary?.size || "",
          runnerUp: rec.runner?.size || "",
        });

        refreshLogList();
        $("#cardResult").scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } catch (e) {
      console.warn(e);
      alert(I18N[state.lang].errors.dataLoad);
    }
  }

  // ---------- Init ----------
  function init() {
    $("#year").textContent = String(new Date().getFullYear());

    $("#btnLangJa").addEventListener("click", () => setLang("ja"));
    $("#btnLangEn").addEventListener("click", () => setLang("en"));
    $("#btnUnitCm").addEventListener("click", () => setUnit("cm"));
    $("#btnUnitIn").addEventListener("click", () => setUnit("inch"));

    $("#selProduct").addEventListener("change", (e) => setProduct(e.target.value));
    $("#selFit").addEventListener("change", (e) => setFit(e.target.value));

    $("#btnPriChest").addEventListener("click", () => setPriority("chest"));
    $("#btnPriLength").addEventListener("click", () => setPriority("length"));

    $("#btnEstimateChest").addEventListener("click", () => {
      const h = toNumber($("#inpHeight").value);
      const w = toNumber($("#inpWeight").value);
      const sex = $("#selSex").value;
      const bmiRaw = toNumber($("#inpBmi").value);
      if (!validateNumber(h) || !validateNumber(w)) {
        alert(I18N[state.lang].errors.needNumber);
        return;
      }
      const { chestCm, bmi } = estimateChestFromBody(h, w, sex, Number.isFinite(bmiRaw) ? bmiRaw : NaN);
      state.lastEstimate = { chestCm, bmi };
      const chestIn = cmToIn(chestCm);

      const text = (state.lang === "ja")
        ? `推定結果：胸囲 約 ${fmtNum(state.unit === "cm" ? chestCm : chestIn, 1)}${state.unit}（BMI ${fmtNum(bmi,1)}）`
        : `Estimated: chest ≈ ${fmtNum(state.unit === "cm" ? chestCm : chestIn, 1)}${state.unit} (BMI ${fmtNum(bmi,1)})`;
      $("#tEstimatorResult").textContent = text;
    });

    $("#btnSetEstimated").addEventListener("click", () => {
      if (!state.lastEstimate) return;
      const chest = (state.unit === "cm") ? state.lastEstimate.chestCm : cmToIn(state.lastEstimate.chestCm);
      $("#inpNudeChest").value = fmtNum(chest, 1);
      state.usedEstimator = true;
      $("#tEstimatorResult").textContent = (state.lang === "ja")
        ? `推定値をセットしました（胸囲 ${fmtNum(chest,1)}${state.unit}）`
        : `Set estimated value (chest ${fmtNum(chest,1)}${state.unit})`;
    });

    $("#btnCalc").addEventListener("click", calculate);
    $("#btnReview").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    $("#btnPickFromChart").addEventListener("click", () => $("#cardChart").scrollIntoView({ behavior: "smooth", block: "start" }));

    $("#btnExportLog").addEventListener("click", exportLogCsv);
    $("#btnClearLog").addEventListener("click", () => { clearLog(); refreshLogList(); });

    setLang("ja");
    setUnit("cm");
    setProduct(state.product);
    setFit(state.fit);
    setPriority("chest");
    refreshLogList();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
