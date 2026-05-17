"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { useAuth } from "@/lib/supabase/auth-context";
import type { Announcement } from "@/lib/supabase/types";
import { supabase } from "@/lib/supabase/client";

const EVENT_DATE = new Date("2026-07-10T00:00:00+09:00");

function getDDay() {
  const now = new Date();
  const diff = EVENT_DATE.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

const QUICK_MENU = [
  { key: "schedule", href: "/app/schedule", icon: "📅", ko: "일정", en: "Schedule" },
  { key: "scores", href: "/app/scores", icon: "🎯", ko: "점수", en: "Scores" },
  { key: "qr", href: "/app/profile", icon: "📷", ko: "QR 코드", en: "QR Code" },
  { key: "map", href: "/app/nearby", icon: "🗺️", ko: "주변 지도", en: "Nearby" },
];

export default function AppHomePage() {
  const { locale } = useI18n();
  const { user, profile, loading } = useAuth();
  const [dDay, setDDay] = useState(getDDay());
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    const timer = setInterval(() => setDDay(getDDay()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(3)
      .then(({ data }) => {
        if (data) setAnnouncements(data);
      });
  }, []);

  const t = (ko: string, en: string) => (locale === "ko" ? ko : en);

  return (
    <div className="max-w-lg mx-auto px-4 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Image src="/images/logo.png" alt="Logo" width={40} height={44} />
          <div>
            <h1 className="text-lg font-bold text-gray-900">2026 GYEYANG OPEN</h1>
            <p className="text-xs text-gray-500">{t("국제양궁대회", "Int'l Archery Competition")}</p>
          </div>
        </div>
        {!loading && !user && (
          <Link
            href="/app/login"
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t("로그인", "Login")}
          </Link>
        )}
        {profile && (
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{profile.full_name}</p>
            <p className="text-xs text-gray-500">{profile.nationality}</p>
          </div>
        )}
      </div>

      {/* D-Day Card */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white mb-6 shadow-lg">
        <div className="text-center">
          <p className="text-5xl font-black mb-2">
            {dDay > 0 ? `D - ${dDay}` : dDay === 0 ? "D-DAY!" : `D + ${Math.abs(dDay)}`}
          </p>
          <p className="text-blue-100 text-sm">2026.07.10 ~ 07.12</p>
          <p className="text-blue-200 text-xs mt-1">
            {t("인천계양아시아드양궁장", "Gyeyang Asiad Archery Field")}
          </p>
        </div>
      </div>

      {/* Quick Menu */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {QUICK_MENU.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className="flex flex-col items-center gap-1.5 p-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="text-xs font-medium text-gray-700">
              {locale === "ko" ? item.ko : item.en}
            </span>
          </Link>
        ))}
      </div>

      {/* Announcements */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-gray-900">
            {t("공지사항", "Announcements")}
          </h2>
        </div>
        {announcements.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-50">
            {announcements.map((a) => (
              <div key={a.id} className="px-4 py-3 flex items-start gap-3">
                <span className={`shrink-0 mt-0.5 w-2 h-2 rounded-full ${
                  a.priority === "urgent" ? "bg-red-500" :
                  a.priority === "important" ? "bg-amber-500" : "bg-blue-400"
                }`} />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {locale === "ko" ? a.title : (a.title_en || a.title)}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(a.created_at).toLocaleDateString(locale === "ko" ? "ko-KR" : "en-US")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
            <p className="text-sm text-gray-400">{t("아직 공지사항이 없습니다", "No announcements yet")}</p>
          </div>
        )}
      </div>

      {/* Tournament Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <h2 className="text-base font-bold text-gray-900 mb-3">
          {t("대회 정보", "Tournament Info")}
        </h2>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex gap-2">
            <span className="text-gray-400 w-16 shrink-0">{t("기간", "Date")}</span>
            <span>2026.07.10(Fri) ~ 07.12(Sun)</span>
          </div>
          <div className="flex gap-2">
            <span className="text-gray-400 w-16 shrink-0">{t("장소", "Venue")}</span>
            <span>{t("인천계양아시아드양궁장", "Gyeyang Asiad Archery Field")}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-gray-400 w-16 shrink-0">{t("종별", "Events")}</span>
            <span>{t("리커브 남/여 개인·단체", "Recurve M/W Individual & Team")}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-gray-400 w-16 shrink-0">{t("주최", "Host")}</span>
            <span>{t("계양구청 / 인천광역시양궁협회", "Gyeyang District / Incheon Archery Association")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
