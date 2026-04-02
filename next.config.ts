import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: [
    "preview-chat-86bdedab-b153-487f-8ca9-4969afeb6dcf.space.z.ai",
    ".space.z.ai",
  ],
};

export default nextConfig;
