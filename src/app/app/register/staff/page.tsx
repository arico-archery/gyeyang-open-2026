"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/lib/i18n/context";
import { useAuth } from "@/lib/supabase/auth-context";
import { supabase } from "@/lib/supabase/client";
import { validateInviteCode } from "@/lib/invite-codes";
import type { UserRole } from "@/lib/supabase/types";

const COUNTRIES = [
  "KOR", "USA", "JPN", "CHN", "TPE", "IND", "MAS", "THA", "GBR", "FRA",
  "GER", "ITA", "ESP", "NED", "TUR", "MEX", "COL", "BRA", "AUS", "CAN",
];

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

  const t = (ko: string, en: string) => (locale === "ko" ? ko : en);

  const handleCodeVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const result = validateInviteCode(inviteCode);
    if (!result.valid || !result.role) {
      setError(t("유효하지 않은 초대 코드입니다.", "Invalid invite code."));
      return;
    }
    setAssignedRole(result.role);
    setStep(2);
  };

  const handleStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError(t("비밀번호는 6자 이상이어야 합니다.", "Password must be at least 6 characters."));
      return;
    }
    if (password !== confirmPassword) {
      setError(t("비밀번호가 일치하지 않습니다.", "Passwords do not match."));
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

  const roleLabel = assignedRole === "judge" ? t("심판", "Judge") : t("관리자", "Admin");

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gray-50">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <Image src="/images/logo.png" alt="Logo" width={48} height={53} className="mx-auto mb-3" />
          <h1 className="text-xl font-bold text-gray-900">{t("스태프 가입", "Staff Registration")}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {t("심판 · 관리자 전용", "For Judges & Administrators")}
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
                    "An invite code is required to register as a judge or admin. Please contact the tournament organizers."
                  )}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("초대 코드", "Invite Code")}
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
                {t("코드 확인", "Verify Code")}
              </button>
            </form>
          )}

          {/* Step 2: Account */}
          {step === 2 && (
            <form onSubmit={handleStep2} className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-2">
                <p className="text-sm text-green-800 font-medium">
                  ✓ {t("인증됨", "Verified")}: {roleLabel}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("이메일", "Email")}</label>
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="name@example.com" required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("비밀번호", "Password")}</label>
                <input
                  type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder={t("6자 이상", "Min. 6 characters")} required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("비밀번호 확인", "Confirm Password")}</label>
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
                  {t("이전", "Back")}
                </button>
                <button type="submit"
                  className="flex-1 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors"
                >
                  {t("다음", "Next")}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("이름", "Name")}</label>
                <input
                  type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder={t("홍길동", "John Doe")} required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("영문 이름", "Name (English)")}</label>
                <input
                  type="text" value={fullNameEn} onChange={(e) => setFullNameEn(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Hong Gildong"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("국적", "Nationality")}</label>
                <select
                  value={nationality} onChange={(e) => setNationality(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("소속", "Organization")}</label>
                <input
                  type="text" value={team} onChange={(e) => setTeam(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder={t("대한양궁협회", "Korea Archery Association")}
                />
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setStep(2)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  {t("이전", "Back")}
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  {loading ? t("가입 중...", "Creating...") : t("가입하기", "Sign Up")}
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          {t("선수/코치이신가요?", "Are you an athlete or coach?")}{" "}
          <Link href="/app/register" className="text-blue-600 font-medium hover:underline">
            {t("선수 가입", "Athlete Registration")}
          </Link>
        </p>

        <p className="text-center text-sm text-gray-400 mt-2">
          <Link href="/app/login" className="hover:underline">
            {t("이미 계정이 있으신가요? 로그인", "Already have an account? Sign In")}
          </Link>
        </p>
      </div>
    </div>
  );
}
