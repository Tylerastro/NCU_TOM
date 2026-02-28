"use client";
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
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { z } from "zod";

function onSubmit(values: z.infer<typeof formSchema>) {
  const { username, password } = values;
  signIn("credentials", {
    username,
    password,
    callbackUrl: "/",
  });
}

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string(),
});

export default function CredentialForm() {
  const searchParams = useSearchParams();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    console.log("fired");
    const error = searchParams.get("error");
    if (error === "CredentialsSignin") {
      toast.error("Invalid username or password");
    }
  }, [searchParams]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5"
      >
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
                  className="bg-gray-800/50 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:border-amber-500/50 focus:ring-amber-500/20 transition-colors"
                  placeholder="Enter your username"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel className="text-gray-300 text-sm font-medium">
                  Password
                </FormLabel>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-amber-500 hover:text-amber-400 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <FormControl>
                <Input
                  className="bg-gray-800/50 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:border-amber-500/50 focus:ring-amber-500/20 transition-colors"
                  type="password"
                  placeholder="Enter your password"
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
        >
          Sign in
        </Button>
      </form>
    </Form>
  );
}
