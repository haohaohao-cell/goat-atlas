# -*- coding: utf-8 -*-
"""生成首页和六个章节的 OG 图（1200x630）。

不依赖第三方图片，纯排版；字体使用 Windows 自带 Georgia / 微软雅黑 / Consolas。
输出：public/og/home.png、public/og/era-<id>.png
"""

import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "og"
OUT.mkdir(parents=True, exist_ok=True)

W, H = 1200, 630
GOLD = (227, 189, 106)
GOLD_BRIGHT = (244, 213, 141)
TEXT = (242, 236, 224)
MUTED = (155, 147, 134)
MUTED_2 = (109, 102, 91)
BG = (9, 8, 6)

SERIF = "C:/Windows/Fonts/georgiab.ttf"
SERIF_REGULAR = "C:/Windows/Fonts/georgia.ttf"
SANS_CN = "C:/Windows/Fonts/msyh.ttc"
MONO = "C:/Windows/Fonts/consola.ttf"


def font(path, size):
    return ImageFont.truetype(path, size)


def base_canvas():
    image = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(image)

    # 垂直渐变
    for y in range(H):
        shade = 9 + int(8 * (y / H))
        draw.line([(0, y), (W, y)], fill=(shade, shade - 1, max(4, shade - 3)))

    # 金色光晕
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    gdraw.ellipse([640, -180, 1240, 420], fill=(227, 189, 106, 34))
    glow = glow.filter(ImageFilter.GaussianBlur(120))
    image = Image.alpha_composite(image.convert("RGBA"), glow).convert("RGB")

    draw = ImageDraw.Draw(image)

    # 网格与同心圆
    for x in range(0, W, 86):
        draw.line([(x, 0), (x, H)], fill=(24, 21, 16), width=1)
    for radius in (330, 250, 170):
        draw.ellipse(
            [900 - radius, 360 - radius, 900 + radius, 360 + radius],
            outline=(38, 32, 22),
            width=1,
        )

    # 大号 7
    seven = font(SERIF, 520)
    draw.text((900, 360), "7", font=seven, fill=(16, 14, 10), anchor="mm",
              stroke_width=2, stroke_fill=(46, 38, 25))

    # 边框
    draw.rectangle([28, 28, W - 29, H - 29], outline=(46, 38, 25), width=1)

    return image, draw


def top_label(draw, text):
    draw.text((72, 78), text, font=font(MONO, 18), fill=MUTED)


def bottom_line(draw, left, right):
    draw.line([(72, 540), (1128, 540)], fill=(46, 38, 25), width=1)
    draw.text((72, 558), left, font=font(MONO, 14), fill=MUTED_2)
    draw.text((1128, 558), right, font=font(MONO, 14), fill=MUTED_2, anchor="ra")


def fit_font(path, text, max_width, start, minimum=48):
    size = start
    while size > minimum:
        candidate = font(path, size)
        if candidate.getlength(text) <= max_width:
            return candidate
        size -= 4
    return font(path, minimum)


def home():
    image, draw = base_canvas()
    top_label(draw, "GOAT ATLAS  ·  UNOFFICIAL FAN ATLAS  ·  2003—2026")

    big = fit_font(SERIF, "CRISTIANO", 760, 108)
    draw.text((72, 150), "CRISTIANO", font=big, fill=TEXT)

    outline = fit_font(SERIF, "RONALDO", 760, 108)
    draw.text((72, 262), "RONALDO", font=outline, fill=BG,
              stroke_width=2, stroke_fill=(198, 166, 104))

    draw.text((76, 396), "C 罗职业生涯图鉴", font=font(SANS_CN, 34), fill=GOLD)

    draw.text(
        (76, 462),
        "86 MOMENTS  ·  6 CHAPTERS  ·  78 SOURCES  ·  985 GOALS",
        font=font(MONO, 16),
        fill=MUTED,
    )

    bottom_line(draw, "HAOHAOHAO-CELL.GITHUB.IO/GOAT-ATLAS", "EVERY MOMENT, SOURCED")
    image.save(OUT / "home.png", "PNG", optimize=True)


def era_card(era, moments_count):
    image, draw = base_canvas()
    top_label(draw, f"CHAPTER {era['index']}  ·  {era['range']}")

    label = era["label"].upper()
    big = fit_font(SERIF, label, 760, 104)
    draw.text((72, 140), label, font=big, fill=TEXT)

    draw.text((76, 282), era["name"], font=font(SANS_CN, 44), fill=GOLD_BRIGHT)

    draw.text(
        (76, 360),
        era["club"].upper(),
        font=font(MONO, 20),
        fill=MUTED,
    )
    draw.text(
        (76, 398),
        f"{moments_count} MOMENTS  ·  {era['range']}",
        font=font(MONO, 16),
        fill=MUTED_2,
    )

    draw.text((76, 470), "C 罗职业生涯图鉴", font=font(SANS_CN, 22), fill=MUTED)

    bottom_line(draw, "HAOHAOHAO-CELL.GITHUB.IO/GOAT-ATLAS", "GOAT ATLAS")
    image.save(OUT / f"era-{era['id']}.png", "PNG", optimize=True)


def main():
    player = json.loads((ROOT / "data/player.json").read_text(encoding="utf-8"))
    moments = json.loads((ROOT / "data/moments.json").read_text(encoding="utf-8"))
    counts = {}
    for moment in moments:
        counts[moment["era"]] = counts.get(moment["era"], 0) + 1

    home()
    for era in player["eras"]:
        era_card(era, counts.get(era["id"], 0))

    print("OG images written:", 1 + len(player["eras"]))


if __name__ == "__main__":
    main()
