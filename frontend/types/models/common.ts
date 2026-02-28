/**
 * Common type definitions shared across modules
 */

export interface Paginator<T = unknown> {
  count: number;
  next: number;
  previous: number;
  current: number;
  total: number;
  results: T[];
}

export interface ETLLogs {
  name: string;
  observatory: number;
  success: boolean;
  file_processed: number;
  row_processed: number;
  created_at: Date;
}
