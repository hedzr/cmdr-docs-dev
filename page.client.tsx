"use client";

import {
  Fragment,
  type HTMLAttributes,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cva } from "class-variance-authority";
import { cn } from "./lib/cn";
import { useI18n } from "fumadocs-ui/provider";
import { useTreeContext, useTreePath } from "fumadocs-ui/provider";
import { useSidebar } from "fumadocs-ui/provider";
import type { PageTree } from "fumadocs-core/server";
import { usePathname, useSearchParams } from "next/navigation";
import { useNav } from "./components/layout/nav";
import {
  type BreadcrumbOptions,
  getBreadcrumbItemsFromPath,
} from "fumadocs-core/breadcrumb";
import { usePageStyles } from "fumadocs-ui/provider";
import { isActive } from "./lib/is-active";
import { TocPopover } from "./components/layout/toc";
import { useEffectEvent } from "fumadocs-core/utils/use-effect-event";
import { blog } from "@/lib/source";
import { ReadonlyURLSearchParams } from "next/dist/client/components/navigation.react-server";
import { Page } from "fumadocs-core/source";
import { getPosts } from "@/app/[lang]/blog/util";
import { z } from "zod";
import { BaseCollectionEntry, MarkdownProps } from "fumadocs-mdx/config";
import { buttonVariants1 } from "@/components/ui/button1";

export function TocPopoverHeader(props: HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const sidebar = useSidebar();
  const { tocNav } = usePageStyles();
  const { isTransparent } = useNav();

  const onClick = useEffectEvent((e: Event) => {
    if (!open) return;

    if (ref.current && !ref.current.contains(e.target as HTMLElement))
      setOpen(false);
  });

  useEffect(() => {
    window.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("click", onClick);
    };
  }, [onClick]);

  return (
    <div
      className={cn(
        "sticky overflow-visible z-10 h-8",
        tocNav,
        props.className,
      )}
      style={{
        top: "calc(var(--fd-banner-height) + var(--fd-nav-height))",
      }}
    >
      <TocPopover open={open} onOpenChange={setOpen} asChild>
        <header
          ref={ref}
          id="nd-tocnav"
          {...props}
          className={cn(
            "border-b border-fd-foreground/10 backdrop-blur-md transition-colors",
            (!isTransparent || open) && "bg-fd-background/80",
            open && "shadow-lg",
            sidebar.open && "opacity-0",
          )}
        >
          {props.children}
        </header>
      </TocPopover>
    </div>
  );
}

export function PageBody(props: HTMLAttributes<HTMLDivElement>) {
  const { page } = usePageStyles();

  return (
    <div
      id="nd-page"
      {...props}
      className={cn("flex w-full min-w-0 flex-col", page, props.className)}
    >
      {props.children}
    </div>
  );
}

export function PageArticle(props: HTMLAttributes<HTMLElement>) {
  const { article } = usePageStyles();

  return (
    <article
      {...props}
      className={cn(
        "flex w-full flex-1 flex-col gap-6 px-4 pt-8 md:px-6 md:pt-12 xl:px-12 xl:mx-auto",
        article,
        props.className,
      )}
    >
      {props.children}
    </article>
  );
}

export function LastUpdate(props: { date: Date }) {
  const { text } = useI18n();
  const [date, setDate] = useState("");

  useEffect(() => {
    // to the timezone of client
    setDate(props.date.toLocaleDateString());
  }, [props.date]);

  return (
    <p className="text-sm text-fd-muted-foreground">
      {text.lastUpdate} {date}
    </p>
  );
}

export interface FooterProps {
  /**
   * Items including information for the next and previous page
   */
  items?: {
    previous?: { name: string; url: string };
    next?: { name: string; url: string };
  };
}

const itemVariants = cva(
  "flex w-full flex-col gap-2 rounded-lg border bg-fd-card p-4 text-sm transition-colors hover:bg-fd-accent/80 hover:text-fd-accent-foreground",
);

const itemLabel = cva(
  "inline-flex items-center gap-0.5 text-fd-muted-foreground",
);

function scanNavigationList(tree: PageTree.Node[]) {
  const list: PageTree.Item[] = [];

  tree.forEach((node) => {
    if (node.type === "folder") {
      if (node.index) {
        list.push(node.index);
      }

      list.push(...scanNavigationList(node.children));
      return;
    }

    if (node.type === "page" && !node.external) {
      list.push(node);
    }
  });

  return list;
}

const listCache = new WeakMap<PageTree.Root, PageTree.Item[]>();

export function Footer({ items }: FooterProps) {
  const { root } = useTreeContext();
  const { text } = useI18n();
  const pathname = usePathname();

  const { previous, next } = useMemo(() => {
    if (items) return items;

    const cached = listCache.get(root);
    const list = cached ?? scanNavigationList(root.children);
    listCache.set(root, list);

    const idx = list.findIndex((item) => isActive(item.url, pathname, false));

    if (idx === -1) return {};
    return {
      previous: list[idx - 1],
      next: list[idx + 1],
    };
  }, [items, pathname, root]);

  return (
    <div className="grid grid-cols-2 gap-4 pb-6">
      {previous ? (
        <Link href={previous.url} className={cn(itemVariants())}>
          <div className={cn(itemLabel())}>
            <ChevronLeft className="-ms-1 size-4 shrink-0 rtl:rotate-180" />
            <p>{text.previousPage}</p>
          </div>
          <p className="font-medium">{previous.name}</p>
        </Link>
      ) : null}
      {next ? (
        <Link
          href={next.url}
          className={cn(itemVariants({ className: "col-start-2 text-end" }))}
        >
          <div className={cn(itemLabel({ className: "flex-row-reverse" }))}>
            <ChevronRight className="-me-1 size-4 shrink-0 rtl:rotate-180" />
            <p>{text.nextPage}</p>
          </div>
          <p className="font-medium">{next.name}</p>
        </Link>
      ) : null}
    </div>
  );
}

export function BlogBackToListButton(_props: { lang: string }): ReactNode {
  let sp: ReadonlyURLSearchParams & { page?: number; perpage?: number };
  sp = useSearchParams() as typeof sp;
  return (
    <Link
      href={`/blog?page=${sp?.page || ""}`}
      className={buttonVariants1({ size: "sm", variant: "secondary" })}
    >
      <span className="back">Back to list</span>
    </Link>
  );
}

export function BlogTagButton(props: { lang: string; tag: string }): ReactNode {
  let sp: ReadonlyURLSearchParams & {
    page?: number | string;
    perpage?: number | string;
  };
  sp = useSearchParams() as typeof sp;

  const currentPage =
    typeof sp?.page === "string"
      ? Number(sp?.page)
      : Array.isArray(sp?.page)
        ? Number(sp?.page[0])
        : 1;

  return (
    <Link
      href={`/${props.lang}/blog/?query=%23${encodeURIComponent(props.tag)}&page=${currentPage}`}
      className="rounded gap-2 p-2 py-1 m-1 border-1 border-zinc-400 text-sm text-zinc-900 bg-sky-500"
      key={props.tag}
    >
      {props.tag}
    </Link>
  );
}

export function FooterNoCache(props: {
  lang: string;
  page: Page<blogPageProps>;
}): ReactNode {
  const { text } = useI18n();

  let sp: ReadonlyURLSearchParams & {
    page?: number | string;
    perpage?: number | string;
  };
  sp = useSearchParams() as typeof sp;

  const currentPage =
    typeof sp?.page === "string"
      ? Number(sp?.page)
      : Array.isArray(sp?.page)
        ? Number(sp?.page[0])
        : 1;
  const perPage =
    typeof sp?.perpage === "string"
      ? Number(sp?.perpage)
      : Array.isArray(sp?.perpage)
        ? Number(sp?.perpage[0])
        : 7;
  const { prev, next, prevNumber, nextNumber } = calcPrevNext(
    blog,
    props.lang,
    currentPage,
    perPage,
    props.page,
  );

  // console.log(`--- blog page ${params} 2 ----`);
  // <Link href={bundle(prev.url, prevNumber)}>
  // <ChevronLeft className="-ms-1 size-4 shrink-0 rtl:rotate-180" />
  // {/* <p>{text.previousPage}</p> */} Newer:
  // <p>{prev.data.title || ""}</p>

  const o: FooterProps = {
    items: {
      previous: {
        url: bundle(prev?.url, prevNumber),
        name: prev?.data.title || "",
      },
      next: {
        url: bundle(next?.url, nextNumber),
        name: next?.data.title || "",
      },
    },
  };
  const items = o.items;

  return (
    <div className="not-prose grid grid-cols-2 gap-4 pb-6">
      {items?.previous ? (
        <Link href={items.previous.url} className={cn(itemVariants())}>
          <div className={cn(itemLabel())}>
            <ChevronLeft className="-ms-1 size-4 shrink-0 rtl:rotate-180" />
            <p>{text.previousPage}</p>
          </div>
          <p className="font-medium">{items.previous.name}</p>
        </Link>
      ) : null}
      {items?.next ? (
        <Link
          href={items.next.url}
          className={cn(itemVariants({ className: "col-start-2 text-end" }))}
        >
          <div className={cn(itemLabel({ className: "flex-row-reverse" }))}>
            <ChevronRight className="-me-1 size-4 shrink-0 rtl:rotate-180" />
            <p>{text.nextPage}</p>
          </div>
          <p className="font-medium">{items.next.name}</p>
        </Link>
      ) : null}
    </div>
  );
}

const bundle = (url?: string, page?: number): string => {
  if (page != 1) return `${url || ""}?page=${page}`;
  return url || "";
};

const calcPrevNext = (
  blog: any,
  lang: string,
  _pageNum: number,
  perPage: number,
  page: Page<blogPageProps>,
) => {
  const pages = [...blog.getPages(lang)];
  const posts = getPosts(pages, lang, "");
  let prev: typeof page | undefined,
    next: typeof page | undefined,
    last: typeof page;
  let prevNumber: number = 1,
    nextNumber: number = 1,
    n: number = 1;
  posts.map((it) => {
    if (it.url === page.url) {
      prev = last;
      prevNumber = Math.floor((n + perPage - 1) / perPage);
    } else if (last && last.url === page.url) {
      next = it;
      nextNumber = Math.floor((n + perPage - 1) / perPage);
    }
    last = it;
    n++;
  });
  return { prev, next, prevNumber, nextNumber };
};

export type blogPageProps = {
  draft: boolean;
  title: string;
  comment: boolean;
  feedback: boolean;
  tags?: string[] | undefined;
  categories?: string | undefined;
  description?: string | undefined;
  icon?: string | undefined;
  full?: boolean | undefined;
  _openapi?: z.objectOutputType<{}, z.ZodTypeAny, "passthrough"> | undefined;
  date?: string | Date | undefined;
  author?:
    | string
    | {
        username?: string | undefined;
        name?: string | undefined;
        handle?: string | undefined;
        handleUrl?: string | undefined;
        avatar?: string | undefined;
      }[]
    | undefined;
  excerpt?: string | undefined;
  header?:
    | {
        teaser?: string | undefined;
        overlay_image?: string | undefined;
        overlay_filter?: string | undefined;
      }
    | undefined;
} & BaseCollectionEntry & { load: () => Promise<MarkdownProps> };

export type BreadcrumbProps = BreadcrumbOptions;

export function Breadcrumb(options: BreadcrumbProps) {
  const path = useTreePath();
  const { root } = useTreeContext();
  const items = useMemo(() => {
    return getBreadcrumbItemsFromPath(root, path, {
      includePage: options.includePage ?? false,
      ...options,
    });
  }, [options, path, root]);

  if (items.length === 0) return null;

  return (
    <div className="flex flex-row items-center gap-1.5 text-[15px] text-fd-muted-foreground">
      {items.map((item, i) => {
        const className = cn(
          "truncate",
          i === items.length - 1 && "text-fd-primary font-medium",
        );

        return (
          <Fragment key={i}>
            {i !== 0 && <span className="text-fd-foreground/30">/</span>}
            {item.url ? (
              <Link
                href={item.url}
                className={cn(className, "transition-opacity hover:opacity-80")}
              >
                {item.name}
              </Link>
            ) : (
              <span className={className}>{item.name}</span>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
