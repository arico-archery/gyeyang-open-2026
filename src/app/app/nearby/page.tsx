"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { supabase } from "@/lib/supabase/client";
import type { NearbyPlace, PlaceCategory } from "@/lib/supabase/types";

const CATEGORY_CONFIG: { value: PlaceCategory | "all"; ko: string; en: string; icon: string }[] = [
  { value: "all", ko: "전체", en: "All", icon: "📍" },
  { value: "restaurant", ko: "음식점", en: "Restaurant", icon: "🍽️" },
  { value: "cafe", ko: "카페", en: "Cafe", icon: "☕" },
  { value: "convenience", ko: "편의점", en: "Convenience", icon: "🏪" },
  { value: "hospital", ko: "병원", en: "Hospital", icon: "🏥" },
  { value: "pharmacy", ko: "약국", en: "Pharmacy", icon: "💊" },
  { value: "atm", ko: "ATM", en: "ATM", icon: "🏧" },
  { value: "transport", ko: "교통", en: "Transport", icon: "🚌" },
  { value: "tourism", ko: "관광", en: "Tourism", icon: "🏛️" },
];

const STATIC_PLACES: NearbyPlace[] = [
  {
    id: "1", name: "CU 계양아시아드점", name_en: "CU Convenience Store", category: "convenience",
    cuisine_type: null, address: "경기장 인근", address_en: "Near venue", lat: null, lng: null,
    distance_m: 200, phone: null, hours: "24h", price_range: "$",
    has_english_menu: false, has_halal: false, has_vegetarian: false, image_url: null, sort_order: 1,
  },
  {
    id: "2", name: "맥도날드 계양점", name_en: "McDonald's Gyeyang", category: "restaurant",
    cuisine_type: "western", address: "계양구", address_en: "Gyeyang-gu", lat: null, lng: null,
    distance_m: 500, phone: null, hours: "06:00~24:00", price_range: "$",
    has_english_menu: true, has_halal: false, has_vegetarian: true, image_url: null, sort_order: 2,
  },
  {
    id: "3", name: "스타벅스 계양점", name_en: "Starbucks Gyeyang", category: "cafe",
    cuisine_type: null, address: "계양구", address_en: "Gyeyang-gu", lat: null, lng: null,
    distance_m: 600, phone: null, hours: "07:00~22:00", price_range: "$$",
    has_english_menu: true, has_halal: false, has_vegetarian: true, image_url: null, sort_order: 3,
  },
  {
    id: "4", name: "작전역 (인천 1호선)", name_en: "Jakjeon Station (Line 1)", category: "transport",
    cuisine_type: null, address: "계양구 작전동", address_en: "Jakjeon-dong, Gyeyang-gu", lat: null, lng: null,
    distance_m: 800, phone: null, hours: "05:30~24:00", price_range: null,
    has_english_menu: false, has_halal: false, has_vegetarian: false, image_url: null, sort_order: 4,
  },
  {
    id: "5", name: "계양구보건소", name_en: "Gyeyang Health Center", category: "hospital",
    cuisine_type: null, address: "계양구", address_en: "Gyeyang-gu", lat: null, lng: null,
    distance_m: 1200, phone: "032-450-5800", hours: "09:00~18:00", price_range: null,
    has_english_menu: false, has_halal: false, has_vegetarian: false, image_url: null, sort_order: 5,
  },
];

export default function NearbyPage() {
  const { locale } = useI18n();
  const [places, setPlaces] = useState<NearbyPlace[]>(STATIC_PLACES);
  const [selectedCategory, setSelectedCategory] = useState<PlaceCategory | "all">("all");

  const t = (ko: string, en: string) => (locale === "ko" ? ko : en);

  useEffect(() => {
    supabase
      .from("nearby_places")
      .select("*")
      .order("distance_m")
      .then(({ data }) => {
        if (data && data.length > 0) setPlaces(data);
      });
  }, []);

  const filtered = selectedCategory === "all"
    ? places
    : places.filter((p) => p.category === selectedCategory);

  return (
    <div className="max-w-lg mx-auto px-4 pt-6">
      <h1 className="text-xl font-bold text-gray-900 mb-4">{t("주변 정보", "Nearby")}</h1>

      {/* Map embed */}
      <div className="w-full aspect-[16/9] rounded-xl overflow-hidden mb-4 border border-gray-200">
        <iframe
          src="https://www.google.com/maps?q=%EC%9D%B8%EC%B2%9C%EA%B3%84%EC%96%91%EC%95%84%EC%8B%9C%EC%95%84%EB%93%9C%EC%96%91%EA%B6%81%EC%9E%A5&output=embed"
          className="w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Venue Map"
        />
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {CATEGORY_CONFIG.map((c) => (
          <button
            key={c.value}
            onClick={() => setSelectedCategory(c.value)}
            className={`flex items-center gap-1 px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === c.value
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 border border-gray-200"
            }`}
          >
            <span>{c.icon}</span>
            {locale === "ko" ? c.ko : c.en}
          </button>
        ))}
      </div>

      {/* Place List */}
      <div className="space-y-3">
        {filtered.map((place) => (
          <div key={place.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900">
                  {locale === "ko" ? place.name : (place.name_en || place.name)}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {locale === "ko" ? place.address : (place.address_en || place.address)}
                </p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {place.distance_m && (
                    <span className="text-xs text-blue-600 font-medium">
                      {place.distance_m >= 1000
                        ? `${(place.distance_m / 1000).toFixed(1)}km`
                        : `${place.distance_m}m`}
                    </span>
                  )}
                  {place.hours && (
                    <span className="text-xs text-gray-400">{place.hours}</span>
                  )}
                  {place.price_range && (
                    <span className="text-xs text-gray-400">{place.price_range}</span>
                  )}
                </div>
                <div className="flex gap-1.5 mt-2">
                  {place.has_english_menu && (
                    <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[10px] font-medium rounded-md">
                      {t("영문메뉴", "EN Menu")}
                    </span>
                  )}
                  {place.has_halal && (
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-medium rounded-md">
                      Halal
                    </span>
                  )}
                  {place.has_vegetarian && (
                    <span className="px-2 py-0.5 bg-lime-50 text-lime-600 text-[10px] font-medium rounded-md">
                      {t("채식", "Vegan")}
                    </span>
                  )}
                </div>
              </div>
              {place.phone && (
                <a href={`tel:${place.phone}`} className="shrink-0 w-10 h-10 flex items-center justify-center bg-blue-50 rounded-full">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-10 text-sm text-gray-400">
            {t("해당 카테고리에 등록된 장소가 없습니다", "No places in this category")}
          </div>
        )}
      </div>
    </div>
  );
}
