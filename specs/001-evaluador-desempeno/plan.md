# Plan Técnico de Implementación — 001: Evaluador de Desempeño 360°

**Proyecto:** Sistema de Evaluación de Empleados — Premium Consultores  
**Referencia:** `specs/001-evaluador-desempeno/spec.md`  
**Fecha:** 2026-11-17  
**Estado:** Pendiente de aprobación — NO tocar `src/` hasta recibir "Aprobado"

---

## 1. Estructura de Archivos

```
src/
├── index.html          ← Punto de entrada único. Formulario + zona de resultado.
├── css/
│   └── styles.css      ← Variables CSS, layout Flexbox/Grid, paleta corporativa.
└── js/
    ├── agentLogic.js   ← Motor de decisión (funciones puras, sin DOM).
    └── app.js          ← Controlador de UI (captura, validación, render).
```

---

## 2. Fases de Implementación

### Fase 1 — `agentLogic.js` (Motor de Decisión)

**Objetivo:** Implementar las reglas de negocio como funciones puras y exportarlas globalmente (sin módulos ES, para compatibilidad sin bundler).

#### 2.1 Función principal: `evaluarDesempeno(scores)`

**Firma:**
```js
function evaluarDesempeno({ produccion, iniciativa, comunicacion, relacionesInterpersonales, manejoDelCambio })
// Retorna: { decision, justificacion, recomendaciones }
```

**Lógica interna (orden estricto):**

```
1. Si produccion >= 8 AND iniciativa >= 8 AND comunicacion >= 7
      AND relacionesInterpersonales >= 7 AND manejoDelCambio >= 7
   → decision = "ASCENDER"
   → justificacion = "El perfil cumple el estándar técnico y de liderazgo..."
   → recomendaciones = []

2. Si produccion < 5 OR (relacionesInterpersonales <= 2 AND produccion < 7)
   → decision = "DESPEDIR"
   → justificacion = "No cumple metas comerciales mínimas o su impacto en clima..."
   → recomendaciones = []

3. (Por defecto — caso Sánchez)
   → decision = "MANTENER_EN_PUESTO"
   → justificacion = "Producción sólida pero fallas en habilidades blandas..."
   → recomendaciones = [4 objetos { titulo, descripcion }]
```

**Objeto de retorno:**
```js
{
  decision: "ASCENDER" | "DESPEDIR" | "MANTENER_EN_PUESTO",
  justificacion: String,
  recomendaciones: Array<{ titulo: String, descripcion: String }>
}
```

#### 2.2 Función auxiliar: `validarEntradas(scores)`

**Firma:**
```js
function validarEntradas(scores)
// Retorna: { valido: Boolean, errores: Object<campoId, mensajeError> }
```

- Itera sobre los 5 campos.
- Por cada campo: verifica que el valor sea un número entero en [1, 10].
- Si está vacío → error `"Este campo es obligatorio"`.
- Si está fuera de rango → error `"Ingresa un valor entre 1 y 10"`.

---

### Fase 2 — `index.html` (Estructura Semántica)

**Secciones principales:**

```html
<header>          → Logo / nombre de la firma + título de la herramienta
<main>
  <section id="formulario">
    <form id="evaluacion-form">
      <!-- 5 grupos de campo: label + input[type=number] + span.error -->
    </form>
    <button id="btn-evaluar">Generar Recomendación</button>
  </section>

  <section id="resultado" class="hidden">
    <div id="decision-badge">   <!-- Texto de decisión con clase CSS por tipo -->
    <p id="justificacion">
    <ul id="resumen-puntajes">  <!-- Lista de las 5 competencias y sus scores -->
    <div id="recomendaciones">  <!-- Visible solo si MANTENER_EN_PUESTO -->
      <h3>Plan de Mejora — Recomendaciones Accionables</h3>
      <ol id="lista-recomendaciones">
      </ol>
    </div>
  </section>
<footer>           → Pie con nombre de la firma y año
```

**Reglas HTML:**
- Semántico: usar `<header>`, `<main>`, `<section>`, `<footer>`, `<form>`, `<fieldset>`, `<label>`, `<button>`.
- `input[type=number]` con atributos `min="1" max="10" step="1"` (refuerzo HTML nativo; la validación real vive en JS).
- El `<section id="resultado">` inicia con clase `hidden` y se muestra tras el cálculo.
- Cada `<input>` lleva `id` y `name` que coinciden con las claves del objeto `scores`.

---

### Fase 3 — `styles.css` (Diseño Corporativo)

#### 3.1 Variables CSS

```css
:root {
  --color-primario:      #1a2744;  /* Azul marino corporativo */
  --color-secundario:    #2c4a8c;  /* Azul medio */
  --color-acento:        #c8a84b;  /* Dorado Premium */
  --color-fondo:         #f4f5f7;
  --color-superficie:    #ffffff;
  --color-texto:         #2d2d2d;
  --color-texto-suave:   #6b7280;
  --color-exito:         #15803d;  /* Verde ASCENDER */
  --color-peligro:       #b91c1c;  /* Rojo DESPEDIR */
  --color-advertencia:   #b45309;  /* Ámbar MANTENER */
  --radio-borde:         8px;
  --sombra-card:         0 2px 12px rgba(0,0,0,.08);
}
```

#### 3.2 Layout General

- `body` → `min-height: 100vh`, fondo `--color-fondo`, fuente `system-ui, sans-serif`.
- `<header>` → fondo `--color-primario`, texto blanco, logo a la izquierda, título centrado.
- `<main>` → `max-width: 860px`, centrado con `margin: 0 auto`.
- Tarjeta de formulario → `background: white`, `border-radius`, `box-shadow`.
- Tarjeta de resultado → misma tarjeta, borde lateral de 4 px coloreado según decisión.

#### 3.3 Clases de Estado del Badge de Decisión

```css
.badge-ascender       { background: var(--color-exito); color: white; }
.badge-despedir       { background: var(--color-peligro); color: white; }
.badge-mantener       { background: var(--color-advertencia); color: white; }
```

#### 3.4 Responsividad

- Base: una columna.
- `@media (min-width: 640px)`: Los inputs de las competencias se pueden disponer en grid 2 columnas.

---

### Fase 4 — `app.js` (Controlador de UI)

**Responsabilidades exclusivas:**
1. Capturar referencias del DOM al cargar la página (`DOMContentLoaded`).
2. Escuchar el evento `click` del botón `#btn-evaluar`.
3. Leer los 5 valores del formulario y construir el objeto `scores`.
4. Llamar a `validarEntradas(scores)`:
   - Si hay errores → renderizar mensajes en línea y abortar.
   - Si es válido → limpiar errores anteriores.
5. Llamar a `evaluarDesempeno(scores)` y recibir `{ decision, justificacion, recomendaciones }`.
6. Renderizar el resultado:
   - Aplicar clase CSS al `#decision-badge` según la decisión.
   - Escribir texto de justificación.
   - Generar la lista de puntajes.
   - Si `recomendaciones.length > 0`, generar los `<li>` y mostrar `#recomendaciones`; si no, ocultarlo.
7. Mostrar `<section id="resultado">` (quitar clase `hidden`) y hacer scroll suave hasta él.

**Flujo de datos (sin mutación de estado externo):**
```
click → leerFormulario() → validarEntradas() → evaluarDesempeno() → renderResultado()
```

---

## 3. Restricciones Técnicas

| Restricción | Detalle |
|---|---|
| Sin `import`/`export` | Se usa el patrón de script clásico: `agentLogic.js` se carga antes que `app.js` en el `<head>` con `defer`. Las funciones quedan en el scope global. |
| Sin `document` en `agentLogic.js` | Verificable por grep. Cualquier referencia a `document`, `window` o `querySelector` en ese archivo es un defecto crítico. |
| Sin frameworks | No se permiten React, Vue, Alpine, jQuery, Tailwind, Bootstrap ni ninguna CDN externa. |
| Compatibilidad | Chrome, Firefox y Edge modernos (sin transpilación). |

---

## 4. Orden de Creación de Archivos

```
Paso 1 → src/js/agentLogic.js      (funciones puras primero, sin UI)
Paso 2 → src/index.html            (estructura semántica, sin estilos inline)
Paso 3 → src/css/styles.css        (variables, layout, estados visuales)
Paso 4 → src/js/app.js             (controlador de UI, enlaza todo)
```

> **Verificación entre pasos:** Tras `agentLogic.js`, se pueden ejecutar los 8 casos de prueba
> de la especificación directamente en la consola del navegador antes de conectar la UI.

---

## 5. Checklist de Cierre

- [ ] `agentLogic.js` no contiene `document`, `window` ni manipulación de DOM.
- [ ] Los 8 casos de prueba de `spec.md` pasan al llamar `evaluarDesempeno()` directamente en consola.
- [ ] `MANTENER_EN_PUESTO` siempre retorna exactamente 4 recomendaciones con `titulo` y `descripcion`.
- [ ] La interfaz muestra el badge coloreado correcto para cada decisión.
- [ ] La sección `#recomendaciones` es invisible para `ASCENDER` y `DESPEDIR`.
- [ ] Los mensajes de error en línea aparecen y desaparecen correctamente.
- [ ] La página es responsiva a partir de 768 px de ancho.
- [ ] `MEMORY.md` actualizado al finalizar la implementación.
