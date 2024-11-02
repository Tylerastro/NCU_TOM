import { auth } from "@/auth";
import { UserRole } from "@/models/enums";
import { redirect } from "next/navigation";
import DashboardPage from "./lulin/lulinDashboard";
import AdminDashboard from "./users/adminDashboard";

export default async function Page() {
  const session = await auth();
  if (session?.user.role === UserRole.User) {
    redirect("/");
  } else if (session?.user.role === UserRole.Admin) {
    return <AdminDashboard />;
  } else if (session?.user.role === UserRole.Faculty) {
    return <DashboardPage />;
  }
}
