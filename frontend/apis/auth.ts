import { api, authApi } from "./lib/client";
import { UserProfile, UserUpdate, NewUser } from "@/models/users";

// ============================================================================
// Token & Authentication
// ============================================================================

interface TokenResponse {
  refresh: string;
  access: string;
}

interface TokenRefreshResponse {
  access: string;
  access_expiration: Date;
}

export async function getToken(
  username: string,
  password: string
): Promise<TokenResponse> {
  const response = await authApi.post("/api/login/", {
    username,
    password,
  });
  return response.data;
}

export async function refreshToken(refresh: string): Promise<TokenRefreshResponse> {
  const response = await authApi.post("/api/token/refresh/", { refresh });
  return response.data;
}

// ============================================================================
// OAuth
// ============================================================================

export async function loginWithGoogle(
  idToken: string
): Promise<TokenResponse> {
  const response = await authApi.post("/api/oauth/google/", {
    access_token: idToken,
  });
  return response.data;
}

export async function loginWithGithub(code: string): Promise<TokenResponse> {
  const response = await authApi.post("/api/oauth/github/", {
    access_token: code,
  });
  return response.data;
}

// ============================================================================
// User Management
// ============================================================================

export async function getUser(accessToken: string): Promise<UserProfile> {
  const response = await authApi.get("/api/user/", {
    headers: {
      Authorization: `JWT ${accessToken}`,
    },
  });
  return response.data;
}

export async function createUser(user: NewUser) {
  const response = await authApi.post("/api/register/", user);
  return response.data;
}

export async function updateUser(
  userId: number,
  data: UserUpdate
): Promise<UserProfile> {
  const response = await api.put(`/api/user/${userId}/edit/`, data);
  return response.data;
}

export async function deleteUser(userId: number) {
  const response = await api.delete(`/api/user/${userId}/delete/`);
  return response.data;
}

// ============================================================================
// Account Activation
// ============================================================================

export async function activateAccount(uid: string, token: string) {
  const response = await authApi.post("/api/users/activation/", {
    uid,
    token,
  });
  return response.data;
}

export async function resendActivationEmail(email: string) {
  const response = await authApi.post("/api/users/resend_activation/", {
    email,
  });
  return response.data;
}

// ============================================================================
// Password Reset
// ============================================================================

export async function requestPasswordReset(email: string) {
  const response = await authApi.post("/api/password/reset/", { email });
  return response.data;
}

export async function confirmPasswordReset(
  uid: string,
  token: string,
  new_password1: string,
  new_password2: string
) {
  const response = await authApi.post("/api/password/reset/confirm/", {
    uid,
    token,
    new_password1,
    new_password2,
  });
  return response.data;
}
