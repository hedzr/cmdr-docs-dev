import { safeget, isFieldValid } from "@/lib/utils";
import { LoaderOutput, MetaData } from "fumadocs-core/source";
import { BaseCollectionEntry, MarkdownProps } from "fumadocs-mdx/config";
import { objectOutputType, ZodTypeAny } from "zod";

export const prodMode = process.env.NODE_ENV === "production";

const test = (
  qry: string,
  fm: any,
  slug: string,
  log: boolean = false
): boolean => {
  const qq = qry.replace(/[+-\[\]*\/\\{}()?^$]/g, (v) => {
    return "\\" + v;
  });
  // const qq = RegExp.escape(qry);
  // console.log(qq);
  const tagsOnly = qq.startsWith("#");
  const q = tagsOnly ? new RegExp(qq.substring(1)) : new RegExp("\\b" + qq); // `\bgo` will match 'go', 'golang', but `algo`
  // const tt = v.slug == 'time-travle';
  // if (tt) console.log(fm);
  if (!tagsOnly) {
    if (q.test(fm.title) || q.test(fm.description || "") || q.test(slug)) {
      if (log) console.log(`searched ok [title|desc|slug]: ${slug}`);
      return true;
    }
    if (q.test(safeget(fm, "excerpt", ""))) {
      if (log) console.log(`searched ok [excerpt]: ${slug}`);
      return true;
    }
    if (isFieldValid(fm, "categories")) {
      const t = safeget(fm, "categories", "");
      if (q.test(t)) {
        if (log)
          console.log(
            `searched ok (q=${q.toString()}) [category(${t})]: ${slug}`
          );
        return true;
      }
      // if (typeof fm['categories'] === "string") {
      //   if (q.test(fm.categories)) {
      //     if (log)
      //       console.log(
      //         `searched ok (q=${q.toString()}) [category(${fm.categories})]: ${slug}`
      //       );
      //     return true;
      //   }
      // } else {
      //   let ret = fm.categories.filter((it) => {
      //     return q.test(it);
      //   });
      //   const r = Array.isArray(ret) && ret.length != 0;
      //   if (log)
      //     console.log(
      //       `searched ${r} (q=${q.toString()}) [category[](${fm.categories})]: ${slug}`
      //     );
      //   if (r) return r;
      // }
    }
  }
  if (isFieldValid(fm, "tags")) {
    const t = safeget(fm, "tags", "");
    if (q.test(t)) {
      if (log) console.log(`searched ok [tag(${t})]: ${slug}`);
      return true;
    }
    // if (typeof fm.tags === "string") {
    //   if (q.test(fm.tags)) {
    //     if (log) console.log(`searched ok [tag(${fm.tags})]: ${slug}`);
    //     return true;
    //   }
    // } else {
    //   let ret = fm.tags.filter((it) => {
    //     return q.test(it);
    //   });
    //   const r = Array.isArray(ret) && ret.length != 0;
    //   if (log)
    //     console.log(
    //       `searched ${r} filter [tags[](${fm.tags})]: ${slug}`,
    //       ret
    //     );
    //   // if (log) {
    //   //   fm.tags.filter((it) => {
    //   //     if (q.test(it)) {
    //   //       return true;
    //   //     }
    //   //     console.log(`searched filter false [${it}]: ${q.toString()}, ${qq}`);
    //   //     return false;
    //   //   });
    //   // }
    //   if (r) return r;
    // }
  }
  return false;
};

export function getPosts(
  blog: LoaderOutput<{
    source: {
      pageData: {
        draft: boolean;
        title: string;
        author:
          | string
          | {
              username?: string | undefined;
              name?: string | undefined;
              handle?: string | undefined;
              handleUrl?: string | undefined;
              avatar?: string | undefined;
            }[];
        comment: boolean;
        feedback: boolean;
        description?: string | undefined;
        categories?: string | undefined;
        tags?: string[] | undefined;
        excerpt?: string | undefined;
        icon?: string | undefined;
        full?: boolean | undefined;
        _openapi?: objectOutputType<{}, ZodTypeAny, "passthrough"> | undefined;
        date?: string | Date | undefined;
        header?:
          | {
              teaser?: string | undefined;
              overlay_image?: string | undefined;
              overlay_filter?: string | undefined;
            }
          | undefined;
      } & BaseCollectionEntry & { load: () => Promise<MarkdownProps> };
      metaData: MetaData & BaseCollectionEntry;
    };
    i18n: true;
  }>,
  lang: string,
  query: string | string[]
) {
  const posts = [...blog.getPages(lang)]
    .filter((v, i, a) => {
      if (!v) return false;

      // console.log(v, i);

      const fm = v.data;
      const slug = v.slugs.join("-");
      const log = false; // /(golang)/i.test(slug);

      if (log) console.log(`searching for ${slug}`);
      if (typeof query !== "string") {
        for (const key in query) {
          if (key !== "") {
            if (test(key, fm, slug, log)) {
              const draft = safeget(fm, "draft", false);
              if (log)
                console.log(
                  `search test q[] - '${key}' ok, and [draft test == ${!draft || !prodMode}]: ${slug}`
                );
              return !draft || !prodMode;
            }
          }
        }
        return false;
      } else if (query !== "") {
        if (!test(query, fm, slug, log)) return false;
        const draft = safeget(fm, "draft", false);
        if (log)
          console.log(
            `search test q - '${query}' ok, and [draft test == ${!draft || !prodMode}]: ${slug}`
          );
        return !draft || !prodMode;
      }

      const draft = safeget(fm, "draft", false);
      if (log)
        console.log(
          `search final test '${query}' [draft test == ${!draft || !prodMode}]: ${slug}`
        );
      return !draft || !prodMode;
    })
    .sort(
      (a, b) =>
        new Date(b.data.date ?? b.file.name).getTime() -
        new Date(a.data.date ?? a.file.name).getTime()
    );
  return posts;
}

export function filterPostsByPage<T>(
  posts: T[],
  page: number,
  perpage: number
): { posts: T[]; maxPage: number } {
  const start = (page - 1) * perpage,
    stop = page * perpage;
  const pagemax = Math.floor((posts.length + perpage - 1) / perpage);

  // console.log(`getAllBlogs: total=${items.length}, pages=${pagemax}, page=${page}, start=${start}, stop=${stop}`);

  const items = posts.filter((_val, idx, _allfiles) => {
    // console.log('filtering', val[0], val, idx);
    return start <= idx && idx < stop;
  });

  // console.log(items);

  return { posts: items, maxPage: pagemax };
}
