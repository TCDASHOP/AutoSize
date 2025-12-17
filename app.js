// TCDA Size Finder (GitHub Pages / Static)
// Data embedded from your CSVs (cm / inch). No network calls.

const DATA = {"version": "2025-12-17", "items": [{"key": "womens_tee", "type": "top", "name": {"ja": "Women’s Crew Neck T-Shirt", "en": "All-Over Print Women’s Crew Neck T-Shirt"}, "charts": {"cm": {"columns": ["サイズ", "身幅", "丈", "袖丈"], "rows": [["XS", "40", "59", "18"], ["S", "42", "60", "19"], ["M", "44", "61", "20"], ["L", "48", "64", "21"], ["XL", "52", "67", "22"], ["2XL", "56", "70", "23"]]}, "inch": {"columns": ["Size", "height", "length", "height of a sleeve"], "rows": [["XS", "15 ¾", "23 ¼", "7 ⅛"], ["S", "16 ½", "23 ⅝", "7 ½"], ["M", "17 ⅜", "24", "7 ⅞"], ["L", "18 ⅞", "25 ¼", "8 ¼"], ["XL", "20 ½", "26 ⅜", "8 ⅝"], ["2XL", "22", "27 ½", "9"]]}}, "calc": {"top_cm": [{"size": "XS", "half_chest_cm": 40.0, "length_cm": 59.0, "sleeve_cm": 18.0}, {"size": "S", "half_chest_cm": 42.0, "length_cm": 60.0, "sleeve_cm": 19.0}, {"size": "M", "half_chest_cm": 44.0, "length_cm": 61.0, "sleeve_cm": 20.0}, {"size": "L", "half_chest_cm": 48.0, "length_cm": 64.0, "sleeve_cm": 21.0}, {"size": "XL", "half_chest_cm": 52.0, "length_cm": 67.0, "sleeve_cm": 22.0}, {"size": "2XL", "half_chest_cm": 56.0, "length_cm": 70.0, "sleeve_cm": 23.0}]}}, {"key": "mens_tee", "type": "top", "name": {"ja": "Men’s Crew Neck T-Shirt", "en": "All-over print men’s crew neck T-shirt"}, "charts": {"cm": {"columns": ["サイズ", "身幅", "丈", "袖丈"], "rows": [["XS", "39", "71", "22"], ["S", "43", "73", "23"], ["M", "47", "75", "24"], ["L", "53", "77", "25"], ["XL", "59", "79", "26"], ["2XL", "65", "81", "27"]]}, "inch": {"columns": ["Size", "height", "length", "height of a sleeve"], "rows": [["XS", "15 ⅜", "28", "8 ⅝"], ["S", "16 ⅞", "28 ¾", "9"], ["M", "18 ½", "29 ½", "9 ½"], ["L", "20 ⅞", "30 ¼", "9 ⅞"], ["XL", "23 ¼", "31 ⅛", "10 ¼"], ["2XL", "25 ⅝", "31 ⅞", "10 ⅝"]]}}, "calc": {"top_cm": [{"size": "XS", "half_chest_cm": 39.0, "length_cm": 71.0, "sleeve_cm": 22.0}, {"size": "S", "half_chest_cm": 43.0, "length_cm": 73.0, "sleeve_cm": 23.0}, {"size": "M", "half_chest_cm": 47.0, "length_cm": 75.0, "sleeve_cm": 24.0}, {"size": "L", "half_chest_cm": 53.0, "length_cm": 77.0, "sleeve_cm": 25.0}, {"size": "XL", "half_chest_cm": 59.0, "length_cm": 79.0, "sleeve_cm": 26.0}, {"size": "2XL", "half_chest_cm": 65.0, "length_cm": 81.0, "sleeve_cm": 27.0}]}}, {"key": "unisex_hoodie", "type": "top", "name": {"ja": "Recycled Unisex Hoodie", "en": "All-Over Print Recycled Unisex Hoodie"}, "charts": {"cm": {"columns": ["サイズ", "1/2胸幅", "長さ", "袖の長さ"], "rows": [["2XS", "48", "66.5", "56.5"], ["XS", "50", "66.5", "56.5"], ["S", "52", "68.0", "57.5"], ["M", "54", "69.5", "58.5"], ["L", "58", "71.0", "60.0"], ["XL", "62", "72.5", "61.5"], ["2XL", "66", "74.0", "63.0"], ["3XL", "70", "75.5", "64.5"], ["4XL", "74", "78.5", "65.5"], ["5XL", "78", "81.5", "66.5"], ["6XL", "82", "84.5", "67.5"]]}, "inch": {"columns": ["𝐬𝐢𝐳𝐞", "1/2 chest width", "Length", "Sleeve length"], "rows": [["2XS", "18 ⅞", "26 ⅛", "22 ¼"], ["XS", "19 ¾", "26 ¼", "22 ¼"], ["S", "20 ½", "26 ¾", "22 ⅝"], ["M", "21 ¼", "27 ⅜", "23"], ["L", "22 ⅞", "28", "23 ⅝"], ["XL", "24 ⅜", "28 ½", "24 ¼"], ["2XL", "26", "29 ⅛", "24 ¾"], ["3XL", "27 ½", "29 ¾", "25 ⅜"], ["4XL", "29 ⅛", "30 ⅞", "25 ¾"], ["5XL", "30 ¾", "32 ⅛", "26 ⅛"], ["6XL", "32 ¼", "33 ¼", "26 ⅝"]]}}, "calc": {"top_cm": [{"size": "2XS", "half_chest_cm": 48.0, "length_cm": 66.5, "sleeve_cm": 56.5}, {"size": "XS", "half_chest_cm": 50.0, "length_cm": 66.5, "sleeve_cm": 56.5}, {"size": "S", "half_chest_cm": 52.0, "length_cm": 68.0, "sleeve_cm": 57.5}, {"size": "M", "half_chest_cm": 54.0, "length_cm": 69.5, "sleeve_cm": 58.5}, {"size": "L", "half_chest_cm": 58.0, "length_cm": 71.0, "sleeve_cm": 60.0}, {"size": "XL", "half_chest_cm": 62.0, "length_cm": 72.5, "sleeve_cm": 61.5}, {"size": "2XL", "half_chest_cm": 66.0, "length_cm": 74.0, "sleeve_cm": 63.0}, {"size": "3XL", "half_chest_cm": 70.0, "length_cm": 75.5, "sleeve_cm": 64.5}, {"size": "4XL", "half_chest_cm": 74.0, "length_cm": 78.5, "sleeve_cm": 65.5}, {"size": "5XL", "half_chest_cm": 78.0, "length_cm": 81.5, "sleeve_cm": 66.5}, {"size": "6XL", "half_chest_cm": 82.0, "length_cm": 84.5, "sleeve_cm": 67.5}]}}, {"key": "zip_hoodie", "type": "top", "name": {"ja": "Recycled Unisex Zip Hoodie", "en": "All-Over Print Recycled Unisex Zip Hoodie"}, "charts": {"cm": {"columns": ["サイズ", "1/2胸幅", "長さ", "袖の長さ"], "rows": [["2XS", "48", "65", "55.5"], ["XS", "50", "65", "55.5"], ["S", "52", "68", "57"], ["M", "54", "68", "58.5"], ["L", "58", "71", "60"], ["XL", "62", "71", "61.5"], ["2XL", "66", "74", "63"], ["3XL", "70", "74", "64.5"], ["4XL", "74", "78", "65"], ["5XL", "78", "78", "65.5"], ["6XL", "82", "78", "66"]]}, "inch": {"columns": ["𝐬𝐢𝐳𝐞", "1/2 chest width", "Length", "Sleeve length"], "rows": [["2XS", "18 ⅞", "25 ⅝", "21 ⅞"], ["XS", "19 ¾", "25 ⅝", "21 ⅞"], ["S", "20 ½", "26 ¾", "22 ½"], ["M", "21 ¼", "26 ¾", "23"], ["L", "22 ⅞", "28", "23 ⅝"], ["XL", "24 ⅜", "28", "24 ¼"], ["2XL", "26", "29 ⅛", "24 ¾"], ["3XL", "27 ½", "29 ⅛", "25 ⅜"], ["4XL", "29 ⅛", "30 ¾", "25 ⅝"], ["5XL", "30 ¾", "30 ¾", "25 ¾"], ["6XL", "32 ¼", "30 ¾", "26"]]}}, "calc": {"top_cm": [{"size": "2XS", "half_chest_cm": 48.0, "length_cm": 65.0, "sleeve_cm": 55.5}, {"size": "XS", "half_chest_cm": 50.0, "length_cm": 65.0, "sleeve_cm": 55.5}, {"size": "S", "half_chest_cm": 52.0, "length_cm": 68.0, "sleeve_cm": 57.0}, {"size": "M", "half_chest_cm": 54.0, "length_cm": 68.0, "sleeve_cm": 58.5}, {"size": "L", "half_chest_cm": 58.0, "length_cm": 71.0, "sleeve_cm": 60.0}, {"size": "XL", "half_chest_cm": 62.0, "length_cm": 71.0, "sleeve_cm": 61.5}, {"size": "2XL", "half_chest_cm": 66.0, "length_cm": 74.0, "sleeve_cm": 63.0}, {"size": "3XL", "half_chest_cm": 70.0, "length_cm": 74.0, "sleeve_cm": 64.5}, {"size": "4XL", "half_chest_cm": 74.0, "length_cm": 78.0, "sleeve_cm": 65.0}, {"size": "5XL", "half_chest_cm": 78.0, "length_cm": 78.0, "sleeve_cm": 65.5}, {"size": "6XL", "half_chest_cm": 82.0, "length_cm": 78.0, "sleeve_cm": 66.0}]}}, {"key": "mens_slipon", "type": "shoe", "name": {"ja": "Men’s Slip-On Canvas Shoes", "en": "Men’s Slip-On Canvas Shoes"}, "charts": {"cm": {"columns": ["サイズ", "足の長さ", "アウトソールの長さ"], "rows": [["23", "23.2", "26.2"], ["23.5", "23.5", "26.2"], ["24", "24", "27"], ["24.5", "24.5", "27"], ["25", "24.8", "27.3"], ["25.5", "25.4", "28.3"], ["26", "25.7", "28.3"], ["26.5", "26", "29"], ["27", "26.7", "29.5"], ["27.5", "27", "29.5"], ["28", "27.3", "30.5"]]}, "inch": {"columns": ["US", "UK", "EU", "leg length", "outsole length"], "rows": [["5", "4", "37.5", "9 ⅛", "10 1/4"], ["5.5", "4.5", "38", "91/4", "10 1/4"], ["6", "5", "38.5", "91/2", "10⅝"], ["6.5", "5.5", "39", "9 ⅝", "10⅝"], ["7", "6", "40", "9 ¾", "10 3/4"], ["7.5", "6.5", "40.5", "10", "11⅛"], ["8", "7", "41", "10⅛", "11⅛"], ["8.5", "7.5", "42", "10 1/4", "11 ⅜"], ["9", "8", "42.5", "10 1/2", "11 ⅝"], ["9.5", "8.5", "43", "10⅝", "11⅝"], ["10", "9", "44", "10 3/4", "12"]]}}, "calc": {"shoe_cm": [{"size": "23", "foot_cm": 23.2, "outsole_cm": 26.2}, {"size": "23.5", "foot_cm": 23.5, "outsole_cm": 26.2}, {"size": "24", "foot_cm": 24.0, "outsole_cm": 27.0}, {"size": "24.5", "foot_cm": 24.5, "outsole_cm": 27.0}, {"size": "25", "foot_cm": 24.8, "outsole_cm": 27.3}, {"size": "25.5", "foot_cm": 25.4, "outsole_cm": 28.3}, {"size": "26", "foot_cm": 25.7, "outsole_cm": 28.3}, {"size": "26.5", "foot_cm": 26.0, "outsole_cm": 29.0}, {"size": "27", "foot_cm": 26.7, "outsole_cm": 29.5}, {"size": "27.5", "foot_cm": 27.0, "outsole_cm": 29.5}, {"size": "28", "foot_cm": 27.3, "outsole_cm": 30.5}], "shoe_in": [{"us": "5", "uk": "4", "eu": "37.5", "foot_in": 9.125, "outsole_in": 10.25}, {"us": "5.5", "uk": "4.5", "eu": "38", "foot_in": 9.25, "outsole_in": 10.25}, {"us": "6", "uk": "5", "eu": "38.5", "foot_in": 9.5, "outsole_in": 10.625}, {"us": "6.5", "uk": "5.5", "eu": "39", "foot_in": 9.625, "outsole_in": 10.625}, {"us": "7", "uk": "6", "eu": "40", "foot_in": 9.75, "outsole_in": 10.75}, {"us": "7.5", "uk": "6.5", "eu": "40.5", "foot_in": 10.0, "outsole_in": 11.125}, {"us": "8", "uk": "7", "eu": "41", "foot_in": 10.125, "outsole_in": 11.125}, {"us": "8.5", "uk": "7.5", "eu": "42", "foot_in": 10.25, "outsole_in": 11.375}, {"us": "9", "uk": "8", "eu": "42.5", "foot_in": 10.5, "outsole_in": 11.625}, {"us": "9.5", "uk": "8.5", "eu": "43", "foot_in": 10.625, "outsole_in": 11.625}, {"us": "10", "uk": "9", "eu": "44", "foot_in": 10.75, "outsole_in": 12.0}]}}]};

let state = {
  lang: "ja",        // "ja" | "en"
  unit: "cm",        // "cm" | "inch"
  activeKey: DATA.items[0].key
};

const $ = (id) => document.getElementById(id);

function cmToInch(cm) { return cm / 2.54; }
function inchToCm(inch) { return inch * 2.54; }
function r1(n) { return Math.round(n * 10) / 10; }

const TEXT = {
  ja: {
    subtitle: "入力して推奨サイズを表示",
    h1: "自動サイズ推奨",
    lead: "計算はブラウザ内で完結します（入力値は送信されません）。",
    chart: "サイズ表",
    close: "閉じる",
    calc: "推奨サイズを見る",
    note: "※ 仕上がり寸法は測り方で±1〜2cm程度の差が出る場合があります。",
    chest: "胸囲（ヌード）",
    foot: "足の長さ",
    unitHint: (u) => `単位：${u}`,
    fit: "フィット感",
    fitOpts: [
      { v: 8,  ja: "ジャスト（ゆとり+8cm）" },
      { v: 12, ja: "ふつう（ゆとり+12cm）" },
      { v: 16, ja: "ゆったり（ゆとり+16cm）" },
    ],
    pleaseInput: "数値を入力してください。",
    overflowTop: "※ 最大サイズでも目安に届きません。サイズ表の実寸を優先して確認してください。",
    overflowShoe: "※ 最大サイズでも目安に届きません。サイズ表の実寸を優先して確認してください。"
  },
  en: {
    subtitle: "Enter your measurements to get a recommended size",
    h1: "Size Recommendation",
    lead: "All calculations run locally in your browser (no data is sent).",
    chart: "Size Chart",
    close: "Close",
    calc: "Get recommended size",
    note: "Note: Finished measurements may vary by ±1–2 cm.",
    chest: "Body chest (nude)",
    foot: "Foot length",
    unitHint: (u) => `Unit: ${u}`,
    fit: "Fit preference",
    fitOpts: [
      { v: 8,  en: "Snug (ease +8cm)" },
      { v: 12, en: "Regular (ease +12cm)" },
      { v: 16, en: "Relaxed (ease +16cm)" },
    ],
    pleaseInput: "Please enter a number.",
    overflowTop: "Note: Even the largest size may be smaller than the target. Please double-check measurements.",
    overflowShoe: "Note: Even the largest size may be smaller than the target. Please double-check measurements."
  }
};

function t(key) {
  return TEXT[state.lang][key];
}

function getItem() {
  return DATA.items.find(x => x.key === state.activeKey);
}

function renderTabs() {
  const tabs = $("tabs");
  tabs.innerHTML = "";
  for (const it of DATA.items) {
    const btn = document.createElement("button");
    btn.className = "tab";
    btn.type = "button";
    btn.setAttribute("aria-selected", it.key === state.activeKey ? "true" : "false");
    btn.textContent = it.name[state.lang] || it.name.ja || it.name.en;
    btn.addEventListener("click", () => {
      state.activeKey = it.key;
      $("result").hidden = true;
      render();
    });
    tabs.appendChild(btn);
  }
}

function buildSelectFit() {
  const label = document.createElement("label");
  label.className = "field";
  const span = document.createElement("span");
  span.textContent = t("fit");
  const sel = document.createElement("select");
  sel.id = "fit";

  const opts = TEXT[state.lang].fitOpts;
  for (const o of opts) {
    const opt = document.createElement("option");
    opt.value = String(o.v); // stored as cm for calculation
    // display unit-aware
    if (state.unit === "cm") {
      opt.textContent = state.lang === "ja" ? o.ja : o.en;
    } else {
      const inch = r1(cmToInch(o.v));
      if (state.lang === "ja") opt.textContent = o.ja.replace(/\+\d+cm/, `+${inch}in`);
      else opt.textContent = o.en.replace(/\+\d+cm/, `+${inch}in`);
    }
    if (o.v === 12) opt.selected = true;
    sel.appendChild(opt);
  }
  label.appendChild(span);
  label.appendChild(sel);
  return label;
}

function buildNumberField(id, labelText) {
  const label = document.createElement("label");
  label.className = "field";
  const span = document.createElement("span");
  span.textContent = labelText;
  const input = document.createElement("input");
  input.id = id;
  input.type = "number";
  input.inputMode = "decimal";
  input.placeholder = state.lang === "ja" ? "例：88" : "e.g. 88";
  const small = document.createElement("small");
  small.className = "muted";
  small.id = id + "_hint";
  small.textContent = t("unitHint")(state.unit);
  label.appendChild(span);
  label.appendChild(input);
  label.appendChild(small);
  return label;
}

function renderForm() {
  const grid = $("formGrid");
  grid.innerHTML = "";
  const it = getItem();

  if (it.type === "top") {
    grid.appendChild(buildNumberField("chest", t("chest")));
    grid.appendChild(buildSelectFit());
    // spacer
    const spacer = document.createElement("div");
    spacer.style.display = "none";
    grid.appendChild(spacer);
  } else if (it.type === "shoe") {
    grid.appendChild(buildNumberField("foot", t("foot")));
    const spacer1 = document.createElement("div");
    const spacer2 = document.createElement("div");
    spacer1.style.display = spacer2.style.display = "none";
    grid.appendChild(spacer1); grid.appendChild(spacer2);
  }
}

function pickTopSize(bodyChestCm, easeCm, rows) {
  const target = bodyChestCm + easeCm;
  let best = null;
  for (const r of rows) {
    const garmentChest = r.half_chest_cm * 2;
    if (garmentChest >= target) {
      const diff = garmentChest - target;
      if (!best || diff < best.diff) {
        best = { size: r.size, garmentChest, target, diff };
      }
    }
  }
  if (!best && rows.length) {
    const last = rows[rows.length - 1];
    best = {
      size: last.size,
      garmentChest: last.half_chest_cm * 2,
      target,
      diff: (last.half_chest_cm * 2) - target,
      overflow: true
    };
  }
  return best;
}

function pickShoeCm(footCm, rows) {
  let best = null;
  for (const r of rows) {
    if (footCm <= r.foot_cm) {
      best = r;
      break;
    }
  }
  if (!best && rows.length) {
    best = { ...rows[rows.length - 1], overflow: true };
  }
  return best;
}

function pickShoeIn(footIn, rows) {
  let best = null;
  for (const r of rows) {
    if (footIn <= r.foot_in) {
      best = r;
      break;
    }
  }
  if (!best && rows.length) {
    best = { ...rows[rows.length - 1], overflow: true };
  }
  return best;
}

function formatLen(cm) {
  if (state.unit === "cm") return `${r1(cm)}cm`;
  return `${r1(cmToInch(cm))}in`;
}

function onCalc() {
  const it = getItem();
  const result = $("result");
  result.hidden = false;

  if (it.type === "top") {
    const raw = parseFloat($("chest")?.value);
    const easeCm = parseFloat($("fit")?.value); // stored cm
    if (Number.isNaN(raw)) {
      result.textContent = t("pleaseInput");
      return;
    }
    const bodyChestCm = state.unit === "cm" ? raw : inchToCm(raw);
    const rec = pickTopSize(bodyChestCm, easeCm, it.calc.top_cm);

    if (!rec) {
      result.textContent = t("pleaseInput");
      return;
    }

    const bodyShown = state.unit === "cm" ? r1(bodyChestCm) : r1(cmToInch(bodyChestCm));
    const targetShown = state.unit === "cm" ? r1(rec.target) : r1(cmToInch(rec.target));
    const garmentShown = state.unit === "cm" ? r1(rec.garmentChest) : r1(cmToInch(rec.garmentChest));

    if (state.lang === "ja") {
      let msg = `推奨：${rec.size}\n`;
      msg += `あなたの胸囲：${bodyShown}${state.unit}\n`;
      msg += `目安（胸囲＋ゆとり）：${targetShown}${state.unit}\n`;
      msg += `推奨サイズの仕上がり胸囲：${garmentShown}${state.unit}\n`;
      if (rec.overflow) msg += `\n${t("overflowTop")}`;
      result.textContent = msg;
    } else {
      let msg = `Recommended: ${rec.size}\n`;
      msg += `Your chest: ${bodyShown}${state.unit}\n`;
      msg += `Target (chest + ease): ${targetShown}${state.unit}\n`;
      msg += `Garment chest (recommended size): ${garmentShown}${state.unit}\n`;
      if (rec.overflow) msg += `\n${t("overflowTop")}`;
      result.textContent = msg;
    }
  }

  if (it.type === "shoe") {
    const raw = parseFloat($("foot")?.value);
    if (Number.isNaN(raw)) {
      result.textContent = t("pleaseInput");
      return;
    }

    if (state.unit === "cm") {
      const footCm = raw;
      const rec = pickShoeCm(footCm, it.calc.shoe_cm);

      if (!rec) {
        result.textContent = t("pleaseInput");
        return;
      }

      if (state.lang === "ja") {
        let msg = `推奨：${rec.size}（JP）\n`;
        msg += `足の長さ：${r1(footCm)}cm\n`;
        msg += `サイズ表の目安：〜${r1(rec.foot_cm)}cm\n`;
        if (rec.overflow) msg += `\n${t("overflowShoe")}`;
        result.textContent = msg;
      } else {
        let msg = `Recommended: JP ${rec.size}\n`;
        msg += `Foot length: ${r1(footCm)}cm\n`;
        msg += `Chart guide: up to ${r1(rec.foot_cm)}cm\n`;
        if (rec.overflow) msg += `\n${t("overflowShoe")}`;
        result.textContent = msg;
      }
    } else {
      const footIn = raw;
      const rec = pickShoeIn(footIn, it.calc.shoe_in);

      if (!rec) {
        result.textContent = t("pleaseInput");
        return;
      }

      if (state.lang === "ja") {
        let msg = `推奨：US ${rec.us} / UK ${rec.uk} / EU ${rec.eu}\n`;
        msg += `足の長さ：${r1(footIn)}in\n`;
        msg += `サイズ表の目安：〜${r1(rec.foot_in)}in\n`;
        if (rec.overflow) msg += `\n${t("overflowShoe")}`;
        result.textContent = msg;
      } else {
        let msg = `Recommended: US ${rec.us} / UK ${rec.uk} / EU ${rec.eu}\n`;
        msg += `Foot length: ${r1(footIn)}in\n`;
        msg += `Chart guide: up to ${r1(rec.foot_in)}in\n`;
        if (rec.overflow) msg += `\n${t("overflowShoe")}`;
        result.textContent = msg;
      }
    }
  }
}

function renderText() {
  $("subtitle").textContent = t("subtitle");
  $("h1").textContent = t("h1");
  $("lead").textContent = t("lead");
  $("chartBtn").textContent = t("chart");
  $("closeBtn").textContent = t("close");
  $("calcBtn").textContent = t("calc");
  $("note").textContent = t("note");

  $("unitBtn").textContent = state.unit;
  $("langBtn").textContent = state.lang === "ja" ? "日本語" : "English";
}

function showModal() {
  const it = getItem();
  const modal = $("modal");
  const wrap = $("tableWrap");
  const title = $("modalTitle");
  title.textContent = (state.lang === "ja" ? "サイズ表" : "Size Chart") + `（${state.unit}）`;

  const chart = it.charts[state.unit];
  const cols = chart.columns;
  const rows = chart.rows;

  // build table
  let html = "<table><thead><tr>";
  for (const c of cols) html += `<th>${escapeHtml(c)}</th>`;
  html += "</tr></thead><tbody>";
  for (const r of rows) {
    html += "<tr>";
    for (const cell of r) html += `<td>${escapeHtml(cell)}</td>`;
    html += "</tr>";
  }
  html += "</tbody></table>";
  wrap.innerHTML = html;

  modal.hidden = false;
}

function hideModal() {
  $("modal").hidden = true;
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#39;");
}

function render() {
  renderText();
  renderTabs();
  renderForm();
}

$("unitBtn").addEventListener("click", () => {
  // convert existing inputs if present
  const it = getItem();
  if (it.type === "top") {
    const inp = $("chest");
    const v = inp ? parseFloat(inp.value) : NaN;
    if (!Number.isNaN(v)) {
      inp.value = state.unit === "cm" ? r1(cmToInch(v)) : r1(inchToCm(v));
    }
  } else if (it.type === "shoe") {
    const inp = $("foot");
    const v = inp ? parseFloat(inp.value) : NaN;
    if (!Number.isNaN(v)) {
      inp.value = state.unit === "cm" ? r1(cmToInch(v)) : r1(inchToCm(v));
    }
  }

  state.unit = state.unit === "cm" ? "inch" : "cm";
  $("result").hidden = true;
  render();
});

$("langBtn").addEventListener("click", () => {
  state.lang = state.lang === "ja" ? "en" : "ja";
  $("result").hidden = true;
  render();
});

$("calcBtn").addEventListener("click", onCalc);
$("chartBtn").addEventListener("click", showModal);
$("closeBtn").addEventListener("click", hideModal);
$("modal").addEventListener("click", (e) => {
  if (e.target && e.target.dataset && e.target.dataset.close) hideModal();
});

render();