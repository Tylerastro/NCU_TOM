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
  password: string;
  re_password: string;
  use_demo_targets: boolean;
}
