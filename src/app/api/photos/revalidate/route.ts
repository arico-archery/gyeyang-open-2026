import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";

// POST /api/photos/revalidate
// Authenticated endpoint: admin pushes the SmugMug photo cache to refresh
// immediately, without waiting for the 1-hour ISR window.
//
// Auth model: caller sends their Supabase session access_token in the
// `Authorization: Bearer <token>` header. We verify it server-side and
// check that the user's profile.role === "admin".

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) {
    return NextResponse.json({ error: "missing bearer token" }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return NextResponse.json(
      { error: "supabase env missing" },
      { status: 500 }
    );
  }

  // Per-request client carrying the user's JWT (no service role needed).
  const supabase = createClient(url, key, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData.user) {
    return NextResponse.json({ error: "invalid token" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "admin only" }, { status: 403 });
  }

  // Invalidate everything touched by /api/photos and the gallery routes.
  // Next.js 16: revalidateTag requires a CacheLifeConfig — `{ expire: 0 }`
  // forces the tagged fetch (in src/lib/smugmug.ts) to refresh on next read.
  revalidateTag("smugmug", { expire: 0 });
  revalidatePath("/gallery");
  revalidatePath("/app/photos");

  return NextResponse.json({
    ok: true,
    revalidatedAt: new Date().toISOString(),
  });
}
