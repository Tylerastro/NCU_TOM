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
import { Textarea } from "@/components/ui/textarea";
import { ObservationUpdate } from "@/models/observations";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function SubmitSection({
  observation_id,
  onCommentAdded,
}: {
  observation_id: number;
  onCommentAdded?: (commentText: string) => void;
}) {
  const [comment, setComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmitComment = async () => {
    if (!comment.trim()) {
      toast.error("Please enter a comment before submitting");
      return;
    }

    setIsSubmitting(true);
    try {
      // Add comment optimistically before API call
      const commentText = comment.trim();
      if (onCommentAdded) {
        onCommentAdded(commentText);
      }
      
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
      // Get the current code
      const codeBlock = await getLulinCode(observation_id);
      
      // First API call - Update observation status and code
      const updateData: ObservationUpdate = {
        status: 3,
        code: codeBlock,
      };
      await putObservation(observation_id, updateData);

      // Second API call - Submit comment if available
      if (comment.trim()) {
        // Add comment optimistically before API call
        if (onCommentAdded) {
          onCommentAdded(comment.trim());
        }
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

  return (
    <div className="space-y-4">
      {/* Comment Section */}
      <div className="space-y-3">
        <label htmlFor="final-comment" className="text-sm font-medium">
          Final Comment (Optional)
        </label>
        <Textarea
          id="final-comment"
          placeholder="Add any final notes or observations before submitting..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="min-h-[100px]"
        />
        <Button
          onClick={handleSubmitComment}
          disabled={isSubmitting || !comment.trim()}
          variant="outline"
          size="sm"
        >
          {isSubmitting ? "Adding..." : "Add Comment"}
        </Button>
      </div>

      {/* Submit Observation Button */}
      <div className="border-t pt-4">
        <AlertDialog
          open={showConfirmDialog}
          onOpenChange={setShowConfirmDialog}
        >
          <AlertDialogTrigger asChild>
            <Button 
              className="w-full" 
              size="lg"
              disabled={isSubmitting}
            >
              Submit Observation for Processing
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Submit this observation?</AlertDialogTitle>
              <AlertDialogDescription>
                You are about to submit your observation with the current code and
                any comments. This action will send it for processing and cannot be undone.
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
  );
}