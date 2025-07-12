import { NextResponse, type NextRequest } from 'next/server';
import { auth } from '@/auth'; // Auth.js v5
import createIntlMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from '@/i18n'; // Assuming i18n config is now in src

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'never', // No locale prefix in the URL
});

const protectedRoutes = ['/dashboard'];

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isProtectedRoute = protectedRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  // If trying to access a protected route and not logged in, redirect to signin
  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL(`/auth/signin?callbackUrl=${nextUrl.pathname}`, req.url));
  }

  // If logged in and trying to access signin page, redirect to dashboard
  if (isLoggedIn && nextUrl.pathname.startsWith('/auth/signin')) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // For all other cases, apply the i18n middleware
  return intlMiddleware(req);
});

// The matcher from Auth.js will run on all routes except for the specified static assets.
// This ensures that both authentication and internationalization logic are applied correctly.
export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
