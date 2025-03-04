import "@/app/global.css";
import type { ReactNode } from "react";

export default function BlogStdLayout({
  //   params,
  children,
}: {
  //   params: Promise<{ lang: string; slugs: string[] }>;
  children: ReactNode;
}) {
  return (
    <div
      className={`flex flex-col items-start justify-center pt-8 pb-10 md:w-[87%] mx-auto`}
    >
      {children}
    </div>
  );
}
