from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
ICONS = PUBLIC / "icons"
ICONS.mkdir(parents=True, exist_ok=True)

BG = "#0b0a08"
GOLD = "#e3bd6a"
CREAM = "#f2ece0"
MUTED = "#8f8779"

GEORGIA_BOLD = "C:/Windows/Fonts/georgiab.ttf"
GEORGIA = "C:/Windows/Fonts/georgia.ttf"
CJK_BOLD = "C:/Windows/Fonts/msyhbd.ttc"
CJK = "C:/Windows/Fonts/msyh.ttc"


def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size)


def draw_icon(size: int, maskable: bool = False) -> Image.Image:
    image = Image.new("RGB", (size, size), BG)
    draw = ImageDraw.Draw(image)
    center = size / 2
    radius = size * (0.34 if maskable else 0.40)

    for ratio, color in [(1.0, "#3a2f1c"), (0.84, "#211b12")]:
        r = radius * ratio
        draw.ellipse(
            (center - r, center - r, center + r, center + r),
            outline=color,
            width=max(1, size // 180),
        )

    seven = font(GEORGIA_BOLD, int(size * 0.58))
    bbox = draw.textbbox((0, 0), "7", font=seven)
    x = center - (bbox[2] - bbox[0]) / 2 - bbox[0]
    y = center - (bbox[3] - bbox[1]) / 2 - bbox[1]
    draw.text((x, y), "7", font=seven, fill=GOLD)

    if size >= 512:
        label = font(GEORGIA, int(size * 0.035))
        text = "GOAT ATLAS"
        bbox = draw.textbbox((0, 0), text, font=label)
        draw.text(
            (center - (bbox[2] - bbox[0]) / 2, size * 0.83),
            text,
            font=label,
            fill=MUTED,
        )

    return image


for size in (192, 512):
    draw_icon(size).save(ICONS / f"icon-{size}.png", optimize=True)

draw_icon(512, maskable=True).save(ICONS / "icon-maskable-512.png", optimize=True)
draw_icon(180).save(ICONS / "apple-touch-icon.png", optimize=True)

# Open Graph card
og = Image.new("RGB", (1200, 630), BG)
draw = ImageDraw.Draw(og)
draw.rectangle((36, 36, 1164, 594), outline="#3b3020", width=1)

# Background rings on the right.
for r, color in [(250, "#2a2115"), (195, "#352916"), (145, "#43331a")]:
    draw.ellipse((930 - r, 312 - r, 930 + r, 312 + r), outline=color, width=1)

seven = font(GEORGIA_BOLD, 480)
draw.text(
    (930, 312),
    "7",
    font=seven,
    fill=BG,
    stroke_width=2,
    stroke_fill=GOLD,
    anchor="mm",
)

label = font(GEORGIA_BOLD, 18)
draw.text((72, 66), "GOAT ATLAS", font=label, fill=GOLD)
draw.text((1126, 66), "EST. 2003", font=font(GEORGIA, 16), fill=MUTED, anchor="ra")

draw.text((72, 156), "THE CAREER OF", font=font(GEORGIA, 22), fill=GOLD)
draw.text((68, 190), "CRISTIANO", font=font(GEORGIA_BOLD, 108), fill=CREAM)
draw.text(
    (68, 296),
    "RONALDO",
    font=font(GEORGIA_BOLD, 108),
    fill=BG,
    stroke_width=2,
    stroke_fill=GOLD,
)

draw.text(
    (76, 438),
    "C 罗职业生涯图鉴",
    font=font(CJK_BOLD, 34),
    fill=GOLD,
)
draw.text(
    (76, 486),
    "26 个名场面 · 6 个章节 · 每一条都有出处",
    font=font(CJK, 18),
    fill=MUTED,
)

draw.line((72, 536, 690, 536), fill="#3b3020", width=1)
draw.text((72, 556), "26 MOMENTS", font=font(GEORGIA, 14), fill=MUTED)
draw.text((250, 556), "6 CHAPTERS", font=font(GEORGIA, 14), fill=MUTED)
draw.text((410, 556), "ONE CAREER", font=font(GEORGIA, 14), fill=GOLD)
draw.text(
    (930, 574),
    "MADEIRA  /  LISBON  /  MANCHESTER  /  MADRID  /  TURIN  /  RIYADH",
    font=font(GEORGIA, 9),
    fill="#5f574b",
    anchor="mm",
)

og.save(PUBLIC / "og.png", optimize=True)
print("Generated OG image and PWA icons.")
