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
    "Official website of the 2026 Gyeyang District Mayor Cup International Archery Tournament (GYEYANG OPEN), held at Gyeyang Asiad Archery Field in Incheon, South Korea.",
  keywords: [
    "Gyeyang Open",
    "archery tournament",
    "international archery",
    "Incheon",
    "South Korea",
    "World Archery",
  ],
  authors: [{ name: "Gyeyang District Office" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "ko_KR",
    url: "https://www.gyeyangopen.kr",
    siteName: "GYEYANG OPEN",
    title: "2026 GYEYANG OPEN - International Archery Tournament",
    description:
      "Official website of the 2026 Gyeyang District Mayor Cup International Archery Tournament.",
    images: [
      {
        url: "/images/poster.png",
        width: 470,
        height: 665,
        alt: "2026 GYEYANG OPEN Poster",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "2026 GYEYANG OPEN - International Archery Tournament",
    description:
      "Official website of the 2026 Gyeyang District Mayor Cup International Archery Tournament.",
    images: ["/images/poster.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
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
              startDate: "2026-07-10",
              endDate: "2026-07-12",
              eventStatus: "https://schema.org/EventScheduled",
              eventAttendanceMode:
                "https://schema.org/OfflineEventAttendanceMode",
              location: {
                "@type": "Place",
                name: "Gyeyang Asiad Archery Field",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "106-21 Jakjeonseoun-dong",
                  addressLocality: "Incheon",
                  addressRegion: "Gyeyang-gu",
                  addressCountry: "KR",
                },
              },
              organizer: {
                "@type": "Organization",
                name: "Gyeyang District Office",
                url: "https://www.gyeyangopen.kr",
              },
              sport: "Archery",
              image: "https://www.gyeyangopen.kr/images/poster.png",
              url: "https://www.gyeyangopen.kr",
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
