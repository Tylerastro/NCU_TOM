"use client";

import ObservationApis from "@/apis/observations";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormSchema } from "./dateForm";

export default function PreviewButton({
  form,
}: {
  form: ReturnType<typeof useForm<z.infer<typeof FormSchema>>>;
}) {
  const { getCodePreview } = ObservationApis();
  const {
    data: scripts,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["scripts", form.getValues().doo],
    queryFn: () => getCodePreview(form.getValues().doo),
    enabled: false,
  });
  const [showAlert, setShowAlert] = useState(false);
  const getPreview = () => {
    console.log("clicked");
    refetch();
    setShowAlert(true);
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={getPreview} disabled={isFetching}>
        Preview
      </Button>
      {showAlert && (
        <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Preview Generated</AlertDialogTitle>
              <AlertDialogDescription>
                <pre className="max-h-96 overflow-auto overflow-x-hidden whitespace-pre-wrap">
                  {" "}
                  {/* Added pre tag and max-height */}
                  {scripts}
                </pre>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowAlert(false)}>
                Close
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      <Button variant="outline">Download</Button>
    </div>
  );
}
