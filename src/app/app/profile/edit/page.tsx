"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { useAuth } from "@/lib/supabase/auth-context";
import { supabase } from "@/lib/supabase/client";
import type { UserRole } from "@/lib/supabase/types";

const COUNTRIES = [
  "KOR", "USA", "JPN", "CHN", "TPE", "IND", "MAS", "THA", "GBR", "FRA",
  "GER", "ITA", "ESP", "NED", "TUR", "MEX", "COL", "BRA", "AUS", "CAN",
];

const ROLES: { value: UserRole; ko: string; en: string }[] = [
  { value: "athlete", ko: "선수", en: "Athlete" },
  { value: "coach", ko: "코치", en: "Coach" },
];

const CATEGORIES = [
  { value: "recurve_men", ko: "남자 리커브", en: "Recurve Men" },
  { value: "recurve_women", ko: "여자 리커브", en: "Recurve Women" },
];

export default function ProfileEditPage() {
  const { locale } = useI18n();
  const { user, profile, loading, refreshProfile } = useAuth();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [fullNameEn, setFullNameEn] = useState("");
  const [nationality, setNationality] = useState("KOR");
  const [role, setRole] = useState<UserRole>("athlete");
  const [category, setCategory] = useState("recurve_men");
  const [team, setTeam] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const t = (ko: string, en: string) => (locale === "ko" ? ko : en);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setFullNameEn(profile.full_name_en || "");
      setNationality(profile.nationality || "KOR");
      setRole(profile.role || "athlete");
      setCategory(profile.category || "recurve_men");
      setTeam(profile.team || "");
    }
  }, [profile]);

  if (loading) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-6 flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !profile) {
    router.push("/app/login");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setSaving(true);

    const isRoleLocked = profile.role === "judge" || profile.role === "admin";
    const effectiveRole = isRoleLocked ? profile.role : role;

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        full_name_en: fullNameEn || null,
        nationality,
        role: effectiveRole,
        category: effectiveRole === "athlete" ? category : null,
        team: team || null,
      })
      .eq("id", user.id);

    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess(true);
      await refreshProfile();
      setTimeout(() => router.push("/app/profile"), 1000);
    }
    setSaving(false);
  };

  const roleLabel = profile.role === "judge" ? t("심판", "Judge") : t("관리자", "Admin");
  const roleLocked = profile.role === "judge" || profile.role === "admin";

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg">
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-gray-900">{t("프로필 수정", "Edit Profile")}</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>
        )}
        {success && (
          <div className="bg-green-50 text-green-600 text-sm rounded-lg px-4 py-3 mb-4">
            {t("저장되었습니다!", "Saved successfully!")}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("역할", "Role")}</label>
            {roleLocked ? (
              <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600">
                {roleLabel}
                <span className="text-xs text-gray-400 ml-2">
                  {t("(관리자에 의해 설정됨)", "(Set by admin)")}
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {ROLES.map((r) => (
                  <button
                    key={r.value} type="button"
                    onClick={() => setRole(r.value)}
                    className={"py-2.5 rounded-xl text-sm font-medium border transition-colors " + (
                      role === r.value
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"
                    )}
                  >
                    {locale === "ko" ? r.ko : r.en}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("이름", "Name")}</label>
            <input
              type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("영문 이름", "Name (English)")}</label>
            <input
              type="text" value={fullNameEn} onChange={(e) => setFullNameEn(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("국적", "Nationality")}</label>
            <select
              value={nationality} onChange={(e) => setNationality(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {role === "athlete" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("종별", "Category")}</label>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.value} type="button"
                    onClick={() => setCategory(c.value)}
                    className={"py-2.5 rounded-xl text-sm font-medium border transition-colors " + (
                      category === c.value
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"
                    )}
                  >
                    {locale === "ko" ? c.ko : c.en}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("소속", "Team/Club")}</label>
            <input
              type="text" value={team} onChange={(e) => setTeam(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit" disabled={saving}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 mt-2"
          >
            {saving ? t("저장 중...", "Saving...") : t("저장하기", "Save")}
          </button>
        </form>
      </div>
    </div>
  );
}
