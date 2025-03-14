import { redirect } from "next/navigation";

export default async function BlogPage(props: {
  params: Promise<{ lang: string; slugs?: string[] }>;
}) {
  const sp = await props.params;
  if (sp.slugs?.length === 3) {
    // cat 1, cat 2, slug
    const slug = sp.slugs[2];
    console.log(`redirecting to /${sp.lang}/blog/${slug}`);
    redirect(`/${sp.lang}/blog/${slug}`);
  }
  return (
    <>
      <h1>Blog Page</h1>
      {sp.lang}, {sp.slugs}
    </>
  );
}
