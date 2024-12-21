-- Drop existing branch column if it exists
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'staff' AND column_name = 'branch') THEN
        ALTER TABLE staff DROP COLUMN branch;
    END IF;
END $$;

-- Add office_id column to staff table with explicit foreign key
DO $$ 
BEGIN 
    -- First drop the column if it exists (to handle potential reruns)
    IF EXISTS (SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'staff' AND column_name = 'office_id') THEN
        ALTER TABLE staff DROP COLUMN office_id;
    END IF;

    -- Add the column
    ALTER TABLE staff ADD COLUMN office_id uuid;

    -- Add the foreign key constraint with an explicit name
    ALTER TABLE staff 
    ADD CONSTRAINT fk_staff_office 
    FOREIGN KEY (office_id) 
    REFERENCES offices(id) 
    ON DELETE SET NULL;
END $$;

-- Add index for better query performance
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes 
                  WHERE tablename = 'staff' AND indexname = 'idx_staff_office_id') THEN
        CREATE INDEX idx_staff_office_id ON staff(office_id);
    END IF;
END $$;
