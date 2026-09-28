#!/usr/bin/env python3
"""Subset the self-hosted webfonts to the characters the site actually uses.

Usage: python3 scripts/subset-fonts.py <dir-with-full-latin-woff2-files>

Inputs are the full Latin variable woff2 files for Inter, Playfair Display
(roman + italic) and JetBrains Mono. Writes src/fonts/*.woff2 and
src/fonts/glyphs.txt (the character set, checked by src/fonts/glyphs.test.ts).
Requires: pip install fonttools brotli
"""
import glob
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FONTS = {
    'inter-latin': 'Inter*.woff2',
    'playfair-latin': 'PlayfairDisplay-roman*.woff2',
    'playfair-italic-latin': 'PlayfairDisplay-italic*.woff2',
    'jetbrains-mono-latin': 'JetBrainsMono*.woff2',
}
# Punctuation the copy is likely to reach for, even if unused today.
EXTRA = ' ’‘“”—–…·•✓›↑→↔×'


def site_chars() -> str:
    chars = {chr(c) for c in range(0x20, 0x7F)} | set(EXTRA)
    for path in glob.glob(str(ROOT / 'src/**/*.ts*'), recursive=True):
        if '.test.' in path:
            continue
        chars |= {ch for ch in Path(path).read_text(encoding='utf-8') if ord(ch) > 0x7E and ch.isprintable()}
    return ''.join(sorted(chars))


def main(source_dir: str) -> None:
    glyphs = ROOT / 'src/fonts/glyphs.txt'
    glyphs.write_text(site_chars(), encoding='utf-8')
    for name, pattern in FONTS.items():
        [source] = glob.glob(str(Path(source_dir) / pattern))
        subprocess.run([
            'pyftsubset', source, f'--text-file={glyphs}', '--flavor=woff2',
            '--layout-features=kern,liga,calt,tnum,lnum', f'--output-file={ROOT / "src/fonts" / f"{name}.woff2"}',
        ], check=True)


if __name__ == '__main__':
    main(sys.argv[1])
