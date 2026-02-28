import { auth } from "@/auth";
import { UserRole } from "@/models/enums";
import DashboardPage from "./lulin/lulinDashboard";
import AdminDashboard from "./users/adminDashboard";
import UserDashboard from "./user/UserDashboard";

export default async function Page() {
  const session = await auth();
  if (session?.user.role === UserRole.User) {
    return <UserDashboard />;
  } else if (session?.user.role === UserRole.Admin) {
    return <AdminDashboard />;
  } else if (session?.user.role === UserRole.Faculty) {
    return <DashboardPage />;
  }
}
