/**
 * animations.js
 * Scroll Reveal (IntersectionObserver) + Parallax for hero and filosofia.
 */

(function () {
  'use strict';

  /* ── Scroll Reveal ──────────────────────────────────────── */

  function initReveal() {
    const els = document.querySelectorAll('[data-reveal]');
    if (!els.length) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    els.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ── Parallax ───────────────────────────────────────────── */

  function initParallax() {
    var heroBg   = document.getElementById('hero-parallax');
    var filoBg   = document.getElementById('filo-parallax');
    var filosec  = document.getElementById('filosofia');

    if (!heroBg && !filoBg) return;

    function onScroll() {
      var y = window.scrollY || 0;

      if (heroBg) {
        heroBg.style.transform = 'translateY(' + (y * 0.12) + 'px)';
      }

      if (filoBg && filosec) {
        var rect = filosec.getBoundingClientRect();
        filoBg.style.transform = 'translateY(' + (rect.top * -0.12) + 'px)';
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Init ───────────────────────────────────────────────── */

  document.addEventListener('DOMContentLoaded', function () {
    initReveal();
    initParallax();
  });

}());
