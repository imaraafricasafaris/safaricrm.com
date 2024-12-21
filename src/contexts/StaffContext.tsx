import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Staff } from '../types/staff';
import { toast } from 'react-hot-toast';

interface StaffContextType {
  staff: Staff[];
  isLoading: boolean;
  error: string | null;
  addStaff: (staffData: Partial<Staff>) => Promise<void>;
  updateStaff: (id: string, staffData: Partial<Staff>) => Promise<void>;
  deleteStaff: (id: string) => Promise<void>;
  getStaff: () => Promise<void>;
  findStaffByName: (name: string) => Staff | undefined;
}

const StaffContext = createContext<StaffContextType | undefined>(undefined);

export function StaffProvider({ children }: { children: React.ReactNode }) {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getStaff = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('staff')
        .select(`
          *,
          office:offices (
            id,
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Transform the data to include office_name
      const transformedData = data.map(staff => ({
        ...staff,
        office_name: staff.office ? staff.office.name : null
      }));

      setStaff(transformedData);
      setError(null);
    } catch (error: any) {
      console.error('Error:', error);
      setError(error.message);
      toast.error('Failed to fetch staff');
    } finally {
      setIsLoading(false);
    }
  };

  const addStaff = async (staffData: Partial<Staff>) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user found');

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

      toast.success('Staff member added successfully');
      getStaff(); // Refresh the staff list
    } catch (error: any) {
      console.error('Error adding staff:', error);
      setError(error);
      toast.error(error.message || 'Failed to add staff member');
    } finally {
      setIsLoading(false);
    }
  };

  const updateStaff = async (id: string, staffData: Partial<Staff>) => {
    try {
      setIsLoading(true);
      setError(null);

      // Convert branch to office_id if it exists
      const updateData = { ...staffData };
      if ('branch' in updateData) {
        updateData.office_id = updateData.branch;
        delete updateData.branch;
      }
      delete updateData.branch_name; // Remove computed field

      const { error } = await supabase
        .from('staff')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      toast.success('Staff member updated successfully');
      getStaff(); // Refresh the staff list
    } catch (error: any) {
      console.error('Error updating staff:', error);
      setError(error);
      toast.error(error.message || 'Failed to update staff member');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteStaff = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { error } = await supabase
        .from('staff')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Staff member deleted successfully');
      getStaff(); // Refresh the staff list
    } catch (error: any) {
      console.error('Error deleting staff:', error);
      setError(error);
      toast.error(error.message || 'Failed to delete staff member');
    } finally {
      setIsLoading(false);
    }
  };

  const findStaffByName = (name: string) => {
    const lowerName = name.toLowerCase();
    return staff.find(
      (s) =>
        `${s.first_name} ${s.last_name}`.toLowerCase().includes(lowerName)
    );
  };

  useEffect(() => {
    getStaff();
  }, []);

  const value = {
    staff,
    isLoading,
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