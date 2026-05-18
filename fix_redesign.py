import re

with open('bsg/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# ============================================================
# 1. REPLACE #transferencia + #reserva with unified section
# ============================================================

# Find start of #transferencia
start_marker = '<section id="transferencia">'
end_marker = '<!-- -- LEGAL (cream) -- -->'

idx_start = content.find(start_marker)
idx_end = content.find(end_marker)

if idx_start == -1 or idx_end == -1:
    print("ERROR: no se encontraron las secciones")
    exit(1)

new_section = '''<!-- -- RESERVA UNIFICADA -- -->
<section id="reserva">
  <div style="max-width:1100px;margin:0 auto;padding:0 24px;">

    <span class="section-tag" style="text-align:left;">Reserva tu plaza</span>
    <h2 style="font-size:clamp(28px,3.5vw,44px);font-weight:300;margin-bottom:12px;color:var(--ink);">
      Confirma tu lugar<br><em style="font-style:italic;color:var(--green);">en el bosque.</em>
    </h2>
    <p style="font-size:16px;color:var(--ink2);max-width:560px;margin-bottom:48px;line-height:1.7;">
      Rellena el formulario con los datos de tu mascota y elige cómo pagar. 
      Si hay plazas disponibles, tu reserva queda confirmada al instante.
    </p>

    <div class="form-grid">

      <!-- FORMULARIO -->
      <form id="semilla-form" method="post" name="semilla-reserva">
        <input type="hidden" name="form-name" value="semilla-reserva">
        <input type="text" name="bot-field" style="display:none">

        <div style="font-family:'IBM Plex Mono',monospace;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:var(--green);margin-bottom:20px;">TUS DATOS</div>

        <div class="form-row">
          <div class="form-field">
            <label for="nombre">Nombre completo *</label>
            <input type="text" id="nombre" name="nombre" placeholder="María García López" required>
          </div>
          <div class="form-field">
            <label for="nif">NIF / NIE *</label>
            <input type="text" id="nif" name="nif" placeholder="12345678A" required>
          </div>
        </div>
        <div class="form-field">
          <label for="domicilio">Domicilio fiscal * (calle, número, municipio, CP)</label>
          <input type="text" id="domicilio" name="domicilio" placeholder="Calle Mayor 1, 28001 Madrid" required>
        </div>
        <div class="form-row">
          <div class="form-field">
            <label for="email">Email *</label>
            <input type="email" id="email" name="email" placeholder="maria@email.com" required>
          </div>
          <div class="form-field">
            <label for="telefono">Teléfono</label>
            <input type="tel" id="telefono" name="telefono" placeholder="+34 600 000 000">
          </div>
        </div>

        <div style="font-family:'IBM Plex Mono',monospace;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:var(--green);margin:24px 0 20px;">TU MASCOTA</div>

        <div class="form-row">
          <div class="form-field">
            <label for="mascota">Nombre de tu mascota *</label>
            <input type="text" id="mascota" name="mascota" placeholder="El nombre que quedará en el Árbol" required>
          </div>
          <div class="form-field">
            <label for="especie_mascota">Especie / raza</label>
            <input type="text" id="especie_mascota" name="especie_mascota" placeholder="Labrador, gato persa...">
          </div>
        </div>
        <div class="form-row">
          <div class="form-field">
            <label for="peso">Peso aproximado (kg)</label>
            <input type="number" id="peso" name="peso" placeholder="Ej: 25" min="0" max="200">
          </div>
          <div class="form-field">
            <label for="especie">Árbol nominal preferido</label>
            <select id="especie" name="especie">
              <option value="">Sin preferencia</option>
              <option value="encina">Encina castellana</option>
              <option value="olivo">Olivo</option>
              <option value="almendro">Almendro</option>
            </select>
          </div>
        </div>
        <div class="form-field">
          <label for="mensaje">¿Quieres contarnos algo de tu mascota?</label>
          <textarea id="mensaje" name="mensaje" placeholder="Cuéntanos lo que quieras. Cada Árbol tiene su historia. Si tienes una foto especial, envíanosla por email a info@oasysbasecamp.com con el asunto 'HALL OF FAME + [nombre de tu mascota]' y la incluiremos en nuestra galería de Instagram."></textarea>
        </div>

        <div style="font-family:'IBM Plex Mono',monospace;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:var(--green);margin:24px 0 20px;">MÉTODO DE PAGO</div>

        <!-- TARJETA — opción principal -->
        <div id="pm-card-block" onclick="selectPaymentMethod('card')" style="display:flex;align-items:center;gap:16px;padding:18px 20px;border:1.5px solid rgba(0,150,122,0.5);background:rgba(0,150,122,0.04);cursor:pointer;margin-bottom:10px;transition:all 0.2s;">
          <div id="pr-card-dot" style="width:14px;height:14px;border:1.5px solid #00967a;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;">
            <div style="width:6px;height:6px;background:#00967a;border-radius:50%;"></div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00967a" stroke-width="1.5" style="flex-shrink:0;"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>
          <div style="flex:1;">
            <div style="font-family:'IBM Plex Mono',monospace;font-size:11px;color:var(--ink);letter-spacing:0.06em;">Tarjeta crédito/débito</div>
            <div style="font-family:'IBM Plex Mono',monospace;font-size:9px;color:#aaa;letter-spacing:0.1em;margin-top:2px;">VISA · MASTERCARD · AMEX · Pago instantáneo</div>
          </div>
          <span style="font-family:'IBM Plex Mono',monospace;font-size:9px;color:#00967a;letter-spacing:0.1em;background:rgba(0,150,122,0.08);padding:3px 8px;">RECOMENDADO</span>
        </div>

        <!-- TRANSFERENCIA — opción secundaria -->
        <div id="pm-transfer-block" onclick="selectPaymentMethod('transfer')" style="display:flex;align-items:center;gap:16px;padding:14px 20px;border:1px solid rgba(0,0,0,0.08);background:transparent;cursor:pointer;margin-bottom:24px;transition:all 0.2s;">
          <div id="pr-transfer-dot" style="width:14px;height:14px;border:1.5px solid #ccc;border-radius:50%;flex-shrink:0;"></div>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="#888" stroke-width="1.3" style="flex-shrink:0;"><path d="M10 2L17 6H3Z" stroke-linejoin="round"/><path d="M5 7v7M9 7v7M11 7v7M15 7v7"/><path d="M2 16h16" stroke-linecap="round" stroke-width="1.5"/></svg>
          <div style="flex:1;">
            <div style="font-family:'IBM Plex Mono',monospace;font-size:11px;color:#888;letter-spacing:0.06em;">Transferencia bancaria</div>
            <div style="font-family:'IBM Plex Mono',monospace;font-size:9px;color:#aaa;letter-spacing:0.1em;margin-top:2px;">Confirmación en 24–48h tras verificar ingreso</div>
          </div>
        </div>

        <!-- IBAN block — solo visible si transferencia seleccionada -->
        <div id="iban-block" style="display:none;background:#faf8f3;border:1px solid rgba(201,168,76,0.3);padding:20px 24px;margin-bottom:24px;">
          <div style="font-family:'IBM Plex Mono',monospace;font-size:9px;letter-spacing:0.25em;color:#6a4e10;margin-bottom:16px;">DATOS DE TRANSFERENCIA</div>
          <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(201,168,76,0.15);font-size:13px;">
            <span style="font-family:'IBM Plex Mono',monospace;font-size:9px;color:#888;">IBAN</span>
            <span style="font-family:'Share Tech Mono',monospace;font-size:12px;color:#6a4e10;">ES16 3081 0151 9650 0081 2750</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(201,168,76,0.15);font-size:13px;">
            <span style="font-family:'IBM Plex Mono',monospace;font-size:9px;color:#888;">Concepto</span>
            <span style="font-family:'Share Tech Mono',monospace;font-size:12px;color:#6a4e10;">SEMILLA + nombre de tu mascota</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:8px 0;font-size:13px;">
            <span style="font-family:'IBM Plex Mono',monospace;font-size:9px;color:#888;">Importe</span>
            <span style="font-family:'Share Tech Mono',monospace;font-size:12px;color:#6a4e10;">450,00 €</span>
          </div>
        </div>

        <!-- TOTAL + BOTÓN -->
        <div style="border-top:1px solid rgba(0,0,0,0.07);border-bottom:1px solid rgba(0,0,0,0.07);padding:14px 0;margin-bottom:20px;display:flex;justify-content:space-between;align-items:center;">
          <span style="font-family:'IBM Plex Mono',monospace;font-size:9px;color:#888;letter-spacing:0.2em;text-transform:uppercase;">Total plaza fundadora</span>
          <span style="font-family:'Orbitron',monospace;font-size:18px;color:var(--ink);font-weight:700;">450,00 €</span>
        </div>

        <button type="button" id="reserva-btn" onclick="handleReserva()" style="width:100%;padding:18px;background:var(--green);color:#fff;font-family:'IBM Plex Mono',monospace;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;border:none;cursor:pointer;transition:all 0.2s;">
          RESERVAR MI PLAZA · 450 €
        </button>

        <div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-top:12px;">
          <svg viewBox="0 0 20 20" fill="none" stroke="#aaa" stroke-width="1.5" width="13" height="13"><path d="M10 2L5 7v6l5 5 5-5V7z" stroke-linejoin="round"/><circle cx="10" cy="10" r="2.5"/></svg>
          <span style="font-family:'IBM Plex Mono',monospace;font-size:9px;color:#aaa;letter-spacing:0.1em;">PAGO SEGURO · SSL · 50 PLAZAS LIMITADAS</span>
        </div>

        <p class="form-legal">Al enviar confirmas la reserva de tu plaza fundadora en El Bosque Sagrado.<br>
          <strong style="color:#8a5a5a;">Este servicio es una reserva anticipada. No se aceptan solicitudes si el deceso de la mascota ya se ha producido.</strong><br>
          Dudas: <a href="mailto:info@oasysbasecamp.com" style="color:var(--green);">info@oasysbasecamp.com</a> · Política de privacidad disponible bajo solicitud.</p>

      </form>

      <!-- COLUMNA DERECHA — info lateral -->
      <div class="form-intro">
        <span class="section-tag">Pack Fundador</span>
        <h2>Tu plaza.<br><em>Para siempre.</em></h2>
        <p>50 plazas fundadoras a precio exclusivo de inicio de actividad. Cuando se agoten, el precio público será 3.500€.</p>
        <div style="margin:32px 0;padding:24px;background:rgba(0,212,170,0.04);border:1px solid rgba(0,212,170,0.15);">
          <div style="font-family:'IBM Plex Mono',monospace;font-size:9px;letter-spacing:0.2em;color:var(--green);margin-bottom:16px;">INCLUYE</div>
          <div style="display:flex;flex-direction:column;gap:10px;">
            <div style="font-family:'IBM Plex Mono',monospace;font-size:11px;color:var(--ink2);line-height:1.6;">✓ Integración Biológica de Origen certificada CE 1069/2009</div>
            <div style="font-family:'IBM Plex Mono',monospace;font-size:11px;color:var(--ink2);line-height:1.6;">✓ Árbol nominal en finca Yunclillos · Coordenadas GPS</div>
            <div style="font-family:'IBM Plex Mono',monospace;font-size:11px;color:var(--ink2);line-height:1.6;">✓ Placa grabada con nombre de tu mascota</div>
            <div style="font-family:'IBM Plex Mono',monospace;font-size:11px;color:var(--ink2);line-height:1.6;">✓ Expediente BSG numerado · Contrato de servicio</div>
            <div style="font-family:'IBM Plex Mono',monospace;font-size:11px;color:var(--ink2);line-height:1.6;">✓ Miel primera cosecha 250g · Edición numerada · 2027</div>
            <div style="font-family:'IBM Plex Mono',monospace;font-size:11px;color:var(--ink2);line-height:1.6;">✓ Acceso a visitas guiadas al Bosque</div>
          </div>
        </div>
        <p style="font-size:13px;color:var(--muted);">Dudas: <a href="mailto:info@oasysbasecamp.com" style="color:var(--green);">info@oasysbasecamp.com</a><br>WhatsApp: <a href="https://wa.me/34686411201" style="color:var(--green);">+34 686 411 201</a></p>
      </div>

    </div>
  </div>
</section>

'''

content = content[:idx_start] + new_section + content[idx_end:]

# ============================================================
# 2. UPDATE JS — replace selectedPaymentMethod logic
# ============================================================

old_js = "var selectedPaymentMethod = null;"
new_js = "var selectedPaymentMethod = 'card';"
content = content.replace(old_js, new_js, 1)

# Add new JS functions before </script>
old_script_end = "// Initialize first payment method as selected\ndocument.addEventListener('DOMContentLoaded', function() {\n  var firstMethod = document.getElementById('pm-card');\n  if (firstMethod) {\n    selectPaymentMethod(firstMethod, 'card');\n  }\n});"

new_script_end = """function selectPaymentMethod(method) {
  selectedPaymentMethod = method;
  var cardBlock = document.getElementById('pm-card-block');
  var transferBlock = document.getElementById('pm-transfer-block');
  var cardDot = document.getElementById('pr-card-dot');
  var transferDot = document.getElementById('pr-transfer-dot');
  var ibanBlock = document.getElementById('iban-block');
  var btn = document.getElementById('reserva-btn');

  if (method === 'card') {
    if (cardBlock) { cardBlock.style.border = '1.5px solid rgba(0,150,122,0.5)'; cardBlock.style.background = 'rgba(0,150,122,0.04)'; }
    if (transferBlock) { transferBlock.style.border = '1px solid rgba(0,0,0,0.08)'; transferBlock.style.background = 'transparent'; }
    if (cardDot) cardDot.innerHTML = '<div style="width:6px;height:6px;background:#00967a;border-radius:50%;"></div>';
    if (cardDot) cardDot.style.borderColor = '#00967a';
    if (transferDot) { transferDot.innerHTML = ''; transferDot.style.borderColor = '#ccc'; }
    if (ibanBlock) ibanBlock.style.display = 'none';
    if (btn) btn.textContent = 'PAGAR CON TARJETA · 450 €';
  } else {
    if (transferBlock) { transferBlock.style.border = '1.5px solid rgba(106,78,16,0.4)'; transferBlock.style.background = 'rgba(106,78,16,0.03)'; }
    if (cardBlock) { cardBlock.style.border = '1px solid rgba(0,0,0,0.08)'; cardBlock.style.background = 'transparent'; }
    if (transferDot) transferDot.innerHTML = '<div style="width:6px;height:6px;background:#6a4e10;border-radius:50%;margin:3px auto;"></div>';
    if (transferDot) transferDot.style.borderColor = '#6a4e10';
    if (cardDot) { cardDot.innerHTML = ''; cardDot.style.borderColor = '#ccc'; }
    if (ibanBlock) ibanBlock.style.display = 'block';
    if (btn) btn.textContent = 'RESERVAR · TRANSFERENCIA · 450 €';
  }
}

function handleReserva() {
  var g = function(id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; };
  var nombre = g('nombre'), nif = g('nif'), domicilio = g('domicilio'), email = g('email'), mascota = g('mascota');

  if (!nombre || !nif || !domicilio || !email || !mascota) {
    alert('Por favor completa los campos obligatorios: nombre, NIF, domicilio, email y nombre de tu mascota.');
    return;
  }

  var formData = {
    nombre: nombre, nif: nif, domicilio: domicilio,
    email: email, telefono: g('telefono'), mascota: mascota,
    especie_raza: g('especie_mascota'), especie_arbol: g('especie'),
    peso: g('peso'), mensaje: g('mensaje'),
    payment_method: selectedPaymentMethod
  };

  if (selectedPaymentMethod === 'transfer') {
    showGraciasOverlay(formData);
    return;
  }

  var btn = document.getElementById('reserva-btn');
  var originalText = btn.textContent;
  btn.textContent = 'Procesando...';
  btn.disabled = true;

  gtag('event', 'checkout_initiated', { event_category: 'Payment', event_label: 'card', value: 450.00, currency: 'EUR' });

  fetch('/.netlify/functions/create-checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  })
  .then(function(res) { return res.json(); })
  .then(function(data) {
    if (data.url) { window.location.href = data.url; }
    else { throw new Error(data.error || 'Sin URL'); }
  })
  .catch(function(err) {
    console.error('Stripe error:', err);
    btn.textContent = originalText;
    btn.disabled = false;
    showGraciasOverlay(formData);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  selectPaymentMethod('card');
});"""

if old_script_end in content:
    content = content.replace(old_script_end, new_script_end, 1)
    print("JS updated OK")
else:
    print("WARNING: JS init block not found - appending manually")
    content = content.replace('</script>', new_script_end + '\n</script>', 1)

with open('bsg/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Redesign OK")
