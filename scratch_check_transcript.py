import os
import re
import json

transcript_path = r"C:\Users\premk\.gemini\antigravity\brain\9a078a71-79dd-41eb-a630-f5d791eb29dc\.system_generated\logs\transcript.jsonl"
if os.path.exists(transcript_path):
    with open(transcript_path, "r", encoding="utf-8") as f:
        for line in f:
            if "postgresql://" in line or "postgresql+asyncpg" in line or "SUPABASE_SERVICE_ROLE_KEY" in line or "postgres:" in line:
                try:
                    data = json.loads(line)
                    content = data.get("content", "")
                    if content and ("postgresql" in content or "postgres" in content):
                        print(f"Found in transcript step {data.get('step_index')}: {content[:150]}")
                except:
                    pass
