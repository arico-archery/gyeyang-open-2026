"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import PhotoLightbox from "./PhotoLightbox";
import type { Photo, PhotoAlbum } from "@/app/api/photos/route";

interface PhotosApiResponse {
  fetchedAt: string;
  totalAlbums: number;
  totalImages: number;
  albums: PhotoAlbum[];
  error?: string;
}

interface Props {
  /** Tighten the layout (smaller cards, compact tabs) for the participant app. */
  compact?: boolean;
  /** Optional class to override outer padding. */
  className?: string;
}

/**
 * Tabbed photo grid backed by /api/photos (SmugMug-hosted).
 * Used both on /gallery (full site) and /app/photos (participant app).
 */
export default function PhotoGallery({ compact = false, className }: Props) {
  const { locale } = useI18n();
  const t = (ko: string, en: string) => (locale === "ko" ? ko : en);

  const [data, setData] = useState<PhotosApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeAlbum, setActiveAlbum] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/photos")
      .then((r) => r.json())
      .then((d: PhotosApiResponse) => {
        if (cancelled) return;
        if (d.error) setError(d.error);
        else setData(d);
      })
      .catch((e) => !cancelled && setError(String(e)))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const allPhotos: Photo[] = useMemo(() => {
    if (!data) return [];
    return data.albums.flatMap((a) => a.images);
  }, [data]);

  const photosShown: Photo[] = useMemo(() => {
    if (!data) return [];
    if (activeAlbum === "all") return allPhotos;
    return data.albums.find((a) => a.albumKey === activeAlbum)?.images ?? [];
  }, [data, activeAlbum, allPhotos]);

  if (loading) {
    return (
      <div className={className}>
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-sm text-slate-500">
            {t("사진을 불러오는 중...", "Loading photos...")}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          {t("사진을 불러올 수 없습니다", "Could not load photos")}: {error}
        </div>
      </div>
    );
  }

  if (!data || data.totalImages === 0) {
    return (
      <div className={className}>
        <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 py-16 text-center">
          <svg
            className="w-12 h-12 text-slate-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-sm text-slate-500">
            {t("아직 업로드된 사진이 없습니다", "No photos uploaded yet")}
          </p>
        </div>
      </div>
    );
  }

  const gridCols = compact
    ? "grid-cols-2 sm:grid-cols-3"
    : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4";

  return (
    <div className={className}>
      {/* Tabs — only show if more than 1 album exists */}
      {data.albums.length > 1 && (
        <div className="flex gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          <button
            type="button"
            onClick={() => setActiveAlbum("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              activeAlbum === "all"
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {t("전체", "All")} · {data.totalImages}
          </button>
          {data.albums.map((a) => (
            <button
              key={a.albumKey}
              type="button"
              onClick={() => setActiveAlbum(a.albumKey)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                activeAlbum === a.albumKey
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {a.name} · {a.images.length}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      <div className={`grid ${gridCols} gap-2 sm:gap-3`}>
        {photosShown.map((p, i) => (
          <button
            key={p.imageKey}
            type="button"
            onClick={() => setLightboxIndex(i)}
            className="group relative aspect-square overflow-hidden rounded-xl bg-slate-200 hover:shadow-lg transition-shadow"
            aria-label={t("사진 보기", "View photo")}
          >
            <Image
              src={p.small}
              alt={p.caption || p.fileName}
              fill
              sizes={compact ? "(max-width: 640px) 50vw, 33vw" : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"}
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              unoptimized
            />
          </button>
        ))}
      </div>

      {/* Footer */}
      <p className="mt-6 text-center text-xs text-slate-500">
        {t("출처: SmugMug", "Source: SmugMug")} ·{" "}
        <a
          href="https://media.arico.group/Gyeyang-Open-Competition/2026-GyeyangOpen"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-blue-600"
        >
          {t("전체 갤러리에서 다운로드", "Download from full gallery")}
        </a>
      </p>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <PhotoLightbox
          photos={photosShown}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  );
}
