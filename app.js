
(() => {
  "use strict";

  // ====== 商品定義（表示名は短く分かりやすく） ======
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
  const cmBtn = $("cmBtn");
  const inchBtn = $("inchBtn");
  const guideImage = $("guideImage");
  const tableContainer = $("tableContainer");
  const yearEl = $("year");

  // ====== state ======
  const state = {
    unit: "cm",
    productKey: "",
  };

  // ====== init ======
  document.addEventListener("DOMContentLoaded", () => {
    yearEl.textContent = String(new Date().getFullYear());
    buildProductOptions();
    wireEvents();
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

    cmBtn.addEventListener("click", async () => {
      setUnit("cm");
      await refresh();
    });

    inchBtn.addEventListener("click", async () => {
      setUnit("inch");
      await refresh();
    });
  }

  function setUnit(unit) {
    state.unit = unit;
    const isCm = unit === "cm";
    cmBtn.classList.toggle("is-active", isCm);
    inchBtn.classList.toggle("is-active", !isCm);
    cmBtn.setAttribute("aria-pressed", String(isCm));
    inchBtn.setAttribute("aria-pressed", String(!isCm));
  }

  function getCurrentProduct() {
    return PRODUCTS.find((p) => p.key === state.productKey) || null;
  }

  async function refresh() {
    const product = getCurrentProduct();

    if (!product) {
      guideImage.removeAttribute("src");
      guideImage.style.display = "none";
      renderStatus("商品を選択してください / Please select an item.");
      return;
    }

    // ガイド画像
    guideImage.src = product.guideImage;
    guideImage.style.display = "block";

    // CSV読み込み
    const csvPath = product.csv[state.unit];

    renderStatus("Loading...");

    try {
      const csvText = await fetchText(csvPath);
      const parsed = parseCSV(csvText);

      if (!parsed.headers.length) {
        renderStatus("CSVが空です / CSV is empty.");
        return;
      }

      renderTable(parsed.headers, parsed.rows);
    } catch (err) {
      console.error(err);
      renderStatus(
        "読み込みに失敗しました。CSVパス/ファイル名を確認してください。\n" +
        "Failed to load. Please check CSV path/filename."
      );
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
