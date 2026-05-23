"use client";

import { useState } from "react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n/context";
import PhotoGallery from "@/components/PhotoGallery";

const VIDEOS = [
  { id: "fOtG6mryA8o", year: "2026" },
  { id: "1OV5pCmHZYg", year: "2025" },
];

const POSTERS = [
  { src: "/images/poster_2026.jpg", year: "2026", alt: "2026 GYEYANG OPEN Poster" },
  { src: "/images/poster_2025.jpg", year: "2025", alt: "2025 GYEYANG OPEN Poster" },
];

export default function GalleryPage() {
  const { t } = useI18n();
  // Track which video iframes have been activated (one click → switch from
  // thumbnail to iframe). Using a Set keeps multiple videos independently
  // playable side-by-side.
  const [openVideos, setOpenVideos] = useState<Set<string>>(new Set());

  function openVideo(id: string) {
    setOpenVideos((prev) => new Set(prev).add(id));
  }

  return (
    <div className="bg-white">
      {/* Page header */}
      <header className="bg-slate-50 border-b border-slate-200 py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <p className="section-label mb-4">Gallery</p>
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            {t("gallery.pageTitle")}
          </h1>
          <p className="text-lg text-slate-600">
            {t("gallery.pageSubtitle")}
          </p>
        </div>
      </header>

      {/* Tournament photos (SmugMug) — moved to top */}
      <section className="py-16 lg:py-24">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight mb-2">
              {t("gallery.photosSectionTitle")}
            </h2>
            <p className="text-slate-600">{t("gallery.photosDesc")}</p>
          </div>

          <PhotoGallery />
        </div>
      </section>

      {/* Promotional videos — 2026 + 2025 side by side */}
      <section className="bg-slate-50 py-16 lg:py-24">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight mb-2">
              {t("gallery.promoSectionTitle")}
            </h2>
            <p className="text-slate-600">{t("gallery.promoSectionDesc")}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {VIDEOS.map((v) => {
              const isOpen = openVideos.has(v.id);
              return (
                <div key={v.id} className="group">
                  <div className="w-full aspect-video bg-slate-900 rounded-2xl overflow-hidden relative shadow-lg">
                    {isOpen ? (
                      <iframe
                        className="absolute inset-0 w-full h-full"
                        src={`https://www.youtube.com/embed/${v.id}?autoplay=1`}
                        title={`${v.year} GYEYANG OPEN — Promotional Video`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => openVideo(v.id)}
                        className="absolute inset-0 w-full h-full"
                        aria-label={`Play ${v.year} promotional video`}
                      >
                        <Image
                          src={`https://i.ytimg.com/vi/${v.id}/maxresdefault.jpg`}
                          alt=""
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                          <span className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-red-600/95 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                            <svg className="w-8 h-8 lg:w-10 lg:h-10 text-white ml-1" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </span>
                        </div>
                      </button>
                    )}
                  </div>
                  <p className="mt-4 text-center text-sm font-semibold text-slate-700 tracking-wider">
                    {v.year} GYEYANG OPEN
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Posters */}
      <section className="py-16 lg:py-24">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
              {t("gallery.postersSectionTitle")}
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-8 lg:gap-12">
            {POSTERS.map((p) => (
              <div key={p.year} className="group">
                <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
                  <Image
                    src={p.src}
                    alt={p.alt}
                    width={1200}
                    height={1697}
                    className="w-full h-auto rounded-lg"
                  />
                </div>
                <p className="mt-4 text-center text-sm font-semibold text-slate-700 tracking-wider">
                  {p.year} GYEYANG OPEN
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
