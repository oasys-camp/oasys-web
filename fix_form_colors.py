with open('bsg/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Add scoped styles for #reserva light section
old_style_end = '/* PROBLEMA (dark) */'

new_styles = '''/* RESERVA (light) */
#reserva { background: #f9f7f2; }
#reserva h2 { color: #1a2820; }
#reserva .section-tag { color: #00967a; }
#reserva label { color: #3a4a42; font-family: "IBM Plex Mono", monospace; font-size: 11px; letter-spacing: 0.05em; }
#reserva input, #reserva select, #reserva textarea {
  background: #ffffff;
  border: 1px solid rgba(0,0,0,0.15);
  color: #1a2820;
  padding: 12px 14px;
  font-size: 15px;
  width: 100%;
  box-sizing: border-box;
  font-family: inherit;
  border-radius: 0;
  outline: none;
  transition: border-color 0.2s;
}
#reserva input:focus, #reserva select:focus, #reserva textarea:focus {
  border-color: #00967a;
}
#reserva input::placeholder, #reserva textarea::placeholder { color: #aaa; }
#reserva textarea { min-height: 100px; resize: vertical; }
#reserva .form-legal { font-size: 12px; color: #888; line-height: 1.6; margin-top: 16px; }
#reserva .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
#reserva .form-field { display: flex; flex-direction: column; gap: 6px; }
#reserva p { color: #5a7a6e; }
@media(max-width:600px) { #reserva .form-row { grid-template-columns: 1fr; } }

/* PROBLEMA (dark) */'''

if '/* PROBLEMA (dark) */' in content:
    content = content.replace(old_style_end, new_styles, 1)
    print("Styles OK")
else:
    print("ERROR: style anchor not found")

with open('bsg/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Colors fix OK")
