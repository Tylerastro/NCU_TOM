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

export function NewTargetFrom({ refetch }: { refetch: () => void }) {
  const [open, setOpen] = React.useState(false);
  const [selectedTags, setSelectedTags] = React.useState<
    z.infer<typeof formSchema>["tags"]
  >([]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    createTarget(values)
      .then(() => {
        toast.success("Target created successfully");
        setOpen(false);
        refetch();
      })
      .catch((error) => {
        for (const key in error.data) {
          toast.error(`${key}: ${error.data[key][0]}`);
        }
      });
  }

  const formSchema = z.object({
    name: z.string(),
    ra: z.preprocess(convertHourAngleToDegrees, z.number().min(0).max(360)),
    dec: z.preprocess(
      convertSexagesimalDegreesToDecimal,
      z.number().min(-90).max(90)
    ),
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
    <Dialog open={open} onOpenChange={setOpen} modal={false}>
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
