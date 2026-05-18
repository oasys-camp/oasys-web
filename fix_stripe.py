import re

with open('bsg/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find and replace the setTimeout demo block
pattern = r'  // Simulate Stripe checkout \(replace with actual implementation\).*?  }, 1500\);\n\}'

new_code = """  var g = function(id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; };
  var formData = {
    nombre: g('nombre'), nif: g('nif'), domicilio: g('domicilio'),
    email: g('email'), telefono: g('telefono'), mascota: g('mascota'),
    especie_raza: g('especie_mascota'), especie_arbol: g('especie'),
    payment_method: selectedPaymentMethod
  };
  if (!formData.nombre || !formData.email || !formData.mascota || !formData.nif) {
    alert('Completa los campos obligatorios: nombre, email, NIF y mascota.');
    ctaButton.textContent = originalText;
    ctaButton.disabled = false;
    return;
  }
  fetch('/.netlify/functions/create-checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  })
  .then(function(res) { return res.json(); })
  .then(function(data) {
    if (data.url) { window.location.href = data.url; }
    else { throw new Error(data.error || 'Sin URL de checkout'); }
  })
  .catch(function(err) {
    console.error('Stripe error:', err);
    ctaButton.textContent = originalText;
    ctaButton.disabled = false;
    showGraciasOverlay(formData);
  });
}"""

result, count = re.subn(pattern, new_code, content, count=1, flags=re.DOTALL)

if count == 1:
    with open('bsg/index.html', 'w', encoding='utf-8') as f:
        f.write(result)
    print("OK - reemplazo exitoso")
else:
    print("ERROR - patron no encontrado")
