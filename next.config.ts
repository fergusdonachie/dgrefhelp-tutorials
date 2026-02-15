import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // We'll render MDX content server-side using next-mdx-remote (RSC),
  // so we don't need bundler-level .mdx loaders.
};

export default nextConfig;
