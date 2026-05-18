"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { getDDay, EVENT_START_ISO, EVENT_END_ISO } from "@/lib/event";

const YOUTUBE_ID = "1OV5pCmHZYg";

export default function Hero() {
  const { t, locale } = useI18n();
  const [dDay, setDDay] = useState<{ label: string; inEvent: boolean; ended: boolean } | null>(null);
  const [videoOpen, setVideoOpen] = useState(false);

  useEffect(() => {
    setDDay(getDDay());
  }, []);

  const dateRange = locale === "ko"
    ? `${EVENT_START_ISO.replace(/-/g, ".")} ~ ${EVENT_END_ISO.replace(/-/g, ".")}`
    : `${EVENT_START_ISO} ~ ${EVENT_END_ISO}`;

  return (
    <section className="relative bg-white overflow-hidden">
      <div className="absolute -top-20 -bottom-12 left-0 right-1/2 z-0 bg-blue-600 rounded-br-[5rem] hidden lg:block">
        <div className="absolute inset-0 overflow-hidden opacity-20">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute border-2 border-white rounded-full"
              style={{
                width: `${120 + i * 40}px`,
                height: `${120 + i * 40}px`,
                left: `${-20 + (i % 3) * 120}px`,
                top: `${40 + Math.floor(i / 3) * 180}px`,
              }}
            />
          ))}
        </div>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center lg:justify-end">
            <Image
              src="/images/poster_2026.jpg"
              alt="2026 GYEYANG OPEN Invitation Poster"
              width={1200}
              height={1697}
              className="rounded-xl shadow-xl w-64 md:w-80 lg:w-[470px] h-auto"
              priority
            />
          </div>
          <div className="flex flex-col items-start gap-7">
            {/* D-Day badge + status */}
            <div className="flex flex-col gap-3 w-full">
              {dDay && (
                <div className="inline-flex items-center gap-3">
                  <span
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${
                      dDay.inEvent
                        ? "bg-red-100 text-red-700"
                        : dDay.ended
                          ? "bg-slate-100 text-slate-700"
                          : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {dDay.label}
                  </span>
                  {dDay.inEvent && (
                    <span className="text-base font-semibold text-red-600">
                      {t("hero.inProgress")}
                    </span>
                  )}
                  {dDay.ended && (
                    <span className="text-base font-semibold text-slate-600">{t("hero.ended")}</span>
                  )}
                </div>
              )}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
                {t("hero.date")}
              </h2>
              <p className="text-base text-slate-600 font-medium">{dateRange}</p>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3">
              {dDay?.ended ? (
                <a href="/archive/2026" className="btn-download btn-download-sm">
                  {t("hero.viewResults")}
                </a>
              ) : (
                <a href="/registration" className="btn-download btn-download-sm">
                  {t("hero.applyNow")}
                </a>
              )}
              <a href="/app" className="btn-download btn-download-sm bg-gray-900 hover:bg-gray-700">
                {t("hero.openApp")}
              </a>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-4">
              <a href="https://www.facebook.com/happygyeyang/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors" aria-label="Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://www.instagram.com/gyeyangopen/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-pink-50 hover:text-pink-600 transition-colors" aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="https://www.youtube.com/@GyeyangOpen" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors" aria-label="YouTube">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>

            {/* YouTube — lazy: show thumbnail until clicked */}
            <div className="w-full aspect-video bg-gray-900 rounded-xl overflow-hidden relative">
              {videoOpen ? (
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1`}
                  title="GYEYANG OPEN highlights"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setVideoOpen(true)}
                  className="absolute inset-0 w-full h-full group"
                  aria-label={t("hero.playVideo")}
                >
                  <Image
                    src={`https://i.ytimg.com/vi/${YOUTUBE_ID}/hqdefault.jpg`}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <span className="w-16 h-16 rounded-full bg-red-600/95 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-white ml-1" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                    </span>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
