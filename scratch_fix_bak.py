with open(r"backend\app\main.py.bak", "r", encoding="utf-8") as f:
    content = f.read()

# The error was:
# text += page.extract_text() + "
# "

# Let's just fix it by replacing the literal newline inside the quotes!
new_content = content.replace('text += page.extract_text() + "\n"', 'text += page.extract_text() + "\\n"')

with open(r"backend\app\main.py", "w", encoding="utf-8") as f:
    f.write(new_content)
