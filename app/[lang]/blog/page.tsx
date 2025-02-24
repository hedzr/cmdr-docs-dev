import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button2";
import { BlogMdxFrontmatter, getAllBlogs } from "@/lib/markdown";
import serverPath, { formatDate2, stringToDate } from "@/lib/utils";
import { ChevronRightIcon, CircleIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "hzSomthing - Blog",
};

export default async function BlogIndexPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const blogs = (await getAllBlogs()).sort(
    (a, b) =>
      stringToDate(b.frontmatter.date ?? "").getTime() -
      stringToDate(a.frontmatter.date ?? "").getTime()
  );
  const lang = (await params).lang;
  const prodMode = process.env.NODE_ENV === "production";
  return (
    <div className="w-full flex  flex-col gap-5 sm:min-h-[91vh] min-h-[88vh] md:pt-6 pt-2">
      <div className="md:mb-14 mb-8 flex flex-col gap-2 ">
        <h1 className="text-3xl font-extrabold">
          The latest blogs of this product
        </h1>
        <p className="text-muted-foreground">
          All the latest blogs and news, straight from the team.
        </p>
      </div>
      <div>
        {blogs.map((blog) =>
          blog.slug ? (
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
            <div key={blog.slug}></div>
          )
        )}
      </div>
    </div>
  );
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
