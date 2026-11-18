## Descripción del Proyecto
Aplicación web client-side desarrollada en **HTML5, CSS3 y JavaScript Vanilla** para asistir a Arnoldo Hernández (Socio Director) en la toma de decisiones gerenciales sobre la evaluación 360° de Juan Carlos Sánchez en Premium Consultores.

## Stack Tecnológico y Restricciones
- **Frontend:** HTML5 semántico, CSS3 moderno (Variables CSS, Flexbox/Grid) y JavaScript ES6+ puro.
- **Prohibiciones:** NO instalar frameworks (React, Vue, Tailwind, etc.), NO usar librerías externas ni crear backends. Todo debe ejecutarse localmente en el navegador.

## Flujo de Trabajo Obligatorio (SDD)
1. **Contexto Inicial:** Antes de escribir o modificar código, lee siempre `MEMORY.md` para conocer el estado actual y `docs/CONSTITUTION.md` para respetar las reglas arquitectónicas.
2. **Habilidades de Dominio:** Para implementar o modificar criterios de evaluación, consulta obligatoriamente `.agents/skills/rrhh-evaluator/SKILL.md`.
3. **Desarrollo por Especificaciones:** Toda nueva funcionalidad debe pasar por `specs/` (`spec.md` -> `plan.md`) antes de tocar los archivos en `src/`.
4. **Cierre de Tarea:** Al finalizar cualquier modificación, actualiza `MEMORY.md` (manteniéndolo por debajo de 50 líneas) con los cambios realizados y aprendizajes técnicos.

## Estructura de Directorios
- `src/index.html`: Interfaz de usuario y formulario de evaluación.
- `src/css/styles.css`: Estilos corporativos.
- `src/js/app.js`: Manipulación del DOM y eventos.
- `src/js/agentLogic.js`: Motor lógico de decisión y generación de recomendaciones.