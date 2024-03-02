import React, { useEffect, useState } from "react";
import Script from "next/script";
import { Target } from "@/models/targets";
import { Suspense } from "react";

export default function Aladin(props: { target?: Target | null }) {
  const [aladinInitialized, setAladinInitialized] = useState(false);

  useEffect(() => {
    console.log(aladinInitialized);
    if (!aladinInitialized && window.A && props.target) {
      window.A.init.then(() => {
        window.A.aladin("#aladin-lite-div", {
          target: props.target?.coordinates,
          survey: "P/DSS2/color",
          fov: 1,
        });
        setAladinInitialized(true);
      });
    }
  }, [aladinInitialized, props.target]);

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <div
          id="aladin-lite-div"
          style={{ width: "400px", height: "400px" }}
        ></div>
        <Script
          src="https://aladin.cds.unistra.fr/AladinLite/api/v3/latest/aladin.js"
          strategy="lazyOnload"
          id="aladin-script"
        />
      </Suspense>
    </>
  );
}
