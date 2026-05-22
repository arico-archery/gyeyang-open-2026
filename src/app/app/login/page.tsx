"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useInlineT } from "@/lib/i18n/inline";
import { useAuth } from "@/lib/supabase/auth-context";

export default function LoginPage() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const t = useInlineT();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: err } = await signIn(email, password);
    if (err) {
      setError(t("이메일 또는 비밀번호가 올바르지 않습니다.", "Invalid email or password.", "邮箱或密码不正确。", "メールアドレスまたはパスワードが正しくありません。"));
      setLoading(false);
    } else {
      router.push("/app");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Image src="/images/logo.png" alt="Logo" width={64} height={71} className="mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">2026 GYEYANG OPEN</h1>
          <p className="text-sm text-gray-500 mt-1">{t("참가선수 앱 로그인", "Athlete App Login", "选手 APP 登录", "選手アプリログイン")}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("이메일", "Email", "邮箱", "メール")}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="name@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("비밀번호", "Password", "密码", "パスワード")}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t("로그인 중...", "Signing in...", "登录中...", "ログイン中...") : t("로그인", "Sign In", "登录", "ログイン")}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          {t("계정이 없으신가요?", "Don't have an account?", "还没有账号?", "アカウントをお持ちでない方は")}{" "}
          <Link href="/app/register" className="text-blue-600 font-medium hover:underline">
            {t("회원가입", "Sign Up", "注册", "新規登録")}
          </Link>
        </p>

        <div className="text-center mt-4">
          <Link href="/" className="text-xs text-gray-400 hover:text-gray-600">
            {t("← 웹사이트로 돌아가기", "← Back to website", "← 返回网站", "← ウェブサイトに戻る")}
          </Link>
        </div>
      </div>
    </div>
  );
}
