"use client";
import { createUser } from "@/apis/auth/createUser";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
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

interface ErrorResponse {
  [key: string]: string[];
}

const validDomains = ["gmail.com", "astro.ncu.edu.tw", "edu.tw", "edu"];

export default function SignUp() {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      return createUser(values);
    },
    onSuccess: () => {
      router.push("/auth/signin");
      toast.success("User created successfully");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const responseData = error.response?.data;
      if (responseData) {
        Object.keys(responseData).forEach((key) => {
          responseData[key].forEach((message: string) => {
            toast.error(message);
          });
        });
      } else {
        toast.error("Error creating user");
      }
      console.error(responseData);
    },
  });

  const formSchema = z
    .object({
      first_name: z.string(),
      last_name: z.string(),
      institute: z.string(),
      username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
      }),
      password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
      }),
      re_password: z.string(),
      email: z.string().email({ message: "Invalid email address" }),
      use_demo_targets: z.boolean().default(true),
    })
    .refine((data) => data.password === data.re_password, {
      message: "Passwords do not match",
      path: ["re_password"],
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      institute: "NCU",
      username: "",
      password: "",
      re_password: "",
      email: "12345@gmail.com",
      use_demo_targets: true,
    },
  });

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
          Register an account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm items-center justify-center">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => {
              mutation.mutate(values);
            })}
            className="space-y-8 items-center justify-center align-center"
          >
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary-foreground">
                    First Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="text-primary-foreground"
                      placeholder="first name"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary-foreground">
                    Last name
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="text-primary-foreground"
                      placeholder="last name"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
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
            <FormField
              control={form.control}
              name="re_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary-foreground">
                    Re-Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="text-primary-foreground"
                      type="password"
                      placeholder="repassword"
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
                  <FormLabel className="text-primary-foreground">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="text-primary-foreground"
                      type="email"
                      placeholder="Email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="use_demo_targets"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 text-primary-foreground">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Let us create sample targets to explore.
                    </FormLabel>
                  </div>
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
