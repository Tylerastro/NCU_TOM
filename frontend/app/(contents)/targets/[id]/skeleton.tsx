import React from "react";

type Props = {
  number: number;
};

export default function LoadingSkeleton({ number }: Props) {
  return Array(number)
    .fill(0)
    .map((el, index) => (
      <div key={index}>
        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 bg-[#bab7b700]">
          <dt className="text-sm font-medium leading-6 text-gray-200"></dt>
          <dd className="mt-1 text-sm leading-6 text-gray-300 sm:col-span-2 sm:mt-0"></dd>
        </div>
      </div>
    ));
}
