"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useI18n } from "@/lib/i18n/context";

/** Inline 30:20 PRC flag — avoids adding another binary asset to the repo. */
function CnFlag({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 30 20"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect width="30" height="20" fill="#DE2910" />
      <g fill="#FFDE00">
        {/* Large star */}
        <polygon points="5,3 5.95,5.85 8.95,5.85 6.5,7.65 7.45,10.5 5,8.7 2.55,10.5 3.5,7.65 1.05,5.85 4.05,5.85" />
        {/* Four small stars in arc */}
        <polygon points="10,1.5 10.32,2.46 11.32,2.46 10.5,3.05 10.82,4 10,3.4 9.18,4 9.5,3.05 8.68,2.46 9.68,2.46" />
        <polygon points="12,4 12.32,4.96 13.32,4.96 12.5,5.55 12.82,6.5 12,5.9 11.18,6.5 11.5,5.55 10.68,4.96 11.68,4.96" />
        <polygon points="12,7 12.32,7.96 13.32,7.96 12.5,8.55 12.82,9.5 12,8.9 11.18,9.5 11.5,8.55 10.68,7.96 11.68,7.96" />
        <polygon points="10,9.5 10.32,10.46 11.32,10.46 10.5,11.05 10.82,12 10,11.4 9.18,12 9.5,11.05 8.68,10.46 9.68,10.46" />
      </g>
    </svg>
  );
}

interface NavItem {
  label: string;
  href: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const { locale, setLocale, t } = useI18n();

  // Three content groups + standalone Contact — each item is a dedicated route
  const GROUPS: NavGroup[] = [
    {
      label: t("nav.groupAbout"),
      items: [
        // Post-event ordering: Schedule first (most-revisited reference),
        // then the rest. Practice Schedule stays last (lowest relevance).
        { label: t("nav.schedule"), href: "/schedule" },
        { label: t("nav.invitation"), href: "/invitation" },
        { label: t("nav.guideMap"), href: "/guide_map" },
        { label: t("nav.practiceSchedule"), href: "/practice_schedule" },
      ],
    },
    {
      label: t("nav.groupParticipate"),
      items: [
        // Pages are preserved for reference + SEO. Each page now shows a
        // SeasonEndedBanner at the top making the post-event status clear.
        { label: t("nav.registration"), href: "/registration" },
        { label: t("sectionNav.visa"), href: "/visa" },
        { label: t("sectionNav.hotel"), href: "/hotel" },
        { label: t("sectionNav.rentcar"), href: "/rent-car" },
      ],
    },
    {
      label: t("nav.groupResults"),
      items: [
        // 2026 archive first — primary destination after the event.
        { label: t("nav.archive2026"), href: "/archive/2026" },
        { label: t("nav.gallery"), href: "/gallery" },
        { label: t("nav.scoreTarget"), href: "/scoreboard" },
        { label: t("nav.archeryRecord"), href: "/record_table" },
        { label: t("nav.archive2025"), href: "/archive/2025" },
      ],
    },
  ];

  const contactLabel = t("nav.contact");
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

          {/* Desktop nav with group dropdowns */}
          <nav className="hidden lg:flex items-center gap-8">
            {GROUPS.map((group) => (
              <div
                key={group.label}
                className="relative"
                onMouseEnter={() => setOpenGroup(group.label)}
                onMouseLeave={() => setOpenGroup(null)}
              >
                <button
                  onClick={() => setOpenGroup(openGroup === group.label ? null : group.label)}
                  className={`flex items-center gap-1 text-[15px] font-medium transition-colors py-2 ${
                    openGroup === group.label ? "text-blue-600" : "text-slate-700 hover:text-blue-600"
                  }`}
                  aria-expanded={openGroup === group.label}
                >
                  {group.label}
                  <svg className={`w-4 h-4 transition-transform ${openGroup === group.label ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {openGroup === group.label && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50 min-w-[200px]">
                    <div className="bg-white border border-slate-200 rounded-xl shadow-lg py-2 overflow-hidden">
                      {group.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setOpenGroup(null)}
                          className="block px-5 py-2.5 text-[14px] font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors whitespace-nowrap"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Standalone Contact */}
            <Link
              href="/contact"
              className="text-[15px] font-medium text-slate-700 hover:text-blue-600 transition-colors py-2"
            >
              {contactLabel}
            </Link>

            {/* CTA — Athlete app */}
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
                {locale === "zh" ? (
                  /* Inline CN flag — no separate image file required */
                  <CnFlag className="w-7 h-5 object-cover rounded-sm" />
                ) : (
                  <Image
                    src={locale === "en" ? "/images/flag_us.png" : "/images/flag_kr.png"}
                    alt={locale === "en" ? "English" : "한국어"}
                    width={28}
                    height={20}
                    className="object-cover"
                  />
                )}
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
                    <button
                      onClick={() => { setLocale("zh"); setLangOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#2a2a2a] transition-colors ${locale === "zh" ? "bg-[#2a2a2a]" : ""}`}
                    >
                      <CnFlag className="w-7 h-5 shrink-0 rounded-sm" />
                      <span className="text-white text-sm font-medium">简体中文</span>
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

        {/* Mobile menu — grouped headings with indented items */}
        {mobileOpen && (
          <nav className="lg:hidden border-t border-slate-100 py-4 max-h-[calc(100vh-72px)] overflow-y-auto">
            <div className="flex flex-col gap-6">
              {GROUPS.map((group) => (
                <div key={group.label}>
                  <p className="px-4 mb-2 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                    {group.label}
                  </p>
                  <div className="flex flex-col">
                    {group.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="px-4 py-2.5 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              <div>
                <div className="flex flex-col">
                  <Link
                    href="/contact"
                    className="px-4 py-2.5 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {contactLabel}
                  </Link>
                </div>
              </div>
              <Link
                href="/app"
                className="mx-4 mt-2 py-3 bg-blue-600 text-white text-base font-semibold rounded-lg text-center hover:bg-blue-700 transition-colors"
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
