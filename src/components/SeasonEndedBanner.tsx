"use client";

import { useI18n } from "@/lib/i18n/context";
import Link from "next/link";

/**
 * Yellow callout banner shown at the top of post-event content pages
 * (Registration, Visa, Hotel, Transport) — preserves SEO/archive value
 * while clearly telling visitors the 2026 round has finished.
 */
export default function SeasonEndedBanner() {
  const { locale } = useI18n();
  const t = (ko: string, en: string) => (locale === "ko" ? ko : en);

  return (
    <div className="bg-amber-50 border-y border-amber-200">
      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-lg">📌</span>
            <span className="text-xs font-bold tracking-wider uppercase text-amber-900">
              {t("대회 종료 안내", "Tournament Ended")}
            </span>
          </div>
          <p className="text-sm text-amber-900 flex-1 leading-relaxed">
            {t(
              "2026 GYEYANG OPEN은 5월 18일에 종료되었습니다. 이 페이지는 참고용으로 유지되며, 다음 대회(2027) 안내는 추후 공개됩니다.",
              "The 2026 GYEYANG OPEN ended on May 18. This page is preserved for reference; details for the next tournament (2027) will be announced later."
            )}
          </p>
          <Link
            href="/archive/2026"
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            {t("2026 결과 보기", "View 2026 Results")}
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
