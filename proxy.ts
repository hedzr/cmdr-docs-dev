// import { chain } from './lib/chain';

import { createI18nMiddleware } from 'fumadocs-core/i18n/middleware';
import { i18n } from '@/lib/i18n';

import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { isMarkdownPreferred, rewritePath } from 'fumadocs-core/negotiation';
const { rewrite: rewriteLLM } = rewritePath('/docs{/*path}', '/llms.mdx/docs{/*path}');
export function withLLMRewrite(request: NextRequest) {
  if (isMarkdownPreferred(request)) {
    console.log(`[withLLMRewrite] rewriting ${request.nextUrl.pathname}...`);
    const result = rewriteLLM(request.nextUrl.pathname);
    if (result) {
      console.log(`[withLLMRewrite] rewrote result = ${result}.`);
      return NextResponse.rewrite(new URL(result, request.nextUrl));
    }
  }
  // return NextResponse.next();
  return false;
}

const withI18n = createI18nMiddleware(i18n);

// // This function can be marked `async` if using `await` inside
// export function proxy(request: NextRequest) {
//   return NextResponse.redirect(new URL('/home', request.url))
// }

export default withI18n;

// export default function proxy(request: NextRequest, event: NextFetchEvent) {
//   console.log(`[proxy] checking ${request.nextUrl.pathname}...`);
//   const try1 = withLLMRewrite(request);
//   if (try1) return try1;

//   return withI18n(request, event);
//   // return NextResponse.next();
// }

// --
// export default chain([
//   // withLogging,
//   createI18nMiddleware(i18n),
//   //
//   withLLMRewrite,
//   // withAuth
// ]);;

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  // You may need to adjust it to ignore static assets in `/public` folder
  matcher: [
    '/((?!api|_next/static|_next/image|assets|.well-known|favicon.ico).*)',
    '/(.*\.mdx)',
  ],
};
