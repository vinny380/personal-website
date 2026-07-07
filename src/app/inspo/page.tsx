import InspoCanvas, { type InspoItem } from "@/components/InspoCanvas";

export const metadata = { title: "inspo — Vinny Purgato" };

// anything goes: videos, photos, sites, games, quotes, songs.
// add new items at the top so the freshest inspo lands first.
const items: InspoItem[] = [
  {
    type: "song",
    trackId: "03XjpGGdsIPouALXem2Cku",
  },
  {
    type: "song",
    trackId: "3CmHvyZQQAGkKkTjTBFWN6",
  },
  {
    type: "video",
    id: "Krc1t4HU8GI",
    title: "Metal Gear Solid V: The Phantom Pain — E3 2014 trailer",
  },
  {
    type: "video",
    id: "W2Wnvvj33Wo",
    title: "The Last of Us Part II — reveal trailer",
  },
  {
    type: "video",
    id: "i2nuHEGhwiw",
    title: "Death Stranding — E3 2016 reveal trailer",
  },
  {
    type: "video",
    id: "w7UNzU0gbm0",
    title: "Mateus Asato — Interlude of Beautiful Things",
  },
  {
    type: "video",
    id: "sX1Y2JMK6g8",
    title: "SpaceX Falcon Heavy — an engineering masterpiece",
  },
  {
    type: "video",
    id: "zkcQGxtTdxk",
    title: "Rodrigo Gouveia — That’s What I Like (Bruno Mars cover)",
  },
  {
    type: "video",
    id: "_L-Ni7bFAHg",
    start: 580,
    title: "Roger Gracie vs Buchecha — Gracie Pro 2017",
  },
  {
    type: "video",
    id: "DMUsfdibgCc",
    title: "Charles Oliveira — paralyzed by one punch (documentary)",
  },
  {
    type: "video",
    id: "t4gzmbqoGhU",
    title: "Charles Oliveira wins the UFC lightweight title",
  },
  {
    type: "video",
    id: "mWjv5lfe4eY",
    title: "Anderson Silva vs Forrest Griffin — full fight",
  },
  {
    type: "video",
    id: "tzNpq0EbiHE",
    title: "Anderson Silva’s KO of Forrest Griffin — UFC 101",
  },
  {
    type: "site",
    href: "https://paulgraham.com/nerds.html",
    title: "Why Nerds are Unpopular",
    note: "paul graham on why smart kids have a rough time in school",
  },
  {
    type: "site",
    href: "https://paulgraham.com/gba.html",
    title: "The Word “Hacker”",
    note: "pg on hacking as a spirit, not a crime",
  },
  {
    type: "site",
    href: "https://paulgraham.com/ds.html",
    title: "Do Things that Don’t Scale",
    note: "the essay every founder gets pointed to eventually",
  },
  {
    type: "video",
    id: "8fcSviC7cRM",
    title: "Steve Ballmer — developers, developers, developers (1999)",
  },
  {
    type: "video",
    id: "_WW2JWIv6G8",
    title: "Steve Ballmer — running around the stage like a maniac",
  },
  {
    type: "video",
    id: "GtaxU6DZvLs",
    title: "Elon Musk — work twice as hard as others",
  },
  {
    type: "video",
    id: "tdf3luOCNks",
    title: "Elon Musk — the 5-step algorithm for running companies",
  },
  {
    type: "video",
    id: "G5Lvc1a76dU",
    title: "Jimi Hendrix — Hey Joe, live at Monterey 1967",
  },
  {
    type: "video",
    id: "8Q8CONlpOoo",
    title: "Mateus Asato — yes, I am playing a Fender",
  },
  {
    type: "video",
    id: "dULV5bSCj8s",
    start: 65,
    title: "Mateus Asato — Great Is Thy Faithfulness / Because He Lives",
  },
  {
    type: "video",
    id: "rjSl0RbSkI0",
    start: 387,
    title: "Mateus Asato Trio — North & Kyoto jam, live in Seoul",
  },
  {
    type: "site",
    href: "https://www.cosmos.so",
    title: "Cosmos",
    note: "the calmest way to collect what inspires you — this board’s spirit animal",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    alt: "Snowy mountain peaks rising above a sea of clouds at sunrise",
    note: "above the clouds",
  },
  {
    type: "quote",
    text: "Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away.",
    by: "Antoine de Saint-Exupéry",
  },
  {
    type: "video",
    id: "UF8uR6Z6KLc",
    title: "Steve Jobs — 2005 Stanford commencement address",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
    alt: "Sunlight filtering through tall trees onto a forest path",
  },
  {
    type: "song",
    trackId: "3xKsf9qdS1CyvXSMEid6g8",
  },
  {
    type: "site",
    href: "https://teenage.engineering",
    title: "teenage engineering",
    note: "hardware that feels like a toy and a tool at the same time",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=800&q=80",
    alt: "The Milky Way glowing in a dark night sky",
    note: "scale",
  },
  {
    type: "quote",
    text: "The best way to predict the future is to invent it.",
    by: "Alan Kay",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&q=80",
    alt: "Close-up of calm dark ocean water at dusk",
  },
];

// resolve song titles + album art at build time via spotify's public oembed,
// so the canvas can render songs as plain tiles (embedded players would
// swallow the pan/zoom gestures)
async function withSongArt(list: InspoItem[]): Promise<InspoItem[]> {
  return Promise.all(
    list.map(async (item) => {
      if (item.type !== "song" || item.art) return item;
      try {
        const res = await fetch(
          `https://open.spotify.com/oembed?url=https://open.spotify.com/track/${item.trackId}`
        );
        const { title, thumbnail_url } = await res.json();
        return { ...item, title, art: thumbnail_url };
      } catch {
        return item; // tile falls back to a ♪ placeholder
      }
    })
  );
}

export default async function Inspo() {
  return <InspoCanvas items={await withSongArt(items)} />;
}
