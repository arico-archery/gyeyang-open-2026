"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { useInlineT } from "@/lib/i18n/inline";
import { useAuth } from "@/lib/supabase/auth-context";
import { supabase } from "@/lib/supabase/client";
import { isSuperAdmin } from "@/lib/super-admin";
import type { ContactMessage, ContactMessageStatus } from "@/lib/supabase/types";

/**
 * 관리자 — 홈페이지 「대회 문의」폼 제출 목록·상세·답변 화면.
 *
 * - 데이터: public.contact_messages (admin SELECT/UPDATE 권한)
 * - 첨부: contact-attachments 버킷 → createSignedUrl(1시간)
 * - 응답은 이 화면에서 직접 작성하면 status='replied'로 변경되지만
 *   실제 이메일 회신은 「보낸 사람」주소에서 직접 보내야 함 (메일 클라이언트 사용).
 */

function formatBytes(bytes: number | null | undefined): string {
  if (!bytes && bytes !== 0) return "";
  if (bytes! < 1024) return `${bytes} B`;
  if (bytes! < 1024 * 1024) return `${(bytes! / 1024).toFixed(1)} KB`;
  return `${(bytes! / (1024 * 1024)).toFixed(2)} MB`;
}

const STATUS_LABEL: Record<ContactMessageStatus, { ko: string; en: string; color: string }> = {
  pending: { ko: "대기중", en: "Pending", color: "bg-yellow-100 text-yellow-800" },
  replied: { ko: "답변완료", en: "Replied", color: "bg-green-100 text-green-800" },
  closed: { ko: "종료", en: "Closed", color: "bg-gray-100 text-gray-600" },
  spam: { ko: "스팸", en: "Spam", color: "bg-red-100 text-red-700" },
};

export default function AdminContactMessagesPage() {
  const { locale } = useI18n();
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const ti = useInlineT();

  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [fetching, setFetching] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});
  const [replyText, setReplyText] = useState("");
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<"all" | ContactMessageStatus>("all");

  const isAdmin = profile?.role === "admin" || isSuperAdmin(user?.email);

  useEffect(() => {
    if (!loading && !isAdmin) router.push("/app");
  }, [loading, isAdmin, router]);

  useEffect(() => {
    if (!isAdmin) return;
    void fetchMessages();
  }, [isAdmin]);

  async function fetchMessages() {
    setFetching(true);
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("fetch contact_messages failed:", error);
    } else if (data) {
      setMessages(data as ContactMessage[]);
    }
    setFetching(false);
  }

  async function getOrCreateSignedUrl(path: string): Promise<string | null> {
    if (signedUrls[path]) return signedUrls[path];
    const { data } = await supabase.storage
      .from("contact-attachments")
      .createSignedUrl(path, 60 * 60); // 1h
    if (!data?.signedUrl) return null;
    setSignedUrls((prev) => ({ ...prev, [path]: data.signedUrl }));
    return data.signedUrl;
  }

  async function updateStatus(id: string, status: ContactMessageStatus) {
    const patch: Partial<ContactMessage> = { status };
    if (status === "replied" && replyText.trim()) {
      patch.reply = replyText.trim();
      patch.replied_at = new Date().toISOString();
    }
    setSaving(true);
    const { error } = await supabase.from("contact_messages").update(patch).eq("id", id);
    setSaving(false);
    if (error) {
      console.error("update failed:", error);
      alert(ti("저장 실패", "Save failed", "保存失败", "保存に失敗") + ": " + error.message);
      return;
    }
    if (status === "replied") setReplyText("");
    await fetchMessages();
  }

  async function deleteMessage(id: string) {
    if (!confirm(ti("정말 삭제하시겠습니까?", "Delete this message?", "确认删除?", "削除しますか?"))) return;
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) {
      alert(ti("삭제 실패", "Delete failed", "删除失败", "削除に失敗") + ": " + error.message);
      return;
    }
    setSelectedId(null);
    await fetchMessages();
  }

  if (loading || fetching) {
    return (
      <div className="max-w-2xl mx-auto px-4 pt-6">
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-6 text-center">
        <p className="text-red-500 font-medium">
          {ti("관리자 권한이 필요합니다", "Admin access required", "需要管理员权限", "管理者権限が必要です")}
        </p>
      </div>
    );
  }

  const selected = messages.find((m) => m.id === selectedId);
  const filtered = filter === "all" ? messages : messages.filter((m) => m.status === filter);
  const counts = {
    all: messages.length,
    pending: messages.filter((m) => m.status === "pending").length,
    replied: messages.filter((m) => m.status === "replied").length,
    closed: messages.filter((m) => m.status === "closed").length,
    spam: messages.filter((m) => m.status === "spam").length,
  };

  const statusLabel = (s: ContactMessageStatus) =>
    locale === "ko" ? STATUS_LABEL[s].ko : STATUS_LABEL[s].en;

  // ── Detail view ─────────────────────────────────────────────
  if (selected) {
    const attachmentUrl = selected.attachment_path
      ? signedUrls[selected.attachment_path]
      : null;
    return (
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-24">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setSelectedId(null)}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-900">
            {ti("문의 상세", "Message Detail", "咨询详情", "お問い合わせ詳細")}
          </h1>
        </div>

        {/* Header card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-gray-900 break-words">{selected.subject}</h2>
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-medium">{selected.name}</span>{" "}
                <a
                  href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                  className="text-blue-600 underline underline-offset-2 hover:text-blue-700 break-all"
                >
                  {selected.email}
                </a>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(selected.created_at).toLocaleString(locale === "ko" ? "ko-KR" : "en-US", {
                  timeZone: "Asia/Seoul",
                })}{" "}
                (KST)
              </p>
            </div>
            <span
              className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_LABEL[selected.status].color}`}
            >
              {statusLabel(selected.status)}
            </span>
          </div>

          {/* Message body */}
          <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
            {selected.message}
          </div>

          {/* Attachment */}
          {selected.attachment_path && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-xl text-sm">
              <p className="text-xs font-semibold text-blue-700 mb-1.5">
                📎 {ti("첨부 파일", "Attachment", "附件", "添付ファイル")}
              </p>
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-gray-900">
                    {selected.attachment_filename}
                  </p>
                  <p className="text-xs text-gray-500">{formatBytes(selected.attachment_size_bytes)}</p>
                </div>
                {attachmentUrl ? (
                  <a
                    href={attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={selected.attachment_filename ?? undefined}
                    className="shrink-0 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg"
                  >
                    {ti("다운로드", "Download", "下载", "ダウンロード")}
                  </a>
                ) : (
                  <button
                    onClick={() => void getOrCreateSignedUrl(selected.attachment_path!)}
                    className="shrink-0 px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-semibold rounded-lg"
                  >
                    {ti("링크 생성", "Get link", "获取链接", "リンク生成")}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Existing reply */}
        {selected.reply && (
          <div className="bg-green-50 border border-green-100 rounded-2xl p-4 mb-4">
            <p className="text-xs font-semibold text-green-700 mb-2">
              {ti("내부 메모/답변", "Reply / Internal Note", "回复/备注", "返信メモ")}
              {selected.replied_at && (
                <span className="ml-2 text-gray-400 font-normal">
                  {new Date(selected.replied_at).toLocaleString(
                    locale === "ko" ? "ko-KR" : "en-US"
                  )}
                </span>
              )}
            </p>
            <p className="text-sm text-gray-800 whitespace-pre-wrap">{selected.reply}</p>
          </div>
        )}

        {/* Reply form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
          <p className="text-sm font-semibold text-gray-900 mb-1">
            {ti("답변 / 메모 기록", "Reply / Note", "回复/备注", "返信/メモ")}
          </p>
          <p className="text-xs text-gray-500 mb-3">
            {ti(
              "실제 이메일 회신은 「보낸 사람」주소로 직접 보내주세요. 이 칸은 내부 기록·답변 본문 저장용입니다.",
              "Send the actual reply from your email client to the sender. This field stores the reply text as an internal record.",
              "实际邮件回复请通过邮件客户端发送给提交人。此处仅作为内部记录保存。",
              "実際のメール返信は送信者のアドレスへ直接送ってください。ここは記録用です。"
            )}
          </p>
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={ti(
              "답변 내용 또는 메모를 입력하세요...",
              "Type your reply or note...",
              "请输入回复或备注...",
              "返信内容またはメモを入力..."
            )}
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
            <a
              href={`mailto:${selected.email}?subject=${encodeURIComponent(
                "Re: " + selected.subject
              )}`}
              className="col-span-2 sm:col-span-1 inline-flex items-center justify-center gap-1 px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl"
            >
              ✉ {ti("메일 작성", "Open email", "打开邮件", "メール作成")}
            </a>
            <button
              onClick={() => updateStatus(selected.id, "replied")}
              disabled={saving || !replyText.trim()}
              className="px-3 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl disabled:opacity-50"
            >
              {ti("답변완료", "Mark Replied", "标记已回复", "返信済み")}
            </button>
            <button
              onClick={() => updateStatus(selected.id, "closed")}
              disabled={saving}
              className="px-3 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-xl disabled:opacity-50"
            >
              {ti("종료", "Close", "关闭", "終了")}
            </button>
            <button
              onClick={() => updateStatus(selected.id, "spam")}
              disabled={saving}
              className="px-3 py-2.5 bg-red-100 hover:bg-red-200 text-red-700 text-sm font-medium rounded-xl disabled:opacity-50"
            >
              {ti("스팸", "Spam", "垃圾", "スパム")}
            </button>
          </div>
        </div>

        {/* Danger zone */}
        <button
          onClick={() => deleteMessage(selected.id)}
          className="w-full py-2 text-sm text-red-600 hover:text-red-700 font-medium"
        >
          {ti("이 문의 삭제", "Delete this message", "删除此咨询", "この問い合わせを削除")}
        </button>
      </div>
    );
  }

  // ── List view ──────────────────────────────────────────────
  const FILTERS: { value: typeof filter; label: string; count: number }[] = [
    { value: "all", label: ti("전체", "All", "全部", "すべて"), count: counts.all },
    { value: "pending", label: ti("대기", "Pending", "等待", "未対応"), count: counts.pending },
    { value: "replied", label: ti("완료", "Replied", "已回复", "対応済"), count: counts.replied },
    { value: "closed", label: ti("종료", "Closed", "关闭", "終了"), count: counts.closed },
    { value: "spam", label: ti("스팸", "Spam", "垃圾", "スパム"), count: counts.spam },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.push("/app/admin")} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg">
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-gray-900">
          {ti("대회 문의 관리", "Contact Messages", "赛事咨询管理", "お問い合わせ管理")}
        </h1>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              filter === f.value
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {f.label} <span className="opacity-75">({f.count})</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <p className="text-sm text-gray-400">
            {ti("해당하는 문의가 없습니다", "No messages match this filter", "没有符合条件的咨询", "該当するお問い合わせはありません")}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedId(m.id)}
              className="w-full text-left bg-white rounded-xl border border-gray-100 p-4 hover:border-blue-200 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-3 mb-1">
                <p className="font-semibold text-gray-900 truncate flex-1">{m.subject}</p>
                <span
                  className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold ${STATUS_LABEL[m.status].color}`}
                >
                  {statusLabel(m.status)}
                </span>
              </div>
              <p className="text-sm text-gray-600 truncate mb-1">
                <span className="font-medium">{m.name}</span>
                <span className="text-gray-400"> · {m.email}</span>
              </p>
              <p className="text-xs text-gray-500 line-clamp-2">{m.message}</p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-[11px] text-gray-400">
                  {new Date(m.created_at).toLocaleString(locale === "ko" ? "ko-KR" : "en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                {m.attachment_path && (
                  <span className="text-[11px] text-blue-600 font-medium">📎</span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
