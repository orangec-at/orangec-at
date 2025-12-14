import type { NextConfig } from "next";
import withMDX from "@next/mdx";
import createNextIntlPlugin from "next-intl/plugin";
import path from "path";

const withNextIntl = createNextIntlPlugin("./src/i18n.ts");

const withMDXConfig = withMDX({
  extension: /\.mdx?$/,
});

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  transpilePackages: ["@/"],
  experimental: {
    externalDir: true,
  },
  webpack: (config, { isServer }) => {
    const designSrcPath = path.resolve(__dirname, "../../packages/design/src");

    // 기존 alias 보존
    const existingAlias = config.resolve.alias || {};

    config.resolve.alias = {
      ...existingAlias,
      // blog 앱 자체의 @/ 경로는 ./src로
      "@/app": path.resolve(__dirname, "./src/app"),
      "@/components": path.resolve(__dirname, "./src/components"),
      "@/lib": path.resolve(__dirname, "./src/lib"),
      "@/types": path.resolve(__dirname, "./src/types"),
      "@/styles": path.resolve(__dirname, "./src/styles"),
      "@/utils": path.resolve(__dirname, "./src/utils"),
      "@/hooks": path.resolve(__dirname, "./src/hooks"),
      "@/config": path.resolve(__dirname, "./src/config"),
      "@/i18n": path.resolve(__dirname, "./src/i18n"),
    };

    // Custom resolver plugin to handle @/ imports from design package
    const resolvePlugin = {
      apply: (resolver: any) => {
        resolver.hooks.resolve.tapAsync(
          "DesignPackageResolver",
          (request: any, resolveContext: any, callback: any) => {
            // design 패키지 내부 파일에서의 @/ import를 design 패키지로 해석
            if (
              request.context.issuer &&
              request.context.issuer.includes("/packages/design/") &&
              request.request.startsWith("@/")
            ) {
              const redirectedRequest = {
                ...request,
                request: request.request.replace("@/", `${designSrcPath}/`),
              };
              return resolver.doResolve(
                resolver.hooks.resolve,
                redirectedRequest,
                `Redirected @/ import from design package to ${redirectedRequest.request}`,
                resolveContext,
                callback
              );
            }
            callback();
          }
        );
      },
    };

    config.resolve.plugins = config.resolve.plugins || [];
    config.resolve.plugins.push(resolvePlugin);

    return config;
  },
};

export default withNextIntl(withMDXConfig(nextConfig));
