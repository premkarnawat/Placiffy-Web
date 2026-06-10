const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://wkgczwtnxrseiykcrzqj.supabase.co';
// Need the service role key to bypass RLS and create buckets if anon key doesn't have permissions, 
// BUT anon key might work if we have no RLS. However, creating buckets usually requires service_role key or proper policies.
// Since I don't have the service_role key, I'll try creating it with the anon key or check if I can just use a SQL RPC or do it via python with the service role key if it's in the env.

// Wait, the anon key is in lib/supabase.ts
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrZ2N6d3RueHJzZWl5a2NyenFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2NTYzMjIsImV4cCI6MjA5NjIzMjMyMn0.Lt60WiDbx0F5WsfXIzKX9p7dQ9CDvB7jJM-3yGt2L54';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fixBuckets() {
    console.log("Checking buckets...");
    const { data: buckets, error: getErr } = await supabase.storage.listBuckets();
    if (getErr) console.error("Error listing buckets:", getErr);
    console.log("Existing buckets via Storage API:", buckets?.map(b => b.name) || []);

    // Try to create via Storage API
    const { data, error } = await supabase.storage.createBucket('candidate_resumes', {
        public: true,
        allowedMimeTypes: ['application/pdf'],
        fileSizeLimit: 10485760 // 10MB
    });

    if (error) {
        console.error("Error creating candidate_resumes via API:", error.message);
    } else {
        console.log("Created candidate_resumes via API:", data);
    }
    
    const { data: data2, error: err2 } = await supabase.storage.createBucket('profile_photos', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        fileSizeLimit: 5242880 // 5MB
    });

    if (err2) {
        console.error("Error creating profile_photos via API:", err2.message);
    } else {
        console.log("Created profile_photos via API:", data2);
    }
}

fixBuckets();
