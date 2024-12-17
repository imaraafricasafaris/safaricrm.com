import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Staff } from '../types/staff';
import { toast } from 'react-hot-toast';

interface StaffContextType {
  staff: Staff[];
  loading: boolean;
  error: Error | null;
  addStaff: (staffData: Partial<Staff>) => Promise<void>;
  updateStaff: (id: string, staffData: Partial<Staff>) => Promise<void>;
  deleteStaff: (id: string) => Promise<void>;
  getStaff: () => Promise<void>;
  findStaffByName: (name: string) => Staff | undefined;
}

const StaffContext = createContext<StaffContextType | undefined>(undefined);

export function StaffProvider({ children }: { children: React.ReactNode }) {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const getStaff = async () => {
    try {
      setLoading(true);
      setError(null); // Reset error state
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setStaff(data || []);
    } catch (error: any) {
      console.error('Error fetching staff:', error);
      setError(error);
      toast.error(error.message || 'Failed to fetch staff members');
    } finally {
      setLoading(false);
    }
  };

  const addStaff = async (staffData: Partial<Staff>) => {
    try {
      setLoading(true);
      setError(null); // Reset error state
      
      // Get the current user's ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user found');

      // Prepare the staff data
      const newStaffData = {
        ...staffData,
        user_id: user.id,
        status: staffData.status || 'active',
        availability_status: staffData.availability_status || 'available',
        permissions: {
          leads: false,
          safaris: false,
          vehicles: false,
          reports: false,
          settings: false,
          finance: false,
          staff: false,
          clients: false,
          ...(staffData.permissions || {})
        }
      };

      const { data, error } = await supabase
        .from('staff')
        .insert([newStaffData])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error('No data returned from the server');
      }

      setStaff((prev) => [data, ...prev]);
      return data;
    } catch (error: any) {
      console.error('Add staff error:', error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateStaff = async (id: string, staffData: Partial<Staff>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('staff')
        .update(staffData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setStaff((prev) =>
        prev.map((staff) => (staff.id === id ? { ...staff, ...data } : staff))
      );
    } catch (error: any) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteStaff = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.from('staff').delete().eq('id', id);

      if (error) throw error;

      setStaff((prev) => prev.filter((staff) => staff.id !== id));
    } catch (error: any) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const findStaffByName = (name: string) => {
    const [firstName, lastName] = name.split('-');
    return staff.find(
      (s) => 
        s.first_name.toLowerCase() === firstName && 
        s.last_name.toLowerCase() === lastName
    );
  };

  useEffect(() => {
    getStaff();
  }, []);

  const value = {
    staff,
    loading,
    error,
    addStaff,
    updateStaff,
    deleteStaff,
    getStaff,
    findStaffByName,
  };

  return <StaffContext.Provider value={value}>{children}</StaffContext.Provider>;
}

export function useStaff() {
  const context = useContext(StaffContext);
  if (context === undefined) {
    throw new Error('useStaff must be used within a StaffProvider');
  }
  return context;
}