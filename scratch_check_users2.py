import psycopg2

db_url = "postgresql://postgres:%40Placify%24Data1716%23@db.wkgczwtnxrseiykcrzqj.supabase.co:5432/postgres"

try:
    conn = psycopg2.connect(db_url)
    cursor = conn.cursor()
    cursor.execute("SELECT id, email, role FROM users LIMIT 5;")
    rows = cursor.fetchall()
    print("Users table:")
    for r in rows:
        print(r)
        
    cursor.execute("SELECT id, user_id, full_name FROM candidates LIMIT 5;")
    cands = cursor.fetchall()
    print("\nCandidates:")
    for c in cands:
        print(c)
        
    cursor.execute("SELECT id, user_id, name FROM companies LIMIT 5;")
    comps = cursor.fetchall()
    print("\nCompanies:")
    for c in comps:
        print(c)
except Exception as e:
    print(f"Error: {e}")
finally:
    if 'cursor' in locals(): cursor.close()
    if 'conn' in locals(): conn.close()
