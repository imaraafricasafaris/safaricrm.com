import { z } from 'zod';

export type ModuleCategory = 
  | 'core'
  | 'operations'
  | 'finance'
  | 'marketing'
  | 'customer_experience'
  | 'advanced_features'
  | 'localization'
  | 'super_admin';

export type ModuleStatus = 'active' | 'inactive' | 'pending' | 'error';

export type SubscriptionTier = 'free' | 'basic' | 'premium' | 'enterprise';

export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'pending' | 'past_due';

export type BillingPeriod = 'monthly' | 'yearly';

export interface Module {
  id: string;
  name: string;
  display_name: string;
  description: string;
  category: ModuleCategory;
  is_core: boolean;
  is_enabled: boolean;
  required_subscription_tier: SubscriptionTier;
  status: ModuleStatus;
  settings?: Record<string, any>;
  icon?: string;
  created_at: Date;
  updated_at: Date;
}

export interface SubscriptionTierInfo {
  id: string;
  name: SubscriptionTier;
  display_name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  features: string[];
  max_users: number;
  max_storage_gb: number;
  is_popular: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CompanySubscription {
  id: string;
  company_id: string;
  subscription_tier_id: string;
  status: SubscriptionStatus;
  billing_period: BillingPeriod;
  current_period_start: Date;
  current_period_end: Date;
  cancel_at_period_end: boolean;
  payment_method_id?: string;
  stripe_subscription_id?: string;
  stripe_customer_id?: string;
  created_at: Date;
  updated_at: Date;
}

export interface ModuleSubscription {
  id: string;
  company_id: string;
  module_id: string;
  is_active: boolean;
  activation_date: Date | null;
  expiry_date: Date | null;
  settings: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export interface ModuleUsageLog {
  id: string;
  company_id: string;
  module_id: string;
  user_id: string;
  action: string;
  details: Record<string, any>;
  created_at: Date;
}

export interface ModuleContextType {
  modules: Module[];
  subscriptionTiers: SubscriptionTierInfo[];
  activeSubscriptions: ModuleSubscription[];
  companySubscription?: CompanySubscription;
  selectedCategory: ModuleCategory;
  setSelectedCategory: (category: ModuleCategory) => void;
  loading: boolean;
  error: string | null;
  currentTier: SubscriptionTier;
  toggleModule: (moduleId: string) => Promise<void>;
  configureModule: (moduleId: string, settings: Record<string, any>) => Promise<void>;
  activateSubscription: (moduleId: string, tierId: string) => Promise<void>;
  deactivateSubscription: (moduleId: string) => Promise<void>;
  isModuleAccessible: (moduleId: string) => boolean;
  upgradeSubscription: (newTier: SubscriptionTier, billingPeriod: BillingPeriod) => Promise<void>;
  cancelSubscription: () => Promise<void>;
}