# OASYS-WEB · REPOSITORIO DE PRODUCCIÓN
# Scope: Deploy y publicación únicamente
# Cerebro: C:\Users\amyus\Desktop\amyuste\el oasys\OASYS_MASTER.html

---

## PROTOCOLO DE ARRANQUE

**PASO 1 — Verifica contexto**
```bash
pwd  # Debe ser: C:\Users\amyus\Documents\oasys-web
git remote -v  # Debe mostrar: github.com/oasys-camp/oasys-web.git
```

**PASO 2 — Verifica git status**
```bash
git status
```
Si hay cambios sin commitear de sesiones anteriores: PARA y pregunta a Antonio qué hacer.

**PASO 3 — Confirma sites activos**
Este repo despliega a:
- elbosquesagrado.org (desde `bsg/`)
- oasysbasecamp.com (desde raíz o carpeta específica)
- oasys.camp (desde `oasys.camp/`)
- oasys.earth (desde `oasys.earth/` o raíz)

Cualquier cambio aquí afecta producción directamente vía Netlify.

---

## ROL DE ESTE REPO

Este directorio contiene **exclusivamente versiones FINALES** listas para publicación.

**El desarrollo e iteración ocurren en:**
`C:\Users\amyus\Desktop\amyuste\el oasys\`

**Aquí solo llegan versiones probadas y aprobadas por Antonio.**

**No tomes decisiones de producto aquí. Ejecuta. Reporta.**

---

## SITES BAJO GESTIÓN

- `elbosquesagrado.org` → Netlify (vocal-sorbet-32e7da)
- `oasysbasecamp.com`
- `oasys.camp`

---

## REGLAS DE ESTE REPO

### 1. Analytics — NUNCA tocar
```html
<!-- GA4 -->
G-NMC1GS2WDW
<!-- GTM -->
GTM-5T2LL98X
```
Cualquier deploy debe verificar que estos IDs están presentes y activos.

### 2. Design system — respetar siempre
```
Colores:  #060d08 (dark) · #00D4AA (teal) · #C9A84C (gold) · #F5F0E8 (cream)
Fuentes:  Orbitron (títulos) · Cormorant Garamond (texto) · IBM Plex Mono (datos)
```

### 3. Lenguaje web — reglas estrictas
- Identidad geográfica: "en el corazón de La Sagra toledana, a 45 min de Madrid y 20 de Toledo"
- Nunca: "único en España" en primera comunicación
- Nunca: lenguaje mortuorio/memorial — centrar en vida, regeneración, comunidad
- BSG: El Bosque Sagrado · proceso = "biotransformación aerobia CE 1069/2009"
- NODO: ante cualquier institución = "instalación modular desmontable · almacén agrícola"

### 4. Titular institucional
- Toda facturación, contratos, formularios web → **Leonardo Muñoz Pérez**
- IBAN BSG: ES16 3081 0151 9650 0081 2750
- Concepto transferencia BSG: "SEMILLA + nombre del animal"

---

## DEPLOY CHECKLIST (antes de cualquier push a producción)

- [ ] GA4 `G-NMC1GS2WDW` presente
- [ ] GTM `GTM-5T2LL98X` presente  
- [ ] Sin referencias a Antonio Muñoz Yuste en HTML público
- [ ] Design system respetado (colores y fuentes)
- [ ] Log actualizado en `../vault/04_LOGS/YYYY-MM-DD.md`
- [ ] Si hay cambios en copy → confirmar con Antonio antes de deploy

---

## ASSETS MULTIMEDIA

- Video hero: MP4 6MB (Blob URL via `URL.createObjectURL()`)
- Audio: MP3 continuo en navegación hero
- Imágenes: base64 en HTML standalone cuando sea necesario

---

## DESPUÉS DE CADA TAREA

1. Log en `../vault/04_LOGS/YYYY-MM-DD.md`
2. Si afecta a contenido/estructura → marcar `⚡ PENDIENTE SYNC Claude.ai`
3. Graveyard solo para componentes completos reemplazados

---

*Scope limitado a frontend. Para el cuadro completo: CLAUDE.md raíz + OASYS_MASTER.html*
