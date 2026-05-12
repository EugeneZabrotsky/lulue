"use client";

import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";

type GalleryItem = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

type ChapterConfig = {
  id: string;
  title: string;
  /** Brak `items` — tylko nagłówek (np. przejście do mapy). */
  items?: [GalleryItem, GalleryItem];
};

const CHAPTERS: ChapterConfig[] = [
  {
    id: "swiezosc",
    title: "Świeżość",
    items: [
      {
        src: "/references/flowers/1/IMG_8998.jpg",
        width: 2268,
        height: 4032,
        alt: "Kwiaty w wąskiej kompozycji kadru",
      },
      {
        src: "/references/flowers/1/seasonal-blooms.jpg",
        width: 3024,
        height: 4032,
        alt: "Kwiaty sezonowe",
      },
    ],
  },
  {
    id: "estetyka",
    title: "Estetyka",
    items: [
      {
        src: "/references/flowers/2/IMG_1665.jpg",
        width: 2268,
        height: 4032,
        alt: "Wysoki bukiet, kompozycja pionowa",
      },
      {
        src: "/references/flowers/2/IMG_3308.jpg",
        width: 4032,
        height: 3024,
        alt: "Kompozycja kwiatów w stonowanych tonach",
      },
    ],
  },
  {
    id: "emocje",
    title: "Emocje",
    items: [
      {
        src: "/references/flowers/3/IMG_5456.jpg",
        width: 4032,
        height: 3024,
        alt: "Kwiaty w butiku Lulué",
      },
      {
        src: "/references/flowers/3/IMG_3334.jpg",
        width: 5712,
        height: 4284,
        alt: "Bukiet w ciepłym świetle, Lulué",
      },
    ],
  },
  {
    id: "kwiaty",
    title: "Kwiaty",
  },
];

/** Sticky white block height — shorter so after the word hits full opacity, photos arrive quickly. */
const PIN_SCROLL_VH = 175;

/**
 * Normalized progress through the sticky region (from useScroll start/end).
 * White → scroll → word fades in → brief hold at full opacity → sticky releases (scroll to photos).
 */
const WORD_HOLD_START = 0.06;
/** Opacity reaches 1 here; only ~4% of pin scroll remains before the section ends. */
const WORD_FADE_IN_END = 0.96;

function easeOutCubic(t: number) {
  const x = Math.min(Math.max(t, 0), 1);
  return 1 - (1 - x) ** 3;
}

function wordOpacityFromProgress(p: number, reduceMotion: boolean) {
  if (reduceMotion) {
    if (p < WORD_HOLD_START) return 0;
    return 1;
  }

  if (p < WORD_HOLD_START) return 0;
  if (p < WORD_FADE_IN_END) {
    return easeOutCubic((p - WORD_HOLD_START) / (WORD_FADE_IN_END - WORD_HOLD_START));
  }
  return 1;
}

function MosaicCell({
  item,
  sizes,
  priority,
}: {
  item: GalleryItem;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <figure className="relative m-0 w-full min-w-0 overflow-hidden bg-zinc-900/30">
      {/* Full width of column; shared aspect ⇒ similar heights in a row; object-cover allows crop */}
      <div className="relative w-full aspect-[3/4] md:aspect-[5/6]">
        <Image
          src={item.src}
          alt={item.alt}
          fill
          className="object-cover"
          sizes={sizes}
          priority={priority === true}
        />
      </div>
    </figure>
  );
}

function EditorialChapter({
  chapter,
  chapterIndex,
}: {
  chapter: ChapterConfig;
  chapterIndex: number;
}) {
  const reduceMotion = useReducedMotion() === true;
  const pinRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: pinRef,
    offset: ["start start", "end start"],
  });

  const wordOpacity = useTransform(scrollYProgress, (p) =>
    wordOpacityFromProgress(p, reduceMotion),
  );

  return (
    <>
      <div
        ref={pinRef}
        className="relative w-full"
        style={{ minHeight: `${PIN_SCROLL_VH}vh` }}
      >
        <div className="sticky top-0 flex h-[100dvh] min-h-screen w-full flex-col items-center justify-center bg-white px-6">
          <motion.h2
            id={`${chapter.id}-heading`}
            className="text-center font-[family-name:var(--font-serif)] text-5xl font-light tracking-tight text-zinc-950 sm:text-7xl md:text-8xl"
            style={{ opacity: wordOpacity }}
          >
            {chapter.title}
          </motion.h2>
        </div>
      </div>

      {chapter.items ? (
        <div className="w-full bg-zinc-200">
          <div className="grid w-full grid-cols-1 gap-px md:grid-cols-2">
            <div className="min-w-0">
              <MosaicCell
                item={chapter.items[1]}
                sizes="(max-width:768px) 100vw, 50vw"
                priority={chapterIndex === 0}
              />
            </div>
            <div className="min-w-0">
              <MosaicCell
                item={chapter.items[0]}
                sizes="(max-width:768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export function EditorialChapters() {
  return (
    <div id="gallery" className="w-full" aria-label="Galeria kwiatów">
      {CHAPTERS.map((chapter, chapterIndex) => (
        <section
          key={chapter.id}
          aria-labelledby={`${chapter.id}-heading`}
          className="w-full bg-white"
        >
          <EditorialChapter chapter={chapter} chapterIndex={chapterIndex} />
        </section>
      ))}
    </div>
  );
}
