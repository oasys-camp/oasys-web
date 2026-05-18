# INTEGRACIÓN DEL SISTEMA DE AUTENTICACIÓN EN OASYS.EARTH

## Archivos generados:
1. `oasys-auth-system.js` - Sistema completo de roles
2. `oasys-auth-styles.css` - Estilos del formulario
3. `oasys-login-form.html` - HTML del formulario

## PASOS DE INTEGRACIÓN:

### 1. Copiar archivos al proyecto
```bash
cp oasys-auth-system.js "C:\Users\amyus\Desktop\amyuste\el oasys\oasys earth\"
cp oasys-auth-styles.css "C:\Users\amyus\Desktop\amyuste\el oasys\oasys earth\"
```

### 2. Modificar index.html

**En el <head>, después de las fuentes de Google, añadir:**
```html
<link rel="stylesheet" href="oasys-auth-styles.css">
```

**Antes de </body>, después del script de Globe.gl, añadir:**
```html
<script src="oasys-auth-system.js"></script>
```

**Reemplazar la sección LOGIN SCREEN (líneas ~814-826) con:**
El contenido de `oasys-login-form.html`

### 3. Modificar la función enterChat()

**Buscar la función `enterChat()` y reemplazar su contenido:**

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
            : `¡Hola ${currentUser.name}! Como miembro del equipo, tienes acceso completo a métricas internas.`;
        
        addMessage('ai', greeting + '\n\n¿En qué puedo ayudarte?');
    }, 400);
}
```

### 4. Modificar processUserMessage() para usar system prompt dinámico

**Buscar donde se define el SYSTEM_PROMPT en la función processUserMessage():**

**Reemplazar:**
```javascript
const SYSTEM_PROMPT = `texto fijo...`;
```

**Por:**
```javascript
const systemPrompt = getSystemPrompt(); // Usa la función del auth-system.js
```

**Y en el fetch cambiar:**
```javascript
system: systemPrompt,  // en lugar de SYSTEM_PROMPT
```

### 5. Verificar que funciona

1. Abrir index.html en navegador
2. Esperar 15 segundos (animación inicial)
3. Debería aparecer el formulario de identificación
4. Probar con email de board member (ej: antonio.munoz@oasys.earth)
5. Verificar que el user-status se actualiza con el rol correcto
6. Verificar que aparece sidebar con métricas

## EMAILS DE BOARD MEMBERS CONFIGURADOS:

- leonardo.munoz@oasys.earth → DIRECTOR_OPERATIVO
- roberto.munoz@oasys.earth → DIRECTOR_FINANCIERO  
- luis@oasys.earth → AUDITOR_SENIOR
- mariola@oasys.earth → DIRECTOR_MARKETING
- paco.yuste@oasys.earth → COORDINADOR_TECNICO
- antonio.munoz@oasys.earth → ADMINISTRATOR_REGEN_CORE

Cualquier otro email → VERIFIED_HUMAN (público)
