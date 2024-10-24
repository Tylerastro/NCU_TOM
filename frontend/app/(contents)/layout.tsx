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
    <div className={`w-[85%] pt-12 px-12 animate-page-transition min-h-svh`}>
      {children}
    </div>
  );
}
