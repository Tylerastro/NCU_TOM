"use client";

import { deleteComment } from "@/apis/observations/deleteComment";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Comments } from "@/models/helpers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function DeleteCommentDialog({
  commentId,
  onDelete,
}: {
  commentId: number;
  onDelete: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => {
      console.log("Starting delete mutation for comment:", commentId);
      return deleteComment(commentId);
    },
    onSuccess: (data) => {
      console.log("Delete mutation succeeded:", data);
      toast.success("Comment deleted successfully");

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["getObservation"] });

      // Close dialog and trigger local state update
      setIsOpen(false);
      onDelete();
    },
    onError: (error) => {
      console.error("Delete mutation failed:", error);
      toast.error("Failed to delete comment");
      setIsOpen(false);
    },
  });

  const handleDelete = () => {
    console.log("Delete button clicked for comment:", commentId);
    mutation.mutate();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-500 hover:text-red-500"
          aria-label="Delete comment"
          onClick={(e) => {
            e.stopPropagation();
            console.log("Delete icon clicked for comment:", commentId);
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            comment.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600"
          >
            {mutation.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function CommentItem({
  comment,
  onDelete,
}: {
  comment: Comments;
  onDelete: () => void;
}) {
  const dateFormatted = format(new Date(comment.created_at), "PPP 'at' p");

  return (
    <div className="space-y-4">
      <div className="flex items-start space-x-4">
        <Avatar>
          <AvatarFallback>
            {comment.user?.username?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1 flex-1">
          <div className="flex items-center justify-between">
            <p className="font-medium text-sm">
              {comment.user?.username || "Unknown User"}
            </p>
            {comment.id && (
              <DeleteCommentDialog commentId={comment.id} onDelete={onDelete} />
            )}
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {comment.context}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {dateFormatted}
          </p>
        </div>
      </div>
      <Separator />
    </div>
  );
}

export default function CommentsList({
  comments,
  observationId,
}: {
  comments: Comments[] | undefined;
  observationId: number;
}) {
  // Initialize with empty array if comments are undefined
  const [localComments, setLocalComments] = useState<Comments[]>(() => {
    // Safe initialization to handle undefined, null, or empty comments
    return (
      comments?.filter(
        (comment) => comment !== null && comment !== undefined
      ) || []
    );
  });

  // Update localComments when comments prop changes
  useEffect(() => {
    if (comments?.length) {
      setLocalComments(
        comments.filter((comment) => comment !== null && comment !== undefined)
      );
    }
  }, [comments]);

  // Filter out deleted comments
  const filteredComments = localComments.filter(
    (comment) => !comment.deleted_at
  );

  // This function updates the local state immediately for a smooth UI experience
  const handleCommentDelete = (commentId: number) => {
    setLocalComments((prevComments) =>
      prevComments.map((comment) => {
        // Mark the specific comment as deleted in our local state
        if (comment.id === commentId) {
          console.log("Marking comment as deleted:", commentId);
          return { ...comment, deleted_at: new Date().toISOString() };
        }
        return comment;
      })
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-primary-foreground">
          Comments
        </h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {filteredComments.length}{" "}
          {filteredComments.length === 1 ? "comment" : "comments"}
        </span>
      </div>

      <div className="space-y-6">
        {!filteredComments || filteredComments.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No comments yet. Leave a comment if any additional information is
            needed.
          </p>
        ) : (
          filteredComments.map((comment, index) => (
            <CommentItem
              key={`${comment.user?.id ?? "unknown"}-${index}`}
              comment={comment}
              onDelete={() => comment.id && handleCommentDelete(comment.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
