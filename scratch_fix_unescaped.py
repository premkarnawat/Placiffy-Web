# -*- coding: utf-8 -*-
import os

def fix_unescaped(filepath):
    if not os.path.exists(filepath): return
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    original = content
    content = content.replace("haven't", "haven&apos;t")
    content = content.replace("Here's", "Here&apos;s")
    content = content.replace("don't", "don&apos;t")
    content = content.replace("It's", "It&apos;s")
    content = content.replace("it's", "it&apos;s")
    content = content.replace("Let's", "Let&apos;s")
    content = content.replace("that's", "that&apos;s")
    content = content.replace("That's", "That&apos;s")
    content = content.replace("You're", "You&apos;re")
    content = content.replace("you're", "you&apos;re")
    content = content.replace("We're", "We&apos;re")
    content = content.replace("we're", "we&apos;re")

    if content != original:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Fixed unescaped entities in: {filepath}")

for root, dirs, files in os.walk("app"):
    for file in files:
        if file.endswith(".tsx") or file.endswith(".ts"):
            fix_unescaped(os.path.join(root, file))

for root, dirs, files in os.walk("components"):
    for file in files:
        if file.endswith(".tsx") or file.endswith(".ts"):
            fix_unescaped(os.path.join(root, file))
