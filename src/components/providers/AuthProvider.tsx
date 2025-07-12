"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";

type AuthProviderProps = {
  children: React.ReactNode;
  session?: Session | null; // Making session optional as it might not be available initially for all layouts
};

export default function AuthProvider({ children, session }: AuthProviderProps) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
