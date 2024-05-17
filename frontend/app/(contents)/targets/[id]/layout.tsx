import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
};

export default function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
