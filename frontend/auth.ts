import Credentials from "next-auth/providers/credentials";
import NextAuth, { type DefaultSession } from "next-auth";
import "next-auth/jwt";
import { UserProfile } from "@/models/users";
import { getToken } from "@/apis/auth/getToken";
import { getUser } from "@/apis/auth/getUser";
import { refreshToken } from "@/apis/auth/refreshToken";
import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { object, string } from "zod";
import { Account, User, Profile } from "next-auth";
import type { Provider } from "next-auth/providers";
import { z } from "zod";
import axios from "axios";
import { loginWithGoogle } from "./apis/auth/Oauth";

const BACKEND_ACCESS_TOKEN_LIFETIME = 45 * 60; // 45 minutes
const BACKEND_REFRESH_TOKEN_LIFETIME = 6 * 24 * 60 * 60; // 6 days
const getCurrentEpochTime = () => {
  return Math.floor(new Date().getTime() / 1000);
};

const SIGN_IN_HANDLERS = {
  credentials: async (
    user: UserProfile,
    account: Account,
    profile: Profile,
    email: string,
    credentials: any
  ) => {
    if (user.username && user.is_active) {
      return true;
    }
    return false;
  },
  google: async (
    user: User,
    account: Account,
    profile: Profile,
    email: string,
    credentials: any
  ) => {
    try {
      if (!account.access_token) {
        return false;
      }
      const response = await loginWithGoogle(account.access_token);
      if (!response.access) {
        return false;
      }
      const user = await getUser(response.access);
      if (!user) {
        console.log("User not found.");
        return false;
      }
      return {
        ...user,
        accessToken: response.access,
        refreshToken: response.refresh,
      };
    } catch (error) {
      console.error(error);
      return false;
    }
  },
};

const SIGN_IN_PROVIDERS = Object.keys(SIGN_IN_HANDLERS);

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
  Google({
    clientId: process.env.AUTH_GOOGLE_ID,
    clientSecret: process.env.AUTH_GOOGLE_SECRET,
    authorization: {
      params: {
        prompt: "consent",
        access_type: "offline",
        response_type: "code",
      },
    },
  }),
];

const config = {
  providers: providers,
  session: {
    strategy: "jwt",
    maxAge: BACKEND_REFRESH_TOKEN_LIFETIME,
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log("signin");
      if (account?.provider && !SIGN_IN_PROVIDERS.includes(account?.provider))
        return false;

      if (account?.provider && account?.provider in SIGN_IN_HANDLERS) {
        return (SIGN_IN_HANDLERS as any)[account?.provider](
          user,
          account,
          profile,
          email,
          credentials
        );
      }
    },

    async jwt({ token, user, account, trigger }) {
      if (token) {
        if (!token.ref) {
          token.ref = getCurrentEpochTime() + BACKEND_ACCESS_TOKEN_LIFETIME;
        }
      }

      if (token.ref && getCurrentEpochTime() > token.ref) {
        if (!token.refreshToken) {
          return null;
        }
        const newToken = await refreshToken(token.refreshToken);
        if (newToken) {
          token.accessToken = newToken.access;
          token.ref = new Date(newToken.access_expiration).getTime() / 1000;
        } else {
          return null;
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

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    ref?: number;
  }
}
