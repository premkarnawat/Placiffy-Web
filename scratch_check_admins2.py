import psycopg2
import os

db_url = "postgresql://postgres:%40Placify%24Data1716%23@db.wkgczwtnxrseiykcrzqj.supabase.co:5432/postgres"

try:
    conn = psycopg2.connect(db_url)
    cursor = conn.cursor()
    cursor.execute("SELECT email, raw_user_meta_data->>'role', id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin';")
    admins = cursor.fetchall()
    print("ADMINS IN AUTH.USERS:")
    for a in admins: print(a)
    
    cursor.execute("SELECT email, role, id FROM public.users WHERE role = 'admin';")
    pub_admins = cursor.fetchall()
    print("ADMINS IN PUBLIC.USERS:")
    for a in pub_admins: print(a)
    
except Exception as e:
    print(f"Error: {e}")
finally:
    if 'cursor' in locals(): cursor.close()
    if 'conn' in locals(): conn.close()
