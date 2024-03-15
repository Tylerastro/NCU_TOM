import Image from "next/image";
import Typography from "@mui/material/Typography";
import Announcement from "./accordion";
import { AccordionDemo } from "./accor";
export default function Announcements() {
  return (
    <>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-primary-foreground">
        Annoucements
      </h1>
      <Announcement />
      <AccordionDemo />
    </>
  );
}
