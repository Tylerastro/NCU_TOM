"use client";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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

export default function SignInPage() {
  const router = useRouter();

  const formSchema = z.object({
    username: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    password: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    signIn("credentials", {
      username: values.username,
      password: values.password,
    })
      .then(() => {
        router.push("/");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div className="flex min-h-full flex-col justify-center px-12 py-12 lg:px-12">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm items-center justify-center align-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="gray"
          className="mx-auto h-16 w-auto"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
          />
        </svg>

        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-primary-foreground">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm items-center justify-center">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 items-center justify-center align-center"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary-foreground">
                    Username
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="text-primary-foreground"
                      placeholder="username"
                      {...field}
                    />
                  </FormControl>
                  {/* <FormDescription> */}
                  {/* This is your public display name. */}
                  {/* </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary-foreground">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="text-primary-foreground"
                      type="password"
                      placeholder="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="text-center w-full">
              <Button
                className="w-full text-primary-foreground bg-primary"
                type="submit"
              >
                Submit
              </Button>
            </div>
          </form>
        </Form>
        <p className="mt-10 text-center text-sm text-primary-foreground">
          Not a member?{" "}
          <a
            href="/auth/register"
            className="font-semibold leading-6 text-primary-foreground hover:text-popover-foreground"
          >
            Sign up here!
          </a>
        </p>
      </div>
    </div>
  );
}
