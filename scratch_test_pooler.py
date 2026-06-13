import psycopg2

db_url = "postgresql://postgres.wkgczwtnxrseiykcrzqj:%40Placify%24Data1716%23@aws-0-ap-south-1.pooler.supabase.com:6543/postgres"

try:
    conn = psycopg2.connect(db_url)
    print("Connection successful to correctly formatted pooler URL!")
    conn.close()
except Exception as e:
    print(f"Error: {e}")
