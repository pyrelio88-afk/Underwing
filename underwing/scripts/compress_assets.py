#!/usr/bin/env python3
"""Lightweight WebP asset pipeline for Underwing.

Extracts verified infographics & 99 disease hub illustrations from the master archive,
harmonizes legacy line-art card illustrations onto warm #F6F2EA paper tone,
compresses everything to crisp WebP under canonical <root>/assets/art/{cards,disease}/,
verifies every generated image, and cleans up legacy bloated PNG/base64 artifacts.
"""
import base64
import io
import json
import pathlib
import re
import zipfile
from PIL import Image

HERE = pathlib.Path(__file__).resolve().parent
UNDERWING_DIR = HERE.parent
ROOT = UNDERWING_DIR.parent
DEFAULT_ZIP = pathlib.Path(r"G:\我的云端硬盘\实验室安全\最终成品\Underwing 完整包.zip")

CARDS_OUT = ROOT / "assets" / "art" / "cards"
DISEASE_OUT = ROOT / "assets" / "art" / "disease"

INFOGRAPHIC_MAP = {
    "bp": "underwing-project/work/chatgpt/infographic_bp.png",
    "fall": "underwing-project/work/chatgpt/info_fall.png",
    "hypo": "underwing-project/work/chatgpt/info_hypo.png",
    "breathing": "underwing-project/work/chatgpt/info_breathing.png",
    "dementia": "underwing-project/work/chatgpt/info_dementia.png",
    "transfer": "underwing-project/work/chatgpt/info_transfer.png",
}

REMAINING_KEYS = [
    "glucose",
    "followup",
    "meds",
    "symptom",
    "inhaler",
    "weight",
    "wound",
    "eyedrops",
    "insulin_pen",
    "mascot",
]

ALL_CARD_KEYS = list(INFOGRAPHIC_MAP.keys()) + REMAINING_KEYS

# Warm paper tone #F6F2EA = RGB(246, 242, 234)
PAPER_RGB = (246, 242, 234)


def harmonize_white_to_paper(img: Image.Image, paper_rgb=PAPER_RGB) -> Image.Image:
    """Gently harmonize pure-white/near-white backgrounds toward warm #F6F2EA paper tone.

    Uses a smooth per-channel paper-multiply curve that clamps minor generator background
    noise (252..255 -> 255) before multiplying onto #F6F2EA paper, preserving dark strokes
    and anti-aliased edges without halos.
    """
    rgb = img.convert("RGB")
    lut = []
    for target_c in paper_rgb:
        for x in range(256):
            lifted = 255.0 if x >= 252 else (x * 255.0 / 252.0)
            lut.append(int(round(lifted * target_c / 255.0)))
    return rgb.point(lut)


def load_remaining_source(key: str, zf: zipfile.ZipFile) -> Image.Image:
    """Load remaining card art from local line PNG, zip line PNG, or art.json fallback."""
    local_line = UNDERWING_DIR / "art" / "line" / f"l_{key}.png"
    if local_line.exists():
        return Image.open(local_line).convert("RGB")

    zip_line = f"underwing-project/underwing/art/line/l_{key}.png"
    if zip_line in zf.namelist():
        return Image.open(io.BytesIO(zf.read(zip_line))).convert("RGB")

    local_aj = UNDERWING_DIR / "art" / "art.json"
    if local_aj.exists():
        aj = json.loads(local_aj.read_text(encoding="utf-8"))
    else:
        aj = json.loads(zf.read("underwing-project/underwing/art/art.json").decode("utf-8"))
    uri = aj[key]
    raw = base64.b64decode(uri.split(",", 1)[1] if "," in uri else uri)
    return Image.open(io.BytesIO(raw)).convert("RGB")


def save_webp(img: Image.Image, size: tuple[int, int], out_path: pathlib.Path, quality: int) -> int:
    resized = img.convert("RGB").resize(size, Image.Resampling.LANCZOS)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    resized.save(out_path, format="WEBP", quality=quality, method=6)
    return out_path.stat().st_size


def verify_webp(path: pathlib.Path, expected_size: tuple[int, int]) -> None:
    if not path.exists() or path.stat().st_size == 0:
        raise RuntimeError(f"Missing or empty WebP: {path}")
    with Image.open(path) as im:
        im.load()
        if im.format != "WEBP" or im.size != expected_size:
            raise RuntimeError(f"Invalid WebP {path}: format={im.format}, size={im.size}, expected={expected_size}")


def main() -> None:
    if not DEFAULT_ZIP.exists():
        raise FileNotFoundError(f"Master zip not found: {DEFAULT_ZIP}")

    CARDS_OUT.mkdir(parents=True, exist_ok=True)
    DISEASE_OUT.mkdir(parents=True, exist_ok=True)

    card_bytes = 0
    disease_bytes = 0

    with zipfile.ZipFile(DEFAULT_ZIP, "r") as zf:
        # 1. Extract 6 verified infographics -> 640x640 WebP q74 method=6
        for key, member in INFOGRAPHIC_MAP.items():
            assert "info_transfer_v1.png" not in member
            img = Image.open(io.BytesIO(zf.read(member))).convert("RGB")
            out_path = CARDS_OUT / f"{key}.webp"
            sz = save_webp(img, (640, 640), out_path, quality=74)
            verify_webp(out_path, (640, 640))
            card_bytes += sz

        # 2. Convert remaining 10 card art keys (harmonized to #F6F2EA) -> 640x640 (256x256 mascot), q74
        for key in REMAINING_KEYS:
            src_img = load_remaining_source(key, zf)
            harm_img = harmonize_white_to_paper(src_img, PAPER_RGB)
            dim = (256, 256) if key == "mascot" else (640, 640)
            out_path = CARDS_OUT / f"{key}.webp"
            sz = save_webp(harm_img, dim, out_path, quality=74)
            verify_webp(out_path, dim)
            card_bytes += sz

        # Verify all 16 card keys exist
        for key in ALL_CARD_KEYS:
            dim = (256, 256) if key == "mascot" else (640, 640)
            verify_webp(CARDS_OUT / f"{key}.webp", dim)

        # 3. Extract all 99 disease hub PNGs (01_heart.png..99_cleft.png, skip 04_diabetes_alt.png)
        disease_re = re.compile(r"^underwing-project/work/chatgpt/disease/(\d{2}_[a-z0-9_]+)\.png$")
        disease_members = []
        for name in sorted(zf.namelist()):
            if name.endswith("04_diabetes_alt.png"):
                continue
            m = disease_re.match(name)
            if m:
                disease_members.append((m.group(1), name))

        if len(disease_members) != 99:
            raise RuntimeError(f"Expected 99 disease PNGs, found {len(disease_members)}")

        for slug, member in disease_members:
            img = Image.open(io.BytesIO(zf.read(member))).convert("RGB")
            out_path = DISEASE_OUT / f"{slug}.webp"
            sz = save_webp(img, (512, 512), out_path, quality=68)
            verify_webp(out_path, (512, 512))
            disease_bytes += sz

    # 4. Remove legacy bloated files after all 16 + 99 WebPs are verified
    removed = 0
    line_dir = UNDERWING_DIR / "art" / "line"
    if line_dir.exists():
        for p in line_dir.glob("*.png"):
            p.unlink()
            removed += 1
        if not any(line_dir.iterdir()):
            line_dir.rmdir()

    art_json = UNDERWING_DIR / "art" / "art.json"
    if art_json.exists():
        art_json.unlink()
        removed += 1

    art_dir = UNDERWING_DIR / "art"
    if art_dir.exists() and not any(art_dir.iterdir()):
        art_dir.rmdir()

    for p in UNDERWING_DIR.glob("screenshot-*.png"):
        p.unlink()
        removed += 1

    print(f"Cards WebP   : {len(ALL_CARD_KEYS)} files, {card_bytes / 1024:.1f} KB ({card_bytes:,} bytes)")
    print(f"Disease WebP : 99 files, {disease_bytes / 1024:.1f} KB ({disease_bytes:,} bytes, avg {disease_bytes / 99 / 1024:.1f} KB)")
    print(f"Total WebP   : {(card_bytes + disease_bytes) / (1024 * 1024):.2f} MB ({card_bytes + disease_bytes:,} bytes)")
    print(f"Output dir   : {ROOT / 'assets' / 'art'}")
    print(f"Legacy files removed: {removed}")


if __name__ == "__main__":
    main()
