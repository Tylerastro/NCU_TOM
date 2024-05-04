"use client";
import {
  Accordion,
  AccordionContent,
  AccordionDate,
  AccordionItem,
  AccordionTrigger,
} from "@/components/Accordion";

import { fetchAnnouncements } from "@/apis/announcements";
import { Announcements } from "@/models/helpers";
import { useQuery } from "@tanstack/react-query";

export function AccordionAnnoucemnets() {
  const { data: announcements, refetch } = useQuery({
    queryKey: ["announcements"],
    queryFn: () => fetchAnnouncements(),
    initialData: () => [] as Announcements[],
  });

  return (
    <Accordion type="single" collapsible className="w-full">
      {announcements.map((item, index) => (
        <AccordionItem key={item.id} value={`item-${index}`}>
          <AccordionTrigger>{item.title}</AccordionTrigger>
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
