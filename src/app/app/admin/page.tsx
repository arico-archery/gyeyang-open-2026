"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useInlineT } from "@/lib/i18n/inline";
import { useAuth } from "@/lib/supabase/auth-context";
import { supabase } from "@/lib/supabase/client";
import { isSuperAdmin } from "@/lib/super-admin";

interface Stats {
  totalRegistrations: number;
  pendingRegistrations: number;
  totalAnnouncements: number;
  pendingInquiries: number;
  pendingContactMessages: number;
  todayAttendance: number;
  totalAthletes: number;
}

export default function AdminPage() {
  const { user, profile, loading } = useAuth();
  const [stats, setStats] = useState<Stats>({ totalRegistrations: 0, pendingRegistrations: 0, totalAnnouncements: 0, pendingInquiries: 0, pendingContactMessages: 0, todayAttendance: 0, totalAthletes: 0 });
  const [refreshState, setRefreshState] = useState<"idle" | "loading" | "ok" | "error">("idle");

  const t = useInlineT();

  async function refreshPhotos() {
    setRefreshState("loading");
    try {
      const { data: sess } = await supabase.auth.getSession();
      const token = sess.session?.access_token;
      if (!token) throw new Error("not signed in");
      const res = await fetch("/api/photos/revalidate", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setRefreshState("ok");
      setTimeout(() => setRefreshState("idle"), 3000);
    } catch (e) {
      console.error("refreshPhotos failed:", e);
      setRefreshState("error");
      setTimeout(() => setRefreshState("idle"), 3000);
    }
  }

  useEffect(() => {
    async function fetchStats() {
      const today = new Date().toISOString().split("T")[0];
      const [regAll, regPending, annCount, inqPending, contactPending, attToday, athletes] = await Promise.all([
        supabase.from("registrations").select("id", { count: "exact", head: true }),
        supabase.from("registrations").select("id", { count: "exact", head: true }).eq("status", "submitted"),
        supabase.from("announcements").select("id", { count: "exact", head: true }),
        supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("attendance").select("id", { count: "exact", head: true }).eq("check_date", today),
        supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "athlete"),
      ]);
      setStats({
        totalRegistrations: regAll.count ?? 0,
        pendingRegistrations: regPending.count ?? 0,
        totalAnnouncements: annCount.count ?? 0,
        pendingInquiries: inqPending.count ?? 0,
        pendingContactMessages: contactPending.count ?? 0,
        todayAttendance: attToday.count ?? 0,
        totalAthletes: athletes.count ?? 0,
      });
    }
    const isAdmin = profile?.role === "admin" || isSuperAdmin(user?.email);
    if (isAdmin) fetchStats();
  }, [profile, user]);

  const superAdmin = isSuperAdmin(user?.email);
  const isAdmin = profile?.role === "admin" || superAdmin;

  if (loading) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-6">
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-6 text-center">
        <p className="text-red-500 font-medium">{t("\uad00\ub9ac\uc790 \uad8c\ud55c\uc774 \ud544\uc694\ud569\ub2c8\ub2e4", "Admin access required")}</p>
        <Link href="/app" className="text-blue-600 text-sm mt-4 inline-block">{t("\ud648\uc73c\ub85c", "Go Home")}</Link>
      </div>
    );
  }

  const MENU = [
    { href: "/app/admin/announcements", icon: "\ud83d\udce2", label: t("\uacf5\uc9c0\uc0ac\ud56d \uad00\ub9ac", "Announcements"), count: stats.totalAnnouncements },
    { href: "/app/admin/registrations", icon: "\ud83d\udccb", label: t("\ucc38\uac00\uc2e0\uccad \uad00\ub9ac", "Registrations"), count: stats.pendingRegistrations, badge: true },
    { href: "/app/admin/attendance", icon: "\u2705", label: t("\ucd9c\uc11d \uad00\ub9ac", "Attendance"), count: stats.todayAttendance, badge: false },
    { href: "/app/admin/targets", icon: "\ud83c\udfaf", label: t("\ud0c0\uac9f \ubc30\uc815", "Target Assignment"), count: null },
    { href: "/app/admin/inquiries", icon: "\ud83d\udcac", label: t("\uc571 \ubb38\uc758 \ub2f5\ubcc0", "App Inquiries"), count: stats.pendingInquiries, badge: true },
    { href: "/app/admin/contact-messages", icon: "\u2709\ufe0f", label: t("\ub300\ud68c \ubb38\uc758 (\ud648\ud398\uc774\uc9c0)", "Contact Messages"), count: stats.pendingContactMessages, badge: true },
    ...(superAdmin ? [{ href: "/app/admin/users", icon: "\ud83d\udd11", label: t("\uc0ac\uc6a9\uc790 \uad8c\ud55c \uad00\ub9ac", "User Roles"), count: null }] : []),
  ];

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
      <h1 className="text-xl font-bold text-gray-900 mb-6">{t("\uad00\ub9ac\uc790 \ub300\uc2dc\ubcf4\ub4dc", "Admin Dashboard")}</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <p className="text-2xl font-bold text-blue-700">{stats.totalRegistrations}</p>
          <p className="text-xs text-blue-600 mt-1">{t("\uc804\uccb4 \uc2e0\uccad", "Total Applications")}</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
          <p className="text-2xl font-bold text-amber-700">{stats.pendingRegistrations}</p>
          <p className="text-xs text-amber-600 mt-1">{t("\ub300\uae30 \uc911", "Pending Review")}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 border border-green-100">
          <p className="text-2xl font-bold text-green-700">{stats.totalAnnouncements}</p>
          <p className="text-xs text-green-600 mt-1">{t("\uacf5\uc9c0\uc0ac\ud56d", "Announcements")}</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
          <p className="text-2xl font-bold text-purple-700">{stats.pendingInquiries}</p>
          <p className="text-xs text-purple-600 mt-1">{t("\ubbf8\ub2f5\ubcc0 \ubb38\uc758", "Unanswered")}</p>
        </div>
      </div>

      {/* Attendance Summary */}
      <Link href="/app/admin/attendance" className="block bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-bold text-gray-900">{t("\uc624\ub298 \ucd9c\uc11d \ud604\ud669", "Today's Attendance")}</h2>
          <span className="text-xs text-blue-600 font-medium">{t("\uc0c1\uc138\ubcf4\uae30", "Details")}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-end gap-1">
              <span className="text-3xl font-bold text-green-600">{stats.todayAttendance}</span>
              <span className="text-sm text-gray-400 pb-1">/ {stats.totalAthletes}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">{t("\ucd9c\uc11d / \uc804\uccb4 \uc120\uc218", "Checked in / Total athletes")}</p>
          </div>
          <div className="w-16 h-16 relative">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
              <path className="text-gray-100" stroke="currentColor" strokeWidth="3.5" fill="none" d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="text-green-500" stroke="currentColor" strokeWidth="3.5" fill="none" strokeLinecap="round"
                strokeDasharray={`${stats.totalAthletes > 0 ? (stats.todayAttendance / stats.totalAthletes) * 100 : 0}, 100`}
                d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700">
              {stats.totalAthletes > 0 ? Math.round((stats.todayAttendance / stats.totalAthletes) * 100) : 0}%
            </span>
          </div>
        </div>
      </Link>

      {/* Quick actions */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4">
        <h2 className="text-sm font-bold text-gray-900 mb-3">
          {t("빠른 작업", "Quick Actions")}
        </h2>
        <button
          type="button"
          onClick={refreshPhotos}
          disabled={refreshState === "loading"}
          className="w-full flex items-center justify-between px-3 py-2.5 bg-blue-50 border border-blue-100 rounded-lg text-sm font-medium text-blue-700 hover:bg-blue-100 transition-colors disabled:opacity-60"
        >
          <span className="flex items-center gap-2">
            <span className="text-base">📷</span>
            {refreshState === "loading"
              ? t("새로고침 중...", "Refreshing...")
              : refreshState === "ok"
              ? t("✓ 사진 캐시 갱신 완료", "✓ Photo cache refreshed")
              : refreshState === "error"
              ? t("✗ 갱신 실패 (관리자 권한 확인)", "✗ Refresh failed (check admin role)")
              : t("SmugMug 사진 캐시 새로고침", "Refresh SmugMug photo cache")}
          </span>
          <svg
            className="w-4 h-4 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
        <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">
          {t(
            "기본적으로 1시간마다 자동 갱신됩니다. 즉시 반영이 필요할 때만 누르세요.",
            "Photos auto-refresh hourly. Only press this if you need an instant update."
          )}
        </p>
      </div>

      {/* Menu */}
      <div className="space-y-3">
        {MENU.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-4 px-4 py-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="flex-1 text-sm font-medium text-gray-900">{item.label}</span>
            {item.count !== null && item.badge && item.count > 0 && (
              <span className="px-2.5 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">{item.count}</span>
            )}
            {item.count !== null && !item.badge && (
              <span className="text-sm text-gray-400">{item.count}</span>
            )}
            <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
}
