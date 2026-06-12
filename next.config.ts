import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/collection",
        destination: "/collectie",
        permanent: true,
      },
      {
        source: "/verzending-retour",
        destination: "/shipping-returns",
        permanent: true,
      },
      {
        source: "/privacy",
        destination: "/privacy-policy",
        permanent: true,
      },
      {
        source: "/voorwaarden",
        destination: "/terms",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
