with open(r"app\candidate\profile\edit\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()
    if "arrayBuffer" in content:
        print("ERROR: arrayBuffer is still in the file!")
    else:
        print("SUCCESS: arrayBuffer is completely gone!")
