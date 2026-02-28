/**
 * Tag-related type definitions
 */
import type { User } from "./user";

export interface Tag {
  id?: number;
  user?: User;
  name: string;
  targets: number[];
  observations: number[];
}

export interface NewTag {
  name: string;
}
