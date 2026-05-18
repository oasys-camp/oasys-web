# CLAUDE.md — Carpeta: oasys earth

**Rol:** Desarrollo e integración técnica de oasys.earth  
**Contexto:** Subcarpeta de `el oasys\` dedicada exclusivamente a oasys.earth

---

## ⚡ TAREA PRIORITARIA ACTIVA

**HAY UNA TAREA PRIORITARIA PENDIENTE.**

**ANTES DE HACER NADA:**
1. Lee **`TAREA_PRIORITARIA.md`** COMPLETO
2. Ejecuta SOLO lo que indica ese archivo
3. NO revises graveyard, skills, ni otras tareas hasta terminar

**Cuando termines la tarea prioritaria, borra este bloque.**

---

## 🎯 Objetivo de esta carpeta

Desarrollo de **oasys.earth** — la interfaz pública del proyecto OASYS.

**Stack técnico:**
- Globe.gl (globo terráqueo 3D)
- Partículas Three.js
- Chat AI con Claude API
- Sistema de autenticación por roles
- GeoJSON para datos biométricos

---

## 📁 Estructura de archivos

```
oasys earth/
├── index.html                      (archivo principal)
├── oasys-auth-system.js           (sistema de roles - NUEVO)
├── oasys-auth-styles.css          (estilos formulario - NUEVO)
├── oasys-login-form.html          (referencia HTML - NUEVO)
├── data/
│   └── oasys-biometricos.geojson
├── graveyard/                      (versiones anteriores)
└── ESTADO_SISTEMA.md              (doc técnica CesiumJS)
```

---

## 🚫 Reglas absolutas

1. **NO modifiques archivos fuera de `oasys earth/`**  
   Cerebro maestro vive en `OASYS_MASTER.html` (carpeta padre)

2. **NO toques el graveyard sin petición explícita**  
   Los archivos `.md` en graveyard son tombstones, no tareas pendientes

3. **Backup antes de cambios grandes**  
   Siempre crea `filename-backup-DDmonYYYY.html` antes de refactorizar

4. **Verifica sintaxis antes de guardar**  
   HTML/JS broken = sitio caído

---

## 🎨 Design System OASYS

```css
--teal: #00D4AA      /* Primario tecnológico */
--gold: #C9A84C      /* Secundario premium */
--cream: #F5F0E8     /* Texto */
--dark: #060d08      /* Fondo principal */
```

**Tipografías:**
- **Orbitron** → Títulos, logos, datos técnicos (teal/gold)
- **Cormorant Garamond** → Narrativa, poético (cream)
- **IBM Plex Mono / Share Tech Mono** → Código, métricas

---

## 🔐 Sistema de autenticación (NUEVO - 17 Mayo 2026)

**Board members configurados:**
- leonardo.munoz@oasys.earth → DIRECTOR_OPERATIVO
- roberto.munoz@oasys.earth → DIRECTOR_FINANCIERO
- luis@oasys.earth → AUDITOR_SENIOR
- mariola@oasys.earth → DIRECTOR_MARKETING
- paco.yuste@oasys.earth → COORDINADOR_TECNICO
- antonio.munoz@oasys.earth → ADMINISTRATOR_REGEN_CORE

**Arquitectura:**
- Formulario de identificación (nombre + email + intención)
- Detección automática de rol por email
- System prompts diferenciados por acceso
- Sidebar con métricas públicas/privadas
- localStorage para persistencia de sesión

---

## 📊 Datos en producción

**Métricas actuales (17 Mayo 2026):**
- BSG plazas: 13/50
- Superficie: 3.47 ha
- Próximo hito: Escritura 15 mayo 2026
- PAC 2026: presentado 30 abril
- Prima Joven 27: dossier en preparación

---

## 🧪 Testing local

**Servidor local requerido** (CORS restrictions):
```bash
cd "C:\Users\amyus\Desktop\amyuste\el oasys\oasys earth"
python -m http.server 8000
# Abrir: http://localhost:8000/index.html
```

**Testing del auth system:**
1. Esperar 15s (animación inicial)
2. Completar formulario con email de board member
3. Verificar `user-status` se actualiza correctamente
4. Verificar sidebar aparece con métricas según rol
5. Probar chat → debe usar system prompt ampliado

---

## 🚀 Deploy (cuando esté listo)

**Ubicación producción:**
```
C:\Users\amyus\Documents\oasys-web\
└── index.html + assets → Netlify → oasys.earth (LIVE)
```

**Pre-deploy checklist:**
- [ ] Verificar que funciona en local
- [ ] Confirmar que no hay console.errors
- [ ] Revisar que métricas están actualizadas
- [ ] Verificar emails de board members
- [ ] Confirmar ANTHROPIC_API_KEY en Netlify env vars

---

## 💬 Comunicación con Antonio

**Cuando termines una tarea:**
```
✅ [Nombre de la tarea] completada
- [Qué se hizo]
- [Archivos modificados]
- [Qué probar]

LISTO PARA [siguiente paso]
```

**Si encuentras un blocker:**
```
⚠️ BLOCKER en [tarea]
- Problema: [descripción]
- Intentado: [qué probaste]
- Necesito: [qué falta / decisión de Antonio]
```

---

## 📝 Log de trabajo

Registra cambios significativos en `vault\04_LOGS\YYYY-MM-DD.md` (carpeta padre).

---

**Este CLAUDE.md es específico de `oasys earth/`. Para instrucciones del proyecto completo, consulta `CLAUDE.md` en la carpeta raíz.**
