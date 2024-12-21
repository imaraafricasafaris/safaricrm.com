import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const supabaseUrl = 'https://fxnakumvpeiafmoxwjqi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4bmFrdW12cGVpYWZtb3h3anFpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzAzNTU3NywiZXhwIjoyMDQ4NjExNTc3fQ.NiCYLdaHknQ_lahsMcxkq564wRNJobhQ1YcQYZWMLOY';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function setupDatabase() {
  try {
    // Read the SQL file
    const sqlPath = path.join(dirname(__dirname), 'supabase', 'migrations', '20241220_init.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Split the SQL into individual statements
    const statements = sql
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);

    console.log(`Found ${statements.length} SQL statements to execute`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`Executing statement ${i + 1}/${statements.length}...`);
      
      try {
        const { data, error } = await supabase.rpc('exec_sql', { query: statement });
        if (error) {
          console.error('Error executing SQL:', error);
          console.error('Failed statement:', statement);
          throw error;
        }
        console.log(`Statement ${i + 1} executed successfully`);
      } catch (error) {
        console.error(`Failed to execute statement ${i + 1}:`, error);
        console.error('Statement:', statement);
        throw error;
      }
    }

    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase();
