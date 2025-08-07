// models.ts or apiTypes.ts (choose a suitable location for your types)
import { User } from "./helpers";
import { Observation } from "./observations";

export interface SimpleTarget {
  id: number;
  name: string;
  ra: number;
  dec: number;
  redshift?: number;
  created_at: Date;
}

export interface Target {
  id?: number;
  name: string;
  user?: User;
  ra: number;
  dec: number;
  coordinates?: string;
  redshift?: number;
  created_at?: Date;
  updated_at?: Date;
  observations?: Observation[];
  notes?: string;
}

export interface LulinTarget {
  id: number;
  name: string;
  user?: User;
  ra: number;
  dec: number;
  coordinates?: string;
  redshift?: number;
  created_at?: Date;
  updated_at?: Date;
  observations?: Observation[];
  notes?: string;
}

export interface PutTarget {
  ra: number;
  dec: number;
}
interface AltAzData {
  time: string;
  alt: number;
  az: number;
  airmass: number | null;
}

export interface TargetAltAz {
  name: string;
  data: AltAzData[];
}

export interface TargetSimbad {
  RA: string;
  DEC: string;
  distance?: number | null;
  morphtype?: string | null;
  otype?: string | null;
  parallax?: number | null;
  pm?: number | null;
  pmra?: number | null;
  pmdec?: number | null;
  velocity?: number | null;
  z_value?: number | null;
  flux_U?: number | null;
  flux_B?: number | null;
  flux_V?: number | null;
  flux_R?: number | null;
  flux_I?: number | null;
  flux_J?: number | null;
  flux_H?: number | null;
  flux_K?: number | null;
  flux_u?: number | null;
  flux_g?: number | null;
  flux_r?: number | null;
  flux_i?: number | null;
  flux_z?: number | null;
}

export interface TargetSED {
  flux: number[];
  fluxe: number[];
  frequency: number[];
  fluxv: number[];
  filter: string[];
  fluxMin: number[];
  fluxMax: number[];
}
