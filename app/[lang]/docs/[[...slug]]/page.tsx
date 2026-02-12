import { getPageImage, source } from "@/lib/source";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  PageLastUpdate,
} from "fumadocs-ui/layouts/docs/page";
import { notFound, redirect } from "next/navigation";
import { getMDXComponents } from "@/mdx-components";
import type { Metadata } from "next";
import { createRelativeLink } from "fumadocs-ui/mdx";
import { LLMCopyButton, ViewOptions } from "@/components/ai/page-actions";

import { previewMode, prodMode, safeget } from "@/lib/utils";
import { gitConfig, siteConfig } from "@/lib/repo";

import HandlingKeyboardLeftAndRight from "@/components/kb-page-flip";
import { getPageTreePeers } from "fumadocs-core/page-tree";
import { Feedback, FeedbackBlock } from "@/components/feedback/client";
import { onBlockFeedbackAction, onPageFeedbackAction } from "@/lib/github";

import { FC, ComponentProps } from "react";
import { Card, Cards } from "fumadocs-ui/components/card";
import { Callout } from "fumadocs-ui/components/callout";
// import { TypeTable } from "fumadocs-ui/components/type-table";
// import { ImageZoom } from "@/components/mdx/image-zoom";
import { ImageZoom } from "fumadocs-ui/components/image-zoom";
import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock";
// import { File, Files, Folder } from "@/components/mdx/files";
// import { Mermaid } from "@theguild/remark-mermaid/mermaid"; // pnpm install @theguild/remark-mermaid remark-math fumadocs-twoslash fumadocs-docgen rehype-katex
// // import { Mermaid } from "@/components/mdx/mermaid";
// import { InlineTOC } from "@/components/mdx/inline-toc";
// import { Wrapper } from "@/components/preview/wrapper";

// import * as Preview from '@/components/preview';
//
// function PreviewRenderer({ preview }: { preview: string }): ReactNode {
//   if (preview && preview in Preview) {
//     const Comp = Preview[preview as keyof typeof Preview];
//     return <Comp />;
//   }

//   return null;
// }

const get = (fm: any, v: string) => {
  return v in fm ? fm[v] : "";
};

// export default async function Page({
//                                      params,
//                                    }: {
//   params: Promise<{ lang: string; slug?: string[] }>;
// }) {
//   const { slug, lang } = await params;
//   // get page
//   source.getPage(slug);
//   source.getPage(slug, lang);
//   // get pages
//   source.getPages();
//   source.getPages(lang);
// }

export const revalidate = false;

const preview = previewMode ? " [Preview]" : "";

export default async function Page(
  props: PageProps<"/[lang]/docs/[[...slug]]">,
) {
  const params = await props.params;
  const page = source.getPage(params.slug, params.lang);
  if (!page) {
    if (safeget<string>(params.slug, 0, "") === "cmdr.v2") {
      params.slug?.shift();
      redirect(`../../docs/cmdr/v2/${params.slug?.join("/") || ""}`);
    }
    console.error(
      `Page not found: slug=[${params.slug}], lang=${params.lang}.`,
    );
    notFound();
  }

  // if (!page)
  //   return (
  //     <NotFound
  //       getSuggestions={async () => (params.slug ? getSuggestions(params.slug.join(' ')) : [])}
  //     />
  //   );

  // if (page.data.type === 'openapi') {
  //   const { APIPage } = await import('@/components/api-page');
  //   return (
  //     <DocsPage full>
  //       <h1 className="text-[1.75em] font-semibold">{page.data.title}</h1>

  //       <DocsBody>
  //         <APIPage {...page.data.getAPIPageProps()} />
  //       </DocsBody>
  //     </DocsPage>
  //   );
  // }

  // const { body: Mdx, toc, lastModified } = await page.data.load();

  const MDX = page.data.body;

  const lastModified =
    page.data.lastModified || get(page.data, "last_modified_at");

  if (!prodMode)
    console.log(
      `  - rendering page: ${page.url}, path: ${page.path}, abs: ${page.absolutePath}, slugs: [${page.slugs}], locale: ${page.locale}`,
    );

  // const mdxUrl = `/docs/${page.path}`; // page.absolutePath?.replace(/content\/docs\//, "");
  // const mdxUrl = /^\/docs\//.test(page.url)
  //   ? `/${params.lang}${page.url}.mdx`
  //   : `${page.url}.mdx`;
  const mdxUrl = `${page.url}.mdx`;

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      tableOfContent={{
        style: "clerk", // normal, clerk
        single: false,
      }}
      tableOfContentPopover={{}}
      breadcrumb={{
        enabled: true,
      }}
      className="max-sm:pb-16"
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-0">
        {page.data.description}
      </DocsDescription>
      <div className="flex flex-row gap-2 items-center border-b pb-6">
        <LLMCopyButton markdownUrl={`${mdxUrl}`} />
        <ViewOptions
          markdownUrl={`${mdxUrl}`}
          // update it to match your repo
          githubUrl={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/content/docs/${page.path}`}
        />
      </div>
      <DocsBody>
        {/* {page.data.preview && <PreviewRenderer preview={page.data.preview} />} */}
        <MDX
          components={getMDXComponents({
            // ...Twoslash,

            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
            blockquote: Callout as unknown as FC<ComponentProps<"blockquote">>,
            // img: (props) => <BaseImage {...(props as ImageProps)} />,
            img: (props) => <ImageZoom {...(props as any)} />,
            // HTML `ref` attribute conflicts with `forwardRef`
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            pre: ({ ref: _ref, ...props }) => (
              <CodeBlock ref={_ref} {...props}>
                <Pre>{props.children}</Pre>
              </CodeBlock>
            ),

            FeedbackBlock: ({ children, ...props }) => (
              <FeedbackBlock {...props} onSendAction={onBlockFeedbackAction}>
                {children}
              </FeedbackBlock>
            ),

            // Banner,
            // Mermaid,
            // TypeTable,
            // Wrapper,

            // DocsCategory: ({ url }) => {
            //   return <DocsCategory url={url ?? page.url} />;
            // },
            // Installation,
            // Customisation,
          })}
        />
        <h2>What is Next?</h2>
        <Cards>
          {getPageTreePeers(source.getPageTree(params.lang), "/docs").map(
            (peer) => (
              <Card key={peer.url} title={peer.name} href={peer.url}>
                {peer.description}
              </Card>
            ),
          )}
        </Cards>
      </DocsBody>
      <Feedback onSendAction={onPageFeedbackAction} />
      {lastModified && (
        <PageLastUpdate date={lastModified} className="my-8 text-right" />
      )}
      {/* <Feedback
        onSendAction={async (feedback) => {
          "use server";
          await posthog.capture("on_rate_docs", feedback);
        }}
      /> */}
      {/* <Rate
        onRateAction={async (url, feedback) => {
          "use server";
        }}
        // onRateAction={async (url, feedback) => {
        //   "use server";
        //   // const posthog = usePostHog();
        //   posthog.capture("rate_docs", feedback);
        //   // see also: https://us.posthog.com/project/130354/onboarding/web_analytics?step=install
        // }}
      />
       */}
      <HandlingKeyboardLeftAndRight />
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams("slug", "lang");
}

export async function generateMetadata(
  props: PageProps<"/[lang]/docs/[[...slug]]">,
): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug, params.lang);
  if (!page) notFound();

  return {
    // title: page.data.title,
    // title: {
    //   template: `%s | ${siteConfig.title}${preview}`,
    //   default: `${siteConfig.title}${preview}`,
    // },
    title: `${page.data.title} | ${siteConfig.title}${preview}`,
    description: page.data.description || siteConfig.desc,
    metadataBase: new URL(gitConfig.site),
    robots: {
      follow: true,
      index: true,
    },
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
      images: getPageImage(page).url,
    },
    // openGraph: {
    //   title: "My Website",
    //   description: "Welcome to my website!",
    //   url: "https://www.yourwebsite.com", // Optional, will be resolved with metadataBase
    //   images: [
    //     {
    //       url: "/og-image.jpg", // Relative URL will be resolved to absolute URL
    //       width: 1200,
    //       height: 630,
    //       alt: "My Website Open Graph Image",
    //     },
    //   ],
    // },
    // twitter: {
    //   card: "summary_large_image",
    //   title: "My Website",
    //   description: "Welcome to my website!",
    //   images: ["/twitter-image.jpg"], // Relative URL will be resolved to absolute URL
    // },
  };
}
