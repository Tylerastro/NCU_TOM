import Image from "next/image";
import Typography from "@mui/material/Typography";
import Announcement from "./accordion";
export default function Announcements() {
  return (
    <>
      <Typography variant="h4">Announcements</Typography>
      <Announcement />
    </>
  );
}
