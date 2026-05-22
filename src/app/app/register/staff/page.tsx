"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/lib/i18n/context";
import { useInlineT } from "@/lib/i18n/inline";
import { useAuth } from "@/lib/supabase/auth-context";
import { supabase } from "@/lib/supabase/client";
import { validateInviteCode } from "@/lib/invite-codes";
import type { UserRole } from "@/lib/supabase/types";
import { COUNTRIES } from "@/lib/countries";

export default function StaffRegisterPage() {
  const { locale } = useI18n();
  const { signUp } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [inviteCode, setInviteCode] = useState("");
  const [assignedRole, setAssignedRole] = useState<UserRole>("judge");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [fullNameEn, setFullNameEn] = useState("");
  const [nationality, setNationality] = useState("KOR");
  const [team, setTeam] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const t = useInlineT();

  const handleCodeVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const result = validateInviteCode(inviteCode);
    if (!result.valid || !result.role) {
      setError(t("유효하지 않은 초대 코드입니다.", "Invalid invite code.", "邀请码无效。"));
      return;
    }
    setAssignedRole(result.role);
    setStep(2);
  };

  const handleStep2 = (e: React.FormEvent) => {
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
    setStep(3);
  };

  const handleStep3 = async (e: React.FormEvent) => {
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
        role: assignedRole,
        full_name: fullName,
        full_name_en: fullNameEn || null,
        nationality,
        team: team || null,
        category: null,
        qr_token: qrToken,
      });
    }

    setLoading(false);
    router.push("/app");
  };

  const roleLabel = assignedRole === "judge" ? t("심판", "Judge", "裁判") : t("관리자", "Admin", "管理员");

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gray-50">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <Image src="/images/logo.png" alt="Logo" width={48} height={53} className="mx-auto mb-3" />
          <h1 className="text-xl font-bold text-gray-900">{t("스태프 가입", "Staff Registration", "工作人员注册")}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {t("심판 · 관리자 전용", "For Judges & Administrators", "限裁判及管理员")}
          </p>
        </div>

        {/* Step indicators */}
        <div className="flex gap-2 mb-6">
          <div className={`flex-1 h-1 rounded-full ${step >= 1 ? "bg-purple-600" : "bg-gray-200"}`} />
          <div className={`flex-1 h-1 rounded-full ${step >= 2 ? "bg-purple-600" : "bg-gray-200"}`} />
          <div className={`flex-1 h-1 rounded-full ${step >= 3 ? "bg-purple-600" : "bg-gray-200"}`} />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}

          {/* Step 1: Invite Code */}
          {step === 1 && (
            <form onSubmit={handleCodeVerify} className="space-y-4">
              <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 mb-2">
                <p className="text-sm text-purple-800">
                  {t(
                    "심판 또는 관리자로 가입하려면 초대 코드가 필요합니다. 대회 운영진에게 문의하세요.",
                    "An invite code is required to register as a judge or admin. Please contact the tournament organizers.",
                    "注册裁判或管理员需要邀请码。请联系赛事主办方。"
                  )}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("초대 코드", "Invite Code", "邀请码")}
                </label>
                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 uppercase tracking-wider font-mono"
                  placeholder="XXXXX-XXXXX-XXXX"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors"
              >
                {t("코드 확인", "Verify Code", "验证邀请码")}
              </button>
            </form>
          )}

          {/* Step 2: Account */}
          {step === 2 && (
            <form onSubmit={handleStep2} className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-2">
                <p className="text-sm text-green-800 font-medium">
                  ✓ {t("인증됨", "Verified", "已验证")}: {roleLabel}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("이메일", "Email", "邮箱")}</label>
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="name@example.com" required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("비밀번호", "Password", "密码")}</label>
                <input
                  type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder={t("6자 이상", "Min. 6 characters", "至少 6 个字符")} required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("비밀번호 확인", "Confirm Password", "确认密码")}</label>
                <input
                  type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setStep(1)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  {t("이전", "Back", "上一步")}
                </button>
                <button type="submit"
                  className="flex-1 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors"
                >
                  {t("다음", "Next", "下一步")}
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Profile */}
          {step === 3 && (
            <form onSubmit={handleStep3} className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-2">
                <p className="text-sm text-green-800 font-medium">
                  ✓ {roleLabel} · {email}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("이름", "Name", "姓名")}</label>
                <input
                  type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder={t("홍길동", "John Doe", "张三")} required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("영문 이름", "Name (English)", "英文姓名")}</label>
                <input
                  type="text" value={fullNameEn} onChange={(e) => setFullNameEn(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Hong Gildong"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("국적", "Nationality", "国籍")}</label>
                <select
                  value={nationality} onChange={(e) => setNationality(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {locale === "ko" ? c.ko + " (" + c.en + ")" : c.en + " (" + c.ko + ")"}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("소속", "Organization", "所属")}</label>
                <input
                  type="text" value={team} onChange={(e) => setTeam(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder={t("대한양궁협회", "Korea Archery Association", "大韩射箭协会")}
                />
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setStep(2)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  {t("이전", "Back", "上一步")}
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  {loading ? t("가입 중...", "Creating...", "注册中...") : t("가입하기", "Sign Up", "注册")}
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          {t("선수/코치이신가요?", "Are you an athlete or coach?", "您是选手或教练吗?")}{" "}
          <Link href="/app/register" className="text-blue-600 font-medium hover:underline">
            {t("선수 가입", "Athlete Registration", "选手注册")}
          </Link>
        </p>

        <p className="text-center text-sm text-gray-400 mt-2">
          <Link href="/app/login" className="hover:underline">
            {t("이미 계정이 있으신가요? 로그인", "Already have an account? Sign In", "已有账号? 登录")}
          </Link>
        </p>
      </div>
    </div>
  );
}
