# Tareas pendientes consolidadas

Resumen rápido
- **Total coincidencias:** 18
- **Carpetas:** root (4), bsg (9), netlify/functions (5)

Instrucciones: marcar con `- [ ]` las tareas a ejecutar y actualizar el archivo cuando se completen.

**Root**
- [ ] Coordinar sincronización de contenido: [CLAUDE.md](CLAUDE.md#L106) — "⚡ PENDIENTE SYNC Claude.ai" — Acción: registrar y sincronizar con Claude.ai.
- [ ] Priorizar mejoras listadas: [BSG_RESERVA_SISTEMA.md](BSG_RESERVA_SISTEMA.md#L222) — "Mejoras Pendientes" — Acción: revisar lista y asignar prioridades.
- [ ] Confirmar datos estratégicos y actualizar UI: [transparency-panel.js](transparency-panel.js#L36) — "Datos estratégicos pendientes" — Acción: confirmar datos y actualizar panel.
- [ ] Actualizar estado de despliegue si procede: [README.md](README.md#L32) — estado de sitios pendiente — Acción: corregir tabla/estado.

**bsg/**
- [ ] Verificar título y conteo de plazas: [bsg/admin/index.html](bsg/admin/index.html#L48) — "Plazas pendientes" — Acción: validar texto y conteo.
- [ ] Comprobar mensaje cuando no hay plazas: [bsg/admin/index.html](bsg/admin/index.html#L61) — "No hay plazas pendientes..." — Acción: revisar UX/estado vacío.
- [ ] Revisar pluralización y lógica de conteo JS: [bsg/admin/index.html](bsg/admin/index.html#L92) — Acción: asegurar pluralización correcta.
- [ ] Verificar fuente de `count` y consistencia UI: [bsg/admin/index.html](bsg/admin/index.html#L167) — Acción: validar origen de datos.
- [ ] Validar estados admitidos en migración: [bsg/migration_bsg_plazas.sql](bsg/migration_bsg_plazas.sql#L41) — "CHECK (tipo IN ... 'pendiente')" — Acción: confirmar estados de negocio.
- [ ] Revisar privacidad/visibilidad de filas con datos personales: [bsg/migration_bsg_plazas.sql](bsg/migration_bsg_plazas.sql#L89) — Acción: asegurar cumplimiento y visibilidad correcta.
- [ ] Verificar constraints y transiciones de estado en migración: [bsg/migration_bsg_plazas.sql](bsg/migration_bsg_plazas.sql#L98) — Acción: revisar lógica post-PATCH.
- [ ] Confirmar flujo de transición libre→pendiente: [bsg/migration_bsg_plazas.sql](bsg/migration_bsg_plazas.sql#L99) — Acción: documentar y validar.
- [ ] Asegurar que la restricción no bloquee casos válidos: [bsg/migration_bsg_plazas.sql](bsg/migration_bsg_plazas.sql#L106) — Acción: probar migración.

**netlify/functions/**
- [ ] Integrar analytics: [netlify/functions/upload-photo.js](netlify/functions/upload-photo.js#L188) — "TODO: Integrate with analytics service" — Acción: implementar tracking.
- [ ] Registrar eventos en Supabase: [netlify/functions/upload-photo.js](netlify/functions/upload-photo.js#L189) — "TODO: Track in Supabase analytics table" — Acción: añadir registro.
- [ ] Crear notificación/webhook para Instagram: [netlify/functions/upload-photo.js](netlify/functions/upload-photo.js#L190) — Acción: implementar notificación.
- [ ] Integrar servicio de correo en webhook de Stripe: [netlify/functions/stripe-webhook.js](netlify/functions/stripe-webhook.js#L233) — "TODO: Integrate with email service" — Acción: enviar emails y verificar plantillas.
- [ ] Verificar variables de entorno para envío de emails: [netlify/functions/stripe-webhook.js](netlify/functions/stripe-webhook.js#L240) — Acción: revisar env vars y secretos.

---
Fecha de escaneo: 2026-05-17

Si quieres, puedo:
- abrir los archivos con los fragmentos relevantes para revisión,
- o empezar a implementar/editar alguno de los items (dime cuál).
