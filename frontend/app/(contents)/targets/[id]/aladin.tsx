import React, { useEffect, useRef, useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    A: any;
  }
}

interface AladinLiteProps {
  aspectRatio?: string;
  maxWidth?: string;
  fov?: number;
  projection?: string;
  cooFrame?: string;
  showCooGridControl?: boolean;
  showSimbadPointerControl?: boolean;
  showCooGrid?: boolean;
  coord?: string;
}

const AladinLite: React.FC<AladinLiteProps> = ({
  aspectRatio = "4/3",
  maxWidth = "100%",
  fov = 1,
  projection = "AIT",
  cooFrame = "equatorial",
  showCooGridControl = true,
  showSimbadPointerControl = true,
  showCooGrid = true,
  coord,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const aladinInstanceRef = useRef<any>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const [aspectWidth, aspectHeight] = aspectRatio.split("/").map(Number);
        const height = (width * aspectHeight) / aspectWidth;
        setContainerSize({ width, height });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [aspectRatio]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.A && containerSize.width > 0) {
      window.A.init.then(() => {
        if (containerRef.current) {
          aladinInstanceRef.current = window.A.aladin(containerRef.current, {
            fov,
            projection,
            cooFrame,
            showCooGridControl,
            showSimbadPointerControl,
            showCooGrid,
          });

          if (coord) {
            aladinInstanceRef.current.gotoObject(coord);
          }
        }
      });
    }
  }, [
    containerSize,
    fov,
    projection,
    cooFrame,
    showCooGridControl,
    showSimbadPointerControl,
    showCooGrid,
    coord,
  ]);

  return (
    <>
      <Script
        src="https://aladin.u-strasbg.fr/AladinLite/api/v3/latest/aladin.js"
        strategy="beforeInteractive"
      />
      <div style={{ maxWidth, margin: "0 auto" }}>
        <div
          ref={containerRef}
          style={{
            width: "100%",
            height: `${containerSize.height}px`,
            aspectRatio,
          }}
        />
      </div>
    </>
  );
};

export default AladinLite;
