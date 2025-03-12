"use client";
import { ChevronLeft, ChevronRight, Share } from "lucide-react";
import {
  TooltipContent,
  Tooltip,
  TooltipTrigger,
  TooltipProvider,
} from "@radix-ui/react-tooltip";
import React, { ReactNode, useState } from "react";
import { cn } from "@/lib/cn";
// import { buttonVariants } from "@/components/ui/button";
import { useI18n } from "fumadocs-ui/provider";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FooterProps } from "@/page.client";
import { ReadonlyURLSearchParams } from "next/dist/client/components/navigation.react-server";
import { buttonVariants1 } from "@/components/ui/button1";
import { cva } from "class-variance-authority";

export function Control({ url }: { url: string }): React.ReactElement {
  const [open, setOpen] = useState(false);
  const onClick = (): void => {
    setOpen(true);
    void navigator.clipboard.writeText(`${window.location.origin}${url}`);
  };

  return (
    <TooltipProvider>
      <Tooltip open={open} onOpenChange={setOpen}>
        <TooltipTrigger
          className={cn(
            buttonVariants1({ className: "gap-2", variant: "secondary" }),
          )}
          onClick={onClick}
        >
          <Share className="size-4" />
          Share Post
        </TooltipTrigger>
        <TooltipContent className="rounded-lg border bg-fd-popover p-2 text-sm text-fd-popover-foreground">
          Copied
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export const A = (props) => <a {...props} />;

export function Anchor({ name }: { name: string }): React.ReactElement {
  return <a name={name}></a>;
}

const itemVariants = cva(
  "flex w-full flex-col gap-2 rounded-lg border bg-fd-card p-4 text-sm transition-colors hover:bg-fd-accent/80 hover:text-fd-accent-foreground",
);

const itemLabel = cva(
  "inline-flex items-center gap-0.5 text-fd-muted-foreground",
);

export function FooterNoCache(props: {
  lang: string;
  prevUrl?: string;
  nextUrl?: string;
  prevTitle?: string;
  nextTitle?: string;
  prevNumber: number;
  nextNumber: number;
}): ReactNode {
  const { text } = useI18n();

  // const { currentPage, perPage } = getPageNumber();

  // console.log(`--- blog page ${params} 2 ----`);
  // <Link href={bundle(prev.url, prevNumber)}>
  // <ChevronLeft className="-ms-1 size-4 shrink-0 rtl:rotate-180" />
  // {/* <p>{text.previousPage}</p> */} Newer:
  // <p>{prev.data.title || ""}</p>

  const o: FooterProps = {
    items: {
      previous: {
        url: bundle(props.prevUrl, props.prevNumber),
        name: props.prevTitle || "",
      },
      next: {
        url: bundle(props.nextUrl, props.nextNumber),
        name: props.nextTitle || "",
      },
    },
  };
  const items = o.items;

  return (
    <div className="not-prose grid grid-cols-2 gap-4 pb-6">
      {items?.previous.url ? (
        <Link href={items.previous.url} className={cn(itemVariants())}>
          <div className={cn(itemLabel())}>
            <ChevronLeft className="-ms-1 size-4 shrink-0 rtl:rotate-180" />
            <p>{text.previousPage}</p>
          </div>
          <p className="font-medium">{items.previous.name}</p>
        </Link>
      ) : null}
      {items?.next.url ? (
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

export function BlogBackToListButton(_props: { lang: string }): ReactNode {
  const v = useSearchParams();
  const page = v.get("page");
  const perpage = v.get("perpage");
  const p = (page || "1") == "1" ? "" : `&page=${page}`;
  const pp = (perpage || "7") == "7" ? "" : `&perpage=${perpage}`;
  // console.log(`BlogBackToListButton: v: ${v}, page: ${page}`);
  return (
    <Link
      href={`/blog/?s${p}${pp}`}
      className={buttonVariants1({ size: "sm", variant: "secondary" })}
    >
      <span className="back">Back to list</span>
    </Link>
  );
}

export function BlogTagButton(props: { lang: string; tag: string }): ReactNode {
  const v = useSearchParams();
  const page = v.get("page");
  const perpage = v.get("perpage");
  const p = (page || "1") == "1" ? "" : `&page=${page}`;
  const pp = (perpage || "7") == "7" ? "" : `&perpage=${perpage}`;
  // const { currentPage } = getPageNumber();
  return (
    <Link
      href={`/${props.lang}/blog/?query=%23${encodeURIComponent(props.tag)}${p}${pp}`}
      className="rounded gap-2 p-2 py-1 m-1 border-1 border-zinc-400 text-sm text-zinc-900 bg-sky-500"
      key={props.tag}
    >
      {props.tag}
    </Link>
  );
}

export function getPageNumber(): { currentPage: number; perPage: number } {
  // let sp: ReadonlyURLSearchParams & {
  //   page?: number | string;
  //   perpage?: number | string;
  // };
  // sp = useSearchParams() as typeof sp;
  const v = useSearchParams();
  const page = v.get("page");
  const perpage = v.get("perpage");

  const currentPage = Number(page || "1");
  const perPage = Number(perpage || "7");
  return { currentPage: currentPage, perPage: perPage };
}

const bundle = (url?: string, page?: number): string => {
  if (page != 1) return `${url || ""}?page=${page}`;
  return url || "";
};
