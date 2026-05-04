// team-identification.js
// Sistema de identificación de equipo OASYS - Signing Party
// Detecta miembros del equipo y ofrece acceso personalizado a documentos

class TeamIdentification {
  constructor() {
    // Lista de miembros del equipo (información institucional pública)
    this.teamMembers = {
      // TRACK A · YUNCLILLOS
      'leonardo': {
        name: 'Leonardo Muñoz Pérez',
        role: 'Titular único · Joven Agricultor',
        track: 'A',
        documents: [
          'PAC 2026 - Nº1557969/2026',
          'RETA - NAF 281333621614',
          'APIAC - Curso 150h',
          'Escritura - 15/05/2026'
        ],
        welcomeMessage: '¡Hola Leonardo! Tu visión regenerativa está tomando forma.'
      },
      'roberto': {
        name: 'Roberto Muñoz Pérez',
        role: 'Copropietario 50% · Arrendador rústico',
        track: 'A',
        documents: [
          'Contrato arrendamiento',
          'Escritura - 15/05/2026'
        ],
        welcomeMessage: '¡Hola Roberto! Gracias por confiar en este proyecto.'
      },
      'paco': {
        name: 'Paco Yuste (Francisco Javier)',
        role: 'Ing. Agrónomo Col.2758',
        track: 'A',
        documents: [
          'Diseño agroforestal',
          'Planificación cultivos',
          'Sistema BSG'
        ],
        welcomeMessage: '¡Hola Paco! Tu ingeniería está dando vida a la tierra.'
      },
      'sergio': {
        name: 'Sergio Puertas',
        role: 'Vendedor · Coordinador',
        track: 'A',
        documents: [
          'Compraventa',
          'Arras',
          'Sentencia'
        ],
        welcomeMessage: '¡Hola Sergio! Gracias por hacer posible este sueño.'
      },

      // TRACK B · OASYS.CAMP
      'francisco': {
        name: 'Francisco García Yuste',
        role: 'Empresario · 14ha contiguas',
        track: 'B',
        documents: [
          'Factura BSG-2026-013',
          'Plaza 13 SEMILLA',
          'Candidato Nodo 02'
        ],
        welcomeMessage: '¡Hola Francisco! Tu apoyo es fundamental para OASYS.CAMP.'
      },
      'antonio': {
        name: 'Antonio Muñoz Yuste',
        role: 'Director Creativo',
        track: 'B',
        documents: [
          'Diseño visual',
          'Sistema iconográfico',
          'oasys.earth'
        ],
        welcomeMessage: '¡Hola Antonio! Tu creatividad está dando forma a nuestra identidad.'
      }
    };

    this.currentUser = null;
    this.init();
  }

  init() {
    this.createIdentificationUI();
    this.checkStoredIdentity();
    console.log('👥 Sistema de identificación de equipo OASYS activado');
  }

  createIdentificationUI() {
    // Crear modal de identificación
    const modal = document.createElement('div');
    modal.id = 'team-identification-modal';
    modal.innerHTML = `
      <div class="ti-overlay" id="ti-overlay"></div>
      <div class="ti-modal" id="ti-modal">
        <div class="ti-header">
          <h2>👋 Identificación OASYS</h2>
          <button class="ti-close" onclick="teamIdentification.closeModal()">✕</button>
        </div>
        <div class="ti-content">
          <div class="ti-intro">
            <p>¿Eres miembro del equipo OASYS?</p>
            <p class="ti-sub">Identifícate para acceder a los documentos construidos bajo tu supervisión.</p>
          </div>

          <div class="ti-form">
            <input
              type="text"
              id="ti-identifier"
              placeholder="Tu nombre o email..."
              onkeypress="if(event.key === 'Enter') teamIdentification.identify()"
            />
            <button onclick="teamIdentification.identify()" class="ti-identify-btn">
              Identificarse
            </button>
          </div>

          <div class="ti-team-list">
            <p class="ti-team-title">Miembros del equipo:</p>
            <div class="ti-members">
              ${this.getTeamMembersList()}
            </div>
          </div>

          <div class="ti-footer">
            <p class="ti-note">
              🔒 Solo información institucional pública · Transparencia reciproca activa
            </p>
          </div>
        </div>
      </div>
    `;

    // Añadir estilos
    const style = document.createElement('style');
    style.textContent = `
      #team-identification-modal {
        position: fixed;
        inset: 0;
        z-index: 1000;
        display: none;
      }

      #team-identification-modal.active {
        display: block;
      }

      .ti-overlay {
        position: fixed;
        inset: 0;
        background: rgba(6, 13, 8, 0.9);
        backdrop-filter: blur(10px);
      }

      .ti-modal {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 90%;
        max-width: 500px;
        background: rgba(6, 13, 8, 0.95);
        border: 1px solid rgba(0, 212, 170, 0.3);
        border-radius: 8px;
        z-index: 1001;
        overflow: hidden;
        box-shadow: 0 0 40px rgba(0, 212, 170, 0.1);
      }

      .ti-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 20px;
        border-bottom: 1px solid rgba(0, 212, 170, 0.2);
        background: rgba(0, 212, 170, 0.05);
      }

      .ti-header h2 {
        margin: 0;
        font-family: 'Orbitron', sans-serif;
        font-size: 14px;
        color: #00D4AA;
        letter-spacing: 0.08em;
      }

      .ti-close {
        background: none;
        border: none;
        color: rgba(245, 240, 232, 0.5);
        font-size: 18px;
        cursor: pointer;
        padding: 4px;
        transition: color 0.2s;
      }

      .ti-close:hover {
        color: #C9A84C;
      }

      .ti-content {
        padding: 20px;
      }

      .ti-intro {
        text-align: center;
        margin-bottom: 24px;
      }

      .ti-intro p {
        font-size: 14px;
        color: rgba(245, 240, 232, 0.9);
        margin-bottom: 8px;
      }

      .ti-sub {
        font-size: 12px !important;
        color: rgba(245, 240, 232, 0.6) !important;
      }

      .ti-form {
        display: flex;
        gap: 10px;
        margin-bottom: 24px;
      }

      .ti-form input {
        flex: 1;
        background: rgba(0, 212, 170, 0.05);
        border: 1px solid rgba(0, 212, 170, 0.2);
        border-radius: 4px;
        padding: 12px 16px;
        color: #F5F0E8;
        font-family: 'IBM Plex Mono', monospace;
        font-size: 13px;
        outline: none;
        transition: border-color 0.2s;
      }

      .ti-form input:focus {
        border-color: rgba(0, 212, 170, 0.5);
      }

      .ti-form input::placeholder {
        color: rgba(245, 240, 232, 0.3);
      }

      .ti-identify-btn {
        background: rgba(0, 212, 170, 0.15);
        border: 1px solid rgba(0, 212, 170, 0.3);
        color: #00D4AA;
        padding: 12px 20px;
        font-family: 'Orbitron', sans-serif;
        font-size: 11px;
        letter-spacing: 0.08em;
        cursor: pointer;
        border-radius: 4px;
        transition: all 0.2s;
      }

      .ti-identify-btn:hover {
        background: rgba(0, 212, 170, 0.25);
        border-color: #00D4AA;
      }

      .ti-team-list {
        margin-bottom: 20px;
      }

      .ti-team-title {
        font-family: 'Orbitron', sans-serif;
        font-size: 10px;
        color: rgba(245, 240, 232, 0.5);
        letter-spacing: 0.1em;
        margin-bottom: 12px;
        text-transform: uppercase;
      }

      .ti-members {
        display: grid;
        gap: 8px;
      }

      .ti-member {
        background: rgba(0, 212, 170, 0.03);
        border: 1px solid rgba(0, 212, 170, 0.1);
        padding: 10px 12px;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .ti-member:hover {
        background: rgba(0, 212, 170, 0.08);
        border-color: rgba(0, 212, 170, 0.3);
      }

      .ti-member-name {
        font-family: 'Orbitron', sans-serif;
        font-size: 11px;
        color: #00D4AA;
        letter-spacing: 0.06em;
        margin-bottom: 4px;
      }

      .ti-member-role {
        font-size: 11px;
        color: rgba(245, 240, 232, 0.6);
      }

      .ti-member-track {
        display: inline-block;
        margin-top: 6px;
        padding: 2px 8px;
        font-size: 9px;
        letter-spacing: 0.08em;
        border-radius: 2px;
        font-family: 'Orbitron', sans-serif;
      }

      .ti-member-track.a {
        background: rgba(0, 212, 170, 0.1);
        color: #00D4AA;
        border: 1px solid rgba(0, 212, 170, 0.2);
      }

      .ti-member-track.b {
        background: rgba(201, 168, 76, 0.1);
        color: #C9A84C;
        border: 1px solid rgba(201, 168, 76, 0.2);
      }

      .ti-footer {
        text-align: center;
        padding-top: 16px;
        border-top: 1px solid rgba(0, 212, 170, 0.1);
      }

      .ti-note {
        font-size: 10px;
        color: rgba(245, 240, 232, 0.4);
        margin: 0;
      }

      /* Welcome message styles */
      .ti-welcome {
        text-align: center;
        padding: 20px;
      }

      .ti-welcome h3 {
        font-family: 'Orbitron', sans-serif;
        font-size: 18px;
        color: #00D4AA;
        margin-bottom: 12px;
      }

      .ti-welcome p {
        font-size: 14px;
        color: rgba(245, 240, 232, 0.8);
        margin-bottom: 20px;
        line-height: 1.6;
      }

      .ti-documents {
        background: rgba(0, 212, 170, 0.05);
        border: 1px solid rgba(0, 212, 170, 0.15);
        border-radius: 6px;
        padding: 16px;
        margin-bottom: 20px;
      }

      .ti-documents h4 {
        font-family: 'Orbitron', sans-serif;
        font-size: 11px;
        color: #00D4AA;
        letter-spacing: 0.08em;
        margin-bottom: 12px;
      }

      .ti-doc-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .ti-doc-list li {
        padding: 8px 0;
        border-bottom: 1px solid rgba(0, 212, 170, 0.1);
        font-size: 12px;
        color: rgba(245, 240, 232, 0.8);
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .ti-doc-list li:last-child {
        border-bottom: none;
      }

      .ti-doc-list li::before {
        content: '📄';
      }

      .ti-actions {
        display: flex;
        gap: 10px;
        justify-content: center;
      }

      .ti-action-btn {
        background: rgba(0, 212, 170, 0.1);
        border: 1px solid rgba(0, 212, 170, 0.3);
        color: #00D4AA;
        padding: 10px 20px;
        font-family: 'Orbitron', sans-serif;
        font-size: 10px;
        letter-spacing: 0.08em;
        cursor: pointer;
        border-radius: 4px;
        transition: all 0.2s;
      }

      .ti-action-btn:hover {
        background: rgba(0, 212, 170, 0.2);
        border-color: #00D4AA;
      }

      .ti-action-btn.secondary {
        background: rgba(201, 168, 76, 0.1);
        border-color: rgba(201, 168, 76, 0.3);
        color: #C9A84C;
      }

      .ti-action-btn.secondary:hover {
        background: rgba(201, 168, 76, 0.2);
        border-color: #C9A84C;
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(modal);
  }

  getTeamMembersList() {
    return Object.entries(this.teamMembers)
      .map(([key, member]) => `
        <div class="ti-member" onclick="teamIdentification.identifyMember('${key}')">
          <div class="ti-member-name">${member.name}</div>
          <div class="ti-member-role">${member.role}</div>
          <div class="ti-member-track ${member.track.toLowerCase()}">TRACK ${member.track}</div>
        </div>
      `).join('');
  }

  identify() {
    const identifier = document.getElementById('ti-identifier').value.trim().toLowerCase();
    this.findAndShowMember(identifier);
  }

  identifyMember(key) {
    this.findAndShowMember(key);
  }

  findAndShowMember(identifier) {
    // Buscar por nombre, email o key
    const memberKey = Object.keys(this.teamMembers).find(key => {
      const member = this.teamMembers[key];
      return key === identifier ||
             member.name.toLowerCase().includes(identifier) ||
             identifier.includes(member.name.toLowerCase());
    });

    if (memberKey) {
      this.showWelcomeMessage(this.teamMembers[memberKey], memberKey);
    } else {
      this.showNotFoundMessage(identifier);
    }
  }

  showWelcomeMessage(member, key) {
    this.currentUser = { key, ...member };

    // Guardar en localStorage
    localStorage.setItem('oasys_team_identity', JSON.stringify({
      key,
      timestamp: new Date().toISOString()
    }));

    // Actualizar modal con mensaje de bienvenida
    const modal = document.getElementById('ti-modal');
    modal.innerHTML = `
      <div class="ti-header">
        <h2>🎉 ¡Bienvenido de nuevo!</h2>
        <button class="ti-close" onclick="teamIdentification.closeModal()">✕</button>
      </div>
      <div class="ti-content">
        <div class="ti-welcome">
          <h3>${member.welcomeMessage}</h3>
          <p>
            <strong>${member.name}</strong><br>
            <span style="color: rgba(245, 240, 232, 0.6);">${member.role}</span>
          </p>
        </div>

        <div class="ti-documents">
          <h4>📋 Documentos bajo tu supervisión:</h4>
          <ul class="ti-doc-list">
            ${member.documents.map(doc => `<li>${doc}</li>`).join('')}
          </ul>
        </div>

        <div class="ti-actions">
          <button class="ti-action-btn" onclick="teamIdentification.accessDocuments()">
            Acceder a documentos
          </button>
          <button class="ti-action-btn secondary" onclick="teamIdentification.closeModal()">
            Continuar explorando
          </button>
        </div>

        <div class="ti-footer">
          <p class="ti-note">
            🔒 Solo información institucional pública · Transparencia reciproca activa
          </p>
        </div>
      </div>
    `;

    // Trackear evento de identificación
    if (window.analytics) {
      window.analytics.trackEvent('team_member_identified', {
        track: member.track,
        member_key: key,
        member_name: member.name,
        timestamp: new Date().toISOString(),
        institutional_only: true
      });
    }

    console.log(`👥 Miembro del equipo identificado: ${member.name} (Track ${member.track})`);
  }

  showNotFoundMessage(identifier) {
    const modal = document.getElementById('ti-modal');
    modal.innerHTML = `
      <div class="ti-header">
        <h2>🤔 No encontrado</h2>
        <button class="ti-close" onclick="teamIdentification.closeModal()">✕</button>
      </div>
      <div class="ti-content">
        <div class="ti-welcome">
          <p>
            No encontramos a "<strong>${identifier}</strong>" en nuestro equipo.
          </p>
          <p style="color: rgba(245, 240, 232, 0.6); font-size: 13px;">
            Si eres miembro del equipo, por favor contacta con el administrador.
          </p>
        </div>

        <div class="ti-actions">
          <button class="ti-action-btn secondary" onclick="teamIdentification.resetModal()">
            Intentar de nuevo
          </button>
          <button class="ti-action-btn" onclick="teamIdentification.closeModal()">
            Continuar como visitante
          </button>
        </div>
      </div>
    `;
  }

  accessDocuments() {
    if (this.currentUser) {
      // Aquí se implementaría la lógica para acceder a los documentos
      alert(`📋 Acceso a documentos para ${this.currentUser.name}\n\nEsta funcionalidad se implementará próximamente para la Signing Party del 15/05/2026.`);

      // Trackear evento de acceso a documentos
      if (window.analytics) {
        window.analytics.trackEvent('documents_access_requested', {
          track: this.currentUser.track,
          member_key: this.currentUser.key,
          documents_count: this.currentUser.documents.length,
          timestamp: new Date().toISOString(),
          institutional_only: true
        });
      }
    }
  }

  checkStoredIdentity() {
    const stored = localStorage.getItem('oasys_team_identity');
    if (stored) {
      try {
        const identity = JSON.parse(stored);
        const member = this.teamMembers[identity.key];
        if (member) {
          // Mostrar botón de identificación en el header
          this.addIdentityButton(member);
        }
      } catch (e) {
        console.error('Error al leer identidad almacenada:', e);
      }
    }
  }

  addIdentityButton(member) {
    // Añadir botón de identidad en el header
    const header = document.getElementById('header');
    if (header) {
      const button = document.createElement('button');
      button.className = 'ti-identity-btn';
      button.innerHTML = `👋 ${member.name.split(' ')[0]}`;
      button.onclick = () => this.openModal();
      button.style.cssText = `
        background: rgba(0, 212, 170, 0.1);
        border: 1px solid rgba(0, 212, 170, 0.3);
        color: #00D4AA;
        padding: 8px 16px;
        font-family: 'Orbitron', sans-serif;
        font-size: 10px;
        letter-spacing: 0.08em;
        cursor: pointer;
        border-radius: 3px;
        transition: all 0.2s;
      `;
      header.appendChild(button);
    }
  }

  openModal() {
    const modal = document.getElementById('team-identification-modal');
    if (modal) {
      modal.classList.add('active');
    }
  }

  closeModal() {
    const modal = document.getElementById('team-identification-modal');
    if (modal) {
      modal.classList.remove('active');
    }
  }

  resetModal() {
    // Recrear el modal original
    const modal = document.getElementById('team-identification-modal');
    if (modal) {
      modal.remove();
      this.createIdentificationUI();
      this.openModal();
    }
  }

  // Método para verificar si el usuario actual es miembro del equipo
  isTeamMember() {
    return this.currentUser !== null;
  }

  // Método para obtener información del usuario actual
  getCurrentUser() {
    return this.currentUser;
  }
}

// Inicializar sistema de identificación
const teamIdentification = new TeamIdentification();
window.teamIdentification = teamIdentification;

// Exponer función global para abrir el modal
window.openTeamIdentification = function() {
  teamIdentification.openModal();
};