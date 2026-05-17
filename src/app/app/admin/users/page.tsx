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
  { value: "athlete", ko: "\uc120\uc218", en: "Athlete" },
  { value: "coach", ko: "\ucf54\uce58", en: "Coach" },
  { value: "judge", ko: "\uc2ec\ud310", en: "Judge" },
  { value: "admin", ko: "\uad00\ub9ac\uc790", en: "Admin" },
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
      setToast(userName + " \u2192 " + roleName + (locale === "ko" ? " \uc800\uc7a5 \uc644\ub8cc" : " saved"));
      setTimeout(() => setToast(""), 2500);
    } else {
      setToast(t("\uc800\uc7a5 \uc2e4\ud328", "Save failed"));
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
      setToast(deleteTarget.full_name + (locale === "ko" ? " \uc0ad\uc81c \uc644\ub8cc" : " deleted"));
      setTimeout(() => setToast(""), 2500);
    } else {
      setToast(t("\uc0ad\uc81c \uc2e4\ud328: ", "Delete failed: ") + (error.message || ""));
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
        <p className="text-red-500 font-medium">{t("\uc288\ud37c\uc5b4\ub4dc\ubbfc \uad8c\ud55c\uc774 \ud544\uc694\ud569\ub2c8\ub2e4", "Super admin access required")}</p>
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
                {t("\uc0ac\uc6a9\uc790 \uc0ad\uc81c", "Delete User")}
              </h3>
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-red-600">{deleteTarget.full_name}</span>
                {deleteTarget.email && (
                  <span className="text-gray-400"> ({deleteTarget.email})</span>
                )}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {t("\uc774 \uc0ac\uc6a9\uc790\uc758 \ubaa8\ub4e0 \ub370\uc774\ud130(\ud504\ub85c\ud544, \ucc38\uac00\uc2e0\uccad, \ubb38\uc758 \ub4f1)\uac00 \uc601\uad6c\uc801\uc73c\ub85c \uc0ad\uc81c\ub429\ub2c8\ub2e4.", "All data (profile, registrations, inquiries) will be permanently deleted.")}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors"
              >
                {t("\ucde8\uc18c", "Cancel")}
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleting ? t("\uc0ad\uc81c \uc911...", "Deleting...") : t("\uc0ad\uc81c", "Delete")}
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
        <h1 className="text-xl font-bold text-gray-900">{t("\uc0ac\uc6a9\uc790 \uad8c\ud55c \uad00\ub9ac", "User Role Management")}</h1>
      </div>

      <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">\ud83d\udd11</span>
          <div>
            <p className="text-sm font-bold text-red-800">{t("\uc288\ud37c\uc5b4\ub4dc\ubbfc \ubaa8\ub4dc", "Super Admin Mode")}</p>
            <p className="text-xs text-red-600">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t("\uc774\ub984, \uad6d\uac00, \uc774\uba54\uc77c\ub85c \uac80\uc0c9...", "Search by name, country, email...")}
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
          {t("\uc804\uccb4", "All")} ({users.length})
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
          <p className="text-sm text-gray-400">{t("\uc0ac\uc6a9\uc790\uac00 \uc5c6\uc2b5\ub2c8\ub2e4", "No users found")}</p>
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
                    {u.nationality}{u.team ? " \u00b7 " + u.team : ""}
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
                      title={t("\uc0ad\uc81c", "Delete")}
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
