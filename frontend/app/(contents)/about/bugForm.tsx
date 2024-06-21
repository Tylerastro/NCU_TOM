"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {}

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
        <TooltipProvider>
          <Tooltip delayDuration={200}>
            <TooltipTrigger disabled={false}>
              <Button disabled type="submit">
                Submit
              </Button>
            </TooltipTrigger>
            <TooltipContent sticky="always" sideOffset={40}>
              <p>Feature coming soon</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </form>
    </Form>
  );
}
