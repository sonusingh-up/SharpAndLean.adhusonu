import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
export default clerkMiddleware(async (_auth, request) => {
  // Pages and server actions enforce authentication and editor authorization.
  if (request.nextUrl.pathname === '/admin' || request.nextUrl.pathname.startsWith('/admin/')) {
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'private, no-store');
    return response;
  }
});
export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
    '/__clerk/:path*',
  ],
};
