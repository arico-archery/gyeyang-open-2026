"use client";

import { useState } from "react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n/context";

const YOUTUBE_ID = "1OV5pCmHZYg";

const POSTERS = [
  { src: "/images/poster_2026.jpg", year: "2026", alt: "2026 GYEYANG OPEN Poster" },
  { src: "/images/poster_2025.jpg", year: "2025", alt: "2025 GYEYANG OPEN Poster" },
];

export default function GalleryPage() {
  const { t } = useI18n();
  const [videoOpen, setVideoOpen] = useState(false);

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

      {/* Promotional video */}
      <section className="py-16 lg:py-24">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight mb-2">
              {t("gallery.promoSectionTitle")}
            </h2>
            <p className="text-slate-600">{t("gallery.promoSectionDesc")}</p>
          </div>

          <div className="w-full aspect-video bg-slate-900 rounded-2xl overflow-hidden relative shadow-lg">
            {videoOpen ? (
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1`}
                title="2026 GYEYANG OPEN — Promotional Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <button
                type="button"
                onClick={() => setVideoOpen(true)}
                className="absolute inset-0 w-full h-full group"
                aria-label="Play promotional video"
              >
                <Image
                  src={`https://i.ytimg.com/vi/${YOUTUBE_ID}/maxresdefault.jpg`}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <span className="w-20 h-20 rounded-full bg-red-600/95 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <svg className="w-10 h-10 text-white ml-1" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </div>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Posters */}
      <section className="bg-slate-50 py-16 lg:py-24">
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

      {/* Tournament photos placeholder */}
      <section className="py-16 lg:py-24">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight mb-2">
              {t("gallery.photosSectionTitle")}
            </h2>
            <p className="text-slate-600">{t("gallery.photosDesc")}</p>
          </div>

          <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 py-20 text-center">
            <svg className="w-12 h-12 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-slate-500 text-sm">
              {t("gallery.postersComingSoon")}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
