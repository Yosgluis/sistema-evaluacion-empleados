# Constitución del Proyecto

1. **Separación Estricta de Capas:**
   - `src/js/agentLogic.js` debe contener funciones puras que reciban parámetros y retornen objetos de decisión. No debe tener referencias al objeto `document` ni manipular el DOM.
   - `src/js/app.js` solo se encarga de capturar entradas del formulario, invocar a `agentLogic.js` y renderizar el resultado en el HTML.

2. **Fidelidad al Caso de Estudio:**
   - El sistema debe evaluar exactamente las 5 competencias definidas por Premium Consultores: *Producción, Iniciativa, Comunicación, Relaciones Interpersonales y Manejo del Cambio*.
   - Las decisiones posibles son únicamente tres: `ASCENDER`, `DESPEDIR` o `MANTENER_EN_PUESTO`.

3. **Regla de Oro de Recomendaciones:**
   - Siempre que la salida sea `MANTENER_EN_PUESTO`, la interfaz está obligada a renderizar una sección visible con recomendaciones accionables para mejorar la interacción con el equipo y la adaptación cultural.

4. **Diseño UI/UX Corporativo:**
   - Interfaz sobria, limpia y responsiva, acorde a una firma de consultoría financiera y gerencial.