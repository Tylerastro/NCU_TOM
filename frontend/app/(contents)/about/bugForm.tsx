"use client";
import { createIssue } from "@/apis/github/createIssue";

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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";

const FormSchema = z.object({
  title: z
    .string()
    .min(5, {
      message: "Meaningless title. Try something more descriptive.",
    })
    .max(30, {
      message: "Title must not be longer than 30 characters.",
    }),
  content: z
    .string()
    .min(30, { message: "Please describe your bug at least 30 characters" }),
});

export function BugForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const response = await createIssue(
        form.getValues().title,
        form.getValues().content
      );
      if (response.status === 201) {
        form.reset();
        toast.success("Issue created successfully");
      }
    } catch (error) {
      toast.error("Error creating issue, please try again");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Title</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="The button is not working!"
                  className="resize-none"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="The button on the top right is not working! I can never logout"
                  className="resize-none"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
