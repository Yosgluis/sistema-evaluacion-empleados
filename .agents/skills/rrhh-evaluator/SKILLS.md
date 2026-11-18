---
name: rrhh-evaluator
description: Úsala siempre que escribas, modifiques o revises lógica de evaluación de desempeño, reglas de negocio o recomendaciones basadas en el caso de Juan Carlos Sánchez y Premium Consultores.
---

# Reglas de Evaluación de Desempeño - Premium Consultores

## 1. Parámetros de Entrada Esperados
El sistema debe recibir valores numéricos (escala 1 a 10) o categóricos normalizados para las 5 competencias del caso:
1. **Producción:** Resultados financieros y cuota de mercado (Ref. Sánchez: 9-10/10, pasó del puesto 10 al 4 con 17% de mercado).
2. **Iniciativa:** Proactividad y dinamismo para impulsar negocios (Ref. Sánchez: 8-10/10).
3. **Comunicación:** Claridad, paciencia y transmisión de conocimiento (Ref. Sánchez: 2-4/10, reportado con agresividad e impaciencia).
4. **Relaciones Interpersonales:** Trabajo en equipo, cooperación con colegas y subordinados (Ref. Sánchez: 2-4/10, estilo individualista y decisiones inconsultas).
5. **Manejo del Cambio:** Flexibilidad y respeto a normas y valores organizacionales (Ref. Sánchez: 3-5/10, bajo apego a procedimientos).

## 2. Matriz de Decisión del Agente
Evalúa las entradas siguiendo este orden estricto de prioridad:

### Caso A: ASCENDER (a Director General de Finanzas)
- **Condición:** `Producción >= 8` AND `Iniciativa >= 8` AND `Comunicación >= 7` AND `Relaciones Interpersonales >= 7` AND `Manejo del Cambio >= 7`.
- **Justificación:** El cargo exige el más alto nivel técnico, pero también liderar con el ejemplo, inspirar respeto interno/externo y transmitir la misión, visión y valores de la firma.

### Caso B: DESPEDIR
- **Condición:** `Producción < 5` OR (`Relaciones Interpersonales <= 2` AND `Producción < 7`).
- **Justificación:** No cumple con las metas comerciales mínimas requeridas por la unidad de finanzas o su impacto negativo en el clima laboral supera cualquier aporte financiero.

### Caso C: MANTENER_EN_PUESTO (Consultor Senior bajo Plan de Mejora)
- **Condición:** Todos los casos intermedios donde `Producción >= 7` pero existen fallas graves en habilidades blandas (`Comunicación < 7` OR `Relaciones Interpersonales < 7` OR `Manejo del Cambio < 7`). *(Nota: Este es el escenario exacto de Juan Carlos Sánchez).*
- **Justificación:** Despedirlo destruiría el crecimiento logrado (17% del mercado), pero ascenderlo legitimaría conductas individualistas que violan los valores de respeto y dignidad de Premium Consultores.

## 3. Recomendaciones Obligatorias para `MANTENER_EN_PUESTO`
Si el resultado es mantenerlo en el cargo, el agente lógico debe devolver al menos estas 4 recomendaciones específicas:
1. **Plan de Coaching y Comunicación Asertiva:** Capacitación enfocada en inteligencia emocional y manejo de la impaciencia para eliminar percepciones de agresividad con pares y colaboradores.
2. **Alineación a Procedimientos y Toma de Decisiones Consensuada:** Establecer comités semanales con la Dirección para canalizar sus iniciativas de cambio dentro de las normas de la firma, evitando decisiones unilaterales.
3. **Condicionamiento de Ascenso a Indicadores 360°:** Definir un periodo de prueba de 6 meses donde la promoción a Director General dependa en un 50% de resultados financieros y un 50% de la mejora en su evaluación de clima laboral.
4. **Mentoría de Cultura Organizacional:** Asignar acompañamiento directo de Arnoldo Hernández para integrar su dinamismo comercial con los valores de cooperación, dignidad y respeto de Premium Consultores.