# CLAUDE.md — OASYS Base Camp
> Instrucciones de orquestación para Claude Code en el repo `oasys-web`.
> Este archivo se lee automáticamente al arrancar cada sesión.

---

## 1. Contexto del Proyecto

- **Repo**: `oasys-camp/oasys-web` (GitHub) → auto-deploy en Netlify
- **Sites**: `elbosquesagrado.org` (BSG) · `oasysbasecamp.com` (landing)
- **Backend**: Supabase (proyecto `oasys-bsg`, región West EU)
- **Stack**: HTML/CSS/JS vanilla · Netlify Forms · Supabase JS client
- **Admin único**: Leonardo Muñoz Pérez (NO Antonio en ningún doc institucional)
- **Rama principal**: `main` → cualquier push despliega en producción

---

## 2. Modo Planificación por Defecto

- Entra en modo planificación para **CUALQUIER** tarea no trivial (más de 3 pasos o decisiones arquitectónicas).
- Si algo sale mal, **PARA** y vuelve a planificar; no sigas forzando.
- Usa el modo planificación también para los pasos de verificación, no solo para la construcción.
- Escribe especificaciones detalladas por adelantado para reducir la ambigüedad.

---

## 3. Estrategia de Subagentes

- Usa subagentes con frecuencia para mantener limpia la ventana de contexto principal.
- Delega investigación, exploración y análisis paralelo a subagentes.
- Para problemas complejos, dedica más capacidad de cómputo mediante subagentes.
- Una tarea por subagente para ejecución focalizada.

---

## 4. Bucle de Automejora

- Tras **CUALQUIER** corrección: actualiza `tasks/lessons.md` con el patrón aprendido.
- Escribe reglas que eviten el mismo error en el futuro.
- Revisa `tasks/lessons.md` al inicio de cada sesión.

---

## 5. Verificación antes de Finalizar

- Nunca marques una tarea como completada sin demostrar que funciona.
- Pregúntate: *"¿Aprobaría esto un Staff Engineer?"*
- Ejecuta tests, comprueba logs y demuestra la corrección del código.
- Para cambios en Supabase: verifica RLS, políticas anon y service key antes de mergear.

---

## 6. Exige Elegancia (Equilibrado)

- Para cambios no triviales: pausa y pregunta *"¿hay una forma más elegante?"*
- Si un arreglo parece un parche: *"Sabiendo todo lo que sé ahora, implementa la solución elegante."*
- Omite esto para arreglos simples y obvios. No hagas sobreingeniería.

---

## 7. Corrección de Errores Autónoma

- Cuando recibas un informe de error: arréglalo directamente. No pidas que te lleven de la mano.
- Identifica logs, errores o tests que fallan y resuélvelos.
- Ve a arreglar los tests de CI que fallan sin que te digan cómo.

---

## 8. Gestión de Tareas

1. **Planificar primero** — escribe el plan en `tasks/todo.md` con elementos verificables.
2. **Verificar plan** — confirma antes de comenzar la implementación.
3. **Seguir el progreso** — marca elementos como completados a medida que avances.
4. **Explicar cambios** — resumen de alto nivel en cada paso.
5. **Documentar resultados** — añade sección de revisión a `tasks/todo.md`.
6. **Capturar lecciones** — actualiza `tasks/lessons.md` después de cada corrección.

---

## 9. Principios Fundamentales

- **Simplicidad primero** — cada cambio debe ser lo más simple posible. Afecta al mínimo código necesario.
- **Sin pereza** — encuentra las causas raíz. Nada de arreglos temporales. Estándares de desarrollador senior.
- **Impacto mínimo** — los cambios solo deben tocar lo necesario. Evita introducir errores secundarios.

---

## 10. Reglas Críticas para Este Repo

- `.env` **NUNCA** sube a GitHub (ya en `.gitignore`).
- La **anon key** de Supabase va en `.env`, nunca hardcodeada en el código.
- La **service role key** es solo para scripts de migración locales, nunca en frontend.
- Antes de cualquier push a `main`: verificar que no hay credenciales expuestas en el diff.
- Formulario BSG: el campo `tipo` de `bsg_plazas` usa el valor `'libre'` (no null, no vacío).
- RLS de Supabase: política anon permite `SELECT` en `bsg_plazas`; `INSERT`/`UPDATE` solo autenticado.
