import Credentials from "next-auth/providers/credentials";
import NextAuth, { type DefaultSession } from "next-auth";
import "next-auth/jwt";
import { UserProfile } from "@/models/users";
import { getToken } from "@/apis/auth/getToken";
import { getUser } from "@/apis/auth/getUser";
import { refreshToken } from "@/apis/auth/refreshToken";
import type { NextAuthConfig } from "next-auth";
import { object, string } from "zod";
import { z } from "zod";

async function parseJwt(token: string): Promise<
  | {
      exp: number;
      jti: string;
      user_id: number;
      token_type: string;
      iat: number;
    }
  | undefined
> {
  if (!token) {
    return;
  }
  const Buffer = require("buffer").Buffer;
  const base64 = token.split(".")[1];
  const decodedValue = Buffer.from(base64, "base64");
  return JSON.parse(decodedValue.toString("ascii"));
}

const signInSchema = z.object({
  username: string({ required_error: "Email is required" }).min(
    1,
    "Email is required"
  ),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

const config = {
  providers: [
    Credentials({
      credentials: {
        username: { label: "username", type: "text" },
        password: { label: "password", type: "password" },
      },
      authorize: async (credentials, req) => {
        if (!credentials) {
          throw new Error("Credentials are missing.");
        }

        let user = null;

        try {
          const { username, password } = await signInSchema.parseAsync(
            credentials
          );
          const { refresh, access } = await getToken(username, password);

          if (!access) {
            console.log("Access token not found.");
            return null; // Return null to indicate authentication failure
          }

          // Get user model
          user = await getUser(access);

          if (!user) {
            console.log("User not found.");
            return null; // Return null to indicate authentication failure
          }

          return {
            ...user,
            accessToken: access,
            refreshToken: refresh,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null; // Return null to indicate authentication failure
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (token.accessToken) {
        const jwt = await parseJwt(token.accessToken);
        if (jwt && jwt.exp < Date.now() / 1000 && token.refreshToken) {
          const newToken = await refreshToken(token.refreshToken);
          if (newToken) {
            token.accessToken = newToken.access;
          } else {
            return null;
          }
        }
      }

      return {
        ...token,
        ...user,
      };
    },
    async session({ session, token }) {
      if (!token?.accessToken) return session;
      session.user = token as any;

      return session;
    },
  },
  experimental: {
    enableWebAuthn: true,
  },
  pages: {
    signIn: "/auth/signin",
  },
  debug: process.env.NODE_ENV !== "production" ? true : false,
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);

declare module "next-auth" {
  interface Session {
    user: UserProfile & {
      accessToken?: string;
      refreshToken?: string;
    };
  }
}

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
  }
}
