import psycopg2

db_url = "postgresql://postgres:%40Placify%24Data1716%23@aws-0-ap-south-1.pooler.supabase.com:6543/postgres"

try:
    conn = psycopg2.connect(db_url)
    print("Connection successful!")
    
    sql_file = r"C:\Users\premk\.gemini\antigravity\brain\9a078a71-79dd-41eb-a630-f5d791eb29dc\verification_schema.sql"
    with open(sql_file, "r", encoding="utf-8-sig") as f:
        sql_script = f.read()
        
    cursor = conn.cursor()
    cursor.execute(sql_script)
    conn.commit()
    print("SQL schema applied successfully!")
    
    conn.close()
except Exception as e:
    print(f"Error: {e}")
