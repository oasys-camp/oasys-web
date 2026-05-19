filepath = r"C:\Users\amyus\Documents\oasys-web\netlify.toml"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Reemplazar la línea CSP completa
old = "    Content-Security-Policy = \"default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://checkout.stripe.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/; frame-src 'self' https://js.stripe.com https://checkout.stripe.com https://www.google.com/recaptcha/; connect-src 'self' https://api.stripe.com https://checkout.stripe.com https://www.google.com/recaptcha/ /.netlify/functions/;\""

new_csp = "    Content-Security-Policy = \"default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://checkout.stripe.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://www.googletagmanager.com; frame-src 'self' https://js.stripe.com https://checkout.stripe.com https://hooks.stripe.com https://www.google.com/recaptcha/; connect-src 'self' https://api.stripe.com https://checkout.stripe.com https://www.google.com/recaptcha/ https://fonts.googleapis.com https://fonts.gstatic.com /.netlify/functions/; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;\""

if old in content:
    content = content.replace(old, new_csp, 1)
    print("✅ FIX: CSP actualizado con permisos completos para Stripe")
else:
    # Intentar buscar cualquier línea CSP existente
    import re
    pattern = r"    Content-Security-Policy = \"[^\"]+\""
    if re.search(pattern, content):
        content = re.sub(pattern, new_csp, content, count=1)
        print("✅ FIX: CSP encontrado y reemplazado")
    else:
        # Añadir la sección headers completa si no existe
        headers_block = """
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
""" + "    " + new_csp.strip()
        content += headers_block
        print("✅ FIX: sección headers añadida al final")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("\n✅ Archivo guardado. Ejecuta:")
print("   git add netlify.toml")
print('   git commit -m "fix: CSP completo para Stripe y Google Fonts"')
print("   git push origin main")
