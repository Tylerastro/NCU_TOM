"use client";

import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { toast } from "react-toastify";

const shouldRetry = (failureCount: number, error: any) => {
  console.log(error);
  if (
    error.message === "Please sign in to continue" ||
    error.response.status === 403
  ) {
    // Don't retry if the error message indicates a missing token
    return false;
  }
  return failureCount < 3;
};

export const ReactQueryClientProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => toast.error(`${error.message}`),
    }),
    defaultOptions: {
      queries: {
        retry: shouldRetry,
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
