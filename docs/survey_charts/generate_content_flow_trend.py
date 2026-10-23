from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


OUT_DIR = Path(__file__).resolve().parent
WIDTH, HEIGHT = 1180, 660
BG = "#fffdf8"
INK = "#153038"
MUTED = "#66757a"
GRID = "#dfe5e3"
BASE = "#4e9b9a"
AI = "#f3c86a"
PERSONAL = "#084a55"
ACCENT = "#d5aa62"
FONT = "C:/Windows/Fonts/msyh.ttc"
BOLD_FONT = "C:/Windows/Fonts/msyhbd.ttc"


def font(size, bold=False):
    return ImageFont.truetype(BOLD_FONT if bold else FONT, size)


def draw_center_text(draw, xy, text, size, color=INK, bold=True):
    draw.text(xy, text, fill=color, font=font(size, bold), anchor="mm")


def draw_vertical_text(draw, xy, text, size, color=INK, bold=True, gap=34):
    x, y = xy
    start_y = y - (len(text) - 1) * gap / 2
    for index, char in enumerate(text):
        draw.text((x, start_y + index * gap), char, fill=color, font=font(size, bold), anchor="mm")


def rounded_card(draw, box, outline=ACCENT, fill="#fffdfa"):
    draw.rounded_rectangle(box, radius=22, fill=fill, outline=outline, width=3)
    x1, y1, x2, y2 = box
    draw.rounded_rectangle((x1 + 8, y1 + 8, x2 - 8, y2 - 8), radius=18, outline="#ead9ba", width=2)


def generate():
    img = Image.new("RGB", (WIDTH, HEIGHT), BG)
    draw = ImageDraw.Draw(img)

    draw_center_text(draw, (WIDTH // 2, 42), "2020-2026 主流文旅 APP 内容流量结构变迁", 33)
    draw.line((240, 82, 480, 82), fill="#8ca0a2", width=2)
    draw.line((700, 82, 940, 82), fill="#8ca0a2", width=2)
    draw_center_text(draw, (WIDTH // 2, 82), "越接近 2026，AI 与个性化服务占比越高", 21, MUTED, False)

    legend = [
        ("实地基础内容", BASE),
        ("AI智能规划功能", AI),
        ("个性化定制服务", PERSONAL),
    ]
    lx = 250
    for label, color in legend:
        draw.rounded_rectangle((lx, 112, lx + 30, 142), radius=6, fill=color)
        draw.text((lx + 40, 127), label, fill=INK, font=font(20, True), anchor="lm")
        lx += 235

    years = [2020, 2022, 2024, 2026]
    values = {
        "实地基础内容": [90, 72, 53, 36],
        "AI智能规划功能": [5, 16, 27, 38],
        "个性化定制服务": [5, 12, 20, 26],
    }
    colors = [BASE, AI, PERSONAL]

    left, top, right, bottom = 150, 175, 1035, 535
    chart_h = bottom - top
    max_v = 100

    for tick in range(0, 101, 20):
        y = bottom - tick / max_v * chart_h
        draw.line((left, y, right, y), fill=GRID, width=2)
        draw.text((left - 16, y), f"{tick}%", fill=MUTED, font=font(17), anchor="rm")

    draw.line((left, top, left, bottom), fill="#52686b", width=3)
    draw.line((left, bottom, right, bottom), fill="#52686b", width=3)
    draw_vertical_text(draw, (64, 355), "内容流量占比", 28)

    group_w = 150
    bar_w = 34
    gap = 14
    group_gap = 64
    x0 = left + 62
    series = list(values.keys())

    for i, year in enumerate(years):
        gx = x0 + i * (group_w + group_gap)
        for j, name in enumerate(series):
            value = values[name][i]
            x = gx + j * (bar_w + gap)
            h = value / max_v * chart_h
            y = bottom - h
            draw.rounded_rectangle((x, y, x + bar_w, bottom), radius=6, fill=colors[j])
            draw.text((x + bar_w / 2, y - 17), f"{value}%", fill=INK, font=font(17, True), anchor="mm")
        draw.text((gx + 54, bottom + 30), str(year), fill=INK, font=font(20, True), anchor="mm")

    draw.text((WIDTH // 2, 612), "2026 年：AI智能规划功能 38%，个性化定制服务 26%，合计 64%。", fill=MUTED, font=font(18), anchor="mm")

    out = OUT_DIR / "05_content_flow_trend_2020_2026.png"
    img.save(out, quality=96)
    print(out)


if __name__ == "__main__":
    generate()
