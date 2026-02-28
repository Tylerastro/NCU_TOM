import { AccordionAnnoucemnets } from "./accor";
import { auth } from "@/auth";
import { AnnouncementActions } from "./AnnouncementActions";

export default async function Announcements() {
  const session = await auth();
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
          <p className="text-muted-foreground">
            Stay updated with the latest news and information
          </p>
        </div>
        {session && <AnnouncementActions userRole={session.user.role} />}
      </div>

      <AccordionAnnoucemnets />
    </div>
  );
}
