// Supabase Edge Function: send-push
//
// Sends Web Push notifications to one or more users via web-push and
// the `push_subscriptions` table.
//
// Deploy with:
//   supabase functions deploy send-push --project-ref zgykozcoutixaobwkxru
//
// Required Edge Function secrets (set via Supabase Dashboard or CLI):
//   - VAPID_PUBLIC_KEY     (web-push generate-vapid-keys → publicKey)
//   - VAPID_PRIVATE_KEY    (web-push generate-vapid-keys → privateKey)
//   - VAPID_SUBJECT        (mailto:admin@example.com)
//   - SUPABASE_URL         (auto-injected)
//   - SUPABASE_SERVICE_ROLE_KEY (auto-injected)
//
// Invoke (from the app, authenticated as admin):
//   supabase.functions.invoke('send-push', { body: { userIds: ['...'], title, body, url } })

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import webpush from "npm:web-push@3.6.7";
import { createClient } from "npm:@supabase/supabase-js@2";

const VAPID_PUBLIC = Deno.env.get("VAPID_PUBLIC_KEY") ?? "";
const VAPID_PRIVATE = Deno.env.get("VAPID_PRIVATE_KEY") ?? "";
const VAPID_SUBJECT = Deno.env.get("VAPID_SUBJECT") ?? "mailto:admin@gyeyangopen.com";

if (!VAPID_PUBLIC || !VAPID_PRIVATE) {
  console.error("Missing VAPID keys — set VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY secrets.");
}

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE);

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const PUSH_OPTIONS = {
  TTL: 60 * 60 * 24, // 24h — delivery if device offline
  urgency: "high" as const,
  topic: "gyeyang-open", // collapse key — newer messages replace older undelivered ones (FCM)
};

interface PushPayloadBody {
  userIds?: string[];
  title?: string;
  body?: string;
  url?: string;
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
    const body = (await req.json()) as PushPayloadBody;
    const { userIds, title, body: msgBody, url } = body || {};

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return new Response(JSON.stringify({ error: "userIds required (non-empty array)" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...CORS_HEADERS },
      });
    }

    const { data: subs, error } = await supabase
      .from("push_subscriptions")
      .select("id, endpoint, p256dh, auth, user_id")
      .in("user_id", userIds);

    if (error) throw error;
    if (!subs || subs.length === 0) {
      return new Response(
        JSON.stringify({ sent: 0, failed: 0, message: "no subscriptions" }),
        { headers: { "Content-Type": "application/json", ...CORS_HEADERS } }
      );
    }

    const payload = JSON.stringify({
      title: title || "GYEYANG OPEN",
      body: msgBody || "",
      url: url || "/app",
      tag: "gyeyang-open-" + Date.now(),
    });

    const results = await Promise.allSettled(
      subs.map((s: { endpoint: string; p256dh: string; auth: string }) =>
        webpush.sendNotification(
          { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
          payload,
          PUSH_OPTIONS
        )
      )
    );

    const successful = results.filter((r) => r.status === "fulfilled").length;
    const failedDetails: Array<{ endpoint: string; statusCode?: number; message?: string }> = [];
    const toDelete: string[] = [];

    results.forEach((r, idx) => {
      if (r.status === "rejected") {
        // deno-lint-ignore no-explicit-any
        const reason: any = r.reason;
        const sc = reason?.statusCode;
        const ep = subs[idx].endpoint;
        failedDetails.push({
          endpoint: ep.length > 80 ? ep.slice(0, 60) + "..." + ep.slice(-15) : ep,
          statusCode: sc,
          message: reason?.body || reason?.message || String(reason),
        });
        // 410 Gone / 404 Not Found — clean up dead subscriptions
        if (sc === 404 || sc === 410) toDelete.push(subs[idx].id);
      }
    });

    if (toDelete.length > 0) {
      await supabase.from("push_subscriptions").delete().in("id", toDelete);
    }

    // deno-lint-ignore no-explicit-any
    const responseBody: any = {
      sent: successful,
      failed: failedDetails.length,
      cleaned: toDelete.length,
      total: subs.length,
    };
    if (failedDetails.length > 0) {
      responseBody.failedDetails = failedDetails;
      console.warn("send-push failures:", JSON.stringify(failedDetails));
    }

    return new Response(JSON.stringify(responseBody), {
      headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String((err as Error).message || err) }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    });
  }
});
