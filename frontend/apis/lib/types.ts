import { AxiosError } from "axios";

/**
 * Structured API error type
 */
export interface ApiError {
  status: number;
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

/**
 * Extract error information from axios errors
 */
export function parseApiError(error: unknown): ApiError {
  if (error instanceof AxiosError) {
    return {
      status: error.response?.status ?? 0,
      message:
        error.response?.data?.detail ??
        error.response?.data?.message ??
        error.message ??
        "An unexpected error occurred",
      code: error.code,
      details: error.response?.data,
    };
  }

  if (error instanceof Error) {
    return {
      status: 0,
      message: error.message,
    };
  }

  return {
    status: 0,
    message: "An unexpected error occurred",
  };
}

/**
 * Type guard for API errors
 */
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    "message" in error
  );
}
