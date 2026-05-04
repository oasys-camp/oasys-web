// transparency-panel.js
// Panel de transparencia reciproca - OASYS
// Muestra SOLO información institucional trackeada

class TransparencyPanel {
  constructor() {
    this.panel = null;
    this.init();
  }

  init() {
    this.createPanel();
    this.setupKeyboardShortcut();
    console.log('🔍 Panel de Transparencia Reciproca activado');
    console.log('Presiona Ctrl+Shift+T para abrir el panel');
  }

  createPanel() {
    // Crear panel flotante
    const panel = document.createElement('div');
    panel.id = 'transparency-panel';
    panel.innerHTML = `
      <div class="tp-header">
        <h3>🔍 Transparencia Reciproca</h3>
        <button class="tp-close" onclick="transparencyPanel.toggle()">✕</button>
      </div>
      <div class="tp-content">
        <div class="tp-section">
          <h4>📊 Datos Institucionales Trackeados</h4>
          <div class="tp-info">
            <p><strong>REGLA CRÍTICA:</strong> Solo información institucional pública</p>
            <p><strong>NO capturamos:</strong></p>
            <ul>
              <li>❌ Contenido de mensajes del chat</li>
              <li>❌ Emails reales de usuarios</li>
              <li>❌ Datos estratégicos pendientes de confirmación</li>
              <li>❌ Información empresarial sensible</li>
            </ul>
            <p><strong>SÍ capturamos (metadatos institucionales):</strong></p>
            <ul>
              <li>✅ Número de interacciones con el chat</li>
              <li>✅ Longitud de mensajes (sin contenido)</li>
              <li>✅ Tiempos de respuesta</li>
              <li>✅ Interacciones con la esfera 3D</li>
              <li>✅ Confirmación de captura de email (sin email)</li>
            </ul>
          </div>
        </div>

        <div class="tp-section">
          <h4>🎯 Tracks OASYS</h4>
          <div class="tp-tracks">
            <div class="tp-track">
              <strong>TRACK A · YUNCLILLOS</strong>
              <p>Operativo Leonardo · REA · PAC · RETA</p>
            </div>
            <div class="tp-track">
              <strong>TRACK B · OASYS.CAMP</strong>
              <p>Creatividad & Dreams · SA · PI · Franquicia</p>
            </div>
          </div>
        </div>

        <div class="tp-section">
          <h4>👥 Identificación del Equipo</h4>
          <div class="tp-identity" id="tp-identity-data">
            <p id="tp-identity-status">Cargando estado...</p>
          </div>
        </div>

        <div class="tp-section">
          <h4>📈 Sesión Actual</h4>
          <div class="tp-session" id="tp-session-data">
            <p>Cargando datos...</p>
          </div>
        </div>

        <div class="tp-section">
          <h4>🔧 Herramientas</h4>
          <div class="tp-tools">
            <button onclick="transparencyPanel.refreshSession()">🔄 Actualizar datos</button>
            <button onclick="transparencyPanel.exportData()">📥 Exportar JSON</button>
            <button onclick="transparencyPanel.clearSession()">🗑️ Limpiar sesión</button>
          </div>
        </div>
      </div>
    `;

    // Añadir estilos
    const style = document.createElement('style');
    style.textContent = `
      #transparency-panel {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 90%;
        max-width: 600px;
        max-height: 80vh;
        background: rgba(6, 13, 8, 0.95);
        border: 1px solid rgba(0, 212, 170, 0.3);
        border-radius: 8px;
        z-index: 10000;
        display: none;
        overflow: hidden;
        backdrop-filter: blur(20px);
        box-shadow: 0 0 40px rgba(0, 212, 170, 0.1);
      }

      #transparency-panel.active {
        display: block;
      }

      .tp-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 20px;
        border-bottom: 1px solid rgba(0, 212, 170, 0.2);
        background: rgba(0, 212, 170, 0.05);
      }

      .tp-header h3 {
        margin: 0;
        font-family: 'Orbitron', sans-serif;
        font-size: 14px;
        color: #00D4AA;
        letter-spacing: 0.1em;
      }

      .tp-close {
        background: none;
        border: none;
        color: rgba(245, 240, 232, 0.5);
        font-size: 18px;
        cursor: pointer;
        padding: 4px;
        transition: color 0.2s;
      }

      .tp-close:hover {
        color: #C9A84C;
      }

      .tp-content {
        padding: 20px;
        overflow-y: auto;
        max-height: calc(80vh - 60px);
      }

      .tp-section {
        margin-bottom: 24px;
      }

      .tp-section h4 {
        font-family: 'Orbitron', sans-serif;
        font-size: 11px;
        color: #00D4AA;
        letter-spacing: 0.08em;
        margin-bottom: 12px;
        padding-bottom: 8px;
        border-bottom: 1px solid rgba(0, 212, 170, 0.15);
      }

      .tp-info p {
        font-size: 12px;
        color: rgba(245, 240, 232, 0.8);
        margin-bottom: 8px;
        line-height: 1.5;
      }

      .tp-info ul {
        margin: 8px 0;
        padding-left: 20px;
      }

      .tp-info li {
        font-size: 11px;
        color: rgba(245, 240, 232, 0.7);
        margin-bottom: 4px;
      }

      .tp-tracks {
        display: grid;
        gap: 12px;
      }

      .tp-track {
        background: rgba(0, 212, 170, 0.05);
        border: 1px solid rgba(0, 212, 170, 0.15);
        padding: 12px;
        border-radius: 4px;
      }

      .tp-track strong {
        display: block;
        font-family: 'Orbitron', sans-serif;
        font-size: 10px;
        color: #00D4AA;
        letter-spacing: 0.08em;
        margin-bottom: 6px;
      }

      .tp-track p {
        font-size: 11px;
        color: rgba(245, 240, 232, 0.6);
        margin: 0;
      }

      .tp-session {
        background: rgba(201, 168, 76, 0.05);
        border: 1px solid rgba(201, 168, 76, 0.15);
        padding: 12px;
        border-radius: 4px;
        font-family: 'IBM Plex Mono', monospace;
        font-size: 10px;
        color: rgba(245, 240, 232, 0.7);
        white-space: pre-wrap;
        max-height: 200px;
        overflow-y: auto;
      }

      .tp-identity {
        background: rgba(0, 212, 170, 0.05);
        border: 1px solid rgba(0, 212, 170, 0.15);
        padding: 12px;
        border-radius: 4px;
        font-size: 11px;
        color: rgba(245, 240, 232, 0.8);
        line-height: 1.6;
      }

      .tp-tools {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      .tp-tools button {
        background: rgba(0, 212, 170, 0.1);
        border: 1px solid rgba(0, 212, 170, 0.3);
        color: #00D4AA;
        padding: 8px 12px;
        font-family: 'Orbitron', sans-serif;
        font-size: 9px;
        letter-spacing: 0.08em;
        cursor: pointer;
        border-radius: 3px;
        transition: all 0.2s;
      }

      .tp-tools button:hover {
        background: rgba(0, 212, 170, 0.2);
        border-color: #00D4AA;
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(panel);
    this.panel = panel;
  }

  setupKeyboardShortcut() {
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        this.toggle();
      }
    });
  }

  toggle() {
    if (this.panel) {
      this.panel.classList.toggle('active');
      if (this.panel.classList.contains('active')) {
        this.refreshSession();
      }
    }
  }

  refreshSession() {
    if (window.analytics) {
      const sessionData = window.analytics.getSessionData();
      const sessionElement = document.getElementById('tp-session-data');
      if (sessionElement) {
        sessionElement.textContent = JSON.stringify(sessionData, null, 2);
      }
    }

    // Actualizar información de identificación del equipo
    this.updateIdentityInfo();
  }

  updateIdentityInfo() {
    const identityElement = document.getElementById('tp-identity-status');
    if (identityElement && window.teamIdentification) {
      const currentUser = window.teamIdentification.getCurrentUser();
      if (currentUser) {
        identityElement.innerHTML = `
          <strong>✅ Miembro del equipo identificado:</strong><br>
          <span style="color: #00D4AA;">${currentUser.name}</span><br>
          <span style="color: rgba(245, 240, 232, 0.6);">${currentUser.role}</span><br>
          <span style="color: #C9A84C;">TRACK ${currentUser.track}</span><br>
          <span style="font-size: 10px; color: rgba(245, 240, 232, 0.4);">Documentos bajo supervisión: ${currentUser.documents.length}</span>
        `;
      } else {
        identityElement.innerHTML = `
          <strong>👤 Visitante</strong><br>
          <span style="color: rgba(245, 240, 232, 0.6);">No identificado como miembro del equipo</span><br>
          <span style="font-size: 10px; color: rgba(245, 240, 232, 0.4);">Presiona "👥 Equipo" para identificarte</span>
        `;
      }
    }
  }

  exportData() {
    if (window.analytics) {
      window.analytics.exportSessionData();
    }
  }

  clearSession() {
    if (confirm('¿Estás seguro de que quieres limpiar los datos de sesión local?')) {
      localStorage.removeItem('oasys_analytics_session');
      this.refreshSession();
      console.log('🗑️ Sesión local limpiada');
    }
  }
}

// Inicializar panel de transparencia
const transparencyPanel = new TransparencyPanel();
window.transparencyPanel = transparencyPanel;