import { Typography } from "@/components/typography";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants1 } from "@/components/ui/button1";
import {
  type Author as AuthorT,
  BlogMdxFrontmatter,
  getAllBlogStaticPaths,
  getBlogForSlug,
} from "@/lib/markdown";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { use, type HTMLAttributes } from "react";

// export const dynamic = "force-static";
export const dynamic = "force-dynamic";

type PageProps = {
  params: { slug: string };
};

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const res = await getBlogForSlug(params.slug);
  if (!res) return null;
  const { frontmatter } = res;
  return {
    title: frontmatter.title,
    description: frontmatter.description,
  };
}

export async function generateStaticParams() {
  const val = await getAllBlogStaticPaths();
  if (!val) return [];
  return val.map((it) => ({ slug: it }));
}

// export default function page({
//   params,
//   searchParams,
// }: {
//   params: { slug: string }
//   searchParams: { [key: string]: string | string[] | undefined }
// }) {
// }

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: Promise<{
    slug: string;
    lang: string;
  }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug, lang } = await params;
  const sp = await searchParams;
  const pageNumber = Number(sp?.page || "1") || 1;

  console.log(`blog p${pageNumber} - `, lang, slug, sp);

  // const prms = await params;
  // const lang = prms.lang;
  // const sp = await searchParams;
  // const pageNumber = Number(sp.page || prms.page) || 1;
  const res = await getBlogForSlug(slug);
  if (!res) {
    console.log("not found:", res);
    notFound();
  }

  const fm = res.frontmatter;

  let tags: string[] = [];
  let categories: string[] = [];
  if (fm.tags) tags = Array.isArray(fm.tags) ? fm.tags : fm.tags.split(/[,; ]/);
  if (fm.categories)
    categories = Array.isArray(fm.categories)
      ? fm.categories
      : fm.categories.split(/[,; ]/);
  // console.log(`blog page ${pageNumber} ----`);

  const get = (fm: any, v: string) => {
    return v in fm ? fm[v] : "";
  };
  let lma: string = get(fm, "lastModifiedAt") || get(fm, "last_modified_at");

  return (
    <article className="lg:w-[93%] md:[99%] mx-auto mb-32">
      <div className="flex flex-col-1 gap-x-3">
        <Link
          className={buttonVariants1({
            variant: "link",
            className: "!mx-0 !px-0 mb-7 !-ml-1 ",
          })}
          href="/blog"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-1.5" /> Back to List
        </Link>
        <span className="inline-flex items-center justify-center text-sm font-medium mr-1.5 h-10 px-4 py-2 !mx-0 !px-0 mb-7 !-ml-1">
          {" | "}
        </span>
        <Link
          className={buttonVariants1({
            variant: "secondary",
            className: "!mx-0 !px-0 mb-7 !-ml-1 ",
          })}
          href="/"
        >
          Home
        </Link>
      </div>
      <div className="flex flex-col gap-3 pb-7 w-full border-b mb-4">
        <p className="text-muted-foreground text-sm blog-date">
          {formatDate(fm.date, lang)}
        </p>
        <h1
          className={`sm:text-4xl text-3xl font-extrabold blog-title ${fm.draft ? "line-through" : ""}`}
        >
          {fm.title}
          {fm.draft ? (
            <span className="align-top capcapitalize italic text-sm font-medium text-zink-600/76">
              draft
            </span>
          ) : (
            <></>
          )}
        </h1>
        <div className="mt-6 flex flex-col gap-3">
          <p className="text-sm text-muted-foreground">Posted by</p>
          <div className="blog-authors">
            {fm.authors ? (
              <AuthorCards authors={fm.authors} />
            ) : fm.author ? (
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
      </div>
      <div className="blog-content !w-full">
        <Typography>{res.content}</Typography>

        <div className="mt-4">
          <div id="blog-tail-row">
            <div id="blog-categories" className="inline mr-4">
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
            <div id="blog-tags" className="inline mr-4">
              {tags.map((it) => {
                return (
                  <Link
                    href={`/${lang}/blog/?query=%23${it}&page=${pageNumber}`}
                    className="rounded gap-2 p-2 py-1 m-1 border-1 border-zinc-400 text-sm text-zinc-900 bg-sky-500"
                    key={it}
                  >
                    {it}
                  </Link>
                );
              })}
            </div>
            <div id="last-modified" className="my-4 text-sm text-zinc-400">
              Last Updated At: {lma}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

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

function AuthorCard({ author }: { author: AuthorT }) {
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
    <Link
      href={author.handleUrl ?? ""}
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
