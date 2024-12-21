-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create updated_at function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create auth schema if not exists
CREATE SCHEMA IF NOT EXISTS "auth";

-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing tables if they exist
DROP TABLE IF EXISTS "auth"."users" CASCADE;
DROP TABLE IF EXISTS "public"."companies" CASCADE;

-- Create companies table
CREATE TABLE "public"."companies" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "companies_name_key" UNIQUE ("name")
);

-- Create users table
CREATE TABLE "auth"."users" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "email" TEXT NOT NULL,
    "encrypted_password" TEXT NOT NULL,
    "company_id" UUID REFERENCES "public"."companies"("id"),
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "users_email_key" UNIQUE ("email")
);

-- Add indexes
CREATE INDEX IF NOT EXISTS "idx_users_company_id" ON "auth"."users"("company_id");

-- Add triggers
CREATE TRIGGER update_companies_updated_at
    BEFORE UPDATE ON "public"."companies"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON "auth"."users"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert initial data
DO $$
DECLARE
    v_company_id UUID;
BEGIN
    -- Insert demo company
    INSERT INTO "public"."companies" ("name")
    VALUES ('Safari CRM Demo Company')
    RETURNING "id" INTO v_company_id;

    -- Insert admin user
    INSERT INTO "auth"."users" ("email", "encrypted_password", "company_id")
    VALUES (
        'admin@safaricrm.com',
        crypt('admin123', gen_salt('bf')),
        v_company_id
    );
END
$$;
