"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { AuthError } from "next-auth";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

export default function SignInPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  useEffect(() => {
    if (searchParams.error === "CredentialsSignin") {
      toast.error("Invalid username or password");
    }
  }, []);

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

  return (
    <div className="flex min-h-full flex-col justify-center px-12 py-12 lg:px-12">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm items-center justify-center align-center">
        <Image
          width={250}
          height={250}
          src="/main-logo-white-transparent.png"
          alt="NCU Tom Logo"
          className="object-contain h-48 w-96"
        />

        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-primary-foreground">
          Sign in to your account
        </h2>
        <CredentialForm />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-sm items-center justify-center">
        <GitHubSignIn />
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
