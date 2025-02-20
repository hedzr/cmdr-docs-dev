import { docs, blog as blogPosts } from '@/.source';
import { InferMetaType, InferPageType, loader } from 'fumadocs-core/source';
import { i18n } from "./i18n";
// import { createOpenAPI } from "fumadocs-openapi/server";
// import { docs, blog as blogPosts } from "@/.source"
import { createMDXSource } from 'fumadocs-mdx';
import { createElement } from "react";
import { icons } from "lucide-react";
import { attachFile, createOpenAPI } from 'fumadocs-openapi/server';

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

export const blog = loader({
  baseUrl: '/blog',
  source: createMDXSource(blogPosts),
});

export type Page = InferPageType<typeof source>;
export type Meta = InferMetaType<typeof source>;
