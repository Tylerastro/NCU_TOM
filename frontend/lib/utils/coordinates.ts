/**
 * Astronomical coordinate formatting utilities
 */

function isHourAngleFormat(input: string): boolean {
  const hourMinSecPattern =
    /^(\+|-)?(\d{1,2}h)?(\d{1,2}m)?(\d{1,2}(\.\d+)?s)?$/;
  const decMinSecPattern =
    /^(\+|-)?(\d{1,3}d)?(\d{1,2}m)?(\d{1,2}(\.\d+)?s)?$/;
  const decimalPattern =
    /^(\+|-)?(\d{1,2})\s+(\d{1,2})\s+(\d{1,2}(\.\d+)?)\s*$/;
  const colonSeparatedPattern =
    /^((\+|-)?(\d{1,2}):(\d{2}):(\d{2})(\.(\d+))?)((\s+((\+|-)?(\d{1,2}):(\d{2}):(\d{2})(\.(\d+))?))?)?$/;

  return (
    hourMinSecPattern.test(input) ||
    decMinSecPattern.test(input) ||
    decimalPattern.test(input) ||
    colonSeparatedPattern.test(input)
  );
}

/**
 * Convert hour angle format to degrees
 * Supports formats: "12h30m45s", "12:30:45", "12 30 45"
 */
export function convertHourAngleToDegrees(
  input: unknown
): number | Error {
  if (typeof input !== "string") {
    return Error("Invalid hour angle type");
  }

  const hourAngle = input.trim();

  if (!isHourAngleFormat(hourAngle)) {
    return parseFloat(hourAngle);
  }

  // Handle colon-separated format
  if (hourAngle.includes(":")) {
    const [ra] = hourAngle.split(/\s+/);
    const [hours, minutes, seconds] = ra.split(":").map(parseFloat);
    return (hours + minutes / 60 + seconds / 3600) * 15;
  }

  const parts = hourAngle.split(/:|h|m|s|\s/).slice(0, 3);
  if (parts.length !== 3) {
    return Error("Invalid hour angle format");
  }

  const hours = parseFloat(parts[0]);
  const minutes = parseFloat(parts[1]);
  const seconds = parseFloat(parts[2]);

  return (hours + minutes / 60 + seconds / 3600) * 15;
}

/**
 * Convert sexagesimal degrees to decimal degrees
 * Supports formats: "+30d45m30s", "+30:45:30", "30 45 30"
 */
export function convertSexagesimalDegreesToDecimal(
  input: unknown
): number | Error {
  if (typeof input !== "string") {
    return Error("Invalid sexagesimal format");
  }

  const sexagesimal = input.trim();

  if (!isHourAngleFormat(sexagesimal)) {
    return parseFloat(sexagesimal);
  }

  // Remove any whitespace and replace degree/minute/second symbols
  const cleanedInput = sexagesimal.replace(/[°'"]/g, "");

  // Determine the sign
  const isNegative = cleanedInput.startsWith("-");
  const sign = isNegative ? -1 : 1;

  // Remove the sign for parsing
  const unsignedInput = cleanedInput.replace("-", "").replace("+", "");

  let parts: string[];

  // Handle colon-separated format
  if (unsignedInput.includes(":")) {
    parts = unsignedInput.split(":");
  } else {
    // Handle space-separated or dms format
    parts = unsignedInput.split(/\s+|[dms]/).filter(Boolean);
  }

  if (parts.length < 1 || parts.length > 3) {
    return Error("Invalid sexagesimal format");
  }

  const degrees = parseFloat(parts[0]) || 0;
  const minutes = parts.length > 1 ? parseFloat(parts[1]) || 0 : 0;
  const seconds = parts.length > 2 ? parseFloat(parts[2]) || 0 : 0;

  return sign * (degrees + minutes / 60 + seconds / 3600);
}

export { isHourAngleFormat };
