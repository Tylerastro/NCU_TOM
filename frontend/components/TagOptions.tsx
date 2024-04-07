"use client";

import { fetchTags, postNewTag } from "@/apis/tags";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/components/utils";
import { NewTag, Tag } from "@/models/helpers";
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";
import { z } from "zod";

const formSchema = z.object({
  name: z.string(),
  ra: z.number(),
  dec: z.number(),
  tags: z.array(
    z.object({
      name: z.string(),
      targets: z.array(z.number()),
      observations: z.array(z.number()),
    })
  ),
});

interface TagOptionsProps {
  onChange: (tags: z.infer<typeof formSchema>["tags"]) => void;
  value: z.infer<typeof formSchema>["tags"];
}

export function TagOptions(props: TagOptionsProps) {
  const { onChange, value } = props;
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [tags, setTags] = React.useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = React.useState<Tag[]>([]);

  React.useEffect(() => {
    fetchTags()
      .then((data) => {
        setTags(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const createTag = (name: string) => {
    const NewTag: NewTag = {
      name: name,
    };
    postNewTag(NewTag)
      .then((data) => {
        setTags((prevTags) => [...prevTags, data]);
        setSelectedTags((prevSelectedTags) => [...prevSelectedTags, data]);
        setOpen(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  React.useEffect(() => {
    onChange(selectedTags);
  }, [selectedTags, onChange]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedTags.length > 0
            ? selectedTags.map((tag) => tag.name).join(", ")
            : "Select Tags..."}
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
            <Button className="w-[90%]" onClick={() => createTag(search)}>
              {search}
            </Button>
          </CommandEmpty>
          <CommandGroup>
            {tags.map((tag) => (
              <CommandItem
                key={tag.id}
                value={tag.name}
                onSelect={(currentValue) => {
                  setSelectedTags((prevSelectedTags) => {
                    if (prevSelectedTags.some((t) => t.name === currentValue)) {
                      return prevSelectedTags.filter(
                        (t) => t.name !== currentValue
                      );
                    } else {
                      const newTag = tags.find((t) => t.name === currentValue);
                      if (newTag) {
                        return [...prevSelectedTags, newTag];
                      }
                      return prevSelectedTags;
                    }
                  });
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedTags.some((t) => t.name === tag.name)
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                {tag.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}