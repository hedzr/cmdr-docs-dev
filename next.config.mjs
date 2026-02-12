import { createMDX } from "fumadocs-mdx/next";
import { fileURLToPath } from "node:url";
import path from "node:path";
import createWithVercelToolbar from "@vercel/toolbar/plugins/next";

const shouldInjectToolbar = process.env.NODE_ENV === "development";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,

  serverExternalPackages: ["typescript", "twoslash"],

  // i18n: {
  //   locales: ["zh-cn", "zh-tw", "en"],
  //   defaultLocale: "zh-cn",
  // },

  async rewrites() {
    return [
      {
        source: "/:locale/docs/:path*.mdx",
        destination: "/:locale/llms.mdx/docs/:path*",
        locale: false,
      },
    ];
  },

  // serverRuntimeConfig: {
  //   // Will only be available on the server side
  //   mySecret: 'secret',
  //   secondSecret: process.env.SECOND_SECRET, // Pass through env variables
  // },
  // publicRuntimeConfig: {
  //   // Will be available on both server and client
  //   staticFolder: '/static',
  // },

  // serverRuntimeConfig: {
  //   __PROJECT_ROOT: process.cwd(), // = '/vercel/path0' (= process.cwd())
  //   __filename: fileURLToPath(import.meta.url),
  //   __dirname: path.dirname(fileURLToPath(import.meta.url)),
  //   RUNTIME_ROOT: path.dirname(fileURLToPath(import.meta.url)), // = '/var/task/.next/server/chunks'
  //   PROJECT_ROOT: process.cwd(),
  //
  //   mySecret: "secret",
  //   // secondSecret: process.env.SECOND_SECRET,
  // },

  devIndicators: shouldInjectToolbar ? { position: "bottom-right" } : false,
};

const withVercelToolbar = createWithVercelToolbar(config);

// export default withVercelToolbar(withMDX);

export default withVercelToolbar(
  withMDX(
    config ||
      (config.output !== "export" && shouldInjectToolbar
        ? {
            optimizeFonts: false,
            images: { unoptimized: true },
          }
        : null),
  ),
);
