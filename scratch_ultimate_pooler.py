import psycopg2
import urllib.parse
password = urllib.parse.unquote('%40Placify%24Data1716%23')
sql_file = r'C:\Users\premk\.gemini\antigravity\brain\9a078a71-79dd-41eb-a630-f5d791eb29dc\verification_schema.sql'
with open(sql_file, 'r', encoding='utf-8-sig') as f:
    sql_script = f.read()

print('Trying aws-0-ap-south-1.pooler.supabase.com at 65.0.195.55')
try:
    conn = psycopg2.connect(f'host=aws-0-ap-south-1.pooler.supabase.com hostaddr=65.0.195.55 port=6543 user=postgres.wkgczwtnxrseiykcrzqj password={password} dbname=postgres sslmode=require', connect_timeout=5)
    print('Success ap-south-1!')
    cursor = conn.cursor()
    cursor.execute(sql_script)
    conn.commit()
    print('SQL Executed on ap-south-1!')
    conn.close()
    exit(0)
except Exception as e:
    pass
print('Trying aws-0-us-east-1.pooler.supabase.com at 44.216.29.125')
try:
    conn = psycopg2.connect(f'host=aws-0-us-east-1.pooler.supabase.com hostaddr=44.216.29.125 port=6543 user=postgres.wkgczwtnxrseiykcrzqj password={password} dbname=postgres sslmode=require', connect_timeout=5)
    print('Success us-east-1!')
    cursor = conn.cursor()
    cursor.execute(sql_script)
    conn.commit()
    print('SQL Executed on us-east-1!')
    conn.close()
    exit(0)
except Exception as e:
    pass
print('Trying aws-0-eu-central-1.pooler.supabase.com at 18.198.30.239')
try:
    conn = psycopg2.connect(f'host=aws-0-eu-central-1.pooler.supabase.com hostaddr=18.198.30.239 port=6543 user=postgres.wkgczwtnxrseiykcrzqj password={password} dbname=postgres sslmode=require', connect_timeout=5)
    print('Success eu-central-1!')
    cursor = conn.cursor()
    cursor.execute(sql_script)
    conn.commit()
    print('SQL Executed on eu-central-1!')
    conn.close()
    exit(0)
except Exception as e:
    pass
print('Trying aws-0-ap-southeast-1.pooler.supabase.com at 54.255.219.82')
try:
    conn = psycopg2.connect(f'host=aws-0-ap-southeast-1.pooler.supabase.com hostaddr=54.255.219.82 port=6543 user=postgres.wkgczwtnxrseiykcrzqj password={password} dbname=postgres sslmode=require', connect_timeout=5)
    print('Success ap-southeast-1!')
    cursor = conn.cursor()
    cursor.execute(sql_script)
    conn.commit()
    print('SQL Executed on ap-southeast-1!')
    conn.close()
    exit(0)
except Exception as e:
    pass
print('Trying aws-0-us-west-1.pooler.supabase.com at 54.177.55.191')
try:
    conn = psycopg2.connect(f'host=aws-0-us-west-1.pooler.supabase.com hostaddr=54.177.55.191 port=6543 user=postgres.wkgczwtnxrseiykcrzqj password={password} dbname=postgres sslmode=require', connect_timeout=5)
    print('Success us-west-1!')
    cursor = conn.cursor()
    cursor.execute(sql_script)
    conn.commit()
    print('SQL Executed on us-west-1!')
    conn.close()
    exit(0)
except Exception as e:
    pass
print('Trying aws-0-us-west-2.pooler.supabase.com at 54.70.143.232')
try:
    conn = psycopg2.connect(f'host=aws-0-us-west-2.pooler.supabase.com hostaddr=54.70.143.232 port=6543 user=postgres.wkgczwtnxrseiykcrzqj password={password} dbname=postgres sslmode=require', connect_timeout=5)
    print('Success us-west-2!')
    cursor = conn.cursor()
    cursor.execute(sql_script)
    conn.commit()
    print('SQL Executed on us-west-2!')
    conn.close()
    exit(0)
except Exception as e:
    pass
print('Trying aws-0-eu-west-1.pooler.supabase.com at 108.128.216.176')
try:
    conn = psycopg2.connect(f'host=aws-0-eu-west-1.pooler.supabase.com hostaddr=108.128.216.176 port=6543 user=postgres.wkgczwtnxrseiykcrzqj password={password} dbname=postgres sslmode=require', connect_timeout=5)
    print('Success eu-west-1!')
    cursor = conn.cursor()
    cursor.execute(sql_script)
    conn.commit()
    print('SQL Executed on eu-west-1!')
    conn.close()
    exit(0)
except Exception as e:
    pass
print('Trying aws-0-eu-west-2.pooler.supabase.com at 18.169.213.251')
try:
    conn = psycopg2.connect(f'host=aws-0-eu-west-2.pooler.supabase.com hostaddr=18.169.213.251 port=6543 user=postgres.wkgczwtnxrseiykcrzqj password={password} dbname=postgres sslmode=require', connect_timeout=5)
    print('Success eu-west-2!')
    cursor = conn.cursor()
    cursor.execute(sql_script)
    conn.commit()
    print('SQL Executed on eu-west-2!')
    conn.close()
    exit(0)
except Exception as e:
    pass
print('Trying aws-0-ap-east-1.pooler.supabase.com at 18.163.249.119')
try:
    conn = psycopg2.connect(f'host=aws-0-ap-east-1.pooler.supabase.com hostaddr=18.163.249.119 port=6543 user=postgres.wkgczwtnxrseiykcrzqj password={password} dbname=postgres sslmode=require', connect_timeout=5)
    print('Success ap-east-1!')
    cursor = conn.cursor()
    cursor.execute(sql_script)
    conn.commit()
    print('SQL Executed on ap-east-1!')
    conn.close()
    exit(0)
except Exception as e:
    pass
print('Trying aws-0-ap-northeast-1.pooler.supabase.com at 35.79.125.133')
try:
    conn = psycopg2.connect(f'host=aws-0-ap-northeast-1.pooler.supabase.com hostaddr=35.79.125.133 port=6543 user=postgres.wkgczwtnxrseiykcrzqj password={password} dbname=postgres sslmode=require', connect_timeout=5)
    print('Success ap-northeast-1!')
    cursor = conn.cursor()
    cursor.execute(sql_script)
    conn.commit()
    print('SQL Executed on ap-northeast-1!')
    conn.close()
    exit(0)
except Exception as e:
    pass
print('Trying aws-0-ap-northeast-2.pooler.supabase.com at 15.164.120.176')
try:
    conn = psycopg2.connect(f'host=aws-0-ap-northeast-2.pooler.supabase.com hostaddr=15.164.120.176 port=6543 user=postgres.wkgczwtnxrseiykcrzqj password={password} dbname=postgres sslmode=require', connect_timeout=5)
    print('Success ap-northeast-2!')
    cursor = conn.cursor()
    cursor.execute(sql_script)
    conn.commit()
    print('SQL Executed on ap-northeast-2!')
    conn.close()
    exit(0)
except Exception as e:
    pass
print('Trying aws-0-ap-southeast-2.pooler.supabase.com at 3.106.102.114')
try:
    conn = psycopg2.connect(f'host=aws-0-ap-southeast-2.pooler.supabase.com hostaddr=3.106.102.114 port=6543 user=postgres.wkgczwtnxrseiykcrzqj password={password} dbname=postgres sslmode=require', connect_timeout=5)
    print('Success ap-southeast-2!')
    cursor = conn.cursor()
    cursor.execute(sql_script)
    conn.commit()
    print('SQL Executed on ap-southeast-2!')
    conn.close()
    exit(0)
except Exception as e:
    pass
print('Trying aws-0-ca-central-1.pooler.supabase.com at 15.156.114.158')
try:
    conn = psycopg2.connect(f'host=aws-0-ca-central-1.pooler.supabase.com hostaddr=15.156.114.158 port=6543 user=postgres.wkgczwtnxrseiykcrzqj password={password} dbname=postgres sslmode=require', connect_timeout=5)
    print('Success ca-central-1!')
    cursor = conn.cursor()
    cursor.execute(sql_script)
    conn.commit()
    print('SQL Executed on ca-central-1!')
    conn.close()
    exit(0)
except Exception as e:
    pass
print('Trying aws-0-eu-west-3.pooler.supabase.com at 13.39.9.193')
try:
    conn = psycopg2.connect(f'host=aws-0-eu-west-3.pooler.supabase.com hostaddr=13.39.9.193 port=6543 user=postgres.wkgczwtnxrseiykcrzqj password={password} dbname=postgres sslmode=require', connect_timeout=5)
    print('Success eu-west-3!')
    cursor = conn.cursor()
    cursor.execute(sql_script)
    conn.commit()
    print('SQL Executed on eu-west-3!')
    conn.close()
    exit(0)
except Exception as e:
    pass
print('Trying aws-0-sa-east-1.pooler.supabase.com at 52.67.1.88')
try:
    conn = psycopg2.connect(f'host=aws-0-sa-east-1.pooler.supabase.com hostaddr=52.67.1.88 port=6543 user=postgres.wkgczwtnxrseiykcrzqj password={password} dbname=postgres sslmode=require', connect_timeout=5)
    print('Success sa-east-1!')
    cursor = conn.cursor()
    cursor.execute(sql_script)
    conn.commit()
    print('SQL Executed on sa-east-1!')
    conn.close()
    exit(0)
except Exception as e:
    pass
print('Trying aws-0-us-east-2.pooler.supabase.com at 3.13.175.194')
try:
    conn = psycopg2.connect(f'host=aws-0-us-east-2.pooler.supabase.com hostaddr=3.13.175.194 port=6543 user=postgres.wkgczwtnxrseiykcrzqj password={password} dbname=postgres sslmode=require', connect_timeout=5)
    print('Success us-east-2!')
    cursor = conn.cursor()
    cursor.execute(sql_script)
    conn.commit()
    print('SQL Executed on us-east-2!')
    conn.close()
    exit(0)
except Exception as e:
    pass
print('Failed all')
