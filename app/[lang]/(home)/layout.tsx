import { HomeLayout } from "fumadocs-ui/layouts/home";
import { baseOptions } from "@/lib/layout.shared";
import { redirect } from "next/navigation";

// import { baseUrl, createMetadata, site } from "@/lib/metadata";
// import { previewMode } from "@/lib/utils";
//
// const preview = previewMode ? " [Preview]" : "";
//
// export const metadata = createMetadata({
//   title: {
//     template: `%s | ${site.title}${preview}`,
//     default: `${site.title}${preview} - for our Open Projects`,
//   },
//   description: site.desc,
//   // "a command-line arguments parser and app framework with hierarchical settings supporting",
//   metadataBase: baseUrl,
//   // metadataBase: new URL('https://acme.com'),
//
//   alternates: {
//     canonical: "/",
//     languages: {
//       // "en-US": "/en-US",
//       // // "de-DE": "/de-DE",
//       // "zh-CN": "/zh-CN",
//       // "zh-TW": "/zh-TW",
//       en: "/en",
//       zh: "/cn",
//       "zh-TW": "/tw",
//     },
//   },
//   openGraph: {
//     images: "/docs-og/og-image.png",
//   },
// });

// export default function Layout({ children }: LayoutProps<'/'>) {
//   return <HomeLayout {...baseOptions()}>{children}</HomeLayout>;
// }

export default async function Layout({
  params,
  children,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  redirect("/docs");
  return <HomeLayout {...baseOptions(lang)}>{children}</HomeLayout>;
}

// import type { ReactNode } from 'react';
// import { HomeLayout } from 'fumadocs-ui/layouts/home';
// import { baseOptions } from '@/lib/layout.shared';
// export default async function Layout({
//                                        params,
//                                        children,
//                                      }: {
//   params: Promise<{ lang: string }>;
//   children: ReactNode;
// }) {
//   const { lang } = await params;
//   return <HomeLayout {...baseOptions(lang)}>{children}</HomeLayout>;
// }
