-- Create subscription-related enums
DO $$ BEGIN
    CREATE TYPE subscription_status AS ENUM (
        'active',
        'cancelled',
        'expired',
        'pending',
        'past_due'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE billing_period AS ENUM (
        'monthly',
        'yearly'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create subscription_tiers table
CREATE TABLE IF NOT EXISTS "public"."subscription_tiers" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" subscription_tier_type NOT NULL,
    "display_name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price_monthly" DECIMAL(10,2) NOT NULL,
    "price_yearly" DECIMAL(10,2) NOT NULL,
    "features" JSONB NOT NULL DEFAULT '[]',
    "max_users" INTEGER NOT NULL DEFAULT 1,
    "max_storage_gb" INTEGER NOT NULL DEFAULT 1,
    "is_popular" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(name)
);

-- Create company_subscriptions table
CREATE TABLE IF NOT EXISTS "public"."company_subscriptions" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "company_id" UUID NOT NULL REFERENCES companies(id),
    "subscription_tier_id" UUID NOT NULL REFERENCES subscription_tiers(id),
    "status" subscription_status NOT NULL DEFAULT 'pending',
    "billing_period" billing_period NOT NULL DEFAULT 'monthly',
    "current_period_start" TIMESTAMP WITH TIME ZONE NOT NULL,
    "current_period_end" TIMESTAMP WITH TIME ZONE NOT NULL,
    "cancel_at_period_end" BOOLEAN NOT NULL DEFAULT false,
    "payment_method_id" TEXT,
    "stripe_subscription_id" TEXT,
    "stripe_customer_id" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(company_id)
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
CREATE INDEX IF NOT EXISTS "idx_company_subscriptions_company_id" ON "public"."company_subscriptions"("company_id");
CREATE INDEX IF NOT EXISTS "idx_company_subscriptions_tier_id" ON "public"."company_subscriptions"("subscription_tier_id");
CREATE INDEX IF NOT EXISTS "idx_payments_company_id" ON "public"."payments"("company_id");
CREATE INDEX IF NOT EXISTS "idx_payments_subscription_id" ON "public"."payments"("subscription_id");

-- Add triggers
CREATE TRIGGER update_subscription_tiers_updated_at
    BEFORE UPDATE ON subscription_tiers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_subscriptions_updated_at
    BEFORE UPDATE ON company_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
