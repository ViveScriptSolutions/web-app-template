// routes.ts

/**
 * An array of routes that are accessible to the public
 * These routes don not require authentication
 * @type {string[]}
 */
export const publicRoutes = [
  "/",
  "/sitemap.xml",
  "/robots.txt",
  "/ads.txt",
  "/auth/verify-email",
  "/legal/cookie-policy",
  "/legal/privacy",
  "/legal/refund-policy",
  "/legal/terms",
  "/about",
  "/contact",
  "/404",
];

/**
 * An array of dynamic public route prefixes
 * Routes starting with these prefixes are considered public
 * @type {string[]}
 */
export const dynamicPublicPrefixes = ["/blog"];

/**
 * An array of routes that are used for authentication
 * These routes will redirect to /dashboard
 * @type {string[]}
 */
export const authRoutes = [
  "/auth/sign-in",
  "/auth/sign-up",
  "/auth/auth/error",
  "/auth/reset",
  "/auth/new-password",
];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after logged in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/dashboard";
