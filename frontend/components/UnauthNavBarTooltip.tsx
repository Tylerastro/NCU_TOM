import Button from "@mui/material/Button";
import Link from "next/link";

export default function UnAuthTooltip() {
  return (
    <>
      <Link href="/auth/signin" passHref>
        <Button variant="contained" sx={{ textTransform: "capitalize" }}>
          Login
        </Button>
      </Link>
    </>
  );
}
