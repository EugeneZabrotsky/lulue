import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LULUE",
  description: "LULUE",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white text-zinc-900">
        <header className="border-b border-zinc-200 px-6 py-4">
          <nav className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-4 text-sm">
            <span className="font-semibold tracking-tight">Lulué</span>
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-zinc-600">
              <li>
                <a className="hover:text-zinc-900" href="#">
                  Collections
                </a>
              </li>
              <li>
                <a className="hover:text-zinc-900" href="#">
                  Seasonal
                </a>
              </li>
              <li>
                <a className="hover:text-zinc-900" href="#">
                  Workshops
                </a>
              </li>
              <li>
                <a className="hover:text-zinc-900" href="#">
                  About
                </a>
              </li>
              <li>
                <a className="hover:text-zinc-900" href="#">
                  Contact
                </a>
              </li>
            </ul>
          </nav>
        </header>
        <main className="flex flex-1 flex-col">{children}</main>
        <footer className="border-t border-zinc-200 px-6 py-8 text-sm text-zinc-600">
          <div className="mx-auto flex max-w-4xl flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="font-medium text-zinc-900">Lulué Flower Boutique</p>
              <p className="mt-1 text-zinc-500">Placeholder footer for layout testing.</p>
            </div>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              <li>
                <a className="hover:text-zinc-900" href="#">
                  Delivery
                </a>
              </li>
              <li>
                <a className="hover:text-zinc-900" href="#">
                  FAQ
                </a>
              </li>
              <li>
                <a className="hover:text-zinc-900" href="#">
                  Privacy
                </a>
              </li>
              <li>
                <a className="hover:text-zinc-900" href="#">
                  Terms
                </a>
              </li>
            </ul>
          </div>
          <p className="mx-auto mt-8 max-w-4xl text-xs text-zinc-400">
            © {new Date().getFullYear()} Test site — not for production.
          </p>
        </footer>
      </body>
    </html>
  );
}
