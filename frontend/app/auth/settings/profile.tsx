"use client";
import { updateUser } from "@/apis/auth/updateUser";
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
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  first_name: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  last_name: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  institute: z.string().min(2, {
    message: "Institute must be at least 2 characters.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function UpdateProfile({
  userId,
  username,
  first_name,
  last_name,
  institute,
}: {
  userId: number;
  username: string;
  first_name: string;
  last_name: string;
  institute: string;
}) {
  const { update } = useSession();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username,
      first_name,
      last_name,
      institute,
    },
  });

  const onSubmit = (data: FormValues) => {
    updateUser(userId, data)
      .then(() => {
        toast.success("Profile updated successfully");
        update({
          user: {
            first_name: data.first_name,
            last_name: data.last_name,
            institute: data.institute,
            username: data.username,
          },
        });
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 items-center justify-center align-center px-3 py-4"
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
                <Input className="text-primary-foreground" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary-foreground">
                First name
              </FormLabel>
              <FormControl>
                <Input className="text-primary-foreground" {...field} />
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
              <FormLabel className="text-primary-foreground">
                Last name
              </FormLabel>
              <FormControl>
                <Input className="text-primary-foreground" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="institute"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary-foreground">
                Institute
              </FormLabel>
              <FormControl>
                <Input className="text-primary-foreground" {...field} />
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
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}
