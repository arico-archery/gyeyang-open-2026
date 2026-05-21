import type { Metadata } from "next";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n/context";
import LayoutShell from "@/components/LayoutShell";

export const metadata: Metadata = {
  title: {
    default: "2026 GYEYANG OPEN - International Archery Tournament",
    template: "%s | GYEYANG OPEN",
  },
  description:
    "Official website of the GYEYANG OPEN International Archery Tournament, held in Incheon, South Korea. View 2026 medalists, tournament photos, and updates on the 2027 edition.",
  keywords: [
    "Gyeyang Open",
    "archery tournament",
    "international archery",
    "Incheon",
    "South Korea",
    "World Archery",
  ],
  authors: [{ name: "Gyeyang District Office" }],
  metadataBase: new URL("https://www.gyeyangopen.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "ko_KR",
    url: "https://www.gyeyangopen.com",
    siteName: "GYEYANG OPEN",
    title: "2026 GYEYANG OPEN - International Archery Tournament",
    description:
      "Official website of the GYEYANG OPEN. 2026 medalists, photos, and 2027 updates.",
    images: [
      {
        url: "/images/poster_2026.jpg",
        width: 1200,
        height: 1697,
        alt: "2026 GYEYANG OPEN Poster",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "2026 GYEYANG OPEN - International Archery Tournament",
    description:
      "Official website of the GYEYANG OPEN. 2026 medalists, photos, and 2027 updates.",
    images: ["/images/poster_2026.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  // Icons are auto-resolved from src/app/icon.png, favicon.ico, apple-icon.png
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="min-h-screen flex flex-col">
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SportsEvent",
              name: "2026 GYEYANG OPEN - International Archery Tournament",
              description:
                "Gyeyang District Mayor Cup International Archery Tournament",
              startDate: "2026-05-13",
              endDate: "2026-05-18",
              eventStatus: "https://schema.org/EventScheduled",
              eventAttendanceMode:
                "https://schema.org/OfflineEventAttendanceMode",
              location: [
                {
                  "@type": "Place",
                  name: "Gyeyang Asiad Archery Field",
                  address: {
                    "@type": "PostalAddress",
                    addressLocality: "Incheon",
                    addressRegion: "Gyeyang-gu",
                    addressCountry: "KR",
                  },
                },
                {
                  "@type": "Place",
                  name: "Gyeyang Araon Suhyangwon",
                  address: {
                    "@type": "PostalAddress",
                    addressLocality: "Incheon",
                    addressRegion: "Gyeyang-gu",
                    addressCountry: "KR",
                  },
                },
              ],
              organizer: {
                "@type": "Organization",
                name: "Gyeyang District Office",
                url: "https://www.gyeyangopen.com",
              },
              sport: "Archery",
              image: "https://www.gyeyangopen.com/images/poster_2026.jpg",
              url: "https://www.gyeyangopen.com",
            }),
          }}
        />
        <I18nProvider>
          <LayoutShell>{children}</LayoutShell>
        </I18nProvider>
      </body>
    </html>
  );
}
