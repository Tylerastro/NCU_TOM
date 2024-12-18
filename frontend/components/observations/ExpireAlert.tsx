"use client";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const getTitleSize = (times: number) => {
  const sizes = [
    "text-lg", // Default size
    "text-xl", // After 1 ignore
    "text-2xl", // After 2 ignores
    "text-3xl", // After 3 ignores
    "text-4xl", // After 4 ignores
    "text-5xl", // After 5 ignores
  ];

  const colors = [
    "text-primary-foreground", // Default color
    "text-orange-500", // After a few ignores
    "text-red-500", // Getting more urgent
    "text-red-600", // Even more urgent
    "text-red-700", // Maximum urgency
  ];

  const sizeIndex = Math.min(times, sizes.length - 1);
  const colorIndex = Math.min(Math.floor(times / 2), colors.length - 1);

  return `${sizes[sizeIndex]} ${colors[colorIndex]} font-bold transition-all duration-300`;
};

export default function ExpireAlert({
  isDateExpired,
  setIsDateExpired,
}: {
  isDateExpired: boolean;
  setIsDateExpired: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [ignoretimes, setIgnoreTimes] = useState(0);
  const router = useRouter();
  const handleAlertClose = () => {
    setIsDateExpired(false);
    setIgnoreTimes(0);
  };

  const handleIgnoreTimes = () => {
    setIsDateExpired(true);
    setIgnoreTimes(ignoretimes + 1);
  };

  useEffect(() => {
    if (ignoretimes > 5) {
      toast.error(
        "You need to acknowledge that time machine is not invented yet!"
      );
      router.push("/observations");
    }
  }, [ignoretimes]);

  return (
    <AlertDialog open={isDateExpired}>
      <AlertDialogContent className={ignoretimes > 5 ? "animate-bounce" : ""}>
        <AlertDialogHeader>
          <AlertDialogTitle className={getTitleSize(ignoretimes)}>
            The start date is expired
            {ignoretimes > 3 && "!!!".repeat(Math.min(ignoretimes - 3, 3))}
          </AlertDialogTitle>
          <AlertDialogDescription
            className={ignoretimes > 2 ? "font-semibold" : ""}
          >
            Please update the start date since we can not travel back in time
            ⌛️
            {ignoretimes > 4 && (
              <span className="block mt-2 text-red-500">
                You have ignored this {ignoretimes} times! Please take action!
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={handleIgnoreTimes}
            className={ignoretimes > 3 ? "opacity-50" : ""}
          >
            Ignore
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleAlertClose}
            className={ignoretimes > 2 ? "animate-pulse" : ""}
          >
            Understood
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
