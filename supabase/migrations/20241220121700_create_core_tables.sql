-- Create documents table
CREATE TABLE IF NOT EXISTS "public"."documents" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "company_id" UUID NOT NULL REFERENCES companies(id),
    "user_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "file_path" TEXT NOT NULL,
    "file_size" BIGINT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create payments table
CREATE TABLE IF NOT EXISTS "public"."payments" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "company_id" UUID NOT NULL REFERENCES companies(id),
    "subscription_id" UUID REFERENCES company_subscriptions(id),
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "payment_method" TEXT NOT NULL,
    "stripe_payment_id" TEXT,
    "stripe_invoice_id" TEXT,
    "billing_details" JSONB DEFAULT '{}',
    "metadata" JSONB DEFAULT '{}',
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
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
    CONSTRAINT "module_states_company_module_unique" UNIQUE ("company_id", "module_id")
);

-- Add indexes
CREATE INDEX IF NOT EXISTS "idx_documents_company_id" ON "public"."documents"("company_id");
CREATE INDEX IF NOT EXISTS "idx_documents_user_id" ON "public"."documents"("user_id");
CREATE INDEX IF NOT EXISTS "idx_payments_company_id" ON "public"."payments"("company_id");
CREATE INDEX IF NOT EXISTS "idx_payments_subscription_id" ON "public"."payments"("subscription_id");
CREATE INDEX IF NOT EXISTS "idx_module_states_company_id" ON "public"."module_states"("company_id");
CREATE INDEX IF NOT EXISTS "idx_module_states_module_id" ON "public"."module_states"("module_id");

-- Add triggers for updated_at
CREATE TRIGGER update_documents_updated_at
    BEFORE UPDATE ON documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_module_states_updated_at
    BEFORE UPDATE ON module_states
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO module_states (company_id, module_id, is_enabled, settings)
SELECT 
    c.id as company_id,
    m.id as module_id,
    CASE 
        WHEN m.is_core THEN true
        ELSE false
    END as is_enabled,
    '{}'::jsonb as settings
FROM 
    companies c
    CROSS JOIN modules m
ON CONFLICT DO NOTHING;
