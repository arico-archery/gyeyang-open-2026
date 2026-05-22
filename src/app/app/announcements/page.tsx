"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { useInlineT } from "@/lib/i18n/inline";
import { supabase } from "@/lib/supabase/client";
import type { Announcement, AnnouncementPriority } from "@/lib/supabase/types";

const PRIORITY_STYLE: Record<
  AnnouncementPriority,
  { dot: string; badge: string; label_ko: string; label_en: string; label_zh: string; label_ja: string }
> = {
  normal: { dot: "", badge: "", label_ko: "", label_en: "", label_zh: "", label_ja: "" },
  important: { dot: "bg-amber-500", badge: "bg-amber-100 text-amber-700", label_ko: "안내", label_en: "Notice", label_zh: "通知", label_ja: "お知らせ" },
  urgent: { dot: "bg-red-500", badge: "bg-red-100 text-red-600", label_ko: "긴급", label_en: "Urgent", label_zh: "紧急", label_ja: "緊急" },
};

export default function AnnouncementsPage() {
  const { locale } = useI18n();
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const t = useInlineT();

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    const { data } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setAnnouncements(data);
    setLoading(false);
  };

  const titleFor = (a: Announcement) =>
    locale === "ko" ? a.title : a.title_en || a.title;
  const contentFor = (a: Announcement) =>
    locale === "ko" ? a.content : a.content_en || a.content;

  const selected = announcements.find((a) => a.id === selectedId);

  if (loading) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-6 flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Detail view
  if (selected) {
    const style = PRIORITY_STYLE[selected.priority];
    const showBadge = selected.priority !== "normal";

    return (
      <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setSelectedId(null)} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg">
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-900">{t("공지사항", "Announcement", "公告", "お知らせ")}</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          {showBadge && (
            <span className={`inline-block px-2 py-0.5 ${style.badge} text-[10px] font-semibold rounded-md mb-2`}>
              {t(style.label_ko, style.label_en, style.label_zh, style.label_ja)}
            </span>
          )}
          <h2 className="text-lg font-bold text-gray-900 mb-2">{titleFor(selected)}</h2>
          <p className="text-xs text-gray-400 mb-4">
            {new Date(selected.created_at).toLocaleDateString()}
          </p>
          <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {contentFor(selected)}
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg">
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-gray-900">{t("공지사항", "Announcements", "公告", "お知らせ")}</h1>
      </div>

      {announcements.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-sm text-gray-400">{t("등록된 공지사항이 없습니다", "No announcements yet", "暂无公告", "お知らせはまだありません")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map((item) => {
            const style = PRIORITY_STYLE[item.priority];
            return (
              <button
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-left hover:border-blue-200 transition-colors"
              >
                <div className="flex items-start gap-3">
                  {item.priority !== "normal" && (
                    <span className={`shrink-0 mt-0.5 w-2 h-2 ${style.dot} rounded-full`} />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">{titleFor(item)}</h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <svg className="w-4 h-4 text-gray-300 shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
