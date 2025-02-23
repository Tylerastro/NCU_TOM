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
import { AxiosError } from "axios";
import { AuthError } from "next-auth";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { z } from "zod";

function onSubmit(values: z.infer<typeof formSchema>) {
  const { username, password } = values;
  try {
    signIn("credentials", {
      username,
      password,
      callbackUrl: "/",
    });
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error("Unknown error, please try again");
    } else if (error instanceof AuthError)
      switch (error.type) {
        case "CredentialsSignin":
          toast.error("Invalid username or password");
      }
    else {
      toast.error("Error signing in");
    }
  }
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
    const error = searchParams.get("error");
    if (error === "CredentialsSignin") {
      toast.error("Invalid username or password");
    }
  }, [searchParams]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 py-5 items-center justify-center align-center"
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
  );
}
