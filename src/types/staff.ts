export type StaffRole = 'admin' | 'manager' | 'agent' | 'driver' | 'guide' | 'finance' | 'support';
export type StaffStatus = 'active' | 'inactive' | 'pending';
export type AvailabilityStatus = 'available' | 'on_leave' | 'unavailable' | 'busy';

export interface Staff {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  full_name?: string; // Computed field
  email: string;
  phone?: string;
  role: StaffRole;
  status: StaffStatus;
  availability_status: AvailabilityStatus;
  avatar_url?: string;
  branch?: string;
  office_id?: string;
  permissions?: {
    leads?: boolean;
    safaris?: boolean;
    vehicles?: boolean;
    reports?: boolean;
    settings?: boolean;
    finance?: boolean;
    staff?: boolean;
    clients?: boolean;
  };
  last_login?: string;
  last_activity?: string;
  activity_logs?: {
    timestamp: string;
    action: string;
    details: string;
  }[];
  assigned_tasks?: number;
  completed_tasks?: number;
  address?: string;
  emergency_contact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  created_at: string;
  updated_at: string;
}

export interface StaffOffice {
  id: string;
  staff_id: string;
  office_id: string;
  role: StaffRole;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface StaffActivityLog {
  id: string;
  staff_id: string;
  action: string;
  details: string;
  timestamp: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  updated_at: string;
}