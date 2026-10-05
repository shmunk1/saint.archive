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
    item("released", "cover-newdrug2.jpg", "Newdrug2.", { type: "EP", date: "2026-08-07", tracks: 6, spotify: "https://open.spotify.com/album/4KmSvEVxNeqAqzOHvRbdv8", length: "20 min", songs: [["Encore.","2:36","5RbInu8tIyD9iGIjLV3Lh4"],["Nightgown.","3:04","2bpfLRfklbOtGhg0Fdrcnq"],["PainKillers.","3:02","4E3HOfgFnQawy2s5RXkUmM"],["Tattoos.","3:19","0gXIAbwyQ6nwyvf1Gytdhj"],["NotASong.","3:05","3TppMzEghqEsFgnqEBc6Fo"],["808s.","4:37","0ajarfpKp7oeER0ObgALrt"]] }),
    item("released", "cover-savior+++.jpg", "SAVIOR: +++", { type: "Album", date: "2025-11", tracks: 28, spotify: "https://open.spotify.com/album/5CaepplCpeOE3nUrMocFzk", length: "1h 11min", songs: [["MILITIA BOSS","3:40","1AmcoOZ8mGT249lmfebMzE"],["BLONDE P*NK","2:30","14ia3D6YhisRPVBELF3nUw"],["MAMI","1:45","65OOiGqKU0Ll5BqjCCCso4"],["WHITE OPS","2:44","45cFF0dg2M8yWHkIdoTCJn"],["PANDEMONIUM","2:21","7gBxhon2haTvSIP9EWiII5"],["I NEED (feat. Sk8star)","2:06","1enFuDgfy6VPnMSbaU89Ll"],["PRETTY PU$$Y","3:00","79uWOsE97vRJDDyKSd1IOM"],["LOADOUT (HIT) (feat. Apollored1)","1:50","7a5HJnFANmZZRkCCwSoumI"],["EA (feat. Nine Vicious)","3:05","4NfrR07xd870SPiPaRPCKK"],["SHELLS","2:08","4hHcDphWI6iCC3OAS3COaA"],["LIFETIME","2:03","1bF6KwmQhzJB2zVuuoCAsi"],["BIGGER THAN LIFE","2:43","4HAI8J1Gf5g6N7QidUhcj6"],["KYOTO","2:26","1a3CfjYh9hbw5Ph9dvHBzf"],["STOP PLAYIN","1:55","1AN7mAYmubGJa1oB0GQ5S4"],["SLITHERIN","2:30","7xNOKG7O1cdqvZVXAOFjx8"],["RIP POPE (feat. Lil Gotit)","3:04","4ckUp7ICc5XDzythuyO0lF"],["HEARD IT ALL","2:06","5BHaeyBfk02KzVDLP0EUgX"],["DIVINE","2:32","7BzpSctkrJcY1k2H4tsCbA"],["MONA LISA","2:21","6bP2rMedBHEHWwAv4Q8B67"],["PALM SPRINGS","2:43","4fAX1vuDjBHimuYGVFZn1X"],["SLIMIER > YOU","2:06","7owYcTnAfwzf17Omuo7gLK"],["BOUNTY","2:27","1zjv5CUQ368mPc2yfaf8Bf"],["SOULTIES","2:25","42o11a18kLo6SEGihXasDz"],["CHAINZ & CORVETTEZ (feat. Yung Heir)","2:35","48lmnak1eUBJyJnP4XGr6G"],["FLAWS","2:42","1XmDbdtJDtTK8lSyD6hZAx"],["RETURN YOU","2:34","701QBkJ07yPGe3L3pO1jEn"],["INTERLUDE","3:26","4C79T0jFCTdNvuS4h55uRA"],["SAVIOR SOLITUDE","2:35","3ktaXRyenOeN14pM9PKJ4b"]] }),
    item("released", "cover-saintseason.jpg", "SAINT SEASON", { type: "EP", date: "2025-04", tracks: 6, spotify: "https://open.spotify.com/album/2BjCKg7GAhkVAKh1yIz5Ht", length: "15 min", songs: [["REDROBIN","1:52","1uudsxk6pF9GxkSZkoZZT4"],["IN TROUBLE","2:38","6yziBueE1qoK61VfCiTKfK"],["SHOGUN","2:44","6oSYpEcZlQT45YfD84X4be"],["SEEUMSAYIN","1:49","45sy7GCK1JVftiHgS39s8S"],["BLAKK TRUKK","2:57","2uLmeshAAUovNBTT0AYUI0"],["SOUTHSIDE FOREVER","2:53","4KEq7pukTZCWPp0Vw1YqB9"]] }),
    item("released", "cover-allhail.jpg", "ALL HAIL", { type: "Album", date: "2025-03", tracks: 14, spotify: "https://open.spotify.com/album/2olljtmOENk5A0h9O5Z5IJ", length: "37 min", songs: [["NEVER THEM INTRO","2:46","4U5kUl6tQvbwIipIgRZt0Z"],["VENOM","2:15","6WF4oo3HxgfOVDJJYkKGHa"],["I SEE RED","2:29","0GQLgHitECvKtqZ2OeuDbv"],["OUT BAD","2:08","7lRMx25D22VexgPjg1yUTq"],["LCKY NMBR 7","1:56","2dYMxKy4AUhxWHrcphM62b"],["EVERYTHING SLATT","2:27","0aos4d5NV3QAoHXRe5LEqM"],["LIFE OF A DON","4:07","1ZPTtA47Xnzhq2JIzeqXXc"],["THUG INTERLUDE","0:39","2hJ99d1rZB1GG3Q0rdGqUl"],["SAFE & SOUND","2:50","4WReL412MlVYSImPG3F4kJ"],["GALLERY","3:20","3daYSqsJWHxM5vq1ui0sMA"],["BTTR & BTTR","2:36","77LOytzfnXe7WbIXV4CTTi"],["CAYENNE","3:39","1CyPV6pM4QGd7eD8bXGlvE"],["SUNSEX","2:49","3x1O7mBbiaReF6yOy9C0zh"],["THE WORLD IS YOURS","3:05","3Nj6lRJRDFxCUEBampp2xm"]] }),
    item("released", "cover-ohk.jpg", "OH K", { type: "Single", date: "2025-01-10", spotify: "https://open.spotify.com/track/7xFHc8N6VTbwRnFgR2zsNI", length: "2:21" }),
    item("released", "cover-+++.jpg", "+++", { type: "Single", date: "2023-08-27", tracks: 2, spotify: "https://open.spotify.com/album/6T3VMdBORYoPmLLZDXrBeD", length: "4:04", songs: [["centerfold","1:54","6FMdAJWv2oAJ7kD1kSXCOA"],["yesterdays","2:10","0FLKyAV1AZn8prOiWfapJ2"]] }),
    item("released", "cover-4U.jpg", "4U", { type: "Single", date: "2023-02-23", spotify: "https://open.spotify.com/track/5RxWsJWMGnqV2Kmy64jKyg", length: "3:00" }),
    item("released", "cover-b4iwake.jpg", "B4 I WAKE", { type: "Single", date: "2022-01-15", spotify: "https://open.spotify.com/track/6m1HbRtgCYytnipMveQ1Qa", length: "3:08" }),
    item("released", "cover-bazo.jpg", "BAZO", { type: "Single", date: "2025-06-13", spotify: "https://open.spotify.com/track/0wds9FdcWk91qf8OvccvIy", length: "2:37" }),
    item("released", "cover-dontlietome.jpg", "DON'T LIE TO ME", { type: "Single", date: "2024-03-03", spotify: "https://open.spotify.com/track/5ITGw54iwZEGUR2rvmQuaF", length: "2:42" }),
    item("released", "cover-escalade.jpg", "ESCALADE", { type: "Single", date: "2024-09-06", spotify: "https://open.spotify.com/track/2gBOVTHu3xokqxRfrIiUZ6", length: "2:33" }),
    item("released", "cover-fallout.jpg", "FALLOUT", { type: "Single", date: "2024-02-06", spotify: "https://open.spotify.com/track/3nvABkoNPgEORKkZfbnX1a", length: "2:26" }),
    item("released", "cover-fkitweball.jpg", "#FKITWEBALL", { type: "Single", date: "2025-08-08", spotify: "https://open.spotify.com/track/6kOivPV5bgRaymIZm97BlD", length: "2:17" }),
    item("released", "cover-fleshwound.jpg", "FLESHWOUND", { type: "Single", date: "2023-01-23", tracks: 2, spotify: "https://open.spotify.com/album/3Exk9QyGMCuOHCQuhKVrPk", length: "4:31", songs: [["face","2:13","1WDrHFT4wlBEqbtNt8fYT6"],["take me there","2:18","5EIGVCo2fXEe9bBXFVMVGg"]] }),
    item("released", "cover-headed2me.jpg", "HEADED 2 ME", { type: "Single", date: "2022-10-14", spotify: "https://open.spotify.com/track/0g6jeYRJFqGqXrLf6wVkRn", length: "2:42" }),
    item("released", "cover-loveispain.jpg", "LOVE IS PAIN", { type: "Single", date: "2022-02-11", spotify: "https://open.spotify.com/track/5B7OEyi2TN2z7PaQiKIzQ8", length: "2:06" }),
    item("released", "cover-migo.jpg", "MIGO", { type: "Single", date: "2026-09-16", spotify: "https://open.spotify.com/album/52mUsTUOQUwCmuHjcRuxFa", length: "2:00" }),
    item("released", "cover-molly.jpg", "MOLLY", { type: "Single", date: "2026-05-22", spotify: "https://open.spotify.com/track/15amY4Xlr23uScC0aAYHsE", length: "2:29" }),
    item("released", "cover-mutedsunset.jpg", "MUTED SUNSET", { type: "Single", date: "2022-08-12", spotify: "https://open.spotify.com/track/34Wsr29zqrfbqDL5M3Y5X4", length: "4:20" }),
    item("released", "cover-newdrug.jpg", "Newdrug.", { type: "EP", date: "2025-08", tracks: 6, spotify: "https://open.spotify.com/album/4iajDNksX7WzdVMnOeOR12", length: "15 min", songs: [["Worry Bout Yours.","3:18","1VGoHd3IsmmZVaWKHJvgFI"],["BloodSucker.","2:16","3K8EcJSK3DgNqUzsrccwAX"],["Set.","2:42","2cWVjGXcLejkTbfF5coKVI"],["Kutta.","2:25","2KHhsy8094BuWhsHiKadjL"],["Not @ All.","1:57","2jRyNksinNYmAsKQbDT9qV"],["Pray2TheLord.","2:24","2KAKAuWhURdrvwY4AC7oU5"]] }),
    item("released", "cover-noir.jpg", "NOIR", { type: "Album", date: "2022-12-16", tracks: 13, spotify: "https://open.spotify.com/album/0pFOWZ6LkvO60VKQQiynTj", length: "34 min", songs: [["5% TINT","3:07","3MBgjpuX7avycF5gwENmFf"],["FLASHING CAMERAS","2:38","0yLXzQFWzCxYu5KKzfFwkH"],["LIKE ME","2:41","6Sbbjnm6hwXz7gVdeks4DJ"],["CHROME CROSS","2:24","3XorMNNemlqHd8eWkuBz7x"],["SERENE","2:16","1TvwC22FprkZkO7QyX10wH"],["IN REVERSE","3:37","0Dvp3rGsLxnDu0CWsFveYt"],["@NIGHT","1:55","1UvXJv8re5zG85JtcN8yrM"],["HI N LO","2:15","4ihamvlrD1qc0zroVjExNL"],["LUV = GUN","2:10","7JCZlGb3ZhqKXORK5oR7rc"],["BREATHE IN","3:12","02K6etdChNiCcL2p2aWXB6"],["ME MYSELF & I","2:30","3ozKqOcmgV1qAPmuw86USK"],["GONE","2:57","59sfpiISa0MmwQ5A4SzdC6"],["MAN OF THE YEAR","2:05","1N3lWFMlD57Yqr2lf4giP3"]] }),
    item("released", "cover-nostylist.jpg", "NO STYLIST", { type: "Single", date: "2022-06-11", spotify: "https://open.spotify.com/track/7Dw8BLVwCFvlzBlejJNMMR", length: "2:44" }),
    item("released", "cover-notatelfar.jpg", "NOT A TELFAR", { type: "Single", date: "2025-04-04", spotify: "https://open.spotify.com/track/2LCsaLuogbfX8PXRCkASG9", length: "2:09" }),
    item("released", "cover-ownway.jpg", "OWN WAY", { type: "Single", date: "2023-07-16", spotify: "https://open.spotify.com/track/3NvnsVeqAwvuxvIfurpjOs", length: "3:27" }),
    item("released", "cover-seduce&destroy.jpg", "SEDUCE & DESTROY", { type: "EP", date: "2023-09-30", tracks: 6, spotify: "https://open.spotify.com/album/1VpJ2yVBbNWPG3EUY2ZklI", length: "15 min", songs: [["DYING BREED","2:40","2e89pL1S45BdOi86y37BCu"],["ONE","2:38","1DxZwwuFZFEap7taFB2sPJ"],["PRAY 4 ME","2:27","3mplnBymbzczJpxgHIRW6A"],["TO DIE FOR","2:30","3ZsSiSEpehPR9uI8ED2nNF"],["BLISS","2:38","0Bcxd3btPUGFZIDO8PsI7B"],["MERCY","2:34","5AS3nYUjzju1elwyFYZNzj"]] }),
    item("released", "cover-solongandfarewell.jpg", "SO LONG, AND FAREWELL", { type: "Single", date: "2023-11-17", spotify: "https://open.spotify.com/track/14n8BjdWSU44naEkJXS04b", length: "1:59" }),
    item("released", "cover-thrax.jpg", "THRAX", { type: "Single", date: "2023-08-05", spotify: "https://open.spotify.com/track/6GU8gxv17mUAvIfwJFHOyn", length: "2:12" }),
    item("released", "cover-thread.jpg", "THREAD", { type: "Single", date: "2023-12-21", spotify: "https://open.spotify.com/track/7yW2ORlSWBU4OhP35mRqEt", length: "1:58" }),
    item("released", "cover-united.jpg", "UNITED", { type: "Single", date: "2024-12-04", spotify: "https://open.spotify.com/track/49gWjJG8E5nYG44gtki2HR", length: "2:34" }),
    item("released", "cover-untitled01.jpg", "UNTITLED 01", { type: "Single", date: "2023-05-03", tracks: 2, spotify: "https://open.spotify.com/album/3C7WZHRqsM00P9wclKRh0Y", length: "4:46", songs: [["plenty","2:40","3KZZKvj5Dub13dlK5Bt79B"],["god's hands","2:06","5rk2PdFFXJjLVyVG8Pnaln"]] }),
    item("released", "cover-untitled02.jpg", "UNTITLED 02", { type: "Single", date: "2023-08-17", tracks: 2, spotify: "https://open.spotify.com/album/1ywQxScuaboziGf19XFmCP", length: "4:46", songs: [["throne","2:31","7uekxRK7vqo6BCX27JiGPO"],["@'em","2:15","28JBZGf7PghIiPPMxUW8Es"]] }),
    item("released", "cover-worthit.jpg", "WORTH IT", { type: "Single", date: "2024-10-18", spotify: "https://open.spotify.com/track/6xeN0CvISq2KYcRfpSIkXt", length: "3:32" }),
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
    item("featuring", "cover-ultramtl.jpg", "FOR US", { date: "2025-05-30", length: "2:46", spotify: "https://open.spotify.com/track/2dcQGI4Npp5Chm9fqh1s6y" }), // album ULTRAMTL
    item("featuring", "cover-sl3.jpg", "SAY DAT", { date: "2026-08-27", spotify: "https://open.spotify.com/track/4V7M1TmkqtSslaoyNkiBqc", length: "3:16" }),
    item("featuring", "cover-sl3.jpg", "STOLE IT FROM US", { date: "2026-08-27", spotify: "https://open.spotify.com/album/4qEhH7vkMIdmmemiiVbJwa", length: "3:33" }),
    item("featuring", "cover-sl3.jpg", "TONIGHT", { date: "2026-08-27", spotify: "https://open.spotify.com/album/4ZYrx4KAZccZ8ZARbzM7yl", length: "2:08" }),
    item("featuring", "cover-myth.jpg", "MYTH", { date: "2026-07-31", spotify: "https://open.spotify.com/track/6GmEeRI8ZpD7ms3wgsVHCj", length: "2:33" }),
    item("featuring", "cover-revenge.jpg", "REVENGE", { date: "2025-09-26", spotify: "https://open.spotify.com/track/0wtx5uI5jdZdq1sMLNEoSm", length: "3:25" }),
    item("featuring", "cover-party.jpg", "PARTY", { date: "2025-05-23", spotify: "https://open.spotify.com/track/5UMzEEr9HlNrstGqTr3HUH", length: "2:17" }),
    item("featuring", "cover-wtf,.jpg", "WTF,", { date: "2026-06-26", spotify: "https://open.spotify.com/track/5G8jnYxvGRepslPwYSIRtt", length: "2:13" }),
    item("featuring", "cover-achoo.jpg", "ACHOO", { date: "2025-07-07", spotify: "https://open.spotify.com/track/51NiweTBniMEqIL2oBXdkg", length: "2:57" }),
    item("featuring", "cover-nustylez.jpg", "NU STYLEZ", { date: "2025-11-05", spotify: "https://open.spotify.com/track/3qlMqoRz4rfpyAGUGOIxT4", length: "2:15" }),
    item("featuring", "cover-hollywood.jpg", "HOLLYWOOD", { date: "2026-09-25", spotify: "https://open.spotify.com/track/0OB59xYzdzYCXxNuOb1dTg", length: "3:21" }),
    item("featuring", "cover-pureaudio.jpg", "TRUST NOBODY", { date: "2025-03-21", spotify: "https://open.spotify.com/track/6vts7QZG3uTuAbDheFCjU8", length: "2:40" }),
    item("featuring", "cover-pureaudio.jpg", "ALMIGHTY", { date: "2025-03-21", spotify: "https://open.spotify.com/track/5zQP4vqngOMggR1KZ41FWg", length: "2:31" }),
    item("featuring", "cover-pureaudio.jpg", "IF I DIE", { date: "2025-03-21", spotify: "https://open.spotify.com/track/3Q7sjxNYAsyZ6IoEohRLOD", length: "2:25" }),
    item("featuring", "cover-maybachmusic.jpg", "MAYBACH MUSIC", { date: "2026-05-22", spotify: "https://open.spotify.com/track/4oVabZw9FNB6hYBETbn8RW", length: "1:52" }),
    item("featuring", "cover-iontalk.jpg", "ION TALK", { date: "2025-05-23", spotify: "https://open.spotify.com/track/6XPANEool73QGaOt5P9Tl3", length: "2:33" }),
    item("featuring", "cover-ifu.jpg", "I.F.U", { date: "2026-08-31", spotify: "https://open.spotify.com/track/6of1Kxq08NeceaVDTjU66h", length: "2:21" }),
    item("featuring", "cover-riprichhomie.jpg", "RIP RICH HOMIE", { date: "2025-02-17", spotify: "https://open.spotify.com/track/2BvRDGH9pS5oTPE2SKJtJY", length: "2:16" }),
    item("featuring", "cover-deuces.jpg", "DEUCES", { date: "2023-02-17", spotify: "https://open.spotify.com/track/3biPWqvJT6coE3n68YOyHI", length: "2:30" }),
    item("featuring", "cover-killinme.jpg", "KILLIN ME", { date: "2025-05-22", spotify: "https://open.spotify.com/track/0SzqcHzwwc5azdvWSRx4Nx", length: "3:34" }),
    item("featuring", "cover-BOOL.jpg", "BOOL", { date: "2026-03-27", spotify: "https://open.spotify.com/track/0eXe60DQwsHQNVmMXF8VBb", length: "3:09" }),
    item("featuring", "cover-ultramtl.jpg", "FUCK UP COMMAS", { date: "2025-05-30", spotify: "https://open.spotify.com/track/6vZEqyqxsffCF0kIabbVMU", length: "2:53" }),
    item("featuring", "cover-ultramtl.jpg", "PEACE SIGN", { date: "2025-05-30", spotify: "https://open.spotify.com/track/58VxEuZ8yu1Nl8NyvR1UXs", length: "2:44" }),
    item("featuring", "cover-theycant.jpg", "THEY CANT", { date: "2025-12-05", spotify: "https://open.spotify.com/track/3PwE3WhPUww6qaOPu8XjMH", length: "2:04" }),
    item("featuring", "cover-dopamine.jpg", "DOPAMINE", { date: "2025-02-07", spotify: "https://open.spotify.com/track/77HRd95xeQOdQzEddG38i9", length: "2:53" }),
    item("featuring", "cover-50ball.jpg", "50 BALL", { date: "2022-12-23", spotify: "https://open.spotify.com/track/60TDJEPcf3J0RlvI7MLv7C", length: "2:19" }),
    item("featuring", "cover-newmoney.jpg", "NEW MONEY", { date: "2026-01-23", spotify: "https://open.spotify.com/track/22UaoZDyWZJT28KVoSw9pW", length: "3:20" }),
    item("featuring", "cover-killstreakIII.jpg", "KILL STREAK III", { date: "2023-07-03", spotify: "https://open.spotify.com/track/690AEWSN8nNDXb7pVly3GE", length: "3:47" }),
    item("featuring", "cover-killstreakIII.jpg", "DROWN", { date: "2023-07-03", spotify: "https://open.spotify.com/track/6rJnMfqo6ptUgYSblvDUjy", length: "3:00" }),
    item("featuring", "cover-hanginout.jpg", "HANGIN OUT", { date: "2024-10-18", spotify: "https://open.spotify.com/track/3GdpnNat1c7Xnn53Nc6nfu", length: "2:51" }),
    item("featuring", "cover-novocaine.jpg", "NOVOCAINE", { date: "2024-04-08", spotify: "https://open.spotify.com/track/5OZLhhMXbnyPL9RxRleepe", length: "2:43" }),
    item("featuring", "cover-realspill.jpg", "REAL SPILL", { date: "2025-08-22", spotify: "https://open.spotify.com/track/3xkmyinSS8J9IavtJhgQcH", length: "2:11" }),
    item("featuring", "cover-reaper.jpg", "REAPER", { date: "2023-11-10", spotify: "https://open.spotify.com/track/5E1XNbnId0BQnSyDrSNpyO", length: "2:09" }),
    item("featuring", "cover-moneycome&go.jpg", "MONEY COME & GO", { date: "2025-09-26", spotify: "https://open.spotify.com/track/6IIKTnvNnvEWeKUX2CkWtQ", length: "2:43" }),
    item("featuring", "cover-around.jpg", "AROUND", { date: "2023-12-02", spotify: "https://open.spotify.com/track/0v8YH8ShOSJPU6uGLh0KQO", length: "2:41" }),
    item("featuring", "cover-bleedingout.jpg", "BLEEDING OUT.", { date: "2025-11-22", spotify: "https://open.spotify.com/track/6JjXldxVzhuSoDlYo2yFT0", length: "3:09" }),
    item("featuring", "cover-poisonivy.jpg", "POISON IVY", { date: "2023-01-13", spotify: "https://open.spotify.com/track/1q3XIWLfYJwPsuKraKxEju", length: "4:06" }),
    item("featuring", "cover-endoftheday.jpg", "END OF THE DAY", { date: "2022-07-14", spotify: "https://open.spotify.com/track/4cdsrf1Q0UGb8Tsk8pegA2", length: "2:37" }),
    item("featuring", "cover-feargod.jpg", "FEAR GOD", { date: "2022-06-26", spotify: "https://open.spotify.com/track/5q2FbICck4vPVDXbh2NIhH", length: "2:49" }),
    item("featuring", "cover-glitter.jpg", "GLITTER", { date: "2024-09-29", spotify: "https://open.spotify.com/track/48MOhv7pK7cROF7rvKTljA", length: "3:00" }),
    item("featuring", "cover-onedayatatime.jpg", "ONE DAY AT A TIME", { date: "2023-02-17", spotify: "https://open.spotify.com/track/6jOXIoh7QWn9I3Mk5iVCIe", length: "3:05" }),
    item("featuring", "cover-catchindasun.jpg", "CATCHIN DA' SUN", { date: "2026-02-13", spotify: "https://open.spotify.com/track/6emwqOJR0O2NRMMInU1suf", length: "3:39" }),
    item("featuring", "cover-consummate.jpg", "CONSUMMATE", { date: "2026-08-25", spotify: "https://open.spotify.com/album/6ksxNufDq8jKEclOD0LkCw", length: "3:00" }),
    item("featuring", "cover-kencarsonntg.jpg", "KEN CARSON/N.T.G", { date: "2025-04-15", spotify: "https://open.spotify.com/track/5LXgA5QTDo87PePUuc7fjc", length: "3:36" }),
    item("featuring", "cover-bison.jpg", "BISON", { date: "2025-02-07", spotify: "https://open.spotify.com/track/19HPR73P2qLxNWQ9zRQ4cL", length: "2:15" }),
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
