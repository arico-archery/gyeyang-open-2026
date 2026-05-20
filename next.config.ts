import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "www.gyeyangopen.com" },
      { protocol: "https", hostname: "www.gyeyangopen.kr" },
      { protocol: "https", hostname: "i.ytimg.com" },
      // SmugMug-hosted images for /gallery and /app/photos
      { protocol: "https", hostname: "photos.smugmug.com" },
      { protocol: "https", hostname: "media.arico.group" },
    ],
  },
};

export default nextConfig;
