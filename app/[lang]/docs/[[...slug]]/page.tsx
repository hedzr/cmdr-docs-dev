import { source } from "@/lib/source";
// import {
//   DocsPage,
//   DocsBody,
//   DocsDescription,
//   DocsTitle,
//   DocsCategory,
// } from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import {
  DocsPage,
  DocsTitle,
  DocsDescription,
  DocsBody,
  DocsCategory,
} from "@/components/page";

import { openapi } from "@/lib/source";

import { metadataImage } from "@/lib/metadata";

import defaultMdxComponents from "fumadocs-ui/mdx";
import { ComponentProps, FC } from "react";
import { Callout } from "fumadocs-ui/components/callout";
import { Card, Cards } from "fumadocs-ui/components/card";
import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock";
import { Files, Folder, File } from "fumadocs-ui/components/files";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import { TypeTable } from "fumadocs-ui/components/type-table";
// import { CodeWithTabs } from "@/components/markdown/code-with-tabs";
// import { Popup, PopupContent, PopupTrigger } from "fumadocs-twoslash/ui";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
} from "@/components/ui/popover";
import { InlineTOC } from "fumadocs-ui/components/inline-toc";
import { Wrapper } from "@/components/preview/wrapper";
import { ImageZoom } from "fumadocs-ui/components/image-zoom";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { Mermaid } from "@theguild/remark-mermaid/mermaid"; // pnpm install @theguild/remark-mermaid remark-math fumadocs-twoslash fumadocs-docgen rehype-katex

import { Rate } from "@/components/rate";

// import { usePostHog } from "posthog-js/react";
import posthog from "posthog-js";

import HandlingKeyboardLeftAndRight from "@/components/kb-page-flip";

export default async function Page(props: {
  params: Promise<{ lang: string; slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug, params.lang);
  if (!page) notFound();

  const MDX = page.data.body;
  const toc = page.data.toc;
  const lastModified = page.data.lastModified;

  // const path = `apps/docs/content/docs/${page.file.path}`;
  const path = `content/docs/${page.file.path}`;
  // const preview = page.data.preview;
  // const { body: MDX, toc, lastModified } = await page.data.load();

  return (
    <DocsPage
      toc={toc}
      full={page.data.full}
      lastUpdate={lastModified}
      tableOfContent={{
        style: "clerk", // normal, clerk
        single: false,
      }}
      editOnGithub={{
        repo: "cmdr-docs",
        owner: "hedzr",
        sha: "master",
        path,
      }}
      article={{
        className: "max-sm:pb-16",
      }}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        {/* className="text-fd-foreground/80" */}
        {/*{preview ? <PreviewRenderer preview={preview} /> : null}*/}
        <MDX
          components={{
            ...defaultMdxComponents,

            // HTML `ref` attribute conflicts with `forwardRef`
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            pre: ({ ref: _ref, ...props }) => (
              <CodeBlock ref={_ref} {...props}>
                <Pre>{props.children}</Pre>
              </CodeBlock>
            ),
            // img: (props) => <BaseImage {...(props as ImageProps)} />,
            img: (props) => <ImageZoom {...(props as any)} />,

            Mermaid,
            // Popup,
            // PopupContent,
            // PopupTrigger,
            Popover,
            PopoverTrigger,
            PopoverContent,
            PopoverClose,
            TypeTable,
            // AutoTypeTable,
            Accordion,
            Accordions,
            Wrapper,
            File,
            Folder,
            Files,
            Tabs,
            Tab,
            Steps,
            Step,
            Card,
            Cards,
            InlineTOC,
            // Code,
            // CodeWithTabs,
            blockquote: Callout as unknown as FC<ComponentProps<"blockquote">>,
            APIPage: openapi.APIPage,
            DocsCategory: () => <DocsCategory page={page} from={source} />,
          }}
        />
        {/*{page.data.index ? <DocsCategory page={page} from={source} /> : null}*/}
      </DocsBody>
      <Rate onRateAction={async (url, feedback) => {"use server";}}
        // onRateAction={async (url, feedback) => {
        //   "use server";
        //   // const posthog = usePostHog();
        //   posthog.capture("rate_docs", feedback);
        //   // see also: https://us.posthog.com/project/130354/onboarding/web_analytics?step=install
        // }}
      />
      <HandlingKeyboardLeftAndRight />
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  // return {
  //   title: page.data.title,
  //   description: page.data.description,
  // };
  return metadataImage.withImage(page.slugs, {
    title: page.data.title,
    description: page.data.description,
    // icons:[page.data.icon,],
  });
}
