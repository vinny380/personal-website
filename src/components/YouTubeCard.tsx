"use client";

import { useState } from "react";

export default function YouTubeCard({
  id,
  title,
  start,
}: {
  id: string;
  title: string;
  start?: number;
}) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1${start ? `&start=${start}` : ""}`}
        title={title}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        className="h-full w-full"
      />
    );
  }

  // minimal tile: just the thumbnail — title and play affordance on hover
  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play ${title}`}
      className="group relative block h-full w-full cursor-pointer overflow-hidden text-left"
    >
      <img
        src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
        alt=""
        loading="lazy"
        draggable={false}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      />
      <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 pl-0.5 text-sm text-white backdrop-blur-sm">
          ▶
        </span>
      </span>
      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 pt-10 font-mono text-xs text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="line-clamp-2">{title}</span>
      </span>
    </button>
  );
}
