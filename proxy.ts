import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse, type NextRequest, type NextFetchEvent } from 'next/server';
const authenticatedProxy = clerkMiddleware(async (_auth, request) => {
  // Pages and server actions enforce authentication and editor authorization.
  if (request.nextUrl.pathname === '/admin' || request.nextUrl.pathname.startsWith('/admin/')) {
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'private, no-store');
    return response;
  }
});
export default function proxy(request: NextRequest, event: NextFetchEvent) {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || !process.env.CLERK_SECRET_KEY) {
    const path = request.nextUrl.pathname;
    if (['/admin', '/sign-in', '/sign-up', '/__clerk'].some(
      (prefix) => path === prefix || path.startsWith(prefix + '/'),
    )) {
      return new NextResponse('Sign-in is temporarily unavailable. Please try again later.', {
        status: 503,
        headers: { 'Cache-Control': 'no-store', 'Retry-After': '300' },
      });
    }
    return NextResponse.next();
  }
  return authenticatedProxy(request, event);
}
export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
    '/__clerk/:path*',
  ],
};
