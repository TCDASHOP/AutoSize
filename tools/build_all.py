#!/usr/bin/env python3
# One-shot builder:
# - Generate *_inch.csv from *_cm.csv
# - Generate data/manifest.json from data/products_master.csv

from __future__ import annotations
import subprocess
import sys
from pathlib import Path

def run(cmd: list[str]) -> None:
    print(">>", " ".join(cmd))
    p = subprocess.run(cmd, cwd=Path(__file__).resolve().parent, capture_output=False)
    if p.returncode != 0:
        raise SystemExit(p.returncode)

def main() -> int:
    tools = Path(__file__).resolve().parent
    py = sys.executable or "python3"
    run([py, str(tools / "build_inch_from_cm.py")])
    run([py, str(tools / "build_manifest.py")])
    print("DONE")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
