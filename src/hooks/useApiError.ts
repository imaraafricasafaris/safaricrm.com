import { useError } from '../contexts/ErrorContext';

interface ApiError extends Error {
  status?: number;
  code?: string;
}

export const useApiError = () => {
  const { handleError } = useError();

  const handleApiError = (error: ApiError, context?: string) => {
    // Format the error message based on the error type
    let errorMessage = 'An unexpected error occurred';

    if (error.message) {
      errorMessage = error.message;
    }

    // Add HTTP status code if available
    if (error.status) {
      errorMessage = `${error.status}: ${errorMessage}`;
    }

    // Create a new error with the formatted message
    const formattedError = new Error(errorMessage);
    
    // Pass the formatted error to the error context
    handleError(formattedError, context);
  };

  return { handleApiError };
};
