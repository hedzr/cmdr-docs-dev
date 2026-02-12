import { defineConfig, defineDocs } from 'fumadocs-mdx/config';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';
import lastModified from 'fumadocs-mdx/plugins/last-modified';
import { remarkFeedbackBlock } from 'fumadocs-core/mdx-plugins/remark-feedback-block';
import { transformerTwoslash } from 'fumadocs-twoslash';
import { rehypeCodeDefaultOptions, remarkMdxMermaid } from 'fumadocs-core/mdx-plugins';

import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';

// You can customise Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.dev/docs/mdx/collections
export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: pageSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

export default defineConfig({
  plugins: [lastModified()],
  mdxOptions: {
    // MDX options
    remarkPlugins: [remarkFeedbackBlock, remarkMath, remarkMdxMermaid],
    // Place it at first, it should be executed before the syntax highlighter
    rehypePlugins: (v) => [rehypeKatex, ...v],
    rehypeCodeOptions: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      transformers: [...(rehypeCodeDefaultOptions.transformers ?? []), transformerTwoslash()],
      // important: Shiki doesn't support lazy loading languages for codeblocks in Twoslash popups
      // make sure to define them first (e.g. the common ones)
      langs: ['js', 'jsx', 'ts', 'tsx'],
    },
  },
});
