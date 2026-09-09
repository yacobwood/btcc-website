import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/yacobwood/BTCC/**",
      },
      {
        // Gallery photos - hotlinked from BTCC's own public Supabase Storage
        // bucket, same host + pattern the shipped mobile app already uses.
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        // Brands Hatch GP's circuit hero photo is hosted directly by MSV
        // (Motorsport Vision, the venue's own operator) in tracks.json,
        // unlike every other circuit's already-mirrored imageUrl - a known,
        // previously-solved gap (see project_circuit_guide_seo_pages memory).
        // Legitimate to hotlink: the venue operator's own official photo of
        // its own venue, not third-party or competitor content.
        protocol: "https",
        hostname: "images.msv.com",
      },
    ],
  },
};

export default nextConfig;
