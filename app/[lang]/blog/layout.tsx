import { PropsWithChildren, ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Footer from "@/components/layout/footer";

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
  return (
    <div
      className={`flex flex-col items-start justify-center pt-8 pb-10 md:w-[87%] mx-auto ${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      {children}
      <Footer />
    </div>
  );
}
