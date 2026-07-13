/**
 * newsletter-popup.js
 * Postal-style newsletter popup — opens once per session when the
 * user scrolls into #maderas (IntersectionObserver), closes on
 * overlay/✕ click, and shows a confirmation message on submit.
 */

(function () {
  'use strict';

  var STORAGE_KEY = 'newsletterPopupShown';
  var SUCCESS_DELAY = 3000;

  function init() {
    var section  = document.getElementById('maderas');
    var popup    = document.getElementById('newsletter-popup');
    var overlay  = document.getElementById('newsletter-overlay');
    var closeBtn = document.getElementById('newsletter-close');
    var form     = document.getElementById('newsletter-form');
    var success  = document.getElementById('newsletter-success');

    if (!section || !popup) return;

    if (sessionStorage.getItem(STORAGE_KEY)) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            openPopup();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(section);

    function openPopup() {
      popup.hidden = false;
      popup.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closePopup() {
      popup.hidden = true;
      popup.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      sessionStorage.setItem(STORAGE_KEY, '1');
    }

    if (overlay)  overlay.addEventListener('click', closePopup);
    if (closeBtn) closeBtn.addEventListener('click', closePopup);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !popup.hidden) closePopup();
    });

    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        form.hidden = true;
        if (success) success.hidden = false;
        setTimeout(closePopup, SUCCESS_DELAY);
      });
    }
  }

  document.addEventListener('DOMContentLoaded', init);

}());
