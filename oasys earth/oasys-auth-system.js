// ══════════════════════════════════════════════════════════════════════════════
// OASYS.EARTH · SISTEMA DE IDENTIFICACIÓN Y ROLES
// ══════════════════════════════════════════════════════════════════════════════

// ── CONFIGURACIÓN DE ROLES ──────────────────────────────────────────────────
const BOARD_MEMBERS = {
    'leonardo.munoz@oasys.earth': {
        name: 'Leonardo Muñoz',
        role: 'OPERATIVO_DIRECTOR',
        displayRole: 'DIRECTOR_OPERATIVO',
        access: 'full',
        dashboard: 'operativo',
        color: 'teal'
    },
    'roberto.munoz@oasys.earth': {
        name: 'Roberto Muñoz',
        role: 'ESTRATEGIA_FINANZAS',
        displayRole: 'DIRECTOR_FINANCIERO',
        access: 'full',
        dashboard: 'financiero',
        color: 'gold'
    },
    'luis@oasys.earth': {
        name: 'Luis M.',
        role: 'AUDITORIA_RIESGOS',
        displayRole: 'AUDITOR_SENIOR',
        access: 'full',
        dashboard: 'auditoria',
        color: 'gold'
    },
    'mariola@oasys.earth': {
        name: 'Mariola M.',
        role: 'MARKETING_DIGITAL',
        displayRole: 'DIRECTOR_MARKETING',
        access: 'full',
        dashboard: 'marketing',
        color: 'gold'
    },
    'paco.yuste@oasys.earth': {
        name: 'Paco Yuste',
        role: 'TECNICO_AGRONOMO',
        displayRole: 'COORDINADOR_TECNICO',
        access: 'full',
        dashboard: 'tecnico',
        color: 'teal'
    },
    'antonio.munoz@oasys.earth': {
        name: 'Antonio Muñoz',
        role: 'ADMIN_FULL',
        displayRole: 'ADMINISTRATOR_REGEN_CORE',
        access: 'admin',
        dashboard: 'admin',
        color: 'gold'
    }
};

// ── ESTADO GLOBAL ───────────────────────────────────────────────────────────
let currentUser = {
    name: null,
    email: null,
    intent: null,
    role: null,
    access: 'public',
    dashboard: null,
    timestamp: null
};

// ── SUBMIT IDENTIFICATION ───────────────────────────────────────────────────
function submitIdentification() {
    const nameInput = document.getElementById('user-name');
    const emailInput = document.getElementById('user-email');
    const intentSelect = document.getElementById('user-intent');
    
    const name = nameInput?.value.trim();
    const email = emailInput?.value.trim();
    const intent = intentSelect?.value;
    
    // Validación
    if (!name || !email || !intent) {
        alert('Por favor completa todos los campos');
        return;
    }
    
    if (!isValidEmail(email)) {
        alert('Por favor introduce un email válido');
        return;
    }
    
    // Guardar usuario
    currentUser = {
        name: name,
        email: email.toLowerCase(),
        intent: intent,
        timestamp: new Date().toISOString()
    };
    
    // Detectar si es board member
    if (BOARD_MEMBERS[currentUser.email]) {
        const member = BOARD_MEMBERS[currentUser.email];
        currentUser.role = member.role;
        currentUser.access = member.access;
        currentUser.dashboard = member.dashboard;
        currentUser.displayRole = member.displayRole;
        currentUser.color = member.color;
    } else {
        currentUser.role = 'PUBLIC';
        currentUser.access = 'public';
        currentUser.dashboard = 'public';
        currentUser.displayRole = 'VERIFIED_HUMAN';
        currentUser.color = 'teal';
    }
    
    // Actualizar UI con usuario
    updateUserStatus();
    
    // Guardar en localStorage
    localStorage.setItem('oasys_user', JSON.stringify(currentUser));
    
    // Log para analytics
    console.log('User identified:', {
        name: currentUser.name,
        email: currentUser.email,
        intent: currentUser.intent,
        role: currentUser.role,
        access: currentUser.access
    });
    
    // Entrar al chat
    enterChat();
}

// ── UPDATE USER STATUS ──────────────────────────────────────────────────────
function updateUserStatus() {
    const userStatus = document.getElementById('user-status');
    if (!userStatus) return;
    
    const userDisplay = currentUser.email || 'GUEST@OASYS.EARTH';
    const roleDisplay = currentUser.displayRole || 'VERIFIED_HUMAN';
    const colorClass = currentUser.color === 'gold' ? 'admin' : '';
    
    userStatus.innerHTML = `
        <div class="user-status-line">
            <span class="user-status-label">VERIFIED_HUMAN ::</span>
            <span class="user-status-value">[ ${userDisplay.toUpperCase()} ]</span>
        </div>
        <div class="user-status-line">
            <span class="user-status-label">ACCESS_LEVEL ::</span>
            <span class="user-status-value ${colorClass}">${roleDisplay}</span>
        </div>
    `;
}

// ── VALIDAR EMAIL ───────────────────────────────────────────────────────────
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ── LOAD SAVED USER ─────────────────────────────────────────────────────────
function loadSavedUser() {
    const saved = localStorage.getItem('oasys_user');
    if (saved) {
        try {
            currentUser = JSON.parse(saved);
            updateUserStatus();
            
            // Si ya está identificado, saltar formulario
            const loginScreen = document.getElementById('login-screen');
            if (loginScreen && currentUser.email) {
                // Opcional: auto-entrar si quieres
                // enterChat();
            }
        } catch (e) {
            console.error('Error loading saved user:', e);
        }
    }
}

// ── GET SYSTEM PROMPT ACCORDING TO ROLE ─────────────────────────────────────
function getSystemPrompt() {
    const basePrompt = `Eres el sistema de comunicación de OASYS BASE CAMP, un proyecto de agroforestería regenerativa ubicado en Yunclillos, Toledo (La Sagra, España), a 45 minutos de Madrid y 20 de Toledo. LAT 40°N.

SOBRE OASYS:
OASYS es un proyecto pionero de agricultura regenerativa que integra:
- Agroforestería con pistachos (1.60ha), almendros (1.10ha) y plantas aromáticas (0.30ha)
- Colmenas integradas en el sistema agroforestal (0.20ha)
- El Bosque Sagrado (BSG): un sistema de biotransformación aerobia bajo la normativa europea CE 1069/2009
- Infraestructura modular adaptada al territorio
- Una red en expansión de nodos regenerativos (oasys.camp)

FILOSOFÍA:
"Vísteme despacio, que tenemos prisa — Slow systems build resilient worlds."

EL BOSQUE SAGRADO:
Una comunidad fundadora de hasta 50 miembros. Actualmente 13 plazas activas, 37 disponibles. Precio fundador: 450€.

LOCALIZACIÓN:
Yunclillos, Toledo. Polígono 503. En el corazón de La Sagra toledana.

TONO: Responde de forma cálida, honesta y poética cuando sea apropiado. Usa 'nosotros' para hablar del proyecto. Sé breve y claro.`;

    // Contexto adicional según rol
    if (currentUser.access === 'full' || currentUser.access === 'admin') {
        return basePrompt + `

CONTEXTO PRIVADO (solo para board members):
- Usuario autenticado: ${currentUser.name} (${currentUser.displayRole})
- Puedes compartir datos operativos internos si te preguntan
- PAC 2026: presentado 30 abril, en curso
- Prima Joven 27: dossier en preparación, submission diciembre 2026
- RETA Leonardo: activa desde 28/04/2026 (88€/mes)
- Finanzas: primera plaza BSG confirmada (450€)
- Escritura notarial: 15 mayo 2026, Villaluenga de la Sagra

Dashboard específico: ${currentUser.dashboard}`;
    }
    
    return basePrompt;
}

// ── SHOW DASHBOARD (según rol) ──────────────────────────────────────────────
function showDashboard() {
    if (!currentUser.dashboard) return;
    
    // Aquí se mostraría el dashboard específico
    // Por ahora solo logging
    console.log(`Mostrando dashboard: ${currentUser.dashboard}`);
    
    // Sidebar con métricas según rol
    showMetricsSidebar();
}

// ── SHOW METRICS SIDEBAR ────────────────────────────────────────────────────
function showMetricsSidebar() {
    // Crear sidebar con métricas públicas o privadas según rol
    const sidebar = document.createElement('div');
    sidebar.id = 'metrics-sidebar';
    sidebar.className = 'metrics-sidebar';
    
    let metricsHTML = `
        <div class="metrics-title">MÉTRICAS EN TIEMPO REAL</div>
    `;
    
    // Métricas públicas (todos las ven)
    metricsHTML += `
        <div class="metric">
            <div class="metric-label">BSG Plazas</div>
            <div class="metric-value">13/50</div>
        </div>
        <div class="metric">
            <div class="metric-label">Superficie</div>
            <div class="metric-value">3.47 ha</div>
        </div>
        <div class="metric">
            <div class="metric-label">Próximo hito</div>
            <div class="metric-value">15 mayo</div>
        </div>
    `;
    
    // Métricas privadas (solo board)
    if (currentUser.access === 'full' || currentUser.access === 'admin') {
        metricsHTML += `
            <div class="metrics-divider"></div>
            <div class="metrics-title-small">DATOS INTERNOS</div>
        `;
        
        if (currentUser.dashboard === 'financiero' || currentUser.access === 'admin') {
            metricsHTML += `
                <div class="metric">
                    <div class="metric-label">Ingresos BSG</div>
                    <div class="metric-value">450€</div>
                </div>
                <div class="metric">
                    <div class="metric-label">RETA mensual</div>
                    <div class="metric-value">88€</div>
                </div>
            `;
        }
        
        if (currentUser.dashboard === 'operativo' || currentUser.access === 'admin') {
            metricsHTML += `
                <div class="metric">
                    <div class="metric-label">PAC 2026</div>
                    <div class="metric-value">EN CURSO</div>
                </div>
            `;
        }
    }
    
    sidebar.innerHTML = metricsHTML;
    document.body.appendChild(sidebar);
}

// ── LOGOUT ──────────────────────────────────────────────────────────────────
function logout() {
    localStorage.removeItem('oasys_user');
    currentUser = {
        name: null,
        email: null,
        intent: null,
        role: null,
        access: 'public',
        dashboard: null,
        timestamp: null
    };
    location.reload();
}

// ── INIT ────────────────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
    loadSavedUser();
});
