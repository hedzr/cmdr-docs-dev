// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button2";
// // import { BlogMdxFrontmatter, getAllBlogs } from "@/lib/markdown";
import serverPath, {
  formatDate2,
  isFieldValid,
  safeget,
  stringToDate,
} from "@/lib/utils";
import { ChevronRightIcon, CircleIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import spot from "@/public/default.png";
import Image, { type ImageProps } from "next/image";
import { Suspense } from "react";
import { Pagination, Search } from "@/components/blog/pager";
// import { TemplateString } from "next/dist/lib/metadata/types/metadata-types";
// import serverPublicPath from "@/lib/utils";
// import { lusitana } from '@/app/ui/fonts';
// import Footer from "@/components/layout/footer";
// import { InvoicesTableSkeleton } from '@/app/ui/skeletons';

import { blog } from "@/lib/source";
import { LoaderOutput, MetaData, Page } from "fumadocs-core/source";
import { BaseCollectionEntry, MarkdownProps } from "fumadocs-mdx/config";
import { objectOutputType, ZodTypeAny } from "zod";
import HandlingKeyboardLeftAndRight from "@/components/kb-page-flip";
import { filterPostsByPage, getPosts, prodMode } from "./util";

export const dynamic = "force-dynamic";

const SITE_NAME = "hzSomthing";
const SITE_SLOGAN = `All the latest blogs and news, straight from the team.`;
export const metadata: Metadata = {
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`,
  },
  robots: {
    follow: true,
    index: true,
  },
  description: SITE_SLOGAN,
};

function safeTitle(md: Metadata): string {
  let title: string = "The Latest Posts";
  if (md.title) {
    if (typeof md.title === "string") title = md.title.toString();
    else if (typeof md.title === "object") {
      if ("default" in md.title) title = md.title["default"].toString();
    }
  }
  return title;
}

export default async function BlogIndexPage({
  params,
  searchParams,
}: {
  params: Promise<{
    lang: string;
    query?: string;
  }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const query = sp?.query || "";
  const currentPage = Number(sp?.page) || 1;
  const perPage = 7;
  const lang = (await params).lang;

  // const ppp = pf(blog);

  const { posts, maxPage } = filterPostsByPage(
    getPosts(blog, lang, query),
    currentPage,
    perPage
  );

  const svg = `<svg viewBox='0 0 500 500' xmlns='http://www.w3.org/2000/svg'>
  <filter id='noiseFilter'>
    <feTurbulence 
      type='fractalNoise' 
      baseFrequency='0.65' 
      numOctaves='3' 
      stitchTiles='stitch'/>
  </filter>
  
  <rect width='100%' height='100%' filter='url(#noiseFilter)'/>
</svg>`;

  // const blogs = await getAllBlogs(currentPage, perPage, query);
  // const length = Math.min(blogs.items.length, blogs.maxpage);
  // console.log("lang:", lang, "| count:", blogs.items.length);

  let title: string = safeTitle(metadata);

  console.log(`index - page: ${currentPage}, total: ${posts.length}`, sp, lang);
  // console.log(blog.getLanguages());

  return (
    <main className="container max-sm:px-0 md:py-12">
      <div
        className="h-[113px] p-8 md:h-[213px] md:p-12"
        style={{
          backgroundImage: [
            "radial-gradient(circle at 70% 10%, rgba(59, 55, 56, 0.5), transparent)",
            "radial-gradient(circle at 0% 80%, rgba(7, 100, 44, 0.5), transparent)",
            "radial-gradient(circle at 50% 50%, rgba(50,50,50,0.3), transparent)",
            `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
          ].join(", "),
        }}
      >
        <h1 className="mb-4 border-b-4 border-fd-foreground pb-2 text-4xl font-bold md:text-5xl">
          {SITE_NAME}
        </h1>
        <p className="text-sm md:text-base">{SITE_SLOGAN}</p>
      </div>
      <div className="mt-1 flex items-center justify-between gap-2 md:mt-2 mb-4">
        <Search placeholder="Search Posts (by such as `cxx`, `go`, `calendar`, etc.) ..." />
        {/* <CreatePost /> */}
      </div>
      <Suspense
        key={query + currentPage.toString()}
        fallback={<BlogTableSkeleton />}
      >
        {/* <BlogTable query={query} currentPage={currentPage} /> */}
        <div>
          {posts.map((post) => {
            const draft = safeget(post.data, "draft", false);
            return draft && prodMode ? (
              <></>
            ) : (
              <div key={post.url}>
                <Link
                  href={post.url}
                  className={`flex flex-col bg-fd-card p-4 transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground ${
                    draft ? "line-through italic" : ""
                  }`}
                >
                  <div>
                    <Image
                      className="w-42 ml-2 float-right rounded-lg shadow-lg"
                      src={
                        safeget(post.data, "header", { teaser: "" }).teaser ||
                        spot
                      }
                      alt={post.slugs.join(" ")}
                      width="200"
                      height="160"
                    />
                    <h3 className="sm:text-xl text-lg font-bold -mt-1 text-zinc-300/75">
                      {post.data.title}
                    </h3>
                    {/* <p className="font-medium">{post.data.title}</p> */}
                    <p className="text-sm text-fd-muted-foreground">
                      {post.data.description ||
                        safeget(post.data, "excerpt", "")}
                    </p>

                    <p className="mt-auto pt-4 text-xs text-fd-muted-foreground">
                      {formatDate2(post.data.date ?? post.file.name, lang)}
                    </p>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
        <div className="mt-1 flex w-full justify-center">
          <Pagination totalPages={maxPage} />
          <HandlingKeyboardLeftAndRight />
        </div>
      </Suspense>
    </main>
  );
}

// function BlogFooter() {
//   return (
//     <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
//       <a
//         className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//         href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//         target="_blank"
//         rel="noopener noreferrer"
//       >
//         <Image
//           aria-hidden
//           src="/file.svg"
//           alt="File icon"
//           width={16}
//           height={16}
//         />
//         Learn
//       </a>
//       <a
//         className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//         href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//         target="_blank"
//         rel="noopener noreferrer"
//       >
//         <Image
//           aria-hidden
//           src="/window.svg"
//           alt="Window icon"
//           width={16}
//           height={16}
//         />
//         Examples
//       </a>
//       <a
//         className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//         href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//         target="_blank"
//         rel="noopener noreferrer"
//       >
//         <Image
//           aria-hidden
//           src="/globe.svg"
//           alt="Globe icon"
//           width={16}
//           height={16}
//         />
//         Go to nextjs.org →
//       </a>
//     </footer>
//   );
// }

function BlogTable(query: string, currentPage: number) {
  return <>empty</>;
}

function BlogTableSkeleton() {
  return <>empty</>;
}

// function BlogCard({
//   date,
//   title,
//   description,
//   slug,
//   lang,
//   draft,
//   header,
//   excerpt,
//   toc,
//   comment,
//   feedback,
//   layout,
//   tags,
//   categories,
//   page,
//   highlight,
// }: BlogMdxFrontmatter & {
//   slug: string;
//   lang?: string;
//   draft?: boolean;
//   page: number;
//   highlight?: string;
// }) {
//   // console.log("date:", formatDate2(date, lang), slug, draft, "| title", title);
//   return (
//     <div className="flex flex-col md:flex-row items-start">
//       <div className="text-sm text-muted-foreground text-nowrap md:pr-12 mb-2">
//         <p className="md:w-24 text-zinc-400">{formatDate2(date, lang)}</p>
//       </div>
//       <div className="md:border-l md:pl-14 pb-12 w-full grow">
//         <CircleIcon className="w-3.5 h-3.5 absolute mt-1.1 -left-[-18.63rem] fill-background text-muted-foreground md:flex hidden" />
//         <Link
//           className={`flex flex-col gap-3 ${
//             draft ? "line-through italic" : ""
//           }`}
//           href={`/blog/${slug}/?page=${page}&hilight=${highlight || ""}`}
//         >
//           <div>
//             <Image
//               className="w-42 ml-2 float-right rounded-lg shadow-lg"
//               src={header?.teaser || spot}
//               alt={slug}
//               width="200"
//               height="160"
//             />
//             <h3 className="sm:text-xl text-lg font-bold -mt-1 text-zinc-300/75">
//               {title}
//             </h3>
//             <p className="text-sm text-muted-foreground text-zinc-500">
//               {description || excerpt}
//             </p>
//             <Button
//               variant="link"
//               size="sm"
//               className="w-fit px-0 underline -mt-2 text-sky-400/75"
//             >
//               Read more <ChevronRightIcon className="w-4 h-4 ml-1" />
//             </Button>
//           </div>
//         </Link>
//       </div>
//     </div>
//   );
// }
