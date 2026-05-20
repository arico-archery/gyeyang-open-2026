"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
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

const PAGE_SIZE = 12;

/**
 * Tabbed photo grid backed by /api/photos (SmugMug-hosted).
 * Used both on /gallery (full site) and /app/photos (participant app).
 * Shows PAGE_SIZE photos per page with prev/next pagination.
 */
export default function PhotoGallery({ compact = false, className }: Props) {
  const { locale } = useI18n();
  const t = (ko: string, en: string) => (locale === "ko" ? ko : en);

  const [data, setData] = useState<PhotosApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeAlbum, setActiveAlbum] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const gridTopRef = useRef<HTMLDivElement>(null);

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

  // Reset to page 1 whenever the active tab changes.
  useEffect(() => {
    setPage(1);
  }, [activeAlbum]);

  const totalPages = Math.max(1, Math.ceil(photosShown.length / PAGE_SIZE));
  const startIdx = (page - 1) * PAGE_SIZE;
  const endIdx = Math.min(startIdx + PAGE_SIZE, photosShown.length);
  const pagedPhotos = photosShown.slice(startIdx, endIdx);

  function goToPage(p: number) {
    const next = Math.max(1, Math.min(totalPages, p));
    setPage(next);
    // Scroll the grid into view (helpful when paging deep on long lists).
    requestAnimationFrame(() => {
      gridTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

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
      <div ref={gridTopRef} className={`grid ${gridCols} gap-2 sm:gap-3 scroll-mt-4`}>
        {pagedPhotos.map((p, i) => (
          <button
            key={p.imageKey}
            type="button"
            onClick={() => setLightboxIndex(startIdx + i)}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <nav
          className="mt-5 flex items-center justify-between gap-3"
          aria-label={t("페이지 이동", "Pagination")}
        >
          <button
            type="button"
            onClick={() => goToPage(page - 1)}
            disabled={page === 1}
            className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t("이전", "Prev")}
          </button>

          <span className="text-sm text-slate-600 tabular-nums">
            {t(
              `${startIdx + 1}-${endIdx} / 전체 ${photosShown.length}장`,
              `${startIdx + 1}–${endIdx} of ${photosShown.length}`
            )}
            <span className="mx-2 text-slate-300">·</span>
            <span className="font-semibold text-slate-800">
              {page} / {totalPages}
            </span>
          </span>

          <button
            type="button"
            onClick={() => goToPage(page + 1)}
            disabled={page === totalPages}
            className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {t("다음", "Next")}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </nav>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <PhotoLightbox
          photos={photosShown}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={(newIndex) => {
            setLightboxIndex(newIndex);
            // Keep the grid in sync — when arrows cross a page boundary,
            // jump the grid to the page containing the current photo
            // so closing the lightbox lands the user on the right page.
            const newPage = Math.floor(newIndex / PAGE_SIZE) + 1;
            if (newPage !== page) setPage(newPage);
          }}
        />
      )}
    </div>
  );
}
