import React from "react";
import ObservationApis from "@/apis/observations";
import {
  useLogoutMutation,
  useRetrieveUserQuery,
} from "@/redux/features/authApiSlice";
import { Observation } from "@/models/observations";
import { toast } from "react-toastify";

export default function TextBox(props: { observation?: Observation }) {
  const { postObservationMessages } = ObservationApis();
  const [textBlock, setTextBlock] = React.useState<string>("");
  const { data } = useRetrieveUserQuery();

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      await postObservationMessages(props.observation!.id, textBlock);
      setTextBlock("");
      toast.success("Message sent.");
      props.observation?.comments?.push({
        context: textBlock,
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        user: data,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="w-full  mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
        <div className="px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800">
          <textarea
            id="textBlock"
            className="w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
            placeholder={"Your message..."}
            value={textBlock}
            onChange={(event) => setTextBlock(event.target.value)}
          ></textarea>
        </div>
        <div className="flex items-center justify-between px-3 py-2 border-t dark:border-gray-600">
          <button
            type="submit"
            onClick={handleSubmit}
            className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-[#3fefc666] rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-[#b538c366] duration-300 transition ease-in-out"
          >
            Submit observation
          </button>
        </div>
      </div>
    </>
  );
}
