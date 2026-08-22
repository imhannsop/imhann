import type { NextConfig } from "next";

const repoName = "/imhannsop.github.io";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath: process.env.NODE_ENV === "production" ? repoName : "",
  assetPrefix: process.env.NODE_ENV === "production" ? `${repoName}/` : "",
};

export default nextConfig;