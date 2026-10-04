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
