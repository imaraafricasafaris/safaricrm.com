import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ModuleProvider } from './contexts/ModuleContext';
import { OfficeProvider } from './contexts/OfficeContext';
import { StaffProvider } from './contexts/StaffContext';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const router = createBrowserRouter([
  // Your routes here
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
});

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <RouterProvider router={router}>
      <AuthProvider>
        <ThemeProvider>
          <ModuleProvider>
            <OfficeProvider>
              <StaffProvider>
                <App />
              </StaffProvider>
            </OfficeProvider>
          </ModuleProvider>
        </ThemeProvider>
      </AuthProvider>
    </RouterProvider>
  </StrictMode>
);