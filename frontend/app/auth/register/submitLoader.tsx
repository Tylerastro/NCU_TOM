import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function SubmitLoader({
  isSubmitting,
}: {
  isSubmitting: boolean;
}) {
  return (
    <AlertDialog open={isSubmitting}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex">
            <span>Activation email is sent</span>
            <span className="loader2 pl-8"></span>
          </AlertDialogTitle>
          <AlertDialogDescription>
            Please activate your account via the link we sent to your email.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter></AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
