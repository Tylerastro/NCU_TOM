import Image from "next/image";
import Block from "@/components/Block";

export default function Home() {
  const block1_links = [
    { name: "Sign up", href: "auth/register" },
    { name: "Create targets", href: "targets/" },
    { name: "Submmit observations", href: "observations/" },
    { name: "Analyze", href: "#" },
  ];
  const block1_ctx = [
    "Easily create your target of interest.",
    "Create, Observe, and Collect your data with ease.",
  ];

  const block2_ctx = [
    "Send your observations",
    "Without worrying about the details.",
  ];

  return (
    <>
      <div>
        <Image
          className="bg-cover bg-center bg-fixed fixed top-0 left-0 right-0 -z-10"
          alt="Mountains"
          width={1920}
          height={1080}
          src="/Dalle-observatory.png"
        />

        <h1
          style={{ textAlign: "center", height: "960px" }}
          className=" flex items-center scroll-m-20  font-extrabold tracking-tight lg:text-9xl font-Pacifico text-primary-foreground"
        >
          NCU TOM
        </h1>
      </div>
      <Block
        title="Create your targets"
        context={block1_ctx}
        links={block1_links}
        direction="left"
        img="https://images.unsplash.com/photo-1436891620584-47fd0e565afb?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      />
      <Block
        title="Submit observations"
        context={block2_ctx}
        direction="right"
        img="https://images.unsplash.com/photo-1532417768914-d26087f20e75?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      />
    </>
  );
}
