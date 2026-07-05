/**
 * form.js
 * Contact form validation.
 * Fields: Nombre, Apellido, Email, Teléfono, Mensaje.
 */

(function () {
  'use strict';

  function initForm() {
    var form    = document.getElementById('contact-form');
    var success = document.getElementById('form-success');

    if (!form) return;

    /* Field validation rules */
    var fields = [
      {
        name:     'nombre',
        errorId:  'error-nombre',
        validate: function (v) { return v.length > 0; },
        message:  'Ingresá tu nombre.'
      },
      {
        name:     'apellido',
        errorId:  'error-apellido',
        validate: function (v) { return v.length > 0; },
        message:  'Ingresá tu apellido.'
      },
      {
        name:     'email',
        errorId:  'error-email',
        validate: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message:  'Ingresá un email válido.'
      },
      {
        name:     'telefono',
        errorId:  'error-telefono',
        validate: function (v) { return v.length > 0; },
        message:  'Ingresá tu teléfono.'
      },
      {
        name:     'mensaje',
        errorId:  'error-mensaje',
        validate: function (v) { return v.length > 0; },
        message:  'Escribí tu mensaje.'
      }
    ];

    function getVal(name) {
      var el = form.elements[name];
      return el ? el.value.trim() : '';
    }

    function showError(errorId, message) {
      var el = document.getElementById(errorId);
      if (el) el.textContent = message;
    }

    function clearError(errorId) {
      var el = document.getElementById(errorId);
      if (el) el.textContent = '';
    }

    function clearAll() {
      fields.forEach(function (f) { clearError(f.errorId); });
      if (success) success.textContent = '';
    }

    /* Real-time clearing when user types */
    fields.forEach(function (f) {
      var el = form.elements[f.name];
      if (!el) return;
      el.addEventListener('input', function () {
        clearError(f.errorId);
      });
    });

    /* Submit */
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      clearAll();

      var hasErrors = false;

      fields.forEach(function (f) {
        var val = getVal(f.name);
        if (!f.validate(val)) {
          showError(f.errorId, f.message);
          hasErrors = true;
        }
      });

      if (hasErrors) return;

      /* Success */
      form.reset();
      if (success) {
        success.textContent = '✓ ¡Gracias! Tu mensaje fue enviado correctamente.';
      }
    });
  }

  /* Reveal the contact form when "Reservar una Entrevista" is clicked */
  function initReservarToggle() {
    var btn  = document.getElementById('btn-reservar-entrevista');
    var form = document.getElementById('contact-form');
    if (!btn || !form) return;

    btn.addEventListener('click', function () {
      var isOpen = form.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

      if (isOpen) {
        setTimeout(function () {
          form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', initForm);
  document.addEventListener('DOMContentLoaded', initReservarToggle);

}());
