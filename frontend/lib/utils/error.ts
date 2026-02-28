import { toast } from "sonner";

/**
 * Centralized error handling utilities for API responses
 * Handles Django REST Framework validation errors and general API errors
 */
export class ErrorHandler {
  /**
   * Process and display API errors consistently across the application
   */
  static handleApiError(error: unknown, fallbackMessage?: string): void {
    const err = error as Record<string, unknown>;

    // Handle DRF validation errors
    if (this.hasValidationErrors(err)) {
      this.handleValidationErrors(err);
      return;
    }

    // Handle response errors
    const response = err.response as Record<string, unknown> | undefined;
    if (response?.data) {
      this.handleResponseError(response.data);
      return;
    }

    // Handle direct error data
    if (err.data) {
      this.handleResponseError(err.data);
      return;
    }

    // Fallback for unknown error formats
    const message =
      (err.message as string) || fallbackMessage || "An unexpected error occurred";
    toast.error(message);
  }

  /**
   * Check if error contains validation errors
   */
  private static hasValidationErrors(error: Record<string, unknown>): boolean {
    const response = error?.response as Record<string, unknown> | undefined;
    const data = response?.data;
    return (
      data !== undefined &&
      typeof data === "object" &&
      data !== null &&
      !(data as Record<string, unknown>).detail
    );
  }

  /**
   * Handle DRF validation errors (field-specific errors)
   */
  private static handleValidationErrors(error: Record<string, unknown>): void {
    const response = error.response as Record<string, unknown> | undefined;
    const validationErrors =
      (response?.data as Record<string, unknown>) ||
      (error.data as Record<string, unknown>) ||
      error;

    for (const [field, messages] of Object.entries(validationErrors)) {
      if (Array.isArray(messages)) {
        messages.forEach((message: string) => {
          const displayMessage =
            field === "non_field_errors" ? message : `${field}: ${message}`;
          toast.error(displayMessage);
        });
      } else if (typeof messages === "string") {
        const displayMessage =
          field === "non_field_errors" ? messages : `${field}: ${messages}`;
        toast.error(displayMessage);
      }
    }
  }

  /**
   * Handle general API response errors
   */
  private static handleResponseError(errorData: unknown): void {
    if (typeof errorData === "string") {
      toast.error(errorData);
      return;
    }

    const data = errorData as Record<string, unknown>;

    if (data.detail) {
      if (typeof data.detail === "string") {
        toast.error(data.detail);
      } else {
        // Detail contains validation errors
        this.handleValidationErrors({ data: data.detail });
      }
      return;
    }

    // Handle legacy error formats
    if (data.message && typeof data.message === "string") {
      toast.error(data.message);
      return;
    }

    if (data.error && typeof data.error === "string") {
      toast.error(data.error);
      return;
    }

    // Handle field-specific errors
    this.handleValidationErrors({ data: errorData });
  }

  /**
   * Extract error message for programmatic use (without displaying toast)
   */
  static extractErrorMessage(error: unknown): string {
    const err = error as Record<string, unknown>;
    const response = err.response as Record<string, unknown> | undefined;
    const responseData = response?.data as Record<string, unknown> | undefined;
    const errorData = err.data as Record<string, unknown> | undefined;

    if (responseData?.detail && typeof responseData.detail === "string") {
      return responseData.detail;
    }

    if (responseData?.message && typeof responseData.message === "string") {
      return responseData.message;
    }

    if (errorData?.detail && typeof errorData.detail === "string") {
      return errorData.detail;
    }

    if (err.message && typeof err.message === "string") {
      return err.message;
    }

    return "An unexpected error occurred";
  }

  /**
   * Check if error indicates authentication failure
   */
  static isAuthError(error: unknown): boolean {
    const err = error as Record<string, unknown>;
    const response = err.response as Record<string, unknown> | undefined;
    const status = (response?.status as number) || (err.status as number);
    return status === 401 || status === 403;
  }

  /**
   * Check if error indicates validation failure
   */
  static isValidationError(error: unknown): boolean {
    const err = error as Record<string, unknown>;
    const response = err.response as Record<string, unknown> | undefined;
    const status = (response?.status as number) || (err.status as number);
    return status === 400;
  }
}

// Convenience functions for common error handling patterns
export const handleApiError = ErrorHandler.handleApiError.bind(ErrorHandler);
export const extractErrorMessage =
  ErrorHandler.extractErrorMessage.bind(ErrorHandler);
export const isAuthError = ErrorHandler.isAuthError.bind(ErrorHandler);
export const isValidationError =
  ErrorHandler.isValidationError.bind(ErrorHandler);
