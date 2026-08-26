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
      {
        // The app's article mirror (see project_wp_rest_api_lockdown memory -
        // btcc.net's own wp-json API is now blocked/rate-limited, so both the
        // app and this page read from this GitHub-hosted mirror instead).
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/yacobwood/BTCC/**",
      },
    ],
  },
};

export default nextConfig;
