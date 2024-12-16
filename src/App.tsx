import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/api/ErrorBoundary';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ResetPassword from './pages/ResetPassword';
import UpdatePassword from './pages/UpdatePassword';
import SuperAdminLogin from './pages/auth/SuperAdminLogin';
import SuperAdminSignup from './pages/auth/SuperAdminSignup';
import SuperAdminLayout from './pages/SuperAdmin/Layout';
import SuperAdminDashboard from './pages/SuperAdmin/Dashboard';
import Companies from './pages/SuperAdmin/Companies';
import Users from './pages/SuperAdmin/Users';
import Subscriptions from './pages/SuperAdmin/Subscriptions';
import ApiKeys from './pages/SuperAdmin/ApiKeys';
import Settings from './pages/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import ApiDashboard from './pages/ApiDashboard';
import Modules from './pages/Modules';

// CRM Routes
import Leads from './pages/Leads';
import Clients from './pages/Clients';
import Tasks from './pages/Tasks';
import Calendar from './pages/Calendar';
import Documents from './pages/Documents';
import Reports from './pages/Reports';
import Staff from './pages/Staff';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Subscription from './pages/Subscription';
import Branches from './pages/Branches';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ErrorBoundary>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#333',
              color: '#fff',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <Landing />
      </ErrorBoundary>
    ),
  },
  {
    path: '/login',
    element: (
      <ErrorBoundary>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#333',
              color: '#fff',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <Login />
      </ErrorBoundary>
    ),
  },
  {
    path: '/signup',
    element: (
      <ErrorBoundary>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#333',
              color: '#fff',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <Signup />
      </ErrorBoundary>
    ),
  },
  {
    path: '/reset-password',
    element: (
      <ErrorBoundary>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#333',
              color: '#fff',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <ResetPassword />
      </ErrorBoundary>
    ),
  },
  {
    path: '/update-password',
    element: (
      <ErrorBoundary>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#333',
              color: '#fff',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <UpdatePassword />
      </ErrorBoundary>
    ),
  },
  {
    path: '/superadmin/login',
    element: (
      <ErrorBoundary>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#333',
              color: '#fff',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <SuperAdminLogin />
      </ErrorBoundary>
    ),
  },
  {
    path: '/superadmin/signup',
    element: (
      <ErrorBoundary>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#333',
              color: '#fff',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <SuperAdminSignup />
      </ErrorBoundary>
    ),
  },
  {
    path: '/super-admin',
    element: (
      <ProtectedRoute requiredRole="super_admin">
        <SuperAdminLayout>
          <Outlet />
        </SuperAdminLayout>
      </ProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: <SuperAdminDashboard />,
      },
      {
        path: 'companies',
        element: <Companies />,
      },
      {
        path: 'users',
        element: <Users />,
      },
      {
        path: 'subscriptions',
        element: <Subscriptions />,
      },
      {
        path: 'api-keys',
        element: <ApiKeys />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
    ],
  },
  {
    path: '/',
    element: (
      <ProtectedRoute requiredRole="company">
        <MainLayout>
          <Outlet />
        </MainLayout>
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'leads',
        element: <Leads />,
      },
      {
        path: 'clients',
        element: <Clients />,
      },
      {
        path: 'tasks',
        element: <Tasks />,
      },
      {
        path: 'calendar',
        element: <Calendar />,
      },
      {
        path: 'documents',
        element: <Documents />,
      },
      {
        path: 'reports',
        element: <Reports />,
      },
      {
        path: 'staff',
        element: <Staff />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
      {
        path: 'notifications',
        element: <Notifications />,
      },
      {
        path: 'subscription',
        element: <Subscription />,
      },
      {
        path: 'branches',
        element: <Branches />,
      },
      {
        path: 'modules',
        element: <Modules />,
      },
    ],
  },
  {
    path: '/api-dashboard/*',
    element: (
      <ProtectedRoute requiredRole="super_admin">
        <ApiDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: (
      <Navigate to={!useAuth().user ? '/login' : useAuth().userRole === 'super_admin' ? '/super-admin' : '/dashboard'} replace />
    ),
  },
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
});

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;