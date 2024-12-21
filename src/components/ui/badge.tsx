import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
}

export function Badge({ 
  children, 
  variant = 'default',
  size = 'md',
  className,
  ...props 
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-full',
        {
          'px-2.5 py-0.5 text-xs': size === 'sm',
          'px-3 py-1 text-sm': size === 'md',
          'px-4 py-1.5 text-base': size === 'lg',
        },
        {
          'bg-primary/10 text-primary': variant === 'default',
          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300': variant === 'secondary',
          'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300': variant === 'success',
          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300': variant === 'warning',
          'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300': variant === 'error',
          'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300': variant === 'info',
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export { Badge as default };
