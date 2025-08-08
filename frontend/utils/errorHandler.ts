import { ApiError, ValidationErrors } from '@/types/api';
import { toast } from 'sonner';

export class ErrorHandler {
  /**
   * Process and display API errors consistently across the application
   */
  static handleApiError(error: any, customMessage?: string): void {
    if (customMessage) {
      toast.error(customMessage);
      return;
    }

    // Handle DRF validation errors
    if (this.hasValidationErrors(error)) {
      this.handleValidationErrors(error);
      return;
    }

    // Handle response errors
    if (error.response?.data) {
      this.handleResponseError(error.response.data);
      return;
    }

    // Handle direct error data
    if (error.data) {
      this.handleResponseError(error.data);
      return;
    }

    // Fallback for unknown error formats
    const message = error.message || 'An unexpected error occurred';
    toast.error(message);
  }

  /**
   * Check if error contains validation errors
   */
  private static hasValidationErrors(error: any): boolean {
    return (
      error?.response?.data &&
      typeof error.response.data === 'object' &&
      !error.response.data.detail
    );
  }

  /**
   * Handle DRF validation errors (field-specific errors)
   */
  private static handleValidationErrors(error: any): void {
    const validationErrors = error.response?.data || error.data || error;
    
    for (const [field, messages] of Object.entries(validationErrors)) {
      if (Array.isArray(messages)) {
        messages.forEach((message: string) => {
          const displayMessage = field === 'non_field_errors' 
            ? message 
            : `${field}: ${message}`;
          toast.error(displayMessage);
        });
      } else if (typeof messages === 'string') {
        const displayMessage = field === 'non_field_errors' 
          ? messages 
          : `${field}: ${messages}`;
        toast.error(displayMessage);
      }
    }
  }

  /**
   * Handle general API response errors
   */
  private static handleResponseError(errorData: any): void {
    if (typeof errorData === 'string') {
      toast.error(errorData);
      return;
    }

    if (errorData.detail) {
      if (typeof errorData.detail === 'string') {
        toast.error(errorData.detail);
      } else {
        // Detail contains validation errors
        this.handleValidationErrors({ data: errorData.detail });
      }
      return;
    }

    // Handle legacy error formats
    if (errorData.message) {
      toast.error(errorData.message);
      return;
    }

    if (errorData.error) {
      toast.error(errorData.error);
      return;
    }

    // Handle field-specific errors
    this.handleValidationErrors({ data: errorData });
  }

  /**
   * Extract error message for programmatic use (without displaying toast)
   */
  static extractErrorMessage(error: any): string {
    if (error.response?.data?.detail && typeof error.response.data.detail === 'string') {
      return error.response.data.detail;
    }

    if (error.response?.data?.message) {
      return error.response.data.message;
    }

    if (error.data?.detail && typeof error.data.detail === 'string') {
      return error.data.detail;
    }

    if (error.message) {
      return error.message;
    }

    return 'An unexpected error occurred';
  }

  /**
   * Check if error indicates authentication failure
   */
  static isAuthError(error: any): boolean {
    const status = error.response?.status || error.status;
    return status === 401 || status === 403;
  }

  /**
   * Check if error indicates validation failure
   */
  static isValidationError(error: any): boolean {
    const status = error.response?.status || error.status;
    return status === 400;
  }
}

// Convenience functions for common error handling patterns
export const handleApiError = ErrorHandler.handleApiError.bind(ErrorHandler);
export const extractErrorMessage = ErrorHandler.extractErrorMessage.bind(ErrorHandler);
export const isAuthError = ErrorHandler.isAuthError.bind(ErrorHandler);
export const isValidationError = ErrorHandler.isValidationError.bind(ErrorHandler);