import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function UnAuthTooltip() {
  return (
    <>
      <Button asChild variant="secondary">
        <Link href="/auth/signin">Login</Link>
      </Button>
    </>
  );
}
