import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  outputFileTracingIncludes: {
    "/api/sanity/convert-gif": ["./node_modules/ffmpeg-static/**/*"],
  },
};

export default nextConfig;
