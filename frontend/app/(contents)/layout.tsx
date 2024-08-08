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
    <div className={`${styles.contents} animate-page-transition`}>
      {children}
    </div>
  );
}
