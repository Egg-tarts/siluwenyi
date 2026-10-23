from math import cos, pi, sin
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


OUT_DIR = Path(__file__).resolve().parent
OUT_FILE = OUT_DIR / "07_audience_preference_radar.png"


def font(size, bold=False):
    candidates = [
        r"C:\Windows\Fonts\msyhbd.ttc" if bold else r"C:\Windows\Fonts\msyh.ttc",
        r"C:\Windows\Fonts\simhei.ttf",
        r"C:\Windows\Fonts\simsun.ttc",
    ]
    for item in candidates:
        try:
            return ImageFont.truetype(item, size)
        except OSError:
            continue
    return ImageFont.load_default()


def rgba(hex_color, alpha):
    hex_color = hex_color.lstrip("#")
    return (
        int(hex_color[0:2], 16),
        int(hex_color[2:4], 16),
        int(hex_color[4:6], 16),
        alpha,
    )


def text_center(draw, xy, text, fill, fnt):
    bbox = draw.textbbox((0, 0), text, font=fnt)
    w, h = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.text((xy[0] - w / 2, xy[1] - h / 2), text, fill=fill, font=fnt)


def main():
    width, height = 980, 720
    img = Image.new("RGBA", (width, height), "#fbfaf6")
    draw = ImageDraw.Draw(img)

    title_font = font(34, True)
    sub_font = font(17)
    label_font = font(18, True)
    tick_font = font(13)
    legend_font = font(19, True)

    title_color = "#2f302b"
    muted = "#8a8173"
    grid = "#ddd5c8"
    axis = "#c9bfaf"

    draw.text((50, 36), "不同客群出游偏好雷达图", fill=title_color, font=title_font)
    draw.text((52, 82), "以 1-5 分展示四类用户在 9 项旅行偏好上的差异", fill=muted, font=sub_font)

    categories = [
        "探险精神",
        "舒适度要求",
        "文化探索",
        "拍照打卡需求",
        "社交分享意愿",
        "预算敏感度",
        "行程节奏",
        "体验需求",
        "自然风光偏好",
    ]

    series = [
        ("年轻自由行客群", "#ff7b4f", [4.6, 2.4, 3.4, 4.7, 4.6, 4.2, 4.5, 3.6, 4.4]),
        ("家庭亲子客群", "#3b9d90", [1.8, 4.9, 3.0, 3.2, 2.8, 3.6, 2.4, 4.5, 3.8]),
        ("文化研学客群", "#9a5a20", [3.0, 3.2, 4.9, 3.0, 2.5, 2.8, 3.0, 3.0, 4.5]),
        ("中老年休闲客群", "#3f73b8", [1.5, 5.0, 2.6, 1.8, 1.7, 2.4, 1.8, 3.4, 3.2]),
    ]

    cx, cy = 382, 385
    radius = 218
    n = len(categories)
    angles = [(-pi / 2) + 2 * pi * i / n for i in range(n)]

    # Soft card background, kept tight to avoid the previous oversized empty gap.
    draw.rounded_rectangle((26, 22, 954, 690), radius=22, fill="#ffffff", outline="#eee5d8", width=2)
    draw.text((50, 36), "不同客群出游偏好雷达图", fill=title_color, font=title_font)
    draw.text((52, 82), "1-5 分，分值越高代表偏好越强", fill=muted, font=sub_font)

    # Radar grid.
    for level in range(1, 6):
        r = radius * level / 5
        points = [(cx + r * cos(a), cy + r * sin(a)) for a in angles]
        draw.line(points + [points[0]], fill=grid, width=1)
        text_center(draw, (cx + 8, cy - r), str(level), "#b0a697", tick_font)

    for a in angles:
        draw.line((cx, cy, cx + radius * cos(a), cy + radius * sin(a)), fill=axis, width=1)

    # Axis labels, with tuned offsets so the left and right sides feel balanced.
    for label, a in zip(categories, angles):
        lx = cx + (radius + 34) * cos(a)
        ly = cy + (radius + 30) * sin(a)
        bbox = draw.textbbox((0, 0), label, font=label_font)
        tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
        if cos(a) > 0.35:
            pos = (lx + 4, ly - th / 2)
        elif cos(a) < -0.35:
            pos = (lx - tw - 4, ly - th / 2)
        else:
            pos = (lx - tw / 2, ly - th / 2)
        if pos[0] + tw > 662:
            pos = (662 - tw, pos[1])
        draw.text(pos, label, fill="#4d4a43", font=label_font)

    # Draw translucent polygons.
    for name, color, values in series:
        pts = []
        for value, a in zip(values, angles):
            r = radius * value / 5
            pts.append((cx + r * cos(a), cy + r * sin(a)))
        overlay = Image.new("RGBA", img.size, (255, 255, 255, 0))
        od = ImageDraw.Draw(overlay)
        od.polygon(pts, fill=rgba(color, 44))
        od.line(pts + [pts[0]], fill=rgba(color, 245), width=4, joint="curve")
        for px, py in pts:
            od.ellipse((px - 5, py - 5, px + 5, py + 5), fill=rgba(color, 255), outline=(255, 255, 255, 255), width=2)
        img.alpha_composite(overlay)

    draw = ImageDraw.Draw(img)

    # Compact legend placed close to the radar, not at the far edge.
    lx, ly = 720, 238
    draw.rounded_rectangle((682, 192, 936, 382), radius=16, fill="#faf6ee", outline="#eadfce", width=1)
    draw.text((706, 210), "颜色说明", fill=title_color, font=font(22, True))
    for i, (name, color, _) in enumerate(series):
        y = ly + i * 38
        draw.rounded_rectangle((706, y + 4, 740, y + 20), radius=8, fill=rgba(color, 72), outline=rgba(color, 230), width=2)
        draw.text((754, y - 1), name, fill="#3e3b35", font=legend_font)

    img.convert("RGB").save(OUT_FILE, quality=96)
    print(OUT_FILE)


if __name__ == "__main__":
    main()
