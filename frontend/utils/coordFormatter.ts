function isHourAngleFormat(input: string) {
  const hourMinSecPattern =
    /^(\+|-)?(\d{1,2}h)?(\d{1,2}m)?(\d{1,2}(\.\d+)?s)?$/;
  const decMinSecPattern = /^(\+|-)?(\d{1,3}d)?(\d{1,2}m)?(\d{1,2}(\.\d+)?s)?$/;
  const decimalPattern =
    /^(\+|-)?(\d{1,2})\s+(\d{1,2})\s+(\d{1,2}(\.\d+)?)\s*$/;
  const colonSeparatedPattern =
    /^(-?\d{1,2}:\d{2}:\d{2}(\.\d+)?)(\s+(-?\d{1,2}:\d{2}:\d{2}(\.\d+)?))?$/;

  return (
    hourMinSecPattern.test(input) ||
    decMinSecPattern.test(input) ||
    decimalPattern.test(input) ||
    colonSeparatedPattern.test(input)
  );
}

function convertHourAngleToDegrees(hourAngle: any) {
  if (typeof hourAngle !== "string") {
    return Error("Invalid hour angle type");
  }

  hourAngle = hourAngle.trim(); // Trim the input

  if (typeof hourAngle === "string" && !isHourAngleFormat(hourAngle)) {
    return parseFloat(hourAngle);
  }

  // Handle colon-separated format
  if (typeof hourAngle === "string" && hourAngle.includes(":")) {
    const [ra, dec] = hourAngle.split(/\s+/);
    if (ra && !dec) {
      // Only RA is provided
      const [hours, minutes, seconds] = ra.split(":").map(parseFloat);
      return (hours + minutes / 60 + seconds / 3600) * 15;
    }
    // If both RA and Dec are provided, we assume it's the RA part
    const [hours, minutes, seconds] = ra.split(":").map(parseFloat);
    return (hours + minutes / 60 + seconds / 3600) * 15;
  }

  const parts = hourAngle.split(/:|h|m|s|\s/).slice(0, 3); // Match colon, h, m, s, or whitespace
  if (parts.length !== 3) {
    return Error("Invalid hour angle format");
  }

  const hours = parseFloat(parts[0]);
  const minutes = parseFloat(parts[1]);
  const seconds = parseFloat(parts[2]);

  const degrees = (hours + minutes / 60 + seconds / 3600) * 15;
  return degrees;
}

function convertSexagesimalDegreesToDecimal(sexagesimal: any): number | Error {
  if (typeof sexagesimal !== "string") {
    return Error("Invalid sexagesimal format");
  }

  sexagesimal = sexagesimal.trim(); // Trim the input

  if (typeof sexagesimal === "string" && !isHourAngleFormat(sexagesimal)) {
    return parseFloat(sexagesimal);
  }

  // Remove any whitespace and replace degree/minute/second symbols
  const cleanedInput = sexagesimal.replace(/[°'"]/g, "");

  // Determine the sign
  const isNegative = cleanedInput.startsWith("-");
  const sign = isNegative ? -1 : 1;

  // Remove the sign for parsing
  const unsignedInput = isNegative ? cleanedInput.slice(1) : cleanedInput;

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

export {
  isHourAngleFormat,
  convertSexagesimalDegreesToDecimal,
  convertHourAngleToDegrees,
};
