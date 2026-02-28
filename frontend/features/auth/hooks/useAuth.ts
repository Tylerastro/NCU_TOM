"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { signIn, signOut, useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  getUser,
  updateUser,
  deleteUser,
  createUser,
  activateAccount,
} from "@/apis/auth";
import { handleApiError } from "@/lib/utils/error";
import type { UserUpdate, NewUser } from "@/types";

export const AUTH_QUERY_KEYS = {
  user: ["auth", "user"] as const,
  profile: (id: number) => ["auth", "profile", id] as const,
};

/**
 * Hook for accessing the current session
 */
export function useAuth() {
  const session = useSession();

  return {
    session,
    user: session.data?.user,
    isAuthenticated: session.status === "authenticated",
    isLoading: session.status === "loading",
    isAdmin: session.data?.user?.role === 1, // UserRole.Admin
    isFaculty:
      session.data?.user?.role === 1 || session.data?.user?.role === 2, // Admin or Faculty
  };
}

/**
 * Hook for fetching the current user profile
 */
export function useUserProfile(enabled = true) {
  const { isAuthenticated, session } = useAuth();
  const accessToken = (session.data as { accessToken?: string } | null)?.accessToken;

  return useQuery({
    queryKey: AUTH_QUERY_KEYS.user,
    queryFn: () => getUser(accessToken || ""),
    enabled: enabled && isAuthenticated && !!accessToken,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for updating user profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: number; data: UserUpdate }) =>
      updateUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.user });
      toast.success("Profile updated successfully");
    },
    onError: (error: unknown) => {
      handleApiError(error, "Failed to update profile");
    },
  });
}

/**
 * Hook for deleting user account
 */
export function useDeleteAccount() {
  return useMutation({
    mutationFn: (userId: number) => deleteUser(userId),
    onSuccess: async () => {
      toast.success("Account deleted successfully");
      await signOut({ callbackUrl: "/" });
    },
    onError: (error: unknown) => {
      handleApiError(error, "Failed to delete account");
    },
  });
}

/**
 * Hook for creating a new user (registration)
 */
export function useRegister() {
  return useMutation({
    mutationFn: (data: NewUser) => createUser(data),
    onSuccess: () => {
      toast.success("Registration successful! Please check your email to activate your account.");
    },
    onError: (error: unknown) => {
      handleApiError(error, "Registration failed");
    },
  });
}

/**
 * Hook for activating a user account
 */
export function useActivateAccount() {
  return useMutation({
    mutationFn: ({ uid, token }: { uid: string; token: string }) =>
      activateAccount(uid, token),
    onSuccess: () => {
      toast.success("Account activated successfully! You can now sign in.");
    },
    onError: (error: unknown) => {
      handleApiError(error, "Account activation failed");
    },
  });
}

/**
 * Helper function to sign in with credentials
 */
export async function signInWithCredentials(
  username: string,
  password: string,
  callbackUrl?: string
) {
  const result = await signIn("credentials", {
    username,
    password,
    redirect: false,
  });

  if (result?.error) {
    throw new Error(result.error);
  }

  if (callbackUrl) {
    window.location.href = callbackUrl;
  }

  return result;
}

/**
 * Helper function to sign in with OAuth provider
 */
export async function signInWithProvider(
  provider: "github" | "google",
  callbackUrl?: string
) {
  await signIn(provider, { callbackUrl: callbackUrl || "/observations" });
}
