import psycopg2

db_url = "postgresql://postgres:%40Placify%24Data1716%23@[2406:da14:311:1500:aebf:5ed0:cf91:3f33]:5432/postgres"

try:
    conn = psycopg2.connect(db_url)
    print("Connection successful via IPv6 literal!")
    conn.close()
except Exception as e:
    print(f"Error: {e}")
