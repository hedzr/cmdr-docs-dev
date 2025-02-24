import { compileMDX } from "next-mdx-remote/rsc";
import path from "path";
import { promises as fs, existsSync } from "fs";
import remarkGfm from "remark-gfm";
import rehypePrism from "rehype-prism-plus";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import rehypeCodeTitles from "rehype-code-titles";
import { visit } from "unist-util-visit";

// custom components imports
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import Pre from "@/components/removed/pre";
import Note from "@/components/ui/note";
import { Stepper, StepperItem } from "@/components/ui/stepper";
import { availableVersions } from "./routes-config";
import { CodeBlock } from "@/components/ui/ui/code-block";
import { stringToDate } from "./utils";
// import { CodeWithTabs } from "@/components/markdown/code-with-tabs";

// const latestString = availableVersions[0];
const latestVersion = availableVersions[1];

// add custom components
const components = {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  // pre: Pre,
  Note,
  Stepper,
  StepperItem,
  // CodeWithTabs,
  CodeBlock,
};

// can be used for other pages like blogs, Guides etc
async function parseMdx<Frontmatter>(rawMdx: string) {
  return await compileMDX<Frontmatter>({
    source: rawMdx,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        rehypePlugins: [
          preProcess,
          rehypeCodeTitles,
          // https://github.com/mapbox/rehype-prism?tab=readme-ov-file#optionsignoremissing
          [rehypePrism, { ignoreMissing: true, }],
          rehypeSlug,
          rehypeAutolinkHeadings,
          postProcess,
        ],
        remarkPlugins: [remarkGfm],
      },
    },
    components,
  });
}

// logic for docs

export type BaseMdxFrontmatter = {
  title: string;
  description: string;
};

// export async function getDocsForSlug(slug: string) {
//   try {
//     if (/^latest/.test(slug))
//       slug = slug.replace(/^latest/, latestVersion);
//     const contentPath = getDocsContentPath(slug);
//     const rawMdx = await fs.readFile(contentPath, "utf-8");
//     return await parseMdx<BaseMdxFrontmatter>(rawMdx);
//   } catch (err) {
//     console.log(err);
//   }
// }
//
// export async function getDocsTocs(slug: string) {
//   if (/^latest/.test(slug))
//     slug = slug.replace(/^latest/, latestVersion);
//   const contentPath = getDocsContentPath(slug);
//   const rawMdx = await fs.readFile(contentPath, "utf-8");
//   // captures between ## - #### can modify accordingly
//   const headingsRegex = /^(#{2,4})\s(.+)$/gm;
//   let match;
//   const extractedHeadings = [];
//   while ((match = headingsRegex.exec(rawMdx)) !== null) {
//     const headingLevel = match[1].length;
//     const headingText = match[2].trim();
//     const slug = sluggify(headingText);
//     extractedHeadings.push({
//       level: headingLevel,
//       text: headingText,
//       href: `#${slug}`,
//     });
//   }
//   return extractedHeadings;
// }
//
// function sluggify(text: string) {
//   const slug = text.toLowerCase().replace(/\s+/g, "-");
//   return slug.replace(/[^a-z0-9-]/g, "");
// }
//
// function getDocsContentPath(slug: string) {
//   if (/^latest/.test(slug))
//     slug = slug.replace(/^latest/, latestVersion);
//   let p = path.join(process.cwd(), "/contents/docs/", `${slug}/index.mdx`);
//   if (existsSync(p))
//     return p;
//   return path.join(process.cwd(), "/contents/docs/", slug + ".mdx");
// }

// for copying the code
const preProcess = () => (tree: any) => {
  visit(tree, (node) => {
    if (node?.type === "element" && node?.tagName === "pre") {
      const [codeEl] = node.children;
      if (codeEl.tagName !== "code") return;
      node.raw = codeEl.children?.[0].value;
    }
  });
};

const postProcess = () => (tree: any) => {
  visit(tree, "element", (node) => {
    if (node?.type === "element" && node?.tagName === "pre") {
      node.properties["raw"] = node.raw;
      // console.log(node);
    }
  });
};

export type Author = {
  username: string;
  avatar?: string;
  handle?: string;
  handleUrl?: string;
};

/**
 * Sample:
 * @code{yaml}
 * header:
 *   teaser: https://raw.githubusercontent.com/hzimg/blog-pics/master/uPic/image-20211028185204870.png
 *   overlay_image: /assets/images/3953273590_704e3899d5_m.jpg
 *   overlay_filter: rgba(16, 16, 32, 0.73)
 * @endcode
 */
export type FeaturedImage = {
  teaser: string;
  overlay_image: string;
  overlay_filter: string;
};

export type BlogMdxFrontmatter = BaseMdxFrontmatter & {
  date: string;
  authors?: Author[];
  author?: Author;
  draft?: boolean; // just showing at local dev server
  preview?: boolean; // preview mode, like draft but it's public and showing always

  toc?: boolean;
  comment?: boolean;
  feedback?: boolean;
  layout?: string; // single, full, ...
  tags?: string | string[];
  categories?: string | string[];
  excerpt?: string;
  header?: FeaturedImage;
  cover?: string; // caver image if necessary

  // featuredImage: {
  //     node: {
  //       sourceUrl: string;
  //     };
  // };
  // categories: {
  //     edges: {
  //         node: {
  //             name: string;
  //         };
  //     }[];
  // };
};

export async function getAllBlogStaticPaths() {
  try {
    const blogFolder = path.join(process.cwd(), "/content/blog/");
    const res = await fs.readdir(blogFolder);
    return res.filter((val, idx, allfiles) => {
      return val[0] !== '.' && val.endsWith('.mdx');
    }).map((file) => file.split(".")[0]);
  } catch (err) {
    console.log(err);
  }
}

export async function getAllBlogs(page: number = 1, perpage: number = 7) {
  const blogFolder = path.join(process.cwd(), "/content/blog/");
  const files = await fs.readdir(blogFolder);

  console.log(`getAllBlogs: page=${page}, perpage=${perpage}`);

  const items = await Promise.all(
    files.filter((val, idx, allfiles) => {
      return val[0] !== '.' && val.endsWith('.mdx');
    }).map(async (file) => {
      try {
        const filepath = path.join(process.cwd(), `/content/blog/${file}`);
        const rawMdx = await fs.readFile(filepath, "utf-8");
        return {
          ...(await parseMdx<BlogMdxFrontmatter>(rawMdx)),
          slug: file.split(".")[0],
          file: filepath,
        };
      } catch (err) {
        console.log(err);
      }
    })
  )

  const start = (page - 1) * perpage, stop = page * perpage;
  const pagemax = Math.floor((items.length + perpage - 1) / perpage);
  console.log(`getAllBlogs: total=${items.length}, pages=${pagemax}, page=${page}, start=${start}, stop=${stop}`);
  return {
    page: page,
    perpage: perpage,
    total: items.length,
    maxpage: pagemax,
    items: items.sort((a, b) =>
      stringToDate(b?.frontmatter.date ?? "").getTime() -
      stringToDate(a?.frontmatter.date ?? "").getTime()
    ).filter((val, idx, allfiles) => {
      // console.log('filtering', val[0], val, idx);
      return start <= idx && idx < stop;
    })
  };
}

export async function getBlogForSlug(slug: string) {
  const blogFolder = path.join(process.cwd(), "/content/blog/");
  const filepath = path.join(blogFolder, slug + '.mdx');

  // console.log(`getBlogForSlug: slug=${slug}, filepath=${filepath}`);
  const rawMdx = await fs.readFile(filepath, "utf-8");
  return {
    ...(await parseMdx<BlogMdxFrontmatter>(rawMdx)),
    slug: slug,
    file: filepath,
  };
  // const blogs = await getAllBlogs();
  // return blogs.items.find((it) => it ? it.slug == slug : false);
}
