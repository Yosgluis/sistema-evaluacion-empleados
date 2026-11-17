# Especificación Funcional — 001: Evaluador de Desempeño 360°

**Proyecto:** Sistema de Evaluación de Empleados — Premium Consultores  
**Usuario:** Arnoldo Hernández (Socio Director)  
**Caso de estudio:** Juan Carlos Sánchez  
**Fecha:** 2026-11-17  
**Estado:** Borrador — pendiente de aprobación

---

## 1. Contexto y Objetivo

Premium Consultores necesita una herramienta de apoyo a la decisión gerencial para evaluar a su personal bajo el modelo **360°** con base en 5 competencias corporativas. El sistema debe operar completamente en el navegador (HTML5 + CSS3 + JavaScript Vanilla, sin frameworks ni librerías externas) y emitir una recomendación automática de tres posibles resultados: **ASCENDER**, **DESPEDIR** o **MANTENER_EN_PUESTO**.

---

## 2. Actores

| Actor | Rol |
|---|---|
| Arnoldo Hernández | Socio Director. Usuario final. Ingresa puntuaciones y recibe la recomendación. |
| Agente Lógico (`agentLogic.js`) | Motor de decisión. Aplica la matriz de reglas de negocio. |
| Interfaz (`index.html` + `app.js`) | Presentación. Captura entradas y renderiza el resultado. |

---

## 3. Competencias Evaluadas

Escala numérica **1–10** (entero) para cada competencia:

| ID | Competencia | Descripción breve | Referencia Sánchez |
|---|---|---|---|
| C1 | Producción | Resultados financieros y cuota de mercado | 9–10 / 10 |
| C2 | Iniciativa | Proactividad para impulsar negocios | 8–10 / 10 |
| C3 | Comunicación | Claridad, paciencia y transmisión de conocimiento | 2–4 / 10 |
| C4 | Relaciones Interpersonales | Trabajo en equipo y cooperación | 2–4 / 10 |
| C5 | Manejo del Cambio | Flexibilidad y respeto a normas y valores | 3–5 / 10 |

---

## 4. Requisitos Funcionales

### RF-01 — Formulario de Evaluación
- El sistema debe presentar un formulario con **5 campos numéricos** (uno por competencia), aceptando valores enteros del 1 al 10 inclusive.
- Cada campo debe mostrar su nombre de competencia y una descripción breve.
- El formulario debe incluir un botón **"Generar Recomendación"**.

### RF-02 — Validación de Entradas
- Si algún campo está vacío o su valor no está en el rango [1–10], el sistema debe bloquear el envío y mostrar un mensaje de error en línea junto al campo infractor.
- La validación debe ejecutarse al intentar enviar el formulario.

### RF-03 — Motor de Decisión (Matriz de Reglas)
El agente lógico evaluará las 5 competencias aplicando las siguientes reglas **en orden estricto de prioridad**:

**Regla 1 — ASCENDER** (prioridad máxima)
```
C1 >= 8 AND C2 >= 8 AND C3 >= 7 AND C4 >= 7 AND C5 >= 7
→ Decisión: ASCENDER (a Director General de Finanzas)
```

**Regla 2 — DESPEDIR**
```
C1 < 5 OR (C4 <= 2 AND C1 < 7)
→ Decisión: DESPEDIR
```
> Si la Regla 1 ya se cumplió, la Regla 2 **no** se evalúa.

**Regla 3 — MANTENER_EN_PUESTO** (caso por defecto)
```
C1 >= 7 AND (C3 < 7 OR C4 < 7 OR C5 < 7)
→ Decisión: MANTENER_EN_PUESTO (Consultor Senior bajo Plan de Mejora)
```
> Este es el escenario exacto del caso Juan Carlos Sánchez.

### RF-04 — Visualización del Resultado
- La decisión debe mostrarse con estilo visual diferenciado por tipo:
  - **ASCENDER** → indicador verde.
  - **DESPEDIR** → indicador rojo.
  - **MANTENER_EN_PUESTO** → indicador ámbar.
- Junto a la decisión se debe mostrar la **justificación textual** correspondiente.

### RF-05 — Recomendaciones Obligatorias para MANTENER_EN_PUESTO
Cuando la decisión sea `MANTENER_EN_PUESTO`, la interfaz **debe** renderizar una sección visible con exactamente las 4 siguientes recomendaciones accionables:

1. **Plan de Coaching y Comunicación Asertiva:** Capacitación en inteligencia emocional y manejo de la impaciencia para eliminar percepciones de agresividad.
2. **Alineación a Procedimientos y Toma de Decisiones Consensuada:** Comités semanales con la Dirección para canalizar iniciativas dentro de las normas de la firma.
3. **Condicionamiento de Ascenso a Indicadores 360°:** Periodo de prueba de 6 meses donde la promoción a Director General depende un 50% de resultados financieros y un 50% de mejora en clima laboral.
4. **Mentoría de Cultura Organizacional:** Acompañamiento directo de Arnoldo Hernández para integrar el dinamismo comercial con los valores de cooperación, dignidad y respeto.

### RF-06 — Resumen de Puntajes
Junto al resultado se debe mostrar una tabla o lista con los puntajes ingresados por competencia, para facilitar la trazabilidad de la decisión.

---

## 5. Requisitos No Funcionales

| ID | Requisito |
|---|---|
| RNF-01 | **Sin dependencias externas.** Todo debe ejecutarse con HTML5, CSS3 y JavaScript ES6+ puro. |
| RNF-02 | **Responsivo.** La interfaz debe adaptarse a escritorio y tablet (mínimo 768 px). |
| RNF-03 | **Estética corporativa.** Paleta sobria, tipografía sans-serif profesional, sin colores estridentes. |
| RNF-04 | **Separación de capas.** `agentLogic.js` debe ser puro (sin `document`). `app.js` solo gestiona DOM. |
| RNF-05 | **Sin persistencia.** La aplicación no almacena datos; cada sesión comienza en blanco. |

---

## 6. Restricciones Arquitectónicas (de CONSTITUTION.md)

1. `agentLogic.js` expone únicamente **funciones puras**: reciben parámetros, retornan objetos de decisión, jamás tocan el DOM.
2. `app.js` captura entradas del formulario, invoca `agentLogic.js` y renderiza el resultado.
3. Las 5 competencias y las 3 decisiones posibles son las **únicas** permitidas; no se pueden añadir más sin modificar la especificación.
4. La sección de recomendaciones para `MANTENER_EN_PUESTO` es **obligatoria**; omitirla es un defecto crítico.

---

## 7. Casos de Prueba de Aceptación

| # | C1 | C2 | C3 | C4 | C5 | Resultado esperado |
|---|---|---|---|---|---|---|
| T-01 | 9 | 9 | 8 | 8 | 8 | ASCENDER |
| T-02 | 9 | 8 | 7 | 7 | 7 | ASCENDER |
| T-03 | 9 | 8 | 3 | 3 | 4 | MANTENER_EN_PUESTO + 4 recomendaciones |
| T-04 | 4 | 7 | 6 | 5 | 5 | DESPEDIR (C1 < 5) |
| T-05 | 6 | 5 | 5 | 2 | 6 | DESPEDIR (C4 <= 2 AND C1 < 7) |
| T-06 | 7 | 6 | 8 | 6 | 9 | MANTENER_EN_PUESTO (C4 < 7) |
| T-07 | — | 8 | 7 | 7 | 7 | Error de validación (campo vacío) |
| T-08 | 11 | 8 | 7 | 7 | 7 | Error de validación (valor fuera de rango) |

---

## 8. Criterios de Aceptación

- [ ] El formulario valida todos los campos antes de calcular.
- [ ] Las reglas de decisión se aplican en el orden exacto especificado.
- [ ] La decisión se visualiza con el color correspondiente.
- [ ] `MANTENER_EN_PUESTO` siempre muestra las 4 recomendaciones.
- [ ] El código fuente no importa ninguna librería externa.
- [ ] `agentLogic.js` no contiene referencias al objeto `document`.
- [ ] Los 8 casos de prueba de la tabla anterior producen el resultado esperado.
