"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { useInlineT } from "@/lib/i18n/inline";
import { useAuth } from "@/lib/supabase/auth-context";
import { supabase } from "@/lib/supabase/client";
import type { UserRole } from "@/lib/supabase/types";
import { COUNTRIES } from "@/lib/countries";

const ROLES: { value: UserRole; ko: string; en: string; zh: string; ja: string }[] = [
  { value: "athlete", ko: "선수", en: "Athlete", zh: "选手", ja: "選手" },
  { value: "coach", ko: "코치", en: "Coach", zh: "教练", ja: "コーチ" },
];

const CATEGORIES = [
  { value: "recurve_men", ko: "남자 리커브", en: "Recurve Men", zh: "反曲弓男子", ja: "リカーブ男子" },
  { value: "recurve_women", ko: "여자 리커브", en: "Recurve Women", zh: "反曲弓女子", ja: "リカーブ女子" },
  { value: "compound_men", ko: "남자 컴파운드", en: "Compound Men", zh: "复合弓男子", ja: "コンパウンド男子" },
  { value: "compound_women", ko: "여자 컴파운드", en: "Compound Women", zh: "复合弓女子", ja: "コンパウンド女子" },
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

  const t = useInlineT();

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

  const roleLabel = profile.role === "judge" ? t("심판", "Judge", "裁判", "審判") : t("관리자", "Admin", "管理员", "管理者");
  const roleLocked = profile.role === "judge" || profile.role === "admin";

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg">
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-gray-900">{t("프로필 수정", "Edit Profile", "编辑个人资料", "プロフィール編集")}</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>
        )}
        {success && (
          <div className="bg-green-50 text-green-600 text-sm rounded-lg px-4 py-3 mb-4">
            {t("저장되었습니다!", "Saved successfully!", "保存成功!", "保存しました!")}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("역할", "Role", "身份", "役割")}</label>
            {roleLocked ? (
              <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600">
                {roleLabel}
                <span className="text-xs text-gray-400 ml-2">
                  {t("(관리자에 의해 설정됨)", "(Set by admin)", "(由管理员设置)", "(管理者が設定)")}
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
                    {locale === "ko" ? r.ko : locale === "zh" ? r.zh : locale === "ja" ? r.ja : r.en}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("이름", "Name", "姓名", "氏名")}</label>
            <input
              type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("영문 이름", "Name (English)", "英文姓名", "氏名 (英語)")}</label>
            <input
              type="text" value={fullNameEn} onChange={(e) => setFullNameEn(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("국적", "Nationality", "国籍", "国籍")}</label>
            <select
              value={nationality} onChange={(e) => setNationality(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {locale === "ko" ? c.ko + " (" + c.en + ")" : c.en + " (" + c.ko + ")"}
                </option>
              ))}
            </select>
          </div>

          {role === "athlete" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("종목", "Event", "项目", "種目")}</label>
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
                    {locale === "ko" ? c.ko : locale === "zh" ? c.zh : locale === "ja" ? c.ja : c.en}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("소속", "Team/Club", "所属团队", "所属")}</label>
            <input
              type="text" value={team} onChange={(e) => setTeam(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit" disabled={saving}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 mt-2"
          >
            {saving ? t("저장 중...", "Saving...", "保存中...", "保存中...") : t("저장하기", "Save", "保存", "保存")}
          </button>
        </form>
      </div>
    </div>
  );
}
