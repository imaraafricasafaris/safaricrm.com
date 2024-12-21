-- Create module-related enums
DO $$ BEGIN
    CREATE TYPE module_category AS ENUM (
        'core',
        'operations',
        'finance',
        'marketing',
        'customer_experience',
        'advanced_features',
        'localization',
        'super_admin'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE module_status AS ENUM (
        'active',
        'inactive',
        'pending',
        'error'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE subscription_tier_type AS ENUM (
        'free',
        'basic',
        'premium',
        'enterprise'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create modules table
CREATE TABLE IF NOT EXISTS "public"."modules" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" module_category NOT NULL,
    "is_core" BOOLEAN NOT NULL DEFAULT false,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "required_subscription_tier" subscription_tier_type NOT NULL,
    "status" module_status NOT NULL DEFAULT 'inactive',
    "settings" JSONB DEFAULT '{}',
    "icon" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(name)
);

-- Create module_states table
CREATE TABLE IF NOT EXISTS "public"."module_states" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "company_id" UUID NOT NULL REFERENCES companies(id),
    "module_id" UUID NOT NULL REFERENCES modules(id),
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "settings" JSONB DEFAULT '{}',
    "last_used_at" TIMESTAMP WITH TIME ZONE,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(company_id, module_id)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS "idx_modules_category" ON "public"."modules"("category");
CREATE INDEX IF NOT EXISTS "idx_module_states_company_id" ON "public"."module_states"("company_id");
CREATE INDEX IF NOT EXISTS "idx_module_states_module_id" ON "public"."module_states"("module_id");

-- Add triggers
CREATE TRIGGER update_modules_updated_at
    BEFORE UPDATE ON modules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_module_states_updated_at
    BEFORE UPDATE ON module_states
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
