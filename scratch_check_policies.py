import psycopg2
import os

db_url = "postgresql://postgres:%40Placify%24Data1716%23@db.wkgczwtnxrseiykcrzqj.supabase.co:5432/postgres"

try:
    conn = psycopg2.connect(db_url)
    cursor = conn.cursor()
    cursor.execute("""
        SELECT polname, polcmd, polroles, polqual, polwithcheck 
        FROM pg_policy 
        WHERE polrelid = 'conversations'::regclass OR polrelid = 'messages'::regclass OR polrelid = 'conversation_participants'::regclass;
    """)
    policies = cursor.fetchall()
    print("POLICIES:")
    for p in policies: print(p)

except Exception as e:
    print(f"Error: {e}")
finally:
    if 'cursor' in locals(): cursor.close()
    if 'conn' in locals(): conn.close()
