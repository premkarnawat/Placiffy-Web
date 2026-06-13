import psycopg2
import os

password = "%40Placify%24Data1716%23"
project_ref = "wkgczwtnxrseiykcrzqj"
sql_file = r"C:\Users\premk\.gemini\antigravity\brain\9a078a71-79dd-41eb-a630-f5d791eb29dc\verification_schema.sql"

with open(sql_file, "r", encoding="utf-8") as f:
    sql_script = f.read()

regions = [
    "ap-south-1", "us-east-1", "eu-central-1", "ap-southeast-1", 
    "us-west-1", "us-west-2", "eu-west-1", "eu-west-2", "ap-east-1",
    "ap-northeast-1", "ap-northeast-2", "ap-southeast-2", "ca-central-1",
    "eu-south-1", "eu-west-3", "sa-east-1", "us-east-2"
]

connected = False

for region in regions:
    db_url = f"postgresql://postgres.{project_ref}:{password}@aws-0-{region}.pooler.supabase.com:6543/postgres"
    print(f"Trying {region}...")
    try:
        conn = psycopg2.connect(db_url, connect_timeout=5)
        print(f"Connected successfully to region: {region}!")
        connected = True
        
        cursor = conn.cursor()
        cursor.execute(sql_script)
        conn.commit()
        print("SQL script executed successfully!")
        
        cursor.close()
        conn.close()
        break
    except Exception as e:
        pass

if not connected:
    print("Failed to connect to any region.")
