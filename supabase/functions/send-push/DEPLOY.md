# `send-push` Edge Function — Deployment Guide

## 1. Apply database migration (one-time)

Open Supabase Dashboard → SQL Editor and run the contents of:

```
supabase/migrations/20260519_create_push_subscriptions.sql
```

This creates `push_subscriptions` with RLS so each user can manage only their own
subscriptions, and an `updated_at` trigger.

## 2. Generate VAPID keys (one-time)

```bash
npx web-push generate-vapid-keys
```

You will get a `publicKey` and `privateKey`. Save them somewhere private.

> Do **not** reuse the keys from `arico-staff-app` — those are leaked in plaintext
> inside that project's Edge Function source.

## 3. Set Edge Function secrets

Via Supabase CLI (recommended):

```bash
supabase secrets set \
  VAPID_PUBLIC_KEY=<publicKey> \
  VAPID_PRIVATE_KEY=<privateKey> \
  VAPID_SUBJECT=mailto:admin@gyeyangopen.com \
  --project-ref zgykozcoutixaobwkxru
```

Or via Dashboard → Project Settings → Edge Functions → "Manage secrets".

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are auto-injected — do not set them manually.

## 4. Set Vercel env

In Vercel → `gyeyang-open-2026` → Settings → Environment Variables, add:

- `NEXT_PUBLIC_VAPID_PUBLIC_KEY` = `<publicKey>` (the SAME public key from step 2)

Redeploy to pick it up.

## 5. Deploy the function

```bash
supabase functions deploy send-push --project-ref zgykozcoutixaobwkxru
```

## 6. Smoke test

In the deployed app, sign in as a user, open `/app/notifications`, enable push.
Then sign in as admin, create a new announcement at `/app/admin/announcements`
with "Send push notification" checked. You should receive the notification on the
subscribed device.

## Troubleshooting

- **No subscriptions in DB**: `push_subscriptions` table or RLS policy may be missing,
  or the client failed to subscribe. Check browser console for errors from
  `subscribeToPush`.
- **410 Gone responses**: expected for stale subscriptions — the function auto-cleans these.
- **`Missing VAPID keys` in function logs**: secrets were not set or the function
  was not redeployed after secret changes.
