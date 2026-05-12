/** Instagram — główny kanał zamówień (jak w stopce). */
const ORDER_INSTAGRAM_URL = "https://www.instagram.com/lulue.flowers/";

/**
 * Opcjonalne wideo między galerią a blokiem z mapą.
 * Umieść plik w `public/` (np. `/references/outro.mp4`) i ustaw `src`.
 * `poster` — opcjonalny JPG klatka przy ładowaniu.
 */
const OUTRO_VIDEO: { src: string; poster?: string } | null = null;

export function EditorialOutro() {
  return (
    <section
      className="border-t border-zinc-200/70 bg-stone-100 px-6 pb-12 pt-16 text-zinc-800 sm:px-10 sm:pb-16 sm:pt-24"
      aria-label="Zamówienie i kontakt"
    >
      <div className="mx-auto flex min-w-0 max-w-3xl flex-col items-center gap-8 text-center sm:gap-10">
        <p className="m-0 font-[family-name:var(--font-serif)] text-2xl font-light leading-snug tracking-tight text-zinc-950 sm:text-3xl sm:leading-snug">
          Twój bukiet zaczyna się od rozmowy — napisz do nas na Instagramie.
        </p>

        {OUTRO_VIDEO ? (
          <div className="w-full min-w-0 overflow-hidden rounded-sm border border-zinc-300/70 bg-zinc-900/20 shadow-sm">
            <video
              className="block aspect-video w-full object-cover"
              controls
              playsInline
              preload="metadata"
              poster={OUTRO_VIDEO.poster}
            >
              <source src={OUTRO_VIDEO.src} />
            </video>
          </div>
        ) : null}

        <a
          href={ORDER_INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-sm border border-zinc-300 bg-white px-10 py-5 text-center font-[family-name:var(--font-serif)] text-xl font-medium tracking-[0.045em] text-zinc-950 transition-colors hover:border-zinc-400 hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400 active:bg-zinc-100/90 sm:px-12 sm:py-6 sm:text-2xl sm:tracking-[0.05em]"
        >
          Zamów bukiet
        </a>
      </div>
    </section>
  );
}
