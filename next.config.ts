import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // DB接続状態をクライアントコンポーネントでも参照可能にする
  env: {
    NEXT_PUBLIC_HAS_DATABASE: process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL ? "true" : "",
  },
};

export default nextConfig;
