const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://wkgczwtnxrseiykcrzqj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrZ2N6d3RueHJzZWl5a2NyenFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2NTYzMjIsImV4cCI6MjA5NjIzMjMyMn0.Lt60WiDbx0F5WsfXIzKX9p7dQ9CDvB7jJM-3yGt2L54');

async function test() {
  const { data: candidates, error: candErr } = await supabase.from('candidates').select('*').limit(1);
  console.log('Candidates:', Object.keys(candidates?.[0] || {}), candErr);
  
  const { data: users, error: userErr } = await supabase.from('users').select('*').limit(1);
  console.log('Users:', Object.keys(users?.[0] || {}), userErr);
  
  const { data: profiles, error: profErr } = await supabase.from('candidate_profiles').select('*').limit(1);
  console.log('Candidate Profiles:', Object.keys(profiles?.[0] || {}), profErr);
  
  const { data: conv, error: convErr } = await supabase.from('conversations').select('*').limit(1);
  console.log('Conversations:', Object.keys(conv?.[0] || {}), convErr);
  
  const { data: msg, error: msgErr } = await supabase.from('messages').select('*').limit(1);
  console.log('Messages:', Object.keys(msg?.[0] || {}), msgErr);
}
test();
