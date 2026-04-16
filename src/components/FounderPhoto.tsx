"use client";

import { useState } from "react";
import Image from "next/image";

const PHOTOS = [
  {
    src: "/images/german-rauhut-founder-bw.png",
    alt: "German Rauhut — Portrait in Schwarz-Weiss",
  },
  {
    src: "/images/german-rauhut-founder-bw2.png",
    alt: "German Rauhut — Portrait in Schwarz-Weiss (Variante)",
  },
];

export default function FounderPhoto() {
  const [index, setIndex] = useState(0);
  const photo = PHOTOS[index];

  return (
    <button
      type="button"
      onClick={() => setIndex((i) => (i + 1) % PHOTOS.length)}
      className="group relative shrink-0 overflow-hidden rounded-2xl transition-opacity hover:opacity-95 focus-visible:opacity-95"
      aria-label="Portrait wechseln"
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        width={180}
        height={180}
        sizes="(min-width: 640px) 180px, 140px"
        className="h-[140px] w-[140px] rounded-2xl object-cover sm:h-[180px] sm:w-[180px]"
        priority
      />
    </button>
  );
}
