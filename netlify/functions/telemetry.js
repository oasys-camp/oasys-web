// netlify/functions/telemetry.js
// Datos públicos del campamento — sin información privada
// Actualizar manualmente o conectar a Supabase en fase 2

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  // FASE 1: datos estáticos actualizados manualmente
  // FASE 2: leer desde Supabase (tabla: telemetria_publica)
  const telemetry = {
    timestamp: new Date().toISOString(),
    proyecto: {
      nombre: 'OASYS BASE CAMP · LAT 40°N',
      ubicacion: 'Yunclillos, Toledo',
      coordenadas: 'LAT 40°N',
      superficie_ha: 3.47,
      inicio_operativo: '2026-04-28' // Alta RETA Leonardo
    },
    cultivos: {
      pistachos_ha: 1.60,
      almendros_ha: 1.10,
      aromaticas_ha: 0.30,
      colmenas_ha: 0.20,
      agroforestal_ha: 0.27,
      total_ha: 3.47,
      primera_cosecha_almendro: 2028,
      primera_cosecha_pistacho: 2033
    },
    bsg: {
      nombre: 'El Bosque Sagrado',
      plazas_total: 50,
      plazas_fundadoras_activas: 13,
      plazas_disponibles: 37,
      precio_fundador_eur: 450,
      precio_publico_futuro_eur: 3500
    },
    hitos: [
      { fecha: '2026-04-28', hito: 'Alta RETA · Inicio operativo oficial', completado: true },
      { fecha: '2026-04-30', hito: 'PAC 2026 · Solicitud presentada', completado: true },
      { fecha: '2026-05-15', hito: 'Escritura notarial · Formalización legal', completado: false },
      { fecha: '2026-05-15', hito: 'Signing Party · Comunidad BSG', completado: false },
      { fecha: '2026-08-01', hito: 'Evento lanzamiento · DJ Tinzo', completado: false },
      { fecha: '2026-12-20', hito: 'Dossier Prima Joven 2027', completado: false }
    ],
    red: {
      nodos_activos: 1,
      nodo_piloto: 'LAT 40°N · Yunclillos',
      proximos_nodos: 'En desarrollo'
    },
    ultima_actualizacion: '2026-05-04'
  };

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600' // Cache 1h
    },
    body: JSON.stringify(telemetry)
  };
};