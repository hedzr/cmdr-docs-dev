import { Metadata } from "next";
import { blog, openapi, source } from "@/lib/source";
import { formatDate2, isFieldValid, safe, safeget } from "@/lib/utils";
import { createMetadata } from "@/lib/metadata";
// import {
//   type Author as AuthorT,
//   BlogMdxFrontmatter,
//   getAllBlogStaticPaths,
//   getBlogForSlug,
// } from "@/lib/markdown";
// import { type Author as AuthorT } from "@/lib/markdown";
// import { ArrowLeftIcon } from "lucide-react";
import { notFound } from "next/navigation";
import { type HTMLAttributes } from "react";

import defaultMdxComponents from "fumadocs-ui/mdx";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Control } from "./page.client";
import { ComponentProps, FC } from "react";
import { Callout } from "fumadocs-ui/components/callout";
import { Card, Cards } from "fumadocs-ui/components/card";
import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock";
import { Files, Folder, File } from "fumadocs-ui/components/files";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import { TypeTable } from "fumadocs-ui/components/type-table";
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
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
} from "@/components/ui/popover";
import { InlineTOC } from "fumadocs-ui/components/inline-toc";
import { Wrapper } from "@/components/preview/wrapper";
import { ImageZoom } from "@/components/image-zoom";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { Mermaid } from "@theguild/remark-mermaid/mermaid"; // pnpm install @theguild/remark-mermaid remark-math fumadocs-twoslash fumadocs-docgen rehype-katex
import { DocsCategory } from "@/components/page";
import {
  TocPopoverTrigger,
  TocPopoverContent,
  TOCScrollArea,
  TOCItems,
  // Toc,
} from "@/components/layout/toc";
import ClerkTOCItems from "@/components/layout/toc-clerk";
import { TocPopoverHeader } from "@/page.client";
import { buttonVariants1 } from "@/components/ui/button1";
import { z } from "zod";
import { LoaderOutput, MetaData } from "fumadocs-core/source";
import { BaseCollectionEntry, MarkdownProps } from "fumadocs-mdx/config";
import { getPosts } from "../util";
import HandlingKeyboardLeftAndRight from "@/components/kb-page-flip";
// import { Edit, Text } from "lucide-react";
// import { I18nLabel } from "fumadocs-ui/provider";

// export const dynamic = "force-static";
export const dynamic = "force-dynamic";

type AuthorT = {
  username?: string;
  name?: string;
  avatar?: string;
  picture?: string;
  handle?: string;
  handleUrl?: string;
};

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = blog.getPage([params.slug]);

  if (!page) notFound();

  return createMetadata({
    title: page.data.title,
    description:
      page.data.description ?? "The library for building documentation sites",
  });
}

export function generateStaticParams(): { slug: string }[] {
  return blog.getPages().map((page) => ({
    slug: page.slugs[0],
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

// export default function page({
//   params,
//   searchParams,
// }: {
//   params: { slug: string }
//   searchParams: { [key: string]: string | string[] | undefined }
// }) {
// }

export default async function BlogPage(props: {
  params: Promise<{ slug: string; lang: string }>;
}) {
  // const schema = z.union([
  //   z.string(),
  //   z.array(
  //     z.object({
  //       username: z.string().optional(),
  //       name: z.string().optional(),
  //       handle: z.string().optional(),
  //       handleUrl: z.string().optional(),
  //       avatar: z.string().optional(),
  //     })
  //   ),
  // ]);

  // console.log(1, "zod", schema.parse("uxx"));
  // // console.log(2, "zod", schema.parse({}), "bad");
  // console.log(3, "zod", schema.parse([{ name: "xxx" }]));

  const params = await props.params;
  const page = blog.getPage([params.slug]);

  if (!page) notFound();

  const lang = params.lang;
  const fm = page.data;
  // const body = fm.body;
  // const toc = page.data.toc;
  const { body: Mdx, toc } = await fm.load();

  let tags: string[] = [];
  let categories: string[] = [];
  if ("tags" in fm)
    tags = Array.isArray(fm.tags) ? fm.tags : safe(fm.tags).split(/[,; ]/);
  if ("categories" in fm)
    categories = Array.isArray(fm.categories)
      ? fm.categories
      : safe(fm.categories).split(/[,; ]/);
  // console.log(`blog page ${pageNumber} ----`);

  const get = (fm: any, v: string) => {
    return v in fm ? fm[v] : "";
  };
  let lma: string = get(fm, "last_modified_at") || get(fm, "lastModifiedAt");

  const posts = getPosts(blog, lang, "");
  let prev: typeof page, next: typeof page, last: typeof page;
  posts.map((it) => {
    if (it.url === page.url) {
      prev = last;
    } else if (last && last.url === page.url) {
      next = it;
    }
    last = it;
  });

  const tocPopoverOptions = {
    style: "clerk", // normal, clerk
    single: false,
  };
  const useInlineTOC = false;

  // const tocOptions = {
  //   style: "clerk", // normal, clerk
  // };

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
          className={`mb-2 text-3xl font-bold text-white ${safeget(page.data, "draft", false) ? "line-through italic" : ""}`}
        >
          {page.data.title}
        </h1>
        <p className="mb-4 text-white/80">{page.data.description}</p>
        <Link
          href="/blog"
          className={buttonVariants1({ size: "sm", variant: "secondary" })}
        >
          Back
        </Link>
      </div>
      <article
        className={`container blog flex flex-col px-0 py-8 lg:flex-row lg:px-4min-w-0 prose-zinc1 dark:prose-invert md:prose-md lg:prose-lg prose-headings:a:underline:none w-[85vw] sm:w-full sm:mx-auto prose-code:text-sm prose-code:leading-6 prose-headings:scroll-m-20 prose-code:font-code prose-code:p-1 prose-code:rounded-md prose-pre:border pt-2 prose-code:before:content-none prose-code:after:content-none !min-w-full prose-img:rounded-md prose-img:border`}
        // prose md:prose-md lg:prose-lg prose-${base} dark:prose-invert dark:prose-code:bg-${ref}-900 dark:prose-pre:bg-${ref}-900 prose-code:bg-${ref}-100 prose-pre:bg-${ref}-100 dark:prose-code:text-${base}-300 prose-code:text-${ref}-700
      >
        <div className="min-w-0  flex-1 p-4">
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
              APIPage: openapi.APIPage,
              DocsCategory: () => <DocsCategory page={page} from={source} />,

              File,
              Files,
              Folder,
              Tabs,
              Tab,
            }}
          />
          <div className="mt-32 w-full">
            {prev ? (
              <div className="left prev">
                <Link href={prev.url}>Prev: {prev.data.title || ""}</Link>
              </div>
            ) : (
              <></>
            )}
            {next ? (
              <div className="float-right right next">
                <Link href={next.url}>Next: {next.data.title}</Link>
              </div>
            ) : (
              <></>
            )}
          </div>
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
              {formatDate2(page.data.date ?? page.file.name, lang)}
              {/* {new Date(page.data.date ?? page.file.name).toDateString()} */}
            </p>
            <p className="mb-1 text-sm text-fd-muted-foreground">
              Last Updated At
            </p>
            <p className="font-medium">
              {/* <div id="last-modified" className="my-4 text-sm text-zinc-400"> */}
              {lma}
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
                  {tags.map((it) => {
                    return (
                      <Link
                        href={`/${lang}/blog/?query=%23${it}&page=${page}`}
                        className="rounded gap-2 p-2 py-1 m-1 border-1 border-zinc-400 text-sm text-zinc-900 bg-sky-500"
                        key={it}
                      >
                        {it}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <Control url={page.url} />

          {/* <Toc>
            {tocOptions.header}
            <h3 className="inline-flex items-center gap-1.5 text-sm text-fd-muted-foreground">
              <Text className="size-4" />
              <I18nLabel label="toc" />
            </h3>
            <TOCScrollArea>
              {tocOptions.style === "clerk" ? (
                <ClerkTOCItems items={toc} />
              ) : (
                <TOCItems items={toc} />
              )}
            </TOCScrollArea>
            {tocOptions.footer}
          </Toc> */}
        </div>
      </article>
    </>
  );
}

// async function BlogPageOld({
//   params,
//   searchParams,
// }: {
//   params: Promise<{
//     slug: string;
//     lang: string;
//   }>;
//   searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
// }) {
//   const { slug, lang } = await params;
//   const sp = await searchParams;
//   const pageNumber = Number(sp?.page || "1") || 1;

//   console.log(`blog p${pageNumber} - `, lang, slug, sp);

//   // const prms = await params;
//   // const lang = prms.lang;
//   // const sp = await searchParams;
//   // const pageNumber = Number(sp.page || prms.page) || 1;
//   const res = await getBlogForSlug(slug);
//   if (!res) {
//     console.log("not found:", res);
//     notFound();
//   }

//   const fm = res.frontmatter;

//   let tags: string[] = [];
//   let categories: string[] = [];
//   if (fm.tags) tags = Array.isArray(fm.tags) ? fm.tags : fm.tags.split(/[,; ]/);
//   if (fm.categories)
//     categories = Array.isArray(fm.categories)
//       ? fm.categories
//       : fm.categories.split(/[,; ]/);
//   // console.log(`blog page ${pageNumber} ----`);

//   const get = (fm: any, v: string) => {
//     return v in fm ? fm[v] : "";
//   };
//   let lma: string = get(fm, "lastModifiedAt") || get(fm, "last_modified_at");

//   return (
//     <article className="lg:w-[93%] md:[99%] mx-auto mb-32">
//       <div className="flex flex-col-1 gap-x-3">
//         <Link
//           className={buttonVariants1({
//             variant: "link",
//             className: "!mx-0 !px-0 mb-7 !-ml-1 ",
//           })}
//           href="/blog"
//         >
//           <ArrowLeftIcon className="w-4 h-4 mr-1.5" /> Back to List
//         </Link>
//         <span className="inline-flex items-center justify-center text-sm font-medium mr-1.5 h-10 px-4 py-2 !mx-0 !px-0 mb-7 !-ml-1">
//           {" | "}
//         </span>
//         <Link
//           className={buttonVariants1({
//             variant: "secondary",
//             className: "!mx-0 !px-0 mb-7 !-ml-1 ",
//           })}
//           href="/"
//         >
//           Home
//         </Link>
//       </div>
//       <div className="flex flex-col gap-3 pb-7 w-full border-b mb-4">
//         <p className="text-muted-foreground text-sm blog-date">
//           {formatDate(fm.date, lang)}
//         </p>
//         <h1
//           className={`sm:text-4xl text-3xl font-extrabold blog-title ${fm.draft ? "line-through" : ""}`}
//         >
//           {fm.title}
//           {fm.draft ? (
//             <span className="align-top capcapitalize italic text-sm font-medium text-zink-600/76">
//               draft
//             </span>
//           ) : (
//             <></>
//           )}
//         </h1>
//         <div className="mt-6 flex flex-col gap-3">
//           <p className="text-sm text-muted-foreground">Posted by</p>
//           <div className="blog-authors">
//             {fm.authors ? (
//               <AuthorCards authors={fm.authors} />
//             ) : fm.author ? (
//               <AuthorCard author={fm.author} />
//             ) : (
//               <AuthorCard
//                 author={{
//                   username: "hedzr",
//                   avatar: "",
//                   handle: "",
//                   handleUrl: "",
//                 }}
//               />
//             )}
//           </div>
//         </div>
//       </div>
//       <div className="blog-content !w-full">
//         <Typography>{res.content}</Typography>

//         <div className="mt-4">
//           <div id="blog-tail-row">
//             <div id="blog-categories" className="inline mr-4">
//               <div className="inline -m-1">
//                 {categories.map((it) => {
//                   return (
//                     <span
//                       className="rounded gap-2 p-2 py-1 m-1 border-1 border-zinc-400 text-sm text-zinc-900 bg-zinc-500"
//                       key={it}
//                     >
//                       {it}
//                     </span>
//                   );
//                 })}
//               </div>
//             </div>
//             <div id="blog-tags" className="inline mr-4">
//               {tags.map((it) => {
//                 return (
//                   <Link
//                     href={`/${lang}/blog/?query=%23${it}&page=${pageNumber}`}
//                     className="rounded gap-2 p-2 py-1 m-1 border-1 border-zinc-400 text-sm text-zinc-900 bg-sky-500"
//                     key={it}
//                   >
//                     {it}
//                   </Link>
//                 );
//               })}
//             </div>
//             <div id="last-modified" className="my-4 text-sm text-zinc-400">
//               Last Updated At: {lma}
//             </div>
//           </div>
//         </div>
//       </div>
//     </article>
//   );
// }

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

function AuthorCard({ author }: { author: AuthorT | string }) {
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
