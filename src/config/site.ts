export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Next.js Starter Template",
  description: "A modern Next.js starter template with Auth.js, Prisma, ShadCN UI, and more.",
  url: "http://localhost:3000", // Replace with your actual domain in production
  ogImage: "http://localhost:3000/og.jpg", // Replace with your actual OG image path
  links: {
    twitter: "https://twitter.com/shadcn", // Example link
    github: "https://github.com/shadcn/ui", // Example link
  },
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "About",
      href: "/about",
    },
    {
      title: "Contact",
      href: "/contact",
    },
    {
      title: "Dashboard",
      href: "/dashboard", // Will be protected
    },
  ],
  footerNav: [
    {
      title: "Privacy Policy",
      href: "/privacy",
    },
    {
      title: "Terms of Service",
      href: "/terms",
    },
  ],
};
