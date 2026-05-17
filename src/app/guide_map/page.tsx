"use client";

import Image from "next/image";
import { useI18n } from "@/lib/i18n/context";

const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/place/%EC%9D%B8%EC%B2%9C%EA%B3%84%EC%96%91%EC%95%84%EC%8B%9C%EC%95%84%EB%93%9C%EC%96%91%EA%B6%81%EC%9E%A5/@37.5452,126.7231,16z";

export default function GuideMapPage() {
  const { t } = useI18n();

  return (
    <div className="py-8 lg:py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          {t("guideMap.pageTitle")}
        </h1>

        {/* Google Map Section */}
        <section className="mb-12">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="w-full aspect-[16/9] md:aspect-[21/9]">
              <iframe
                src="https://www.google.com/maps?q=%EC%9D%B8%EC%B2%9C%EA%B4%91%EC%97%AD%EC%8B%9C+%EA%B3%84%EC%96%91%EA%B5%AC+%EB%B4%89%EC%98%A4%EB%8C%80%EB%A1%9C+855&output=embed"
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Gyeyang Asiad Archery Field"
              />
            </div>
            <div className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 text-lg">{t("guideMap.venueTitle")}</h2>
                  <p className="text-gray-500 text-sm mt-0.5">{t("guideMap.address")}</p>
                </div>
              </div>
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                {t("guideMap.openInMaps")}
              </a>
            </div>
          </div>
        </section>

        <div className="space-y-12">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t("guideMap.asiadTitle")}</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <Image
                src="/images/asiad1.jpg"
                alt={t("guideMap.asiadTitle")}
                width={1200}
                height={1692}
                className="w-full h-auto"
              />
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t("guideMap.araonTitle")}</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <Image
                src="/images/araon_guide_map.jpg"
                alt={t("guideMap.araonTitle")}
                width={1692}
                height={1200}
                className="w-full h-auto"
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
