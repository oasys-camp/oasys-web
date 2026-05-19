import re

filepath = r"C:\Users\amyus\Documents\oasys-web\bsg\index.html"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# --- FIX 1: Restaurar línea 1198 (flujo transferencia roto por Claude Code) ---
old = "if (selectedPaymentMethod === 'transfer') {\n    showError('Error al conectar con el servidor de pago. Inténtalo de nuevo.');"
new = "if (selectedPaymentMethod === 'transfer') {\n    showGraciasOverlay(formData);"

if old in content:
    content = content.replace(old, new, 1)
    print("✅ FIX 1: línea 1198 restaurada (transferencia OK)")
else:
    print("⚠️  FIX 1: patrón no encontrado — revisa manualmente línea 1198")

# --- FIX 2: Añadir función showError() si no existe ---
show_error_fn = """
function showError(msg) {
  var el = document.getElementById('form-error-msg');
  if (el) { el.textContent = msg; el.style.display = 'block'; }
  else { alert(msg); }
}
"""

if 'function showError' in content:
    print("ℹ️  FIX 2: showError() ya existe — no se añade de nuevo")
else:
    # Insertar antes del último </script>
    last_script = content.rfind('</script>')
    if last_script != -1:
        content = content[:last_script] + show_error_fn + content[last_script:]
        print("✅ FIX 2: función showError() añadida")
    else:
        print("❌ FIX 2: no se encontró </script> — archivo no modificado")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("\n✅ Archivo guardado. Ahora ejecuta en terminal:")
print('   git add bsg/index.html')
print('   git commit -m "fix: restaurar transferencia + añadir showError()"')
