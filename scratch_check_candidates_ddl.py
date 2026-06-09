# -*- coding: utf-8 -*-
with open(r"C:\Users\premk\.gemini\antigravity\brain\9a078a71-79dd-41eb-a630-f5d791eb29dc\database_restructure.sql", "r", encoding="utf-8") as f:
    content = f.read()

import re
match = re.search(r'CREATE TABLE candidates \(.*?CREATE TABLE', content, flags=re.DOTALL)
if match:
    print(match.group(0))
