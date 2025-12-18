(() => {
  "use strict";

  // ====== 商品定義 ======
  const PRODUCTS = [
    {
      key: "womens_slipon",
      label: "Women's slip-on canvas shoes",
      guideImage: "assets/guide_slipon.jpg",
      csv: { cm: "data/womens_slipon_cm.csv", inch: "data/womens_slipon_inch.csv" },
    },
    {
      key: "mens_slipon",
      label: "Men's slip-on canvas shoes",
      guideImage: "assets/guide_slipon.jpg",
      csv: { cm: "data/mens_slipon_cm.csv", inch: "data/mens_slipon_inch.csv" },
    },
    {
      key: "womens_crew",
      label: "Women's Crew Neck T-Shirt",
      guideImage: "assets/guide_tshirt.jpg",
      csv: { cm: "data/aop_womens_crew_cm.csv", inch: "data/aop_womens_crew_inch.csv" },
    },
    {
      key: "mens_crew",
      label: "Men's Crew Neck T-Shirt",
      guideImage: "assets/guide_tshirt.jpg",
      csv: { cm: "data/aop_mens_crew_cm.csv", inch: "data/aop_mens_crew_inch.csv" },
    },
    {
      key: "unisex_hoodie",
      label: "Unisex Hoodie",
      guideImage: "assets/guide_hoodie.jpg",
      csv: { cm: "data/aop_recycled_hoodie_cm.csv", inch: "data/aop_recycled_hoodie_inch.csv" },
    },
    {
      key: "unisex_zip_hoodie",
      label: "Unisex ZIP Hoodie",
      guideImage: "assets/guide_zip_hoodie.jpg",
      csv: { cm: "data/aop_recycled_zip_hoodie_cm.csv", inch: "data/aop_recycled_zip_hoodie_inch.csv" },
    },
  ];

  // ====== DOM ======
  const $ = (id) => document.getElementById(id);

  const productSelect = $("productSelect");
  const productLabel = $("productLabel");
  const productPlaceholder = $("productPlaceholder");

  const jpBtn = $("jpBtn");
  const enBtn = $("enBtn");
  const unitBadge = $("unitBadge");

  const guideTitle = $("guideTitle");
  const tableTitle = $("tableTitle");
  const imageNote = $("imageNote");

  const guideImage = $("guideImage");
  const tableContainer = $("tableContainer");
  const yearEl = $("year");

  // ====== state ======
  const state = {
    lang: "JP",   // JP or EN
    unit: "cm",   // cm or inch（langから自動決定）
    productKey: "",
  };

  // ====== i18n（最低限） ======
  const T = {
    JP: {
      htmlLang: "ja",
      product: "商品",
      placeholder: "選択してください",
      guide: "採寸ガイド",
      table: "サイズ表",
      imageNote: "※ 画像は商品に応じて切り替わります",
      selectFirst: "商品を選択してください",
      loading: "読み込み中...",
      empty: "CSVが空です",
      failed: "読み込みに失敗しました。CSVパス/ファイル名を確認してください。",
    },
    EN: {
      htmlLang: "en",
      product: "Item",
      placeholder: "Select an item",
      guide: "Measurement Guide",
      table: "Size Table",
      imageNote: "Image changes by product.",
      selectFirst: "Please select an item.",
      loading: "Loading...",
      empty: "CSV is empty.",
      failed: "Failed to load. Please check CSV path/filename.",
    },
  };

  // ====== init ======
  document.addEventListener("DOMContentLoaded", () => {
    yearEl.textContent = String(new Date().getFullYear());

    buildProductOptions();
    wireEvents();

    // 初期言語：localStorage優先 → ブラウザ言語判定 → JP
    const saved = localStorage.getItem("tcda_lang");
    const browserIsJa = (navigator.language || "").toLowerCase().startsWith("ja");
    const initialLang = (saved === "EN" || saved === "JP") ? saved : (browserIsJa ? "JP" : "EN");

    setLanguage(initialLang, { refresh: false });
    refresh();
  });

  function buildProductOptions() {
    while (productSelect.options.length > 1) productSelect.remove(1);
    for (const p of PRODUCTS) {
      const opt = document.createElement("option");
      opt.value = p.key;
      opt.textContent = p.label;
      productSelect.appendChild(opt);
    }
  }

  function wireEvents() {
    productSelect.addEventListener("change", async (e) => {
      state.productKey = e.target.value || "";
      await refresh();
    });

    jpBtn.addEventListener("click", async () => {
      setLanguage("JP");
      await refresh();
    });

    enBtn.addEventListener("click", async () => {
      setLanguage("EN");
      await refresh();
    });
  }

  // ★ JP=cm / EN=inch をここで確定
  function setLanguage(lang, opts = { refresh: true }) {
    state.lang = lang;
    state.unit = (lang === "JP") ? "cm" : "inch";

    localStorage.setItem("tcda_lang", lang);

    const isJP = lang === "JP";
    jpBtn.classList.toggle("is-active", isJP);
    enBtn.classList.toggle("is-active", !isJP);
    jpBtn.setAttribute("aria-pressed", String(isJP));
    enBtn.setAttribute("aria-pressed", String(!isJP));

    unitBadge.textContent = state.unit;

    // 文言の切替（最低限）
    const tr = T[lang];
    document.documentElement.lang = tr.htmlLang;
    productLabel.textContent = tr.product;
    productPlaceholder.textContent = `${tr.placeholder} / ${lang === "JP" ? "Select an item" : "選択してください"}`;
    guideTitle.textContent = tr.guide;
    tableTitle.textContent = tr.table;
    imageNote.textContent = `${T.JP.imageNote} / ${T.EN.imageNote}`;
  }

  function getCurrentProduct() {
    return PRODUCTS.find((p) => p.key === state.productKey) || null;
  }

  async function refresh() {
    const tr = T[state.lang];
    const product = getCurrentProduct();

    if (!product) {
      guideImage.removeAttribute("src");
      guideImage.style.display = "none";
      renderStatus(`${tr.selectFirst}`);
      return;
    }

    // ガイド画像
    guideImage.src = product.guideImage;
    guideImage.style.display = "block";

    // CSV読み込み（JP=cm / EN=inch）
    const csvPath = product.csv[state.unit];

    renderStatus(tr.loading);

    try {
      const csvText = await fetchText(csvPath);
      const parsed = parseCSV(csvText);

      if (!parsed.headers.length) {
        renderStatus(tr.empty);
        return;
      }

      renderTable(parsed.headers, parsed.rows);
    } catch (err) {
      console.error(err);
      renderStatus(tr.failed);
    }
  }

  async function fetchText(path) {
    // 先頭に / を付けない（GitHub Pagesの /AutoSize/ でも壊れにくい）
    const res = await fetch(path, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${path}`);
    return await res.text();
  }

  // ====== CSV parser（軽量） ======
  function parseCSV(text) {
    const lines = text
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) return { headers: [], rows: [] };

    const rows = lines.map(splitCsvLine);
    const headers = rows[0].map((h) => String(h).trim());
    const dataRows = rows.slice(1);

    return { headers, rows: dataRows };
  }

  function splitCsvLine(line) {
    const out = [];
    let cur = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const ch = line[i];

      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
        continue;
      }

      if (ch === "," && !inQuotes) {
        out.push(cur);
        cur = "";
        continue;
      }

      cur += ch;
    }
    out.push(cur);
    return out.map((v) => v.trim());
  }

  // ====== render ======
  function renderStatus(message) {
    tableContainer.innerHTML = "";
    const div = document.createElement("div");
    div.className = "status";
    div.textContent = message;
    tableContainer.appendChild(div);
  }

  function renderTable(headers, rows) {
    tableContainer.innerHTML = "";

    const table = document.createElement("table");
    table.className = "size-table";

    const thead = document.createElement("thead");
    const trh = document.createElement("tr");
    for (const h of headers) {
      const th = document.createElement("th");
      th.textContent = h;
      trh.appendChild(th);
    }
    thead.appendChild(trh);

    const tbody = document.createElement("tbody");
    for (const r of rows) {
      const tr = document.createElement("tr");
      for (let c = 0; c < headers.length; c++) {
        const td = document.createElement("td");
        td.textContent = (r[c] ?? "").toString();
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }

    table.appendChild(thead);
    table.appendChild(tbody);
    tableContainer.appendChild(table);
  }
})();
