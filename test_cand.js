const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://wkgczwtnxrseiykcrzqj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrZ2N6d3RueHJzZWl5a2NyenFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2NTYzMjIsImV4cCI6MjA5NjIzMjMyMn0.Lt60WiDbx0F5WsfXIzKX9p7dQ9CDvB7jJM-3yGt2L54');

async function test() {
  const { data, error } = await supabase.from('candidates').select('*').limit(2);
  console.log('Error:', error);
  console.log('Data:', data);
}
test();
