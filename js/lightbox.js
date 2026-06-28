/**
 * lightbox.js
 * Gallery lightbox — opens on "+" button click, closes on overlay or ✕.
 * Keyboard: Escape to close, ArrowLeft/ArrowRight to navigate.
 */

(function () {
  'use strict';

  var lightbox        = document.getElementById('lightbox');
  var lightboxImg     = document.getElementById('lightbox-img');
  var lightboxHolder  = document.getElementById('lightbox-placeholder');
  var closeBtn        = document.getElementById('lightbox-close');
  var overlay         = document.getElementById('lightbox-overlay');

  var items           = [];
  var currentIndex    = 0;

  function openLightbox(index) {
    currentIndex = index;
    var item = items[index];
    if (!item) return;

    var src = item.dataset.src || '';
    if (lightboxImg) {
      lightboxImg.src = src;
      lightboxImg.alt = item.querySelector('img') ? item.querySelector('img').alt : '';
    }

    if (lightbox) {
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (closeBtn) closeBtn.focus();
    }
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    document.body.style.overflow = '';
    if (lightboxImg) lightboxImg.src = '';
  }

  function navigate(dir) {
    var next = currentIndex + dir;
    if (next < 0) next = items.length - 1;
    if (next >= items.length) next = 0;
    openLightbox(next);
  }

  function init() {
    lightbox    = document.getElementById('lightbox');
    lightboxImg = document.getElementById('lightbox-img');
    closeBtn    = document.getElementById('lightbox-close');
    overlay     = document.getElementById('lightbox-overlay');

    if (!lightbox) return;

    /* Collect all gallery items */
    items = Array.from(document.querySelectorAll('.gallery-item'));

    /* Expand buttons */
    document.querySelectorAll('.gallery-expand').forEach(function (btn, i) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        openLightbox(i);
      });
    });

    /* Click on the item itself also opens lightbox */
    items.forEach(function (item, i) {
      item.querySelector('.gallery-img-wrap').addEventListener('click', function () {
        openLightbox(i);
      });
    });

    /* Close on overlay */
    if (overlay) overlay.addEventListener('click', closeLightbox);

    /* Close button */
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

    /* Keyboard navigation */
    document.addEventListener('keydown', function (e) {
      if (lightbox && !lightbox.hidden) {
        if (e.key === 'Escape')      closeLightbox();
        if (e.key === 'ArrowLeft')   navigate(-1);
        if (e.key === 'ArrowRight')  navigate(1);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', init);

}());
