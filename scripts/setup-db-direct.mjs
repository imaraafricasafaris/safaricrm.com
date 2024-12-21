import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
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

async function executeQuery(query) {
  const response = await fetch(`${supabaseUrl}/rest/v1/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'X-Client-Info': 'supabase-js/2.39.0'
    },
    body: JSON.stringify({
      type: 'sql.execute',
      query: query
    })
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Error executing query:', error);
    throw new Error(error);
  }

  return await response.json();
}

async function setupDatabase() {
  try {
    // Read the migration SQL
    const sqlPath = path.join(dirname(__dirname), 'supabase', 'migrations', '20241220_init.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Split SQL statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    console.log(`Found ${statements.length} SQL statements to execute`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`Executing statement ${i + 1}/${statements.length}...`);
      console.log('Statement:', statement);
      
      try {
        await executeQuery(statement);
        console.log(`Statement ${i + 1} executed successfully`);
      } catch (error) {
        console.error(`Failed to execute statement ${i + 1}:`, error);
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
