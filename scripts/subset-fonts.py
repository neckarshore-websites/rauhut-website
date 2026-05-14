#!/usr/bin/env python3
"""
Subset Inter Variable for rauhut-website.

Re-run only when the source font changes. Output file is committed to git.

Usage:
    python3 -m venv /tmp/font-venv
    /tmp/font-venv/bin/pip install fonttools brotli
    /tmp/font-venv/bin/python scripts/subset-fonts.py

Strategy:
- Inter (Variable): limit `wght` axis to 400-700 (was 100-900),
  pin `opsz` to default 14 (removing axis variability for body sizes).
  Used weights per codebase grep: font-medium (500), font-semibold (600),
  plus default 400 and occasional font-bold (700).

The source font already has tight Latin coverage. No glyph subsetting
needed — only axis-range narrowing via `instantiateVariableFont`.

Note: static TTFs Inter-Regular.ttf + Inter-SemiBold.ttf are used by
src/app/opengraph-image.tsx (next/og) and are intentionally not touched.

Ported from neckarshore-website 2026-05-14 (T-D3 follow-up). Pattern is
also live on goldoni-website. Expected saving ~36 KiB (71→35 KiB).
"""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

FONTS_DIR = Path(__file__).resolve().parent.parent / "src" / "fonts"


def subset_inter() -> None:
    src = FONTS_DIR / "Inter-Variable.woff2"
    dst = FONTS_DIR / "Inter-Variable-subset.woff2"
    f = TTFont(src)
    instance = instantiateVariableFont(
        f,
        {"opsz": 14, "wght": (400, 700)},
        inplace=False,
        optimize=True,
    )
    instance.flavor = "woff2"
    instance.save(dst)
    src_size = src.stat().st_size
    dst_size = dst.stat().st_size
    print(
        f"Inter:  {src_size//1024} KiB -> {dst_size//1024} KiB  "
        f"({(1 - dst_size/src_size)*100:.0f}% reduction)"
    )


if __name__ == "__main__":
    subset_inter()
