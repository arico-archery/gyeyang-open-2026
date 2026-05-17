"use client";

import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/lib/i18n/context";

export default function Archive2025Page() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* Page Header */}
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider mb-5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            2025
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {t("archive2025.pageTitle")}
          </h1>
          <p className="text-gray-500 text-lg sm:text-xl max-w-2xl mx-auto mb-8">
            {t("archive2025.subtitle")}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 font-medium px-4 py-2 rounded-lg transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t("archive2025.backTo2026")}
          </Link>
        </header>

        {/* 2025 Poster & Video */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Poster */}
            <div className="flex justify-center">
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 sm:p-6 inline-block">
                <Image
                  src="/images/poster_2025.jpg"
                  alt="2025 GYEYANG OPEN Poster"
                  width={400}
                  height={566}
                  className="rounded-xl w-64 sm:w-80 md:w-[400px] h-auto"
                />
              </div>
            </div>
            {/* Video */}
            <div className="flex flex-col gap-4">
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" />
                    <path fill="#fff" d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                  2025 GYEYANG OPEN
                </h3>
                <div className="w-full aspect-video rounded-xl overflow-hidden">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/1OV5pCmHZYg"
                    title="2025 GYEYANG OPEN"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Schedule Summary */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {t("archive2025.scheduleTitle")}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((day) => (
              <div
                key={day}
                className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:border-amber-200 transition-all duration-200"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-xs font-bold">
                    D{day}
                  </span>
                  <span className="text-sm font-medium text-amber-600">
                    {t(`archive2025.day${day}Date`)}
                  </span>
                </div>
                <div className="text-gray-800 font-medium leading-snug">
                  {t(`archive2025.day${day}Title`)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Scoreboard Link */}
        <section className="mb-16">
          <div className="relative overflow-hidden bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl p-8 sm:p-10 text-center">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 right-4 w-32 h-32 rounded-full border-4 border-white" />
              <div className="absolute bottom-4 left-4 w-24 h-24 rounded-full border-4 border-white" />
            </div>
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                {t("archive2025.scoreboardTitle")}
              </h2>
              <p className="text-amber-100 text-lg mb-6 max-w-md mx-auto">
                {t("archive2025.participants")}
              </p>
              <a
                href={t("archive2025.ianseoUrl")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-amber-700 font-semibold px-7 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {t("archive2025.scoreboardLink")}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* Registration Info */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {t("archive2025.registrationTitle")}
            </h2>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
              <div className="p-5 sm:p-6 space-y-5">
                <div>
                  <dt className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">
                    {t("archive2025.regOpensLabel")}
                  </dt>
                  <dd className="text-gray-800 font-semibold">
                    {t("archive2025.regOpens")}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">
                    {t("archive2025.regDeadlineLabel")}
                  </dt>
                  <dd className="text-gray-800 font-semibold">
                    {t("archive2025.regDeadline")}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">
                    {t("archive2025.invoicePaymentLabel")}
                  </dt>
                  <dd className="text-gray-800 font-semibold">
                    {t("archive2025.invoicePayment")}
                  </dd>
                </div>
              </div>
              <div className="p-5 sm:p-6 space-y-5">
                <div>
                  <dt className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">
                    {t("archive2025.refundDeadlineLabel")}
                  </dt>
                  <dd className="text-gray-800 font-semibold">
                    {t("archive2025.refundDeadline")}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">
                    {t("archive2025.visaDeadlineLabel")}
                  </dt>
                  <dd className="text-gray-800 font-semibold">
                    {t("archive2025.visaDeadline")}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">
                    {t("archive2025.entryFeeLabel")}
                  </dt>
                  <dd className="text-gray-800 font-semibold">
                    {t("archive2025.entryFeeAthlete")}
                  </dd>
                  <dd className="text-gray-500 text-sm mt-0.5">
                    {t("archive2025.entryFeeOfficial")}
                  </dd>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Partner Hotels */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {t("archive2025.hotelsTitle")}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-100 px-4 py-3.5 flex items-center gap-3 hover:border-green-200 hover:shadow-sm transition-all"
              >
                <span className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {i}
                </span>
                <span className="text-gray-700 font-medium text-sm leading-tight">
                  {t(`archive2025.hotel${i}`)}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {t("archive2025.contactTitle")}
            </h2>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <dt className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-0.5">
                    {t("archive2025.contactNameLabel")}
                  </dt>
                  <dd className="text-gray-800 font-semibold">
                    {t("archive2025.contactName")}
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  </svg>
                </div>
                <div>
                  <dt className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-0.5">
                    WhatsApp
                  </dt>
                  <dd className="text-gray-800 font-semibold">
                    {t("archive2025.contactWhatsapp")}
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <dt className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-0.5">
                    Email
                  </dt>
                  <dd className="text-gray-800 font-semibold">
                    {t("archive2025.contactEmail")}
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <div>
                  <dt className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-0.5">
                    Website
                  </dt>
                  <dd className="text-gray-800 font-semibold">
                    {t("archive2025.contactWebsite")}
                  </dd>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-gray-400 text-sm pt-10 border-t border-gray-200">
          <p>{t("archive2025.footer")}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-1 mt-4 text-amber-600 hover:text-amber-700 font-medium text-sm transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t("archive2025.backTo2026")}
          </Link>
        </footer>
      </div>
    </div>
  );
}
