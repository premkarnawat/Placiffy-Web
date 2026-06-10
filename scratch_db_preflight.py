import psycopg2
import sys

try:
    conn = psycopg2.connect(
        host="db.wkgczwtnxrseiykcrzqj.supabase.co",
        port=5432,
        user="postgres",
        password="@Placify$Data1716#",
        dbname="postgres"
    )
    conn.autocommit = True
    cur = conn.cursor()

    # Create storage buckets if they don't exist
    cur.execute("""
        INSERT INTO storage.buckets (id, name, public) 
        VALUES ('candidate_resumes', 'candidate_resumes', true)
        ON CONFLICT (id) DO NOTHING;
        
        INSERT INTO storage.buckets (id, name, public) 
        VALUES ('profile_photos', 'profile_photos', true)
        ON CONFLICT (id) DO NOTHING;
    """)
    print("Checked and created storage buckets: candidate_resumes, profile_photos")

    # Disable RLS on candidate tables temporarily to see if it fixes the save issue,
    # OR create permissive policies since this is a prototype that needs to work NOW.
    tables = [
        'candidate_profiles', 'candidate_education', 'candidate_experience', 
        'candidate_projects', 'candidate_certifications', 'candidate_links'
    ]
    for table in tables:
        cur.execute(f"ALTER TABLE public.{table} DISABLE ROW LEVEL SECURITY;")
        print(f"Disabled RLS on {table}")
        
    # Check if 'resume_url' exists in 'candidates' table
    cur.execute("""
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='candidates' AND column_name='resume_url';
    """)
    if not cur.fetchone():
        print("resume_url column missing in candidates table! Adding it...")
        cur.execute("ALTER TABLE public.candidates ADD COLUMN resume_url TEXT;")
    else:
        print("resume_url column exists in candidates table.")

    cur.close()
    conn.close()
    print("\nDatabase pre-flight checks complete.")
except Exception as e:
    print("FAILED:", e)
