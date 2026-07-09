/**
 * main.js
 * Core behaviors: sticky navbar, mobile menu, smooth scroll, back-to-top.
 * Loaded last so all DOM elements are available.
 */

(function () {
  'use strict';

  var NAV_HEIGHT = 72;

  /* ── Smooth scroll for all anchor links ─────────────────── */

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"], .nav-link, .mobile-nav-link, .footer-link').forEach(function (el) {
      el.addEventListener('click', function (e) {
        var href = el.getAttribute('href') || '#';
        /* Only handle hash links */
        if (!href.startsWith('#')) return;

        var target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        var top = target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
        window.scrollTo({ top: top, behavior: 'smooth' });

        /* Close mobile menu if open */
        closeMobileMenu();
      });
    });
  }

  /* ── Mobile menu ─────────────────────────────────────────── */

  var burger  = document.getElementById('nav-burger');
  var menu    = document.getElementById('mobile-menu');
  var overlay = document.getElementById('menu-overlay');

  function openMobileMenu() {
    if (!menu) return;
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    if (overlay) overlay.classList.add('is-open');
    if (burger)  {
      burger.classList.add('is-open');
      burger.setAttribute('aria-expanded', 'true');
    }
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (!menu) return;
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    if (overlay) overlay.classList.remove('is-open');
    if (burger)  {
      burger.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    }
    document.body.style.overflow = '';
  }

  function initMobileMenu() {
    if (!burger) return;

    burger.addEventListener('click', function () {
      var isOpen = menu && menu.classList.contains('is-open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    if (overlay) {
      overlay.addEventListener('click', closeMobileMenu);
    }

    /* Close on Escape */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu && menu.classList.contains('is-open')) {
        closeMobileMenu();
      }
    });
  }

  /* ── Back to top (floating button) ──────────────────────── */

  function initBackToTop() {
    var btn        = document.getElementById('back-top');
    var footerBtn  = document.getElementById('footer-top-btn');
    var THRESHOLD  = 520;

    function scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (btn) btn.addEventListener('click', scrollToTop);
    if (footerBtn) footerBtn.addEventListener('click', scrollToTop);

    window.addEventListener('scroll', function () {
      if (!btn) return;
      var show = (window.scrollY || 0) > THRESHOLD;
      btn.classList.toggle('is-visible', show);
    }, { passive: true });
  }

  /* ── Scroll-based navbar shadow ─────────────────────────── */

  function initNavbarScroll() {
    var navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', function () {
      if ((window.scrollY || 0) > 20) {
        navbar.style.boxShadow = '0 4px 32px rgba(0,0,0,.3)';
      } else {
        navbar.style.boxShadow = '';
      }
    }, { passive: true });
  }

  /* ── Promo bar (hides on scroll down, reappears on scroll up) ── */

  function initPromoBar() {
    var promo  = document.getElementById('promo-bar');
    var navbar = document.getElementById('navbar');
    if (!promo) return;

    var lastY     = window.scrollY || 0;
    var THRESHOLD = 40;

    window.addEventListener('scroll', function () {
      var y    = window.scrollY || 0;
      var hide = y > lastY && y > THRESHOLD;

      promo.classList.toggle('is-hidden', hide);
      if (navbar) navbar.classList.toggle('promo-hidden', hide);

      lastY = y;
    }, { passive: true });
  }

  /* ── Video banner play/pause toggle ───────────────────────── */

  function initVideoBanner() {
    var video = document.getElementById('video-banner-media');
    var btn   = document.getElementById('video-banner-toggle');
    if (!video || !btn) return;

    var iconPause = btn.querySelector('.icon-pause');
    var iconPlay  = btn.querySelector('.icon-play');

    function setState(playing) {
      iconPause.hidden = !playing;
      iconPlay.hidden  = playing;
      btn.setAttribute('aria-pressed', String(!playing));
      btn.setAttribute('aria-label', playing ? 'Pausar video' : 'Reproducir video');
    }

    btn.addEventListener('click', function () {
      if (video.paused) {
        video.play();
        setState(true);
      } else {
        video.pause();
        setState(false);
      }
    });
  }

  /* ── Init ─────────────────────────────────────────────────── */

  document.addEventListener('DOMContentLoaded', function () {
    initSmoothScroll();
    initMobileMenu();
    initBackToTop();
    initNavbarScroll();
    initPromoBar();
    initVideoBanner();
  });

}());
