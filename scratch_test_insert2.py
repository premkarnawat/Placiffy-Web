import psycopg2
import json

conn_str = "postgresql://postgres:%40Placify%24Data1716%23@db.wkgczwtnxrseiykcrzqj.supabase.co:5432/postgres"

try:
    conn = psycopg2.connect(conn_str)
    cur = conn.cursor()
    cur.execute("SELECT id FROM candidates LIMIT 1;")
    cand_id = cur.fetchone()[0]
    
    print(f"Testing insert for candidate: {cand_id}")
    
    insert_sql = """
    INSERT INTO public.resume_intelligence_reports (
        candidate_id, ats_resume_score, improvement_suggestions
    ) VALUES (
        %s, 85, %s
    )
    """
    cur.execute(insert_sql, (cand_id, json.dumps(["Test suggestion"])))
    conn.commit()
    print("Insert successful!")
    
    cur.execute("DELETE FROM public.resume_intelligence_reports WHERE candidate_id = %s", (cand_id,))
    conn.commit()
    
    cur.close()
    conn.close()
except Exception as e:
    print("Postgres Error:", e)
