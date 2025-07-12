import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
};

export default function AboutPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
          About Us
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
          This is a starter template designed to kickstart your Next.js projects with all the essential features.
        </p>
        <p className="max-w-[700px] text-muted-foreground">
          Built with the latest technologies to ensure a modern, scalable, and maintainable codebase.
          We focus on developer experience and performance.
        </p>
      </div>
    </section>
  );
}
