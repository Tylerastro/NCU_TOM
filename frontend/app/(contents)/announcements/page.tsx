"use server";
import { AccordionAnnoucemnets } from "./accor";
import { UserRole } from "@/models/enums";
import { NewAnnouncementForm } from "./createAnnouncement";
import { auth } from "@/auth";
export default async function Announcements() {
  const session = await auth();
  return (
    <>
      <div className="flex space-between justify-between pb-2">
        <div>
          <h1 className="scroll-m-20 text-2xl font-bold tracking-tight lg:text-4xl text-primary-foreground">
            Annoucements
          </h1>
        </div>
        {session &&
          [UserRole.Admin, UserRole.Faculty].includes(session.user.role) && (
            <div className="flex gap-2">
              <NewAnnouncementForm />
            </div>
          )}
      </div>

      <AccordionAnnoucemnets />
    </>
  );
}
