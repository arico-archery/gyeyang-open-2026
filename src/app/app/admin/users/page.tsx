"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { useAuth } from "@/lib/supabase/auth-context";
import { supabase } from "@/lib/supabase/client";
import { isSuperAdmin } from "@/lib/super-admin";
import type { UserRole } from "@/lib/supabase/types";

interface UserProfile {
  id: string;
  full_name: string;
  full_name_en: string | null;
  nationality: string;
  role: UserRole;
  team: string | null;
  created_at: string;
  email?: string;
}

const ROLE_OPTIONS: { value: UserRole; ko: string; en: string }[] = [
  { value: "athlete", ko: "선수", en: "Athlete" },
  { value: "coach", ko: "코치", en: "Coach" },
  { value: "judge", ko: "심판", en: "Judge" },
  { value: "admin", ko: "관리자", en: "Admin" },
];

export default function AdminUsersPage() {
  const { locale } = useI18n();
  const { user, profile } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | UserRole>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const t = (ko: string, en: string) => (locale === "ko" ? ko : en);

  const superAdmin = isSuperAdmin(user?.email);

  useEffect(() => {
    if (profile && !superAdmin && profile.role !== "admin") {
      router.push("/app");
    }
  }, [profile, superAdmin, router]);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setUsers(data);
    setLoading(false);
  }

  async function updateRole(userId: string, newRole: UserRole) {
    if (!superAdmin) return;
    setUpdatingId(userId);

    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", userId);

    if (!error) {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    }
    setUpdatingId(null);
  }

  const filtered = users.filter((u) => {
    const matchesSearch =
      !searchQuery ||
      u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.full_name_en && u.full_name_en.toLowerCase().includes(searchQuery.toLowerCase())) ||
      u.nationality.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const roleColors: Record<UserRole, string> = {
    athlete: "bg-gray-100 text-gray-700",
    coach: "bg-blue-100 text-blue-700",
    judge: "bg-purple-100 text-purple-700",
    admin: "bg-red-100 text-red-700",
  };

  if (loading) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-6">
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!superAdmin) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-6 text-center">
        <p className="text-red-500 font-medium">{t("슈퍼어드민 권한이 필요합니다", "Super admin access required")}</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.push("/app/admin")} className="p-2 -ml-2 text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-gray-900">{t("사용자 권한 관리", "User Role Management")}</h1>
      </div>

      {/* Super admin badge */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">🔑</span>
          <div>
            <p className="text-sm font-bold text-red-800">{t("슈퍼어드민 모드", "Super Admin Mode")}</p>
            <p className="text-xs text-red-600">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t("이름, 국가로 검색...", "Search by name, nationality...")}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm"
        />
      </div>

      {/* Role filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        <button
          onClick={() => setRoleFilter("all")}
          className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium ${
            roleFilter === "all" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          {t("전체", "All")} ({users.length})
        </button>
        {ROLE_OPTIONS.map((r) => (
          <button
            key={r.value}
            onClick={() => setRoleFilter(r.value)}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium ${
              roleFilter === r.value ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            {locale === "ko" ? r.ko : r.en} ({users.filter((u) => u.role === r.value).length})
          </button>
        ))}
      </div>

      {/* User list */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
          <p className="text-sm text-gray-400">{t("사용자가 없습니다", "No users found")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((u) => (
            <div key={u.id} className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{u.full_name}</p>
                  {u.full_name_en && (
                    <p className="text-xs text-gray-500">{u.full_name_en}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-0.5">
                    {u.nationality}{u.team ? ` · ${u.team}` : ""}
                  </p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${roleColors[u.role]}`}>
                  {ROLE_OPTIONS.find((r) => r.value === u.role)?.[locale === "ko" ? "ko" : "en"]}
                </span>
              </div>

              {/* Role change buttons */}
              <div className="flex gap-1.5 flex-wrap pt-3 border-t border-gray-50">
                {ROLE_OPTIONS.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => updateRole(u.id, r.value)}
                    disabled={u.role === r.value || updatingId === u.id}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      u.role === r.value
                        ? "bg-blue-600 text-white cursor-default"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    } disabled:opacity-50`}
                  >
                    {locale === "ko" ? r.ko : r.en}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
