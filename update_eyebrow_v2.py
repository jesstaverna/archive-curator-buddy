import os
import re

directory = 'public'
files = [f for f in os.listdir(directory) if f.endswith('.html')]

# This regex finds class="eyebrow" or class="eyebrow something"
# and ensures we don't double add the classes
pattern = re.compile(r'class="eyebrow(?!\s+text-xs\s+text-orange-500\s+font-medium)(?:\s+([^"]+))?"')

def replacement(match):
    other_classes = match.group(1)
    if other_classes:
        return f'class="eyebrow text-xs text-orange-500 font-medium {other_classes}"'
    else:
        return 'class="eyebrow text-xs text-orange-500 font-medium"'

for filename in files:
    filepath = os.path.join(directory, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    updated_content = pattern.sub(replacement, content)
    
    if updated_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(updated_content)
        print(f"Updated {filename}")
    else:
        print(f"No changes for {filename}")
