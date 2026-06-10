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

    # Let's check existing RLS policies for candidate_profiles
    cur.execute("""
        SELECT pol.polname, pol.polcmd, pol.polqual
        FROM pg_policy pol
        JOIN pg_class tbl ON pol.polrelid = tbl.oid
        WHERE tbl.relname = 'candidate_profiles';
    """)
    policies = cur.fetchall()
    print("Existing Policies for candidate_profiles:")
    for p in policies:
        print(p)

    # We need to ensure RLS is enabled and proper policies exist for candidates to update their own profiles
    # First, let's fix the candidate_profiles table to ensure user_id is properly linked or candidate_id is properly used.
    # The error was "violates row-level security policy". 
    # Usually, a policy looks like: 
    # CREATE POLICY "Users can manage their own profile" ON candidate_profiles FOR ALL USING (candidate_id IN (SELECT id FROM candidates WHERE user_id = auth.uid()));

    cur.close()
    conn.close()
except Exception as e:
    print("FAILED:", e)
