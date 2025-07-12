import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Define the locales you want to support
export const locales = ['en', 'es'];
export const defaultLocale = 'en';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    // For "no int. routing" with a default locale, we might not want to `notFound()`
    // immediately if the middleware isn't set up to provide a locale.
    // Instead, we might default to 'en'.
    // However, if a locale is explicitly passed (e.g. from middleware later), it should be valid.
    // For now, let's assume middleware will handle providing a valid locale or default.
    // If no locale is found by middleware, it will default to 'en' there.
    // console.warn(`Unsupported locale: ${locale}. Defaulting or expecting middleware to handle.`);
    // For now, strict check:
    // notFound();
    // To simplify for "no int. routing" and ensure it always loads 'en' if no specific setup is done yet:
    // This will be refined when/if proper locale detection/routing is added.
    // For now, let's assume the middleware (to be updated) will provide 'en' by default.
  }

  let messages;
  try {
    // Dynamically import messages for the requested locale
    messages = (await import(`../messages/${locale}.json`)).default;
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    // Fallback to English messages if the requested locale's messages are not found
    // or handle this more gracefully depending on requirements.
    // For now, if a specific locale load fails after being passed, it's an issue.
    // notFound();
    // Defaulting to English if a specific locale file is missing, after it was determined.
    if (locale !== defaultLocale) {
      console.warn(`Messages for locale "${locale}" not found, falling back to "${defaultLocale}"`);
      messages = (await import(`../messages/${defaultLocale}.json`)).default;
    } else {
      // If English itself is missing, that's a critical error.
      console.error(`Default locale messages ("${defaultLocale}") not found.`);
      notFound();
    }
  }

  return {
    messages,
    // You can override the timeZone for each request here.
    // timeZone: 'Europe/Berlin',
  };
});
