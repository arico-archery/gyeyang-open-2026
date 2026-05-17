"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { useAuth } from "@/lib/supabase/auth-context";
import { supabase } from "@/lib/supabase/client";
import type { Announcement, AnnouncementPriority } from "@/lib/supabase/types";

type View = "list" | "form";

export default function AdminAnnouncementsPage() {
  const { locale } = useI18n();
  const { user, profile } = useAuth();
  const router = useRouter();
  const [view, setView] = useState<View>("list");
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [content, setContent] = useState("");
  const [contentEn, setContentEn] = useState("");
  const [priority, setPriority] = useState<AnnouncementPriority>("normal");

  const t = (ko: string, en: string) => (locale === "ko" ? ko : en);

  useEffect(() => {
    if (profile && profile.role !== "admin") router.push("/app");
  }, [profile, router]);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  async function fetchAnnouncements() {
    const { data } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setAnnouncements(data);
    setLoading(false);
  }

  function openNew() {
    setEditingId(null);
    setTitle(""); setTitleEn(""); setContent(""); setContentEn(""); setPriority("normal");
    setView("form");
  }

  function openEdit(a: Announcement) {
    setEditingId(a.id);
    setTitle(a.title); setTitleEn(a.title_en || ""); setContent(a.content); setContentEn(a.content_en || ""); setPriority(a.priority);
    setView("form");
  }

  async function handleSave() {
    if (!title.trim() || !content.trim() || !user) return;
    setSaving(true);

    if (editingId) {
      await supabase.from("announcements").update({
        title, title_en: titleEn || null, content, content_en: contentEn || null, priority,
      }).eq("id", editingId);
    } else {
      await supabase.from("announcements").insert({
        title, title_en: titleEn || null, content, content_en: contentEn || null, priority, author_id: user.id,
      });
    }

    setSaving(false);
    setView("list");
    fetchAnnouncements();
  }

  async function handleDelete(id: string) {
    if (!confirm(t("정말 삭제하시겠습니까?", "Are you sure you want to delete?"))) return;
    await supabase.from("announcements").delete().eq("id", id);
    fetchAnnouncements();
  }

  if (loading) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-6">
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (view === "form") {
    return (
      <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setView("list")} className="p-2 -ml-2 text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-900">
            {editingId ? t("공지 수정", "Edit Announcement") : t("새 공지", "New Announcement")}
          </h1>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">{t("제목 (한국어)", "Title (Korean)")}</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">{t("제목 (영어)", "Title (English)")}</label>
            <input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} className="mt-1 w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">{t("내용 (한국어)", "Content (Korean)")}</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={5} className="mt-1 w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm resize-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">{t("내용 (영어)", "Content (English)")}</label>
            <textarea value={contentEn} onChange={(e) => setContentEn(e.target.value)} rows={5} className="mt-1 w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm resize-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">{t("우선순위", "Priority")}</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value as AnnouncementPriority)} className="mt-1 w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm">
              <option value="normal">{t("일반", "Normal")}</option>
              <option value="important">{t("중요", "Important")}</option>
              <option value="urgent">{t("긴급", "Urgent")}</option>
            </select>
          </div>

          <button
            onClick={handleSave}
            disabled={saving || !title.trim() || !content.trim()}
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-xl disabled:opacity-50"
          >
            {saving ? t("저장 중...", "Saving...") : t("저장", "Save")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/app/admin")} className="p-2 -ml-2 text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-900">{t("공지사항 관리", "Manage Announcements")}</h1>
        </div>
        <button onClick={openNew} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg">
          + {t("새 공지", "New")}
        </button>
      </div>

      {announcements.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
          <p className="text-sm text-gray-400">{t("공지사항이 없습니다", "No announcements")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map((a) => (
            <div key={a.id} className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-start gap-2">
                <span className={`shrink-0 mt-1 w-2 h-2 rounded-full ${
                  a.priority === "urgent" ? "bg-red-500" : a.priority === "important" ? "bg-amber-500" : "bg-blue-400"
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{a.title}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(a.created_at).toLocaleDateString(locale === "ko" ? "ko-KR" : "en-US")}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mt-3 pt-3 border-t border-gray-50">
                <button onClick={() => openEdit(a)} className="text-xs text-blue-600 font-medium">{t("수정", "Edit")}</button>
                <button onClick={() => handleDelete(a.id)} className="text-xs text-red-500 font-medium">{t("삭제", "Delete")}</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
