// models.ts or apiTypes.ts (choose a suitable location for your types)
import { Comments, Tag, User } from "./helpers";
import { Target } from "./targets";
export interface Observation {
  id: number;
  user?: User;
  name: string;
  observatory: number;
  priority: number;
  status: number;
  start_date: string;
  end_date: string;
  created_at?: Date;
  updated_at?: Date;
  tags: Tag[];
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
  tags: Tag[];
  targets?: number[];
  code?: string;
}

export interface LulinObservations {
  id: number;
  observation: string;
  priority: number;
  filters: { [key: string]: boolean };
  binning: number;
  frames: number;
  instruments: { [key: string]: boolean };
  exposure_time: number;
  start_date: Date;
  end_date: Date;
  target: Target;
}

export interface LulinObservationsUpdate {
  id?: number;
  observation?: string;
  priority?: number;
  start_date?: Date;
  end_date?: Date;
  filters?: { [key: string]: boolean };
  instruments?: { [key: string]: boolean };
  target?: Target;
  exposure_time?: number;
}

export interface ObservationUpdate {
  name?: string;
  observatory?: string;
  priority?: number;
  status?: number;
  start_date?: string;
  end_date?: string;
  created_at?: Date;
  updated_at?: Date;
  tags?: Tag[];
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
