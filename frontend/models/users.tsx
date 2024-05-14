// models.ts or apiTypes.ts (choose a suitable location for your types)

export interface UserProfile {
  id: number;
  username: string;
  institute: string;
  title: number;
  role: number;
}

export interface NewUser {
  first_name: string;
  last_name: string;
  role: number;
  email: string;
  institute: string;
  username: string;
  password: string;
  re_password: string;
  use_demo_targets: boolean;
}
