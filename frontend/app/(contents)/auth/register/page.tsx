"use client";
import { createUser } from "@/apis/auth";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { handleApiError } from "@/utils/errorHandler";
import { ValidationErrors } from "@/types/api";

const validDomains = ["gmail.com", "astro.ncu.edu.tw", "edu.tw", "edu"];

const formSchema = z
  .object({
    first_name: z.string().min(1, { message: "First name is required" }),
    last_name: z.string().min(1, { message: "Last name is required" }),
    institute: z.string().min(1, { message: "Institute is required" }),
    username: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    password1: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    password2: z.string(),
    email: z.string().email({ message: "Invalid email address" }),
  })
  .refine((data) => data.password1 === data.password2, {
    message: "Passwords do not match",
    path: ["password2"],
  })
  .refine(
    (data) => {
      const emailDomain = data.email.split("@").pop() || "";
      return validDomains.some((domain) => emailDomain.endsWith(domain));
    },
    {
      message: "Invalid email domain",
      path: ["email"],
    }
  );

const inputClassName =
  "bg-gray-800/50 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:border-amber-500/50 focus:ring-amber-500/20 transition-colors";

export default function SignUp() {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      return createUser(values);
    },
    onSuccess: () => {
      router.push("/auth/signin");
      toast.success(
        "Account created! Please check your email to activate your account before signing in.",
        { duration: 6000 }
      );
    },
    onError: (error: AxiosError<ValidationErrors>) => {
      handleApiError(error);
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      institute: "",
      username: "",
      password1: "",
      password2: "",
      email: "",
    },
  });

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 ">
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
              Create an account
            </h1>
            <p className="text-gray-400 text-sm">
              Join NCU TOM to manage your observations
            </p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((values) => {
                mutation.mutate(values);
              })}
              className="space-y-4"
            >
              {/* Name fields in a row */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300 text-sm font-medium">
                        First Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          className={inputClassName}
                          placeholder="First name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300 text-sm font-medium">
                        Last Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          className={inputClassName}
                          placeholder="Last name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="institute"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300 text-sm font-medium">
                      Institute
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={inputClassName}
                        placeholder="Institute / Organization"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300 text-sm font-medium">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={inputClassName}
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300 text-sm font-medium">
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={inputClassName}
                        placeholder="Choose a username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300 text-sm font-medium">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={inputClassName}
                        type="password"
                        placeholder="Create a password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300 text-sm font-medium">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={inputClassName}
                        type="password"
                        placeholder="Confirm your password"
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
                {mutation.isPending ? "Creating account..." : "Create account"}
              </Button>
            </form>
          </Form>

          {/* Sign in link */}
          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{" "}
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
