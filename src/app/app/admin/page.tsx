"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { useAuth } from "@/lib/supabase/auth-context";
import { supabase } from "@/lib/supabase/client";
import { isSuperAdmin } from "@/lib/super-admin";

interface Stats {
  totalRegistrations: number;
  pendingRegistrations: number;
  totalAnnouncements: number;
  pendingInquiries: number;
}

export default function AdminPage() {
  const { locale } = useI18n();
  const { user, profile, loading } = useAuth();
  const [stats, setStats] = useState<Stats>({ totalRegistrations: 0, pendingRegistrations: 0, totalAnnouncements: 0, pendingInquiries: 0 });

  const t = (ko: string, en: string) => (locale === "ko" ? ko : en);

  useEffect(() => {
    async function fetchStats() {
      const [regAll, regPending, annCount, inqPending] = await Promise.all([
        supabase.from("registrations").select("id", { count: "exact", head: true }),
        supabase.from("registrations").select("id", { count: "exact", head: true }).eq("status", "submitted"),
        supabase.from("announcements").select("id", { count: "exact", head: true }),
        supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "pending"),
      ]);
      setStats({
        totalRegistrations: regAll.count ?? 0,
        pendingRegistrations: regPending.count ?? 0,
        totalAnnouncements: annCount.count ?? 0,
        pendingInquiries: inqPending.count ?? 0,
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
    { href: "/app/admin/targets", icon: "\ud83c\udfaf", label: t("\ud0c0\uac9f \ubc30\uc815", "Target Assignment"), count: null },
    { href: "/app/admin/inquiries", icon: "\ud83d\udcac", label: t("\ubb38\uc758 \ub2f5\ubcc0", "Inquiries"), count: stats.pendingInquiries, badge: true },
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
