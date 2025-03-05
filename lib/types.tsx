// blogPageProps

import {BaseCollectionEntry, MarkdownProps} from "fumadocs-mdx/config";
import {z} from "zod";

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
