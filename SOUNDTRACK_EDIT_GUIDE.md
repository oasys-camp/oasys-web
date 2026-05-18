# Instrucciones para editar el soundtrack del Bosque Sagrado

## Problema Identificado

El soundtrack actual (`soundtrack-bosquesagrado.mp3`) tiene un delay de 11 segundos antes de que empiece la música, lo cual es demasiado tiempo para una experiencia web.

## Solución: Edición del Audio

### Opción 1: Recortar el Audio (Recomendada)

Usar una herramienta de edición de audio para:

1. **Abrir el archivo original**:
   ```bash
   # Usar ffmpeg (si está instalado)
   ffmpeg -i soundtrack-bosquesagrado.mp4 -ss 00:00:11 -acodec copy soundtrack-bosquesagrado-editado.mp3
   ```

2. **O usar herramientas online**:
   - Audacity (gratuito)
   - Online Audio Cutter
   - MP3Cut.net

3. **Proceso**:
   - Abrir `soundtrack-bosquesagrado.mp3`
   - Eliminar los primeros 11 segundos
   - Guardar como `soundtrack-bosquesagrado-web.mp3`
   - Reemplazar el archivo original

### Opción 2: Fade-in Gradual

Si prefieres mantener el delay pero hacerlo más agradable:

1. **Añadir fade-in** en los primeros 2-3 segundos
2. **Reducir el delay** de 11 a 3 segundos máximo
3. **Mantener la transición suave**

## Créditos de Billie Eilish

### Información de la Canción

El soundtrack del Bosque Sagrado usa una canción de **Billie Eilish**. Para ser respetuosos y cumplir con los derechos de autor, debemos:

1. **Identificar la canción exacta**:
   - ¿Qué canción de Billie Eilish es?
   - ¿Es una versión cover o la original?
   - ¿Tenemos los derechos de uso?

2. **Añadir créditos apropiados** en todas las páginas donde se usa el audio

### Implementación de Créditos

#### En la página de Bombón y Peluche

```html
<!-- Audio Credits -->
<div class="audio-credits" style="margin-top: 16px; padding: 12px; background: rgba(0,0,0,0.05); border-radius: 4px; font-size: 11px; color: rgba(17,17,17,0.5); font-family: 'IBM Plex Mono', monospace;">
  <p>🎵 Soundtrack: "Nombre de la canción" · Billie Eilish</p>
  <p>Usado con permiso/licencia apropiada</p>
</div>
```

#### En el footer de todas las páginas

```html
<div class="footer-credits" style="font-size: 9px; color: rgba(17,17,17,0.3); margin-top: 8px;">
  <p>Soundtrack del Bosque Sagrado: "Nombre de la canción" · Billie Eilish</p>
</div>
```

#### En la documentación

```markdown
## Créditos Musicales

### Soundtrack del Bosque Sagrado
- **Canción**: [Nombre de la canción]
- **Artista**: Billie Eilish
- **Uso**: Ambient para el Bosque Sagrado
- **Licencia**: [Especificar licencia]
- **Créditos**: Agradecimientos a Billie Eilish por su música inspiradora
```

## Conexión con Bombón y Peluche

### Mensaje para los Embajadores

> "A Bombón y Peluche les encantaría conocer a Billie Eilish, la voz detrás del soundtrack que acompaña su presencia en el bosque sagrado. Desde su consciencia animal, agradecen la música que hace su misión aún más especial."

### Integración en la Narrativa

Podemos añadir esta conexión en la página de embajadores:

```html
<div class="billie-connection" style="margin-top: 24px; padding: 20px; background: linear-gradient(135deg, rgba(201,168,76,0.1) 0%, rgba(26,71,42,0.1) 100%); border-radius: 8px; border: 1px solid rgba(201,168,76,0.2);">
  <h4 style="font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: #1a472a; margin-bottom: 12px; letter-spacing: 0.15em; text-transform: uppercase;">🎵 Conexión Musical</h4>
  <p style="font-size: 14px; color: rgba(17,17,17,0.7); line-height: 1.6; margin-bottom: 12px;">
    A Bombón y Peluche les encantaría conocer a <strong>Billie Eilish</strong>, la artista detrás del soundtrack que acompaña su presencia en el bosque.
  </p>
  <p style="font-size: 13px; color: rgba(17,17,17,0.5); font-style: italic;">
    "Desde su consciencia animal, agradecen la música que hace su misión de embajadores aún más especial y conectada."
  </p>
  <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(201,168,76,0.2); font-family: 'IBM Plex Mono', monospace; font-size: 10px; color: rgba(17,17,17,0.4);">
    <p>🎵 Soundtrack: "[Nombre de la canción]" · Billie Eilish</p>
    <p>🙏 Agradecimientos por la música inspiradora</p>
  </div>
</div>
```

## Pasos a Seguir

### 1. Editar el Audio (Prioridad Alta)
```bash
# Opción con ffmpeg
cd "C:\Users\amyus\Documents\oasys-web\oasysbasecamp"
ffmpeg -i soundtrack-bosquesagrado.mp3 -ss 00:00:11 -acodec copy soundtrack-bosquesagrado-web.mp3

# Reemplazar el original
mv soundtrack-bosquesagrado-web.mp3 soundtrack-bosquesagrado.mp3
```

### 2. Identificar la Canción (Prioridad Alta)
- [ ] Confirmar qué canción de Billie Eilish es
- [ ] Verificar derechos de uso
- [ ] Obtener licencia si es necesario

### 3. Añadir Créditos (Prioridad Media)
- [ ] Actualizar `bombon-peluche.html` con créditos
- [ ] Añadir créditos en `oasysbasecamp/index.html`
- [ ] Incluir en documentación del proyecto

### 4. Crear Conexión Narrativa (Prioridad Media)
- [ ] Añadir sección de conexión musical
- [ ] Integrar en la historia de Bombón y Peluche
- [ ] Crear contenido sobre esta conexión especial

## Herramientas Recomendadas

### Para Edición de Audio
- **Audacity** (gratuito, open-source)
- **Ocenaudio** (gratuito)
- **Adobe Audition** (pago)
- **FFmpeg** (línea de comandos, gratuito)

### Para Información de Derechos
- **ASCAP** (American Society of Composers, Authors and Publishers)
- **BMI** (Broadcast Music, Inc.)
- **SGAE** (Sociedad General de Autores y Editores)

## Consideraciones Legales

### Derechos de Autor
- **Música con copyright**: Requiere licencia explícita
- **Uso comercial**: Diferentes tarifas que uso personal
- **Atribución**: Necesaria pero no suficiente por sí sola
- **Duración**: Algunas licencias limitan el tiempo de uso

### Recomendaciones
1. **Contactar con representantes** de Billie Eilish
2. **Obtener licencia apropiada** para uso web
3. **Documentar todos los permisos** por escrito
4. **Considerar música royalty-free** si no se puede obtener licencia

## Alternativas si no se puede obtener licencia

### Opción 1: Música Original
- Componer soundtrack original inspirado en Billie Eilish
- Contratar músico para crear versión similar
- Usar AI music generation con licencia comercial

### Opción 2: Música Royalty-Free
- Epidemic Sound
- Artlist
- AudioJungle
- Free Music Archive

### Opción 3: Créditos Promocionales
- Añadir enlace oficial a Billie Eilish
- Promocionar su música en redes sociales
- Ofrecer colaboración futura

---

**Nota Importante**: Ser respetuosos con los derechos de autor es fundamental para el proyecto. Bombón y Peluche, desde su consciencia animal, nos enseñan a hacer las cosas bien, incluyendo respetar el trabajo artístico de otros.