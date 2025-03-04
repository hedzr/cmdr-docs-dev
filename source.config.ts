// import { defineDocs, defineConfig } from 'fumadocs-mdx/config';
import {
  defineDocs,
  defineConfig,
  frontmatterSchema,
  defineCollections,
  metaSchema
} from 'fumadocs-mdx/config';
import { z } from "zod";
import {
  rehypeCodeDefaultOptions,
  remarkAdmonition,
  remarkHeading,
  remarkImage,
  remarkStructure
} from "fumadocs-core/mdx-plugins";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { remarkMermaid } from "@theguild/remark-mermaid";
// import path from "path";
// import {remarkInstall} from "fumadocs-docgen";
// import { transformerTwoslash } from 'fumadocs-twoslash';

// export const docs = defineDocs({
//   dir: 'content/docs',
// });

// export default defineConfig({
//   mdxOptions: {
//     // MDX options
//   },
// });


const extensions = {
  // author: z.string(),
  author: z.union([
    z.string(),
    z.array(z.object({
      username: z.string().optional(),
      name: z.string().optional(),
      handle: z.string().optional(),
      handleUrl: z.string().optional(),
      avatar: z.string().optional(),
    })),
  ]).optional(),
  date: z.string().date().or(z.date()).optional(),
  // date: z.string().datetime({ offset: true }).or(z.date()).optional(),
  // last_modified_at: z.string().datetime({ offset: true }).or(z.date()).optional(), // z.string().date().or(z.date()).optional(),
  // last_modified_at: z.string().date().or(z.date()).optional(),
  // toc: z.boolean().default(false),
  draft: z.boolean().default(false),
  comment: z.boolean().default(false),
  feedback: z.boolean().default(false),
  excerpt: z.string().optional(),
  tags: z.array(z.string()).optional(),
  categories: z.string().optional(),
  header: z.object({
    teaser: z.string().optional(),
    overlay_image: z.string().optional(),
    overlay_filter: z.string().optional(),
  }).optional(),
};

export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    // async: true,
    schema: frontmatterSchema.extend(
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
  },
  meta: {
    schema: metaSchema.extend({
      description: z.string().optional(),
    }),
  },
});

// export const blog = defineDocs({
//   dir: 'content/blog',
// });

const useCollection = true;

export const blog = useCollection ? defineCollections({
  type: 'doc',
  dir: 'content/blog',
  async: true,
  // mdxOptions: getDefaultMDXOptions({
  //   // extended mdx options
  // }),
  schema: frontmatterSchema.extend(extensions),
}) : defineDocs({
  dir: 'content/docs',
  docs: {
    // async: true,
    schema: frontmatterSchema.extend(extensions),
  },
  meta: {
    schema: metaSchema.extend({
      description: z.string().optional(),
    }),
  },
});


export default defineConfig({
  lastModifiedTime: 'git',
  // generateManifest: true,
  mdxOptions: {
    rehypeCodeOptions: {
      // `lazy` is a must-have flag. code highlight effect couldn't work properly without it.
      lazy: true,
      experimentalJSEngine: true,
      // langs: ['ts', 'js', 'html', 'tsx', 'mdx'],
      inline: 'tailing-curly-colon',
      themes: {
        light: 'catppuccin-latte',
        dark: 'catppuccin-mocha',
        // light: 'github-light',
        // dark: 'github-dark',
      },
      transformers: [
        ...(rehypeCodeDefaultOptions.transformers ?? []),

        // transformerTwoslash(),

        {
          name: 'transformers:remove-notation-escape',
          code(hast) {
            for (const line of hast.children) {
              if (line.type !== 'element') continue;

              const lastSpan = line.children.findLast(
                (v) => v.type === 'element',
              );

              const head = lastSpan?.children[0];
              if (head?.type !== 'text') return;

              head.value = head.value.replace(/\[\\!code/g, '[!code');
            }
          },
        },
      ],
    },
    remarkPlugins: [
      // [remarkCodeHike, chConfig],
      remarkMath,
      [remarkImage,
        // {
        //   publicDir: path.join(process.cwd(), 'public'),
        // }
      ],
      remarkAdmonition,
      remarkHeading,
      remarkStructure,
      // [remarkInstall, { persist: { id: 'package-manager' } }],
      // [remarkDocGen, { generators: [fileGenerator()] }],
      // remarkTypeScriptToJavaScript,
      remarkMermaid,
    ],
    rehypePlugins: (v) => [
      rehypeKatex,
      // rehypeMDXImportMedia,
      ...v],
    // recmaPlugins: [[recmaCodeHike, chConfig]],
  },
});
