"use client"; // This page uses client-side hooks for form handling and sign-in

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSearchParams } from "next/navigation";
import { useState, FormEvent, useEffect } from "react";
import { signInSchema, SignInFormValues } from "@/lib/schemas/auth"; // Adjusted path
import { ZodError } from "zod";
import { useTranslations } from "next-intl"; // For i18n

// A simple SVG for Google icon
const GoogleIcon = () => (
  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    <path d="M1 1h22v22H1z" fill="none" />
  </svg>
);

export default function SignInPage() {
  const t = useTranslations("SignInPage");
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const initialError = searchParams.get("error");

  const [formData, setFormData] = useState<SignInFormValues>({ email: "", password: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof SignInFormValues, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (initialError) {
      // Map NextAuth errors to user-friendly messages if possible
      if (initialError === "CredentialsSignin") {
        setServerError(t("credentialsError"));
      } else {
        setServerError(t("genericError"));
      }
    }
  }, [initialError, t]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear specific field error on change
    if (errors[name as keyof SignInFormValues]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    setServerError(null); // Clear server error on new input
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setServerError(null);
    setErrors({});
    await signIn("google", { callbackUrl });
    // setIsLoading(false); // Page will redirect
  };

  const handleCredentialsSignIn = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setServerError(null);
    setErrors({});

    try {
      const validatedData = signInSchema.parse(formData);

      const result = await signIn("credentials", {
        redirect: false,
        email: validatedData.email,
        password: validatedData.password,
        callbackUrl,
      });

      if (result?.error) {
        if (result.error === "CredentialsSignin") {
          setServerError(t("credentialsError"));
        } else {
          setServerError(t("genericError") + ` (${result.error})`);
        }
      } else if (result?.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: Partial<Record<keyof SignInFormValues, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof SignInFormValues] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        setServerError(t("genericError"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 py-12">
      <div className="mx-auto w-full max-w-md rounded-lg bg-white dark:bg-gray-800 p-8 shadow-xl">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-900 dark:text-white">
          {t("title")}
        </h1>

        {serverError && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
            {serverError}
          </div>
        )}

        <form onSubmit={handleCredentialsSignIn} className="space-y-6">
          <div>
            <Label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("emailLabel")}
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className={`mt-1 block w-full ${errors.email ? 'border-red-500 dark:border-red-700' : ''}`}
              placeholder="you@example.com"
              disabled={isLoading}
            />
            {errors.email && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.email}</p>}
          </div>

          <div>
            <Label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t("passwordLabel")}
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={handleInputChange}
              className={`mt-1 block w-full ${errors.password ? 'border-red-500 dark:border-red-700' : ''}`}
              placeholder="••••••••"
              disabled={isLoading}
            />
            {errors.password && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.password}</p>}
          </div>

          <div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t("title") + "..." : t("credentialsSubmit")}
            </Button>
          </div>
        </form>

        <div className="my-6 flex items-center justify-center">
          <span className="h-px flex-1 bg-gray-300 dark:bg-gray-600"></span>
          <span className="px-3 text-sm text-gray-500 dark:text-gray-400">
            {t("or")}
          </span>
          <span className="h-px flex-1 bg-gray-300 dark:bg-gray-600"></span>
        </div>

        <Button
          variant="outline"
          onClick={handleGoogleSignIn}
          className="w-full"
          disabled={isLoading}
        >
          <GoogleIcon />
          {isLoading ? t("title") + "..." : t("googleSubmit")}
        </Button>

        {/* Optional: Link to Sign Up page */}
        {/* <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="font-medium text-primary hover:underline">
            Sign Up
          </Link>
        </p> */}
      </div>
    </div>
  );
}
