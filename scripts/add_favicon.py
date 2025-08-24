import os
import re

ROOT = r"c:\Users\Hp\Downloads\Exam-Prep100"
FAV_SNIPPET = "<!-- Favicon -->\n  <link rel=\"icon\" type=\"image/png\" href=\"/assets/images/Logo of JUANOVA Cortex Tutor.png\" />\n"
FAV_MARKER = '/assets/images/Logo of JUANOVA Cortex Tutor.png'

modified = []
skipped = []
errors = []

for dirpath, dirnames, filenames in os.walk(ROOT):
    for fn in filenames:
        if not fn.lower().endswith('.html'):
            continue
        path = os.path.join(dirpath, fn)
        try:
            with open(path, 'r', encoding='utf-8', errors='replace') as f:
                s = f.read()
        except Exception as e:
            errors.append((path, str(e)))
            continue
        if FAV_MARKER in s:
            skipped.append(path)
            continue
        m = re.search(r'<head[^>]*>', s, flags=re.IGNORECASE)
        if not m:
            # no <head> found, skip
            skipped.append(path)
            continue
        insert_at = m.end()
        new_s = s[:insert_at] + '\n  ' + FAV_SNIPPET + s[insert_at:]
        try:
            with open(path, 'w', encoding='utf-8') as f:
                f.write(new_s)
            modified.append(path)
        except Exception as e:
            errors.append((path, str(e)))

print('Modified files: %d' % len(modified))
for p in modified:
    print(p)
print('\nSkipped files (already had favicon or no <head>): %d' % len(skipped))
print('\nErrors: %d' % len(errors))
for p,e in errors:
    print('ERROR', p, e)
