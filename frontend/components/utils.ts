import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Creates a simple hash from a string using djb2 algorithm
 * Used for generating stable keys for React components
 */
function simpleHash(input: string): string {
  return input
    .split("")
    .reduce((hash, char) => {
      const charCode = char.charCodeAt(0);
      hash = (hash << 5) - hash + charCode;
      return hash & hash; // Convert to 32-bit integer
    }, 0)
    .toString();
}

/**
 * Creates a data hash key for React components based on array items and pagination
 * @param items Array of items with id and name/target.name properties
 * @param page Current page number
 * @param count Total count of items
 * @returns Hash string for component key
 */
export function createDataHash<T extends { id?: number; name?: string; target?: { name: string } }>(
  items: T[] | undefined,
  page: number,
  count?: number
): string {
  if (!items || items.length === 0) return "empty";
  
  const hashString =
    items.map((item) => {
      const name = item.name || item.target?.name || "";
      const id = item.id || 0;
      return `${id}-${name}`;
    }).join("|") + `|page:${page}|count:${count || 0}`;
    
  return simpleHash(hashString);
}
