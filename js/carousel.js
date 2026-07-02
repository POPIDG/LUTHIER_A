/**
 * carousel.js
 * Horizontal drag-to-scroll carousels with arrow navigation.
 * Used by: Courses section, Instruments section.
 */

(function () {
  'use strict';

  /**
   * Vincula una barra de progreso continua a un track scrolleable.
   * @param {HTMLElement} track   - El contenedor con overflow-x: auto.
   * @param {string}      thumbId - ID del elemento thumb de la barra.
   * @param {string}      barId   - ID del contenedor de la barra (para aria).
   */
  function initProgressBar(track, thumbId, barId) {
    var thumb = document.getElementById(thumbId);
    var bar   = document.getElementById(barId);
    if (!thumb || !track) return;

    function update() {
      var maxScroll  = track.scrollWidth - track.clientWidth;
      var progress   = maxScroll > 0 ? track.scrollLeft / maxScroll : 0;
      var thumbRatio = track.clientWidth / track.scrollWidth;
      var thumbPct   = thumbRatio * 100;
      var leftPct    = progress * (100 - thumbPct);
      thumb.style.width = thumbPct + '%';
      thumb.style.left  = leftPct  + '%';
      if (bar) bar.setAttribute('aria-valuenow', Math.round(progress * 100));
    }

    track.addEventListener('scroll', update, { passive: true });
    requestAnimationFrame(update);
  }

  /**
   * Carrusel genérico: drag-to-scroll + barra de progreso.
   * @param {string} trackId   - ID del track.
   * @param {string} thumbId   - ID del thumb de la progress bar.
   * @param {string} barId     - ID del contenedor de la progress bar.
   */
  function initCarousel(trackId, thumbId, barId, paginationId) {
    var track = document.getElementById(trackId);
    if (!track) return;

    /* ── Drag to scroll ── */
    var isDragging = false;
    var startX     = 0;
    var startLeft  = 0;

    track.addEventListener('pointerdown', function (e) {
      isDragging = true;
      startX     = e.pageX;
      startLeft  = track.scrollLeft;
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

    /* ── Progress bar ── */
    initProgressBar(track, thumbId, barId);

    if (paginationId) {
      var pagination = document.getElementById(paginationId);
      if (pagination) {
        function getGap() {
          var trackStyle = getComputedStyle(track);
          var parsedGap = parseFloat(trackStyle.columnGap || trackStyle.gap || 26);
          return Number.isFinite(parsedGap) ? parsedGap : 26;
        }

        function getVisibleCardCount() {
          var cards = track.querySelectorAll('.course-card');
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
          var firstCard = track.querySelector('.course-card');
          if (!firstCard) return Math.max(1, track.clientWidth * 0.9);

          var cardWidth = firstCard.getBoundingClientRect().width;
          var visibleCount = getVisibleCardCount();
          var gap = getGap();
          return Math.max(1, visibleCount * cardWidth + Math.max(0, visibleCount - 1) * gap);
        }

        function renderPagination() {
          var cards = track.querySelectorAll('.course-card');
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
            dot.className = 'carousel-dot';
            dot.setAttribute('aria-label', 'Ir a la página ' + (i + 1));
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
          var dots = pagination.querySelectorAll('.carousel-dot');
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

        renderPagination();
        track.addEventListener('scroll', updatePagination, { passive: true });
        window.addEventListener('resize', renderPagination, { passive: true });
      }
    }
  }

  /* ── Instrument carousel with dots + detail panel ── */

  function initInstrumentCarousel() {
    var track = document.getElementById('inst-track');
    var ficha = document.getElementById('inst-ficha');
    var pagination = document.getElementById('inst-pagination');

    if (!track) return;

    function getGap() {
      var trackStyle = getComputedStyle(track);
      var parsedGap = parseFloat(trackStyle.columnGap || trackStyle.gap || 18);
      return Number.isFinite(parsedGap) ? parsedGap : 18;
    }

    function getVisibleCardCount() {
      var cards = track.querySelectorAll('.inst-card');
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
      var firstCard = track.querySelector('.inst-card');
      if (!firstCard) return Math.max(1, track.clientWidth * 0.9);

      var cardWidth = firstCard.getBoundingClientRect().width;
      var visibleCount = getVisibleCardCount();
      var gap = getGap();
      return Math.max(1, visibleCount * cardWidth + Math.max(0, visibleCount - 1) * gap);
    }

    function renderPagination() {
      if (!pagination) return;

      var cards = track.querySelectorAll('.inst-card');
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
        dot.setAttribute('aria-label', 'Ir a la página ' + (i + 1));
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

    /* Drag to scroll */
    var isDragging = false;
    var hasDragged = false;
    var startX = 0;
    var startLeft = 0;

    track.addEventListener('pointerdown', function (e) {
      isDragging = true;
      hasDragged = false;
      startX = e.pageX;
      startLeft = track.scrollLeft;
      track.classList.add('is-dragging');
      track.setPointerCapture(e.pointerId);
    });
    track.addEventListener('pointermove', function (e) {
      if (!isDragging) return;
      var dx = e.pageX - startX;
      if (Math.abs(dx) > 5) hasDragged = true;
      track.scrollLeft = startLeft - dx;
    });
    track.addEventListener('pointerup', function () {
      isDragging = false;
      track.classList.remove('is-dragging');
    });
    track.addEventListener('pointercancel', function () {
      isDragging = false;
      hasDragged = false;
      track.classList.remove('is-dragging');
    });

    renderPagination();
    track.addEventListener('scroll', updatePagination, { passive: true });
    window.addEventListener('resize', renderPagination, { passive: true });

    /* Instrument data for ficha panel */
    var instruments = {
      'guitarra-clasica':  { name: 'Guitarra Clásica',  cardImg: 'assets/instrumentos/guitarra-clasica.png', fichaImg: 'assets/instrumentos/guitarra-clasica.png' },
      'guitarra-acustica': { name: 'Guitarra Acústica',  cardImg: 'assets/instrumentos/guitarra-acustica.png', fichaImg: 'assets/instrumentos/guitarra-acustica.png' },
      'guitarra-electrica':{ name: 'Guitarra Eléctrica', cardImg: 'assets/instrumentos/guitarra-electrica.png', fichaImg: 'assets/instrumentos/guitarra-electrica.png' },
      'bajo':              { name: 'Bajo',               cardImg: 'assets/instrumentos/bajo.png', fichaImg: 'assets/instrumentos/bajo.png' },
      'ukelele':           { name: 'Ukelele',            cardImg: 'assets/instrumentos/ukelele.png', fichaImg: 'assets/instrumentos/ukelele.png' },
      'chelo':             { name: 'Chelo',              cardImg: 'assets/instrumentos/chelo.png', fichaImg: 'assets/instrumentos/chelo.png' },
      'violin':            { name: 'Violín',             cardImg: 'assets/instrumentos/violin.png', fichaImg: 'assets/instrumentos/violin.png' },
      'piano-cola':        { name: 'Piano de cola',      cardImg: 'assets/instrumentos/piano-cola.png', fichaImg: 'assets/instrumentos/piano-cola.png' }
    };

    var activeId = null;

    function syncCardImages() {
      document.querySelectorAll('.inst-card').forEach(function (card) {
        var id = card.dataset.id;
        var data = instruments[id];
        if (!data) return;

        var img = card.querySelector('.inst-img img');
        if (!img) return;

        img.src = data.cardImg || data.fichaImg || img.getAttribute('src') || '';
        img.alt = data.name || img.getAttribute('alt') || 'Instrumento';
      });
    }

    syncCardImages();

    function setCardState(card, id, isActive) {
      var sign = card ? card.querySelector('.inst-sign') : null;
      if (sign) {
        sign.textContent = isActive ? '−' : '+';
        sign.setAttribute('aria-expanded', isActive ? 'true' : 'false');
      }
      card.classList.toggle('is-active', isActive);
      if (isActive) {
        card.setAttribute('data-active-id', id);
      } else {
        card.removeAttribute('data-active-id');
      }
    }

    function openFicha(id, card) {
      var data = instruments[id];
      if (!data || !ficha) return;

      /* Reset all cards */
      document.querySelectorAll('.inst-card').forEach(function (c) {
        setCardState(c, c.dataset.id, false);
      });

      /* Activate clicked card */
      setCardState(card, id, true);
      activeId = id;

      ficha.innerHTML =
        '<div class="ficha-inner">' +
          '<div class="ficha-img img-placeholder img-placeholder--dark">' +
            '<img src="' + (data.fichaImg || data.cardImg || '') + '" alt="' + data.name + '" loading="lazy">' +
          '</div>' +
          '<div class="ficha-content">' +
            '<button class="ficha-close" aria-label="Cerrar ficha">&#10005;</button>' +
            '<span class="ficha-label">Ficha técnica</span>' +
            '<h3 class="ficha-title">' + data.name + '</h3>' +
            '<dl class="ficha-fields">' +
              '<div class="ficha-row"><dt>Historia</dt><dd>a completar</dd></div>' +
              '<div class="ficha-row"><dt>Tipo de construcción</dt><dd>a completar</dd></div>' +
              '<div class="ficha-row"><dt>Maderas utilizadas</dt><dd>a completar</dd></div>' +
              '<div class="ficha-row"><dt>Tiempo estimado de fabricación</dt><dd>a completar</dd></div>' +
              '<div class="ficha-row"><dt>Nivel de complejidad</dt><dd>a completar</dd></div>' +
            '</dl>' +
          '</div>' +
        '</div>';

      ficha.classList.add('is-open');

      /* Close button */
      ficha.querySelector('.ficha-close').addEventListener('click', closeFicha);

      /* Smooth scroll to ficha */
      setTimeout(function () {
        ficha.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }

    function closeFicha() {
      ficha.classList.remove('is-open');
      ficha.innerHTML = '';
      document.querySelectorAll('.inst-card').forEach(function (c) {
        setCardState(c, c.dataset.id, false);
      });
      activeId = null;
    }

    function toggleFichaForCard(card, event) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      if (!card) return;

      var id = card.dataset.id;
      if (id === activeId) {
        closeFicha();
      } else {
        openFicha(id, card);
      }
    }

    document.querySelectorAll('.inst-card').forEach(function (card) {
      card.addEventListener('click', function (e) {
        if (e.target.closest('.inst-nav-btn') || e.target.closest('.inst-sign')) return;
        toggleFichaForCard(this, e);
      });

      var trigger = card.querySelector('.inst-sign');
      if (trigger) {
        trigger.addEventListener('pointerdown', function (e) {
          e.preventDefault();
          e.stopPropagation();
        });

        trigger.addEventListener('mousedown', function (e) {
          e.preventDefault();
          e.stopPropagation();
        });

        trigger.addEventListener('click', function (e) {
          toggleFichaForCard(card, e);
        });
      }
    });
  }

  /* ── Exact card fitting: only show complete cards, never a peek ── */

  /**
   * Measures the track width, calculates how many cards of at least minW
   * fit perfectly, then sets each card's flex-basis to an exact pixel value
   * so no partial card is ever visible.
   *
   * @param {string} trackId   - ID of the scroll track element.
   * @param {string} cardSel   - CSS selector for cards inside the track.
   * @param {number} gap       - Gap between cards in px (must match CSS).
   * @param {number} minW      - Minimum card width in px before count drops.
   * @param {number} [maxN]    - Optional cap on number of visible cards.
   */
  function fitCards(trackId, cardSel, gap, minW, maxN) {
    var track = document.getElementById(trackId);
    if (!track) return;
    var w = track.clientWidth;
    if (!w) return;

    /* How many cards of at least minW fit with their gaps? */
    var n = Math.max(1, Math.floor((w + gap) / (minW + gap)));
    if (maxN) n = Math.min(n, maxN);

    /* Divide remaining width equally — floor avoids fractional-px peek */
    var cardW = Math.floor((w - gap * (n - 1)) / n);

    track.querySelectorAll(cardSel).forEach(function (card) {
      card.style.flex = '0 0 ' + cardW + 'px';
    });

    /* Trigger progress bar recalculation via scroll event */
    requestAnimationFrame(function () {
      track.dispatchEvent(new Event('scroll'));
    });
  }

  /* ── Init ── */

  document.addEventListener('DOMContentLoaded', function () {
    /* Fit cards first so progress bars initialize with correct dimensions */
    var fitTimer;
    function fitAll() {
      fitCards('courses-track', '.course-card', 26, 260);
      fitCards('inst-track',    '.inst-card',   18, 260);
    }
    fitAll();

    /* Re-fit on resize (debounced 80 ms) */
    window.addEventListener('resize', function () {
      clearTimeout(fitTimer);
      fitTimer = setTimeout(fitAll, 80);
    }, { passive: true });

    initCarousel('courses-track', 'courses-progress-thumb', 'courses-progress', 'courses-pagination');
    initInstrumentCarousel();
  });

}());
