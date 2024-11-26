import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NCU Tom",
  description: "Targets and Obersvation Manager developed by NCU",
};

export default function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={`w-[85%] pt-12 px-12  min-h-svh`}>{children}</div>;
}
