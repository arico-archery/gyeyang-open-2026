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
  { key: "schedule", href: "/app/schedule", icon: "\ud83d\udcc5", ko: "\uc77c\uc815", en: "Schedule" },
  { key: "scores", href: "/app/scores", icon: "\ud83c\udfaf", ko: "\uc810\uc218", en: "Scores" },
  { key: "qr", href: "/app/profile", icon: "\ud83d\udcf7", ko: "QR \ucf54\ub4dc", en: "QR Code" },
  { key: "map", href: "/app/nearby", icon: "\ud83d\uddfa\ufe0f", ko: "\uc8fc\ubcc0 \uc9c0\ub3c4", en: "Nearby" },
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
    <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Image src="/images/logo.png" alt="Logo" width={40} height={44} />
          <div>
            <h1 className="text-lg font-bold text-gray-900">2026 GYEYANG OPEN</h1>
            <p className="text-xs text-gray-500">{t("\uad6d\uc81c\uc591\uad81\ub300\ud68c", "Int'l Archery Competition")}</p>
          </div>
        </div>
        {!loading && !user && (
          <Link
            href="/app/login"
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t("\ub85c\uadf8\uc778", "Login")}
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
            {t("\uc778\ucc9c\uacc4\uc591\uc544\uc2dc\uc544\ub4dc\uc591\uad81\uc7a5", "Gyeyang Asiad Archery Field")}
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
            {t("\uacf5\uc9c0\uc0ac\ud56d", "Announcements")}
          </h2>
          <Link href="/app/announcements" className="text-xs text-blue-600 font-medium">
            {t("\uc804\uccb4\ubcf4\uae30", "View All")}
          </Link>
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
            <p className="text-sm text-gray-400">{t("\uc544\uc9c1 \uacf5\uc9c0\uc0ac\ud56d\uc774 \uc5c6\uc2b5\ub2c8\ub2e4", "No announcements yet")}</p>
          </div>
        )}
      </div>

      {/* Tournament Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <h2 className="text-base font-bold text-gray-900 mb-3">
          {t("\ub300\ud68c \uc815\ubcf4", "Tournament Info")}
        </h2>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex gap-2">
            <span className="text-gray-400 w-16 shrink-0">{t("\uae30\uac04", "Date")}</span>
            <span>2026.07.10(Fri) ~ 07.12(Sun)</span>
          </div>
          <div className="flex gap-2">
            <span className="text-gray-400 w-16 shrink-0">{t("\uc7a5\uc18c", "Venue")}</span>
            <span>{t("\uc778\ucc9c\uacc4\uc591\uc544\uc2dc\uc544\ub4dc\uc591\uad81\uc7a5", "Gyeyang Asiad Archery Field")}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-gray-400 w-16 shrink-0">{t("\uc885\ubcc4", "Events")}</span>
            <span>{t("\ub9ac\ucee4\ube0c \ub0a8/\uc5ec \uac1c\uc778\u00b7\ub2e8\uccb4", "Recurve M/W Individual & Team")}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-gray-400 w-16 shrink-0">{t("\uc8fc\ucd5c", "Host")}</span>
            <span>{t("\uacc4\uc591\uad6c\uccad / \uc778\ucc9c\uad11\uc5ed\uc2dc\uc591\uad81\ud611\ud68c", "Gyeyang District / Incheon Archery Association")}</span>
          </div>
        </div>
      </div>

      {/* Website Link */}
      <Link
        href="/"
        className="flex items-center justify-center gap-2 mb-6 py-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
      >
        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
        <span className="text-sm font-medium text-gray-700">
          {t("\ub300\ud68c \uacf5\uc2dd \ud648\ud398\uc774\uc9c0 \ubcf4\uae30", "Visit Official Website")}
        </span>
      </Link>
    </div>
  );
}
