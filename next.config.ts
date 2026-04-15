import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
  // Mark optional peer dependencies as external so the build doesn't fail
  // when they are not installed (e.g. tesseract.js when OCR_PROVIDER=mock)
  serverExternalPackages: ["tesseract.js"],
};

export default nextConfig;
