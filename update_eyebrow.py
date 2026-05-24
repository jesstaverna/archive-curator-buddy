import os
import re

directory = 'public'
files = [f for f in os.listdir(directory) if f.endswith('.html')]

old_class = 'class="eyebrow"'
new_class = 'class="eyebrow text-xs text-orange-500 font-medium"'

for filename in files:
    filepath = os.path.join(directory, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace class="eyebrow" with class="eyebrow text-xs text-orange-500 font-medium"
    # We use regex to handle potential extra spaces, though in this case it's likely exact
    updated_content = content.replace(old_class, new_class)
    
    if updated_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(updated_content)
        print(f"Updated {filename}")
    else:
        print(f"No changes for {filename}")
