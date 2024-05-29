import { auth } from "@/auth";
import { UserRole } from "@/models/enums";
import { redirect } from "next/navigation";
import DashboardPage from "./lulin/lulinDashboard";
import AdminDashboard from "./users/adminDashboard";

export default async function page() {
  const session = await auth();
  if (
    session?.user.role === UserRole.User ||
    session?.user.role === UserRole.Visitor
  ) {
    redirect("/");
  } else if (session?.user.role === UserRole.Admin) {
    return <AdminDashboard />;
  } else if (session?.user.role === UserRole.Faculty) {
    return <DashboardPage />;
  }
}
