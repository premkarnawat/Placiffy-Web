import psycopg2

conn_str = "postgresql://postgres:%40Placify%24Data1716%23@db.wkgczwtnxrseiykcrzqj.supabase.co:5432/postgres"

with open(r"c:\Users\premk\.gemini\antigravity\brain\9a078a71-79dd-41eb-a630-f5d791eb29dc\database_resume_intelligence.sql", "r", encoding="utf-8-sig") as f:
    sql = f.read()

try:
    conn = psycopg2.connect(conn_str)
    cur = conn.cursor()
    
    print("Dropping old table if exists...")
    cur.execute("DROP TABLE IF EXISTS public.resume_intelligence_reports CASCADE;")
    
    print("Creating new table...")
    cur.execute(sql)
    
    print("Disabling RLS on new table...")
    cur.execute("ALTER TABLE public.resume_intelligence_reports DISABLE ROW LEVEL SECURITY;")
    
    conn.commit()
    print("Migration successful! New schema is applied.")
    
    cur.close()
    conn.close()
except Exception as e:
    print(e)
