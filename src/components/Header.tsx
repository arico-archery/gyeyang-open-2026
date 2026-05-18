"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useI18n } from "@/lib/i18n/context";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { locale, setLocale, t } = useI18n();

  const NAV_ITEMS = [
    { label: t("nav.schedule"), href: "/schedule" },
    { label: t("nav.registration"), href: "/registration" },
    { label: t("nav.contact"), href: "/contact" },
    { label: t("nav.archeryRecord"), href: "/record_table" },
    { label: t("nav.practiceSchedule"), href: "/practice_schedule" },
    { label: t("nav.guideMap"), href: "/guide_map" },
    { label: t("nav.scoreTarget"), href: "/scoreboard" },
    { label: t("nav.archive2025"), href: "/archive/2025" },
  ];

  const appLabel = locale === "ko" ? "\ucc38\uac00\uc790 \uc571" : "Athlete App";

  return (
    <header className="site-header sticky top-0 z-50 bg-white border-b border-gray-200">
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

          <nav className="hidden lg:flex items-center gap-7">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[15px] font-medium text-slate-700 hover:text-blue-600 transition-colors"
              >
                {item.label}
              </Link>
            ))}
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
                className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200 hover:border-gray-400 transition-colors flex items-center justify-center bg-gray-50"
                aria-label="Select language"
              >
                <Image
                  src={locale === "en" ? "/images/flag_us.png" : "/images/flag_kr.png"}
                  alt={locale === "en" ? "English" : "\ud55c\uad6d\uc5b4"}
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
                      <span className="text-white text-sm font-medium">\ud55c\uad6d\uc5b4</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            <button
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
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
          <nav className="lg:hidden border-t border-gray-100 py-4">
            <div className="flex flex-col gap-2">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-2.5 text-base text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/app"
                className="mx-4 mt-2 py-2.5 bg-blue-600 text-white text-base font-semibold rounded-lg text-center hover:bg-blue-700 transition-colors"
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
