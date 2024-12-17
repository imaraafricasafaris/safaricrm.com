import React, { createContext, useContext, useState, ReactNode } from 'react';
import toast from 'react-hot-toast';

interface ErrorContextType {
  error: Error | null;
  setError: (error: Error | null) => void;
  handleError: (error: Error, context?: string) => void;
  clearError: () => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

interface ErrorProviderProps {
  children: ReactNode;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const [error, setError] = useState<Error | null>(null);

  const handleError = (error: Error, context?: string) => {
    console.error(`Error ${context ? `in ${context}` : ''}:`, error);
    
    // Set the error in state
    setError(error);

    // Show error toast notification
    toast.error(error.message || 'An unexpected error occurred');

    // You can add additional error handling logic here
    // For example, sending error to a logging service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to error logging service
      // logErrorToService(error);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <ErrorContext.Provider
      value={{
        error,
        setError,
        handleError,
        clearError,
      }}
    >
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};
