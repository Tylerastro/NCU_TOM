import { format } from "date-fns";

/**
 * Format a date in UTC
 */
export function formatUTC(
  value: Date,
  formatString: string = "MM-dd HH:mm:ss"
): string {
  return format(new Date(value), formatString);
}

/**
 * Format Modified Julian Date with specified precision
 */
export function formatMJD(mjd: number, fixed: number): string {
  return mjd.toFixed(fixed);
}
