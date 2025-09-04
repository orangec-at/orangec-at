import type { NextConfig } from "next";
import withMDX from "@next/mdx";

const withMDXConfig = withMDX({
  extension: /\.mdx?$/,
});

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
};

export default withMDXConfig(nextConfig);
