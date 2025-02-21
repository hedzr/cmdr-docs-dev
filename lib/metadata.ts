import type { Metadata } from 'next/types';
import { createMetadataImage } from 'fumadocs-core/server';
import { source } from './source';
import * as process from "node:process";

export const site = {
  title: 'cmdr.docs',
  desc: '',
};

export const metadataImage = createMetadataImage({
  imageRoute: '/docs-og',
  filename: 'og-image.png',
  source,
});

export function createMetadata(override: Metadata): Metadata {
  return {
    ...override,
    openGraph: {
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      url: baseUrl,
      // images: '/banner.png',
      siteName: site.title,
      ...override.openGraph,
    },
    twitter: {
      card: 'summary_large_image',
      creator: '@cmdr.authors',
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      // images: '/banner.png',
      ...override.twitter,
    },
  };
}

// export const baseUrl =
//   process.env.NODE_ENV === 'development' || !(process.env.VERCEL_URL || process.env.NEXT_PUBLIC_VERCEL_URL)
//     ? new URL('http://localhost:3000')
//     : new URL(`https://${process.env.VERCEL_URL||process.env.NEXT_PUBLIC_VERCEL_URL}`);

export const baseUrl =
  (process.env.NODE_ENV === 'production' ||
    process.env.NEXT_PUBLIC_VERCEL_ENV === 'production') &&
    process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview' &&
      (process.env.VERCEL_URL || process.env.NEXT_PUBLIC_VERCEL_URL)
      ? new URL(`https://${process.env.VERCEL_URL || process.env.NEXT_PUBLIC_VERCEL_URL}`)
      : new URL(process.env.LOCAL_SIMULATE_PRODUCT_URL || 'http://localhost:3000');
