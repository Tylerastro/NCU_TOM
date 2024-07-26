"use client";
import {
  Accordion,
  AccordionContent,
  AccordionDate,
  AccordionItem,
  AccordionTrigger,
} from "@/components/Accordion";

import { getAnnouncements } from "@/apis/announcements/getAnnouncements";
import { Announcements } from "@/models/helpers";
import { useQuery } from "@tanstack/react-query";

export function AccordionAnnoucemnets() {
  const { data: announcements, refetch } = useQuery({
    queryKey: ["announcements"],
    queryFn: () => getAnnouncements(),
    initialData: () => [] as Announcements[],
  });

  return (
    <Accordion type="single" collapsible className="w-full">
      {announcements.map((item) => (
        <AccordionItem key={item.id} value={`item-${item.id}`}>
          <AccordionTrigger className="scroll-m-20 text-lg font-bold tracking-tight lg:text-xl text-primary-foreground">
            {item.title}
          </AccordionTrigger>
          <AccordionDate>
            {item.created_at
              ? new Date(item.created_at).toLocaleDateString()
              : ""}
          </AccordionDate>
          <AccordionContent>{item.context}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
