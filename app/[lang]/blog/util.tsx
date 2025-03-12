import {prodMode} from "@/lib/utils";
import {Page} from "fumadocs-core/source";
import {blogPageProps} from "@/lib/types";
import {blog} from "@/lib/source";

export const getPages = (lang: string) => {
  // // const pages = [...blog.getPages(lang)];
  // const pages = blog.getPages(lang);
  // const ret = sortPages(pages);
  // return ret;
  return blog.getPages(lang);
  // return sortPages(blog.getPages(lang));
};

export const sortPages = // cache(
  (pages: Page<blogPageProps>[]): Page<blogPageProps>[] => {
    // return pages.sort((a: Page<blogPageProps>, b: Page<blogPageProps>) =>
    //     stringToDatetime(b.data.date || "").getTime() -
    //     stringToDatetime(a.data.date || "").getTime(),
    // );
    return pages.reverse();
    // new Date(safeget(safeget(b, "date", {}), "date", "")).getTime() -
    // new Date(safeget(safeget(a, "date", {}), "date", "")).getTime(),
  };
// )

/**
 * filtering and sorting all posts and return new subset.
 * @param pages T[], unsorted, unfiltered posts
 * @param lang
 * @param query
 * @returns T[]
 */
export function filterPosts<T extends Page<blogPageProps>>(
  pages: T[],
  lang: string,
  query: string | string[],
): T[] {
  return pages.filter((v, _i, _a) => {
    if (!v) return false;

    // console.log(v, i);

    const fm = v.data;
    const slug = v.slugs.join("/");
    // const fm = safeget(v, "data", {});
    // const slug = safeget(v, "slugs", []).join("-");
    const log = false; // /(golang)/i.testByQueryString(slug);

    if (log) console.log(`searching for ${slug}`);
    if (typeof query !== "string") {
      for (const key in query) {
        if (key !== "") {
          if (testByQueryString(key, fm, slug, log)) {
            // const draft = safeget(fm, "draft", false);
            const draft = fm.draft;
            if (log)
              console.log(
                `search test q[] - '${key}' ok, and [draft test == ${
                  !draft || !prodMode
                }]: ${slug}`,
              );
            return !draft || !prodMode;
          }
        }
      }
      return false;
    }

    if (query !== "") {
      if (!testByQueryString(query, fm, slug, log)) return false;
      // const draft = safeget(fm, "draft", false);
      const draft = fm.draft;
      if (log)
        console.log(
          `search test q - '${query}' ok, and [draft test == ${
            !draft || !prodMode
          }]: ${slug}`,
        );
      return !draft || !prodMode;
    }

    // const draft = safeget(fm, "draft", false);
    const draft = fm.draft;
    if (log)
      console.log(
        `search final test '${query}' [draft test == ${
          !draft || !prodMode
        }]: ${slug}`,
      );
    return !draft || !prodMode;
  });
}

export function extractPostsByPage<T>(
  posts: T[],
  page: number,
  perpage: number,
): { posts: T[]; maxPage: number } {
  const start = (page - 1) * perpage, stop = page * perpage;
  const pagemax = Math.floor((posts.length + perpage - 1) / perpage);

  // console.log(`getAllBlogs: total=${items.length}, pages=${pagemax}, page=${page}, start=${start}, stop=${stop}`);

  const items = posts.filter((_val, idx, _allfiles) => {
    // console.log('filtering', val[0], val, idx);
    return start <= idx && idx < stop;
  });

  // console.log(items);

  return { posts: items, maxPage: pagemax };
}

const testByQueryString = (
  qry: string,
  fm: blogPageProps,
  slug: string,
  log: boolean = false,
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
    if (q.test(fm.excerpt ?? '')) { // safeget(fm, "excerpt", ""))) {
      if (log) console.log(`searched ok [excerpt]: ${slug}`);
      return true;
    }
    if (fm.categories) { // isFieldValid(fm, "categories")) {
      // const t = safeget(fm, "categories", "");
      if (q.test(fm.categories)) {
        if (log)
          console.log(
            `searched ok (q=${q.toString()}) [category(${fm.categories})]: ${slug}`,
          );
        return true;
      }
    }
  }
  if (fm.tags) { // isFieldValid(fm, "tags")) {
    // const t = safeget(fm, "tags", "");
    if (q.test(fm.tags.join(','))) {
      if (log) console.log(`searched ok [tag(${fm.tags})]: ${slug}`);
      return true;
    }
  }
  return false;
};
