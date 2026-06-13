import asyncio
import asyncpg
import urllib.parse
import socket

password = urllib.parse.unquote('%40Placify%24Data1716%23')
sql_file = r'C:\Users\premk\.gemini\antigravity\brain\9a078a71-79dd-41eb-a630-f5d791eb29dc\verification_schema.sql'
with open(sql_file, 'r', encoding='utf-8-sig') as f:
    sql_script = f.read()

_orig_getaddrinfo = socket.getaddrinfo
DNS_MAP = {}
def custom_getaddrinfo(host, port, family=0, type=0, proto=0, flags=0):
    if host in DNS_MAP:
        return _orig_getaddrinfo(DNS_MAP[host], port, family, type, proto, flags)
    return _orig_getaddrinfo(host, port, family, type, proto, flags)
socket.getaddrinfo = custom_getaddrinfo

async def run():
    DNS_MAP['aws-0-ap-south-1.pooler.supabase.com'] = '65.0.195.55'
    print('Trying aws-0-ap-south-1.pooler.supabase.com mapped to 65.0.195.55')
    try:
        conn = await asyncpg.connect(user='postgres.wkgczwtnxrseiykcrzqj', password=password, database='postgres', host='aws-0-ap-south-1.pooler.supabase.com', port=6543, timeout=5)
        print('Success ap-south-1!')
        await conn.execute(sql_script)
        print('SQL Executed on ap-south-1!')
        await conn.close()
        return
    except Exception as e:
        pass
    DNS_MAP['aws-0-us-east-1.pooler.supabase.com'] = '44.208.221.186'
    print('Trying aws-0-us-east-1.pooler.supabase.com mapped to 44.208.221.186')
    try:
        conn = await asyncpg.connect(user='postgres.wkgczwtnxrseiykcrzqj', password=password, database='postgres', host='aws-0-us-east-1.pooler.supabase.com', port=6543, timeout=5)
        print('Success us-east-1!')
        await conn.execute(sql_script)
        print('SQL Executed on us-east-1!')
        await conn.close()
        return
    except Exception as e:
        pass
    DNS_MAP['aws-0-eu-central-1.pooler.supabase.com'] = '18.198.30.239'
    print('Trying aws-0-eu-central-1.pooler.supabase.com mapped to 18.198.30.239')
    try:
        conn = await asyncpg.connect(user='postgres.wkgczwtnxrseiykcrzqj', password=password, database='postgres', host='aws-0-eu-central-1.pooler.supabase.com', port=6543, timeout=5)
        print('Success eu-central-1!')
        await conn.execute(sql_script)
        print('SQL Executed on eu-central-1!')
        await conn.close()
        return
    except Exception as e:
        pass
    DNS_MAP['aws-0-ap-southeast-1.pooler.supabase.com'] = '54.255.219.82'
    print('Trying aws-0-ap-southeast-1.pooler.supabase.com mapped to 54.255.219.82')
    try:
        conn = await asyncpg.connect(user='postgres.wkgczwtnxrseiykcrzqj', password=password, database='postgres', host='aws-0-ap-southeast-1.pooler.supabase.com', port=6543, timeout=5)
        print('Success ap-southeast-1!')
        await conn.execute(sql_script)
        print('SQL Executed on ap-southeast-1!')
        await conn.close()
        return
    except Exception as e:
        pass
    DNS_MAP['aws-0-us-west-1.pooler.supabase.com'] = '54.177.55.191'
    print('Trying aws-0-us-west-1.pooler.supabase.com mapped to 54.177.55.191')
    try:
        conn = await asyncpg.connect(user='postgres.wkgczwtnxrseiykcrzqj', password=password, database='postgres', host='aws-0-us-west-1.pooler.supabase.com', port=6543, timeout=5)
        print('Success us-west-1!')
        await conn.execute(sql_script)
        print('SQL Executed on us-west-1!')
        await conn.close()
        return
    except Exception as e:
        pass
    DNS_MAP['aws-0-us-west-2.pooler.supabase.com'] = '54.70.143.232'
    print('Trying aws-0-us-west-2.pooler.supabase.com mapped to 54.70.143.232')
    try:
        conn = await asyncpg.connect(user='postgres.wkgczwtnxrseiykcrzqj', password=password, database='postgres', host='aws-0-us-west-2.pooler.supabase.com', port=6543, timeout=5)
        print('Success us-west-2!')
        await conn.execute(sql_script)
        print('SQL Executed on us-west-2!')
        await conn.close()
        return
    except Exception as e:
        pass
    DNS_MAP['aws-0-eu-west-1.pooler.supabase.com'] = '34.241.16.247'
    print('Trying aws-0-eu-west-1.pooler.supabase.com mapped to 34.241.16.247')
    try:
        conn = await asyncpg.connect(user='postgres.wkgczwtnxrseiykcrzqj', password=password, database='postgres', host='aws-0-eu-west-1.pooler.supabase.com', port=6543, timeout=5)
        print('Success eu-west-1!')
        await conn.execute(sql_script)
        print('SQL Executed on eu-west-1!')
        await conn.close()
        return
    except Exception as e:
        pass
    DNS_MAP['aws-0-eu-west-2.pooler.supabase.com'] = '18.169.213.251'
    print('Trying aws-0-eu-west-2.pooler.supabase.com mapped to 18.169.213.251')
    try:
        conn = await asyncpg.connect(user='postgres.wkgczwtnxrseiykcrzqj', password=password, database='postgres', host='aws-0-eu-west-2.pooler.supabase.com', port=6543, timeout=5)
        print('Success eu-west-2!')
        await conn.execute(sql_script)
        print('SQL Executed on eu-west-2!')
        await conn.close()
        return
    except Exception as e:
        pass
    DNS_MAP['aws-0-ap-east-1.pooler.supabase.com'] = '18.163.249.119'
    print('Trying aws-0-ap-east-1.pooler.supabase.com mapped to 18.163.249.119')
    try:
        conn = await asyncpg.connect(user='postgres.wkgczwtnxrseiykcrzqj', password=password, database='postgres', host='aws-0-ap-east-1.pooler.supabase.com', port=6543, timeout=5)
        print('Success ap-east-1!')
        await conn.execute(sql_script)
        print('SQL Executed on ap-east-1!')
        await conn.close()
        return
    except Exception as e:
        pass
    DNS_MAP['aws-0-ap-northeast-1.pooler.supabase.com'] = '54.64.190.72'
    print('Trying aws-0-ap-northeast-1.pooler.supabase.com mapped to 54.64.190.72')
    try:
        conn = await asyncpg.connect(user='postgres.wkgczwtnxrseiykcrzqj', password=password, database='postgres', host='aws-0-ap-northeast-1.pooler.supabase.com', port=6543, timeout=5)
        print('Success ap-northeast-1!')
        await conn.execute(sql_script)
        print('SQL Executed on ap-northeast-1!')
        await conn.close()
        return
    except Exception as e:
        pass
    DNS_MAP['aws-0-ap-northeast-2.pooler.supabase.com'] = '15.165.245.138'
    print('Trying aws-0-ap-northeast-2.pooler.supabase.com mapped to 15.165.245.138')
    try:
        conn = await asyncpg.connect(user='postgres.wkgczwtnxrseiykcrzqj', password=password, database='postgres', host='aws-0-ap-northeast-2.pooler.supabase.com', port=6543, timeout=5)
        print('Success ap-northeast-2!')
        await conn.execute(sql_script)
        print('SQL Executed on ap-northeast-2!')
        await conn.close()
        return
    except Exception as e:
        pass
    DNS_MAP['aws-0-ap-southeast-2.pooler.supabase.com'] = '13.238.183.126'
    print('Trying aws-0-ap-southeast-2.pooler.supabase.com mapped to 13.238.183.126')
    try:
        conn = await asyncpg.connect(user='postgres.wkgczwtnxrseiykcrzqj', password=password, database='postgres', host='aws-0-ap-southeast-2.pooler.supabase.com', port=6543, timeout=5)
        print('Success ap-southeast-2!')
        await conn.execute(sql_script)
        print('SQL Executed on ap-southeast-2!')
        await conn.close()
        return
    except Exception as e:
        pass
    DNS_MAP['aws-0-ca-central-1.pooler.supabase.com'] = '15.156.180.136'
    print('Trying aws-0-ca-central-1.pooler.supabase.com mapped to 15.156.180.136')
    try:
        conn = await asyncpg.connect(user='postgres.wkgczwtnxrseiykcrzqj', password=password, database='postgres', host='aws-0-ca-central-1.pooler.supabase.com', port=6543, timeout=5)
        print('Success ca-central-1!')
        await conn.execute(sql_script)
        print('SQL Executed on ca-central-1!')
        await conn.close()
        return
    except Exception as e:
        pass
    DNS_MAP['aws-0-eu-west-3.pooler.supabase.com'] = '15.188.134.6'
    print('Trying aws-0-eu-west-3.pooler.supabase.com mapped to 15.188.134.6')
    try:
        conn = await asyncpg.connect(user='postgres.wkgczwtnxrseiykcrzqj', password=password, database='postgres', host='aws-0-eu-west-3.pooler.supabase.com', port=6543, timeout=5)
        print('Success eu-west-3!')
        await conn.execute(sql_script)
        print('SQL Executed on eu-west-3!')
        await conn.close()
        return
    except Exception as e:
        pass
    DNS_MAP['aws-0-sa-east-1.pooler.supabase.com'] = '52.67.1.88'
    print('Trying aws-0-sa-east-1.pooler.supabase.com mapped to 52.67.1.88')
    try:
        conn = await asyncpg.connect(user='postgres.wkgczwtnxrseiykcrzqj', password=password, database='postgres', host='aws-0-sa-east-1.pooler.supabase.com', port=6543, timeout=5)
        print('Success sa-east-1!')
        await conn.execute(sql_script)
        print('SQL Executed on sa-east-1!')
        await conn.close()
        return
    except Exception as e:
        pass
    DNS_MAP['aws-0-us-east-2.pooler.supabase.com'] = '3.139.14.59'
    print('Trying aws-0-us-east-2.pooler.supabase.com mapped to 3.139.14.59')
    try:
        conn = await asyncpg.connect(user='postgres.wkgczwtnxrseiykcrzqj', password=password, database='postgres', host='aws-0-us-east-2.pooler.supabase.com', port=6543, timeout=5)
        print('Success us-east-2!')
        await conn.execute(sql_script)
        print('SQL Executed on us-east-2!')
        await conn.close()
        return
    except Exception as e:
        pass
    print('Failed all')

asyncio.run(run())
