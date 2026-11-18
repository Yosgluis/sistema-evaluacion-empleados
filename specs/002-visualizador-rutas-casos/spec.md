# Especificación Funcional — 002: Integración del Esquema de Rutas y Casos 360°

**Proyecto:** Sistema de Evaluación de Empleados — Premium Consultores  
**Usuario:** Arnoldo Hernández (Socio Director)  
**Caso de estudio:** Juan Carlos Sánchez vs. Perfiles Organizacionales  
**Fecha:** 2026-11-17  
**Estado:** Aprobado para implementación

---

## 1. Objetivo y Alcance

Incorporar a la aplicación web client-side (`src/`) la visualización interactiva del **Esquema de Rutas de Decisión 360°**, destacando explícitamente el caso de Juan Carlos Sánchez y permitiendo al usuario:
1. Consultar el diagrama de decisión completo dentro de la interfaz.
2. Cargar casos de prueba preestablecidos mediante botones rápidos (Preset Juan Carlos Sánchez, Técnico Brillante, Despido, Ascenso, etc.).
3. Identificar en la tarjeta de resultados la **ruta y sub-perfil activado** de acuerdo con la combinación de competencias ingresada, sin alterar la lógica de negocio fundamental (`ASCENDER`, `DESPEDIR`, `MANTENER_EN_PUESTO`).

---

## 2. Requisitos Funcionales

### RF-01 — Alojamiento de Recursos Gráficos
- Alojar los archivos gráficos del esquema (`esquema_rutas_decisiones_completo.svg` y `.png`) dentro del árbol web en `src/assets/img/`.

### RF-02 — Sección de Visualización del Esquema
- Incorporar en `src/index.html` una sección accesible para desplegar/contraer el diagrama del esquema de decisiones.
- Mostrar la identificación visual de la ruta de Juan Carlos Sánchez dentro de la sección.

### RF-03 — Barra de Carga Rápida de Casos (Presets)
- Proveer botones de acceso rápido para cargar automáticamente los puntajes de:
  - **★ Caso Juan Carlos Sánchez** (P: 10, I: 9, C: 3, RI: 3, MC: 4).
  - **Caso Ascenso a Director** (P: 9, I: 9, C: 8, RI: 8, MC: 8).
  - **Caso Técnico Brillante** (P: 9, I: 8, C: 4, RI: 7, MC: 8).
  - **Caso Tradicionalista** (P: 8, I: 7, C: 8, RI: 8, MC: 3).
  - **Caso Despido por Producción** (P: 3, I: 4, C: 8, RI: 9, MC: 7).
  - **Caso Despido por Clima/Conflicto** (P: 6, I: 6, C: 3, RI: 2, MC: 5).

### RF-04 — Detección y Presentación de Sub-casos en `agentLogic.js`
- Mantener las funciones puras en `agentLogic.js` sin tocar el DOM.
- Retornar en el objeto de resultado la propiedad `perfilDetectado` que clasifique el escenario (p. ej. `Juan Carlos Sánchez ("El Tiburón Comercial")`, `El Técnico Brillante`, etc.).

### RF-05 — Renderizado en `app.js` y Estilos Corporativos en `styles.css`
- Renderizar el badge de la ruta activada en la sección de resultados.
- Diseñar acorde a la paleta azul marino (`#1a2744`) y dorado (`#c8a84b`).

