import type { SVGProps } from "react";

const MAPS_URL = "https://maps.app.goo.gl/xtjLeNa3KoSQZw6M8";
const PHONE_E164 = "+48571082910";
/** Display grouping (tel: stays compact E.164 digits). */
const PHONE_DISPLAY = `${PHONE_E164.slice(0, 3)} ${PHONE_E164.slice(3, 6)} ${PHONE_E164.slice(6, 9)} ${PHONE_E164.slice(9)}`;
const INSTAGRAM_URL = "https://www.instagram.com/lulue.flowers/";
/** Set to true to restore the Telegram pill in the footer. */
const SHOW_TELEGRAM_LINK = false;

const TELEGRAM_USERNAME = "katyadbk";
const TELEGRAM_URL = `https://t.me/${TELEGRAM_USERNAME}`;

function PinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.85}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M12 21s7-4.82 7-11a7 7 0 1 0-14 0c0 6.18 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.25" />
    </svg>
  );
}

function PhoneIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.85}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.574 2.81.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}

function TelegramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

const pill =
  "inline-flex items-center gap-2 rounded-full bg-zinc-100 px-4 py-2.5 text-sm font-medium text-zinc-900 ring-1 ring-zinc-200/80 transition-colors hover:bg-zinc-200/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400";
const iconClass = "size-[1.125rem] shrink-0 text-zinc-600";

export function SiteFooter() {
  return (
    <footer id="footer" className="border-t border-zinc-200/80 bg-white px-6 py-14 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex justify-center px-4 pb-6">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block max-w-xl rounded-sm border border-zinc-300 bg-white px-10 py-5 text-center transition-colors hover:border-zinc-400 hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400 active:bg-zinc-100/90 sm:max-w-3xl sm:px-14 sm:py-6"
          >
            <span className="font-[family-name:var(--font-serif)] text-lg font-medium leading-snug tracking-[0.04em] text-zinc-950 sm:text-2xl sm:tracking-[0.05em]">
              Zamów swój bukiet przez Instagram
            </span>
          </a>
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={pill}
          >
            <PinIcon className={iconClass} />
            Warszawa
          </a>
          <a href={`tel:${PHONE_E164.replace(/\s/g, "")}`} className={pill}>
            <PhoneIcon className={iconClass} />
            {PHONE_DISPLAY}
          </a>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={pill}
          >
            <InstagramIcon className={iconClass} />
            Instagram
          </a>
          {SHOW_TELEGRAM_LINK ? (
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={pill}
            >
              <TelegramIcon className={iconClass} />
              @{TELEGRAM_USERNAME}
            </a>
          ) : null}
        </div>

        <p className="mt-14 text-center text-xs text-zinc-500">
          © 2025–2026 Lulué - Flower Boutique
        </p>
      </div>
    </footer>
  );
}
