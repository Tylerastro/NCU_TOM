import { format } from "date-fns";

const formatUTC = (
  value: Date,
  format_string: string = "MM-dd HH:mm:ss"
): string => {
  return format(new Date(value), format_string);
};

const formatMJD = (mjd: number, fixed: number) => {
  return mjd.toFixed(fixed);
};

export { formatUTC, formatMJD };
