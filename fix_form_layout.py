with open('bsg/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add background color to #reserva section
old_section = '<section id="reserva">\n  <div style="max-width:1100px;margin:0 auto;padding:0 24px;">'
new_section = '<section id="reserva" style="background:#f9f7f2;">\n  <div style="max-width:780px;margin:0 auto;padding:0 24px;">'

if old_section in content:
    content = content.replace(old_section, new_section, 1)
    print("Section bg OK")
else:
    print("ERROR: section not found")

# 2. Remove form-grid wrapper and right column — keep only the form
old_grid_open = '    <div class="form-grid">\n\n      <!-- FORMULARIO -->'
new_grid_open = '    <!-- FORMULARIO -->'
content = content.replace(old_grid_open, new_grid_open, 1)

# Remove closing div of form-grid and right column
old_right = '''      <!-- COLUMNA DERECHA — info lateral -->
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
</section>'''

new_right = '''  </div>
</section>'''

if old_right in content:
    content = content.replace(old_right, new_right, 1)
    print("Right column removed OK")
else:
    print("ERROR: right column not found")

# 3. Fix form tag indentation (remove extra indent from form-grid)
content = content.replace('      <form id="semilla-form"', '    <form id="semilla-form"', 1)

with open('bsg/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Layout fix OK")
