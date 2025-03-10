// import { type ClassValue, clsx } from "clsx";
// import { twMerge } from "tailwind-merge";
// import { EachRoute, getRoutesForVersion, Version } from "./routes-config";

import path from 'path'
import getConfig from 'next/config'

// prodMode or dev/preview mode ------------------------

export const prodMode = process.env.NODE_ENV === "production";

// -----------------------------------------------------

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
export function formatDate2(dateStr: string | Date, lang?: string): string {
  if (!dateStr) return 'Jan 29, 1979';
  if (dateStr instanceof Date) {
    return dateToString(dateStr, lang ?? 'en-US');
  }
  const dta = dateStr.split(/[ T]/);
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

export function stringToDatetime(date: string | Date) {
  if (!date) return new Date(1973, 3, 13);
  if (date instanceof Date) return date;
  try {
    const d = new Date(date);
    return d;
  } catch (e) {
    const dta = date.split(/[ T]/);
    const [day, month, year] = dta[0].split("-").map(Number);
    const [h, m, s] = dta.length > 1 ? dta[1].split(":").map(Number) : [0, 0, 0];
    if (day > 1970) {
      const y = day, m = month, d = year;
      return new Date(y, m - 1, d, h, m, s);
    }
    return new Date(year, month - 1, day, h, m, s);
  }
}

export function safe(s: any, defval: string = ''): string {
  if (!s) return defval;
  if (typeof s === 'string') return s;
  return s.toString();
}

export function safeget<T>(cont: any, prop: string, defval: T): T {
  if (!cont) return defval;
  if (prop in cont) return cont[prop];
  return defval;
}

export function isFieldValid(cont: any, prop: string): boolean {
  if (!cont) return false;
  if (prop in cont) return !!cont[prop];
  return false;
}

const serverPublicPath = (staticFilePath: string): string => {
  // const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()

  return path.join(getConfig().publicRuntimeConfig.staticFolder, staticFilePath)
}

export default serverPublicPath
