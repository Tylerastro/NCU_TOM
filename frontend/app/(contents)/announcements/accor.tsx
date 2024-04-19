"use client";
import {
  Accordion,
  AccordionContent,
  AccordionDate,
  AccordionItem,
  AccordionTrigger,
} from "@/components/Accordion";

import { Announcements } from "@/models/helpers";
import { fetchAnnouncements } from "@/apis/announcements";
import * as React from "react";

export function AccordionAnnoucemnets() {
  const [data, setData] = React.useState<Announcements[]>([]);

  React.useEffect(() => {
    fetchAnnouncements().then((data) => {
      setData(data);
    });
  }, []);

  return (
    <Accordion type="single" collapsible className="w-full">
      {data.map((item, index) => (
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
