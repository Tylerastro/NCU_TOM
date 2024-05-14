"use client";

import TargetApis from "@/apis/targets";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/components/utils";
import { Target } from "@/models/targets";
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().optional(),
  observatory: z.string().transform(Number),
  priority: z.string().transform(Number),
  targets: z.array(z.number()),
  start_date: z.string(),
  end_date: z.string(),
  tags: z.array(
    z.object({
      name: z.string(),
      targets: z.array(z.number()),
      observations: z.array(z.number()),
    })
  ),
});

interface TargetOptionsProps {
  onChange: (tags: z.infer<typeof formSchema>["targets"]) => void;
  value: z.infer<typeof formSchema>["targets"];
}

export const TargetOptions: React.FC<TargetOptionsProps> = React.forwardRef(
  (props: TargetOptionsProps, ref) => {
    const { fetchTargets } = TargetApis();
    const { onChange, value } = props;
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const [targets, setTargets] = React.useState<Target[]>([]);
    const [selectedTargets, setSelectedTargets] = React.useState<number[]>([]);

    React.useEffect(() => {
      fetchTargets()
        .then((data) => {
          setTargets(data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }, []);

    React.useEffect(() => {
      onChange(selectedTargets);
    }, [selectedTargets, onChange]);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedTargets.length > 0
              ? selectedTargets
                  .map(
                    (targetId) =>
                      targets.find((target) => target.id === targetId)?.name
                  )
                  .filter(Boolean)
                  .join(", ")
              : "Select Targets..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput
              value={search}
              onValueChange={setSearch}
              placeholder="Search tag..."
            />
            <CommandEmpty>
              <p>No targets found.</p>
            </CommandEmpty>
            <CommandGroup>
              {targets.map((target) => (
                <CommandItem
                  key={target.id ?? "unique-key"} // Use a fallback value for the key if id is undefined or null
                  value={target.name}
                  onSelect={(currentValue) => {
                    setSelectedTargets((prevSelectedTargets) => {
                      const targetId = target.id; // Assign the target.id to a variable

                      if (
                        targetId !== undefined &&
                        prevSelectedTargets.includes(targetId)
                      ) {
                        // Check if targetId is not undefined before using it
                        return prevSelectedTargets.filter(
                          (id) => id !== targetId
                        );
                      } else if (targetId !== undefined) {
                        // Check if targetId is not undefined before using it
                        return [...prevSelectedTargets, targetId];
                      } else {
                        // If targetId is undefined, keep the previous state
                        return prevSelectedTargets;
                      }
                    });
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      target.id !== undefined &&
                        selectedTargets.includes(target.id) // Check if target.id is not undefined before using it
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {target.name}
                </CommandItem>
              ))}
            </CommandGroup>
            {selectedTargets.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => setSelectedTargets([])}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);

TargetOptions.displayName = "TargetOptions";
