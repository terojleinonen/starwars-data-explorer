import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  outputFileTracingIncludes: { "/*": ["./data/archive.sqlite"] },
};

export default nextConfig;
