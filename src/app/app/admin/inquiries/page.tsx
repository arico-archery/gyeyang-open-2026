"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { useInlineT } from "@/lib/i18n/inline";
import { useAuth } from "@/lib/supabase/auth-context";
import { supabase } from "@/lib/supabase/client";
import type { InquiryStatus } from "@/lib/supabase/types";

interface InquiryWithProfile {
  id: string;
  user_id: string;
  category: string;
  subject: string;
  message: string;
  reply: string | null;
  replied_at: string | null;
  status: InquiryStatus;
  created_at: string;
  profiles: { full_name: string; full_name_en: string | null } | null;
}

export default function AdminInquiriesPage() {
  const { locale } = useI18n();
  const { profile } = useAuth();
  const router = useRouter();
  const [inquiries, setInquiries] = useState<InquiryWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [saving, setSaving] = useState(false);

  const t = useInlineT();

  useEffect(() => {
    if (profile && profile.role !== "admin") router.push("/app");
  }, [profile, router]);

  useEffect(() => {
    fetchInquiries();
  }, []);

  async function fetchInquiries() {
    const { data } = await supabase
      .from("inquiries")
      .select("*, profiles(full_name, full_name_en)")
      .order("created_at", { ascending: false });
    if (data) setInquiries(data as InquiryWithProfile[]);
    setLoading(false);
  }

  async function handleReply(id: string) {
    if (!replyText.trim()) return;
    setSaving(true);
    await supabase.from("inquiries").update({
      reply: replyText,
      replied_at: new Date().toISOString(),
      status: "replied" as InquiryStatus,
    }).eq("id", id);
    setSaving(false);
    setReplyText("");
    setSelectedId(null);
    fetchInquiries();
  }

  async function closeInquiry(id: string) {
    await supabase.from("inquiries").update({ status: "closed" as InquiryStatus }).eq("id", id);
    fetchInquiries();
  }

  const selected = inquiries.find((i) => i.id === selectedId);

  if (loading) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-6">
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  // Detail view
  if (selected) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setSelectedId(null)} className="p-2 -ml-2 text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-900">{t("문의 상세", "Inquiry Detail")}</h1>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-400">{selected.profiles?.full_name} · {selected.category}</p>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              selected.status === "pending" ? "bg-yellow-100 text-yellow-800" :
              selected.status === "replied" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
            }`}>
              {selected.status === "pending" ? t("대기", "Pending") : selected.status === "replied" ? t("답변완료", "Replied") : t("종료", "Closed")}
            </span>
          </div>
          <h2 className="text-base font-bold text-gray-900 mb-2">{selected.subject}</h2>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{selected.message}</p>
          <p className="text-xs text-gray-400 mt-3">
            {new Date(selected.created_at).toLocaleString(locale === "ko" ? "ko-KR" : "en-US")}
          </p>
        </div>

        {/* Existing reply */}
        {selected.reply && (
          <div className="bg-blue-50 rounded-xl border border-blue-100 p-4 mb-4">
            <p className="text-xs font-medium text-blue-600 mb-1">{t("관리자 답변", "Admin Reply")}</p>
            <p className="text-sm text-blue-900 whitespace-pre-wrap">{selected.reply}</p>
            {selected.replied_at && (
              <p className="text-xs text-blue-400 mt-2">
                {new Date(selected.replied_at).toLocaleString(locale === "ko" ? "ko-KR" : "en-US")}
              </p>
            )}
          </div>
        )}

        {/* Reply form */}
        {selected.status !== "closed" && (
          <div className="space-y-3">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={t("답변을 입력하세요...", "Type your reply...")}
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm resize-none"
            />
            <div className="flex gap-2">
              <button
                onClick={() => handleReply(selected.id)}
                disabled={saving || !replyText.trim()}
                className="flex-1 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl disabled:opacity-50"
              >
                {saving ? t("전송 중...", "Sending...") : t("답변 전송", "Send Reply")}
              </button>
              {selected.status === "replied" && (
                <button
                  onClick={() => closeInquiry(selected.id)}
                  className="px-4 py-2.5 bg-gray-200 text-gray-700 text-sm font-medium rounded-xl"
                >
                  {t("종료", "Close")}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // List view
  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.push("/app/admin")} className="p-2 -ml-2 text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-gray-900">{t("문의 관리", "Manage Inquiries")}</h1>
      </div>

      {inquiries.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
          <p className="text-sm text-gray-400">{t("문의가 없습니다", "No inquiries")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inq) => (
            <button
              key={inq.id}
              onClick={() => setSelectedId(inq.id)}
              className="w-full text-left bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{inq.subject}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{inq.profiles?.full_name} · {inq.category}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(inq.created_at).toLocaleDateString(locale === "ko" ? "ko-KR" : "en-US")}
                  </p>
                </div>
                <span className={`shrink-0 ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                  inq.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                  inq.status === "replied" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                }`}>
                  {inq.status === "pending" ? t("대기", "Pending") : inq.status === "replied" ? t("답변", "Replied") : t("종료", "Closed")}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
