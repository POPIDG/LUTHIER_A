/**
 * main.js
 * Core behaviors: sticky navbar, mobile menu, smooth scroll, back-to-top.
 * Loaded last so all DOM elements are available.
 */

(function () {
  'use strict';

  var NAV_HEIGHT = 72;

  /* ── Page loader ──────────────────────────────────────────── */

  function initPageLoader() {
    var loader = document.getElementById('page-loader');
    if (!loader) return;

    if (sessionStorage.getItem('loaderShown')) {
      loader.classList.add('is-hidden');
      return;
    }
    sessionStorage.setItem('loaderShown', '1');

    var MIN_VISIBLE = 3000;
    var start = Date.now();

    function hideLoader() {
      var wait = Math.max(MIN_VISIBLE - (Date.now() - start), 0);
      setTimeout(function () {
        loader.classList.add('is-hidden');
      }, wait);
    }

    if (document.readyState === 'complete') {
      hideLoader();
    } else {
      window.addEventListener('load', hideLoader);
    }
  }

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

  /* ── Docentes: flip cards (click/tap, not hover — works on touch) ── */

  function initDocenteCards() {
    var cards = document.querySelectorAll('.docente-card');

    cards.forEach(function (card) {
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-pressed', 'false');

      function toggle() {
        var flipped = card.classList.toggle('is-flipped');
        card.setAttribute('aria-pressed', String(flipped));
      }

      card.addEventListener('click', toggle);
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      });
    });
  }

  /* ── Galería: dots + drag-to-scroll for the mobile carousel ──────
     On desktop the grid is a masonry column layout (no horizontal
     overflow), so the pagination naturally computes a single page and
     stays hidden — the same generic logic just adapts once CSS turns
     the grid into a horizontal track at ≤560px (see responsive.css /
     curso-detalle.css). Shared by both the index.html Galería and the
     curso page's Galería (different track/pagination ids, same markup
     pattern). */

  function initGalleryCarousel(trackId, paginationId) {
    var track = document.getElementById(trackId);
    var pagination = document.getElementById(paginationId);
    if (!track) return;

    function getGap() {
      var trackStyle = getComputedStyle(track);
      var parsedGap = parseFloat(trackStyle.columnGap || trackStyle.gap || 16);
      return Number.isFinite(parsedGap) ? parsedGap : 16;
    }

    function getVisibleCardCount() {
      var cards = track.querySelectorAll('.gallery-item');
      if (!cards.length) return 1;

      var rect = track.getBoundingClientRect();
      var visibleCount = 0;
      cards.forEach(function (card) {
        var cardRect = card.getBoundingClientRect();
        if (cardRect.right - 1 > rect.left && cardRect.left + 1 < rect.right) {
          visibleCount += 1;
        }
      });

      return Math.max(1, visibleCount || 1);
    }

    function getPageStep() {
      var firstCard = track.querySelector('.gallery-item');
      if (!firstCard) return Math.max(1, track.clientWidth * 0.9);

      var cardWidth = firstCard.getBoundingClientRect().width;
      var visibleCount = getVisibleCardCount();
      var gap = getGap();
      return Math.max(1, visibleCount * cardWidth + Math.max(0, visibleCount - 1) * gap);
    }

    function renderPagination() {
      if (!pagination) return;

      var cards = track.querySelectorAll('.gallery-item');
      if (!cards.length) {
        pagination.innerHTML = '';
        pagination.hidden = true;
        return;
      }

      var visibleCount = getVisibleCardCount();
      var totalPages = Math.max(1, Math.ceil(cards.length / visibleCount));
      pagination.innerHTML = '';

      if (totalPages <= 1) {
        pagination.hidden = true;
        return;
      }

      for (var i = 0; i < totalPages; i += 1) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'inst-dot';
        dot.setAttribute('aria-label', 'Ir a la imagen ' + (i + 1));
        dot.dataset.page = String(i);
        dot.addEventListener('click', function () {
          var pageIndex = Number(this.dataset.page);
          var maxScroll = track.scrollWidth - track.clientWidth;
          var targetLeft = Math.min(maxScroll, pageIndex * getPageStep());
          track.scrollTo({ left: targetLeft, behavior: 'smooth' });
        });
        pagination.appendChild(dot);
      }

      pagination.hidden = false;
      updatePagination();
    }

    function updatePagination() {
      if (!pagination) return;
      var dots = pagination.querySelectorAll('.inst-dot');
      if (!dots.length) {
        pagination.hidden = true;
        return;
      }

      var totalPages = dots.length;
      if (totalPages <= 1) {
        pagination.hidden = true;
        return;
      }

      var maxScroll = track.scrollWidth - track.clientWidth;
      var currentPage = maxScroll > 0 ? Math.round(track.scrollLeft / getPageStep()) : 0;
      currentPage = Math.max(0, Math.min(totalPages - 1, currentPage));

      dots.forEach(function (dot, index) {
        var isActive = index === currentPage;
        dot.classList.toggle('is-active', isActive);
        dot.setAttribute('aria-current', isActive ? 'page' : 'false');
      });
      pagination.hidden = false;
    }

    /* Drag to scroll (mobile carousel mode only — a no-op when the
       grid has no horizontal overflow, i.e. the desktop masonry layout) */
    var isDragging = false;
    var startX = 0;
    var startLeft = 0;

    track.addEventListener('pointerdown', function (e) {
      if (e.target.closest('a, button')) return;
      isDragging = true;
      startX = e.pageX;
      startLeft = track.scrollLeft;
      track.classList.add('is-dragging');
      track.setPointerCapture(e.pointerId);
    });
    track.addEventListener('pointermove', function (e) {
      if (!isDragging) return;
      track.scrollLeft = startLeft - (e.pageX - startX);
    });
    track.addEventListener('pointerup', function () {
      isDragging = false;
      track.classList.remove('is-dragging');
    });
    track.addEventListener('pointercancel', function () {
      isDragging = false;
      track.classList.remove('is-dragging');
    });

    renderPagination();
    track.addEventListener('scroll', updatePagination, { passive: true });
    window.addEventListener('resize', renderPagination, { passive: true });
  }

  /* ── Init ─────────────────────────────────────────────────── */

  document.addEventListener('DOMContentLoaded', function () {
    initPageLoader();
    initSmoothScroll();
    initMobileMenu();
    initBackToTop();
    initNavbarScroll();
    initPromoBar();
    initVideoBanner();
    initDocenteCards();
    initGalleryCarousel('gallery-grid', 'gallery-pagination');
    initGalleryCarousel('curso-gallery-grid', 'curso-gallery-pagination');
  });

}());
