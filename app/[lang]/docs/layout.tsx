import { source } from "@/lib/source";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { baseOptions } from "@/lib/layout.shared";

export default async function Layout({
  params,
  children,
}: LayoutProps<"/[lang]/docs">) {
  const { lang } = await params;
  return (
    <DocsLayout
      tree={source.getPageTree(lang)}
      // sidebar={{
      //   tabs: [
      //     {
      //       title: "Components",
      //       description: "Hello World!",
      //       // active for `/docs/components` and sub routes like `/docs/components/button`
      //       url: "/docs/components",
      //       // optionally, you can specify a set of urls which activates the item
      //       // urls: new Set(['/docs/test', '/docs/components']),
      //     },
      //   ],
      // }}
      {...baseOptions(lang)}
    >
      {children}
    </DocsLayout>
  );
}

// export default function Layout({ children }: LayoutProps<'/docs'>) {
//   return (
//     <DocsLayout tree={source.getPageTree()} {...baseOptions()}>
//       {children}
//     </DocsLayout>
//   );
// }
