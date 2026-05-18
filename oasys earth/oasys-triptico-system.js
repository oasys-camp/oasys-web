// ══════════════════════════════════════════════════════════════════════════════
// OASYS.EARTH · SISTEMA TRÍPTICO
// ══════════════════════════════════════════════════════════════════════════════

let conversationHistory = [];
let isLoading = false;

// ── ACTIVAR TRÍPTICO ────────────────────────────────────────────────────────
function activarTriptico() {
    // Ocultar login screen
    const loginScreen = document.getElementById('login-screen');
    if (loginScreen) {
        loginScreen.style.transition = 'opacity 0.6s ease';
        loginScreen.style.opacity = '0';
        setTimeout(() => {
            loginScreen.style.display = 'none';
        }, 600);
    }
    
    // Mostrar tríptico
    const triptico = document.getElementById('triptico-container');
    if (triptico) {
        setTimeout(() => {
            triptico.classList.add('active');
            
            // Focus en input después de animación
            setTimeout(() => {
                const input = document.getElementById('chat-input');
                if (input) input.focus();
            }, 800);
        }, 600);
    }
}

// ── AÑADIR MENSAJE MINIMALISTA ──────────────────────────────────────────────
function addMessageMinimal(role, text) {
    const container = document.getElementById('chat-messages');
    if (!container) return;
    
    const msgDiv = document.createElement('div');
    msgDiv.className = `msg-minimal ${role}`;
    
    const label = document.createElement('div');
    label.className = `msg-label-minimal ${role === 'ai' ? 'ai' : 'human'}`;
    label.textContent = role === 'ai' ? 'OASYS' : 'TÚ';
    
    const textDiv = document.createElement('div');
    textDiv.className = 'msg-text-minimal';
    textDiv.textContent = text;
    
    msgDiv.appendChild(label);
    msgDiv.appendChild(textDiv);
    container.appendChild(msgDiv);
    
    container.scrollTop = container.scrollHeight;
}

// ── TYPING INDICATOR ────────────────────────────────────────────────────────
function showTypingMinimal() {
    const container = document.getElementById('chat-messages');
    if (!container) return;
    
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.className = 'typing-minimal';
    typingDiv.innerHTML = `
        <div class="msg-label-minimal ai">OASYS</div>
        <div class="typing-dots">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;
    
    container.appendChild(typingDiv);
    container.scrollTop = container.scrollHeight;
}

function hideTypingMinimal() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
}

// ── PROCESAR MENSAJE ────────────────────────────────────────────────────────
async function processMessageMinimal(text) {
    if (!text.trim() || isLoading) return;
    
    isLoading = true;
    
    addMessageMinimal('user', text);
    conversationHistory.push({ role: 'user', content: text });
    
    showTypingMinimal();
    
    try {
        const response = await fetch('http://localhost:8888/.netlify/functions/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: conversationHistory
            })
        });
        
        const data = await response.json();
        const reply = data.content?.[0]?.text || 'Lo siento, hubo un problema.';
        
        hideTypingMinimal();
        conversationHistory.push({ role: 'assistant', content: reply });
        addMessageMinimal('ai', reply);
        
    } catch (error) {
        hideTypingMinimal();
        addMessageMinimal('ai', 'Hay un problema de conexión. Puedes escribirnos a través de oasys.camp.');
        console.error('Error:', error);
    }
    
    isLoading = false;
    
    const input = document.getElementById('chat-input');
    if (input) input.focus();
}

// ── HANDLER TECLADO ─────────────────────────────────────────────────────────
function handleChatKeydown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        const input = event.target;
        processMessageMinimal(input.value);
        input.value = '';
    }
}
