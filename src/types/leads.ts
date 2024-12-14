export interface LeadSource {
  id: string;
  name: string;
  type: 'safaribookings' | 'facebook' | 'google' | 'manual' | 'import' | 'referral' | 'linkedin' | 'email' | 'viator' | 'instagram' | 'website';
  active: boolean;
}

export interface LeadDestination {
  id: string;
  name: string;
  country: string;
  region: string;
  description?: string;
  image_url?: string;
}

export interface LeadTripType {
  id: string;
  name: string;
  description?: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
  source: string;
  source_id?: string;
  budget?: number;
  created_at: string;
  updated_at: string;
  assigned_to?: string;
  destinations: string[];
  trip_type: string[];
  duration: number;
  arrival_date?: string;
  adults: number;
  children: number;
  marketing_consent: boolean;
  lastContact?: string;
}

export interface LeadActivity {
  id: string;
  lead_id: string;
  user_id: string;
  type: 'status_change' | 'note_added' | 'email_sent' | 'call_made' | 'document_added';
  description: string;
  created_at: string;
  user?: {
    email: string;
  };
}