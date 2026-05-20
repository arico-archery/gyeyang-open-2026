import { NextResponse } from "next/server";
import {
  cleanAlbumName,
  listAlbumsInFolder,
  listImagesInAlbum,
  resizeSmugUrl,
  type SmugAlbum,
  type SmugImage,
} from "@/lib/smugmug";

// Shape exposed to the client. We pre-compute size variants so the
// client doesn't have to know SmugMug URL conventions.
export interface PhotoAlbum {
  albumKey: string;
  name: string;            // cleaned display name (no "01_" prefix)
  rawName: string;         // original SmugMug name (for debug)
  webUri: string;          // SmugMug page link
  imageCount: number;
  imagesLastUpdated: string;
  images: Photo[];
}

export interface Photo {
  imageKey: string;
  width: number;
  height: number;
  caption: string;
  fileName: string;
  takenAt: string;
  uploadedAt: string;
  webUri: string;          // SmugMug page (used for proxy fallback)
  thumb: string;           // ~150px grid thumbnail (Th)
  small: string;           // ~400px mobile grid (S)
  large: string;           // ~1024px desktop grid hi-DPI (XL)
  lightbox: string;        // ~1600px lightbox (X3) — sharp on most displays
  download: string;        // ~1600px source URL for downloads (X3, same URL)
}

interface PhotosResponse {
  fetchedAt: string;
  totalAlbums: number;
  totalImages: number;
  albums: PhotoAlbum[];
}

function toPhoto(img: SmugImage): Photo {
  return {
    imageKey: img.ImageKey,
    width: img.OriginalWidth,
    height: img.OriginalHeight,
    caption: img.Caption || "",
    fileName: img.FileName,
    takenAt: img.DateTimeOriginal,
    uploadedAt: img.DateTimeUploaded,
    webUri: img.WebUri,
    thumb: img.ThumbnailUrl,
    small: resizeSmugUrl(img.ThumbnailUrl, "S"),
    large: resizeSmugUrl(img.ThumbnailUrl, "XL"),
    lightbox: resizeSmugUrl(img.ThumbnailUrl, "X3"),
    download: resizeSmugUrl(img.ThumbnailUrl, "X3"),
  };
}

function sortAlbums(a: SmugAlbum, b: SmugAlbum): number {
  // Prefer numeric sort prefix ("1 Day", "2 Day", "01_…"); fall back to name.
  const ax = a.Name.match(/^(\d+)/);
  const bx = b.Name.match(/^(\d+)/);
  if (ax && bx) return parseInt(ax[1], 10) - parseInt(bx[1], 10);
  if (ax) return -1;
  if (bx) return 1;
  return a.Name.localeCompare(b.Name);
}

/** Extract image extension from original SmugMug filename, normalized. */
function extFromOriginal(name: string): string {
  const dot = name.lastIndexOf(".");
  if (dot === -1) return "jpg";
  const ext = name.slice(dot + 1).toLowerCase();
  if (ext === "jpeg") return "jpg";
  if (/^(jpg|png|gif|webp)$/.test(ext)) return ext;
  return "jpg";
}

/**
 * Rename every photo's filename to "Gyeyang Photo NN.<ext>" in the order
 * albums are listed (album sort) and photos within each album (SmugMug sort).
 * Original SmugMug filenames (e.g. KakaoTalk_20260519_*.jpg) are replaced
 * before the data ever reaches the client, so downloads use the new name.
 *
 * Padding width is auto-tuned: at least 2 digits, more if needed.
 */
function applyDisplayFilenames(albums: PhotoAlbum[], total: number): void {
  const pad = Math.max(2, String(total).length);
  let n = 0;
  for (const album of albums) {
    for (const photo of album.images) {
      n++;
      const ext = extFromOriginal(photo.fileName);
      photo.fileName = `Gyeyang Photo ${String(n).padStart(pad, "0")}.${ext}`;
    }
  }
}

export async function GET() {
  try {
    const albums = (await listAlbumsInFolder()).sort(sortAlbums);

    // Fetch images for all albums in parallel (capped at 200 each).
    const albumsWithImages = await Promise.all(
      albums.map(async (a) => {
        const { images } = await listImagesInAlbum(a.AlbumKey);
        return {
          albumKey: a.AlbumKey,
          name: cleanAlbumName(a.Name),
          rawName: a.Name,
          webUri: a.WebUri,
          imageCount: a.ImageCount,
          imagesLastUpdated: a.ImagesLastUpdated,
          images: images.map(toPhoto),
        } satisfies PhotoAlbum;
      })
    );

    const totalImages = albumsWithImages.reduce(
      (sum, a) => sum + a.images.length,
      0
    );

    // Rename photos to "Gyeyang Photo 01.jpg, 02.jpg, …" before returning.
    applyDisplayFilenames(albumsWithImages, totalImages);

    const body: PhotosResponse = {
      fetchedAt: new Date().toISOString(),
      totalAlbums: albumsWithImages.length,
      totalImages,
      albums: albumsWithImages,
    };

    return NextResponse.json(body, {
      headers: {
        // Vercel CDN caches 1h, serves stale for 24h while revalidating.
        "Cache-Control":
          "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (err) {
    console.error("[api/photos] error:", err);
    return NextResponse.json(
      { error: "Failed to fetch SmugMug photos", detail: String(err) },
      { status: 500 }
    );
  }
}
