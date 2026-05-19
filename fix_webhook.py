filepath = r"C:\Users\amyus\Documents\oasys-web\netlify\functions\stripe-webhook.js"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

old = "      .eq('stripe_session_id', session.id)"
new = "      .eq('numero_plaza', parseInt(plazaNumber))"

if old in content:
    content = content.replace(old, new, 1)
    print("✅ FIX: webhook busca plaza por numero_plaza en lugar de stripe_session_id")
else:
    print("⚠️  Patrón no encontrado — revisa manualmente")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("\n✅ Archivo guardado. Ejecuta:")
print('   git add netlify/functions/stripe-webhook.js')
print('   git commit -m "fix: webhook busca plaza por numero_plaza"')
print('   git push origin main')
