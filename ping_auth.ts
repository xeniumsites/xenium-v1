import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
const supabase = createClient('https://jrdzsftxhhwaumhubzkf.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpyZHpzZnR4aGh3YXVtaHViemtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4OTEzNDksImV4cCI6MjA5MDQ2NzM0OX0.N4JZ9gvashKYdUbjiG4e4-PRhkxHX9Vci0Xz9X8xJKc')

async function run() {
  const { data: { session } } = await supabase.auth.signInWithPassword({
    email: 'xeniumgifts@gmail.com',
    password: 'admin#1234'
  })
  
  if (!session) return console.log("Login failed");

  console.log("Invoking admin-orders list...");
  const { data, error } = await supabase.functions.invoke("admin-orders", {
    body: { action: "list", search: "Ramandeep" }
  })
  
  console.log("Error:", error?.message);
  console.log("Items returned:", data?.items?.length);
  if (data?.items?.length > 0) {
    console.log("First item:", data.items[0].short_code);
  }
}

run()
