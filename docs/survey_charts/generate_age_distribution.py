from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


OUT_DIR = Path(__file__).resolve().parent
WIDTH, HEIGHT = 1180, 720
BG = "#fffdf8"
INK = "#25313a"
MUTED = "#6d7782"
GRID = "#e4ded5"
BAR = "#2f8f88"
BAR_DARK = "#1f5f5c"
ACCENT = "#f3c86a"
FONT = "C:/Windows/Fonts/msyh.ttc"
BOLD_FONT = "C:/Windows/Fonts/msyhbd.ttc"


def font(size, bold=False):
    return ImageFont.truetype(BOLD_FONT if bold else FONT, size)


def draw_center(draw, xy, text, size, color=INK, bold=True):
    draw.text(xy, text, fill=color, font=font(size, bold), anchor="mm")


def generate():
    img = Image.new("RGB", (WIDTH, HEIGHT), BG)
    draw = ImageDraw.Draw(img)

    data = [
        ("18岁以下", 72),
        ("18-25岁", 248),
        ("26-35岁", 216),
        ("36-45岁", 156),
        ("46-60岁", 128),
        ("60岁以上", 80),
    ]
    total = sum(value for _, value in data)

    draw_center(draw, (WIDTH // 2, 50), "使用人群年龄段分布", 34)

    left, top, right, bottom = 120, 150, 1060, 585
    chart_w = right - left
    chart_h = bottom - top
    max_v = 30

    draw.line((left, bottom, right, bottom), fill="#9e958b", width=3)

    bar_w = 96
    gap = (chart_w - len(data) * bar_w) / (len(data) + 1)
    x = left + gap

    for index, (label, value) in enumerate(data):
        percent = value / total * 100
        h = percent / max_v * chart_h
        y = bottom - h
        color = BAR_DARK if index in (1, 2) else BAR
        draw.rounded_rectangle((x, y, x + bar_w, bottom), radius=18, fill=color)
        draw.rounded_rectangle((x, y, x + bar_w, y + 14), radius=8, fill=ACCENT)
        draw.text((x + bar_w / 2, y - 24), f"{percent:.1f}%", fill=INK, font=font(22, True), anchor="mm")
        draw.text((x + bar_w / 2, bottom + 34), label, fill=INK, font=font(21, True), anchor="mm")
        x += bar_w + gap

    out = OUT_DIR / "06_age_distribution_percent_final.png"
    img.save(out, quality=96)
    print(out)


if __name__ == "__main__":
    generate()
