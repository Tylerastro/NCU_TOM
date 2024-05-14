"use client";

import axios from "@/apis/axios";
import { useSession } from "next-auth/react";

export const useRefreshToken = () => {
  const { data: session } = useSession();

  const refreshToken = async () => {
    const res = await axios.post("/api/jwt/refresh/", {
      refresh: session?.user.refreshToken,
    });

    if (session) session.user.accessToken = res.data.access;
  };
  return refreshToken;
};
