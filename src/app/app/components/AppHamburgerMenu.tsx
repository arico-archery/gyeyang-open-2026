"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useInlineT } from "@/lib/i18n/inline";
import { useAuth } from "@/lib/supabase/auth-context";
import { isSuperAdmin } from "@/lib/super-admin";

/** Pages where the floating hamburger would clash with the login/signup UX. */
const HIDE_ON: string[] = ["/app/login", "/app/register"];

/**
 * Floating hamburger button + slide-in panel for the participant app.
 *
 * AppBottomNav covers the 5 most-used destinations; this hamburger exposes
 * the remaining participant-app pages (announcements, inquiries, profile,
 * etc.) plus sign out. The marketing-site nav is intentionally NOT included
 * here — the app stays focused on athlete-facing screens.
 *
 * Visible on every app route except auth screens. Positioned `fixed` so it
 * survives across page navigations without coupling to each page's header.
 */
export default function AppHamburgerMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const ti = useInlineT();
  const { user, profile, signOut } = useAuth();

  // Lock background scroll while the panel is open.
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  // Close panel on route change.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (HIDE_ON.some((p) => pathname.startsWith(p))) return null;

  const isAdmin = profile?.role === "admin" || isSuperAdmin(user?.email);

  const APP_PAGES: { label: string; href: string }[] = [
    { label: ti("앱 홈", "App Home", "应用首页", "アプリホーム"), href: "/app" },
    { label: ti("일정", "Schedule", "赛程", "予定"), href: "/app/schedule" },
    { label: ti("점수", "Scores", "成绩", "成績"), href: "/app/scores" },
    { label: ti("참가자 명단", "Participants", "参赛选手", "参加選手"), href: "/app/participants" },
    { label: ti("사진", "Photos", "图库", "写真"), href: "/app/photos" },
    { label: ti("주변", "Nearby", "周边", "周辺"), href: "/app/nearby" },
    { label: ti("공지사항", "Announcements", "公告", "お知らせ"), href: "/app/announcements" },
    { label: ti("문의", "Inquiries", "咨询", "お問い合わせ"), href: "/app/inquiries" },
    { label: ti("알림 설정", "Notifications", "通知设置", "通知設定"), href: "/app/notifications" },
    ...(user
      ? [{ label: ti("프로필", "Profile", "个人资料", "プロフィール"), href: "/app/profile" }]
      : [
          { label: ti("로그인", "Sign In", "登录", "ログイン"), href: "/app/login" },
          { label: ti("회원가입", "Sign Up", "注册", "新規登録"), href: "/app/register" },
        ]),
  ];

  return (
    <>
      {/* Floating hamburger button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed top-3 right-3 z-40 w-10 h-10 rounded-xl bg-white/90 backdrop-blur shadow-md border border-gray-200 flex items-center justify-center hover:bg-white transition-colors"
        aria-label={ti("메뉴 열기", "Open menu", "打开菜单", "メニューを開く")}
        aria-expanded={open}
      >
        <svg
          className="w-5 h-5 text-gray-800"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Slide-in panel */}
      {open && (
        <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          {/* Panel */}
          <aside className="absolute top-0 right-0 bottom-0 w-[88%] max-w-sm bg-white shadow-xl overflow-y-auto flex flex-col">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between">
              <p className="text-base font-bold text-gray-900">
                {ti("메뉴", "Menu", "菜单", "メニュー")}
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center"
                aria-label={ti("닫기", "Close", "关闭", "閉じる")}
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Sections */}
            <div className="flex-1 overflow-y-auto">
              {/* Participant app pages */}
              <div className="px-5 py-3">
                <ul className="space-y-1">
                  {APP_PAGES.map((it) => (
                    <li key={it.href}>
                      <Link
                        href={it.href}
                        className="block px-2 py-3 text-sm text-gray-800 hover:bg-gray-50 rounded-md"
                      >
                        {it.label}
                      </Link>
                    </li>
                  ))}
                  {isAdmin && (
                    <li className="pt-2 mt-2 border-t border-gray-100">
                      <Link
                        href="/app/admin"
                        className="block px-2 py-3 text-sm font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-md"
                      >
                        ⚙️{" "}
                        {ti(
                          "관리자 대시보드",
                          "Admin Dashboard",
                          "管理员仪表板",
                          "管理ダッシュボード"
                        )}
                      </Link>
                    </li>
                  )}
                </ul>
              </div>

              {/* Sign out (if signed in) */}
              {user && (
                <div className="px-5 py-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={async () => {
                      await signOut();
                      setOpen(false);
                    }}
                    className="w-full py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-md font-medium"
                  >
                    {ti("로그아웃", "Sign Out", "退出登录", "ログアウト")}
                  </button>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
