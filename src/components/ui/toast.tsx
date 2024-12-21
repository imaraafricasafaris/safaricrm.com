import React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ToastProps {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  title,
  description,
  variant = 'default',
  onClose,
}) => {
  return (
    <div
      className={cn(
        'pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all',
        variant === 'destructive' ? 'border-red-600 bg-red-50' : 'border-gray-200 bg-white',
        'animate-enter'
      )}
    >
      <div className="grid gap-1">
        {title && (
          <div className={cn(
            "text-sm font-semibold",
            variant === 'destructive' ? 'text-red-600' : 'text-gray-900'
          )}>
            {title}
          </div>
        )}
        {description && (
          <div className="text-sm text-gray-500">
            {description}
          </div>
        )}
      </div>
      <button
        onClick={onClose}
        className="absolute right-2 top-2 rounded-md p-1 text-gray-400 hover:text-gray-500"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export const ToastViewport: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      {children}
    </div>
  );
};
