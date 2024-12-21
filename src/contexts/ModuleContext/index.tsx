import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '../AuthContext';
import { defaultModules } from './defaultModules';

export interface Module {
  id: string;
  name: string;
  description: string;
  icon: string;
  path: string;
  isEnabled: boolean;
}

interface ModuleContextType {
  modules: Module[];
  loading: boolean;
  error: Error | null;
  refreshModules: () => Promise<void>;
}

const ModuleContext = createContext<ModuleContextType | undefined>(undefined);

export function ModuleProvider({ children }: { children: React.ReactNode }) {
  const [modules, setModules] = useState<Module[]>(defaultModules);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const loadModuleStates = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user) {
        setModules(defaultModules.map(m => ({ ...m, isEnabled: true })));
        return;
      }

      // Get the user's company ID
      const { data: companies, error: companyError } = await supabase
        .from('companies')
        .select('id')
        .eq('owner_id', user.id)
        .single();

      if (companyError) {
        // If the companies table doesn't exist or there's an error, use default modules
        console.error('Error loading company:', companyError);
        setModules(defaultModules.map(m => ({ ...m, isEnabled: true })));
        return;
      }

      const companyId = companies?.id;

      // Try to get module states
      const { data: moduleStates, error: moduleError } = await supabase
        .from('module_states')
        .select('*')
        .eq('company_id', companyId);

      if (moduleError) {
        // If the module_states table doesn't exist, use default modules
        console.error('Error loading modules:', moduleError);
        setModules(defaultModules.map(m => ({ ...m, isEnabled: true })));
        return;
      }

      // If we have module states, merge them with default modules
      const moduleStateMap = new Map(moduleStates?.map(state => [state.module_id, state.is_enabled]));
      
      const mergedModules = defaultModules.map(module => ({
        ...module,
        isEnabled: moduleStateMap.get(module.id) ?? true
      }));

      setModules(mergedModules);
    } catch (err) {
      console.error('Error loading modules:', err);
      setError(err instanceof Error ? err : new Error('Failed to load modules'));
      // Fallback to default modules
      setModules(defaultModules.map(m => ({ ...m, isEnabled: true })));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadModuleStates();
  }, [user]);

  const value = {
    modules,
    loading,
    error,
    refreshModules: loadModuleStates
  };

  return (
    <ModuleContext.Provider value={value}>
      {children}
    </ModuleContext.Provider>
  );
}

export function useModules() {
  const context = useContext(ModuleContext);
  if (context === undefined) {
    throw new Error('useModules must be used within a ModuleProvider');
  }
  return context;
}