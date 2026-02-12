// import { NextResponse } from 'next/server'
// import type { NextRequest, NextMiddleware } from 'next/server'

// export function chain(functions: NextMiddleware[], index = 0): NextMiddleware {
//   return async (request: NextRequest, event: any) => {
//     const current = functions[index];
//     if (current) {
//       // Create a "next" function to call the next middleware
//       const next = chain(functions, index + 1);
//       return await current(request, event, next);
//     }
//     // No more middlewares, return default response
//     return NextResponse.next();
//   };
// }
