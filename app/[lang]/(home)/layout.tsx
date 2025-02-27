import type { ReactNode } from "react";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { baseOptions } from "../../layout.config";

import { baseUrl, createMetadata, site } from "@/lib/metadata";

export const metadata = createMetadata({
  title: {
    template: "%s | " + site.title + " news",
    default: site.title + " news",
  },
  description: site.desc,
  // "a command-line arguments parser and app framework with hierarchical settings supporting",
  metadataBase: baseUrl,

  // metadataBase: new URL('https://acme.com'),
  alternates: {
    canonical: "/",
    languages: {
      // "en-US": "/en-US",
      // // "de-DE": "/de-DE",
      // "zh-CN": "/zh-CN",
      // "zh-TW": "/zh-TW",
      en: "/en",
      zh: "/cn",
      "zh-TW": "/tw",
    },
  },
  openGraph: {
    images: "/docs-og/og-image.png",
  },
});

export default function Layout({ children }: { children: ReactNode }) {
  return <HomeLayout {...baseOptions}>{children}</HomeLayout>;
}
