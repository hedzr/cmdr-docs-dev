import { Typography } from "@/components/typography";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants1 } from "@/components/ui/button1";
import {
  type Author as AuthorT,
  getAllBlogStaticPaths,
  getBlogForSlug,
} from "@/lib/markdown";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { type HTMLAttributes } from "react";

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

export default async function BlogPage(props: {
  params: Promise<{ slug: string; lang: string }>;
}) {
  const params = await props.params;
  const res = await getBlogForSlug(params.slug);
  if (!res) {
    console.log("not found:", res);
    notFound();
  }

  let tags: string[] = [];
  let categories: string[] = [];
  if (res.frontmatter.tags)
    tags = Array.isArray(res.frontmatter.tags)
      ? res.frontmatter.tags
      : res.frontmatter.tags.split(/[,; ]/);
  if (res.frontmatter.categories)
    categories = Array.isArray(res.frontmatter.categories)
      ? res.frontmatter.categories
      : res.frontmatter.categories.split(/[,; ]/);
  console.log(
    "blog page ------- | params:",
    params
    // "| front:",
    // res.frontmatter
  );

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
          {formatDate(res.frontmatter.date, params.lang)}
        </p>
        <h1
          className={`sm:text-4xl text-3xl font-extrabold blog-title ${res.frontmatter.draft ? "line-through" : ""}`}
        >
          {res.frontmatter.title}
          {res.frontmatter.draft ? (
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
            {res.frontmatter.authors ? (
              <AuthorCards authors={res.frontmatter.authors} />
            ) : res.frontmatter.author ? (
              <AuthorCard author={res.frontmatter.author} />
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
        <div id="blog-tail-row">
          <div id="blog-categories" className="inline mr-4">
            {categories.map((it) => {
              return <span className="px-1" key={it}>{it}</span>;
            })}
          </div>
          <div id="blog-tags" className="inline mr-4">
            {tags.map((it) => {
              return <span className="px-1" key={it}>{it}</span>;
            })}
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
        return <AuthorCardCore author={author} key={author.username||author.name||'(noname)'} />;
      })}
    </div>
  );
}

function AuthorCard({ author }: { author: AuthorT }) {
  return (
    <div className="flex items-center gap-8 flex-wrap">
      <AuthorCardCore author={author} key={author.username||author.name||'(noname)'} />
    </div>
  );
}

export function AuthorCardCore({
  author,
  key = "(noname)",
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  author: AuthorT;
  key?: string;
}) {
  let name = author.username||author.name||'(noname)';
  return (
    <Link
      href={author.handleUrl ?? ""}
      className="flex items-center gap-2"
      key={key}
    >
      <Avatar className="w-10 h-10">
        <AvatarImage src={author.avatar||author.picture} />
        <AvatarFallback>
          {name.slice(0, 2).toUpperCase()}
        </AvatarFallback>
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
