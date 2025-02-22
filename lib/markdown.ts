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
  avatar?: string;
  handle?: string;
  username: string;
  handleUrl?: string;
};

export type BlogMdxFrontmatter = BaseMdxFrontmatter & {
  date: string;
  authors?: Author[];
  author?: Author;
  draft?: boolean;
  tags: string[];
  categories: string[];
};

export async function getAllBlogStaticPaths() {
  try {
    const blogFolder = path.join(process.cwd(), "/content/blog/");
    const res = await fs.readdir(blogFolder);
    return res.map((file) => file.split(".")[0]);
  } catch (err) {
    console.log(err);
  }
}

export async function getAllBlogs() {
  const blogFolder = path.join(process.cwd(), "/content/blog/");
  const files = await fs.readdir(blogFolder);
  return await Promise.all(
    files.map(async (file) => {
      const filepath = path.join(process.cwd(), `/content/blog/${file}`);
      const rawMdx = await fs.readFile(filepath, "utf-8");
      return {
        ...(await parseMdx<BlogMdxFrontmatter>(rawMdx)),
        slug: file.split(".")[0],
      };
    })
  );
}

export async function getBlogForSlug(slug: string) {
  const blogs = await getAllBlogs();
  return blogs.find((it) => it.slug == slug);
}
