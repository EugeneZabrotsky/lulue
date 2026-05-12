import type { Metadata } from "next";
import localFont from "next/font/local";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const satoshi = localFont({
  src: "../fonts/Satoshi-Variable.woff2",
  variable: "--font-satoshi",
  weight: "300 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lulué - Flower Boutique",
  description:
    "Lulué - Flower Boutique in Warsaw. Fresh bouquets and custom arrangements to order.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pl"
      className={`${satoshi.variable} h-full bg-white antialiased`}
    >
      <body className="min-h-full bg-white font-sans text-zinc-800">
        <main className="min-h-full">{children}</main>
        <SpeedInsights />
      </body>
    </html>
  );
}
