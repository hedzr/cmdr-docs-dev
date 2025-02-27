// import { DocsLayout, type DocsLayoutProps } from "fumadocs-ui/layouts/docs";
import { DocsLayout, type DocsLayoutProps } from "@/components/docs";
import type { ReactNode } from "react";
import { baseOptions, linkItems } from "../../layout.config";
import { source } from "@/lib/source";
import { baseUrl, createMetadata, site } from "@/lib/metadata";
import "katex/dist/katex.min.css";

export const metadata = createMetadata({
  metadataBase: baseUrl,
  title: {
    template: `%s | ${site.title}`,
    default: site.title,
  },
  description: site.desc,
  robots: {
    follow: true,
    index: true,
  },
  // "a command-line arguments parser and app framework with hierarchical settings supporting",

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

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>;
  children: ReactNode;
}) {
  // return (
  //   <DocsLayout tree={source.pageTree[(await params).lang]} {...baseOptions}>
  //     {children}
  //   </DocsLayout>
  // );

  const tree = source.pageTree[(await params).lang];

  const docsOptions: DocsLayoutProps = {
    ...baseOptions,
    tree: tree, // source.pageTree['zh'],
    links: [linkItems[linkItems.length - 1]],
    sidebar: {
      tabs: {
        transform(option, node) {
          const meta = source.getNodeMeta(node);
          if (!meta) return option;

          return {
            ...option,
            icon: (
              <div
                className="rounded-md border bg-gradient-to-t from-fd-background/80 p-1 shadow-md [&_svg]:size-5"
                style={{
                  color: `var(--${meta.file.dirname}-color)`,
                  backgroundColor: `color-mix(in oklab, var(--${meta.file.dirname}-color) 40%, transparent)`,
                }}
              >
                {node.icon}
              </div>
            ),
          };
        },
      },
    },
  };

  return <DocsLayout {...docsOptions}>{children}</DocsLayout>;
}
