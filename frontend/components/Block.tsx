import Image from "next/image";
import Link from "next/link";
export default function Block(props: {
  title: string;
  context: string[];
  links?: { name: string; href: string }[];
  direction: "left" | "right";
  img: string;
}) {
  const links = props.links || [];
  const textAlignClass =
    props.direction === "right" ? "text-right" : "text-left";
  const justifyContentClass =
    props.direction === "right" ? "justify-end" : "justify-start";

  return (
    <div className="w-full relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32">
      <Image
        src={props.img}
        alt=""
        className="absolute inset-0 blur -z-10 h-full w-full object-cover object-right md:object-center"
        width={1920}
        height={1280}
      />
      <div
        className="hidden sm:absolute sm:-top-10 sm:right-1/2 sm:-z-10 sm:mr-10 sm:block sm:transform-gpu sm:blur-3xl"
        aria-hidden="true"
      >
        <div
          className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
      <div
        className="absolute -top-52 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:top-[-28rem] sm:ml-16 sm:translate-x-0 sm:transform-gpu"
        aria-hidden="true"
      >
        <div
          className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      <div className={`mx-auto max-w-7xl px-6 lg:px-8 ${textAlignClass}`}>
        <h2
          className={`text-4xl font-bold tracking-tight text-white sm:text-6xl ${textAlignClass}`}
        >
          {props.title}
        </h2>
        {props.context.map((contextItem, index) => (
          <div key={index}>
            {" "}
            {contextItem}
            <br />
          </div>
        ))}
        <div
          className={`mx-auto mt-10 max-w-full lg:mx-0 lg:max-w-none ${textAlignClass}`}
        >
          <div
            className={`flex ${justifyContentClass} gap-x-8 gap-y-4 md:gap-x-2 lg:gap-x-4`}
          >
            {links.map((link) => (
              <Link key={link.name} href={link.href}>
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
