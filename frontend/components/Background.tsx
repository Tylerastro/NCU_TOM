import Image from "next/image";

export default function Background() {
  return (
    <Image
      alt="Earth at night time, observed from space"
      src="/nasa-Q1p7bh3SHj8-unsplash.jpg"
      quality={100}
      width={1920}
      height={1080}
      sizes="100vw"
      style={{
        objectFit: "cover",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed", // This makes the background image fixed
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
      }}
    />
  );
}
