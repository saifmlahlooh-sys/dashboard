import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Lightweight auth guard — runs only on matched routes
export function middleware(req: NextRequest) {
  try {
    const { pathname } = req.nextUrl;

    const isDashboardRoute =
      pathname.startsWith('/dashboard') ||
      pathname.startsWith('/projects') ||
      pathname.startsWith('/sites') ||
      pathname.startsWith('/messages') ||
      pathname.startsWith('/settings') ||
      pathname.startsWith('/tasks') ||
      pathname.startsWith('/snippets');

    if (isDashboardRoute) {
      const token = req.cookies.get('dashboard_pin_auth');
      if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
      }
      return NextResponse.next();
    }

    // Already authenticated → skip login page
    if (pathname === '/login') {
      const token = req.cookies.get('dashboard_pin_auth');
      if (token) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
      return NextResponse.next();
    }

    return NextResponse.next();
  } catch (error) {
    // In case of any unexpected middleware error, default to proceeding
    console.error("Middleware error:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Run ONLY on page routes — skip all static assets, images, API, fonts.
     * This avoids middleware overhead on every _next/static request.
     */
    '/(dashboard|projects|sites|messages|settings|tasks|snippets|login)(.*)',
  ],
};
