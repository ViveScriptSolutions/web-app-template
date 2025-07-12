"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { siteConfig } from "@/config/site";
import { Logo } from "@/components/branding/Logo";
import { Button } from "@/components/ui/button"; // ShadCN UI Button
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // ShadCN UI Avatar
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // ShadCN UI Dropdown

export default function Navbar() {
  const { data: session, status } = useSession();
  const t = useTranslations("Navbar");
  const isLoading = status === "loading";

  // Map mainNav titles to translation keys
  const navItems = siteConfig.mainNav.map(item => {
    let titleKey = item.title.toLowerCase();
    // A simple mapping, could be more robust if titles differ significantly from keys
    if (titleKey === "home") return { ...item, title: t("home") };
    if (titleKey === "about") return { ...item, title: t("about") };
    if (titleKey === "contact") return { ...item, title: t("contact") };
    if (titleKey === "dashboard") return { ...item, title: t("dashboard") };
    return { ...item, title: item.title }; // Fallback if no key matches
  });


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Logo />
        {/* Adjusted spacing for better mobile first: default space-x-2, sm:space-x-4, lg:space-x-6 */}
        <nav className="ml-4 md:ml-6 flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {item.title}
            </Link>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
          {isLoading ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted" /> // Skeleton loader for avatar
          ) : session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user.image ?? ""} alt={session.user.name ?? "User"} />
                    <AvatarFallback>
                      {session.user.name
                        ? session.user.name.charAt(0).toUpperCase()
                        : session.user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{session.user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  {t("signOut")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => signIn()} variant="outline">
              {t("signIn")}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
