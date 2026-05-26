"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import LanguageSelector from "./LanguageSelector";

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
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const { locale, t } = useI18n();

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
        { label: t("nav.gallery"), href: "/gallery" },
        { label: t("nav.scoreTarget"), href: "/scoreboard" },
        { label: t("nav.archeryRecord"), href: "/record_table" },
      ],
    },
    {
      label: t("nav.groupArchive"),
      items: [
        // Newest first — current edition takes precedence.
        { label: t("nav.archive2026"), href: "/archive/2026" },
        { label: t("nav.archive2025"), href: "/archive/2025" },
      ],
    },
    {
      label: t("nav.groupContact"),
      items: [
        { label: t("nav.contactTournament"), href: "/contact" },
        { label: t("nav.contactStaff"), href: "/contact/staff" },
      ],
    },
  ];

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

            {/* CTA — Athlete app */}
            <Link
              href="/app"
              className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              {appLabel}
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <LanguageSelector size="md" align="right" />

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
