filepath = r"C:\Users\amyus\Documents\oasys-web\bsg\success.html"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

old = "fetch('/api/verify-session', {"
new = "fetch('/.netlify/functions/verify-session', {"

if old in content:
    content = content.replace(old, new, 1)
    print("✅ FIX: /api/verify-session → /.netlify/functions/verify-session")
else:
    print("⚠️  Patrón no encontrado — revisa manualmente")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("\n✅ Archivo guardado. Ejecuta:")
print('   git add bsg/success.html')
print('   git commit -m "fix: ruta correcta verify-session en success.html"')
print('   git push origin main')
