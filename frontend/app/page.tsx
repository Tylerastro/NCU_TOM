import Image from "next/image";

export default async function Home() {
  return (
    <main className="h-screen">
      <Image
        className="bg-cover bg-center bg-fixed fixed top-0 left-0 right-0 -z-10"
        alt="Dalle-observatory"
        width={1920}
        height={1080}
        src="/Dalle-observatory.png"
      />
    </main>
  );
}
