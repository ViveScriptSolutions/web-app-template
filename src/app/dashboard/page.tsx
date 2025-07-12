import { auth } from "@/auth"; // Assuming auth setup exports 'auth'
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await auth(); // Get session on the server

  if (!session?.user) {
    // This check is largely redundant if middleware is correctly set up,
    // but good for defense in depth or if middleware is bypassed.
    // The middleware should handle the redirect primarily.
    redirect("/auth/signin?callbackUrl=/dashboard");
  }

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
          Dashboard
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
          Welcome to your protected dashboard, {session?.user?.name ?? session?.user?.email}!
        </p>
        <div className="mt-4 space-y-2">
            <p>Your session details:</p>
            <pre className="p-4 bg-muted rounded-md text-sm overflow-x-auto">
                {JSON.stringify(session, null, 2)}
            </pre>
        </div>
      </div>
    </section>
  );
}
