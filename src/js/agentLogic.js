/**
 * agentLogic.js — Motor de Decisión 360°
 * Premium Consultores | Sistema de Evaluación de Empleados
 *
 * REGLA ARQUITECTÓNICA (CONSTITUTION.md):
 * Este archivo contiene ÚNICAMENTE funciones puras.
 * No debe contener ninguna referencia a `document`, `window` ni al DOM.
 */

// ---------------------------------------------------------------------------
// Constantes de decisión
// ---------------------------------------------------------------------------

const DECISION = Object.freeze({
  ASCENDER:         'ASCENDER',
  DESPEDIR:         'DESPEDIR',
  MANTENER_EN_PUESTO: 'MANTENER_EN_PUESTO',
});

// ---------------------------------------------------------------------------
// Recomendaciones obligatorias para MANTENER_EN_PUESTO (CONSTITUTION § 3)
// ---------------------------------------------------------------------------

const RECOMENDACIONES_MANTENER = Object.freeze([
  {
    titulo: 'Plan de Coaching y Comunicación Asertiva',
    descripcion:
      'Capacitación enfocada en inteligencia emocional y manejo de la impaciencia, ' +
      'con el objetivo de eliminar las percepciones de agresividad reportadas por pares ' +
      'y colaboradores, y fortalecer la claridad en la transmisión de conocimiento.',
  },
  {
    titulo: 'Alineación a Procedimientos y Toma de Decisiones Consensuada',
    descripcion:
      'Establecer comités semanales con la Dirección para canalizar sus iniciativas de ' +
      'cambio dentro de las normas y valores de la firma, evitando decisiones unilaterales ' +
      'que comprometan la cohesión del equipo.',
  },
  {
    titulo: 'Condicionamiento de Ascenso a Indicadores 360°',
    descripcion:
      'Definir un periodo de prueba de 6 meses en el que la promoción a Director General ' +
      'de Finanzas dependa en un 50 % de los resultados financieros y en un 50 % de la ' +
      'mejora documentada en su evaluación de clima laboral.',
  },
  {
    titulo: 'Mentoría de Cultura Organizacional',
    descripcion:
      'Asignar acompañamiento directo del Socio Director (Arnoldo Hernández) para ' +
      'integrar el dinamismo comercial del colaborador con los valores de cooperación, ' +
      'dignidad y respeto que son pilares de Premium Consultores.',
  },
]);

// ---------------------------------------------------------------------------
// validarEntradas({ produccion, iniciativa, comunicacion,
//                   relacionesInterpersonales, manejoDelCambio })
//
// Retorna: { valido: Boolean, errores: { [campoId]: String } }
// ---------------------------------------------------------------------------

function validarEntradas(scores) {
  const campos = [
    'produccion',
    'iniciativa',
    'comunicacion',
    'relacionesInterpersonales',
    'manejoDelCambio',
  ];

  const errores = {};

  campos.forEach(function (campo) {
    const rawValue = scores[campo];

    if (rawValue === '' || rawValue === null || rawValue === undefined) {
      errores[campo] = 'Este campo es obligatorio.';
      return;
    }

    const valor = Number(rawValue);

    if (!Number.isInteger(valor) || valor < 1 || valor > 10) {
      errores[campo] = 'Ingresa un valor entero entre 1 y 10.';
    }
  });

  return {
    valido: Object.keys(errores).length === 0,
    errores: errores,
  };
}

// ---------------------------------------------------------------------------
// evaluarDesempeno({ produccion, iniciativa, comunicacion,
//                    relacionesInterpersonales, manejoDelCambio })
//
// Retorna: { decision: String, justificacion: String,
//            recomendaciones: Array<{ titulo, descripcion }> }
//
// Las reglas se aplican en ORDEN ESTRICTO DE PRIORIDAD (spec RF-03).
// ---------------------------------------------------------------------------

function evaluarDesempeno(scores) {
  const p  = Number(scores.produccion);
  const i  = Number(scores.iniciativa);
  const c  = Number(scores.comunicacion);
  const ri = Number(scores.relacionesInterpersonales);
  const mc = Number(scores.manejoDelCambio);

  // --- Regla 1: ASCENDER (prioridad máxima) --------------------------------
  if (p >= 8 && i >= 8 && c >= 7 && ri >= 7 && mc >= 7) {
    return {
      decision: DECISION.ASCENDER,
      justificacion:
        'El colaborador cumple con el estándar más exigente de Premium Consultores: ' +
        'excelencia técnica y comercial combinada con las habilidades de liderazgo, ' +
        'comunicación asertiva y alineación cultural necesarias para ejercer la ' +
        'Dirección General de Finanzas.',
      recomendaciones: [],
    };
  }

  // --- Regla 2: DESPEDIR ---------------------------------------------------
  if (p < 5 || (ri <= 2 && p < 7)) {
    return {
      decision: DECISION.DESPEDIR,
      justificacion:
        p < 5
          ? 'El colaborador no alcanza las metas comerciales mínimas requeridas por la ' +
            'unidad de finanzas. Su contribución al crecimiento de la firma es insuficiente ' +
            'para justificar su continuidad en el rol.'
          : 'El impacto negativo en el clima laboral —reflejado en un nivel crítico de ' +
            'relaciones interpersonales— supera cualquier aporte financiero. Mantenerlo ' +
            'pondría en riesgo la cohesión y los valores fundamentales de Premium Consultores.',
      recomendaciones: [],
    };
  }

  // --- Regla 3: MANTENER_EN_PUESTO (caso por defecto — escenario Sánchez) --
  return {
    decision: DECISION.MANTENER_EN_PUESTO,
    justificacion:
      'El colaborador presenta una producción sólida que debe preservarse (desvincularlo ' +
      'destruiría el crecimiento logrado), pero aún no reúne las competencias de liderazgo ' +
      'y cultura organizacional exigidas para el ascenso. Se recomienda un Plan de Mejora ' +
      'con seguimiento trimestral antes de reconsiderar la promoción.',
    recomendaciones: Array.from(RECOMENDACIONES_MANTENER),
  };
}
