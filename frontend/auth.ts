import Credentials from "next-auth/providers/credentials";
import NextAuth, { type DefaultSession } from "next-auth";
import "next-auth/jwt";
import { UserProfile } from "@/models/users";
import { getToken } from "@/apis/auth/getToken";
import { getUser } from "@/apis/auth/getUser";
import { refreshToken } from "@/apis/auth/refreshToken";
import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import { object, string } from "zod";
import type { Provider } from "next-auth/providers";
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

const providers: Provider[] = [
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
          return null;
        }

        // Get user model
        user = await getUser(access);

        if (!user) {
          console.log("User not found.");
          return null;
        }

        return {
          ...user,
          accessToken: access,
          refreshToken: refresh,
        };
      } catch (error) {
        console.error("Authentication error:", error);
        return null;
      }
    },
  }),
  GitHub,
];

const config = {
  providers: providers,
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (user === null || user === undefined)
        return "/auth/error?error=CredentialsSignin";
      return true;
    },
    async jwt({ token, user, trigger }) {
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

      if (trigger === "update" && token.accessToken) {
        const jwt = await parseJwt(token.accessToken);
        if (jwt) {
          const updatedUser = await getUser(token.accessToken);
          if (updatedUser) {
            return { ...token, ...updatedUser };
          }
        }
      }

      return {
        ...token,
        ...user,
      };
    },
    async session({ session, token }) {
      if (!token?.accessToken) return { expires: session.expires };
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

export const providerMap = providers
  .map((provider) => {
    if (typeof provider === "function") {
      const providerData = provider();
      return { id: providerData.id, name: providerData.name };
    } else {
      return { id: provider.id, name: provider.name };
    }
  })
  .filter((provider) => provider.id !== "credentials");
