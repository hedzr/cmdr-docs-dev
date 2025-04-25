import { source } from "@/lib/source";
import { prodMode } from "@/lib/utils";
import { notFound } from "next/navigation";
// import {
//   DocsPage,
//   DocsTitle,
//   DocsDescription,
//   DocsBody,
//   DocsCategory,
// } from "@/components/page";
import {
  DocsPage,
  DocsTitle,
  DocsDescription,
  DocsBody,
  DocsPageProps,
  withArticle,
} from "fumadocs-ui/page";

import { openapi } from "@/lib/source";
import { metadataImage } from "@/lib/metadata";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { Callout } from "@/components/callout";
import { Card, Cards } from "@/components/card";
import { CodeBlock, Pre } from "@/components/codeblock";
import { File, Files, Folder } from "@/components/files";
import { Tab, Tabs } from "@/components/tabs";
import { Accordion, Accordions } from "@/components/accordion";
import { TypeTable } from "@/components/type-table";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { InlineTOC } from "@/components/inline-toc";
import { Wrapper } from "@/components/preview/wrapper";
import { ImageZoom } from "@/components/image-zoom";
import { Step, Steps } from "@/components/steps";
import { Mermaid } from "@theguild/remark-mermaid/mermaid"; // pnpm install @theguild/remark-mermaid remark-math fumadocs-twoslash fumadocs-docgen rehype-katex
import { ComponentProps, FC } from "react";
import HandlingKeyboardLeftAndRight from "@/components/kb-page-flip";

import { Rate } from "@/components/rate";
import { APIPage } from "fumadocs-openapi/ui";
import { AutoTypeTable } from 'fumadocs-typescript/ui';
import {getPageTreePeers} from "fumadocs-core/server";
import {createGenerator} from "fumadocs-typescript";

const get = (fm: any, v: string) => {
  return v in fm ? fm[v] : "";
};

export default async function Page(props: {
  params: Promise<{ lang: string; slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug, params.lang);
  if (!page) notFound();

  // const { body: MDX, toc, lastModified } = await page.data.load();
  // page.data.tags
  const MDX = page.data.body;
  const toc = page.data.toc;
  const lastModified =
    page.data.lastModified || get(page.data, "last_modified_at");

  // const path = `apps/docs/content/docs/${page.file.path}`;
  const path = `content/docs/${page.file.path}`;
  // const preview = page.data.preview;
  // const { body: MDX, toc, lastModified } = await page.data.load();

  if (!prodMode)
    console.log(`--- docs page ${params.lang} / ${params.slug} ---`);

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
        repo: "cmdr-docs-dev",
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
      <DocsBody
        className={`prose-zinc1 dark:prose-invert md:prose-md lg:prose-lg prose-headings:a:underline:none w-[85vw] sm:w-full sm:mx-auto prose-code:text-sm prose-code:leading-6 prose-headings:scroll-m-20 prose-code:font-code prose-code:p-1 prose-code:rounded-md prose-pre:border pt-2 prose-code:before:content-none prose-code:after:content-none !min-w-full prose-img:rounded-md prose-img:border`}
      >
        {/* className="text-fd-foreground/80"

        dark:prose-invert prose-code:font-code dark:prose-code:bg-${ref}-900 dark:prose-pre:bg-${ref}-800 prose-code:bg-${ref}-100 prose-pre:bg-${ref}-100 prose-headings:scroll-m-20 w-[85vw] sm:w-full sm:mx-auto prose-code:text-sm prose-code:leading-6 dark:prose-code:text-${base}-300 prose-code:text-${ref}-700 prose-code:p-1 prose-code:rounded-md prose-pre:border pt-2 prose-code:before:content-none prose-code:after:content-none !min-w-full prose-img:rounded-md prose-img:border

        */}
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
            // Wrapper,
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
            // blockquote: Callout as unknown as FC<ComponentProps<"blockquote">>,
            // APIPage: openapi.APIPage,
            // DocsCategory: () => <DocsCategory page={page} from={source} />,
            AutoTypeTable: (props) => (
              <AutoTypeTable generator={generator} {...props} />
            ),
            Wrapper,
            blockquote: Callout as unknown as FC<ComponentProps<'blockquote'>>,
            APIPage: (props) => <APIPage {...openapi.getAPIPageProps(props)} />,
            DocsCategory: ({ url }) => {
              return <DocsCategory url={url ?? page.url} locale={params.lang} />;
            },
            // UiOverview,

            // ...(await import('@/content/docs/ui/components/tabs.client')),
            // ...(await import('@/content/docs/ui/theme.client')),
          }}
        />
        {/*{page.data.index ? <DocsCategory page={page} from={source} /> : null}*/}
      </DocsBody>
      <Rate
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
      <HandlingKeyboardLeftAndRight />
    </DocsPage>
  );
}

const generator = createGenerator();

function DocsCategory({ url, locale }: { url: string; locale: string }) {
  return (
    <Cards>
      {getPageTreePeers(source.getPageTree(locale), url).map((peer) => (
        <Card key={peer.url} title={peer.name?.toLocaleString()} href={peer.url}>
          {peer.description}
        </Card>
      ))}
    </Cards>
  );
}

export async function generateStaticParams() {
  return [...source.generateParams()];
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[]; lang: string }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug, params.lang);
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
