/**
 * Comment-related type definitions
 */
import type { User } from "./user";

export interface Comments {
  id?: number;
  user?: User;
  context: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}
