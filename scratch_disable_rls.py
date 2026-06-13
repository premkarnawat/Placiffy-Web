import psycopg2

db_url = "postgresql://postgres:%40Placify%24Data1716%23@db.wkgczwtnxrseiykcrzqj.supabase.co:5432/postgres"

tables = ['jobs', 'candidates', 'companies', 'verifications', 'passports', 'conversations', 'messages', 'applications', 'candidate_education', 'candidate_experience', 'candidate_projects', 'candidate_certifications', 'users']

try:
    conn = psycopg2.connect(db_url)
    cursor = conn.cursor()
    for table in tables:
        cursor.execute(f"ALTER TABLE {table} DISABLE ROW LEVEL SECURITY;")
    conn.commit()
    print("RLS disabled on all core tables.")
except Exception as e:
    print(f"Error: {e}")
finally:
    if 'cursor' in locals(): cursor.close()
    if 'conn' in locals(): conn.close()
