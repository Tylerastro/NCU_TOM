import ObservationApis from "@/apis/observations";
import { Comments } from "@/models/helpers";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React from "react";

export default function Feeds(props: { observation_id: number }) {
  const { getObservations } = ObservationApis();
  const { data: observation } = useQuery({
    queryKey: ["observations", props.observation_id],
    queryFn: () =>
      getObservations(props.observation_id).then((data) => {
        return data[0];
      }),
  });
  const sortedComments = React.useMemo(() => {
    if (!observation?.comments) return [];

    return [...observation.comments].sort((a: Comments, b: Comments) => {
      const dateA = new Date(a.updated_at);
      const dateB = new Date(b.updated_at);
      return dateB.getTime() - dateA.getTime(); // For descending order; flip the operands for ascending
    });
  }, [observation?.comments]);

  return (
    <>
      <ol className="relative border-s border-gray-200 dark:border-gray-700">
        {sortedComments.map((comment, index) => (
          <li key={index} className="mb-10 ms-6">
            <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
              {comment.user?.username || "System"}
            </h3>

            <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
              <Image
                className="rounded-full shadow-lg"
                src="/next.svg"
                alt="Bonnie image"
                width={40}
                height={40}
              />
            </span>
            <div className="items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:flex dark:bg-gray-700 dark:border-gray-600">
              <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">
                {comment.updated_at}
              </time>
              <div className="text-sm font-normal text-gray-500 dark:text-gray-300">
                {comment.context}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}
