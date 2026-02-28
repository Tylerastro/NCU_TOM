/**
 * User-related type definitions
 */

export interface User {
  id: number;
  username: string;
  institute: string;
  title: number;
  role: number;
  created_at?: Date;
  targets?: number[];
  observations?: number[];
  tags?: number[];
}

export interface UserProfile {
  id: number;
  username: string;
  first_name?: string;
  last_name?: string;
  institute: string;
  role: number;
  email: string;
  created_at?: Date;
  deleted_at?: Date;
  is_active?: boolean;
  last_login?: Date;
  targets?: number[];
  observations?: number[];
}

export interface UserUpdate {
  username?: string;
  first_name?: string;
  last_name?: string;
  institute?: string;
}

export interface NewUser {
  first_name: string;
  last_name: string;
  email: string;
  institute: string;
  username: string;
  password1: string;
  password2: string;
}

export interface PersonalInfo {
  name: string;
  image?: string;
  title: string;
  twitter?: string;
  site?: string;
  github?: string;
  website?: string;
  facebook?: string;
}
