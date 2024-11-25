import Intro from "@/components/home/intro";
import Demo from "@/components/home/demo";

export default async function Home() {
  return (
    <main className=" w-full">
      <Intro className="pt-36" />
      <Demo className="pt-36" />
    </main>
  );
}
