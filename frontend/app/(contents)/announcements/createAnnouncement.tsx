"use client";
import { createAnnouncement } from "@/apis/announcements";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

function isHourAngleFormat(input: string) {
  const hourAnglePattern = /^\d{1,2}:\d{1,2}(:\d{1,2}(\.\d+)?)?$/;
  return hourAnglePattern.test(input);
}
function convertHourAngleToDegrees(hourAngle: unknown) {
  if (typeof hourAngle !== "string") {
    return 0;
  }
  if (!isHourAngleFormat(hourAngle)) {
    return parseFloat(hourAngle);
  }

  const parts = hourAngle.split(":");
  if (parts.length !== 3) {
    return 0;
  }

  const hours = parseFloat(parts[0]);
  const minutes = parseFloat(parts[1]);
  const seconds = parseFloat(parts[2]);

  const degrees = (hours + minutes / 60 + seconds / 3600) * 15;
  return degrees;
}

function convertSexagesimalDegreesToDecimal(sexagesimal: unknown) {
  if (typeof sexagesimal !== "string") {
    return 0;
  }
  if (!isHourAngleFormat(sexagesimal)) {
    return parseFloat(sexagesimal);
  }

  const parts = sexagesimal.split(":");
  if (parts.length !== 3) {
    return 0;
  }

  const degrees = parseFloat(parts[0]);
  const minutes = parseFloat(parts[1]);
  const seconds = parseFloat(parts[2]);
  const decimalDegrees = degrees + minutes / 60 + seconds / 3600;
  return decimalDegrees;
}

export function NewAnnouncementForm() {
  const [open, setOpen] = React.useState(false);

  function onSubmit(values: z.infer<typeof formSchema>) {
    createAnnouncement(values)
      .then(() => {
        toast.success("New announcement released successfully");
        setOpen(false);
      })
      .catch((error) => {
        for (const key in error.data) {
          toast.error(`${key}: ${error.data[key][0]}`);
        }
      });
  }

  const formSchema = z.object({
    title: z.string(),
    context: z.string(),
    type: z.coerce.number(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "Inspire Everyone!",
      type: 1,
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={"lg"} variant="outline">
          New Announcement
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] lg:max-w-[850px] lg:max-h-[700px]">
        <DialogHeader>
          <DialogTitle>Details</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 items-center justify-center align-center"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary-foreground">
                    Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="text-primary-foreground"
                      placeholder="Insipring Title"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue="1">
                    <FormControl className="w-2/12">
                      <SelectTrigger>
                        <SelectValue placeholder="Select a verified email to display" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">Info</SelectItem>
                      <SelectItem value="2">Warning</SelectItem>
                      <SelectItem value="3">Error</SelectItem>
                      <SelectItem value="4">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="context"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Context</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Inspire Everyone! "
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
