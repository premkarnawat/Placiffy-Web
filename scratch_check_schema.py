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

    cur.execute("""
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name='candidate_profiles';
    """)
    cols = cur.fetchall()
    print("candidate_profiles schema:")
    for c in cols:
        print(c)

    cur.close()
    conn.close()
except Exception as e:
    print("FAILED:", e)
