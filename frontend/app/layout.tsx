import Background from "@/components/Background";
import { NavBar } from "@/components/Navbar";
import { ReactQueryClientProvider } from "@/components/ReactQueryClientProvider";
import { ThemeProvider } from "@/components/ui/theme-provider";
import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NextAuthProvider from "./SessionProvider";
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
          <ToastContainer />
          <NextAuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
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
