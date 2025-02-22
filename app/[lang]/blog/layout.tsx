import { PropsWithChildren, ReactNode } from "react";

export default function BlogLayout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>;
  children: PropsWithChildren;
}) {
  // var c: ReactNode;
  // if (!children.children) c = <div>empty</div>;
  // else c = children.children;
  return (
    <div className="flex flex-col items-start justify-center pt-8 pb-10 md:w-[70%] mx-auto">
      {children.children ?? <></>}
    </div>
  );
}
