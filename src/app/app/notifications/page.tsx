"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useInlineT } from "@/lib/i18n/inline";
import { useAuth } from "@/lib/supabase/auth-context";
import {
  isPushSubscribed,
  subscribeToPush,
  unsubscribeFromPush,
  requestNotificationPermission,
} from "@/lib/push-notifications";

export default function NotificationsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [subscribed, setSubscribed] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  const t = useInlineT();

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
        <h1 className="text-xl font-bold text-gray-900">{t("알림 설정", "Notification Settings", "通知设置", "通知設定")}</h1>
      </div>

      {!supported ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="text-sm text-yellow-800">
            {t("이 브라우저는 푸시 알림을 지원하지 않습니다.", "Push notifications are not supported in this browser.", "此浏览器不支持推送通知。", "このブラウザはプッシュ通知に対応していません。")}
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
                <p className="text-sm font-medium text-gray-900">{t("푸시 알림", "Push Notifications", "推送通知", "プッシュ通知")}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {t("공지사항, 일정 변경 등의 알림을 받습니다", "Receive alerts for announcements and schedule changes", "接收公告与赛程变更等通知", "お知らせやスケジュール変更などの通知を受け取ります")}
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
                  "Notifications are blocked. Please enable them in your browser settings.",
                  "通知已被阻止。请在浏览器设置中允许通知。",
                  "通知がブロックされています。ブラウザの設定で通知を許可してください。"
                )}
              </p>
            </div>
          )}

          {/* Info */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">{t("알림 종류", "Notification Types", "通知类型", "通知の種類")}</h3>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                <span>{t("긴급 공지사항", "Urgent announcements", "紧急公告", "緊急のお知らせ")}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                <span>{t("일정 변경", "Schedule changes", "赛程变更", "スケジュール変更")}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                <span>{t("타겟 배정 업데이트", "Target assignment updates", "靶位分配更新", "的位置割り当て更新")}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                <span>{t("참가신청 상태 변경", "Registration status changes", "报名状态变更", "エントリー状況の変更")}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
