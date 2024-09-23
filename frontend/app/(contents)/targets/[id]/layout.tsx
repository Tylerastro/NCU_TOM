import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Target Details",
};

export default function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
