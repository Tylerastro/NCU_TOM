import { bulkCreate } from "@/apis/targets";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import React, { useCallback, useEffect, useState } from "react";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function InputFileUpload({
  refreshData,
}: {
  refreshData: () => Promise<void>;
}) {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = useCallback(async () => {
    if (!file) {
      console.error("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await bulkCreate(formData);
      console.log("File uploaded successfully:", response);
      refreshData();
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  }, [file]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  useEffect(() => {
    if (file) {
      handleUpload();
    }
  }, [file, handleUpload]);

  return (
    <form
      encType="multipart/form-data"
      method="post"
      onSubmit={(e) => e.preventDefault()}
    >
      <Button
        component="label"
        variant="contained"
        startIcon={<CloudUploadIcon />}
      >
        Upload file
        <VisuallyHiddenInput type="file" onChange={handleFileChange} />
      </Button>
    </form>
  );
}
