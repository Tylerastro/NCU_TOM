/**
 * Converts a string to a consistent HSL color
 * Useful for generating avatar colors, tag colors, etc.
 */
export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = hash % 360;
  const s = Math.abs(h % 55) + 45;
  const l = Math.abs(h % 55) + 45;
  return `hsl(${h}, ${s}%, ${l}%)`;
}

export default stringToColor;
