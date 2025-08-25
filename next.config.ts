import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // Allow loading images from these remote hosts. `placehold.co` is used as a local placeholder.
    remotePatterns: [
      { protocol: "https", hostname: "*", port: "", pathname: "**" },
      { protocol: "http", hostname: "*", port: "", pathname: "**" },
    ],
  },
};

export default nextConfig;
