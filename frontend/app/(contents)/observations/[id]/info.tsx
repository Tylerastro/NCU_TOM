import { Observation } from "@/models/observations";
import * as React from "react";
import Feeds from "./feeds";
import Link from "next/link";
import TextBox from "./textbox";

export default function Info({ observation }: { observation: Observation }) {
  return (
    <div>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-200">
              Date
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-300 sm:col-span-2 sm:mt-0">
              {observation.start_date} --{">"} {observation.end_date}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-200">
              Tags
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-300 sm:col-span-2 sm:mt-0">
              {observation.tags?.map((tag, index) => (
                <span key={index}>{tag.name}</span>
              ))}
            </dd>
          </div>

          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-200">
              Targets
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-300 sm:col-span-2 sm:mt-0">
              {observation.targets?.map((target, index) => (
                <span
                  className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-[#1c05effa] ring-1 ring-inset ring-gray-500/10"
                  key={index}
                >
                  <Link href={`/targets/${target.id}`}>{target.name}</Link>
                </span>
              ))}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-200">
              Comments
            </dt>
          </div>
        </dl>
      </div>
      <Feeds observation={observation} />
      <TextBox observation={observation} />
    </div>
  );
}
