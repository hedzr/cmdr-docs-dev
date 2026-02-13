import { defineConfig, defineDocs } from 'fumadocs-mdx/config';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';
import lastModified from 'fumadocs-mdx/plugins/last-modified';
import { remarkFeedbackBlock } from 'fumadocs-core/mdx-plugins/remark-feedback-block';
import { transformerTwoslash } from 'fumadocs-twoslash';
import { rehypeCodeDefaultOptions, remarkMdxMermaid } from 'fumadocs-core/mdx-plugins';

import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import z from 'zod';

// You can customise Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.dev/docs/mdx/collections
export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: pageSchema.extend(
      {
        // preview: z.string().optional(),
        // index: z.boolean().default(true),
        // /**
        //  * API routes only
        //  */
        // method: z.string().optional(),
        date: z.union([
          z.string().date(),
          z.string().datetime({ offset: true }),
          z.date()]).optional(),
        // // date: z.string().datetime({ offset: true }).or(z.date()).optional(),
        // last_modified_at: z.string().datetime({ offset: true }).or(z.date()).optional(), // z.string().date().or(z.date()).optional(),
        // // last_modified_at: z.string().date().or(z.date()).optional(),
        // // last_modified_at: z.string().datetime({ offset: true }).optional(), // z.string().date().or(z.date()).optional(),
        draft: z.boolean().default(false),
        feedback: z.boolean().default(false),
        excerpt: z.string().optional(),
        tags: z.array(z.string()).optional(),
        categories: z.string().optional(),
      }
    ),
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema.extend({
      // description: z.string().optional(),
    }),
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
      langs: [
        'js', 'jsx', 'ts', 'tsx',
        'go',
        'angular-ts', 'asm',
        'bash', 'zsh', 'fish', 'shell', 'shellscript',
        'c', 'c#', 'c++', 'c3',
        'diff', 'docker', 'dockerfile',
        'hjson',
        'jinja',
        'kotlin',
        'latex', 'llvm', 'lua',
        'make', 'makefile', 'md', 'mdx', 'mermaid',
        'protobuf', 'ps1', 'python',
        'riscv', 'rust',
        'sass', 'swift', 'ssh-config', 'sql',
        'toml',
        'verilog', 'vim',
        'wasm', 'wiki',
        'xml', 'xsl', 'yaml', 'yml',
        'zig',
      ],
    },
  },
});
