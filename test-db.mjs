import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://rqbytrcoapgnnhzpfsts.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxYnl0cmNvYXBnbm5oenBmc3RzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3MjU3NzEsImV4cCI6MjA5MDMwMTc3MX0.3xLYLdGh0R3cxzgEUP86iB5TM-NjkB3uJgwrVJ3xF5U'
);

async function checkTables() {
  const { data, error } = await supabase.from('announcements').select('*').limit(1);
  console.log('Announcements:', data, error);
}

checkTables();
