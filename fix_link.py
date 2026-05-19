filepath = r"C:\Users\amyus\Documents\oasys-web\netlify\functions\create-checkout.js"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

old = "      customer_email: data.email,\n"
new = ""

if old in content:
    content = content.replace(old, new, 1)
    print("✅ FIX: customer_email eliminado — Stripe Link desactivado")
else:
    print("⚠️  Patrón no encontrado — revisa manualmente")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("\n✅ Archivo guardado. Ejecuta:")
print("   git add netlify/functions/create-checkout.js")
print('   git commit -m "fix: eliminar customer_email para desactivar Stripe Link"')
print("   git push origin main")
