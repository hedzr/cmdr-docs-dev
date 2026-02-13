import { source } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';
import { createTokenizer } from '@orama/tokenizers/mandarin';

// export const { GET } = createFromSource(source, {
//   // https://docs.orama.com/docs/orama-js/supported-languages
//   language: 'english',
// });

// https://www.fumadocs.dev/docs/headless/search/orama
export const { GET } = createFromSource(source, {
  localeMap: {
    // [locale]: Orama options
    cn: {
      components: {
        tokenizer: createTokenizer(),
      },
      search: {
        threshold: 0,
        tolerance: 0,
      },
    },
    tw: {
      components: {
        tokenizer: createTokenizer(),
      },
      search: {
        threshold: 0,
        tolerance: 0,
      },
    },

    // ru: { language: 'russian' },
    en: { language: 'english' },
  },
  // buildIndex(page) {
  //   return {
  //     title: page.data.title,
  //     description: page.data.description,
  //     url: page.url,
  //     id: page.url,
  //     structuredData: page.data.structuredData,
  //     // use your desired value, like page.slugs[0]
  //     tag: '<value>',
  //   };
  // },
});
