import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/backend/:path*",
        destination: "http://localhost:8000/api/:path*",
      },
      {
        source: "/api/proxy/:path*",
        destination: "https://neuralflow-backend.vercel.app/api/:path*",
      },
    ];
  },
};

export default nextConfig;
