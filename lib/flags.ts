//
// https://vercel.com/kb/guide/use-feature-flags-in-fumadocs-with-the-vercel-toolbar
//

import { flag } from 'flags/next';

export const enableInternalDocsFlag = flag({
    key: 'enable-internal-docs',
    defaultValue: false,
    decide: () => false,
});
