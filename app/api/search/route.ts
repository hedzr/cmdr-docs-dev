// import { source } from '@/lib/source';
// import { createFromSource } from 'fumadocs-core/search/server';
//
// export const { GET } = createFromSource(source);

// -----------------------------------------------------

import { source } from '@/lib/source';
// import { createFromSource } from 'fumadocs-core/search/server';
import { createI18nSearchAPI } from 'fumadocs-core/search/server';
import { i18n } from '@/lib/i18n';
import { createTokenizer } from '@orama/tokenizers/mandarin';
import { stopwords as mandarinStopwords } from "@orama/stopwords/mandarin";

// import { createTokenizerJP } from '@orama/tokenizers/japanese';
// import { stopwords as japaneseStopwords } from "@orama/stopwords/japanese";

// const db = create({
//     schema: {
//         name: "string",
//     },
//     components: {
//         tokenizer: createTokenizer({
//             stopWords: japaneseStopwords,
//         }),
//     },
// });

// insert(db, { name: "東京" }); // Tokyo
// insert(db, { name: "大阪" }); // Osaka
// insert(db, { name: "京都" }); // Kyoto
// insert(db, { name: "横浜" }); // Yokohama
// insert(db, { name: "札幌" }); // Sapporo
// insert(db, { name: "仙台" }); // Sendai
// insert(db, { name: "広島" }); // Hiroshima
// insert(db, { name: "東京大学" }); // University of Tokyo
// insert(db, { name: "京都大学" }); // Kyoto University
// insert(db, { name: "大阪大学" }); // Osaka University

// const results = search(db, {
//     term: "大阪",
//     threshold: 0,
// });

// console.log(results);

export const { GET } = createI18nSearchAPI('advanced', {
  i18n,
  localeMap: {
    // the prop name should be its locale code in your i18n config, (e.g. `cn`)
    cn: {
      // options for the language
      tokenizer: createTokenizer({stopWords: mandarinStopwords,}),
      search: {
        threshold: 0,
        tolerance: 0,
      },
    },
    tw: {
      // options for the language
      tokenizer: createTokenizer(),
      search: {
        threshold: 0,
        tolerance: 0,
      },
    },
    // jp: {
    //     // options for the language
    //     tokenizer: await createTokenizerJP({
    //         stopWords: japaneseStopwords,
    //     }),
    //     search: {
    //         threshold: 0,
    //         tolerance: 0,
    //     },
    // },
  },
  indexes: source.getLanguages().flatMap((entry) =>
    entry.pages.map((page) => ({
      title: page.data.title,
      description: page.data.description,
      structuredData: page.data.structuredData,
      id: page.url,
      url: page.url,
      locale: entry.language,
    })),
  ),
});
