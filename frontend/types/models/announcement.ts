/**
 * Announcement-related type definitions
 */
import type { User } from "./user";

export interface Announcements {
  id?: number;
  user?: User;
  title: string;
  context: string;
  created_at?: Date;
  type: number;
}
