import { auth } from "@/auth";
import { UserRole } from "./models/enums";

const protectedRoutes = ["/dashboard", "/dashboard/lulin", "/auth/settings"];

export default auth((req) => {
  if (
    protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route)) &&
    !req.auth?.user &&
    req.auth?.user.role !== UserRole.Admin
  ) {
    const homepage = process.env.NEXT_HOME_URL;
    return Response.redirect(homepage as string);
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
