import { Target } from "@/models/targets";
import { getStatusLabel } from "@/models/enums";
import Link from "next/link";

type Props = {
  target?: Target | null;
};

export default function Observations(props: Props) {
  return (
    <div>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-200">
              Observations
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-300 sm:col-span-2 sm:mt-0">
              {props.target?.observations?.map((observation, index) => {
                let className;
                const statusLabel = getStatusLabel(observation.status);

                switch (statusLabel) {
                  case "Prep.":
                    className =
                      "inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-[#580af5e1] ring-1 ring-inset ring-gray-500/10";
                    break;
                  case "Pending":
                    className =
                      "inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-[#0ec6b3e1] ring-1 ring-inset ring-gray-500/10";
                    break;
                  case "In progress":
                    className =
                      "inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-[#038d13e1] ring-1 ring-inset ring-gray-500/10";
                    break;
                  case "DONE":
                    className =
                      "inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-[#ec07dce1] ring-1 ring-inset ring-gray-500/10";
                    break;
                  case "EXPIRED":
                    className =
                      "inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-[#0f0105e1] ring-1 ring-inset ring-gray-500/10";
                    break;
                  case "DENIED":
                    className =
                      "inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-[#eb0606] ring-1 ring-inset ring-gray-500/10";
                    break;
                  case "Postponed":
                    className =
                      "inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-[#ffee06] ring-1 ring-inset ring-gray-500/10";
                    break;
                }

                return (
                  <span key={index} className={className}>
                    <Link href={`/observations/${observation.id}`}>
                      {observation.name}
                    </Link>
                  </span>
                );
              })}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-200">
              Products
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-300 sm:col-span-2 sm:mt-0">
              Recent Products
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
