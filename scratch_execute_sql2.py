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

    new_profile_cols = {
        'current_job_role': 'TEXT',
        'industry': 'TEXT',
        'current_ctc': 'NUMERIC',
        'preferred_location': 'TEXT',
        'work_mode': 'TEXT', # Remote, Hybrid, Onsite
        'employment_type': 'TEXT' # Full Time, Part Time, etc.
    }
    
    for col, datatype in new_profile_cols.items():
        try:
            cur.execute(f"ALTER TABLE public.candidate_profiles ADD COLUMN {col} {datatype};")
            print(f"Added {col} to candidate_profiles")
        except psycopg2.errors.DuplicateColumn:
            print(f"{col} already exists in candidate_profiles")

    # candidates expansion
    new_candidate_cols = {
        'profile_completion_pct': 'INTEGER DEFAULT 0',
        'resume_parsed_at': 'TIMESTAMP WITH TIME ZONE'
    }
    for col, datatype in new_candidate_cols.items():
        try:
            cur.execute(f"ALTER TABLE public.candidates ADD COLUMN {col} {datatype};")
            print(f"Added {col} to candidates")
        except psycopg2.errors.DuplicateColumn:
            print(f"{col} already exists in candidates")

    cur.close()
    conn.close()
    print("\nPhase 1 (Schema Expansion completion) completed successfully!")
except Exception as e:
    print("FAILED:", e)
