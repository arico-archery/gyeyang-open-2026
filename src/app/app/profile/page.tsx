"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { useI18n } from "@/lib/i18n/context";
import { useAuth } from "@/lib/supabase/auth-context";
import { useState } from "react";

const CATEGORY_LABELS: Record<string, Record<string, string>> = {
  recurve_men: { ko: "남자 리커브", en: "Recurve Men" },
  recurve_women: { ko: "여자 리커브", en: "Recurve Women" },
};

const ROLE_LABELS: Record<string, Record<string, string>> = {
  athlete: { ko: "선수", en: "Athlete" },
  coach: { ko: "코치", en: "Coach" },
  judge: { ko: "심판", en: "Judge" },
  admin: { ko: "관리자", en: "Admin" },
};

export default function ProfilePage() {
  const { locale } = useI18n();
  const { user, profile, loading, signOut } = useAuth();
  const router = useRouter();
  const [qrFullScreen, setQrFullScreen] = useState(false);

  const t = (ko: string, en: string) => (locale === "ko" ? ko : en);

  if (loading) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-6 flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-6">
        <h1 className="text-xl font-bold text-gray-900 mb-4">{t("프로필", "Profile")}</h1>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            {t("로그인하여 프로필과 QR 코드를 확인하세요", "Sign in to view your profile and QR code")}
          </p>
          <Link
            href="/app/login"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            {t("로그인", "Sign In")}
          </Link>
        </div>
      </div>
    );
  }

  const qrUrl = `https://gyeyang-open.vercel.app/app/athlete/${profile.qr_token || profile.id}`;

  // Full-screen QR overlay
  if (qrFullScreen) {
    return (
      <div
        className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center"
        onClick={() => setQrFullScreen(false)}
      >
        <QRCodeSVG value={qrUrl} size={280} level="H" />
        <p className="mt-4 text-lg font-bold text-gray-900">{profile.full_name}</p>
        <p className="text-sm text-gray-500">{profile.nationality} · {ROLE_LABELS[profile.role]?.[locale]}</p>
        <p className="mt-6 text-xs text-gray-400">{t("화면을 탭하면 닫힙니다", "Tap to close")}</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 pt-6">
      <h1 className="text-xl font-bold text-gray-900 mb-4">{t("프로필", "Profile")}</h1>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600">
            {profile.full_name.charAt(0)}
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">{profile.full_name}</h2>
            {profile.full_name_en && (
              <p className="text-sm text-gray-500">{profile.full_name_en}</p>
            )}
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-medium text-gray-500">{profile.nationality}</span>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-semibold rounded-md">
                {ROLE_LABELS[profile.role]?.[locale] || profile.role}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          {profile.team && (
            <div className="flex gap-2">
              <span className="text-gray-400 w-14 shrink-0">{t("소속", "Team")}</span>
              <span className="text-gray-700">{profile.team}</span>
            </div>
          )}
          {profile.category && (
            <div className="flex gap-2">
              <span className="text-gray-400 w-14 shrink-0">{t("종별", "Event")}</span>
              <span className="text-gray-700">
                {CATEGORY_LABELS[profile.category]?.[locale] || profile.category}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* QR Code Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-4">
        <h3 className="text-sm font-bold text-gray-700 mb-3">{t("내 QR 코드", "My QR Code")}</h3>
        <div className="flex flex-col items-center">
          <div className="p-4 bg-white border-2 border-gray-100 rounded-xl">
            <QRCodeSVG value={qrUrl} size={180} level="H" />
          </div>
          <button
            onClick={() => setQrFullScreen(true)}
            className="mt-3 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            {t("전체화면으로 보기", "View Fullscreen")}
          </button>
          <p className="text-[10px] text-gray-400 mt-2 text-center">
            {t("심판/관리자가 스캔하여 정보를 확인합니다", "Judges/admins scan to verify your info")}
          </p>
        </div>
      </div>

      {/* Menu Items */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4">
        <Link href="/app/profile" className="flex items-center justify-between px-4 py-3.5 border-b border-gray-50 hover:bg-gray-50 transition-colors">
          <span className="text-sm text-gray-700">{t("참가 신청 현황", "Registration Status")}</span>
          <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
        <Link href="/app/profile" className="flex items-center justify-between px-4 py-3.5 border-b border-gray-50 hover:bg-gray-50 transition-colors">
          <span className="text-sm text-gray-700">{t("문의 내역", "My Inquiries")}</span>
          <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
        <Link href="/app/profile" className="flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 transition-colors">
          <span className="text-sm text-gray-700">{t("설정", "Settings")}</span>
          <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Sign Out */}
      <button
        onClick={async () => { await signOut(); router.push("/app"); }}
        className="w-full py-3 text-red-500 text-sm font-medium hover:bg-red-50 rounded-xl transition-colors"
      >
        {t("로그아웃", "Sign Out")}
      </button>
    </div>
  );
}
