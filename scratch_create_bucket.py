import os
import psycopg2

SUPABASE_DB_URL = "postgresql://postgres.wkgczwtnxrseiykcrzqj:placify1234@aws-0-ap-south-1.pooler.supabase.com:6543/postgres"

sql = """
-- Create the resumes bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to resumes
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'resumes');

-- Allow authenticated users to upload resumes
CREATE POLICY "Auth Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'resumes');
"""

try:
    conn = psycopg2.connect(SUPABASE_DB_URL)
    conn.autocommit = True
    with conn.cursor() as cur:
        cur.execute(sql)
    print("Storage bucket 'resumes' created successfully.")
except Exception as e:
    print(f"Error: {e}")
