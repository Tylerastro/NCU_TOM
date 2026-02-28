"use client";

import { activateAccount } from "@/apis/auth";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ActivatePage() {
  const params = useParams();
  const uid = params.uid as string;
  const token = params.token as string;
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState<string>("");

  const mutation = useMutation({
    mutationFn: () => activateAccount(uid, token),
    onSuccess: () => {
      setStatus("success");
    },
    onError: (error: AxiosError<{ detail?: string }>) => {
      setStatus("error");
      setErrorMessage(
        error.response?.data?.detail ||
          "Failed to activate account. The link may be invalid or expired."
      );
    },
  });

  useEffect(() => {
    if (uid && token) {
      mutation.mutate();
    }
  }, [uid, token]);

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 bg-[#030712]">
      {/* Ambient glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-orange-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Main card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-gray-800/50 p-8 shadow-2xl shadow-black/20">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Image
              width={180}
              height={180}
              src="/main-logo-white-transparent.png"
              alt="NCU Tom Logo"
              className="object-contain h-32 w-32"
            />
          </div>

          {/* Content based on status */}
          {status === "loading" && (
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-100 mb-4">
                Activating your account...
              </h1>
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
              </div>
            </div>
          )}

          {status === "success" && (
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-green-500/10 p-3">
                  <svg
                    className="h-8 w-8 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-100 mb-2">
                Account Activated!
              </h1>
              <p className="text-gray-400 mb-6">
                Your account has been successfully activated. You can now sign
                in.
              </p>
              <Link href="/auth/signin">
                <Button className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white border-0 shadow-lg shadow-amber-900/20">
                  Sign in
                </Button>
              </Link>
            </div>
          )}

          {status === "error" && (
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-red-500/10 p-3">
                  <svg
                    className="h-8 w-8 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-100 mb-2">
                Activation Failed
              </h1>
              <p className="text-gray-400 mb-6">{errorMessage}</p>
              <div className="space-y-3">
                <Link href="/auth/signin">
                  <Button
                    variant="outline"
                    className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
                  >
                    Back to Sign in
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
