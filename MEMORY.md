## Estado Actual
- **Fase:** Ajuste de diseño clásico y recomendaciones dinámicas completado.
- **Código fuente (`src/`):** Estilo corporativo clásico restaurado con motor de recomendaciones adaptativo.

## Decisiones Tomadas
- Se restauró el layout clásico limpio del formulario corporativo.
- En `src/js/agentLogic.js`, las recomendaciones para `MANTENER_EN_PUESTO` ahora se adaptan de forma 100% dinámica a las competencias con déficit (< 7).
- Si se ingresan los valores de Juan Carlos Sánchez, se generan exactamente sus 4 recomendaciones institucionales (coaching, comités, prueba 50/50 y mentoría).
- Si se ingresan valores de otros perfiles (Técnico Brillante, Tradicionalista, etc.), el plan de mejora se orienta a sus áreas específicas.
- Se mantiene el esquema gráfico en una sección colapsable al final de la página.

## Archivos Actualizados
- `src/index.html` — Layout clásico limpio con barra discreta de casos de referencia.
- `src/css/styles.css` — Estilos sobrios y clásicos, eliminados bloques invasivos.
- `src/js/agentLogic.js` — Generador de recomendaciones dinámicas y puras.
- `src/js/app.js` — Manejo limpio de eventos y renderizado de resultados.

## Aprendizajes Técnicos
- Modularizar catálogos de recomendaciones por perfil preservando la función pura garantiza escalabilidad sin violentar las restricciones de `CONSTITUTION.md`.
