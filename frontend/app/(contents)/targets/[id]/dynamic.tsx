// Using dynamic import to only render AladinLiteViewer on the client-side
import dynamic from "next/dynamic";

export default dynamic(() => import("./aladin"), {
  ssr: false,
});
