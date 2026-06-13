import asyncio
import asyncpg
import urllib.parse
import socket

password = urllib.parse.unquote("%40Placify%24Data1716%23")

_orig_getaddrinfo = socket.getaddrinfo
DNS_MAP = {}
def custom_getaddrinfo(host, port, family=0, type=0, proto=0, flags=0):
    if host in DNS_MAP:
        return _orig_getaddrinfo(DNS_MAP[host], port, family, type, proto, flags)
    return _orig_getaddrinfo(host, port, family, type, proto, flags)
socket.getaddrinfo = custom_getaddrinfo

async def run():
    domain = "aws-0-ap-south-1.pooler.supabase.com"
    ip = "65.0.195.55"
    DNS_MAP[domain] = ip
    try:
        conn = await asyncpg.connect(user='postgres.wkgczwtnxrseiykcrzqj', password=password, database='postgres', host=domain, port=6543, timeout=5)
        print("Success!")
        await conn.close()
    except Exception as e:
        print(f"Error for postgres.wkgczwtnxrseiykcrzqj: {type(e).__name__} - {e}")
        
    try:
        conn = await asyncpg.connect(user='postgres', password=password, database='postgres', host=domain, port=6543, timeout=5)
        print("Success!")
        await conn.close()
    except Exception as e:
        print(f"Error for postgres: {type(e).__name__} - {e}")

asyncio.run(run())
