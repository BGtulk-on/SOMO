import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = getSessionCookie(request);

  const isProtectedPage = pathname.startsWith('/dashboard');

  if (!sessionToken && isProtectedPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
