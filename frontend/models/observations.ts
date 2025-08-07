// models.ts or apiTypes.ts (choose a suitable location for your types)
import { Comments, User } from "./helpers";
import { LulinTarget, SimpleTarget, Target } from "./targets";
export interface Observation {
  id: number;
  user?: User;
  name: string;
  observatory: number;
  priority: number;
  status: number;
  start_date: Date;
  end_date: Date;
  created_at?: Date;
  updated_at?: Date;
  comments: Comments[];
  targets?: Target[];
  code?: string;
}

export interface NewObservation {
  name?: string;
  observatory: number;
  priority: number;
  status?: number;
  start_date: Date;
  end_date: Date;
  targets?: number[];
  code?: string;
}

export interface LulinRuns {
  id: number;
  observation: string;
  priority: number;
  filter: number;
  binning: number;
  frames: number;
  instrument: number;
  exposure_time: number;
  start_date: Date;
  end_date: Date;
  target: LulinTarget;
}

export interface LulinObservationsCreate {
  priority: number;
  filter: number;
  binning: number;
  frames: number;
  instrument: number;
  exposure_time: number;
  targets: number[];
}

export interface LulinRunUpdate {
  id?: number;
  observation?: string;
  priority?: number;
  start_date?: Date;
  end_date?: Date;
  binning?: number;
  filter?: number;
  frames?: number;
  instrument?: number;
  target?: Target;
  exposure_time?: number;
}

export interface ObservationUpdate {
  name?: string;
  observatory?: number;
  priority?: number;
  status?: number;
  start_date?: Date;
  end_date?: Date;
  created_at?: Date;
  updated_at?: Date;
  targets?: number[];
  code?: string;
}

export interface BarChartData {
  labels: string[]; // Change to string[]
  datasets: {
    label: string;
    data: number[][]; // For floating bars
    borderColor?: string;
    backgroundColor?: string;
  }[];
  borderSkipped?: boolean;
}

export interface LineChartData {
  labels: string[];
  datasets: Dataset[]; // Defined as an array of Dataset objects
}

interface Dataset {
  label: string;
  data: DataPoint[]; // Defined as an array of DataPoint objects
  borderColor: string;
  fill: boolean;
}

interface DataPoint {
  x: number; // Timestamp
  y: number; // Numerical value
}

export interface ObservationStats {
  total_observations: number;
  total_targets: number;
  total_users: number;
  observatory_counts: CountItem[];
  priority_counts: CountItem[];
  status_counts: CountItem[];
}
interface CountItem {
  id: number;
  name: string;
  count: number;
}

export interface LulinDataProduct {
  name: string;
  target: SimpleTarget;
  mjd: number;
  obs_date: Date;
  mag: number;
  source_ra: number;
  source_dec: number;
  exposure_time: number;
  zp: number;
  filter: number;
  instrument: number;
  FWHM: number;
  created_at: Date;
}
