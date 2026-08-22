import type { NextConfig } from "next";

// Use NEXT_PUBLIC_BASE_PATH at build time to allow switching off basePath when
// the site is served from a custom domain. Set to "/imhannsop" for GitHub
// Pages (no custom domain), or leave empty for root hosting.
const repoName = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath: repoName,
  assetPrefix: repoName ? `${repoName}/` : "",
};

export default nextConfig;