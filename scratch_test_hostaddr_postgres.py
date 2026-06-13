import psycopg2
import urllib.parse

password = urllib.parse.unquote("%40Placify%24Data1716%23")

conn_str = f"host=aws-0-ap-south-1.pooler.supabase.com hostaddr=65.0.195.55 port=6543 user=postgres password={password} dbname=postgres sslmode=require connect_timeout=5"

try:
    conn = psycopg2.connect(conn_str)
    print("Connection successful via hostaddr with user=postgres!")
    
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

