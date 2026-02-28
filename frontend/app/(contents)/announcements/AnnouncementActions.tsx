"use client";

import { NewAnnouncementForm } from "./createAnnouncement";
import { UserRole } from "@/models/enums";

interface AnnouncementActionsProps {
  userRole: number;
}

export const AnnouncementActions = ({ userRole }: AnnouncementActionsProps) => {
  if (![UserRole.Admin, UserRole.Faculty].includes(userRole)) {
    return null;
  }

  return (
    <div className="flex gap-2">
      <NewAnnouncementForm />
    </div>
  );
};
