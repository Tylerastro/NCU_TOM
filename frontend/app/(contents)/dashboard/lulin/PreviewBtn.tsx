"use client";

import { getCodePreview } from "@/apis/observations/getCodePreview";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
    refetch();
    setShowAlert(true);
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={getPreview} disabled={isFetching}>
        Preview
      </Button>
      {showAlert && (
        <Dialog open={showAlert} onOpenChange={setShowAlert}>
          <DialogContent className="sm:max-w-[425px] lg:max-w-[850px] lg:max-h-[700px] overflow-auto">
            <DialogHeader>
              <DialogTitle>Preview Script</DialogTitle>
              <DialogDescription className="sm:max-w-[425px] lg:max-w-[850px] lg:max-h-[700px] overflow-auto">
                <pre className="whitespace-pre max-w-xl overflow-x-auto">
                  {scripts}
                </pre>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
      <Button variant="outline">Download</Button>
    </div>
  );
}
