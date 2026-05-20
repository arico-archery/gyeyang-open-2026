"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Photo } from "@/app/api/photos/route";
import { useI18n } from "@/lib/i18n/context";

interface Props {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

/**
 * Fullscreen lightbox for SmugMug photos.
 * - Keyboard: ←/→ navigate, ESC close
 * - Touch: horizontal swipe navigate
 * - Tap on background closes; tap on image is ignored
 */
export default function PhotoLightbox({
  photos,
  index,
  onClose,
  onNavigate,
}: Props) {
  const { locale } = useI18n();
  const t = (ko: string, en: string) => (locale === "ko" ? ko : en);

  const photo = photos[index];
  const touchStartX = useRef<number | null>(null);
  const [loaded, setLoaded] = useState(false);

  const prev = useCallback(() => {
    if (index > 0) {
      setLoaded(false);
      onNavigate(index - 1);
    }
  }, [index, onNavigate]);

  const next = useCallback(() => {
    if (index < photos.length - 1) {
      setLoaded(false);
      onNavigate(index + 1);
    }
  }, [index, photos.length, onNavigate]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, prev, next]);

  // Lock scroll while open
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label={t("사진 보기", "Photo viewer")}
      onClick={onClose}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
        if (Math.abs(dx) > 50) {
          if (dx > 0) prev();
          else next();
        }
        touchStartX.current = null;
      }}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-4 py-3 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-sm tabular-nums opacity-80">
          {index + 1} / {photos.length}
        </span>
        <div className="flex items-center gap-3">
          <a
            href={photo.webUri}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sm:text-sm bg-white/10 hover:bg-white/20 transition-colors px-3 py-1.5 rounded-lg"
          >
            {t("SmugMug에서 보기", "View on SmugMug")} ↗
          </a>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
            aria-label={t("닫기", "Close")}
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Image */}
      <div
        className="flex-1 flex items-center justify-center px-4 pb-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}
        <Image
          key={photo.imageKey}
          src={photo.lightbox}
          alt={photo.caption || photo.fileName}
          width={photo.width}
          height={photo.height}
          sizes="100vw"
          className={`max-h-full max-w-full w-auto h-auto object-contain transition-opacity ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setLoaded(true)}
          priority
          unoptimized
        />

        {/* Prev/Next overlays */}
        {index > 0 && (
          <button
            type="button"
            onClick={prev}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
            aria-label={t("이전", "Previous")}
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        {index < photos.length - 1 && (
          <button
            type="button"
            onClick={next}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
            aria-label={t("다음", "Next")}
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* Caption */}
      {photo.caption && (
        <div
          className="px-4 pb-5 text-center text-sm text-white/80"
          onClick={(e) => e.stopPropagation()}
        >
          {photo.caption}
        </div>
      )}
    </div>
  );
}
