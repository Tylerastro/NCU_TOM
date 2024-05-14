import type { Metadata } from "next";
import { ReactQueryClientProvider } from "@/components/ReactQueryClientProvider";
import { ThemeProvider } from "@/components/ui/theme-provider";
import Background from "@/components/Background";
import NextAuthProvider from "./SessionProvider";
import { NavBar } from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "NCU Tom",
  description: "Targets and Obersvation Manager developed by NCU",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactQueryClientProvider>
      <html lang="en" suppressHydrationWarning>
        <body>
          <NextAuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <main>
                <NavBar />
                <Background />
                {children}
              </main>
            </ThemeProvider>
          </NextAuthProvider>
        </body>
      </html>
    </ReactQueryClientProvider>
  );
}
