import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { getTranslator } from 'next-intl/server'; // For Server Components

// Define params type if you expect locale from path, though for "no int. routing" it's handled by middleware
// type Props = {
//   params: { locale: string };
// };
// export default async function HomePage({ params: { locale } }: Props) {
// const t = await getTranslator(locale, 'HomePage');

export default async function HomePage() {
  // For "no int. routing", locale is implicitly handled by middleware.
  // getTranslator will use the active locale.
  const t = await getTranslator(undefined, 'HomePage');


  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
          {t('welcome')} <br className="hidden sm:inline" />
          {siteConfig.name}
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
          {/* Using siteConfig.description directly as it's already part of the config,
              but could also be t('description', { siteName: siteConfig.name }) if preferred */}
          {siteConfig.description}
        </p>
      </div>
      <div className="flex gap-4">
        <Link
          href={siteConfig.links.github} // Or a link to your main product/docs
          target="_blank"
          rel="noreferrer"
          className={cn(buttonVariants({ size: "lg" }))}
        >
          {t('viewOnGitHub')}
        </Link>
        <Link
          href="/dashboard" // Or a primary CTA
          className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
        >
          {t('getStarted')}
        </Link>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold tracking-tight">{t('features')}</h2>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
          <li>Next.js 15+ (App Router)</li> {/* Updated to Next.js 15 as per latest create-next-app */}
          <li>React 19 (Server and Client Components)</li>
          <li>TypeScript</li>
          <li>Tailwind CSS (v4)</li>
          <li>ShadCN UI</li>
          <li>Auth.js (NextAuth.js v4 - Google & Credentials)</li>
          <li>Prisma (SQLite)</li>
          <li>Internationalization (next-intl - setup pending)</li>
          <li>Zod (for validation - usage pending)</li>
          <li>Responsive Design</li>
        </ul>
      </div>
    </section>
  );
}
