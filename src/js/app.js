/**
 * app.js — Controlador de UI
 * Premium Consultores | Sistema de Evaluación de Empleados
 *
 * REGLA ARQUITECTÓNICA (CONSTITUTION.md):
 * Este archivo SOLO captura entradas del formulario, invoca agentLogic.js
 * y renderiza el resultado en el HTML.
 * No contiene lógica de negocio ni reglas de evaluación.
 */

document.addEventListener('DOMContentLoaded', function () {

  // -------------------------------------------------------------------------
  // 1. REFERENCIAS AL DOM
  // -------------------------------------------------------------------------

  const form              = document.getElementById('evaluacion-form');
  const btnReiniciar      = document.getElementById('btn-reiniciar');
  const seccionResultado  = document.getElementById('seccion-resultado');
  const decisionBadge     = document.getElementById('decision-badge');
  const decisionIcono     = document.getElementById('decision-icono');
  const decisionTexto     = document.getElementById('decision-texto');
  const decisionJust      = document.getElementById('decision-justificacion');
  const listaPuntajes     = document.getElementById('lista-puntajes');
  const recContainer      = document.getElementById('recomendaciones-container');
  const listaRec          = document.getElementById('lista-recomendaciones');
  const anioFooter        = document.getElementById('anio-footer');

  /** IDs de los 5 campos, en orden. */
  const CAMPOS = [
    { id: 'produccion',                 etiqueta: 'Producción' },
    { id: 'iniciativa',                 etiqueta: 'Iniciativa' },
    { id: 'comunicacion',               etiqueta: 'Comunicación' },
    { id: 'relacionesInterpersonales',  etiqueta: 'Rel. Interpersonales' },
    { id: 'manejoDelCambio',            etiqueta: 'Manejo del Cambio' },
  ];

  /** Configuración visual por decisión. */
  const CONFIG_DECISION = {
    ASCENDER: {
      claseCSS: 'badge-ascender',
      icono:    '✔',
      etiqueta: 'ASCENDER',
    },
    DESPEDIR: {
      claseCSS: 'badge-despedir',
      icono:    '✘',
      etiqueta: 'DESPEDIR',
    },
    MANTENER_EN_PUESTO: {
      claseCSS: 'badge-mantener',
      icono:    '◉',
      etiqueta: 'MANTENER EN PUESTO',
    },
  };

  // -------------------------------------------------------------------------
  // 2. INICIALIZACIÓN
  // -------------------------------------------------------------------------

  // Escribir el año actual en el footer
  if (anioFooter) {
    anioFooter.textContent = new Date().getFullYear();
  }

  // -------------------------------------------------------------------------
  // 3. EVENTO: SUBMIT DEL FORMULARIO
  // -------------------------------------------------------------------------

  form.addEventListener('submit', function (evento) {
    evento.preventDefault();

    // 3.1 Leer los valores del formulario
    var scores = leerFormulario();

    // 3.2 Validar entradas con agentLogic.js
    var resultadoValidacion = validarEntradas(scores);

    if (!resultadoValidacion.valido) {
      renderizarErrores(resultadoValidacion.errores);
      return;   // Abortar: no calcular mientras haya errores
    }

    // 3.3 Limpiar errores anteriores
    limpiarErrores();

    // 3.4 Calcular decisión con agentLogic.js
    var resultado = evaluarDesempeno(scores);

    // 3.5 Renderizar resultado
    renderizarResultado(scores, resultado);
  });

  // -------------------------------------------------------------------------
  // 4. EVENTO: RESET (botón Reiniciar)
  // -------------------------------------------------------------------------

  btnReiniciar.addEventListener('click', function () {
    limpiarErrores();
    ocultarResultado();
    // El <button type="reset"> ya limpia los campos del formulario
  });

  // -------------------------------------------------------------------------
  // 5. HELPERS — LECTURA DEL FORMULARIO
  // -------------------------------------------------------------------------

  /**
   * Lee los 5 campos del formulario y construye el objeto scores.
   * Los valores se leen como string; la validación y conversión
   * ocurre en agentLogic.js (validarEntradas y evaluarDesempeno).
   * @returns {{ produccion, iniciativa, comunicacion,
   *             relacionesInterpersonales, manejoDelCambio }}
   */
  function leerFormulario() {
    var scores = {};
    CAMPOS.forEach(function (campo) {
      var input = document.getElementById(campo.id);
      scores[campo.id] = input ? input.value.trim() : '';
    });
    return scores;
  }

  // -------------------------------------------------------------------------
  // 6. HELPERS — MANEJO DE ERRORES DE VALIDACIÓN
  // -------------------------------------------------------------------------

  /**
   * Muestra los mensajes de error en línea junto a cada campo infractor.
   * @param {{ [campoId]: string }} errores
   */
  function renderizarErrores(errores) {
    // Primero limpiar todos
    limpiarErrores();

    Object.keys(errores).forEach(function (campoId) {
      var grupoEl = document.getElementById('grupo-' + campoId);
      var errorEl = document.getElementById('error-' + campoId);

      if (grupoEl) grupoEl.classList.add('con-error');
      if (errorEl) errorEl.textContent = errores[campoId];
    });

    // Enfocar el primer campo con error
    var primerError = Object.keys(errores)[0];
    if (primerError) {
      var inputError = document.getElementById(primerError);
      if (inputError) inputError.focus();
    }
  }

  /**
   * Elimina todos los mensajes de error y estilos de campo erróneo.
   */
  function limpiarErrores() {
    CAMPOS.forEach(function (campo) {
      var grupoEl = document.getElementById('grupo-' + campo.id);
      var errorEl = document.getElementById('error-' + campo.id);

      if (grupoEl) grupoEl.classList.remove('con-error');
      if (errorEl) errorEl.textContent = '';
    });
  }

  // -------------------------------------------------------------------------
  // 7. HELPERS — RENDERIZADO DEL RESULTADO
  // -------------------------------------------------------------------------

  /**
   * Renderiza el bloque de resultado completo.
   * @param {Object} scores  — puntajes ingresados
   * @param {Object} resultado — { decision, justificacion, recomendaciones }
   */
  function renderizarResultado(scores, resultado) {
    var config = CONFIG_DECISION[resultado.decision];

    // 7.1 Badge de decisión
    decisionBadge.className  = 'decision-badge ' + config.claseCSS;
    decisionIcono.textContent = config.icono;
    decisionTexto.textContent = config.etiqueta;

    // 7.2 Justificación
    decisionJust.textContent = resultado.justificacion;

    // 7.3 Resumen de puntajes
    renderizarPuntajes(scores);

    // 7.4 Recomendaciones (solo si las hay)
    if (resultado.recomendaciones && resultado.recomendaciones.length > 0) {
      renderizarRecomendaciones(resultado.recomendaciones);
      recContainer.classList.remove('hidden');
    } else {
      recContainer.classList.add('hidden');
      listaRec.innerHTML = '';
    }

    // 7.5 Mostrar sección y hacer scroll suave
    mostrarResultado();
  }

  /**
   * Genera la lista de puntajes (5 ítems: competencia → valor).
   * @param {Object} scores
   */
  function renderizarPuntajes(scores) {
    listaPuntajes.innerHTML = '';

    CAMPOS.forEach(function (campo) {
      var li = document.createElement('li');
      li.className = 'puntaje-item';

      var labelSpan = document.createElement('span');
      labelSpan.className   = 'puntaje-label';
      labelSpan.textContent = campo.etiqueta;

      var valorSpan = document.createElement('span');
      valorSpan.className   = 'puntaje-valor';
      valorSpan.textContent = scores[campo.id];

      li.appendChild(labelSpan);
      li.appendChild(valorSpan);
      listaPuntajes.appendChild(li);
    });
  }

  /**
   * Genera la lista ordenada de recomendaciones accionables.
   * @param {Array<{ titulo: string, descripcion: string }>} recomendaciones
   */
  function renderizarRecomendaciones(recomendaciones) {
    listaRec.innerHTML = '';

    recomendaciones.forEach(function (rec) {
      var li = document.createElement('li');
      li.className = 'recomendacion-item';

      var cuerpo = document.createElement('div');
      cuerpo.className = 'recomendacion-cuerpo';

      var titulo = document.createElement('p');
      titulo.className   = 'recomendacion-titulo';
      titulo.textContent = rec.titulo;

      var desc = document.createElement('p');
      desc.className   = 'recomendacion-desc';
      desc.textContent = rec.descripcion;

      cuerpo.appendChild(titulo);
      cuerpo.appendChild(desc);
      li.appendChild(cuerpo);
      listaRec.appendChild(li);
    });
  }

  // -------------------------------------------------------------------------
  // 8. HELPERS — VISIBILIDAD DE LA SECCIÓN RESULTADO
  // -------------------------------------------------------------------------

  function mostrarResultado() {
    seccionResultado.classList.remove('hidden');
    seccionResultado.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function ocultarResultado() {
    seccionResultado.classList.add('hidden');
  }

});
