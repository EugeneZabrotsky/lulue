import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Lulué — Kwiatowy butik",
  description:
    "Lulué — kwiatowy butik w Warszawie. Świeże bukiety i kompozycje na zamówienie.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pl"
      className={`${geistSans.variable} ${geistMono.variable} h-full bg-white antialiased`}
    >
      <body className="min-h-full bg-white text-zinc-800">
        <main className="min-h-full">{children}</main>
        <SpeedInsights />
      </body>
    </html>
  );
}
