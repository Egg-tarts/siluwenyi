from math import cos, pi, sin
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


OUT_DIR = Path(__file__).resolve().parent
WIDTH, HEIGHT = 1180, 780
BG = "#fffdf8"
INK = "#28313b"
MUTED = "#6d7782"
GRID = "#e7e1d8"
BLUE = "#1498e6"
YELLOW = "#f7c547"
TEAL = "#44c6c1"
ORANGE = "#ef7b45"
RED = "#d94d3f"
GREEN = "#5bb881"
PURPLE = "#8b73d9"
FONT = "C:/Windows/Fonts/msyh.ttc"
BOLD_FONT = "C:/Windows/Fonts/msyhbd.ttc"


def font(size, bold=False):
    return ImageFont.truetype(BOLD_FONT if bold else FONT, size)


def canvas():
    return Image.new("RGB", (WIDTH, HEIGHT), BG)


def title(draw, text, subtitle=None):
    draw.text((WIDTH // 2, 34), text, fill=INK, font=font(34, True), anchor="ma")
    if subtitle:
        draw.text((WIDTH // 2, 82), subtitle, fill=MUTED, font=font(22), anchor="ma")


def save(img, name):
    path = OUT_DIR / name
    img.save(path, quality=96)
    return path


def draw_label(draw, point, text, color, anchor):
    x, y = point
    draw.text((x, y), text, fill=color, font=font(21, True), anchor=anchor)


def pie_chart():
    img = canvas()
    draw = ImageDraw.Draw(img)
    title(
        draw,
        "您认为 1.0 版本的路线规划是否贴合真实出游需求？",
        "样本倾向：多数用户认为路线仍需更真实、更个性化",
    )

    data = [
        ("非常贴合", 8, GREEN),
        ("比较贴合", 22, BLUE),
        ("一般", 37, YELLOW),
        ("不太贴合", 25, TEAL),
        ("完全不贴合", 8, ORANGE),
    ]
    box = (120, 170, 700, 750)
    start = -90
    cx, cy, r = 410, 460, 290

    for label, value, color in data:
        end = start + value / 100 * 360
        draw.pieslice(box, start, end, fill=color)
        start = end

    draw.ellipse((cx - 82, cy - 82, cx + 82, cy + 82), fill=BG)
    draw.text((cx, cy - 14), "贴合度", fill=INK, font=font(25, True), anchor="mm")
    draw.text((cx, cy + 24), "1.0 评价", fill=MUTED, font=font(20), anchor="mm")

    legend_x, legend_y = 770, 205
    draw.text((legend_x, legend_y - 48), "评价分布", fill=INK, font=font(28, True), anchor="la")
    for idx, (label, value, color) in enumerate(data):
        y = legend_y + idx * 82
        draw.rounded_rectangle((legend_x, y, legend_x + 34, y + 34), radius=8, fill=color)
        draw.text((legend_x + 54, y + 2), label, fill=INK, font=font(23, True), anchor="la")
        draw.text((legend_x + 54, y + 34), f"{value}%", fill=color, font=font(25, True), anchor="la")
    draw.text((legend_x, 695), "结论：1.0 版本路线可用，\n但真实出游匹配度仍需升级。", fill=MUTED, font=font(21), anchor="la", spacing=8)
    return save(img, "01_route_fit_pie.png")


def vertical_bar_chart():
    img = canvas()
    draw = ImageDraw.Draw(img)
    title(
        draw,
        "您对 1.0 版本页面美观度的整体评价如何？",
        "结果显示：页面视觉与布局仍有较大升级空间",
    )
    labels = ["很满意", "满意", "一般", "不满意", "很不满意"]
    values = [10, 24, 38, 21, 7]
    colors = [GREEN, BLUE, YELLOW, ORANGE, RED]

    left, top, bottom = 130, 160, 650
    chart_w, chart_h = 900, bottom - top
    max_v = 45
    for tick in range(0, 46, 10):
        y = bottom - tick / max_v * chart_h
        draw.line((left, y, left + chart_w, y), fill=GRID, width=2)
        draw.text((left - 18, y), f"{tick}%", fill=MUTED, font=font(18), anchor="rm")

    bar_w = 112
    gap = 68
    x = left + 70
    for label, value, color in zip(labels, values, colors):
        h = value / max_v * chart_h
        y0 = bottom - h
        draw.rounded_rectangle((x, y0, x + bar_w, bottom), radius=18, fill=color)
        draw.text((x + bar_w / 2, y0 - 24), f"{value}%", fill=INK, font=font(22, True), anchor="mm")
        draw.text((x + bar_w / 2, bottom + 34), label, fill=INK, font=font(21, True), anchor="mm")
        x += bar_w + gap

    draw.line((left, bottom, left + chart_w, bottom), fill="#b7afa4", width=3)
    draw.text((WIDTH // 2, 718), "1.0 版本美观度评价分布", fill=MUTED, font=font(20), anchor="mm")
    return save(img, "02_visual_rating_bar.png")


def horizontal_bar_chart():
    img = canvas()
    draw = ImageDraw.Draw(img)
    title(
        draw,
        "1.0 版本中哪些问题最影响您的使用体验？",
        "多选题：用于定位后续迭代重点",
    )
    items = [
        ("路线规划不够贴合真实出游", 68, RED),
        ("页面层级与入口不够清晰", 57, ORANGE),
        ("互动功能较少，参与感不足", 52, PURPLE),
        ("安全服务与应急能力不足", 45, BLUE),
        ("城市/景点内容不够丰富", 39, TEAL),
    ]
    left, top = 420, 170
    bar_w, bar_h, gap = 620, 52, 44
    for idx, (label, value, color) in enumerate(items):
        y = top + idx * (bar_h + gap)
        draw.text((left - 30, y + bar_h / 2), label, fill=INK, font=font(24, True), anchor="rm")
        draw.rounded_rectangle((left, y, left + bar_w, y + bar_h), radius=18, fill="#eee8df")
        draw.rounded_rectangle((left, y, left + bar_w * value / 75, y + bar_h), radius=18, fill=color)
        draw.text((left + bar_w * value / 75 + 18, y + bar_h / 2), f"{value}%", fill=color, font=font(24, True), anchor="lm")

    draw.text((WIDTH // 2, 708), "占比越高，代表用户越希望该问题优先优化", fill=MUTED, font=font(20), anchor="mm")
    return save(img, "03_pain_points_horizontal_bar.png")


def line_score_chart():
    img = canvas()
    draw = ImageDraw.Draw(img)
    title(
        draw,
        "用户对 1.0 版本核心体验的平均评分",
        "5 分制，分数越高代表体验越好",
    )
    items = [
        ("路线规划", 2.6),
        ("页面美观", 2.8),
        ("交互体验", 2.4),
        ("内容丰富", 2.7),
        ("安全服务", 2.1),
    ]

    left, top, right, bottom = 130, 160, 1040, 620
    chart_h = bottom - top
    chart_w = right - left
    for tick in range(1, 6):
        y = bottom - (tick - 1) / 4 * chart_h
        draw.line((left, y, right, y), fill=GRID, width=2)
        draw.text((left - 20, y), f"{tick}", fill=MUTED, font=font(18), anchor="rm")
    draw.text((left - 72, (top + bottom) / 2), "评分", fill=MUTED, font=font(20), anchor="mm")

    points = []
    for idx, (label, value) in enumerate(items):
        x = left + idx * chart_w / (len(items) - 1)
        y = bottom - (value - 1) / 4 * chart_h
        points.append((x, y, label, value))

    draw.line([(p[0], p[1]) for p in points], fill=BLUE, width=6)
    for x, y, label, value in points:
        draw.ellipse((x - 12, y - 12, x + 12, y + 12), fill=BLUE)
        draw.text((x, y - 36), f"{value:.1f}分", fill=INK, font=font(21, True), anchor="mm")
        draw.text((x, bottom + 40), label, fill=INK, font=font(22, True), anchor="mm")

    draw.line((left, bottom, right, bottom), fill="#b7afa4", width=3)
    draw.text((WIDTH // 2, 710), "结论：1.0 版本整体可用，但交互体验与安全服务评分偏低，需优先迭代。", fill=MUTED, font=font(20), anchor="mm")
    return save(img, "04_core_scores_radar.png")


if __name__ == "__main__":
    paths = [pie_chart(), vertical_bar_chart(), horizontal_bar_chart(), line_score_chart()]
    for path in paths:
        print(path)
