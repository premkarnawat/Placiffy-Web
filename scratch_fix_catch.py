# -*- coding: utf-8 -*-
import os

for root, _, files in os.walk("app"):
    for filename in files:
        if filename.endswith(".tsx"):
            filepath = os.path.join(root, filename)
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
            
            if "catch (error)" in content:
                content = content.replace("catch (error)", "catch (error: any)")
                with open(filepath, "w", encoding="utf-8") as f:
                    f.write(content)
                    print(f"Fixed catch (error) in {filepath}")

print("Fixed catch(error) TS errors globally!")
