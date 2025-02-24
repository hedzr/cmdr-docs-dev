import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button2";
import { BlogMdxFrontmatter, getAllBlogs } from "@/lib/markdown";
import serverPath, { formatDate2, stringToDate } from "@/lib/utils";
import { ChevronRightIcon, CircleIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import spot from "@/public/default.png";
import Image, { type ImageProps } from "next/image";
import { Suspense } from "react";
import { Pagination, Search } from "@/components/blog/pager";
import { TemplateString } from "next/dist/lib/metadata/types/metadata-types";
// import serverPublicPath from "@/lib/utils";
// import { lusitana } from '@/app/ui/fonts';
// import Footer from "@/components/layout/footer";
// import { InvoicesTableSkeleton } from '@/app/ui/skeletons';

const SITE_NAME = "hzSomthing";
export const metadata: Metadata = {
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`,
  },
  robots: {
    follow: true,
    index: true,
  },
  description: "All the latest blogs and news, straight from the team.",
};

const prodMode = process.env.NODE_ENV === "production";

export default async function BlogIndexPage({
  params,
  searchParams,
}: {
  params: Promise<{
    lang: string;
    query?: string;
    page?: string;
  }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;

  const query = sp?.query || "";
  const currentPage = Number(sp?.page) || 1;

  const perPage = 7;

  const blogs = await getAllBlogs(currentPage, perPage);
  const lang = (await params).lang;
  // console.log("lang:", lang, "| count:", blogs.items.length);
  console.log(
    `blog index ------ params: ${sp}, lang: ${lang}, total: ${blogs.items.length}`
  );
  let title: string = "The Latest Posts";
  if (metadata.title) {
    if (typeof metadata.title === "string") title = metadata.title.toString();
    else if (typeof metadata.title === "object") {
      if ("default" in metadata.title)
        title = metadata.title["default"].toString();
    }
  }

  return (
    <div className="w-full flex  flex-col gap-5 sm:min-h-[91vh] min-h-[88vh] md:pt-5 pt-2">
      <div className="md:mb-10 mb-5 flex flex-col gap-2 ">
        <h1 className="text-3xl font-extrabold">{title}</h1>
        <p className="text-muted-foreground">
          {metadata.description ?? "There is somthing due to my life"}
        </p>
      </div>
      <div className="mt-1 flex items-center justify-between gap-2 md:mt-2">
        <Search placeholder="Search Posts ..." />
        {/* <CreateInvoice /> */}
      </div>
      <Suspense
        key={query + currentPage.toString()}
        fallback={<BlogTableSkeleton />}
      >
        {/* <BlogTable query={query} currentPage={currentPage} /> */}
        <div>
          {blogs.items.map((blog) =>
            blog?.slug ? (
              blog.frontmatter.draft && prodMode ? (
                <div key={blog.slug}></div>
              ) : (
                <BlogCard
                  {...blog.frontmatter}
                  slug={blog.slug}
                  lang={lang}
                  key={blog.slug}
                />
              )
            ) : (
              <div key={blog ? blog.slug : "unknown"}></div>
            )
          )}
        </div>
        <div className="mt-1 flex w-full justify-center">
          <Pagination totalPages={blogs.maxpage} />
        </div>
      </Suspense>
    </div>
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

function BlogCard({
  date,
  title,
  description,
  slug,
  lang,
  draft,
  header,
  excerpt,
  toc,
  comment,
  feedback,
  layout,
  tags,
  categories,
}: BlogMdxFrontmatter & { slug: string; lang?: string; draft?: boolean }) {
  // console.log("date:", formatDate2(date, lang), slug, draft, "| title", title);
  return (
    <div className="flex flex-col md:flex-row items-start">
      <div className="text-sm text-muted-foreground text-nowrap md:pr-12 mb-2">
        <p className="md:w-24 text-zinc-400">{formatDate2(date, lang)}</p>
      </div>
      <div className="md:border-l md:pl-14 pb-12 w-full grow">
        <CircleIcon className="w-3.5 h-3.5 absolute mt-1.1 -left-[-18.63rem] fill-background text-muted-foreground md:flex hidden" />
        <Link
          className={`flex flex-col gap-3 ${draft ? "line-through italic" : ""}`}
          href={`/blog/${slug}`}
        >
          <div>
            <Image
              className="w-42 ml-2 float-right rounded-lg shadow-lg"
              src={header?.teaser || spot}
              alt={slug}
              width="200"
              height="160"
            />
            <h3 className="sm:text-xl text-lg font-bold -mt-1 text-zinc-300/75">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground text-zinc-500">
              {description || excerpt}
            </p>
            <Button
              variant="link"
              size="sm"
              className="w-fit px-0 underline -mt-2 text-sky-400/75"
            >
              Read more <ChevronRightIcon className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </Link>
      </div>
    </div>
  );
}
