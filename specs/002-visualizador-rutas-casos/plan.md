# Plan de Implementación — 002: Integración del Esquema de Rutas y Casos 360°

## Fases de Ejecución

1. **Alojamiento de Recursos:**
   - Crear el directorio `src/assets/img/`.
   - Copiar `esquema_rutas_decisiones_completo.svg` y `esquema_rutas_decisiones_completo.png` a `src/assets/img/`.

2. **Actualización del Motor Lógico (`src/js/agentLogic.js`):**
   - Incorporar detector de sub-perfiles dentro de `evaluarDesempeno()` sin modificar las condiciones de `DECISION` (`ASCENDER`, `DESPEDIR`, `MANTENER_EN_PUESTO`).
   - Asociar metadatos del perfil detectado (`nombrePerfil`, `icono`, `esCasoSanchez`).
   - Asegurar 100% de funciones puras y cero referencias a `document` o DOM.

3. **Estructura HTML (`src/index.html`):**
   - Agregar barra de botones rápidos de prueba (Presets de casos).
   - Agregar sección colapsable / interactiva "Esquema y Rutas de Decisión 360°" con la imagen SVG incrustada.
   - En la sección de resultados, añadir contenedor para la ruta/perfil activado.

4. **Estilos Corporativos (`src/css/styles.css`):**
   - Estilar los botones de presets (destacando el botón de Juan Carlos en dorado).
   - Estilar el visor del esquema (responsivo, con opción de maximizar/abrir en pestaña nueva).
   - Estilar el badge de ruta/perfil detectado en la tarjeta de resultados.

5. **Controlador de UI (`src/js/app.js`):**
   - Añadir manejadores para los botones de presets de casos.
   - Renderizar la ruta/perfil detectado al evaluar.
   - Manejar el colapso/expansión del esquema visual.

6. **Verificación y Registro:**
   - Probar los 6 presets de casos.
   - Verificar que Juan Carlos Sánchez arroje exactamente `MANTENER_EN_PUESTO` con el perfil destacado y las 4 recomendaciones.
   - Actualizar `MEMORY.md`.

