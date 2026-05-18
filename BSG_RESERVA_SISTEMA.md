# Sistema de Reserva BSG - Integración Completa

Sistema completo de reserva para el Bosque Sagrado inspirado en el ejemplo de Lolo (Plaza 13).

## 🎯 Inspiración: Lolo Fundador 13

Basado en el ejemplo de confirmación de plaza 13 para Lolo, hemos creado un sistema que:

1. **Genera documentos de confirmación elegantes** similares al de Lolo
2. **Integra fotos para Instagram Hall of Fame** como en el reel de Lolo
3. **Mantiene el estilo profesional y emotivo** del documento original

## 📋 Componentes del Sistema

### 1. Páginas de Reserva

#### `bsg/reserva-elegante.html`
- **Diseño inspirado en el documento de Lolo**
- Tipografía Cormorant Garamond + IBM Plex Mono
- Estilo minimalista y elegante
- Colores: verde bosque (#1a472a), dorado (#c9a84c), crema (#f5f0e8)
- Layout de dos columnas con información y formulario

#### `bsg/reserva-mejorada.html`
- Versión más moderna con gradientes
- Animaciones suaves
- Diseño responsive mejorado
- Ideal para usuarios que prefieren estética más contemporánea

### 2. Funciones de Stripe

#### `netlify/functions/create-checkout.js`
- Crea sesión de checkout de Stripe
- Valida NIF/DNI
- Verifica disponibilidad de plaza
- Incluye metadata completa (nombre mascota, teléfono, mensaje)

#### `netlify/functions/stripe-webhook.js`
- Procesa eventos de Stripe
- Actualiza Supabase automáticamente
- Genera documentos BSG
- **Genera documento de confirmación elegante**
- Envía emails de confirmación

#### `netlify/functions/verify-session.js`
- Verifica sesión de pago
- Recupera detalles de la plaza
- Muestra mensaje de éxito

#### `netlify/functions/release-plaza.js`
- Libera plaza si el pago se cancela
- Actualiza estado a 'available'

#### `netlify/functions/next-plaza.js`
- Obtiene el siguiente número de plaza disponible
- Optimiza el proceso de asignación

### 3. Sistema de Fotos Instagram

#### `netlify/functions/upload-photo.js`
- Sube fotos a Supabase Storage
- Valida tipo y tamaño (máx 5MB)
- Genera URL pública
- Actualiza registro de plaza
- Prepara contenido para @elbosque_sagrado

### 4. Generador de Confirmaciones

#### `netlify/functions/generate-confirmation.js`
- **Genera documento HTML elegante** similar al de Lolo
- Incluye todos los detalles de la reserva
- Estilo profesional con tarjeta "Visa"
- Guarda en Supabase Storage
- Genera URL pública para compartir

## 🎨 Estilo del Documento de Confirmación

El documento de confirmación sigue el estilo del ejemplo de Lolo:

### Estructura
1. **Header**: Brand OASYS + información del proyecto
2. **Saludo personalizado**: "Francisco, tu plaza está registrada."
3. **Tarjeta Visa**: Ficha de reserva con diseño elegante
4. **Pasos siguientes**: Qué ocurre ahora (5 pasos)
5. **Footer**: Información de contacto y legal

### Elementos Visuales
- **Tipografía**: Cormorant Garamond (títulos) + IBM Plex Mono (datos)
- **Colores**: Blanco (#ffffff), Negro (#111111), Verde (#1a472a)
- **Tarjeta**: Fondo crema (#f5f0e8) con bordes sutiles
- **Números de plaza**: Tipografía grande y elegante (52px)

### Contenido del Documento
```
Plaza Nº 13 · El Bosque Sagrado

Francisco, tu plaza está registrada.

Lolo forma ya parte del Bosque Sagrado. Su árbol estará plantado
en esta tierra toledana — geoposicionado, con placa física y
certificado digital desde el primer día.

┌─────────────────────────────────────┐
│ El Bosque Sagrado · OASYS    Plaza │
│ Ficha de reserva                  13 │
├─────────────────────────────────────┤
│ Titular         Lolo               │
│ Propietario     Francisco García   │
│ NIF             03833458W          │
│ Email           francisco@...      │
│ Árbol           Encina · Olivo     │
│ Animal          Perro              │
│ Fecha registro  5 de mayo de 2026 │
│ Precio fundador 450 €             │
└─────────────────────────────────────┘
```

## 📸 Instagram Hall of Fame

### Proceso
1. **Usuario sube foto** durante el proceso de reserva
2. **Validación**: Tipo (imagen) y tamaño (máx 5MB)
3. **Storage**: Subida a Supabase Storage (bucket: bsg-photos)
4. **URL pública**: Generada automáticamente
5. **Actualización**: Guardada en registro de plaza
6. **Instagram**: Lista para publicación manual o API

### Ejemplo: Lolo en Instagram
- **Reel**: https://www.instagram.com/reels/DWi8u8Aiq8h/
- **Contenido**: Presentación de Lolo como fundador plaza 13
- **Formato**: Video emotivo con música y texto
- **Hashtags**: #ElBosqueSagrado #OASYS #Fundador13

### Contenido Sugerido para Instagram
```
🌳 Presentamos a Lolo, fundador plaza 13 del Bosque Sagrado

Lolo forma ya parte de nuestra tierra toledana. Su árbol estará
plantado en Yunclillos, con placa física y certificado digital.

Gracias a Francisco por confiar en nosotros para transformar el
duelo en un pulmón verde para Toledo.

#ElBosqueSagrado #OASYS #Fundador13 #BosqueToledano
#TransformaciónDelDuelo #MemorialVivo
```

## 🔧 Configuración

### Variables de Entorno

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key

# Site
SITE_URL=https://elbosquesagrado.org
```

### Buckets de Supabase Storage

1. **bsg-photos**: Fotos de mascotas para Instagram
2. **bsg-confirmations**: Documentos de confirmación HTML
3. **bsg-documents**: Documentos BSG oficiales

## 🚀 Flujo Completo

### 1. Usuario llega a la página de reserva
- Ve información clara sobre el servicio
- Conoce el ejemplo de Lolo (fundador 13)
- Entiende el proceso y beneficios

### 2. Completa el formulario
- Datos personales (nombre, email, teléfono, NIF)
- Selección de árbol y animal
- Nombre de la mascota
- Mensaje personal (opcional)
- **Foto para Instagram** (opcional)

### 3. Inicia el pago con Stripe
- Redirección a checkout seguro
- Pago de 450€ con tarjeta
- Confirmación inmediata

### 4. Webhook procesa el pago
- Actualiza Supabase
- Genera documento BSG
- **Genera confirmación elegante**
- Prepara foto para Instagram
- Envía email de confirmación

### 5. Usuario recibe confirmación
- Email con documento de confirmación
- Enlace al documento HTML elegante
- Información de próximos pasos
- **Mención en Instagram** (si subió foto)

## 📊 Métricas y Analytics

### Eventos de Google Analytics 4
- `begin_checkout`: Inicio de proceso de reserva
- `purchase`: Pago completado
- `photo_upload`: Subida de foto para Instagram
- `confirmation_view`: Visualización de documento

### Funnel de Conversión
1. **Landing page** → 100%
2. **Formulario iniciado** → 80%
3. **Checkout iniciado** → 60%
4. **Pago completado** → 40%
5. **Confirmación vista** → 100% (de pagos)

## 🎯 Próximos Pasos

### Mejoras Pendientes
- [ ] Integración con API de Instagram para publicaciones automáticas
- [ ] Sistema de notificaciones push para actualizaciones
- [ ] Dashboard de administración para ver todas las plazas
- [ ] Sistema de visitas programadas al bosque
- [ ] Integración con WhatsApp para comunicación directa

### Optimizaciones
- [ ] A/B testing de diferentes diseños de página
- [ ] Personalización de documentos con fotos
- [ ] Sistema de referidos para fundadores
- [ ] Programa de lealtad para fundadores activos

## 📞 Soporte

Para cualquier cuestión sobre el sistema:
- **Email**: info@elbosquesagrado.org
- **Instagram**: @elbosque_sagrado
- **Web**: elbosquesagrado.org

---

**OASYS BASE CAMP** · Sistema Operativo de la Tierra · Yunclillos, Toledo
*Inspirado en Lolo, fundador plaza 13*