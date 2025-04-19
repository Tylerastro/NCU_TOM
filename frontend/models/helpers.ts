// models.ts or apiTypes.ts (choose a suitable location for your types)

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

export interface Tag {
  id?: number;
  user?: User;
  name: string;
  targets: number[]; // Assuming Target is an array, adjust as needed
  observations: number[];
}

export interface NewTag {
  name: string;
}

// Interface for the Comments model
export interface Comments {
  id?: number;
  user?: User;
  context: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
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

export interface Paginator {
  count: number;
  next: number;
  previous: number;
  current: number;
  total: number;
  results: any[];
}

export interface ETLLogs {
  name: string;
  observatory: number;
  success: boolean;
  file_processed: number;
  row_processed: number;
  created_at: Date;
}
