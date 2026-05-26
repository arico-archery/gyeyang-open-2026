// Supabase Edge Function: notify-contact
//
// Sends an email notification to the LOC when a new public contact message
// is submitted via the /contact form on gyeyangopen.com.
//
// Invoked from the ContactForm component immediately after a successful
// INSERT to public.contact_messages. The function:
//   1. Fetches the row by ID (using the service role so RLS is bypassed)
//   2. Generates a signed URL for the attachment (if any)
//   3. Sends an email via Resend to NOTIFY_TO
//
// If RESEND_API_KEY is unset, the function logs the message and returns
// 200 so form submission never fails because of email delivery.
//
// Deploy with:
//   supabase functions deploy notify-contact --project-ref zgykozcoutixaobwkxru
//
// Required Edge Function secrets:
//   - RESEND_API_KEY        (https://resend.com/api-keys)
//   - NOTIFY_TO             (e.g. "gyeyangopen@gmail.com", default below)
//   - NOTIFY_FROM           (e.g. "GYEYANG OPEN <onboarding@resend.dev>", default below)
//   - SUPABASE_URL          (auto-injected)
//   - SUPABASE_SERVICE_ROLE_KEY (auto-injected)

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const NOTIFY_TO = Deno.env.get("NOTIFY_TO") ?? "gyeyangopen@gmail.com";
// Until gyeyangopen.com is verified in Resend, use the shared onboarding sender.
const NOTIFY_FROM =
  Deno.env.get("NOTIFY_FROM") ?? "GYEYANG OPEN <onboarding@resend.dev>";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface Payload {
  messageId?: string;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatBytes(bytes: number | null | undefined): string {
  if (!bytes && bytes !== 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "POST only" }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    });
  }

  try {
    const body = (await req.json()) as Payload;
    const { messageId } = body || {};

    if (!messageId || typeof messageId !== "string") {
      return new Response(JSON.stringify({ error: "messageId required" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...CORS_HEADERS },
      });
    }

    // 1) Fetch the row (service role bypasses RLS)
    const { data: row, error } = await supabase
      .from("contact_messages")
      .select(
        "id, name, email, subject, message, attachment_path, attachment_filename, attachment_size_bytes, created_at"
      )
      .eq("id", messageId)
      .single();

    if (error || !row) {
      return new Response(
        JSON.stringify({ error: "message not found", detail: error?.message }),
        {
          status: 404,
          headers: { "Content-Type": "application/json", ...CORS_HEADERS },
        }
      );
    }

    // 2) Signed URL for attachment (7-day expiry, plenty of time to reply)
    let attachmentUrl: string | null = null;
    if (row.attachment_path) {
      const { data: signed } = await supabase.storage
        .from("contact-attachments")
        .createSignedUrl(row.attachment_path, 60 * 60 * 24 * 7);
      attachmentUrl = signed?.signedUrl ?? null;
    }

    // 3) If Resend isn't configured yet, log and return success so the
    //    form submission still works during early setup.
    if (!RESEND_API_KEY) {
      console.warn(
        "notify-contact: RESEND_API_KEY not set — skipping email. " +
          `Message ID: ${row.id}, from: ${row.email}, subject: "${row.subject}"`
      );
      return new Response(
        JSON.stringify({
          ok: true,
          skipped: true,
          reason: "RESEND_API_KEY not configured",
        }),
        { headers: { "Content-Type": "application/json", ...CORS_HEADERS } }
      );
    }

    // 4) Build + send email via Resend HTTP API
    const adminUrl = "https://www.gyeyangopen.com/app/admin/contact-messages";
    const subjectLine = `[GYEYANG OPEN 문의] ${row.subject}`;

    const text = [
      `새로운 대회 문의가 접수되었습니다.`,
      ``,
      `보낸 사람: ${row.name} <${row.email}>`,
      `제목: ${row.subject}`,
      `접수 시각: ${new Date(row.created_at).toLocaleString("ko-KR", {
        timeZone: "Asia/Seoul",
      })} (KST)`,
      ``,
      `── 내용 ──`,
      row.message,
      ``,
      attachmentUrl
        ? `첨부 파일: ${row.attachment_filename} (${formatBytes(row.attachment_size_bytes)})\n${attachmentUrl}\n(7일간 유효)`
        : `첨부 파일: 없음`,
      ``,
      `관리자 페이지: ${adminUrl}`,
    ].join("\n");

    const safeMsg = escapeHtml(row.message).replace(/\n/g, "<br>");
    const html = `
<!DOCTYPE html>
<html lang="ko">
<body style="font-family: -apple-system, 'Segoe UI', Roboto, sans-serif; background:#f8fafc; padding:24px; color:#0f172a;">
  <div style="max-width:600px; margin:0 auto; background:#fff; border:1px solid #e2e8f0; border-radius:16px; overflow:hidden;">
    <div style="background:#2563eb; color:#fff; padding:20px 24px;">
      <p style="margin:0; font-size:12px; letter-spacing:.18em; opacity:.85;">GYEYANG OPEN · CONTACT</p>
      <h1 style="margin:6px 0 0; font-size:20px;">새 대회 문의가 접수되었습니다</h1>
    </div>
    <div style="padding:24px;">
      <table style="width:100%; font-size:14px; border-collapse:collapse;">
        <tr><td style="color:#64748b; padding:6px 0; width:90px;">보낸 사람</td><td><strong>${escapeHtml(row.name)}</strong> &lt;<a href="mailto:${escapeHtml(row.email)}">${escapeHtml(row.email)}</a>&gt;</td></tr>
        <tr><td style="color:#64748b; padding:6px 0;">제목</td><td><strong>${escapeHtml(row.subject)}</strong></td></tr>
        <tr><td style="color:#64748b; padding:6px 0;">접수 시각</td><td>${new Date(row.created_at).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })} (KST)</td></tr>
      </table>

      <div style="margin:18px 0; padding:16px; background:#f1f5f9; border-radius:10px; font-size:14px; line-height:1.6;">
        ${safeMsg}
      </div>

      ${
        attachmentUrl
          ? `<div style="margin:18px 0; padding:14px; border:1px solid #dbeafe; border-radius:10px; background:#eff6ff; font-size:13px;">
              <p style="margin:0 0 8px; font-weight:600; color:#1e40af;">📎 첨부 파일</p>
              <p style="margin:0;"><a href="${attachmentUrl}" style="color:#2563eb;">${escapeHtml(row.attachment_filename ?? "attachment")}</a> · ${formatBytes(row.attachment_size_bytes)}</p>
              <p style="margin:6px 0 0; color:#64748b; font-size:11px;">링크는 7일간 유효합니다.</p>
            </div>`
          : ""
      }

      <div style="margin-top:20px; text-align:center;">
        <a href="${adminUrl}" style="display:inline-block; background:#2563eb; color:#fff; text-decoration:none; padding:11px 22px; border-radius:10px; font-size:14px; font-weight:600;">관리자에서 답변하기</a>
      </div>

      <p style="margin:20px 0 0; color:#94a3b8; font-size:11px; text-align:center;">
        회신은 위 「보낸 사람」 이메일 또는 관리자 페이지에서 처리해 주세요.
      </p>
    </div>
  </div>
</body>
</html>`;

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: NOTIFY_FROM,
        to: [NOTIFY_TO],
        reply_to: row.email,
        subject: subjectLine,
        text,
        html,
      }),
    });

    if (!resendRes.ok) {
      const errBody = await resendRes.text();
      console.error("Resend failure:", resendRes.status, errBody);
      return new Response(
        JSON.stringify({
          ok: false,
          error: `Resend HTTP ${resendRes.status}`,
          detail: errBody.slice(0, 500),
        }),
        {
          status: 502,
          headers: { "Content-Type": "application/json", ...CORS_HEADERS },
        }
      );
    }

    const resendData = await resendRes.json();
    return new Response(
      JSON.stringify({ ok: true, emailId: resendData?.id ?? null }),
      { headers: { "Content-Type": "application/json", ...CORS_HEADERS } }
    );
  } catch (err) {
    console.error("notify-contact error:", err);
    return new Response(
      JSON.stringify({ error: String((err as Error).message || err) }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...CORS_HEADERS },
      }
    );
  }
});
