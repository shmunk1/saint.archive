const $ = (s) => document.querySelector(s);
const a = DATA.artist;
const btn = (href, label) => `<a class="rune" href="${href}" target="_blank" rel="noopener">${label}</a>`;
// Le :hover du navigateur ne se met pas à jour quand la page (ou le carrousel) bouge sous une souris immobile.
// On retient la dernière position du pointeur et on recalcule nous-mêmes la carte (.lit) et le lien/bouton (.hot) qui sont dessous.
// Le CSS n'utilise donc plus :hover (qui reste collé à l'ancien élément tant que la souris ne bouge pas).
const plainLinkAt = (x, y) => document.elementFromPoint(x, y)?.closest?.("a,button") ?? null;
let ptr = null, lit = null, hot = null, linkAt = plainLinkAt, onHot = () => {}; // linkAt: remplacé par le curseur croix (hitbox élargie)
// à chaque survol l'élément bouge un peu différemment (inclinaison, hauteur, décalage au hasard)
const tilt = (el) => {
  const R = (a, b) => a + Math.random() * (b - a), sign = Math.random() < .5 ? -1 : 1;
  el.style.setProperty("--lr", sign * R(.4, 1.5) + "deg");
  el.style.setProperty("--ly", -R(4, 10) + "px");
  el.style.setProperty("--lx", R(-4, 4) + "px");
};
let scrolling = false, scrollTimer = 0, queued = false;
const syncHover = () => {
  if (!ptr || scrolling) return; // pendant un défilement on ne calcule rien (voir plus bas)
  const el = document.elementFromPoint(ptr.x, ptr.y)?.closest?.(".stone") ?? null;
  if (el !== lit) {
    lit?.classList.remove("lit"); lit = el;
    if (el) { tilt(el); el.classList.add("lit"); }
  }
  const l = linkAt(ptr.x, ptr.y);
  if (l !== hot) { hot?.classList.remove("hot"); l?.classList.add("hot"); hot = l; if (l && "tilt" in l.dataset) tilt(l); onHot(l); }
};
// au plus un calcul par image, et aucun pendant un défilement: les effets de survol (filtres sur de grandes images, ombres, contours)
// qui se déclenchaient sur chaque carte qui passait sous la souris faisaient ramer. On les coupe, puis on recalcule 140 ms après l'arrêt.
const scheduleSync = () => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; syncHover(); }); } };
addEventListener("pointermove", (e) => { if (e.pointerType !== "touch") { ptr = { x: e.clientX, y: e.clientY }; scheduleSync(); } });
addEventListener("scroll", () => {
  if (!scrolling) {
    scrolling = true; document.documentElement.classList.add("scrolling");
    lit?.classList.remove("lit"); hot?.classList.remove("hot"); lit = hot = null; onHot(null);
  }
  clearTimeout(scrollTimer);
  scrollTimer = setTimeout(() => { scrolling = false; document.documentElement.classList.remove("scrolling"); syncHover(); }, 140);
}, { passive: true });
document.documentElement.addEventListener("pointerleave", () => { ptr = null; lit?.classList.remove("lit"); hot?.classList.remove("hot"); lit = hot = null; });
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const fmtDate = (dt) => { const [y, m, dd] = (dt || "").split("-"); return [dd && +dd, m && MONTHS[+m - 1], y].filter(Boolean).join(" "); };
// carte "pierre" (discography + suggestions): pochette + titre + nb de tracks = lien vers la page du projet; boutons externes optionnels
const card = (it, links = []) => `<article class="stone c"><a class="cardlink" href="release.html?r=${it.id}">${it.cover ? `<img src="${it.cover}" alt="${it.title} cover" width="300" height="300" loading="lazy" decoding="async">` : '<div class="ph sq">&#10013;</div>'}
  <h3>${it.title}</h3><small>${[it.tracks && `${it.tracks} track${it.tracks > 1 ? "s" : ""}`, fmtDate(it.date)].filter(Boolean).join(" · ") || "&nbsp;"}</small></a>
  ${links.length ? `<div class="btns">${links.map(([k, l]) => btn(it[k], l)).join("")}</div>` : ""}</article>`;
const stagger = (el) => [...el.children].forEach((c, i) => c.style.setProperty("--i", Math.min(i, 14))); // apparition en cascade (voir .stone.c en CSS)
const rails = new Map(); // .grid -> refresh() du carrousel (voir plus bas)
const stone = (inner) => `<article class="stone">${inner}</article>`;

// ---- header: liens vers les plateformes (à droite) ----
$(".ext").innerHTML = [["Spotify", a.links.spotify], ["SoundCloud", a.links.soundcloud], ["YouTube", a.links.youtube], ["Instagram", a.links.instagram]]
  .map(([l, u]) => `<a href="${u}" target="_blank" rel="noopener">${l}</a>`).join("");

// ---- per-page rendering (data-page on <body>) ----
const pages = {
  home() {
    $("#facts").innerHTML = [["Real name", a.real], ["Born", a.born], ["From", a.from], ["Label", a.label], ["Style", a.style]]
      .map(([k, v]) => `<div>${k}<b>${v}</b></div>`).join("");
    $("#bio").innerHTML = a.bio.map((p) => `<p>${p}</p>`).join("");
    $("#links").innerHTML = btn(a.links.spotify, "Spotify") + btn(a.links.soundcloud, "SoundCloud") + btn(a.links.youtube, "YouTube") + btn(a.links.instagram, "Instagram");

    // tout ce qui suit est calculé depuis data.js: ça se met à jour tout seul quand on ajoute un son
    const all = [...DATA.releases, ...DATA.soundcloud, ...DATA.features], yearOf = (x) => +(x.date || "0").slice(0, 4);
    const years = all.map(yearOf).filter(Boolean), isProject = (r) => r.type === "Album" || r.type === "EP";
    const stats = [[all.length, "Songs"], [DATA.features.length, "Features"], [DATA.clips.length, "Clips"], [DATA.releases.filter(isProject).length, "Albums & EPs"], [Math.min(...years), "First release", true]];
    $("#stats").innerHTML = stats.map(([n, l, fixed]) => `<div class="stat"><b data-n="${n}"${fixed ? " data-fixed" : ""}>${fixed ? n : 0}</b><span>${l}</span></div>`).join("");
    // les nombres comptent jusqu'à leur valeur quand ils apparaissent à l'écran (valeur finale tout de suite si animations réduites)
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const count = (el) => {
      const to = +el.dataset.n, t0 = performance.now(), done = () => (el.textContent = to);
      if (reduce) return done();
      setTimeout(done, 1800); // filet: si l'animation est suspendue (onglet en arrière-plan), on affiche quand même la valeur finale
      (function f(now) { const u = Math.min(1, (now - t0) / 1200); el.textContent = Math.round(to * (1 - (1 - u) ** 3)); if (u < 1) requestAnimationFrame(f); })(t0);
    };
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { count(e.target); io.unobserve(e.target); } }), { threshold: .6 });
    document.querySelectorAll("#stats b:not([data-fixed])").forEach((b) => io.observe(b));

    // le cimetière: une pierre par année. Dedans, une mini-croix par son (les albums / EP sont plus grands). Un clic entre dans l'année.
    const kindOf = (x) => (DATA.releases.includes(x) ? "rls" : DATA.features.includes(x) ? "feat" : "sc"); // "rls" et pas "rel": .rel est déjà la mise en page de la page projet
    $("#yard").innerHTML = [...new Set(years)].sort().map((y) => {
      const items = all.filter((x) => yearOf(x) === y).sort((p, q) => (p.date || "").localeCompare(q.date || "")), projects = items.filter(isProject).length;
      return `<a class="stone tomb" href="year.html?y=${y}"><h3>${y}</h3><div class="mini">${items.map((x) => `<i class="g ${kindOf(x)}${isProject(x) ? " big" : ""}"></i>`).join("")}</div>
        <small>${items.length} songs${projects ? ` \u00b7 ${projects} project${projects > 1 ? "s" : ""}` : ""}</small><span class="enter">Enter &#10013;</span></a>`;
    }).join("");
    stagger($("#yard"));
  },
  disco() {
    // pochette en haut de la pierre, puis titre, infos et boutons (SoundCloud seul pour les sons SoundCloud)
    // tri des "Released": All (récent -> ancien, sans date en dernier) / Albums / EPs / Singles
    const kinds = [["all", "All"], ["Album", "Albums"], ["EP", "EPs"], ["Single", "Singles"]];
    const byDate = (a, b) => (b.date || "").localeCompare(a.date || "");
    const kind = (r) => r.type || "Single";
    const showReleases = (k) => {
      const list = DATA.releases.filter((r) => k === "all" || kind(r) === k).sort(byDate);
      $("#releases").innerHTML = list.map((r) => card(r, [["spotify", "Spotify"]])).join("") || "<p>Nothing here yet.</p>";
      stagger($("#releases")); rails.get($("#releases"))?.(); // nouveau filtre: le carrousel repart du début
      document.querySelectorAll("#filters button").forEach((b) => b.setAttribute("aria-pressed", b.dataset.k === k));
    };
    $("#filters").innerHTML = kinds.map(([k, l]) => `<button class="btn" data-k="${k}">${l}</button>`).join("");
    $("#filters").onclick = (e) => { const b = e.target.closest("button"); if (b) showReleases(b.dataset.k); };
    showReleases("all");
    $("#soundcloud").innerHTML = DATA.soundcloud.slice().sort(byDate).map((r) => card(r, [["soundcloud", "SoundCloud"]])).join("");
    $("#features").innerHTML = DATA.features.slice().sort(byDate).map((r) => card(r, [["spotify", "Spotify"]])).join("");
    stagger($("#soundcloud")); stagger($("#features"));
  },
  release() {
    // page d'un projet (album, EP, single, exclu SoundCloud, feature): release.html?r=<id>
    const id = new URLSearchParams(location.search).get("r");
    const groups = [["releases", "Released", "spotify", "Spotify"], ["soundcloud", "SoundCloud Exclusive", "soundcloud", "SoundCloud"], ["features", "Feature", "spotify", "Spotify"]];
    const g = groups.find(([k]) => DATA[k].some((x) => x.id === id));
    const root = $("#rel"), back = '<a class="rune rel-back" href="discographie.html" data-dir="r">&larr; Discography</a>';
    if (!g) { root.innerHTML = back + "<p>This release does not exist.</p>"; return; }
    const [key, label, pk, pname] = g, it = DATA[key].find((x) => x.id === id);
    document.title = `${it.title} \u2014 1300SAINT`;
    const fmt = fmtDate;
    const tr = it.tracks ? `${it.tracks} track${it.tracks > 1 ? "s" : ""}` : "";
    // length: durée du son, ou du projet en entier (texte libre dans data.js, ex "2:41" ou "1h 12min")
    const meta = [["Artist", it.artist], ["With", it.with?.join(", ")], ["Type", key === "releases" ? it.type || "Single" : label], ["Released", fmt(it.date)], ["Tracks", tr], ["Length", it.length]].filter(([, v]) => v);

    // lecteur d'extraits: Spotify (album/titre) ou SoundCloud, si on a le lien direct. Rien n'est charge chez eux avant le clic.
    const url = (u) => { try { return new URL(u); } catch { return null; } };
    let embed = null;
    const sp = url(it.spotify), scu = url(it.soundcloud);
    if (sp?.hostname === "open.spotify.com") {
      const p = sp.pathname.split("/").filter((x) => x && !x.startsWith("intl-"));
      if (["album", "track", "playlist"].includes(p[0]) && p[1]) embed = { src: `https://open.spotify.com/embed/${p[0]}/${p[1]}`, uri: `spotify:${p[0]}:${p[1]}`, h: p[0] === "track" || it.tracks === 1 ? 152 : 352, from: "Spotify" };
    }
    if (!embed && scu?.hostname === "soundcloud.com" && scu.pathname.split("/").filter(Boolean).length >= 2 && !scu.pathname.startsWith("/search"))
      embed = { src: `https://w.soundcloud.com/player/?url=${encodeURIComponent(it.soundcloud)}&color=%239b0f16&visual=false`, h: 166, from: "SoundCloud" };

    // suggestions: 2 au hasard dans la même section + 2 ailleurs (ça change à chaque visite)
    const shuffle = (arr) => arr.map((x) => [Math.random(), x]).sort((p, q) => p[0] - q[0]).map((p) => p[1]);
    const others = groups.filter(([k]) => k !== key).flatMap(([k]) => DATA[k]);
    const picks = [...shuffle(DATA[key].filter((x) => x.id !== it.id)).slice(0, 2), ...shuffle(others).slice(0, 2)];

    const songs = (it.songs || []).map((x) => (typeof x === "string" ? { title: x } : Array.isArray(x) ? { title: x[0], length: x[1], id: x[2] } : x)); // "titre" | ["titre", "2:41", "idSpotify"] | {title, length, url}
    const playable = embed?.from === "Spotify" && songs.length >= 3 && songs.every((x) => x.id); // albums / EP: chaque ligne lance son morceau
    if (playable) embed.h = 152; // lecteur compact: la liste, c'est la tracklist de la page
    root.innerHTML = `${back}
      <div class="rel">
        ${it.cover ? `<button class="cover-btn" data-tilt aria-label="Enlarge the cover"><img class="rel-cover" src="${it.cover}" alt="${it.title} cover" width="640" height="640"></button>` : ""}
        <div>
          <p class="rel-kind">${key === "releases" ? it.type || "Single" : label}</p>
          <h1>${it.title}</h1>
          <dl class="rel-meta">${meta.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join("")}</dl>
          <div class="btns" style="justify-content:flex-start">${btn(it[pk], "Open on " + pname)}</div>
        </div>
      </div>
      <section><h2>Preview</h2>
        <div class="player${embed ? " live" : ""}" id="player">${embed?.uri
          ? `<div id="spembed"></div>`
          : embed
          ? `<iframe src="${embed.src}" height="${embed.h}" title="${it.title} — ${embed.from} player" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`
          : `<small>No preview yet for this one.</small>`}</div>
      </section>
      ${songs.length && (playable || it.type !== "Single") ? `<section><h2>Tracklist</h2><ol class="tracks">${songs.map((x, n) => `<li>${playable
        ? `<button class="trk" data-id="${x.id}"><span class="n">${String(n + 1).padStart(2, "0")}</span><span class="t">${x.title}</span><span class="len">${x.length || ""}</span></button>`
        : `<span class="n">${String(n + 1).padStart(2, "0")}</span><span class="t">${x.url ? `<a href="${x.url}" target="_blank" rel="noopener">${x.title}</a>` : x.title}</span>${x.length ? `<span class="len">${x.length}</span>` : ""}`}</li>`).join("")}</ol></section>` : ""}
      <section><h2>You might also like</h2><div class="grid" id="suggest">${picks.map((x) => card(x)).join("")}</div></section>`;
    stagger($("#suggest"));
    if (embed?.uri) { // lecteur Spotify piloté par l'API officielle (https://developer.spotify.com/documentation/embeds)
      let ctrl = null, current = null;
      window.onSpotifyIframeApiReady = (api) => api.createController($("#spembed"), { uri: embed.uri, width: "100%", height: embed.h }, (c) => { ctrl = c; });
      const api = document.createElement("script"); api.src = "https://open.spotify.com/embed/iframe-api/v1"; api.async = true; document.body.append(api);
      $(".tracks")?.addEventListener("click", (e) => {
        const b = e.target.closest(".trk"); if (!b) return;
        if (!ctrl) { window.open(`https://open.spotify.com/track/${b.dataset.id}`, "_blank", "noopener"); return; } // API pas (encore) chargée: on ouvre Spotify
        document.querySelectorAll(".trk.on").forEach((x) => x.classList.remove("on")); b.classList.add("on");
        if (current === b.dataset.id) ctrl.togglePlay(); else { current = b.dataset.id; ctrl.loadUri(`spotify:track:${b.dataset.id}`); ctrl.play(); }
        const pr = $("#player").getBoundingClientRect();
        if (pr.top < 90 || pr.bottom > innerHeight) $("#player").scrollIntoView({ block: "center", behavior: "smooth" }); // le lecteur n'est pas visible: on y va
      });
    }
    // clic sur la cover: elle s'affiche en grand (clic, Échap ou re-clic pour fermer)
    $(".cover-btn")?.addEventListener("click", () => {
      const box = document.createElement("div");
      box.className = "lightbox"; box.innerHTML = `<img src="${it.cover}" alt="${it.title} cover"><p>${it.title}</p>`;
      if (it.hd) { // version grande (jusqu'à 1200 px): la cover normale s'affiche tout de suite, puis est remplacée dès que la grande est chargée
        const big = new Image();
        big.onload = () => { const im = box.querySelector("img"); if (!im) return; im.src = big.src; im.style.width = Math.min(innerWidth * .9, innerHeight * .78, big.naturalWidth) + "px"; };
        big.src = it.hd;
      }
      const close = () => { box.classList.add("out"); setTimeout(() => box.remove(), 350); removeEventListener("keydown", onKey); };
      const onKey = (e) => e.key === "Escape" && close();
      box.addEventListener("click", close); addEventListener("keydown", onKey);
      document.body.append(box);
    });
  },
  year() {
    // page d'une année: year.html?y=2025 -> tous les sons de l'année, par catégorie
    const y = +new URLSearchParams(location.search).get("y"), root = $("#yr");
    const all = [...DATA.releases, ...DATA.soundcloud, ...DATA.features], yearOf = (x) => +(x.date || "0").slice(0, 4);
    const allYears = [...new Set(all.map(yearOf).filter(Boolean))].sort(), isProject = (x) => x.type === "Album" || x.type === "EP";
    const back = '<a class="rune rel-back" href="index.html#graveyard" data-dir="r">&larr; Graveyard</a>';
    if (!allYears.includes(y)) { root.innerHTML = back + "<p>No songs for this year.</p>"; return; }
    document.title = `${y} \u2014 1300SAINT`;
    const mine = (arr) => arr.filter((x) => yearOf(x) === y).sort((p, q) => (q.date || "").localeCompare(p.date || ""));
    const sp = [["spotify", "Spotify"]], sc = [["soundcloud", "SoundCloud"]], rel = mine(DATA.releases);
    const sections = [["Albums & EPs", rel.filter(isProject), sp], ["Singles", rel.filter((x) => !isProject(x)), sp], ["SoundCloud Exclusives", mine(DATA.soundcloud), sc], ["Features", mine(DATA.features), sp]].filter((x) => x[1].length);
    const n = all.filter((x) => yearOf(x) === y).length, projects = rel.filter(isProject).length;
    root.innerHTML = `${back}
      <header class="yr-head"><p class="rel-kind">The Graveyard</p><h1>${y}</h1><p class="sub">${n} songs${projects ? ` \u00b7 ${projects} project${projects > 1 ? "s" : ""}` : ""}</p></header>
      <div class="filters yr-years">${allYears.map((v) => `<a class="btn" href="year.html?y=${v}" data-dir="${v > y ? "l" : "r"}" aria-pressed="${v === y}">${v}</a>`).join("")}</div>
      ${sections.map(([t, arr, links]) => `<section><h2>${t}</h2><div class="grid">${arr.map((x) => card(x, links)).join("")}</div></section>`).join("")}`;
    root.querySelectorAll(".grid").forEach(stagger);
  },
  clips() {
    // carte "écran": la miniature remplit toute la carte, titre en bas, bouton lecture au centre; toute la carte est un lien
    $("#clips").innerHTML = DATA.clips.map((c) => `<article class="stone clip"><a href="${c.url}" target="_blank" rel="noopener" title="${c.title}">
      ${c.thumb ? `<img src="${c.thumb}" alt="${c.title}" loading="lazy" decoding="async" width="480" height="360">` : '<div class="ph">&#9654;</div>'}
      <span class="play"></span><span class="cap">${c.title}</span></a></article>`).join("");
  },
};
try { pages[document.body.dataset.page](); } catch (e) { console.error(e); } // une erreur de contenu ne doit pas bloquer le reste (engrenage, transitions...)
// ---- carrousel 3D: chaque .grid devient un cylindre de cartes. Glisser / swipe / molette horizontale / flèches clavier / clic sur une carte du côté ----
function carousel(grid) {
  const R = 560, STEP = .42, SPACING = 170; // rayon, angle entre 2 cartes (rad), px de glissement pour avancer d'une carte
  // le carrousel tourne en boucle: pos/target ne sont pas bornés, wrap() donne la distance (signée, la plus courte) d'une carte au centre
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  let cards = [], pos = 0, target = 0, raf = 0, down = null, moved = 0, snap = 0, flat = false; // flat: 5 cartes ou moins => pas de carrousel, simple rangée
  grid.tabIndex = 0;

  const wrap = (x) => { const n = cards.length; return n ? ((((x + n / 2) % n) + n) % n) - n / 2 : 0; };
  const layout = () => { cards.forEach((c, i) => {
    const d = wrap(i - pos), ad = Math.abs(d);
    if (ad > 3.6) { c.style.display = "none"; return; } // loin: cachée (et ses images ne se chargent pas)
    const a = clamp(d * STEP, -1.35, 1.35);
    c.style.display = "";
    c.style.transform = `translate3d(${R * Math.sin(a)}px,0,${R * (Math.cos(a) - 1)}px) rotateY(${-a}rad)`;
    c.style.opacity = clamp(1 - (ad - 1.9) / 1.6, 0, 1);
    c.style.zIndex = 100 - Math.round(ad * 10);
    c.style.pointerEvents = ad > 3 ? "none" : "";
  }); syncHover(); };
  const tick = () => {
    raf = 0; pos += (target - pos) * (reduce ? 1 : .14);
    if (Math.abs(target - pos) < .003) pos = target;
    layout(); if (pos !== target) kick();
  };
  const kick = () => raf || (raf = requestAnimationFrame(tick));
  const go = (t) => { target = Math.round(t); kick(); };
  const measure = () => { // la hauteur du cylindre = la carte la plus haute
    if (flat) return;
    cards.forEach((c) => (c.style.display = ""));
    grid.style.height = Math.max(0, ...cards.map((c) => c.offsetHeight)) + 30 + "px"; layout();
  };

  // à appeler à chaque fois que les cartes changent (filtre...): les cartes entrent en tournant
  const refresh = () => {
    cards = [...grid.children].filter((c) => c.classList.contains("stone"));
    flat = cards.length <= 5; grid.classList.toggle("row", flat); hint.hidden = flat;
    if (flat) { // peu de cartes: on enlève tout ce que le carrousel avait posé, le CSS (.grid.row) les range côte à côte
      cards.forEach((c) => ["transform", "opacity", "zIndex", "display", "pointerEvents"].forEach((p) => (c.style[p] = "")));
      grid.style.height = ""; target = pos = 0; return;
    }
    target = 0; pos = reduce ? 0 : -4; measure(); kick(); // départ à -4: les cartes arrivent en tournant
  };

  grid.addEventListener("pointerdown", (e) => { if (!e.button && !flat) { down = { x: e.clientX, p: pos, lx: e.clientX, v: 0 }; moved = 0; } });
  addEventListener("pointermove", (e) => {
    if (!down) return;
    const dx = e.clientX - down.x; moved = Math.max(moved, Math.abs(dx));
    down.v = (e.clientX - down.lx) * .5 + down.v * .5; down.lx = e.clientX; // vitesse lissée
    if (moved > 6) { pos = target = down.p - dx / SPACING; layout(); }
  });
  addEventListener("pointerup", () => { if (down && moved > 6) go(pos - down.v / 8); down = null; });
  grid.addEventListener("dragstart", (e) => e.preventDefault());
  grid.addEventListener("wheel", (e) => { // trackpad / Maj+molette; la molette verticale fait défiler la page normalement
    if (flat || Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    e.preventDefault(); pos = target = pos + e.deltaX / 220; layout();
    clearTimeout(snap); snap = setTimeout(() => go(pos), 120);
  }, { passive: false });
  grid.addEventListener("keydown", (e) => { if (!flat && e.key === "ArrowRight") go(target + 1); else if (e.key === "ArrowLeft") go(target - 1); });
  grid.addEventListener("click", (e) => { // après un glissement: pas de clic; clic sur une carte du côté: on la ramène au centre
    if (flat) return;
    const card = e.target.closest?.(".stone"), i = cards.indexOf(card);
    if (moved > 6 || (i >= 0 && Math.abs(wrap(i - target)) > .01)) { e.preventDefault(); e.stopPropagation(); if (moved <= 6) go(target + wrap(i - target)); moved = 0; }
  }, true);
  addEventListener("resize", measure);
  document.fonts?.ready.then(measure);

  const hint = document.createElement("p");
  hint.className = "hint"; hint.textContent = "Drag \u00b7 Swipe \u00b7 \u2190 \u2192"; grid.after(hint);
  refresh();
  return refresh;
}
document.querySelectorAll(".grid:not(.flat)").forEach((g) => rails.set(g, carousel(g))); // .flat = grille normale (page clips)

// ---- cross cursor: hitbox = whole image (souris uniquement) ----
let setCursor = () => {}, hasCursor = false; // branchés plus bas par le bouton réglages
if (matchMedia("(pointer:fine)").matches) {
  hasCursor = true;
  const cur = document.createElement("img");
  cur.id = "xcur"; cur.src = "img/cursor.png"; cur.alt = "";
  document.body.append(cur); document.body.classList.add("xhair");
  let on = true;
  setCursor = (v) => { on = v; document.body.classList.toggle("xhair", v); cur.style.display = "none"; linkAt = v ? linkUnder : plainLinkAt; syncHover(); };
  // liens touchés par la croix: on teste une grille de points sur son image, centre d'abord
  const linkUnder = (cx, cy) => {
    const w = cur.width, h = cur.height;
    for (const [fx, fy] of [[.5, .5], [.5, .15], [.5, .85], [.15, .4], [.85, .4], [.5, 0], [.5, 1], [0, .4], [1, .4]]) {
      // la pile d'éléments sous ce point, du dessus vers le dessous; on s'arrête à la cover agrandie: ce qui est caché dessous n'est pas cliquable
      const stack = document.elementsFromPoint(cx - w / 2 + fx * w, cy - h / 2 + fy * h), cut = stack.findIndex((e) => e.classList?.contains("lightbox"));
      const l = (cut < 0 ? stack : stack.slice(0, cut + 1)).find((e) => e.closest("a,button"));
      if (l) return l.closest("a,button");
    }
    return null;
  };
  linkAt = linkUnder;
  // dans un lecteur intégré (iframe Spotify/SoundCloud) la page ne reçoit plus les mouvements de la souris: la croix s'effacerait
  // figée au bord. On la cache à l'entrée (le curseur normal prend le relais dans le lecteur) et on la remet sous la souris à la sortie.
  let overFrame = false;
  const place = (e) => { cur.style.display = "block"; cur.style.transform = `translate(${e.clientX - cur.width / 2}px,${e.clientY - cur.height / 2}px)`; };
  document.addEventListener("pointerover", (e) => {
    overFrame = e.target.tagName === "IFRAME";
    if (overFrame) cur.style.display = "none"; else if (on && e.pointerType !== "touch") place(e);
  });
  addEventListener("pointermove", (e) => {
    if (!on || overFrame) return;
    cur.style.display = "block";
    cur.style.transform = `translate(${e.clientX - cur.width / 2}px,${e.clientY - cur.height / 2}px)`;
  });
  document.documentElement.addEventListener("pointerleave", () => (cur.style.display = "none"));
  addEventListener("click", (e) => {
    if (!on) return;
    const l = linkUnder(e.clientX, e.clientY);
    if (l && !e.target.closest("a,button")) { e.preventDefault(); l.click(); }
  }, true);
}

let lightningOn = true; // réglé par l'engrenage, lu par l'orage plus bas

// ---- settings gear: custom cursor on/off + brightness (saved in localStorage) ----
(function settings() {
  const store = { get: (k, d) => { try { return localStorage.getItem(k) ?? d; } catch { return d; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch {} } };
  const g = document.createElement("button");
  g.id = "gear"; g.setAttribute("aria-label", "Settings"); g.setAttribute("aria-expanded", "false"); g.innerHTML = "<span>⚙︎</span>";
  const p = document.createElement("div");
  p.id = "panel"; p.hidden = true;
  p.innerHTML = `<h3>Settings</h3>
    ${hasCursor ? '<label><span>Custom cursor</span><input type="checkbox" id="s-cur"></label>' : ""}
    <label><span>Lightning</span><input type="checkbox" id="s-light"></label>
    <label><span>Plain black background</span><input type="checkbox" id="s-plain"></label>
    <label><span>Readable font</span><input type="checkbox" id="s-font"></label>
    <label>Brightness<input type="range" id="s-br" min="0" max="100"></label>`;
  document.body.append(g, p);

  const css = document.documentElement.style;
  const brightness = (v) => { // 0 = très sombre, 100 = clair; la torche, les textes et le fond suivent
    css.setProperty("--dark", (.8 * (1 - v / 100)).toFixed(2));
    css.setProperty("--dim", `hsl(60 6% ${35 + v * .3}%)`);
    css.setProperty("--glow", `hsl(25 15% ${3 + v * .12}%)`);
    css.setProperty("--bg", `hsl(0 0% ${v * .05}%)`);
  };
  const br = $("#s-br"); br.value = store.get("br", 55); brightness(+br.value);
  br.oninput = () => { brightness(+br.value); store.set("br", br.value); };
  const lb = $("#s-light"); // éclairs on/off
  lb.checked = lightningOn = store.get("light", "1") === "1";
  lb.onchange = () => { lightningOn = lb.checked; store.set("light", lb.checked ? "1" : "0"); };
  const pb = $("#s-plain"); // fond noir simple: ni croix, ni brume, ni grain, ni dégradé
  pb.checked = store.get("plain", "0") === "1";
  pb.onchange = () => { document.documentElement.classList.toggle("plain", pb.checked); store.set("plain", pb.checked ? "1" : "0"); };
  const fb = $("#s-font"); // police lisible (appliquée aussi tout de suite dans le <head> pour éviter un flash)
  fb.checked = store.get("font", "0") === "1";
  fb.onchange = () => { document.documentElement.classList.toggle("legible", fb.checked); store.set("font", fb.checked ? "1" : "0"); dispatchEvent(new Event("resize")); };
  const cb = $("#s-cur");
  if (cb) { cb.checked = store.get("cur", "1") === "1"; setCursor(cb.checked); cb.onchange = () => { setCursor(cb.checked); store.set("cur", cb.checked ? "1" : "0"); }; }

  // couleurs du thème: --blood (accent), --bone (titres), --ink (texte). Sauvées dans localStorage, réappliquées par le <head> de chaque page.
  const DEF = { blood: "#9b0f16", bone: "#e8e6d8", ink: "#cfcfc4" }; // = valeurs de :root dans style.css
  let cols = { ...DEF };
  try { Object.assign(cols, JSON.parse(store.get("colors", "{}"))); } catch {}
  p.insertAdjacentHTML("beforeend", "<h4>Colors</h4>" + [["blood", "Accent"], ["bone", "Titles"], ["ink", "Text"]]
    .map(([k, l]) => `<label><span>${l}</span><input type="color" data-c="${k}"></label>`).join("") + '<button class="rune" id="s-reset">Reset colors</button>');
  const paint = () => p.querySelectorAll("[data-c]").forEach((i) => { i.value = cols[i.dataset.c]; css.setProperty("--" + i.dataset.c, cols[i.dataset.c]); });
  p.querySelectorAll("[data-c]").forEach((i) => (i.oninput = () => { cols[i.dataset.c] = i.value; css.setProperty("--" + i.dataset.c, i.value); store.set("colors", JSON.stringify(cols)); }));
  $("#s-reset").onclick = () => { cols = { ...DEF }; paint(); store.set("colors", "{}"); };
  paint();

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const open = (v) => { // ouverture: le panneau surgit; fermeture: il s'enfonce (animations en CSS)
    g.setAttribute("aria-expanded", v);
    if (v) { p.classList.remove("out"); p.hidden = false; }
    else if (!p.hidden && !p.classList.contains("out")) {
      if (reduce) { p.hidden = true; return; }
      p.classList.add("out");
      setTimeout(() => { if (p.classList.contains("out")) { p.hidden = true; p.classList.remove("out"); } }, 300); // = durée de .sink
    }
  };
  g.onclick = () => open(p.hidden || p.classList.contains("out"));
  addEventListener("keydown", (e) => e.key === "Escape" && open(false));
  addEventListener("pointerdown", (e) => { if (!p.hidden && !e.target.closest("#panel,#gear")) open(false); });
})();

// ---- atmosphere ----
const root = document.documentElement.style;
addEventListener("pointermove", (e) => { root.setProperty("--mx", e.clientX + "px"); root.setProperty("--my", e.clientY + "px"); });

(function lightning() { // random lightning
  setTimeout(() => { if (lightningOn) { document.body.classList.add("flash"); setTimeout(() => document.body.classList.remove("flash"), 400); } lightning(); }, 8000 + Math.random() * 15000);
})();

// ---- page transition: a creeping shadow sweeps across the screen, then we navigate ----
// page suivante dans le menu = l'ombre avance vers la gauche; page précédente = vers la droite.
(function veil() {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const c = document.createElement("canvas");
  c.style.cssText = "position:fixed;inset:0;width:100%;height:100%;z-index:99;pointer-events:none;display:none";
  document.body.append(c);
  const ctx = c.getContext("2d");
  const MS = 600, order = ["index.html", "discographie.html", "clips.html"];
  const pageIdx = (path) => { const f = path.split("/").pop() || "index.html"; return f === "release.html" ? 1.5 : f === "year.html" ? .5 : Math.max(0, order.indexOf(f)); }; // la page projet est "entre" Discography et Clips
  let seed, strips = [], marks = [], sweep = 1, dist = 0, busy = false;
  const crossImg = new Image(); crossImg.src = "img/cross.png";
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

  // une ombre qui rampe: l'écran est découpé en fines bandes horizontales, chacune avec son propre front
  // (certaines avancent bien plus vite = tentacules). Un dégradé par bande, pas de sprite: très léger.
  function build(dir) { // dir "l": l'ombre avance vers la gauche; sinon vers la droite
    seed = 7; sweep = dir === "l" ? -1 : 1;
    const W = (c.width = innerWidth >> 1), H = (c.height = innerHeight >> 1), n = Math.ceil(H / 4);
    const spikes = Array.from({ length: 8 }, () => ({ y: rnd() * H, w: H * (.012 + rnd() * .03), l: .15 + rnd() * .3 }));
    const ph = [rnd() * 6.28, rnd() * 6.28];
    strips = Array.from({ length: n }, (_, i) => {
      const y = (i + .5) / n * H;
      let sp = 0; for (const k of spikes) sp += k.l * Math.exp(-(((y - k.y) / k.w) ** 2));
      const lead = (.05 * Math.sin(y / H * 14.5 + ph[0]) + .035 * Math.sin(y / H * 36 + ph[1]) + sp) * W;
      return { y: i * 4, lead, fe: W * .2 * (1 + 2 * Math.min(sp, .5)) }; // fe: largeur du flou du bord (plus long sur les tentacules)
    });
    dist = W + Math.max(...strips.map((t) => t.fe)) + W * .1; // distance parcourue pour tout recouvrir
    // croix qui surgissent dans l'ombre au passage du front (grille décalée: réparties partout)
    const [cols, rows] = W < 400 ? [3, 4] : [6, 3];
    marks = Array.from({ length: cols * rows }, (_, i) => {
      const x = ((i % cols) + rnd()) / cols * W, y = (((i / cols) | 0) + rnd()) / rows * H, s = sweep < 0 ? 1 - x / W : x / W;
      return { x, y, h: H * (.12 + rnd() * .26), r: (rnd() - .5) * .5, o: .08 + rnd() * .2, a: Math.min(.75, Math.max(0, s * .6 + rnd() * .15)), k: rnd() * 6.28 };
    });
  }

  // cp: avancée de l'ombre (0..1); up: son retrait, en partant du bord de départ (0..1). cp=1, up=0 => écran recouvert
  function render(cp, up) {
    const W = c.width, S0 = -1.2 * W, S1 = dist + W * .5;
    ctx.clearRect(0, 0, W, c.height);
    strips.forEach((t, i) => {
      const D = cp * dist + t.lead * Math.sin(Math.PI * cp) + Math.sin(i * .35 + cp * 9) * W * .012; // front, qui ondule
      const T = -t.fe + up * (dist + t.fe) + t.lead * Math.sin(Math.PI * up) * .6;                    // fin de l'ombre
      const X = (v) => (sweep < 0 ? W - v : v);
      const g = ctx.createLinearGradient(X(S0), 0, X(S1), 0);
      let last = 0;
      const stop = (v, al) => { last = Math.max(last, Math.min(1, Math.max(0, (v - S0) / (S1 - S0)))); g.addColorStop(last, `rgba(0,0,0,${al})`); };
      stop(T - t.fe, 0); stop(T, 1); stop(D - t.fe, 1); stop(D, 0);
      ctx.fillStyle = g; ctx.fillRect(0, t.y, W, 4);
    });
    const clamp = (v) => Math.min(1, Math.max(0, v));
    for (const m of marks) { // les croix apparaissent avec l'ombre et s'effacent avec elle
      const v = clamp((cp - m.a) / .25) - clamp((up - m.a) / .25);
      if (v <= 0 || !crossImg.naturalWidth) continue;
      const h = m.h * (.75 + .25 * v), w = h * crossImg.naturalWidth / crossImg.naturalHeight;
      ctx.save(); ctx.globalAlpha = Math.min(1, v * 1.4) * m.o;
      ctx.translate(m.x - sweep * (1 - v) * h * .5, m.y + Math.sin(m.k + (cp + up) * 4) * h * .05); ctx.rotate(m.r + (1 - v) * .35 * sweep);
      ctx.drawImage(crossImg, -w / 2, -h / 2, w, h); ctx.restore();
    }
    ctx.globalAlpha = 1;
  }
  function run(draw, ms, done) {
    c.style.display = "block"; document.documentElement.classList.add("vt");
    const t0 = performance.now();
    (function f(now) {
      const u = Math.min(1, (now - t0) / ms);
      draw(u * u * (3 - 2 * u));
      u < 1 ? requestAnimationFrame(f) : (document.documentElement.classList.remove("vt"), done?.());
    })(t0);
  }

  try { // arrivée: même motif, il se retire dans le même sens
    const dir = sessionStorage.t;
    if (dir) {
      sessionStorage.removeItem("t");
      const go = () => {
        build(dir); render(1, 0); c.style.display = "block";
        document.documentElement.classList.remove("tr");
        requestAnimationFrame(() => run((e) => render(1, e), MS, () => (c.style.display = "none")));
      };
      crossImg.complete ? go() : crossImg.decode().then(go, go); // images prêtes avant de dévoiler la page (filet: 2s en CSS)
    }
  } catch {}
  addEventListener("click", (e) => { // départ: l'ombre balaie l'écran puis on change de page
    const a = e.target.closest?.("a");
    if (busy || !a || reduce || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey ||
        a.target === "_blank" || a.origin !== location.origin || a.pathname + a.search === location.pathname + location.search) return;
    e.preventDefault(); busy = true;
    const dir = a.dataset.dir || (pageIdx(a.pathname) > pageIdx(location.pathname) ? "l" : "r");
    try { sessionStorage.t = dir; } catch {}
    build(dir);
    run((u) => render(u, 0), MS, () => (location.href = a.href));
  });
  addEventListener("pageshow", (e) => { if (e.persisted) { busy = false; c.style.display = "none"; document.documentElement.classList.remove("vt"); } });
})();

// ---- background crosses: scattered (jittered grid), drifting, glowing/flickering. Big = faint + blurred = far away ----
(function crosses() {
  const box = document.createElement("div");
  box.id = "crosses"; box.setAttribute("aria-hidden", "true");
  const [cols, rows] = innerWidth < 700 ? [3, 3] : [4, 3], R = (a, b) => a + Math.random() * (b - a);
  for (let i = 0; i < cols * rows; i++) {
    const im = new Image(), h = R(40, 190), far = h / 190; // far: 0 (petite, nette) .. 1 (grande, floue, très pâle)
    im.src = "img/cross.png"; im.alt = ""; im.decoding = "async";
    im.style.cssText = `height:${h}px;left:${((i % cols) + Math.random()) / cols * 100}%;top:${(((i / cols) | 0) + Math.random()) / rows * 100}%;` +
      `--o:${(.16 - far * .1).toFixed(3)};--r1:${R(-18, 18)}deg;--r2:${R(-18, 18)}deg;--dx:${R(-50, 50)}px;--dy:${R(-70, 70)}px;--d:${R(9, 22)}s;--g:${R(5, 14)}s;` +
      `animation-delay:${-R(0, 20)}s,${-R(0, 14)}s;filter:blur(${(far * 3).toFixed(1)}px)${Math.random() < .2 ? " drop-shadow(0 0 14px var(--blood))" : ""}`;
    box.append(im);
  }
  document.body.prepend(box);
})();
