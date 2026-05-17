"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { useAuth } from "@/lib/supabase/auth-context";
import {
  isPushSubscribed,
  subscribeToPush,
  unsubscribeFromPush,
  requestNotificationPermission,
} from "@/lib/push-notifications";

export default function NotificationsPage() {
  const { locale } = useI18n();
  const { user } = useAuth();
  const router = useRouter();
  const [subscribed, setSubscribed] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  const t = (ko: string, en: string) => (locale === "ko" ? ko : en);

  useEffect(() => {
    async function check() {
      if ("Notification" in window) {
        setPermission(Notification.permission);
      }
      const sub = await isPushSubscribed();
      setSubscribed(sub);
      setLoading(false);
    }
    check();
  }, []);

  async function handleToggle() {
    if (!user) return;
    setToggling(true);

    if (subscribed) {
      await unsubscribeFromPush(user.id);
      setSubscribed(false);
    } else {
      const perm = await requestNotificationPermission();
      setPermission(perm);
      if (perm === "granted") {
        const success = await subscribeToPush(user.id);
        setSubscribed(success);
      }
    }
    setToggling(false);
  }

  const supported = typeof window !== "undefined" && "PushManager" in window && "Notification" in window;

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="p-2 -ml-2 text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-gray-900">{t("알림 설정", "Notification Settings")}</h1>
      </div>

      {!supported ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="text-sm text-yellow-800">
            {t("이 브라우저는 푸시 알림을 지원하지 않습니다.", "Push notifications are not supported in this browser.")}
          </p>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Push notification toggle */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{t("푸시 알림", "Push Notifications")}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {t("공지사항, 일정 변경 등의 알림을 받습니다", "Receive alerts for announcements and schedule changes")}
                </p>
              </div>
              <button
                onClick={handleToggle}
                disabled={toggling}
                className={`relative w-12 h-7 rounded-full transition-colors ${
                  subscribed ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                  subscribed ? "translate-x-5.5" : "translate-x-0.5"
                }`} />
              </button>
            </div>
          </div>

          {/* Permission status */}
          {permission === "denied" && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm text-red-800">
                {t(
                  "알림이 차단되어 있습니다. 브라우저 설정에서 알림을 허용해주세요.",
                  "Notifications are blocked. Please enable them in your browser settings."
                )}
              </p>
            </div>
          )}

          {/* Info */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">{t("알림 종류", "Notification Types")}</h3>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                <span>{t("긴급 공지사항", "Urgent announcements")}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                <span>{t("일정 변경", "Schedule changes")}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                <span>{t("타겟 배정 업데이트", "Target assignment updates")}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                <span>{t("참가신청 상태 변경", "Registration status changes")}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
