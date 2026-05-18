# OASYS EARTH · Cesium Implementation

## 🌍 Archivos Disponibles

### 1. `oasys-earth.html` - Implementación Completa
Sistema completo de visualización geoespacial con:
- **UI completa** (header, nodos, controles, footer)
- **5 nodos configurados** con diferentes alturas y orientaciones
- **Sistema de auto-rotación** con interrupt & resume
- **Inercia kinética** configurable
- **Dynamic fly-in** desde El Bosque Sagrado
- **Integración GeoJSON** avanzada con estilos personalizados
- **Sistema de partículas** para efectos visuales dinámicos
- **Audio ambiental** con Web Audio API
- **Sistema de notificaciones** no intrusivas
- **Logging visual** en tiempo real
- **Herramientas de debugging** completas

### 2. `preview_singularidad.html` - Prototipo Visual Standalone
Prototipo minimalista para validación creativa:
- **Fondo negro puro** - Sin distracciones
- **Headless viewer** - Sin interfaces de usuario
- **Auto-rotación lenta** - Movimiento orgánico casi imperceptible
- **Estética High Agro Tech** - Saturación reducida, neblina atmosférica
- **Marcador de luz** - Punto pulsante en El Bosque Sagrado
- **Fly-in cinematográfico** - Secuencia de 3 fases desde el espacio

## 🚀 Uso Rápido

### Abrir Directamente en Navegador

Ambos archivos pueden abrirse directamente en el navegador sin necesidad de servidor:

```bash
# Windows
start "" "C:\Users\amyus\Documents\oasys-web\oasys earth\preview_singularidad.html"

# macOS/Linux
open "C:\Users\amyus\Documents\oasys-web\oasys earth\preview_singularidad.html"
```

### Servidor Local (Recomendado para GeoJSON)

Para cargar correctamente los archivos GeoJSON:

```bash
# Python 3
cd "C:\Users\amyus\Documents\oasys-web\oasys earth"
python -m http.server 8000

# Node.js (si tienes http-server instalado)
npx http-server -p 8000

# Abrir en navegador
# http://localhost:8000/preview_singularidad.html
# http://localhost:8000/oasys-earth.html
```

## 🎨 Características del Preview Singularidad

### Estética High Agro Tech

```javascript
// Saturación reducida
viewer.scene.globe.saturation = 0.6;

// Neblina atmosférica
viewer.scene.fog.enabled = true;
viewer.scene.fog.density = 0.0002;

// Atmósfera sutil
viewer.scene.skyAtmosphere.hueShift = -0.1;
viewer.scene.skyAtmosphere.saturationShift = -0.3;
viewer.scene.skyAtmosphere.brightnessShift = -0.2;
```

### Auto-Rotación Orgánica

```javascript
// Velocidad muy lenta para calma
let autoRotationSpeed = 0.000015;

// Inercia suave
sscc.inertiaSpin = 0.92;
sscc.inertiaTranslate = 0.92;
sscc.inertiaZoom = 0.85;
```

### Fly-In Cinematográfico

**Fase 1**: Espacio profundo (20,000km) → Órbita media (5,000km)
- Duración: 6 segundos
- Easing: CUBIC_IN_OUT

**Fase 2**: Órbita media → Vista orbital (3,000km)
- Duración: 4 segundos
- Easing: QUADRATIC_OUT

### Marcador de Luz Pulsante

```javascript
// Punto con pulso orgánico
const pulseSize = 8 + Math.sin(pulseTime) * 2;
const pulseAlpha = 0.8 + Math.sin(pulseTime * 0.5) * 0.2;

// Elipse expansiva
const pulseRadius = 5000 + Math.sin(pulseTime * 0.3) * 500;
```

## 🎯 Características Avanzadas de oasys-earth.html

### Sistema de Partículas

```javascript
// Generar partícula en posición específica
spawnParticle(longitude, latitude, height, type);

// Tipos de partículas:
// - 'life': Partículas de vida (cyan)
// - 'energy': Partículas de energía (dorado)
// - 'data': Partículas de datos (blanco)

// Control desde debugging
window.OASYS_DEBUG.particles.spawn(-3.8, 40.0, 100, 'life');
window.OASYS_DEBUG.particles.count(); // Número de partículas activas
```

### Audio Ambiental

```javascript
// El audio se activa automáticamente con el primer click
// O manualmente:

window.OASYS_DEBUG.audio.enable();  // Activar audio
window.OASYS_DEBUG.audio.disable(); // Desactivar audio
window.OASYS_DEBUG.audio.play('hover'); // Sonido de interacción
```

### Sistema de Notificaciones

```javascript
// Mostrar notificación
window.OASYS_DEBUG.notifications.show('Mensaje', 'info', 4000);

// Tipos: 'info', 'success', 'warning', 'error'

// Limpiar todas las notificaciones
window.OASYS_DEBUG.notifications.clear();
```

### Logging Visual

```javascript
// Añadir entrada al log visual
window.OASYS_DEBUG.log.add('Mensaje del sistema', 'info');

// Tipos: 'info', 'success', 'warning', 'error'

// Limpiar log
window.OASYS_DEBUG.log.clear();
```

### Indicadores de Progreso

```javascript
// Crear indicador de progreso
const indicator = window.OASYS_DEBUG.progress.create('id', 'Cargando...', 100);

// Actualizar progreso
window.OASYS_DEBUG.progress.update('id', 50);

// Eliminar indicador
window.OASYS_DEBUG.progress.remove('id');
```

## 🔧 Configuración

### Token de Cesium Ion

Ambos archivos usan un token de desarrollo. Para producción:

```javascript
// Reemplazar con tu token
Cesium.Ion.defaultAccessToken = 'YOUR_TOKEN_HERE';
```

**Obtener token**:
1. Registrarse en [cesium.com/ion](https://cesium.com/ion/)
2. Crear nuevo token
3. Reemplazar en el código

### Coordenadas del Bosque Sagrado

```javascript
const BOSQUE_SAGRADO = {
    longitude: -3.8,  // 3.8°W
    latitude: 40.0,   // 40°N
    height: 0
};
```

## 🎯 Diferencias Entre Archivos

| Característica | oasys-earth.html | preview_singularidad.html |
|---|---|---|
| **UI Completa** | ✅ | ❌ |
| **Nodos Múltiples** | ✅ (5 nodos) | ❌ (1 marcador) |
| **Controles** | ✅ | ❌ |
| **GeoJSON** | ✅ | ❌ |
| **Debugging** | ✅ | ✅ |
| **Fondo Negro** | ❌ | ✅ |
| **Estética Minimal** | ❌ | ✅ |
| **Fly-in Cinematográfico** | ✅ | ✅ |
| **Auto-rotación** | ✅ | ✅ |
| **Inercia Orgánica** | ✅ | ✅ |

## 🧪 Testing y Validación

### Validación Creativa

```bash
# Abrir preview_singularidad.html
# Observar:
# 1. Fly-in cinematográfico de 3 fases
# 2. Auto-rotación orgánica
# 3. Marcador pulsante en El Bosque Sagrado
# 4. Estética High Agro Tech
# 5. Inercia al interactuar
```

### Testing de Funcionalidades

```javascript
// En consola del navegador
window.SINGULARIDAD_DEBUG.flyToBosque();  // Volar al Bosque
window.SINGULARIDAD_DEBUG.pauseAutoRotation();  // Pausar rotación
window.SINGULARIDAD_DEBUG.resumeAutoRotation();  // Reanudar rotación
```

### Testing de GeoJSON (oasys-earth.html)

```javascript
// En consola del navegador
window.OASYS_DEBUG.loadGeoJSONLayer('./data/oasys-biometricos.geojson', 'Test');
window.OASYS_DEBUG.flyToNode('bsg');  // Volar al Bosque Sagrado
window.OASYS_DEBUG.getCurrentPosition();  // Obtener posición actual
```

## 📊 Datos Biométricos

### Archivo GeoJSON de Ejemplo

`data/oasys-biometricos.geojson` contiene:

- **LAT 40°N**: Nodo piloto con datos de biomasa y biodiversidad
- **El Bosque Sagrado**: Polígono del área con datos de fundadores
- **Proyecto SEMILLA**: Punto de biotransformación con métricas de proceso
- **Earth Mission**: MultiPoint de la red global
- **Conexiones**: LineString de infraestructura
- **NODO**: Punto de infraestructura modular

### Estructura de Datos

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-3.8, 40]
      },
      "properties": {
        "node_id": "lat40n",
        "name": "LAT 40°N",
        "biomass_tons": 1250.5,
        "biodiversity_index": 0.85
      }
    }
  ]
}
```

## 🎨 Personalización

### Ajustar Velocidad de Auto-Rotación

```javascript
// En preview_singularidad.html
let autoRotationSpeed = 0.000015; // Más lento = más calma

// En oasys-earth.html (vía slider)
document.getElementById('rotationSpeed').value = 30; // 0-100%
```

### Modificar Estética High Agro Tech

```javascript
// Más saturación
viewer.scene.globe.saturation = 0.8;

// Más neblina
viewer.scene.fog.density = 0.0003;

// Más brillo
viewer.scene.skyAtmosphere.brightnessShift = 0.1;
```

### Personalizar Fly-In

```javascript
// Más dramático
duration: 10.0,  // Más tiempo
easingFunction: Cesium.EasingFunction.QUARTIC_IN_OUT

// Más rápido
duration: 4.0,
easingFunction: Cesium.EasingFunction.LINEAR_NONE
```

## 🚀 Despliegue

### Netlify

```bash
# Estructura de directorios
oasys-earth/
├── oasys-earth.html
├── preview_singularidad.html
└── data/
    └── oasys-biometricos.geojson

# Deploy
netlify deploy --prod --dir="oasys earth"
```

### GitHub Pages

```bash
# Crear repositorio oasys-earth
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/username/oasys-earth.git
git push -u origin main

# Activar GitHub Pages en Settings
# Acceder: https://username.github.io/oasys-earth/
```

### Servidor Propio

```nginx
server {
    listen 80;
    server_name oasys.earth;

    root /var/www/oasys-earth;
    index preview_singularidad.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

## 📈 Optimización

### Rendimiento

```javascript
// Limitar nivel de detalle
viewer.scene.globe.maximumScreenSpaceError = 4;

// Limitar caché
viewer.scene.globe.tileCacheSize = 500;

// Limitar FPS
viewer.targetFrameRate = 30;
```

### Carga

```javascript
// Desactivar terreno si no es necesario
viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();

// Usar imágenes de menor resolución
viewer.scene.globe.tileCacheSize = 200;
```

## 🐛 Troubleshooting

### El globo no se carga

**Problema**: Token de Cesium inválido o expirado

**Solución**:
```javascript
// Obtener nuevo token en cesium.com/ion
Cesium.Ion.defaultAccessToken = 'NEW_TOKEN_HERE';
```

### GeoJSON no carga

**Problema**: Archivos no accesibles por CORS

**Solución**: Usar servidor local en lugar de abrir directamente

```bash
python -m http.server 8000
```

### Fly-in no funciona

**Problema**: Cesium no ha terminado de cargar

**Solución**: Esperar a que `tileLoadProgressEvent` indique 0 tiles restantes

### Auto-rotación no funciona

**Problema**: Interacción del usuario activa

**Solución**: Esperar 10 segundos de inactividad o usar debugging:

```javascript
window.SINGULARIDAD_DEBUG.resumeAutoRotation();
```

## 📞 Recursos

### Documentación
- [CesiumJS Documentation](https://cesium.com/docs/cesiumjs/)
- [Cesium Ion](https://cesium.com/ion/)
- [Cesium Sandcastle](https://cesium.com/docs/cesiumjs/refdoc/)

### Ejemplos
- [CesiumJS Tutorials](https://cesium.com/learn/)
- [Sandcastle Examples](https://cesium.com/learn/cesiumjs-learn/)
- [CesiumGS GitHub](https://github.com/CesiumGS/cesium)

---

**OASYS BASE CAMP** · Sistema Operativo de la Tierra · Yunclillos, Toledo
*OASYS EARTH · Cesium Implementation · Visualización Geoespacial Avanzada*