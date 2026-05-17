"use client";

import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";

const SPONSORS = [
  { src: "/images/sponsor_001.jpg", alt: "Incheon Gyeyang-gu", width: 214 },
  { src: "/images/sponsor_002.jpg", alt: "World Archery Asia", width: 165 },
  { src: "/images/sponsor_003.jpg", alt: "Korea Archery Association", width: 156 },
  { src: "/images/sponsor_004.jpg", alt: "Gyeyang Sports Council", width: 215 },
  { src: "/images/sponsor_005.jpg", alt: "MCST", width: 162 },
  { src: "/images/sponsor_006.jpg", alt: "Incheon Metropolitan City", width: 164 },
  { src: "/images/sponsor_007.jpg", alt: "Incheon Archery Association", width: 210 },
];

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Row 1: 4 sponsors */}
        <div className="flex flex-wrap justify-center items-center gap-8 mb-6">
          {SPONSORS.slice(0, 4).map((s, i) => (
            <Image key={i} src={s.src} alt={s.alt} width={s.width} height={60} className="h-12 w-auto object-contain" />
          ))}
        </div>
        {/* Row 2: 3 sponsors */}
        <div className="flex flex-wrap justify-center items-center gap-8 mb-8">
          {SPONSORS.slice(4).map((s, i) => (
            <Image key={i + 4} src={s.src} alt={s.alt} width={s.width} height={60} className="h-12 w-auto object-contain" />
          ))}
        </div>
        <div className="text-center mb-4">
          <Link href="/archive/2025" className="text-sm text-gray-500 hover:text-amber-600 transition-colors">
            {t("nav.archive2025")}
          </Link>
        </div>
        <p className="text-center text-xs text-gray-400">{t("footer.copyright")}</p>
      </div>
    </footer>
  );
}