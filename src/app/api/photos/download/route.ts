import { NextRequest, NextResponse } from "next/server";

// GET /api/photos/download?url=<smugmug-image-url>&filename=<name.jpg>
//
// Server-side proxy: fetches a SmugMug-hosted image and streams it back with
// Content-Disposition: attachment so the browser saves the file instead of
// displaying it. This sidesteps the cross-origin `<a download>` issue —
// browsers ignore the download attribute on cross-origin URLs unless the
// response carries the right header from the same origin as the page.
//
// To prevent abuse as an open proxy we accept only photos.smugmug.com URLs.

const ALLOWED_HOST = "photos.smugmug.com";
const MAX_FILENAME = 200;

function sanitizeFilename(raw: string): string {
  // Strip path separators and control chars; keep unicode letters/digits.
  const cleaned = raw
    .replace(/[\\/\x00-\x1f<>:"|?*]+/g, "_")
    .replace(/\s+/g, "_")
    .slice(0, MAX_FILENAME);
  return cleaned || "photo.jpg";
}

function rfc5987Encode(s: string): string {
  // RFC 5987 — encode non-ASCII chars so non-Latin filenames survive in
  // Content-Disposition. Browsers fall back to filename*=UTF-8'' value.
  return encodeURIComponent(s)
    .replace(/['()]/g, escape)
    .replace(/\*/g, "%2A");
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  const rawName = req.nextUrl.searchParams.get("filename") ?? "photo.jpg";

  if (!url) {
    return NextResponse.json({ error: "missing 'url'" }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return NextResponse.json({ error: "invalid url" }, { status: 400 });
  }

  if (parsed.protocol !== "https:" || parsed.hostname !== ALLOWED_HOST) {
    return NextResponse.json(
      { error: `only https://${ALLOWED_HOST}/ urls are allowed` },
      { status: 400 }
    );
  }

  const upstream = await fetch(url, {
    // SmugMug serves images publicly — no auth header needed.
    headers: { Accept: "image/*" },
    cache: "no-store",
  });

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json(
      { error: `upstream ${upstream.status}` },
      { status: 502 }
    );
  }

  const contentType = upstream.headers.get("content-type") ?? "image/jpeg";
  const contentLength = upstream.headers.get("content-length");
  const filename = sanitizeFilename(rawName);

  // Use both filename= (ASCII fallback) and filename*= (RFC 5987 UTF-8)
  // for compatibility with browsers that don't understand the modern form.
  const asciiFallback = filename.replace(/[^\x20-\x7e]/g, "_");
  const disposition =
    `attachment; filename="${asciiFallback}"; filename*=UTF-8''${rfc5987Encode(filename)}`;

  const headers: Record<string, string> = {
    "Content-Type": contentType,
    "Content-Disposition": disposition,
    "Cache-Control": "private, max-age=3600",
  };
  if (contentLength) headers["Content-Length"] = contentLength;

  return new Response(upstream.body, { headers });
}
