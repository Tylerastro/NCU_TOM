// models.ts or apiTypes.ts (choose a suitable location for your types)

export interface User {
  id: number;
  username: string;
  institute: string;
  title: number;
  role: number;
  created_at?: Date;
}

export interface Tag {
  id?: number;
  name: string;
  targets: number[]; // Assuming Target is an array, adjust as needed
  observations: number[];
}

export interface NewTag {
  name: string;
}

// Interface for the Comments model
export interface Comments {
  user?: User;
  context: string;
  created_at: string;
  updated_at: string;
}

export interface Announcements {
  id?: number;
  user?: User;
  title: string;
  context: string;
  created_at?: Date;
  type: number;
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
