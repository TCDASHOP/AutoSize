/* =========================================================
   TCDA AutoSize - app.js (FULL REWRITE)
   Works with:
   - index.html IDs: productSelect, unitCm, unitInch, copyTableBtn,
                     downloadCsvBtn, guideImage, sizeTableHead, sizeTableBody,
                     imageModal, modalBackdrop, modalClose, modalImage
   - CSV files under: ./data/
   - Guide images under: ./assets/
========================================================= */

(() => {
  "use strict";

  // ---------- DOM ----------
  const $ = (id) => document.getElementById(id);

  const el = {
    productSelect: $("productSelect"),
    unitCm: $("unitCm"),
    unitInch: $("unitInch"),
    copyTableBtn: $("copyTableBtn"),
    downloadCsvBtn: $("downloadCsvBtn"),
    guideImage: $("guideImage"),
    head: $("sizeTableHead"),
    body: $("sizeTableBody"),

    modal: $("imageModal"),
    modalBackdrop: $("modalBackdrop"),
    modalClose: $("modalClose"),
    modalImage: $("modalImage"),
  };

  // ---------- Config ----------
  // value は index.html の <option value="..."> と一致させる
  const PRODUCTS = {
    womens_slipon: {
      guide: "./assets/guide_slipon.jpg",
      csv: { cm: "./data/womens_slipon_cm.csv", inch: "./data/womens_slipon_inch.csv" },
      type: "slipon",
    },
    mens_slipon: {
      guide: "./assets/guide_slipon.jpg",
      csv: { cm: "./data/mens_slipon_cm.csv", inch: "./data/mens_slipon_inch.csv" },
      type: "slipon",
    },
    aop_womens_crew: {
      guide: "./assets/guide_tshirt.jpg",
      csv: { cm: "./data/aop_womens_crew_cm.csv", inch: "./data/aop_womens_crew_inch.csv" },
      type: "apparel",
    },
    aop_mens_crew: {
      guide: "./assets/guide_tshirt.jpg",
      csv: { cm: "./data/aop_mens_crew_cm.csv", inch: "./data/aop_mens_crew_inch.csv" },
      type: "apparel",
    },
    aop_recycled_hoodie: {
      guide: "./assets/guide_hoodie.jpg",
      csv: { cm: "./data/aop_recycled_hoodie_cm.csv", inch: "./data/aop_recycled_hoodie_inch.csv" },
      type: "apparel",
    },
    aop_recycled_zip_hoodie: {
      guide: "./assets/guide_zip_hoodie.jpg",
      csv: { cm: "./data/aop_recycled_zip_hoodie_cm.csv", inch: "./data/aop_recycled_zip_hoodie_inch.csv" },
      type: "apparel",
    },
  };

  const STORAGE_KEYS = {
    product: "tcda_sizeguide_product",
    unit: "tcda_sizeguide_unit",
  };

  const DEFAULT_STATE = {
    product: "womens_slipon",
    unit: "cm",
  };

  // ---------- State ----------
  const state = {
    product: DEFAULT_STATE.product,
    unit: DEFAULT_STATE.unit, // "cm" | "inch"
    lastCsvText: "",
    lastTable: { headers: [], rows: [] },
  };

  // ---------- Helpers ----------
  const escapeHtml = (s) =>
    String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  function setLoading(message = "読み込み中…") {
    el.head.innerHTML = "";
    el.body.innerHTML = `<tr><td colspan="99" style="padding:16px;opacity:.8">${escapeHtml(
      message
    )}</td></tr>`;
  }

  function setError(message) {
    el.head.innerHTML = "";
    el.body.innerHTML = `<tr><td colspan="99" style="padding:16px;color:#ff8a8a">${escapeHtml(
      message
    )}</td></tr>`;
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEYS.product, state.product);
      localStorage.setItem(STORAGE_KEYS.unit, state.unit);
    } catch (_) {}
  }

  function loadState() {
    try {
      const p = localStorage.getItem(STORAGE_KEYS.product);
      const u = localStorage.getItem(STORAGE_KEYS.unit);
      if (p && PRODUCTS[p]) state.product = p;
      if (u === "cm" || u === "inch") state.unit = u;
    } catch (_) {}
  }

  function updateUnitButtons() {
    const isCm = state.unit === "cm";
    el.unitCm.setAttribute("aria-pressed", isCm ? "true" : "false");
    el.unitInch.setAttribute("aria-pressed", !isCm ? "true" : "false");

    el.unitCm.classList.toggle("is-active", isCm);
    el.unitInch.classList.toggle("is-active", !isCm);
  }

  function updateGuideImage() {
    const cfg = PRODUCTS[state.product];
    el.guideImage.src = cfg.guide;
  }

  function updateDownloadLink() {
    const cfg = PRODUCTS[state.product];
    const path = cfg.csv[state.unit];
    el.downloadCsvBtn.href = path;
    el.downloadCsvBtn.setAttribute("download", `${state.product}_${state.unit}.csv`);
  }

  // ---------- CSV Parsing ----------
  // ちゃんと引用符にも対応（簡易だけど実用）
  function parseCSV(text) {
    const rows = [];
    let row = [];
    let cur = "";
    let inQuotes = false;

    // normalize line endings
    const t = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

    for (let i = 0; i < t.length; i++) {
      const ch = t[i];
      const next = t[i + 1];

      if (inQuotes) {
        if (ch === '"' && next === '"') {
          cur += '"';
          i++;
        } else if (ch === '"') {
          inQuotes = false;
        } else {
          cur += ch;
        }
      } else {
        if (ch === '"') {
          inQuotes = true;
        } else if (ch === ",") {
          row.push(cur.trim());
          cur = "";
        } else if (ch === "\n") {
          row.push(cur.trim());
          cur = "";
          // skip empty trailing rows
          if (row.some((c) => c !== "")) rows.push(row);
          row = [];
        } else {
          cur += ch;
        }
      }
    }

    // last cell
    row.push(cur.trim());
    if (row.some((c) => c !== "")) rows.push(row);

    if (rows.length === 0) return { headers: [], rows: [] };

    const headers = rows[0].map((h) => h.trim());
    const body = rows.slice(1).map((r) => {
      const rr = r.slice(0, headers.length);
      while (rr.length < headers.length) rr.push("");
      return rr;
    });

    return { headers, rows: body };
  }

  // ---------- Slip-on column normalization ----------
  // ヘッダー揺れ（日本語/英語/順番違い）を吸収して表示順を固定する
  function normalizeSliponTable(parsed, unit) {
    const rawHeaders = parsed.headers.map((h) => h.trim());
    const rows = parsed.rows;

    // ヘッダーの正規化キーを推定
    const keyOf = (h) => {
      const s = h.toLowerCase();

      // size
      if (h.includes("サイズ") || s === "size") return "size";

      // foot length
      if (
        h.includes("足の長さ") ||
        h.includes("足長") ||
        s.includes("foot") ||
        s.includes("foot length") ||
        s.includes("leg length") // ここが「表示されない」原因になってたやつ
      ) {
        return "foot";
      }

      // outsole length
      if (h.includes("アウトソール") || s.includes("outsole")) return "outsole";

      // fallback: keep original
      return h;
    };

    const indexByKey = new Map();
    rawHeaders.forEach((h, idx) => {
      const k = keyOf(h);
      // 既に同じkeyがあれば最初を優先
      if (!indexByKey.has(k)) indexByKey.set(k, idx);
    });

    const desiredOrder = unit === "inch"
      ? ["US", "UK", "EU", "foot", "outsole"]
      : ["size", "foot", "outsole"];

    // inchの場合、US/UK/EU はそのまま探す（大文字小文字なども吸収）
    function findIndexFor(label) {
      if (label === "US" || label === "UK" || label === "EU") {
        const i = rawHeaders.findIndex((h) => h.trim().toUpperCase() === label);
        return i >= 0 ? i : null;
      }
      return indexByKey.has(label) ? indexByKey.get(label) : null;
    }

    const indices = desiredOrder.map(findIndexFor).filter((v) => v !== null);

    // headers (display labels)
    let displayHeaders = [];
    if (unit === "inch") {
      displayHeaders = ["US", "UK", "EU", "Foot length", "Outsole length"];
      // もしEU/UK/USが欠けてたら、存在するものだけに合わせる
      const keep = [];
      const map = [
        { want: "US", idx: findIndexFor("US") },
        { want: "UK", idx: findIndexFor("UK") },
        { want: "EU", idx: findIndexFor("EU") },
        { want: "Foot length", idx: findIndexFor("foot") },
        { want: "Outsole length", idx: findIndexFor("outsole") },
      ];
      map.forEach((m) => {
        if (m.idx !== null) keep.push(m.want);
      });
      displayHeaders = keep;

      const keptIndices = map.filter((m) => m.idx !== null).map((m) => m.idx);
      const newRows = rows.map((r) => keptIndices.map((i) => r[i] ?? ""));
      return { headers: displayHeaders, rows: newRows };
    } else {
      // cm（国内向け）は日本語で統一
      const map = [
        { want: "サイズ", idx: findIndexFor("size") },
        { want: "足の長さ", idx: findIndexFor("foot") },
        { want: "アウトソールの長さ", idx: findIndexFor("outsole") },
      ].filter((m) => m.idx !== null);

      const newRows = rows.map((r) => map.map((m) => r[m.idx] ?? ""));
      return { headers: map.map((m) => m.want), rows: newRows };
    }
  }

  // ---------- Render ----------
  function renderTable(parsed) {
    const headers = parsed.headers;
    const rows = parsed.rows;

    // thead
    el.head.innerHTML = `
      <tr>
        ${headers.map((h) => `<th>${escapeHtml(h)}</th>`).join("")}
      </tr>
    `;

    // tbody
    el.body.innerHTML = rows
      .map(
        (r) => `
        <tr>
          ${r.map((c) => `<td>${escapeHtml(c)}</td>`).join("")}
        </tr>
      `
      )
      .join("");

    // store for copy
    state.lastTable = { headers, rows };
  }

  // ---------- Fetch + Build ----------
  async function loadAndRender() {
    const cfg = PRODUCTS[state.product];
    if (!cfg) {
      setError("商品設定が見つかりません。");
      return;
    }

    updateUnitButtons();
    updateGuideImage();
    updateDownloadLink();
    saveState();

    const csvPath = cfg.csv[state.unit];
    setLoading(`CSV 読み込み中… (${csvPath})`);

    try {
      // cache-bust（更新が反映されない対策）
      const url = `${csvPath}?v=${Date.now()}`;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`CSV取得に失敗しました (${res.status})`);
      const text = await res.text();
      state.lastCsvText = text;

      let parsed = parseCSV(text);

      // 商品タイプに応じて補正
      if (cfg.type === "slipon") {
        parsed = normalizeSliponTable(parsed, state.unit);
      } else {
        // apparelは基本そのまま（CSVのヘッダーを尊重）
        // ※必要ならここで共通ヘッダー名に変換も可能
      }

      if (!parsed.headers.length) {
        setError("CSVが空か、ヘッダー行がありません。");
        return;
      }

      renderTable(parsed);
    } catch (err) {
      setError(err?.message || "読み込みに失敗しました。");
    }
  }

  // ---------- Copy ----------
  async function copyTableToClipboard() {
    const { headers, rows } = state.lastTable;
    if (!headers.length) return;

    // Excel/Numbersに貼りやすいTSV
    const tsv = [headers, ...rows]
      .map((r) => r.map((c) => String(c ?? "")).join("\t"))
      .join("\n");

    try {
      await navigator.clipboard.writeText(tsv);
      flashButton(el.copyTableBtn, "コピー完了");
    } catch (_) {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = tsv;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        flashButton(el.copyTableBtn, "コピー完了");
      } catch (e) {
        flashButton(el.copyTableBtn, "コピー失敗");
      } finally {
        document.body.removeChild(ta);
      }
    }
  }

  function flashButton(button, text) {
    const original = button.textContent;
    button.textContent = text;
    button.disabled = true;
    setTimeout(() => {
      button.textContent = original;
      button.disabled = false;
    }, 900);
  }

  // ---------- Modal (image zoom) ----------
  function openModal(src) {
    if (!el.modal || !el.modalImage) return;
    el.modalImage.src = src;
    el.modal.setAttribute("aria-hidden", "false");
    el.modal.classList.add("is-open");
  }

  function closeModal() {
    if (!el.modal) return;
    el.modal.setAttribute("aria-hidden", "true");
    el.modal.classList.remove("is-open");
    if (el.modalImage) el.modalImage.src = "";
  }

  // ---------- Events ----------
  function bindEvents() {
    // Product select
    el.productSelect.addEventListener("change", () => {
      const v = el.productSelect.value;
      if (PRODUCTS[v]) {
        state.product = v;
        loadAndRender();
      }
    });

    // Unit toggle
    el.unitCm.addEventListener("click", () => {
      if (state.unit !== "cm") {
        state.unit = "cm";
        loadAndRender();
      }
    });

    el.unitInch.addEventListener("click", () => {
      if (state.unit !== "inch") {
        state.unit = "inch";
        loadAndRender();
      }
    });

    // Copy
    el.copyTableBtn.addEventListener("click", copyTableToClipboard);

    // Guide image zoom
    el.guideImage.addEventListener("click", () => openModal(el.guideImage.src));

    // Modal close
    if (el.modalBackdrop) el.modalBackdrop.addEventListener("click", closeModal);
    if (el.modalClose) el.modalClose.addEventListener("click", closeModal);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });
  }

  // ---------- Init ----------
  function init() {
    loadState();

    // reflect state into UI
    if (PRODUCTS[state.product]) el.productSelect.value = state.product;
    updateUnitButtons();
    updateGuideImage();
    updateDownloadLink();

    bindEvents();
    loadAndRender();
  }

  // DOM Ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
