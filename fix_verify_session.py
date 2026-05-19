filepath = r"C:\Users\amyus\Documents\oasys-web\netlify\functions\verify-session.js"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

fixes = [
    (
        "process.env.SUPABASE_SERVICE_ROLE_KEY",
        "process.env.SUPABASE_SERVICE_KEY",
        "FIX 1: variable SUPABASE_SERVICE_ROLE_KEY → SUPABASE_SERVICE_KEY"
    ),
    (
        ".eq('plaza_number', plazaNumber)",
        ".eq('numero_plaza', plazaNumber)",
        "FIX 2: columna plaza_number → numero_plaza"
    ),
]

for old, new, label in fixes:
    if old in content:
        content = content.replace(old, new, 1)
        print(f"✅ {label}")
    else:
        print(f"⚠️  {label} — patrón no encontrado")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("\n✅ Archivo guardado. Ejecuta:")
print('   git add netlify/functions/verify-session.js')
print('   git commit -m "fix: verify-session env var + columna numero_plaza"')
print('   git push origin main')
