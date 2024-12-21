import React, { useState } from 'react';
import { useModules } from '@/contexts/ModuleContext';
import { ModuleCategory } from '@/contexts/ModuleContext/types';
import { Search, Settings2, FileText, Users, Image, Wrench, Lock, Files, User, ImageIcon, Settings, 
         LayoutDashboard, GitBranch, Truck, Receipt, CreditCard, Mail, MessageCircle, MessageSquare,
         LineChart, TrendingUp, Globe, Shield } from 'lucide-react';
import ModuleCard from './ModuleCard';
import { Button } from '@/components/ui/button';

const sidebarItems = [
  { id: 'core', name: 'Core Modules', icon: LayoutDashboard },
  { id: 'operations', name: 'Operations', icon: Wrench },
  { id: 'finance', name: 'Finance', icon: Receipt },
  { id: 'marketing', name: 'Marketing', icon: Mail },
  { id: 'customer_experience', name: 'Customer Experience', icon: MessageCircle },
  { id: 'advanced_features', name: 'Advanced Features', icon: LineChart },
  { id: 'localization', name: 'Localization', icon: Globe },
  { id: 'super_admin', name: 'Super Admin', icon: Shield },
] as const;

const defaultModules = [
  {
    id: '1',
    name: 'dashboard',
    display_name: 'Dashboard',
    description: 'Main dashboard with key metrics and insights',
    category: 'core',
    is_core: true,
    icon: 'LayoutDashboard',
    status: 'active'
  },
  {
    id: '2',
    name: 'customers',
    display_name: 'Customer Management',
    description: 'Manage your customer database and interactions',
    category: 'core',
    is_core: true,
    icon: 'Users',
    status: 'active'
  },
  // Add more default modules as needed
];

export default function ModuleOverview() {
  const { 
    modules, 
    loading,
    error,
    isModuleAccessible,
    selectedCategory, 
    setSelectedCategory 
  } = useModules();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<ModuleCategory>('core');

  const displayModules = modules.length > 0 ? modules : defaultModules;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Filter modules based on search term and category
  const filteredModules = displayModules.filter(module => {
    const matchesSearch = searchTerm === '' || 
      module.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeCategory === 'core' ? module.is_core : module.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCategoryClick = (categoryId: ModuleCategory) => {
    setActiveCategory(categoryId);
    setSelectedCategory(categoryId);
  };

  return (
    <div className="container mx-auto p-4">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Module Management</h1>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search modules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-64 shrink-0">
          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleCategoryClick(item.id as ModuleCategory)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors
                    ${activeCategory === item.id
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Module Grid */}
        <div className="flex-1">
          {error ? (
            <div className="text-red-500 p-4 rounded-md bg-red-50 dark:bg-red-900/10">
              {error}
            </div>
          ) : filteredModules.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No modules found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredModules.map((module) => (
                <ModuleCard
                  key={module.id}
                  module={module}
                  isAccessible={isModuleAccessible(module)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}