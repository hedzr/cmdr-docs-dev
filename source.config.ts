// import { defineDocs, defineConfig } from 'fumadocs-mdx/config';
import { defineDocs, defineConfig, frontmatterSchema, defineCollections } from 'fumadocs-mdx/config';
import { z } from "zod";
import {
  rehypeCodeDefaultOptions,
  remarkAdmonition,
  remarkHeading,
  remarkImage,
  remarkStructure
} from "fumadocs-core/mdx-plugins";
import remarkMath from "remark-math";
// import {remarkInstall} from "fumadocs-docgen";
import rehypeKatex from "rehype-katex";
import { remarkMermaid } from "@theguild/remark-mermaid";
// import { transformerTwoslash } from 'fumadocs-twoslash';

// export const docs = defineDocs({
//   dir: 'content/docs',
// });

// export default defineConfig({
//   mdxOptions: {
//     // MDX options
//   },
// });




export const docs = defineDocs({
  dir: 'content/docs',
  // docs: {
  //   async: true,
  //   schema: frontmatterSchema.extend({
  //     preview: z.string().optional(),
  //     index: z.boolean().default(true),
  //     /**
  //      * API routes only
  //      */
  //     method: z.string().optional(),
  //   }),
  // },
  // meta: {
  //   schema: metaSchema.extend({
  //     description: z.string().optional(),
  //   }),
  // },
});

// export const blog = defineDocs({
//   dir: 'content/blog',
// });

export const blog = defineCollections({
  type: 'doc',
  dir: 'content/blog',
  async: true,
  schema: frontmatterSchema.extend({
    author: z.string(),
    date: z.string().date().or(z.date()).optional(),
  }),
});

export default defineConfig({
  lastModifiedTime: 'git',
  // generateManifest: true,

  mdxOptions: {
    rehypeCodeOptions: {
      lazy: true,
      experimentalJSEngine: true,
      langs: ['ts', 'js', 'html', 'tsx', 'mdx'],
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
