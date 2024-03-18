import Background from "@/components/Background";
import { ResponsiveAppBar, NavBar } from "@/components/Navbar";
import Setup from "@/components/setup";
import theme from "@/components/themes";
import Provider from "@/redux/provider";
import { ThemeProvider } from "@mui/material/styles";
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
    <ThemeProvider theme={theme}>
      <html lang="en">
        <body>
          <main>
            <Provider>
              <Setup />
              <NavBar />
              <Background />
              {children}
            </Provider>
          </main>
        </body>
      </html>
    </ThemeProvider>
  );
}
