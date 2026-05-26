"use client";

import { useRef, useState } from "react";
import { useInlineT } from "@/lib/i18n/inline";
import { supabase } from "@/lib/supabase/client";

/**
 * Public homepage contact form.
 *
 * Submissions are stored in `public.contact_messages` (anonymous INSERT
 * allowed via RLS). File attachments are uploaded to the private
 * `contact-attachments` Storage bucket; only admins can read those.
 *
 * Fields: name, email, subject, message, optional file (≤ 10 MB).
 */

const MAX_FILE_BYTES = 10 * 1024 * 1024; // keep in sync with Storage bucket policy
const ALLOWED_MIME_PREFIXES = [
  "image/",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.",
  "application/vnd.ms-excel",
  "application/zip",
  "text/plain",
];

function sanitizeFilename(name: string): string {
  // Strip path separators and weird chars; keep extension.
  return name.replace(/[^A-Za-z0-9._-]/g, "_").slice(0, 120);
}

function isMimeAllowed(mime: string): boolean {
  return ALLOWED_MIME_PREFIXES.some((p) => mime.startsWith(p));
}

export default function ContactForm() {
  const ti = useInlineT();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFile = (f: File | null) => {
    setError(null);
    if (!f) {
      setFile(null);
      return;
    }
    if (f.size > MAX_FILE_BYTES) {
      setError(
        ti(
          "첨부 파일은 10 MB 이하여야 합니다.",
          "Attachment must be 10 MB or smaller.",
          "附件大小不能超过 10 MB。",
          "添付ファイルは 10 MB 以下にしてください。"
        )
      );
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    if (!isMimeAllowed(f.type)) {
      setError(
        ti(
          "허용되지 않는 파일 형식입니다. (이미지·PDF·Office 문서·ZIP·TXT)",
          "Unsupported file type. (Images, PDF, Office docs, ZIP, TXT)",
          "不支持的文件类型。(图片、PDF、Office 文档、ZIP、TXT)",
          "対応していないファイル形式です。(画像・PDF・Office・ZIP・TXT)"
        )
      );
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    setFile(f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);

    try {
      let attachmentPath: string | null = null;
      let attachmentFilename: string | null = null;
      let attachmentSize: number | null = null;

      // 1) Upload attachment (if any) to private bucket
      if (file) {
        const ext = file.name.includes(".") ? file.name.split(".").pop() ?? "" : "";
        const year = new Date().getFullYear();
        const uniq = (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`);
        const safeBase = sanitizeFilename(file.name.replace(/\.[^.]+$/, ""));
        const objectPath = `${year}/${uniq}-${safeBase}${ext ? "." + ext : ""}`;

        const { error: upErr } = await supabase.storage
          .from("contact-attachments")
          .upload(objectPath, file, {
            contentType: file.type,
            cacheControl: "3600",
            upsert: false,
          });

        if (upErr) {
          throw new Error(
            ti(
              "파일 업로드에 실패했습니다. 잠시 후 다시 시도해 주세요.",
              "File upload failed. Please try again.",
              "文件上传失败,请稍后重试。",
              "ファイルのアップロードに失敗しました。後ほど再度お試しください。"
            ) + ` (${upErr.message})`
          );
        }

        attachmentPath = objectPath;
        attachmentFilename = file.name;
        attachmentSize = file.size;
      }

      // 2) Insert message row. We generate the UUID client-side because RLS
      //    on contact_messages.SELECT is admin-only, so anonymous submitters
      //    can't read the row back after INSERT — but we need the ID to
      //    invoke the notify-contact Edge Function below.
      const messageId =
        globalThis.crypto?.randomUUID?.() ??
        `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const ua = typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 500) : null;
      const { error: insertErr } = await supabase.from("contact_messages").insert({
        id: messageId,
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
        attachment_path: attachmentPath,
        attachment_filename: attachmentFilename,
        attachment_size_bytes: attachmentSize,
        user_agent: ua,
      });

      if (insertErr) {
        throw new Error(
          ti(
            "문의 제출에 실패했습니다. 잠시 후 다시 시도해 주세요.",
            "Failed to submit your message. Please try again.",
            "提交失败,请稍后重试。",
            "送信に失敗しました。後ほど再度お試しください。"
          ) + ` (${insertErr.message})`
        );
      }

      // 3) Trigger email notification (best-effort — never block the user
      //    on email delivery; the row is already in the DB).
      try {
        await supabase.functions.invoke("notify-contact", {
          body: { messageId },
        });
      } catch (notifyErr) {
        // Log but do not surface — admin can still see the message in the DB.
        console.warn("notify-contact invoke failed:", notifyErr);
      }

      // Reset form on success
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto bg-white border border-blue-100 rounded-3xl p-8 sm:p-10 text-center shadow-sm">
        <div className="inline-flex w-14 h-14 rounded-full bg-blue-50 items-center justify-center mb-4">
          <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          {ti(
            "문의가 접수되었습니다",
            "Your message has been received",
            "您的咨询已成功提交",
            "お問い合わせを受け付けました"
          )}
        </h3>
        <p className="text-slate-600 text-sm leading-relaxed mb-6">
          {ti(
            "보내주신 내용을 확인 후 입력하신 이메일로 회신드리겠습니다. 감사합니다.",
            "We will review your message and reply to the email you provided. Thank you.",
            "我们将尽快查阅您的留言,并通过您提供的邮箱回复。谢谢。",
            "内容を確認のうえ、ご記入いただいたメールアドレスへご返信いたします。"
          )}
        </p>
        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
        >
          {ti("새 문의 작성", "Send another message", "再次提交咨询", "新しいお問い合わせ")}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5"
    >
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="cf-name" className="block text-sm font-semibold text-slate-700 mb-1.5">
            {ti("이름", "Name", "姓名", "お名前")}
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            id="cf-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={200}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={ti("홍길동", "Jane Doe", "张三", "山田 太郎")}
          />
        </div>
        <div>
          <label htmlFor="cf-email" className="block text-sm font-semibold text-slate-700 mb-1.5">
            {ti("이메일", "Email", "邮箱", "メール")}
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            id="cf-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="cf-subject" className="block text-sm font-semibold text-slate-700 mb-1.5">
          {ti("제목", "Subject", "主题", "件名")}
          <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          id="cf-subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          maxLength={300}
          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={ti(
            "문의 제목을 입력해 주세요",
            "Enter a subject",
            "请输入咨询主题",
            "件名を入力してください"
          )}
        />
      </div>

      <div>
        <label htmlFor="cf-message" className="block text-sm font-semibold text-slate-700 mb-1.5">
          {ti("내용", "Message", "内容", "本文")}
          <span className="text-red-500 ml-1">*</span>
        </label>
        <textarea
          id="cf-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={7}
          maxLength={5000}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder={ti(
            "문의 내용을 자세히 작성해 주세요.",
            "Please describe your inquiry in detail.",
            "请详细填写您的咨询内容。",
            "お問い合わせ内容を詳しくご記入ください。"
          )}
        />
        <p className="mt-1 text-right text-xs text-slate-400">{message.length} / 5000</p>
      </div>

      <div>
        <label htmlFor="cf-file" className="block text-sm font-semibold text-slate-700 mb-1.5">
          {ti("파일 첨부", "Attachment", "附件", "ファイル添付")}
          <span className="ml-2 text-xs font-normal text-slate-400">
            {ti("(선택, 최대 10 MB)", "(optional, up to 10 MB)", "(可选,最大 10 MB)", "(任意・最大 10 MB)")}
          </span>
        </label>
        <div className="flex items-center gap-3">
          <label
            htmlFor="cf-file"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 cursor-pointer transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
            {ti("파일 선택", "Choose file", "选择文件", "ファイルを選択")}
          </label>
          <input
            id="cf-file"
            ref={fileInputRef}
            type="file"
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.zip,.txt"
            className="sr-only"
          />
          {file && (
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span className="text-sm text-slate-700 truncate flex-1">{file.name}</span>
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="shrink-0 text-xs text-red-600 hover:text-red-700 font-medium"
              >
                {ti("제거", "Remove", "移除", "削除")}
              </button>
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 bg-blue-600 text-white text-base font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting
          ? ti("제출 중...", "Sending...", "提交中...", "送信中...")
          : ti("문의 보내기", "Send Message", "提交咨询", "送信する")}
      </button>

      <p className="text-xs text-slate-400 text-center">
        {ti(
          "보내주신 정보는 문의 응답 목적으로만 사용됩니다.",
          "Your information is used solely to respond to your inquiry.",
          "您提供的信息仅用于回复本次咨询。",
          "ご提供いただいた情報はお問い合わせ対応のみに使用します。"
        )}
      </p>
    </form>
  );
}
