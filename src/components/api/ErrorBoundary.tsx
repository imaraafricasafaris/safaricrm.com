import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useError } from '../../contexts/ErrorContext';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

// Create a wrapper component to use hooks with class component
const ErrorBoundaryWithHooks: React.FC<Props> = ({ children }) => {
  const { handleError } = useError();
  return <ErrorBoundaryClass handleError={handleError}>{children}</ErrorBoundaryClass>;
};

interface ErrorBoundaryClassProps extends Props {
  handleError: (error: Error, context?: string) => void;
}

class ErrorBoundaryClass extends Component<ErrorBoundaryClassProps, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    
    // Use the handleError from ErrorContext
    this.props.handleError(error, 'ErrorBoundary');
    
    // Log to console in development
    if (process.env.NODE_ENV !== 'production') {
      console.error('Uncaught error:', error);
      console.error('Component stack:', errorInfo.componentStack);
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-lg w-full">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Something went wrong
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            {process.env.NODE_ENV !== 'production' && this.state.errorInfo && (
              <div className="mb-6">
                <details className="text-sm text-gray-500 dark:text-gray-400">
                  <summary className="cursor-pointer mb-2">View Error Details</summary>
                  <pre className="whitespace-pre-wrap overflow-auto max-h-96 bg-gray-100 dark:bg-gray-700 p-4 rounded">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              </div>
            )}
            <div className="flex gap-4">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors"
              >
                Reload Page
              </button>
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null, errorInfo: null });
                  window.location.href = '/';
                }}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundaryWithHooks;