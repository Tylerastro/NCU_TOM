import Image from "next/image";

export default async function Home() {
  return (
    <main>
      <Image
        className="bg-cover bg-center bg-fixed fixed top-0 left-0 right-0 -z-10"
        alt="Dalle-observatory"
        width={1920}
        height={1080}
        src="/Dalle-observatory.png"
      />

      <h1 className="flex items-center scroll-m-20  font-extrabold tracking-tight lg:text-9xl font-Pacifico text-primary-foreground">
        NCU TOM
      </h1>
    </main>
  );
}
