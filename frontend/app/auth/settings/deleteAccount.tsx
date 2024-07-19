import { Button } from "@/components/ui/button";
import React from "react";

export default function DeleteAccount() {
  return (
    <div className="space-y-8 items-center justify-center align-center px-3 py-4">
      <p className="text-md px-3 py-4 ">
        Please make sure you want to delete your account.
      </p>
      <div className="text-center w-full">
        <Button
          variant={"destructive"}
          className="w-full text-primary-foreground bg-primary"
          type="submit"
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
