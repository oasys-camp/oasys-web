import re

path = r"C:\Users\amyus\Documents\oasys-web\netlify.toml"

with open(path, "r", encoding="utf-8") as f:
    content = f.read()

csp_block = """
[[headers]]
  for = "/*"
  [headers.values]
    Content-Security-Policy = "script-src 'self' 'unsafe-eval' https://js.stripe.com https://checkout.stripe.com; frame-src https://js.stripe.com https://checkout.stripe.com;"
"""

if "Content-Security-Policy" in content:
    print("CSP ya existe en netlify.toml — no se modifica.")
else:
    content += csp_block
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("✅ CSP añadido correctamente a netlify.toml")
