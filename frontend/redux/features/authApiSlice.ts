import { apiSlice } from "../services/apiSlice";
import { User } from "@/models/helpers";

const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    retrieveUser: builder.query<User, void>({
      query: () => ({
        url: "/users/me/",
        method: "GET",
        credentials: "include",
      }),
    }),
    googleAuthentication: builder.mutation({
      query: ({ state, code }) => ({
        url: `/o/google-oauth2/?state=${encodeURIComponent(
          state
        )}&code=${encodeURIComponent(code)}`,
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }),
    }),
    login: builder.mutation({
      query: ({ username, password }) => ({
        url: "/jwt/create/",
        method: "POST",
        body: { username, password },
      }),
    }),
    register: builder.mutation({
      query: ({
        first_name,
        last_name,
        email,
        title,
        institute,
        role,
        username,
        password,
        re_password,
      }) => ({
        url: "/users/",
        method: "POST",
        body: {
          first_name,
          last_name,
          email,
          title,
          institute,
          role,
          username,
          password,
          re_password,
        },
      }),
    }),
    verify: builder.mutation({
      query: () => ({
        url: "/jwt/verify/",
        method: "POST",
        credentials: "include",
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/logout/",
        method: "POST",
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ email }) => ({
        url: "/users/reset_password/",
        method: "POST",
        body: { email },
      }),
    }),
    resetPasswordConfirm: builder.mutation({
      query: ({ uid, token, new_password, re_new_password }) => ({
        url: `/users/reset_password_confirm/`,
        method: "POST",
        body: { uid, token, new_password, re_new_password },
      }),
    }),
  }),
});

export const {
  useRetrieveUserQuery,
  useGoogleAuthenticationMutation,
  useVerifyMutation,
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useResetPasswordMutation,
  useResetPasswordConfirmMutation,
} = authApiSlice;
