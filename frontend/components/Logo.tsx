import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex flex-row items-center">
      <div className="relative w-14 h-14 mr-2">
        <Image
          src="/main-logo-white-transparent.png"
          alt="Logo"
          width={64}
          height={64}
          priority
        />
      </div>
      <h2 className="scroll-m-20 text-2xl font-gowun-batang font-bold tracking-tight lg:text-3xl text-primary-foreground">
        <a href="/">NCU TOM</a>
      </h2>
    </div>
  );
}
