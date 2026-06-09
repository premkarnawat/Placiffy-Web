import psycopg2
import sys

sql_file = r"C:\Users\premk\.gemini\antigravity\brain\9a078a71-79dd-41eb-a630-f5d791eb29dc\database_restructure.sql"

with open(sql_file, "r", encoding="utf-8") as f:
    sql = f.read()

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
    cur.execute(sql)
    cur.close()
    conn.close()
    print("SUCCESS: Database perfectly restructured!")
except Exception as e:
    print("FAILED:", e)
