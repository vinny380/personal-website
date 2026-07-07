"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import YouTubeCard from "./YouTubeCard";

export type InspoItem =
  | { type: "image"; src: string; alt: string; note?: string; href?: string }
  | { type: "video"; id: string; title: string; start?: number }
  | { type: "site"; href: string; title: string; note?: string }
  | { type: "quote"; text: string; by?: string }
  | { type: "song"; trackId: string; title?: string; art?: string };

const COL = 340; // world units; the canvas zooms, so these never change
const GAP = 20;
const NCOLS = 5;
const LAPS = 3; // laps of the collection per world tile, for variety
const MIN_Z = 0.4;
const MAX_Z = 2.5;
const LERP = 0.16;

// deterministic heights so the world size is known before anything loads —
// that's what makes seamless wrapping possible. images crop to an aspect
// drawn from a palette instead of their natural ratio.
const ASPECTS = [4 / 5, 1, 3 / 4, 4 / 3, 2 / 3];

function heightFor(item: InspoItem, rand: () => number) {
  switch (item.type) {
    case "image":
      return Math.round(COL / ASPECTS[Math.floor(rand() * ASPECTS.length)]);
    case "video":
      return Math.round((COL * 9) / 16);
    case "site":
      return 150;
    case "quote":
      return 230;
    case "song":
      return COL;
  }
}

// seeded PRNG (mulberry32): the order must look random but render
// identically on server and client, so Math.random is out
function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function layout(items: InspoItem[]) {
  const rand = mulberry32(2077);
  // each lap is its own shuffle, so no uniform repetition pattern
  const order = Array.from({ length: LAPS }, () => {
    const lap = [...items];
    for (let i = lap.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [lap[i], lap[j]] = [lap[j], lap[i]];
    }
    return lap;
  }).flat();

  const colH = Array(NCOLS).fill(GAP);
  const tiles = order.map((item, i) => {
    const h = heightFor(item, rand);
    const c = colH.indexOf(Math.min(...colH));
    const tile = { item, c, x: GAP + c * (COL + GAP), y: colH[c], h, i };
    colH[c] += h + GAP;
    return tile;
  });
  // even out the ragged column bottoms by widening gaps in short columns,
  // so vertically-wrapped copies butt up seamlessly
  const H = Math.max(...colH);
  for (let c = 0; c < NCOLS; c++) {
    const col = tiles.filter((t) => t.c === c);
    const extra = (H - colH[c]) / col.length;
    col.forEach((t, j) => (t.y += extra * (j + 1)));
  }
  return { tiles, W: GAP + NCOLS * (COL + GAP), H };
}

function Card({ item }: { item: InspoItem }) {
  switch (item.type) {
    case "image": {
      const img = (
        <figure className="group relative h-full overflow-hidden">
          <img
            src={item.src}
            alt={item.alt}
            loading="lazy"
            draggable={false}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          {item.note && (
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 pt-10 font-mono text-xs text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {item.note}
            </figcaption>
          )}
        </figure>
      );
      return item.href ? (
        <a href={item.href} target="_blank" rel="noreferrer" draggable={false}>
          {img}
        </a>
      ) : (
        img
      );
    }
    case "video":
      return <YouTubeCard id={item.id} title={item.title} start={item.start} />;
    case "site": {
      const domain = new URL(item.href).hostname.replace(/^www\./, "");
      return (
        <a
          href={item.href}
          target="_blank"
          rel="noreferrer"
          draggable={false}
          className="group flex h-full flex-col justify-center p-4"
        >
          <span className="font-mono text-xs text-faded">{domain} ↗</span>
          <span className="mt-1 block text-lg leading-snug transition-colors group-hover:text-rust">
            {item.title}
          </span>
          {item.note && (
            <span className="mt-1 line-clamp-2 text-sm text-faded">
              {item.note}
            </span>
          )}
        </a>
      );
    }
    case "quote":
      return (
        <blockquote className="flex h-full flex-col justify-center p-4">
          <p className="line-clamp-5 text-xl italic leading-snug">
            “{item.text}”
          </p>
          {item.by && (
            <footer className="mt-3 font-mono text-xs text-faded">
              — {item.by}
            </footer>
          )}
        </blockquote>
      );
    case "song":
      return (
        <a
          href={`https://open.spotify.com/track/${item.trackId}`}
          target="_blank"
          rel="noreferrer"
          draggable={false}
          className="group relative block h-full overflow-hidden"
        >
          {item.art ? (
            <img
              src={item.art}
              alt={item.title ? `${item.title} album art` : "album art"}
              loading="lazy"
              draggable={false}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-2xl text-faded">
              ♪
            </span>
          )}
          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 pt-10 font-mono text-xs text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            ♪ {item.title ?? "on spotify"}
          </span>
        </a>
      );
  }
}

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

export default function InspoCanvas({ items }: { items: InspoItem[] }) {
  const { tiles, W, H } = useMemo(() => layout(items), [items]);
  const wrap = useRef<HTMLDivElement>(null);
  const world = useRef<HTMLDivElement>(null);
  const cam = useRef({ x: 0, y: 0, z: 1 }); // what's on screen
  const target = useRef({ x: 0, y: 0, z: 1 }); // what we're gliding toward
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const moved = useRef(false);
  const copyKey = useRef("");
  const [copies, setCopies] = useState([{ ix: 0, iy: 0 }]);

  // zoom toward a screen point, keeping the world point under it fixed
  const zoomAt = (px: number, py: number, factor: number) => {
    const t = target.current;
    const z1 = clamp(t.z * factor, MIN_Z, MAX_Z);
    t.x += px / t.z - px / z1;
    t.y += py / t.z - py / z1;
    t.z = z1;
  };

  useEffect(() => {
    const el = wrap.current!;
    // start roughly centered on the world tile
    const t = target.current;
    t.x = (W - el.clientWidth) / 2;
    Object.assign(cam.current, t);

    let raf = requestAnimationFrame(function tick() {
      const c = cam.current;
      c.x += (t.x - c.x) * LERP;
      c.y += (t.y - c.y) * LERP;
      c.z += (t.z - c.z) * LERP;
      // wrap camera and target together so coordinates stay small
      const wx = Math.floor(c.x / W) * W;
      const wy = Math.floor(c.y / H) * H;
      c.x -= wx; t.x -= wx;
      c.y -= wy; t.y -= wy;
      world.current!.style.transform = `scale(${c.z}) translate(${-c.x}px, ${-c.y}px)`;

      // which world-tile copies does the viewport touch?
      const next: { ix: number; iy: number }[] = [];
      const x1 = c.x + el.clientWidth / c.z;
      const y1 = c.y + el.clientHeight / c.z;
      for (let ix = Math.floor(c.x / W); ix * W < x1; ix++)
        for (let iy = Math.floor(c.y / H); iy * H < y1; iy++)
          next.push({ ix, iy });
      const key = next.map((n) => `${n.ix},${n.iy}`).join(";");
      if (key !== copyKey.current) {
        copyKey.current = key;
        setCopies(next);
      }
      raf = requestAnimationFrame(tick);
    });

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      if (e.ctrlKey || e.metaKey) {
        // trackpad pinch / ctrl+scroll
        zoomAt(
          e.clientX - rect.left,
          e.clientY - rect.top,
          Math.exp(-e.deltaY * 0.01)
        );
      } else {
        target.current.x += e.deltaX / target.current.z;
        target.current.y += e.deltaY / target.current.z;
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });

    const onKey = (e: KeyboardEvent) => {
      const t2 = target.current;
      const step = 120 / t2.z;
      if (e.key === "ArrowLeft") t2.x -= step;
      else if (e.key === "ArrowRight") t2.x += step;
      else if (e.key === "ArrowUp") t2.y -= step;
      else if (e.key === "ArrowDown") t2.y += step;
      else if (e.key === "+" || e.key === "=")
        zoomAt(el.clientWidth / 2, el.clientHeight / 2, 1.2);
      else if (e.key === "-")
        zoomAt(el.clientWidth / 2, el.clientHeight / 2, 1 / 1.2);
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
  }, [W, H]);

  const onPointerDown = (e: React.PointerEvent) => {
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1) moved.current = false;
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    const t = target.current;
    const pts = pointers.current;
    if (pts.size === 1) {
      const dx = e.clientX - prev.x;
      const dy = e.clientY - prev.y;
      if (Math.abs(dx) + Math.abs(dy) > 3) moved.current = true;
      t.x -= dx / t.z;
      t.y -= dy / t.z;
    } else if (pts.size === 2) {
      // pinch: pan with the midpoint, zoom with the spread
      moved.current = true;
      const other = [...pts.entries()].find(([id]) => id !== e.pointerId)![1];
      const d0 = Math.hypot(prev.x - other.x, prev.y - other.y);
      const d1 = Math.hypot(e.clientX - other.x, e.clientY - other.y);
      const rect = wrap.current!.getBoundingClientRect();
      t.x -= (e.clientX - prev.x) / 2 / t.z;
      t.y -= (e.clientY - prev.y) / 2 / t.z;
      if (d0 > 0)
        zoomAt(
          (e.clientX + other.x) / 2 - rect.left,
          (e.clientY + other.y) / 2 - rect.top,
          d1 / d0
        );
    }
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
  };

  const onPointerEnd = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
  };

  return (
    <div
      ref={wrap}
      className="rise fixed inset-0 z-0 touch-none select-none overflow-hidden cursor-grab active:cursor-grabbing"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      // a drag is not a click: swallow clicks that follow a pan
      onClickCapture={(e) => {
        if (moved.current) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
    >
      <div ref={world} className="absolute left-0 top-0 origin-top-left will-change-transform">
        {copies.map(({ ix, iy }) => (
          <div
            key={`${ix},${iy}`}
            className="absolute left-0 top-0"
            style={{ transform: `translate(${ix * W}px, ${iy * H}px)` }}
          >
            {tiles.map((t) => (
              <div
                key={t.i}
                className="absolute"
                style={{ left: t.x, top: t.y, width: COL, height: t.h }}
              >
                <Card item={t.item} />
              </div>
            ))}
          </div>
        ))}
      </div>
      {/* fade the canvas out under the floating header */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-paper from-60% via-paper/75 via-80% to-transparent" />
      {/* zoom controls for mouse users; trackpads pinch, keyboards +/- */}
      <div className="absolute bottom-5 right-5 flex overflow-hidden rounded-full border border-ink/15 bg-paper font-mono text-sm">
        <button
          type="button"
          aria-label="Zoom out"
          className="cursor-pointer px-3.5 py-1.5 transition-colors hover:text-rust"
          onClick={() =>
            zoomAt(
              wrap.current!.clientWidth / 2,
              wrap.current!.clientHeight / 2,
              1 / 1.3
            )
          }
        >
          −
        </button>
        <button
          type="button"
          aria-label="Zoom in"
          className="cursor-pointer border-l border-ink/15 px-3.5 py-1.5 transition-colors hover:text-rust"
          onClick={() =>
            zoomAt(
              wrap.current!.clientWidth / 2,
              wrap.current!.clientHeight / 2,
              1.3
            )
          }
        >
          +
        </button>
      </div>
    </div>
  );
}
