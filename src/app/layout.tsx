import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider"; // Adjusted path
import { NextIntlClientProvider, useMessages } from "next-intl";
import { siteConfig } from "@/config/site"; // Adjusted path
import Navbar from "@/components/layout/Navbar"; // Will be created
import Footer from "@/components/layout/Footer"; // Will be created
import { cn } from "@/lib/utils"; // For combining class names

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  // icons: { // Add icons later if provided
  //   icon: "/favicon.ico",
  //   shortcut: "/favicon-16x16.png",
  //   apple: "/apple-touch-icon.png",
  // },
  // manifest: `${siteConfig.url}/site.webmanifest`,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    // creator: "@yourtwitterhandle", // Add your Twitter handle
  },
};

export default function RootLayout({
  children,
  params: { locale } // Next-intl expects locale to be passed if using app router with dynamic locale segments
}: Readonly<{
  children: React.ReactNode;
  params: { locale?: string }; // Make locale optional as it might not be in the path for "no int. routing"
}>) {
  // For "no int. routing", locale might not be in params.
  // Middleware should set a default locale cookie if not present.
  // `useMessages` will pick up messages for the active locale.
  const messages = useMessages();

  return (
    // The lang attribute should be dynamically set by next-intl if using path-based routing.
    // For "no int. routing", it might default or be set by next-intl's middleware.
    // We can pass the determined locale to html if available, otherwise default to 'en'.
    // The `locale` param might not be available here if not using /[locale] in path.
    // `next-intl` handles this by reading from `NextIntlClientProvider` or server context.
    <html lang={locale || "en"} suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          geistSans.variable,
          geistMono.variable
        )}
      >
        <NextIntlClientProvider locale={locale || "en"} messages={messages}>
          <AuthProvider>
            <div className="relative flex min-h-dvh flex-col bg-background">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
