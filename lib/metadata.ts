import { createMetadataImage } from 'fumadocs-core/server';
import { source } from './source';

export const site = {
  title: 'cmdr.docs',
  desc: '',
};

export const metadataImage = createMetadataImage({
  imageRoute: '/docs-og',
  source,
});
