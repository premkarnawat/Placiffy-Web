import asyncio
import asyncpg
import ssl
import urllib.parse

async def run():
    password = urllib.parse.unquote("%40Placify%24Data1716%23")
    host_ip = "65.0.195.55"  # ap-south-1 pooler IP
    domain = "aws-0-ap-south-1.pooler.supabase.com"
    
    # Create SSL context with SNI
    ssl_context = ssl.create_default_context()
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_NONE
    
    print(f"Connecting to {host_ip} with SNI {domain}...")
    try:
        # If we use server_hostname parameter, asyncpg passes it to SSL context for SNI!
        conn = await asyncpg.connect(
            user="postgres.wkgczwtnxrseiykcrzqj",
            password=password,
            database="postgres",
            host=host_ip,
            port=6543,
            ssl=ssl_context,
            server_hostname=domain,
            timeout=5
        )
        print("Success!")
        
        sql_file = r"C:\Users\premk\.gemini\antigravity\brain\9a078a71-79dd-41eb-a630-f5d791eb29dc\verification_schema.sql"
        with open(sql_file, "r", encoding="utf-8-sig") as f:
            sql_script = f.read()
            
        await conn.execute(sql_script)
        print("SQL Executed successfully!")
        
        await conn.close()
    except Exception as e:
        print(f"Error: {e}")

asyncio.run(run())
