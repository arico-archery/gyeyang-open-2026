"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { useAuth } from "@/lib/supabase/auth-context";
import { supabase } from "@/lib/supabase/client";
import { isSuperAdmin } from "@/lib/super-admin";
import { getDDay } from "@/lib/event";

interface Announcement {
  id: string;
  title: string;
  title_en: string | null;
  created_at: string;
  priority: "normal" | "important" | "urgent";
}

export default function AppHome() {
  const { locale, setLocale } = useI18n();
  const { user, profile } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [dDay, setDDay] = useState("");

  const t = (ko: string, en: string) => (locale === "ko" ? ko : en);

  useEffect(() => {
    setDDay(getDDay().label);
  }, []);

  useEffect(() => {
    supabase
      .from("announcements")
      .select("id, title, title_en, created_at, priority")
      .order("created_at", { ascending: false })
      .limit(3)
      .then(({ data }) => {
        if (data) setAnnouncements(data);
      });
  }, []);

  const showAdmin = profile?.role === "admin" || isSuperAdmin(user?.email);

  return (
    <div className="max-w-lg mx-auto px-4 pt-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg font-bold text-gray-900">
            {t("2026 계양 오픈", "2026 GYEYANG OPEN")}
          </h1>
          <p className="text-xs text-gray-500">
            {t("국제 양궁 대회", "International Archery Tournament")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLocale(locale === "ko" ? "en" : "ko")}
            className="px-2.5 py-1.5 bg-gray-100 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-200 transition-colors"
          >
            {locale === "ko" ? "EN" : "KO"}
          </button>
          {user && profile && (
            <Link href="/app/profile">
              <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">
                {profile.full_name.charAt(0)}
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* D-Day Card */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-5 mb-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-200 text-xs font-medium mb-1">
              {t("2026 계양구청장배 국제양궁대회", "2026 GYEYANG OPEN")}
            </p>
            <p className="text-3xl font-black">{dDay}</p>
            <p className="text-blue-200 text-sm mt-1">2026.05.13 ~ 05.18</p>
          </div>
          <div className="text-5xl opacity-30">🏹</div>
        </div>
      </div>

      {/* Thank-you card — post-event message */}
      <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-5 mb-4">
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-blue-600 mb-2">
          {t("감사의 말씀", "Thank You")}
        </p>
        <h2 className="text-base font-bold text-slate-900 leading-snug mb-3">
          {t(
            "함께해 주신 모든 분들께 감사드립니다",
            "Thank you to everyone who made this tournament possible"
          )}
        </h2>
        <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
          <div>
            <p className="text-[11px] font-bold tracking-wider uppercase text-slate-500 mb-1">
              {t("참가 선수 여러분께", "To Our Athletes")}
            </p>
            <p>
              {t(
                "한 발 한 발에 담아주신 열정과 도전 정신이 이번 대회를 더없이 빛나게 했습니다. 다음 무대에서의 빛나는 활약을 응원합니다.",
                "The passion and competitive spirit you brought to every arrow made this tournament truly memorable. We wish you continued success."
              )}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-bold tracking-wider uppercase text-slate-500 mb-1">
              {t("관계자·자원봉사자·후원사 여러분께", "To Our Staff, Volunteers, and Sponsors")}
            </p>
            <p>
              {t(
                "보이지 않는 곳에서의 노고가 있었기에 「2026 GYEYANG OPEN」이 세계 양궁인들의 마음에 오래 남는 무대가 될 수 있었습니다. 깊이 감사드립니다.",
                "Behind every smooth moment was your effort — thanks to you, this tournament will remain in the hearts of the global archery community."
              )}
            </p>
          </div>
        </div>
        <p className="mt-4 pt-3 border-t border-slate-100 text-right text-xs text-slate-500 font-medium">
          — {t("2026 계양오픈 조직위원회 일동", "The 2026 GYEYANG OPEN Organizing Committee")}
        </p>
      </div>

      {/* Quick Menu */}
      <div className="grid grid-cols-5 gap-2 mb-4">
        <Link href="/app/schedule" className="flex flex-col items-center gap-1.5 bg-white rounded-xl border border-gray-100 py-3 shadow-sm hover:shadow transition-shadow">
          <span className="text-2xl">📅</span>
          <span className="text-[11px] font-medium text-gray-700">{t("일정", "Schedule")}</span>
        </Link>
        <Link href="/app/scores" className="flex flex-col items-center gap-1.5 bg-white rounded-xl border border-gray-100 py-3 shadow-sm hover:shadow transition-shadow">
          <span className="text-2xl">🏆</span>
          <span className="text-[11px] font-medium text-gray-700">{t("점수", "Scores")}</span>
        </Link>
        <Link href="/app/participants" className="flex flex-col items-center gap-1.5 bg-white rounded-xl border border-gray-100 py-3 shadow-sm hover:shadow transition-shadow">
          <span className="text-2xl">👥</span>
          <span className="text-[11px] font-medium text-gray-700">{t("선수", "Athletes")}</span>
        </Link>
        <Link href="/app/photos" className="flex flex-col items-center gap-1.5 bg-white rounded-xl border border-gray-100 py-3 shadow-sm hover:shadow transition-shadow">
          <span className="text-2xl">📷</span>
          <span className="text-[11px] font-medium text-gray-700">{t("사진", "Photos")}</span>
        </Link>
        <Link href="/app/nearby" className="flex flex-col items-center gap-1.5 bg-white rounded-xl border border-gray-100 py-3 shadow-sm hover:shadow transition-shadow">
          <span className="text-2xl">📍</span>
          <span className="text-[11px] font-medium text-gray-700">{t("주변", "Nearby")}</span>
        </Link>
      </div>

      {/* Announcements */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-gray-900">{t("공지사항", "Announcements")}</h2>
          <Link href="/app/announcements" className="text-xs text-blue-600 font-medium">
            {t("전체보기", "View All")}
          </Link>
        </div>
        {announcements.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">
            {t("아직 공지사항이 없습니다", "No announcements yet")}
          </p>
        ) : (
          <div className="space-y-2">
            {announcements.map((a) => (
              <Link
                key={a.id}
                href={"/app/announcements/" + a.id}
                className="flex items-start gap-2 py-1.5"
              >
                {a.priority === "urgent" && (
                  <span className="shrink-0 px-1.5 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded">
                    {t("긴급", "URG")}
                  </span>
                )}
                {a.priority === "important" && (
                  <span className="shrink-0 px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded">
                    {t("안내", "NOT")}
                  </span>
                )}
                <span className="text-sm text-gray-700 line-clamp-1 flex-1">
                  {locale === "ko" ? a.title : a.title_en || a.title}
                </span>
                <span className="text-[10px] text-gray-400 shrink-0">
                  {new Date(a.created_at).toLocaleDateString(locale === "ko" ? "ko-KR" : "en-US", { month: "short", day: "numeric" })}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Tournament Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
        <h2 className="text-sm font-bold text-gray-900 mb-3">{t("대회 정보", "Tournament Info")}</h2>
        <div className="space-y-2.5 text-sm text-gray-600">
          <div className="flex gap-2">
            <span className="text-gray-400 w-14 shrink-0">{t("대회명", "Name")}</span>
            <span className="text-gray-800 font-medium">{t("2026 계양구청장배 국제양궁대회", "2026 GYEYANG OPEN International Archery Tournament")}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-gray-400 w-14 shrink-0">{t("기간", "Date")}</span>
            <span>{t("2026.05.13(수) ~ 05.18(월)", "2026.05.13(Wed) ~ 05.18(Mon)")}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-gray-400 w-14 shrink-0">{t("예선", "Qual")}</span>
            <span>{t("계양아시아드양궁장", "Gyeyang Asiad Archery Range")}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-gray-400 w-14 shrink-0">{t("결승", "Finals")}</span>
            <span>{t("계양아라온 수향원", "Gyeyang Araon Suhyangwon")}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-gray-400 w-14 shrink-0">{t("종목", "Events")}</span>
            <span>{t("리커브(남/여), 컴파운드(남/여)", "Recurve (M/W), Compound (M/W)")}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-gray-400 w-14 shrink-0">{t("주최", "Host")}</span>
            <span>{t("계양구", "Gyeyang-gu")}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-gray-400 w-14 shrink-0">{t("주관", "Org")}</span>
            <span>{t("계양구체육회", "Gyeyang-gu Sports Council")}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-gray-400 w-14 shrink-0">{t("후원", "Sponsor")}</span>
            <span>{t("대한양궁협회", "Korea Archery Association")}</span>
          </div>
        </div>
      </div>

      {/* Website Link */}
      <a
        href="https://www.gyeyangopen.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-gray-50 rounded-xl border border-gray-200 p-4 text-center hover:bg-gray-100 transition-colors mb-4"
      >
        <p className="text-sm font-medium text-gray-700">{t("공식 웹사이트 방문", "Visit Official Website")}</p>
        <p className="text-xs text-gray-400 mt-1">www.gyeyangopen.com</p>
      </a>

      {/* Admin Link */}
      {showAdmin && (
        <Link
          href="/app/admin"
          className="flex items-center justify-between px-4 py-3.5 bg-amber-50 border border-amber-200 rounded-xl hover:bg-amber-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">⚙️</span>
            <span className="text-sm font-medium text-amber-900">{t("관리자 대시보드", "Admin Dashboard")}</span>
          </div>
          <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}
    </div>
  );
}
