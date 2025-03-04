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
  // const cwd1 = serverRuntimeConfig.cwd();
  const cwd2 = process.cwd();
  console.log(`+ list '${cwd2}'`);
  fs.readdirSync(cwd2).forEach((file) => {
    console.log(`      file: ${file}`);
  })
  if (__dirname) {
    console.log(`+ list '${__dirname}'`);
    fs.readdirSync(__dirname).forEach((file) => {
      console.log(`      file: ${file}`);
    })
  }
  const o = fs.existsSync(path.join(cwd2,"content/blog/file-rec.mdx"));
  console.log(`--- [BlogLayout] cwd: ${cwd2} | 'content/blog/file-rec.mdx': ${o}, __dirname: ${ serverRuntimeConfig.PROJECT_ROOT }, serverRuntimeConfig.path: ${serverRuntimeConfig.path}`);
  return (
    <div
      className={`flex flex-col items-start justify-center pt-8 pb-10 md:w-[87%] mx-auto ${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      {children}
      <Footer />
    </div>
  );
}
