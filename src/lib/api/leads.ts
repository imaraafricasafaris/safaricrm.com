import { supabase } from '../supabase';
import { Lead, LeadSource, LeadDestination, LeadTripType } from '../../types/leads';

// Fetch leads with optional filters
export async function getLeads(filters?: {
  search?: string;
  status?: string;
  dateRange?: string;
  assignedTo?: string;
}): Promise<Lead[]> {
  try {
    let query = supabase
      .from('leads')
      .select(`
        *
      `);

    if (filters?.search) {
      query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
    }

    if (filters?.status) {
      query.eq('status', filters.status);
    }

    if (filters?.assignedTo) {
      query.eq('assigned_to', filters.assignedTo);
    }

    if (filters?.dateRange) {
      query = query.gte('created_at', filters.dateRange);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    
    // Transform data to match Lead type
    const transformedData = data?.map(lead => ({
      ...lead,
      destinations: lead.destinations || [],
      trip_type: lead.trip_type || [],
      duration: lead.duration || 1,
      adults: lead.adults || 1,
      children: lead.children || 0,
      marketing_consent: lead.marketing_consent || false
    })) || [];
    return transformedData;
  } catch (error) {
    console.error('Error fetching leads:', error);
    throw error;
  }
}

// Fetch lead sources
export async function getLeadSources(): Promise<LeadSource[]> {
  try {
    const { data, error } = await supabase.from('lead_sources').select('*').order('name');
    if (error) throw error;
    return data as LeadSource[];
  } catch (error) {
    console.error('Failed to fetch lead sources:', error);
    return [];
  }
}

// Fetch lead destinations
export async function getLeadDestinations(): Promise<LeadDestination[]> {
  try {
    const { data, error } = await supabase.from('lead_destinations').select('*').order('name');
    if (error) throw error;
    return data as LeadDestination[];
  } catch (error) {
    console.error('Failed to fetch lead destinations:', error);
    return [];
  }
}

// Fetch lead trip types
export async function getLeadTripTypes(): Promise<LeadTripType[]> {
  try {
    const { data, error } = await supabase.from('lead_trip_types').select('*').order('name');
    if (error) throw error;
    return data as LeadTripType[];
  } catch (error) {
    console.error('Failed to fetch lead trip types:', error);
    return [];
  }
}

// Create a new lead
export async function createLead(data: {
  // Lead base data
  name: string;
  email: string;
  phone?: string;
  country?: string;
  status: string;
  source: string;
  lead_score?: number;
  lead_temperature?: string;
  notes?: string;
  follow_up_priority?: string;
  
  // Lead details data
  first_name: string;
  last_name: string;
  destinations: string[];
  trip_type: string[];
  duration: number;
  preferred_dates?: string;
  adults: number;
  children: number;
  budget?: number;
  special_requirements?: string;
  
  // AI analysis data
  ai_score?: number;
  ai_score_explanation?: string;
  ai_recommended_packages?: string[];
  ai_recommended_activities?: string[];
  ai_recommended_accommodations?: string[];
  ai_follow_up_priority?: string;
  ai_follow_up_approach?: string;
  ai_follow_up_timeline?: string;
  ai_follow_up_key_points?: string[];
}) {
  try {
    // First create the lead
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert({
        name: data.name,
        email: data.email,
        phone: data.phone,
        country: data.country,
        status: data.status,
        source: data.source,
        lead_score: data.lead_score,
        lead_temperature: data.lead_temperature,
        notes: data.notes,
        follow_up_priority: data.follow_up_priority
      })
      .select()
      .single();

    if (leadError) throw leadError;

    // Then create the lead details
    const { data: leadDetails, error: detailsError } = await supabase
      .from('lead_details')
      .insert({
        lead_id: lead.id,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        country: data.country,
        destinations: data.destinations,
        trip_type: data.trip_type,
        duration: data.duration,
        preferred_dates: data.preferred_dates,
        adults: data.adults,
        children: data.children,
        budget: data.budget,
        special_requirements: data.special_requirements,
        ai_score: data.ai_score,
        ai_score_explanation: data.ai_score_explanation,
        ai_recommended_packages: data.ai_recommended_packages,
        ai_recommended_activities: data.ai_recommended_activities,
        ai_recommended_accommodations: data.ai_recommended_accommodations,
        ai_follow_up_priority: data.ai_follow_up_priority,
        ai_follow_up_approach: data.ai_follow_up_approach,
        ai_follow_up_timeline: data.ai_follow_up_timeline,
        ai_follow_up_key_points: data.ai_follow_up_key_points
      })
      .select()
      .single();

    if (detailsError) {
      // If lead details creation fails, delete the lead
      await supabase.from('leads').delete().eq('id', lead.id);
      throw detailsError;
    }

    return { ...lead, details: leadDetails };
  } catch (error) {
    console.error('Error creating lead:', error);
    throw error;
  }
}

// Update an existing lead
export async function updateLead(id: string, updates: Partial<Lead>): Promise<Lead> {
  try {
    const { data, error } = await supabase.from('leads').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data as Lead;
  } catch (error) {
    console.error('Error updating lead:', error);
    throw error;
  }
}

// Fetch activities related to a lead
export async function getLeadActivities(leadId: string) {
  try {
    const { data, error } = await supabase
      .from('lead_activities')
      .select(`
        *,
        user:auth.users (
          email,
          user_metadata
        )
      `)
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching lead activities:', error);
    throw error;
  }
}

// Sync leads from SafariBookings API
export async function syncSafariBookingsLeads(apiKey: string) {
  try {
    // Example placeholder logic for API integration
    console.log('Fetching leads from SafariBookings API with key:', apiKey);
    // TODO: Implement actual API call and data sync
    throw new Error('Not implemented');
  } catch (error) {
    console.error('Error syncing SafariBookings leads:', error);
    throw error;
  }
}

// Import leads from a CSV file
export async function importLeadsFromCSV(file: File) {
  try {
    console.log('Parsing and importing CSV file:', file.name);
    // TODO: Implement CSV parsing and lead creation
    throw new Error('Not implemented');
  } catch (error) {
    console.error('Error importing leads from CSV:', error);
    throw error;
  }
}

// Export leads to a file
export async function exportLeads(format: 'csv' | 'xlsx') {
  try {
    console.log('Exporting leads to format:', format);
    // TODO: Implement lead export logic
    throw new Error('Not implemented');
  } catch (error) {
    console.error('Error exporting leads:', error);
    throw error;
  }
}
