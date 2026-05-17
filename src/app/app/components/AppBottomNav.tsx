"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { useAuth } from "@/lib/supabase/auth-context";

const NAV_ITEMS = [
  {
    key: "home",
    href: "/app",
    icon: (active: boolean) => (
      <svg className={"w-6 h-6 " + (active ? "text-blue-600" : "text-gray-400")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" />
      </svg>
    ),
  },
  {
    key: "schedule",
    href: "/app/schedule",
    icon: (active: boolean) => (
      <svg className={"w-6 h-6 " + (active ? "text-blue-600" : "text-gray-400")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    key: "scores",
    href: "/app/scores",
    icon: (active: boolean) => (
      <svg className={"w-6 h-6 " + (active ? "text-blue-600" : "text-gray-400")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    key: "nearby",
    href: "/app/nearby",
    icon: (active: boolean) => (
      <svg className={"w-6 h-6 " + (active ? "text-blue-600" : "text-gray-400")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    key: "profile",
    href: "/app/profile",
    icon: (active: boolean) => (
      <svg className={"w-6 h-6 " + (active ? "text-blue-600" : "text-gray-400")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

const LABELS: Record<string, Record<string, string>> = {
  home: { ko: "홈", en: "Home" },
  schedule: { ko: "일정", en: "Schedule" },
  scores: { ko: "점수", en: "Scores" },
  nearby: { ko: "주변", en: "Nearby" },
  profile: { ko: "프로필", en: "Profile" },
};

export default function AppBottomNav() {
  const pathname = usePathname();
  const { locale } = useI18n();
  const { profile } = useAuth();

  const isActive = (href: string) => {
    if (href === "/app") return pathname === "/app";
    return pathname.startsWith(href);
  };

  const showScan = profile?.role === "judge" || profile?.role === "admin";
  const scanActive = pathname.startsWith("/app/scan");

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-area-bottom">
      <div className="max-w-lg mx-auto flex items-center justify-around h-16 px-2">
        {NAV_ITEMS.slice(0, 2).map((item) => {
          const active = isActive(item.href);
          return (
            <Link key={item.key} href={item.href} className="flex flex-col items-center justify-center gap-0.5 flex-1 py-1">
              {item.icon(active)}
              <span className={"text-[10px] font-medium " + (active ? "text-blue-600" : "text-gray-400")}>
                {LABELS[item.key][locale] || LABELS[item.key]["en"]}
              </span>
            </Link>
          );
        })}

        {showScan ? (
          <Link href="/app/scan" className="flex flex-col items-center justify-center gap-0.5 flex-1 py-1 -mt-5">
            <div className={"w-12 h-12 rounded-full flex items-center justify-center shadow-md border-2 " + (scanActive ? "bg-blue-700 border-blue-700" : "bg-blue-600 border-white")}>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </div>
            <span className={"text-[10px] font-medium " + (scanActive ? "text-blue-600" : "text-gray-400")}>
              {locale === "ko" ? "스캔" : "Scan"}
            </span>
          </Link>
        ) : (
          <Link href="/app/scores" className="flex flex-col items-center justify-center gap-0.5 flex-1 py-1">
            {NAV_ITEMS[2].icon(isActive("/app/scores"))}
            <span className={"text-[10px] font-medium " + (isActive("/app/scores") ? "text-blue-600" : "text-gray-400")}>
              {LABELS.scores[locale] || LABELS.scores["en"]}
            </span>
          </Link>
        )}

        {NAV_ITEMS.slice(3).map((item) => {
          const active = isActive(item.href);
          return (
            <Link key={item.key} href={item.href} className="flex flex-col items-center justify-center gap-0.5 flex-1 py-1">
              {item.icon(active)}
              <span className={"text-[10px] font-medium " + (active ? "text-blue-600" : "text-gray-400")}>
                {LABELS[item.key][locale] || LABELS[item.key]["en"]}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
