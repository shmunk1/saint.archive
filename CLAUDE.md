# 1300SAINT — fan site (saint.archive)

Fan site non officiel de 1300SAINT. HTML / CSS / JS pur, sans build. En ligne : https://shmunk1.github.io/saint.archive/ (GitHub Pages). Réponds en français.

## Où sont les choses
- **Tout le contenu est dans `data.js`** (objet `DATA`) : `releases`, `soundcloud` (exclus SoundCloud), `features`, `clips` (id YouTube dans `yt`). Ajouter un son = ajouter un appel `item(...)` dans la bonne liste.
- Pochettes : `img/cover-<released|soundcloud|featuring>/`, miniatures en `.jpg` dans `img/t/cover-<dossier>/`, grandes versions dans `img/hd/` (listées dans `HD` de `data.js`).
- Pages : `index.html`, `discographie.html`, `clips.html`, `tierlist.html`, `release.html` et `year.html` (modèles). Effets : `fx.js`, styles : `style.css`.
- `release/*.html`, `year/*.html`, `img/og/`, `sitemap.xml` et `robots.txt` sont **générés** : ne pas les modifier à la main.

## Après chaque modif de `data.js`
`python tools/build_share.py` (il faut Python + Pillow + Node). Ça régénère les pages de partage, les images d'aperçu et le sitemap.

## Règles
- Ne jamais inventer d'info (date, featuring, id YouTube). Pas de paroles.
- Nouvelle pochette : ajouter aussi sa miniature dans `img/t/`.

## Cache-busting
`style.css`, `data.js`, `fx.js` sont chargés avec `?v=AAAAMMJJ` dans toutes les pages (les modèles `release.html`/`year.html` servent aux pages générées). Bumper : `sed -i 's/?v=20261128/?v=NOUVELLE/g' *.html` puis `python tools/build_share.py`. Polices auto-hébergées dans `fonts/` (woff2 latin, `@font-face` en fin de `style.css`).
