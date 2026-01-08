#!/usr/bin/env python3
# Build *_inch.csv from *_cm.csv using 1/8 inch rounding and unicode fractions.
# For shoes, preserves US/UK/EU columns if an existing inch CSV is present.

from __future__ import annotations
import csv
from pathlib import Path
from dataclasses import dataclass
from typing import Dict, List, Optional, Tuple

FRACTIONS = {
    0: "",
    1: "⅛",
    2: "¼",
    3: "⅜",
    4: "½",
    5: "⅝",
    6: "¾",
    7: "⅞",
}

def inch_fmt(inches: float) -> str:
    # Round to nearest 1/8 inch
    if inches is None:
        return ""
    x = round(inches * 8) / 8.0
    whole = int(x // 1)
    frac = int(round((x - whole) * 8))
    # Handle rounding overflow
    if frac == 8:
        whole += 1
        frac = 0

    frac_glyph = FRACTIONS.get(frac, "")
    if whole == 0 and frac:
        return frac_glyph
    if whole and frac:
        return f"{whole} {frac_glyph}"
    return str(whole)

def is_number(s: str) -> bool:
    try:
        float(s)
        return True
    except Exception:
        return False

def read_master(master_path: Path) -> List[dict]:
    with master_path.open("r", encoding="utf-8-sig", newline="") as f:
        r = csv.DictReader(f)
        out = []
        for row in r:
            enabled = (row.get("enabled","1") or "1").strip()
            if enabled in {"0","false","FALSE","no","NO"}:
                continue
            out.append(row)
        return out

def convert_tops(cm_path: Path, inch_path: Path) -> None:
    with cm_path.open("r", encoding="utf-8-sig", newline="") as f:
        r = csv.reader(f)
        rows = list(r)

    if not rows:
        return

    header = rows[0]
    body = rows[1:]
    out_rows = [header]

    for row in body:
        if not row:
            continue
        new = row[:]
        for i, cell in enumerate(row):
            # skip first col (Size)
            if i == 0:
                continue
            cell = (cell or "").strip()
            if is_number(cell):
                cm = float(cell)
                inches = cm / 2.54
                new[i] = inch_fmt(inches)
        out_rows.append(new)

    inch_path.write_text("", encoding="utf-8")  # ensure file exists for some envs
    with inch_path.open("w", encoding="utf-8-sig", newline="") as wf:
        w = csv.writer(wf)
        w.writerows(out_rows)

def convert_shoes(cm_path: Path, inch_path: Path) -> None:
    # cm expected: Size,Foot length,Outsole length
    with cm_path.open("r", encoding="utf-8-sig", newline="") as f:
        r = csv.reader(f)
        cm_rows = list(r)

    if len(cm_rows) < 2:
        return

    cm_header = cm_rows[0]
    cm_body = cm_rows[1:]

    # Prefer preserving US/UK/EU from an existing inch CSV (align by row order)
    us_uk_eu: List[Tuple[str,str,str]] = []
    if inch_path.exists():
        with inch_path.open("r", encoding="utf-8-sig", newline="") as f:
            rr = csv.reader(f)
            inch_rows = list(rr)
        if len(inch_rows) >= 2 and len(inch_rows[0]) >= 3:
            # take first 3 cols of each body row
            for row in inch_rows[1:]:
                if len(row) >= 3:
                    us_uk_eu.append((row[0], row[1], row[2]))

    if us_uk_eu and len(us_uk_eu) != len(cm_body):
        # Row mismatch: don't risk corrupting mapping
        print(f"SKIP shoes (row mismatch): {cm_path.name} ({len(cm_body)}) vs existing inch ({len(us_uk_eu)})")
        return

    out_header = ["US","UK","EU","Foot length","Outsole length"]
    out_rows = [out_header]

    for idx, row in enumerate(cm_body):
        if len(row) < 3:
            continue
        foot_cm = row[1].strip()
        out_cm = row[2].strip()

        foot_in = inch_fmt(float(foot_cm)/2.54) if is_number(foot_cm) else ""
        out_in = inch_fmt(float(out_cm)/2.54) if is_number(out_cm) else ""

        if us_uk_eu:
            us, uk, eu = us_uk_eu[idx]
        else:
            # If no existing inch mapping, fall back to blanks
            us, uk, eu = "", "", ""

        out_rows.append([us, uk, eu, foot_in, out_in])

    with inch_path.open("w", encoding="utf-8-sig", newline="") as wf:
        w = csv.writer(wf)
        w.writerows(out_rows)

def main() -> int:
    root = Path(__file__).resolve().parents[1]  # AutoSize-main/
    data_dir = root / "data"
    master = data_dir / "products_master.csv"
    if not master.exists():
        raise SystemExit(f"products_master.csv not found: {master}")

    rows = read_master(master)
    n_ok = 0
    n_skip = 0

    for r in rows:
        key = (r.get("key") or "").strip()
        typ = (r.get("type") or "").strip()
        if not key or not typ:
            continue

        cm_rel = (r.get("csv_cm") or f"data/{key}_cm.csv").strip()
        inch_rel = (r.get("csv_inch") or f"data/{key}_inch.csv").strip()
        cm_path = (root / cm_rel).resolve()
        inch_path = (root / inch_rel).resolve()

        if not cm_path.exists():
            print(f"SKIP (missing cm): {cm_rel}")
            n_skip += 1
            continue

        # Ensure output dir
        inch_path.parent.mkdir(parents=True, exist_ok=True)

        if typ in {"tops","hoodie"}:
            convert_tops(cm_path, inch_path)
            n_ok += 1
        elif typ == "shoes":
            convert_shoes(cm_path, inch_path)
            n_ok += 1
        else:
            # Unknown type: default to tops-style conversion
            convert_tops(cm_path, inch_path)
            n_ok += 1

    print(f"OK: inch CSV built for {n_ok} products (skipped {n_skip})")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
