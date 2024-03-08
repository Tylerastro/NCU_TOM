"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { useRetrieveUserQuery } from "@/redux/features/authApiSlice";

const IsAdminOrFaculty = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { data } = useRetrieveUserQuery();

  React.useEffect(() => {
    if (data && ![1, 2].includes(data.role)) {
      router.push("/");
    }
  }, [data, router]);

  return data && [1, 2].includes(data.role) ? children : null;
};

export default IsAdminOrFaculty;
