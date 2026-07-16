import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
const supabase = createClient('https://jrdzsftxhhwaumhubzkf.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpyZHpzZnR4aGh3YXVtaHViemtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4OTEzNDksImV4cCI6MjA5MDQ2NzM0OX0.N4JZ9gvashKYdUbjiG4e4-PRhkxHX9Vci0Xz9X8xJKc')
async function run() {
  console.log("Fetching from old DB...")
  const res = await supabase.from('admin_users').select('*').limit(1)
  console.log(res)
}
run()
