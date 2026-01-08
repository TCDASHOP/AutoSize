#!/usr/bin/env python3
# Build data/manifest.json from data/products_master.csv
# Designed for GitHub Pages static hosting: JS reads manifest.json (no directory listing needed)

from __future__ import annotations
import csv
import json
from pathlib import Path
from datetime import datetime, timezone

DEFAULT_GUIDE_BY_TYPE = {
    "tops": "assets/guide_tshirt.jpg",
    "hoodie": "assets/guide_hoodie.jpg",
    "shoes": "assets/guide_slipon.jpg",
}

DEFAULT_NOTESET_BY_TYPE = {
    "tops": "tops",
    "hoodie": "hoodie",
    "shoes": "shoes",
}

def _non_empty(*vals: str) -> list[str]:
    out = []
    for v in vals:
        v = (v or "").strip()
        if v:
            out.append(v)
    return out

def main() -> int:
    root = Path(__file__).resolve().parents[1]  # AutoSize-main/
    data_dir = root / "data"
    src = data_dir / "products_master.csv"
    out = data_dir / "manifest.json"

    if not src.exists():
        raise SystemExit(f"products_master.csv not found: {src}")

    rows = []
    with src.open("r", encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        required = {"key","type"}
        if not required.issubset(set(reader.fieldnames or [])):
            raise SystemExit(f"products_master.csv must include columns: {sorted(required)}")

        for r in reader:
            enabled = (r.get("enabled","1") or "1").strip()
            if enabled in {"0","false","FALSE","no","NO"}:
                continue

            key = (r.get("key") or "").strip()
            typ = (r.get("type") or "").strip()
            if not key or not typ:
                continue

            sort_raw = (r.get("sort") or "").strip()
            try:
                sort = float(sort_raw) if sort_raw else 9999.0
            except ValueError:
                sort = 9999.0

            label_jp = _non_empty(r.get("label_jp_1",""), r.get("label_jp_2",""))
            label_en = _non_empty(r.get("label_en_1",""), r.get("label_en_2",""))

            guide_img = (r.get("guide_img") or "").strip() or DEFAULT_GUIDE_BY_TYPE.get(typ, "")
            csv_cm = (r.get("csv_cm") or "").strip() or f"data/{key}_cm.csv"
            csv_inch = (r.get("csv_inch") or "").strip() or f"data/{key}_inch.csv"
            note_set = (r.get("note_set") or "").strip() or DEFAULT_NOTESET_BY_TYPE.get(typ, typ)

            # Optional shoe map for future: not used by JS, but can be used by build scripts
            shoe_map = (r.get("shoes_map") or "").strip()

            rows.append({
                "_sort": sort,
                "key": key,
                "type": typ,
                "labelJP": label_jp if label_jp else [key],
                "labelEN": label_en if label_en else [key],
                "guideImg": guide_img,
                "csv": {"cm": csv_cm, "inch": csv_inch},
                "noteSet": note_set,
                # Keep optional metadata (harmless to JS)
                **({"shoesMap": shoe_map} if shoe_map else {}),
            })

    rows.sort(key=lambda x: x["_sort"])
    products = [{k:v for k,v in r.items() if k != "_sort"} for r in rows]

    payload = {
        "version": 1,
        "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "products": products,
    }

    out.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"OK: wrote {out} ({len(products)} products)")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
