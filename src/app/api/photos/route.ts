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
  webUri: string;          // SmugMug page for "원본 보기"
  thumb: string;           // ~150px grid thumbnail (Th)
  small: string;           // ~400px mobile grid (S)
  large: string;           // ~1024px desktop grid hi-DPI (XL)
  lightbox: string;        // ~1280px lightbox (X2)
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
    lightbox: resizeSmugUrl(img.ThumbnailUrl, "X2"),
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
