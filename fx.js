const $ = (s) => document.querySelector(s);
const a = DATA.artist;
const btn = (href, label) => `<a class="btn" href="${href}" target="_blank" rel="noopener">${label}</a>`;
// Le :hover du navigateur ne se met pas à jour quand la page (ou le carrousel) bouge sous une souris immobile.
// On retient la dernière position du pointeur et on recalcule nous-mêmes la carte (.lit) et le lien/bouton (.hot) qui sont dessous.
// Le CSS n'utilise donc plus :hover (qui reste collé à l'ancien élément tant que la souris ne bouge pas).
const plainLinkAt = (x, y) => document.elementFromPoint(x, y)?.closest?.("a,button") ?? null;
let ptr = null, lit = null, hot = null, linkAt = plainLinkAt; // linkAt: remplacé par le curseur croix (hitbox élargie)
const syncHover = () => {
  if (!ptr) return;
  const el = document.elementFromPoint(ptr.x, ptr.y)?.closest?.(".stone") ?? null;
  if (el !== lit) { lit?.classList.remove("lit"); el?.classList.add("lit"); lit = el; }
  const l = linkAt(ptr.x, ptr.y);
  if (l !== hot) { hot?.classList.remove("hot"); l?.classList.add("hot"); hot = l; }
};
addEventListener("pointermove", (e) => { if (e.pointerType !== "touch") { ptr = { x: e.clientX, y: e.clientY }; syncHover(); } });
addEventListener("scroll", syncHover, { passive: true });
document.documentElement.addEventListener("pointerleave", () => { ptr = null; lit?.classList.remove("lit"); hot?.classList.remove("hot"); lit = hot = null; });
const rails = new Map(); // .grid -> refresh() du carrousel (voir plus bas)
const stone = (inner) => `<article class="stone">${inner}</article>`;

// ---- header: liens vers les plateformes (à droite) ----
$(".ext").innerHTML = [["Spotify", a.links.spotify], ["SoundCloud", a.links.soundcloud], ["YouTube", a.links.youtube]]
  .map(([l, u]) => `<a href="${u}" target="_blank" rel="noopener">${l}</a>`).join("");

// ---- per-page rendering (data-page on <body>) ----
const pages = {
  home() {
    $("#facts").innerHTML = [["Real name", a.real], ["Born", a.born], ["From", a.from], ["Label", a.label], ["Style", a.style]]
      .map(([k, v]) => `<div>${k}<b>${v}</b></div>`).join("");
    $("#bio").innerHTML = a.bio.map((p) => `<p>${p}</p>`).join("");
    $("#links").innerHTML = btn(a.links.spotify, "Spotify") + btn(a.links.soundcloud, "SoundCloud") + btn(a.links.youtube, "YouTube");
  },
  disco() {
    // pochette en haut de la pierre, puis titre, infos et boutons (SoundCloud seul pour les sons SoundCloud)
    const card = (it, links) => `<article class="stone c">${it.cover ? `<img src="${it.cover}" alt="${it.title} cover" width="300" height="300" loading="lazy" decoding="async">` : '<div class="ph sq">&#10013;</div>'}
      <h3>${it.title}</h3><small>${it.tracks ? `${it.tracks} track${it.tracks > 1 ? "s" : ""}` : "&nbsp;"}</small>
      <div class="btns">${links.map(([k, l]) => btn(it[k], l)).join("")}</div></article>`;
    const stagger = (el) => [...el.children].forEach((c, i) => c.style.setProperty("--i", Math.min(i, 14))); // apparition en cascade (voir .stone.c en CSS)
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
  clips() {
    $("#clips").innerHTML = DATA.clips.map((c) => stone(
      `<a href="${c.url}" target="_blank" rel="noopener">${c.thumb ? `<img src="${c.thumb}" alt="${c.title}">` : `<div class="ph">▶</div>`}</a>
       <h3>${c.title}</h3><small>&nbsp;</small><div class="btns">${btn(c.url, "Watch on YouTube")}</div>`)).join("");
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
      const l = document.elementsFromPoint(cx - w / 2 + fx * w, cy - h / 2 + fy * h).find((e) => e.closest("a,button"));
      if (l) return l.closest("a,button");
    }
    return null;
  };
  linkAt = linkUnder;
  addEventListener("pointermove", (e) => {
    if (!on) return;
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
    .map(([k, l]) => `<label><span>${l}</span><input type="color" data-c="${k}"></label>`).join("") + '<button class="btn" id="s-reset">Reset colors</button>');
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
  const pageIdx = (path) => Math.max(0, order.indexOf(path.split("/").pop() || "index.html"));
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
        a.target === "_blank" || a.origin !== location.origin || a.pathname === location.pathname) return;
    e.preventDefault(); busy = true;
    const dir = pageIdx(a.pathname) > pageIdx(location.pathname) ? "l" : "r";
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
