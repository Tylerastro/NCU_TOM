"use server";
import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

export async function GitHubSignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("github", { redirectTo: "/" });
      }}
    >
      <Button type="submit" variant={"outline"} className=" w-full bg-gray-900">
        <Github className="mr-2 h-4 w-4" />
        Sign in with GitHub
      </Button>
    </form>
  );
}
