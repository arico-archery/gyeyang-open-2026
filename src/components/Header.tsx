"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useI18n } from "@/lib/i18n/context";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const { locale, setLocale, t } = useI18n();

  // Primary nav — sections of the home page (anchors) + dedicated pages
  const PRIMARY_ITEMS = [
    { label: t("nav.schedule"), href: "/#schedule" },
    { label: t("nav.registration"), href: "/#registration" },
    { label: t("sectionNav.visa"), href: "/#visa" },
    { label: t("sectionNav.hotel"), href: "/#hotel" },
    { label: t("sectionNav.rentcar"), href: "/#rent-car" },
    { label: t("nav.gallery"), href: "/gallery" },
    { label: t("nav.contact"), href: "/#contact" },
  ];

  // Secondary nav — under "More" dropdown
  const SECONDARY_ITEMS = [
    { label: t("nav.scoreTarget"), href: "/scoreboard" },
    { label: t("nav.guideMap"), href: "/guide_map" },
    { label: t("nav.archeryRecord"), href: "/record_table" },
    { label: t("nav.practiceSchedule"), href: "/practice_schedule" },
    { label: t("nav.archive2026"), href: "/archive/2026" },
    { label: t("nav.archive2025"), href: "/archive/2025" },
  ];

  const ALL_ITEMS = [...PRIMARY_ITEMS, ...SECONDARY_ITEMS];
  const moreLabel = t("nav.more");
  const appLabel = locale === "ko" ? "참가자 앱" : "Athlete App";

  return (
    <header className="site-header sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <Image
              src="/images/logo.png"
              alt="GYEYANG OPEN Logo"
              width={48}
              height={53}
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-5 xl:gap-6">
            {PRIMARY_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[14.5px] font-medium text-slate-700 hover:text-blue-600 transition-colors whitespace-nowrap"
              >
                {item.label}
              </Link>
            ))}

            {/* More dropdown */}
            <div className="relative">
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                className="flex items-center gap-1 text-[14.5px] font-medium text-slate-700 hover:text-blue-600 transition-colors"
                aria-expanded={moreOpen}
              >
                {moreLabel}
                <svg className={`w-4 h-4 transition-transform ${moreOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {moreOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMoreOpen(false)} />
                  <div className="absolute right-0 top-9 z-50 bg-white border border-slate-200 rounded-lg shadow-lg py-2 min-w-[200px]">
                    {SECONDARY_ITEMS.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMoreOpen(false)}
                        className="block px-4 py-2.5 text-[14px] font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>

            <Link
              href="/app"
              className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              {appLabel}
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="w-8 h-8 rounded-full overflow-hidden border-2 border-slate-200 hover:border-slate-400 transition-colors flex items-center justify-center bg-slate-50"
                aria-label="Select language"
              >
                <Image
                  src={locale === "en" ? "/images/flag_us.png" : "/images/flag_kr.png"}
                  alt={locale === "en" ? "English" : "한국어"}
                  width={28}
                  height={20}
                  className="object-cover"
                />
              </button>

              {langOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                  <div className="absolute right-0 top-10 z-50 bg-[#1a1a1a] rounded-lg shadow-xl py-2 min-w-[160px]">
                    <button
                      onClick={() => { setLocale("en"); setLangOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#2a2a2a] transition-colors ${locale === "en" ? "bg-[#2a2a2a]" : ""}`}
                    >
                      <Image src="/images/flag_us.png" alt="US" width={28} height={20} className="shrink-0 rounded-sm" />
                      <span className="text-white text-sm font-medium">English</span>
                    </button>
                    <button
                      onClick={() => { setLocale("ko"); setLangOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#2a2a2a] transition-colors ${locale === "ko" ? "bg-[#2a2a2a]" : ""}`}
                    >
                      <Image src="/images/flag_kr.png" alt="KR" width={28} height={20} className="shrink-0 rounded-sm" />
                      <span className="text-white text-sm font-medium">한국어</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            <button
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="lg:hidden border-t border-slate-100 py-4">
            <div className="flex flex-col gap-1">
              {ALL_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-2.5 text-base text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/app"
                className="mx-4 mt-3 py-2.5 bg-blue-600 text-white text-base font-semibold rounded-lg text-center hover:bg-blue-700 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {appLabel}
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
