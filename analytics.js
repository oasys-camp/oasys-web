// analytics.js
// Sistema de tracking OASYS - Transparencia Reciproca
// SOLO INFORMACIÓN INSTITUCIONAL PÚBLICA
// Mantiene 2 tracks bien definidas: Track A (Yunclillos) + Track B (OASYS.CAMP)

class OasysAnalytics {
  constructor() {
    this.trackA = 'YUNCLILLOS'; // Track A: Operativo Leonardo
    this.trackB = 'OASYS_CAMP';  // Track B: Creatividad & Dreams
    this.ga4Id = 'G-NMC1GS2WDW';
    this.gtmId = 'GTM-5T2LL98X';
    this.sessionId = this.generateSessionId();
    this.institutionalOnly = true; // REGLA CRÍTICA: Solo info institucional
    this.init();
  }

  generateSessionId() {
    return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  init() {
    // Google Analytics 4
    this.loadGA4();

    // Google Tag Manager
    this.loadGTM();

    // Eventos personalizados
    this.setupCustomEvents();

    console.log('📊 OASYS Analytics inicializado - Transparencia Reciproca activa');
  }

  loadGA4() {
    // GA4 ya cargado via GTM, pero añadimos configuración adicional
    if (typeof gtag !== 'undefined') {
      gtag('config', this.ga4Id, {
        'send_page_view': false,
        'custom_map': {
          'dimension1': 'track_type',
          'dimension2': 'session_id',
          'dimension3': 'user_type'
        }
      });
    }
  }

  loadGTM() {
    // GTM ya cargado en el HTML principal
    (function(w,d,s,l,i){
      w[l]=w[l]||[];
      w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
      var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),
          dl=l!='dataLayer'?'&l='+l:'';
      j.async=true;
      j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
      f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer',this.gtmId);
  }

  setupCustomEvents() {
    // Track page view con metadata de tracks
    this.trackPageView();

    // Track eventos de chat
    this.trackChatEvents();

    // Track interacciones con la esfera 3D
    this.trackSphereEvents();
  }

  trackPageView() {
    const pageData = {
      track_type: 'BOTH', // Ambos tracks activos
      session_id: this.sessionId,
      user_type: 'anonymous',
      page_title: document.title,
      page_location: window.location.href,
      timestamp: new Date().toISOString()
    };

    if (typeof gtag !== 'undefined') {
      gtag('event', 'page_view', {
        'track_type': 'BOTH',
        'session_id': this.sessionId,
        'user_type': 'anonymous'
      });
    }

    // Push a dataLayer para GTM
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'oasys_page_view',
      ...pageData
    });
  }

  trackChatEvents() {
    // Evento: Chat iniciado (SOLO metadatos institucionales)
    this.trackEvent('chat_started', {
      track: this.trackB, // Chat pertenece a Track B
      session_id: this.sessionId,
      timestamp: new Date().toISOString(),
      institutional_only: true
    });

    // Evento: Mensaje enviado (SOLO metadatos, sin contenido)
    const originalSendMessage = window.sendMessage;
    if (typeof originalSendMessage === 'function') {
      window.sendMessage = function() {
        const result = originalSendMessage.apply(this, arguments);
        // SOLO metadatos institucionales - NO contenido del mensaje
        analytics.trackEvent('chat_message_sent', {
          track: analytics.trackB,
          session_id: analytics.sessionId,
          message_length: document.getElementById('user-input')?.value?.length || 0,
          timestamp: new Date().toISOString(),
          institutional_only: true,
          note: 'Solo metadatos - sin contenido estratégico'
        });
        return result;
      };
    }

    // Evento: Respuesta recibida (SOLO metadatos)
    this.trackEvent('chat_response_received', {
      track: this.trackB,
      session_id: this.sessionId,
      timestamp: new Date().toISOString(),
      institutional_only: true
    });

    // Evento: Email capturado (SOLO confirmación, sin email real)
    const originalCaptureEmail = window.captureEmail;
    if (typeof originalCaptureEmail === 'function') {
      window.captureEmail = function() {
        const result = originalCaptureEmail.apply(this, arguments);
        // SOLO confirmación de captura - NO email real
        analytics.trackEvent('email_captured', {
          track: this.trackB,
          session_id: analytics.sessionId,
          timestamp: new Date().toISOString(),
          institutional_only: true,
          note: 'Solo confirmación - sin email real'
        });
        return result;
      };
    }
  }

  trackSphereEvents() {
    // Evento: Interacción con esfera 3D
    let lastInteraction = null;

    document.addEventListener('mousemove', (e) => {
      const now = Date.now();
      if (!lastInteraction || now - lastInteraction > 5000) { // Cada 5 segundos
        this.trackEvent('sphere_interaction', {
          track: 'BOTH',
          session_id: this.sessionId,
          mouse_position: { x: e.clientX, y: e.clientY },
          timestamp: new Date().toISOString()
        });
        lastInteraction = now;
      }
    });
  }

  trackEvent(eventName, eventData = {}) {
    const enrichedData = {
      ...eventData,
      track_type: eventData.track || 'BOTH',
      session_id: this.sessionId,
      timestamp: new Date().toISOString(),
      platform: 'oasys.earth'
    };

    // GA4
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        'track_type': enrichedData.track_type,
        'session_id': enrichedData.session_id,
        'custom_parameter': JSON.stringify(enrichedData)
      });
    }

    // GTM dataLayer
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'oasys_' + eventName,
      ...enrichedData
    });

    // Console para transparencia reciproca
    console.log(`📊 [${eventName}]`, enrichedData);
  }

  // Método para transparencia reciproca - obtener datos de sesión
  getSessionData() {
    return {
      session_id: this.sessionId,
      track_a: this.trackA,
      track_b: this.trackB,
      ga4_id: this.ga4Id,
      gtm_id: this.gtmId,
      events_tracked: this.getTrackedEvents(),
      timestamp: new Date().toISOString()
    };
  }

  getTrackedEvents() {
    // Obtener eventos del dataLayer
    if (window.dataLayer) {
      return window.dataLayer
        .filter(item => item.event && item.event.startsWith('oasys_'))
        .map(item => ({
          event: item.event,
          timestamp: item.timestamp,
          track: item.track_type
        }));
    }
    return [];
  }

  // Método para exportar datos (transparencia)
  exportSessionData() {
    const data = this.getSessionData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `oasys_analytics_${this.sessionId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

// Inicializar analytics globalmente
const analytics = new OasysAnalytics();

// Exponer para transparencia reciproca
window.OasysAnalytics = OasysAnalytics;
window.analytics = analytics;

// Comando para ver datos de sesión (transparencia)
window.showAnalytics = function() {
  console.log('📊 OASYS Analytics - Transparencia Reciproca');
  console.log('Datos de sesión:', analytics.getSessionData());
  console.log('Eventos trackeados:', analytics.getTrackedEvents());
  console.log('Para exportar: analytics.exportSessionData()');
};