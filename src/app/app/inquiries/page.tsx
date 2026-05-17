"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { useAuth } from "@/lib/supabase/auth-context";
import { supabase } from "@/lib/supabase/client";

interface Inquiry {
  id: string;
  subject: string;
  message: string;
  status: string;
  admin_reply: string | null;
  created_at: string;
}

const STATUS_MAP: Record<string, { ko: string; en: string; color: string }> = {
  open: { ko: "대기중", en: "Open", color: "bg-yellow-100 text-yellow-700" },
  answered: { ko: "답변완료", en: "Answered", color: "bg-green-100 text-green-700" },
  closed: { ko: "종료", en: "Closed", color: "bg-gray-100 text-gray-600" },
};

export default function InquiriesPage() {
  const { locale } = useI18n();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Form
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const t = (ko: string, en: string) => (locale === "ko" ? ko : en);

  useEffect(() => {
    if (user) fetchInquiries();
    else if (!authLoading) setLoading(false);
  }, [user, authLoading]);

  const fetchInquiries = async () => {
    const { data } = await supabase
      .from("inquiries")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });

    if (data) setInquiries(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const { error: insertError } = await supabase.from("inquiries").insert({
      user_id: user!.id,
      subject,
      message,
      status: "open",
    });

    if (insertError) {
      setError(insertError.message);
    } else {
      setSubject("");
      setMessage("");
      setShowForm(false);
      await fetchInquiries();
    }
    setSubmitting(false);
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-6 flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    router.push("/app/login");
    return null;
  }

  const selected = inquiries.find((i) => i.id === selectedId);

  // Detail view
  if (selected) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setSelectedId(null)} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg">
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-900">{t("문의 상세", "Inquiry Detail")}</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
          <div className="flex items-start justify-between">
            <h2 className="text-base font-bold text-gray-900">{selected.subject}</h2>
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold shrink-0 ml-2 ${STATUS_MAP[selected.status]?.color || "bg-gray-100 text-gray-600"}`}>
              {STATUS_MAP[selected.status]?.[locale === "ko" ? "ko" : "en"] || selected.status}
            </span>
          </div>
          <p className="text-xs text-gray-400">{new Date(selected.created_at).toLocaleDateString()}</p>

          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{selected.message}</p>
          </div>

          {selected.admin_reply && (
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-blue-600 mb-2">{t("관리자 답변", "Admin Reply")}</p>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{selected.admin_reply}</p>
            </div>
          )}

          {!selected.admin_reply && selected.status === "open" && (
            <p className="text-sm text-gray-400 text-center">
              {t("답변 대기 중입니다", "Waiting for a reply")}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Form view
  if (showForm) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setShowForm(false)} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg">
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-900">{t("문의하기", "New Inquiry")}</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("제목", "Subject")}</label>
              <input
                type="text" value={subject} onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t("문의 제목을 입력하세요", "Enter subject")}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("내용", "Message")}</label>
              <textarea
                value={message} onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={6}
                placeholder={t("문의 내용을 작성하세요", "Write your message")}
                required
              />
            </div>
            <button
              type="submit" disabled={submitting}
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {submitting ? t("제출 중...", "Submitting...") : t("문의 제출", "Submit")}
            </button>
          </form>
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
        <h1 className="text-xl font-bold text-gray-900">{t("문의 내역", "My Inquiries")}</h1>
      </div>

      <button
        onClick={() => setShowForm(true)}
        className="w-full mb-4 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
      >
        {t("새 문의 작성", "New Inquiry")}
      </button>

      {inquiries.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-sm text-gray-400">{t("문의 내역이 없습니다", "No inquiries yet")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {inquiries.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-left hover:border-blue-200 transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-semibold text-gray-900 truncate flex-1">{item.subject}</h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ml-2 shrink-0 ${STATUS_MAP[item.status]?.color || "bg-gray-100 text-gray-600"}`}>
                  {STATUS_MAP[item.status]?.[locale === "ko" ? "ko" : "en"] || item.status}
                </span>
              </div>
              <p className="text-xs text-gray-400">{new Date(item.created_at).toLocaleDateString()}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
