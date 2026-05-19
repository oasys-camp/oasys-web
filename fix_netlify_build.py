path = r"C:\Users\amyus\Documents\oasys-web\netlify.toml"

with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Reemplazar [build] sin command por [build] con command
old = "[build]\n  functions = \"netlify/functions\"\n  publish = \".\""
new = "[build]\n  command = \"npm install\"\n  functions = \"netlify/functions\"\n  publish = \".\""

if "command" in content:
    print("command ya existe en netlify.toml — no se modifica.")
elif old in content:
    content = content.replace(old, new)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("✅ Build command añadido correctamente")
else:
    print("❌ No se encontró el bloque [build] esperado — revisar manualmente")
    print("Contenido actual:")
    print(content[:200])
