// All site content lives here. Replace the "search" links with real direct links.
// For a clip: put the YouTube ID in `yt` (e.g. "dQw4w9WgXcQ") -> thumbnail + direct link are automatic.
const q = encodeURIComponent;
const spotify = (t) => `https://open.spotify.com/search/${q("1300SAINT " + t)}`;
const sc = (t) => `https://soundcloud.com/search?q=${q("1300SAINT " + t)}`;
const ytSearch = (t) => `https://www.youtube.com/results?search_query=${q("1300SAINT " + t)}`;

// versions grandes (jusqu'a 1200 px) servies uniquement dans l'agrandissement de la page projet; liste generee, voir img/hd/
const HD = ["featuring/cover-50ball.jpg", "featuring/cover-glitter.jpg", "featuring/cover-iontalk.jpg", "featuring/cover-killstreakIII.jpg", "featuring/cover-moneycome&go.jpg", "featuring/cover-party.jpg", "featuring/cover-novocaine.jpg", "released/cover-escalade.jpg", "released/cover-migo.jpg", "released/cover-saintseason.jpg", "released/cover-untitled02.jpg", "released/cover-worthit.jpg", "soundcloud/cover-world=mine.jpg"];
const hdOf = (dir, file) => { const f = file && file.replace(/[.][^.]+$/, ".jpg"); return f && HD.includes(dir + "/" + f) ? `img/hd/cover-${dir}/${encodeURIComponent(f)}` : undefined; };
const item = (dir, file, title, extra = {}) => ({
  title, cover: file && `img/cover-${dir}/${encodeURIComponent(file)}`, hd: hdOf(dir, file), spotify: spotify(title), soundcloud: sc(title),
  tracks: extra.type === "Album" || extra.type === "EP" ? undefined : 1, // nombre de morceaux (Album/EP: à renseigner à la main)
  ...extra,
});

const DATA = {
  artist: {
    name: "1300SAINT",
    real: "DeAndre Jason McKee",
    born: "April 24, 2004",
    from: "Atlanta, Georgia",
    label: "Young Stoner Life Records",
    style: "Trap · Rage · Underground",
    bio: [
      "Born in 2004 in Atlanta, 1300SAINT started recording during the 2020 lockdown. His first tracks hit SoundCloud in 2021.",
      "The semi-viral \"OH K\" caught Young Thug's attention. He signed to Young Stoner Life Records and appeared on UY Scuti before dropping the ALL HAIL mixtape.",
      "A dark sound, crawling bass, a voice rising from underground: welcome to the graveyard.",
    ],
    links: {
      spotify: "https://open.spotify.com/artist/40VzC4fLTuY4YWFwKXK4Cv",
      soundcloud: "https://soundcloud.com/1300saint",
      youtube: "https://youtube.com/channel/UCFr1pnVIF_9XopwQLqVahBw",
    },
  },
  // Page d'un projet, optionnel dans {...}: length: "2:41" (duree du son, ou du projet entier: "1h 12min"),
  //   songs: ["Titre 1", "Titre 2", ...] (tracklist), et pour le lecteur d'extraits:
  //   spotify: "https://open.spotify.com/album/ID" (ou /track/ID)  |  soundcloud: "https://soundcloud.com/1300saint/titre"
  // Chaque entrée: item(dossier, fichier de la pochette, titre, {type, date, tracks}).
  // type: "Album" | "EP" | "Single" (vide = compté comme Single). date: "AAAA-MM-JJ" ou "AAAA-MM" ou "AAAA" (vide = en fin de liste).
  // Les liens sont des recherches pour l'instant.
  releases: [
    item("released", "cover-newdrug2.png", "Newdrug2.", { type: "EP", date: "2026-08-07", tracks: 6 }),
    item("released", "cover-savior+++.png", "SAVIOR: +++", { type: "Album", date: "2025-11", tracks: 28 }),
    item("released", "cover-saintseason.jpg", "SAINT SEASON", { type: "EP", date: "2025-04", tracks: 6 }),
    item("released", "cover-allhail.jpg", "ALL HAIL", { type: "Album", date: "2025-03", tracks: 14 }),
    item("released", "cover-ohk.jpg", "OH K", { type: "Single", date: "2025-01-10" }),
    item("released", "cover-+++.jpg", "+++", { type: "Single", date: "2023-08-27", tracks: 2 }),
    item("released", "cover-4U.jpg", "4U", { type: "Single", date: "2023-02-23" }),
    item("released", "cover-b4iwake.jpg", "B4 I WAKE", { type: "Single", date: "2022-01-15" }),
    item("released", "cover-bazo.jpg", "BAZO", { type: "Single", date: "2025-06-13" }),
    item("released", "cover-dontlietome.jpg", "DON'T LIE TO ME", { type: "Single", date: "2024-03-03" }),
    item("released", "cover-escalade.jpg", "ESCALADE", { type: "Single", date: "2024-09-06" }),
    item("released", "cover-fallout.jpg", "FALLOUT", { type: "Single", date: "2024-02-06" }),
    item("released", "cover-fkitweball.jpg", "#FKITWEBALL", { type: "Single", date: "2025-08-08" }),
    item("released", "cover-fleshwound.jpg", "FLESHWOUND", { type: "Single", date: "2023-01-23", tracks: 2 }),
    item("released", "cover-headed2me.jpg", "HEADED 2 ME", { type: "Single", date: "2022-10-14" }),
    item("released", "cover-loveispain.jpg", "LOVE IS PAIN", { type: "Single", date: "2022-02-11" }),
    item("released", "cover-migo.jpg", "MIGO", { type: "Single", date: "2026-09-16" }),
    item("released", "cover-molly.png", "MOLLY", { type: "Single", date: "2026-05-22" }),
    item("released", "cover-mutedsunset.jpg", "MUTED SUNSET", { type: "Single", date: "2022-08-12" }),
    item("released", "cover-newdrug.png", "Newdrug.", { type: "EP", date: "2025-08", tracks: 6 }),
    item("released", "cover-noir.jpg", "NOIR", { type: "Album", date: "2022-12-16", tracks: 13 }),
    item("released", "cover-nostylist.jpg", "NO STYLIST", { type: "Single", date: "2022-06-11" }),
    item("released", "cover-notatelfar.jpg", "NOT A TELFAR", { type: "Single", date: "2025-04-04" }),
    item("released", "cover-ownway.jpg", "OWN WAY", { type: "Single", date: "2023-07-16" }),
    item("released", "cover-seduce&destroy.jpg", "SEDUCE & DESTROY", { type: "EP", date: "2023-09-30", tracks: 6 }),
    item("released", "cover-solongandfarewell.jpg", "SO LONG, AND FAREWELL", { type: "Single", date: "2023-11-17" }),
    item("released", "cover-thrax.jpg", "THRAX", { type: "Single", date: "2023-08-05" }),
    item("released", "cover-thread.jpg", "THREAD", { type: "Single", date: "2023-12-21" }),
    item("released", "cover-united.jpg", "UNITED", { type: "Single", date: "2024-12-04" }),
    item("released", "cover-untitled01.jpg", "UNTITLED 01", { type: "Single", date: "2023-05-03", tracks: 2 }),
    item("released", "cover-untitled02.jpg", "UNTITLED 02", { type: "Single", date: "2023-08-17", tracks: 2 }),
    item("released", "cover-worthit.jpg", "WORTH IT", { type: "Single", date: "2024-10-18" }),
  ],
  soundcloud: [ // exclusivités SoundCloud (pas sur Spotify)
    item("soundcloud", "cover-150.jpg", "150", { date: "2025-01-20", soundcloud: "https://soundcloud.com/1300saint/150a2" }),
    item("soundcloud", "cover-casket.png", "CASKET", { date: "2023-03-06", soundcloud: "https://soundcloud.com/1300saint/casket" }),
    item("soundcloud", "cover-chopoff.jpg", "CHOP OFF", { date: "2025-08-22", soundcloud: "https://soundcloud.com/user-553846760/1300saint-chop-off-prod" }),
    item("soundcloud", "cover-place.jpg", "PLACE", { date: "2023-08-15", soundcloud: "https://soundcloud.com/1300saint/place" }),
    item("soundcloud", "cover-teardrop.jpg", "TEARDROP", { date: "2024-08-20", soundcloud: "https://soundcloud.com/1300saint/teardrop" }),
    item("soundcloud", "cover-world=mine.jpg", "WORLD = MINE", { date: "2026-07-04", soundcloud: "https://soundcloud.com/1300saint/world-mine" }),
  ],
  features: [ // `artist`: l'artiste principal (à compléter). file = null: pas de pochette (une pierre vide s'affiche)
    item("featuring", "cover-sl3.jpg", "SAY DAT", { date: "2026-08-27" }),
    item("featuring", "cover-sl3.jpg", "STOLE IT FROM US", { date: "2026-08-27" }),
    item("featuring", "cover-sl3.jpg", "TONIGHT", { date: "2026-08-27" }),
    item("featuring", "cover-myth.jpg", "MYTH", { date: "2026-07-31" }),
    item("featuring", "cover-revenge.jpg", "REVENGE", { date: "2025-09-26" }),
    item("featuring", "cover-party.jpg", "PARTY", { date: "2025-05-23" }),
    item("featuring", "cover-wtf,.jpg", "WTF,", { date: "2026-06-26" }),
    item("featuring", "cover-achoo.jpg", "ACHOO", { date: "2025-07-07" }),
    item("featuring", "cover-nustylez.jpg", "NU STYLEZ", { date: "2025-11-05" }),
    item("featuring", "cover-hollywood.jpg", "HOLLYWOOD", { date: "2026-09-25" }),
    item("featuring", "cover-pureaudio.jpg", "TRUST NOBODY", { date: "2025-03-21" }),
    item("featuring", "cover-pureaudio.jpg", "ALMIGHTY", { date: "2025-03-21" }),
    item("featuring", "cover-pureaudio.jpg", "IF I DIE", { date: "2025-03-21" }),
    item("featuring", "cover-maybachmusic.jpg", "MAYBACH MUSIC", { date: "2026-05-22" }),
    item("featuring", "cover-iontalk.jpg", "ION TALK", { date: "2025-05-23" }),
    item("featuring", "cover-ifu.jpg", "I.F.U", { date: "2026-08-31" }),
    item("featuring", "cover-riprichhomie.jpg", "RIP RICH HOMIE", { date: "2025-02-17" }),
    item("featuring", "cover-deuces.jpg", "DEUCES", { date: "2023-02-17" }),
    item("featuring", "cover-killinme.jpg", "KILLIN ME", { date: "2025-05-22" }),
    item("featuring", "cover-BOOL.jpg", "BOOL", { date: "2026-03-27" }),
    item("featuring", "cover-fuckupcommas.jpg", "FUCK UP COMMAS", { date: "2025-05-30" }),
    item("featuring", "cover-peacesign.jpg", "PEACE SIGN", { date: "2025-05-30" }),
    item("featuring", "cover-theycant.jpg", "THEY CANT", { date: "2025-12-05" }),
    item("featuring", "cover-dopamine.jpg", "DOPAMINE", { date: "2025-02-07" }),
    item("featuring", "cover-50ball.jpg", "50 BALL", { date: "2022-12-23" }),
    item("featuring", "cover-newmoney.jpg", "NEW MONEY", { date: "2026-01-23" }),
    item("featuring", "cover-killstreakIII.jpg", "KILL STREAK III", { date: "2023-07-03" }),
    item("featuring", "cover-killstreakIII.jpg", "DROWN", { date: "2023-07-03" }),
    item("featuring", "cover-hanginout.jpg", "HANGIN OUT", { date: "2024-10-18" }),
    item("featuring", "cover-novocaine.jpg", "NOVOCAINE", { date: "2024-04-08" }),
    item("featuring", "cover-realspill.jpg", "REAL SPILL", { date: "2025-08-22" }),
    item("featuring", "cover-reaper.jpg", "REAPER", { date: "2023-11-10" }),
    item("featuring", "cover-moneycome&go.jpg", "MONEY COME & GO", { date: "2025-09-26" }),
    item("featuring", "cover-around.jpg", "AROUND", { date: "2023-12-02" }),
    item("featuring", "cover-bleedingout.jpg", "BLEEDING OUT.", { date: "2025-11-22" }),
    item("featuring", "cover-poisonivy.jpg", "POISON IVY", { date: "2023-01-13" }),
    item("featuring", "cover-endoftheday.jpg", "END OF THE DAY", { date: "2022-07-14" }),
    item("featuring", "cover-feargod.jpg", "FEAR GOD", { date: "2022-06-26" }),
    item("featuring", "cover-glitter.jpg", "GLITTER", { date: "2024-09-29" }),
    item("featuring", "cover-onedayatatime.jpg", "ONE DAY AT A TIME", { date: "2023-02-17" }),
    item("featuring", "cover-catchindasun.jpg", "CATCHIN DA' SUN", { date: "2026-02-13" }),
    item("featuring", "cover-consummate.jpg", "CONSUMMATE", { date: "2026-08-25" }),
    item("featuring", "cover-kencarsonntg.jpg", "KEN CARSON/N.T.G", { date: "2025-04-15" }),
    item("featuring", "cover-bison.jpg", "BISON", { date: "2025-02-07" }),
  ],
  // clips: title, yt (ID YouTube = la partie après youtu.be/, sans ?si=...)
  clips: [
    { title: "Migo", yt: "AQoOtiHlZbM" },
    { title: "Encore.", yt: "H11S0oy8fcw" },
    { title: "MOLLY", yt: "8flyggr7VfQ" },
    { title: "BLONDE P*UNK", yt: "abHoen_wqwM" },
    { title: "LIFETIME", yt: "DWDkGOpDEx4" },
    { title: "POPE LIVIN (feat. Lil Gotit)", yt: "Id857vCRxvw" },
    { title: "STOP PLAYIN", yt: "PFyuJ3kyeRM" },
    { title: "BIGGER THAN LIFE", yt: "qMUuLcmIfCc" },
    { title: "BloodSucker.", yt: "tyAfoXBknO8" },
    { title: "KUTTA", yt: "DCdtf4ldByU" },
    { title: "#FKITWEBALL", yt: "J1Zp9xe4t7c" },
    { title: "SHOGUN", yt: "yIaucjXUl34" },
    { title: "NOT A TELFAR", yt: "JkeQlPBjzsA" },
    { title: "OUTBAD", yt: "i23cHZ22UzI" },
    { title: "VENOM", yt: "M3f9sbXeIDg" },
    { title: "SAFE & SOUND", yt: "jYoPzkr0ojk" },
    { title: "UNITED", yt: "JCuMPyOaIqQ" },
    { title: "Worth It", yt: "8kEgRIgDM4c" },
    { title: "ESCALADE", yt: "H8-4Os70kDA" },
    { title: "POET", yt: "RslIZ4ZWG60" },
    { title: "ONE", yt: "MtvOpFf-Sp8" },
    { title: "New Generation (feat. diamond*, iyrus & Tezzus)", yt: "Wgj0xqiVlys" },
    { title: "Warrior (feat. Twosoulsonefate)", yt: "Coo9BJyXqlo" },
    { title: "Kyoto", yt: "b_FLyAr-GYc" },
    { title: "EA (feat. Nine Vicious)", yt: "Fg91Ke9HTe4" },
    { title: "Savior Freestyle", yt: "JTcmdN-tuBo" },
    { title: "Of Course", yt: "tFMoFAzwXVI" },
    { title: "Grinch (feat. Nine Vicious)", yt: "sXZ-ER2_k4c" },
    { title: "Tired Asf (feat. Nine Vicious)", yt: "MfcrLbaioQs" },
    { title: "Pop On My Opp", yt: "qXrFFRP9Tyo" },
    { title: "Young Thug - Revenge (feat. Lil Gotit & 1300SAINT)", yt: "mSZKZLqO4Is" },
    { title: "Young Thug - Consummate (feat. Tezzus & 1300SAINT)", yt: "7joSmbQgIT0" },
    { title: "FOREIGN SHIT (feat. Nine Vicious & Yung Kayo)", yt: "qD8Ag34Nwnw" },
    { title: "IN TROUBLE", yt: "aV98dGDO31Y" },
    { title: "set. (feat. sk8star, diorvsyou, apollored1)", yt: "mK6vX2hcIGk" },
    { title: "EVERYTHING SLATT", yt: "opxTPs1zbmQ" },
  ],
};
// id de chaque page projet (release.html?r=<id>) + groupe d'origine. Slug unique a partir du titre.
const slug = (t) => t.toLowerCase().replace(/[+]/g, " plus ").replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "x";
const usedIds = new Set();
for (const k of ["releases", "soundcloud", "features"]) DATA[k].forEach((it) => {
  let s = slug(it.title), base = s, n = 2;
  while (usedIds.has(s)) s = base + "-" + n++;
  usedIds.add(s); it.id = s; it.kind = k;
});
DATA.clips.forEach((c) => {
  c.url = c.yt ? `https://www.youtube.com/watch?v=${c.yt}` : ytSearch(c.title);
  c.thumb = c.yt ? `https://img.youtube.com/vi/${c.yt}/hqdefault.jpg` : "";
});
