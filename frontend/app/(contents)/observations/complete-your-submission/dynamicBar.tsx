import dynamic from "next/dynamic";

export default dynamic(
  () => import("@/components/TimelineBar"), // adjust the path as needed
  { ssr: false } // This will make the component only render on the client side
);
