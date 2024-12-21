import { Module } from './index';

export const defaultModules: Module[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Overview of your business metrics and key performance indicators',
    icon: 'layout-dashboard',
    path: '/dashboard',
    isEnabled: true
  },
  {
    id: 'customers',
    name: 'Customer Management',
    description: 'Manage your customer relationships and interactions',
    icon: 'users',
    path: '/customers',
    isEnabled: true
  },
  {
    id: 'bookings',
    name: 'Bookings',
    description: 'Manage safari bookings and itineraries',
    icon: 'calendar',
    path: '/bookings',
    isEnabled: true
  },
  {
    id: 'vehicles',
    name: 'Vehicle Management',
    description: 'Manage your safari vehicles and maintenance',
    icon: 'car',
    path: '/vehicles',
    isEnabled: true
  },
  {
    id: 'reports',
    name: 'Reports',
    description: 'Generate and view business reports and analytics',
    icon: 'bar-chart',
    path: '/reports',
    isEnabled: true
  }
];
