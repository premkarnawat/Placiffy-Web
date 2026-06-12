import psycopg2
import os

db_url = "postgresql://postgres:%40Placify%24Data1716%23@db.wkgczwtnxrseiykcrzqj.supabase.co:5432/postgres"

def get_columns(table_name):
    try:
        conn = psycopg2.connect(db_url)
        cursor = conn.cursor()
        cursor.execute(f"SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '{table_name}';")
        cols = cursor.fetchall()
        return [f"{c[0]} ({c[1]})" for c in cols]
    except Exception as e:
        return [str(e)]
    finally:
        if 'cursor' in locals(): cursor.close()
        if 'conn' in locals(): conn.close()

tables = ['companies', 'company_profiles', 'candidates', 'candidate_profiles', 'users']

for t in tables:
    print(f"--- {t} ---")
    cols = get_columns(t)
    for c in cols:
        print(c)
    print("")

