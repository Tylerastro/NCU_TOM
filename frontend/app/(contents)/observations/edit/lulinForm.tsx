"use client";
import { putLulin } from "@/apis/observations/putLulin";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
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
import { LulinRuns } from "@/models/observations";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { LulinFilter, LulinInstrument } from "@/models/enums";

const formSchema = z.object({
  priority: z.number().transform(Number),
  filter: z.number(),
  binning: z.coerce.number().int().min(1).default(1),
  frames: z.coerce.number().int().min(1).default(1),
  instrument: z.number(),
  exposure_time: z.coerce.number().int().default(10),
  start_date: z.date(),
  end_date: z.date(),
});

export function TargetLulinForm({
  observation,
  refetch,
}: {
  observation: LulinRuns;
  refetch: () => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      priority: observation.priority,
      filter: observation.filter,
      binning: observation.binning,
      frames: observation.frames,
      instrument: observation.instrument,
      exposure_time: observation.exposure_time,
      start_date: new Date(observation.start_date),
      end_date: new Date(observation.end_date),
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    putLulin(observation.id, values)
      .then(() => {
        toast.success("Observation updated successfully");
        refetch();
      })
      .catch((error) => {
        for (const key in error.data) {
          toast.error(`${key}: ${error.data[key][0]}`);
        }
      });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 items-center justify-center align-center"
      >
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
        />{" "}
        <FormField
          control={form.control}
          name="filter"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Filters</FormLabel>
              </div>
              <div className="flex gap-3">
                {Object.entries(LulinFilter)
                  .filter(([key]) => isNaN(Number(key)))
                  .map(([key, value]) => (
                    <FormField
                      key={key}
                      control={form.control}
                      name="filter"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={key}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value === value}
                                onCheckedChange={() => field.onChange(value)}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">{key}</FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
              </div>
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="binning"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Binning</FormLabel>
                <FormControl>
                  <Input
                    className="text-primary-foreground"
                    placeholder="Binning"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="frames"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frames</FormLabel>
                <FormControl>
                  <Input
                    className="text-primary-foreground"
                    placeholder="Frames"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="exposure_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Exposure time</FormLabel>
                <FormControl>
                  <Input
                    className="text-primary-foreground"
                    placeholder="Exposure time"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="instrument"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Instruments</FormLabel>
                </div>
                {Object.entries(LulinInstrument)
                  .filter(([key]) => isNaN(Number(key)))
                  .map(([key, value]) => (
                    <FormField
                      key={key}
                      control={form.control}
                      name="instrument"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={key}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value === value}
                                onCheckedChange={() => field.onChange(value)}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">{key}</FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
              </FormItem>
            )}
          />
        </div>
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
                      disabled
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
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date(observation.start_date) ||
                      new Date(observation.end_date) < date
                    }
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
                      disabled
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
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
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
  );
}
