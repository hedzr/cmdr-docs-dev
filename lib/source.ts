import { docs, blog as blogPosts } from '@/.source';
import { InferMetaType, InferPageType, loader, LoadOptions, FileInfo } from 'fumadocs-core/source';
import { i18n } from "./i18n";
// import { createOpenAPI } from "fumadocs-openapi/server";
// import { docs, blog as blogPosts } from "@/.source"
import { createMDXSource } from 'fumadocs-mdx';
import { createElement } from "react";
import { icons } from "lucide-react";
import { attachFile, createOpenAPI } from 'fumadocs-openapi/server';
import { prodMode } from "@/lib/utils";

export const source = loader({
  baseUrl: '/docs',
  // source: createMDXSource(docs.docs, docs.meta),
  source: docs.toFumadocsSource(),
  icon(icon) {
    if (icon && icon in icons)
      return createElement(icons[icon as keyof typeof icons]);
  },
  pageTree: {
    attachFile,
  },
  i18n: i18n
});

export const openapi = createOpenAPI();

// export const usingCollection = true;

interface MetaData {
  icon?: string | undefined;
  title?: string | undefined;
  root?: boolean | undefined;
  pages?: string[] | undefined;
  defaultOpen?: boolean | undefined;

  description?: string | undefined;
}
interface MetaFile {
  file: FileInfo;
  format: 'meta';
  data: MetaData;
}
interface PageData {
  icon?: string | undefined;
  title?: string;
  draft?: boolean;
  footer?: {
    prev?: {
      url?: string | undefined;
      title?: string | undefined;
      page: number;
      index: number;
      slugs: string[];
    },
    next?: {
      url?: string | undefined;
      title?: string | undefined;
      page: number;
      index: number;
      slugs: string[];
    }
  } | undefined;
}
interface PageFile {
  file: FileInfo;
  format: 'page';
  data: {
    slugs: string[];
    data: PageData;
  };
}

type File = MetaFile | PageFile;

// calculating slugs of prev and next post to optimize the performance.
const prevNextIdxTransformer = (ctx: { storage: { files: Map<string, File>; }; options: LoadOptions; }) => {
  let files = [...ctx.storage.files.values()];
  let idx = 0, total = files.length;
  const notdraft = (draft: boolean): boolean => {
    return prodMode || !draft;
  };
  files.forEach((v, i, m) => {
    if (v.format == 'page' && notdraft(v.data.data.draft ?? false)) {
      // console.log(`${i}. ${prodMode}, ${v.data.data.draft ?? false} | ${v.data.slugs}`);
      if (idx == 0)
        v.data.data.footer = {
          prev: {
            page: 0,//no use
            index: total - idx - 1,//real index in the valid post set with positive order
            slugs: files[idx + 1].data.slugs,
            title: files[idx + 1].data.data.title
          }
        };
      else if (i == files.length - 1)
        v.data.data.footer = {
          next: {
            page: 0,
            index: total - idx + 1,
            slugs: files[idx - 1].data.slugs,
            title: files[idx - 1].data.data.title
          }
        };
      else
        v.data.data.footer = {
          next: { page: 0, index: total - idx + 1, slugs: files[idx - 1].data.slugs, title: files[idx - 1].data.data.title },
          prev: { page: 0, index: total - idx - 1, slugs: files[idx + 1].data.slugs, title: files[idx + 1].data.data.title }
        };
      idx++;
    }
  });
  // console.log(`options: ${JSON.stringify(ctx.options)}, files:`, files[5].data.data.footer);
  // console.log('post:', files[5]);
  if (!prodMode) console.log(`[source] footer.prev/next constructed. ${total} files processed, ${idx} posts used.`);
  return;
};

export const blog = loader({
  baseUrl: '/blog',
  source: createMDXSource(blogPosts),
  // source: createMDXSource(docs.docs, docs.meta),
  i18n: i18n,

  // pre-calculating the prev/next post info.
  transformers: [prevNextIdxTransformer],
  // strip the leading y-m-d- prefix of a .mdx filename,
  // as the final slug(s).
  slugs: (info: FileInfo): string[] => {
    // remove date prefix like '2020-02-02-' from .mdx filename.
    return info.name.replace(/^\d{2,4}-\d\d?-\d\d?-/i, '').split('/');
  },
});

// ' : loader({
//   baseUrl: '/blog',
//   source: createMDXSource(blogPosts.docs, blogPosts.meta),
//   // source: blogPosts.toFumadocsSource(),
//   //
//   // icon(icon) {
//   //   if (icon && icon in icons)
//   //     return createElement(icons[icon as keyof typeof icons]);
//   // },
//   // pageTree: {
//   //   attachFile,
//   // },
//   i18n: i18n
// });


export type Page = InferPageType<typeof source>;
export type Meta = InferMetaType<typeof source>;
