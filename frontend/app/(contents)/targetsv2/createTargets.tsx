import { createTarget } from "@/apis/targets";
import { TagOptions } from "@/components/TagOptions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import FileUpload from "./fileUpload";

export function NewTargetFrom() {
  const [open, setOpen] = React.useState(false);
  const [selectedTags, setSelectedTags] = React.useState<
    z.infer<typeof formSchema>["tags"]
  >([]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    createTarget(values)
      .then(() => {
        toast.success("Registered successfully");
      })
      .catch((error) => {
        for (const key in error.data) {
          toast.error(`${key}: ${error.data[key][0]}`);
        }
      });
  }

  const handleTagChange = (tags: z.infer<typeof formSchema>["tags"]) => {
    setSelectedTags(tags);
  };

  React.useEffect(() => {
    console.log(selectedTags);
  }, [selectedTags]);

  const formSchema = z.object({
    name: z.string(),
    ra: z.preprocess((val) => parseFloat(val as string), z.number()),
    dec: z.preprocess((val) => parseFloat(val as string), z.number()),
    tags: z.array(
      z.object({
        name: z.string(),
        targets: z.array(z.number()),
        observations: z.array(z.number()),
      })
    ),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      ra: 0,
      dec: 0,
      tags: selectedTags,
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={"lg"} variant="outline">
          Create target
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] lg:max-w-[850px] lg:max-h-[700px]">
        <DialogHeader>
          <DialogTitle>New Target info</DialogTitle>
          <DialogDescription>
            Enter the {`target's`} info to create a new target. We also support
            csv file for bulk upload.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 items-center justify-center align-center"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary-foreground">
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="text-primary-foreground"
                      placeholder="Target name"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="ra"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary-foreground">
                      RA
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="text-primary-foreground w-full"
                        placeholder="ra"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dec"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary-foreground">
                      Dec
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="text-primary-foreground w-full"
                        placeholder="Dec"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary-foreground">
                    Tags
                  </FormLabel>
                  <FormControl>
                    <TagOptions {...field} />
                  </FormControl>
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
        <FileUpload setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
