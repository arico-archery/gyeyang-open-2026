import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { I18nProvider } from "@/lib/i18n/context";

export const metadata: Metadata = {
  title: {
    default: "2026 GYEYANG OPEN - International Archery Tournament",
    template: "%s | GYEYANG OPEN",
  },
  description:
    "Official website of the 2026 Gyeyang District Mayor Cup International Archery Tournament (GYEYANG OPEN), held at Gyeyang Asiad Archery Field in Incheon, South Korea. May 19-23, 2026.",
  keywords: [
    "Gyeyang Open",
    "archery tournament",
    "international archery",
    "Incheon",
    "South Korea",
    "World Archery",
    "계양오픈",
    "국제양궁대회",
    "계양구청장배",
    "양궁",
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
      "Official website of the 2026 Gyeyang District Mayor Cup International Archery Tournament. May 19-23, 2026, Incheon, South Korea.",
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
      "Official website of the 2026 Gyeyang District Mayor Cup International Archery Tournament. May 19-23, 2026.",
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
              startDate: "2026-05-19",
              endDate: "2026-05-23",
              eventStatus: "https://schema.org/EventScheduled",
              eventAttendanceMode:
                "https://schema.org/OfflineEventAttendanceMode",
              location: {
                "@type": "Place",
                name: "Gyeyang Asiad Archery Field",
                address: {
                  "@type": "PostalAddress",
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
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}