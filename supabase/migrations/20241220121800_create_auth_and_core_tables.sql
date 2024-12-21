-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS "auth"."users" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "email" TEXT UNIQUE NOT NULL,
    "encrypted_password" TEXT NOT NULL,
    "email_confirmed_at" TIMESTAMP WITH TIME ZONE,
    "invited_at" TIMESTAMP WITH TIME ZONE,
    "confirmation_token" TEXT,
    "confirmation_sent_at" TIMESTAMP WITH TIME ZONE,
    "recovery_token" TEXT,
    "recovery_sent_at" TIMESTAMP WITH TIME ZONE,
    "email_change_token" TEXT,
    "email_change" TEXT,
    "email_change_sent_at" TIMESTAMP WITH TIME ZONE,
    "last_sign_in_at" TIMESTAMP WITH TIME ZONE,
    "raw_app_meta_data" JSONB,
    "raw_user_meta_data" JSONB,
    "is_super_admin" BOOLEAN,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    "phone" TEXT,
    "phone_confirmed_at" TIMESTAMP WITH TIME ZONE,
    "phone_change" TEXT,
    "phone_change_token" TEXT,
    "phone_change_sent_at" TIMESTAMP WITH TIME ZONE,
    "confirmed_at" TIMESTAMP WITH TIME ZONE,
    "email_change_confirm_status" SMALLINT,
    "banned_until" TIMESTAMP WITH TIME ZONE,
    "reauthentication_token" TEXT,
    "reauthentication_sent_at" TIMESTAMP WITH TIME ZONE,
    CONSTRAINT "users_email_change_confirm_status_check" CHECK ((email_change_confirm_status >= 0))
);

-- Create documents table
CREATE TABLE IF NOT EXISTS "public"."documents" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "company_id" UUID NOT NULL REFERENCES companies(id),
    "user_id" UUID NOT NULL REFERENCES auth.users(id),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "file_path" TEXT NOT NULL,
    "file_size" BIGINT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "metadata" JSONB DEFAULT '{}',
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

-- Add indexes
CREATE INDEX IF NOT EXISTS "idx_documents_company_id" ON "public"."documents"("company_id");
CREATE INDEX IF NOT EXISTS "idx_documents_user_id" ON "public"."documents"("user_id");
CREATE INDEX IF NOT EXISTS "idx_payments_company_id" ON "public"."payments"("company_id");
CREATE INDEX IF NOT EXISTS "idx_payments_subscription_id" ON "public"."payments"("subscription_id");

-- Add triggers for updated_at
CREATE TRIGGER update_documents_updated_at
    BEFORE UPDATE ON documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
INSERT INTO auth.users (
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data
) VALUES (
    'admin@safaricrm.com',
    '$2a$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', -- Replace with actual hashed password
    CURRENT_TIMESTAMP,
    '{"full_name": "Admin User", "role": "admin"}'::jsonb
) ON CONFLICT (email) DO NOTHING;
