# ⚡ TAREA PRIORITARIA — INTEGRACIÓN AUTH SYSTEM

**Fecha:** 17 Mayo 2026  
**Prioridad:** MÁXIMA  
**Contexto:** Antonio acaba de trabajar con Claude chat para diseñar sistema de autenticación

---

## 🎯 OBJETIVO ÚNICO

Integrar el sistema de autenticación en `index.html` de oasys.earth siguiendo las instrucciones de `INSTRUCCIONES_INTEGRACION.md`.

**NO hagas nada más. NO revises otras tareas pendientes. NO cambies skills.**

---

## 📋 CHECKLIST DE INTEGRACIÓN

### Paso 1: Verificar archivos
- [ ] Confirmar que existen: `oasys-auth-system.js`, `oasys-auth-styles.css`, `oasys-login-form.html`
- [ ] Confirmar que existe `index.html` original

### Paso 2: Backup
- [ ] Crear backup: `index.html` → `index-backup-17may.html`

### Paso 3: Integración CSS
- [ ] Abrir `index.html`
- [ ] Buscar `</head>`
- [ ] ANTES de `</head>`, añadir: `<link rel="stylesheet" href="oasys-auth-styles.css">`

### Paso 4: Integración JavaScript
- [ ] Buscar `</body>`
- [ ] ANTES de `</body>`, añadir: `<script src="oasys-auth-system.js"></script>`

### Paso 5: Reemplazar LOGIN SCREEN
- [ ] Buscar sección que empieza con `<!-- LOGIN SCREEN (After 15s) -->`
- [ ] Buscar las líneas ~814-826 (entre `<div id="login-screen">` y cierre del botón `</button>`)
- [ ] Reemplazar con el contenido de `oasys-login-form.html`

### Paso 6: Modificar función enterChat()
- [ ] Buscar `function enterChat() {`
- [ ] Reemplazar TODO su contenido con:

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

### Paso 7: Modificar processUserMessage() - System Prompt
- [ ] Buscar la constante `const SYSTEM_PROMPT =` (está dentro de `async function processUserMessage()`)
- [ ] Reemplazar `const SYSTEM_PROMPT = \`...\`;` por: `const systemPrompt = getSystemPrompt();`
- [ ] Buscar el `fetch` de Anthropic API
- [ ] Cambiar `system: SYSTEM_PROMPT,` por `system: systemPrompt,`

### Paso 8: Guardar y verificar
- [ ] Guardar `index.html`
- [ ] Verificar que no hay errores de sintaxis
- [ ] Confirmar que los 3 archivos `.js`, `.css`, `.html` están en la misma carpeta

---

## ❌ LO QUE **NO** DEBES HACER

- ❌ NO revisar graveyard
- ❌ NO leer archivos de skills
- ❌ NO modificar OASYS_MASTER.html
- ❌ NO cambiar Globe.gl o partículas
- ❌ NO actualizar ningún otro archivo
- ❌ NO añadir features no solicitadas
- ❌ NO optimizar código existente
- ❌ NO refactorizar funciones

**Solo haz la integración. Nada más.**

---

## ✅ CUANDO TERMINES

Responde con:
```
✅ Integración completada
- Backup creado: index-backup-17may.html
- CSS integrado en <head>
- JS integrado antes de </body>
- LOGIN SCREEN reemplazado
- enterChat() modificado
- processUserMessage() modificado con systemPrompt dinámico
- Archivos guardados

LISTO PARA PROBAR en navegador.
```

---

## 🆘 SI ENCUENTRAS PROBLEMAS

**Problema:** No encuentro la sección LOGIN SCREEN  
**Solución:** Busca `<div id="login-screen">` — está alrededor de línea 814

**Problema:** No encuentro function enterChat()  
**Solución:** Busca `function enterChat()` con Ctrl+F — está después de línea 1180

**Problema:** No encuentro SYSTEM_PROMPT  
**Solución:** Busca `const SYSTEM_PROMPT =` dentro de `async function processUserMessage()`

**Problema:** Los archivos .js o .css no están en la carpeta  
**Solución:** DETENTE. Avisa a Antonio. Los archivos deben estar descargados primero.

---

## 📝 NOTAS IMPORTANTES

- Esta tarea viene de una sesión larga con Claude chat
- Antonio diseñó el sistema de autenticación completo
- Ya están configurados 6 board members con roles específicos
- El sistema usa localStorage para persistir el usuario
- Hay dashboards diferenciados por rol (operativo, financiero, auditoría, marketing, técnico, admin)

**Tu trabajo es solo la integración técnica. El diseño ya está hecho.**

---

**Prioridad absoluta. Ignora cualquier otra tarea hasta completar esta.**
