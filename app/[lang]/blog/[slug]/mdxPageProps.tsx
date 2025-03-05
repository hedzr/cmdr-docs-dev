import {BaseCollectionEntry, MarkdownProps} from "fumadocs-mdx/config";
import {z} from "zod";

type mdxPageProps = Omit<
  MarkdownProps,
  | ("title" | "draft" | "comment" | "feedback")
  | (
  | "author"
  | "tags"
  | "categories"
  | "header"
  | "date"
  | "description"
  | "icon"
  | "full"
  | "_openapi"
  | "excerpt"
  )
> & {
  title: string;
  draft: boolean;
  comment: boolean;
  feedback: boolean;
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
  tags?: string[] | undefined;
  categories?: string | undefined;
  header?:
    | {
    teaser?: string | undefined;
    overlay_image?: string | undefined;
    overlay_filter?: string | undefined;
  }
    | undefined;
  date?: string | Date | undefined;
  description?: string | undefined;
  icon?: string | undefined;
  full?: boolean | undefined;
  _openapi?: z.objectOutputType<{}, z.ZodTypeAny, "passthrough"> | undefined;
  excerpt?: string | undefined;
} & BaseCollectionEntry;
export default mdxPageProps;
