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

  const form                = document.getElementById('evaluacion-form');
  const btnReiniciar        = document.getElementById('btn-reiniciar');
  const seccionResultado    = document.getElementById('seccion-resultado');
  const decisionBadge       = document.getElementById('decision-badge');
  const decisionIcono       = document.getElementById('decision-icono');
  const decisionTexto       = document.getElementById('decision-texto');
  const decisionJust        = document.getElementById('decision-justificacion');
  const perfilRutaBadge     = document.getElementById('perfil-ruta-badge');
  const perfilRutaIcono     = document.getElementById('perfil-ruta-icono');
  const perfilRutaNombre    = document.getElementById('perfil-ruta-nombre');
  const perfilRutaSubtitulo = document.getElementById('perfil-ruta-subtitulo');
  const listaPuntajes       = document.getElementById('lista-puntajes');
  const recContainer        = document.getElementById('recomendaciones-container');
  const listaRec            = document.getElementById('lista-recomendaciones');
  const anioFooter          = document.getElementById('anio-footer');

  // Elementos de la sección del esquema y botones de ejemplo
  const btnToggleEsquema    = document.getElementById('btn-toggle-esquema');
  const esquemaCuerpo       = document.getElementById('esquema-cuerpo');
  const botonesEjemplos     = document.querySelectorAll('.btn-ejemplo');

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

  if (anioFooter) {
    anioFooter.textContent = new Date().getFullYear();
  }

  // -------------------------------------------------------------------------
  // 3. BOTONES DE CASOS DE REFERENCIA (PRESETS SUTILES)
  // -------------------------------------------------------------------------

  botonesEjemplos.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var rawScores = btn.getAttribute('data-scores');
      if (!rawScores) return;

      try {
        var scores = JSON.parse(rawScores);

        CAMPOS.forEach(function (campo) {
          var input = document.getElementById(campo.id);
          if (input && scores[campo.id] !== undefined) {
            input.value = scores[campo.id];
          }
        });

        limpiarErrores();

        // Evaluar automáticamente los valores del caso seleccionado
        var validacion = validarEntradas(scores);
        if (validacion.valido) {
          var resultado = evaluarDesempeno(scores);
          renderizarResultado(scores, resultado);
        }
      } catch (err) {
        console.error('Error al cargar caso de ejemplo:', err);
      }
    });
  });

  // -------------------------------------------------------------------------
  // 4. TOGGLE DEL ESQUEMA GRÁFICO
  // -------------------------------------------------------------------------

  if (btnToggleEsquema && esquemaCuerpo) {
    btnToggleEsquema.addEventListener('click', function () {
      var estaOculto = esquemaCuerpo.classList.toggle('hidden');
      btnToggleEsquema.textContent = estaOculto ? 'Ver Esquema Completo' : 'Contraer Esquema';
      btnToggleEsquema.setAttribute('aria-expanded', !estaOculto);
    });
  }

  // -------------------------------------------------------------------------
  // 5. EVENTO: SUBMIT DEL FORMULARIO
  // -------------------------------------------------------------------------

  form.addEventListener('submit', function (evento) {
    evento.preventDefault();

    // 5.1 Leer los valores del formulario
    var scores = leerFormulario();

    // 5.2 Validar entradas con agentLogic.js
    var resultadoValidacion = validarEntradas(scores);

    if (!resultadoValidacion.valido) {
      renderizarErrores(resultadoValidacion.errores);
      return;
    }

    // 5.3 Limpiar errores anteriores
    limpiarErrores();

    // 5.4 Calcular decisión con agentLogic.js
    var resultado = evaluarDesempeno(scores);

    // 5.5 Renderizar resultado
    renderizarResultado(scores, resultado);
  });

  // -------------------------------------------------------------------------
  // 6. EVENTO: RESET (botón Reiniciar)
  // -------------------------------------------------------------------------

  btnReiniciar.addEventListener('click', function () {
    limpiarErrores();
    ocultarResultado();
  });

  // -------------------------------------------------------------------------
  // 7. HELPERS — LECTURA DEL FORMULARIO
  // -------------------------------------------------------------------------

  function leerFormulario() {
    var scores = {};
    CAMPOS.forEach(function (campo) {
      var input = document.getElementById(campo.id);
      scores[campo.id] = input ? input.value.trim() : '';
    });
    return scores;
  }

  // -------------------------------------------------------------------------
  // 8. HELPERS — MANEJO DE ERRORES DE VALIDACIÓN
  // -------------------------------------------------------------------------

  function renderizarErrores(errores) {
    limpiarErrores();

    Object.keys(errores).forEach(function (campoId) {
      var grupoEl = document.getElementById('grupo-' + campoId);
      var errorEl = document.getElementById('error-' + campoId);

      if (grupoEl) grupoEl.classList.add('con-error');
      if (errorEl) errorEl.textContent = errores[campoId];
    });

    var primerError = Object.keys(errores)[0];
    if (primerError) {
      var inputError = document.getElementById(primerError);
      if (inputError) inputError.focus();
    }
  }

  function limpiarErrores() {
    CAMPOS.forEach(function (campo) {
      var grupoEl = document.getElementById('grupo-' + campo.id);
      var errorEl = document.getElementById('error-' + campo.id);

      if (grupoEl) grupoEl.classList.remove('con-error');
      if (errorEl) errorEl.textContent = '';
    });
  }

  // -------------------------------------------------------------------------
  // 9. HELPERS — RENDERIZADO DEL RESULTADO
  // -------------------------------------------------------------------------

  function renderizarResultado(scores, resultado) {
    var config = CONFIG_DECISION[resultado.decision];

    // 9.1 Badge de decisión principal
    decisionBadge.className   = 'decision-badge ' + config.claseCSS;
    decisionIcono.textContent = config.icono;
    decisionTexto.textContent = config.etiqueta;

    // 9.2 Justificación
    decisionJust.textContent = resultado.justificacion;

    // 9.3 Perfil y Ruta detectada
    if (resultado.perfil) {
      perfilRutaIcono.textContent = resultado.perfil.icono || '★';
      perfilRutaNombre.textContent = resultado.perfil.nombre;
      perfilRutaSubtitulo.textContent = resultado.perfil.subtitulo;

      if (resultado.perfil.esCasoSanchez) {
        perfilRutaBadge.className = 'perfil-ruta-badge perfil-sanchez';
      } else {
        perfilRutaBadge.className = 'perfil-ruta-badge';
      }
    }

    // 9.4 Resumen de puntajes
    renderizarPuntajes(scores);

    // 9.5 Recomendaciones (solo para MANTENER_EN_PUESTO)
    if (resultado.recomendaciones && resultado.recomendaciones.length > 0) {
      renderizarRecomendaciones(resultado.recomendaciones);
      recContainer.classList.remove('hidden');
    } else {
      recContainer.classList.add('hidden');
      listaRec.innerHTML = '';
    }

    // 9.6 Mostrar sección y hacer scroll
    mostrarResultado();
  }

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
  // 10. HELPERS — VISIBILIDAD
  // -------------------------------------------------------------------------

  function mostrarResultado() {
    seccionResultado.classList.remove('hidden');
    seccionResultado.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function ocultarResultado() {
    seccionResultado.classList.add('hidden');
  }

});
