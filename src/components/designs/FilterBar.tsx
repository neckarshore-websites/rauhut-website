"use client";

import { useState } from "react";
import { Design } from "@/app/designs/data";
import ShuffleTour from "./ShuffleTour";

interface FilterBarProps {
  tags: string[];
  activeTag: string;
  onTagChange: (tag: string) => void;
  designs: Design[];
}

export default function FilterBar({
  tags,
  activeTag,
  onTagChange,
  designs,
}: FilterBarProps) {
  const [tourOpen, setTourOpen] = useState(false);

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 py-4">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => onTagChange(tag)}
            className={`
              font-mono text-xs px-3 py-1.5 rounded border
              transition-colors capitalize tracking-wide
              ${
                activeTag === tag
                  ? "border-brand-amber text-brand-amber bg-brand-amber/10"
                  : "border-border text-text-muted hover:border-border-strong hover:text-text"
              }
            `}
          >
            {tag}
          </button>
        ))}

        {/* Shuffle tour button — right-aligned */}
        <button
          onClick={() => setTourOpen(true)}
          className="
            ml-auto font-mono text-xs px-3 py-1.5 rounded border
            border-white/20 bg-[#CC1A00] text-white
            hover:bg-[#AA1400] transition-colors
            animate-[shuffle-pulse_2.8s_ease-in-out_infinite]
          "
        >
          🔀 Tour
        </button>
      </div>

      {tourOpen && (
        <ShuffleTour designs={designs} onClose={() => setTourOpen(false)} />
      )}
    </>
  );
}
