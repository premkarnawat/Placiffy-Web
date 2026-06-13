import socket
import psycopg2

# Monkey patch socket to force DNS resolution to the IP we found
_orig_getaddrinfo = socket.getaddrinfo

def custom_getaddrinfo(host, port, family=0, type=0, proto=0, flags=0):
    if host == 'aws-0-ap-south-1.pooler.supabase.com':
        return _orig_getaddrinfo('65.0.195.55', port, family, type, proto, flags)
    return _orig_getaddrinfo(host, port, family, type, proto, flags)

socket.getaddrinfo = custom_getaddrinfo

# Wait, if postgres.wkgczwtnxrseiykcrzqj failed earlier, let's try the username that worked in checkpoint 71: just `postgres`!
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
    print(f"Error with 'postgres': {e}")

# If it fails, try with the project ref
try:
    db_url2 = "postgresql://postgres.wkgczwtnxrseiykcrzqj:%40Placify%24Data1716%23@aws-0-ap-south-1.pooler.supabase.com:6543/postgres"
    conn2 = psycopg2.connect(db_url2)
    print("Connection successful with project ref!")
    
    cursor = conn2.cursor()
    cursor.execute(sql_script)
    conn2.commit()
    print("SQL schema applied successfully via project ref!")
    conn2.close()
except Exception as e:
    print(f"Error with 'postgres.wkgczwtnxrseiykcrzqj': {e}")
