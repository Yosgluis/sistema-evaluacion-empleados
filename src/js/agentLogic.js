/**
 * agentLogic.js — Motor de Decisión 360° Dinámico
 * Premium Consultores | Sistema de Evaluación de Empleados
 *
 * REGLAS ARQUITECTÓNICAS (CONSTITUTION.md):
 * 1. Este archivo contiene ÚNICAMENTE funciones puras.
 * 2. Cero referencias a `document`, `window` o al DOM.
 * 3. Las decisiones posibles son estrictamente: ASCENDER, DESPEDIR o MANTENER_EN_PUESTO.
 * 4. Las recomendaciones se adaptan dinámicamente a los valores ingresados.
 */

// ---------------------------------------------------------------------------
// Constantes de decisión
// ---------------------------------------------------------------------------

const DECISION = Object.freeze({
  ASCENDER:           'ASCENDER',
  DESPEDIR:           'DESPEDIR',
  MANTENER_EN_PUESTO: 'MANTENER_EN_PUESTO',
});

// ---------------------------------------------------------------------------
// Catálogo de Recomendaciones Especializadas según Perfil y Valores Ingresados
// ---------------------------------------------------------------------------

// 1. Recomendaciones específicas del Caso Juan Carlos Sánchez (CONSTITUTION § 3)
const RECOMENDACIONES_SANCHEZ = Object.freeze([
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

// 2. Recomendaciones para El Técnico Brillante (falla en comunicación / oratoria)
const RECOMENDACIONES_TECNICO_BRILLANTE = Object.freeze([
  {
    titulo: 'Programa de Oratoria y Presentaciones Ejecutivas',
    descripcion:
      'Capacitación intensiva en comunicación verbal de alto impacto ante comités ' +
      'y clientes corporativos para sintetizar y transmitir análisis financieros complejos.',
  },
  {
    titulo: 'Taller de Redacción de Informes Gerenciales',
    descripcion:
      'Desarrollo de competencias escritas para la elaboración de propuestas comerciales ' +
      'y reportes ejecutivos dirigidos a audiencias no financieras.',
  },
  {
    titulo: 'Mentoría en Delegación y Transferencia de Conocimiento',
    descripcion:
      'Acompañamiento estructurado para organizar sesiones de capacitación interna ' +
      'con consultores junior, fortaleciendo su rol de referente formativo.',
  },
  {
    titulo: 'Evaluación de Impacto Comunicacional a 6 Meses',
    descripcion:
      'Condicionar la futura promoción a Director General a una valoración mínima de ' +
      '7/10 en comunicación por parte de sus pares y clientes.',
  },
]);

// 3. Recomendaciones para El Consultor Tradicionalista (falla en adaptación al cambio)
const RECOMENDACIONES_TRADICIONALISTA = Object.freeze([
  {
    titulo: 'Inmersión en Nuevas Metodologías Financieras',
    descripcion:
      'Capacitación en los nuevos estándares y herramientas tecnológicas que forman ' +
      'parte del proceso de modernización y renovación de Premium Consultores.',
  },
  {
    titulo: 'Liderazgo en Proyecto Piloto de Innovación',
    descripcion:
      'Asignación activa en un equipo multidisciplinario de mejora operativa para ' +
      'desarrollar flexibilidad y apertura frente a nuevas formas de trabajo.',
  },
  {
    titulo: 'Alineación con la Visión y Estrategia de Renovación',
    descripcion:
      'Sesiones individuales con los Socios Directores para comprender los objetivos ' +
      'estratégicos de la firma y superar la resistencia al cambio procedimental.',
  },
  {
    titulo: 'Auditoría de Procesos y Cumplimiento Normativo',
    descripcion:
      'Seguimiento trimestral sobre el apego a los nuevos manuales y procedimientos ' +
      'institucionales aprobados por la Junta de Socios.',
  },
]);

// 4. Recomendaciones para El Colega Ejemplar (excelente clima, producción al límite)
const RECOMENDACIONES_COLEGA_EJEMPLAR = Object.freeze([
  {
    titulo: 'Especialización en Finanzas Corporativas Complejas',
    descripcion:
      'Formación técnica avanzada en reestructuración de deuda y reflotamiento de empresas ' +
      'en crisis para elevar su volumen resolutivo.',
  },
  {
    titulo: 'Plan de Desarrollo Comercial y Cierre de Contratos',
    descripcion:
      'Entrenamiento práctico en captación de cuentas corporativas y prospección ' +
      'agresiva para elevar la cuota de mercado de su unidad.',
  },
  {
    titulo: 'Mentoría con Socio de Alta Productividad',
    descripcion:
      'Asignación de un consultor senior de alto rendimiento como mentor de negocios ' +
      'para transferir técnicas efectivas de negociación.',
  },
  {
    titulo: 'Metas Cuantitativas Escalonadas a 6 Meses',
    descripcion:
      'Establecer compromisos de facturación y rentabilidad progresivos como condición ' +
      'previa para reconsiderar su postulación a Director General.',
  },
]);

// 5. Recomendaciones para El Operador Estable (falla en iniciativa / proactividad)
const RECOMENDACIONES_OPERADOR_ESTABLE = Object.freeze([
  {
    titulo: 'Desarrollo de Pensamiento Estratégico y Proactividad',
    descripcion:
      'Capacitación orientada a identificar oportunidades de negocio anticipadas y ' +
      'proponer soluciones sin esperar asignaciones explícitas.',
  },
  {
    titulo: 'Autonomía en Formulación de Proyectos de Mejora',
    descripcion:
      'Asignación de un desafío operativo para diseñar e implementar mejoras en los ' +
      'servicios de consultoría de la unidad de Finanzas.',
  },
  {
    titulo: 'Coaching en Toma de Riesgos Calculados y Liderazgo',
    descripcion:
      'Sesiones de coaching ejecutivo para superar la zona de confort y asumir un rol ' +
      'visible en la toma de decisiones del área.',
  },
  {
    titulo: 'Revisión Semestral de Iniciativas Presentadas',
    descripcion:
      'Medición del impacto de al menos dos nuevas iniciativas comerciales generadas ' +
      'por el consultor antes de autorizar su promoción.',
  },
]);

// ---------------------------------------------------------------------------
// validarEntradas(scores)
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
// clasificarPerfil(decision, p, i, c, ri, mc)
// ---------------------------------------------------------------------------

function clasificarPerfil(decision, p, i, c, ri, mc) {
  if (decision === DECISION.ASCENDER) {
    if (p >= 9 && i >= 9 && c >= 9 && ri >= 9 && mc >= 9) {
      return {
        tipo: 'LIDER_INTEGRAL',
        nombre: 'El Socio / Líder Integral',
        subtitulo: 'Excelencia técnica sobresaliente y vivencia plena de los valores corporativos',
        esCasoSanchez: false,
        icono: '👑',
      };
    }
    return {
      tipo: 'ASCENSO_ESTANDAR',
      nombre: 'Ascenso al Umbral Exigido',
      subtitulo: 'Cumple satisfactoriamente el estándar directivo requerido (8/8/7/7/7)',
      esCasoSanchez: false,
      icono: '⭐',
    };
  }

  if (decision === DECISION.DESPEDIR) {
    if (p < 5) {
      return {
        tipo: 'BAJA_PRODUCCION',
        nombre: 'Baja Producción Comercial',
        subtitulo: 'Inviable financieramente: no alcanza el umbral mínimo productivo de la unidad',
        esCasoSanchez: false,
        icono: '📉',
      };
    }
    return {
      tipo: 'CONFLICTO_CRITICO',
      nombre: 'Conflicto Relacional Destructivo',
      subtitulo: 'El daño al clima y al trabajo en equipo supera cualquier aporte financiero',
      esCasoSanchez: false,
      icono: '⚠️',
    };
  }

  // Decisión: MANTENER_EN_PUESTO
  // 1. Caso exacto de Juan Carlos Sánchez
  if (p >= 8 && i >= 8 && ri <= 5 && c <= 5) {
    return {
      tipo: 'SANCHEZ',
      nombre: 'Caso Juan Carlos Sánchez ("El Tiburón Comercial")',
      subtitulo: 'Rendimiento comercial récord (17% mercado) pero con fallas críticas en clima, asertividad y normas',
      esCasoSanchez: true,
      icono: '★',
    };
  }

  // 2. El Técnico Brillante (falla focalizada en comunicación ejecutiva)
  if (c < 7 && ri >= 7 && mc >= 7) {
    return {
      tipo: 'TECNICO_BRILLANTE',
      nombre: 'El Técnico Brillante',
      subtitulo: 'Excelente análisis y solvencia técnica con brecha en comunicación ejecutiva',
      esCasoSanchez: false,
      icono: '🗣️',
    };
  }

  // 3. El Consultor Tradicionalista (falla en manejo del cambio)
  if (mc < 7 && c >= 7 && ri >= 7) {
    return {
      tipo: 'TRADICIONALISTA',
      nombre: 'El Consultor Tradicionalista',
      subtitulo: 'Sólido consultor con marcada resistencia a nuevas metodologías de renovación',
      esCasoSanchez: false,
      icono: '🔄',
    };
  }

  // 4. El Colega Ejemplar (excelente clima, producción en el umbral)
  if (p <= 7 && ri >= 8 && c >= 8) {
    return {
      tipo: 'COLEGA_EJEMPLAR',
      nombre: 'El Colega Ejemplar',
      subtitulo: 'Excelente clima de equipo pero con volumen de negocio en el umbral mínimo',
      esCasoSanchez: false,
      icono: '🤝',
    };
  }

  // 5. El Operador Estable (falla en iniciativa)
  if (i < 7) {
    return {
      tipo: 'OPERADOR_ESTABLE',
      nombre: 'El Operador Estable',
      subtitulo: 'Cumplidor metódico con necesidad de impulsar mayor proactividad e iniciativa comercial',
      esCasoSanchez: false,
      icono: '💡',
    };
  }

  return {
    tipo: 'CONSULTOR_DESARROLLO',
    nombre: 'Consultor Senior en Perfeccionamiento',
    subtitulo: 'Rendimiento comercial sólido que requiere consolidación integral en competencias blandas',
    esCasoSanchez: false,
    icono: '📋',
  };
}

// ---------------------------------------------------------------------------
// generarRecomendacionesDinamicas(perfil, p, i, c, ri, mc)
// Genera recomendaciones orientadas a la mejora según el perfil y valores ingresados
// ---------------------------------------------------------------------------

function generarRecomendacionesDinamicas(perfil, p, i, c, ri, mc) {
  // Si coincide con los perfiles tipificados, devuelve su catálogo especializado
  switch (perfil.tipo) {
    case 'SANCHEZ':
      return Array.from(RECOMENDACIONES_SANCHEZ);
    case 'TECNICO_BRILLANTE':
      return Array.from(RECOMENDACIONES_TECNICO_BRILLANTE);
    case 'TRADICIONALISTA':
      return Array.from(RECOMENDACIONES_TRADICIONALISTA);
    case 'COLEGA_EJEMPLAR':
      return Array.from(RECOMENDACIONES_COLEGA_EJEMPLAR);
    case 'OPERADOR_ESTABLE':
      return Array.from(RECOMENDACIONES_OPERADOR_ESTABLE);
  }

  // Para otros casos intermedios, construye dinámicamente según las debilidades detectadas (< 7)
  const recomendaciones = [];

  if (c < 7) {
    recomendaciones.push({
      titulo: 'Programa de Asertividad y Comunicación Estratégica',
      descripcion:
        'Fortalecer la claridad y paciencia en la transmisión de informes hacia pares y clientes, ' +
        'eliminando estilos cortantes o defensivos.',
    });
  }

  if (ri < 7) {
    recomendaciones.push({
      titulo: 'Taller de Trabajo en Equipo y Resolución de Conflictos',
      descripcion:
        'Desarrollar habilidades de escucha activa y construcción de consensos, ' +
        'fomentando un clima de cooperación armónico con colaboradores.',
    });
  }

  if (mc < 7) {
    recomendaciones.push({
      titulo: 'Alineación a Manuales de Procedimiento y Gobernanza',
      descripcion:
        'Canalizar propuestas e iniciativas dentro de las normas y valores de la firma, ' +
        'evitando decisiones inconsultas que vulneren los procedimientos institucionales.',
    });
  }

  if (i < 7) {
    recomendaciones.push({
      titulo: 'Mentoría en Proactividad y Pensamiento Comercial',
      descripcion:
        'Estimular la formulación autónoma de sugerencias y la búsqueda espontánea de oportunidades de negocio.',
    });
  }

  if (p < 8) {
    recomendaciones.push({
      titulo: 'Plan de Eficiencia y Optimización de Metas Financieras',
      descripcion:
        'Monitorear trimestralmente el cumplimiento de metas de negocio y la canalización de recursos financieros.',
    });
  }

  // Asegurar siempre un mínimo de 3 recomendaciones y añadir la revisión formal de ascenso
  recomendaciones.push({
    titulo: 'Condicionamiento de Ascenso con Revisión a 6 Meses',
    descripcion:
      'Definir un periodo de prueba de 6 meses donde la reconsideración de su ascenso a Director General ' +
      'estará condicionada en un 50% al desempeño financiero y en un 50% a la mejora integral documentada en su evaluación 360°.',
  });

  return recomendaciones;
}

// ---------------------------------------------------------------------------
// evaluarDesempeno(scores)
// Retorna: { decision, justificacion, perfil, recomendaciones }
// Orden de prioridad estricto: ASCENDER -> DESPEDIR -> MANTENER_EN_PUESTO
// ---------------------------------------------------------------------------

function evaluarDesempeno(scores) {
  const p  = Number(scores.produccion);
  const i  = Number(scores.iniciativa);
  const c  = Number(scores.comunicacion);
  const ri = Number(scores.relacionesInterpersonales);
  const mc = Number(scores.manejoDelCambio);

  // --- Regla 1: ASCENDER (prioridad máxima) --------------------------------
  if (p >= 8 && i >= 8 && c >= 7 && ri >= 7 && mc >= 7) {
    const perfil = clasificarPerfil(DECISION.ASCENDER, p, i, c, ri, mc);
    return {
      decision: DECISION.ASCENDER,
      justificacion:
        'El colaborador cumple con el estándar más exigente de Premium Consultores: ' +
        'excelencia técnica y comercial combinada con las habilidades de liderazgo, ' +
        'comunicación asertiva y alineación cultural necesarias para ejercer la ' +
        'Dirección General de Finanzas.',
      perfil: perfil,
      recomendaciones: [],
    };
  }

  // --- Regla 2: DESPEDIR ---------------------------------------------------
  if (p < 5 || (ri <= 2 && p < 7)) {
    const perfil = clasificarPerfil(DECISION.DESPEDIR, p, i, c, ri, mc);
    return {
      decision: DECISION.DESPEDIR,
      justificacion:
        p < 5
          ? 'El colaborador no alcanza las metas comerciales mínimas requeridas por la ' +
            'unidad de finanzas (Producción < 5). Su contribución al crecimiento de la firma es ' +
            'insuficiente para justificar su continuidad en el rol.'
          : 'El impacto negativo en el clima laboral —reflejado en un nivel crítico de ' +
            'relaciones interpersonales (≤ 2)— supera cualquier aporte financiero. Mantenerlo ' +
            'pondría en riesgo la cohesión y los valores fundamentales de Premium Consultores.',
      perfil: perfil,
      recomendaciones: [],
    };
  }

  // --- Regla 3: MANTENER_EN_PUESTO (caso por defecto — escenario Sánchez y afines) --
  const perfil = clasificarPerfil(DECISION.MANTENER_EN_PUESTO, p, i, c, ri, mc);
  const recomendaciones = generarRecomendacionesDinamicas(perfil, p, i, c, ri, mc);

  return {
    decision: DECISION.MANTENER_EN_PUESTO,
    justificacion: perfil.esCasoSanchez
      ? 'El colaborador presenta una producción sobresaliente (cuota récord de 17% de mercado) ' +
        'que debe preservarse, pero sus actitudes agresivas y decisiones inconsultas impiden ' +
        'ascenderlo a Director General. Se ratifica como Consultor Senior supeditado al Plan de Mejora ' +
        'obligatorio con revisión en 6 meses.'
      : 'El colaborador presenta un aporte comercial y técnico valioso que debe preservarse, ' +
        'pero aún no alcanza el umbral directivo exigido en sus competencias blandas o de innovación. ' +
        'Se recomienda un Plan de Mejora específico con seguimiento antes de reconsiderar su promoción.',
    perfil: perfil,
    recomendaciones: recomendaciones,
  };
}
