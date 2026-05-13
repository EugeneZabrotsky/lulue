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
      className="border-t border-rose-100/50 bg-rose-50/35 px-6 pb-12 pt-16 text-zinc-800 sm:px-10 sm:pb-16 sm:pt-24"
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
          className="inline-flex items-center gap-3 rounded-sm border border-zinc-700/50 bg-transparent px-10 py-5 text-center font-[family-name:var(--font-serif)] text-xl font-medium tracking-[0.09em] text-zinc-900 transition-colors duration-200 hover:border-zinc-900 hover:bg-zinc-900 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-700 active:bg-zinc-950 sm:px-12 sm:py-6 sm:text-2xl sm:tracking-[0.10em]"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-5 shrink-0 opacity-80 sm:size-6">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
          </svg>
          Zamów bukiet
        </a>
      </div>
    </section>
  );
}
