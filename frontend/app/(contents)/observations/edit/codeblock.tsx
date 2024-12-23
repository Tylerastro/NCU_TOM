import { getLulinCode } from "@/apis/observations/getLulinCode";
import { SendCheck } from "@/components/observations/SendCheck";
import { useEffect, useState } from "react";

export default function CodeBlock({
  observation_id,
  codeUpdate,
  setCodeUpdate,
}: {
  observation_id: number;
  codeUpdate: boolean;
  setCodeUpdate: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [codeBlock, setCodeBlock] = useState<string>("");

  useEffect(() => {
    getLulinCode(observation_id)
      .then((data) => {
        setCodeBlock(data);
        setCodeUpdate(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [codeUpdate, observation_id]);

  const countLines = (text: string) => {
    return text.split("\n").length;
  };

  const resetCodeBlock = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    getLulinCode(observation_id, true)
      .then((data) => {
        setCodeBlock(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const rows = codeBlock ? countLines(codeBlock) + 2 : 1;

  return (
    <>
      <div className="w-full  mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
        <div className="px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800">
          <label htmlFor="codeBlock" className="sr-only">
            Your comment
          </label>
          <textarea
            id="codeBlock"
            rows={rows}
            className="w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
            placeholder={"Write your script for Lulin Observation"}
            value={codeBlock}
            onChange={(e) => setCodeBlock(e.target.value)}
          ></textarea>
        </div>
        <div className="flex items-center justify-between px-3 py-2 border-t dark:border-gray-600">
          <button
            onClick={resetCodeBlock}
            type="submit"
            className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-[#b538c366] duration-300 transition ease-in-out"
          >
            Rebuild Script
          </button>
          <SendCheck observation_id={observation_id} codeBlock={codeBlock} />
        </div>
      </div>

      {/* <p className="ms-auto text-xs text-gray-500 dark:text-gray-400">
        Remember, contributions to this topic should follow our{" "}
        <a
          href="#"
          className="text-blue-600 dark:text-blue-500 hover:underline"
        >
          Community Guidelines
        </a>
        .
      </p> */}
    </>
  );
}
