// import { type ClassValue, clsx } from "clsx";
// import { twMerge } from "tailwind-merge";
// import { EachRoute, getRoutesForVersion, Version } from "./routes-config";

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// export function helperSearch(
//   query: string,
//   node: EachRoute,
//   prefix: string,
//   currenLevel: number,
//   maxLevel?: number
// ) {
//   const res: EachRoute[] = [];
//   let parentHas = false;
//
//   const nextLink = `${prefix}${node.href}`;
//   if (!node.noLink && node.title.toLowerCase().includes(query.toLowerCase())) {
//     res.push({ ...node, items: undefined, href: nextLink });
//     parentHas = true;
//   }
//   const goNext = maxLevel ? currenLevel < maxLevel : true;
//   if (goNext)
//     node.items?.forEach((item) => {
//       const innerRes = helperSearch(
//         query,
//         item,
//         nextLink,
//         currenLevel + 1,
//         maxLevel
//       );
//       if (!!innerRes.length && !parentHas && !node.noLink) {
//         res.push({ ...node, items: undefined, href: nextLink });
//         parentHas = true;
//       }
//       res.push(...innerRes);
//     });
//   return res;
// }
//
// export function advanceSearch(query: string, v: Version) {
//   const routes = getRoutesForVersion(v);
//   return routes
//     .map((node) =>
//       helperSearch(query, node, "", 1, query.length == 0 ? 2 : undefined)
//     )
//     .flat();
// }

// Thursday, May 23, 2024
export function formatDate(dateStr: string, lang: string): string {
  const dta = dateStr.split(" ");
  const [day, month, year] = dta[0].split("-").map(Number);
  const date = new Date(year, month - 1, day);

  if (day > 1970) {
    const y = day, m = month, d = year;
    const date = new Date(y, m - 1, d);
    return dateToString(date, lang ?? 'en-US');
  }

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return date.toLocaleDateString(lang ?? "en-US", options);
}

function dateToString(date: Date, lang: string): string {
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  return date.toLocaleDateString(lang, options);
}

//  May 23, 2024
export function formatDate2(dateStr: string, lang?: string): string {
  if (!dateStr) return 'Jan 29, 1979';
  const dta = dateStr.split(" ");
  const [day, month, year] = dta[0].split("-").map(Number);
  if (day > 1970) {
    const y = day, m = month, d = year;
    const date = new Date(y, m - 1, d);
    return dateToString(date, lang ?? 'en-US');
  }
  const date = new Date(year, month - 1, day);
  return dateToString(date, lang ?? 'en-US');
}

//
export function stringToDate(date: string) {
  if (!date) return new Date(1973, 3, 13);
  const dta = date.split(" ");
  const [day, month, year] = dta[0].split("-").map(Number);
  if (day > 1970) {
    const y = day, m = month, d = year;
    return new Date(y, m - 1, d);
  }
  return new Date(year, month - 1, day);
}
