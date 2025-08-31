import { Metadata } from "next";
import { blog, openapi, source } from "@/lib/source";
import {
  formatDate2,
  isFieldValid,
  prodMode,
  safe,
  safeget,
} from "@/lib/utils";
import { createMetadata } from "@/lib/metadata";
import { i18n, lang2iso } from "@/lib/i18n";
import { notFound } from "next/navigation";
import { ComponentProps, FC, type HTMLAttributes, Suspense } from "react";
import { blogPageProps } from "@/lib/types";
import { filterPosts, getPages, sortPages } from "../util";
import { Page } from "fumadocs-core/source";

import defaultMdxComponents from "fumadocs-ui/mdx";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { A, Control } from "./page.client";
import { Callout } from "@/components/callout";
import { Card, Cards } from "@/components/card";
import { CodeBlock, Pre } from "@/components/codeblock";
import { File, Files, Folder } from "@/components/files";
import { Tab, Tabs } from "@/components/tabs";
import { Accordion, Accordions } from "@/components/accordion";
import { TypeTable } from "@/components/type-table";
// import { Typography } from "@/components/typography";
// import { buttonVariants1 } from "@/components/ui/button1";
// import { LoaderOutput, MetaData, Page } from "fumadocs-core/source";
// import { BaseCollectionEntry, MarkdownProps } from "fumadocs-mdx/config";
// import { objectOutputType, ZodTypeAny } from "zod";
// import { buttonVariants } from "@/components/ui/button";
// import { CodeWithTabs } from "@/components/markdown/code-with-tabs";
// import { Popup, PopupContent, PopupTrigger } from "fumadocs-twoslash/ui";
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
import { DocsCategory } from "@/components/page";
import {
  TOCItems,
  TocPopoverContent,
  TocPopoverTrigger,
  TOCScrollArea,
} from "@/components/layout/toc";
import ClerkTOCItems from "@/components/layout/toc-clerk";
import {
  BlogBackToListButton,
  BlogTagButton,
  FooterNoCache,
} from "./page.client";
import { TocPopoverHeader } from "@/page.client";
import { buttonVariants1 } from "@/components/ui/button1";
import HandlingKeyboardLeftAndRight from "@/components/kb-page-flip";
import { ArrowUp } from "lucide-react";

export const dynamic = "force-static";
// export const dynamic = "force-dynamic";

export async function generateMetadata(props: {
  params: Promise<{ slug: string; lang: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = blog.getPage([params.slug], params.lang);

  if (!page) notFound();

  const description =
    (page.data.description || page.data.excerpt) ??
    "The library for building documentation sites";

  return createMetadata(
    // metadataImage.withImage(page.slugs, {
    //   title: page.data.title,
    //   description,
    //   openGraph: {
    //     url: `/docs-sg/${page.slugs.join("/")}`,
    //   },
    // }),
    {
      title: page.data.title,
      description: description,
    },
  );
}

export function generateStaticParams(): { slug: string }[] {
  // // return source.generateParams();
  // const ret = blog.getPages().map((page) => ({
  //   lang: page.locale,
  //   slug: page.slugs.join("/"),
  // }));
  // console.log(`generateStaticPages()`, ret, ret.length);
  // return ret;

  // fixed ENOENT `/varccl/path0/content/blog/,,,`
  return blog.getPages().map((page) => ({
    lang: page.locale,
    slug: page.slugs.join("/"),
  }));
}

// type PageProps = {
//   params: { slug: string };
// };
//
// export async function generateMetadata(props: {
//   params: Promise<{ slug: string }>;
// }) {
//   const params = await props.params;
//   const res = await getBlogForSlug(params.slug);
//   if (!res) return null;
//   const { frontmatter } = res;
//   return {
//     title: frontmatter.title,
//     description: frontmatter.description,
//   };
// }
//
// export async function generateStaticParams() {
//   const val = await getAllBlogStaticPaths();
//   if (!val) return [];
//   return val.map((it) => ({ slug: it }));
// }
//
// export default function page({
//   params,
//   searchParams,
// }: {
//   params: { slug: string }
//   searchParams: { [key: string]: string | string[] | undefined }
// }) {
// }

// const tocOptions = {
//   style: "clerk", // normal, clerk
// };

const tocPopoverOptions = {
  style: "clerk", // normal, clerk
  single: false,
};
const useInlineTOC = false;

const calcPrevAndNextPost = true;

export default async function BlogPage(props: {
  params: Promise<{ slug: string; lang: string }>;
  // searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await props.params;
  const lang = params.lang;

  const page = blog.getPage([params.slug], lang);
  if (!page) {
    console.log(`--- not found： ${params.slug}, ${lang}`);
    notFound();
  }

  // const sp = await props.searchParams;
  const fm = page.data;
  if (!prodMode) console.log(`--- blog page ${lang} / ${params.slug} ----`);
  const { body: Mdx, toc, lastModified } = await fm.load();
  // const Mdx = page.data.body;
  // const toc = page.data.toc;
  // const lastModified =
  //   page.data.lastModified || get(page.data, "last_modified_at");
  // console.log(`--- blog page ${params} 1 ----`);
  const { tags, categories } = calcTags(fm);
  let lma: string =
    lastModified || get(fm, "last_modified_at") || get(fm, "lastModifiedAt");

  let pageProps: prevNextProps = { prevNumber: 1, nextNumber: 1 };
  if (calcPrevAndNextPost) {
    const perPage = 7;
    const query = "";
    // const { currentPage, perPage } = await getPageNumber();
    pageProps = calcPrevNext(lang, perPage, page, query);
  }

  // @ts-ignore
  return (
    <>
      <div
        className="container rounded-xl border py-12 md:px-8"
        style={{
          backgroundColor: "black",
          backgroundImage: [
            "linear-gradient(140deg, hsla(274,94%,54%,0.3), transparent 50%)",
            "linear-gradient(to left top, hsla(260,90%,50%,0.8), transparent 50%)",
            "radial-gradient(circle at 100% 100%, hsla(240,100%,82%,1), hsla(240,40%,40%,1) 17%, hsla(240,40%,40%,0.5) 20%, transparent)",
          ].join(", "),
          backgroundBlendMode: "difference, difference, normal",
        }}
      >
        <h1
          className={`mb-2 text-3xl font-bold text-white ${
            safeget(page.data, "draft", false) ? "line-through italic" : ""
          }`}
        >
          {page.data.title}
        </h1>
        <p className="mb-4 text-white/80">{page.data.description}</p>
        <Suspense>
          <BlogBackToListButton lang={lang} /> |{" "}
        </Suspense>
        <Link
          href="/"
          className={buttonVariants1({ size: "sm", variant: "secondary" })}
        >
          <span className="top">Site</span>
        </Link>
      </div>
      <article
        className={`container blog flex flex-col px-0 py-8 lg:flex-row lg:px-4min-w-0 prose-zinc1 dark:prose-invert md:prose-md lg:prose-lg prose-headings:a:underline:none w-[85vw] sm:w-full sm:mx-auto prose-code:text-sm prose-code:leading-6 prose-headings:scroll-m-20 prose-code:font-code prose-code:p-1 prose-code:rounded-md prose-pre:border pt-2 prose-code:before:content-none prose-code:after:content-none !min-w-full prose-img:rounded-md prose-img:border`}
        // prose md:prose-md lg:prose-lg prose-${base} dark:prose-invert dark:prose-code:bg-${ref}-900 dark:prose-pre:bg-${ref}-900 prose-code:bg-${ref}-100 prose-pre:bg-${ref}-100 dark:prose-code:text-${base}-300 prose-code:text-${ref}-700
      >
        <div className="min-w-0 flex-1 p-4">
          {useInlineTOC ? (
            <InlineTOC items={toc} />
          ) : (
            <TocPopoverHeader>
              <TocPopoverTrigger className="w-full" items={toc} />
              <TocPopoverContent>
                {safeget(tocPopoverOptions, "header", <></>)}
                <TOCScrollArea isMenu>
                  {tocPopoverOptions.style === "clerk" ? (
                    <ClerkTOCItems items={toc} />
                  ) : (
                    <TOCItems items={toc} />
                  )}
                </TOCScrollArea>
                {safeget(tocPopoverOptions, "footer", <></>)}
              </TocPopoverContent>
            </TocPopoverHeader>
          )}
          <A name={"top-of-page"} />
          <Mdx
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
              //     File,
              //   Folder,
              // Files,
              // Tabs,
              // Tab,
              Steps,
              Step,
              Card,
              Cards,
              InlineTOC,
              // Code,
              // CodeWithTabs,
              blockquote: Callout as unknown as FC<
                ComponentProps<"blockquote">
              >,
              // APIPage: openapi.APIPage,
              DocsCategory: () => <DocsCategory page={page} from={source} />,

              File,
              Files,
              Folder,
              Tabs,
              Tab,
            }}
          />
          {calcPrevAndNextPost ? (
            <Suspense>
              <FooterNoCache lang={lang} {...pageProps} />
            </Suspense>
          ) : (
            <></>
          )}
          <HandlingKeyboardLeftAndRight />
        </div>

        <div className="flex flex-col gap-4 border-l p-4 text-sm lg:w-[250px]">
          <div>
            <p className="mb-1 text-fd-muted-foreground">Written by</p>
            <div className="font-medium blog-authors">
              {/* {page.data.author} */}
              {isFieldValid(fm, "authors") ? (
                <AuthorCards authors={safeget(fm, "authors", [])} />
              ) : isFieldValid(fm, "author") ? (
                <AuthorCard author={fm.author} />
              ) : (
                <AuthorCard
                  author={{
                    username: "hedzr",
                    avatar: "",
                    handle: "",
                    handleUrl: "",
                  }}
                />
              )}
            </div>
          </div>
          <div>
            <p className="mb-1 text-sm text-fd-muted-foreground">Post At</p>
            <p className="font-medium">
              {formatDate2(page.data.date || "", lang2iso[lang])}
              {/* {new Date(page.data.date ?? page.file.name).toDateString()} */}
            </p>
            <p className="mb-1 text-sm text-fd-muted-foreground">
              Last Updated At
            </p>
            <p className="font-medium">
              {/* <div id="last-modified" className="my-4 text-sm text-zinc-400"> */}
              {formatDate2(lma, lang2iso[lang])}
            </p>
          </div>

          <div className="mt-4">
            <div id="blog-tail-row">
              <div id="blog-categories" className="mr-4 mb-4">
                <div className="inline -m-1">
                  {categories.map((it) => {
                    return (
                      <span
                        className="rounded gap-2 p-2 py-1 m-1 border-1 border-zinc-400 text-sm text-zinc-900 bg-zinc-500"
                        key={it}
                      >
                        {it}
                      </span>
                    );
                  })}
                </div>
              </div>
              <div id="blog-tags" className="mr-4 mb-4">
                <div className="inline -m-1">
                  <Suspense>
                    {tags.map((it) => {
                      return <BlogTagButton tag={it} key={it} lang={lang} />;
                    })}
                  </Suspense>
                </div>
              </div>
            </div>
          </div>

          <Control url={page.url} />
        </div>

        <div className="fixed bottom-4 right-8 lg:right-[250px] shrink-0 overflow-hidden rounded-full items-center justify-center">
          {/*  <!--suppress HtmlUnknownAnchorTarget --> */}
          <Link href="#top-of-page" className="">
            <ArrowUp className="w-10 h-10" />
          </Link>
        </div>
      </article>

      <div
        id="tip-kb"
        className="mr-4 mb-4 disabled m-full text-sm text-zinc-600"
      >
        <div className="m-auto">
          <kbd>Meta-Up Arrow</kbd> to back to list page.
          <kbd>Left/Right Arrow</kbd> to go to previous/next post.
        </div>
      </div>
    </>
  );
}

type AuthorT = {
  username?: string;
  name?: string;
  avatar?: string;
  picture?: string;
  handle?: string;
  handleUrl?: string;
};

function AuthorCards({ authors }: { authors: AuthorT[] }) {
  return (
    <div className="flex items-center gap-8 flex-wrap">
      {authors.map((author) => {
        return (
          <AuthorCardItem
            author={author}
            key={author.username || author.name || "(noname)"}
          />
        );
      })}
    </div>
  );
}

function AuthorCard({
  author,
}: {
  author: AuthorT | AuthorT[] | string | undefined;
}) {
  if (typeof author === "undefined") {
    return <></>;
  }
  if (Array.isArray(author)) {
    return <AuthorCards authors={author} />;
  }
  if (typeof author === "string") {
    author = { username: author };
  }
  return (
    <div className="flex items-center gap-8 flex-wrap">
      <AuthorCardItem
        author={author}
        key={author.username || author.name || "(noname)"}
      />
    </div>
  );
}

export function AuthorCardItem({
  author,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  author: AuthorT;
  key?: string;
}) {
  let name = author.username || author.name || "(noname)";
  return (
    // @ts-ignore
    <Link
      href={safe(author.handleUrl)}
      className="flex items-center gap-2"
      {...props}
    >
      <Avatar className="w-10 h-10">
        <AvatarImage src={author.avatar || author.picture} />
        <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="">
        <p className="text-sm font-medium">{name}</p>
        {author.handle ? (
          <p className="font-code text-[13px] text-muted-foreground">
            @{author.handle}
          </p>
        ) : (
          <></>
        )}
      </div>
    </Link>
  );
}

const calcTags = (fm: blogPageProps) => {
  let tags: string[] = [];
  let categories: string[] = [];
  if ("tags" in fm)
    tags = Array.isArray(fm.tags) ? fm.tags : safe(fm.tags).split(/[,; ]/);
  if ("categories" in fm)
    categories = Array.isArray(fm.categories)
      ? fm.categories
      : safe(fm.categories).split(/[,; ]/);
  return { tags, categories };
};

interface prevNextProps {
  prevUrl?: string | undefined;
  nextUrl?: string | undefined;
  prevTitle?: string | undefined;
  nextTitle?: string | undefined;
  prevNumber: number;
  nextNumber: number;
}

const calcPrevNext = (
  lang: string,
  // _pageNum: number,
  perPage: number,
  currPost: Page<blogPageProps>,
  query: string = "",
): prevNextProps => {
  if (currPost.data.footer) {
    // performance optimized if `footer` is valid.
    // see also `prevNextIdxTransformer` in source.tsx
    const ft = currPost.data.footer;
    // const getUrl = (slugs: string[] | undefined, lang: string | undefined) => {
    //   const post = blog.getPage(slugs, lang);
    //   return post?.url;
    // };
    const getUrl = (
      slugs: string[] | undefined,
      lang: string | undefined,
      page: number | undefined,
    ) => {
      // const pp = (page ?? 1) !== 1 ? `?page=${page}` : "";
      return lang == i18n.defaultLanguage
        ? `/blog/${slugs?.join("/")}`
        : `/${lang}/blog/${slugs?.join("/")}`;
    };
    const prevUrl = ft.prev?.url ?? getUrl(ft.prev?.slugs, lang, ft.prev?.page);
    const nextUrl = ft.next?.url ?? getUrl(ft.next?.slugs, lang, ft.next?.page);
    return {
      prevUrl: prevUrl,
      nextUrl: nextUrl,
      prevTitle: ft.prev?.title,
      nextTitle: ft.next?.title,
      prevNumber: Math.floor(((ft.prev?.index ?? 1) + perPage - 1) / perPage),
      nextNumber: Math.floor(((ft.next?.index ?? 1) + perPage - 1) / perPage),
    };
  }

  const pages: Page<blogPageProps>[] = getPages(lang);
  const posts: Page<blogPageProps>[] = sortPages(
    filterPosts(pages, lang, query),
  );
  let prev: Page<blogPageProps> | undefined,
    next: Page<blogPageProps> | undefined,
    last: Page<blogPageProps>;
  let prevNumber: number = 1,
    nextNumber: number = 1,
    n: number = 1;
  posts.map((it) => {
    if (it.url === currPost.url) {
      prev = last;
      prevNumber = Math.floor((n + perPage - 1) / perPage);
    } else if (last && last.url === currPost.url) {
      next = it;
      nextNumber = Math.floor((n + perPage - 1) / perPage);
    }
    last = it;
    n++;
  });
  return {
    prevUrl: prev?.url,
    nextUrl: next?.url,
    prevTitle: prev?.data.title,
    nextTitle: next?.data.title,
    prevNumber,
    nextNumber,
  };
};

const get = (fm: any, v: string) => {
  return v in fm ? fm[v] : "";
};
