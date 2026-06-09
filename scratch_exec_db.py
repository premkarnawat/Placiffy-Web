import psycopg2
import sys

conn_str = "postgresql://postgres:@Placify$Data1716#@db.wkgczwtnxrseiykcrzqj.supabase.co:5432/postgres"
sql_file = r"C:\Users\premk\.gemini\antigravity\brain\9a078a71-79dd-41eb-a630-f5d791eb29dc\database_restructure.sql"

with open(sql_file, "r", encoding="utf-8") as f:
    sql = f.read()

try:
    conn = psycopg2.connect(conn_str)
    conn.autocommit = True
    cur = conn.cursor()
    cur.execute(sql)
    cur.close()
    conn.close()
    print("SUCCESS: Database perfectly restructured!")
except Exception as e:
    print("FAILED:", e)
