# OASYS · SETUP CLAUDE CODE
# Ejecutar desde: C:\Users\amyus\Desktop\amyuste\el oasys\
# ─────────────────────────────────────────────────────────

# ── 1. VERIFICAR VERSIONES ──────────────────────────────
echo "=== Verificando entorno ==="
node --version        # necesario: v18+
npm --version         # necesario: v9+
git --version         # necesario: v2.40+

# ── 2. SI NODE ES VIEJO — actualizar via winget ─────────
# winget install OpenJS.NodeJS.LTS
# (cerrar y reabrir terminal después)

# ── 3. CLONAR O SINCRONIZAR EL REPO ────────────────────
cd "C:\Users\amyus\Desktop\amyuste\el oasys"

# Si aún no tienes el repo clonado:
# git clone https://github.com/oasys-camp/oasys-web.git

# Si ya lo tienes:
cd oasys-web
git pull origin main

# ── 4. CREAR ESTRUCTURA DE FUNCIONES ───────────────────
mkdir -p netlify/functions

# ── 5. COPIAR LOS ARCHIVOS GENERADOS ───────────────────
# Copiar desde las descargas a la estructura correcta:
# - oasys-earth-login.html → oasys-web/index.html  (renombrar)
# - netlify.toml           → oasys-web/netlify.toml
# - chat.js                → oasys-web/netlify/functions/chat.js
# - telemetry.js           → oasys-web/netlify/functions/telemetry.js

# ── 6. VERIFICAR ESTRUCTURA FINAL ──────────────────────
# oasys-web/
# ├── index.html
# ├── netlify.toml
# └── netlify/
#     └── functions/
#         ├── chat.js
#         └── telemetry.js

# ── 7. INSTALAR NETLIFY CLI (para test local) ───────────
npm install -g netlify-cli
netlify --version

# ── 8. PROBAR EN LOCAL ANTES DE PUBLICAR ───────────────
netlify dev
# Abre http://localhost:8888 — funciona igual que producción
# Las funciones estarán en http://localhost:8888/api/chat

# ── 9. CONFIGURAR API KEY EN NETLIFY ───────────────────
# En Netlify dashboard:
# Site > Environment variables > Add variable
# Key:   ANTHROPIC_API_KEY
# Value: sk-ant-... (tu key)
# Scope: Functions

# ── 10. DEPLOY ─────────────────────────────────────────
git add .
git commit -m "feat: oasys.earth LOGIN:HUMANS + chat function + telemetry"
git push origin main
# Netlify detecta el push y despliega automáticamente

# ── LOG ────────────────────────────────────────────────
# Actualizar vault/04_LOGS/$(date +%Y-%m-%d).md con:
# Tarea: Deploy oasys.earth
# Archivos: index.html, netlify.toml, netlify/functions/chat.js, telemetry.js
# Estado: completado
# Notas: API key en env vars Netlify, no en código
