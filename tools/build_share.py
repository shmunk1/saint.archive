"""Génère les pages de partage: une page par son (release/<id>.html), une par année (year/<année>.html),
leur image d'aperçu 1200x630 (img/og/), le sitemap et robots.txt.

À relancer après chaque changement de data.js:   python tools/build_share.py
(il faut Python + Pillow + Node; release.html / year.html restent les modèles de page)
"""
import html, json, os, re, subprocess
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
SITE = "https://shmunk1.github.io/saint.archive/"
FONT = "tools/unifraktur.ttf"
MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
LABEL = {"releases": None, "soundcloud": "SoundCloud Exclusive", "features": "Feature"}

data = json.loads(subprocess.check_output(["node", "-e", "global.window={};eval(require('fs').readFileSync('data.js','utf8')+';global.D=DATA');"
                                           "console.log(JSON.stringify(['releases','soundcloud','features'].flatMap(k=>D[k].map(x=>({...x,kind:k})))))"], encoding="utf-8"))
esc = html.escape


def fmt(d):
    p = (d or "").split("-")
    return " ".join(x for x in [str(int(p[2])) if len(p) > 2 else "", MONTHS[int(p[1]) - 1] if len(p) > 1 else "", p[0]] if x)


def kind_of(x):
    return x.get("type") or "Single" if x["kind"] == "releases" else LABEL[x["kind"]]


def font(n):
    return ImageFont.truetype(FONT, n)


def canvas():
    g = Image.new("RGB", (1200, 630), (0, 0, 0))
    ImageDraw.Draw(g).ellipse((-200, 40, 700, 700), fill=(58, 6, 10))
    bg = Image.blend(Image.new("RGB", (1200, 630), (5, 5, 5)), g.filter(ImageFilter.GaussianBlur(140)), .9)
    return bg, ImageDraw.Draw(bg)


def cover_img(x, size):
    return Image.open(urlpath(x["cover"])).convert("RGB").resize((size, size), Image.LANCZOS)


def urlpath(u):
    from urllib.parse import unquote
    return unquote(u)


def wrap(d, text, f, width):
    lines, cur = [], ""
    for w in text.split():
        t = (cur + " " + w).strip()
        if d.textlength(t, font=f) <= width or not cur:
            cur = t
        else:
            lines.append(cur); cur = w
    return lines + [cur]


def footer(d):
    f = font(30); t = "1300SAINT · unofficial fan archive"
    d.text((1200 - 60 - d.textlength(t, font=f), 560), t, font=f, fill=(155, 15, 22))


def release_image(x, out):
    bg, d = canvas()
    if x.get("cover"):
        c = cover_img(x, 480); bg.paste(c, (70, 75)); d.rectangle((69, 74, 551, 556), outline=(70, 70, 64), width=2)
    X, W = 620, 520
    d.text((X, 80), f"{kind_of(x)} · {(x.get('date') or '')[:4]}".upper().strip(" ·"), font=font(36), fill=(155, 15, 22))
    size = 96
    while size > 44:
        f = font(size); lines = wrap(d, x["title"], f, W)
        if len(lines) * size * 1.05 <= 300 and all(d.textlength(l, font=f) <= W for l in lines):
            break
        size -= 6
    y = 140
    for l in lines[:3]:
        d.text((X, y), l, font=f, fill=(232, 230, 216)); y += size * 1.05
    by = x.get("artist") or "1300SAINT"
    if x.get("with"):
        by += " ft. " + ", ".join(x["with"])
    for l in wrap(d, by, font(40), W)[:2]:
        d.text((X, y + 14), l, font=font(40), fill=(170, 168, 156)); y += 46
    if x.get("date"):
        d.text((X, 470), fmt(x["date"]), font=font(36), fill=(122, 122, 112))
    footer(d)
    bg.save(out, quality=72, optimize=True, progressive=True)


def year_image(y, items, out):
    bg, d = canvas()
    d.text((70, 90), "THE GRAVEYARD", font=font(36), fill=(155, 15, 22))
    d.text((60, 140), str(y), font=font(250), fill=(232, 230, 216))
    d.text((70, 440), f"{len(items)} songs", font=font(56), fill=(170, 168, 156))
    top = sorted([i for i in items if i.get("cover")], key=lambda i: i.get("type") not in ("Album", "EP"))[:6]
    for n, it in enumerate(top):
        bg.paste(cover_img(it, 170), (650 + (n % 3) * 180, 120 + (n // 3) * 180))
    footer(d)
    bg.save(out, quality=72, optimize=True, progressive=True)


def page(template, title, desc, url, image):
    h = open(template, encoding="utf-8").read()
    h = re.sub(r'<title>.*?</title>', f"<title>{esc(title)}</title>", h, 1)
    h = re.sub(r'<meta name="description"[^>]*>\n?|<link rel="canonical"[^>]*>\n?|<meta property="og:[^>]*>\n?|<meta name="twitter:card"[^>]*>\n?', "", h)
    tags = [f'<base href="../">', f'<link rel="canonical" href="{url}">', f'<meta name="description" content="{esc(desc)}">',
            '<meta property="og:type" content="website">', '<meta property="og:site_name" content="1300SAINT — Unofficial Fan Site">',
            f'<meta property="og:title" content="{esc(title)}">', f'<meta property="og:description" content="{esc(desc)}">',
            f'<meta property="og:url" content="{url}">', f'<meta property="og:image" content="{SITE}{image}">',
            '<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">', '<meta name="twitter:card" content="summary_large_image">']
    return h.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n' + "\n".join(tags), 1)


os.makedirs("release", exist_ok=True); os.makedirs("year", exist_ok=True); os.makedirs("img/og", exist_ok=True)
for x in data:
    k = kind_of(x); by = x.get("artist") or "1300SAINT"; ft = f" ft. {', '.join(x['with'])}" if x.get("with") else ""
    bits = [f"{k} by {by}"] + ([f"released {fmt(x['date'])}"] if x.get("date") else []) + ([f"{x['tracks']} tracks"] if (x.get("tracks") or 1) > 1 else []) + ([x["length"]] if x.get("length") else [])
    desc = f"{x['title']}{ft} — {', '.join(bits)}. Cover, tracklist and preview, on the unofficial 1300SAINT fan archive."
    img = f"img/og/{x['id']}.jpg"
    release_image(x, img)
    h = page("release.html", f"{x['title']} — 1300SAINT", desc, f"{SITE}release/{x['id']}.html", img)
    h = h.replace("</head>", f'<script>window.PAGE_ID={json.dumps(x["id"])}</script>\n</head>', 1)
    open(f"release/{x['id']}.html", "w", encoding="utf-8").write(h)

years = sorted({int(x["date"][:4]) for x in data if x.get("date")})
for y in years:
    its = [x for x in data if (x.get("date") or "")[:4] == str(y)]
    img = f"img/og/year-{y}.jpg"
    year_image(y, its, img)
    desc = f"All {len(its)} songs 1300SAINT put out in {y}: releases, SoundCloud exclusives and features."
    h = page("year.html", f"{y} — 1300SAINT", desc, f"{SITE}year/{y}.html", img)
    h = h.replace("</head>", f'<script>window.PAGE_ID={y}</script>\n</head>', 1)
    open(f"year/{y}.html", "w", encoding="utf-8").write(h)

urls = [SITE, SITE + "discographie.html", SITE + "clips.html"] + [f"{SITE}year/{y}.html" for y in years] + [f"{SITE}release/{x['id']}.html" for x in data]
open("sitemap.xml", "w", encoding="utf-8").write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + "\n".join(f"<url><loc>{u}</loc></url>" for u in urls) + "\n</urlset>\n")
open("robots.txt", "w").write(f"User-agent: *\nAllow: /\nSitemap: {SITE}sitemap.xml\n")
print(len(data), "sons,", len(years), "années,", len(urls), "urls dans le sitemap")
