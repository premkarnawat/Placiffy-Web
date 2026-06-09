# -*- coding: utf-8 -*-
with open(r"backend\app\main.py", "r", encoding="utf-8") as f:
    content = f.read()

import re
match = re.search(r'@app\.post\("/api/company/register-custom".*?def register_company_custom.*?(?=@app\.post)', content, flags=re.DOTALL)
if match:
    print(match.group(0))
else:
    print("Not found")
