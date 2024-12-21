import React from 'react';
import { useToast } from './use-toast';
import { Toast, ToastViewport } from './toast';

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <ToastViewport>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={() => dismiss(toast.id)}
        />
      ))}
    </ToastViewport>
  );
}
