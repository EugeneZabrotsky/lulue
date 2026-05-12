"use client";

import Image from "next/image";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { SiteFooter } from "@/components/SiteFooter";

const SWITCH_THRESHOLD = 0.48;

// Initial editorial reveal: the foreground-flower occluder (at z-[16])
// fades out over [0, LOGO_FRONT_THRESHOLD]. The animated logo sits at
// z-[15] (below the occluder) until p reaches the threshold so it stays
// fully visible through transparent PNG areas; then it moves to z-[29]
// above the white plate (z-[28]) so black pixels do not composite gray.
// ~8% of hero scroll: a shorter range reads as a sudden snap to fully
// opaque after the slow mount fade; eased + wider span fixes that.
const LOGO_FRONT_THRESHOLD = 0.08;

// Intrinsic pixel size of `public/references/lulue.svg` (tight crop, matches width/height attrs).
const LOGO_INTRINSIC_W = 255.52893;
const LOGO_INTRINSIC_H = 117.10654;
// Aspect ratio height / width — drives header plate height vs small-logo width.
const LOGO_RATIO = LOGO_INTRINSIC_H / LOGO_INTRINSIC_W;

// Hero wordmark CSS width in vw (`w-[…vw]`). Must stay in sync with `finalScale`.
const HERO_LOGO_WIDTH_VW = 86.4;

// Small (header) logo width in rem — reduced after tight SVG crop so the mark
// does not read oversized vs the nav.
const SMALL_LOGO_REM_MOBILE = 3.42;
const SMALL_LOGO_REM_DESKTOP = 3.9;
const REM_PX = 16;

// Tailwind metrics used as the "natural" content box before the 30 %
// height reduction is applied to the plate. Changing the header text
// size / padding utilities? Update these too so the math stays in sync.
const HEADER_PT_PX_MOBILE = 28; // pt-7
const HEADER_PT_PX_DESKTOP = 36; // pt-9
const HEADER_PB_PX_MOBILE = 16; // pb-4
const HEADER_PB_PX_DESKTOP = 20; // pb-5
const TEXT_PX_MOBILE = 0.65 * REM_PX; // text-[0.65rem]
const TEXT_PX_DESKTOP = 0.7 * REM_PX; // text-[0.7rem]

// Plate height = natural padded content box × this factor. 0.7 == −30 %.
const PLATE_HEIGHT_FACTOR = 0.7;

// Plate fade-in interval. Middle keyframe tracks `LOGO_FRONT_THRESHOLD` (occluder
// / logo stacking). Third keyframe is chosen so Δ vs middle stays ~0.70 scroll units
// after threshold bumps (e.g. 0.08 → 0.78). Default `useTransform` clamp keeps the
// output locked at 1 for the rest of the hero (and beyond) so the plate
// never re-fades once it has reached full opacity.
const PLATE_RANGE: [number, number, number] = [0, LOGO_FRONT_THRESHOLD, 0.78];
/** Scroll progress at which the plate ramp reaches full opacity (last input of PLATE_RANGE). */
const PLATE_FULL_PROGRESS = PLATE_RANGE[2];

// One-shot hero entrance (initial load / full refresh only — tied to mount, not re-renders).
// Standard smooth ease-out — the previous `[0.22,1,0.36,1]` hugged y≈1 early and made
// the last opacity ticks feel like a hard step.
const LOGO_ENTRANCE_EASE = [0.4, 0, 0.2, 1] as const;
const LOGO_ENTRANCE_DURATION = 2.72;
/** After scroll progress syncs (avoids a one-frame flash), fades foreground in instead of snapping. */
const FOREGROUND_REVEAL_DURATION_S = 0.62;
const PLATE_OPACITY_OUTPUT: [number, number, number] = [0, 0, 1];
const LINK_COLOR_OUTPUT: [string, string, string] = [
  "rgba(255, 255, 255, 1)",
  "rgba(255, 255, 255, 1)",
  "rgba(24, 24, 27, 1)",
];
const LINK_COLOR_SOLID = LINK_COLOR_OUTPUT[2];

// Narrow viewports: light halo so the mark reads over the hero (below full-strength stacking).
const LOGO_MOBILE_OUTLINE_CLASS =
  "max-sm:[filter:drop-shadow(0_0_1px_rgba(255,255,255,0.62))_drop-shadow(0_0_5px_rgba(255,255,255,0.2))]";

// Mobile-only: foreground cutout does not span full width so a clear band remains
// beside the bouquet (logo reads over background + transparent logo art).
const HERO_FOREGROUND_FRAME_CLASS =
  "absolute inset-y-0 right-0 w-[62%] sm:inset-0 sm:w-auto";
/** Very light blur on phones — matches background + both foreground stacks. */
const HERO_MOBILE_IMAGE_BLUR_CLASS = "max-sm:blur-xs";
const HERO_BACKGROUND_IMAGE_CLASS = `object-cover ${HERO_MOBILE_IMAGE_BLUR_CLASS}`;
const HERO_FOREGROUND_IMAGE_CLASS =
  `object-cover object-right sm:object-center ${HERO_MOBILE_IMAGE_BLUR_CLASS}`;

/** Short link → Lulué - Flower Boutique (Warsaw). Embed `pb` from share/embed flow; works without Maps API key. */
const LULUE_GOOGLE_MAPS_URL = "https://maps.app.goo.gl/xtjLeNa3KoSQZw6M8";
const LULUE_GOOGLE_MAP_EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2445.936!2d20.9584617!3d52.1980492!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471933ca4d3a2b51%3A0xdcdb45249d80dea4!2sLULU%C3%89%20FLOWERS!5e0!3m2!1spl!2spl!4v1736640000000!5m2!1spl!2spl";

export function Hero({ gallery }: { gallery?: ReactNode }) {
  const reduceMotion = useReducedMotion() === true;
  const heroSectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroSectionRef,
    offset: ["start start", "end start"],
  });

  const [phase, setPhase] = useState<"large" | "small">("large");
  /** Framer scroll progress defaults to 0 for one frame; avoids a full-opacity foreground flash after refresh / scroll restore. */
  const [heroForegroundSynced, setHeroForegroundSynced] = useState(false);
  // Latch: once the plate ramp has completed, keep the header chrome opaque /
  // dark-text forever. Some browsers / scroll timelines can report transient
  // dips in element-linked scroll progress after the hero leaves view; without
  // this latch the white plate appears to "fade back in from transparent" on
  // long pages (looks like the header clears again mid-document).
  const [plateRampComplete, setPlateRampComplete] = useState(false);
  const plateRampDoneRef = useRef(false);
  // Resize-driven (not scroll-driven) viewport state. Needed because the
  // animated logo lives in viewport coordinates while the final size is
  // expressed in rem — we convert rem → vw on every resize.
  const [viewport, setViewport] = useState({
    width: 1280,
    height: 800,
    isSm: true,
  });

  useEffect(() => {
    const update = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
        isSm: window.innerWidth >= 640,
      });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (scrollYProgress.get() >= PLATE_FULL_PROGRESS) {
      plateRampDoneRef.current = true;
      setPlateRampComplete(true);
    }
  }, [scrollYProgress]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setPhase(v >= SWITCH_THRESHOLD ? "small" : "large");
    if (!plateRampDoneRef.current && v >= PLATE_FULL_PROGRESS) {
      plateRampDoneRef.current = true;
      setPlateRampComplete(true);
    }
  });

  useLayoutEffect(() => {
    let fallbackId = 0;
    const revealForegroundLayers = () => {
      window.clearTimeout(fallbackId);
      setHeroForegroundSynced(true);
    };

    const unsub = scrollYProgress.on("change", revealForegroundLayers);

    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        try {
          const y =
            window.scrollY ||
            document.documentElement.scrollTop ||
            document.body.scrollTop ||
            0;
          if (y < 2) revealForegroundLayers();
        } catch {
          revealForegroundLayers();
        }
      });
    });

    window.addEventListener("pageshow", revealForegroundLayers);
    const fallbackMs = 250;
    fallbackId = window.setTimeout(revealForegroundLayers, fallbackMs);

    return () => {
      unsub();
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      window.removeEventListener("pageshow", revealForegroundLayers);
      window.clearTimeout(fallbackId);
    };
  }, [scrollYProgress]);

  const smallLogoRem = viewport.isSm
    ? SMALL_LOGO_REM_DESKTOP
    : SMALL_LOGO_REM_MOBILE;
  const smallLogoWidthPx = smallLogoRem * REM_PX;
  const smallLogoHeightPx = smallLogoWidthPx * LOGO_RATIO;

  const headerPtPx = viewport.isSm
    ? HEADER_PT_PX_DESKTOP
    : HEADER_PT_PX_MOBILE;
  const headerPbPx = viewport.isSm
    ? HEADER_PB_PX_DESKTOP
    : HEADER_PB_PX_MOBILE;
  const textPx = viewport.isSm ? TEXT_PX_DESKTOP : TEXT_PX_MOBILE;

  // Natural padded content box (the height the plate would have with
  // symmetric-ish Tailwind padding around the tallest of text/logo).
  // The actual plate is 30 % shorter than this so the bar reads slimmer.
  const naturalContentBoxPx =
    headerPtPx + Math.max(textPx, smallLogoHeightPx) + headerPbPx;
  const plateHeightPx = naturalContentBoxPx * PLATE_HEIGHT_FACTOR;
  const plateCenterPx = plateHeightPx / 2;

  // Both the menu text (via `items-center` on a `h-full` header) and the
  // small logo are centered on the plate's vertical midline.
  const smallLogoTopPx = plateCenterPx - smallLogoHeightPx / 2;

  // scale × displayed width ((HERO_LOGO_WIDTH_VW/100) × viewport) must equal
  // `smallLogoWidthPx` at the switch threshold to avoid a jump.
  const heroLogoWidthPx = (HERO_LOGO_WIDTH_VW / 100) * viewport.width;
  const finalScale =
    viewport.width > 0 ? smallLogoWidthPx / heroLogoWidthPx : 0.02;

  const heroLogoScale = useTransform(
    scrollYProgress,
    [0, SWITCH_THRESHOLD],
    [1, finalScale],
  );

  const flowerScrollY = useTransform(
    scrollYProgress,
    [0, 1],
    ["0vh", "-100vh"],
  );

  // Inner translateY that lands the animated logo's center exactly on
  // `plateCenterPx` from the viewport top at SWITCH_THRESHOLD,
  // counteracting the outer `flowerScrollY` translate so the visual
  // position is stable after the threshold (the logo is then hidden
  // anyway via `phase === "small"`, but the math has to be seamless at
  // the crossover so there's no jump under the small fixed copy).
  const logoY = useTransform(scrollYProgress, (p) => {
    const clamped = Math.min(Math.max(p, 0), 1);
    const t = Math.min(clamped / SWITCH_THRESHOLD, 1);
    const animOffsetPx = (plateCenterPx - viewport.height / 2) * t;
    const compensationPx = clamped * viewport.height;
    return animOffsetPx + compensationPx;
  });

  /** Keeps z-order in Framer’s motion pipeline with the occluder fade (avoids React state lag vs opacity). */
  const logoStackZIndex = useTransform(scrollYProgress, (p) =>
    p >= LOGO_FRONT_THRESHOLD ? 29 : 15,
  );

  // Ease-out vs linear: the last stretch toward “fully clear” slows down so the logo
  // does not pop to full opacity in the final ~5% of this window.
  const occluderOpacity = useTransform(scrollYProgress, (p) => {
    const end = LOGO_FRONT_THRESHOLD;
    if (p <= 0) return 1;
    if (p >= end) return 0;
    const t = p / end;
    const eased = 1 - (1 - t) ** 3;
    return 1 - eased;
  });
  const foregroundLayerOpacity = useTransform(
    scrollYProgress,
    [0, 1],
    [1, 0.1],
  );
  // While the fixed occluder is opaque it already paints the PNG; keep the
  // in-section copy transparent and crossfade in with (1 − occluder) so we
  // never stack two full-opacity bouquets (mobile especially: misalignment +
  // parallax looked like blur/double vision at the first scroll ticks).
  const inSectionForegroundOpacity = useTransform(
    [occluderOpacity, foregroundLayerOpacity],
    ([o, fg]: number[]) => (1 - o) * fg,
  );

  // White plate and link color share the same (deliberately slow) ramp.
  // Default `useTransform` clamp keeps both outputs locked at the final
  // keyframe value once `scrollYProgress` exceeds the last input — so
  // the plate fill stays at rgba(255,255,255,0.5) (and the links stay at their
  // final dark color) for the rest of the hero and forever after.
  const plateOpacity = useTransform(
    scrollYProgress,
    PLATE_RANGE,
    PLATE_OPACITY_OUTPUT,
  );
  const linkColor = useTransform(
    scrollYProgress,
    PLATE_RANGE,
    LINK_COLOR_OUTPUT,
  );

  // Plate fill/border alpha track `plateOpacity` but keep the layer at opacity 1.
  // Combining `opacity` on the whole node with `bg-white/50` double-multiplies
  // alpha and breaks smooth compositing with the hero logo stack.
  const plateFill = useTransform(plateOpacity, (o) => {
    const a = viewport.isSm ? 0.5 * o : o;
    return `rgba(255, 255, 255, ${a})`;
  });
  const plateBorderBottom = useTransform(plateOpacity, (o) => {
    const a = viewport.isSm ? 0.6 * o : o;
    return `rgba(228, 228, 231, ${a})`;
  });

  const logoEntranceTransition = reduceMotion
    ? { duration: 0 }
    : {
        duration: LOGO_ENTRANCE_DURATION,
        ease: LOGO_ENTRANCE_EASE,
      };

  const foregroundRevealTransition = reduceMotion
    ? { duration: 0 }
    : {
        duration: FOREGROUND_REVEAL_DURATION_S,
        ease: LOGO_ENTRANCE_EASE,
      };

  return (
    <>
      <motion.div
        className="pointer-events-none fixed inset-x-0 top-0 z-[28] border-b border-transparent"
        style={{
          backgroundColor: plateRampComplete
            ? viewport.isSm
              ? "rgba(255, 255, 255, 0.5)"
              : "rgb(255, 255, 255)"
            : plateFill,
          borderBottomColor: plateRampComplete
            ? viewport.isSm
              ? "rgba(228, 228, 231, 0.6)"
              : "rgb(228, 228, 231)"
            : plateBorderBottom,
          height: `${plateHeightPx}px`,
        }}
        aria-hidden
      />

      <header
        className="fixed inset-x-0 top-0 z-[30] px-5 sm:px-10"
        style={{ height: `${plateHeightPx}px` }}
      >
        <motion.div
          className="mx-auto flex h-full w-full max-w-6xl items-center text-[0.65rem] leading-none font-medium tracking-[0.32em] uppercase sm:text-[0.7rem]"
          style={{
            color: plateRampComplete ? LINK_COLOR_SOLID : linkColor,
          }}
        >
          <nav className="flex w-full flex-wrap items-center justify-between gap-x-6 gap-y-2">
            <a
              className="opacity-90 transition-opacity hover:opacity-100"
              href="#footer"
            >
              Kontakt
            </a>
            <a
              className="opacity-90 transition-opacity hover:opacity-100"
              href="https://www.instagram.com/lulue.flowers/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
          </nav>
        </motion.div>
      </header>

      {/*
        Animated big-logo stack. While p < LOGO_FRONT_THRESHOLD it sits at
        z-[15] below the occluder (z-[16]), fully opaque — visible wherever
        the PNG is transparent. At p >= LOGO_FRONT_THRESHOLD it lifts to
        z-[29] above the plate while the occluder is gone; plate opacity
        is still 0 until the ramp past the threshold (PLATE_RANGE).
      */}
      <motion.div
        className="pointer-events-none fixed inset-0"
        style={{
          zIndex: logoStackZIndex,
          visibility: phase === "large" ? "visible" : "hidden",
        }}
      >
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ y: flowerScrollY }}
        >
          <motion.div style={{ scale: heroLogoScale, y: logoY }}>
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, scale: 0.97, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={logoEntranceTransition}
            >
              <Image
                src="/references/lulue.svg"
                alt="Logo Lulué"
                width={LOGO_INTRINSIC_W}
                height={LOGO_INTRINSIC_H}
                className={`h-auto max-w-none ${LOGO_MOBILE_OUTLINE_CLASS}`}
                style={{ width: `${HERO_LOGO_WIDTH_VW}vw` }}
                priority
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        className="pointer-events-none fixed inset-0 z-[16]"
        initial={false}
        animate={{ opacity: heroForegroundSynced ? 1 : 0 }}
        transition={foregroundRevealTransition}
        aria-hidden
      >
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: occluderOpacity,
            visibility: phase === "large" ? "visible" : "hidden",
          }}
          aria-hidden
        >
          <motion.div className="absolute inset-0" style={{ y: flowerScrollY }}>
            <div className={`relative h-full ${HERO_FOREGROUND_FRAME_CLASS}`}>
              <Image
                src="/references/hero_image_1_foreground_active.png"
                alt=""
                fill
                className={HERO_FOREGROUND_IMAGE_CLASS}
                sizes="100vw"
                priority
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      <div
        className="pointer-events-none fixed left-1/2 z-[29] -translate-x-1/2"
        style={{
          top: `${smallLogoTopPx}px`,
          width: `${smallLogoRem}rem`,
          visibility: phase === "small" ? "visible" : "hidden",
        }}
      >
        <Image
          src="/references/lulue.svg"
          alt=""
          width={LOGO_INTRINSIC_W}
          height={LOGO_INTRINSIC_H}
          className={`h-auto w-full ${LOGO_MOBILE_OUTLINE_CLASS}`}
          priority
        />
      </div>

      <section
        ref={heroSectionRef}
        className="relative h-[100dvh] min-h-screen overflow-hidden bg-black"
      >
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/references/hero_image_1_active.png"
            alt="Kompozycja kwiatów w stylu edytorialnym"
            fill
            className={HERO_BACKGROUND_IMAGE_CLASS}
            sizes="100vw"
            priority
          />

          {/*
            Editorial vignette. Must sit ABOVE both foreground layers
            (in-section z-[14] and fixed-occluder z-[16]); otherwise the
            gradient darkens only the wall behind the subject and produces a
            visible ghost of the bouquet silhouette where the unaffected
            subject meets the darkened background.
          */}
          <div
            className="pointer-events-none absolute inset-0 z-[17] bg-linear-to-b from-black/12 via-transparent to-black/22"
            aria-hidden
          />

          <motion.div
            className="pointer-events-none absolute inset-0 z-[14]"
            initial={false}
            animate={{ opacity: heroForegroundSynced ? 1 : 0 }}
            transition={foregroundRevealTransition}
            aria-hidden
          >
            <motion.div
              className="pointer-events-none absolute inset-0"
              style={{
                opacity: inSectionForegroundOpacity,
              }}
              aria-hidden
            >
              {/* Mobile: same y as fixed occluder so the crossfade does not slide two cutouts. Desktop:
                  background has no parallax — extra translate here looked like the bouquet peeling off the wall. */}
              <motion.div
                className="absolute inset-0"
                style={{ y: viewport.isSm ? 0 : flowerScrollY }}
              >
                <div className={`relative h-full ${HERO_FOREGROUND_FRAME_CLASS}`}>
                  <Image
                    src="/references/hero_image_1_foreground_active.png"
                    alt=""
                    fill
                    className={HERO_FOREGROUND_IMAGE_CLASS}
                    sizes="100vw"
                    priority
                  />
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {gallery}

      <section
        id="content"
        className="bg-stone-100 px-6 py-20 text-zinc-800 sm:px-10 sm:py-28"
      >
        <div className="mx-auto max-w-5xl space-y-8">
          <div className="mx-auto max-w-3xl space-y-3 text-center sm:text-left">
            <h2 className="font-[family-name:var(--font-serif)] text-3xl tracking-tight sm:text-4xl">
              Odwiedź nasz butik
            </h2>
            <p className="leading-8 text-zinc-700">
              Lulué - Flower Boutique — adres, dojazd i godziny otwarcia znajdziesz w{" "}
              <a
                href={LULUE_GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-zinc-400 underline-offset-4 transition-colors hover:text-zinc-900"
              >
                Mapach Google
              </a>
              .
            </p>
          </div>

          <div className="overflow-hidden rounded-sm border border-zinc-300/70 bg-zinc-200 shadow-sm">
            <iframe
              title="Lulué - Flower Boutique w Mapach Google"
              src={LULUE_GOOGLE_MAP_EMBED_SRC}
              className="aspect-[4/3] w-full min-h-[280px] border-0 sm:aspect-auto sm:h-[min(520px,55vh)] sm:min-h-[360px]"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
