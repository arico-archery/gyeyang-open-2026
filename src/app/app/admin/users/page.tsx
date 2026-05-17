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
  const [toast, setToast] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<UserProfile | null>(null);
  const [deleting, setDeleting] = useState(false);

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
    const { data } = await supabase.rpc("get_profiles_with_email");
    if (data) setUsers(data as UserProfile[]);
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
      const userName = users.find((u) => u.id === userId)?.full_name || "";
      const roleName = ROLE_OPTIONS.find((r) => r.value === newRole)?.[locale === "ko" ? "ko" : "en"] || newRole;
      setToast(userName + " → " + roleName + (locale === "ko" ? " 저장 완료" : " saved"));
      setTimeout(() => setToast(""), 2500);
    } else {
      setToast(t("저장 실패", "Save failed"));
      setTimeout(() => setToast(""), 2500);
    }
    setUpdatingId(null);
  }

  async function handleDelete() {
    if (!deleteTarget || !superAdmin) return;
    setDeleting(true);

    const { error } = await supabase.rpc("delete_user_by_admin", {
      target_user_id: deleteTarget.id,
    });

    if (!error) {
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
      setToast(deleteTarget.full_name + (locale === "ko" ? " 삭제 완료" : " deleted"));
      setTimeout(() => setToast(""), 2500);
    } else {
      setToast(t("삭제 실패: ", "Delete failed: ") + (error.message || ""));
      setTimeout(() => setToast(""), 3000);
    }
    setDeleting(false);
    setDeleteTarget(null);
  }

  const filtered = users.filter((u) => {
    const matchesSearch =
      !searchQuery ||
      u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.full_name_en && u.full_name_en.toLowerCase().includes(searchQuery.toLowerCase())) ||
      u.nationality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase()));
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
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm px-4 py-2.5 rounded-xl shadow-lg">
          {toast}
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {t("사용자 삭제", "Delete User")}
              </h3>
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-red-600">{deleteTarget.full_name}</span>
                {deleteTarget.email && (
                  <span className="text-gray-400"> ({deleteTarget.email})</span>
                )}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {t("이 사용자의 모든 데이터(프로필, 참가신청, 문의 등)가 영구적으로 삭제됩니다.", "All data (profile, registrations, inquiries) will be permanently deleted.")}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors"
              >
                {t("취소", "Cancel")}
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleting ? t("삭제 중...", "Deleting...") : t("삭제", "Delete")}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.push("/app/admin")} className="p-2 -ml-2 text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-gray-900">{t("사용자 권한 관리", "User Role Management")}</h1>
      </div>

      <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">🔑</span>
          <div>
            <p className="text-sm font-bold text-red-800">{t("슈퍼어드민 모드", "Super Admin Mode")}</p>
            <p className="text-xs text-red-600">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t("이름, 국가, 이메일로 검색...", "Search by name, country, email...")}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        <button
          onClick={() => setRoleFilter("all")}
          className={"shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium " + (
            roleFilter === "all" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
          )}
        >
          {t("전체", "All")} ({users.length})
        </button>
        {ROLE_OPTIONS.map((r) => (
          <button
            key={r.value}
            onClick={() => setRoleFilter(r.value)}
            className={"shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium " + (
              roleFilter === r.value ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
            )}
          >
            {locale === "ko" ? r.ko : r.en} ({users.filter((u) => u.role === r.value).length})
          </button>
        ))}
      </div>

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
                    {u.nationality}{u.team ? " · " + u.team : ""}
                  </p>
                  {u.email && (
                    <p className="text-xs text-blue-500 mt-0.5">{u.email}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className={"px-2 py-0.5 rounded-full text-xs font-medium " + roleColors[u.role]}>
                    {ROLE_OPTIONS.find((r) => r.value === u.role)?.[locale === "ko" ? "ko" : "en"]}
                  </span>
                  {u.id !== user?.id && (
                    <button
                      onClick={() => setDeleteTarget(u)}
                      className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                      title={t("삭제", "Delete")}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              <div className="flex gap-1.5 flex-wrap pt-3 border-t border-gray-50">
                {ROLE_OPTIONS.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => updateRole(u.id, r.value)}
                    disabled={u.role === r.value || updatingId === u.id}
                    className={"px-3 py-1.5 text-xs font-medium rounded-lg transition-colors " + (
                      u.role === r.value
                        ? "bg-blue-600 text-white cursor-default"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    ) + " disabled:opacity-50"}
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
