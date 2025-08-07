"use server";
import { AccordionAnnoucemnets } from "./accor";
import { UserRole } from "@/models/enums";
import { NewAnnouncementForm } from "./createAnnouncement";
import { auth } from "@/auth";

export default async function Announcements() {
  const session = await auth();
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Announcements
          </h1>
          <p className="text-muted-foreground">
            Stay updated with the latest news and information
          </p>
        </div>
        {session &&
          [UserRole.Admin, UserRole.Faculty].includes(session.user.role) && (
            <div className="flex gap-2">
              <NewAnnouncementForm />
            </div>
          )}
      </div>

      <AccordionAnnoucemnets />
    </div>
  );
}
