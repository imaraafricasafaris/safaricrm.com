-- Drop existing tables if they exist
DROP TABLE IF EXISTS "public"."module_usage_logs" CASCADE;
DROP TABLE IF EXISTS "public"."module_subscriptions" CASCADE;
DROP TABLE IF EXISTS "public"."module_states" CASCADE;
DROP TABLE IF EXISTS "public"."module_logs" CASCADE;
DROP TABLE IF EXISTS "public"."modules" CASCADE;
DROP TABLE IF EXISTS "public"."company_subscriptions" CASCADE;
DROP TABLE IF EXISTS "public"."subscription_tiers" CASCADE;

DROP TYPE IF EXISTS "public"."module_category" CASCADE;
DROP TYPE IF EXISTS "public"."module_status" CASCADE;
DROP TYPE IF EXISTS "public"."subscription_tier_type" CASCADE;
DROP TYPE IF EXISTS "public"."subscription_status" CASCADE;
DROP TYPE IF EXISTS "public"."billing_period" CASCADE;

-- Create module_category enum
CREATE TYPE "public"."module_category" AS ENUM (
  'core',
  'operations',
  'finance',
  'marketing',
  'customer_experience',
  'advanced_features',
  'localization',
  'super_admin'
);

-- Create module_status enum
CREATE TYPE "public"."module_status" AS ENUM (
  'active',
  'inactive',
  'pending',
  'error'
);

-- Create subscription_tier_type enum
CREATE TYPE "public"."subscription_tier_type" AS ENUM (
  'free',
  'basic',
  'premium',
  'enterprise'
);

-- Create subscription_status enum
CREATE TYPE "public"."subscription_status" AS ENUM (
  'active',
  'cancelled',
  'expired',
  'pending',
  'past_due'
);

-- Create billing_period enum
CREATE TYPE "public"."billing_period" AS ENUM (
  'monthly',
  'yearly'
);

-- Create subscription_tiers table
CREATE TABLE "public"."subscription_tiers" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "name" subscription_tier_type NOT NULL,
  "display_name" text NOT NULL,
  "description" text NOT NULL,
  "price_monthly" decimal(10,2) NOT NULL,
  "price_yearly" decimal(10,2) NOT NULL,
  "features" jsonb NOT NULL DEFAULT '[]',
  "max_users" integer NOT NULL DEFAULT 1,
  "max_storage_gb" integer NOT NULL DEFAULT 1,
  "is_popular" boolean NOT NULL DEFAULT false,
  "created_at" timestamptz DEFAULT timezone('utc'::text, now()),
  "updated_at" timestamptz DEFAULT timezone('utc'::text, now()),
  CONSTRAINT "subscription_tiers_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "subscription_tiers_name_unique" UNIQUE ("name")
);

-- Create company_subscriptions table
CREATE TABLE "public"."company_subscriptions" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "company_id" uuid NOT NULL,
  "subscription_tier_id" uuid NOT NULL REFERENCES "public"."subscription_tiers"("id") ON DELETE CASCADE,
  "status" subscription_status NOT NULL DEFAULT 'pending',
  "billing_period" billing_period NOT NULL DEFAULT 'monthly',
  "current_period_start" timestamptz NOT NULL,
  "current_period_end" timestamptz NOT NULL,
  "cancel_at_period_end" boolean NOT NULL DEFAULT false,
  "payment_method_id" text,
  "stripe_subscription_id" text,
  "stripe_customer_id" text,
  "created_at" timestamptz DEFAULT timezone('utc'::text, now()),
  "updated_at" timestamptz DEFAULT timezone('utc'::text, now()),
  CONSTRAINT "company_subscriptions_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "company_subscriptions_company_id_unique" UNIQUE ("company_id")
);

-- Create modules table
CREATE TABLE "public"."modules" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "name" text NOT NULL,
  "display_name" text NOT NULL,
  "description" text NOT NULL,
  "category" module_category NOT NULL,
  "is_core" boolean NOT NULL DEFAULT false,
  "is_enabled" boolean NOT NULL DEFAULT true,
  "required_subscription_tier" subscription_tier_type NOT NULL,
  "status" module_status NOT NULL DEFAULT 'inactive',
  "settings" jsonb DEFAULT '{}',
  "icon" text,
  "created_at" timestamptz DEFAULT timezone('utc'::text, now()),
  "updated_at" timestamptz DEFAULT timezone('utc'::text, now()),
  CONSTRAINT "modules_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "modules_name_unique" UNIQUE ("name")
);

-- Create module_subscriptions table
CREATE TABLE "public"."module_subscriptions" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "company_id" uuid NOT NULL,
  "module_id" uuid NOT NULL REFERENCES "public"."modules"("id") ON DELETE CASCADE,
  "is_active" boolean NOT NULL DEFAULT true,
  "activation_date" timestamptz,
  "expiry_date" timestamptz,
  "settings" jsonb DEFAULT '{}',
  "created_at" timestamptz DEFAULT timezone('utc'::text, now()),
  "updated_at" timestamptz DEFAULT timezone('utc'::text, now()),
  CONSTRAINT "module_subscriptions_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "module_subscriptions_company_module_unique" UNIQUE ("company_id", "module_id")
);

-- Create module_usage_logs table
CREATE TABLE "public"."module_usage_logs" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "company_id" uuid NOT NULL,
  "module_id" uuid NOT NULL REFERENCES "public"."modules"("id") ON DELETE CASCADE,
  "user_id" uuid NOT NULL,
  "action" text NOT NULL,
  "details" jsonb DEFAULT '{}',
  "created_at" timestamptz DEFAULT timezone('utc'::text, now()),
  CONSTRAINT "module_usage_logs_pkey" PRIMARY KEY ("id")
);

-- Insert initial subscription tiers
INSERT INTO "public"."subscription_tiers" (
  "name", "display_name", "description", "price_monthly", "price_yearly", "features", "max_users", "max_storage_gb", "is_popular"
) VALUES
  ('free', 'Free', 'Get started with basic CRM features', 0, 0, 
  '[
    "Up to 2 users",
    "Basic lead management",
    "Contact management",
    "Basic reporting",
    "Email support"
  ]'::jsonb, 2, 1, false),
  
  ('basic', 'Basic', 'Perfect for small safari businesses', 29.99, 299.90,
  '[
    "Up to 5 users",
    "Advanced lead management",
    "Document management",
    "Basic automation",
    "Email & chat support",
    "5GB storage"
  ]'::jsonb, 5, 5, false),
  
  ('premium', 'Premium', 'Ideal for growing safari companies', 79.99, 799.90,
  '[
    "Up to 20 users",
    "Advanced automation",
    "Custom reporting",
    "API access",
    "Priority support",
    "20GB storage",
    "White-labeling"
  ]'::jsonb, 20, 20, true),
  
  ('enterprise', 'Enterprise', 'For large safari operations', 199.99, 1999.90,
  '[
    "Unlimited users",
    "Dedicated support",
    "Custom integration",
    "Advanced security",
    "Unlimited storage",
    "SLA guarantee",
    "Custom training"
  ]'::jsonb, 999999, 999999, false);

-- Insert core modules
INSERT INTO "public"."modules" (
  "name", "display_name", "description", "category", "is_core", "required_subscription_tier", "status", "icon"
) VALUES
  ('dashboard', 'Dashboard', 'Overview of your safari business metrics', 'core', true, 'free', 'active', 'LayoutDashboard'),
  ('leads', 'Lead Management', 'Track and manage potential safari clients', 'core', true, 'free', 'active', 'Users'),
  ('contacts', 'Contact Management', 'Manage your client database', 'core', true, 'free', 'active', 'AddressBook'),
  ('basic_reports', 'Basic Reports', 'Essential business reporting', 'core', true, 'free', 'active', 'BarChart');

-- Insert optional modules
INSERT INTO "public"."modules" (
  "name", "display_name", "description", "category", "is_core", "required_subscription_tier", "status", "icon"
) VALUES
  -- Operations Modules
  ('document_management', 'Document Management', 'Manage safari documents and contracts', 'operations', false, 'basic', 'active', 'FileText'),
  ('vehicle_management', 'Vehicle Management', 'Track and manage safari vehicles', 'operations', false, 'basic', 'active', 'Truck'),
  ('booking_system', 'Booking System', 'Comprehensive safari booking management', 'operations', false, 'premium', 'active', 'Calendar'),
  
  -- Finance Modules
  ('invoicing', 'Invoicing', 'Create and manage safari invoices', 'finance', false, 'basic', 'active', 'Receipt'),
  ('payments', 'Payment Processing', 'Handle safari payments and transactions', 'finance', false, 'basic', 'active', 'CreditCard'),
  ('financial_reports', 'Financial Reports', 'Detailed financial analysis', 'finance', false, 'premium', 'active', 'TrendingUp'),
  
  -- Marketing Modules
  ('email_marketing', 'Email Marketing', 'Run email campaigns for safari promotions', 'marketing', false, 'basic', 'active', 'Mail'),
  ('social_media', 'Social Media Integration', 'Manage social media presence', 'marketing', false, 'premium', 'active', 'Share2'),
  ('marketing_automation', 'Marketing Automation', 'Automate marketing tasks', 'marketing', false, 'premium', 'active', 'Zap'),
  
  -- Customer Experience Modules
  ('feedback_system', 'Feedback System', 'Collect and manage client feedback', 'customer_experience', false, 'basic', 'active', 'MessageCircle'),
  ('live_chat', 'Live Chat', 'Real-time client communication', 'customer_experience', false, 'premium', 'active', 'MessageSquare'),
  ('knowledge_base', 'Knowledge Base', 'Client self-service portal', 'customer_experience', false, 'premium', 'active', 'Book'),
  
  -- Advanced Features
  ('advanced_reports', 'Advanced Reports', 'Complex business analytics', 'advanced_features', false, 'premium', 'active', 'LineChart'),
  ('api_access', 'API Access', 'Integrate with external systems', 'advanced_features', false, 'premium', 'active', 'Webhook'),
  ('predictive_analytics', 'Predictive Analytics', 'AI-powered business insights', 'advanced_features', false, 'enterprise', 'active', 'Brain'),
  
  -- Localization
  ('multi_language', 'Multi-Language Support', 'Support multiple languages', 'localization', false, 'premium', 'active', 'Globe'),
  ('multi_currency', 'Multi-Currency', 'Handle multiple currencies', 'localization', false, 'premium', 'active', 'Currency'),
  
  -- Super Admin
  ('audit_logs', 'Audit Logs', 'Track system changes', 'super_admin', false, 'enterprise', 'active', 'Shield'),
  ('system_settings', 'System Settings', 'Advanced system configuration', 'super_admin', false, 'enterprise', 'active', 'Settings');

-- Create indexes
CREATE INDEX idx_company_subscriptions_company_id ON company_subscriptions(company_id);
CREATE INDEX idx_module_subscriptions_company_id ON module_subscriptions(company_id);
CREATE INDEX idx_module_subscriptions_module_id ON module_subscriptions(module_id);
CREATE INDEX idx_module_usage_logs_company_id ON module_usage_logs(company_id);
CREATE INDEX idx_module_usage_logs_module_id ON module_usage_logs(module_id);
CREATE INDEX idx_module_usage_logs_user_id ON module_usage_logs(user_id);

-- Add triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_subscription_tiers_updated_at
    BEFORE UPDATE ON subscription_tiers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_subscriptions_updated_at
    BEFORE UPDATE ON company_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_modules_updated_at
    BEFORE UPDATE ON modules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_module_subscriptions_updated_at
    BEFORE UPDATE ON module_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
