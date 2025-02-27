// export async function BlogIndexPage({
//   params,
//   searchParams,
// }: {
//   params: Promise<{
//     lang: string;
//     slugs: string[];
//   }>;
//   searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
// }) {
//   return <h1>Index Page</h1>;
// }

import { redirect } from "next/navigation";

export default async function BlogPage(props: {
  params: Promise<{ lang: string; slugs?: string[] }>;
}) {
  const sp = await props.params;
  if (sp.slugs?.length === 3) {
    // cat 1, cat 2, slug
    const slug = sp.slugs[2];
    redirect(`/${sp.lang}/blog/${slug}`);
  }
  return (
    <>
      <h1>Blog Page</h1>
      {sp.lang}, {sp.slugs}
    </>
  );
}
