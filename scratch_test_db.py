import psycopg2

db_url = "postgresql://postgres:%40Placify%24Data1716%23@aws-0-ap-south-1.pooler.supabase.com:6543/postgres"

try:
    conn = psycopg2.connect(db_url)
    print("Connection successful to direct pooler URL")
    conn.close()
except Exception as e:
    print(f"Error: {e}")

db_url2 = "postgresql://postgres:%40Placify%24Data1716%23@db.wkgczwtnxrseiykcrzqj.supabase.co:5432/postgres"

try:
    conn2 = psycopg2.connect(db_url2)
    print("Connection successful to primary db URL")
    conn2.close()
except Exception as e:
    print(f"Error 2: {e}")
