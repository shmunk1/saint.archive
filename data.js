// All site content lives here. Replace the "search" links with real direct links.
// For a clip: put the YouTube ID in `yt` (e.g. "dQw4w9WgXcQ") -> thumbnail + direct link are automatic.
const q = encodeURIComponent;
const spotify = (t) => `https://open.spotify.com/search/${q("1300SAINT " + t)}`;
const sc = (t) => `https://soundcloud.com/search?q=${q("1300SAINT " + t)}`;
const ytSearch = (t) => `https://www.youtube.com/results?search_query=${q("1300SAINT " + t)}`;

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
      spotify: spotify(""),
      soundcloud: sc(""),
      youtube: ytSearch(""),
    },
  },
  // type: Mixtape | Album | EP | Single
  releases: [
    { title: "Newdrug2.", type: "EP", year: "2026", note: "6 tracks", spotify: spotify("Newdrug2."), soundcloud: sc("Newdrug2.") },
    { title: "SAVIOR", type: "Album", year: "2025", note: "", spotify: spotify("SAVIOR"), soundcloud: sc("SAVIOR") },
    { title: "SAINT SEASON", type: "EP", year: "2025", note: "Tribute to Slime Season 3", spotify: spotify("SAINT SEASON"), soundcloud: sc("SAINT SEASON") },
    { title: "ALL HAIL", type: "Mixtape", year: "", note: "Includes EVERYTHING SLATT, SAFE & SOUND, VENOM", spotify: spotify("ALL HAIL"), soundcloud: sc("ALL HAIL") },
    { title: "OH K", type: "Single", year: "", note: "The track that started it all", spotify: spotify("OH K"), soundcloud: sc("OH K") },
  ],
  // features: artist + title (to complete)
  features: [
    { artist: "Young Thug", title: "UY Scuti (project)", spotify: spotify("Young Thug UY Scuti"), soundcloud: sc("Young Thug") },
  ],
  // clips: title, yt (YouTube ID, optional)
  clips: [
    { title: "OH K", yt: "" },
    { title: "EVERYTHING SLATT", yt: "" },
    { title: "SAFE & SOUND", yt: "" },
    { title: "VENOM", yt: "" },
  ],
};
DATA.clips.forEach((c) => {
  c.url = c.yt ? `https://www.youtube.com/watch?v=${c.yt}` : ytSearch(c.title);
  c.thumb = c.yt ? `https://img.youtube.com/vi/${c.yt}/hqdefault.jpg` : "";
});
