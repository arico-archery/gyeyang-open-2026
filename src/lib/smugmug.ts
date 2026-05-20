// SmugMug API v2 client (read-only, public data).
//
// We use the `?APIKey=` query-param auth flavor — no OAuth signing needed
// for public album/image reads. Custom domain `media.arico.group` is the
// public face; we hit the same data via `api.smugmug.com`.
//
// Source of truth for IDs:
//   - Nickname:        `arico`
//   - Root folder:     /Gyeyang-Open-Competition/2026-GyeyangOpen  (NodeID zsnthS)
//   - Public album:    AlbumKey hqJS8f   ("Upload Gallay (Guest)")
//
// All public data is cached server-side for `CACHE_REVALIDATE_SEC` (1 hour).
// Use `revalidatePath('/gallery')` from the admin UI for instant refresh.

const API_BASE = "https://api.smugmug.com/api/v2";
const CACHE_REVALIDATE_SEC = 60 * 60; // 1 hour

function env(key: string, fallback?: string): string {
  const v = process.env[key];
  if (v && v.length > 0) return v;
  if (fallback !== undefined) return fallback;
  throw new Error(`Missing env var: ${key}`);
}

function apiUrl(path: string, params?: Record<string, string | number>): string {
  const url = new URL(API_BASE + path);
  url.searchParams.set("APIKey", env("SMUGMUG_API_KEY"));
  url.searchParams.set("_accept", "application/json");
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

async function smugFetch<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: CACHE_REVALIDATE_SEC, tags: ["smugmug"] },
  });
  if (!res.ok) {
    throw new Error(`SmugMug ${res.status} ${res.statusText} @ ${url}`);
  }
  return res.json() as Promise<T>;
}

// ─── Types (only the fields we use) ──────────────────────────────────

export interface SmugAlbum {
  AlbumKey: string;
  NodeID: string;
  Name: string;            // e.g. "Upload Gallay (Guest)"
  NiceName: string;        // e.g. "Upload-Gallay" (URL-safe slug)
  UrlPath: string;         // e.g. "/Gyeyang-Open-Competition/2026-GyeyangOpen/Upload-Gallay"
  WebUri: string;          // e.g. "https://media.arico.group/.../Upload-Gallay"
  Description: string;
  ImageCount: number;
  ImagesLastUpdated: string;
  SecurityType: string;    // "None" = public, "Password" = locked
}

export interface SmugImage {
  ImageKey: string;
  FileName: string;
  Caption: string;
  Title: string;
  Format: string;
  OriginalWidth: number;
  OriginalHeight: number;
  DateTimeOriginal: string;
  DateTimeUploaded: string;
  ThumbnailUrl: string;   // size code "Th" — we derive other sizes from this
  WebUri: string;          // SmugMug photo page
  IsVideo: boolean;
}

interface FolderAlbumsResponse {
  Response: { Album?: SmugAlbum[] };
}

interface AlbumImagesResponse {
  Response: {
    AlbumImage?: SmugImage[];
    Pages?: { Total: number; Count: number; Start: number };
  };
}

// ─── Public API ──────────────────────────────────────────────────────

/** List PUBLIC albums (SecurityType === "None") with at least 1 image, in a folder. */
export async function listAlbumsInFolder(folderPath?: string): Promise<SmugAlbum[]> {
  const nickname = env("SMUGMUG_NICKNAME");
  const folder = folderPath ?? env("SMUGMUG_ROOT_FOLDER");
  const url = apiUrl(`/folder/user/${nickname}/${folder}!albums`);
  const json = await smugFetch<FolderAlbumsResponse>(url);
  const albums = json.Response?.Album ?? [];
  return albums.filter(
    (a) => a.SecurityType === "None" && (a.ImageCount ?? 0) > 0
  );
}

/** List images in an album. Paginated; default returns up to 200. */
export async function listImagesInAlbum(
  albumKey: string,
  opts: { count?: number; start?: number } = {}
): Promise<{ images: SmugImage[]; total: number }> {
  const { count = 200, start = 1 } = opts;
  const url = apiUrl(`/album/${albumKey}!images`, { count, start });
  const json = await smugFetch<AlbumImagesResponse>(url);
  return {
    images: (json.Response?.AlbumImage ?? []).filter((i) => !i.IsVideo),
    total: json.Response?.Pages?.Total ?? 0,
  };
}

/**
 * Derive a different-sized image URL from a SmugMug thumbnail URL.
 *
 * SmugMug URL pattern:
 *   https://photos.smugmug.com/<path>/i-<key>/0/<SIZE>/<filename>-<SIZE>.jpg
 *
 * Replace `<SIZE>` segment with one of: Ti Th S M L XL X2 X3 X4 X5 O.
 *
 *   Th = ~150px (default thumbnail returned by API)
 *   M  = ~600px (mobile lightbox)
 *   XL = ~1024px (desktop grid hi-DPI)
 *   X2 = ~1280px (desktop lightbox)
 *   X3 = ~1600px (4K display)
 */
export function resizeSmugUrl(thumbnailUrl: string, size: SmugSize): string {
  if (size === "Th") return thumbnailUrl;
  // Match: /0/Th/...-Th.<ext>
  return thumbnailUrl
    .replace(/\/0\/Th\//, `/0/${size}/`)
    .replace(/-Th\.(jpg|jpeg|png)$/i, `-${size}.$1`);
}

export type SmugSize = "Ti" | "Th" | "S" | "M" | "L" | "XL" | "X2" | "X3" | "X4" | "X5";

/** Strip leading "01_", "02_" sort-order prefix from album names. */
export function cleanAlbumName(name: string): string {
  return name.replace(/^\d{1,2}[_.\-]\s*/, "").trim();
}
