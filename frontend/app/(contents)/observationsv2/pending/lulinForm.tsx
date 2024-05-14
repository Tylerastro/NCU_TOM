"use client";

import ObservationApis from "@/apis/observations";
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
import { LulinObservations } from "@/models/observations";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const filters = [
  {
    id: "u",
    label: "u",
  },
  {
    id: "g",
    label: "g",
  },
  {
    id: "r",
    label: "r",
  },
  {
    id: "i",
    label: "i",
  },
  {
    id: "z",
    label: "z",
  },
] as const;

const instruments = [
  {
    id: "LOT",
    label: "LOT",
  },
  {
    id: "SLT",
    label: "SLT",
  },
  {
    id: "TRIPOL",
    label: "TRIPOL",
  },
];

const formSchema = z.object({
  priority: z.number().int().min(1).max(10).default(5),
  filters: z.record(z.boolean()).default({}),
  binning: z.coerce.number().int().min(1).default(1),
  frames: z.coerce.number().int().min(1).default(1),
  instruments: z.record(z.boolean()).default({}),
  exposure_time: z.number().int().default(10),
  start_date: z.date(),
  end_date: z.date(),
});

export function TargetLulinForm({
  observation,
}: {
  observation: LulinObservations;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      priority: observation.priority,
      filters: observation.filters,
      binning: observation.binning,
      frames: observation.frames,
      instruments: observation.instruments,
      exposure_time: observation.exposure_time,
      start_date: new Date(observation.start_date),
      end_date: new Date(observation.end_date),
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { putLulin } = ObservationApis();
    putLulin(observation.id, values)
      .then(() => {
        toast.success("Observation updated successfully");
        Object.assign(observation, values);
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
                onValueChange={(value) => {
                  field.onChange(parseInt(value));
                }}
                defaultValue={field.value.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a priority" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={"1"}>1</SelectItem>
                  <SelectItem value={"2"}>2</SelectItem>
                  <SelectItem value={"3"}>3</SelectItem>
                  <SelectItem value={"4"}>4</SelectItem>
                  <SelectItem value={"5"}>5</SelectItem>
                  <SelectItem value={"6"}>6</SelectItem>
                  <SelectItem value={"7"}>7</SelectItem>
                  <SelectItem value={"8"}>8</SelectItem>
                  <SelectItem value={"9"}>9</SelectItem>
                  <SelectItem value={"10"}>10</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />{" "}
        <FormField
          control={form.control}
          name="filters"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Filters</FormLabel>
              </div>
              <div className="flex gap-3">
                {filters.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="filters"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.[item.id] ?? false}
                              onCheckedChange={(checked) => {
                                field.onChange({
                                  ...field.value,
                                  [item.id]: checked,
                                });
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {item.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-2">
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
        <FormField
          control={form.control}
          name="instruments"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Instruments</FormLabel>
              </div>
              {instruments.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name="instruments"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={item.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.[item.id] ?? false}
                            onCheckedChange={(checked) => {
                              field.onChange({
                                ...field.value,
                                [item.id]: checked,
                              });
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {item.label}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
            </FormItem>
          )}
        />
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
