import { PropsWithChildren, ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Footer from "@/components/layout/footer";
import getConfig from "next/config";
import path from "path";
import * as fs from "node:fs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const littleDebug = true;

export default function BlogLayout({
  // params,
  // searchParams,
  children,
}: {
  // params?: Promise<{ lang: string }>;
  // searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
  children: ReactNode; // PropsWithChildren;
}) {
  const { serverRuntimeConfig } = getConfig();

  if (littleDebug) {
    // runtime value: /var/task
    const cwd2 = process.cwd();

    // const o = fs.existsSync(path.join(cwd2, "content/blog/file-rec.mdx"));
    // console.log(`--- [BlogLayout] cwd: ${cwd2} | PRJ_ROOT: ${serverRuntimeConfig.PROJECT_ROOT}, __dirname: ${__dirname}`);
    // const sp = await searchParams;
    // const p = await params;
    // console.log(`--- [BlogLayout] cwd: ${cwd2}`, sp, p);
    console.log(`--- [BlogLayout] cwd: ${cwd2}`);

    // console.log(`+ list '${cwd2}' + 'content'`);
    // fs.readdirSync(path.join(cwd2, "content")).forEach((file) => {
    //   console.log(`      file: ${file}`);
    // })
    // console.log(`+ list '${cwd2}' + 'content/docs'`);
    // fs.readdirSync(path.join(cwd2, "content", "docs")).forEach((file) => {
    //   console.log(`      file: ${file}`);
    // })
    // if (fs.existsSync(path.join(cwd2, "content", "blog"))) {
    //   console.log(`+ list '${cwd2}' + 'content/blog'`);
    //   fs.readdirSync(path.join(cwd2, "content", "blog")).forEach((file) => {
    //     console.log(`      file: ${file}`);
    //   })
    // }
    // if (typeof __dirname !== "undefined") {
    //   // // runtime value: /var/task/.next/server/chunks
    //   // if (fs.existsSync(__dirname)) {
    //   //   console.log(`+ list '${__dirname}'`);
    //   //   fs.readdirSync(__dirname).forEach((file) => {
    //   //     console.log(`      file: ${file}`);
    //   //   })
    //   // }
    //
    //   // serverRuntimeConfig.PROJECT_ROOT: /vercel/path0
    //   if (serverRuntimeConfig.PROJECT_ROOT) {
    //     const root = serverRuntimeConfig.PROJECT_ROOT;
    //     console.log(`+ list '${root}'`);
    //     fs.readdirSync(root).forEach((file) => {
    //       console.log(`      file: ${file}`);
    //     })
    //   }
    // }
  }

  return (
    <div
      className={`flex flex-col items-start justify-center pt-8 pb-10 md:w-[87%] mx-auto ${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      {children}
      <Footer />
    </div>
  );
}
