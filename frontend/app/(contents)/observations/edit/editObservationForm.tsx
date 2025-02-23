import { putObservation } from "@/apis/observations/putObservation";
import { TagOptions } from "@/components/TagOptions";
import TargetModal from "@/components/TargetModal";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/components/utils";
import { Observation } from "@/models/observations";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, toZonedTime } from "date-fns-tz";
import { CalendarIcon } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { z } from "zod";

export function EditObservationFrom({
  pk,
  observation,
}: {
  pk: number;
  observation: Observation;
}) {
  const [open, setOpen] = React.useState(false);

  function onSubmit(values: z.infer<typeof formSchema>) {
    // * UI is using observatory local time,
    values.start_date = toZonedTime(
      new Date(format(values.start_date, "yyyy-MM-dd" + " 18:00:00")),
      "Asia/Taipei"
    );
    values.end_date.setDate(values.end_date.getDate());
    values.end_date = toZonedTime(
      new Date(format(values.end_date, "yyyy-MM-dd" + " 06:00:00")),
      "Asia/Taipei"
    );
    putObservation(pk, values)
      .then(() => {
        toast.success("Observation created successfully");
        setOpen(false);
      })
      .catch((error) => {
        const error_code = error.response.status;
        toast.error(
          `Error ${error_code}, Please check your inputs and try again`
        );
      });
  }

  const formSchema = z.object({
    name: z.string().optional(),
    observatory: z.number().transform(Number),
    priority: z.number().transform(Number),
    start_date: z.date(),
    end_date: z.date(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: observation.name,
      priority: observation.priority,
      observatory: observation.observatory,
      start_date: new Date(observation.start_date),
      end_date: new Date(observation.end_date),
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen} modal={false}>
      <DialogTrigger asChild>
        <Button size={"lg"} variant="ghost">
          {observation.name}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] lg:max-w-[850px] lg:max-h-[700px]">
        <DialogHeader>
          <DialogTitle>Edit Observation</DialogTitle>
          <DialogDescription>Modify your observation</DialogDescription>
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
                      placeholder="Observation name"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              {" "}
              <FormField
                control={form.control}
                name="observatory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observatory</FormLabel>
                    <Select
                      disabled
                      onValueChange={field.onChange}
                      defaultValue="1"
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a observatory" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={"1"}>Lulin</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={"1"}>High</SelectItem>
                        <SelectItem value={"2"}>Medium</SelectItem>
                        <SelectItem value={"3"}>Low</SelectItem>
                        <SelectItem value={"4"}>Too</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            type="button"
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date <= new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            type="button"
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
            </div>
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
      </DialogContent>
    </Dialog>
  );
}
