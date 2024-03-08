import IsAdminOrFaculty from "@/components/middleware";
export default function Layout({ children }: { children: React.ReactNode }) {
  return <IsAdminOrFaculty>{children}</IsAdminOrFaculty>;
}
