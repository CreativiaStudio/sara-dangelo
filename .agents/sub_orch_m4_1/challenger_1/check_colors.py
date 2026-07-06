import os
import re
import sys

def search_files(directory, patterns):
    findings = []
    for root, _, files in os.walk(directory):
        for file in files:
            if not file.endswith(('.tsx', '.ts', '.css')):
                continue
            path = os.path.join(root, file)
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    lines = f.readlines()
                    for i, line in enumerate(lines):
                        for pattern in patterns:
                            if re.search(pattern, line, re.IGNORECASE):
                                findings.append({
                                    'file': path,
                                    'line': i + 1,
                                    'content': line.strip(),
                                    'pattern': pattern
                                })
            except Exception as e:
                print(f"Error reading {path}: {e}")
    return findings

directories = [
    r"c:\Users\mario\Progetti Antigravity\sara-dangelo\app",
    r"c:\Users\mario\Progetti Antigravity\sara-dangelo\components"
]

patterns = [
    r'black',
    r'#2A2A2A',
    r'#000000',
    r'#000\b',
    r'rgba\(\s*0\s*,\s*0\s*,\s*0'
]

all_findings = []
for d in directories:
    all_findings.extend(search_files(d, patterns))

if all_findings:
    print("FOUND BANNED COLORS:")
    for f in all_findings:
        print(f"{f['file']}:{f['line']} ({f['pattern']}) - {f['content']}")
    sys.exit(1)
else:
    print("No banned colors found.")
    sys.exit(0)
