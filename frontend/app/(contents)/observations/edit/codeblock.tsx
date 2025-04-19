import { getLulinCode } from "@/apis/observations/getLulinCode";
import { putObservation } from "@/apis/observations/putObservation";
import { postObservationMessages } from "@/apis/observations/putObservationMessage";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ObservationUpdate } from "@/models/observations";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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
  const [comment, setComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const router = useRouter();

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

  const handleSubmitComment = async () => {
    if (!comment.trim()) {
      toast.error("Please enter a comment before submitting");
      return;
    }

    setIsSubmitting(true);
    try {
      await postObservationMessages(observation_id, comment);
      toast.success("Comment submitted successfully");
      setComment("");
    } catch (error) {
      toast.error("Failed to submit comment");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitObservation = async () => {
    setIsSubmitting(true);
    try {
      // First API call - Update observation status and code
      const updateData: ObservationUpdate = {
        status: 3,
        code: codeBlock,
      };
      await putObservation(observation_id, updateData);

      // Second API call - Submit comment if available
      if (comment.trim()) {
        await postObservationMessages(observation_id, comment);
      }

      toast.success("Observation submitted successfully");
      router.push("/observations");
      router.refresh();
    } catch (error) {
      toast.error("Failed to submit observation");
      console.error(error);
    } finally {
      setIsSubmitting(false);
      setShowConfirmDialog(false);
    }
  };

  const rows = codeBlock ? countLines(codeBlock) + 2 : 1;

  return (
    <>
      <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
        <div className="px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800">
          <label htmlFor="codeBlock" className="sr-only">
            Your code
          </label>
          <textarea
            id="codeBlock"
            rows={rows}
            className="w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400 resize-none"
            placeholder={"Write your script for Lulin Observation"}
            value={codeBlock}
            onChange={(e) => setCodeBlock(e.target.value)}
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
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

          <AlertDialog
            open={showConfirmDialog}
            onOpenChange={setShowConfirmDialog}
          >
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-[#3fefc666] rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-[#b538c366] duration-300 transition ease-in-out"
                aria-label="Submit observation"
                tabIndex={0}
              >
                Submit Observation
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Submit this observation?</AlertDialogTitle>
                <AlertDialogDescription>
                  You are about to submit your observation with the code and
                  comment. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleSubmitObservation}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Comment Section */}
      <div className="w-full mb-8 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
        <div className="px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800">
          <label htmlFor="comment" className="sr-only">
            Your comment
          </label>
          <textarea
            id="comment"
            rows={4}
            className="w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400 resize-none"
            placeholder="Write a comment about this observation..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            aria-label="Comment text area"
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
          ></textarea>
        </div>
        <div className="flex items-center justify-between px-3 py-2 border-t dark:border-gray-600">
          <div className="flex space-x-1 sm:space-x-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Add your notes, comments, or observations
            </span>
          </div>
          <button
            onClick={handleSubmitComment}
            disabled={isSubmitting}
            className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed duration-300 transition ease-in-out"
            aria-label="Submit comment"
            tabIndex={0}
          >
            {isSubmitting ? "Submitting..." : "Submit Comment"}
          </button>
        </div>
      </div>
    </>
  );
}
