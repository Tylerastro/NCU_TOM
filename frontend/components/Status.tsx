import React from "react";
import { Badge } from "@/components/ui/badge";
import { Status } from "@/models/enums";

interface StatusBadgeProps {
  status: Status;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusStyles = (status: Status): string => {
    switch (status) {
      case Status.Prep:
        return "bg-yellow-500 text-yellow-50 dark:bg-yellow-700 dark:text-yellow-100";
      case Status.Pending:
        return "bg-blue-500 text-blue-50 dark:bg-blue-700 dark:text-blue-100";
      case Status.In_progress:
        return "bg-purple-500 text-purple-50 dark:bg-purple-700 dark:text-purple-100";
      case Status.Done:
        return "bg-green-500 text-green-50 dark:bg-green-700 dark:text-green-100";
      case Status.Expired:
        return "bg-gray-500 text-gray-50 dark:bg-gray-600 dark:text-gray-100";
      case Status.Denied:
        return "bg-red-500 text-red-50 dark:bg-red-700 dark:text-red-100";
      case Status.Postponed:
        return "bg-orange-500 text-orange-50 dark:bg-orange-700 dark:text-orange-100";
      default:
        return "bg-yellow-100 text-gray-800 dark:bg-yellow-900 dark:text-gray-100";
    }
  };

  const getStatusText = (status: Status): string => {
    switch (status) {
      case Status.Prep:
        return "Prep";
      case Status.Pending:
        return "Pending";
      case Status.In_progress:
        return "In Progress";
      case Status.Done:
        return "Done";
      case Status.Expired:
        return "Expired";
      case Status.Denied:
        return "Denied";
      case Status.Postponed:
        return "Postponed";
      default:
        return "Unknown";
    }
  };

  return (
    <Badge
      className={`prevent-select px-2 py-1 rounded-full text-xs font-medium ${getStatusStyles(
        status
      )}`}
    >
      {getStatusText(status)}
    </Badge>
  );
}
