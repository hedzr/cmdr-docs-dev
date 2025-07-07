import { createI18nMiddleware } from 'fumadocs-core/i18n';
import { i18n } from './lib/i18n';

export default createI18nMiddleware(i18n);

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: [
    '/((?!api|_next|.well-known|favicon.ico|images|assets).*)',
    // '//',
    // '/.*\.(ico|jpe?g|png|webp|webm|gif|tiff?|bmp|hvec|mpe?g|mp4|mkv)',
  ],
};
