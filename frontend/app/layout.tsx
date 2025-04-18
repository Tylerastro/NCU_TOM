import NavBar from "@/components/Navbar";
import { ReactQueryClientProvider } from "@/components/ReactQueryClientProvider";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { cn } from "@/components/utils";
import type { Metadata } from "next";
import { Gowun_Batang } from "next/font/google";
import NextAuthProvider from "./SessionProvider";
import "./globals.css";

const gowunBatang = Gowun_Batang({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-gowun-batang",
});

export const metadata: Metadata = {
  title: "NCU Tom",
  description: "Targets and Obersvation Manager developed by NCU",
  referrer: "origin-when-cross-origin",
  keywords: ["TOM", "NCU", "Observation", "Astronomy"],
  authors: [{ name: "Tyler" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactQueryClientProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            "font-sans antialiased bg-gradient-to-b from-background to-secondary",
            gowunBatang.variable
          )}
        >
          <NextAuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <Toaster richColors />
              <NavBar />
              {children}
            </ThemeProvider>
          </NextAuthProvider>
        </body>
      </html>
    </ReactQueryClientProvider>
  );
}
