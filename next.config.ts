import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["localhost", "practice-zzingo.net"],
  },
  output: "standalone",
};

export default nextConfig;
