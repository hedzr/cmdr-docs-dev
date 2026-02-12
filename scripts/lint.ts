import { type FileObject, printErrors, scanURLs, validateFiles } from 'next-validate-link';
import type { InferPageType } from 'fumadocs-core/source';
import { source } from '@/lib/source';
import { i18n } from '@/lib/i18n';

async function checkLinks() {
  for (let lang of i18n.languages) {
    const scanned = await scanURLs({
      // pick a preset for your React framework
      preset: 'next',
      populate: {
        '[lang]/docs/[[...slug]]': source.getPages(lang).map((page) => {
          return {
            value: {
              slug: page.slugs,
            },
            hashes: getHeadings(page),
          };
        }),
      },
    });
    console.log("--- validating...");
    printErrors(
      await validateFiles(await getFiles(lang), {
        scanned,
        // check `href` attributes in different MDX components
        markdown: {
          components: {
            Card: { attributes: ['href'] },
          },
        },
        // check relative paths
        checkRelativePaths: 'as-url',
      }),
      true,
    );
  }
}
function getHeadings({ data }: InferPageType<typeof source>): string[] {
  return (data.toc || []).map((item) => item.url.slice(1));
}
function getFiles(lang?: string) {
  const promises = source.getPages(lang).map(
    async (page): Promise<FileObject> => ({
      path: page.absolutePath || '',
      content: await page.data.getText('raw'),
      url: page.url,
      data: page.data,
    }),
  );
  return Promise.all(promises);
}

void checkLinks();
