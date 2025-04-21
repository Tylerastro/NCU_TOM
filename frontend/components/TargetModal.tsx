import React, { forwardRef, useState, useEffect, useRef, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown } from "lucide-react";
import { SimpleTarget } from "@/models/targets";
import { getTargets } from "@/apis/targets/getTargets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import gsap from "gsap";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useDebounce from "./Debounce";

interface TargetOptionsProps {
  onChange: (tags: number[]) => void;
  value: number[];
}

const TargetModal = forwardRef<HTMLDivElement, TargetOptionsProps>(
  (props, ref) => {
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 250);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedTargets, setSelectedTargets] = useState<number[]>(
      props.value || []
    );
    const targetRefs = useRef<(HTMLDivElement | null)[]>([]);

    const { data: allTargets, isLoading } = useQuery({
      queryKey: ["all-targets"],
      queryFn: async () => {
        let allResults: SimpleTarget[] = [];
        let currentPage = 1;
        let hasMore = true;

        while (hasMore) {
          const response = await getTargets({
            page: currentPage,
            tags: [],
            pageSize: 100,
          });

          if (
            response.count === 0 ||
            response.results.length === 0 ||
            response.count < 100 ||
            response.next === null
          ) {
            hasMore = false;
            allResults = [...allResults, ...response.results];
          } else {
            allResults = [...allResults, ...response.results];
            currentPage++;
          }
        }
        return allResults;
      },
    });

    const filteredTargets = useMemo(() => {
      return (
        allTargets?.filter((target) =>
          target.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        ) || []
      );
    }, [allTargets, debouncedSearchTerm]);

    const handleTargetToggle = (targetId: number) => {
      const newSelectedTargets = selectedTargets.includes(targetId)
        ? selectedTargets.filter((id) => id !== targetId)
        : [...selectedTargets, targetId];

      setSelectedTargets(newSelectedTargets);
      props.onChange(newSelectedTargets);
    };

    useEffect(() => {
      if (!isOpen || filteredTargets.length === 0) return;

      const timeoutId = setTimeout(() => {
        const validRefs = targetRefs.current.filter(Boolean);
        if (validRefs.length > 0) {
          gsap.fromTo(
            validRefs,
            {
              opacity: 0,
              y: 20,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              stagger: 0.1,
            }
          );
        }
      }, 0);

      return () => clearTimeout(timeoutId);
    }, [filteredTargets.length, isOpen]);

    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            {selectedTargets.length > 0
              ? selectedTargets
                  .map(
                    (targetId) =>
                      allTargets?.find((target) => target.id === targetId)?.name
                  )
                  .filter(Boolean)
                  .join(", ")
              : "Select Targets..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Targets</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Search targets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <ScrollArea className="h-[300px] w-full rounded-md border p-4">
              {isLoading ? (
                <p className="text-center text-sm text-gray-500">Loading...</p>
              ) : filteredTargets.length > 0 ? (
                filteredTargets
                  .filter((target) => target.id !== undefined)
                  .map((target, index) => (
                    <div
                      key={target.id}
                      ref={el => {
                        (targetRefs.current[index] = el);
                      }}
                      className="flex items-center justify-between py-2 px-2 hover:bg-gray-700 rounded cursor-pointer opacity-0"
                      onClick={() => handleTargetToggle(target?.id)}
                    >
                      <span>{target.name}</span>
                      {selectedTargets.includes(target.id) && (
                        <Check className="h-4 w-4 text-primary-foreground" />
                      )}
                    </div>
                  ))
              ) : (
                <p className="text-center text-sm text-gray-500">
                  No targets found
                </p>
              )}
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
);

TargetModal.displayName = "TargetModal";

export default TargetModal;
