import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  output: "export",
  trailingSlash: true,
  // GitHub 项目站点位于仓库子路径；本地开发继续使用根路径。
  basePath: process.env.GITHUB_PAGES === "true" ? "/codenow-starter" : "",
};

export default nextConfig;
