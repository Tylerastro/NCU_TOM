"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const shouldRetry = (failureCount: number, error: any) => {
  console.log(error);
  if (
    error.message === "Please sign in to continue" ||
    [403, 401].includes(error.response.status)
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
