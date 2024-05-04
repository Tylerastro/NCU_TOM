import { AccordionAnnoucemnets } from "./accor";
import { NewAnnouncementForm } from "./createAnnouncement";
export default function Announcements() {
  return (
    <>
      <div className="flex space-between justify-between pb-2">
        <div>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-primary-foreground">
            Annoucements
          </h1>
        </div>

        <div className="flex gap-2">
          <NewAnnouncementForm />
        </div>
      </div>

      <AccordionAnnoucemnets />
    </>
  );
}
