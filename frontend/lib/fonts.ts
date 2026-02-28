/**
 * Font configuration for the application
 */
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";

/**
 * Primary sans-serif font for body text and UI elements.
 * Inter is highly readable, works well for data-heavy dashboards,
 * and has excellent multi-language support.
 */
export const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

/**
 * Display font for headings and titles.
 * Space Grotesk has a modern, geometric design that fits
 * the space/astronomy theme while remaining highly readable.
 */
export const fontHeading = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

/**
 * Monospace font for technical content.
 * JetBrains Mono is ideal for displaying coordinates (RA/Dec),
 * data values, code snippets, and tabular astronomical data.
 */
export const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

/**
 * Combined className string with all font CSS variables.
 * Apply this to the <body> element in layout.tsx.
 */
export const fontVariables = `${fontSans.variable} ${fontHeading.variable} ${fontMono.variable}`;
