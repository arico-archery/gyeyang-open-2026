"use client";

import Link from "next/link";
import PhotoGallery from "@/components/PhotoGallery";
import { useI18n } from "@/lib/i18n/context";

export default function AppPhotosPage() {
  const { locale } = useI18n();
  const t = (ko: string, en: string) => (locale === "ko" ? ko : en);

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <Link
          href="/app"
          className="p-2 -ml-2 hover:bg-gray-100 rounded-lg"
          aria-label="Back"
        >
          <svg
            className="w-5 h-5 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {t("사진", "Photos")}
          </h1>
          <p className="text-xs text-gray-500">
            {t(
              "2026 GYEYANG OPEN · 현장 사진",
              "2026 GYEYANG OPEN · on-site photos"
            )}
          </p>
        </div>
      </div>

      <PhotoGallery compact />
    </div>
  );
}
