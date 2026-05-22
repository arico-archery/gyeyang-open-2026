"use client";

import Link from "next/link";
import PhotoGallery from "@/components/PhotoGallery";
import { useInlineT } from "@/lib/i18n/inline";

export default function AppPhotosPage() {
  const t = useInlineT();

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
            {t("사진", "Photos", "图库", "ギャラリー")}
          </h1>
          <p className="text-xs text-gray-500">
            {t(
              "2026 GYEYANG OPEN · 현장 사진",
              "2026 GYEYANG OPEN · on-site photos",
              "2026 GYEYANG OPEN · 现场照片",
              "2026 GYEYANG OPEN · 現地写真"
            )}
          </p>
        </div>
      </div>

      <PhotoGallery compact />
    </div>
  );
}
