# Modal de Pago - Integración Stripe

## 🎯 Descripción

Modal de pago sofisticado integrado en la página de reserva del Bosque Sagrado que muestra múltiples métodos de pago (tarjeta, Apple Pay, Google Pay) junto a la información tradicional de transferencia bancaria.

## 🎨 Características del Diseño

### Layout
- **Diseño de dos columnas**: Transferencia bancaria (izquierda) + Modal de pago (derecha)
- **Estética premium**: Gradiente verde oscuro con acentos dorados
- **Responsive**: Se adapta a móvil con layout de una columna
- **Animaciones suaves**: Transiciones y hover effects

### Elementos Visuales
- **Badge de integración**: "EJEMPLO DE INTEGRACIÓN" en verde neón
- **Iconos distintivos**: 💳 para tarjeta, 🍎 para Apple Pay, 🔵 para Google Pay
- **Indicador de selección**: Radio button con estado seleccionado
- **Botón CTA animado**: Gradiente con hover effect y sombra
- **Indicador de seguridad**: Icono de candado + "Pago seguro con Stripe"

## 🔧 Funcionalidades JavaScript

### `selectPaymentMethod(element, method)`
Selecciona un método de pago y actualiza la interfaz.

**Parámetros:**
- `element`: Elemento DOM del método de pago clickeado
- `method`: Identificador del método ('card', 'apple', 'google')

**Funcionalidad:**
- Remueve selección de todos los métodos
- Añade clase `selected` al elemento clickeado
- Actualiza texto del botón CTA según método
- Registra evento en Google Analytics

### `initiateStripeCheckout()`
Inicia el proceso de checkout de Stripe.

**Funcionalidad:**
- Valida que haya un método seleccionado
- Muestra estado de carga
- Registra evento de checkout iniciado
- Simula proceso de pago (demo)
- En producción: llama a función Stripe real

### Inicialización Automática
- Selecciona automáticamente el primer método (tarjeta) al cargar la página
- Prepara el modal para interacción inmediata

## 📱 Responsive Design

### Desktop (>900px)
```css
.transfer-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  max-width: 1100px;
}
```

### Mobile (<900px)
```css
.transfer-container {
  grid-template-columns: 1fr;
  gap: 48px;
}
```

## 🎨 Estilos CSS

### Colores y Gradientes
```css
/* Fondo del modal */
background: linear-gradient(135deg, #1a472a 0%, #0a1f14 100%);

/* Borde con acento verde */
border: 1px solid rgba(0,212,170,0.3);

/* Línea superior decorativa */
&::before {
  background: linear-gradient(90deg, #00D4AA, #C9A84C, #00D4AA);
}

/* Botón CTA */
background: linear-gradient(135deg, #00D4AA 0%, #00bfa0 100%);
```

### Tipografía
- **Títulos**: Cormorant Garamond (24px, weight 300)
- **Etiquetas**: IBM Plex Mono (9px, letter-spacing 0.15em)
- **Texto**: Sans-serif del sistema (14px para nombres, 11px para descripciones)

### Efectos Interactivos
```css
/* Hover en métodos de pago */
.payment-method:hover {
  background: rgba(255,255,255,0.08);
  border-color: rgba(0,212,170,0.3);
}

/* Hover en botón CTA */
.payment-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,212,170,0.3);
}
```

## 🔗 Integración con Stripe

### Paso 1: Configurar Stripe en Netlify Functions

Crear `netlify/functions/create-stripe-checkout.js`:

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { paymentMethod, petName, nif, email, phone, message } = JSON.parse(event.body);

    // Validar disponibilidad de plaza
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    const { data: plazas } = await supabase
      .from('bsg_plazas')
      .select('plaza')
      .eq('estado', 'disponible')
      .limit(1);

    if (!plazas || plazas.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No hay plazas disponibles' })
      };
    }

    const plaza = plazas[0].plaza;

    // Crear sesión de Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Pack Fundador · SEMILLA',
            description: `Plaza ${plaza} · Bosque Sagrado · ${petName}`,
            images: ['https://elbosquesagrado.org/og-image.jpg']
          },
          unit_amount: 45000, // 450.00€ en centimos
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.URL}/#/confirmacion?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.URL}/#reserva`,
      customer_email: email,
      metadata: {
        plaza: plaza,
        pet_name: petName,
        nif: nif,
        email: email,
        phone: phone || '',
        message: message || '',
        payment_method: paymentMethod
      },
      payment_intent_data: {
        metadata: {
          plaza: plaza,
          pet_name: petName
        }
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ sessionId: session.id, url: session.url })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
```

### Paso 2: Actualizar JavaScript del Modal

Reemplazar la función `initiateStripeCheckout()`:

```javascript
async function initiateStripeCheckout() {
  if (!selectedPaymentMethod) {
    alert('Por favor, selecciona un método de pago');
    return;
  }

  // Obtener datos del formulario
  const form = document.getElementById('semilla-form');
  const formData = new FormData(form);

  const petName = formData.get('mascota');
  const nif = formData.get('nif');
  const email = formData.get('email');
  const phone = formData.get('telefono') || '';
  const message = formData.get('mensaje') || '';

  // Validar campos requeridos
  if (!petName || !nif || !email) {
    alert('Por favor, completa los campos requeridos del formulario');
    return;
  }

  // Mostrar loading state
  var ctaButton = document.querySelector('.payment-cta');
  var originalText = ctaButton.textContent;
  ctaButton.textContent = 'Procesando...';
  ctaButton.disabled = true;

  // Track checkout initiation
  gtag('event', 'checkout_initiated', {
    event_category: 'Payment',
    event_label: selectedPaymentMethod,
    value: 450.00,
    currency: 'EUR'
  });

  try {
    // Llamar a Netlify Function
    const response = await fetch('/.netlify/functions/create-stripe-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        paymentMethod: selectedPaymentMethod,
        petName: petName,
        nif: nif,
        email: email,
        phone: phone,
        message: message
      })
    });

    const data = await response.json();

    if (response.ok) {
      // Redirigir a Stripe Checkout
      window.location.href = data.url;
    } else {
      throw new Error(data.error || 'Error al crear sesión de pago');
    }

  } catch (error) {
    console.error('Error:', error);
    alert('Error al procesar el pago: ' + error.message);

    // Reset button
    ctaButton.textContent = originalText;
    ctaButton.disabled = false;

    // Track error
    gtag('event', 'checkout_error', {
      event_category: 'Payment',
      event_label: error.message
    });
  }
}
```

### Paso 3: Configurar Variables de Entorno

En Netlify:

```bash
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
SUPABASE_URL=https://...
SUPABASE_SERVICE_KEY=eyJ...
URL=https://elbosquesagrado.org
```

## 📊 Eventos de Analytics

### Eventos Implementados

1. **`payment_method_selected`**
   - Categoría: 'Payment'
   - Label: Método seleccionado ('card', 'apple', 'google')
   - Se dispara al seleccionar un método de pago

2. **`checkout_initiated`**
   - Categoría: 'Payment'
   - Label: Método seleccionado
   - Value: 450.00
   - Currency: 'EUR'
   - Se dispara al iniciar el checkout

3. **`checkout_error`**
   - Categoría: 'Payment'
   - Label: Mensaje de error
   - Se dispara si hay error en el proceso

## 🧪 Testing

### Testing Local

```bash
# Iniciar servidor local
netlify dev

# Probar modal de pago
# 1. Abrir http://localhost:8888/#reserva
# 2. Completar formulario
# 3. Seleccionar método de pago
# 4. Click en "Pagar"
# 5. Verificar redirección a Stripe
```

### Testing con Stripe CLI

```bash
# Iniciar Stripe CLI en modo forward
stripe listen --forward-to localhost:8888/.netlify/functions/stripe-webhook

# Crear sesión de prueba
stripe payment_intent create \
  --amount=45000 \
  --currency=eur \
  --metadata='{"plaza":"14","pet_name":"Test"}'
```

## 🚀 Despliegue

### Pasos para Producción

1. **Configurar Stripe Production**
   - Obtener API keys de producción
   - Configurar webhooks en Stripe Dashboard
   - Verificar dominio elbosquesagrado.org

2. **Actualizar Variables de Entorno**
   - Reemplazar claves de prueba con claves de producción
   - Verificar todas las variables configuradas

3. **Deploy en Netlify**
   ```bash
   netlify deploy --prod
   ```

4. **Testing Final**
   - Probar pago real con tarjeta de prueba
   - Verificar webhooks recibidos
   - Confirmar generación de documentos

## 📈 Métricas a Monitorear

### KPIs del Funnel de Pago

1. **Tasa de conversión del modal**
   - Visitantes que ven el modal → Visitantes que inician pago

2. **Tasa de éxito de pago**
   - Pagos iniciados → Pagos completados

3. **Preferencia de método**
   - Distribución: Tarjeta vs Apple Pay vs Google Pay

4. **Tiempo de conversión**
   - Tiempo desde ver modal → completar pago

5. **Tasa de abandono**
   - Pagos iniciados → Pagos cancelados

## 🎯 Próximas Mejoras

### Funcionalidades Futuras

1. **Apple Pay y Google Pay reales**
   - Integración con Payment Request API
   - Soporte para wallets digitales

2. **Pago en cuotas**
   - Opción de fraccionar el pago
   - Integración con Stripe Installments

3. **Guardado de métodos**
   - Opción de guardar tarjeta para futuras reservas
   - Sistema de clientes recurrentes

4. **Optimización móvil**
   - Bottom sheet para móviles
   - Gestos de deslizar para confirmar

5. **Personalización avanzada**
   - Selección de plaza específica
   - Personalización del árbol en tiempo real

## 📞 Soporte

### Problemas Comunes

**El modal no se muestra:**
- Verificar que el CSS esté cargado
- Comprobar que no haya errores de JavaScript en consola

**Error al conectar con Stripe:**
- Verificar variables de entorno configuradas
- Confirmar que Stripe CLI no esté interceptando peticiones

**Webhook no se recibe:**
- Verificar URL del webhook en Stripe Dashboard
- Confirmar que el firewall no bloquee peticiones

---

**OASYS BASECAMP** · Sistema Operativo de la Tierra · Yunclillos, Toledo
*Modal de Pago · Integración Stripe · Ejemplo de funcionalidad de pago*