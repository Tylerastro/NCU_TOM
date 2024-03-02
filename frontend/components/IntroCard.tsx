import Image from "next/image";

type Props = {
  title: string;
  context: string;
  price: string;
};

export default function IntroCard({ title, context, price }: Props) {
  return (
    <div
      style={{ height: "500px" }}
      className="w-full  max-w-sm p-4 bg-gray-800 border border-gray-600 rounded-lg shadow-lg text-white sm:p-8 flex flex-col items-center justify-around"
    >
      <h5 className="mb-4 text-4xl font-medium text-gray-300">{title}</h5>

      <div>
        <Image
          width={250}
          height={250}
          src="https://images.unsplash.com/photo-1532417768914-d26087f20e75?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Plan Image"
          // className="w-full h-8 object-cover mb-4 rounded-lg" // Adjust width, height, and margins as needed
          className="object-contain h-48 w-96"
        />
      </div>

      <div className="flex flex-col items-center text-gray-100">
        {context ? (
          <span className="text-xl font-semibold">{context}</span>
        ) : null}
        {price ? <span className="text-xl font-semibold">{price}</span> : null}
      </div>

      <button
        type="button"
        className="mt-4 text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-500 dark:focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 w-full text-center"
      >
        Quick start
      </button>
    </div>
  );
}
