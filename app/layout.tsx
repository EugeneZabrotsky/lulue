import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { FramerProvider } from "@/components/FramerProvider";
import "./globals.css";

const satoshi = localFont({
  src: "../fonts/Satoshi-Variable.woff2",
  variable: "--font-satoshi",
  weight: "300 900",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined,
  title: "Lulué - Flower Boutique",
  description:
    "Lulué - Flower Boutique in Warsaw. Fresh bouquets and custom arrangements to order.",
  openGraph: {
    title: "Lulué - Flower Boutique",
    description:
      "Kwiaciarnia w Warszawie. Świeże bukiety i kompozycje kwiatowe na zamówienie.",
    type: "website",
    locale: "pl_PL",
    images: [
      {
        url: "/references/lulue_logo_black_latest.png",
        width: 3196,
        height: 1468,
        alt: "Lulué Flower Boutique",
      },
    ],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Florist",
  name: "Lulué Flower Boutique",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Instalatorów 7",
    postalCode: "02-237",
    addressLocality: "Warszawa",
    addressCountry: "PL",
  },
  telephone: "+48571082910",
  openingHours: "Mo-Sa 10:00-19:00",
  sameAs: ["https://www.instagram.com/lulue.flowers/"],
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
      <head>
        <link rel="preconnect" href="https://maps.googleapis.com" />
        <link rel="preconnect" href="https://maps.gstatic.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://www.instagram.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full bg-white font-sans text-zinc-800">
        <FramerProvider>
          <main className="min-h-full">{children}</main>
        </FramerProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
