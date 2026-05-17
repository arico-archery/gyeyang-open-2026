"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { supabase } from "@/lib/supabase/client";

interface Announcement {
  id: string;
  title_ko: string;
  title_en: string;
  content_ko: string;
  content_en: string;
  priority: string;
  created_at: string;
}

export default function AnnouncementsPage() {
  const { locale } = useI18n();
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const t = (ko: string, en: string) => (locale === "ko" ? ko : en);

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
    const title = locale === "ko" ? selected.title_ko : selected.title_en;
    const content = locale === "ko" ? selected.content_ko : selected.content_en;

    return (
      <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setSelectedId(null)} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg">
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-900">{t("공지사항", "Announcement")}</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          {selected.priority === "high" && (
            <span className="inline-block px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-semibold rounded-md mb-2">
              {t("중요", "Important")}
            </span>
          )}
          <h2 className="text-lg font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-xs text-gray-400 mb-4">
            {new Date(selected.created_at).toLocaleDateString()}
          </p>
          <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {content}
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
        <h1 className="text-xl font-bold text-gray-900">{t("공지사항", "Announcements")}</h1>
      </div>

      {announcements.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-sm text-gray-400">{t("등록된 공지사항이 없습니다", "No announcements yet")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map((item) => {
            const title = locale === "ko" ? item.title_ko : item.title_en;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-left hover:border-blue-200 transition-colors"
              >
                <div className="flex items-start gap-3">
                  {item.priority === "high" && (
                    <span className="shrink-0 mt-0.5 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">{title}</h3>
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
