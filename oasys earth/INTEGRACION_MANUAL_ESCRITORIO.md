# INTEGRACIÓN MANUAL — SISTEMA DE AUTENTICACIÓN
**Archivo base:** C:\Users\amyus\Desktop\amyuste\el oasys\oasys earth\index.html

---

## CAMBIOS A REALIZAR:

### 1. CAMBIAR BOTÓN LOGIN (línea ~820)

**BUSCAR:**
```html
<button class="start-conversation-btn" onclick="enterChat()">
```

**REEMPLAZAR POR:**
```html
<button class="start-conversation-btn" onclick="submitIdentification()">
```

---

### 2. MODIFICAR FUNCIÓN enterChat() (línea ~1183)

**BUSCAR:**
```javascript
function enterChat() {
    document.getElementById('login-screen').classList.add('hidden');
    const chatWindow = document.getElementById('chat-window');
    chatWindow.classList.add('active');

    // Mensaje de bienvenida
    setTimeout(() => {
        addMessage('ai', '¡Hola! Soy el sistema de conocimiento de OASYS BASE CAMP. Estoy aquí para contarte todo sobre nuestro proyecto de regeneración de la tierra en Yunclillos, Toledo.\n\n¿Qué te gustaría saber?');
    }, 400);
}
```

**REEMPLAZAR POR:**
```javascript
function enterChat() {
    document.getElementById('login-screen').classList.add('hidden');
    const chatWindow = document.getElementById('chat-window');
    chatWindow.classList.add('active');

    // Mostrar dashboard según rol
    showDashboard();

    // Mensaje de bienvenida personalizado
    setTimeout(() => {
        const greeting = currentUser.access === 'public' 
            ? `¡Hola ${currentUser.name}! Soy el sistema de conocimiento de OASYS BASE CAMP.`
            : `¡Bienvenido/a ${currentUser.name}! Como ${currentUser.displayRole}, tienes acceso completo al dashboard ${currentUser.dashboard}.`;
        
        addMessage('ai', greeting + '\n\n¿En qué puedo ayudarte?');
    }, 400);
}
```

---

### 3. MODIFICAR processUserMessage() — USAR SYSTEM PROMPT DINÁMICO (línea ~1226)

**BUSCAR la línea que dice:**
```javascript
system: SYSTEM_PROMPT,
```

**REEMPLAZAR POR:**
```javascript
system: getSystemPrompt(),
```

---

### 4. ELIMINAR EMAIL CAPTURE ANTIGUO (líneas ~1278-1282)

**BUSCAR:**
```javascript
// Email capture después del 2º intercambio
if (conversationHistory.length >= 4 && !emailCaptured) {
    emailCaptured = true;
    setTimeout(() => showEmailCapture(), 800);
}
```

**ELIMINAR TODO ESE BLOQUE** (ya no se usa)

---

### 5. ELIMINAR FUNCIONES ANTIGUAS showEmailCapture y captureEmail (líneas ~1294-1315)

**BUSCAR Y ELIMINAR:**
```javascript
function showEmailCapture() {
    const messages = document.getElementById('messages');
    const div = document.createElement('div');
    div.className = 'email-capture';
    div.innerHTML = `
        <input type="email" placeholder="tu@email.com · si quieres que te mantengamos al día" id="email-field" />
        <button onclick="captureEmail()">UNIRME</button>
    `;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

function captureEmail() {
    const email = document.getElementById('email-field')?.value;
    if (!email) return;
    const capture = document.querySelector('.email-capture');
    if (capture) {
        capture.innerHTML = `<span style="color:var(--gold);font-size:11px;letter-spacing:0.1em;">✓ Anotado. Bienvenido/a a la comunidad OASYS.</span>`;
    }
    // Aquí conectar con backend/Supabase cuando esté listo
    console.log('Email captured:', email);
}
```

**ELIMINAR TODO ESE BLOQUE**

---

## RESUMEN:

✅ Botón llama a `submitIdentification()` (ya funciona en oasys-auth-system.js)
✅ `enterChat()` personaliza bienvenida según rol
✅ System prompt dinámico según acceso (público vs board)
✅ Email capture antiguo eliminado

**Con estos 5 cambios, el sistema estará completo.**

---

## PROBAR:

1. Abrir index.html en navegador
2. Completar formulario con `antonio.munoz@oasys.earth`
3. Verificar que user-status muestra: ADMINISTRATOR_REGEN_CORE
4. Verificar que aparece sidebar con métricas
5. Chat debe tener system prompt ampliado (datos internos)

---

**ARCHIVOS NECESARIOS EN LA MISMA CARPETA:**
- ✅ oasys-auth-system.js
- ✅ oasys-auth-styles.css
- ✅ oasys-login-form.html (referencia, ya está integrado en el HTML)

Ya los tienes todos en `C:\Users\amyus\Documents\oasys-web\oasys earth\`
