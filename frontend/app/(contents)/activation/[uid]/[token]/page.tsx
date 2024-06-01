"use client";

import { activateAccount } from "@/apis/auth/activation";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function Page({
  params,
}: {
  params: { uid: string; token: string };
}) {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: ({ uid, token }: { uid: string; token: string }) => {
      return activateAccount(uid, token);
    },
    onSuccess: () => {
      toast.success("Account activated");
      toast.success("Redirecting to login page");
    },
  });

  useEffect(() => {
    try {
      mutation.mutate({ uid: params.uid, token: params.token });
    } catch (error) {
      toast.error("Error activating account");
      router.push("/");
    } finally {
      router.push("/auth/signin");
    }
  }, []);

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h1 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Activating your account...
        </h1>
      </div>
    </div>
  );
}
