# OASYS BRAIN · Cesium Implementation Guide

## 🌍 Visión General

Sustitución completa de la implementación Three.js por CesiumJS para visualización geoespacial avanzada de la red OASYS. El nuevo sistema proporciona una representación realista de la Tierra con comportamientos cinéticos sofisticados.

## 🎯 Objetivos Alcanzados

### 1. **Visualización Realista de la Tierra**
- Globo terráqueo con terreno real (World Terrain)
- Iluminación solar realista con day-night cycle
- Atmósfera y skybox realistas
- Sombras y efectos de iluminación

### 2. **Comportamientos Cinéticos Avanzados**

#### Auto-Rotación (Passive State)
- **Implementación**: Rotación continua sobre eje Z
- **Velocidad**: 0.00002 rad/frame (casi imperceptible)
- **Propósito**: Evocar calma y movimiento orgánico
- **Control**: Slider de velocidad en UI (0-100%)

#### Inercia Kinética
- **ScreenSpaceCameraController** configurado con:
  - `inertiaSpin: 0.9` - Inercia en rotación
  - `inertiaTranslate: 0.9` - Inercia en traslación
  - `inertiaZoom: 0.8` - Inercia en zoom
- **Factor de desaceleración**: 0.8-0.99 (configurable)
- **Resultado**: Movimiento orgánico sin detenciones bruscas

#### Dynamic Fly-In
- **Secuencia**: El Bosque Sagrado (100m) → Espacio orbital (5,000km)
- **Duración**: 8 segundos
- **Easing**: CUBIC_IN_OUT para transición suave
- **Orientación final**: Pitch -90° (mirando hacia abajo)

#### Interrupt & Resume
- **Detección**: Mouse down/up, wheel, touch events
- **Pausa inmediata**: Al detectar interacción
- **Resume automático**: Tras 10 segundos de inactividad
- **Transición suave**: Retorno gradual a rotación pasiva

### 3. **Sistema de Nodos Geoespaciales**

#### Coordenadas de El Bosque Sagrado
```javascript
const BOSQUE_SAGRADO = {
    longitude: -3.8,  // 3.8°W
    latitude: 40.0,   // 40°N
    height: 0
};
```

#### Nodos Configurados
1. **LAT 40°N** - Vista regional (50km altura)
2. **El Bosque Sagrado** - Vista cercana (2km altura)
3. **Proyecto SEMILLA** - Vista de proceso (10km altura)
4. **Earth Mission** - Vista global (20,000km altura)
5. **NODO** - Vista de infraestructura (500m altura)

### 4. **Preparación para Datos Biométricos**

#### Capas GeoJSON
```javascript
function loadGeoJSONLayer(url, name) {
    viewer.dataSources.add(Cesium.GeoJsonDataSource.load(url, {
        stroke: Cesium.Color.CYAN,
        fill: Cesium.Color.CYAN.withAlpha(0.2),
        strokeWidth: 3
    }));
}
```

#### Estructura de Datos Esperada
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-3.8, 40.0]
      },
      "properties": {
        "node_id": "lat40n",
        "biomass": 1250.5,
        "carbon_sequestration": 450.2,
        "biodiversity_index": 0.85
      }
    }
  ]
}
```

## 🏗️ Arquitectura del Sistema

### Componentes Principales

#### 1. **Cesium Viewer**
```javascript
const viewer = new Cesium.Viewer('cesiumContainer', {
    terrainProvider: Cesium.createWorldTerrain(),
    baseLayerPicker: false,
    geocoder: false,
    // ... configuración minimalista
});
```

#### 2. **Controlador de Cámara**
- **ScreenSpaceCameraController**: Manejo de interacciones
- **Inercia configurada**: Movimiento orgánico
- **Auto-rotación**: Rotación pasiva sobre eje Z

#### 3. **Sistema de Nodos**
- **OASYS_NODES**: Objeto con configuración de cada nodo
- **flyToNode()**: Función de navegación entre nodos
- **UI sincronizada**: Panel de nodos + info panel

#### 4. **Gestor de Eventos**
- **Interacción usuario**: Pausa auto-rotación
- **Inactividad**: Resume auto-rotación tras 10s
- **Resize**: Adaptación responsive

## 🎨 Diseño Visual

### Paleta de Colores OASYS
```css
:root {
    --dark: #060d08;      /* Fondo principal */
    --teal: #00D4AA;      /* Acento principal */
    --gold: #C9A84C;      /* Acento secundario */
    --cream: #F5F0E8;     /* Texto principal */
}
```

### Tipografía
- **Orbitron**: Títulos y etiquetas técnicas
- **Cormorant Garamond**: Texto descriptivo y citas
- **IBM Plex Mono**: Metadatos y coordenadas

### Elementos UI
- **Header**: Logo + coordenadas
- **Center**: Título principal + tagline
- **Nodes Panel**: Navegación entre nodos
- **Info Panel**: Detalles del nodo activo
- **Controls**: Sliders de configuración
- **Footer**: Mantra + metadatos

## 🔧 Configuración y Personalización

### Token de Cesium Ion
```javascript
Cesium.Ion.defaultAccessToken = 'YOUR_TOKEN_HERE';
```

**Obtener token**:
1. Registrarse en [cesium.com/ion](https://cesium.com/ion/)
2. Crear nuevo token
3. Reemplazar en el código

### Ajustar Velocidad de Auto-Rotación
```javascript
let autoRotationSpeed = 0.00002; // Valor por defecto

// A través de UI (0-100%)
document.getElementById('rotationSpeed').addEventListener('input', (e) => {
    const value = parseInt(e.target.value);
    autoRotationSpeed = (value / 100) * 0.0001;
});
```

### Configurar Inercia
```javascript
// Valores recomendados
sscc.inertiaSpin = 0.9;      // 0.8-0.99
sscc.inertiaTranslate = 0.9;  // 0.8-0.99
sscc.inertiaZoom = 0.8;       // 0.7-0.95
```

### Personalizar Fly-In
```javascript
function performDynamicFlyIn() {
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
            -3.8,  // Longitud inicial
            40.0,  // Latitud inicial
            100    // Altura inicial (m)
        ),
        // ... destino final
        duration: 8.0,  // Duración en segundos
        easingFunction: Cesium.EasingFunction.CUBIC_IN_OUT
    });
}
```

## 📊 Integración de Datos Biométricos

### Paso 1: Preparar Datos GeoJSON

Crear archivo `data/bosque-sagrado-biometricos.geojson`:

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-3.8, 40.0]
      },
      "properties": {
        "node_id": "lat40n",
        "name": "LAT 40°N",
        "area_ha": 3.47,
        "biomass_tons": 1250.5,
        "carbon_sequestration_tons": 450.2,
        "biodiversity_index": 0.85,
        "soil_health_score": 0.92,
        "water_retention_m3": 8500
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-3.81, 39.99],
          [-3.79, 39.99],
          [-3.79, 40.01],
          [-3.81, 40.01],
          [-3.81, 39.99]
        ]]
      },
      "properties": {
        "node_id": "bsg",
        "name": "El Bosque Sagrado",
        "tree_count": 50,
        "founder_count": 13,
        "available_plazas": 37
      }
    }
  ]
}
```

### Paso 2: Cargar Capa en Cesium

```javascript
// Descomentar en el código principal
loadGeoJSONLayer('./data/bosque-sagrado-biometricos.geojson', 'Biométricos BSG');
```

### Paso 3: Visualizar Datos con Entidades

```javascript
// Crear entidades personalizadas
function createBiometricEntities(data) {
    data.features.forEach(feature => {
        const entity = viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(
                feature.geometry.coordinates[0],
                feature.geometry.coordinates[1]
            ),
            point: {
                pixelSize: 10,
                color: Cesium.Color.CYAN,
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: 2
            },
            label: {
                text: feature.properties.name,
                font: '14px Orbitron',
                fillColor: Cesium.Color.WHITE,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 2,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(0, -15)
            },
            properties: feature.properties
        });
    });
}
```

### Paso 4: Añadir Interactividad

```javascript
// Click handler para entidades
viewer.screenSpaceEventHandler.setInputAction((click) => {
    const pickedObject = viewer.scene.pick(click.position);
    if (Cesium.defined(pickedObject) && pickedObject.id instanceof Cesium.Entity) {
        const entity = pickedObject.id;
        showBiometricInfo(entity.properties);
    }
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
```

## 🧪 Testing y Debugging

### Herramientas de Debug

```javascript
// Funciones expuestas en window.OASYS_DEBUG
window.OASYS_DEBUG = {
    viewer: viewer,                    // Instancia de Cesium
    nodes: OASYS_NODES,               // Configuración de nodos
    flyToNode: flyToNode,             // Navegar a nodo específico
    pauseAutoRotation: pauseAutoRotation,
    resumeAutoRotation: resumeAutoRotation,
    loadGeoJSONLayer: loadGeoJSONLayer,
    getCurrentPosition: () => {      // Obtener posición actual
        const carto = Cesium.Cartographic.fromCartesian(viewer.camera.position);
        return {
            longitude: Cesium.Math.toDegrees(carto.longitude),
            latitude: Cesium.Math.toDegrees(carto.latitude),
            height: carto.height
        };
    }
};
```

### Comandos de Debug en Consola

```javascript
// Navegar a nodo específico
OASYS_DEBUG.flyToNode('bsg');

// Obtener posición actual
OASYS_DEBUG.getCurrentPosition();

// Pausar/resume auto-rotación
OASYS_DEBUG.pauseAutoRotation();
OASYS_DEBUG.resumeAutoRotation();

// Cargar capa GeoJSON
OASYS_DEBUG.loadGeoJSONLayer('./data/test.geojson', 'Test Layer');

// Acceder al viewer directamente
OASYS_DEBUG.viewer.camera.flyTo({...});
```

### Testing Local

```bash
# Servir archivos localmente
cd "C:\Users\amyus\Documents\oasys-web\oasys earth"
python -m http.server 8000

# Abrir en navegador
# http://localhost:8000/oasys-earth.html
```

## 🚀 Despliegue

### Opción 1: Netlify

1. **Crear directorio `oasys-earth` en Netlify**
2. **Subir archivos**:
   - `oasys-earth.html`
   - `data/` (con archivos GeoJSON)

3. **Configurar variables de entorno**:
   ```bash
   CESIUM_ION_TOKEN=your_token_here
   ```

### Opción 2: GitHub Pages

1. **Crear repositorio** `oasys-earth`
2. **Subir archivos**
3. **Activar GitHub Pages** en Settings
4. **Acceder**: `https://username.github.io/oasys-earth/`

### Opción 3: Servidor Propio

```nginx
server {
    listen 80;
    server_name oasys.earth;

    root /var/www/oasys-earth;
    index oasys-earth.html;

    location / {
        try_files $uri $uri/ =404;
    }

    # Cache para assets de Cesium
    location ~* \.(js|css|png|jpg|jpeg|gif|ico)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## 📈 Optimización de Rendimiento

### 1. **Carga de Terreno**
```javascript
// Ajustar nivel de detalle del terreno
viewer.terrainProvider = Cesium.createWorldTerrain({
    requestWaterMask: true,
    requestVertexNormals: true
});

// Limitar nivel de detalle
viewer.scene.globe.maximumScreenSpaceError = 2; // Default: 2
```

### 2. **Gestión de Memoria**
```javascript
// Limitar caché de tiles
viewer.scene.globe.tileCacheSize = 500; // Default: 1000

// Limpiar recursos no usados
viewer.scene.globe.releaseTextureFromCache();
```

### 3. **Optimización de Renderizado**
```javascript
// Desactivar sombras si no son necesarias
viewer.scene.shadowMap.enabled = false;

// Limitar FPS
viewer.targetFrameRate = 30; // Limitar a 30 FPS
```

## 🎯 Próximos Pasos

### Fase 1: Datos Biométricos
- [ ] Crear archivos GeoJSON con datos reales
- [ ] Implementar visualización de entidades
- [ ] Añadir interactividad click-to-info
- [ ] Crear leyenda de datos

### Fase 2: Visualización Avanzada
- [ ] Implementar heatmaps de biodiversidad
- [ ] Añadir animaciones de crecimiento
- [ ] Crear líneas de conexión entre nodos
- [ ] Implementar time-series de datos

### Fase 3: Interactividad
- [ ] Sistema de filtrado de datos
- [ ] Exportación de vistas
- [ ] Compartir enlaces a nodos específicos
- [ ] Integración con API de OASYS

### Fase 4: Realidad Aumentada
- [ ] Integración con WebXR
- [ ] Vista AR sobre terreno real
- [ ] Marcadores 3D en ubicaciones
- [ ] Navegación gestual

## 📞 Soporte y Recursos

### Documentación Oficial
- [CesiumJS Documentation](https://cesium.com/docs/cesiumjs/)
- [Cesium Ion](https://cesium.com/ion/)
- [Cesium Sandcastle](https://cesium.com/docs/cesiumjs/refdoc/)

### Comunidad
- [Cesium Forum](https://community.cesium.com/)
- [GitHub Issues](https://github.com/CesiumGS/cesium/issues)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/cesium)

### Ejemplos y Tutorials
- [CesiumJS Tutorials](https://cesium.com/learn/)
- [Sandcastle Examples](https://cesium.com/learn/cesiumjs-learn/)
- [CesiumGS GitHub](https://github.com/CesiumGS/)

---

**OASYS BASE CAMP** · Sistema Operativo de la Tierra · Yunclillos, Toledo
*OASYS BRAIN · Cesium Implementation · Visualización Geoespacial Avanzada*