const $ = (s) => document.querySelector(s);
const a = DATA.artist;
const btn = (href, label) => `<a class="btn" href="${href}" target="_blank" rel="noopener">${label}</a>`;
const stone = (inner) => `<article class="stone">${inner}</article>`;

// ---- per-page rendering (data-page on <body>) ----
const pages = {
  home() {
    $("#facts").innerHTML = [["Real name", a.real], ["Born", a.born], ["From", a.from], ["Label", a.label], ["Style", a.style]]
      .map(([k, v]) => `<div>${k}<b>${v}</b></div>`).join("");
    $("#bio").innerHTML = a.bio.map((p) => `<p>${p}</p>`).join("");
    $("#links").innerHTML = btn(a.links.spotify, "Spotify") + btn(a.links.soundcloud, "SoundCloud") + btn(a.links.youtube, "YouTube");
  },
  disco() {
    $("#releases").innerHTML = DATA.releases.map((r) => stone(
      `<div class="cross">✝</div><h3>${r.title}</h3><small>${r.type}${r.year ? " · " + r.year : ""}${r.note ? "<br>" + r.note : ""}</small>
       <div class="btns">${btn(r.spotify, "Spotify")}${btn(r.soundcloud, "SoundCloud")}</div>`)).join("");
    $("#features").innerHTML = DATA.features.map((f) => stone(
      `<div class="cross">☠</div><h3>${f.artist}</h3><small>${f.title}</small>
       <div class="btns">${btn(f.spotify, "Spotify")}${btn(f.soundcloud, "SoundCloud")}</div>`)).join("");
  },
  clips() {
    $("#clips").innerHTML = DATA.clips.map((c) => stone(
      `<a href="${c.url}" target="_blank" rel="noopener">${c.thumb ? `<img src="${c.thumb}" alt="${c.title}">` : `<div class="ph">▶</div>`}</a>
       <h3>${c.title}</h3><small>&nbsp;</small><div class="btns">${btn(c.url, "Watch on YouTube")}</div>`)).join("");
  },
};
pages[document.body.dataset.page]();

// ---- cross cursor: hitbox = whole image (souris uniquement) ----
if (matchMedia("(pointer:fine)").matches) {
  const cur = document.createElement("img");
  cur.id = "xcur"; cur.src = "img/cursor.png"; cur.alt = "";
  document.body.append(cur); document.body.classList.add("xhair");
  let hot = null;
  // liens touchés par la croix: on teste une grille de points sur son image, centre d'abord
  const linkUnder = (cx, cy) => {
    const w = cur.width, h = cur.height;
    for (const [fx, fy] of [[.5, .5], [.5, .15], [.5, .85], [.15, .4], [.85, .4], [.5, 0], [.5, 1], [0, .4], [1, .4]]) {
      const l = document.elementsFromPoint(cx - w / 2 + fx * w, cy - h / 2 + fy * h).find((e) => e.closest("a"));
      if (l) return l.closest("a");
    }
  };
  addEventListener("pointermove", (e) => {
    cur.style.display = "block";
    cur.style.transform = `translate(${e.clientX - cur.width / 2}px,${e.clientY - cur.height / 2}px)`;
    const l = linkUnder(e.clientX, e.clientY);
    if (l !== hot) { hot?.classList.remove("hot"); l?.classList.add("hot"); hot = l; }
  });
  document.documentElement.addEventListener("pointerleave", () => (cur.style.display = "none"));
  addEventListener("click", (e) => {
    const l = linkUnder(e.clientX, e.clientY);
    if (l && !e.target.closest("a")) { e.preventDefault(); l.click(); }
  }, true);
}

// ---- atmosphere ----
const root = document.documentElement.style;
addEventListener("pointermove", (e) => { root.setProperty("--mx", e.clientX + "px"); root.setProperty("--my", e.clientY + "px"); });

setInterval(() => { // red eyes opening in the dark
  const e = document.createElement("div");
  e.className = "eyes"; e.innerHTML = "<i></i><i></i>";
  e.style.left = Math.random() * 90 + "vw"; e.style.top = Math.random() * 90 + "vh";
  document.body.append(e); setTimeout(() => e.remove(), 4000);
}, 5000);

(function lightning() { // random lightning
  setTimeout(() => { document.body.classList.add("flash"); setTimeout(() => document.body.classList.remove("flash"), 400); lightning(); }, 8000 + Math.random() * 15000);
})();

// ---- page transition: shadowy branches swallow the screen, then we navigate ----
(function veil() {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const c = document.createElement("canvas");
  c.style.cssText = "position:fixed;inset:0;width:100%;height:100%;z-index:99;pointer-events:none;display:none";
  document.body.append(c);
  const ctx = c.getContext("2d");
  let seed = 7, branches = [], busy = false;
  const MS = 500; // durée d'un aller ou d'un retour des branches (ms)
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

  function build() { // branches qui partent des 4 bords vers le centre, avec des ramifications
    const W = (c.width = innerWidth >> 1), H = (c.height = innerHeight >> 1), step = 17;
    const grow = (x, y, ang, steps, w, depth, t0) => { // t0: moment (0..1) où la branche démarre
      const pts = [[x, y]];
      for (let i = 0; i < steps; i++) {
        ang += (rnd() - .5) * .5; x += Math.cos(ang) * step; y += Math.sin(ang) * step; pts.push([x, y]);
        if (depth < 2 && i > 3 && rnd() < .12) grow(x, y, ang + (rnd() < .5 ? -1 : 1) * (.6 + rnd() * .6), Math.round(steps * .5), w * .55, depth + 1, t0 + (1 - t0) * (i / steps) / 1.15);
      }
      branches.push({ pts, w, t0 });
    };
    for (let i = 0; i < 44; i++) {
      const t = i / 44 * 4, u = t % 1;
      const [x, y] = [[u * W, 0], [W, u * H], [(1 - u) * W, H], [0, (1 - u) * H]][Math.floor(t)];
      grow(x, y, Math.atan2(H / 2 - y, W / 2 - x) + (rnd() - .5) * .6, Math.round(Math.hypot(W / 2 - x, H / 2 - y) / step), Math.max(W, H) / 30, 0, 0);
    }
  }
  function render(p) { // p: 0 = écran libre, 1 = tout noir
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.lineCap = ctx.lineJoin = "round";
    for (const [col, extra] of [["#3a3834", 2.5], ["#000", 0]]) { // liseré gris puis coeur noir, pour que ça se voie sur le fond sombre
      ctx.strokeStyle = col;
      for (const { pts, w, t0 } of branches) {
        const lp = Math.max(0, (p - t0) / (1 - t0)), k = Math.min(pts.length - 1, lp * 1.15 * (pts.length - 1));
        if (k <= 0) continue;
        const n = Math.ceil(k), f = k - (n - 1);
        const pt = (j) => j < n ? pts[j] : [pts[n - 1][0] + (pts[n][0] - pts[n - 1][0]) * f, pts[n - 1][1] + (pts[n][1] - pts[n - 1][1]) * f];
        // 3 traits par branche (épais -> fin) au lieu d'un trait par segment: bien plus léger
        let a = 0;
        for (const [end, wf] of [[.45, 1], [.8, .5], [1, .18]]) {
          const b = end === 1 ? n : Math.max(a + 1, Math.round(n * end));
          if (b <= a) continue;
          ctx.lineWidth = w * wf + extra; ctx.beginPath(); ctx.moveTo(...pt(a));
          for (let j = a + 1; j <= b; j++) ctx.lineTo(...pt(j));
          ctx.stroke(); a = b;
        }
      }
    }
  }
  function run(from, to, ms, done) {
    c.style.display = "block"; document.documentElement.classList.add("vt");
    const t0 = performance.now();
    (function f(now) {
      const u = Math.min(1, (now - t0) / ms);
      render(from + (to - from) * u * u * (3 - 2 * u));
      u < 1 ? requestAnimationFrame(f) : (document.documentElement.classList.remove("vt"), done?.());
    })(t0);
  }

  build();
  try { // arrivée: on est sur du noir, les branches se rétractent
    if (sessionStorage.t) {
      sessionStorage.removeItem("t"); render(1); c.style.display = "block";
      document.documentElement.classList.remove("tr");
      requestAnimationFrame(() => run(1, 0, MS, () => (c.style.display = "none")));
    }
  } catch {}
  addEventListener("click", (e) => { // départ: les branches recouvrent l'écran puis on change de page
    const a = e.target.closest?.("a");
    if (busy || !a || reduce || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey ||
        a.target === "_blank" || a.origin !== location.origin || a.pathname === location.pathname) return;
    e.preventDefault(); busy = true;
    try { sessionStorage.t = 1; } catch {}
    run(0, 1, MS, () => (location.href = a.href));
  });
  addEventListener("pageshow", (e) => { if (e.persisted) { busy = false; c.style.display = "none"; } });
})();
