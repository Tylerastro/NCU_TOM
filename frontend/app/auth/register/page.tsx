"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { createUser } from "@/apis/auth/createUser";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SignUp() {
  const router = useRouter();

  const roleMap = {
    Admin: 1,
    Faculty: 2,
    User: 3,
  };

  const formSchema = z.object({
    first_name: z.string(),
    last_name: z.string(),
    institute: z.string(),
    username: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    password: z.string(),
    re_password: z.string(),
    email: z.string().email(),
    use_demo_targets: z.boolean().default(true),
    role: z
      .enum(["Admin", "Faculty", "User"])
      .transform((role) => roleMap[role]),
  });

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
      role: roleMap["User"],
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    createUser(values)
      .then(() => {
        toast.success("User created successfully");
        router.push("/auth/signin");
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
          Register an account
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
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary-foreground">
                    Role
                  </FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl className="text-primary-foreground">
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Admin"> Admin</SelectItem>
                      <SelectItem value="Faculty">Faculty</SelectItem>
                      <SelectItem value="User">User</SelectItem>
                    </SelectContent>
                  </Select>

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
