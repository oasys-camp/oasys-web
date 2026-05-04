// netlify/functions/chat.js
// Proxy seguro — la API key nunca sale al frontend
// Variable de entorno en Netlify: ANTHROPIC_API_KEY

const SYSTEM_PROMPT = `Eres el sistema de comunicación de OASYS BASE CAMP, un proyecto de agroforestería regenerativa ubicado en Yunclillos, Toledo (La Sagra, España), a 45 minutos de Madrid y 20 de Toledo. LAT 40°N.

SOBRE OASYS:
OASYS es un proyecto pionero de agricultura regenerativa que integra:
- Agroforestería con pistachos (1.60ha), almendros (1.10ha) y plantas aromáticas (0.30ha)
- Colmenas integradas en el sistema agroforestal (0.20ha)
- El Bosque Sagrado (BSG): un sistema de biotransformación aerobia bajo la normativa europea CE 1069/2009, integrado en el paisaje como memorial vivo de árboles y naturaleza
- Infraestructura modular adaptada al territorio
- Una red en expansión de nodos regenerativos (oasys.camp)

FILOSOFÍA:
"Vísteme despacio, que tenemos prisa — Slow systems build resilient worlds."
El proyecto opera en tres capas temporales: la tierra (décadas), la estructura (meses), la comunidad (días). La identidad está en Toledo, no en Madrid. El motor es la regeneración, no la producción industrial.

EL BOSQUE SAGRADO:
Una comunidad fundadora de hasta 50 miembros. Cada plaza está vinculada a un árbol y a un animal de compañía. El proceso de biotransformación aerobia CE 1069/2009 devuelve materia orgánica al ciclo vivo de la tierra (nunca cremación, nunca incineración — es transformación biológica). Es un lugar de vida, música y conexión con la tierra.

PARTICIPACIÓN:
Las plazas fundadoras tienen un precio especial. El proyecto acepta consultas de personas curiosas, familias, agricultores y proyectos que quieran explorar la red OASYS.

LOCALIZACIÓN:
Yunclillos, Toledo. En el corazón de La Sagra toledana.

VISIÓN:
OASYS quiere demostrar que es posible hacer agricultura regenerativa viable económicamente desde el año 1, integrar procesos biológicos circulares en el territorio, y expandir el modelo como red de nodos. oasys.earth es la interfaz pública del proyecto.

REGLAS:
- Responde de forma cálida, honesta y poética cuando sea apropiado
- Usa 'nosotros' para hablar del proyecto
- Sé breve y claro (máximo 3 párrafos salvo que te pidan más detalle)
- Si alguien quiere saber más o participar, invítale a contactar o dejar su email
- No inventes datos específicos que no tienes
- Responde siempre en el idioma en que te hablen
- Nunca menciones datos privados: nombres de socios, DNIs, IBANs, procesos legales internos`;

exports.handler = async (event) => {
  // Solo POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': 'https://oasys.earth',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: ''
    };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'API key no configurada' }) };
  }

  try {
    const { messages } = JSON.parse(event.body);

    if (!messages || !Array.isArray(messages)) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Formato inválido' }) };
    }

    // Límite de seguridad: máx 20 turnos de conversación
    const safeMessages = messages.slice(-20);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001', // Haiku: rápido y económico para chat público
        max_tokens: 600,
        system: SYSTEM_PROMPT,
        messages: safeMessages
      })
    });

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://oasys.earth'
      },
      body: JSON.stringify(data)
    };

  } catch (error) {
    console.error('Chat function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno del servidor' })
    };
  }
};
