"use client";

import { confirmPasswordReset } from "@/apis/auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { handleApiError } from "@/utils/errorHandler";
import { ValidationErrors } from "@/types/api";

const formSchema = z
  .object({
    new_password1: z.string().min(8, {
      message: "Password must be at least 8 characters",
    }),
    new_password2: z.string(),
  })
  .refine((data) => data.new_password1 === data.new_password2, {
    message: "Passwords do not match",
    path: ["new_password2"],
  });

export default function PasswordResetPage() {
  const params = useParams();
  const router = useRouter();
  const uid = params.uid as string;
  const token = params.token as string;
  const [success, setSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      new_password1: "",
      new_password2: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) =>
      confirmPasswordReset(
        uid,
        token,
        values.new_password1,
        values.new_password2
      ),
    onSuccess: () => {
      setSuccess(true);
      toast.success("Password reset successfully!");
    },
    onError: (error: AxiosError<ValidationErrors>) => {
      handleApiError(error);
    },
  });

  if (success) {
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
                Password Reset Complete
              </h1>
              <p className="text-gray-400 mb-6">
                Your password has been successfully reset. You can now sign in
                with your new password.
              </p>
              <Link href="/auth/signin">
                <Button className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white border-0 shadow-lg shadow-amber-900/20">
                  Sign in
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-100 mb-2">
              Set new password
            </h1>
            <p className="text-gray-400 text-sm">
              Enter your new password below
            </p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
              className="space-y-5"
            >
              <FormField
                control={form.control}
                name="new_password1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300 text-sm font-medium">
                      New Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="bg-gray-800/50 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:border-amber-500/50 focus:ring-amber-500/20 transition-colors"
                        type="password"
                        placeholder="Enter new password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="new_password2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300 text-sm font-medium">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="bg-gray-800/50 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:border-amber-500/50 focus:ring-amber-500/20 transition-colors"
                        type="password"
                        placeholder="Confirm new password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className="w-full mt-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white border-0 shadow-lg shadow-amber-900/20 transition-all duration-300 hover:shadow-amber-600/30"
                type="submit"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Resetting..." : "Reset password"}
              </Button>
            </form>
          </Form>

          {/* Back to sign in link */}
          <p className="mt-8 text-center text-sm text-gray-400">
            Remember your password?{" "}
            <Link
              href="/auth/signin"
              className="font-medium text-amber-500 hover:text-amber-400 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
