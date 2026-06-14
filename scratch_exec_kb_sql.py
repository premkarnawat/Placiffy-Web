import psycopg2

conn_str = "postgresql://postgres:%40Placify%24Data1716%23@db.wkgczwtnxrseiykcrzqj.supabase.co:5432/postgres"

with open(r"c:\Users\premk\.gemini\antigravity\brain\9a078a71-79dd-41eb-a630-f5d791eb29dc\database_knowledge_base.sql", "r", encoding="utf-8-sig") as f:
    sql = f.read()

try:
    conn = psycopg2.connect(conn_str)
    cur = conn.cursor()
    cur.execute(sql)
    conn.commit()
    print("Successfully created knowledge_base_articles and seeded data.")
    cur.close()
    conn.close()
except Exception as e:
    print(e)
