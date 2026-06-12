import requests
import psycopg2
import time

url = 'https://wkgczwtnxrseiykcrzqj.supabase.co'
anon_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrZ2N6d3RueHJzZWl5a2NyenFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2NTYzMjIsImV4cCI6MjA5NjIzMjMyMn0.Lt60WiDbx0F5WsfXIzKX9p7dQ9CDvB7jJM-3yGt2L54'
db_url = "postgresql://postgres:%40Placify%24Data1716%23@db.wkgczwtnxrseiykcrzqj.supabase.co:5432/postgres"

email = "admin@placify.com"
password = "AdminPassword123!"

# 1. Sign up user
print("Signing up user via REST API...")
res = requests.post(
    f"{url}/auth/v1/signup",
    headers={"apikey": anon_key, "Content-Type": "application/json"},
    json={"email": email, "password": password, "data": {"role": "admin"}}
)
data = res.json()
print("Signup Response:", data)

user_id = data.get("user", {}).get("id")

if not user_id:
    # Try logging in to get the ID if already exists
    res = requests.post(
        f"{url}/auth/v1/token?grant_type=password",
        headers={"apikey": anon_key, "Content-Type": "application/json"},
        json={"email": email, "password": password}
    )
    data = res.json()
    user_id = data.get("user", {}).get("id")
    print("Login Response:", data)

if user_id:
    print(f"User ID: {user_id}")
    time.sleep(2) # Wait for triggers
    # 2. Update role in database
    print("Updating role in database...")
    try:
        conn = psycopg2.connect(db_url)
        conn.autocommit = True
        cursor = conn.cursor()
        
        # Make sure they are confirmed
        cursor.execute("UPDATE auth.users SET raw_user_meta_data = '{\"role\": \"admin\"}'::jsonb, email_confirmed_at = NOW() WHERE id = %s;", (user_id,))
        
        # Check if public.users exists
        cursor.execute("SELECT 1 FROM information_schema.tables WHERE table_name = 'users';")
        if cursor.fetchone():
            cursor.execute("UPDATE public.users SET role = 'admin' WHERE id = %s;", (user_id,))
            
        print("Success! Admin user initialized.")
    except Exception as e:
        print(f"DB Error: {e}")
    finally:
        if 'cursor' in locals(): cursor.close()
        if 'conn' in locals(): conn.close()
else:
    print("Failed to get user ID.")

