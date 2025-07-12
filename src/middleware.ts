import { type NextRequest, NextResponse } from "next/server";
import { withAuth, NextAuthRequest } from "next-auth/middleware";
import createIntlMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./i18n"; // Adjusted path

// Create the i18n middleware
const intlMiddleware = createIntlMiddleware({
  locales: locales,
  defaultLocale: defaultLocale,
  // No locale prefix for "no int. routing"
  localePrefix: "as-needed", // or 'never' if you strictly want no prefix even if navigating to /en
});

// Auth middleware configuration
const authMiddleware = withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req: NextAuthRequest) {
    const { token } = req.nextauth;
    const { pathname } = req.nextUrl;

    // If the user is authenticated and tries to access auth pages like signin,
    // redirect them to the dashboard or home page.
    if (token) {
      if (pathname.startsWith("/auth/signin") || pathname.startsWith("/auth/signup")) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    // For other cases, let the i18n middleware handle the response,
    // or if it's a protected route and `withAuth` determined redirection, that would have happened.
    // If `withAuth` allowed the request, proceed.
    return intlMiddleware(req); // Chain to i18n middleware
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        if (pathname.startsWith("/dashboard")) {
          return !!token; // Must be logged in for dashboard
        }
        return true; // Allow other routes (public or auth-related handled by main middleware logic)
      },
    },
    pages: {
      signIn: "/auth/signin",
    },
  }
);


export default function middleware(req: NextRequest) {
  // First, let the i18n middleware process the request to determine/set locale
  // This is a common pattern but needs careful ordering with auth.
  // Let's try applying auth middleware first for protected routes,
  // then i18n for all routes that pass auth.

  // For "no intl. routing", the main purpose of intlMiddleware here is to set the locale
  // based on cookies/headers for use by `getRequestConfig` in `i18n.ts`.
  // It won't rewrite URLs with locale prefixes if configured with localePrefix: 'never'.

  // Apply authMiddleware. If it redirects, that takes precedence.
  // If it allows the request to proceed (e.g. public route, or authenticated user for protected route),
  // then intlMiddleware can further process it.

  // Check if the route is public or requires auth
  const publicPaths = ["/", "/about", "/contact", "/auth/signin", "/auth/signup"]; // Add other public paths
  const isPublicPath = publicPaths.some(path => req.nextUrl.pathname === path || (path.endsWith('/') && req.nextUrl.pathname.startsWith(path)));

  const isApiAuthRoute = req.nextUrl.pathname.startsWith('/api/auth');

  if (isApiAuthRoute) {
    return NextResponse.next(); // Auth API routes should not be processed by this custom middleware stack usually
  }

  if (!isPublicPath && !req.nextUrl.pathname.startsWith("/dashboard")) {
     // If it's not a defined public path and not /dashboard (which auth handles specifically)
     // then it's likely a static asset or similar, let i18n handle it directly.
     // This logic might need refinement based on exact routing needs.
     return intlMiddleware(req);
  }


  // If it's a path that authMiddleware's matcher would cover (dashboard, auth pages)
  // or a public page where auth logic (like redirecting logged-in user from /signin) is desired.
  if (config.matcher.some(pattern => new RegExp(pattern.replace(/:\w+\*/g, '.*')).test(req.nextUrl.pathname))) {
    return (authMiddleware as any)(req); // Cast because NextAuthRequest vs NextRequest
  }

  // For all other requests (typically public pages not explicitly handled by auth logic for redirection)
  return intlMiddleware(req);
}


// Matcher to specify which routes the middleware should run on.
// This needs to cover all routes where either i18n or auth logic is needed.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes) - except /api/auth which auth needs
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (static images if you put them in /public/images)
     * - svgs (static svgs if you put them in /public/svgs)
     */
    '/((?!api/!auth|_next/static|_next/image|favicon.ico|images/.*|svgs/.*).*)',
    // Explicitly include /api/auth if not covered by the above negative lookahead
    '/api/auth/:path*'
  ],
};
