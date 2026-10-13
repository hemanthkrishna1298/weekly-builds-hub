import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { hub, siteUrl } from "@/lib/apps";
import "./globals.css";

// Fraunces: variable optical size + weight, with a true italic for the quotes.
const fraunces = localFont({
  src: [
    {
      path: "../fonts/fraunces-latin-opsz-normal.woff2",
      style: "normal",
      weight: "100 900",
    },
    {
      path: "../fonts/fraunces-latin-opsz-italic.woff2",
      style: "italic",
      weight: "100 900",
    },
  ],
  variable: "--font-fraunces",
  display: "swap",
});

// Instrument Sans: variable weight, for everything that is not a quote or heading.
const instrument = localFont({
  src: "../fonts/instrument-sans-latin-wght-normal.woff2",
  weight: "400 700",
  style: "normal",
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${hub.name} — ${hub.tagline}`,
    template: `%s — ${hub.name}`,
  },
  description: hub.description ?? hub.tagline,
  openGraph: {
    type: "website",
    siteName: hub.name,
    title: hub.name,
    description: hub.description ?? hub.tagline,
    url: "/",
  },
  twitter: { card: "summary_large_image" },
  alternates: {
    types: { "application/rss+xml": `${siteUrl}/feed.xml` },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f5f2" },
    { media: "(prefers-color-scheme: dark)", color: "#121412" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fraunces.variable} ${instrument.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-paper focus:px-3 focus:py-2"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
