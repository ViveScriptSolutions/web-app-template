import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import type { NextAuthConfig } from "next-auth";

export const config: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: { label: "Email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: String(credentials.email) },
        });

        if (!user || !user.password) {
          return null;
        }

        const isValidPassword = await bcrypt.compare(
          String(credentials.password),
          user.password
        );

        if (!isValidPassword) {
          return null;
        }

        // Return user object, which will be used in the JWT callback
        return { id: user.id, name: user.name, email: user.email, image: user.image };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // authorized({ auth, request: { nextUrl } }) {
    //   const isLoggedIn = !!auth?.user;
    //   const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
    //   if (isOnDashboard) {
    //     if (isLoggedIn) return true;
    //     return false; // Redirect unauthenticated users to login page
    //   } else if (isLoggedIn) {
    //     // If logged in and trying to access auth pages, redirect to dashboard
    //     if (nextUrl.pathname.startsWith('/auth/signin')) {
    //         return Response.redirect(new URL('/dashboard', nextUrl));
    //     }
    //   }
    //   return true;
    // },
    jwt({ token, user }) {
      if (user) {
        // User is available during sign-in
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.AUTH_SECRET, // Ensure this is set
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
