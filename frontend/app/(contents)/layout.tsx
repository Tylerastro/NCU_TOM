import theme from "@/components/themes";
import { ThemeProvider } from "@mui/material/styles";
import type { Metadata } from "next";
import styles from "./contents.module.css";

export const metadata: Metadata = {
  title: "NCU Tom",
  description: "Targets and Obersvation Manager developed by NCU",
};

export default function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={theme}>
      <div className={styles.contents}>{children}</div>
    </ThemeProvider>
  );
}
