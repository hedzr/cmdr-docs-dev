import { getLLMText, source } from '@/lib/source';
import { prodMode } from '@/lib/utils';
import { notFound } from 'next/navigation';

export const revalidate = false;

export async function GET(_req: Request, { params }: RouteContext<'/[lang]/llms.mdx/docs/[[...slug]]'>) {
  const { lang, slug } = await params;
  // if (!prodMode)
  //   console.log(`[llms.mdx]: params: ${params} ...`);
  const page = source.getPage(slug, lang);
  if (!page) notFound();

  return new Response(await getLLMText(page), {
    headers: {
      'Content-Type': 'text/markdown',
    },
  });
}

export function generateStaticParams() {
  return source.generateParams();
}
