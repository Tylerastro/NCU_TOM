import Background from "@/components/Background";
import { NavBar } from "@/components/Navbar";
import Setup from "@/components/setup";
import Provider from "@/redux/provider";
import { ThemeProvider } from "@/components/ui/theme-provider";
import type { Metadata } from "next";
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
    <html lang="en">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main>
            <Provider>
              <Setup />
              <NavBar />
              <Background />
              {children}
            </Provider>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
