// import { withContentCollections } from '@content-collections/next';
import { createMDX } from "fumadocs-mdx/next";
import createBundleAnalyzer from "@next/bundle-analyzer";
import {fileURLToPath} from "node:url";
import path from "path";

const withAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const withMDX = createMDX();

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
const __projectRoot = process.cwd();

// /** @type {import('next').NextConfig} */
// const config = {
//   reactStrictMode: true,
// };
//
// export default withMDX(config);

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,

  serverRuntimeConfig: {
    __PROJECT_ROOT: __projectRoot, // = '/vercel/path0' (= process.cwd())
    PROJECT_ROOT: path.dirname(path.dirname(path.dirname(__dirname))),
    RUNTIME_ROOT: __dirname, // = '/var/task/.next/server/chunks'

    mySecret: "secret",
    secondSecret: process.env.SECOND_SECRET,
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    staticFolder: "/public",
  },

  // logging: false,
  logging: {
    fetches: {
      fullUrl: true,
      hmrRefreshes: true,
      // // incomingRequests: false,
      // incomingRequests: {
      //   ignore: [/\api\/v1\/health/],
      // },
    },
  },

  // output: "export",

  // 可选：将链接 `/me` 改为 `/me/`，并生成 `/me.html` -> `/me/index.html`
  trailingSlash: true,

  // 可选：阻止自动 `/me` -> `/me/`，而是保留 `href`
  // skipTrailingSlashRedirect: true,

  // 可选：更改输出目录 `out` -> `dist`
  // distDir: 'dist',

  // https://github.com/hashicorp/next-mdx-remote?tab=readme-ov-file#installation
  // for: mdx Error: A React Element from an older version of React was rendered
  transpilePackages: ["next-mdx-remote"],

  // https://nextjs.org/docs/app/building-your-application/optimizing/memory-usage
  // https://nextjs.org/docs/app/building-your-application/optimizing/package-bundling
  //
  // To anlysis the packing memory usage and generate a report,
  // run then command at local shell:
  //    $ export NODE_OPTIONS=--max_old_space_size=1024
  //    $ ANALYZE=true pnpm build --experimental-debug-memory-usage
  experimental: {
    optimizePackageImports: ["icon-library"],
    webpackMemoryOptimizations: true,
  },
  // disable static analysis
  // https://nextjs.org/docs/app/building-your-application/optimizing/memory-usage#disable-static-analysis
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  serverExternalPackages: [
    "ts-morph",
    "typescript",
    "oxc-transform",
    "@shikijs/twoslash",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "**",
      },
    ],
    unoptimized: true,
    // domains: [
    //   "images.unsplash.com",
    //   "avatars.githubusercontent.com",
    //   "raw.githubusercontent.com",
    //   "github.com",
    //   "cdn.jsdelivr.net",
    //   "upload.wikimedia.org","communities.vmware.com",
    // ],
  },
  // images: {
  //   unoptimized: true,
  //   remotePatterns: [
  //     {
  //       protocol: 'https',
  //       hostname: 'avatars.githubusercontent.com',
  //       port: '',
  //     },
  //   ],
  // },
  // async redirects() {
  //   return [
  //     {
  //       source: '/docs/ui/blocks/layout',
  //       destination: '/docs/ui/layouts/docs',
  //       permanent: true,
  //     },
  //     {
  //       source: '/docs/ui/blocks/:path*',
  //       destination: '/docs/ui/layouts/:path*',
  //       permanent: true,
  //     },
  //   ];
  // },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  // disable webpack cache,
  // https://nextjs.org/docs/app/building-your-application/optimizing/memory-usage#disable-webpack-cache
  webpack: (
    config,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    if (config.cache && !dev) {
      config.cache = Object.freeze({
        type: "memory",
      });
    }

    // // HookWebpackError: .../my-fuma/static/css/fb5ee875f83d1deb.css:2:58850: Unclosed block
    // if (!dev) {
    //   if (!config.optimization) {
    //     config.optimization = {};
    //   }
    //   config.optimization.minimize = false;
    //   config.optimization.minimizer = [];
    //   // delete config.optimization.['mini'];
    // }

    // if (isServer) {
    //   config.externals = {
    //     ...config.externals,
    //     'oxc-transform': 'commonjs oxc-transform',
    //   };
    // }
    // Important: return the modified config
    return config;
  },
};

// export default withMDX(config);
export default withAnalyzer(
  withMDX(
    // withContentCollections(
    config ||
      (config.output === "export"
        ? {
            optimizeFonts: false,
            images: { unoptimized: true },
            // devIndicators: {
            //   appIsrStatus: true,
            //   buildActivityPosition: "bottom-right",
            // },
          }
        : null)
    // )
  )
);
