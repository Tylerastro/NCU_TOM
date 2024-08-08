"use client";
import { deleteUser } from "@/apis/auth/deleteUser";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function DeleteAccount() {
  const session = useSession();
  if (!session || !session.data) {
    return null;
  }

  const onDelete = async () => {
    deleteUser(session.data.user.id).then(async () => {
      await signOut();
      redirect("/");
    });
  };

  return (
    <div className="space-y-8 items-center justify-center align-center px-3 py-4">
      <p className="text-md px-3 py-4 ">
        Please make sure you want to delete your account.
      </p>
      <div className="text-center w-full">
        <Button onClick={onDelete} variant="destructive" className="w-full">
          {" "}
          Delete Account
        </Button>
      </div>
    </div>
  );
}
