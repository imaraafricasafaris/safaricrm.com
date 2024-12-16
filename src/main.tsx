import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ModuleProvider } from './contexts/ModuleContext';
import { OfficeProvider } from './contexts/OfficeContext';
import { StaffProvider } from './contexts/StaffContext';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';

// Configure future flags for React Router v7
const router = createBrowserRouter(
  [
    {
      path: "*",
      element: (
        <AuthProvider>
          <ThemeProvider>
            <ModuleProvider>
              <OfficeProvider>
                <StaffProvider>
                  <Toaster position="top-right" />
                  <App />
                </StaffProvider>
              </OfficeProvider>
            </ModuleProvider>
          </ThemeProvider>
        </AuthProvider>
      ),
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);