"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/lib/i18n/context";
import { useInlineT } from "@/lib/i18n/inline";
import { useAuth } from "@/lib/supabase/auth-context";
import { supabase } from "@/lib/supabase/client";
import type { UserRole } from "@/lib/supabase/types";
import { COUNTRIES } from "@/lib/countries";

const ROLES: { value: UserRole; ko: string; en: string; zh: string }[] = [
  { value: "athlete", ko: "선수", en: "Athlete", zh: "选手" },
  { value: "coach", ko: "코치", en: "Coach", zh: "教练" },
];

const CATEGORIES = [
  { value: "recurve_men", ko: "남자 리커브", en: "Recurve Men", zh: "反曲弓男子" },
  { value: "recurve_women", ko: "여자 리커브", en: "Recurve Women", zh: "反曲弓女子" },
  { value: "compound_men", ko: "남자 컴파운드", en: "Compound Men", zh: "复合弓男子" },
  { value: "compound_women", ko: "여자 컴파운드", en: "Compound Women", zh: "复合弓女子" },
];

export default function RegisterPage() {
  const { locale } = useI18n();
  const { signUp } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [fullNameEn, setFullNameEn] = useState("");
  const [nationality, setNationality] = useState("KOR");
  const [role, setRole] = useState<UserRole>("athlete");
  const [category, setCategory] = useState("recurve_men");
  const [team, setTeam] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const t = useInlineT();
  const localized = <T extends { ko: string; en: string; zh: string }>(m: T) =>
    locale === "ko" ? m.ko : locale === "zh" ? m.zh : m.en;

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError(t("비밀번호는 6자 이상이어야 합니다.", "Password must be at least 6 characters.", "密码至少需要 6 个字符。"));
      return;
    }
    if (password !== confirmPassword) {
      setError(t("비밀번호가 일치하지 않습니다.", "Passwords do not match.", "密码不一致。"));
      return;
    }
    setStep(2);
  };

  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: signUpError } = await signUp(email, password);
    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const qrToken = crypto.randomUUID();
      await supabase.from("profiles").upsert({
        id: user.id,
        role,
        full_name: fullName,
        full_name_en: fullNameEn || null,
        nationality,
        team: team || null,
        category: role === "athlete" ? category : null,
        qr_token: qrToken,
      });
    }

    setLoading(false);
    router.push("/app");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gray-50">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <Image src="/images/logo.png" alt="Logo" width={48} height={53} className="mx-auto mb-3" />
          <h1 className="text-xl font-bold text-gray-900">{t("회원가입", "Sign Up", "注册")}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {t(`단계 ${step}/2`, `Step ${step}/2`, `第 ${step}/2 步`)}
          </p>
        </div>

        {/* Step indicators */}
        <div className="flex gap-2 mb-6">
          <div className={`flex-1 h-1 rounded-full ${step >= 1 ? "bg-blue-600" : "bg-gray-200"}`} />
          <div className={`flex-1 h-1 rounded-full ${step >= 2 ? "bg-blue-600" : "bg-gray-200"}`} />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleStep1} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("이메일", "Email", "邮箱")}</label>
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="name@example.com" required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("비밀번호", "Password", "密码")}</label>
                <input
                  type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t("6자 이상", "Min. 6 characters", "至少 6 个字符")} required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("비밀번호 확인", "Confirm Password", "确认密码")}</label>
                <input
                  type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button type="submit" className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors">
                {t("다음", "Next", "下一步")}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleStep2} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("역할", "Role", "身份")}</label>
                <div className="grid grid-cols-2 gap-2">
                  {ROLES.map((r) => (
                    <button
                      key={r.value} type="button"
                      onClick={() => setRole(r.value)}
                      className={`py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                        role === r.value
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      {localized(r)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("이름", "Name", "姓名")}</label>
                <input
                  type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t("홍길동", "John Doe", "张三")} required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("영문 이름", "Name (English)", "英文姓名")}</label>
                <input
                  type="text" value={fullNameEn} onChange={(e) => setFullNameEn(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Hong Gildong"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("국적", "Nationality", "国籍")}</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("종목", "Event", "项目")}</label>
                  <div className="grid grid-cols-2 gap-2">
                    {CATEGORIES.map((c) => (
                      <button
                        key={c.value} type="button"
                        onClick={() => setCategory(c.value)}
                        className={`py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                          category === c.value
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        {localized(c)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("소속", "Team/Club", "所属团队")}</label>
                <input
                  type="text" value={team} onChange={(e) => setTeam(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t("인천시양궁협회", "Incheon Archery Association", "仁川射箭协会")}
                />
              </div>

              <div className="flex gap-2">
                <button type="button" onClick={() => setStep(1)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  {t("이전", "Back", "上一步")}
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? t("가입 중...", "Creating...", "注册中...") : t("가입하기", "Sign Up", "注册")}
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          {t("이미 계정이 있으신가요?", "Already have an account?", "已有账号?")}{" "}
          <Link href="/app/login" className="text-blue-600 font-medium hover:underline">
            {t("로그인", "Sign In", "登录")}
          </Link>
        </p>

        <p className="text-center text-sm text-gray-400 mt-3">
          {t("심판/관리자이신가요?", "Are you a judge or staff?", "您是裁判或工作人员吗?")}{" "}
          <Link href="/app/register/staff" className="text-purple-600 font-medium hover:underline">
            {t("스태프 가입", "Staff Registration", "工作人员注册")}
          </Link>
        </p>
      </div>
    </div>
  );
}
