import React from 'react';
import { Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/api/ErrorBoundary';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
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

// Layout components
const DashboardLayout = () => {
  const { user, userRole } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return <Outlet />;
};

const SuperAdminDashboardLayout = () => {
  const { user, userRole } = useAuth();
  if (!user || userRole !== 'super_admin') return <Navigate to="/superadmin/login" />;
  return <SuperAdminLayout><Outlet /></SuperAdminLayout>;
};

const PublicLayout = () => {
  const { user, userRole } = useAuth();
  const location = useLocation();

  if (user) {
    if (userRole === 'super_admin') {
      return <Navigate to="/super-admin" state={{ from: location }} replace />;
    }
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }
  return <Outlet />;
};

function App() {
  return (
    <ErrorBoundary>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Landing />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="superadmin/login" element={<SuperAdminLogin />} />
          <Route path="superadmin/signup" element={<SuperAdminSignup />} />
        </Route>

        {/* Super Admin Routes */}
        <Route path="/super-admin" element={<SuperAdminDashboardLayout />}>
          <Route index element={<SuperAdminDashboard />} />
          <Route path="companies" element={<Companies />} />
          <Route path="users" element={<Users />} />
          <Route path="subscriptions" element={<Subscriptions />} />
          <Route path="api-keys" element={<ApiKeys />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="leads" element={<Leads />} />
          <Route path="clients" element={<Clients />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="documents" element={<Documents />} />
          <Route path="reports" element={<Reports />} />
          <Route path="staff" element={<Staff />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="subscription" element={<Subscription />} />
          <Route path="branches" element={<Branches />} />
          <Route path="modules" element={<Modules />} />
        </Route>

        {/* API Dashboard */}
        <Route
          path="/api-dashboard/*"
          element={<ProtectedRoute requiredRole="super_admin"><ApiDashboard /></ProtectedRoute>}
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to={!useAuth().user ? '/login' : useAuth().userRole === 'super_admin' ? '/super-admin' : '/dashboard'} replace />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;