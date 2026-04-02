import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const isDashboardRoute = req.nextUrl.pathname.startsWith('/dashboard') || 
                           req.nextUrl.pathname.startsWith('/sites') || 
                           req.nextUrl.pathname.startsWith('/messages') || 
                           req.nextUrl.pathname.startsWith('/settings');

  // Verify dashboard routes protectively
  if (isDashboardRoute) {
    const token = req.cookies.get('dashboard_pin_auth');
    
    // If no token exists, immediately redirect to login
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // If going to login but already authenticated, redirect to dashboard
  if (req.nextUrl.pathname === '/login') {
     const token = req.cookies.get('dashboard_pin_auth');
     if (token) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
     }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
};
