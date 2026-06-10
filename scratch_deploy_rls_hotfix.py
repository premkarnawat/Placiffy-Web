import psycopg2

sql = """
-- 1. Add new fields to jobs table
ALTER TABLE jobs 
ADD COLUMN IF NOT EXISTS original_jd_url TEXT,
ADD COLUMN IF NOT EXISTS education_branch VARCHAR(255),
ADD COLUMN IF NOT EXISTS education_min_percentage INTEGER DEFAULT 0;

-- 2. Create 'jds' Storage Bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('jds', 'jds', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Enable RLS and add Policies for jobs table
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable all access for jobs" ON jobs;
CREATE POLICY "Enable all access for jobs" 
ON jobs FOR ALL 
USING (true) 
WITH CHECK (true);

-- 4. Enable RLS and add Policies for job_analysis table
ALTER TABLE job_analysis ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable all access for job_analysis" ON job_analysis;
CREATE POLICY "Enable all access for job_analysis" 
ON job_analysis FOR ALL 
USING (true) 
WITH CHECK (true);

-- 5. Enable Storage Policies for 'jds' bucket
DROP POLICY IF EXISTS "Public Access to JDs" ON storage.objects;
CREATE POLICY "Public Access to JDs" 
ON storage.objects FOR ALL 
USING (bucket_id = 'jds') 
WITH CHECK (bucket_id = 'jds');
"""

try:
    conn = psycopg2.connect(
        host="db.wkgczwtnxrseiykcrzqj.supabase.co",
        port=5432,
        user="postgres",
        password="@Placify$Data1716#",
        dbname="postgres"
    )
    cur = conn.cursor()
    cur.execute(sql)
    conn.commit()
    print("Database Migrations, Storage Buckets, and RLS Policies applied successfully!")
    cur.close()
    conn.close()
except Exception as e:
    print(f"Error: {e}")
