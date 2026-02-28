/**
 * Build query params from an object, filtering out undefined/null values
 */
export function buildQueryParams(
  params: Record<string, string | number | boolean | number[] | undefined | null>
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;

    if (Array.isArray(value)) {
      if (value.length > 0) {
        result[key] = value.join(",");
      }
    } else {
      result[key] = String(value);
    }
  }

  return result;
}

/**
 * Convert camelCase keys to snake_case for API requests
 */
export function toSnakeCase(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
    result[snakeKey] = value;
  }

  return result;
}
