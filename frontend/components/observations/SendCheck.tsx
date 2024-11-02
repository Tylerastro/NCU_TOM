import { putObservation } from "@/apis/observations/putObservation";
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
import * as React from "react";
import { toast } from "react-toastify";

export function SendCheck({
  observation_id,
  codeBlock,
}: {
  observation_id: number;
  codeBlock: string;
}) {
  const router = useRouter();
  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const updateData: ObservationUpdate = {
      status: 3,
      code: codeBlock,
    };
    try {
      putObservation(observation_id, updateData);
      toast.success("Observation is now on pending.");
      router.push("/observations");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-[#3fefc666] rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-[#b538c366] duration-300 transition ease-in-out"
        >
          {" "}
          Submit Observation
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Send an observation?</AlertDialogTitle>
          <AlertDialogDescription>
            You are about to send an observation. Please verify your script and
            submit to continue.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
