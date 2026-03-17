import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "btcc.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.btcc.net",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
